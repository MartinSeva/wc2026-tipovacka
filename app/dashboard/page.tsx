'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function getFlag(team: string): string {
  const flags: Record<string, string> = {
    'Mexico':'🇲🇽','South Africa':'🇿🇦','South Korea':'🇰🇷','Czech Republic':'🇨🇿',
    'Canada':'🇨🇦','Bosnia & Herz.':'🇧🇦','Qatar':'🇶🇦','Switzerland':'🇨🇭',
    'Brazil':'🇧🇷','Morocco':'🇲🇦','Haiti':'🇭🇹','Scotland':'🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'USA':'🇺🇸','Paraguay':'🇵🇾','Australia':'🇦🇺','Turkiye':'🇹🇷',
    'Germany':'🇩🇪','Curacao':'🇨🇼','Ivory Coast':'🇨🇮','Ecuador':'🇪🇨',
    'Netherlands':'🇳🇱','Japan':'🇯🇵','Sweden':'🇸🇪','Tunisia':'🇹🇳',
    'Belgium':'🇧🇪','Egypt':'🇪🇬','Iran':'🇮🇷','New Zealand':'🇳🇿',
    'Spain':'🇪🇸','Cape Verde':'🇨🇻','Saudi Arabia':'🇸🇦','Uruguay':'🇺🇾',
    'France':'🇫🇷','Senegal':'🇸🇳','Iraq':'🇮🇶','Norway':'🇳🇴',
    'Argentina':'🇦🇷','Algeria':'🇩🇿','Austria':'🇦🇹','Jordan':'🇯🇴',
    'Portugal':'🇵🇹','DR Congo':'🇨🇩','Uzbekistan':'🇺🇿','Colombia':'🇨🇴',
    'England':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','Croatia':'🇭🇷','Ghana':'🇬🇭','Panama':'🇵🇦',
  }
  return flags[team] || '🏳️'
}

function calcPoints(hp: number, ap: number, hr: number, ar: number): number {
  if (hp === hr && ap === ar) return 10
  const pd = hp - ap, rd = hr - ar
  const pt = hp + ap, rt = hr + ar
  const pw = Math.sign(pd), rw = Math.sign(rd)
  if (pw === rw) { if (pd === rd) return 6; if (pt === rt) return 6; return 4 }
  if (pt === rt) return 2
  return 0
}

