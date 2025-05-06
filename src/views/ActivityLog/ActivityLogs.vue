<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Activity Logs</h4>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col md="10">
                <p>List of Activities, compose of patient data information</p>
              </b-col>
              <b-col md="2" align-h="end">
                <b-button @click="handleAddActivity" variant="primary" v-if="userDetails.role !== 'DA'">Add Activity</b-button>
              </b-col>
            </b-row>
            <b-row class="mb-3">
              <b-col md="3">
                <div class="mb-3 row">
                            <label class="col-sm-2 col-form-label" for="date_from">From</label>
                            <div class="col-sm-10">
                              <input class="form-control" v-model="date_from" :max="date_to" id="date_from" type="date" />
                            </div>
                          </div>
              </b-col>
              <b-col md="3">
                <div class="mb-3 row">
                            <label class="col-sm-2 col-form-label" for="date_to">To</label>
                            <div class="col-sm-10">
                              <input class="form-control" v-model="date_to" :min="date_from" id="date_to" type="date" />
                            </div>
                          </div>
              </b-col>
              <b-col md="6">
                <div class="mb-3 row">
                            <label class="col-12 col-md-4 col-sm-4 col-form-label text-right" for="control_no">Control No.</label>
                            <div class="col-12 col-md-8 col-sm-8">
                              <input class="form-control" v-model="control_no" placeholder="Search Control No." id="control_no" type="text" />
                            </div>
                          </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <b-table
                  class="table table-sm"
                  id="my-table"
                  striped
                  hover
                  outlined
                  :per-page="items.per_page"
                  :fields="fields"
                  :items="items.data"
                  show-empty
                >
                  <template v-slot:cell(name)="{ item }">
                    <a href="javascript:;" @click="viewPatientProfile(item.patient_id)">{{ item.patient.first_name }} {{ item.patient.last_name }}</a>
                  </template>
                  <template v-slot:cell(status)="{ item }">
                    <b-badge variant="light" v-show="item.status == 'pending'">PENDING</b-badge>
                    <b-badge variant="success" v-show="item.status == 'ongoing'">ON-GOING</b-badge>
                    <b-badge variant="danger" v-show="item.status == 'cancelled'">CANCELLED</b-badge>
                    <b-badge variant="primary" v-show="item.status == 'done' && item.is_paid == 'N' && item.is_settle_with_balance == 'N'">FOR PAYMENT</b-badge>
                    <b-badge variant="info" v-show="item.status == 'done' && item.is_paid == 'Y' && item.is_settle_with_balance == 'N'">SETTLED</b-badge>
                    <b-badge variant="warning" v-show="item.status == 'done' && item.is_paid == 'N' && item.is_settle_with_balance == 'Y'">SETTLED WITH BALANCE</b-badge>
                  </template>
                  <template v-slot:cell(actions)="{ item }">
                    <span>
                      <b-btn variant="primary" class="mb-3 mr-1" @click="openActivityLog(item.id)" v-if="item.status !== 'cancelled'"><i class="las la-edit"></i> Edit</b-btn>
                      <b-btn variant="info" class="mb-3 mr-1" @click="openActivityLog(item.id)" v-if="item.status === 'cancelled'"><i class="las la-eye"></i> View</b-btn>
                      </span>
                  </template>
                  <template #empty="scope" class="text-center">
                    <div class="text-center">
                      <span>No data results</span>
                    </div>
                  </template>
                </b-table>
              </b-col>
            </b-row>
            <div class="row">
              <b-col class="col">
                <b-pagination
                  class="float-right"
                  v-model="currentPage"
                  :total-rows="items?.total"
                  :per-page="items?.per_page"
                  aria-controls="my-table"
                ></b-pagination>
              </b-col>
            </div>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal id="modal-add-activity" centered title="Add Activity" hide-footer cancel-title="Close">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(saveActivity)">
          <b-form-group class="col-md-12" label="Patient" label-for="selectpatient">
            <ValidationProvider name="Patient" rules="required" v-slot="{ errors }">
              <b-form-select v-model="activity.patient_id"  plain :options="patients" id="selectpatient" :class="(errors.length > 0 ? ' is-invalid' : '')">
                <template v-slot:first>
                  <b-form-select-option :value="null">Select Patient</b-form-select-option>
                </template>
              </b-form-select>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <!-- <b-form-group class="col-md-12">
            <b-form-checkbox v-model="activity.is_dentist_required">Is Dentist Required?</b-form-checkbox>
          </b-form-group> -->
          <b-form-group class="col-md-12" label="Notes" label-for="notes">
            <b-form-textarea v-model="activity.rc_notes" id="notes" rows="5"></b-form-textarea>
          </b-form-group>
          <b-button class="mt-3" variant="primary" type="submit">Save</b-button>
        </form>
      </validation-observer>
    </b-modal>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import activity from '../../services/activity'
