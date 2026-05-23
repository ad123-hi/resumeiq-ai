import React from 'react'
import Navbar from '../components/Navbar'
import ScoreCard from '../components/ScoreCard'

export default function Results() {
  return (
    <div>
      <Navbar />
      <main className="results container">
        <h2>Results</h2>
        <ScoreCard title="Match" value="--" />
      </main>
    </div>
  )
}
