<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Users</h4>
          </template>
          <template v-slot:body>
            <b-row class="mb-2">
              <b-col md="12">
                <p>List of Users <button type="button" v-if="userDetails.role != 'AD'" class="btn btn-primary float-right" @click="addUserDetails()">Add User</button></p>
              </b-col>
              <b-col md="12 mt-2">
                <div class="iq-search-bar float-right">
                  <form action="#" @submit.prevent="fetchUsers()" class="searchbox">
                    <input type="text" class="text search-input" v-model="searchItem" placeholder="search....">
                    <a class="search-link" href="#"><i class="ri-search-line"></i></a>
                  </form>
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <b-table
                  class="table table-sm"
                  striped
                  hover
                  outlined
                  :per-page="items?.per_page"
                  :fields="fields"
                  :items="items?.data"
                  show-empty
                >
                  <template v-slot:cell(actions)="{ item }">
                    <span><b-btn variant="primary" class="mb-3 mr-1" @click="editUserDetails(item, 'Edit')"><i class="las la-edit"></i> Edit</b-btn></span>
                    <span><b-btn variant="danger" class="mb-3 mr-1" @click="actionDelUser(item.id)"><i class="las la-trash"></i> Delete</b-btn></span>
                  </template>
                  <template #empty="scope" class="text-center">
                    <div class="text-center">
                      <span>No data results</span>
                    </div>
                  </template>
                </b-table>
              </b-col>
            </b-row>
            <b-row class="mb-3">
                <b-col md="12">
                  <b-pagination
                  class="float-right"
                  v-model="currentPage"
                  :total-rows="items?.total"
                  :per-page="items?.per_page"
                  aria-controls="my-table"
                  ></b-pagination>
                </b-col>
              </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal id="modal-add-user" centered :title="modalTitle" hide-footer cancel-title="Close" >
        <form @submit.prevent="saveUserDetails()">
          <div class="row">
              <div class="col-2"></div>
              <div class="col-8 mb-4">
                <b-img class="user-profile rounded height-100 width-100" :src="userForm.profile_path" alt="user-profile" />
              </div>
              <div class="col-2"></div>
            </div>
            <b-form-group class="col-12"
              label="Profile:"
              label-for="profile"
            >
              <b-form-file type="file" @change="previewFileInput" :class="errors?.profile_path ? 'is-invalid' : ''" accept="image/jpg,image/png,image/jpeg" placeholder="profile"></b-form-file>
              <div class="invalid-feedback" v-for="(error, i) in errors?.profile_path" :key="`password-error-${i}`"> {{ error }} </div>
            </b-form-group>
          <b-form-group class="col-md-12" label="First Name:" label-for="firstname">
              <b-form-input v-model="userForm.firstname" :class="errors?.firstname ? 'is-invalid' : ''" type="text" name="firstname" id="firstname" placeholder="First Name" required></b-form-input>
              <div class="invalid-feedback" v-for="(error, i) in errors?.firstname" :key="`firstname-error-${i}`"> {{ error }} </div>
          </b-form-group>
          <b-form-group class="col-md-12" label="Middle Name:" label-for="middlename">
              <b-form-input v-model="userForm.middlename" :class="errors?.middlename ? 'is-invalid' : ''" type="text" name="middlename" id="middlename" placeholder="Middle Name" ></b-form-input>
              <div class="invalid-feedback" v-for="(error, i) in errors?.middlename" :key="`middlename-error-${i}`"> {{ error }} </div>
          </b-form-group>
          <b-form-group class="col-md-12" label="Last Name:" label-for="lastname">
              <b-form-input v-model="userForm.lastname" :class="errors?.lastname ? 'is-invalid' : ''" type="text" name="lastname" id="lastname" placeholder="Last Name" required></b-form-input>
              <div class="invalid-feedback" v-for="(error, i) in errors?.lastname" :key="`lastname-error-${i}`"> {{ error }} </div>
          </b-form-group>
          <b-form-group class="col-md-12" label="Email:" label-for="email">
              <b-form-input v-model="userForm.email" :class="errors?.email ? 'is-invalid' : ''" type="email" name="email" id="email" placeholder="Email" required></b-form-input>
              <div class="invalid-feedback" v-for="(error, i) in errors?.email" :key="`email-error-${i}`"> {{ error }} </div>
          </b-form-group>
          <b-form-group class="col-md-12" label="Password:" label-for="password">
              <b-form-input v-model="userForm.password" :class="errors?.password ? 'is-invalid' : ''" type="password" name="password" id="password" placeholder="Password" required></b-form-input>
              <div class="invalid-feedback" v-for="(error, i) in errors?.password" :key="`password-error-${i}`"> {{ error }} </div>
          </b-form-group>
          <b-form-group class="col-12"
                label-for="user_roles"
                label="Role:">
              <b-form-select v-model="userForm.role" :class="errors?.role ? 'is-invalid' : ''"  plain :options="userRoles" id="user_roles" name="user_roles" required>
                <template v-slot:first>
                  <b-form-select-option :value="null" hidden>Select Role</b-form-select-option>
                </template>
              </b-form-select>
              <div class="invalid-feedback" v-for="(error, i) in errors?.role" :key="`role-error-${i}`"> {{ error }} </div>
          </b-form-group>
          <b-button class="mt-3 mx-2 float-right" variant="primary" type="submit" :disabled="isLoading">Save</b-button>
          <b-button class="mt-3 mx-2 float-right" variant="light" @click="cancelAction" type="button">Cancel</b-button>
        </form>
    </b-modal>
  </b-container>
