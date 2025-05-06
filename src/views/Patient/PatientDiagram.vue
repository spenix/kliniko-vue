<template>
  <b-container fluid>
        <b-card
          :title="card_title+ ' ( '+patientDetail?.first_name+ ' ' + (patientDetail?.middle_name ?? '') +' ' +patientDetail?.last_name+' ) '"
          class="iq-mb-3"
        >
        <form @submit.prevent="submitPatientDiagram">
            <b-row align-h="center">
                <b-col md="2" align-v="center" class="p-0">
                    <label class="rotate-text">PERMANENT TEETH</label>
                </b-col>
                <b-col md="10" class="p-0">
                    <b-row align-h="center" class="mx-4 p-0 mb-4">
                        <b-col cols="2" class="text-left"><label>STATUS RIGHT</label></b-col>
                        <b-col cols="4" style="border-right: 1px solid #000;" class="p-0" >
                            <table class="right">
                                <thead>
                                    <tr>
                                        <th v-for="(d, i) in dentalRecord.right1" :key="`drr1-thead-${i}`" class="text-center">
                                            <input type="checkbox" name="dental-record" v-model="d.value" :key="`drr1-cb-${i}`">
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr >
                                        <td v-for="(d, i) in dentalRecord.right1" :key="`drr1-tbody-${i}`" style="height: 30px"></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr >
                                        <td v-for="(d, i) in dentalRecord.right1" :key="`drr1-tfoot-${i}`" class="text-center">{{ d?.code }}</td>
                                    </tr>
                                    <tr>
                                        <td v-for="(d, i) in dentalRecord.right1" :key="`drr1-tfoot-${i}`" class="text-center">
                                            <img :src="require('../../assets/images/icon/sababida.png')" class="img-fluid" width="20" height="20" alt="logo">
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </b-col>
                        <b-col cols="4" style="border-left: 1px solid #000;" class="p-0">
                            <table>
                                <thead>
                                    <tr>
                                        <th v-for="(d, i) in dentalRecord.left1" :key="`drl1-thead-${i}`" class="text-center">
                                            <input type="checkbox" name="dental-record" v-model="d.value" :key="`drl1-cb-${i}`">
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr >
                                        <td v-for="(d, i) in dentalRecord.left1" :key="`drl1-tbody-${i}`" style="height: 30px"></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr >
                                        <td v-for="(d, i) in dentalRecord.left1" :key="`drl1-1-tfoot-${i}`" class="text-center">{{ d?.code }}</td>
                                    </tr>
                                    <tr>
                                        <td v-for="(d, i) in dentalRecord.left1" :key="`drl1_2-tfoot-${i}`" class="text-center">
                                            <img :src="require('../../assets/images/icon/sababida.png')" class="img-fluid" width="20" height="20" alt="logo">
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </b-col>
                        <b-col cols="2" class="text-right"><label>LEFT</label></b-col>
                    </b-row>
                    <b-row align-h="center" class="mx-4 p-0 mb-4">
                        <b-col cols="12">
                            <label>TEMPORARY TEETH</label>
                        </b-col>
                        <b-col cols="6" style="border-right: 1px solid #000;" class="p-0" >
                            <table class="right">
                                <thead>
                                    <tr>
                                        <th v-for="(d, i) in dentalRecord.right2" :key="`drr2-thead-${i}`" class="text-center">
                                            <input type="checkbox" name="dental-record" v-model="d.value" :key="`drr2-cb-${i}`">
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr >
                                        <td v-for="(d, i) in dentalRecord.right2" :key="`drr2-tbody-${i}`" style="height: 30px"></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr >
                                        <td v-for="(d, i) in dentalRecord.right2" :key="`drr2-tfoot-${i}`" class="text-center">{{ d?.code }}</td>
                                    </tr>
                                    <tr>
                                        <td v-for="(d, i) in dentalRecord.right2" :key="`drr2-tfoot-${i}`" class="text-center">
                                            <img :src="require('../../assets/images/icon/sababida.png')" class="img-fluid" width="20" height="20" alt="logo">
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </b-col>
                        <b-col cols="6" style="border-left: 1px solid #000;" class="p-0">
                            <table>
                                <thead>
                                    <tr>
                                        <th v-for="(d, i) in dentalRecord.left2" :key="`drl2-thead-${i}`" class="text-center">
                                            <input type="checkbox" name="dental-record" v-model="d.value" :key="`drl2-cb-${i}`">
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr >
                                        <td v-for="(d, i) in dentalRecord.left2" :key="`drl2-tbody-${i}`" style="height: 30px"></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr >
                                        <td v-for="(d, i) in dentalRecord.left2" :key="`drl2-tfoot-${i}`" class="text-center">{{ d?.code }}</td>
                                    </tr>
                                    <tr>
                                        <td v-for="(d, i) in dentalRecord.left2" :key="`drl2-tfoot-${i}`" class="text-center">
                                            <img :src="require('../../assets/images/icon/sababida.png')" class="img-fluid" width="20" height="20" alt="logo">
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </b-col>
                    </b-row>
                    <b-row align-h="center" class="mx-4 p-0 mb-4">
                        <b-col cols="12">
                            <label>TEMPORARY TEETH</label>
                        </b-col>
                        <b-col cols="6" style="border-right: 1px solid #000;" class="p-0" >
                            <table class="right">
                                <thead>
                                    <tr>
                                        <td v-for="(d, i) in dentalRecord.right3" :key="`drr3-thead-${i}`" class="text-center">
                                            <img :src="require('../../assets/images/icon/sababida.png')" class="img-fluid" width="20" height="20" alt="logo">
                                        </td>
                                    </tr>
                                    <tr >
                                        <td v-for="(d, i) in dentalRecord.right3" :key="`drr3-thead-${i}`" class="text-center">{{ d?.code }}</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr >
                                        <td v-for="(d, i) in dentalRecord.right3" :key="`drr3-tbody-${i}`" style="height: 30px"></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td v-for="(d, i) in dentalRecord.right3" :key="`drr3-tfoot-${i}`" class="text-center">
                                            <input type="checkbox" name="dental-record" v-model="d.value" :key="`drr3-cb-${i}`">
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </b-col>
                        <b-col cols="6" style="border-left: 1px solid #000;" class="p-0">
                            <table>
                                <thead>
                                    <tr>
                                        <td v-for="(d, i) in dentalRecord.left3" :key="`drl3-thead-${i}`" class="text-center">
                                            <img :src="require('../../assets/images/icon/sababida.png')" class="img-fluid" width="20" height="20" alt="logo">
                                        </td>
                                    </tr>
                                    <tr >
                                        <td v-for="(d, i) in dentalRecord.left3" :key="`drl3-thead-${i}`" class="text-center">{{ d?.code }}</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr >
                                        <td v-for="(d, i) in dentalRecord.left3" :key="`drl3-tbody-${i}`" style="height: 30px"></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td v-for="(d, i) in dentalRecord.left3" :key="`drl3-tfoot-${i}`" class="text-center">
                                            <input type="checkbox" name="dental-record" v-model="d.value" :key="`drl3-cb-${i}`">
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </b-col>
                    </b-row>
                    <b-row align-h="center" class="mx-4 p-0 mb-4">
                        <b-col cols="2" class="text-left"><label>STATUS RIGHT</label></b-col>
                        <b-col cols="4" style="border-right: 1px solid #000;" class="p-0" >
                            <table class="right">
                                <thead>
                                    <tr>
                                        <td v-for="(d, i) in dentalRecord.right4" :key="`drr4-thead-${i}`" class="text-center">
                                            <img :src="require('../../assets/images/icon/sababida.png')" class="img-fluid" width="20" height="20" alt="logo">
                                        </td>
                                    </tr>
                                    <tr >
                                        <td v-for="(d, i) in dentalRecord.right4" :key="`drr4-thead-${i}`" class="text-center">{{ d?.code }}</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr >
                                        <td v-for="(d, i) in dentalRecord.right4" :key="`drr4-tbody-${i}`" style="height: 30px"></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td v-for="(d, i) in dentalRecord.right4" :key="`drr4-tfoot-${i}`" class="text-center">
                                            <input type="checkbox" name="dental-record" v-model="d.value" :key="`drr4-cb-${i}`">
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </b-col>
                        <b-col cols="4" style="border-left: 1px solid #000;" class="p-0">
                            <table>
                                <thead>
                                    <tr>
                                        <td v-for="(d, i) in dentalRecord.left4" :key="`drl4-tfoot-${i}`" class="text-center">
                                            <img :src="require('../../assets/images/icon/sababida.png')" class="img-fluid" width="20" height="20" alt="logo">
                                        </td>
                                    </tr>
                                    <tr >
                                        <td v-for="(d, i) in dentalRecord.left4" :key="`drl4-tfoot-${i}`" class="text-center">{{ d?.code }}</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr >
                                        <td v-for="(d, i) in dentalRecord.left4" :key="`drl4-tbody-${i}`" style="height: 30px"></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td v-for="(d, i) in dentalRecord.left4" :key="`drl4-thead-${i}`" class="text-center">
                                            <input type="checkbox" name="dental-record" v-model="d.value" :key="`drl4-cb-${i}`">
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </b-col>
                        <b-col cols="2" class="text-right"><label>LEFT</label></b-col>
                    </b-row>
                    <b-row align-h="center" class="mx-4 p-0 mb-4">
                        <b-col cols="12">
                            <b-form-group label="REMARKS:" label-for="remarks">
                                <b-form-textarea id="remarks" v-model="dentalRecord.remarks" rows="3"></b-form-textarea>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-button type="submit" class="float-right mr-4" variant="primary">{{ this.action === 'edit' ? 'Update': 'Submit'}}</b-button>
                </b-col>
            </b-row>
        </form>
        </b-card>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import patient from '../../services/patient'
