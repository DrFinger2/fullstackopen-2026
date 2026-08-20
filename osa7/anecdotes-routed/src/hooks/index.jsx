import { useContext, useState } from 'react'
import AnecdoteContext from '../context/AnecdoteContext'


export const useField = (type) => {
  const [value, setValue] = useState('')
  const onChange = (event) => setValue(event.target.value)
  const reset = () => setValue('')
  return { field: { type, value, onChange }, reset }
}

export const useAnecdotes = () => {
  const context = useContext(AnecdoteContext)
  if (!context) {
    throw new Error('useAnecdotes must be used within an AnecdoteProvider')
  }
  return context
}