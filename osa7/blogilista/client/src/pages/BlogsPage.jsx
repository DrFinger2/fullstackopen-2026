import BlogList from '../components/BlogList'
import { Section, Container, Title } from '../styles/Page.styles'
import { useBlogs } from '../hooks/useBlogs'

function BlogsPage() {
  const blogs = useBlogs()

  return (
    <Section>
      <Container>
        <Title>Blogs</Title>
        <BlogList blogs={blogs} />
      </Container>
    </Section>
  )
}

export default BlogsPage
