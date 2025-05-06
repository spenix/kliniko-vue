<template>
  <b-modal id="modal-attachment" :size="form_action !== 'View' ? 'md' : 'xl'" ref="modal-attachment" :hide-footer="isHideMdAttachFooter()" :title="form_action + ' ' + title" :ok-disabled="isLoading" :ok-title="isLoading ? 'Loading...' : 'Submit'" cancel-title="Close" @ok.prevent="submitAttatchmentForm">
   <div v-if="form_action !== 'View'">
    <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(submitAttatchmentForm)">
          <b-row>
            <b-form-group class="col-12"
                label-for="attachment_type"
                label="Attachment Type:">
                <b-form-select v-model="attachmentForm.attachment_type"  plain :options="attachment_types" id="attachment_type" name="attachment_type" :class="(errors?.attachment_type?.length > 0 ? ' is-invalid' : '')" :disabled="isHideMdAttachFooter()" required>
                  <template v-slot:first>
                    <b-form-select-option :value="null" hidden>Select Attachment Type</b-form-select-option>
                  </template>
                </b-form-select>
                <div class="invalid-feedback" v-for="(err, i) in errors?.attachment_type" :key="`attachmentTypeErr-${i}`">
                  <span>{{ err }}</span>
                </div>
            </b-form-group>
          </b-row>
          <b-row>
            <b-form-group class="col-12"
              label="Title:"
              label-for="title"
            >
              <b-form-input v-model="attachmentForm.title" type="text" name="title" id="title" placeholder="Title" :class="(errors?.title?.length > 0 ? ' is-invalid' : '')" :disabled="isHideMdAttachFooter()" required></b-form-input>
              <div class="invalid-feedback" v-for="(err, i) in errors?.title" :key="`attachmentTypeErr-${i}`">
                  <span>{{ err }}</span>
                </div>
            </b-form-group>
          </b-row>
          <b-row>
            <b-form-group class="col-12"
              label="File:"
              label-for="file"
            >
              <b-form-file type="file" :class="(errors?.file_path?.length > 0 ? ' is-invalid' : '')" name="file" id="file" accept="application/pdf,application/vnd.ms-excel,image/*"  @change="previewFileInput" placeholder="File"  required></b-form-file>
              <label v-if="attachmentForm.id">File Path: <small>{{  attachmentForm.file_path }}</small></label>
              <div class="invalid-feedback" v-for="(err, i) in errors?.file_path" :key="`attachmentTypeErr-${i}`">
                  <span>{{ err }}</span>
                </div>
            </b-form-group>
          </b-row>
          <b-row>
            <b-form-group class="col-12" label="Description" label-for="textareaDescription">
            <ValidationProvider name="Description" rules="required" v-slot="{ errors }">
              <b-form-textarea id="textareaDescription" v-model="attachmentForm.description" rows="3" :disabled="isHideMdAttachFooter()" ></b-form-textarea>
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
            </b-form-group>
          </b-row>
        </form>
    </validation-observer>
   </div>
   <div v-else>
      <div v-if="isImage">
        <CoolLightBox
          :items="items"
          :index="index"
          @close="index = null" />
          <div class="images-wrapper">
          <div
            class="image"
            v-for="(image, imageIndex) in items"
            :key="`imageIndex-${imageIndex}`"
            @click="index = imageIndex"
            :style="setCssBackground(image)"
          ></div>
        </div>
      </div>
      <div v-else>
        <iframe
            :src="attachmentForm.file_path"
            frameBorder="0"
            scrolling="auto"
            height="500"
            width="100%"
        ></iframe>
      </div>
   </div>
 </b-modal>