export default function Dashboard() {
  const [matches, setMatches] = useState<any[]>([])
  const [predictions, setPredictions] = useState<Record<string, any>>({})
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [activeRound, setActiveRound] = useState(0)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
      const { data: matchData } = await supabase.from('matches').select('*')
        .eq('competition', 'worldcup').order('kickoff')
      setMatches(matchData || [])
      const { data: predData } = await supabase.from('predictions').select('*').eq('user_id', user.id)
      const predMap: Record<string, any> = {}
      predData?.forEach(p => { predMap[p.match_id] = p })
      setPredictions(predMap)
      setLoading(false)
    }
    load()
  }, [])

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

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const groupStageMatches = matches.filter(m => m.round === 'Group Stage')
  const knockoutMatches = matches.filter(m => m.round !== 'Group Stage')
  const days = [...new Set(groupStageMatches.map(m => m.kickoff.slice(0, 10)))].sort()
  const knockoutStages = ['Round of 32', 'Round of 16', 'Quarter-final', 'Semi-final', 'Third Place', 'Final']
    .filter(s => knockoutMatches.some(m => m.round === s))

  const allRounds = [
    ...days.map((d, i) => ({ label: `Round ${i + 1}`, key: d, type: 'group' })),
    ...knockoutStages.map(s => ({ label: s, key: s, type: 'knockout' }))
  ]

  const currentRound = allRounds[activeRound]
  const currentMatches = currentRound?.type === 'group'
    ? groupStageMatches.filter(m => m.kickoff.slice(0, 10) === currentRound.key)
    : knockoutMatches.filter(m => m.round === currentRound?.key)

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0f1923', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading...</div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0f1923', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: '#1a2634', borderBottom: '1px solid #2a3a4a', padding: '0 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/select" style={{ color: '#8a9bb0', fontSize: 13, textDecoration: 'none' }}>← Zpět</Link>
            <span style={{ color: '#2a3a4a' }}>|</span>
            <span style={{ fontSize: 16, fontWeight: 700 }}>⚽ FIFA World Cup 2026</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/leaderboard" style={{ color: '#00b4ff', fontSize: 13, textDecoration: 'none' }}>🏆 Žebříček</Link>
            <span style={{ color: '#8a9bb0', fontSize: 13 }}>{profile?.nickname}</span>
            <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #2a3a4a', borderRadius: 4, color: '#8a9bb0', padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>Odhlásit</button>
          </div>
        </div>
      </div>

      <div style={{ background: '#1a2634', borderBottom: '2px solid #2a3a4a' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', overflowX: 'auto' }}>
          {allRounds.map((round, i) => (
            <button key={i} onClick={() => setActiveRound(i)}
              style={{
                padding: '14px 16px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                background: 'transparent', fontSize: 12, fontWeight: 600,
                color: activeRound === i ? '#10b981' : '#8a9bb0',
                borderBottom: activeRound === i ? '2px solid #10b981' : '2px solid transparent',
                marginBottom: -2,
              }}>
              {round.label}
              {round.type === 'group' && (
                <span style={{ marginLeft: 4, fontSize: 10, color: activeRound === i ? '#10b981' : '#4a5a6a' }}>
                  {new Date(round.key + 'T12:00:00').toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' })}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
        {currentMatches.map(match => {
          const locked = isLocked(match.kickoff)
          const pred = predictions[match.id]
          const hasResult = match.home_score !== null && match.away_score !== null
          const pts = pred && hasResult ? calcPoints(pred.home_pred, pred.away_pred, match.home_score, match.away_score) : null
          return <MatchCard key={match.id} match={match} pred={pred} locked={locked}
            saving={saving === match.id} pts={pts}
            onSave={(h: number, a: number) => savePrediction(match.id, h, a)} />
        })}
        {currentMatches.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#8a9bb0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
            <p>Žádné zápasy v tomto kole.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function MatchCard({ match, pred, locked, saving, pts, onSave }: any) {
  const [home, setHome] = useState<string | number>(pred?.home_pred ?? '')
  const [away, setAway] = useState<string | number>(pred?.away_pred ?? '')

  useEffect(() => {
    if (pred) { setHome(pred.home_pred); setAway(pred.away_pred) }
  }, [pred])

  const kickoffDate = new Date(match.kickoff)
  const hasResult = match.home_score !== null && match.away_score !== null

  return (
    <div style={{
      background: '#1a2634', border: '1px solid #2a3a4a', borderRadius: 6,
      marginBottom: 4, padding: '12px 16px',
      borderLeft: pts === 10 ? '3px solid #00c853' : pts !== null && pts > 0 ? '3px solid #ff9800' : pts === 0 ? '3px solid #f44336' : '3px solid transparent'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: '#8a9bb0' }}>
          {kickoffDate.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })} CET
        </span>
        {match.group_name && (
          <span style={{ fontSize: 11, color: '#4a6a8a', background: '#0f1923', padding: '1px 6px', borderRadius: 3 }}>
            {match.group_name}
          </span>
        )}
        <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 3, background: locked ? '#f4433622' : '#00c85322', color: locked ? '#f44336' : '#00c853' }}>
          {locked ? 'Uzavřeno' : 'Otevřeno'}
        </span>
        {pts !== null && (
          <span style={{ marginLeft: 'auto', fontWeight: 700, fontSize: 13, color: pts === 10 ? '#00c853' : pts > 0 ? '#ff9800' : '#f44336' }}>
            +{pts} b.
          </span>
        )}
        {hasResult && (
          <span style={{ fontSize: 12, color: '#8a9bb0' }}>
            Výsledek: <strong style={{ color: '#fff' }}>{match.home_score}:{match.away_score}</strong>
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>{getFlag(match.home_team)}</span>
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
          <span style={{ fontSize: 22 }}>{getFlag(match.away_team)}</span>
        </div>
      </div>
      {saving && <p style={{ fontSize: 11, color: '#00c853', marginTop: 6, textAlign: 'center' }}>Uloženo ✓</p>}
    </div>
  )
}