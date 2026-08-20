const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  return await response.json()
}

const remove = async (id) => {
  const options = {
    method: 'DELETE'
  }
  const url = `${baseUrl}/${id}`
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error('Failed to remove note')
  }

  return response.status
}

const createNew = async (object) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(object),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create note')
  }
  
  return await response.json()
}

export default { getAll, createNew, remove }