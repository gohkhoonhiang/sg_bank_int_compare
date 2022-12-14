<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <v-card
      class="mx-auto pa-4 mb-4"
    >
      <v-card-subtitle
      >
        <v-icon
          slot="icon"
          small
        >
          mdi-calculator
        </v-icon>
        Input the amount for each category to calculate the potential interests earned on your account.
      </v-card-subtitle>

      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        :disabled="disabled"
      >

        <v-alert
          v-if="alert"
          color="red lighten-2"
          dark
        >
          {{ alert }}
        </v-alert>

        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="12"
            >

              <v-chip-group
                column
                mandatory
                multiple
                v-model="form_data.banks_to_compare"
              >

                <v-chip
                  v-for="bank in requirements"
                  :key="bank.id"
                  :value="bank.id"
                  class="mx-2"
                  filter
                >
                  {{ bank.name }}
                </v-chip>

              </v-chip-group>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="form_data.starting_balance"
                label="Starting Balance"
                type="number"
                :rules="rules.starting_balance"
                @keydown="validateNumericField"
                prefix="S$"
                hint="This will be used to estimate the monthly interests"
                persistent-hint
                clearable
              >
              </v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="form_data.salary.amount"
                label="Salary"
                type="number"
                :rules="rules.salary"
                @keydown="validateNumericField"
                prefix="S$"
                hint="Monthly salary credit via GIRO"
                persistent-hint
                clearable
              >
              </v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="form_data.save.amount"
                label="Save"
                type="number"
                :rules="rules.save"
                @keydown="validateNumericField"
                prefix="S$"
                hint="Monthly increment in account balance"
                persistent-hint
                clearable
              >
              </v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="form_data.spend.amount"
                label="Spend"
                type="number"
                :rules="rules.spend"
                @keydown="validateNumericField"
                prefix="S$"
                hint="Monthly credit card spend"
                persistent-hint
                clearable
              >
              </v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="form_data.insure.amount"
                label="Insure"
                type="number"
                :rules="rules.insure"
                @keydown="validateNumericField"
                prefix="S$"
                hint="Eg. Regular premium insurance purchase"
                persistent-hint
                clearable
              >
              </v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="form_data.loan.amount"
                label="Loan"
                type="number"
                :rules="rules.loan"
                @keydown="validateNumericField"
                prefix="S$"
                hint="Monthly loan installment payment eg. for home loans"
                persistent-hint
                clearable
              >
              </v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <v-row>
                <v-col
                  cols="12"
                  md="12"
                >
                  <v-btn
                    class="ma-1"
                    @click="addBill"
                  >
                    Add Bill
                  </v-btn>
                </v-col>
              </v-row>

              <v-row>
                <v-col
                  cols="12"
                  md="12"
                >
                  <v-row
                    v-for="(bill, index) in bills_data"
                    :key="index"
                  >
                    <v-col
                      cols="12"
                      md="12"
                    >
                      <v-text-field
                        v-model="bill.amount"
                        label="Bills"
                        type="number"
                        :rules="rules.bills"
                        @keydown="validateNumericField"
                        prefix="S$"
                        :hint="`Amount for bill ${index + 1}`"
                        persistent-hint
                        clearable
                        append-outer-icon="mdi-delete"
                        @click:append-outer="removeBill(bill)"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>

                </v-col>
              </v-row>
            </v-col>

            <v-col
              cols="12"
              md="4"
            >
              <v-row>
                <v-col
                  cols="12"
                  md="12"
                >
                  <v-btn
                    class="ma-1"
                    @click="addInvest"
                  >
                    Add Investment
                  </v-btn>
                </v-col>
              </v-row>

              <v-row>
                <v-col
                  cols="12"
                  md="12"
                >
                  <v-row
                    v-for="(investment, index) in invests_data"
                    :key="index"
                  >
                    <v-col
                      cols="12"
                      md="12"
                    >
                      <v-text-field
                        v-model="investment.amount"
                        label="Investments"
                        type="number"
                        :rules="rules.invests"
                        @keydown="validateNumericField"
                        prefix="S$"
                        :hint="`Amount for investment ${index + 1}`"
                        persistent-hint
                        clearable
                        append-outer-icon="mdi-delete"
                        @click:append-outer="removeInvest(investment)"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>

                </v-col>
              </v-row>
            </v-col>

          </v-row>

        </v-container>

        <v-btn
          :disabled="disabled"
          class="ma-1"
          @click="calculate"
        >
          Calculate
        </v-btn>

        <v-btn
          :disabled="disabled"
          class="ma-1"
          @click="reset"
        >
          Reset
        </v-btn>
      </v-form>
    </v-card>

    <v-alert
      text
      type="success"
      v-if="calculation.results.length > 0"
    >
      <p>Base on your input, {{ calculation.best_account.name }} gives you the highest monthly interests of S${{ parseFloat(calculation.best_account.total_monthly_interest_amount.toFixed(2)).toLocaleString() }}.</p>
      <p>Compare the interests breakdown below.</p>
    </v-alert>

    <v-tabs
      v-model="result_tab"
      v-if="calculation.results.length > 0"
      show-arrows
    >
      <v-tab
        v-for="result in calculation.results"
        :key="result.id"
      >
        {{ result.name }} - S${{ parseFloat(result.total_monthly_interest_amount.toFixed(2)).toLocaleString() }}
        <v-icon
          v-if="result.id === calculation.best_account.id"
        >
          mdi-crown
        </v-icon>
      </v-tab>

      <v-tab-item
        v-for="result in calculation.results"
        :key="result.id"
      >

        <v-card
          flat
        >
          <v-card-text>
            <v-data-table
              :headers="calculation.headers"
              :items="result.interests"
              hide-default-footer
              dense
              class="elevation-1"
            >

              <template v-slot:header.eligible_amount="{ header }">
                {{ header.text }}
                <v-tooltip
                  top
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      dark
                      small
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-help-circle-outline
                    </v-icon>
                  </template>

                  <span>You qualify for interests after meeting the eligible amount for this category.</span>
                </v-tooltip>
              </template>

              <template v-slot:item.category="{ item }">
                {{ item.category }}
                <v-tooltip
                  top
                  v-if="item.description"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      dark
                      small
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-help-circle-outline
                    </v-icon>
                  </template>

                  <span>{{ item.description }}</span>
                </v-tooltip>
              </template>

              <template v-slot:item.eligible_amount="{ item }">
                S${{ parseFloat(item.eligible_amount.toFixed(2)).toLocaleString() }}
              </template>

              <template v-slot:item.monthly_interest_amount="{ item }">
                S${{ parseFloat(item.monthly_interest_amount.toFixed(2)).toLocaleString() }}
              </template>

              <template v-slot:item.interests="{ item }">
                <v-card
                  flat
                >
                  <v-card-text>
                    <v-data-table
                      :headers="calculation.interests_headers"
                      :items="item.interests"
                      no-data-text="Interests not applicable"
                      hide-default-header
                      hide-default-footer
                      dense
                      class="elevation-0"
                    >

                      <template v-slot:item.balance="{ item }">
                        S${{ parseFloat(item.min_balance.toFixed(2)).toLocaleString() }} - S${{ parseFloat(item.max_balance.toFixed(2)).toLocaleString() }}
                      </template>

                      <template v-slot:item.rate_pa="{ item }">
                        {{ item.rate_pa.toFixed(2) }} p.a.
                      </template>

                      <template v-slot:item.monthly_interest_amount="{ item }">
                        S${{ parseFloat(item.monthly_interest_amount.toFixed(2)).toLocaleString() }}
                      </template>

                    </v-data-table>
                  </v-card-text>
                </v-card>

              </template>

            </v-data-table>
          </v-card-text>
        </v-card>

      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import calculator from '../scripts/calculator';

