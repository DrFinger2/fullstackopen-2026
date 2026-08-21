import React from 'react'
import { Button } from '../styles/Button.styles'
import { Paragraph, H2, Container, Wrapper } from '../styles/Page.styles'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  handleReset() {
    const { onReset } = this.props
    this.setState({ hasError: false, error: null })
    onReset?.()
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container>
          <H2>Something went wrong.</H2>
          <Wrapper>
            <Paragraph>{this.state.error.message}</Paragraph>
          </Wrapper>
          <Button onClick={this.handleReset.bind(this)}>
            Try Again
          </Button>
        </Container>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
