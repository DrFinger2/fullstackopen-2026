import { useField } from '../hooks/useField'
import { Form, Input } from '../styles/Form.styles'
import { ActionButton, Button } from '../styles/Button.styles'
import { Wrapper } from '../styles/Page.styles'
const CommentForm = ({ blogId, user, onSubmit }) => {
  const comment = useField('text')

  if (!user) {
    return <Paragraph>Log in to leave a comment</Paragraph>
  }

  return (
    <Form onSubmit={() => onSubmit(blogId, comment.field.value)}>
      <Wrapper $direction="row" $gap="5px">
        <Input placeholder="Write a comment" {...comment.field} />
        <Button type="submit">Add comment</Button>
      </Wrapper>
    </Form>
  )
}

export default CommentForm
