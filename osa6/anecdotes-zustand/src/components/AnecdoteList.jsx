import { useAnecdotes } from "../stores/anecdoteStore"
import { useAnecdoteActions } from "../stores/anecdoteStore"; 

export const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const { vote } = useAnecdoteActions()

  return (
    <div>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}