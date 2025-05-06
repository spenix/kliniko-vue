import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  getAllMedicalConditions () {
    return axios.get(process.env.VUE_APP_API_URL + '/medical-conditions', { headers: authHeader() })
  }
}
