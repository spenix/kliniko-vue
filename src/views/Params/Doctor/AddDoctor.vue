<template>
  <b-container fluid>
    <validation-observer ref="observer" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(addDoctorSubmit)">
        <b-row>
          <b-col lg="3">
            <iq-card>
              <template v-slot:headerTitle>
                <h4 class="card-title">Add New Dentist</h4>
              </template>
              <template v-slot:body>
                <b-form-group>
                  <div class="add-img-user profile-img-edit">
                    <b-img class="profile-pic height-150 width-150" fluid :src="doctor.profile_image" alt="profile-pic" />
                    <input type="hidden" v-model="doctor.profile_image">
                    <div class="p-image">
                      <b-button variant="none" class="upload-button iq-bg-primary position-relative">
                        <input type="file" @change="previewImage" class="h-100 position-absolute" accept="image/jpg,image/png,image/jpeg" style="opacity: 0;" />
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
                  <b-form-input v-model="doctor.fb_account" id="furl" name="furl" placeholder="Facebook Url"></b-form-input>
                </b-form-group>
                <b-form-group
                  label="Twitter Url:"
                  label-for="turl"
                >
                  <b-form-input v-model="doctor.twitter_account" id="turl" name="turl" placeholder="Twitter Url"></b-form-input>
                </b-form-group>
                <b-form-group
                  label="Instagram Url:"
                  label-for="turl"
                >
                  <b-form-input v-model="doctor.instagram_account" id="instaurl" name="instaurl" placeholder="Instagram Url"></b-form-input>
                </b-form-group>
                <b-form-group
                  label="Linkedin Url:"
                  label-for="lurl"
                >
                  <b-form-input v-model="doctor.linkedin_account" id="lurl" placeholder="Linkedin Url"></b-form-input>
                </b-form-group>
              </template>
            </iq-card>
          </b-col>
          <b-col lg="9">
            <iq-card>
              <template v-slot:headerTitle>
                <h4 class="card-title">New Doctor Information</h4>
              </template>
              <template v-slot:body>
                <div class="new-doctor-info">
                  <b-row>
                    <b-form-group class="col-md-4" label="First Name:" label-for="first_name">
                      <ValidationProvider name="First name" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="doctor.first_name" type="text" placeholder="First Name" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-4" label="Middle Name:" label-for="middle_name">
                        <b-form-input v-model="doctor.middle_name" type="text" placeholder="Middle Name"></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-4" label="Last Name:" label-for="last_name">
                      <ValidationProvider name="Last name" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="doctor.last_name" type="text" placeholder="Last Name" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6"
                                  label="Street Address 1:"
                                  label-for="add1"
                    >
                      <ValidationProvider name="Street Address 1" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="doctor.address_line1" type="text" name="add1" id="add1" placeholder="Street Address 1" :class="(errors.length > 0 ? ' is-invalid' : '')" required></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6"
                                  label="Street Address 2:"
                                  label-for="add2"
                    >
                      <b-form-input v-model="doctor.address_line2" type="text" name="add2" id="add2" placeholder="Street Address 2"></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6"
                                  label="Birth Date:"
                                  label-for="birthdate"
                    >
                      <ValidationProvider name="Birth Date" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="doctor.birth_date" type="date" name="birthdate" id="birthdate" placeholder="Birthdate" :class="(errors.length > 0 ? ' is-invalid' : '')" required></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-sm-6"
                                  label-for="selectsex"
                                  label="Sex:">
                      <ValidationProvider name="Sex" rules="required" v-slot="{ errors }">
                        <b-form-select v-model="doctor.sex"  plain :options="sex" id="selectsex" :class="(errors.length > 0 ? ' is-invalid' : '')">
                          <template v-slot:first>
                            <b-form-select-option :value="null">Select Sex</b-form-select-option>
                          </template>
                        </b-form-select>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6"
                                  label="Height:"
                                  label-for="height"
                    >
                      <b-form-input v-model="doctor.height" type="text" name="height" id="height" placeholder="Height"></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Weight:" label-for="weight">
                        <b-form-input  v-model="doctor.weight" type="text" name="weight" id="weight" placeholder="Weight"></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6"
                                  label="Job Title:"
                                  label-for="job_title"
                    >
                      <b-form-input v-model="doctor.job_title" type="text" name="job_title" id="job_title" placeholder="Job Title"></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6"
                                  label="License No.:"
                                  label-for="license_no"
                    >
                    <ValidationProvider name="License No." rules="required" v-slot="{ errors }">
                      <b-form-input v-model="doctor.license_no" :class="(errors.length > 0 ? ' is-invalid' : '')" type="text" name="license_no" id="license_no" placeholder="License No." required></b-form-input>
                      <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                    </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-sm-6"
                                  label-for="selectcivilstatus"
                                  label="Civil Status:">
                      <b-form-select v-model="doctor.civil_status"  plain :options="civilstatus" id="selectcivilstatus">
                        <template v-slot:first>
                          <b-form-select-option :value="null">Select Sex</b-form-select-option>
                        </template>
                      </b-form-select>
                    </b-form-group>

                    <b-form-group class="col-md-6" label="Nationality:" label-for="nationality">
                      <b-form-input  v-model="doctor.nationality" type="text" name="nationality" id="nationality" placeholder="Nationality"></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Email Address:" label-for="email_address">
                      <ValidationProvider name="Email Address" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="doctor.email_address" type="email" placeholder="Email Address" :class="(errors.length > 0 ? ' is-invalid' : '')" required></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Contact No:" label-for="email_address">
                      <ValidationProvider name="Contact No." rules="required" v-slot="{ errors }">
                        <b-form-input v-model="doctor.contact_no" type="text" placeholder="Contact No." :class="(errors.length > 0 ? ' is-invalid' : '')" required></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                  </b-row>
                <b-button variant="primary" type="submit">Add New Doctor</b-button>
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
import { xray } from '../../../config/pluginInit'
import doctorService from '../../../services/doctor'
import { mapGetters } from 'vuex'
export default {
  name: 'AddDoctor',
  mounted () {
    xray.index()
  },
  data () {
    return {
      medicalConditions: [],
      errors: {},
      doctor: {
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
        job_title: '',
        license_no: '',
        profile_image: require('../../../assets/images/user/11.png'),
        contact_no: '',
        fb_account: '',
        twitter_account: '',
        linkedin_account: '',
        instagram_account: '',
        nationality: '',
        email_address: '',
        branch_id: ''
      },
      sex: [
        { value: 'male', text: 'Male' },
        { value: 'female', text: 'Female' }
      ],
      civilstatus: [
        { value: 'single', text: 'Single' },
        { value: 'married', text: 'Married' },
        { value: 'complicated', text: 'Complicated' }
      ],
      seriousillness: [
        { value: true, text: 'Yes' },
        { value: false, text: 'No' }
      ],
      users: []
    }
  },
  computed: {
    fullName: function () {
      return this.doctor.first_name + ' ' + this.doctor.last_name
    },
    ...mapGetters({
      userActiveBranch: 'Auth/userActiveBranch'
    })
  },
  methods: {
    previewImage: function (event) {
      const input = event.target
      if (input.files && input.files[0]) {
        const reader = new FileReader()

        reader.onload = (e) => {
          this.doctor.isUploadImg = true
          this.doctor.profile_image = e.target.result
        }

        reader.readAsDataURL(input.files[0])
      }
    },
    addDoctorSubmit () {
      this.$swal.fire({
        title: 'Do you want to save the record?',
        showCancelButton: true,
        confirmButtonText: 'Save'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.saveDoctorRecord()
        }
      })
    },
    saveDoctorRecord () {
      this.doctor.branch_id = this.userActiveBranch?.branch_id
      doctorService.createDoctor(this.doctor).then(response => {
        if (response.data.success) {
          this.$swal('Doctor Record save successfully!!!')
          this.$router.push('/doctor/doctor-list')
        }
      }).catch(errors => { console.log(errors) })
    }
  }
}
</script>
