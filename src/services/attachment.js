import axios from './index'
import authHeader from '../auth/authHeader'

export default {
  getAllAttachmentsByPaginate (data, page) {
    return axios.post(process.env.VUE_APP_API_URL + `/attachments-by-paginate?page=${page}`, data, { headers: authHeader() })
  },
  getAllAttachments (data) {
    return axios.get(process.env.VUE_APP_API_URL + `/attachments?${data}`, { headers: authHeader() })
  },
  createAttachment (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/attachments', data, { headers: authHeader('form-data') })
  },
  deleteAttachment (id) {
    return axios.delete(process.env.VUE_APP_API_URL + `/attachments/${id}`, { headers: authHeader() })
  },
  updateAttachment (data, id) {
    return axios.post(process.env.VUE_APP_API_URL + `/attachments/${id}`, data, { headers: authHeader('form-data') })
  },
  getAttachmentById (id) {
    return axios.get(process.env.VUE_APP_API_URL + '/attachments/' + id, { headers: authHeader() })
  },
  getAttachmentByTypes (data) {
    return axios.post(process.env.VUE_APP_API_URL + '/attachment-by-types', data, { headers: authHeader() })
  }
}
