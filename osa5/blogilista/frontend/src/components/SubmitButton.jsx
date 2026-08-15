const SubmitButton = ({ text, loadingText, showLoading, isLoading }) => (
  <button disabled={isLoading}>
    {showLoading ? <>{loadingText}<span className="dots" /></> : text}
  </button>
)


export default SubmitButton
