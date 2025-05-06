<template>
  <b-container fluid>
    <validation-observer ref="observer" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(addPatientSubmit)">
        <b-row>
          <b-col lg="3">
            <iq-card>
              <template v-slot:headerTitle>
                <h4 class="card-title">Add New Patient</h4>
              </template>
              <template v-slot:body>
                <b-form-group>
                  <div class="add-img-user profile-img-edit">
                    <b-img class="profile-pic height-150 width-150" fluid :src="patient.profile_image" alt="profile-pic" />
                    <input type="hidden" v-model="patient.profile_image">
                    <div class="p-image">
                      <b-button variant="none" class="upload-button iq-bg-primary position-relative">
                        <input type="file" ref="imageFile" @change="previewImage" class="h-100 position-absolute" accept="image/jpg,image/png,image/jpeg" style="opacity: 0;" />
                        File Upload
                      </b-button>
                    </div>
                  </div>
                  <div class="img-extension mt-3">
                    <div class="d-inline-block align-items-center">
                      <span>Only</span>
                      <b-link href="javascript:void(0);">.jpg</b-link>
                      <b-link href="javascript:void(0);">.png</b-link>
                      <b-link href="javascript:void(0);">.jpeg</b-link>
                      <span>allowed</span>
                    </div>
                  </div>
                </b-form-group>
                <b-form-group
                  label="Facebook Url:"
                  label-for="furl"
                >
                  <b-form-input v-model="patient.user_social.facebook_url" id="furl" name="furl" placeholder="Facebook Url"></b-form-input>
                </b-form-group>
                <b-form-group
                  label="Twitter Url:"
                  label-for="turl"
                >
                  <b-form-input v-model="patient.user_social.twitter_url" id="turl" name="turl" placeholder="Twitter Url"></b-form-input>
                </b-form-group>
                <b-form-group
                  label="Instagram Url:"
                  label-for="turl"
                >
                  <b-form-input id="instaurl" v-model="patient.user_social.instagram_url" name="instaurl" placeholder="Instagram Url"></b-form-input>
                </b-form-group>
                <b-form-group
                  label="Linkedin Url:"
                  label-for="lurl"
                >
                  <b-form-input id="lurl" v-model="patient.user_social.linkedin_url" placeholder="Linkedin Url"></b-form-input>
                </b-form-group>
              </template>
            </iq-card>
          </b-col>
          <b-col lg="9">
            <iq-card>
              <template v-slot:headerTitle>
                <h4 class="card-title">New Patient Information</h4>
              </template>
              <template v-slot:body>
                <div class="new-patient-info">
                  <b-row>
                    <b-form-group class="col-md-4 required" label="First Name:" label-for="first_name">
                      <ValidationProvider name="First name" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="patient.first_name" type="text" placeholder="First Name" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-4" label="Middle Name:" label-for="middle_name">
                        <b-form-input v-model="patient.middle_name" type="text" placeholder="Middle Name"></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-4 required" label="Last Name:" label-for="last_name">
                      <ValidationProvider name="Last name" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="patient.last_name" type="text" placeholder="Last Name" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6 required"
                                  label="Street Address 1:"
                                  label-for="add1"
                    >
                      <b-form-input v-model="patient.address_line1" type="text" name="add1" id="add1" placeholder="Street Address 1"></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6 required"
                                  label="Street Address 2:"
                                  label-for="add2"
                    >
                      <b-form-input v-model="patient.address_line2" type="text" name="add2" id="add2" placeholder="Street Address 2"></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6 required"
                                  label="Birth Date:"
                                  label-for="birthdate"
                    >
                      <ValidationProvider name="Birth Date" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="patient.birth_date" type="date" name="birthdate" id="birthdate" placeholder="Birthdate" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-sm-6"
                                  label-for="selectsex"
                                  label="Sex:">
                        <b-form-select v-model="patient.sex"  plain :options="sex" id="selectsex" :class="(errors.length > 0 ? ' is-invalid' : '')">
                          <template v-slot:first>
                            <b-form-select-option :value="null">Select Sex</b-form-select-option>
                          </template>
                        </b-form-select>
                    </b-form-group>
                    <b-form-group class="col-md-6"
                                  label="Height:"
                                  label-for="height"
                    >
                      <b-form-input v-model="patient.height" type="text" name="height" id="height" placeholder="Height"></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Weight:" label-for="weight">
                      <b-form-input  v-model="patient.weight" type="text" name="weight" id="weight" placeholder="Weight"></b-form-input>
                    </b-form-group>

                    <b-form-group class="col-md-6"
                                  label="Occupation:"
                                  label-for="occupation"
                    >
                      <b-form-input v-model="patient.occupation" type="text" name="occupation" id="occupation" placeholder="Occupation"></b-form-input>
                    </b-form-group>

                    <b-form-group class="col-sm-6"
                                  label-for="selectcivilstatus"
                                  label="Civil Status:">
                      <b-form-select v-model="patient.civil_status"  plain :options="civilstatus" id="selectcivilstatus">
                        <template v-slot:first>
                          <b-form-select-option :value="null">Select Civil Status</b-form-select-option>
                        </template>
                      </b-form-select>
                    </b-form-group>

                    <b-form-group class="col-md-6" label="Nationality:" label-for="nationality">
                      <b-form-input  v-model="patient.nationality" type="text" name="nationality" id="nationality" placeholder="Nationality"></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Email Address:" label-for="email_address">
                        <b-form-input v-model="patient.email_address" type="email" placeholder="Email Address" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6 required" label="Contact No:" label-for="contact_no">
                      <ValidationProvider name="Contact No." rules="required" v-slot="{ errors }">
                        <b-form-input v-model="patient.contact_no" type="text" placeholder="Contact No." :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>

                    </b-row>
                    <hr>
                    <h5 class="mb-3">Medical History</h5>
                    <b-row>
                      <b-form-group class="col-md-6" label="General Physician Name" label-for="general_physician">
                        <b-form-input  v-model="patient.general_physician" type="text" name="general_physician" id="general_physician" placeholder="General Physician Name"></b-form-input>
                      </b-form-group>
                      <b-form-group class="col-md-6"
                                    label="Date of Last Visit:"
                                    label-for="medical_last_visit"
                      >
                        <b-form-input v-model="patient.medical_last_visit" type="date" name="medical_last_visit" id="medical_last_visit" placeholder="Date of Last Visit"></b-form-input>
                      </b-form-group>
                      <b-form-group class="col-sm-6"
                                    label-for="has_serious_illness"
                                    label="Have you had serious illness?">
                        <b-form-select v-model="patient.has_serious_illness"  plain :options="seriousillness" id="has_serious_illness">
                          <template v-slot:first>
                            <b-form-select-option :value="null">Select Option</b-form-select-option>
                          </template>
                        </b-form-select>
                      </b-form-group>
                      <b-form-group class="col-md-6" label="If yes, describe:" label-for="describe_illness">
                        <b-form-input  v-model="patient.describleillness" type="text" name="describleillness" id="describe_illness" placeholder="Describle Illness, if yes"></b-form-input>
                      </b-form-group>
                    </b-row>
                    <b-row>
                      <div class="col-1 text-center">Yes</div>
                      <div class="col-1 text-center">No</div>
                      <div class="col-10"></div>
                    </b-row>
                    <b-row>
                      <div class="col-1 text-center"><input type="checkbox" name="has_boold_transfusion" id="bt_yes" :checked="patient.has_boold_transfusion === true" @click="clickCheckboxAction(true, 'has_boold_transfusion')"></div>
                      <div class="col-1 text-center"><input type="checkbox" name="has_boold_transfusion" id="bt_no" :checked="patient.has_boold_transfusion === false " @click="clickCheckboxAction(false, 'has_boold_transfusion')"></div>
                      <div class="col-5">Have you ever had a boold transfusion?</div>
                      <div class="col-5">If yes, give approximate date: <input type="date" class="form-control" name="approximate_date" id="approximate_date" v-model="patient.approximate_date"></div>
                    </b-row>
                    <b-row>
                      <div class="col-1 text-center"><input type="checkbox" name="is_pregnant" id="pregnant_yes" :checked="patient.is_pregnant === true" @click="clickCheckboxAction(true, 'is_pregnant')"></div>
                      <div class="col-1 text-center"><input type="checkbox" name="is_pregnant" id="pregnant_no" :checked="patient.is_pregnant === false" @click="clickCheckboxAction(false, 'is_pregnant')"></div>
                      <div class="col-10"><strong>(For women only)</strong> Are you Pregnant?</div>
                    </b-row>
                    <b-row>
                      <div class="col-1 text-center"><input type="checkbox" name="taking_pills" id="taking_pills_yes" :checked="patient.taking_pills === true" @click="clickCheckboxAction(true, 'taking_pills')"></div>
                      <div class="col-1 text-center"><input type="checkbox" name="taking_pills" id="taking_pills_no" :checked="patient.taking_pills === false" @click="clickCheckboxAction(false, 'taking_pills')"></div>
                      <div class="col-10">Taking control pills?</div>
                    </b-row>
                    <b-row>
                      <div class="col-1 text-center"><input type="checkbox" name="taking_any_medications" id="taking_any_medications_yes" :checked="patient.taking_any_medications == true" @click="clickCheckboxAction(true, 'taking_any_medications')"></div>
                      <div class="col-1 text-center"><input type="checkbox" name="taking_any_medications" id="taking_any_medications_no" :checked="patient.taking_any_medications == false" @click="clickCheckboxAction(false, 'taking_any_medications')"></div>
                      <div class="col-10">Are you taking any medications?</div>
                    </b-row>
                    <b-row>
                      <div class="col-2"></div>
                      <div class="col-10">If yes, please specify: <textarea name="specify-medications" class="form-control" id="specify-medications" rows="3" v-model="patient.if_has_med_specify"></textarea></div>
                    </b-row>
                    <hr>
                    <h5 class="mb-3">Medical Condition</h5>
                    <b-row>
                      <div class="checkbox col-md-4" v-for="medCon in medicalConditions" :key="medCon.id">
                        <label><input class="mr-2" type="checkbox" :value="medCon.id" v-model="patient.medical_condition" @click="checkedMdCondition($event)">{{ medCon.name }}</label>
                      </div>
                    </b-row>
                  <b-button variant="primary" type="submit">Add New Patient</b-button>
                </div>
              </template>
            </iq-card>
          </b-col>
        </b-row>
      </form>
    </validation-observer>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import medicalCondition from '../../services/medicalCondition'
