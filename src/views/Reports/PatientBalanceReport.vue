<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Patient Balance Report</h4>
          </template>
          <template v-slot:body>
            <b-row class="mb-2">
              <b-col md="12 mt-2">
                <div class="iq-search-bar float-right">
                  <form action="#" @submit.prevent="fetchPatientsWithBalances()" class="searchbox">
                    <input type="text" class="text search-input" v-model="searchItem" placeholder="search....">
                    <a class="search-link" href="#"><i class="ri-search-line"></i></a>
                  </form>
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <b-table
                  class="table table-sm"
                  striped
                  hover
                  outlined
                  :per-page="items?.per_page"
                  :fields="fields"
                  :items="items?.data"
                  show-empty
                >
                  <template v-slot:cell(balance)="{ item }">
                      <span class="float-right">{{ item.balance }}</span>
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
                <b-col md="6">
                  <h4>
                    <b>Grand Total: </b>
                    ₱ {{ grandTotalAmtBalance }}
                  </h4>
                </b-col>
                <b-col md="6">
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
import { xray } from '../../config/pluginInit'
import patientService from '../../services/patient'
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'SystemUserList',
  mounted () {
    xray.index()
    this.fetchPatientsWithBalances()
    this.getGrandTotalOnAmtBalance()
  },
  computed: {
    ...mapGetters({
      userActiveBranch: 'Auth/userActiveBranch'
    })
  },
  data () {
    return {
      filter: '',
      fields: [
        { label: 'Patient No', key: 'patient_no', headerClass: 'text-left', sortable: true },
        { label: 'Patient Name', key: 'name', headerClass: 'text-left', sortable: true },
        { label: 'Total Balance', key: 'balance', headerClass: 'text-right', sortable: true }
      ],
      currentPage: 1,
      items: [],
      searchItem: '',
      errors: {},
      grandTotalAmtBalance: 0
    }
  },
  watch: {
    userActiveBranch: _.debounce(function (data) {
      this.fetchPatientsWithBalances()
      this.getGrandTotalOnAmtBalance()
    }),
    searchItem: _.debounce(function (data) {
      this.fetchPatientsWithBalances()
    }, 500),
    currentPage: _.debounce(function (data) {
      this.fetchPatientsWithBalances()
    }, 500)
  },
  methods: {
    getGrandTotalOnAmtBalance () {
      var payload = `branchId=${this.userActiveBranch.id}`
      patientService.getGrandTotalAmtBalance(payload)
      .then(({ data, status }) => {
        if (status === 200) {
          this.grandTotalAmtBalance = data?.amt_balance
        }
      })
    },
    fetchPatientsWithBalances () {
      var payload = `page=${this.currentPage}&branchId=${this.userActiveBranch.id}`
      if (this.searchItem) {
        payload += `&search=${this.searchItem}`
      }
      patientService.getPatientsWithBalance(payload)
      .then(({ data }) => {
        this.items = data?.data
      }).catch(err => console.log(err))
    }
  }
}
</script>
