'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Leaderboard() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id || null)
      const { data } = await supabase.from('profiles').select('*').order('total_points', { ascending: false })
      setProfiles(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const medals = ['??', '??', '??']

  if (loading) return <div style={{minHeight:'100vh',background:'#0d1117',display:'flex',alignItems:'center',justifyContent:'center',color:'#e6edf3'}}>Loading...</div>

  return (
    <div style={{minHeight:'100vh',background:'#0d1117',color:'#e6edf3'}}>
      <div style={{background:'#161b22',borderBottom:'1px solid #21262d',padding:'12px 20px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}><span>?</span><span style={{fontWeight:600}}>WC 2026 Tipovacka</span></div>
        <Link href='/dashboard' style={{color:'#58a6ff',fontSize:13,textDecoration:'none'}}>Back</Link>
      </div>
      <div style={{maxWidth:640,margin:'0 auto',padding:'20px 16px'}}>
        <h2 style={{color:'#e6edf3',fontSize:18,fontWeight:600,marginBottom:16}}>?? Standings</h2>
        <div style={{background:'#161b22',border:'1px solid #21262d',borderRadius:8,overflow:'hidden'}}>
          {profiles.map((p, i) => (
            <div key={p.id} style={{display:'grid',gridTemplateColumns:'40px 1fr 60px',gap:8,padding:'12px 14px',borderTop: i===0?'none':'1px solid #21262d',background: p.id===currentUserId?'#1a7f4b11':'transparent'}}>
              <div style={{fontSize: i<3?18:13,color:'#8b949e'}}>{i<3?medals[i]:i+1}</div>
              <div><div style={{fontWeight:500,fontSize:13,color:'#e6edf3'}}>{p.nickname}{p.id===currentUserId&&<span style={{fontSize:11,color:'#3fb950'}}> (you)</span>}</div><div style={{fontSize:11,color:'#8b949e'}}>{p.favorite_club}</div></div>
              <div style={{fontSize:14,fontWeight:600,color:'#3fb950',textAlign:'right'}}>{p.total_points}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
