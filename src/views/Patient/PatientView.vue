<template>
  <b-container fluid>
    <b-row>
      <b-col lg="12">
        <iq-card body-class="p-0">
          <template v-slot:body>
            <div class="iq-edit-list">
              <ul id="myTab" class="iq-edit-profile nav-fill nav nav-pills " align-h="between">
                <li class="p-0 nav-item" v-for="(d, i) in tabDetails" :key="`tab-${i}`">
                  <a id="myTab" data-toggle="tab" @click="activateClickTab(d.compName)" :href="`#${d.compName}`" role="tab" aria-controls="tabpanel" :class="`nav-link show ${activeTab == d.compName ? 'active' : ''}`">{{ d?.tabName }}</a>
                </li>
              </ul>
              <!-- <tab-nav :pills="true" class="iq-edit-profile nav-fill" align-h="between">
                <tab-nav-items class="p-0" v-for="(d, i) in tabDetails" :key="`tab-${i}`" :active="activeTab == d.compName" :href="`#${d.compName}`" :title="d?.tabName" />
              </tab-nav> -->
            </div>
          </template>
        </iq-card>
      </b-col>
      <b-col lg="12">
        <div class="iq-edit-list-data">
          <tab-content id="pills-tabContent-2">
            <keep-alive>
              <component
                  :is="activeTab"
                  :patientDetail="detail"
                  :userDetails="userDetails"
                  :medicalConditions="medicalConditions"
                  :patientId="$route.params.id"
                  currentAction="view"
                  :patientAge="age"
              />
          </keep-alive>
            <!-- <PatientInformation :patientDetail="detail" :userDetails="userDetails" :medicalConditions="medicalConditions" />
            <TreatmentHistory :patientId="$route.params.id" :patientDetail="detail"/>
            <PatientPrescriptionList currentAction="view" :patientAge="age" :patientInfo="detail" :patientId="$route.params.id"/>
            <AttachmentList currentAction="view" :patientId="$route.params.id"/>
            <PatientDiagramV2 :patientId="$route.params.id"  :patientDetail="detail" />
            <InraOralComponent :patientId="$route.params.id"  :patientDetail="detail" />
            <XrayComponent :patientId="$route.params.id"  :patientDetail="detail" /> -->
          </tab-content>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import IqCard from '../../components/xray/cards/iq-card'
