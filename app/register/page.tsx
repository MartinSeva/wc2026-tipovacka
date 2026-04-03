'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [club, setClub] = useState('')
  const [nation, setNation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) { setError(signUpError.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, nickname, favorite_club: club, favorite_nation: nation })
    }
    router.push('/dashboard')
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',background:'#0d1117',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#161b22',border:'1px solid #30363d',borderRadius:12,padding:'2rem',width:'100%',maxWidth:400}}>
        <h1 style={{color:'#e6edf3',fontSize:22,textAlign:'center'}}>Create Account</h1>
        <form onSubmit={handleRegister}>
          <div style={{marginBottom:12}}><label style={{color:'#8b949e',fontSize:13,display:'block',marginBottom:4}}>Email</label><input type='email' value={email} onChange={e=>setEmail(e.target.value)} required style={{width:'100%',padding:'10px',background:'#0d1117',border:'1px solid #30363d',borderRadius:8,color:'#e6edf3',fontSize:14,boxSizing:'border-box'}}/></div>
          <div style={{marginBottom:12}}><label style={{color:'#8b949e',fontSize:13,display:'block',marginBottom:4}}>Password</label><input type='password' value={password} onChange={e=>setPassword(e.target.value)} required style={{width:'100%',padding:'10px',background:'#0d1117',border:'1px solid #30363d',borderRadius:8,color:'#e6edf3',fontSize:14,boxSizing:'border-box'}}/></div>
          <div style={{marginBottom:12}}><label style={{color:'#8b949e',fontSize:13,display:'block',marginBottom:4}}>Nickname</label><input type='text' value={nickname} onChange={e=>setNickname(e.target.value)} required style={{width:'100%',padding:'10px',background:'#0d1117',border:'1px solid #30363d',borderRadius:8,color:'#e6edf3',fontSize:14,boxSizing:'border-box'}}/></div>
          <div style={{marginBottom:12}}><label style={{color:'#8b949e',fontSize:13,display:'block',marginBottom:4}}>Favourite Club</label><input type='text' value={club} onChange={e=>setClub(e.target.value)} style={{width:'100%',padding:'10px',background:'#0d1117',border:'1px solid #30363d',borderRadius:8,color:'#e6edf3',fontSize:14,boxSizing:'border-box'}}/></div>
          <div style={{marginBottom:12}}><label style={{color:'#8b949e',fontSize:13,display:'block',marginBottom:4}}>Favourite Nation</label><input type='text' value={nation} onChange={e=>setNation(e.target.value)} style={{width:'100%',padding:'10px',background:'#0d1117',border:'1px solid #30363d',borderRadius:8,color:'#e6edf3',fontSize:14,boxSizing:'border-box'}}/></div>
          {error && <p style={{color:'#f85149',fontSize:13}}>{error}</p>}
          <button type='submit' disabled={loading} style={{width:'100%',padding:'10px',background:'#1a7f4b',border:'none',borderRadius:8,color:'white',fontSize:14,fontWeight:600,cursor:'pointer'}}>{loading ? 'Creating...' : 'Create account'}</button>
        </form>
        <p style={{color:'#8b949e',fontSize:13,textAlign:'center',marginTop:16}}>Have an account? <Link href='/login' style={{color:'#58a6ff'}}>Sign in</Link></p>
      </div>
    </div>
  )
}
