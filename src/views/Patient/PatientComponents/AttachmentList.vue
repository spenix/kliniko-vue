<template>
<tab-content-item :active="true" id="AttachmentList">
  <iq-card body-class="pb-6" >
    <template v-slot:body>
      <b-row>
        <b-col sm="12">
          <div class="iq-card">
            <div class="iq-header-title">
              <h4 class="card-title text-primary">Attachments <button type="button" v-b-modal.modal-attachment  class="btn btn-primary float-right" @click="addAttachmentItem">Add Attachment</button></h4>
            </div>
            <div class="iq-card-body pl-0 pr-0 pb-0">
              <b-row>
                <b-col md="12 mb-2">
                    <div class="iq-search-bar float-right">
                      <form action="#" @submit.prevent="getAllPatientAttachments()" class="searchbox">
                        <input type="text" class="text search-input" v-model="searchItem" placeholder="search....">
                        <a class="search-link" href="#"><i class="ri-search-line"></i></a>
                      </form>
                    </div>
                  </b-col>
                  <b-col md="12">
                      <b-table
                          striped
                          hover
                          outlined
                          id="patient-table"
                          :per-page="items?.per_page"
                          :fields="fields"
                          :items="items?.data"
                          show-empty
                          >
                          <template v-slot:cell(actions)="{ item }">
                              <!-- <span><b-btn variant="warning" class="mb-3 mr-1" title="View File" :href="item?.filename" target="_blank"><i class="las la-file"></i> View</b-btn></span> -->
                              <!-- <span><b-btn variant="warning" class="mb-3 mr-1" title="View File" v-b-modal.modal-attachment @click="actionAttachmentItem(item, 'View')"><i class="las la-file"></i> View</b-btn></span> -->
                              <span><b-btn variant="warning" class="mb-3 mr-1" title="View File" @click="actionAttachmentItem(item, 'View')"><i class="las la-file"></i> View</b-btn></span>
                              <span><b-btn variant="primary" class="mb-3 mr-1" title="Edit" @click="actionAttachmentItem(item, 'Edit')"><i class="las la-edit"></i> Edit</b-btn></span>
                              <span><b-btn variant="danger" class="mb-3 mr-1" title="Delete" @click="actionDelAttachmentItem(item.id, 'Delete')"><i class="las la-trash"></i> Delete</b-btn></span>
                          </template>
                          <template #empty="scope" class="text-center">
                            <div class="text-center">
                              <span>No data results</span>
                            </div>
                          </template>
                          </b-table>
                          <div class="row">
                          <b-col class="align-self-end">
                              <b-pagination
                              class="float-right"
                              v-model="currentPage"
                              :total-rows="items?.total"
                              :per-page="items?.per_page"
                              aria-controls="patient-table"
                              ></b-pagination>
                          </b-col>
                          </div>
                  </b-col>
              </b-row>
            </div>
          </div>
        </b-col>
      </b-row>
    </template>
    <AttachmentModal :form_action="form_action" :defaultAttachmentForm="attachmentForm" ActivityId="" @triggerAttachment="triggerAttachment($event)"/>
    <!-- <b-modal id="modal-attachment" ref="modal-attachment" :hide-footer="isHideMdFooter" :title="form_action + ' ' + title" ok-title="Submit" cancel-title="Close" @ok.prevent="submitAttatchmentForm">
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(submitAttatchmentForm)">
            <b-row>
              <b-form-group class="col-12"
                  label-for="attachment_type"
                  label="Attachment Type:">
                <ValidationProvider name="Attachment Type" rules="required" v-slot="{ errors }">
                  <b-form-select v-model="attachmentForm.attachment_type"  plain :options="attachment_types" id="attachment_type" name="attachment_type" :class="(errors.length > 0 ? ' is-invalid' : '')" :disabled="isHideMdFooter" required>
                    <template v-slot:first>
                      <b-form-select-option :value="null" hidden>Select Attachment Type</b-form-select-option>
                    </template>
                  </b-form-select>
                  <div class="invalid-feedback">
                    <span>{{ errors[0] }}</span>
                  </div>
                </ValidationProvider>
              </b-form-group>
            </b-row>
            <b-row>
              <b-form-group class="col-12"
                label="Title:"
                label-for="title"
              >
              <ValidationProvider name="Title" rules="required" v-slot="{ errors }">
                <b-form-input v-model="attachmentForm.title" type="text" name="title" id="title" placeholder="Title" :class="(errors.length > 0 ? ' is-invalid' : '')" :disabled="isHideMdFooter" required></b-form-input>
                <div class="invalid-feedback">
                    <span>{{ errors[0] }}</span>
                  </div>
                </ValidationProvider>
              </b-form-group>
            </b-row>
            <b-row>
              <b-form-group class="col-12"
                label="File:"
                label-for="file"
              >
              <ValidationProvider name="File" rules="required" v-slot="{ errors }">
                <b-form-file type="file" @change="previewFileInput" :class="(errors.length > 0 ? ' is-invalid' : '')" name="file" id="file" accept="application/pdf,application/vnd.ms-excel,image/jpg,image/png,image/jpeg" placeholder="File" required></b-form-file>
                <label v-if="attachmentForm.id">File Path: <small>{{  attachmentForm.file_path }}</small></label>
                <div class="invalid-feedback">
                    <span>{{ errors[0] }}</span>
                  </div>
              </ValidationProvider>
              </b-form-group>
            </b-row>
            <b-row>
              <b-form-group class="col-12" label="Description" label-for="textareaDescription">
              <ValidationProvider name="Description" rules="required" v-slot="{ errors }">
                <b-form-textarea id="textareaDescription" v-model="attachmentForm.description" rows="3" :disabled="isHideMdFooter" ></b-form-textarea>
                <div class="invalid-feedback">
                  <span>{{ errors[0] }}</span>
                </div>
              </ValidationProvider>
              </b-form-group>
            </b-row>
          </form>
      </validation-observer>
    </b-modal> -->
    <CoolLightBox
          :items="imageItems"
          :index="index"
          @close="index = null" />
  </iq-card>