</template>
<script>
import { xray } from '../../../config/pluginInit'
import userService from '../../../services/user'
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'SystemUserList',
  mounted () {
    xray.index()
    this.fetchUsers()
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
        { label: 'Email', key: 'email', headerClass: 'text-left', sortable: true },
        { label: 'Role', key: 'role_name', headerClass: 'text-right', sortable: true },
        { label: 'Action', key: 'actions', interpolate: true, sortable: false, width: '15%' }
      ],
      currentPage: 1,
      items: [],
      searchItem: '',
      userRoles: [ { text: 'SYSTEM ADMINISTRATOR', value: 'SA' },
        { text: 'ADMINISTRATOR', value: 'AD' },
        { text: 'OPERATIONAL MANAGER', value: 'OM' },
        { text: 'OFFICER IN CHARGE', value: 'OIC' },
        { text: 'DENTAL ASSISTANT', value: 'DA' },
        { text: 'Receptionist', value: 'RC' }

      ],
      form_action: 'Add',
      errors: {},
      isLoading: false,
      userForm: {
        isUploadImg: false,
        id: '',
        firstname: '',
        lastname: '',
        middlename: '',
        email: '',
        password: '',
        role: null,
        profile_path: require('../../../assets/images/user/11.png')
      },
      modalTitle: 'Add User',
      update: false
    }
  },
  watch: {
    searchItem: _.debounce(function (data) {
      this.fetchUsers()
    }, 500),
    currentPage: _.debounce(function (data) {
      this.fetchUsers()
    }, 500)
  },
  methods: {
    previewFileInput: function (event) {
      const input = event.target
      if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.userForm.isUploadImg = true
          this.userForm.profile_path = e.target.result
        }
        reader.readAsDataURL(input.files[0])
      }
    },
    getRoleNameDisplay (role = '') {
     var roleData = this.userRoles.filter(d => {
        if (d?.value === role) {
          return d
        }
      })
      return roleData[0]?.text
    },
    cancelAction () {
      this.clearForm()
      this.$bvModal.hide('modal-add-user')
    },
    fetchUsers () {
      var payload = `page=${this.currentPage}`
      if (this.searchItem) {
        payload += `&search=${this.searchItem}`
      }
      userService.getAllUserList(payload)
      .then(({ data }) => {
        this.items = data?.data
      }).catch(err => console.log(err))
    },
    addUserDetails () {
      this.form_action = 'Add'
      this.clearForm()
      this.$bvModal.show('modal-add-user')
    },
    saveUserDetails () {
      if (this.form_action === 'Edit') {
        this.updateUserService()
      } else {
        this.createUserService()
      }
    },
    createUserService () {
      this.isLoading = true
      userService.createUser(this.userForm).then(({ data }) => {
          if (data.success) {
            this.clearForm()
            this.fetchUsers()
            this.$bvModal.hide('modal-add-user')
          }
          this.$swal(data?.message)
          this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        console.log(err)
      })
    },
    updateUserService () {
          this.isLoading = true
          userService.updateUser(this.userForm, this.userForm.id).then(({ data }) => {
          if (data?.errors) {
            this.errors = data?.errors
          }
          if (data.success) {
            this.clearForm()
            this.fetchUsers()
            this.$bvModal.hide('modal-add-user')
          }
          this.$swal(data?.message)
          this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        console.log(err)
      })
     },
    actionDelUser (id) {
      userService.deleteUser(id).then(({ data }) => {
        if (data.success) {
           this.clearForm()
          this.fetchUsers()
         }
         this.$swal(data?.message)
       }).catch(err => console.log(err))
    },
    clearForm () {
        this.userForm.id = ''
        this.userForm.firstname = ''
        this.userForm.lastname = ''
        this.userForm.middlename = ''
        this.userForm.email = ''
        this.userForm.password = ''
        this.userForm.role = ''
        this.userForm.profile_path = require('../../../assets/images/user/11.png')
        this.userForm.isUploadImg = false
    },
    editUserDetails (item, act) {
      this.clearForm()
      this.form_action = act
      this.modalTitle = `${act} User`
      this.userForm.id = item?.id
      this.userForm.firstname = item?.firstname
      this.userForm.lastname = item?.lastname
      this.userForm.middlename = item?.middlename
      this.userForm.email = item?.email
      this.userForm.password = '**********'
      this.userForm.role = item?.role
      this.$bvModal.show('modal-add-user')
      if (item?.profile_path) {
        var cnt = item?.profile_path.split('/')
        if (cnt.length > 3) {
          this.userForm.profile_path = item?.profile_path
        } else {
          this.userForm.profile_path = process.env.VUE_APP_API_BASE_URL + item?.profile_path
        }
        this.userForm.isUploadImg = false
      }
    }
  }
}
</script>
