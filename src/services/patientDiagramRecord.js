import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  getAllPatientDiagramRocords (data) {
    return axios.get(process.env.VUE_APP_API_URL + '/patient-diagram-records?patient_id=' + data?.patient_id, { headers: authHeader() })
  },
  createPatientDiagramRocord (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/patient-diagram-records', data, { headers: authHeader() })
  },
  updatePatientDiagramRocord (data, id) {
    return axios.put(process.env.VUE_APP_API_URL + `/patient-diagram-records/${id}`, data, { headers: authHeader() })
  },
  deletePatientDiagramRocord (id) {
    return axios.delete(process.env.VUE_APP_API_URL + `/patient-diagram-records/${id}`, { headers: authHeader() })
  },
  getPatientDiagramRocordById (id) {
    return axios.get(process.env.VUE_APP_API_URL + '/patient-diagram-records/' + id, { headers: authHeader(), validateStatus: false })
  }
}
