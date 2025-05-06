<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card >
          <template v-slot:headerTitle>
            <h4 class="card-title">Search results</h4>
          </template>
          <template v-slot:body>
            <div v-if="items?.data?.length">
              <b-row class="mb-3">
                <b-col md="12">
                  <b-list-group>
                    <b-list-group-item class="patient-item" id="my-table" v-for="(d, i) in items?.data" :key="`searched-patient-${i}`"  @click="viewPatientProfile(d.id)">
                      <b-media class="mb-4">
                        <template v-slot:aside>
                          <div class="user-profile text-center">
                            <b-img :src="getImageUri(d?.avatar)" :alt="`Patient-${d?.patient_no}`" fluid title="View Picture" class="profile-pic"></b-img>
                          </div>
                        </template>
                        <b-media-body>
                          <table class="table table-sm" >
                            <thead>
                              <tr>
                                <th colspan="4">
                                  {{ "( "+ d?.patient_no +" ) " + d?.first_name + " " + (d?.middle_name ?? '') + " " + d?.last_name }}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td><strong>Age:</strong> {{ computeAge(d?.birth_date) }}</td>
                                <td><strong>Birth Date:</strong> {{ d?.bday }}</td>
                                <td><strong>Sex:</strong> {{ d?.sex }}</td>
                                <td><div v-if="userDetails?.role != 'DA'"><strong>Contact No.:</strong> {{ d?.contact_no }}</div></td>
                              </tr>
                              <tr>
                                <td><strong>Civil Status:</strong> {{ d?.civil_status }}</td>
                                <td><strong>Nationality:</strong> {{ d?.nationality }}</td>
                                <td><strong>Occupation:</strong> {{ d?.occupation }}</td>
                                <td><strong>Has serious illness:</strong> {{ d?.has_serious_illness === 'Y' ? 'Yes' : 'No' }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </b-media-body>
                      </b-media>
                    </b-list-group-item>
                  </b-list-group>
                </b-col>
              </b-row>
              <b-row class="mb-3">
                <b-col md="12">
                  <b-pagination
                  class="float-right"
                  v-model="currentPage"
                  prev-text="Previous"
                  next-text="Next"
                  first-text="First"
                  last-text="Last"
                  :total-rows="items?.total"
                  :per-page="items?.per_page"
                  aria-controls="my-table"
                  ></b-pagination>
                </b-col>
              </b-row>
            </div>
            <div v-else>
              <b-row class="mb-3">
                <b-col class="text-center" md="12">
                  {{isLoading ? 'Loading...' : 'No data results..'}}
                </b-col>
              </b-row>
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
import _ from 'lodash'
import { mapGetters } from 'vuex'

export default {
  name: 'ViewResults',
  mounted () {
    xray.index()
    if (typeof this.$route.query.query !== 'undefined') {
      this.getSearchResults(this.$route.query.query)
    }
  },
  data () {
    return {
      isLoading: false,
      items: {},
      currentPage: 1
    }
  },
  watch: {
    $route (to) {
      this.getSearchResults(to.query.query)
    },
    userActiveBranch: _.debounce(function (data) {
      this.getSearchResults(this.$route.query.query)
    }, 500),
    currentPage: _.debounce(function (data) {
      this.getSearchResults(this.$route.query.query, data)
    }, 500)
  },
  computed: {
    ...mapGetters({
        userActiveBranch: 'Auth/userActiveBranch',
        userDetails: 'Auth/userDetails'
    })
  },
  methods: {
    getImageUri (uri) {
      if (uri) {
        var cnt = uri.split('/')
        if (cnt.length > 3) {
          return uri
        } else {
          return process.env.VUE_APP_API_BASE_URL + uri
        }
      }
      return require('../../assets/images/page-img/21.jpg')
    },
    getSearchResults (q, page = 1) {
      this.isLoading = true
      this.items = {}
      patient.searchPatients({ search_key: q, branchId: this.userActiveBranch?.id }, page)
      .then(({ data }) => {
        if (data?.success) {
          this.items = data?.data
        } else {
          confirm('Oops, something went wrong. Please contact the system encharge.')
        }
        this.isLoading = false
      })
    },
    computeAge (bday) {
        const today = new Date()
        const birthDate = new Date(bday)
        let age = today.getFullYear() - birthDate.getFullYear()
        let m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
        return age
    },
    viewPatientProfile (id) {
      this.$router.push('/patient/view/' + id)
    }
  }
}
</script>
<style scoped>
.user-profile {
  display: inline-block;
  height: 120px;
  width: 120px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  overflow: hidden;
}
.profile-pic {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
    object-position: center;
}
.patient-item:hover {
    background-color: aquamarine;
}
.patient-item {
  cursor: pointer;
}
</style>