const axios = require('axios').default;

const DATA_SOURCES = [
  'https://raw.githubusercontent.com/gohkhoonhiang/sg_bank_int_compare/30b8d5fb057c15f639b8a9921fb57efac729edc7/src/data/ocbc_360.json',
  'https://raw.githubusercontent.com/gohkhoonhiang/sg_bank_int_compare/f271030fe25c980d7e89367f46288dc9556367e4/src/data/dbs_multiplier.json',
  'https://raw.githubusercontent.com/gohkhoonhiang/sg_bank_int_compare/b425117e0a73377de70cce9e90fc7c3d2269a236/src/data/uob_one.json',
  'https://raw.githubusercontent.com/gohkhoonhiang/sg_bank_int_compare/a3f1971da6fe7952fac9f2855569201fe9c6fa97/src/data/cimb_fast_saver.json',
  'https://raw.githubusercontent.com/gohkhoonhiang/sg_bank_int_compare/cc4f71fa568560cd47796dfb6c46d66a557490fd/src/data/sc_bonus_saver.json',
  'https://raw.githubusercontent.com/gohkhoonhiang/sg_bank_int_compare/123777dd45f53bfb15eb9e6ed1a9c075e2f68dc9/src/data/maybank_saveup.json',
  'https://raw.githubusercontent.com/gohkhoonhiang/sg_bank_int_compare/617f0c72b6b986f9af818726ffcc4d596c9f87db/src/data/citi_plus.json'
];

