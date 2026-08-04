const Header = (props) => {
  return (
    <h1>{props.text}</h1>
  )
}

const Part = (props) => {
  return (
    <p>{props.part.name} {props.part.exercises}</p>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part part={props.part1}> </Part>
      <Part part={props.part2}> </Part>
      <Part part={props.part3}> </Part>
    </div>
  )
}

const Total = (props) => {
  return (
    <p>Number of exercises {props.exercises}</p>
  )
}

const App = () => {
  const course      = 'Half Stack application development'
  const part1       = 'Fundamentals of React'
  const exercises1  = 10
  const part2       = 'Using props to pass data'
  const exercises2  = 7
  const part3       = 'State of a component'
  const exercises3  = 14


  return (
    <div>
      <Header text={course}/>
      <Content 
        part1 = {{ name: part1, exercises: exercises1 }}
        part2 = {{ name: part2, exercises: exercises2 }}
        part3 = {{ name: part3, exercises: exercises3 }}
      />
      <Total exercises={exercises1 + exercises2 + exercises3}/>
    </div>
  )
}

export default App