import patient from '../../services/patient'
import _ from 'lodash'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  name: 'ActivityLogs',
  mounted () {
    xray.index()
    this.fetchPatientList()
    this.getCurrentDate()
    this.subscribeToChannel()
  },
  beforeDestroy () {
    if (this.channel) {
      this.channel.unsubscribe()
    }
  },
  data () {
    return {
      date_from: '',
      date_to: '',
      control_no: '',
      filter: '',
      fields: [
        { label: 'Control No.', key: 'control_no', headerClass: 'text-left' },
        { label: 'Patient Name', key: 'name', headerClass: 'text-left' },
        { label: 'Notes', key: 'rc_notes', headerClass: 'text-left' },
        { label: 'Status', key: 'status', headerClass: 'text-left' },
        { label: 'Action', key: 'actions', representedAs: ({ id, name }) => `<button variant="danger" class="mb-3 mr-1" @click="">View</button>`, interpolate: true, sortable: false }
      ],
      items: [],
      activity: {
        clinic_id: '',
        branch_id: '',
        patient_id: '',
        is_dentist_required: false,
        rc_notes: ''
      },
      patients: [],
      perPage: 10,
      currentPage: 1,
      channel: null
    }
  },
  created () {
    this.subscribeToChannel()
  },
  computed: {
    rows () {
      return this.items.length
    },
    ...mapGetters({
        userActiveBranch: 'Auth/userActiveBranch',
        userDetails: 'Auth/userDetails'
    }),
    currentDate () {
      const today = new Date()
      var yr = today.getFullYear()
      var mm = today.getMonth()
      var dd = today.getDay()
      return yr + '-' + (mm < 10 ? `0${mm}` : mm) + '-' + (dd < 10 ? `0${dd}` : dd)
    }
  },
  watch: {
    userActiveBranch: _.debounce(function (data) {
      this.activity.clinic_id = data?.clinic_id
      this.activity.branch_id = data?.branch_id
      this.fetchPatientList()
      this.fetchActivities()
      this.subscribeToChannel()
    }, 500),
    userDetails: _.debounce(function (data) {
      this.activity.is_dentist_required = !!(data.role === 'DA')
    }, 500),
    date_from: _.debounce(function (data) {
      this.fetchActivities()
    }, 500),
    date_to: _.debounce(function (data) {
      this.fetchActivities()
    }, 500),
    control_no: _.debounce(function (data) {
      this.fetchActivities()
    }, 500),
    currentPage: _.debounce(function (data) {
      this.fetchActivities()
    })
  },
  methods: {
    viewPatientProfile (id) {
      this.$router.push('/patient/view/' + id)
    },
    getCurrentDate () {
      const today = new Date()
      this.date_from = moment(today).format('YYYY-MM-DD')
      this.date_to = moment(today).format('YYYY-MM-DD')
    },
    fetchActivities () {
      if (this.userActiveBranch?.id) {
        var payload = `page=${this.currentPage}&branchId=${this.userActiveBranch.branch_id}`
        if (this.date_from) {
          payload += `&date_from=${this.date_from}`
        }

        if (this.date_to) {
          payload += `&date_to=${this.date_to}`
        }

        if (this.control_no) {
          payload += `&control_no=${this.control_no}`
        }

        activity.getAllBranchActivities(payload).then(response => {
          if (response.data.success) {
            this.items = response.data.data
          }
        }).catch(err => console.log(err))
      }
    },
    subscribeToChannel () {
      this.channel = this.$pusher.subscribe('branch-activity-' + this.userActiveBranch?.id)
      this.channel.bind('activity-event', (data) => {
        this.fetchActivities()
      })
    },
    fetchPatientList () {
      if (this.userActiveBranch?.id) {
        patient.getAllPatients(this.userActiveBranch?.id).then(response => {
          if (response.data.success) {
            const patients = response.data.data
            this.patients = []
            patients.forEach(patient => {
              this.patients.push({ value: patient.id, text: patient.first_name + ' ' + patient.last_name + ' (' + patient.patient_no + ')' })
            })
          }
        }).catch(err => console.log(err))
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
          this.activity.is_dentist_required = true
        } else {
          this.activity.is_dentist_required = false
        }
        this.$bvModal.show('modal-add-activity')
      })
    },
    saveActivity () {
      this.activity.clinic_id = this.userActiveBranch?.clinic_id
      this.activity.branch_id = this.userActiveBranch?.branch_id
      activity.createActivity(this.activity).then(response => {
        if (response.data.success) {
          this.$swal('Activity save successfully!!!')
          this.fetchActivities()
          this.activity.patient_id = ''
          this.activity.rc_notes = ''
          this.activity.is_dentist_required = false
          this.$bvModal.hide('modal-add-activity')
        }
      }).catch(err => console.log(err))
    },
    openActivityLog (id) {
      this.$router.push('/activityLogs/view/' + id)
    }
  }
}
</script>
