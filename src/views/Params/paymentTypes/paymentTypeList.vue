<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Payment Types</h4>
          </template>
          <template v-slot:body>
            <b-row class="mb-2">
              <b-col md="12">
                <p>List of Payment Types <button type="button" v-if="userDetails.role != 'AD'" class="btn btn-primary float-right" @click="addUserDetails()">Add Payment Type</button></p>
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
                  <template v-slot:cell(is_cash)="{ item }">
                    {{ item.is_cash === 'Y' ? 'Yes' : 'No' }}
                    <!-- <span><b-btn variant="danger" class="mb-3 mr-1" @click="actionDelPaymentType(item.id)"><i class="las la-trash"></i> Delete</b-btn></span> -->
                  </template>
                  <template v-slot:cell(need_reference_details)="{ item }">
                    {{ item.need_reference_details === 'Y' ? 'Yes' : 'No' }}
                    <!-- <span><b-btn variant="danger" class="mb-3 mr-1" @click="actionDelPaymentType(item.id)"><i class="las la-trash"></i> Delete</b-btn></span> -->
                  </template>
                  <template v-slot:cell(actions)="{ item }">
                    <span><b-btn variant="primary" class="mb-3 mr-1" @click="editUserDetails(item, 'Edit')"><i class="las la-edit"></i> Edit</b-btn></span>
                    <!-- <span><b-btn variant="danger" class="mb-3 mr-1" @click="actionDelPaymentType(item.id)"><i class="las la-trash"></i> Delete</b-btn></span> -->
                  </template>
                </b-table>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal id="modal-add-payment-type" centered :title="modalTitle" hide-footer cancel-title="Close">
        <form @submit.prevent="saveUserDetails()">
          <b-form-group class="col-md-12 required" label="Name:" label-for="name">
              <b-form-input v-model="paymentTypeForm.name" :class="errors?.name ? 'is-invalid' : ''" type="text" name="name" id="name" placeholder="Payment Type Name" required></b-form-input>
              <div class="invalid-feedback" v-for="(error, i) in errors?.name" :key="`name-error-${i}`"> {{ error }} </div>
          </b-form-group>
          <b-form-group class="col-md-12">
            <b-form-checkbox v-model="paymentTypeForm.is_cash">Is Cash?</b-form-checkbox>
            <div class="invalid-feedback" v-for="(error, i) in errors?.is_cash" :key="`is_cash-error-${i}`"> {{ error }} </div>
          </b-form-group>
          <b-form-group class="col-md-12">
            <b-form-checkbox v-model="paymentTypeForm.need_reference_details">Is Need Reference Details?</b-form-checkbox>
            <div class="invalid-feedback" v-for="(error, i) in errors?.need_reference_details" :key="`need_reference_details-error-${i}`"> {{ error }} </div>
          </b-form-group>
          <b-button class="mt-3 mx-2 float-right" variant="primary" type="submit" :disabled="isLoading">Save</b-button>
          <b-button class="mt-3 mx-2 float-right" variant="light" @click="cancelAction" type="button">Cancel</b-button>
        </form>
    </b-modal>
  </b-container>
</template>
<script>
import { xray } from '../../../config/pluginInit'
import paymentTypeService from '../../../services/payment-type'
import { mapGetters } from 'vuex'

export default {
  name: 'PaymentTypeList',
  mounted () {
    xray.index()
    this.fetchPaymentTypes()
  },
  computed: {
    ...mapGetters({
      userDetails: 'Auth/userDetails'
    })
  },
  data () {
    return {
      filter: '',
      fields: [
        { label: 'Name', key: 'name', headerClass: 'text-left', sortable: true },
        { label: 'Is Cash', key: 'is_cash', headerClass: 'text-left', sortable: true },
        { label: 'Is Need Reference Details', key: 'need_reference_details', headerClass: 'text-right', sortable: true },
        { label: 'Action', key: 'actions', interpolate: true, sortable: false, width: '15%' }
      ],
      items: [],
      form_action: 'Add',
      errors: {},
      isLoading: false,
      paymentTypeForm: {
       id: '',
       name: '',
       is_cash: false,
       need_reference_details: false
      },
      modalTitle: 'Add Payment Type',
      update: false
    }
  },
  methods: {
    cancelAction () {
      this.clearForm()
      this.$bvModal.hide('modal-add-payment-type')
    },
    fetchPaymentTypes () {
      paymentTypeService.getAllPaymentTypes()
      .then(({ data }) => {
        this.items = data?.data
      }).catch(err => console.log(err))
    },
    addUserDetails () {
      this.form_action = 'Add'
      this.clearForm()
      this.$bvModal.show('modal-add-payment-type')
    },
    saveUserDetails () {
      if (this.form_action === 'Edit') {
        this.updatePaymentTypeService()
      } else {
        this.createPaymentTypeService()
      }
    },
    createPaymentTypeService () {
      this.isLoading = true
      paymentTypeService.createPaymentType(this.paymentTypeForm).then(({ data }) => {
          if (data.success) {
            this.clearForm()
            this.fetchPaymentTypes()
            this.$bvModal.hide('modal-add-payment-type')
          }
          this.$swal(data?.message)
          this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        console.log(err)
      })
    },
    updatePaymentTypeService () {
          this.isLoading = true
          paymentTypeService.updatePaymentType(this.paymentTypeForm, this.paymentTypeForm.id).then(({ data }) => {
          if (data?.errors) {
            this.errors = data?.errors
          }
          if (data.success) {
            this.clearForm()
            this.fetchPaymentTypes()
            this.$bvModal.hide('modal-add-payment-type')
          }
          this.$swal(data?.message)
          this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        console.log(err)
      })
     },
    // actionDelPaymentType (id) {
    //   paymentTypeService.deleteUser(id).then(({ data }) => {
    //     if (data.success) {
    //        this.clearForm()
    //       this.fetchPaymentTypes()
    //      }
    //      this.$swal(data?.message)
    //    }).catch(err => console.log(err))
    // },
    clearForm () {
        this.paymentTypeForm.id = ''
        this.paymentTypeForm.name = ''
        this.paymentTypeForm.is_cash = false
        this.paymentTypeForm.need_reference_details = false
    },
    editUserDetails (item, act) {
      this.clearForm()
      this.form_action = act
      this.modalTitle = `${act} Payment Type`
      this.paymentTypeForm.id = item?.id
      this.paymentTypeForm.name = item?.name
      this.paymentTypeForm.is_cash = item?.is_cash === 'Y'
      this.paymentTypeForm.need_reference_details = item?.need_reference_details === 'Y'
      this.$bvModal.show('modal-add-payment-type')
    }
  }
}
</script>
