function SubmitButton({ text, loadingText, showLoading, isLoading }) {
  return (
    <button disabled={isLoading}>
      {showLoading ? (
        <>{loadingText}<span className="dots"/></>
      )
        : text
      }
    </button>
  )
}

export default SubmitButton