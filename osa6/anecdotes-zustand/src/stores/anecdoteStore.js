
import { create } from 'zustand'

import anecdoteService from '../services/anecdoteService'


export const useAnecdoteStore = create(set => ({
  anecdotes: [],
  filter: '',
  
  notification: {id: 0, content: ''},

  actions: {
    init: async () => {
      const data = await anecdoteService.getAll();
      data.sort((a, b) => (b.votes - a.votes))
      return set(() => ({ anecdotes: data }))
    },

    vote: async (id) => {
      const state = useAnecdoteStore.getState()
      const clone = structuredClone(state.anecdotes)
      const idx = clone.findIndex(obj => obj.id === id)

      if (idx > -1) {
        const anecdote = clone[idx]
        const notification = state.notification;

        anecdote.votes += 1
        await anecdoteService.update(id, anecdote)
        clone.sort((a, b) => (b.votes - a.votes))

        return set(() => ({
          anecdotes: clone,
          notification: {id: notification.id + 1, content: `You voted for: "${anecdote.content}"`}
        }))
      }
    },

    add: async (anecdote) => {
      const state = useAnecdoteStore.getState();
      const clone = structuredClone(state.anecdotes);

      if (typeof anecdote === 'string') {
        const newAnecdote = { content: anecdote, votes: 0 };
        const notification = state.notification;
        const created = await anecdoteService.create(newAnecdote);

        clone.push(created);
        clone.sort((a, b) => b.votes - a.votes);
        set({
          anecdotes: clone,
          notification: { id: notification.id + 1, content: `You added: "${created.content}"` }
        });
      }
    },

    remove: async (id) => {
      const state = useAnecdoteStore.getState()
      const idx = state.anecdotes.findIndex(a => a.id === id)
      
      if (idx > -1 && state.anecdotes[idx].votes === 0) {
        await anecdoteService.remove(id)
        const removed = state.anecdotes[idx];
        const notification = state.notification;
        const clone = structuredClone(state.anecdotes)

        clone.splice(idx, 1)
        clone.sort((a, b) => b.votes - a.votes)

        set(() => ({
          anecdotes: clone,
          notification: {id: notification.id + 1, content: `You removed: "${removed.content}"`}
        }))
      }
    },

    filter: (filter) => {
      return set({ filter: filter })
    }
  }
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)

  return anecdotes.filter(anecdote => {
    return anecdote.content.toLowerCase().includes(filter.toLowerCase())
  })
}

export const useAnecdoteActions = () => useAnecdoteStore(state => (
  state.actions
))

export const useNotification = () => useAnecdoteStore(state => (
  state.notification
))
