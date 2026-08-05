import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.onClick}> {props.text}</button>
)

const Anecdote = (props) => (
  <p> {props.text} </p>
)

const Votes = (props) => (
  <p> Has votes: {props.count} </p>
)

const Header = (props) => (
  <h1> {props.text} </h1>
)


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState( Array(anecdotes.length).fill(0));
  const [mostVoted, setMostVoted] = useState(0);

  const onNextAnecdote = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length)) 
  }

  const onVoteClicked = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
    setMostVoted(copy.indexOf(Math.max(...copy)));
  }

  return (
    <div>
      <Header text ={"Anecdotes of the day"} />
      <Anecdote text={anecdotes[selected]} />
      <Votes count={votes[selected]}/>
      <Button text={"Vote"} onClick={onVoteClicked}/>
      <Button text={"next Quote"} onClick={onNextAnecdote}/>

      <Header text={"Anecdotes with most votes"} />
      <Anecdote text={anecdotes[mostVoted]} />
      <Votes count={votes[mostVoted]}/>
    </div>
  )
}

export default App