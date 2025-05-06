import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  getAllClinics () {
    return axios.get(process.env.VUE_APP_API_URL + '/clinics', { headers: authHeader() })
  },
  createClinic (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/clinics', data, { headers: authHeader() })
  },
  updateClinic (data) {
    return axios.put(process.env.VUE_APP_API_URL + '/clinics/' + data.id, data, { headers: authHeader() })
  }
}
