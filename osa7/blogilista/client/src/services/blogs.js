import axios from 'axios'

const BASE_URL = '/api/blogs'
let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(BASE_URL)
  return response.data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(BASE_URL, newObject, config)
  return response.data
}

const remove = async (blogId) => {
  const config = {
    headers: { Authorization: token },
  }
  const url = `${BASE_URL}/${blogId}`
  const response = await axios.delete(url, config)
  return response.data
}

const like = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }
  const url = `${BASE_URL}/${blog.id}`
  const updatedBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes + 1,
  }
  const response = await axios.put(url, updatedBlog, config)
  return response.data
}

const addComment = async (blogId, comment) => {
  const config = {
    headers: { Authorization: token },
  }
  const url = `${BASE_URL}/${blogId}/comments`
  const response = await axios.post(url, { comment }, config)
  return response.data
}

const update = async (blogId, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const url = `${BASE_URL}/${blogId}`
  const response = await axios.put(url, newObject, config)
  return response.data
}

export default { getAll, create, remove, update, like, addComment, setToken }
