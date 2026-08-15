const Header = ({ text, href }) => (
  <h3 className="header">
    {href ? <a href={href}>{text}</a> : text}
  </h3>
)

export default Header