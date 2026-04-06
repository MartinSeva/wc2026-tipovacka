import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const competition = req.nextUrl.searchParams.get('competition') || '2001'
  const res = await fetch(
    `https://api.football-data.org/v4/competitions/${competition}/matches`,
    { headers: { 'X-Auth-Token': 'dbbc04c2fffe4b33bb68e997eabc43c3' } }
  )
  const data = await res.json()
  return NextResponse.json(data)
}