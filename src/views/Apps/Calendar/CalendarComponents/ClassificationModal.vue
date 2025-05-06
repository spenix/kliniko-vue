<template>
    <b-modal id="modal-classification" ref="modal-classification" :hide-footer="isHideMdFooter" :title="modalFormAction + ' ' + title" ok-title="Submit" cancel-title="Close" @cancel="resetFormData" @close="resetFormData" @ok.prevent="submitClassificationForm">
        <form @submit.prevent="handleSubmit(submitClassificationForm)">
            <b-row>
                <b-form-group class="col-12"
                label="Classification:"
                label-for="name"
                >
                    <b-form-input v-model="formData.name" type="text" name="name" id="name" placeholder="Classification" :disabled="isHideMdFooter" required></b-form-input>
                </b-form-group>
            </b-row>
            <b-row>
                <b-form-group class="col-12"
                label="Theme Color:"
                label-for="color"
                >
                    <b-form-input v-model="formData.color" type="color" name="color" id="color" placeholder="Theme Color" :disabled="isHideMdFooter" required></b-form-input>
                </b-form-group>
            </b-row>
            <b-row>
                <b-col cols="12">
                    <b-form-checkbox v-model="formData.isRequiredPatient" name="check-button" switch inline>
                        Is Required Patient Field?
                    </b-form-checkbox>
                </b-col>
            </b-row>
        </form>
    </b-modal>
</template>
<script>
import classification from '../../../../services/classification'
    export default {
        name: 'ClassificationComponent',
        props: {
            modalFormAction: String,
            selectedItem: Object
        },
        data () {
            return {
                isHideMdFooter: false,
                title: 'Classification',
                formData: {
                    name: this.selectedItem?.name ?? '',
                    color: this.selectedItem?.color ?? '#149997',
                    isRequiredPatient: this.selectedItem?.isRequiredPatient === 'Y'
                }
            }
        },
        methods: {
            resetFormData () {
                this.formData.name = ''
                this.formData.color = '#149997'
                this.formData.isRequiredPatient = false
            },
            submitClassificationForm () {
                if (this.modalFormAction?.toLowerCase() === 'edit') {
                    classification.updateClassification(this.formData, this.selectedItem?.id)
                    .then(({ data }) => {
                        if (data?.success) {
                            this.resetFormData()
                            this.$bvModal.hide('modal-classification')
                            this.$emit('triggerClassification')
                        }
                        this.$swal(data?.message)
                    })
                    .catch(err => console.log(err))
                } else {
                    classification.createClassification(this.formData)
                    .then(({ data }) => {
                        if (data?.success) {
                            this.resetFormData()
                            this.$bvModal.hide('modal-classification')
                            this.$emit('triggerClassification')
                        }
                        this.$swal(data?.message)
                    })
                    .catch(err => console.log(err))
                }
            }
        }
    }
</script>
