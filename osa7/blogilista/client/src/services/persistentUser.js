const getUser = () => {
  const userJson = window.localStorage.getItem('user')
  return userJson ? JSON.parse(userJson) : null
}

const saveUser = (user) => {
  window.localStorage.setItem('user', JSON.stringify(user))
}

const removeUser = () => {
  window.localStorage.removeItem('user')
}

export default {
  getUser: getUser,
  saveUser: saveUser,
  removeUser: removeUser,
}
