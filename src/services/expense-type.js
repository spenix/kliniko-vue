import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  getAllBranchExpenseTypes (branchId) {
    return axios.get(process.env.VUE_APP_API_URL + '/branch-expense-types?branchId=' + branchId, { headers: authHeader(), validateStatus: false })
  },
  getAllExpenseTypes () {
    return axios.get(process.env.VUE_APP_API_URL + '/expense-types', { headers: authHeader(), validateStatus: false })
  },
  getExpenseTypeById (id) {
    return axios.get(process.env.VUE_APP_API_URL + '/expense-types/' + id, { headers: authHeader(), validateStatus: false })
  },
  createExpenseType (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/expense-types', data, { headers: authHeader(), validateStatus: false })
  },
  updateExpenseType (data, id) {
    return axios.put(process.env.VUE_APP_API_URL + '/expense-types/' + id, data, { headers: authHeader(), validateStatus: false })
  }
}
