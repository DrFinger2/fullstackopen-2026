import { useAnecdotes } from "../stores/anecdoteStore"
import { useAnecdoteActions } from "../stores/anecdoteStore"; 

export const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const { vote, remove} = useAnecdoteActions()

  return (
    <div>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id} data-testid="anecdote-item" data-votes={anecdote.votes}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>
              vote
            </button>
          </div>
          {anecdote.votes === 0 && (
            <button onClick={() => remove(anecdote.id)}>
              remove
            </button>
          )}
        </div>
      ))}
    </div>
  )
}