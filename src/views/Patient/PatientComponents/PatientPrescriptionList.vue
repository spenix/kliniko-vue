<template>
  <tab-content-item :active="true" id="PatientPrescriptionList">
    <iq-card body-class="pb-6" >
      <template v-slot:body>
        <b-row>
          <b-col sm="12">
            <div class="iq-card">
              <div class="iq-header-title">
                <h4 class="card-title text-primary">Prescriptions <button type="button" v-b-modal.prescription-modal  class="btn btn-primary float-right" @click="addPrescriptionItem">Add Prescription</button></h4>
              </div>
              <div class="iq-card-body pl-0 pr-0 pb-0">
                <b-row>
                    <b-col md="12 mb-2">
                      <div class="iq-search-bar float-right">
                        <form action="#" @submit.prevent="getAllPatientPrescriptions()" class="searchbox">
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
                            id="patient-table"
                            :per-page="items?.per_page"
                            :fields="fields"
                            :items="items?.data"
                            show-empty
                            >
                            <template v-slot:cell(actions)="{ item }">
                                <span><b-btn variant="warning" class="mb-3 mr-1" v-b-modal.prescription-modal title="View" @click="actionPrescriptionItem(item, 'View')"><i class="las la-user"></i> View</b-btn></span>
                                <span><b-btn variant="primary" class="mb-3 mr-1" v-b-modal.prescription-modal title="Edit" @click="actionPrescriptionItem(item, 'Edit')"><i class="las la-edit"></i> Edit</b-btn></span>
                                <span><b-btn variant="light" class="mb-3 mr-1" v-b-modal.print-prescription-modal title="Generate" @click=" actionPrescriptionItem(item, 'Print')"><i class="las la-print"></i> Print</b-btn></span>
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
      </template>
      <PrintPrescriptionModal :form_action="form_action" :title="title" :userActiveBranch="userActiveBranch" :patientInfo="patientDetail" :currentDate="currentDate" :patientAge="patientAge" :prescriptionForm="prescriptionForm"/>
      <PrescriptionModal :form_action="form_action" :defaultPrescriptionForm="prescriptionForm" ActivityId="" @triggerPrescription="triggerPrescription($event)"/>
    </iq-card>
  </tab-content-item>
</template>
<style>
.mx-6 {
  margin-left: 2.5rem !important;
  margin-right: 2.5rem !important;
}
#prescriptions {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
  margin: 10px;
}

#prescriptions td, #prescriptions th {
  border: 1px solid #ddd;
  padding: 2px 8px;
}

#prescriptions td input{ padding: 4px 10px; line-height: 28px; }

#prescriptions tr:nth-child(even){background-color: #f2f2f2;}

#prescriptions tr:hover {background-color: #ddd;}

#prescriptions th {
  padding-top: 6px;

  text-align: left;
  background-color: #c2c2d6;
  color: white;
}
</style>
<script>
    // import userService from '../../../services/user'
    import prescriptionService from '../../../services/prescription'
    import { mapGetters } from 'vuex'
    import PrescriptionModal from '../../GlobalComponents/Modals/PrescriptionModal.vue'
    import PrintPrescriptionModal from '../../GlobalComponents/Modals/PrintPrescriptionModal.vue'
    import _ from 'lodash'
    export default {
        name: 'PatientPrescriptionList',
        props: {
            currentAction: String,
            patientId: String,
            patientAge: String,
            patientDetail: Object
        },
        components: { PrescriptionModal, PrintPrescriptionModal },
        data () {
            return {
                title: 'Prescription',
                filter: {
                    prescription_id: '',
                    date: '',
                    description: '' },
                fields: [
                    { label: 'Prescription ID', key: 'display_id', headerClass: 'text-left', sortable: true },
                    { label: 'Date', key: 'created_dt', headerClass: 'text-left', sortable: true },
                    { label: 'Description', key: 'description', headerClass: 'text-left', sortable: true },
                    { label: 'Actions', key: 'actions', sortable: false }
                ],
                form_action: 'Add',
                items: [],
                perPage: 10,
                currentPage: 1,
                errors: {},
                prescriptionForm: {
                  id: '',
                  patient_id: this.patientId,
                  doctor_id: '',
                  license_no: '',
                  doctor: '',
                  description: '',
                  prescriptionList: [
                    { id: '', qty: '', unit: '', name: '', desc: '' }
                  ]
                },
                // systemUserDetails: {},
                searchItem: ''
            }
        },
        watch: {
          searchItem: _.debounce(function (data) {
            this.getAllPatientPrescriptions()
          }, 300),
          currentPage: _.debounce(function (data) {
            this.getAllPatientPrescriptions()
          }, 300)
        },
        computed: {
            rows () {
                return this.items.length
            },
            prescriptionRows () {
              return this.prescriptionForm.prescriptionList.length
            },
            isHideMdFooter () {
              return this.form_action === 'View'
            },
            currentDate () {
              return new Date().toLocaleDateString()
            },
            ...mapGetters({
              userActiveBranch: 'Auth/userActiveBranch'
            })
        },
        methods: {
          triggerPrescription (e) {
            if (e) {
              this.getAllPatientPrescriptions()
            }
          },
          // getSystemUserDetails () {
          //   userService.getAllUserDetails().then(({ data }) => {
          //     if (data?.success) {
          //       this.systemUserDetails = data?.data
          //       this.$emit('setSystemUserDetails', this.systemUserDetails)
          //     }
          //   }).catch(error => { console.log(error) })
          // },
          clearModalForm () {
            this.prescriptionForm.id = ''
            this.prescriptionForm.doctor_id = ''
            this.prescriptionForm.license_no = ''
            this.prescriptionForm.doctor = ''
            this.prescriptionForm.description = ''
            this.prescriptionForm.prescriptionList = [
                    { id: '', qty: '', unit: '', name: '', desc: '' }
                  ]
          },
          getAllPatientPrescriptions () {
            var payload = `page=${this.currentPage}&patient_id=${this.patientId}`
            if (this.searchItem) {
              payload += `&search=${this.searchItem}`
            }
            prescriptionService.getAllPrescriptions(payload).then(({ data }) => {
              if (data.success) {
                this.items = data?.data
              }
            }).catch(err => console.log(err))
          },
          addPrescriptionItem () {
            this.form_action = 'Add'
            this.clearModalForm()
          },
          actionPrescriptionItem (item, act) {
            this.form_action = act
            this.prescriptionForm.id = item?.id
            this.prescriptionForm.doctor_id = item?.doctor_id
            this.prescriptionForm.license_no = item?.license_no
            this.prescriptionForm.doctor = item?.doctor
            this.prescriptionForm.description = item?.description
            var items = item?.prescription_items?.map(d => {
              return { id: d?.id, qty: d?.quantity, unit: d?.uni_of_measurement, name: d?.name, desc: d?.description }
            })
            this.prescriptionForm.prescriptionList = items.length ? items : [
                    { id: '', qty: '', unit: '', name: '', desc: '' }
                  ]
          }
        },
        mounted () {
            // this.getSystemUserDetails()
            this.getAllPatientPrescriptions()
        }
    }
</script>
