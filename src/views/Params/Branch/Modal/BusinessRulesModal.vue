<template>
    <b-modal id="modal-business-rules" :title="title" hide-footer ok-title="Submit" cancel-title="Close">
        <form @submit.prevent="handleSubmit()">
        <b-form-group class="col-md-12" label="Administrator/s:" label-for="branch_administrator">
            <multiselect v-model="formData.administrator" name="branch_administrator" id="branch_administrator" :options="userAdministrators" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Select Branch Administrator" label="name" track-by="name" required  />
        </b-form-group>
        <b-form-group class="col-md-12" label="Operational Manager:" label-for="branch_operational_manager">
            <multiselect v-model="formData.operational_manager" name="branch_operational_manager" id="branch_operational_manager" :options="userOperationalManagers" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Select Branch Operational Manager" label="name" track-by="name" />
        </b-form-group>
        <b-form-group class="col-md-12" label="OIC:" label-for="branch_oic">
            <multiselect v-model="formData.oic" name="branch_oic" id="branch_oic" :options="userOICs" :multiple="false" :close-on-select="true" :clear-on-select="true" :preserve-search="true" placeholder="Select Branch OIC" label="name" track-by="name" />
        </b-form-group>
        <b-form-group class="col-md-12" label="Receptionist/s:" label-for="branch_receptionist">
            <multiselect v-model="formData.receptionist" name="branch_receptionist" id="branch_receptionist" :options="userRecrptionists" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Select Branch Receptionist" label="name" track-by="name"  />
        </b-form-group>
        <b-form-group class="col-md-12" label="Dental Assistant/s:" label-for="branch_dental_assistant">
            <multiselect v-model="formData.dental_assistant" name="branch_dental_assistant" id="branch_dental_assistant" :options="userDentalAssistants" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Select Branch Dental Assistant" label="name" track-by="name"  />
        </b-form-group>
        <b-button class="mt-3 float-right" variant="primary" type="submit">Save</b-button>
        <b-button class="mt-3 float-right" variant="light" type="button" @click="closeBusinessRoleModal">Cancel</b-button>
    </form>
    </b-modal>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
import Multiselect from 'vue-multiselect'
import businessRuleService from '../../../../services/businessRule'
import { xray } from '../../../../config/pluginInit'
import _ from 'lodash'
export default ({
    name: 'BusinessRules',
    components: {
        Multiselect
    },
    mounted () {
        xray.index()
    },
    props: {
        selectedBranch: Object
    },
    watch: {
        selectedBranch: _.debounce(function (data) {
            this.getAllUsersListByGroup()
            this.resetFormData()
            this.getBranchBusinessRules()
    }, 500)
    },
    data () {
        return {
            title: 'People',
            value: [],
            options: [],
            userslist: [],
            action: 'add',
            formData: {
                branch_id: this.selectedBranch?.id,
                administrator: null,
                operational_manager: null,
                oic: null,
                receptionist: null,
                dental_assistant: null
            }
        }
    },
    computed: {
        // userSystemAdministrators () {
        //     return this.userslist['SA'] ?? []
        // },
        userAdministrators () {
            return this.userslist['AD'] ?? []
        },
        userOperationalManagers () {
            return this.userslist['OM'] ?? []
        },
        userOICs () {
            return this.userslist['OIC'] ?? []
        },
        userDentalAssistants () {
            return this.userslist['DA'] ?? []
        },
        userRecrptionists () {
            return this.userslist['RC'] ?? []
        }
    },
    methods: {
        closeBusinessRoleModal () {
            this.$bvModal.hide('modal-business-rules')
            this.resetFormData()
            this.$emit('closeBusinessRoleModal')
        },
        resetFormData () {
            this.formData.administrator = null
            this.formData.operational_manager = null
            this.formData.oic = null
            this.formData.receptionist = null
            this.formData.dental_assistant = null
            this.action = 'add'
        },
        getBranchBusinessRules () {
            businessRuleService.getBusinessRuleById(this.selectedBranch?.id)
            .then(({ data }) => {
                if (data.success) {
                    if (Object.keys(data?.data).length) {
                        this.formData.administrator = data?.data['AD'] ?? null
                        this.formData.operational_manager = data?.data['OM'] ?? null
                        this.formData.oic = data?.data['OIC'] ?? null
                        this.formData.receptionist = data?.data['RC'] ?? null
                        this.formData.dental_assistant = data?.data['DA'] ?? null
                        this.action = 'edit'
                    }
                }
            })
        },
        getAllUsersListByGroup () {
            businessRuleService.getRuleUsers({ branchId: this.selectedBranch?.id })
            .then(({ data }) => {
                if (data?.success) {
                    this.userslist = data?.data
                }
            }).catch(error => { console.error(error) })
        },
        handleSubmit () {
            this.formData['branch_id'] = this.selectedBranch?.id
            if (this.action === 'edit') {
                businessRuleService.updateBusinessRule(this.formData, this.selectedBranch?.id)
                .then(({ data }) => {
                    if (data.success) {
                    this.getBranchBusinessRules()
                    this.$bvModal.hide('modal-business-rules')
                    this.action = 'add'
                    }
                    this.$swal(data?.message ?? 'Business Rule Record was created successfully!')
                })
                .catch(error => { console.error(error) })
            } else {
                businessRuleService.createBusinessRule(this.formData)
                .then(({ data }) => {
                    if (data.success) {
                    this.getBranchBusinessRules()
                    this.$bvModal.hide('modal-business-rules')
                    this.action = 'add'
                    }
                    this.$swal(data?.message ?? 'Business Rule Record was created successfully!')
                })
                .catch(error => { console.error(error) })
            }
        }
    }
})
</script>
