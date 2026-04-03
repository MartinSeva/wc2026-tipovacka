'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  useEffect(() => {
    router.push('/select')
  }, [])
  return <div style={{minHeight:'100vh',background:'#080c14',display:'flex',alignItems:'center',justifyContent:'center',color:'white'}}>Loading...</div>
}