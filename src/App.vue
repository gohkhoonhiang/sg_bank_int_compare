<template>
  <div id="app">
    <v-app v-cloak>
      <v-app-bar app>
        <v-toolbar-title>SG Bank Interests Compare<v-icon>mdi-bank-outline</v-icon></v-toolbar-title>
      </v-app-bar>

      <v-main>

        <v-container
          fluid
        >
          <calculator-form v-model="disclaimer"></calculator-form>

        </v-container>

        <v-dialog
          v-model="disclaimer"
          persistent
          scrollable
        >
          <v-card
            color="red"
          >
            <v-card-text
              class="pa-4"
            >
              <p><strong>Disclaimer:</strong> This site does not provide financial advice nor does it endorse any of the financial institutions referenced. The interests calculation is only an approximation and may not be 100% accurate. Please always refer to the official website for calculation. Comparison for reference only and should not be used as the sole reason for making certain financial decisions. The owner of this site shall not be responsible for any financial loss of its users.</p>
              <p>The interest rates are correct as of 2022-10-02.</p>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                text
                @click="disclaimer = false"
              >
                I understand
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-main>

      <v-footer
        app
        dark
        padless
        fixed
      >
        <v-card
          flat
          tile
          width="100%"
          class="pa-1 lighten-1 white--text text-center"
        >
          <v-card-subtitle
            class="yellow py-1 text-h7 black--text"
          >
            <v-icon
              x-small
              light
            >
              mdi-coffee-outline
            </v-icon>
            If you found this app useful, consider <a href="https://www.buymeacoffee.com/gohkhoonhiang" target="_blank">buying me a coffee</a> so I can continue to build more useful apps!
          </v-card-subtitle>

          <v-divider></v-divider>

          <v-card-subtitle
            class="teal py-1 text-h7"
          >
            <v-icon
              x-small
            >
              mdi-monitor
            </v-icon>
            This site is best viewed on screen size bigger than 800x600.
          </v-card-subtitle>

          <v-divider></v-divider>

          <v-card-text
            class="py-1 text-center white--text"
          >
            {{ new Date().getFullYear() }} — <strong>SG Bank Interests Compare</strong>
            <v-btn
              v-for="icon in icons"
              :key="icon.icon"
              class="ma-0 white--text"
              icon
              @click="openLink(icon.url)"
            >
              <v-tooltip
                right
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    size="20px"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ icon.icon }}
                  </v-icon>
                </template>
                <span>{{ icon.tooltip }}</span>
              </v-tooltip>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-footer>

    </v-app>
  </div>
</template>

<script>
import CalculatorForm from './components/CalculatorForm';

export default {
  name: 'App',

  components: {
    CalculatorForm
  },

  created() {
  },

  data: () => ({
    disclaimer: true,
    icons: [
      {
        icon: 'mdi-alert',
        tooltip: 'Report Issues',
        url: 'https://github.com/gohkhoonhiang/sg_bank_int_compare/issues'
      }
    ]
  }),

  computed: {
  },

  methods: {
    openLink: function(url) {
      window.open(url);
    }
  },

  watch: {
  },

};

</script>

