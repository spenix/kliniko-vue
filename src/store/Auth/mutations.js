export default {
  isLoggedInCommit (state, data) {
    state.isLoggedIn = data
  },
  userTokenCommit (state, data) {
    state.userToken = data
  },
  userDetailsCommit (state, data) {
    state.userDetails = data
  },
  userActiveBranchCommit (state, data) {
    state.userActiveBranch = data
  }
}
