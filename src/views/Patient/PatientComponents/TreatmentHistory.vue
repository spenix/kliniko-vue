<template>
  <tab-content-item :active="true" id="TreatmentHistory" >
    <iq-card body-class="pb-6" >
        <template v-slot:body>
          <b-row>
            <b-col sm="12">
              <div class="iq-card">
                <div class="iq-header-title">
                  <div class="row">
                    <div class="col"><h4 class="card-title text-primary">{{ title }}</h4></div>
                    <div class="col"><b-button @click="handleAddActivity" variant="primary" class="float-right" v-if="userDetails.role !== 'DA'">Add Activity</b-button></div>
                  </div>
                </div>
                <div class="iq-card-body pl-0 pr-0 pb-0">
                  <b-row >
                    <b-col md="12 mb-2">
                      <div class="iq-search-bar float-right">
                        <form action="#" @submit.prevent="fetchPatientActivities()" class="searchbox">
                          <input type="text" class="text search-input" v-model="searchItem" placeholder="search....">
                          <a class="search-link" href="#"><i class="ri-search-line"></i></a>
                        </form>
                      </div>
                    </b-col>
                    <b-col md="12">
                      <b-table
                        striped
                        hover
                        outlined
                        :fields="fields"
                        :items="items?.data"
                        :per-page="items?.per_page"
                        show-empty
                      >
                      <template v-slot:cell(remarks)="{ item }">
                       <label>{{ processTreatmentRemarks(item?.services).join(" | ") }} <br v-if="item.remarks"> {{ item.remarks }} </label>
                      </template>
                      <template v-slot:cell(created_at)="{ item }">
                        {{ moment(item.created_at).format('MMMM DD, YYYY') }}
                      </template>
                      <template v-slot:cell(treatment)="{ item }">
                        {{ processTreatment(item.services).join(', ') }}
                      </template>
                      <template v-slot:cell(actions)="{ item }">
                            <span><b-btn variant="warning" class="mb-3 mr-1" title="View" @click="actionActivityItem(item, 'View')"><i class="las la-user"></i> View</b-btn></span>
                        </template>
                        <template #empty="scope" class="text-center">
                          <div class="text-center">
                            <span>No data results</span>
                          </div>
                        </template>
                      </b-table>
                      <div class="row">
                          <b-col class="align-self-end">
                            <b-pagination
                              class="float-right"
                              v-model="currentPage"
                              :total-rows="items?.total"
                              :per-page="items?.per_page"
                              aria-controls="patient-table"
                            ></b-pagination>
                          </b-col>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12">
              <div class="iq-card">
                <div class="iq-header-title">
                  <div class="row">
                    <div class="col"><h4 class="card-title text-primary">Balance History</h4></div>
                  </div>
                </div>
                <div class="iq-card-body pl-0 pr-0 pb-0">
                  <b-row>
                    <b-col md="12">
                      <b-table
                        striped
                        hover
                        outlined
                        :fields="balanceHistoryFields"
                        :items="balanceHistoryList"
                      >
                      <template v-slot:cell(created_at)="{ item }">
                        {{ moment(item.created_at).format('MMMM DD, YYYY') }}
                      </template>
                      <template v-slot:cell(is_payment)="{ item }">
                        {{ item.is_payment === 'Y' ? '-' : "+" }}
                      </template>
                      <template v-slot:cell(description)="{ item }">
                        <CustomLink :item="item"/>
                      </template>
                      </b-table>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </b-col>
          </b-row>
          <ActivityLogModal :patientId="patientId" :patientDetail="patientDetail" :isDentistRequired="isDentistRequired" @triggerPatientActivities="triggerPatientActivities($event)"/>
        </template>
    </iq-card>
  </tab-content-item>
