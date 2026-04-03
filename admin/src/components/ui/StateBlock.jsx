import React from 'react'

export default function StateBlock({
  loading = false,
  error = '',
  empty = false,
  emptyText = 'No data found.',
  onRetry,
}) {
  if (loading) {
    return (
      <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ width: 28, height: 28, margin: '0 auto 10px', border: '3px solid var(--border)', borderTopColor: 'var(--red)', borderRadius: '50%' }} className="spin" />
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="card" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ marginBottom: 12, color: 'var(--red)' }}>{error}</p>
        {onRetry && (
          <button className="btn btn-sm btn-primary" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    )
  }

  if (empty) {
    return (
      <div className="card" style={{ padding: 28, textAlign: 'center', color: 'var(--text-muted)' }}>
        {emptyText}
      </div>
    )
  }

  return null
}
