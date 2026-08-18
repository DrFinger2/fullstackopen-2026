
import { create } from 'zustand'

const getId = () => {
  return (100000 * Math.random()).toFixed(0)
}

const asObject = anecdote => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const anecdoteObjects = anecdotesAtStart.map(asObject)

export const useAnecdoteStore = create(set => ({
  anecdotes: structuredClone(anecdoteObjects),
  actions: {
    vote: (id) => set(state => {
      const clone = structuredClone(state.anecdotes)
      const idx = clone.findIndex(obj => obj.id === id)
      if (idx > -1) {
        clone[idx].votes++
        clone.sort((a, b) => (b.votes - a.votes))
      }
      return { anecdotes: clone }
    }),

    add: (anecdote) => set(state => {
      const clone = structuredClone(state.anecdotes)
      if(typeof anecdote == 'string'){
        clone.push(asObject(anecdote))
        clone.sort((a, b) => (b.votes - a.votes))
      }
      return { anecdotes: clone }
    })
  }
}))

export const useAnecdotes = () => useAnecdoteStore(state => (
  state.anecdotes
))

export const useAnecdoteActions = () => useAnecdoteStore(state => (
  state.actions
))
