<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Services</h4>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col md="5" class="my-2">
                <p>List of services</p>
              </b-col>
              <b-col md="7" class="my-2" align-h="end">
                <div class="float-right">
                  <b-button @click="showAddServiceModal()" variant="primary" class="mx-1">Add Service</b-button>
                <b-button @click="showCopyServiceModal()" variant="info" class="mx-1">Copy Services from other Branch</b-button>
                </div>
              </b-col>
              <b-col md="12 my-2">
                <div class="iq-search-bar float-right">
                  <form action="#" @submit.prevent="fetchServices()" class="searchbox">
                    <input type="text" class="text search-input" v-model="searchItem" placeholder="search....">
                    <a class="search-link" href="#"><i class="ri-search-line"></i></a>
                  </form>
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <b-table
                  striped
                  hover
                  outlined
                  responsive
                  :per-page="items?.per_page"
                  :fields="fields"
                  :items="items?.data"
                  show-empty
                >
                <template v-slot:cell(is_other)="{ item }">
                  <b-badge variant="light" v-show="item.is_other == 'N'">NO</b-badge>
                  <b-badge variant="success" v-show="item.is_other == 'Y'">YES</b-badge>
                </template>
                <template v-slot:cell(is_comm_based)="{ item }">
                  <b-badge variant="light" v-show="item.is_comm_based == 'N'">NO</b-badge>
                  <b-badge variant="success" v-show="item.is_comm_based == 'Y'">YES</b-badge>
                </template>
                  <template v-slot:cell(actions)="{ item }">
                    <b-button-group size="sm">
                      <b-btn variant="primary" class="mb-2 mr-1" @click="editService(item)"><i class="las la-edit"></i> Edit</b-btn>
                      <b-btn variant="danger" class="mb-2 mr-1" @click="deleteService(item)"><i class="las la-trash"></i> Delete</b-btn>
                    </b-button-group>
                  </template>
                  <template #empty="scope" class="text-center">
                    <div class="text-center">
                      <span>No data results</span>
                    </div>
                  </template>
                </b-table>
              </b-col>
            </b-row>
            <div class="row">
              <b-col class="col">
                <b-pagination
                  class="float-right"
                  v-model="currentPage"
                  :total-rows="items?.total"
                  :per-page="items?.per_page"
                  aria-controls="my-table"
                ></b-pagination>
              </b-col>
            </div>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal id="modal-copy-service" title="Copy Services from other Branch"  ok-title="Submit" @cancel="clearOtherBranchVar()" @ok="handleCopyServiceSubmit()">
      <Multiselect
          v-model="
              selectedOtherBranch
          "
          :options="otherBranches"
          :searchable="true"
          valueProp="id"
          label="name"
          class="my-2"
          placeholder="Select Branch"
          :allow-empty="true"
      />
      <Multiselect
          v-model="
              selectedOtherBranchServices
          "
          :options="otherBranchServices"
          :searchable="true"
          :multiple="true"
          valueProp="id"
          label="name"
          track-by="id"
          placeholder="Select Services"
          :allow-empty="true"
      />
  </b-modal>
    <b-modal id="modal-add-service" centered :title="modalTitle" hide-footer cancel-title="Close">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(saveService)">
          <b-form-group class="col-md-12" label="Service Name:" label-for="service_name">
            <ValidationProvider name="Service Name" rules="required" v-slot="{ errors }">
              <b-form-input v-model="service.name" type="text" placeholder="Service" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-form-group class="col-md-12" label="Description:" label-for="description">
            <ValidationProvider name="Description" rules="required" v-slot="{ errors }">
              <b-form-textarea v-model="service.description" id="description" rows="3" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-textarea>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-form-group class="col-md-12">
            <b-form-checkbox v-model="service.is_other_chk" @change="isOtherCheck($event)">Is other?</b-form-checkbox>
          </b-form-group>
          <b-form-group class="col-md-12">
            <b-form-checkbox v-model="service.is_comm_based_chk" @change="isCommBased($event)">Is commission based?</b-form-checkbox>
          </b-form-group>
          <b-form-group class="col-md-12">
            <b-form-checkbox v-model="service.is_comm_fixed_amount_chk" @change="isCommFixedAmountCheck($event)" v-show="service.is_comm_based_chk">Is Commission fixed amount?</b-form-checkbox>
          </b-form-group>
          <b-form-group class="col-md-12" label="Commission Rate (%)" label-for="commission_rate" v-show="showCommissionRate">
            <b-form-input v-model="service.commission_rate" type="number" id="commission_rate" placeholder="Commission Rate" ></b-form-input>
          </b-form-group>
          <b-form-group class="col-md-12" label="Commission Amount" label-for="comm_fixed_amount" v-show="showCommissionFixedAmount">
            <b-form-input v-model="service.comm_fixed_amount" type="number" id="comm_fixed_amount" placeholder="Commission Amount" ></b-form-input>
          </b-form-group>
          <b-button class="mt-3" variant="primary" type="submit">Save</b-button>
        </form>
      </validation-observer>
    </b-modal>
  </b-container>
