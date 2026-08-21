import axios from 'axios'

const login = async (credentials) => {
  const response = await axios.post('/api/login', credentials)
  return response.data
}

const register = async (userDetails) => {
  const response = await axios.post('/api/users', userDetails)
  return response.data
}

const getAll = async () => {
  const response = await axios.get('/api/users')
  return response.data
}

export default { login, register, getAll }
