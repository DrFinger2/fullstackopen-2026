import axios from 'axios'
const BASE_URL = '/api/blogs'

const extractMessage = (error) => {
  const message = error.response?.data?.error
  throw new Error(message || 'something went wrong')
}

function getAll() {
  const request = axios.get(BASE_URL)
  return request.then(response => response.data).catch(extractMessage)
}

function add(obj) {
  const request = axios.post(BASE_URL, obj)
  return request.then(response => response.data).catch(extractMessage)
}

export default {
  getAll: getAll,
  add: add
}