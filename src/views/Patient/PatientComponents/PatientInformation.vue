<template>
  <tab-content-item :active="true" id="PatientInformation" >
    <b-row>
                <b-col lg="3">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Patient</h4>
                    </template>
                    <template v-slot:body>
                      <b-form-group>
                        <div class="user-profile text-center">
                          <img :src="patientDetail.profile_image" alt="profile-img" fluid class="profile-pic">
                        </div>
                      </b-form-group>
                      <b-form-group
                        label="Facebook Url:"
                        label-for="furl"
                        v-show="userDetails.role !== 'DA'"
                      >
                        <b-form-input v-model="patientDetail.user_social.facebook_url" id="furl" name="furl" placeholder="Facebook Url" disabled></b-form-input>
                      </b-form-group>
                      <b-form-group
                        label="Twitter Url:"
                        label-for="turl"
                        v-show="userDetails.role !== 'DA'"
                      >
                        <b-form-input v-model="patientDetail.user_social.twitter_url" id="turl" name="turl" placeholder="Twitter Url" disabled></b-form-input>
                      </b-form-group>
                      <b-form-group
                        label="Instagram Url:"
                        label-for="turl"
                        v-show="userDetails.role !== 'DA'"
                      >
                        <b-form-input id="instaurl" v-model="patientDetail.user_social.instagram_url" name="instaurl" placeholder="Instagram Url" disabled></b-form-input>
                      </b-form-group>
                      <b-form-group
                        label="Linkedin Url:"
                        label-for="lurl"
                        v-show="userDetails.role !== 'DA'"
                      >
                        <b-form-input id="lurl" v-model="patientDetail.user_social.linkedin_url" placeholder="Linkedin Url" disabled></b-form-input>
                      </b-form-group>
                    </template>
                  </iq-card>
                </b-col>
                <b-col lg="9">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Patient Information</h4>
                    </template>
                    <template v-slot:body>
                      <div class="new-patient-info">
                        <b-alert :show="patientDetail.balance > 0" variant=" "  fade class="text-white bg-danger">
                          <div class="iq-alert-icon">
                            <i class="ri-information-line"></i>
                          </div>
                          <div class="iq-alert-text">Patient has an existing balance of {{ patientDetail.balance }}</div>
                        </b-alert>
                        <b-row>
                          <b-form-group class="col-md-4" label="First Name:" label-for="first_name">
                              <b-form-input v-model="patientDetail.first_name" type="text" placeholder="First Name" disabled></b-form-input>
                          </b-form-group>
                          <b-form-group class="col-md-4" label="Middle Name:" label-for="middle_name">
                              <b-form-input v-model="patientDetail.middle_name" type="text" placeholder="Middle Name" disabled></b-form-input>
                          </b-form-group>
                          <b-form-group class="col-md-4" label="Last Name:" label-for="last_name">
                              <b-form-input v-model="patientDetail.last_name" type="text" placeholder="Last Name" disabled></b-form-input>
                          </b-form-group>
                          <b-form-group class="col-md-6"
                                        label="Street Address 1:"
                                        label-for="add1"
                                        v-show="userDetails.role !== 'DA'"
                          >
                            <b-form-input v-model="patientDetail.address_line1" type="text" name="add1" id="add1" placeholder="Street Address 1" disabled></b-form-input>
                          </b-form-group>
                          <b-form-group class="col-md-6"
                                        label="Street Address 2:"
                                        label-for="add2"
                                        v-show="userDetails.role !== 'DA'"
                          >
                            <b-form-input v-model="patientDetail.address_line2" type="text" name="add2" id="add2" placeholder="Street Address 2" disabled></b-form-input>
                          </b-form-group>
                          <b-form-group class="col-md-6"
                                        label="Birth Date:"
                                        label-for="birthdate"
                          >
                              <b-form-input v-model="patientDetail.birth_date" type="date" name="birthdate" id="birthdate" placeholder="Birthdate" disabled></b-form-input>
                          </b-form-group>
                          <b-form-group class="col-sm-6"
                                        label-for="selectsex"
                                        label="Sex:">
                              <b-form-select v-model="patientDetail.sex"  plain :options="sex" id="selectsex" disabled>
                                <template v-slot:first>
                                  <b-form-select-option :value="null">Select Sex</b-form-select-option>
                                </template>
                              </b-form-select>
                          </b-form-group>
                          <b-form-group class="col-md-6"
                                        label="Height:"
                                        label-for="height"
                          >
                            <b-form-input v-model="patientDetail.height" type="text" name="height" id="height" placeholder="Height" disabled></b-form-input>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Weight:" label-for="weight">
                            <b-form-input  v-model="patientDetail.weight" type="text" name="weight" id="weight" placeholder="Weight" disabled></b-form-input>
                          </b-form-group>

                          <b-form-group class="col-md-6"
                                        label="Occupation:"
                                        label-for="occupation"
                          >
                            <b-form-input v-model="patientDetail.occupation" type="text" name="occupation" id="occupation" placeholder="Occupation" disabled></b-form-input>
                          </b-form-group>

                          <b-form-group class="col-sm-6"
                                        label-for="selectcivilstatus"
                                        label="Civil Status:">
                            <b-form-select v-model="patientDetail.civil_status"  plain :options="civilstatus" id="selectcivilstatus" disabled>
                              <template v-slot:first>
                                <b-form-select-option :value="null">Select Civil Status</b-form-select-option>
                              </template>
                            </b-form-select>
                          </b-form-group>

                          <b-form-group class="col-md-6" label="Nationality:" label-for="nationality">
                            <b-form-input  v-model="patientDetail.nationality" type="text" name="nationality" id="nationality" placeholder="Nationality" disabled></b-form-input>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Email Address:" label-for="email_address" v-show="userDetails.role !== 'DA'">
                              <b-form-input v-model="patientDetail.email_address" type="email" placeholder="Email Address" disabled></b-form-input>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Contact No:" label-for="contact_no" v-show="userDetails.role !== 'DA'">
                              <b-form-input v-model="patientDetail.contact_no" type="text" placeholder="Contact No." disabled></b-form-input>
                          </b-form-group>
                          </b-row>
                          <hr>
                          <h5 class="mb-3">Medical History</h5>
                          <b-row>
                            <b-form-group class="col-md-6" label="General Physician Name" label-for="general_physician">
                              <b-form-input  v-model="patientDetail.general_physician" type="text" name="general_physician" id="general_physician" placeholder="General Physician Name" disabled></b-form-input>
                            </b-form-group>
                            <b-form-group class="col-md-6"
                                          label="Date of Last Visit:"
                                          label-for="medical_last_visit"
                            >
                              <b-form-input v-model="patientDetail.medical_last_visit" type="date" name="medical_last_visit" id="medical_last_visit" placeholder="Date of Last Visit" disabled></b-form-input>
                            </b-form-group>
                            <b-form-group class="col-sm-6"
                                          label-for="has_serious_illness"
                                          label="Have you had serious illness?">
                              <b-form-select v-model="patientDetail.has_serious_illness"  plain :options="seriousillness" id="has_serious_illness" disabled>
                                <template v-slot:first>
                                  <b-form-select-option :value="null">Select Option</b-form-select-option>
                                </template>
                              </b-form-select>
                            </b-form-group>
                            <b-form-group class="col-md-6" label="If yes, describe:" label-for="describe_illness">
                              <b-form-input  v-model="patientDetail.describleillness" type="text" name="describleillness" id="describe_illness" placeholder="Describle Illness, if yes" disabled></b-form-input>
                            </b-form-group>
                          </b-row>
                          <b-row>
                            <div class="col-1 text-center">Yes</div>
                            <div class="col-1 text-center">No</div>
                            <div class="col-10"></div>
                          </b-row>
                          <b-row>
                            <div class="col-1 text-center"><input type="checkbox" name="has_boold_transfusion" id="bt_yes" :checked="patientDetail.has_boold_transfusion === true" disabled></div>
                            <div class="col-1 text-center"><input type="checkbox" name="has_boold_transfusion" id="bt_no" :checked="patientDetail.has_boold_transfusion === false " disabled></div>
                            <div class="col-5">Have you ever had a boold transfusion?</div>
                            <div class="col-5">If yes, give approximate date: <input type="date" class="form-control" name="approximate_date" id="approximate_date" v-model="patientDetail.approximate_date" disabled></div>
                          </b-row>
                          <b-row>
                            <div class="col-1 text-center"><input type="checkbox" name="is_pregnant" id="pregnant_yes" :checked="patientDetail.is_pregnant === true" disabled></div>
                            <div class="col-1 text-center"><input type="checkbox" name="is_pregnant" id="pregnant_no" :checked="patientDetail.is_pregnant === false" disabled></div>
                            <div class="col-10"><strong>(For women only)</strong> Are you Pregnant?</div>
                          </b-row>
                          <b-row>
                            <div class="col-1 text-center"><input type="checkbox" name="taking_pills" id="taking_pills_yes" :checked="patientDetail.taking_pills === true" disabled></div>
                            <div class="col-1 text-center"><input type="checkbox" name="taking_pills" id="taking_pills_no" :checked="patientDetail.taking_pills === false" disabled></div>
                            <div class="col-10">Taking control pills?</div>
                          </b-row>
                          <b-row>
                            <div class="col-1 text-center"><input type="checkbox" name="taking_any_medications" id="taking_any_medications_yes" :checked="patientDetail.taking_any_medications == true" disabled></div>
                            <div class="col-1 text-center"><input type="checkbox" name="taking_any_medications" id="taking_any_medications_no" :checked="patientDetail.taking_any_medications == false" disabled></div>
                            <div class="col-10">Are you taking any medications?</div>
                          </b-row>
                          <b-row>
                            <div class="col-2"></div>
                            <div class="col-10">If yes, please specify: <textarea name="specify-medications" class="form-control" id="specify-medications" rows="3" v-model="patientDetail.if_has_med_specify" disabled></textarea></div>
                          </b-row>
                          <hr>
                          <h5 class="mb-3">Medical Condition</h5>
                          <b-row>
                            <div class="checkbox col-md-4" v-for="medCon in medicalConditions" :key="medCon.id">
                              <label><input class="mr-2" type="checkbox" :value="medCon.id" v-model="patientDetail.medical_condition" disabled>{{ medCon.name }}</label>
                            </div>
                          </b-row>
                      </div>
                    </template>
                  </iq-card>
                </b-col>
              </b-row>
  </tab-content-item>
</template>
<style>
.user-profile {
  display: inline-block;
  height: 150px;
  width: 150px;
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
</style>
<script>
    export default {
        name: 'PatientInformation',
        props: {
            patientDetail: Object,
            userDetails: Object,
            medicalConditions: Array
        },
        data () {
            return {
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
                ]
            }
        }
    }
</script>
