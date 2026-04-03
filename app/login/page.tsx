'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push('/dashboard')
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',background:'#0d1117',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#161b22',border:'1px solid #30363d',borderRadius:12,padding:'2rem',width:'100%',maxWidth:400}}>
        <h1 style={{color:'#e6edf3',fontSize:22,textAlign:'center',marginBottom:24}}>Sign In</h1>
        <form onSubmit={handleLogin}>
          <div style={{marginBottom:12}}><label style={{color:'#8b949e',fontSize:13,display:'block',marginBottom:4}}>Email</label><input type='email' value={email} onChange={e=>setEmail(e.target.value)} required style={{width:'100%',padding:'10px',background:'#0d1117',border:'1px solid #30363d',borderRadius:8,color:'#e6edf3',fontSize:14,boxSizing:'border-box'}}/></div>
          <div style={{marginBottom:12}}><label style={{color:'#8b949e',fontSize:13,display:'block',marginBottom:4}}>Password</label><input type='password' value={password} onChange={e=>setPassword(e.target.value)} required style={{width:'100%',padding:'10px',background:'#0d1117',border:'1px solid #30363d',borderRadius:8,color:'#e6edf3',fontSize:14,boxSizing:'border-box'}}/></div>
          {error && <p style={{color:'#f85149',fontSize:13,marginBottom:12}}>{error}</p>}
          <button type='submit' disabled={loading} style={{width:'100%',padding:'10px',background:'#1a7f4b',border:'none',borderRadius:8,color:'white',fontSize:14,fontWeight:600,cursor:'pointer'}}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <p style={{color:'#8b949e',fontSize:13,textAlign:'center',marginTop:16}}>No account? <Link href='/register' style={{color:'#58a6ff'}}>Register here</Link></p>
      </div>
    </div>
  )
}
