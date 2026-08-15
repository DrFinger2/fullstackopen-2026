import { useState, useEffect } from 'react'

const Loader = ({ isLoading }) => {
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setShowLoading(false)
      return
    }

    const timer = setTimeout(() => {
      setShowLoading(true)
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [isLoading])

  const className = `loader ${showLoading ? 'show' : ''}`

  return <div className={className}></div>
}


export default Loader