<style>
  [v-cloak] > * { display:none }
  [v-cloak]::before {  /* source: https://gist.github.com/wellington1993/d842720aff297d0a27cc8fb8c1e3735f */
    content: " ";
    display: block;
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background:  url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjAiIHdpZHRoPSI2NHB4IiBoZWlnaHQ9IjY0cHgiIHZpZXdCb3g9IjAgMCAxMjggMTI4IiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCBkPSJNNzEgMzkuMlYuNGE2My42IDYzLjYgMCAwIDEgMzMuOTYgMTQuNTdMNzcuNjggNDIuMjRhMjUuNTMgMjUuNTMgMCAwIDAtNi43LTMuMDN6IiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTTcxIDM5LjJWLjRhNjMuNiA2My42IDAgMCAxIDMzLjk2IDE0LjU3TDc3LjY4IDQyLjI0YTI1LjUzIDI1LjUzIDAgMCAwLTYuNy0zLjAzeiIgZmlsbD0iI2UxZTFlMSIgdHJhbnNmb3JtPSJyb3RhdGUoNDUgNjQgNjQpIi8+PHBhdGggZD0iTTcxIDM5LjJWLjRhNjMuNiA2My42IDAgMCAxIDMzLjk2IDE0LjU3TDc3LjY4IDQyLjI0YTI1LjUzIDI1LjUzIDAgMCAwLTYuNy0zLjAzeiIgZmlsbD0iI2UxZTFlMSIgdHJhbnNmb3JtPSJyb3RhdGUoOTAgNjQgNjQpIi8+PHBhdGggZD0iTTcxIDM5LjJWLjRhNjMuNiA2My42IDAgMCAxIDMzLjk2IDE0LjU3TDc3LjY4IDQyLjI0YTI1LjUzIDI1LjUzIDAgMCAwLTYuNy0zLjAzeiIgZmlsbD0iI2UxZTFlMSIgdHJhbnNmb3JtPSJyb3RhdGUoMTM1IDY0IDY0KSIvPjxwYXRoIGQ9Ik03MSAzOS4yVi40YTYzLjYgNjMuNiAwIDAgMSAzMy45NiAxNC41N0w3Ny42OCA0Mi4yNGEyNS41MyAyNS41MyAwIDAgMC02LjctMy4wM3oiIGZpbGw9IiNiZWJlYmUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA2NCA2NCkiLz48cGF0aCBkPSJNNzEgMzkuMlYuNGE2My42IDYzLjYgMCAwIDEgMzMuOTYgMTQuNTdMNzcuNjggNDIuMjRhMjUuNTMgMjUuNTMgMCAwIDAtNi43LTMuMDN6IiBmaWxsPSIjOTc5Nzk3IiB0cmFuc2Zvcm09InJvdGF0ZSgyMjUgNjQgNjQpIi8+PHBhdGggZD0iTTcxIDM5LjJWLjRhNjMuNiA2My42IDAgMCAxIDMzLjk2IDE0LjU3TDc3LjY4IDQyLjI0YTI1LjUzIDI1LjUzIDAgMCAwLTYuNy0zLjAzeiIgZmlsbD0iIzZlNmU2ZSIgdHJhbnNmb3JtPSJyb3RhdGUoMjcwIDY0IDY0KSIvPjxwYXRoIGQ9Ik03MSAzOS4yVi40YTYzLjYgNjMuNiAwIDAgMSAzMy45NiAxNC41N0w3Ny42OCA0Mi4yNGEyNS41MyAyNS41MyAwIDAgMC02LjctMy4wM3oiIGZpbGw9IiMzYzNjM2MiIHRyYW5zZm9ybT0icm90YXRlKDMxNSA2NCA2NCkiLz48YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgdmFsdWVzPSIwIDY0IDY0OzQ1IDY0IDY0OzkwIDY0IDY0OzEzNSA2NCA2NDsxODAgNjQgNjQ7MjI1IDY0IDY0OzI3MCA2NCA2NDszMTUgNjQgNjQiIGNhbGNNb2RlPSJkaXNjcmV0ZSIgZHVyPSI3MjBtcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZVRyYW5zZm9ybT48L2c+PGc+PGNpcmNsZSBmaWxsPSIjMDAwIiBjeD0iNjMuNjYiIGN5PSI2My4xNiIgcj0iMTIiLz48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiBkdXI9IjcyMG1zIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBrZXlUaW1lcz0iMDswLjU7MSIgdmFsdWVzPSIxOzA7MSIvPjwvZz48L3N2Zz4=') 50% 50% no-repeat rgb(249,249,249);
  }

  .v-application--is-ltr .v-data-table__mobile-row__cell {
    max-width: 50% !important;
  }
</style>
