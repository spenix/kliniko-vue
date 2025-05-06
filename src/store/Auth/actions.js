export default {
  isLoggedInAction (context, payload) {
    return new Promise((resolve, reject) => {
      context.commit('isLoggedInCommit', payload)
      resolve()
    })
  },
  userTokenAction (context, payload) {
    return new Promise((resolve, reject) => {
      context.commit('userTokenCommit', payload)
      resolve()
    })
  },
  userDetailsAction (context, payload) {
    return new Promise((resolve, reject) => {
      context.commit('userDetailsCommit', payload)
      resolve()
    })
  },
  userActiveBranchAction (context, payload) {
    return new Promise((resolve, reject) => {
      context.commit('userActiveBranchCommit', payload)
      resolve()
    })
  }
}
