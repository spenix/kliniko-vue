<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Commission Report</h4>
          </template>
          <template v-slot:body>
            <b-row class="mb-4">
              <b-col md="5">
                <b-form>
                  <b-form-group label-cols-sm="3"
                        label="Dentist"
                        label-for="selectdoctor">
                    <b-form-select v-model="doctor"  plain :options="doctors" id="selectdoctor">
                      <template v-slot:first>
                        <b-form-select-option :value="null">Select Dentist</b-form-select-option>
                      </template>
                    </b-form-select>
                  </b-form-group>
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
                  <b-button @click="fetchCommissionReport()" variant="primary">Generate Report</b-button>
                  <b-button type="button" variant="none" class="iq-bg-danger ml-3" @click="clearFilters()">Clear Filter</b-button>
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
                  <template #cell(id)="row">
                      <b-form-checkbox v-model="row.detailsShowing" @change="row.toggleDetails" title="Show Details"></b-form-checkbox>
                  </template>
                  <template v-slot:cell(doctor)="{ item }">
                    {{ item.doctor.first_name }} {{ item.doctor.last_name }}
                  </template>
                  <template v-slot:cell(action)="{ item }">
                    <b-button @click="generateCommissionReport(item)" title="Print Commission Report" variant="primary"><i class="fa fa-print">Print</i></b-button>
                  </template>
                  <template #row-details="row">
                      <table class="table table-sm table-striped border">
                        <thead>
                          <tr>
                            <th>Control No.</th>
                            <th>Patient</th>
                            <th>Commission</th>
                            <th>Additional Commission</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(d, i) in row.item.subDetails" :key="`row-${row.item.date}-${i}`">
                            <td width="15%">{{ d?.control_no }}</td>
                            <td>{{ d?.patient_name }}</td>
                            <td width="15%" class="text-right">{{ d?.total_commission }}</td>
                            <td width="20%" class="text-right">{{ d?.additional_commission }}</td>
                            <td width="15%" class="text-right">{{ d?.total_commission + d?.additional_commission }}</td>
                          </tr>
                        </tbody>
                      </table>
                  </template>
                </b-table>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal id="commission-report-modal" size="xl" ok-title="Print" @ok.prevent="printCommissionReport()" title="Commission Report ">
        <div class="row" ref="divCommissionReport">
          <div class="col-12">
            <table class="table table-sm table-bordered commission-tbl">
              <thead>
                <tr>
                  <th colspan="5" class="f-w-700 text-center">DENTIST RECORD OF PATIENT</th>
                </tr>
                <tr>
                  <th class="text-center" width="5%">No.</th>
                  <th class="text-center">PATIENT'S NAME</th>
                  <th class="text-center">TREATMENT</th>
                  <th class="text-center">AMOUNT</th>
                  <th class="text-center">COMMISSION</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(d, i) in commissionRec.patientList" :key="`act-${i}`" >
                  <td>{{ d?.ctn+'.' }}</td>
                  <td>{{ d?.isNewLine ? '' : d?.patientName }}</td>
                  <td>{{ d?.treatment }}</td>
                  <td class="text-right mx-2">{{ d?.isNewLine ? '' : (d?.amt ? parseFloat(d?.amt).toFixed(2) : '') }}</td>
                  <td class="text-right mx-2">{{ d?.isNewLine ? '' : (d?.comAmt ? parseFloat(d?.comAmt).toFixed(2) : '') }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="fw-bold text-center"><strong>GRAND TOTAL</strong></td>
                  <td class="text-right">{{ parseFloat(commissionRec?.grandTotal).toFixed(2) }}</td>
                  <td class="text-right">{{ parseFloat(commissionRec?.commission).toFixed(2) }}</td>
                </tr>
                <tr>
                  <td colspan="3"><strong>DENTIST NAME:</strong> {{ commissionRec.dentistName }}</td>
                  <td colspan="2"><strong>DATE: {{ commissionRec.date }}</strong></td>
                </tr>
                <tr>
                  <td colspan="5"><strong>DAILY RATE:</strong></td>
                </tr>
                <tr>
                  <td colspan="5"><strong>COMMISSION:</strong> {{ parseFloat(commissionRec?.commission).toFixed(2) }}</td>
                </tr>
                <tr>
                  <td colspan="5"><strong>MEAL ALLOWANCE:</strong></td>
                </tr>
                <tr>
                  <td colspan="5"><strong>HAZARD PAY:</strong></td>
                </tr>
                <tr>
                  <td colspan="5"><strong>OVER TIME:</strong></td>
                </tr>
                <tr>
                  <td colspan="5"><strong>LATE:</strong></td>
                </tr>
                <tr>
                  <td colspan="5"><strong>OTHER:</strong></td>
                </tr>
                <tr>
                  <td colspan="5"><strong>GRAND TOTAL:</strong></td>
                </tr>
                <tr>
                  <td colspan="3"><strong>PREPARED BY:</strong></td>
                  <td colspan="2"><strong>RECEIVED BY:</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
    </b-modal>
  </b-container>
</template>
<style>
  .commission-tbl {
    font-size: 12px;
    padding: 0 !important;
  }
  .commission-tbl tr td {
    padding: 0 6px !important;
  }
</style>
<script>
import { xray } from '../../config/pluginInit'
import reports from '../../services/reports'
import doctor from '../../services/doctor'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import moment from 'moment'
import html2pdf from 'html2pdf.js'

export default {
  name: 'CommissionReport',
  mounted () {
    xray.index()
    this.fetchDoctorList()
  },
  data () {
    return {
      filter: '',
      fields: [
        { label: '', key: 'id', headerClass: 'text-left', sortable: false },
        { label: 'Date', key: 'date', headerClass: 'text-left', sortable: false },
        { label: 'Dentist', key: 'dentist', headerClass: 'text-left', sortable: false },
        { label: 'Commission', key: 'commission', headerClass: 'text-left', sortable: false },
        { label: 'Additionl Commission', key: 'additionalCom', headerClass: 'text-left', sortable: false },
        { label: 'Total Commission', key: 'totalCommission', headerClass: 'text-left', sortable: false },
        { label: 'Action', key: 'action', headerClass: 'text-center', sortable: false }
      ],
      items: [],
      results: [],
      showTable: false,
      doctors: [],
      doctor: null,
      fromDate: moment(new Date()).format('YYYY-MM-DD'),
      toDate: moment(new Date()).format('YYYY-MM-DD'),
      commissionRec: {
        patientList: [],
        dentistName: '',
        dailyRate: '',
        commission: '',
        mealAllowance: '',
        hazardPay: '',
        overTime: '',
        late: '',
        other: '',
        grandTotal: '',
        date: '',
        preparedBy: '',
        receivedBy: ''
      }
    }
  },
  watch: {
    items (value) {
      if (value.length > 0) {
        this.showTable = true
      } else {
        this.showTable = false
      }
    },
    'userActiveBranch.id': _.debounce(function () {
      this.fetchDoctorList()
    })
  },
  computed: {
    ...mapGetters({
      userActiveBranch: 'Auth/userActiveBranch',
      userDetails: 'Auth/userDetails'
    }),
    totalIncome () {
      const sum = this.totalPaymentBreakdown.reduce((accumulator, object) => {
        return accumulator + object.amount
      }, 0)
      return sum
    },
    totalNetIncome () {
      return this.totalIncome - this.totalExpenses
    }
  },
  methods: {
    printCommissionReport () {
        html2pdf(this.$refs.divCommissionReport, {
            margin: 0.1,
            filename: 'commission-report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { dpi: 192, letterRendering: true, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        })
    },
    clearCommissionRec () {
        this.commissionRec.patientList = []
        this.commissionRec.dentistName = ''
        this.commissionRec.dailyRate = ''
        this.commissionRec.commission = ''
        this.commissionRec.mealAllowance = ''
        this.commissionRec.hazardPay = ''
        this.commissionRec.overTime = ''
        this.commissionRec.late = ''
        this.commissionRec.other = ''
        this.commissionRec.grandTotal = ''
        this.commissionRec.date = ''
        this.commissionRec.preparedBy = ''
        this.commissionRec.receivedBy = ''
    },
    generateCommissionReport (item) {
      console.log('CommissionReport => ', item)
      this.clearCommissionRec()
      var indexCount = 1
      var grandTotalCom = 0
      var grandTotalAmt = 0
      Object.keys(item?.subDetails).forEach((d, i) => {
        var totalAmt = 0
        var totalCom = 0
        var treatments = ''
        var isNewLine = item.subDetails[d].services.length / 1
        item.subDetails[d].services.forEach((serviceData, serviceIndex) => {
          totalAmt += parseFloat(serviceData?.amount)
          totalCom += parseFloat(serviceData?.commission_amount)
          // treatments += `${treatments ? ' | ' : ''}` + (serviceData?.service_name + (serviceData?.remarks ? ` - ${serviceData?.remarks} ${item.subDetails[d]?.id ? `#${item.subDetails[d]?.id}` : ''}` : '') + ` (₱ ${(serviceData?.amount).toFixed(2)})`)
          treatments += `${treatments ? ' | ' : ''}` + (serviceData?.service_name + (serviceData?.remarks ? ` - ${serviceData?.remarks}` : '') + ` (₱ ${(serviceData?.amount).toFixed(2)})`)
        })
        console.log('isNewLine', isNewLine)
        if (isNewLine > 1) {
          var ctnNum = Number.isInteger(isNewLine) ? isNewLine : Math.round(isNewLine)
          var counter = 0
          // console.log('ctnNum => ', ctnNum)
          for (let index = 1; index <= ctnNum; index++) {
            var trtmts = ''
            treatments.split('|').forEach((d, i) => {
              if ((i >= counter) && (i < (counter + 1))) {
                trtmts += `${trtmts ? ' | ' : ''}` + d
              }
            })
            this.commissionRec.patientList.push({
              ctn: indexCount++,
              patientName: item.subDetails[d]?.patient_name,
              treatment: trtmts,
              amt: totalAmt,
              comAmt: totalCom + parseFloat(item.subDetails[d]?.additional_commission),
              isNewLine: index !== 1
            })
            counter += 1
          }
        } else {
          this.commissionRec.patientList.push({
            ctn: indexCount++,
            patientName: item.subDetails[d]?.patient_name,
            treatment: treatments,
            amt: totalAmt,
            comAmt: totalCom + parseFloat(item.subDetails[d]?.additional_commission),
            isNewLine: false
          })
        }
          grandTotalAmt += totalAmt
          grandTotalCom += totalCom + parseFloat(item.subDetails[d]?.additional_commission)
      })
      if (indexCount < 30) {
        for (let index = indexCount; index <= 30; index++) {
          this.commissionRec.patientList.push({ ctn: index, patientName: '', treatment: '', amt: '', comAmt: '' })
        }
      }
      // console.log('patientList', this.commissionRec.patientList)
        this.commissionRec.dentistName = item?.dentist
        this.commissionRec.dailyRate = ''
        this.commissionRec.commission = (grandTotalCom).toFixed(2)
        this.commissionRec.mealAllowance = ''
        this.commissionRec.hazardPay = ''
        this.commissionRec.overTime = ''
        this.commissionRec.late = ''
        this.commissionRec.other = ''
        this.commissionRec.grandTotal = grandTotalAmt
        this.commissionRec.date = item?.date
        this.commissionRec.preparedBy = this.userDetails?.firstname + ' ' + this.userDetails?.middlename + ' ' + this.userDetails?.lastname
        this.commissionRec.receivedBy = ''
      this.$bvModal.show('commission-report-modal')
    },
    clearFilters () {
      this.doctor = null
      this.fromDate = moment(new Date()).format('YYYY-MM-DD')
      this.toDate = moment(new Date()).format('YYYY-MM-DD')
      this.items = []
    },
    fetchDoctorList () {
      doctor.getAllDocsByBranch(this.userActiveBranch?.branch_id).then(response => {
        if (response.data.success) {
          const doctors = response.data.data
          this.doctors = []
          doctors.forEach(doctor => {
            this.doctors.push({ value: doctor.id, text: doctor.first_name + ' ' + doctor.last_name })
          })
        }
      }).catch(err => console.log(err))
    },
    async fetchCommissionReport () {
      if (this.fromDate > this.toDate) {
        this.$swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'From date must be less than or equal to To Date'
        })
        return false
      }

      if (!this.doctor) {
        this.$swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please select a dentist'
        })
        return false
      }
      const payload = {
        'from': this.fromDate,
        'to': this.toDate,
        'doctor': this.doctor
      }

      reports.commissionReport(payload).then(({ data }) => {
        if (data.success) {
          var itemList = []
          Object.keys(data.data).forEach((d, i) => {
            let commission = 0
            let additionalCom = 0
            let dentistName = ''
            Object.keys(data.data[d]).forEach((index) => {
              commission += data.data[d][index].total_commission
              additionalCom += data.data[d][index].additional_commission
              dentistName = data.data[d][index]?.doctor_name
            })

            itemList.push({ date: d, dentist: dentistName, commission, additionalCom, totalCommission: (commission + additionalCom), subDetails: data.data[d] })
          })
          this.items = itemList
        }
      }).catch(err => console.log(err))
    }
  }
}
</script>