import patientService from '../../services/patient'
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'AddPatient',
  mounted () {
    xray.index()
    this.fetchMedicalConditions()
  },
  data () {
    return {
      medicalConditions: [],
      errors: {},
      patient: {
        branch_id: '',
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
        sex: 'male',
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
        user_social: {
          facebook_url: '',
          twitter_url: '',
          instagram_url: '',
          linkedin_url: ''
        }
      },
      roles: [
        { text: 'Web Designer', value: 'Web Designer' },
        { text: 'Web Developer', value: 'Web Developer' },
        { text: 'Tester', value: 'Tester' },
        { text: 'Php Developer', value: 'Php Developer' },
        { text: 'Ios Developer', value: 'Ios Developer' }
      ],
      sex: [
        { value: 'male', text: 'Male' },
        { value: 'female', text: 'Female' }
      ],
      civilstatus: [
        { value: 'single', text: 'Single' },
        { value: 'married', text: 'Married' }
      ],
      seriousillness: [
        { value: 'Y', text: 'Yes' },
        { value: 'N', text: 'No' }
      ],
      users: []
    }
  },
  computed: {
    ...mapGetters({
        userActiveBranch: 'Auth/userActiveBranch'
    })
  },
  watch: {
    userActiveBranch: _.debounce(function (data) {
      this.patient.branch_id = data?.id
      this.patient.patient_no_prefix = data?.patient_no_prefix
    })
  },
  methods: {
    clickCheckboxAction (stat, field) {
      this.patient[field] = stat
    },
    previewImage: function (event) {
      const input = event.target
      if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.patient.isUploadImg = true
          this.patient.profile_image = e.target.result
        }
        reader.readAsDataURL(input.files[0])
      }
    },
    checkedMdCondition () {
      if (event.target.checked) {
        this.patient.medical_condition.push(event.target.value)
      } else {
        this.patient.medical_condition = this.patient.medical_condition.filter((d) => {
          if (d !== event.target.value) {
            return d
          }
        })
      }
    },
    fetchMedicalConditions () {
      medicalCondition.getAllMedicalConditions().then(({ data, status }) => {
        if (status === 200) {
          this.medicalConditions = data.data
        }
      }).catch(err => console.log(err))
    },
    addPatientSubmit () {
      this.$swal.fire({
        title: 'Do you want to save the record?',
        showCancelButton: true,
        confirmButtonText: 'Save'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.savePatientRecord()
        }
      })
    },
    savePatientRecord () {
      this.patient.branch_id = this.userActiveBranch?.id
      this.patient.patient_no_prefix = this.userActiveBranch?.patient_no_prefix
      patientService.createPatient(this.patient).then(response => {
        if (response.data.success) {
          this.$swal('Patient Record save successfully!!!')
          this.$router.push('/patient/patient-list')
        }
      }).catch(err => console.log(err))
    }
  }
}
</script>