import PatientPrescriptionList from './PatientComponents/PatientPrescriptionList'
import AttachmentList from './PatientComponents/AttachmentList'
import InraOralComponent from './PatientComponents/InraOralComponent'
import XrayComponent from './PatientComponents/XrayComponent'
import PatientDiagramV2 from './PatientDiagramV2'
import TreatmentHistory from './PatientComponents/TreatmentHistory'
import PatientInformation from './PatientComponents/PatientInformation'
import { xray } from '../../config/pluginInit'
import patient from '../../services/patient'
import medicalCondition from '../../services/medicalCondition'
import _ from 'lodash'
import { mapGetters } from 'vuex'
export default {
  name: 'PatientView',
  components: {
    IqCard,
    PatientPrescriptionList,
    AttachmentList,
    PatientDiagramV2,
    InraOralComponent,
    XrayComponent,
    TreatmentHistory,
    PatientInformation
  },
  mounted () {
    xray.index()
    this.fetchMedicalConditions()
  },
  data () {
    return {
      medicalConditions: [],
      showBalance: false,
      detail: {
        branch_id: this.userActiveBranch?.branch_id,
        patient_no_prefix: '',
        isUploadImg: false,
        first_name: '',
        middle_name: '',
        last_name: '',
        address_line1: '',
        address_line2: '',
        birth_date: '',
        height: '',
        weight: '',
        sex: '',
        civil_status: '',
        occupation: '',
        religion: '',
        profile_image: require('../../assets/images/user/11.png'),
        contact_no: '',
        nationality: '',
        email_address: '',
        general_physician: '',
        medical_last_visit: '',
        has_serious_illness: 'N',
        describe_illness: '',
        medical_condition: [],
        has_boold_transfusion: false,
        approximate_date: '',
        is_pregnant: false,
        taking_pills: false,
        taking_any_medications: false,
        if_has_med_specify: '',
        balance: 0,
        user_social: {
          facebook_url: '',
          twitter_url: '',
          instagram_url: '',
          linkedin_url: ''
        }
      },
      systemUserDetails: {},
      tabDetails: [
        { compName: 'PatientInformation', tabName: 'Personal Info' },
        { compName: 'TreatmentHistory', tabName: 'History' },
        { compName: 'PatientPrescriptionList', tabName: 'Prescriptions' },
        { compName: 'AttachmentList', tabName: 'Attachments' },
        { compName: 'PatientDiagramV2', tabName: 'Diagram' },
        { compName: 'InraOralComponent', tabName: 'Intra Oral' },
        { compName: 'XrayComponent', tabName: 'Xray Images' }
      ],
      patient_name: '',
      activeTab: 'PatientInformation'
    }
  },
  watch: {
    detail: _.debounce(function (data) {
      this.patient_name = this.detail?.first_name + ' ' + this.detail?.last_name
      this.showBalance = parseFloat(this.detail?.balance) > 0
    }),
    userActiveBranch: _.debounce(function (data) {
      this.fetchPatientById()
    }, 300)
  },
  computed: {
    ...mapGetters({
        userActiveBranch: 'Auth/userActiveBranch',
        userDetails: 'Auth/userDetails'
    })
  },
  methods: {
    activateClickTab (data) {
      console.log('activateClickTab', data)
      this.activeTab = data
    },
    fetchMedicalConditions () {
      medicalCondition.getAllMedicalConditions().then(({ data, status }) => {
        if (status === 200) {
          this.medicalConditions = data.data
        }
      }).catch(err => console.log(err))
      this.fetchPatientById()
    },
    fetchPatientById () {
      const id = this.$route.params.id
      if (this.userActiveBranch?.id) {
        patient.getPatientById(id, this.userActiveBranch?.id).then(response => {
          if (response.data.success) {
            this.setPatientInfo(response.data.data)
          }
        }).catch((error) => {
          if (error.response) {
            console.log(error.response.data)
            console.log(error.response.status)
            if (error.response.status === 404) {
              this.$router.push('/pages/error/404')
            }
            console.log(error.response.headers)
          } else if (error.request) {
            console.log(error.request)
          } else {
            console.log('Error', error.message)
          }
          console.log('error.config', error.config)
        })
      }
    },
    setPatientInfo (data) {
      if (data?.avatar) {
        var cnt = data?.avatar.split('/')
        if (cnt.length > 3) {
          this.detail.profile_image = data?.avatar
        } else {
          this.detail.profile_image = process.env.VUE_APP_API_BASE_URL + data?.avatar
        }
      }
      this.detail.isUploadImg = false
      this.detail.first_name = data?.first_name
      this.detail.branch_id = this.userActiveBranch?.id
      this.detail.patient_no_prefix = this.userActiveBranch?.patient_no_prefix
      this.detail.middle_name = data?.middle_name
      this.detail.last_name = data?.last_name
      this.detail.address_line1 = data?.address_line1
      this.detail.address_line2 = data?.address_line2
      this.detail.birth_date = data?.birth_date
      this.detail.height = data?.height
      this.detail.weight = data?.weight
      this.detail.sex = data?.sex
      this.detail.civil_status = data?.civil_status
      this.detail.occupation = data?.occupation
      this.detail.religion = data?.religion
      // this.detail.profile_image = data.avatar ? data.avatar : require('../../assets/images/user/11.png')
      this.detail.contact_no = data?.contact_no
      this.detail.nationality = data?.nationality
      this.detail.email_address = data?.email_address
      this.detail.general_physician = data?.general_physician
      this.detail.medical_last_visit = data?.medical_last_visit
      this.detail.has_serious_illness = data?.has_serious_illness
      this.detail.describe_illness = data?.describe_illness
      this.detail.has_boold_transfusion = data?.has_boold_transfusion === 'Y'
      this.detail.approximate_date = data?.approximate_date
      this.detail.is_pregnant = data?.is_pregnant === 'Y'
      this.detail.taking_pills = data?.taking_pills === 'Y'
      this.detail.taking_any_medications = data?.taking_any_medications === 'Y'
      this.detail.if_has_med_specify = data?.if_has_med_specify
      this.detail.balance = data?.balance
      this.detail.medical_condition = data?.medical_conditions.map(d => { return d?.id })
      this.detail.user_social = {
          facebook_url: data?.fb_account,
          twitter_url: data?.twitter_account,
          instagram_url: data?.instagram_account,
          linkedin_url: data?.linkedin_account
        }
    },
    setSystemUserDetails (evt) {
      this.systemUserDetails = evt
    }
  }
}
</script>

<style scoped>
img.profile-pic {
    width: 60% !important;
    max-width: 100% !important;
    display: inline-block !important;
    min-height: 180px !important;
}
</style>
