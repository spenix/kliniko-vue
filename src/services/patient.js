import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  getAllPatientsByPagination (branchId, search, page) {
    return axios.get(process.env.VUE_APP_API_URL + `/branch-patients-by-pagination?branchId=${branchId}&search=${search}&page=${page}`, { headers: authHeader() })
  },
  getAllPatients (branchId) {
    return axios.get(process.env.VUE_APP_API_URL + `/branch-patients?branchId=${branchId}`, { headers: authHeader() })
  },
  createPatient (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/patients', data, { headers: authHeader() })
  },
  updatePatient (data, id) {
    return axios.put(process.env.VUE_APP_API_URL + `/patients/${id}`, data, { headers: authHeader() })
  },
  getPatientById (id, branchId) {
    return axios.get(process.env.VUE_APP_API_URL + `/patients/${id}?branchId=${branchId}`, { headers: authHeader() })
  },
  searchPatients (data, page) {
    return axios.post(process.env.VUE_APP_API_URL + `/search-patients?page=${page}`, data, { headers: authHeader() })
  },
  getPatientBalanceHistory (id) {
    return axios.get(process.env.VUE_APP_API_URL + '/patient/' + id + '/balance-history', { headers: authHeader() })
  },
  getPatientsWithBalance (payload) {
    return axios.get(process.env.VUE_APP_API_URL + `/search-patients-with-balance?${payload}`, { headers: authHeader() })
  },
  getGrandTotalAmtBalance (payload) {
    return axios.get(process.env.VUE_APP_API_URL + `/patients-grand-total-balance?${payload}`, { headers: authHeader() })
  }
}
