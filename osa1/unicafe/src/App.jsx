import { useState } from 'react'

const Button = ({text, onClick}) => (
  <button onClick={onClick}>{text}</button> 
)
const Title = ({text}) =>  (
  <h1>{text}</h1>
)
const StatisticLine = ({text, value, suffix = ''}) => (
  <tr>
    <td>{text}</td>
    <td>{value} {suffix}</td>
  </tr>
)

const Statistics = ({good, neutral, bad}) => {
  const total = good + bad + neutral;
  const average = (total === 0 ? 0 : (good - bad) / total).toFixed(1);
  const percentage = (total === 0 ? 0 : (good / total) * 100).toFixed(1);

  if(total > 0){
    return (
      <table> 
      <tbody>
          <StatisticLine text="Good: " value={good} />
          <StatisticLine text="Neutral:" value={neutral} />
          <StatisticLine text="Bad:" value={bad} />
          <StatisticLine text="All:" value={total} />
          <StatisticLine text="Average:" value={average} />
          <StatisticLine text="Positive:" value={percentage} suffix = {'%'}/>
      </tbody> 
      </table>
    )
  }
  else {
    return (
      <p>No statistics given! </p>
    )
  }
  
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const addToGood = () => (
    setGood(good + 1)
  );
  const addToNeutral = () => (
    setNeutral(neutral + 1)
  )
  const addToBad = () => (
    setBad(bad + 1)
  )

  return (
    <div>
      <Title text="give feedback" />
      <Button text="Good" onClick={addToGood} />
      <Button text="Neutral" onClick={addToNeutral} />
      <Button text="Bad" onClick={addToBad} />

      <Title text="Statistics"/>
      <Statistics good={good} neutral={neutral} bad={bad} />

    </div>
  )
}

export default App