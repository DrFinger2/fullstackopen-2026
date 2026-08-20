import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'
import { useAnecdotes } from '../hooks'

/**
 * return {
    type,
    value,
    onChange
  }
 */
const CreateNew = () => {
  const { addAnecdote } = useAnecdotes();
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  

  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    addAnecdote({
      content: content.field.value,
      author: author.field.value,
      info: info.field.value,
      votes: 0
    })
    navigate('/')
  }

  const handleReset = (e) => {
    e.preventDefault()
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' {...content.field } />
        </div>
        <div>
          author
          <input name='author' {...author.field } />
        </div>
        <div>
          url for more info
          <input name='info' {...info.field } />
        </div>
        <button type="submit">create</button>
        <button onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
