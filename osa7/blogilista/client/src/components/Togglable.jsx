import { useState, useImperativeHandle, forwardRef } from 'react'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggle = () => setVisible(!visible)
  const close = () => setVisible(false)
  const open = () => setVisible(true)

  useImperativeHandle(ref, () => {
    return { open, close, toggle }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={open}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={close}>cancel</button>
      </div>
    </div>
  )
})

export default Togglable
