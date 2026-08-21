import { Button } from '../styles/Button.styles'

function SubmitButton({ text, loadingText, showLoading, isLoading }) {
  return (
    <Button disabled={isLoading}>
      {showLoading ? (
        <>
          {loadingText}
          <span className="dots" />
        </>
      ) : (
        text
      )}
    </Button>
  )
}

export default SubmitButton
