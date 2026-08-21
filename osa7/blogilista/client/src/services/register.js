import axios from 'axios'
const BASE_URL = '/api/users'

const register = async (userDetails) => {
  const response = await axios.post(BASE_URL, userDetails)
  return response.data
}

export default { register }
