<template>
    <b-modal id="modal-add-activity" centered title="Add Activity" hide-footer cancel-title="Close">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(saveActivity)">
            <b-form-group class="col-md-12" label="Patient" label-for="patient">
                <b-form-input v-model="patient_name" type="text" name="patient" id="patient" placeholder="Patient" readonly></b-form-input>
            </b-form-group>
            <b-form-group class="col-md-12" label="Notes" label-for="notes">
                <b-form-textarea v-model="activityForm.rc_notes" id="notes" rows="5"></b-form-textarea>
            </b-form-group>
            <b-button class="mt-3 float-right" variant="primary" type="submit">Save</b-button>
        </form>
      </validation-observer>
    </b-modal>
</template>
<script>
    import activity from '../../../services/activity'
    import { mapGetters } from 'vuex'
    import _ from 'lodash'
    export default ({
        name: 'ActivityLogModal',
        props: {
            patientId: String,
            patientDetail: Object,
            isDentistRequired: Boolean
        },
        data () {
            return {
                patient_name: this.patientDetail?.first_name + ' ' + this.patientDetail?.last_name,
                activityForm: {
                    patient_id: this.patientId,
                    is_dentist_required: this.isDentistRequired,
                    rc_notes: '',
                    clinic_id: '',
                    branch_id: ''
                }
            }
        },
        computed: {
            ...mapGetters({
              userActiveBranch: 'Auth/userActiveBranch',
              userDetails: 'Auth/userDetails'
            })
        },
        watch: {
            'patientDetail.first_name': _.debounce(function (data) {
                this.patient_name = this.patientDetail?.first_name + ' ' + this.patientDetail?.last_name
            })
        },
        methods: {
            saveActivity () {
                this.activityForm.patient_id = this.patientId
                this.activityForm.is_dentist_required = this.isDentistRequired
                this.activityForm.clinic_id = this.userActiveBranch?.clinic_id
                this.activityForm.branch_id = this.userActiveBranch?.branch_id
                activity.createActivity(this.activityForm).then(response => {
                if (response.data.success) {
                    this.$swal('Activity save successfully!!!')
                    this.activityForm.is_dentist_required = false
                    this.activityForm.rc_notes = ''
                    this.$bvModal.hide('modal-add-activity')
                    this.$emit('triggerPatientActivities', true)
                }
                }).catch(err => console.log(err))
            }
        }
    })
</script>
