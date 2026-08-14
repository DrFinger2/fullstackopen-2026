const Notification = ({ error, success }) => {
  if (!error && !success) return null

  return (
    <div className="notification-container">
      <p className={`error ${error ? 'show' : ''}`}>
        {error}
      </p>
      {success && (
        <p className="success-msg" style={{ color: 'green', fontSize: '14px', marginTop: '8px' }}>
          {success}
        </p>
      )}
    </div>
  )
}

export default Notification