import { describe, test, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('../services/anecdoteService', () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }
}))

import anecdoteService from '../services/anecdoteService'
import { useAnecdotes } from '../stores/anecdoteStore'
import { useAnecdoteActions } from '../stores/anecdoteStore'
import { useAnecdoteStore } from '../stores/anecdoteStore'
import { render, screen } from '@testing-library/react'
import { AnecdoteList } from '../components/AnecdoteList'



describe('useAnecdotes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAnecdoteStore.setState({
      anecdotes: [],
      filter: '',
      notification: { id: 0, content: '' }
    })
  })

  test('The state is initialized with the anecdotes returned by the backend', async () => {
    const mockAnecdotes = [
      { "content": "content a", "id": "1", "votes": 1 }
    ]

    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)
    const { result: actions } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await actions.current.init();
    })
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toEqual(mockAnecdotes)
  })

  test('renders anecdotes sorted by votes descending', async () => {
    const unsorted = [
      { content: 'content a', id: '1', votes: 1 },
      { content: 'content b', id: '2', votes: 3 },
      { content: 'content c', id: '3', votes: 2 },
    ]
    anecdoteService.getAll.mockResolvedValue(unsorted);
    const { result: actions } = renderHook(() => useAnecdoteActions());
    await act(async () => {
      await actions.current.init();
    });

    render(<AnecdoteList />)

    const items = screen.getAllByTestId('anecdote-item');
    const votes = items.map(item => Number(item.dataset.votes));

    expect(votes).toEqual([3,2,1])
  })
})