import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import './StatCard.css'

export default function StatCard({ label, value, change, icon, gradient }) {
  const isPositive     = change >= 0
  const formattedValue = value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value

  return (
    <div className="stat-card card animate-fade-in">
      <div className="stat-card-top">
        <div className="stat-icon" style={{ background: gradient }}>
          {icon ? React.createElement(icon, { size: 20, color: 'white' }) : null}
        </div>
        <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div className="stat-body">
        <span className="stat-value">{formattedValue}</span>
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-bar">
        <div className="stat-bar-fill" style={{ background: gradient, width: `${Math.min(Math.abs(change) * 3, 100)}%` }} />
      </div>
    </div>
  )
}
