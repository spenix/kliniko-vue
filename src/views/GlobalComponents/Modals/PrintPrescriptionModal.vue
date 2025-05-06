<template>
    <b-modal id="print-prescription-modal" scrollable :title="form_action + ' ' + title"  ok-title="Print" @ok.prevent="printPatientPrescription" cancel-title="Close">
    <div id="printPrescriptionContent" ref="documentPrescription">
      <div style="margin: 1rem !important; position: relative; min-height: 700px;" >
          <div class="row mb-8">
            <div class="col-12">
              <ul class="list-unstyled">
                <b-media tag="li">
                  <template v-slot:aside>
                    <b-img :src="userActiveBranch?.logoV2 ? userActiveBranch?.logoV2 : require('../../../assets/images/page-img/24.jpg')" width="80" height="80" style="object-fit: cover;" alt="Branch Logo"></b-img>
                  </template>
                  <b-media-body>
                    <h5 class="mt-0">{{userActiveBranch?.clinic_name ?? 'N/A'}}</h5>
                    <ul class="list-unstyled">
                      <li class="m-0 p-0">
                        <p>
                          {{ userActiveBranch?.address ?? 'N/A' }} <br>
                          Mobile No: {{ userActiveBranch?.contact_no ?? 'N/A' }} <br>
                          Email Address: <u>{{ userActiveBranch?.email ?? 'N/A' }}</u> <br>
                          <span v-if="userActiveBranch?.fb_page">Facebook Page: {{ userActiveBranch?.fb_page ?? 'N/A' }}</span>
                        </p>
                      </li>
                    </ul>
                  </b-media-body>
                </b-media>
                <b-media tag="li">
                  <b-media-body>
                    <div class="row">
                      <div class="col-8">
                          <label><b>NAME:</b> <span class="pl-1"><u>{{  `${patientInfo?.first_name} ${patientInfo?.middle_name ?? ''} ${patientInfo?.last_name}` }}</u></span></label>
                      </div>
                      <div class="col-4">
                        <label><b>DATE:</b> <span class="pl-1"><u>{{ currentDate }}</u></span></label>
                      </div>
                      <div class="col-8">
                          <label><b>ADDRESS:</b> <span class="pl-1"><u>{{  patientInfo?.address_line1 ?? patientInfo?.address_line2  }}</u></span></label>
                      </div>
                      <div class="col-4">
                        <label><b>AGE:</b><span class="pl-1"><u>{{ patientAge }}</u></span></label>
                      </div>
                    </div>
                  </b-media-body>
                </b-media>
                <b-media tag="li">
                  <ul class="list-unstyled">
                    <li>
                      <img :src="require('../../../assets/images/icon/rx-icon-6.png')" width="35" height="35" alt="logo">
                    </li>
                    <li>
                      <label>Prescription List</label>
                      <table class="table table-sm table-borderless" style="width: 100% !important;" id="prescription-report-tbl">
                        <thead>
                          <th>Qty</th>
                          <th>Unit</th>
                          <th>Name</th>
                          <th>Description</th>
                        </thead>
                        <tbody>
                          <tr v-for="(d, i) in prescriptionForm.prescriptionList" :key="`prescription-rec-${i}`">
                            <td>{{ (parseFloat(d.qty)).toFixed(2) }}</td>
                            <td class="text-center">{{ d.unit }}</td>
                            <td>{{ d.name }}</td>
                            <td>{{ d.desc }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </li>
                    <li>
                      <label v-if="prescriptionForm?.description"><b>Description: </b> {{ prescriptionForm?.description  }}</label>
                    </li>
                  </ul>
                </b-media>
              </ul>
            </div>
          </div>
          <b-row class="flex-row-reverse" style="position: absolute; top: 95%; bottom: 0%; right: 0%;">
            <b-col class="col" align-self="end" >
              <ul class="list-unstyled">
                <li class="text-center" style="color:#000;">
                  <span>
                    {{ prescriptionForm?.doctor }}
                  </span>
                </li>
                <li class="text-center" style="color:#000;">
                    License#: {{ prescriptionForm?.license_no }}
                </li>
                <li class="text-center mb-2" style="color:#000; border-top: 2px solid #000;">
                  Doctor
                </li>
              </ul>
            </b-col>
          </b-row>
      </div>
    </div>
  </b-modal>
</template>
<script>
    import html2pdf from 'html2pdf.js'
    export default ({
        name: '',
        props: {
            form_action: String,
            title: String,
            userActiveBranch: Object,
            patientInfo: Object,
            currentDate: String,
            patientAge: String,
            prescriptionForm: Object
        },
        methods: {
            printPatientPrescription () {
                var img = 'jpeg'
                    if (this.userActiveBranch?.logo) {
                    img = this.userActiveBranch?.logo.split('.').slice(-1)[0]
                    }
                    html2pdf(this.$refs.documentPrescription, {
                        margin: 0.1,
                        filename: 'prescription.pdf',
                        image: { type: img, quality: 0.98 },
                        html2canvas: { dpi: 192, letterRendering: true, useCORS: true },
                        jsPDF: { unit: 'in', format: 'a5', orientation: 'portrait' }
                    })
            }
        }
    })
</script>
