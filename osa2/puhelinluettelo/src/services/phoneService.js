import axios from 'axios'

const BASE_URL = "/api/persons"

const getAll = () => 
{
    const request = axios.get(BASE_URL);
    return request.then(response=>(response.data))
}

const create = (object) => 
{
    const request = axios.post(BASE_URL, object);
    return request.then(response=>(response.data))
}

const update = (id, object) =>
{
    const url = `${BASE_URL}/${id}`
    const request = axios.put(url, object);
    return request.then(response=>(response.data))
}

const remove = (id) => 
{
    const url = `${BASE_URL}/${id}`
    const request = axios.delete(url);
    return request.then(response=>(response.data))
}

export default {
    getAll,
    create,
    remove,
    update
}
