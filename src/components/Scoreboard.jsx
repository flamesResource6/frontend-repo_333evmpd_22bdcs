import { useEffect, useState } from 'react'

export default function Scoreboard({ matchId }) {
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const base = import.meta.env.VITE_BACKEND_URL

  const fetchMatch = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${base}/api/matches/${matchId}`)
      if (!res.ok) throw new Error('Failed to load match')
      const data = await res.json()
      setMatch(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (matchId) fetchMatch() }, [matchId])

  const hit = async (team, cups=1) => {
    setLoading(true)
    try {
      const res = await fetch(`${base}/api/matches/${matchId}/hit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team, cups })
      })
      if (!res.ok) throw new Error('Failed to record hit')
      await fetchMatch()
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  const reset = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${base}/api/matches/${matchId}/reset`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to reset')
      await fetchMatch()
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  if (!matchId) return null
  if (loading && !match) return <div className="text-gray-700">Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!match) return null

  const total = match.cups_per_side
  const a = match.cups_remaining_a
  const b = match.cups_remaining_b
  const status = match.status

  return (
    <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-xl w-full max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{match.team_a} vs {match.team_b}</h2>
        <span className={`px-2 py-1 rounded text-sm ${status==='finished'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>
          {status === 'finished' ? `Winner: Team ${match.winner}` : 'Ongoing'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <TeamPanel name={match.team_a} remaining={a} total={total} onHit={(c)=>hit('A', c)} disabled={status==='finished'} />
        <TeamPanel name={match.team_b} remaining={b} total={total} onHit={(c)=>hit('B', c)} disabled={status==='finished'} />
      </div>
      <div className="mt-6 flex gap-3">
        <button onClick={reset} className="px-4 py-2 rounded border hover:bg-gray-50">Reset</button>
        <button onClick={fetchMatch} className="px-4 py-2 rounded border hover:bg-gray-50">Refresh</button>
      </div>
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Event Log</h3>
        <ul className="text-sm max-h-48 overflow-auto space-y-1">
          {match.events?.slice().reverse().map((e, idx)=> (
            <li key={idx} className="text-gray-700">{new Date(e.timestamp).toLocaleTimeString()} — Team {e.team} hit {e.cups}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function TeamPanel({ name, remaining, total, onHit, disabled }) {
  const ratio = (total-remaining) / total
  return (
    <div className="p-4 rounded-xl border bg-white">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-lg">{name}</div>
        <div className="text-gray-600">Cups left: {remaining}/{total}</div>
      </div>
      <div className="h-3 bg-gray-100 rounded overflow-hidden">
        <div className="h-full bg-blue-500" style={{width: `${ratio*100}%`}} />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {[1,2,3,4].map(n=> (
          <button key={n} disabled={disabled} onClick={()=>onHit(n)} className="px-2 py-1 rounded bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700">-{n}</button>
        ))}
      </div>
    </div>
  )
}
