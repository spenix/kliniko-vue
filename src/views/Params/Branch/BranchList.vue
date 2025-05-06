<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">{{ clinic.name }} Branches</h4>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col md="10">
                <p>List of branches</p>
              </b-col>
              <b-col md="2" align-h="end">
                <b-button @click="showAddBranch()" variant="primary">Add Branch</b-button>
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
                  <template v-slot:cell(clinic)="{ item }">
                    {{  item.clinic.name }}
                  </template>
                  <template v-slot:cell(actions)="{ item }">
                    <span><b-btn variant="primary" class="mb-3 mr-1" @click="editBranch(item)"><i class="las la-edit"></i> Edit</b-btn></span>
                    <span><b-btn variant="info" class="mb-3 mr-1" @click="assignBusinessRulesOnBranch(item)"><i class="fa fa-users"></i> People </b-btn></span>
                  </template>
                </b-table>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal id="modal-add-branch" centered :title="modalTitle" hide-footer cancel-title="Close">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(saveBranch)">
            <div class="row">
              <div class="col-2"></div>
              <div class="col-8 mb-4">
                <b-img class="branch-logo height-150 width-150" :src="branch.logo" alt="branch-logo" />
              </div>
              <div class="col-2"></div>
            </div>
            <b-form-group class="col-12"
              label="Logo:"
              label-for="logo"
            >
              <b-form-file type="file" @change="previewFileInput" accept="image/jpg,image/png,image/jpeg" placeholder="Logo"></b-form-file>
            </b-form-group>
          <b-form-group class="col-md-12" label="Branch Name:" label-for="branch_name">
            <ValidationProvider name="Branch Name" rules="required" v-slot="{ errors }">
              <b-form-input v-model="branch.name" type="text" placeholder="Branch" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-form-group class="col-md-12" label="Code:" label-for="patient_no_prefix">
            <ValidationProvider name="Code" rules="required" v-slot="{ errors }">
              <b-form-input v-model="branch.patient_no_prefix" type="text" placeholder="Code  " :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-form-group class="col-md-12" label="Email:" label-for="email">
            <ValidationProvider name="Email" rules="required" v-slot="{ errors }">
              <b-form-input v-model="branch.email" type="email" placeholder="Email  " :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-form-group class="col-md-12" label="Facebook Page:" label-for="fb_page">
              <b-form-input v-model="branch.fb_page" type="text" placeholder="Facebook Page"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-12" label="Address:" label-for="address">
              <b-form-input v-model="branch.address" type="text" placeholder="Address"></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-12" label="Contact Number:" label-for="contact_no">
              <b-form-input v-model="branch.contact_no" type="text" placeholder="Contact Number"></b-form-input>
          </b-form-group>
          <b-button class="mt-3 float-right" variant="primary" type="submit">Save</b-button>
        </form>
      </validation-observer>
    </b-modal>
    <BusinessRulesModal :selectedBranch="selectedBranch" @closeBusinessRoleModal="closeBusinessRoleModal($event)"/>
  </b-container>
</template>
<script>
import { xray } from '../../../config/pluginInit'
import BusinessRulesModal from './Modal/BusinessRulesModal.vue'
import branches from '../../../services/branches'

export default {
  name: 'BranchList',
  mounted () {
    xray.index()
    this.fetchBranches()
  },
  components: {
    BusinessRulesModal
  },
  data () {
    return {
      filter: '',
      fields: [
        { label: 'Clinic', key: 'clinic', headerClass: 'text-left', sortable: true },
        { label: 'Branch Name', key: 'name', headerClass: 'text-left', sortable: true },
        { label: 'Code', key: 'patient_no_prefix', headerClass: 'text-left', sortable: true },
        { label: 'Action', key: 'actions', interpolate: true, sortable: false }
      ],
      items: [],
      showCommissionRate: false,
      branch: {
        isUploadImg: false,
        id: '',
        patient_no_prefix: '',
        name: '',
        email: '',
        fb_page: '',
        address: '',
        contact_no: '',
        logo: require('../../../assets/images/user/11.png')
      },
      clinic: {},
      modalTitle: 'Add Branch',
      update: false,
      clinic_id: '',
      selectedBranch: {}
    }
  },
  methods: {
    closeBusinessRoleModal (evt) {
      this.selectedBranch = {}
    },
    previewFileInput: function (event) {
      const input = event.target
      if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.branch.isUploadImg = true
          this.branch.logo = e.target.result
        }
        reader.readAsDataURL(input.files[0])
      }
    },
    fetchBranches () {
      const id = this.$route.params.id
      branches.getAllBranchesByClinic(id).then(response => {
        if (response.data.success) {
          this.items = response.data.data.branches
          this.clinic = response.data.data.clinic
          this.branch.clinic_id = response.data.data.clinic.id
          this.clinic_id = response.data.data.clinic.id
        }
      }).catch(err => console.log(err))
    },
    showAddBranch () {
      this.update = false
      this.clearForm()
      this.modalTitle = 'Add Branch'
      this.$bvModal.show('modal-add-branch')
    },
    saveBranch () {
      if (!this.update) {
        this.createBranch()
      } else {
        this.updateBranch()
      }
    },
    createBranch () {
      branches.createBranch(this.branch).then(response => {
        if (response.data.success) {
          this.$swal('Branch save successfully!!!')
          this.fetchBranches()
          this.clearForm()
          this.$bvModal.hide('modal-add-branch')
        }
      }).catch(err => console.log(err))
    },
    updateBranch () {
      branches.updateBranch(this.branch).then(response => {
        if (response.data.success) {
          this.$swal('Branch save successfully!!!')
          this.fetchBranches()
          this.clearForm()
          this.$bvModal.hide('modal-add-branch')
        }
      }).catch(err => console.log(err))
    },
    clearForm () {
        // this.branch.isUploadImg = false
        // this.branch.clinic_id = ''
        this.branch.id = ''
        // this.branch.patient_no_prefix = ''
        this.branch.name = ''
        // this.branch.email = ''
        // this.branch.fb_page = ''
        // this.branch.address = ''
        // this.branch.contact_no = ''
        // this.branch.logo = require('../../../assets/images/user/11.png')
    },
    editBranch (item) {
      this.modalTitle = 'Edit Branch'
      this.update = true
      this.branch = item
      if (!item.logo) {
        this.branch.logo = require('../../../assets/images/branch-img/no-image.jpg')
      } else {
        var cnt = item?.logo.split('/')
        if (cnt.length > 3) {
          this.branch.logo = item?.logo
        } else {
          this.branch.logo = process.env.VUE_APP_API_BASE_URL + item?.logo
        }
      }
      this.branch.isUploadImg = false
      this.branch.clinic_id = this.clinic_id
      this.$bvModal.show('modal-add-branch')
    },
    openActivityLog (id) {
      this.$router.push('/activityLogs/view/' + id)
    },
    assignBusinessRulesOnBranch (item) {
      this.selectedBranch = item
      this.$bvModal.show('modal-business-rules')
    }
  }
}
</script>
