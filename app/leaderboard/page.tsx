'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const competitions = [
  { key: 'overall', label: '🏅 Overall', color: '#f59e0b' },
  { key: 'Champions League', label: '🏆 Champions League', color: '#3b82f6' },
  { key: 'Europa League', label: '🥈 Europa League', color: '#f97316' },
  { key: 'Conference League', label: '🥉 Conference League', color: '#22c55e' },
  { key: 'worldcup', label: '🌍 World Cup', color: '#10b981' },
]

export default function Leaderboard() {
  const [active, setActive] = useState('overall')
  const [standings, setStandings] = useState<any[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id || null)
      await fetchStandings(active)
    }
    load()
  }, [])

  async function fetchStandings(comp: string) {
    setLoading(true)
    if (comp === 'overall') {
      const { data } = await supabase.from('profiles').select('*').order('total_points', { ascending: false })
      setStandings(data || [])
    } else {
      // Get points per user for this specific competition
      const { data: preds } = await supabase.from('predictions')
        .select('user_id, points, matches(competition)')
        .eq('matches.competition', comp)
      
      // Group by user
      const userMap: Record<string, number> = {}
      preds?.forEach((p: any) => {
        if (p.matches?.competition === comp) {
          userMap[p.user_id] = (userMap[p.user_id] || 0) + (p.points || 0)
        }
      })

      // Get profiles
      const userIds = Object.keys(userMap)
      if (userIds.length === 0) { setStandings([]); setLoading(false); return }
      const { data: profiles } = await supabase.from('profiles').select('*').in('id', userIds)
      const result = (profiles || []).map(p => ({
        ...p,
        comp_points: userMap[p.id] || 0
      })).sort((a, b) => b.comp_points - a.comp_points)
      setStandings(result)
    }
    setLoading(false)
  }

  async function handleTab(key: string) {
    setActive(key)
    await fetchStandings(key)
  }

  const medals = ['🥇', '🥈', '🥉']
  const activeComp = competitions.find(c => c.key === active)!

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3' }}>
      {/* Header */}
      <div style={{ background: '#161b22', borderBottom: '1px solid #21262d', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🏆</span>
          <span style={{ fontWeight: 600 }}>Leaderboard</span>
        </div>
        <Link href='/select' style={{ color: '#58a6ff', fontSize: 13, textDecoration: 'none' }}>← Back</Link>
      </div>

      {/* Competition Tabs */}
      <div style={{ background: '#161b22', borderBottom: '2px solid #21262d', overflowX: 'auto', display: 'flex' }}>
        {competitions.map(c => (
          <button key={c.key} onClick={() => handleTab(c.key)}
            style={{
              padding: '12px 16px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              background: 'transparent', fontSize: 12, fontWeight: 600,
              color: active === c.key ? c.color : '#8b949e',
              borderBottom: active === c.key ? `2px solid ${c.color}` : '2px solid transparent',
              marginBottom: -2,
            }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Standings */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 16px' }}>
        <h2 style={{ color: activeComp.color, fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
          {activeComp.label} Standings
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#8b949e' }}>Loading...</div>
        ) : standings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#8b949e' }}>
            No predictions yet for this competition.
          </div>
        ) : (
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, overflow: 'hidden' }}>
            {standings.map((p, i) => (
              <div key={p.id} style={{
                display: 'grid', gridTemplateColumns: '40px 1fr 60px', gap: 8,
                padding: '12px 14px', borderTop: i === 0 ? 'none' : '1px solid #21262d',
                background: p.id === currentUserId ? '#1a7f4b11' : 'transparent'
              }}>
                <div style={{ fontSize: i < 3 ? 18 : 13, color: '#8b949e' }}>
                  {i < 3 ? medals[i] : i + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13, color: '#e6edf3' }}>
                    {p.nickname}
                    {p.id === currentUserId && <span style={{ fontSize: 11, color: '#3fb950' }}> (you)</span>}
                  </div>
                  <div style={{ fontSize: 11, color: '#8b949e' }}>{p.favorite_club}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: activeComp.color, textAlign: 'right' }}>
                  {active === 'overall' ? p.total_points : p.comp_points}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}