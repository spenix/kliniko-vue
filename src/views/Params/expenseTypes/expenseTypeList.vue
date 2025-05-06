<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Expense Types</h4>
          </template>
          <template v-slot:body>
            <b-row class="mb-2">
              <b-col md="12">
                <p>List of Expense Types <button type="button" class="btn btn-primary float-right" @click="addUserDetails()">Add Expense Type</button></p>
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
                  <template v-slot:cell(actions)="{ item }">
                    <span><b-btn variant="primary" class="mb-3 mr-1" @click="editUserDetails(item, 'Edit')"><i class="las la-edit"></i> Edit</b-btn></span>
                    <!-- <span><b-btn variant="danger" class="mb-3 mr-1" @click="actionDelExpenseType(item.id)"><i class="las la-trash"></i> Delete</b-btn></span> -->
                  </template>
                </b-table>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal id="modal-add-expense-type" centered :title="modalTitle" hide-footer cancel-title="Close">
        <form @submit.prevent="saveUserDetails()">
          <b-form-group class="col-md-12 required" label="Name:" label-for="name">
              <b-form-input v-model="expenseTypeForm.name" :class="errors?.name ? 'is-invalid' : ''" type="text" name="name" id="name" placeholder="Expense Type Name" required></b-form-input>
              <div class="invalid-feedback" v-for="(error, i) in errors?.name" :key="`name-error-${i}`"> {{ error }} </div>
          </b-form-group>
          <b-form-group class="col-md-12"  label="Description:" label-for="description">
            <b-form-textarea v-model="expenseTypeForm.description" id="description" rows="5"></b-form-textarea>
            <div class="invalid-feedback" v-for="(error, i) in errors?.description" :key="`description-error-${i}`"> {{ error }} </div>
          </b-form-group>
          <b-button class="mt-3 mx-2 float-right" variant="primary" type="submit" :disabled="isLoading">Save</b-button>
          <b-button class="mt-3 mx-2 float-right" variant="light" @click="cancelAction" type="button">Cancel</b-button>
        </form>
    </b-modal>
  </b-container>
</template>
<script>
import { xray } from '../../../config/pluginInit'
import expenseTypeService from '../../../services/expense-type'
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'expenseTypeList',
  mounted () {
    xray.index()
    this.fetchExpenseTypes()
  },
  computed: {
    ...mapGetters({
      userDetails: 'Auth/userDetails',
      userActiveBranch: 'Auth/userActiveBranch'
    })
  },
  watch: {
    userActiveBranch: _.debounce(function (data) {
       this.expenseTypeForm.clinic_id = data?.clinic_id
       this.expenseTypeForm.branch_id = data?.branch_id
       this.fetchExpenseTypes()
    }, 300)
  },
  data () {
    return {
      filter: '',
      fields: [
        { label: 'Name', key: 'name', headerClass: 'text-left', sortable: true },
        { label: 'Description', key: 'description', headerClass: 'text-left', sortable: true },
        { label: 'Action', key: 'actions', interpolate: true, sortable: false, width: '15%' }
      ],
      items: [],
      form_action: 'Add',
      errors: {},
      isLoading: false,
      expenseTypeForm: {
       id: '',
       clinic_id: '',
       branch_id: '',
       name: '',
       description: ''
      },
      modalTitle: 'Add Expense Type',
      update: false
    }
  },
  methods: {
    cancelAction () {
      this.clearForm()
      this.$bvModal.hide('modal-add-expense-type')
    },
    fetchExpenseTypes () {
      expenseTypeService.getAllBranchExpenseTypes(this.userActiveBranch.branch_id)
      .then(({ data }) => {
        this.items = data?.data
      }).catch(err => console.log(err))
    },
    addUserDetails () {
      this.form_action = 'Add'
      this.clearForm()
      this.$bvModal.show('modal-add-expense-type')
    },
    saveUserDetails () {
      if (this.form_action === 'Edit') {
        this.updateexpenseTypeService()
      } else {
        this.createExpenseTypeService()
      }
    },
    createExpenseTypeService () {
      this.isLoading = true
      this.expenseTypeForm.clinic_id = this.userActiveBranch?.clinic_id
      this.expenseTypeForm.branch_id = this.userActiveBranch?.branch_id
      expenseTypeService.createExpenseType(this.expenseTypeForm).then(({ data }) => {
          if (data?.errors) {
            this.errors = data?.errors
          }
          if (data.success) {
            this.clearForm()
            this.fetchExpenseTypes()
            this.$bvModal.hide('modal-add-expense-type')
          }
          this.$swal(data?.message)
          this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        console.log(err)
      })
    },
    updateexpenseTypeService () {
          this.isLoading = true
          this.expenseTypeForm.clinic_id = this.userActiveBranch?.clinic_id
          this.expenseTypeForm.branch_id = this.userActiveBranch?.branch_id
          expenseTypeService.updateExpenseType(this.expenseTypeForm, this.expenseTypeForm.id).then(({ data }) => {
          if (data?.errors) {
            this.errors = data?.errors
          }
          if (data.success) {
            this.clearForm()
            this.fetchExpenseTypes()
            this.$bvModal.hide('modal-add-expense-type')
          }
          this.$swal(data?.message)
          this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        console.log(err)
      })
     },
    // actionDelExpenseType (id) {
    //   expenseTypeService.deleteUser(id).then(({ data }) => {
    //     if (data.success) {
    //        this.clearForm()
    //       this.fetchExpenseTypes()
    //      }
    //      this.$swal(data?.message)
    //    }).catch(err => console.log(err))
    // },
    clearForm () {
        this.expenseTypeForm.id = ''
        this.expenseTypeForm.name = ''
        this.expenseTypeForm.description = ''
    },
    editUserDetails (item, act) {
      this.clearForm()
      this.form_action = act
      this.modalTitle = `${act} Expense Type`
      this.expenseTypeForm.id = item?.id
      this.expenseTypeForm.name = item?.name
      this.expenseTypeForm.description = item?.description
      this.$bvModal.show('modal-add-expense-type')
    }
  }
}
</script>
