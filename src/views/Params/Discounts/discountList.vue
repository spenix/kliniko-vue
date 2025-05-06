<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Discounts</h4>
          </template>
          <template v-slot:body>
            <b-row class="mb-2">
              <b-col md="12">
                <p>List of Discounts <button type="button" class="btn btn-primary float-right" @click="addDiscount()">Add Discount</button></p>
              </b-col>
              <b-col md="12 my-2">
                <div class="iq-search-bar float-right">
                  <form action="#" @submit.prevent="fetchDiscounts()" class="searchbox">
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
                  :per-page="items?.per_page"
                  :fields="fields"
                  :items="items?.data"
                  show-empty
                >
                  <template v-slot:cell(is_fixed_amount)="{ item }">
                    {{ item.is_fixed_amount === 'Y' ? 'Yes' : 'No' }}
                  </template>
                  <template v-slot:cell(actions)="{ item }">
                    <span><b-btn variant="primary" class="mb-3 mr-1" @click="editDiscount(item, 'Edit')"><i class="las la-edit"></i> Edit</b-btn></span>
                    <span><b-btn variant="danger" class="mb-3 mr-1" @click="actionDelDiscount(item.id)"><i class="las la-trash"></i> Delete</b-btn></span>
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
    <b-modal id="modal-add-discount" centered :title="modalTitle" hide-footer cancel-title="Close">
        <form @submit.prevent="saveDiscount()">
          <b-form-group class="col-md-12 required" label="Name:" label-for="name">
              <b-form-input v-model="discountForm.name" :class="errors?.name ? 'is-invalid' : ''" type="text" name="name" id="name" placeholder="Discount Name" required></b-form-input>
              <div class="invalid-feedback" v-for="(error, i) in errors?.name" :key="`name-error-${i}`"> {{ error }} </div>
          </b-form-group>
          <b-form-group class="col-md-12">
            <b-form-checkbox v-model="discountForm.is_fixed_amount">Is Fixed Amount?</b-form-checkbox>
            <div class="invalid-feedback" v-for="(error, i) in errors?.is_fixed_amount" :key="`is_fixed_amount-error-${i}`"> {{ error }} </div>
          </b-form-group>
          <b-form-group class="col-md-12" label="Discount Rate:" label-for="discount_rate" v-show="!discountForm.is_fixed_amount">
              <b-form-input v-model="discountForm.discount_rate" @keypress="isNumber($event)" :class="errors?.discount_rate ? 'is-invalid' : ''" type="text" name="discount_rate" id="discount_rate" placeholder="Discount Rate"></b-form-input>
              <div class="invalid-feedback" v-for="(error, i) in errors?.discount_rate" :key="`discount_rate-error-${i}`"> {{ error }} </div>
          </b-form-group>
          <b-form-group class="col-md-12" label="Discount Amount:" label-for="name" v-show="discountForm.is_fixed_amount">
              <b-form-input v-model="discountForm.discount_amount" @keypress="isNumber($event)" :class="errors?.discount_amount ? 'is-invalid' : ''" type="text" name="name" id="name" placeholder="Discount Amount"></b-form-input>
              <div class="invalid-feedback" v-for="(error, i) in errors?.discount_amount" :key="`discount_amount-error-${i}`"> {{ error }} </div>
          </b-form-group>
          <b-button class="mt-3 mx-2 float-right" variant="primary" type="submit" :disabled="isLoading">Save</b-button>
          <b-button class="mt-3 mx-2 float-right" variant="light" @click="cancelAction" type="button">Cancel</b-button>
        </form>
    </b-modal>
  </b-container>
