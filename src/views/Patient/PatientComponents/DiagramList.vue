<template>
<iq-card body-class="pb-6" >
  <template v-slot:body>
    <b-row>
      <b-col sm="12">
        <div class="iq-card">
          <div class="iq-header-title">
            <h4 class="card-title text-primary">Diagrams <button type="button"  class="btn btn-primary float-right" @click="addPatienDiagram">Add Diagram</button></h4>
          </div>
          <div class="iq-card-body pl-0 pr-0 pb-0">
            <b-row>
                <b-col md="12">
                    <b-table
                        striped
                        hover
                        outlined
                        id="patient-table"
                        :per-page="perPage"
                        :current-page="currentPage"
                        :fields="fields"
                        :items="items"
                        :filter="filter"
                        >
                        <template v-slot:cell(remarks)="{ item }">{{  item?.remarks ?? 'N/A'  }}</template>
                        <template v-slot:cell(actions)="{ item }">
                            <span><b-btn variant="primary" class="mb-3 mr-1" title="Edit" v-b-modal.modal-attachment @click="actionPatientDiagram(item.id, 'edit')"><i class="las la-edit"></i> Edit</b-btn></span>
                            <span><b-btn variant="danger" class="mb-3 mr-1" title="Delete" @click="actionDelPatientDiagram(item.id)"><i class="las la-trash"></i> Delete</b-btn></span>
                        </template>
                        </b-table>

                        <div class="row">
                        <b-col class="align-self-end">
                            <b-pagination
                              class="float-right"
                              v-model="currentPage"
                              :total-rows="rows"
                              :per-page="perPage"
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
</iq-card>
</template>
<script>
    import patientDiagramRecordService from '../../../services/patientDiagramRecord'
    export default {
        name: 'DiagramList',
        props: {
            currentAction: String,
            patientId: String
        },
        data () {
            return {
                title: 'Attachment',
                isLoading: false,
                filter: {
                    prescription_id: '',
                    date: '',
                    description: '' },
                fields: [
                    { label: 'Created By', key: 'createdBy', headerClass: 'text-left', sortable: true },
                    { label: 'Date', key: 'createdAt', headerClass: 'text-left', sortable: true },
                    { label: 'Remarks', key: 'remarks', headerClass: 'text-left', sortable: true },
                    { label: 'Actions', key: 'actions', sortable: false }
                ],
                form_action: 'Add',
                items: [],
                perPage: 10,
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
                  isUploadNewFile: false,
                  patient_id: this.patientId,
                  attachment_type: null,
                  title: '',
                  description: '',
                  file: '',
                  file_path: ''
                }
            }
        },
        computed: {
            rows () {
                return this.items.length
            }
        },
        methods: {
          addPatienDiagram () {
            var param = window.btoa(JSON.stringify({ action: 'add', diagramId: 0 }))
            this.$router.push(`/patient/diagram/${this.patientId}/${param}`)
          },
          actionDelPatientDiagram (id) {
            patientDiagramRecordService.deletePatientDiagramRocord(id).then(({ data }) => {
              if (data.success) {
                this.getAllPatientDiagramRecord()
                this.$swal('Patient Diagram Record was deleted successfully!')
              }
            }).catch(err => console.log(err))
           },
          actionPatientDiagram (diagramId, action) {
            var param = window.btoa(JSON.stringify({ action, diagramId }))
            this.$router.push(`/patient/diagram/${this.patientId}/${param}`)
           },
          getAllPatientDiagramRecord () {
            patientDiagramRecordService.getAllPatientDiagramRocords({ patient_id: this.patientId }).then(({ data }) => {
              if (data.success) {
                this.items = data?.data
              }
            }).catch(err => console.log(err))
          }
        },
        mounted () {
            this.getAllPatientDiagramRecord()
        }
    }
</script>
