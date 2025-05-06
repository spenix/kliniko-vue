import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  getAllPrescriptionsByPaginate (data, page) {
    return axios.post(process.env.VUE_APP_API_URL + `/prescriptions-by-paginate?page=${page}`, data, { headers: authHeader() })
  },
  getAllPrescriptions (data) {
    var route = process.env.VUE_APP_API_URL + `/prescriptions?${data}`
    return axios.get(route, { headers: authHeader() })
  },
  createPrescription (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/prescriptions', data, { headers: authHeader() })
  },
  updatePrescription (data, id) {
    return axios.put(process.env.VUE_APP_API_URL + `/prescriptions/${id}`, data, { headers: authHeader() })
  },
  getPrescriptionById (id) {
    return axios.get(process.env.VUE_APP_API_URL + '/prescriptions/' + id, { headers: authHeader() })
  }
}
