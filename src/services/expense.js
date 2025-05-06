import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  getAllExpenses () {
    return axios.get(process.env.VUE_APP_API_URL + '/expenses', { headers: authHeader() })
  },
  getExpenseById (id) {
    return axios.get(process.env.VUE_APP_API_URL + '/expenses/' + id, { headers: authHeader() })
  },
  createExpense (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/expenses', data, { headers: authHeader() })
  },
  updateExpense (data, id) {
    return axios.put(process.env.VUE_APP_API_URL + '/expenses/' + id, data, { headers: authHeader() })
  }
}
