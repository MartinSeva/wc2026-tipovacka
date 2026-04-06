'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TournamentSelect() {
  const [hovered, setHovered] = useState<string | null>(null)
  const router = useRouter()

  const tournaments = [
    { id:'wc', route:'/dashboard', badge:'LIVE SOON', badgeColor:'#10b981', icon:'⚽', iconBg:'linear-gradient(135deg,#065f46,#10b981)', title:'FIFA World Cup 2026', subtitle:'USA, Canada, Mexico', s1:'48', s2:'104', s3:'12', l1:'Teams', l2:'Matches', l3:'Groups', dates:'11 Jun – 19 Jul 2026', accent:'#10b981', disabled:false },
    { id:'nhl', route:'/nhl', badge:'COMING SOON', badgeColor:'#6b7280', icon:'🏒', iconBg:'linear-gradient(135deg,#1e3a5f,#3b82f6)', title:'NHL Playoffs', subtitle:'2026 · Stanley Cup', s1:'16', s2:'4', s3:'105', l1:'Teams', l2:'Rounds', l3:'Games', dates:'April – June 2026', accent:'#3b82f6', disabled:true },
    { id:'ucl', route:'/league?competition=Champions League', badge:'LIVE NOW', badgeColor:'#f59e0b', icon:'🏆', iconBg:'linear-gradient(135deg,#1e3a5f,#3b82f6)', title:'Champions League', subtitle:'2025/26 · Quarter-finals', s1:'8', s2:'QF', s3:'May 30', l1:'Teams', l2:'Round', l3:'Final', dates:'Budapest · 30 May 2026', accent:'#3b82f6', disabled:false },
    { id:'uel', route:'/league?competition=Europa League', badge:'LIVE NOW', badgeColor:'#f59e0b', icon:'🥈', iconBg:'linear-gradient(135deg,#7c2d12,#f97316)', title:'Europa League', subtitle:'2025/26 · Quarter-finals', s1:'8', s2:'QF', s3:'May 20', l1:'Teams', l2:'Round', l3:'Final', dates:'Istanbul · 20 May 2026', accent:'#f97316', disabled:false },
    { id:'uecl', route:'/league?competition=Conference League', badge:'LIVE NOW', badgeColor:'#f59e0b', icon:'🥉', iconBg:'linear-gradient(135deg,#14532d,#22c55e)', title:'Conference League', subtitle:'2025/26 · Quarter-finals', s1:'8', s2:'QF', s3:'May 27', l1:'Teams', l2:'Round', l3:'Final', dates:'Leipzig · 27 May 2026', accent:'#22c55e', disabled:false },
  ]

  return (
    <div style={{minHeight:'100vh',background:'#080c14',fontFamily:'Arial,sans-serif',position:'relative'}}>
      <div style={{position:'absolute',inset:0,opacity:0.04,backgroundImage:'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',backgroundSize:'60px 60px'}}/>
      <header style={{padding:'20px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.06)',position:'relative',zIndex:10}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🏆</div>
          <span style={{color:'#fff',fontWeight:700,fontSize:16}}>Tipovačka 2026</span>
        </div>
        <button onClick={()=>router.push('/login')} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:8,color:'rgba(255,255,255,0.6)',padding:'6px 14px',fontSize:12,cursor:'pointer'}}>Logout</button>
      </header>
      <main style={{maxWidth:1100,margin:'0 auto',padding:'48px 24px',position:'relative',zIndex:10}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <p style={{color:'#3b82f6',fontSize:11,fontWeight:600,letterSpacing:'0.25em',textTransform:'uppercase',marginBottom:12}}>SELECT TOURNAMENT</p>
          <h1 style={{color:'#fff',fontSize:40,fontWeight:700,margin:0,letterSpacing:'-0.02em'}}>Choose your competition</h1>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:16,marginTop:12}}>Predict scores, earn points, beat your friends</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:20}}>
          {tournaments.map(t => {
            const h = hovered === t.id
            return (
              <div key={t.id}
                onMouseEnter={()=>setHovered(t.id)}
                onMouseLeave={()=>setHovered(null)}
                onClick={()=>!t.disabled&&router.push(t.route)}
                style={{background:h?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.03)',border:`1px solid ${h?t.accent+'66':'rgba(255,255,255,0.08)'}`,borderRadius:16,padding:24,cursor:t.disabled?'default':'pointer',transition:'all 0.2s',opacity:t.disabled?0.5:1,boxShadow:h?`0 0 40px ${t.accent}22`:'none'}}>
                <div style={{display:'inline-flex',alignItems:'center',gap:6,background:t.badgeColor+'22',border:`1px solid ${t.badgeColor}44`,borderRadius:20,padding:'3px 10px',marginBottom:20}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:t.badgeColor}}/>
                  <span style={{color:t.badgeColor,fontSize:10,fontWeight:700,letterSpacing:'0.15em'}}>{t.badge}</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20}}>
                  <div style={{width:52,height:52,borderRadius:12,background:t.iconBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0}}>{t.icon}</div>
                  <div>
                    <h2 style={{color:'#fff',fontSize:18,fontWeight:700,margin:'0 0 3px'}}>{t.title}</h2>
                    <p style={{color:'rgba(255,255,255,0.4)',fontSize:12,margin:0}}>{t.subtitle}</p>
                  </div>
                </div>
                <div style={{display:'flex',borderRadius:10,overflow:'hidden',border:'1px solid rgba(255,255,255,0.06)',marginBottom:16}}>
                  {[{l:t.l1,v:t.s1},{l:t.l2,v:t.s2},{l:t.l3,v:t.s3}].map((s,i)=>(
                    <div key={s.l} style={{flex:1,padding:'12px 0',textAlign:'center',borderRight:i<2?'1px solid rgba(255,255,255,0.06)':'none',background:'rgba(255,255,255,0.02)'}}>
                      <div style={{color:'#fff',fontSize:18,fontWeight:700}}>{s.v}</div>
                      <div style={{color:'rgba(255,255,255,0.3)',fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',marginTop:2}}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{color:'rgba(255,255,255,0.4)',fontSize:12,marginBottom:16}}>📅 {t.dates}</div>
                <button style={{width:'100%',padding:'12px',background:t.disabled?'rgba(255,255,255,0.05)':h?t.accent:'rgba(255,255,255,0.06)',border:`1px solid ${t.accent}44`,borderRadius:10,color:t.disabled?'rgba(255,255,255,0.3)':'#fff',fontSize:13,fontWeight:600,cursor:t.disabled?'default':'pointer',transition:'all 0.2s'}}>
                  {t.disabled?'Coming Soon':'Vstoupit →'}
                </button>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}