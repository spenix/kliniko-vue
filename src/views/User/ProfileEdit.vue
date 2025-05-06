<template>
  <b-container fluid>
    <form>
      <b-row>
        <b-col lg="12">
          <iq-card body-class="p-0">
            <template v-slot:body>
              <div class="iq-edit-list">
                <tab-nav :pills="true" class="iq-edit-profile d-flex">
                  <tab-nav-items class="col-md-6 p-0" :active="true" href="#personal-information" title="Personal Information" />
                  <tab-nav-items class="col-md-6 p-0" :active="false" href="#chang-pwd" title=" Change Password" />
                </tab-nav>
              </div>
            </template>
          </iq-card>
        </b-col>
        <b-col lg="12">
          <div class="iq-edit-list-data">
            <tab-content id="pills-tabContent-2">
              <tab-content-item :active="true" id="personal-information" >
                <iq-card>
                  <template v-slot:headerTitle>
                    <h4 class="card-title">Personal Information</h4>
                  </template>
                  <template v-slot:body>
                    <b-alert :show="errorMsg != ''" variant=" " dismissible fade class="text-white bg-info">
                      <div class="iq-alert-icon">
                        <i class="ri-information-line"></i>
                      </div>
                      <div class="iq-alert-text">{{ errorMsg }}</div>
                    </b-alert>
                      <form @submit.prevent="submitPersonalInfo">
                        <b-form-group class="row align-items-center">
                        <b-col md="12">
                          <div class="profile-img-edit">
                            <b-img :src="user.profile_path" class="profile-pic height-150 width-150" alt="profile-pic"/>
                            <input type="hidden" v-model="user.profile_path">
                            <div class="p-image">
                              <div class="position-relative"><b-form-file class="h-100 position-absolute ml-0" accept="image/*" style="opacity: 0;" @change="previewImage"></b-form-file>
                                <i class="ri-pencil-line upload-button"></i>
                              </div>
                            </div>
                          </div>
                        </b-col>
                      </b-form-group>
                      <b-row align-v="center">
                        <b-form-group class="col-md-6" label="First Name" label-for="firstname">
                            <b-form-input v-model="user.firstname" type="text" placeholder="First Name" :class="(errors?.firstname?.length > 0 ? ' is-invalid' : '')"></b-form-input>
                            <div class="invalid-feedback" v-for="(err, i) in errors?.firstname" :key="`firstnameErr-${i}`">
                              <span>{{ err }}</span>
                            </div>
                        </b-form-group>
                        <b-form-group class="col-md-6" label="Middle Name" label-for="middlename">
                            <b-form-input v-model="user.middlename" type="text" placeholder="Middle Name" :class="(errors?.middlename?.length > 0 ? ' is-invalid' : '')"></b-form-input>
                            <div class="invalid-feedback" v-for="(err, i) in errors?.middlename" :key="`middlenameErr-${i}`">
                              <span>{{ err }}</span>
                            </div>
                        </b-form-group>
                        <b-form-group class="col-md-6" label="Last Name" label-for="lastname">
                            <b-form-input v-model="user.lastname" type="text" placeholder="Last Name" :class="(errors?.lastname?.length > 0 ? ' is-invalid' : '')"></b-form-input>
                            <div class="invalid-feedback" v-for="(err, i) in errors?.lastname" :key="`lastnameErr-${i}`">
                              <span>{{ err }}</span>
                            </div>
                        </b-form-group>
                        <b-form-group class="col-md-6" label="Email" label-for="email">
                            <b-form-input v-model="user.email" type="email" placeholder="Email" :class="(errors?.email?.length > 0 ? ' is-invalid' : '')"></b-form-input>
                            <div class="invalid-feedback" v-for="(err, i) in errors?.email" :key="`emailErr-${i}`">
                              <span>{{ err }}</span>
                            </div>
                        </b-form-group>
                        <b-form-group class="col-sm-6" label="Gender:" label-class="d-block">
                          <b-form-radio inline v-model="user.gender" value="Male">Male</b-form-radio>
                          <b-form-radio inline v-model="user.gender" value="Female">Female</b-form-radio>
                        </b-form-group>
                        <b-form-group class="col-sm-6" label="Date Of Birth:" label-for="birthdate">
                          <b-form-input type="date" v-model="user.birthdate" id="birthdate" :class="(errors?.birthdate?.length > 0 ? ' is-invalid' : '')"></b-form-input>
                          <div class="invalid-feedback" v-for="(err, i) in errors?.birthdate" :key="`birthdateErr-${i}`">
                            <span>{{ err }}</span>
                          </div>
                        </b-form-group>
                        <b-form-group class="col-md-6" label="Address:" label-for="uname">
                          <b-form-input v-model="user.address" type="text" placeholder="Address" :class="(errors?.address?.length > 0 ? ' is-invalid' : '')"></b-form-input>
                          <div class="invalid-feedback" v-for="(err, i) in errors?.address" :key="`addressErr-${i}`">
                            <span>{{ err }}</span>
                          </div>
                        </b-form-group>
                        <b-form-group class="col-md-6" label="Mobile No.:" label-for="uname">
                          <b-form-input v-model="user.mobile_number" type="text" placeholder="Mobile No." :class="(errors?.mobile_number?.length > 0 ? ' is-invalid' : '')"></b-form-input>
                          <div class="invalid-feedback" v-for="(err, i) in errors?.mobile_number" :key="`mobilenumErr-${i}`">
                            <span>{{ err }}</span>
                          </div>
                        </b-form-group>
                        <b-form-group class="col-md-6" label="Phone No.:" label-for="uname">
                          <b-form-input v-model="user.phone_number" type="text" placeholder="Phone No." :class="(errors?.phone_number?.length > 0 ? ' is-invalid' : '')"></b-form-input>
                          <div class="invalid-feedback" v-for="(err, i) in errors?.phone_number" :key="`phonenumErr-${i}`">
                            <span>{{ err }}</span>
                          </div>
                        </b-form-group>
                        <b-form-group class="col-md-6" label="Role:" label-for="uname">
                          <b-form-input v-model="user.role" type="text" placeholder="Role" readonly></b-form-input>
                        </b-form-group>
                      </b-row>
                      <b-button type="submit" variant="primary" class="mr-2">Submit</b-button>
                      <b-button type="reset" variant="none" class="iq-bg-danger">Cancel</b-button>
                      </form>
                  </template>
                </iq-card>
              </tab-content-item>
              <tab-content-item :active="false" id="chang-pwd">
                <iq-card>
                  <template v-slot:headerTitle>
                    <h4 class="card-title">Change Password</h4>
                  </template>
                  <template v-slot:body>
                    <b-alert :show="errorMsg != ''" dismissible fade>{{ errorMsg }}</b-alert>
                    <form @submit.prevent="changePasswordFormAction">
                      <b-form-group class="col-md-6" label="Current Password:">
                        <b-form-input type="password" id="cpass" v-model="changePasswordForm.current_password"  placeholder="Current Password" :class="(errors?.current_password?.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback" v-for="(err, i) in errors?.current_password" :key="`curErr-${i}`">
                            <span>{{ err }}</span>
                          </div>
                      </b-form-group>
                      <b-form-group class="col-md-6" label="New Password:" label-for="pass">
                        <ValidationProvider name="Password" rules="required" v-slot="{ errors }">
                          <b-form-input v-model="changePasswordForm.password" type="password" placeholder="Password" :class="(errors?.password?.length > 0 ? ' is-invalid' : '')"></b-form-input>
                          <div class="invalid-feedback" v-for="(err, i) in errors?.password" :key="`passErr-${i}`">
                            <span>{{ err }}</span>
                          </div>
                        </ValidationProvider>
                      </b-form-group>
                      <b-form-group class="col-md-6" label="Repeat Password:" label-for="rpass">
                          <b-form-input v-model="changePasswordForm.password_confirmation" type="password" placeholder="Repeat Password" :class="(errors?.password_confirmation?.length > 0 ? ' is-invalid' : '')"></b-form-input>
                          <div class="invalid-feedback" v-for="(err, i) in errors?.password_confirmation" :key="`passConErr-${i}`">
                            <span>{{ err }}</span>
                          </div>
                      </b-form-group>
                      <b-button type="submit" variant="primary" class="mr-2">Submit</b-button>
                      <b-button type="reset" variant="none" class="iq-bg-danger">Cancel</b-button>
                    </form>
                  </template>
                </iq-card>
              </tab-content-item>
            </tab-content>
          </div>
        </b-col>
      </b-row>
    </form>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import userProfileService from '../../services/userProfile'
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ProfileEdit',
  mounted () {
    xray.index()
    this.setUserPersonalInfo(this.userDetails)
  },
  data () {
    return {
      userRoles: [ { text: 'SYSTEM ADMINISTRATOR', value: 'SA' },
        { text: 'ADMINISTRATOR', value: 'AD' },
        { text: 'OPERATIONAL MANAGER', value: 'OM' },
        { text: 'OFFICER IN CHARGE', value: 'OIC' },
        { text: 'DENTAL ASSISTANT', value: 'DA' },
        { text: 'Receptionist', value: 'RC' }
      ],
      user: {
        name: '',
        firstname: '',
        lastname: '',
        middlename: '',
        email: '',
        address: '',
        isUploadImg: false,
        profile_path: require('../../assets/images/user/11.png'),
        mobile_number: '',
        phone_number: '',
        role: '',
        gender: '',
        birthdate: ''
      },
      errorMsg: '',
      errors: {},
      changePasswordForm: {
        current_password: '',
        password: '',
        password_confirmation: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      userDetails: 'Auth/userDetails'
    })
  },
  watch: {
    userDetails: _.debounce(function (data) {
        this.setUserPersonalInfo(data)
    })
  },
  methods: {
    ...mapActions({
      userDetailsAction: 'Auth/userDetailsAction'
    }),
    setUserPersonalInfo (data) {
      this.isUploadImg = false
      if (data?.profile_path) {
        var cnt = data.profile_path.split('/')
        if (cnt.length > 3) {
          this.user.profile_path = data?.profile_path
        } else {
          this.user.profile_path = process.env.VUE_APP_API_BASE_URL + data?.profile_path
        }
      }
      this.user.name = data?.name
      this.user.email = data?.email
      this.user.firstname = data?.firstname
      this.user.lastname = data?.lastname
      this.user.middlename = data?.middlename
      this.user.address = data?.address
      this.user.mobile_number = data?.mobile_num
      this.user.phone_number = data?.phone_num
      this.user.gender = data?.gender ?? 'Male'
      this.user.birthdate = data?.birthdate
      this.getUserRoleName(data)
    },
    getUserRoleName (userDatail) {
      if (userDatail) {
        var d = this.userRoles.find(d => {
          return d?.value === userDatail?.role
        })
        this.user.role = d?.text ?? 'N/A'
        console.log(this.user.role)
       }
    },
    previewImage: function (event) {
      const input = event.target
      if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.user.profile_path = e.target.result
          this.user.isUploadImg = true
        }
        reader.readAsDataURL(input.files[0])
      }
    },
    submitPersonalInfo () {
      this.errorMsg = ''
      this.$swal.fire({
          title: 'Are you sure you want to change your personal information?',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
      }).then((result) => {
          if (result.isConfirmed) {
            userProfileService.userPersonalInfo(this.user)
            .then(({ data }) => {
              if (data?.success) {
                this.userDetailsAction(data?.data)
                this.$swal(data?.message)
              } else {
                this.errors = data?.errors
                this.errorMsg = data?.message
              }
            })
            .catch(error => {
              console.log(error)
            })
          }
      })
    },
    changePasswordFormAction () {
      this.errorMsg = ''
      this.$swal.fire({
          title: 'Are you sure you want to change your password?',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
      }).then((result) => {
          if (result.isConfirmed) {
            userProfileService.userChangePassword(this.changePasswordForm)
            .then(({ data }) => {
              if (data?.success) {
                this.$swal(data?.message)
              } else {
                this.errors = data?.errors
                this.errorMsg = data?.message
              }
            })
            .catch(error => {
              console.log(error)
            })
          }
      })
    }
  }
}
</script>
<style>
.profile-pic {
  width: 100% !important;
}
</style>
