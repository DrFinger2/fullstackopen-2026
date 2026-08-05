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

const Course = (props) => {
  const parts = props.course.parts
  return (
    <div>
      { parts.map(part => <Part key={part.id} part={part}/>) }
      <Total parts={parts}/>
    </div>
  );
}

export default Course