</template>
<script>
// import _ from 'lodash'
import attachmentService from '../../../services/attachment'
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
import _ from 'lodash'
export default ({
  name: 'AttachmentModal',
  components: {
    CoolLightBox
  },
  props: {
      form_action: String,
      ActivityId: String,
      defaultAttachmentForm: Object
  },
  data () {
      return {
          title: 'Attachment',
          attachmentForm: this.defaultAttachmentForm,
          attachment_types: [
                { text: 'General', value: 'general' },
                { text: 'Xray', value: 'xray' },
                { text: 'Contract', value: 'contract' },
                { text: 'Progress', value: 'progress' }
              ],
          errors: {},
          isLoading: false,
          isImage: false,
          index: null,
          items: []
      }
  },
  watch: {
    'attachmentForm.file_path': _.debounce(function (data) {
      // fileDataArr = data.split('.')
      this.isImage = false
      this.items = []
      if (data) {
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i
        if (allowedExtensions.exec(data)) {
          this.isImage = true
          this.items.push(data)
        }
      }
      // console.log('attachmentForm.file_path => ', data.split('.'))
    }, 300)
  },
  methods: {
      previewFileInput: function (event) {
        const input = event.target
          if (input.files && input.files[0]) {
            const reader = new FileReader()
            reader.onload = (e) => {
              this.attachmentForm.file = e.target.result
              this.attachmentForm.isUploadNewFile = true
            }
            reader.readAsDataURL(input.files[0])
          }
        // old
          // const input = event.target
          // if (input.files && input.files[0]) {
          //   const reader = new FileReader()
          //   reader.onload = (e) => {
          //     console.log('reader ==> ', e.target.result)
          //   }
          //   console.log('input ====> ', input)
          //   this.attachmentForm.isUploadNewFile = true
          //   this.attachmentForm.file = input.files[0]
          // }
        },
        setCssBackground (img) {
           if (img) {
               return {
               'background-image': `url('${this.getImageUri(img)}')`,
               'background-position': 'center',
               'background-repeat': 'no-repeat',
               'background-size': 'contain',
               'min-height': '300px',
               'width': '100%'
               }
           } else {
               return {
                   'min-height': '300px',
                   'width': '100%',
                   'background-color': '#faf6f5'
               }
           }
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
      clearModalForm () {
          this.attachmentForm.id = ''
          this.attachmentForm.isUploadNewFile = false
          this.attachmentForm.attachment_type = null
          this.attachmentForm.title = ''
          this.attachmentForm.description = ''
          this.attachmentForm.file = ''
          this.attachmentForm.file_path = ''
          this.isImage = false
          this.items = []
        },
        submitAttatchmentForm () {
          this.isLoading = true
          var formData = new FormData()
          formData.append('id', this.attachmentForm.id)
          formData.append('activity_id', this.ActivityId)
          formData.append('isUploadNewFile', this.attachmentForm.isUploadNewFile)
          formData.append('attachment_type', this.attachmentForm.attachment_type)
          formData.append('patient_id', this.attachmentForm.patient_id)
          formData.append('title', this.attachmentForm.title)
          formData.append('description', this.attachmentForm.description)
          formData.append('file', this.attachmentForm.file)
          if (this.form_action === 'Edit') {
            formData.append('_method', 'PUT')
            attachmentService.updateAttachment(formData, this.attachmentForm.id).then(({ data }) => {
              if (data.success) {
                this.$swal('Attachment Record was edited successfully!')
                this.clearModalForm()
                this.$bvModal.hide('modal-attachment')
                 this.$emit('triggerAttachment', true)
              }
              this.isLoading = false
            }).catch((error) => {
              const { errors, message } = error.response.data
              this.errors = errors
              this.$swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: message
              })
          })
          } else {
            attachmentService.createAttachment(formData).then(({ data }) => {
              if (data.success) {
                this.$swal('Attachment Record was saved successfully!')
                this.clearModalForm()
                this.$bvModal.hide('modal-attachment')
                 this.$emit('triggerAttachment', true)
              }
              this.isLoading = false
            }).catch((error) => {
              this.isLoading = false
              const { errors, message } = error.response.data
              this.errors = errors
              this.$swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: message
              })
          })
          }
        },
      isHideMdAttachFooter () {
            return this.form_action === 'View'
      }
  }
})
</script>
