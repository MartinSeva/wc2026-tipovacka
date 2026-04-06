'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function LeagueContent() {
  const [matches, setMatches] = useState<any[]>([])
  const [predictions, setPredictions] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [activeRound, setActiveRound] = useState('Quarter-final')
  const router = useRouter()
  const searchParams = useSearchParams()
  const competition = searchParams.get('competition') || 'Champions League'

  const competitionConfig: Record<string, { icon: string; color: string; final: string }> = {
    'Champions League': { icon: '🏆', color: '#3b82f6', final: 'Budapest · 30 May' },
    'Europa League': { icon: '🥈', color: '#f97316', final: 'Istanbul · 20 May' },
    'Conference League': { icon: '🥉', color: '#22c55e', final: 'Leipzig · 27 May' },
  }

  const config = competitionConfig[competition] || competitionConfig['Champions League']

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: matchData } = await supabase.from('matches').select('*')
        .eq('group_name', competition).order('kickoff')
      setMatches(matchData || [])
      const { data: predData } = await supabase.from('predictions').select('*').eq('user_id', user.id)
      const predMap: Record<string, any> = {}
      predData?.forEach(p => { predMap[p.match_id] = p })
      setPredictions(predMap)
      setLoading(false)
    }
    load()
  }, [competition])

  function isLocked(kickoff: string) {
    return new Date(kickoff).getTime() - Date.now() < 60 * 60 * 1000
  }

  async function savePrediction(matchId: string, home: number, away: number) {
    setSaving(matchId)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('predictions').upsert({
      user_id: user.id, match_id: matchId, home_pred: home, away_pred: away
    }, { onConflict: 'user_id,match_id' })
    setPredictions(prev => ({ ...prev, [matchId]: { match_id: matchId, home_pred: home, away_pred: away } }))
    setSaving(null)
  }

  const rounds = ['Quarter-final', 'Round of 16', 'Semi-final', 'Final', 'Group Stage']
  const roundLabels: Record<string, string> = {
    'Quarter-final': 'QF 1st Leg',
    'Round of 16': 'QF 2nd Leg',
    'Semi-final': 'Semi-finals',
    'Final': 'SF 2nd Legs',
    'Group Stage': 'Final',
  }

  const currentMatches = matches.filter(m => m.round === activeRound)

  if (loading) return <div style={{ minHeight: '100vh', background: '#0f1923', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#0f1923', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1a2634', borderBottom: '1px solid #2a3a4a', padding: '0 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/select" style={{ color: '#8a9bb0', fontSize: 13, textDecoration: 'none' }}>← Zpět</Link>
            <span style={{ color: '#2a3a4a' }}>|</span>
            <span style={{ fontSize: 18 }}>{config.icon}</span>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{competition}</span>
            <span style={{ fontSize: 12, color: '#8a9bb0', background: '#0f1923', padding: '2px 8px', borderRadius: 4 }}>
              Final: {config.final}
            </span>
          </div>
          <Link href="/leaderboard" style={{ color: '#00b4ff', fontSize: 13, textDecoration: 'none' }}>🏆 Žebříček</Link>
        </div>
      </div>

      {/* Round tabs */}
      <div style={{ background: '#1a2634', borderBottom: '2px solid #2a3a4a' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex' }}>
          {rounds.map(round => {
            const count = matches.filter(m => m.round === round).length
            if (count === 0) return null
            return (
              <button key={round} onClick={() => setActiveRound(round)}
                style={{
                  padding: '14px 20px', border: 'none', cursor: 'pointer',
                  background: 'transparent', fontSize: 13, fontWeight: 600,
                  color: activeRound === round ? config.color : '#8a9bb0',
                  borderBottom: activeRound === round ? `2px solid ${config.color}` : '2px solid transparent',
                  marginBottom: -2, transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}>
                {roundLabels[round]}
                <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.6 }}>({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Matches */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
        {currentMatches.map(match => {
          const locked = isLocked(match.kickoff)
          const pred = predictions[match.id]
          return <MatchRow key={match.id} match={match} pred={pred} locked={locked}
            saving={saving === match.id} accentColor={config.color}
            onSave={(h: number, a: number) => savePrediction(match.id, h, a)} />
        })}
        {currentMatches.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#8a9bb0' }}>Žádné zápasy v tomto kole.</div>
        )}
      </div>
    </div>
  )
}

function MatchRow({ match, pred, locked, saving, accentColor, onSave }: any) {
  const [home, setHome] = useState<string | number>(pred?.home_pred ?? '')
  const [away, setAway] = useState<string | number>(pred?.away_pred ?? '')

  useEffect(() => {
    if (pred) { setHome(pred.home_pred); setAway(pred.away_pred) }
  }, [pred])

  const kickoffDate = new Date(match.kickoff)

  return (
    <div style={{ background: '#1a2634', border: '1px solid #2a3a4a', borderRadius: 6, marginBottom: 4, padding: '12px 16px', borderLeft: `3px solid ${pred ? accentColor : 'transparent'}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: '#8a9bb0' }}>
          {kickoffDate.toLocaleDateString('cs-CZ')} · {kickoffDate.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })} CET
        </span>
        <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 3, background: locked ? '#f4433622' : '#00c85322', color: locked ? '#f44336' : '#00c853' }}>
          {locked ? 'Uzavřeno' : 'Otevřeno'}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>{match.home_flag}</span>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{match.home_team}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="number" min={0} max={20} value={home} disabled={locked}
            onChange={e => setHome(e.target.value)}
            onBlur={() => { if (!locked && home !== '' && away !== '') onSave(parseInt(String(home)), parseInt(String(away))) }}
            style={{ width: 44, height: 40, textAlign: 'center', background: locked ? '#0f1923' : '#0d2137', border: '1px solid #2a4a6a', borderRadius: 4, color: locked ? '#4a5a6a' : '#fff', fontSize: 18, fontWeight: 700 }} />
          <span style={{ color: '#4a5a6a', fontSize: 20, fontWeight: 700 }}>:</span>
          <input type="number" min={0} max={20} value={away} disabled={locked}
            onChange={e => setAway(e.target.value)}
            onBlur={() => { if (!locked && home !== '' && away !== '') onSave(parseInt(String(home)), parseInt(String(away))) }}
            style={{ width: 44, height: 40, textAlign: 'center', background: locked ? '#0f1923' : '#0d2137', border: '1px solid #2a4a6a', borderRadius: 4, color: locked ? '#4a5a6a' : '#fff', fontSize: 18, fontWeight: 700 }} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{match.away_team}</span>
          <span style={{ fontSize: 22 }}>{match.away_flag}</span>
        </div>
      </div>
      {saving && <p style={{ fontSize: 11, color: '#00c853', marginTop: 6, textAlign: 'center' }}>Uloženo ✓</p>}
    </div>
  )
}

export default function LeaguePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f1923', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading...</div>}>
      <LeagueContent />
    </Suspense>
  )
}