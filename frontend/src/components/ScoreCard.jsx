import React from 'react'

export default function ScoreCard({ title = 'Score', value = '-' }) {
  return (
    <div className="score-card">
      <h3>{title}</h3>
      <div className="score-value">{value}</div>
    </div>
  )
}
