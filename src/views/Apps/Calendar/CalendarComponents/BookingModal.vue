<template>
    <b-modal id="modal-booking" ref="modal-booking" :hide-footer="isHideMdFooter" :title="modalFormAction + ' ' + title" ok-title="Submit" cancel-title="Close" @cancel="resetFormData" @close="resetFormData" @ok.prevent="submitBookingForm">
        <form @submit.prevent="handleSubmit(submitBookingForm)">
            <b-row>
                <b-form-group class="col-12"
                    label-for="classification_id"
                    label="Classification:">
                    <b-form-select v-model="formData.classification_id"  plain :options="classifications" id="classification_id" name="classification_id" @change="selectClassification" :disabled="isHideMdFooter" required>
                        <template v-slot:first>
                            <b-form-select-option :value="null" hidden>Select Classification</b-form-select-option>
                        </template>
                    </b-form-select>
                </b-form-group>
            </b-row>
            <b-row v-if="showPatient">
                <b-form-group class="col-12"
                    label-for="patient_id"
                    label="Patient:">
                    <b-form-select v-model="formData.patient_id"  plain :options="patients" id="patient_id" name="patient_id" :disabled="isHideMdFooter" required>
                    <template v-slot:first>
                        <b-form-select-option :value="null" hidden>Select Patient</b-form-select-option>
                    </template>
                    </b-form-select>
                </b-form-group>
            </b-row>
            <b-row>
                <b-form-group class="col-12"
                label="Title:"
                label-for="appointment-title"
                >
                    <b-form-input v-model="formData.title" type="text" name="appointment-title" id="appointment-title" placeholder="Title" :disabled="isHideMdFooter" required></b-form-input>
                </b-form-group>
            </b-row>
            <b-row>
                <b-form-group label="Note" label-for="note" class="col-12">
                    <b-form-textarea id="note" v-model="formData.note" rows="3"></b-form-textarea>
                </b-form-group>
            </b-row>
            <b-row>
                <b-form-group class="col-12"
                label="Start Date:"
                label-for="date-from"
                >
                    <b-form-input v-model="formData.date_from" type="datetime-local" :max="formData.date_to" name="date-from" id="date-from" placeholder="Start Date" :disabled="isHideMdFooter" required></b-form-input>
                </b-form-group>
            </b-row>
            <b-row>
                <b-form-group class="col-12"
                label="End Date:"
                label-for="date-to"
                >
                    <b-form-input v-model="formData.date_to" :min="formData.date_from" type="datetime-local" name="date-to" id="date-to" placeholder="End Date" :disabled="isHideMdFooter" required></b-form-input>
                </b-form-group>
            </b-row>
        </form>
    </b-modal>
</template>
<script>
import booking from '../../../../services/booking'
import patient from '../../../../services/patient'
import _ from 'lodash'
import { mapGetters } from 'vuex'
    export default {
        name: 'BookingAppointmentComponent',
        props: {
            classificationList: Array,
            modalFormAction: String
        },
        data () {
            return {
                showPatient: false,
                isHideMdFooter: false,
                title: 'Booking Appointment',
                patientList: [],
                formData: {
                    id: '',
                    classification_id: null,
                    patient_id: null,
                    title: '',
                    note: '',
                    date_from: '',
                    date_to: ''
                }
            }
        },
        computed: {
            classifications () {
                return this.classificationList.map(d => { return { value: d?.id, text: d?.name } }).sort((a, b) => a.text.localeCompare(b.text))
            },
            patients () {
                return this.patientList.map(d => { return { value: d?.id, text: d?.first_name + ' ' + d?.last_name } }).sort((a, b) => a.text.localeCompare(b.text))
            },
            ...mapGetters({
                userActiveBranch: 'Auth/userActiveBranch'
            })
        },
        watch: {
            userActiveBranch: _.debounce(function (data) {
            this.getAllPatientList()
            }, 500)
        },
        mounted () {
            this.getAllPatientList()
        },
        methods: {
            selectClassification () {
                var classData = this.classificationList.filter(d => {
                    return this.formData.classification_id === d?.id
                })
                if (classData.length) {
                    this.showPatient = classData[classData.length - 1]?.isRequiredPatient === 'Y'
                }
            },
            getAllPatientList () {
                if (this.userActiveBranch?.id) {
                    patient.getAllPatients(this.userActiveBranch?.id)
                    .then(({ data }) => {
                        this.patientList = data?.data
                    })
                    .catch(error => { console.log(error) })
                }
            },
            resetFormData () {
                this.formData.id = ''
                this.formData.classification_id = null
                this.formData.patient_id = null
                this.formData.title = ''
                this.formData.note = ''
                this.formData.date_from = ''
                this.formData.date_to = ''
            },
            submitBookingForm () {
                booking.createBooking(this.formData)
                .then(({ data }) => {
                    if (data?.success) {
                        this.resetFormData()
                        this.$bvModal.hide('modal-booking')
                        this.$emit('triggerBooking')
                    }
                    this.$swal(data?.message)
                })
                .catch(err => console.log(err))
            }
        }
    }
</script>
