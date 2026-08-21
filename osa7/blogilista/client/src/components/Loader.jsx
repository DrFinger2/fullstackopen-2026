import { useState, useEffect } from 'react'
import { useBlogsLoading } from '../hooks/useBlogs'

function Loader() {
  const isLoading = useBlogsLoading()
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setShouldShow(false)
      return
    }

    const timer = setTimeout(() => {
      setShouldShow(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [isLoading])

  const loaderClass = `loader ${shouldShow ? 'show' : ''}`

  return <div className={loaderClass}></div>
}

export default Loader
