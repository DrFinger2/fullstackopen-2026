import BlogList from '../components/BlogList'
import { Section, Container, Title } from '../styles/Page.styles'

function BlogsPage({ blogState }) {
  return (
    <Section>
      <Container >
        <Title>Blogs</Title>
        <BlogList blogs={blogState.blogs} />
      </Container>
    </Section>
  )
}

export default BlogsPage