
import { useEffect } from 'react'
import { AnecdoteForm } from './components/AnecdoteForm'
import { AnecdoteList } from './components/AnecdoteList'
import { useAnecdoteActions } from './stores/anecdoteStore'
import Notification from './components/Notification'
import Filter from './components/Filter'


const App = () => {
  const { init } = useAnecdoteActions()

  useEffect(() => {
    init()
  }, [init])
  
  return (
    <div>
      <Notification />
      <h2>Anecdotes</h2>
      
      <Filter />
      <AnecdoteList/>
      <AnecdoteForm/>
    </div>
  )
}

export default App