<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Expenses</h4>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col md="10">
                <p>List of Expenses</p>
              </b-col>
              <b-col md="2" align-h="end">
                <b-button @click="showAddExpenseModal()" variant="primary">Add Expense</b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <b-table
                  id="my-table"
                  striped
                  hover
                  outlined
                  :per-page="perPage"
                  :current-page="currentPage"
                  :fields="fields"
                  :items="items"
                  :filter="filter"
                >
                  <template v-slot:cell(expense_date)="{ item }">
                    {{ moment(item.expense_date).format('LL') }}
                  </template>
                  <template v-slot:cell(expense_type)="{ item }">
                    {{ item.expense_type.name }}
                  </template>
                  <template v-slot:cell(is_overhead)="{ item }">
                    <b-badge variant="light" v-show="item.is_overhead == 'N'">NO</b-badge>
                    <b-badge variant="success" v-show="item.is_overhead == 'Y'">YES</b-badge>
                  </template>
                  <template v-slot:cell(actions)="{ item }">
                    <span><b-btn variant="primary" class="mb-3 mr-1" @click="editExpense(item)"><i class="las la-edit"></i> Edit</b-btn></span>
                  </template>
                </b-table>
              </b-col>
            </b-row>
            <div class="row">
              <b-col class="align-self-end">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="rows"
                  :per-page="perPage"
                  aria-controls="my-table"
                ></b-pagination>
              </b-col>
            </div>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal id="modal-add-expense" centered :title="modalTitle" hide-footer cancel-title="Close">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(saveExpense)">
          <b-form-group class="col-md-12" label="Expense Type" label-for="selectexpensetype">
            <ValidationProvider name="Expense Type" rules="required" v-slot="{ errors }">
              <b-form-select v-model="expense.expense_type_id"  plain :options="expenseTypes" id="selectexpensetype" :class="(errors.length > 0 ? ' is-invalid' : '')">
                <template v-slot:first>
                  <b-form-select-option :value="null">Select Expense Type</b-form-select-option>
                </template>
              </b-form-select>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-form-group class="col-md-12" label="Particular:" label-for="particular">
            <ValidationProvider name="Particular" rules="required" v-slot="{ errors }">
              <b-form-input v-model="expense.particular" type="text" placeholder="Particular" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-form-group class="col-md-12" label="Date of Expense" label-for="date">
            <ValidationProvider name="Date of Expense" rules="required" v-slot="{ errors }">
              <b-form-input v-model="expense.expense_date" type="date" id="date" :value="expense.expense_date" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-form-group class="col-md-12" label="Amount" label-for="notes">
            <ValidationProvider name="Amount" rules="required" v-slot="{ errors }">
              <b-form-input v-model="expense.amount" type="number" id="amount" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-form-group class="col-md-12" label="Description" label-for="notes">
            <ValidationProvider name="Description" rules="required" v-slot="{ errors }">
              <b-form-textarea v-model="expense.description" id="description" rows="5" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-textarea>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
          </b-form-group>
          <b-form-group class="col-md-12">
            <b-form-checkbox v-model="expense.is_overhead_chk" @change="isOverheadCheck($event)">Is overhead?</b-form-checkbox>
          </b-form-group>
          <b-button class="mt-3" variant="primary" type="submit">Save</b-button>
        </form>
      </validation-observer>
    </b-modal>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import expense from '../../services/expense'
import expenseType from '../../services/expense-type'
import moment from 'moment'

export default {
  name: 'Expenses',
  mounted () {
    xray.index()
    this.fetchExpenses()
    this.fetchExpenseTypes()
  },
  data () {
    return {
      filter: '',
      fields: [
        { label: 'Date', key: 'expense_date', headerClass: 'text-left' },
        { label: 'Expense Type', key: 'expense_type', headerClass: 'text-left' },
        { label: 'Particular', key: 'particular', headerClass: 'text-left' },
        { label: 'Description', key: 'description', headerClass: 'text-left' },
        { label: 'Amount', key: 'amount', headerClass: 'text-left' },
        { label: 'Is Overhead?', key: 'is_overhead', headerClass: 'text-left' },
        { label: 'Action', key: 'actions', representedAs: ({ id, name }) => `<button variant="danger" class="mb-3 mr-1" @click="">View</button>`, interpolate: true, sortable: false }
      ],
      items: [],
      expense: {
        id: '',
        expense_type_id: '',
        particular: '',
        is_overhead_chk: false,
        is_overhead: 'N',
        expense_date: moment(new Date()).format('YYYY-MM-DD')
      },
      expenseTypes: [],
      perPage: 10,
      currentPage: 1,
      moment: moment,
      modalTitle: 'Add Expense'
    }
  },
  computed: {
    rows () {
      return this.items.length
    }
  },
  methods: {
    fetchExpenses () {
      expense.getAllExpenses().then(response => {
        if (response.data.success) {
          this.items = response.data.data
        }
      }).catch(err => console.log(err))
    },
    fetchExpenseTypes () {
      expenseType.getAllExpenseTypes().then(response => {
        if (response.data.success) {
          const expenseTypes = response.data.data
          this.expenseTypes = []
          expenseTypes.forEach(expense => {
            this.expenseTypes.push({ value: expense.id, text: expense.name })
          })
        }
      }).catch(err => console.log(err))
    },
    saveExpense () {
      if (this.update) {
        this.updateExpense()
      } else {
        this.createExpense()
      }
    },
    createExpense () {
      expense.createExpense(this.expense).then(response => {
        if (response.data.success) {
          this.$swal('Expense save successfully!!!')
          this.fetchExpenses()
          this.$bvModal.hide('modal-add-expense')
        }
      }).catch(err => console.log(err))
    },
    updateExpense () {
      expense.updateExpense(this.expense, this.expense.id).then(response => {
        if (response.data.success) {
          this.$swal('Expense save successfully!!!')
          this.fetchExpenses()
          this.clearForm()
          this.$bvModal.hide('modal-add-expense')
        }
      }).catch(err => console.log(err))
    },
    isOverheadCheck (value) {
      if (value) {
        this.expense.is_overhead = 'Y'
      } else {
        this.expense.is_overhead = 'N'
      }
    },
    openExpenseLog (id) {
      this.$router.push('/expenseLogs/view/' + id)
    },
    showAddExpenseModal () {
      this.update = false
      this.clearForm()
      this.modalTitle = 'Add Expense'
      this.$bvModal.show('modal-add-expense')
    },
    editExpense (item) {
      this.modalTitle = 'Edit Expense'
      this.update = true
      this.expense = item
      this.$bvModal.show('modal-add-expense')
    },
    clearForm () {
      this.expense.id = ''
      this.expense.expense_type_id = ''
      this.expense.expense_date = moment(new Date()).format('YYYY-MM-DD')
      this.expense.description = ''
      this.expense.amount = ''
    }
  }
}
</script>
