<template>
    <b-modal id="modal-recommendation" title="Recommendation" hide-footer>
        <form @submit.prevent="handleSubmit(saveProcedure)">
            <div class="row">
                <div class="col-12 required">
                    <b-form-group class="col-md-12" label="Treatment" label-for="treatment">
                        <b-form-input id="treatment" v-model="dataForm.treatment" type="text" placeholder="Enter Treatment"></b-form-input>
                    </b-form-group>
                </div>
                <div class="col-12 required">
                    <b-form-group class="col-md-12" label="Next Visit Recommendation" label-for="next_visit_recom">
                        <b-form-textarea v-model="dataForm.next_visit_recom" id="next_visit_recom" rows="3"></b-form-textarea>
                    </b-form-group>
                </div>
                <!-- <div class="col-12 required">
                    <b-form-group class="col-md-12" label="D.A On Duty" label-for="da_on_duty">
                        <b-form-input id="da_on_duty" v-model="dataForm.da_on_duty" type="text" placeholder="Enter D.A On Duty"></b-form-input>
                    </b-form-group>
                </div> -->
                <div class="col-12 text-right">
                    <b-button class="mt-3 mx-2" @click="$bvModal.hide('modal-recommendation')">Cancel</b-button>
                    <b-button class="mt-3 mx-2" variant="primary" type="submit" :disabled="isLoading">{{ form_action === 'Edit' ? 'Update' : 'Save'}}</b-button>
                </div>
            </div>
        </form>
    </b-modal>
</template>
<script>
    import activityRecomendation from '../../services/activity-recomendation'
    import _ from 'lodash'
    export default {
        name: 'RecommendationModal',
        data () {
            return {
                isLoading: false,
                dataForm: {
                    activity_id: this.activityId,
                    patient_id: this.patientId,
                    id: '',
                    treatment: '',
                    next_visit_recom: ''
                    // da_on_duty: ''
                }
            }
        },
        props: {
            selectedRecommendation: Object,
            form_action: String,
            activityId: String,
            patientId: String
        },
        watch: {
            selectedRecommendation: _.debounce(function (data) {
                this.clearDataForm()
                this.setupDataForm(data)
            }),
            activityId: _.debounce(function (data) {
                this.dataForm.activity_id = data
            }),
            patientId: _.debounce(function (data) {
                this.dataForm.patient_id = data
            })
        },
        methods: {
            clearDataForm () {
                this.isLoading = false
                this.dataForm.activity_id = this.activityId
                this.dataForm.patient_id = this.patientId
                this.dataForm.id = ''
                this.dataForm.treatment = ''
                this.dataForm.next_visit_recom = ''
                // this.dataForm.da_on_duty = ''
            },
            setupDataForm (data) {
                this.dataForm.id = data?.id ?? ''
                this.dataForm.treatment = data?.treatment ?? ''
                this.dataForm.next_visit_recom = data?.next_visit_recom ?? ''
                // this.dataForm.da_on_duty = data?.da_on_duty ?? ''
            },
            handleSubmit () {
                this.isLoading = true
                if (this.form_action === 'Add') {
                    activityRecomendation.createActivityRecommendation(this.dataForm).then(response => {
                        if (response.data.success) {
                            this.$emit('reloadRecommendationList', true)
                            this.$bvModal.hide('modal-recommendation')
                            this.clearDataForm()
                        }
                        this.$swal(response?.data?.message)
                         this.isLoading = false
                    })
                } else {
                    activityRecomendation.updateActivityRecommendation(this.dataForm, this.dataForm?.id).then(response => {
                        if (response.data.success) {
                            this.$emit('reloadRecommendationList', true)
                            this.$bvModal.hide('modal-recommendation')
                            this.clearDataForm()
                        }
                        this.$swal(response?.data?.message)
                         this.isLoading = false
                    })
                }
            }
        }
    }
</script>
