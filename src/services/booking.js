import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  getAllBookings () {
    return axios.get(process.env.VUE_APP_API_URL + '/booking-appointment', { headers: authHeader(), validateStatus: false })
  },
  getBookingDetails (id) {
    return axios.get(process.env.VUE_APP_API_URL + '/booking-appointment/' + id, { headers: authHeader(), validateStatus: false })
  },
  getAllTodaysBooking () {
    return axios.get(process.env.VUE_APP_API_URL + '/booking-appointment/today', { headers: authHeader(), validateStatus: false })
  },
  createBooking (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/booking-appointment', data, { headers: authHeader(), validateStatus: false })
  },
  updateBooking (data, id) {
    return axios.put(process.env.VUE_APP_API_URL + `/booking-appointment/${id}`, data, { headers: authHeader(), validateStatus: false })
  },
  deleteBooking (id) {
    return axios.delete(process.env.VUE_APP_API_URL + `/booking-appointment/${id}`, { headers: authHeader(), validateStatus: false })
  },
  getBookingById (id) {
    return axios.get(process.env.VUE_APP_API_URL + '/booking-appointment/' + id, { headers: authHeader(), validateStatus: false })
  }
}