</tab-content-item>
</template>
<script>
    import attachmentService from '../../../services/attachment'
    import AttachmentModal from '../../GlobalComponents/Modals/AttachmentModal.vue'
    import _ from 'lodash'
    import CoolLightBox from 'vue-cool-lightbox'
    import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
    export default {
        name: 'AttachmentList',
        props: {
            currentAction: String,
            patientId: String
        },
        components: {
          AttachmentModal,
          CoolLightBox
        },
        data () {
            return {
                title: 'Attachment',
                baseUrl: process.env.VUE_APP_API_BASE_URL,
                isLoading: false,
                filter: {
                    prescription_id: '',
                    date: '',
                    description: '' },
                fields: [
                    { label: 'Attachment Type', key: 'attachment_type', headerClass: 'text-left', sortable: true },
                    { label: 'Title', key: 'title', headerClass: 'text-left', sortable: true },
                    { label: 'Description', key: 'description', headerClass: 'text-left', sortable: true },
                    { label: 'Actions', key: 'actions', sortable: false }
                ],
                form_action: 'Add',
                items: [],
                currentPage: 1,
                errors: {},
                attachment_types: [
                  { text: 'General', value: 'general' },
                  { text: 'Xray', value: 'xray' },
                  { text: 'Contract', value: 'contract' },
                  { text: 'Progress', value: 'progress' }
                ],
                attachmentForm: {
                  id: '',
                  activity_id: '',
                  isUploadNewFile: false,
                  patient_id: this.patientId,
                  attachment_type: null,
                  title: '',
                  description: '',
                  file: '',
                  file_path: ''
                },
                searchItem: '',
                imageItems: [],
                index: null
            }
        },
        watch: {
          searchItem: _.debounce(function (data) {
            this.getAllPatientAttachments()
          }, 300),
          currentPage: _.debounce(function (data) {
            this.getAllPatientAttachments()
          }, 300)
        },
        computed: {
            prescriptionRows () {
              return this.attachmentForm.prescriptionList.length
            },
            isHideMdFooter () {
              return this.form_action === 'View'
            }
        },
        methods: {
          triggerAttachment (e) {
            if (e) {
              this.getAllPatientAttachments()
            }
          },
          clearModalForm () {
            this.attachmentForm.id = ''
            this.attachmentForm.isUploadNewFile = false
            this.attachmentForm.attachment_type = null
            this.attachmentForm.title = ''
            this.attachmentForm.description = ''
            this.attachmentForm.file = ''
          },
          getAllPatientAttachments () {
            this.imageItems = []
            var payload = `page=${this.currentPage}&patient_id=${this.patientId}`
            if (this.searchItem) {
              payload += `&search=${this.searchItem}`
            }
            attachmentService.getAllAttachments(payload).then(({ data }) => {
              if (data.success) {
                this.items = data?.data
                this.imageItems = this.items?.data?.map(d => {
                  return this.getImageUri(d?.filename)
                })
              }
            }).catch(err => console.log(err))
          },
          getImageUri (uri) {
              if (uri) {
                  var cnt = uri.split('/')
                  if (cnt.length > 3) {
                  return uri
                  } else {
                  return process.env.VUE_APP_API_BASE_URL + uri
                  }
              }
          },
          addAttachmentItem () {
            this.form_action = 'Add'
            this.clearModalForm()
          },
          actionAttachmentItem (item, act) {
            // if (act === 'View') {
            //   if (item?.filename) {
            //     var cnt2 = item?.filename.split('/')
            //     var url = cnt2.length > 3 ? item?.filename : process.env.VUE_APP_API_BASE_URL + item?.filename
            //     window.open(url, '_blank')
            //   }
            // } else {
              this.index = null
              var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i
              if (allowedExtensions.exec(item?.filename) && act === 'View') {
                this.imageItems.forEach((d, i) => {
                  if (d === this.getImageUri(item?.filename)) {
                    this.index = i
                  }
                })
              } else {
                this.form_action = act
                this.attachmentForm.id = item?.id
                this.attachmentForm.isUploadNewFile = false
                this.attachmentForm.attachment_type = item?.attachment_type
                this.attachmentForm.title = item?.title
                this.attachmentForm.description = item?.description
                this.attachmentForm.file_path = this.getImageUri(item?.filename)
                this.$bvModal.show('modal-attachment')
              }
            // }
          },
          actionDelAttachmentItem (id) {
            attachmentService.deleteAttachment(id).then(({ data }) => {
              if (data.success) {
                this.getAllPatientAttachments()
                this.$swal('Attachment Record was deleted successfully!')
              }
            }).catch(err => console.log(err))
          }
        },
        mounted () {
            this.getAllPatientAttachments()
        }
    }
</script>
