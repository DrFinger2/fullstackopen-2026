import React from 'react'

function Header({ text, href }) {
  return (
    <h3 className="header">
      {href ? <a href={href}>{text}</a> : text}
    </h3>
  )
}

export default Header