</template>
<script>
import { xray } from '../../../config/pluginInit'
import services from '../../../services/services'
import branches from '../../../services/branches'
import Multiselect from 'vue-multiselect'
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'ServiceList',
  components: {
    Multiselect
  },
  mounted () {
    xray.index()
    this.fetchServices()
    this.getBranches()
  },
  data () {
    return {
      filter: '',
      fields: [
        { label: 'Service Name', key: 'name', headerClass: 'text-left', sortable: true },
        { label: 'Description', key: 'description', headerClass: 'text-left', sortable: true },
        { label: 'Is other service?', key: 'is_other', headerClass: 'text-left', sortable: true },
        { label: 'Commission Based', key: 'is_comm_based', headerClass: 'text-left', sortable: true },
        { label: 'Commission Rate (%)', key: 'commission_rate', headerClass: 'text-right' },
        { label: 'Commission Amount', key: 'comm_fixed_amount', headerClass: 'text-right' },
        { label: 'Action', key: 'actions', interpolate: true, sortable: false }
      ],
      items: [],
      showCommissionRate: false,
      showCommissionFixedAmount: false,
      service: {
        id: '',
        branch_id: null,
        name: '',
        description: '',
        is_comm_based: 'N',
        is_other: 'N',
        commission_rate: 0,
        is_comm_based_chk: false,
        is_other_chk: false,
        is_comm_fixed_amount: 'N',
        is_comm_fixed_amount_chk: false,
        comm_fixed_amount: 0
      },
      otherBranches: [],
      otherBranchServices: [],
      selectedOtherBranch: '',
      selectedOtherBranchServices: [],
      modalTitle: 'Add Service',
      update: false,
      searchItem: '',
      currentPage: 1
    }
  },
  computed: {
    ...mapGetters({
        userActiveBranch: 'Auth/userActiveBranch'
    })
  },
  watch: {
    selectedOtherBranch: _.debounce(function (data) {
      this.otherBranchServices = []
      this.selectedOtherBranchServices = []
      this.fetchOtherBranchServices(data?.id)
    }, 300),
    userActiveBranch: _.debounce(function (data) {
      this.service.branch_id = data?.id
      this.fetchServices()
    }),
    currentPage: _.debounce(function (data) {
      this.fetchServices()
    }, 500),
    searchItem: _.debounce(function (data) {
      this.fetchServices()
    }, 500)
  },
  methods: {
    clearOtherBranchVar () {
      this.otherBranchServices = []
      this.selectedOtherBranch = ''
      this.selectedOtherBranchServices = []
    },
    getBranches () {
      branches.getAllBranches()
      .then(({ data, status }) => {
        this.otherBranches = data?.data.filter(d => {
          if (d?.id !== this.userActiveBranch.branch_id) {
            return d
          }
        })
      })
      .catch((error) => {
              const { errors, message } = error.response.data
              this.errors = errors
              this.$swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: message
              })
          })
    },
    handleCopyServiceSubmit () {
      this.$swal.fire({
          title: 'Are you sure you want to submit this record?',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
              services.getCopyOtherServices({ data: this.selectedOtherBranchServices, branch_id: this.userActiveBranch.id }).then(response => {
                if (response.data.success) {
                  this.clearOtherBranchVar()
                  this.fetchServices()
                  this.$bvModal.hide('modal-copy-service')
                }
                this.$swal(response.data.message)
              }).catch((error) => {
                      const { errors, message } = error.response.data
                      this.errors = errors
                      this.$swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: message
                      })
                  })
        }
      })
    },
    fetchOtherBranchServices (id) {
      services.getAllOtherServices(id).then(response => {
        if (response.data.success) {
          this.otherBranchServices = response.data.data
        }
      }).catch((error) => {
              const { errors, message } = error.response.data
              this.errors = errors
              this.$swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: message
              })
          })
    },
    fetchServices () {
      var payload = `page=${this.currentPage}&branchId=${this.userActiveBranch.id}`
      if (this.searchItem) {
        payload += `&search=${this.searchItem}`
      }
      services.getAllServicesByPagination(payload).then(response => {
        if (response.data.success) {
          this.items = response.data.data
        }
      }).catch(err => console.log(err))
    },
    showCopyServiceModal () {
      this.$bvModal.show('modal-copy-service')
    },
    showAddServiceModal () {
      this.update = false
      this.clearForm()
      this.modalTitle = 'Add Service'
      this.$bvModal.show('modal-add-service')
    },
    saveService () {
      if (!this.update) {
        this.service.branch_id = this.userActiveBranch?.id
        this.createService()
      } else {
        this.updateService()
      }
    },
    createService () {
      services.createService(this.service).then(response => {
        if (response.data.success) {
          this.$swal('Service save successfully!!!')
          this.fetchServices()
          this.clearForm()
          this.$bvModal.hide('modal-add-service')
        }
      }).catch((error) => {
              const { errors, message } = error.response.data
              this.errors = errors
              this.$swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: message
              })
          })
    },
    updateService () {
      services.updateService(this.service).then(response => {
        if (response.data.success) {
          this.$swal('Service save successfully!!!')
          this.fetchServices()
          this.clearForm()
          this.$bvModal.hide('modal-add-service')
        }
      }).catch(err => console.log(err))
    },
    clearForm () {
      this.service.id = ''
      this.service.name = ''
      this.service.description = ''
      this.service.is_comm_based = 'N'
      this.service.is_other = 'N'
      this.service.commission_rate = 0
      this.service.is_other_chk = false
      this.service.is_comm_based_chk = false
      this.service.is_comm_fixed_amount_chk = false
      this.service.is_comm_fixed_amount = 'N'
      this.service.comm_fixed_amount = 0
      this.showCommissionRate = false
      this.showCommissionFixedAmount = false
    },
    isOtherCheck (value) {
      if (value) {
        this.service.is_other = 'Y'
      } else {
        this.service.is_other = 'N'
      }
    },
    isCommFixedAmountCheck (value) {
      if (value) {
        this.service.is_comm_fixed_amount = 'Y'
        this.showCommissionRate = false
        this.showCommissionFixedAmount = true
      } else {
        this.service.is_comm_fixed_amount = 'N'
        this.showCommissionRate = true
        this.showCommissionFixedAmount = false
      }
    },
    isCommBased (value) {
      if (value) {
        this.showCommissionRate = true
        this.service.is_comm_based = 'Y'
      } else {
        this.service.is_comm_based = 'N'
        this.showCommissionRate = false
        this.service.commission_rate = 0
      }
    },
    editService (item) {
      console.log(item)
      this.modalTitle = 'Edit Service'
      this.update = true
      this.service = item
      this.service.is_comm_based_chk = item.is_comm_based === 'Y'
      this.showCommissionRate = item.is_comm_based === 'Y' && item.is_comm_fixed_amount === 'N'
      this.showCommissionFixedAmount = item.is_comm_based === 'Y' && item.is_comm_fixed_amount === 'Y'
      this.service.is_other_chk = item.is_other === 'Y'
      this.service.is_comm_fixed_amount_chk = item.is_comm_fixed_amount === 'Y'
      this.$bvModal.show('modal-add-service')
    },
    deleteService (item) {
      this.$swal.fire({
          title: 'Are you sure you want to delete this record?',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          services.deleteService(item.id).then(({ data }) => {
            if (data.success) {
              this.fetchServices()
            }
            this.$swal(data?.message)
          }).catch(err => console.log(err))
        }
      })
    },
    openActivityLog (id) {
      this.$router.push('/activityLogs/view/' + id)
    }
  }
}
</script>
