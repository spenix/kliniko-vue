import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  dailyActivityReport (data) {
    return axios.get(process.env.VUE_APP_API_URL + '/reports/daily-activity-report', { headers: authHeader(), params: data })
  },
  commissionReport (data) {
    return axios.get(process.env.VUE_APP_API_URL + '/reports/commission-report', { headers: authHeader(), params: data })
  },
  overheadExpenseReport (data) {
    return axios.get(process.env.VUE_APP_API_URL + '/reports/daily-overhead-expenses-report', { headers: authHeader(), params: data })
  }
}
