'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

function calcPoints(hp: number, ap: number, hr: number, ar: number): number {
  if (hp === hr && ap === ar) return 10
  const pd = hp - ap, rd = hr - ar
  const pt = hp + ap, rt = hr + ar
  const pw = Math.sign(pd), rw = Math.sign(rd)
  if (pw === rw) { if (pd === rd) return 6; if (pt === rt) return 6; return 4 }
  if (pt === rt) return 2
  return 0
}

export default function AdminPage() {
  const [log, setLog] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  function addLog(msg: string) {
    setLog(prev => [...prev, msg])
  }

  async function fetchAndUpdate() {
    setLoading(true)
    setLog([])
    try {
      addLog('📡 Fetching Champions League results...')
      const res = await fetch(`/api/football?competition=2001`)
      const data = await res.json()
      if (!data.matches) { addLog('❌ No matches returned from API'); setLoading(false); return }
      const finished = data.matches.filter((m: any) => m.status === 'FINISHED')
      addLog(`✅ Found ${finished.length} finished matches`)
      for (const m of finished) {
        await supabase.from('matches').upsert({
          id: String(m.id), competition: 'Champions League',
          home_team: m.homeTeam.name, away_team: m.awayTeam.name,
          home_score: m.score.fullTime.home, away_score: m.score.fullTime.away,
          kickoff: m.utcDate, round: m.stage, group_name: 'Champions League', status: m.status,
        }, { onConflict: 'id' })
      }
      addLog(`💾 Saved ${finished.length} matches to database`)
      const matchIds = finished.map((m: any) => String(m.id))
      const { data: preds } = await supabase.from('predictions').select('*').in('match_id', matchIds)
      addLog(`🎯 Found ${preds?.length || 0} predictions to score`)
      const userPoints: Record<string, number> = {}
      for (const pred of preds || []) {
        const match = finished.find((m: any) => String(m.id) === pred.match_id)
        if (!match) continue
        const pts = calcPoints(pred.home_pred, pred.away_pred, match.score.fullTime.home, match.score.fullTime.away)
        await supabase.from('predictions').update({ points: pts }).eq('user_id', pred.user_id).eq('match_id', pred.match_id)
        userPoints[pred.user_id] = (userPoints[pred.user_id] || 0) + pts
      }
      for (const [userId, pts] of Object.entries(userPoints)) {
        const { data: profile } = await supabase.from('profiles').select('total_points').eq('id', userId).single()
        await supabase.from('profiles').update({ total_points: (profile?.total_points || 0) + pts }).eq('id', userId)
      }
      addLog(`🏆 Updated leaderboard for ${Object.keys(userPoints).length} users`)
      addLog('✅ All done!')
    } catch (err: any) {
      addLog(`❌ Error: ${err.message}`)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1923', color: '#fff', padding: 32, fontFamily: 'monospace' }}>
      <h1 style={{ color: '#3b82f6', marginBottom: 24 }}>⚙️ Admin Panel</h1>
      <button onClick={fetchAndUpdate} disabled={loading}
        style={{ background: '#3b82f6', border: 'none', borderRadius: 8, color: '#fff', padding: '12px 24px', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 24 }}>
        {loading ? '⏳ Updating...' : '🔄 Fetch Results & Update Points'}
      </button>
      <div style={{ background: '#1a2634', borderRadius: 8, padding: 16, minHeight: 200 }}>
        {log.length === 0 && <p style={{ color: '#8a9bb0' }}>Press the button to sync results...</p>}
        {log.map((line, i) => <div key={i} style={{ marginBottom: 6, fontSize: 14 }}>{line}</div>)}
      </div>
    </div>
  )
}