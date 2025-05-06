import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  getAllActivities () {
    return axios.get(process.env.VUE_APP_API_URL + '/activities', { headers: authHeader() })
  },
  getAllBranchActivities (payload) {
    return axios.get(process.env.VUE_APP_API_URL + `/branch-activities?${payload}`, { headers: authHeader() })
  },
  getActivityById (id, branchId) {
    return axios.get(process.env.VUE_APP_API_URL + `/activities/${id}?branchId=${branchId}`, { headers: authHeader() })
  },
  createActivity (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/activities', data, { headers: authHeader() })
  },
  updateActivity (data, id) {
    return axios.put(process.env.VUE_APP_API_URL + '/activities/' + id, data, { headers: authHeader() })
  },
  savePayment (data, id) {
    return axios.post(process.env.VUE_APP_API_URL + '/activities/payments/' + id, data, { headers: authHeader() })
  },
  settleWithBalance (data, id) {
    return axios.post(process.env.VUE_APP_API_URL + '/activities/settle-with-balance/' + id, data, { headers: authHeader() })
  },
  updateRemarks (data, id) {
    return axios.post(process.env.VUE_APP_API_URL + '/activities/update-remarks/' + id, data, { headers: authHeader() })
  },
  saveAdditionalCommission (data, id) {
    return axios.post(process.env.VUE_APP_API_URL + '/activities/additional-commission/' + id, data, { headers: authHeader() })
  },
  getActivityPaymentsByActivityId (id) {
    return axios.get(process.env.VUE_APP_API_URL + '/activities/payment-list/' + id, { headers: authHeader() })
  },
  getActivityDiscountsByActivityId (id) {
    return axios.get(process.env.VUE_APP_API_URL + '/activities/discount-list/' + id, { headers: authHeader() })
  },
  getActivitiesByPatientId (id, payload) {
    return axios.get(process.env.VUE_APP_API_URL + `/patient/activities/${id}?${payload}`, { headers: authHeader() })
  },
  saveDiscount (data, id) {
    return axios.post(process.env.VUE_APP_API_URL + '/activities/discounts/' + id, data, { headers: authHeader() })
  },
  saveCustomDiscount (data, id) {
    return axios.post(process.env.VUE_APP_API_URL + '/activities/custom-discounts/' + id, data, { headers: authHeader() })
  },
  removeDiscount (id) {
    return axios.delete(process.env.VUE_APP_API_URL + `/activities/discounts/${id}`, { headers: authHeader() })
  }
}
