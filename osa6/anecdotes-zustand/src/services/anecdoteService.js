const BASE_URL = 'http://localhost:3001/anecdotes'

const HEADERS = { 'Content-Type': 'application/json' }

async function getAll() {
    const options = {
        method: 'GET',
        headers: HEADERS
    }
    const response = await fetch(BASE_URL, options)
    if (!response.ok) {
        throw new Error('GET request failed!');
    }
    return await response.json()
} 

async function create(content) {
    const options = {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(content)
    }
    const response = await fetch(BASE_URL, options)
    if (!response.ok) {
        throw new Error("POST request failed!")
    }

    return await response.json();
}

async function update(id, content) {
    const options = {
        method: 'PUT',
        headers: HEADERS,
        body: JSON.stringify(content)
    }
    const response = await fetch(`${BASE_URL}/${id}`, options)
    if (!response.ok) {
        throw new Error("PUT request failed!")
    }

    return await response.json();
}

async function remove(id) {
    const options = {
        method: 'DELETE',
        headers: HEADERS
    }
    const response = await fetch(`${BASE_URL}/${id}`, options)
    if (!response.ok) {
        throw new Error("DELETE request failed!")
    }

    return await response.json();
}

export default {getAll, create, update, remove}