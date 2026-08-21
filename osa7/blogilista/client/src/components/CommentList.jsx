import { UnorderedList, ListItem } from '../styles/List.styles'
import { Paragraph } from '../styles/Page.styles'
import { Container } from '../styles/Page.styles'
const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <Container $alignX="left" $margin="0px auto">
        <Paragraph>No comments yet</Paragraph>
      </Container>
    )
  }

  return (
    <Container $alignX="left" $margin="0px auto">
      <UnorderedList>
        {comments.map((comment, index) => (
          <ListItem key={`${index}-${comment}`}>{comment}</ListItem>
        ))}
      </UnorderedList>
    </Container>
  )
}

export default CommentList
