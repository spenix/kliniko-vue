<template>
    <tab-content-item :active="true" id="PatientDiagramV2">
      <b-container fluid>
            <b-card no-body class="iq-mb-3">
                <p class="font-size-14 mx-2">Color Coding - (Legend)</p>
                <p>
                    <b-badge pill class="mx-2" v-for="(d, i) in colorCoding" :key="`color-coding-${i}`" :style="`background: ${d.color} !important;`">{{ d.text }}</b-badge>
                </p>
            </b-card>
            <b-card no-body class="iq-mb-3">
                <p class="font-size-14 mx-2">Code - (Legend)</p>
                <p>
                    <b-badge v-for="(d, i) in codeList" :key="`code-list-${i}`" class="border border-secondary text-secondary m-2" variant="none"><b>[ {{ d?.value }} ]</b> - {{ d?.text }}</b-badge>
                </p>
            </b-card>
            <b-card
              :title="card_title"
              class="iq-mb-3"
              style="overflow-x: scroll;"
            >
            <form @submit.prevent="submitPatientDiagram">
                <b-row align-h="center">
                    <div class="col-1 p-0 text-center" align-v="center">
                        <label class="rotate-text">PERMANENT TEETH</label>
                    </div>
                    <div class="col-11 p-0">
                        <div class="row d-flex justify-content-center mx-4 p-0 mb-4">
                            <div class="col-2 text-left"><label>STATUS RIGHT</label></div>
                            <div class="col-4 p-0" style="border-right: 1px solid #000;">
                                <table class="right">
                                    <tbody>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.right1" :key="`drr1-tbody-${i}`" class="p-0" style="max-width: 30px">
                                                <v-select
                                                    v-model="d.code_text"
                                                    :options="codeList"
                                                    :get-option-label="(option) => option.value"
                                                    :disabled="!d.value"
                                                >
                                                </v-select>
                                                <!-- <select v-model="d.code_text" style="width:50px;" :disabled="!d.value">
                                                    <option value="" hidden></option>
                                                    <option v-for="(d, i) in codeList" :key="`code-r1-list-opt-${i}`" :value="d.value" :title="d?.text">{{ d.value }}</option>
                                                </select> -->
                                            </td>
                                        </tr>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.right1" :key="`drr1-thead-${i}`" class="text-center">
                                                <input type="checkbox" name="dental-record" v-model="d.value" :key="`drr1-cb-${i}`">
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.right1" :key="`drr1-tfoot-${i}`" class="text-center">{{ d?.code }}</td>
                                        </tr>
                                        <tr>
                                            <td v-for="(d, i) in dentalRecord.right1" :key="`drr1-tfoot-${i}`" class="text-center" style="background-color:#fff">
                                                <img :src="require('../../assets/images/icon/intra_oral.png')" class="img-fluid" width="20" height="20" alt="logo">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td v-for="(d, i) in dentalRecord.right1" :key="`drr1-tfoot-${i}-${d?.code}`" class="p-0" style="max-width: 30px">
                                                <select v-model="d.color_code" :style="`width:50px; background: ${ d.color_code }`" :disabled="!d.value">
                                                    <option value="" hidden></option>
                                                    <option v-for="(d, i) in colorCoding" :key="`color-code-${i}`" :value="d?.color" :title="d?.text" :style="`background: ${d.color} !important;`">{{ d?.text }}</option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div class="col-4 p-0" style="border-left: 1px solid #000;">
                                <table>
                                    <tbody>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.left1" :key="`drl1-tbody-${i}`" class="p-0" style="max-width: 30px">
                                                <v-select
                                                    v-model="d.code_text"
                                                    :options="codeList"
                                                    :get-option-label="(option) => option.value"
                                                    :disabled="!d.value"
                                                >
                                                </v-select>
                                                <!-- <select v-model="d.code_text" style="width:50px;" :disabled="!d.value">
                                                    <option value="" hidden></option>
                                                    <option v-for="(d, i) in codeList" :key="`code-l1-list-opt-${i}`" :value="d.value" :title="d?.text">{{ d.value }}</option>
                                                </select> -->
                                            </td>
                                        </tr>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.left1" :key="`drl1-thead-${i}`" class="text-center">
                                                <input type="checkbox" name="dental-record" v-model="d.value" :key="`drl1-cb-${i}`">
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.left1" :key="`drl1-1-tfoot-${i}`" class="text-center">{{ d?.code }}</td>
                                        </tr>
                                        <tr>
                                            <td v-for="(d, i) in dentalRecord.left1" :key="`drl1-2-tfoot-${i}`" class="text-center">
                                                <img :src="require('../../assets/images/icon/intra_oral.png')" class="img-fluid" width="20" height="20" alt="logo">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td v-for="(d, i) in dentalRecord.left1" :key="`drl1-tfoot-${i}-${d?.code}`" class="p-0" style="max-width: 30px">
                                                <select v-model="d.color_code" :style="`width:50px; background: ${ d.color_code }`" :disabled="!d.value">
                                                    <option value="" hidden></option>
                                                    <option v-for="(d, i) in colorCoding" :key="`color-code-${i}`" :value="d?.color" :title="d?.text" :style="`background: ${d.color} !important;`">
                                                        {{ d?.text }}
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div class="col-2 text-right"><label>LEFT</label></div>
                        </div>
                        <b-row class="row d-flex justify-content-center mx-4 p-0 mb-4">
                            <div class="col-12">
                                <label>MAXILLA</label>
                            </div>
                            <div class="col-6 p-0" style="border-right: 1px solid #000;">
                                <table class="right">
                                    <tbody>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.right2" :key="`drr2-tbody-${i}`" class="p-0" style="max-width: 30px">
                                                <v-select
                                                    v-model="d.code_text"
                                                    :options="codeList"
                                                    :get-option-label="(option) => option.value"
                                                    :disabled="!d.value"
                                                >
                                                </v-select>
                                                <!-- <select v-model="d.code_text" style="width:50px;" :disabled="!d.value">
                                                    <option value="" hidden></option>
                                                    <option v-for="(d, i) in codeList" :key="`code-r2-list-opt-${i}`" :value="d.code" :title="d?.text">{{ d.code }}</option>
                                                </select> -->
                                            </td>
                                        </tr>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.right2" :key="`drr2-thead-${i}`" class="text-center">
                                                <input type="checkbox" name="dental-record" v-model="d.value" :key="`drr2-cb-${i}`">
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.right2" :key="`drr2-tfoot-${i}`" class="text-center">{{ d?.code }}</td>
                                        </tr>
                                        <tr>
                                            <td v-for="(d, i) in dentalRecord.right2" :key="`drr2-tfoot-${i}`" class="text-center">
                                                <img :src="require('../../assets/images/icon/intra_oral.png')" class="img-fluid" width="20" height="20" alt="logo">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td v-for="(d, i) in dentalRecord.right2" :key="`drr2-tfoot-${i}-${d?.code}`" class="p-0" style="max-width: 30px">
                                                <select v-model="d.color_code" :style="`width:50px; background: ${ d.color_code }`" :disabled="!d.value">
                                                    <option value="" hidden></option>
                                                    <option v-for="(d, i) in colorCoding" :key="`color-code-${i}`" :value="d?.color" :title="d?.text" :style="`background: ${d.color} !important;`">
                                                        {{ d?.text }}
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div class="col-6 p-0" style="border-left: 1px solid #000;">
                                <table>
                                    <tbody>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.left2" :key="`drl2-tbody-${i}`" class="p-0" style="max-width: 30px">
                                                <v-select
                                                    v-model="d.code_text"
                                                    :options="codeList"
                                                    :get-option-label="(option) => option.value"
                                                    :disabled="!d.value"
                                                >
                                                </v-select>
                                                <!-- <select v-model="d.code_text" style="width:50px;" :disabled="!d.value">
                                                    <option value="" hidden></option>
                                                    <option v-for="(d, i) in codeList" :key="`code-l2-list-opt-${i}`" :value="d.value" :title="d?.text">{{ d.value }}</option>
                                                </select> -->
                                            </td>
                                        </tr>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.left2" :key="`drl2-thead-${i}`" class="text-center">
                                                <input type="checkbox" name="dental-record" v-model="d.value" :key="`drl2-cb-${i}`">
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.left2" :key="`drl2-tfoot-${i}`" class="text-center">{{ d?.code }}</td>
                                        </tr>
                                        <tr>
                                            <td v-for="(d, i) in dentalRecord.left2" :key="`drl2-tfoot-${i}`" class="text-center">
                                                <img :src="require('../../assets/images/icon/intra_oral.png')" class="img-fluid" width="20" height="20" alt="logo">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td v-for="(d, i) in dentalRecord.left2" :key="`drl2-tfoot-${i}-${d?.code}`" class="p-0" style="max-width: 30px">
                                                <select v-model="d.color_code" :style="`width:50px; background: ${ d.color_code }`" :disabled="!d.value">
                                                    <option value="" hidden></option>
                                                    <option v-for="(d, i) in colorCoding" :key="`color-code-${i}`" :value="d?.color" :title="d?.text" :style="`background: ${d.color} !important;`">
                                                        {{ d?.text }}
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </b-row>
                        <b-row class="row d-flex justify-content-center mx-4 p-0 mb-4">
                            <div class="col-12">
                                <label>MANDIBLE</label>
                            </div>
                            <div class="col-6 p-0" style="border-right: 1px solid #000;">
                                <table class="right">
                                    <thead>
                                        <tr>
                                            <td v-for="(d, i) in dentalRecord.right3" :key="`drr3-thead-${i}-${d?.code}`" class="p-0" style="max-width: 30px">
                                                <select v-model="d.color_code" :style="`width:50px; background: ${ d.color_code }`" :disabled="!d.value">
                                                    <option value="" hidden></option>
                                                    <option v-for="(d, i) in colorCoding" :key="`color-code-${i}`" :value="d?.color" :title="d?.text" :style="`background: ${d.color} !important;`">
                                                        {{ d?.text }}
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td v-for="(d, i) in dentalRecord.right3" :key="`drr3-thead-${i}`" class="text-center">
                                                <img :src="require('../../assets/images/icon/intra_oral.png')" class="img-fluid" width="20" height="20" alt="logo">
                                            </td>
                                        </tr>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.right3" :key="`drr3-thead-${i}`" class="text-center">{{ d?.code }}</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.right3" :key="`right3-thead-${i}`" class="text-center">
                                                <input type="checkbox" name="dental-record" v-model="d.value" :key="`right3-cb-${i}`">
                                            </td>
                                        </tr>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.right3" :key="`drr3-tbody-${i}`" class="p-0" style="max-width: 30px">
                                                <v-select
                                                    v-model="d.code_text"
                                                    :options="codeList"
                                                    :get-option-label="(option) => option.value"
                                                    :disabled="!d.value"
                                                >
                                                </v-select>
                                                <!-- <select v-model="d.code_text" style="width:50px;" :disabled="!d.value">
                                                    <option value="" hidden></option>
                                                    <option v-for="(d, i) in codeList" :key="`code-r3-list-opt-${i}`" :value="d.value" :title="d?.text">{{ d.value }}</option>
                                                </select> -->
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-6 p-0" style="border-left: 1px solid #000;">
                                <table>
                                    <thead>
                                        <tr>
                                            <td v-for="(d, i) in dentalRecord.left3" :key="`drl3-thead-${i}-${d?.code}`" class="p-0" style="max-width: 30px">
                                                <select v-model="d.color_code" :style="`width:50px; background: ${ d.color_code }`" :disabled="!d.value">
                                                    <option value="" hidden></option>
                                                    <option v-for="(d, i) in colorCoding" :key="`color-code-${i}`" :value="d?.color" :title="d?.text" :style="`background: ${d.color} !important;`">
                                                        {{ d?.text }}
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td v-for="(d, i) in dentalRecord.left3" :key="`drl3-thead-${i}`" class="text-center">
                                                <img :src="require('../../assets/images/icon/intra_oral.png')" class="img-fluid" width="20" height="20" alt="logo">
                                            </td>
                                        </tr>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.left3" :key="`drl3-thead-${i}`" class="text-center">{{ d?.code }}</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.left3" :key="`drl3-thead-${i}`" class="text-center">
                                                <input type="checkbox" name="dental-record" v-model="d.value" :key="`drl3-cb-${i}`">
                                            </td>
                                        </tr>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.left3" :key="`drl3-tbody-${i}`" class="p-0" style="max-width: 30px">
                                                <v-select
                                                    v-model="d.code_text"
                                                    :options="codeList"
                                                    :get-option-label="(option) => option.value"
                                                    :disabled="!d.value"
                                                >
                                                </v-select>
                                                <!-- <select v-model="d.code_text" style="width:50px;" :disabled="!d.value">
                                                    <option value="" hidden></option>
                                                    <option v-for="(d, i) in codeList" :key="`code-l3-list-opt-${i}`" :value="d.value" :title="d?.text">{{ d.value }}</option>
                                                </select> -->
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </b-row>
                        <b-row class="row d-flex justify-content-center mx-4 p-0 mb-4">
                            <div class="col-2 text-left"><label>STATUS RIGHT</label></div>
                            <div class="col-4 p-0" style="border-right: 1px solid #000;">
                                <table class="right">
                                    <thead>
                                        <tr>
                                            <td v-for="(d, i) in dentalRecord.right4" :key="`drr4-thead-${i}-${d?.code}`" class="p-0" style="max-width: 30px">
                                                <select v-model="d.color_code" :style="`width:50px; background: ${ d.color_code }`" :disabled="!d.value">
                                                    <option value="" hidden></option>
                                                    <option v-for="(d, i) in colorCoding" :key="`color-code-${i}`" :value="d?.color" :title="d?.text" :style="`background: ${d.color} !important;`">
                                                        {{ d?.text }}
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td v-for="(d, i) in dentalRecord.right4" :key="`drr4-thead-${i}`" class="text-center">
                                                <img :src="require('../../assets/images/icon/intra_oral.png')" class="img-fluid" width="20" height="20" alt="logo">
                                            </td>
                                        </tr>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.right4" :key="`drr4-thead-${i}`" class="text-center">{{ d?.code }}</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.right4" :key="`drr4-thead-${i}`" class="text-center">
                                                <input type="checkbox" name="dental-record" v-model="d.value" :key="`drr4-cb-${i}`">
                                            </td>
                                        </tr>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.right4" :key="`drr4-tbody-${i}`" class="p-0" style="max-width: 30px">
                                                <v-select
                                                    v-model="d.code_text"
                                                    :options="codeList"
                                                    :get-option-label="(option) => option.value"
                                                    :disabled="!d.value"
                                                >
                                                </v-select>
                                                <!-- <select v-model="d.code_text" style="width:50px;" :disabled="!d.value">
                                                    <option value="" hidden></option>
                                                    <option v-for="(d, i) in codeList" :key="`code-r4-list-opt-${i}`" :value="d.value" :title="d?.text">{{ d.value }}</option>
                                                </select> -->
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-4 p-0" style="border-left: 1px solid #000;">
                                <table>
                                    <thead>
                                        <tr>
                                            <td v-for="(d, i) in dentalRecord.left4" :key="`drl4-thead-${i}-${d?.code}`" class="p-0" style="max-width: 30px">
                                                <select v-model="d.color_code" :style="`width:50px; background: ${ d.color_code }`" :disabled="!d.value">
                                                    <option value="" hidden></option>
                                                    <option v-for="(d, i) in colorCoding" :key="`color-code-${i}`" :value="d?.color" :title="d?.text" :style="`background: ${d.color} !important;`">
                                                        {{ d?.text }}
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td v-for="(d, i) in dentalRecord.left4" :key="`drl4-tfoot-${i}`" class="text-center">
                                                <img :src="require('../../assets/images/icon/intra_oral.png')" class="img-fluid" width="20" height="20" alt="logo">
                                            </td>
                                        </tr>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.left4" :key="`drl4-tfoot-${i}`" class="text-center">{{ d?.code }}</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr >
                                            <td v-for="(d, i) in dentalRecord.left4" :key="`drl4-thead-${i}`" class="text-center">
                                                <input type="checkbox" name="dental-record" v-model="d.value" :key="`drl4-cb-${i}`">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td v-for="(d, i) in dentalRecord.left4" :key="`drl4-tbody-${i}`" class="p-0" style="max-width: 30px">
                                                <v-select
                                                    v-model="d.code_text"
                                                    :options="codeList"
                                                    :get-option-label="(option) => option.value"
                                                    :disabled="!d.value"
                                                >
                                                </v-select>
                                                <!-- <select v-model="d.code_text" style="width:50px;" :disabled="!d.value">
                                                    <option value="" hidden></option>
                                                    <option v-for="(d, i) in codeList" :key="`code-l4-list-opt-${i}`" :value="d.value" :title="d?.text">{{ d.value }}</option>
                                                </select> -->
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-2 text-right"><label>LEFT</label></div>
                        </b-row>
                        <div class="row m-4 p-0">
                            <div class="col-12">
                                <b-form-group label="REMARKS:" label-for="remarks">
                                    <b-form-textarea id="remarks" v-model="dentalRecord.remarks" rows="3"></b-form-textarea>
                                </b-form-group>
                            </div>
                        </div>
                        <b-button type="button" class="float-right mr-4" v-if="action != 'add'" @click="updatePatientDiagram" variant="info">UPDATE WITH HISTORY</b-button>
                        <b-button type="submit" class="float-right mr-4" variant="primary">{{ action === 'add' ? 'ADD NEW RECORD': 'UPDATE'}}</b-button>
                    </div>
                </b-row>
            </form>
            </b-card>
            <b-card no-body class="iq-mb-3 p-4" v-if="items?.length">
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
                <template #cell(id)="row">
                    <!-- <b-button size="sm" @click="row.toggleDetails" class="mr-2">
                    {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
                    </b-button> -->
                    <!-- As `row.showDetails` is one-way, we call the toggleDetails function on @change -->
                    <b-form-checkbox v-model="row.detailsShowing" @change="row.toggleDetails">
                        {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
                    </b-form-checkbox>
                </template>
                <template v-slot:cell(remarks)="{ item }">{{  item?.remarks ?? 'N/A'  }}</template>
                <template v-slot:cell(actions)="{ item }">
                    <span><b-btn variant="primary" class="mb-3 mr-1" title="Edit" @click="actionEditPatientDiagram(item)"><i class="las la-edit"></i> Update record</b-btn></span>
                    <!-- <span><b-btn variant="danger" class="mb-3 mr-1" title="Delete" @click="actionDelPatientDiagram(item.id)"><i class="las la-trash"></i> Delete</b-btn></span> -->
                </template>
                <template #row-details="row">
                    <b-card>
                        <b-row align-h="center">
                            <div class="col-1 p-0 text-center">
                                <label class="rotate-text">PERMANENT TEETH</label>
                            </div>
                            <div class="col-11 p-0">
                                <div class="row d-flex justify-content-center mx-4 p-0 mb-4">
                                    <div class="col-2 text-left"><label>STATUS RIGHT</label></div>
                                    <div class="col-4 p-0" style="border-right: 1px solid #000;">
                                        <table class="right">
                                            <tbody>
                                                <tr >
                                                    <td v-for="(d, i) in row.item.dentalRecord.right1" :key="`drr1-tbody-${i}`" class="p-0" style="max-width: 30px">
                                                        <v-select
                                                            v-model="d.code_text"
                                                            :options="codeList"
                                                            :get-option-label="(option) => option.value"
                                                        >
                                                        </v-select>
                                                        <!-- <select v-model="d.code_text" style="width:50px;">
                                                            <option value="" hidden></option>
                                                            <option v-for="(d, i) in codeList" :key="`code-r1-list-opt-${i}`" :value="d.value" :title="d?.text">{{ d.value }}</option>
                                                        </select> -->
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr >
                                                    <td v-for="(d, i) in row.item.dentalRecord.right1" :key="`drr1-tfoot-${i}`" class="text-center">{{ d?.code }}</td>
                                                </tr>
                                                <tr>
                                                    <td v-for="(d, i) in row.item.dentalRecord.right1" :key="`drr1-tfoot-${i}`" class="text-center" style="background-color:#fff">
                                                        <img :src="require('../../assets/images/icon/intra_oral.png')" class="img-fluid" width="20" height="20" alt="logo">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td v-for="(d, i) in row.item.dentalRecord.right1" :key="`drr1-tfoot-${i}-${d?.code}`" class="p-0" style="max-width: 30px">
                                                        <select v-model="d.color_code" :style="`width:50px; background: ${ d.color_code }`">
                                                            <option value="" hidden></option>
                                                            <option v-for="(d, i) in colorCoding" :key="`color-code-${i}`" :value="d?.color" :title="d?.text" :style="`background: ${d.color} !important;`">{{ d?.text }}</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div class="col-4 p-0" style="border-left: 1px solid #000;">
                                        <table>
                                            <tbody>
                                                <tr >
                                                    <td v-for="(d, i) in row.item.dentalRecord.left1" :key="`drl1-tbody-${i}`" class="p-0" style="max-width: 30px">
                                                        <v-select
                                                            v-model="d.code_text"
                                                            :options="codeList"
                                                            :get-option-label="(option) => option.value"
                                                        >
                                                        </v-select>
                                                        <!-- <select v-model="d.code_text" style="width:50px;">
                                                            <option value="" hidden></option>
                                                            <option v-for="(d, i) in codeList" :key="`code-l1-list-opt-${i}`" :value="d.value" :title="d?.text">{{ d.value }}</option>
                                                        </select> -->
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr >
                                                    <td v-for="(d, i) in row.item.dentalRecord.left1" :key="`drl1-1-tfoot-${i}`" class="text-center">{{ d?.code }}</td>
                                                </tr>
                                                <tr>
                                                    <td v-for="(d, i) in row.item.dentalRecord.left1" :key="`drl1-2-tfoot-${i}`" class="text-center">
                                                        <img :src="require('../../assets/images/icon/intra_oral.png')" class="img-fluid" width="20" height="20" alt="logo">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td v-for="(d, i) in row.item.dentalRecord.left1" :key="`drr1-tfoot-${i}-${d?.code}`" class="p-0" style="max-width: 30px">
                                                        <select v-model="d.color_code" :style="`width:50px; background: ${ d.color_code }`">
                                                            <option value="" hidden></option>
                                                            <option v-for="(d, i) in colorCoding" :key="`color-code-${i}`" :value="d?.color" :title="d?.text" :style="`background: ${d.color} !important;`">{{ d?.text }}</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div class="col-2 text-right"><label>LEFT</label></div>
                                </div>
                                <div class="row d-flex justify-content-center mx-4 p-0 mb-4">
                                    <div class="col-12">
                                        <label>MAXILLA</label>
                                    </div>
                                    <div class="col-6 p-0" style="border-right: 1px solid #000;">
                                        <table class="right">
                                            <tbody>
                                                <tr >
                                                    <td v-for="(d, i) in row.item.dentalRecord.right2" :key="`drr2-tbody-${i}`" class="p-0" style="max-width: 30px">
                                                        <v-select
                                                            v-model="d.code_text"
                                                            :options="codeList"
                                                            :get-option-label="(option) => option.value"
                                                        >
                                                        </v-select>
                                                        <!-- <select v-model="d.code_text" style="width:50px;">
                                                            <option value="" hidden></option>
                                                            <option v-for="(d, i) in codeList" :key="`code-r2-list-opt-${i}`" :value="d.value" :title="d?.text">{{ d.value }}</option>
                                                        </select> -->
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr >
                                                    <td v-for="(d, i) in row.item.dentalRecord.right2" :key="`drr2-tfoot-${i}`" class="text-center">{{ d?.code }}</td>
                                                </tr>
                                                <tr>
                                                    <td v-for="(d, i) in row.item.dentalRecord.right2" :key="`drr2-tfoot-${i}`" class="text-center">
                                                        <img :src="require('../../assets/images/icon/intra_oral.png')" class="img-fluid" width="20" height="20" alt="logo">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td v-for="(d, i) in row.item.dentalRecord.right2" :key="`drr2-tfoot-${i}-${d?.code}`" class="p-0" style="max-width: 30px">
                                                        <select v-model="d.color_code" :style="`width:50px; background: ${ d.color_code }`">
                                                            <option value="" hidden></option>
                                                            <option v-for="(d, i) in colorCoding" :key="`color-code-${i}`" :value="d?.color" :title="d?.text" :style="`background: ${d.color} !important;`">
                                                                {{ d?.text }}
                                                            </option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div class="col-6 p-0" style="border-left: 1px solid #000;">
                                        <table>
                                            <tbody>
                                                <tr >
                                                    <td v-for="(d, i) in row.item.dentalRecord.left2" :key="`drl2-tbody-${i}`" class="p-0" style="max-width: 30px">
                                                        <v-select
                                                    v-model="d.code_text"
                                                    :options="codeList"
                                                    :get-option-label="(option) => option.value"
                                                >
                                                </v-select>
                                                        <!-- <select v-model="d.code_text" style="width:50px;">
                                                            <option value="" hidden></option>
                                                            <option v-for="(d, i) in codeList" :key="`code-l2-list-opt-${i}`" :value="d.value" :title="d?.text">{{ d.value }}</option>
                                                        </select> -->
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr >
                                                    <td v-for="(d, i) in row.item.dentalRecord.left2" :key="`drl2-tfoot-${i}`" class="text-center">{{ d?.code }}</td>
                                                </tr>
                                                <tr>
                                                    <td v-for="(d, i) in row.item.dentalRecord.left2" :key="`drl2-tfoot-${i}`" class="text-center">
                                                        <img :src="require('../../assets/images/icon/intra_oral.png')" class="img-fluid" width="20" height="20" alt="logo">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td v-for="(d, i) in row.item.dentalRecord.left2" :key="`drl2-tfoot-${i}-${d?.code}`" class="p-0" style="max-width: 30px">
                                                        <select v-model="d.color_code" :style="`width:50px; background: ${ d.color_code }`">
                                                            <option value="" hidden></option>
                                                            <option v-for="(d, i) in colorCoding" :key="`color-code-${i}`" :value="d?.color" :title="d?.text" :style="`background: ${d.color} !important;`">
                                                                {{ d?.text }}
                                                            </option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                                <div class="row d-flex justify-content-center mx-4 p-0 mb-4">
                                    <div class="col-12">
                                        <label>MANDIBLE</label>
                                    </div>
                                    <div class="col-6 p-0" style="border-right: 1px solid #000;">
                                        <table class="right">
                                            <thead>
                                                <tr>
                                                    <td v-for="(d, i) in row.item.dentalRecord.right3" :key="`drr3-thead-${i}-${d?.code}`" class="p-0" style="max-width: 30px">
                                                        <select v-model="d.color_code" :style="`width:50px; background: ${ d.color_code }`">
                                                            <option value="" hidden></option>
                                                            <option v-for="(d, i) in colorCoding" :key="`color-code-${i}`" :value="d?.color" :title="d?.text" :style="`background: ${d.color} !important;`">
                                                                {{ d?.text }}
                                                            </option>
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td v-for="(d, i) in row.item.dentalRecord.right3" :key="`drr3-thead-${i}`" class="text-center">
                                                        <img :src="require('../../assets/images/icon/intra_oral.png')" class="img-fluid" width="20" height="20" alt="logo">
                                                    </td>
                                                </tr>
                                                <tr >
                                                    <td v-for="(d, i) in row.item.dentalRecord.right3" :key="`drr3-thead-${i}`" class="text-center">{{ d?.code }}</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr >
                                                    <td v-for="(d, i) in row.item.dentalRecord.right3" :key="`drr3-tbody-${i}`" class="p-0" style="max-width: 30px">
                                                        <v-select
                                                            v-model="d.code_text"
                                                            :options="codeList"
                                                            :get-option-label="(option) => option.value"
                                                        >
                                                        </v-select>
                                                        <!-- <select v-model="d.code_text" style="width:50px;">
                                                            <option value="" hidden></option>
                                                            <option v-for="(d, i) in codeList" :key="`code-r3-list-opt-${i}`" :value="d.value" :title="d?.text">{{ d.value }}</option>
                                                        </select> -->
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="col-6 p-0" style="border-left: 1px solid #000;">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <td v-for="(d, i) in row.item.dentalRecord.left3" :key="`drl3-thead-${i}-${d?.code}`" class="p-0" style="max-width: 30px">
                                                        <select v-model="d.color_code" :style="`width:50px; background: ${ d.color_code }`">
                                                            <option value="" hidden></option>
                                                            <option v-for="(d, i) in colorCoding" :key="`color-code-${i}`" :value="d?.color" :title="d?.text" :style="`background: ${d.color} !important;`">
                                                                {{ d?.text }}
                                                            </option>
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td v-for="(d, i) in row.item.dentalRecord.left3" :key="`drl3-thead-${i}`" class="text-center">
                                                        <img :src="require('../../assets/images/icon/intra_oral.png')" class="img-fluid" width="20" height="20" alt="logo">
                                                    </td>
                                                </tr>
                                                <tr >
                                                    <td v-for="(d, i) in row.item.dentalRecord.left3" :key="`drl3-thead-${i}`" class="text-center">{{ d?.code }}</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr >
                                                    <td v-for="(d, i) in row.item.dentalRecord.left3" :key="`drl3-tbody-${i}`" class="p-0" style="max-width: 30px">
                                                        <v-select
                                                            v-model="d.code_text"
                                                            :options="codeList"
                                                            :get-option-label="(option) => option.value"
                                                        >
                                                        </v-select>
                                                        <!-- <select v-model="d.code_text" style="width:50px;">
                                                            <option value="" hidden></option>
                                                            <option v-for="(d, i) in codeList" :key="`code-l3-list-opt-${i}`" :value="d.value" :title="d?.text">{{ d.value }}</option>
                                                        </select> -->
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="row d-flex justify-content-center mx-4 p-0 mb-4">
                                    <div class="col-2 text-left"><label>STATUS RIGHT</label></div>
                                    <div class="col-4 p-0" style="border-right: 1px solid #000;">
                                        <table class="right">
                                            <thead>
                                                <tr>
                                                    <td v-for="(d, i) in row.item.dentalRecord.right4" :key="`drr4-thead-${i}-${d?.code}`" class="p-0" style="max-width: 30px">
                                                        <select v-model="d.color_code" :style="`width:50px; background: ${ d.color_code }`">
                                                            <option value="" hidden></option>
                                                            <option v-for="(d, i) in colorCoding" :key="`color-code-${i}`" :value="d?.color" :title="d?.text" :style="`background: ${d.color} !important;`">
                                                                {{ d?.text }}
                                                            </option>
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td v-for="(d, i) in row.item.dentalRecord.right4" :key="`drr4-thead-${i}`" class="text-center">
                                                        <img :src="require('../../assets/images/icon/intra_oral.png')" class="img-fluid" width="20" height="20" alt="logo">
                                                    </td>
                                                </tr>
                                                <tr >
                                                    <td v-for="(d, i) in row.item.dentalRecord.right4" :key="`drr4-thead-${i}`" class="text-center">{{ d?.code }}</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr >
                                                    <td v-for="(d, i) in row.item.dentalRecord.right4" :key="`drr4-tbody-${i}`" class="p-0" style="max-width: 30px">
                                                        <v-select
                                                            v-model="d.code_text"
                                                            :options="codeList"
                                                            :get-option-label="(option) => option.value"
                                                        >
                                                        </v-select>
                                                        <!-- <select v-model="d.code_text" style="width:50px;">
                                                            <option value="" hidden></option>
                                                            <option v-for="(d, i) in codeList" :key="`code-r4-list-opt-${i}`" :value="d.value" :title="d?.text">{{ d.value }}</option>
                                                        </select> -->
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="col-4 p-0" style="border-left: 1px solid #000;">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <td v-for="(d, i) in row.item.dentalRecord.left4" :key="`drl4-thead-${i}-${d?.code}`" class="p-0" style="max-width: 30px">
                                                        <select v-model="d.color_code" :style="`width:50px; background: ${ d.color_code }`">
                                                            <option value="" hidden></option>
                                                            <option v-for="(d, i) in colorCoding" :key="`color-code-${i}`" :value="d?.color" :title="d?.text" :style="`background: ${d.color} !important;`">
                                                                {{ d?.text }}
                                                            </option>
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td v-for="(d, i) in row.item.dentalRecord.left4" :key="`drl4-tfoot-${i}`" class="text-center">
                                                        <img :src="require('../../assets/images/icon/intra_oral.png')" class="img-fluid" width="20" height="20" alt="logo">
                                                    </td>
                                                </tr>
                                                <tr >
                                                    <td v-for="(d, i) in row.item.dentalRecord.left4" :key="`drl4-tfoot-${i}`" class="text-center">{{ d?.code }}</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td v-for="(d, i) in row.item.dentalRecord.left4" :key="`drl4-tbody-${i}`" class="p-0" style="max-width: 30px">
                                                        <v-select
                                                            v-model="d.code_text"
                                                            :options="codeList"
                                                            :get-option-label="(option) => option.value"
                                                        >
                                                        </v-select>
                                                        <!-- <select v-model="d.code_text" style="width:50px;">
                                                            <option value="" hidden></option>
                                                            <option v-for="(d, i) in codeList" :key="`code-l4-list-opt-${i}`" :value="d.value" :title="d?.text">{{ d.value }}</option>
                                                        </select> -->
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="col-2 text-right"><label>LEFT</label></div>
                                </div>
                                <div class="row m-4 p-0">
                                    <div class="col-12">
                                        <b-form-group label="REMARKS:" label-for="remarks">
                                            <b-form-textarea id="remarks" v-model="row.item.remarks" rows="3"></b-form-textarea>
                                        </b-form-group>
                                    </div>
                                </div>
                            </div>
                        </b-row>
                    </b-card>
                </template>
                </b-table>
                <div class="row">
                <div class="align-self-end">
                    <b-pagination
                    class="float-right"
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="perPage"
                    aria-controls="patient-table"
                    ></b-pagination>
                </div>
                </div>
            </b-card>
      </b-container>
    </tab-content-item>
</template>
<script>
    import { xray } from '../../config/pluginInit'
    import patientDiagramRecord from '../../services/patientDiagramRecord'
    import _ from 'lodash'
    export default {
      name: 'PatientDiagram',
      props: {
        patientId: String,
        patientDetail: Object
      },
      components: {},
      mounted () {
        xray.index()
        this.getDiagramRecord(this.patientId)
        this.getAllPatientDiagramRecord()
      },
      watch: {
        patientDetail: _.debounce(function (data) {
            this.card_title = 'Patient Diagram' + ' ( ' + this.patientDetail?.first_name + ' ' + (this.patientDetail?.middle_name ?? '') + ' ' + this.patientDetail?.last_name + ' ) '
        }, 500)
      },
      data () {
        return {
          isLoading: false,
          action: 'add',
          diagramId: 0,
          card_title: 'Patient Diagram',
          teeth_groups: ['right1', 'right2', 'right3', 'right4', 'left1', 'left2', 'left3', 'left4'],
          dentalRecord: {
            patient_id: this.patientId,
            remarks: '',
            right1: [{ code: 55, code_text: '', color_code: '', value: false }, { code: 54, code_text: '', color_code: '', value: false }, { code: 53, code_text: '', color_code: '', value: false }, { code: 52, code_text: '', color_code: '', value: false }, { code: 51, code_text: '', color_code: '', value: false }],
            left1: [{ code: 61, code_text: '', color_code: '', value: false }, { code: 62, code_text: '', color_code: '', value: false }, { code: 54, code_text: '', color_code: '', value: false }, { code: 64, code_text: '', color_code: '', value: false }, { code: 65, code_text: '', color_code: '', value: false }],
            right2: [{ code: 18, code_text: '', color_code: '', value: false }, { code: 17, code_text: '', color_code: '', value: false }, { code: 16, code_text: '', color_code: '', value: false }, { code: 15, code_text: '', color_code: '', value: false }, { code: 14, code_text: '', color_code: '', value: false }, { code: 13, code_text: '', color_code: '', value: false }, { code: 12, code_text: '', color_code: '', value: false }, { code: 11, code_text: '', color_code: '', value: false }],
            left2: [{ code: 21, code_text: '', color_code: '', value: false }, { code: 22, code_text: '', color_code: '', value: false }, { code: 23, code_text: '', color_code: '', value: false }, { code: 24, code_text: '', color_code: '', value: false }, { code: 25, code_text: '', color_code: '', value: false }, { code: 26, code_text: '', color_code: '', value: false }, { code: 27, code_text: '', color_code: '', value: false }, { code: 28, code_text: '', color_code: '', value: false }],
            right3: [{ code: 48, code_text: '', color_code: '', value: false }, { code: 47, code_text: '', color_code: '', value: false }, { code: 46, code_text: '', color_code: '', value: false }, { code: 45, code_text: '', color_code: '', value: false }, { code: 44, code_text: '', color_code: '', value: false }, { code: 43, code_text: '', color_code: '', value: false }, { code: 42, code_text: '', color_code: '', value: false }, { code: 41, code_text: '', color_code: '', value: false }],
            left3: [{ code: 31, code_text: '', color_code: '', value: false }, { code: 32, code_text: '', color_code: '', value: false }, { code: 33, code_text: '', color_code: '', value: false }, { code: 34, code_text: '', color_code: '', value: false }, { code: 35, code_text: '', color_code: '', value: false }, { code: 36, code_text: '', color_code: '', value: false }, { code: 37, code_text: '', color_code: '', value: false }, { code: 38, code_text: '', color_code: '', value: false }],
            right4: [{ code: 85, code_text: '', color_code: '', value: false }, { code: 84, code_text: '', color_code: '', value: false }, { code: 83, code_text: '', color_code: '', value: false }, { code: 82, code_text: '', color_code: '', value: false }, { code: 81, code_text: '', color_code: '', value: false }],
            left4: [{ code: 71, code_text: '', color_code: '', value: false }, { code: 72, code_text: '', color_code: '', value: false }, { code: 73, code_text: '', color_code: '', value: false }, { code: 74, code_text: '', color_code: '', value: false }, { code: 75, code_text: '', color_code: '', value: false }]
          },
          colorCoding: [{ color: '#dc3545', text: 'Urgent' }, { color: '#fbc647', text: 'Treatment' }, { color: '#45ce62', text: 'Ok | Done' }],
          codeList: [
                { value: 'MIS', text: 'Missing | Extracted' },
                { value: 'RE', text: 'Restored' },
                { value: 'CA', text: 'Carious' },
                { value: 'IMP', text: 'Impacted' },
                { value: 'CRO', text: 'Crown' },
                { value: 'VEN', text: 'Veneers' },
                { value: 'SEA', text: 'Sealant' },
                { value: 'EXT', text: 'For Extraction' },
                { value: 'FPD', text: 'Fixed Bridge' },
                { value: 'MB', text: 'Maryland Bridge' },
                { value: 'FRB', text: 'Fiber - reinforced bridge' },
                { value: 'PE', text: 'Periodontitis' },
                { value: 'RPD', text: 'Removable Partial Denture' },
                { value: 'CD', text: 'Complete Denture' },
                { value: 'TE', text: 'Temporary Teeth' },
                // new data
                { value: 'RF', text: 'Rooth Fragment' },
                { value: 'AM', text: 'Amalgam' },
                { value: 'CO', text: 'Composite' },
                { value: 'RC', text: 'Restored Carius' },
                { value: 'RCT', text: 'Root Canal' },
                { value: 'RTX', text: 'Root Canal Treated' }
            ],
          filter: {
              prescription_id: '',
              date: '',
              description: '' },
          fields: [
              { label: '', key: 'id', headerClass: 'text-center', sortable: false },
              { label: 'Created By', key: 'createdBy', headerClass: 'text-left', sortable: true },
              { label: 'Date', key: 'createdAt', headerClass: 'text-left', sortable: true },
              { label: 'Remarks', key: 'remarks', headerClass: 'text-left', sortable: true },
              { label: 'Actions', key: 'actions', sortable: false }
          ],
          perPage: 10,
          currentPage: 1,
          items: []
        }
      },
      computed: {
            rows () {
                return this.items.length
            }
        },
      methods: {
        resetDiagram () {
          this.dentalRecord = {
            patient_id: this.patientId,
            remarks: '',
            right1: [{ code: 55, code_text: '', color_code: '', value: false }, { code: 54, code_text: '', color_code: '', value: false }, { code: 53, code_text: '', color_code: '', value: false }, { code: 52, code_text: '', color_code: '', value: false }, { code: 51, code_text: '', color_code: '', value: false }],
            left1: [{ code: 61, code_text: '', color_code: '', value: false }, { code: 62, code_text: '', color_code: '', value: false }, { code: 54, code_text: '', color_code: '', value: false }, { code: 64, code_text: '', color_code: '', value: false }, { code: 65, code_text: '', color_code: '', value: false }],
            right2: [{ code: 18, code_text: '', color_code: '', value: false }, { code: 17, code_text: '', color_code: '', value: false }, { code: 16, code_text: '', color_code: '', value: false }, { code: 15, code_text: '', color_code: '', value: false }, { code: 14, code_text: '', color_code: '', value: false }, { code: 13, code_text: '', color_code: '', value: false }, { code: 12, code_text: '', color_code: '', value: false }, { code: 11, code_text: '', color_code: '', value: false }],
            left2: [{ code: 21, code_text: '', color_code: '', value: false }, { code: 22, code_text: '', color_code: '', value: false }, { code: 23, code_text: '', color_code: '', value: false }, { code: 24, code_text: '', color_code: '', value: false }, { code: 25, code_text: '', color_code: '', value: false }, { code: 26, code_text: '', color_code: '', value: false }, { code: 27, code_text: '', color_code: '', value: false }, { code: 28, code_text: '', color_code: '', value: false }],
            right3: [{ code: 48, code_text: '', color_code: '', value: false }, { code: 47, code_text: '', color_code: '', value: false }, { code: 46, code_text: '', color_code: '', value: false }, { code: 45, code_text: '', color_code: '', value: false }, { code: 44, code_text: '', color_code: '', value: false }, { code: 43, code_text: '', color_code: '', value: false }, { code: 42, code_text: '', color_code: '', value: false }, { code: 41, code_text: '', color_code: '', value: false }],
            left3: [{ code: 31, code_text: '', color_code: '', value: false }, { code: 32, code_text: '', color_code: '', value: false }, { code: 33, code_text: '', color_code: '', value: false }, { code: 34, code_text: '', color_code: '', value: false }, { code: 35, code_text: '', color_code: '', value: false }, { code: 36, code_text: '', color_code: '', value: false }, { code: 37, code_text: '', color_code: '', value: false }, { code: 38, code_text: '', color_code: '', value: false }],
            right4: [{ code: 85, code_text: '', color_code: '', value: false }, { code: 84, code_text: '', color_code: '', value: false }, { code: 83, code_text: '', color_code: '', value: false }, { code: 82, code_text: '', color_code: '', value: false }, { code: 81, code_text: '', color_code: '', value: false }],
            left4: [{ code: 71, code_text: '', color_code: '', value: false }, { code: 72, code_text: '', color_code: '', value: false }, { code: 73, code_text: '', color_code: '', value: false }, { code: 74, code_text: '', color_code: '', value: false }, { code: 75, code_text: '', color_code: '', value: false }]
          }
        },
        getDiagramRecord (id) {
            patientDiagramRecord.getPatientDiagramRocordById(id)
            .then(({ data }) => {
                if (data?.success) {
                    this.action = 'edit'
                    this.diagramId = data?.data?.id
                    this.dentalRecord.remarks = data?.data?.remarks
                    this.teeth_groups.forEach(d => {
                        if (data?.data?.data_records?.length) {
                            this.dentalRecord[d] = data?.data?.data_records?.filter(rec => { return rec?.teeth_group === d }).map(row => { return { id: row?.id, diagram_record_id: row?.diagram_record_id, teeth_group: row?.teeth_group, code: row?.code, code_text: this.getCodeValue(row?.code_text), color_code: row?.color_code, value: row?.value === 'Y' } })
                        }
                    })
                } else {
                    this.action = 'add'
                    this.resetDiagram()
                }
            })
            .catch(error => { console.log(error) })
        },
        submitPatientDiagram () {
            this.isLoading = true
            // if (isUpdate) {
                // alert('isUpdate')
                // patientDiagramRecord.updatePatientDiagramRocord(this.dentalRecord, this.diagramId)
                // .then(({ data }) => {
                //     if (data.success) {
                //         this.$router.push(`/patient/view/${this.$route.params.id}`)
                //     }
                //     this.getAllPatientDiagramRecord()
                //     this.$swal(data?.message ?? 'Patient Diagram Record was updated successfully!')
                //     this.isLoading = false
                // }).catch(error => {
                //     console.log(error)
                //     this.isLoading = false
                // })
            // } else {
                patientDiagramRecord.createPatientDiagramRocord(this.dentalRecord)
                .then(({ data }) => {
                    if (data.success) {
                        this.$router.push(`/patient/view/${this.$route.params.id}`)
                    }
                    this.$swal(data?.message ?? 'Patient Diagram Record was created successfully!')
                    this.getAllPatientDiagramRecord()
                    this.isLoading = false
                }).catch(error => {
                    console.log(error)
                    this.isLoading = false
                })
            // }
        },
        updatePatientDiagram () {
            patientDiagramRecord.updatePatientDiagramRocord(this.dentalRecord, this.diagramId)
                .then(({ data }) => {
                    if (data.success) {
                        this.$router.push(`/patient/view/${this.$route.params.id}`)
                    }
                    this.getAllPatientDiagramRecord()
                    this.$swal(data?.message ?? 'Patient Diagram Record was updated successfully!')
                    this.isLoading = false
                }).catch(error => {
                    console.log(error)
                    this.isLoading = false
                })
        },
        getAllPatientDiagramRecord () {
          patientDiagramRecord.getAllPatientDiagramRocords({ patient_id: this.patientId }).then(({ data }) => {
            if (data.success) {
              this.items = data?.data.map(d => {
                var dentalRecord = {}
                this.teeth_groups.forEach((param) => {
                        if (d?.data_records?.length) {
                            dentalRecord[param] = d?.data_records?.filter(rec => { return rec?.teeth_group === param }).map(row => { return { id: row?.id, diagram_record_id: row?.diagram_record_id, teeth_group: row?.teeth_group, code: row?.code, code_text: this.getCodeValue(row?.code_text), color_code: row?.color_code, value: row?.value === 'Y' } })
                        }
                    })
                return {
                    ...d,
                    dentalRecord
                }
              })
              console.log('data => ', data?.data)
              console.log('items => ', this.items)
            }
          }).catch(err => console.log(err))
        },
        actionDelPatientDiagram (id) {
            this.$swal.fire({
              title: 'Are you sure you want to delete this record?',
              showCancelButton: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'No'
          }).then((result) => {
            if (result.isConfirmed) {
                patientDiagramRecord.deletePatientDiagramRocord(id).then(({ data }) => {
                if (data.success) {
                    this.getAllPatientDiagramRecord()
                    this.getDiagramRecord(this.patientId)
                    this.$swal('Patient Diagram Record was deleted successfully!')
                }
                }).catch(err => console.log(err))
            }
          })
        },
        getCodeValue (code) {
            if (!code) {
                return ''
            }
            return this.codeList.find(d => {
                return d.value === code
            })
        },
        actionEditPatientDiagram (data) {
            this.resetDiagram()
            this.card_title = 'Patient Diagram' + ' ( ' + this.patientDetail?.first_name + ' ' + (this.patientDetail?.middle_name ?? '') + ' ' + this.patientDetail?.last_name + ' - Date Created: ' + data?.createdAt + ' ) '
            this.action = 'edit'
            this.dentalRecord.remarks = data?.remarks
            this.teeth_groups.forEach(d => {
                if (data?.data_records?.length) {
                    this.dentalRecord[d] = data?.data_records?.filter(rec => { return rec?.teeth_group === d }).map(row => { return { id: row?.id, diagram_record_id: row?.diagram_record_id, teeth_group: row?.teeth_group, code: row?.code, code_text: this.getCodeValue(row?.code_text) || '', color_code: row?.color_code || '', value: row?.value === 'Y' } })
                }
            })
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    }
</script>
<style>
    .vs__actions {
        display: none !important;
    }
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