</template>
<script>
import { xray } from '../../../config/pluginInit'
import discountService from '../../../services/discount'
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'discountList',
  mounted () {
    xray.index()
    this.fetchDiscounts()
  },
  computed: {
    ...mapGetters({
      userDetails: 'Auth/userDetails',
      userActiveBranch: 'Auth/userActiveBranch'
    })
  },
  watch: {
    userActiveBranch: _.debounce(function (data) {
       this.discountForm.branch_id = data?.branch_id
       this.fetchDiscounts()
    }, 300),
    'discountForm.is_fixed_amount': _.debounce(function (data) {
       if (data) {
        this.discountForm.discount_rate = ''
       } else {
        this.discountForm.discount_amount = ''
       }
    }, 300),
    currentPage: _.debounce(function (data) {
      this.fetchDiscounts()
    }, 500),
    searchItem: _.debounce(function (data) {
      this.fetchDiscounts()
    }, 500)
  },
  data () {
    return {
      filter: '',
      fields: [
        { label: 'Name', key: 'name', headerClass: 'text-left', sortable: true },
        { label: 'Is Fixed Amount?', key: 'is_fixed_amount', headerClass: 'text-left', sortable: true },
        { label: 'Discount Rate', key: 'discount_rate', headerClass: 'text-left', sortable: true },
        { label: 'Discount Amount', key: 'discount_amount', headerClass: 'text-left', sortable: true },
        { label: 'Action', key: 'actions', interpolate: true, sortable: false, width: '15%' }
      ],
      items: [],
      form_action: 'Add',
      errors: {},
      isLoading: false,
      discountForm: {
       id: '',
       name: '',
       branch_id: '',
       is_fixed_amount: false,
       discount_rate: '',
       discount_amount: ''
      },
      modalTitle: 'Add Discount',
      update: false,
      searchItem: '',
      currentPage: 1
    }
  },
  methods: {
    isNumber (evt) {
      evt = evt ?? window.event
      var charCode = evt.which ? evt.which : evt.keyCode
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46 && charCode !== 44) {
        evt.preventDefault()
      }
      return true
    },
    cancelAction () {
      this.clearForm()
      this.$bvModal.hide('modal-add-discount')
    },
    fetchDiscounts () {
      var payload = `page=${this.currentPage}&branchId=${this.userActiveBranch.id}`
      if (this.searchItem) {
        payload += `&search=${this.searchItem}`
      }
      discountService.getBranchDiscountsByPagination(payload)
      .then(({ data }) => {
        this.items = data?.data
      }).catch(err => console.log(err))
    },
    addDiscount () {
      this.form_action = 'Add'
      this.clearForm()
      this.$bvModal.show('modal-add-discount')
    },
    saveDiscount () {
      if (this.form_action === 'Edit') {
        this.updateDiscountService()
      } else {
        this.createDiscountService()
      }
    },
    createDiscountService () {
      this.isLoading = true
      this.discountForm.branch_id = this.userActiveBranch?.branch_id
      discountService.createDiscount(this.discountForm).then(({ data }) => {
          if (data?.errors) {
            this.errors = data?.errors
          }
          if (data.success) {
            this.clearForm()
            this.fetchDiscounts()
            this.$bvModal.hide('modal-add-discount')
          }
          this.$swal(data?.message)
          this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        console.log(err)
      })
    },
    updateDiscountService () {
          this.isLoading = true
          this.discountForm.branch_id = this.userActiveBranch?.branch_id
          discountService.updateDiscount(this.discountForm, this.discountForm.id).then(({ data }) => {
          if (data?.errors) {
            this.errors = data?.errors
          }
          if (data.success) {
            this.clearForm()
            this.fetchDiscounts()
            this.$bvModal.hide('modal-add-discount')
          }
          this.$swal(data?.message)
          this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        console.log(err)
      })
     },
    actionDelDiscount (id) {
      discountService.deleteDiscount(id).then(({ data }) => {
        if (data.success) {
           this.clearForm()
          this.fetchDiscounts()
         }
         this.$swal(data?.message)
       }).catch(err => console.log(err))
    },
    clearForm () {
        this.discountForm.id = ''
        this.discountForm.name = ''
        this.discountForm.is_fixed_amount = false
        this.discountForm.discount_rate = ''
        this.discountForm.discount_amount = ''
    },
    editDiscount (item, act) {
      this.clearForm()
      this.form_action = act
      this.modalTitle = `${act} Discount`
      this.discountForm.id = item?.id
      this.discountForm.name = item?.name
      this.discountForm.is_fixed_amount = item?.is_fixed_amount === 'Y'
      this.discountForm.discount_rate = item?.discount_rate
      this.discountForm.discount_amount = item?.discount_amount
      this.$bvModal.show('modal-add-discount')
    }
  }
}
</script>
