import { useState } from 'react'

export default function MatchCreator({ onCreated }) {
  const [teamA, setTeamA] = useState('Team A')
  const [teamB, setTeamB] = useState('Team B')
  const [cups, setCups] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const createMatch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const base = import.meta.env.VITE_BACKEND_URL
      const res = await fetch(`${base}/api/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_a: teamA, team_b: teamB, cups_per_side: Number(cups) })
      })
      if (!res.ok) throw new Error('Failed to create match')
      const data = await res.json()
      onCreated && onCreated(data.id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={createMatch} className="bg-white/70 backdrop-blur p-4 rounded-xl shadow flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <input value={teamA} onChange={e=>setTeamA(e.target.value)} placeholder="Team A" className="border rounded px-3 py-2" />
        <input value={teamB} onChange={e=>setTeamB(e.target.value)} placeholder="Team B" className="border rounded px-3 py-2" />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Cups/Side</label>
        <input type="number" min={1} max={20} value={cups} onChange={e=>setCups(e.target.value)} className="border rounded px-3 py-2 w-24" />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded px-4 py-2 font-medium">
        {loading ? 'Creating...' : 'Start Match'}
      </button>
    </form>
  )
}
