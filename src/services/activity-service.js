import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  createActivityService (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/activity-services', data, { headers: authHeader() })
  },
  updateActivityServiceCommission (data, id) {
    return axios.put(process.env.VUE_APP_API_URL + '/activity-services/commission/' + id, data, { headers: authHeader() })
  },
  voidActivityService (data, id) {
    return axios.put(process.env.VUE_APP_API_URL + '/activity-services/void/' + id, data, { headers: authHeader() })
  },
  deleteActivityService (id) {
    return axios.delete(process.env.VUE_APP_API_URL + `/activity-services/${id}`, { headers: authHeader() })
  },
  getAllServicesByActivity (id) {
    return axios.get(process.env.VUE_APP_API_URL + `/activity-services/services-by-activity/${id}`, { headers: authHeader() })
  }
}
