<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Patient List</h4>
          </template>
          <template v-slot:body>
            <b-row class="mb-2">
              <b-col md="12">
                <p>List of Patients, compose of patient data information <button type="button" class="btn btn-primary float-right" v-if="userDetails?.role != 'DA'" @click="addPatient()">Add Patient</button></p>
              </b-col>
              <b-col md="12 mt-2">
                <div class="iq-search-bar float-right">
                  <form action="#" @submit.prevent="fetchPatientList()" class="searchbox">
                    <input type="text" class="text search-input" v-model="searchItem" placeholder="search....">
                    <a class="search-link" href="#"><i class="ri-search-line"></i></a>
                  </form>
                </div>
              </b-col>
            </b-row>
            <b-row>
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
                  <template v-slot:cell(name)="{ item }">
                    {{ item.first_name }} {{ item.last_name }}
                  </template>
                  <template v-slot:cell(age)="{ item }">
                    {{ calculateAge(item.birth_date) }}
                  </template>
                  <template v-slot:cell(actions)="{ item }">
                    <span><b-btn variant="warning" class="mb-3 mr-1" @click="viewPatientProfile(item.id)"><i class="las la-user"></i> View</b-btn></span>
                    <span v-if="userDetails?.role != 'DA'"><b-btn variant="primary" class="mb-3 mr-1" @click="EditPatientProfile(item.id)"><i class="las la-edit"></i> Edit</b-btn></span>
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
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import patient from '../../services/patient'
import moment from 'moment'
import _ from 'lodash'
import { mapGetters } from 'vuex'
export default {
  name: 'PatientList',
  mounted () {
    xray.index()
    this.fetchPatientList()
  },
  data () {
    return {
      fields: [
        { label: 'Patient No.', key: 'patient_no', headerClass: 'text-left', sortable: true },
        { label: 'Name', key: 'name', headerClass: 'text-left', sortable: true },
        { label: 'Occupation', key: 'occupation', headerClass: 'text-left', sortable: true },
        { label: 'Age', key: 'age', headerClass: 'text-left', sortable: true },
        { label: 'Sex', key: 'sex', headerClass: 'text-left', sortable: true },
        { label: 'Actions', key: 'actions', sortable: false }
      ],
      items: [],
      currentPage: 1,
      searchItem: ''
    }
  },
  computed: {
    ...mapGetters({
        userDetails: 'Auth/userDetails',
        userActiveBranch: 'Auth/userActiveBranch'
    })
  },
  watch: {
    userActiveBranch: _.debounce(function (data) {
      this.fetchPatientList()
    }, 500),
    searchItem: _.debounce(function (data) {
      this.fetchPatientList()
    }, 500),
    currentPage: _.debounce(function (data) {
      this.fetchPatientList()
    }, 500)
  },
  methods: {
    addPatient () {
      this.$router.push('/patient/add-patient')
    },
    editPatient (item) { console.log(item) },
    fetchPatientList () {
      patient.getAllPatientsByPagination(this.userActiveBranch?.id, this.searchItem, this.currentPage).then(response => {
        if (response.data.success) {
          this.items = response.data.data
        }
      }).catch(err => console.log(err))
    },
    calculateAge (dob) {
      const startDate = new Date()
      const endDate = new Date(dob)
      return Math.abs(moment.duration(endDate - startDate).years())
    },
    viewPatientProfile (id) {
      this.$router.push('/patient/view/' + id)
    },
    EditPatientProfile (id) {
      this.$router.push(`/patient/patient-edit/${id}`)
    }
  }
}
</script>
