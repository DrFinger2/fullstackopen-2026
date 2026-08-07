const Header = ({text}) => {
  return (
    <h1>{text}</h1>
  )
}

const Part = (props) => {
  return (
    <p>{props.part.name} {props.part.exercises}</p>
  )
}

const Total = ({parts}) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <h4>Number of exercises: {total}</h4>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header text={course.name} />
      {course.parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
      <Total parts={course.parts} />
    </div>
  )
}

export default Course