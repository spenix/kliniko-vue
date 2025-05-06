<template>
    <b-modal id="prescription-modal" ref="prescription-modal" :hide-footer="isHideMdFooter()" size="xl" :title="form_action + ' ' + title" ok-title="Submit" cancel-title="Close" @ok.prevent="submitPrescriptionForm">
     <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(submitPrescriptionForm)">
          <b-row>
            <b-form-group class="col-sm-6"
                label-cols-sm="2"
                label-for="selectDoctor"
                label="Doctor:">
              <ValidationProvider name="Doctor" rules="required" v-slot="{ errors }">
                <b-form-select v-model="prescriptionForm.doctor_id"  plain :options="doctors" id="selectDoctor" :class="(errors.length > 0 ? ' is-invalid' : '')" :disabled="isHideMdFooter()" required>
                  <template v-slot:first>
                    <b-form-select-option value="" hidden>Select Doctor</b-form-select-option>
                  </template>
                </b-form-select>
                <div class="invalid-feedback">
                  <span>{{ errors[0] }}</span>
                </div>
              </ValidationProvider>
            </b-form-group>
          </b-row>
          <b-row>
            <b-form-group class="col-sm-6" label="Description" label-cols-sm="2" label-for="textareaDescription">
              <b-form-textarea id="textareaDescription" v-model="prescriptionForm.description" rows="3" :disabled="isHideMdFooter()"></b-form-textarea>
            </b-form-group>
          </b-row>
          <b-row>
            <table id="prescriptions">
              <thead>
                <th>Qty</th>
                <th>Unit</th>
                <th>Name</th>
                <th>Description</th>
                <th v-if="!isHideMdFooter()"></th>
              </thead>
              <tbody>
                <tr v-for="(d, i) in prescriptionForm.prescriptionList" :key="`prescription-${i}`">
                  <td><input type="text" v-model="d.qty" @keypress="isNumber($event)" style="width: 100%;" placeholder="Quantity" :disabled="isHideMdFooter()" /></td>
                  <td><input type="text" v-model="d.unit" style="width: 100%;" placeholder="Unit" :disabled="isHideMdFooter()" /></td>
                  <td><input type="text" v-model="d.name" style="width: 100%;" placeholder="Name" :disabled="isHideMdFooter()" /></td>
                  <td><textarea style="width: 100%" v-model="d.desc" placeholder="Description" rows="1" :disabled="isHideMdFooter()"></textarea></td>
                  <td class="text-center" v-if="!isHideMdFooter()">
                    <b-button variant="primary" @click="addNewRow" v-if="(i+1) === prescriptionForm.prescriptionList.length" class="mb-3"><i class="fa fa-plus" aria-hidden="true"></i></b-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </b-row>
        </form>
     </validation-observer>
   </b-modal>
</template>
<script>
import doctor from '../../../services/doctor'
import prescriptionService from '../../../services/prescription'
import _ from 'lodash'
export default ({
    name: 'PrescriptionModal',
    props: {
        form_action: String,
        ActivityId: String,
        defaultPrescriptionForm: Object
    },
    data () {
        return {
            title: 'Prescription',
            prescriptionForm: this.defaultPrescriptionForm,
            doctors: []
        }
    },
    watch: {
      'defaultPrescriptionForm.id': _.debounce(function (data) {
        this.prescriptionForm = this.defaultPrescriptionForm
      }, 500),
      'defaultPrescriptionForm.patient_id': _.debounce(function (data) {
        this.prescriptionForm.patient_id = data
      }, 500)
    },
    mounted () {
      this.getDoctors()
    },
    methods: {
        getDoctors () {
          doctor.getAllDoctors().then(({ data }) => {
            this.doctors = data?.data?.map(d => { return { text: d?.last_name + ', ' + d?.first_name + ' ' + d?.middle_name, value: d?.id } })
          }).catch(err => console.log(err))
        },
        isHideMdFooter () {
          return this.form_action === 'View'
        },
        addNewRow () {
          this.prescriptionForm.prescriptionList.push({ id: '', qty: '', unit: '', name: '', desc: '' })
        },
        isNumber (evt) {
          evt = evt ?? window.event
          var charCode = evt.which ? evt.which : evt.keyCode
          if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46 && charCode !== 44) {
            evt.preventDefault()
          }
          return true
        },
        clearModalForm () {
            this.prescriptionForm.id = ''
            this.prescriptionForm.doctor_id = ''
            this.prescriptionForm.doctor = ''
            this.prescriptionForm.description = ''
            this.prescriptionForm.prescriptionList = [
                    { id: '', qty: '', unit: '', name: '', desc: '' }
                  ]
          },
        submitPrescriptionForm () {
            this.prescriptionForm.activity_id = this.ActivityId
            if (this.form_action === 'Edit') {
              prescriptionService.updatePrescription(this.prescriptionForm, this.prescriptionForm.id).then(({ data }) => {
                if (data.success) {
                  this.$swal('Prescription Record was edited successfully!')
                  this.clearModalForm()
                  this.$bvModal.hide('prescription-modal')
                  this.$emit('triggerPrescription', true)
                }
              }).catch(err => console.log(err))
            } else {
              prescriptionService.createPrescription(this.prescriptionForm).then(({ data }) => {
                if (data.success) {
                  this.$swal('Prescription Record was saved successfully!')
                  this.clearModalForm()
                  this.$bvModal.hide('prescription-modal')
                  this.$emit('triggerPrescription', true)
                }
              }).catch(err => console.log(err))
            }
          }
    }
})
</script>
