import Title from '../components/Title'
import BlogList from '../components/BlogList'

const BlogsPage = ({ user, blogState }) => {
  return (
    <div className='blog-page'>
      <section className='blog-section'>
        <Title text='Blogs' />
        <BlogList blogs={blogState.blogs} user={user} />
      </section>
    </div>
  )
}

export default BlogsPage