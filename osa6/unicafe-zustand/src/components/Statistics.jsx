
import { useFeedback } from "../stores/feedbackStore"

const Statistics = () => {
  const feedback = useFeedback()
  
  if (feedback.all === 0) {
    return (
      <div>
        <h2>statistics</h2>
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr><td>good</td><td> {feedback.good}</td></tr>
          <tr><td>neutral</td><td> {feedback.neutral}</td></tr>
          <tr><td>bad</td><td> {feedback.bad}</td></tr>
          <tr><td>all</td><td> {feedback.all}</td></tr>
          <tr><td>average</td><td> {feedback.average}</td></tr>
          <tr><td>positive</td><td> {feedback.positive}%</td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