export default {
  name: 'CalculatorForm',

  model: {
    prop: 'disabled',
    event: 'input'
  },

  props: {
    disabled: {
      default: false
    }
  },

  mixins: [
    calculator
  ],

  data: () => ({
    alert: null,
    valid: true,
    result_tab: null,

    requirements: [],

    rules: {
      starting_balance: [
        v => (!!v || 'Starting Balance is required'),
        v => (parseFloat(v) >= 0 || 'Starting Balance cannot be negative')
      ],
      salary: [
        v => (!v || parseFloat(v) >= 0 || 'Salary Amount cannot be negative')
      ],
      save: [
        v => (!v || parseFloat(v) >= 0 || 'Save Amount cannot be negative')
      ],
      spend: [
        v => (!v || parseFloat(v) >= 0 || 'Spend Amount cannot be negative')
      ],
      insure: [
        v => (!v || parseFloat(v) >= 0 || 'Insure Amount cannot be negative')
      ],
      invest: [
        v => (!v || parseFloat(v) >= 0 || 'Invest Amount cannot be negative')
      ],
      loan: [
        v => (!v || parseFloat(v) >= 0 || 'Loan Amount cannot be negative')
      ],
      bills: [
        v => (!v || parseFloat(v) >= 0 || 'Bills Amount/Count cannot be negative')
      ]
    },

    calculation: {
      message: null,
      best_account: {
        id: null,
        name: null,
        total_monthly_interest_amount: 0
      },
      headers: [
        { text: 'Category', value: 'category', sortable: false, width: 50, align: 'start' },
        { text: 'Eligible Amount', value: 'eligible_amount', sortable: false, width: 80, align: 'start' },
        { text: 'Monthly Interest Amount', value: 'monthly_interest_amount', sortable: false, width: 80, align: 'start' },
        { text: 'Breakdown', value: 'interests', sortable: false }
      ],
      interests_headers: [
        { text: 'Balance', value: 'balance', sortable: false, width: 200, align: 'start' },
        { text: 'Interest p.a.', value: 'rate_pa', sortable: false, width: 80, align: 'start' },
        { text: 'Monthly Interest Amount', value: 'monthly_interest_amount', sortable: false, width: 80, align: 'start' }
      ],
      results: []
    },

    error_messages: {
      starting_balance: null,
      salary: null,
      save: null,
      spend: null,
      insure: null,
      invest: null,
      grow: null,
      loan: null,
      bills: null
    },

    bills_data: [],
    bills_counter: 0,

    invests_data: [],
    invests_counter: 0,

    form_data: {
      banks_to_compare: [],
      starting_balance: null,
      salary: {
        amount: null,
        count: null
      },
      save: {
        amount: null,
        count: null
      },
      bills: {
        amount: null,
        count: null
      },
      spend: {
        amount: null,
        count: null
      },
      insure: {
        amount: null,
        count: null
      },
      invest: {
        amount: null,
        count: null
      },
      grow: {
        amount: null,
        count: null
      },
      loan: {
        amount: null,
        count: null
      }
    }
  }),

  computed: {
  },

  mounted: function() {
    this.reset();
    this.getRequirementsData();
  },

  methods: {
    getRequirementsData: function() {
      let vm = this;

      DATA_SOURCES.forEach(source => {
        axios.get(source)
          .then(function (response) {
            vm.requirements.push(response.data);
            vm.form_data.banks_to_compare = vm.requirements.map(bank => bank.id);
          })
          .catch(function (error) {
            vm.alert = error;
          });
      })
    },

    addBill: function() {
      let vm = this;

      vm.bills_counter = vm.bills_counter + 1;
      vm.bills_data.push({
        id: `bill-${vm.bills_counter}`,
        amount: null
      });
    },

    removeBill: function(bill) {
      let vm = this;

      let index = vm.bills_data.findIndex(b => {
        return b.id === bill.id;
      });

      vm.bills_data.splice(index, 1);
    },

    addInvest: function() {
      let vm = this;

      vm.invests_counter = vm.invests_counter + 1;
      vm.invests_data.push({
        id: `invest-${vm.invests_counter}`,
        amount: null
      });
    },

    removeInvest: function(invest) {
      let vm = this;

      let index = vm.invests_data.findIndex(b => {
        return b.id === invest.id;
      });

      vm.invests_data.splice(index, 1);
    },

    formatFormData: function() {
      let vm = this;

      let starting_balance = parseFloat(vm.form_data.starting_balance);
      let banks_to_compare = vm.form_data.banks_to_compare;

      let bonus_data = {
        salary: [{
          amount: vm.form_data.salary.amount
        }],
        save: [{
          amount: vm.form_data.save.amount
        }],
        bills: vm.bills_data.map(bill => {
          return {
            amount: bill.amount
          }
        }),
        spend: [{
          amount: vm.form_data.spend.amount
        }],
        insure: [{
          amount: vm.form_data.insure.amount
        }],
        invest: vm.invests_data.map(invest => {
          return {
            amount: invest.amount
          }
        }),
        grow: [{
          amount: starting_balance
        }],
        loan: [{
          amount: vm.form_data.loan.amount
        }],
      };

      return {
        banks_to_compare: banks_to_compare,
        starting_balance: starting_balance,
        bonus_data: bonus_data
      };
    },

    validateNumericField: function(event) {
      if (event.key === 'Backspace' || event.key === 'Tab') { return; }
      if (isNaN(event.key)) {
        event.preventDefault();
      }
    },

    calculate: function() {
      let vm = this;

      vm.calculation.results = [];
      vm.calculation.best_account = {
        id: null,
        name: null,
        total_monthly_interest_amount: 0
      };

      vm.valid = vm.$refs.form.validate();

      if (!vm.valid) { return; }

      let form_data = vm.formatFormData();
      let banks_to_compare = form_data.banks_to_compare;
      let starting_balance = form_data.starting_balance;
      let bonus_data = form_data.bonus_data;

      vm.calculation.results = banks_to_compare.map(bank => {
        let requirement = vm.requirements.find(r => r.id === bank);
        return vm.calculate_bank_total_interests(requirement, starting_balance, bonus_data);
      });

      vm.calculation.best_account = vm.highest_interests_bank(vm.calculation.results);
    },

    reset: function() {
      let vm = this;
      vm.$refs.form.resetValidation();

      vm.calculation.results = [];
      vm.calculation.best_account = {
        id: null,
        name: null,
        total_monthly_interest_amount: 0
      };
      vm.result_tab = null;

      vm.error_messages = {
        starting_balance: null,
        salary: null,
        save: null,
        spend: null,
        insure: null,
        invest: null,
        grow: null,
        loan: null,
        bills: null
      };

      vm.bills_data = [];
      vm.bills_counter = 0;
      vm.invests_data = [];
      vm.invests_counter = 0;

      vm.form_data = {
        banks_to_compare: vm.requirements.map(bank => bank.id),
        starting_balance: null,
        salary: {
          amount: null,
          count: null
        },
        save: {
          amount: null,
          count: null
        },
        bills: {
          amount: null,
          count: null
        },
        spend: {
          amount: null,
          count: null
        },
        insure: {
          amount: null,
          count: null
        },
        invest: {
          amount: null,
          count: null
        },
        grow: {
          amount: null,
          count: null
        },
        loan: {
          amount: null,
          count: null
        }
      }
    }
  },

  watch: {
  }
}
</script>

<style lang="scss">
tbody {
  tr:hover {
    background-color: transparent !important;
  }
}
</style>
