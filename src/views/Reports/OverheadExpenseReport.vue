<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Overhead Expense Report</h4>
          </template>
          <template v-slot:body>
            <b-row class="mb-4">
              <b-col md="5">
                <b-form>
                  <b-form-group label-cols-sm="3"
                    label="From:"
                    label-for="fromDate">
                    <b-form-input id="fromDate" type="date" v-model="fromDate"  :value="fromDate"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols-sm="3"
                    label="To:"
                    label-for="toDate">
                    <b-form-input id="toDate" type="date" v-model="toDate"  :value="toDate"></b-form-input>
                  </b-form-group>
                </b-form>
                  <b-button @click="fetchOverheadExpenseReport()" variant="primary">Generate Report</b-button>
                  <b-button type="button" variant="none" class="iq-bg-danger ml-3">Clear Filter</b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12" v-show="showTable">
                <b-table
                  striped
                  hover
                  outlined
                  :fields="fields"
                  :items="items"
                  :filter="filter"
                >
                  <template v-slot:cell(expense_type)="{ item }">
                    {{ item.expense_type.name }}
                  </template>
                </b-table>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-row v-show="showTable">
      <b-col lg="4">
        <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
          <template v-slot:headerTitle>
            <h4 class="card-title">Total Expenses</h4>
          </template>
          <template v-slot:body>
            <div class="total-expenses-amount">
              <span class="fa fa-money-bill text-center"> {{ totalOverheadExpenses }}</span>
            </div>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import reports from '../../services/reports'
import moment from 'moment'

export default {
  name: 'OverheadExpenseReport',
  mounted () {
    xray.index()
  },
  data () {
    return {
      filter: '',
      fields: [
        { label: 'Date', key: 'expense_date', headerClass: 'text-left', sortable: true },
        { label: 'Expense Type', key: 'expense_type', headerClass: 'text-left', sortable: true },
        { label: 'Description', key: 'description', headerClass: 'text-left', sortable: true },
        { label: 'Amount', key: 'amount', headerClass: 'text-left', sortable: true }
      ],
      items: [],
      results: [],
      showTable: false,
      fromDate: moment(new Date()).format('YYYY-MM-DD'),
      toDate: moment(new Date()).format('YYYY-MM-DD')
    }
  },
  watch: {
    items (value) {
      if (value.length > 0) {
        this.showTable = true
      } else {
        this.showTable = false
      }
    }
  },
  computed: {
    totalOverheadExpenses () {
      const sum = this.items.reduce((accumulator, object) => {
        return accumulator + object.amount
      }, 0)
      return sum
    },
    totalNetIncome () {
      return this.totalIncome - this.totalExpenses
    }
  },
  methods: {
    async fetchOverheadExpenseReport () {
      if (this.fromDate > this.toDate) {
        this.$swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'From date must be less than or equal to To Date'
        })
        return false
      }

      const data = {
        'from': this.fromDate,
        'to': this.toDate
      }

      reports.overheadExpenseReport(data).then(response => {
        if (response.data.success) {
          this.items = response.data.data
        }
      }).catch(err => console.log(err))
    }
  }
}
</script>

<style scoped>
.total-expenses-amount {
  text-align: center;
  font-size: 46px;
}

</style>
