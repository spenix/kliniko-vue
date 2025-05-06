<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Dentist List</h4>
          </template>
          <template v-slot:body>
            <b-row class="mb-2">
              <b-col md="12">
                <p>List of Dentist, compose of doctor data information <button type="button" class="btn btn-primary float-right" @click="addDoctor()">Add Doctor</button></p>
              </b-col>
              <b-col md="12 mt-2">
                <div class="iq-search-bar float-right">
                  <form action="#" @submit.prevent="fetchDoctorList()" class="searchbox">
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
                    <span><b-btn variant="primary" class="mb-3 mr-1" @click="editDoctor(item.id)"><i class="las la-edit"></i> Edit</b-btn></span>
                  </template>
                  <template #empty="scope" class="text-center">
                    <div class="text-center">
                      <span>No data results</span>
                    </div>
                  </template>
                </b-table>
              </b-col>
            </b-row>
            <b-row class="mb-3">
                <b-col md="12">
                  <b-pagination
                  class="float-right"
                  v-model="currentPage"
                  :total-rows="items?.total"
                  :per-page="items?.per_page"
                  aria-controls="my-table"
                  ></b-pagination>
                </b-col>
              </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../../config/pluginInit'
import doctor from '../../../services/doctor'
import moment from 'moment'
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'DoctorList',
  mounted () {
    xray.index()
    this.fetchDoctorList()
  },
  data () {
    return {
      filter: '',
      fields: [
        { label: 'Name', key: 'name', headerClass: 'text-left', sortable: true },
        { label: 'Job Title', key: 'job_title', headerClass: 'text-left', sortable: true },
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
      userActiveBranch: 'Auth/userActiveBranch'
    })
  },
  watch: {
    userActiveBranch: _.debounce(function () {
      this.fetchDoctorList()
    }),
    currentPage: _.debounce(function (data) {
      this.fetchDoctorList()
    }, 500),
    searchItem: _.debounce(function (data) {
      this.fetchDoctorList()
    }, 500)
  },
  methods: {
    addDoctor () {
      this.$router.push('/doctor/add-doctor')
    },
    editDoctor (id) { this.$router.push(`/doctor/doctor-edit/${id}`) },
    fetchDoctorList () {
      var payload = `page=${this.currentPage}&branchId=${this.userActiveBranch.id}`
      if (this.searchItem) {
        payload += `&search=${this.searchItem}`
      }
      doctor.getAllDoctorsByBranch(payload).then(response => {
        if (response.data.success) {
          this.items = response.data.data
        }
      }).catch(err => console.log(err))
    },
    calculateAge (dob) {
      const startDate = new Date()
      const endDate = new Date(dob)
      return Math.abs(moment.duration(endDate - startDate).years())
    }
  }
}
</script>
