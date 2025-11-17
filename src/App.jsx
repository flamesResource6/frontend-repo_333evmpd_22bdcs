import { useState } from 'react'
import MatchCreator from './components/MatchCreator'
import Scoreboard from './components/Scoreboard'

function App() {
  const [currentMatchId, setCurrentMatchId] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-emerald-50 p-6">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-8">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">Beer Pong Buddy</h1>
          <p className="text-gray-600 mt-2">Create a match and keep score with your friends</p>
        </header>

        <MatchCreator onCreated={setCurrentMatchId} />

        <Scoreboard matchId={currentMatchId} />

        <section className="text-center text-sm text-gray-500 mt-8">
          <p>Tip: Share the URL of your scoreboard by copying the Match ID once created.</p>
          {currentMatchId && (
            <div className="mt-2 p-2 rounded bg-white/70 border text-gray-700">Match ID: {currentMatchId}</div>
          )}
        </section>
      </div>
    </div>
  )
}

export default App