import patientDiagramRecord from '../../services/patientDiagramRecord'

export default {
  name: 'PatientDiagram',
  mounted () {
    xray.index()
    this.fetchPatientById()
    var param = JSON.parse(window.atob(this.$route.params.action))
    if (typeof param === 'object') {
        this.action = param?.action
        this.diagramId = param?.diagramId
        if (param?.action !== 'add') {
            this.getDiagramRecord(param?.diagramId)
        }
    }
  },
  data () {
    return {
      isLoading: false,
      action: 'add',
      diagramId: 0,
      card_title: 'Patient Diagram',
      patientDetail: {},
      teeth_groups: ['right1', 'right2', 'right3', 'right4', 'left1', 'left2', 'left3', 'left4'],
      dentalRecord: {
        patient_id: this.$route.params.id,
        remarks: '',
        right1: [{ code: 55, value: false }, { code: 54, value: false }, { code: 53, value: false }, { code: 52, value: false }, { code: 51, value: false }],
        left1: [{ code: 61, value: false }, { code: 62, value: false }, { code: 54, value: false }, { code: 64, value: false }, { code: 65, value: false }],
        right2: [{ code: 18, value: false }, { code: 17, value: false }, { code: 16, value: false }, { code: 15, value: false }, { code: 14, value: false }, { code: 13, value: false }, { code: 12, value: false }, { code: 11, value: false }],
        left2: [{ code: 21, value: false }, { code: 22, value: false }, { code: 23, value: false }, { code: 24, value: false }, { code: 25, value: false }, { code: 26, value: false }, { code: 27, value: false }, { code: 28, value: false }],
        right3: [{ code: 48, value: false }, { code: 47, value: false }, { code: 46, value: false }, { code: 45, value: false }, { code: 44, value: false }, { code: 43, value: false }, { code: 42, value: false }, { code: 41, value: false }],
        left3: [{ code: 31, value: false }, { code: 32, value: false }, { code: 33, value: false }, { code: 34, value: false }, { code: 35, value: false }, { code: 36, value: false }, { code: 37, value: false }, { code: 38, value: false }],
        right4: [{ code: 85, value: false }, { code: 84, value: false }, { code: 83, value: false }, { code: 82, value: false }, { code: 81, value: false }],
        left4: [{ code: 71, value: false }, { code: 72, value: false }, { code: 73, value: false }, { code: 74, value: false }, { code: 75, value: false }]
      }
    }
  },
  methods: {
    getDiagramRecord (id) {
        patientDiagramRecord.getPatientDiagramRocordById(id)
        .then(({ data }) => {
            console.log(data)
            if (data?.success) {
                this.dentalRecord.remarks = data?.data?.remarks
                this.teeth_groups.forEach(d => {
                    this.dentalRecord[d] = data?.data?.data_records?.filter(rec => { return rec?.teeth_group === d }).map(row => { return { id: row?.id, diagram_record_id: row?.diagram_record_id, teeth_group: row?.teeth_group, code: row?.code, value: row?.value === 'Y' } })
                })
            }
        })
        .catch(error => { console.log(error) })
    },
    fetchPatientById () {
        const id = this.$route.params.id
        patient.getPatientById(id).then(response => {
          if (response.data.success) {
            this.patientDetail = response.data.data
          }
        }).catch(err => console.log(err))
    },
    submitPatientDiagram () {
        this.isLoading = true
        if (this.action === 'edit') {
            patientDiagramRecord.updatePatientDiagramRocord(this.dentalRecord, this.diagramId)
            .then(({ data }) => {
                if (data.success) {
                    this.$router.push(`/patient/view/${this.$route.params.id}`)
                }
                this.$swal(data?.message ?? 'Patient Diagram Record was updated successfully!')
                this.isLoading = false
            }).catch(error => {
                console.log(error)
                this.isLoading = false
            })
        } else {
            patientDiagramRecord.createPatientDiagramRocord(this.dentalRecord)
            .then(({ data }) => {
                if (data.success) {
                    this.$router.push(`/patient/view/${this.$route.params.id}`)
                }
                this.$swal(data?.message ?? 'Patient Diagram Record was created successfully!')
                this.isLoading = false
            }).catch(error => {
                console.log(error)
                this.isLoading = false
            })
        }
    }
  }
}
</script>
<style>
table, td, th {
  border: 1px solid #ddd;
  text-align: left;
}

table {
  border-collapse: collapse;
}

th, td {
  padding: 5px 15px 5px 15px;
}

.right {
  float: right;
}

.rotate-text {
    font-size: 1rem;
    margin: 320px auto;
    text-transform: uppercase;
    transform: rotate(270deg);
  }
</style>