</template>
<script>
    import activity from '../../../services/activity'
    import patient from '../../../services/patient'
    import { mapGetters } from 'vuex'
    import moment from 'moment'
    import _ from 'lodash'
    import ActivityLogModal from '../../GlobalComponents/Modals/ActivityLogModal.vue'
    import CustomLink from './SubComponents/CustomLink'
    export default {
        name: 'TreatmentHistory',
        props: {
            patientId: String,
            patientDetail: Object
        },
        components: {
          ActivityLogModal,
          CustomLink
        },
        data () {
            return {
                title: 'Treatment History',
                fields: [
                { label: 'Date of Visit', key: 'created_at', headerClass: 'text-left' },
                { label: 'Treatment', key: 'treatment', headerClass: 'text-left' },
                { label: 'Remarks', key: 'remarks', headerClass: 'text-left' },
                { label: 'Dentist', key: 'doctor_name', headerClass: 'text-left' },
                { label: 'Actions', key: 'actions', headerClass: 'text-left', sortable: false }
                ],
                balanceHistoryFields: [
                { label: 'Date', key: 'created_at', headerClass: 'text-left' },
                { label: 'Amount', key: 'amount', headerClass: 'text-left' },
                { label: '(+/-)', key: 'is_payment', class: 'text-center' },
                { label: 'Before Balance', key: 'before_balance', headerClass: 'text-left' },
                { label: 'After Balance', key: 'after_balance', headerClass: 'text-left' },
                { label: 'Description', key: 'description', headerClass: 'text-left' }
                ],
                moment: moment,
                currentPage: 1,
                items: [],
                balanceHistories: [],
                activityForm: {
                  patient_id: '',
                  is_dentist_required: false,
                  rc_notes: '',
                  clinic_id: '',
                  branch_id: ''
                },
                isDentistRequired: false,
                searchItem: ''
            }
        },
        computed: {
            ...mapGetters({
              userActiveBranch: 'Auth/userActiveBranch',
              userDetails: 'Auth/userDetails'
            }),
            balanceHistoryList () {
              return this.balanceHistories.map(d => {
                if (d?.is_payment === 'N') {
                  return { ...d, _rowVariant: 'danger' }
                } else {
                  return d
                }
              })
            }
        },
        watch: {
            userDetails: _.debounce(function (data) {
                this.activityForm.is_dentist_required = !!(data.role === 'DA')
            }, 500),
            searchItem: _.debounce(function (data) {
              this.fetchPatientActivities()
            }, 300),
            currentPage: _.debounce(function (data) {
              this.fetchPatientActivities()
            })
        },
        methods: {
          actionActivityItem (item, act) {
              if (act === 'View') {
                this.$router.push(`/activityLogs/view/${item?.id}`)
              }
            },
            fetchPatientActivities () {
                var payload = `page=${this.currentPage}`
                if (this.searchItem) {
                  payload += `&search=${this.searchItem}`
                }
                const id = this.patientId
                activity.getActivitiesByPatientId(id, payload).then(response => {
                if (response.data.success) {
                    this.items = response.data.data
                }
                }).catch(err => console.log(err))
            },
            fetchPatientBalanceHistories () {
                const id = this.patientId
                patient.getPatientBalanceHistory(id).then(response => {
                if (response.data.success) {
                    this.balanceHistories = response.data.data
                }
                }).catch(err => console.log(err))
            },
            processTreatmentRemarks (data) {
              var remarks = []
              data.forEach(d => {
                if (d?.remarks) {
                    var strRemark = `${d?.service_name} - ${d.remarks}`
                    remarks.push(strRemark)
                }
              })
              return remarks
            },
            processTreatment (data) {
              let result = data.map(a => a.service_name)
              return result
            },
            triggerPatientActivities (e) {
              if (e) {
                this.fetchPatientActivities()
              }
            },
            handleAddActivity () {
              this.$swal.fire({
                  title: 'Is Dentist Required?',
                  showCancelButton: true,
                  confirmButtonText: 'Yes',
                  cancelButtonText: 'No'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.isDentistRequired = true
                } else {
                  this.isDentistRequired = false
                }
                this.$bvModal.show('modal-add-activity')
              })
            }
        },
        mounted () {
            this.fetchPatientActivities()
            this.fetchPatientBalanceHistories()
        }
    }
</script>
