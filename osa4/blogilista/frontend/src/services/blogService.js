import axios from 'axios'
const BASE_URL = '/api/blogs'

function getAll() {
    const request = axios.get(BASE_URL)
    return request.then(response => response.data);
}

function add(obj) {
    const request = axios.post(BASE_URL, obj);
    return request.then(response => response.data);
}

export default {
    getAll: getAll,
    add: add
}