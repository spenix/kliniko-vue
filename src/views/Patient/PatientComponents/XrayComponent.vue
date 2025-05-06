<template>
    <tab-content-item :active="true" id="XrayComponent">
        <b-container fluid>
            <b-card
            :title="title"
            class="iq-mb-3"
            >
            <b-row class="my-4" align-h="center">
                <b-col class="col-12 text-center" v-if="!xrayList.length"> No data results. </b-col>
                <b-col class="col-4" v-for="(d, i) in xrayList" :key="`xray-img-${i}`">
                    <a :href="getImageUri(d?.filename)" target="_blank" :title="d?.title">
                        <div class="card iq-mb-3 text-center justify-content-center bordered-div" :style="setCssBackground(d?.filename, isImageFileType(d?.filename))">
                            <i v-show="!isImageFileType(d?.filename)" class="fa fa-file fa-4x"></i>
                        </div>
                    </a>
                </b-col>
            </b-row>
            </b-card>
        </b-container>
    </tab-content-item>
</template>
<style>
.bordered-div {
        border: 1px solid #6e7278 !important;
        box-shadow: 5px 5px 10px 4px grey;
    }
</style>
<script>
    import attachmentService from '../../../services/attachment'
    export default {
        name: 'XrayComponent',
        data () {
            return {
                title: 'Xray Images',
                xrayList: []
            }
        },
        props: {
            patientId: String,
            patientDetail: Object
        },
        methods: {
            getFileExtension (fileName) {
                var fileExtension
                fileExtension = fileName.replace(/^.*\./, '')
                return fileExtension
            },
            isImageFileType (uri) {
                if (uri) {
                    var cnt = uri.split('/')
                    if (cnt.length) {
                        var fileExt = this.getFileExtension(uri)
                        var imagesExtension = ['png', 'jpg', 'jpeg']
                        console.log('imagesExtension check ==> ', imagesExtension.includes(fileExt))
                        if (imagesExtension.indexOf(fileExt) !== -1) {
                            return true
                        }
                    }
                }
                return false
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
            getExrayList () {
               if (this.patientId) {
                var payload = {
                    patientId: this.patientId,
                    attachmentType: 'xray'
                }
                attachmentService.getAttachmentByTypes(payload)
                .then(({ data }) => {
                    if (data?.success) {
                        this.xrayList = data?.data
                    }
                })
                .catch(error => { console.log(error) })
               }
            },
            setCssBackground (img) {
                if (img) {
                    return {
                    'background-image': `url('${this.getImageUri(img)}')`,
                    'background-position': 'center',
                    'background-repeat': 'no-repeat',
                    'background-size': 'contain',
                    'height': '300px'
                    }
                } else {
                    return {
                        'height': '300px',
                        'background-color': '#faf6f5'
                    }
                }
             }
        },
        mounted () {
            this.getExrayList()
        }
    }
</script>
