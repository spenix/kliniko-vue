<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Daily Income Reports</h4>
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
                  <b-button @click="fetchDailyActivityReport()" variant="primary">Generate Report</b-button>
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
                <template v-slot:cell(is_other)="{ item }">
                  <b-badge variant="light" v-show="item.is_other == 'N'">NO</b-badge>
                  <b-badge variant="success" v-show="item.is_other == 'Y'">YES</b-badge>
                </template>
                <template v-slot:cell(is_comm_based)="{ item }">
                  <b-badge variant="light" v-show="item.is_comm_based == 'N'">NO</b-badge>
                  <b-badge variant="success" v-show="item.is_comm_based == 'Y'">YES</b-badge>
                </template>
                </b-table>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Expenses</h4>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col md="12" v-show="showTable">
                <b-table
                  striped
                  hover
                  outlined
                  :fields="expenseFields"
                  :items="expenses"
                  :filter="filter"
                >
                  <template v-slot:cell(expense_date)="{ item }">
                    {{ moment(item.expense_date).format('LL') }}
                  </template>
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
    <b-row>
      <b-col lg="4" v-show="showTable">
        <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
          <template v-slot:headerTitle>
            <h4 class="card-title">Payment Breakdown</h4>
          </template>
          <template v-slot:body>
            <div class="table-responsive mt-2">
              <table class="table mb-0 table-borderless">
                <tbody>
                  <tr v-for="paymentBreakdown in totalPaymentBreakdown" :key="paymentBreakdown.payment_type">
                    <td>
                      <div class="iq-profile-avatar status-online mt-4"> </div>
                    </td>
                    <td>
                      <h4>{{ paymentBreakdown.payment_type }}</h4>
                    </td>
                    <td><span class="text-muted">{{ paymentBreakdown.amount }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </iq-card>
      </b-col>
      <b-col lg="4" v-show="showTable">
        <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
          <template v-slot:headerTitle>
            <h4 class="card-title">Total Expenses</h4>
          </template>
          <template v-slot:body>
            <div class="total-expenses-amount">
              <span class="fa fa-money-bill text-center"> {{ totalExpenses }}</span>
            </div>
          </template>
        </iq-card>
      </b-col>
      <b-col lg="4" v-show="showTable">
        <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
          <template v-slot:headerTitle>
            <h4 class="card-title">Totals</h4>
          </template>
          <template v-slot:body>
            <div class="table-responsive mt-2">
              <table class="table mb-0 table-borderless">
                <tbody>
                  <tr >
                    <td>
                      <div class="iq-profile-avatar status-online mt-4"> </div>
                    </td>
                    <td>
                      <h4>Gross Income</h4>
                    </td>
                    <td>{{ totalIncome }}</td>
                  </tr>
                  <tr >
                    <td>
                      <div class="iq-profile-avatar status-online mt-4"> </div>
                    </td>
                    <td>
                      <h4>Net Income</h4>
                    </td>
                    <td>{{ totalNetIncome }}</td>
                  </tr>
                </tbody>
              </table>
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
import { mapGetters } from 'vuex'

export default {
  name: 'DailyActivityReport',
  mounted () {
    xray.index()
  },
  data () {
    return {
      filter: '',
      fields: [
        { label: 'Control No.', key: 'control_no', headerClass: 'text-left', sortable: true },
        { label: 'Patient Name', key: 'patient_name', headerClass: 'text-left', sortable: true },
        { label: 'Treatment', key: 'treatment', headerClass: 'text-left', sortable: true },
        { label: 'Doctor', key: 'doctor', headerClass: 'text-left', sortable: true },
        { label: 'Commission', key: 'commission', headerClass: 'text-left', sortable: true }
      ],
      expenseFields: [
        { label: 'Date', key: 'expense_date', headerClass: 'text-left' },
        { label: 'Expense Type', key: 'expense_type', headerClass: 'text-left' },
        { label: 'Particular', key: 'particular', headerClass: 'text-left' },
        { label: 'Description', key: 'description', headerClass: 'text-left' },
        { label: 'Amount', key: 'amount', headerClass: 'text-left' }
      ],
      items: [],
      results: [],
      showCommissionRate: false,
      showTable: false,
      fromDate: moment(new Date()).format('YYYY-MM-DD'),
      toDate: moment(new Date()).format('YYYY-MM-DD'),
      totalPaymentBreakdown: [],
      totalOverheadExpenses: 0,
      expenses: [],
      moment: moment
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
    totalIncome () {
      const sum = this.totalPaymentBreakdown.reduce((accumulator, object) => {
        return accumulator + object.amount
      }, 0)
      return sum
    },
    totalExpenses () {
      const sum = this.expenses.reduce((accumulator, object) => {
        return accumulator + object.amount
      }, 0)
      return sum
    },
    totalNetIncome () {
      return this.totalIncome - this.totalExpenses
    },
    ...mapGetters({
        userActiveBranch: 'Auth/userActiveBranch',
        userDetails: 'Auth/userDetails'
    })
  },
  methods: {
    async fetchDailyActivityReport () {
      if (this.fromDate > this.toDate) {
        this.$swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'From date must be less than or equal to To Date'
        })
        return false
      }

      let data = {
        'from': this.fromDate,
        'to': this.toDate
      }

      if (!(['RC', 'DA']).includes(this.userDetails.role)) {
        data = { ...data, branchId: this.userActiveBranch?.id }
      }
      reports.dailyActivityReport(data).then(response => {
        if (response.data.success) {
          this.results = response.data.data
          this.processData()
        }
      }).catch(err => console.log(err))
    },
    processData () {
      this.results.payment_types.forEach(pt => {
        this.fields.push({ label: pt.name, key: 'payment_' + pt.id, headerClass: 'text-left', sortable: true })
      })

      this.items = this.results.generated_data
      this.totalPaymentBreakdown = this.results.total_payment_breakdown
      this.totalOverheadExpenses = this.results.total_overhead_expenses
      this.expenses = this.results.expenses
    }
  }
}
</script>

<style scoped>
.total-expenses-amount {
  text-align: center;
  font-size: 46px;
}

.total-expenses-amount-overhead {
  text-align: center;
}
</style>
