import { useAnecdoteActions } from "../stores/anecdoteStore"

const Filter = () => {
  const { filter } = useAnecdoteActions()

  const handleChange = (e) => {
    const value = e.target.value
    filter(value);
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter