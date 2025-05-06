<template>
  <b-container fluid>
    <b-row>
      <b-col md="3">
        <!-- <iq-card class="calender-small">
          <template v-slot:body>
            <flat-pickr :config="config" value="" class="d-none"/>
          </template>
        </iq-card> -->
        <iq-card v-if="viewClassificationComp">
          <template v-slot:headerTitle>
            <h4 class="card-title ">Classification</h4>
          </template>
          <template v-slot:headerAction>
            <a href="#" @click="triggerClassificationModal('Add')"><i class="fa fa-plus  mr-0" aria-hidden="true" /></a>
          </template>
          <template v-slot:body>
            <ul class="m-0 p-0 job-classification" style="height: 200px; overflow-y: scroll;">
              <li class="" v-for="(d, i) in classificationList" :key="`classification-${i}`"><a href="#" @click="triggerClassificationModal('Edit', d)"><i class="ri-check-line mr-2" :style="`background-color: ${d.color}`" />{{ d?.name }}</a> <i class="las la-trash float-right" @click="deleteClassificationData(d?.id)" style="color:red; font-size: 20px; cursor:pointer;"></i></li>
            </ul>
          </template>
        </iq-card>
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Today's Schedule</h4>
          </template>
          <template v-slot:body>
            <ul class="m-0 p-0 today-schedule" style="height: 200px; overflow-y: scroll;">
              <li class="d-flex" v-for="(d, i) in todayScheduleList" :key="`today-sched-${i}`" style="cursor:pointer" @click="openAppointmentInfo(d)">
                <div class="schedule-icon"><i class="ri-checkbox-blank-circle-fill text-primary" :style="`color: ${d?.color}`" /></div>
                <div class="schedule-text"> <span>{{ d?.title }} <br> <small>{{ d?.note }}</small></span>
                  <span>{{  `${d?.time_start} to ${d?.time_end}`  }}</span></div>
              </li>
            </ul>
          </template>
        </iq-card>
      </b-col>
      <b-col md="9">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Book Appointment</h4>
          </template>
          <template v-slot:headerAction>
            <a href="#" class="btn btn-primary" @click="triggerBookingModal('Add', {})"><i class="ri-add-line mr-2"></i>Book Appointment</a>
          </template>
          <template v-slot:body>
            <FullCalendar :calendarEvents="bookingList" @getEventClickId="getEventClickId($event)"/>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <classificationModal @triggerClassification="triggerClassification" :modalFormAction="modalFormAction" :selectedItem="selectedItem"/>
    <BookingModal @triggerBooking="triggerBooking" :classificationList="classificationList" :modalFormAction="modalFormAction" :selectedItem="selectedItem"/>
    <b-modal id="modal-booking-info" ref="modal-booking-info" title="Appointment Info" ok-only>
      <div class="row">
        <div class="col-12">
          <ul class="list-unstyled">
            <li><b>Classification: </b>{{ selectedItem?.classification_name }}</li>
            <li><b>Title: </b>{{ selectedItem?.title }}</li>
            <li><b>Note: </b>{{ selectedItem?.note }}</li>
            <li v-if="selectedItem?.isRequiredPatient === 'Y'"><b>Patient: </b>{{ selectedItem?.patient_name }}</li>
            <li><b>Date/Time Start: </b>{{ selectedItem?.dateStart }}</li>
            <li><b>Date/Time end: </b>{{ selectedItem?.dateEnd }}</li>
          </ul>
        </div>
      </div>
    </b-modal>
  </b-container>
</template>
<script>
import { xray } from '../../../config/pluginInit'
import classificationModal from './CalendarComponents/ClassificationModal.vue'
import BookingModal from './CalendarComponents/BookingModal.vue'
import classification from '../../../services/classification'
import booking from '../../../services/booking'
import _ from 'lodash'
import { mapGetters } from 'vuex'
export default {
  name: 'GoogleCalendar',
  components: { classificationModal, BookingModal },
  data () {
    return {
      modalFormAction: 'Add',
      config: {
        dateFormat: 'Y-m-d',
        inline: true
      },
      viewClassificationComp: false,
      classificationList: [],
      bookingList: [],
      todayScheduleList: [],
      selectedItem: {}
    }
  },
  computed: {
    ...mapGetters({
      userDetails: 'Auth/userDetails'
    })
  },
  watch: {
    userDetails: _.debounce(function () {
      this.checkAccessOnClassification()
    })
  },
  mounted () {
    xray.index()
    this.triggerClassification()
    this.triggerBooking()
    this.getAllTodaysBooking()
    this.checkAccessOnClassification()
  },
  methods: {
    checkAccessOnClassification () {
      if (this.userDetails?.role) {
       this.viewClassificationComp = (['AD', 'SA']).includes(this.userDetails.role)
      }
    },
    getEventClickId (evt) {
      booking.getBookingDetails(evt)
      .then(({ data }) => {
        if (data.success) {
          this.openAppointmentInfo(data?.data)
        }
      })
      .catch((error) => { console.log(error) })
    },
    openAppointmentInfo (data) {
      this.selectedItem = data
      this.$bvModal.show('modal-booking-info')
    },
    deleteClassificationData (id) {
      classification.deleteClassification(id)
      .then(({ data }) => {
        if (data?.success) {
          this.triggerClassification()
        }
        this.$swal(data?.message)
       })
    },
    getTodaysAppointment () {},
    triggerBookingModal (action = 'Add', item = {}) {
      this.selectedItem = item
      this.modalFormAction = action
      this.$bvModal.show('modal-booking')
    },
    triggerClassificationModal (action = 'Add', item = {}) {
      this.selectedItem = item
      this.modalFormAction = action
      this.$bvModal.show('modal-classification')
    },
    triggerClassification () {
      classification.getAllClassifications()
      .then(({ data }) => {
        if (data?.success) {
          this.classificationList = data.data
        }
      })
      .catch(error => { console.log(error) })

      this.selectedItem = {}
    },
    triggerBooking () {
      booking.getAllBookings()
      .then(({ data }) => {
        if (data?.success) {
          this.bookingList = data?.data?.map(d => {
            return {
              'id': d?.id,
              'title': d?.classification_name + ' ( ' + d?.title + ' )',
              'end': d?.date_to,
              'start': d?.date_from,
              'color': d?.color
             }
          })
          this.getAllTodaysBooking()
        }
      })
      .catch(error => { console.log(error) })
      this.selectedItem = {}
    },
    getAllTodaysBooking () {
      booking.getAllTodaysBooking().then(({ data }) => { this.todayScheduleList = data?.data }).catch(error => { console.log(error) })
    }
  }
}
</script>
