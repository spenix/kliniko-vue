export default function authHeader (inputType = 'json') {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user && user.token) {
    if (inputType === 'json') {
      return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.token
      }
    } else {
      return {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + user.token
      }
    }
  } else {
    return {}
  }
}
