import Title from '../components/Title'
import BlogList from '../components/BlogList'

function BlogsPage({ blogState }) {
  return (
    <div className="blog-page">
      <section className="blog-section">
        <Title text="Blogs" />
        <BlogList blogs={blogState.blogs} />
      </section>
    </div>
  )
}

export default BlogsPage