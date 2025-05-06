import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  getAllBusinessRuleUsers () {
    return axios.get(process.env.VUE_APP_API_URL + '/business-rule', { headers: authHeader() })
  },
  getRuleUsers (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/business-rule-users', data, { headers: authHeader() })
  },
  createBusinessRule (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/business-rule', data, { headers: authHeader() })
  },
  updateBusinessRule (data, id) {
    return axios.put(process.env.VUE_APP_API_URL + `/business-rule/${id}`, data, { headers: authHeader() })
  },
  deleteBusinessRule (id) {
    return axios.delete(process.env.VUE_APP_API_URL + `/business-rule/${id}`, { headers: authHeader() })
  },
  getBusinessRuleById (id) {
    return axios.get(process.env.VUE_APP_API_URL + '/business-rule/' + id, { headers: authHeader() })
  }
}
