// import axios from './index'
import authHeader from '../auth/authHeader'
import http from '../Utils/https'

export default {
  getAllDoctors () {
    return http.get(process.env.VUE_APP_API_URL + '/doctors', { headers: authHeader() }).catch(errors => { return errors })
  },
  getAllDocsByBranch (branchId, query = '') {
    return http.get(process.env.VUE_APP_API_URL + `/branch-doctors?branchId=${branchId}&qry=${query}`, { headers: authHeader() }).catch(errors => { return errors })
  },
  getAllDoctorsByBranch (payload) {
    return http.get(process.env.VUE_APP_API_URL + `/branch-doctors-by-pagination?${payload}`, { headers: authHeader() }).catch(errors => { return errors })
  },
  createDoctor (data) {
    return http.post(process.env.VUE_APP_API_URL + '/doctors', data, { headers: authHeader() }).catch(errors => { return errors })
  },
  updateDoctor (data, id) {
    return http.put(process.env.VUE_APP_API_URL + `/doctors/${id}`, data, { headers: authHeader() }).catch(errors => { return errors })
  },
  getDoctorById (id) {
    return http.get(process.env.VUE_APP_API_URL + '/doctors/' + id, { headers: authHeader() }).catch(errors => { return errors })
  }
}
