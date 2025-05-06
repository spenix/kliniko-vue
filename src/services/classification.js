import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  getAllClassifications () {
    return axios.get(process.env.VUE_APP_API_URL + '/classifications', { headers: authHeader(), validateStatus: false })
  },
  createClassification (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/classifications', data, { headers: authHeader(), validateStatus: false })
  },
  updateClassification (data, id) {
    return axios.put(process.env.VUE_APP_API_URL + `/classifications/${id}`, data, { headers: authHeader(), validateStatus: false })
  },
  deleteClassification (id) {
    return axios.delete(process.env.VUE_APP_API_URL + `/classifications/${id}`, { headers: authHeader(), validateStatus: false })
  },
  getClassificationById (id) {
    return axios.get(process.env.VUE_APP_API_URL + '/classifications/' + id, { headers: authHeader(), validateStatus: false })
  }
}
