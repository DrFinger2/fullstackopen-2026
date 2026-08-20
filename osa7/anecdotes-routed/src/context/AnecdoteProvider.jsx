import {useState, useEffect } from 'react'
import AnecdoteContext from './AnecdoteContext'
import anecdoteService from '../services/anecdotes'

export const AnecdoteProvider = ({ children }) => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const results = await anecdoteService.getAll()
      setAnecdotes(results)
    }
    fetchData()
  }, [])

  const addAnecdote = async (anecdote) => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    setAnecdotes(anecdotes.concat(newAnecdote))
  }

  const deleteAnecdote = async (id) => {
    await anecdoteService.remove(id)
    setAnecdotes(anecdotes.filter(anecdote => anecdote.id !== id))
  }

  const value = { anecdotes, addAnecdote, deleteAnecdote }
  return (
    <AnecdoteContext.Provider value={value}>
      {children}
    </AnecdoteContext.Provider>
  )
}
