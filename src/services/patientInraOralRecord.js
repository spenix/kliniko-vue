import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  getAllPatientInraOralRecords (data) {
    return axios.get(process.env.VUE_APP_API_URL + '/patient-intra-oral-records?patient_id=' + data?.patient_id, { headers: authHeader() })
  },
  createPatientInraOralRecord (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/patient-intra-oral-records', data, { headers: authHeader('form-data') })
  },
  updatePatientInraOralRecord (data, id) {
    return axios.put(process.env.VUE_APP_API_URL + `/patient-intra-oral-records/${id}`, data, { headers: authHeader() })
  },
  deletePatientInraOralRecord (id) {
    return axios.delete(process.env.VUE_APP_API_URL + `/patient-intra-oral-records/${id}`, { headers: authHeader() })
  },
  getPatientInraOralRecordById (id) {
    return axios.get(process.env.VUE_APP_API_URL + '/patient-intra-oral-records/' + id, { headers: authHeader() })
  }
}
