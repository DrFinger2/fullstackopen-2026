import { useAnecdoteActions } from '../stores/anecdoteStore'


export const AnecdoteForm = () => {
  const { add } = useAnecdoteActions();

  const handleSubmit = (e) => {
    e.preventDefault()

    const form = e.target
    const input = form.elements.anecdote
    add(input.value)
    form.reset()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name="anecdote"/>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}