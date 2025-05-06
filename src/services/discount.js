import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  getAllBranchDiscounts (branchId) {
    return axios.get(process.env.VUE_APP_API_URL + '/branch-discounts?branchId=' + branchId, { headers: authHeader(), validateStatus: false })
  },
  getBranchDiscountsByPagination (payload) {
    return axios.get(process.env.VUE_APP_API_URL + `/branch-discounts-paginated?${payload}`, { headers: authHeader(), validateStatus: false })
  },
  getAllDiscounts () {
    return axios.get(process.env.VUE_APP_API_URL + '/discounts', { headers: authHeader(), validateStatus: false })
  },
  getDiscountById (id) {
    return axios.get(process.env.VUE_APP_API_URL + '/discounts/' + id, { headers: authHeader(), validateStatus: false })
  },
  createDiscount (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/discounts', data, { headers: authHeader(), validateStatus: false })
  },
  updateDiscount (data, id) {
    return axios.put(process.env.VUE_APP_API_URL + '/discounts/' + id, data, { headers: authHeader(), validateStatus: false })
  },
  deleteDiscount (id) {
    return axios.delete(process.env.VUE_APP_API_URL + `/discounts/${id}`, { headers: authHeader(), validateStatus: false })
  }
}
