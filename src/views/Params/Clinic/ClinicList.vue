<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Clinics</h4>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col md="10">
                <p>List of clinics</p>
              </b-col>
              <b-col md="2" align-h="end">
                <b-button @click="showAddClinic()" variant="primary">Add Clinic</b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <b-table
                  striped
                  hover
                  outlined
                  :fields="fields"
                  :items="items"
                  :filter="filter"
                >
                  <template v-slot:cell(branches_count)="{ item }">
                    <b-badge variant="light" v-show="item.branches_count == 0" @click="showBranches(item.id)">No branches yet</b-badge>
                    <b-badge variant="success" v-show="item.branches_count > 0" @click="showBranches(item.id)">{{ item.branches_count }} {{ item.branches_count > 1 ? 'branches' : 'branch' }}</b-badge>
                  </template>
                  <template v-slot:cell(actions)="{ item }">
                    <span><b-btn variant="primary" class="mb-3 mr-1" @click="editClinic(item)"><i class="las la-edit"></i> Edit</b-btn></span>
                  </template>
                </b-table>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal id="modal-add-clinic" centered :title="modalTitle" hide-footer cancel-title="Close">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(saveClinic)">
          <b-form-group class="col-md-12" label="Clinic Name:" label-for="clinic_name">
            <ValidationProvider name="Clinic Name" rules="required" v-slot="{ errors }">
              <b-form-input v-model="clinic.name" type="text" placeholder="Clinic" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-button class="mt-3" variant="primary" type="submit">Save</b-button>
        </form>
      </validation-observer>
    </b-modal>
  </b-container>
</template>
<script>
import { xray } from '../../../config/pluginInit'
import clinics from '../../../services/clinics'

export default {
  name: 'ClinicList',
  mounted () {
    xray.index()
    this.fetchClinics()
  },
  data () {
    return {
      filter: '',
      fields: [
        { label: 'Clinic Name', key: 'name', headerClass: 'text-left', sortable: true },
        { label: 'Branches', key: 'branches_count', headerClass: 'text-left', sortable: true },
        { label: 'Action', key: 'actions', interpolate: true, sortable: false }
      ],
      items: [],
      showCommissionRate: false,
      clinic: {
        id: '',
        name: ''
      },
      modalTitle: 'Add Clinic',
      update: false
    }
  },
  methods: {
    fetchClinics () {
      clinics.getAllClinics().then(response => {
        if (response.data.success) {
          this.items = response.data.data
        }
      }).catch(err => console.log(err))
    },
    showAddClinic () {
      this.update = false
      this.clearForm()
      this.modalTitle = 'Add Clinic'
      this.$bvModal.show('modal-add-clinic')
    },
    saveClinic () {
      if (!this.update) {
        this.createClinic()
      } else {
        this.updateClinic()
      }
    },
    createClinic () {
      clinics.createClinic(this.clinic).then(response => {
        if (response.data.success) {
          this.$swal('Clinic save successfully!!!')
          this.fetchClinics()
          this.clearForm()
          this.$bvModal.hide('modal-add-clinic')
        }
      }).catch(err => console.log(err))
    },
    updateClinic () {
      clinics.updateClinic(this.clinic).then(response => {
        if (response.data.success) {
          this.$swal('Clinic save successfully!!!')
          this.fetchClinics()
          this.clearForm()
          this.$bvModal.hide('modal-add-clinic')
        }
      }).catch(err => console.log(err))
    },
    showBranches (id) {
      this.$router.push('/clinics/branches/' + id)
    },
    clearForm () {
      this.clinic.id = ''
      this.clinic.name = ''
    },
    editClinic (item) {
      this.modalTitle = 'Edit Clinic'
      this.update = true
      this.clinic = item
      this.clinic.is_other_chk = item.is_other === 'Y'
      this.$bvModal.show('modal-add-clinic')
    },
    openActivityLog (id) {
      this.$router.push('/activityLogs/view/' + id)
    }
  }
}
</script>
