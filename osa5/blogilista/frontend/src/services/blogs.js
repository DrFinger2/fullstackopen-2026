import axios from 'axios'

const BASE_URL = '/api/blogs'
let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(BASE_URL)
  return response.data
}


const create = async (newObject) => {
  const config = {
    headers: { Authorization:token }
  }
  const response = await axios.post(BASE_URL, newObject, config)
  return response.data
}


const update = async (id, newObject) => {
  const config = {
    headers: { Authorization:token }
  }
  const url = `${BASE_URL}/${id}`
  const response = await axios.put(url, newObject, config)
  return response.data
}


export default { getAll, create, update, setToken }