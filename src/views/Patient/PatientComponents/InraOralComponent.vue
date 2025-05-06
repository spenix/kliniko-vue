<template>
    <tab-content-item :active="true" id="InraOralComponent">
        <b-container fluid>
            <b-card
              :title="title"
              class="iq-mb-3"
            >
                <b-row class="mb-4">
                    <b-col md="12">
                        <button type="button" class="btn btn-primary float-right" @click="printIntraOralRec()"><i class="las la-print"></i> Print</button>
                    </b-col>
                </b-row>
                <form @submit.prevent="submitPatientOralRec">
                    <div class="row my-4 justify-content-center" v-for="(rowData, rowIndex) in intraOralForm" :key="`form-row-${rowIndex}`">
                        <div :class="`${rowData?.colClassNum == '3' ? 'col-9' : 'col-12'} ${ rowData?.colClassNum ? `col-md-${rowData?.colClassNum}` : '' } text-center`" v-for="(colData, colIndex) in rowData?.columns" :key="`form-col-${colIndex}`">
                            <div class="card iq-mb-3 bordered-div" :style="setCssBackground(colData?.imageFile, (rowData.colClassNum == '3' ? {'height': '40.67vh !important'} : {'height': '25.67vh !important'}))">
                                <!-- <img :src="colData?.imageFile" fluid alt="#" class="card-img-top"> -->
                                <div class="dropdown" v-if="colData?.imageFile">
                                    <button class="dropbtn float-left"><i class="fa fa-ellipsis-h"></i></button>
                                    <div class="dropdown-content">
                                        <!-- <a href="#" title="Edit" @click="btnIntaOralAction(rowData.rowId, colData, 'edit')"><i class="fa fa-edit"></i></a> -->
                                        <a href="#" title="Delete" @click="btnIntaOralAction(rowData.rowId, colData, 'delete')"><i class="fa fa-trash"></i></a>
                                    </div>
                                </div>
                                <div class="card-body" >
                                    <a role="button" tabindex="0" class="inner-element" href="#" target="_self" title="Add" v-if="!colData?.imageFile" >
                                        <input type="file" :ref="`imageFile-${rowData.rowId}-${colData.columnId}`" @change="previewImage(rowData.rowId, colData.columnId, $event)" class="h-100 position-absolute" accept="image/jpg,image/png,image/jpeg" style="opacity: 0;" />
                                        <i class="fa fa-plus-circle fa-5x" style="cursor:pointer; color: #c2c2d6;"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </b-card>
            <b-modal id="intra-oral-modal" size="lg" title="Patient Intra Oral Record" ok-title="Generate" @ok.prevent="generateInraOral" cancel-title="Close">
                <div id="printInraOralContent" ref="printInraOralContent">
                    <div class="row p-2">
                        <div class="col-12">
                            <div style="margin-left: 1rem !important; margin-right: 1rem !important; overflow: hidden;">
                                <ul class="list-unstyled">
                                    <b-media tag="li">
                                        <template v-slot:aside>
                                            <b-img :src="userActiveBranch?.logoV2 ?? require('../../../assets/images/page-img/24.jpg')" width="100" height="100" alt="Branch Logo"></b-img>
                                        </template>
                                        <b-media-body>
                                            <b-row >
                                            <b-col class="col-md-12">
                                                <span style="font-size: 16px; font-weight: bold;">{{userActiveBranch?.clinic_name ?? 'N/A'}}</span>
                                            </b-col>
                                            <b-col class="col-md-6">
                                                <p style="font-size: 13px;">
                                                    {{ userActiveBranch?.address ?? 'N/A' }} <br>
                                                    {{ userActiveBranch?.email ?? 'N/A' }}
                                                </p>
                                            </b-col>
                                            <b-col class="col-md-6">
                                                <p style="font-size: 13px;">
                                                    Globe: N/A <br>
                                                    Smart: N/A <br>
                                                    FB: {{ userActiveBranch?.fb_page ?? 'N/A' }}
                                                </p>
                                            </b-col>
                                        </b-row>
                                        </b-media-body>
                                    </b-media>
                                    <b-media tag="li" style="background: #2f73e0 !important; text-align: center;">
                                        <span style="font-weight: bold; color: #fff;">INTRA/EXTRA ORAL PHOTOS</span>
                                    </b-media>
                                    <b-media tag="li" style="margin-top: 5px; background: #2f73e0 !important; color: #fff; padding: 4px;">
                                        <b-row >
                                            <b-col class="col-md-6">
                                                <span style="font-size: 12px;">NAME: {{ patientDetail?.first_name + " " +( patientDetail?.middle_name ?? '' ) + " " + patientDetail?.last_name }}</span>
                                            </b-col>
                                            <b-col class="col-md-6">
                                                <span style="font-size: 12px;">INTRA/EXTRA ORAL PHOTO</span>
                                            </b-col>
                                        </b-row>
                                        <b-row >
                                            <b-col class="col-md-6"><span style="font-size: 12px;">ADDRESS: {{ patientDetail?.address_line1 +  " "  + patientDetail?.address_line2  }}</span></b-col>
                                            <b-col class="col-md-6"><span style="font-size: 12px;">DATE TAKEN: {{ dateTaken }}</span></b-col>
                                        </b-row>
                                        <b-row >
                                            <b-col class="col-md-12"><span style="font-size: 12px;">BIRTHDAY: {{ moment(patientDetail?.birth_date).format('LL') }}</span></b-col>
                                        </b-row>
                                        <b-row >
                                            <b-col class="col-md-12"><span style="font-size: 12px;">CONTACT NO: {{ patientDetail?.contact_no }}</span></b-col>
                                        </b-row>
                                    </b-media>
                                    <b-media tag="li">
                                        <b-row class="my-1" align-h="center" v-for="(rowData, rowIndex) in intraOralForm" :key="`gen-form-row-${rowIndex}`">
                                            <b-col :class="`${ rowData?.colClassNum ? `col-${rowData?.colClassNum}` : '' } text-center`" v-for="(colData, colIndex) in rowData?.columns" :key="`gen-form-col-${colIndex}`">
                                                <!-- <div class="card my-1 bordered-div-2" v-if="rowData.colClassNum != '3'" :style="setCssPrintImg(colData?.imageFile, ({ 'height': '180px', 'width': '100%', 'background-size': '100% !important' }))"> -->
                                                <!-- <div class="card my-1 bordered-div-2" :style="setCssPrintImg('', (rowData.colClassNum == '3' ? {'height': '180px', 'width': '100%', 'overflow': 'hidden' } : { 'height': '180px', 'width': '100%', 'overflow': 'hidden' }))"> -->
                                                        <!-- <img :src="colData?.imageFile" alt="Image" :style="setCssPrintImg('', (rowData.colClassNum == '3' ? {'height': '100%', 'width': 'auto', 'object-position': '50% 50%', 'object-fit': 'cover' } : { 'height': '280px', 'width': 'auto', 'object-position': 'left bottom', 'object-fit': 'cover' }))" class="card-img-top"> -->
                                                <!-- </div> -->
                                                <div class="card my-1 bordered-div-2" :style="setCssPrintImg('', ({'height': '180px', 'width': '100%', 'overflow': 'hidden', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center' }))">
                                                    <img :src="colData?.imageFile" alt="Image" :style="setCssPrintImg('', ({'height': (rowData.colClassNum != '3' ? 'auto' : '100%'), 'width': '100%', 'object-position': 'center', 'object-fit': 'cover' }))" class="card-img-top">
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-media>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </b-modal>
        </b-container>
    </tab-content-item>
    </template>
    <script>
        import html2pdf from 'html2pdf.js'
        import patientInraOralRecordService from '../../../services/patientInraOralRecord'
        import moment from 'moment'
        import { mapGetters } from 'vuex'
        export default {
            name: 'IntraOral',
            props: {
                patientId: String,
                patientDetail: Object
            },
            data () {
                return {
                    moment,
                    title: 'Intra Oral',
                    intraOralForm: [
                        {
                            rowId: 1,
                            colClassNum: '3',
                            columns: [
                                { id: '', columnId: 1, imageFile: '', isRetreived: false, isToEdit: 'N' },
                                { id: '', columnId: 2, imageFile: '', isRetreived: false, isToEdit: 'N' },
                                { id: '', columnId: 3, imageFile: '', isRetreived: false, isToEdit: 'N' },
                                { id: '', columnId: 4, imageFile: '', isRetreived: false, isToEdit: 'N' }
                            ]
                        },
                        {
                            rowId: 2,
                            colClassNum: '5',
                            columns: [
                                { id: '', columnId: 1, imageFile: '', isRetreived: false, isToEdit: 'N' }
                            ]
                        },
                        {
                            rowId: 3,
                            colClassNum: '5',
                            columns: [
                                { id: '', columnId: 1, imageFile: '', isRetreived: false, isToEdit: 'N' },
                                { id: '', columnId: 2, imageFile: '', isRetreived: false, isToEdit: 'N' }
                            ]
                        },
                        {
                            rowId: 4,
                            colClassNum: '5',
                            columns: [
                                { id: '', columnId: 1, imageFile: '', isRetreived: false, isToEdit: 'N' },
                                { id: '', columnId: 2, imageFile: '', isRetreived: false, isToEdit: 'N' }
                            ]
                        }
                    ],
                    dateTaken: '',
                    patient_id: ''
                }
            },
            computed: {
                ...mapGetters({
                    userActiveBranch: 'Auth/userActiveBranch',
                    userDetails: 'Auth/userDetails'
                })
            },
            methods: {
                previewImage (r, c, evt) {
                    const input = evt.target
                    if (input.files && input.files[0]) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                            this.intraOralForm[(r - 1)].columns[(c - 1)].imageFile = e.target.result
                            var formData = new FormData()
                            formData.append('row_num', (r - 1))
                            formData.append('column_num', (c - 1))
                            formData.append('imageFile', e.target.result)
                            formData.append('patient_id', this.patientId)
                            this.submitPatientOralRec(formData)
                        }
                        reader.readAsDataURL(input.files[0])
                    }
                },
                submitPatientOralRec (fileObj) {
                    patientInraOralRecordService.createPatientInraOralRecord(fileObj)
                    .then(({ data }) => {
                        if (data?.success) {
                            this.getIntraOralRec()
                        }
                        this.$swal(data?.message ?? 'Patient Intra Oral Record was submitted successfully!')
                    }).catch(error => {
                        console.log(error)
                    })
                 },
                 getIntraOralRec () {
                    patientInraOralRecordService.getAllPatientInraOralRecords({ patient_id: this.patientId })
                    .then(({ data }) => {
                       if (data.success) {
                            this.patient_id = data?.data.length ? data?.data[0]?.patient_id : ''
                            this.dateTaken = data?.data.length ? data?.data[0]?.taken_date : ''
                            data.data.forEach(d => {
                                this.intraOralForm[d?.row_rec].columns[d?.column_rec].isRetreived = true
                                this.intraOralForm[d?.row_rec].columns[d?.column_rec].imageFile = d?.img64
                                this.intraOralForm[d?.row_rec].columns[d?.column_rec].id = d?.id
                            })
                       }
                    }).catch(error => { console.log(error) })
                 },
                 printIntraOralRec () {
                    var dtNow = moment().format('YYYY-MM-DD')
                    var dtTaken = moment(this.dateTaken).format('YYYY-MM-DD')
                    this.$swal.fire({
                            title: 'Is the Date Taken is correct? Please change if not.',
                            html: '<input type="date" id="dateTaken" max="' + dtNow + '" value="' + dtTaken + '" class="swal2-input">',
                            padding: '1em',
                            showCancelButton: true,
                            confirmButtonText: 'Submit',
                            showLoaderOnConfirm: true,
                            preConfirm: () => {
                                this.dateTaken = moment(document.getElementById('dateTaken').value).format('LL')
                                this.updateRecords(document.getElementById('dateTaken').value)
                            }
                        })
                 },
                 updateRecords (d) {
                    let data = { date_taken: d }
                    patientInraOralRecordService.updatePatientInraOralRecord(data, this.patientId)
                    .then(({ data }) => {
                        if (data?.success) {
                            this.$bvModal.show('intra-oral-modal')
                        }
                    })
                 },
                 generateInraOral () {
                    html2pdf(this.$refs.printInraOralContent, {
                    margin: 0.1,
                    filename: 'IntraOral.pdf',
                    image: { type: 'jpeg', quality: 1 },
                    html2canvas: {
                        dpi: 192,
                        scale: 4,
                        letterRendering: true,
                        useCORS: true
                    },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                    })
                 },
                 setCssBackground (img, addCss = {}) {
                    let cssPayload = {
                        'height': '45.67vh',
                        'background-color': '#faf6f5'
                    }
                    if (img) {
                        cssPayload['background-image'] = `url('${img}')`
                        cssPayload['background-position'] = 'center'
                        cssPayload['background-repeat'] = 'no-repeat'
                        cssPayload['background-size'] = 'cover'
                        cssPayload['background-clip'] = 'border-box'
                    }
                    return window.screen.width > 992 ? { ...cssPayload } : { ...cssPayload, ...addCss }
                 },
                 setCssPrintImg (img, addCss = {}) {
                    let cssPayload = {}
                    if (img) {
                        cssPayload['background-image'] = `url('${img}')`
                        cssPayload['background-position'] = '50% 50% !important'
                        cssPayload['background-repeat'] = 'no-repeat !important'
                        // cssPayload['background-size'] = '100% !important'
                        cssPayload['image-rendering'] = '-webkit-optimize-contrast'
                        // cssPayload['-webkit-filter'] = 'blur(0)'
                        // cssPayload['-moz-filter'] = 'blur(0)'
                        // cssPayload['-o-filter'] = 'blur(0)'
                        // cssPayload['-o-filter'] = 'blur(0)'
                        // cssPayload['-ms-filter'] = 'blur(0)'
                        // cssPayload['filter'] = 'blur(0)'
                    }
                    return { ...cssPayload, ...addCss }
                 },
                 btnIntaOralAction (r, c, act) {
                    this.$swal.fire({
                        title: 'Are you sure you want to delete image?',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                              if (act === 'delete') {
                                    var id = this.intraOralForm[(r - 1)].columns[(c?.columnId - 1)].id
                                    patientInraOralRecordService.deletePatientInraOralRecord(id)
                                    .then(({ data }) => {
                                        if (data?.success) {
                                            this.clearIntraOralData((r - 1), (c?.columnId - 1))
                                            setTimeout(() => {
                                                this.getIntraOralRec()
                                            }, 500)
                                        }
                                        this.$swal(data?.message)
                                    })
                                    .catch(error => {
                                        console.log(error)
                                    })
                                }
                        }
                    })
                 },
                 clearIntraOralData (r, c) {
                    this.intraOralForm[r].columns[c].isRetreived = false
                    this.intraOralForm[r].columns[c].imageFile = ''
                    // this.intraOralForm[r].columns[c].im = ''
                    this.intraOralForm[r].columns[c].id = ''
                 }
            },
            mounted () {
                this.getIntraOralRec()
            }
        }
    </script>
    <style>
        .inner-element{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            transform: translate3d(-50%,-50%,0);
        }
        .height-250 {
            height: 250px !important;
        }
        .height-200 {
            height: 200px !important;
        }
        .card-img-top {
            height: 160px;
        }
        .bordered-div {
            border: 1px solid #6e7278 !important;
            box-shadow: 5px 5px 10px 4px grey;
        }
        .bordered-div-2 {
            border: 1px solid #6e7278 !important;
            text-align: center;
        }
        .dropbtn {
            /* background-color: #04AA6D; */
            color: #6a6e73;
            padding: 4px 6px;
            font-size: 16px;
            border: none;
        }
    .dropdown {
      position: relative;
      display: inline-block;
    }
    .dropdown-content {
      display: none;
      position: absolute;
      background-color: #f1f1f1;
      min-width: 80px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
    }
    .dropdown-content a {
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
    }
    .dropdown-content a:hover {background-color: #ddd;}
    .dropdown:hover .dropdown-content {display: block;}
    .dropdown:hover .dropbtn { padding: 4px; }
    /* @media (max-width: 992px) {
        .bordered-div {
            height: 25.67vh !important;
        }
    } */
</style>
