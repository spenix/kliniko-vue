import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  isLoggedIn: false,
  userToken: '',
  userDetails: {},
  userActiveBranch: {}
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
