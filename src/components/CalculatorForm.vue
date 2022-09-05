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
                v-model="form_data.invest.amount"
                label="Invest"
                type="number"
                :rules="rules.invest"
                @keydown="validateNumericField"
                prefix="S$"
                hint="Eg. Unit trust investment, equities trade online"
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
              <v-text-field
                v-model="form_data.bills.count"
                label="Bills"
                type="number"
                :rules="rules.bills"
                @keydown="validateNumericField"
                prefix="#"
                hint="Number of recurring bills via GIRO"
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
                v-model="form_data.bills.amount"
                label="Bills"
                type="number"
                :rules="rules.bills"
                @keydown="validateNumericField"
                prefix="S$"
                hint="Amount for each recurring bill via GIRO"
                persistent-hint
                clearable
              >
              </v-text-field>
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
                  right
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
                  right
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
  'https://raw.githubusercontent.com/gohkhoonhiang/sg_bank_int_compare/59947ffccb2df3985bb44f091d56cd83807dbcd4/src/data/ocbc_360.json',
  'https://raw.githubusercontent.com/gohkhoonhiang/sg_bank_int_compare/dd3464f5b1fbb2683f525ea4b84dc64d3037dd56/src/data/dbs_multiplier.json',
  'https://raw.githubusercontent.com/gohkhoonhiang/sg_bank_int_compare/855de831360070f0a744d1fa966c93f495fd5615/src/data/uob_one.json',
  'https://raw.githubusercontent.com/gohkhoonhiang/sg_bank_int_compare/fba0bd77471311c1fa46254fc56e97519280f7bc/src/data/cimb_fast_saver.json',
  'https://raw.githubusercontent.com/gohkhoonhiang/sg_bank_int_compare/f985a93a489beff78a2c2cfb9c0e736ded4b9c78/src/data/sc_bonus_saver.json',
  'https://raw.githubusercontent.com/gohkhoonhiang/sg_bank_int_compare/6d0bf4fc4f62631ad4db3f36cd67b020e52cbfc8/src/data/maybank_saveup.json'
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

    form_data: {
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
          })
          .catch(function (error) {
            vm.alert = error;
          });
      })
    },

    formatFormData: function(data) {
      let starting_balance = parseFloat(data.starting_balance);
      let bonus_data = Object.assign({}, data, {
        grow: {
          amount: starting_balance,
          count: null
        }
      });
      delete bonus_data.starting_balance;

      return {
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

      let form_data = vm.formatFormData(vm.form_data);
      let starting_balance = form_data.starting_balance;
      let bonus_data = form_data.bonus_data;

      vm.calculation.results = vm.requirements.map(bank => {
        return vm.calculate_bank_total_interests(bank, starting_balance, bonus_data);
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

      vm.form_data = {
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
