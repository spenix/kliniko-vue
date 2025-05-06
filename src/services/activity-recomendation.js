import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  createActivityRecommendation (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/activity-recommendations', data, { headers: authHeader() })
  },
  updateActivityRecommendation (data, id) {
    return axios.put(process.env.VUE_APP_API_URL + '/activity-recommendations/' + id, data, { headers: authHeader() })
  },
  deleteActivityRecommendation (id) {
    return axios.delete(process.env.VUE_APP_API_URL + `/activity-recommendations/${id}`, { headers: authHeader() })
  },
  getAllRecommendationsByActivity (data) {
    return axios.post(process.env.VUE_APP_API_URL + `/recommendations-by-activity`, data, { headers: authHeader() })
  },
  getPatientRecommendationFromPrevAct (data) {
    return axios.post(process.env.VUE_APP_API_URL + `/recommendation-from-prev-activity`, data, { headers: authHeader() })
  },
  hidePatientRecom (data) {
    return axios.post(process.env.VUE_APP_API_URL + `/hide-recommendation`, data, { headers: authHeader() })
  }
}
