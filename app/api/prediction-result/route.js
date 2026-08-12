import { NextResponse } from 'next/server'

export async function GET(request){
  const {searchParams}=new URL(request.url)
  const fixture=searchParams.get('fixture')
  if(!fixture || !/^\d+$/.test(fixture)) return NextResponse.json({ok:false,finished:false},{status:400})
  try{
    const key=process.env.API_FOOTBALL_KEY
    if(!key) throw new Error('API unavailable')
    const r=await fetch(`https://v3.football.api-sports.io/fixtures?id=${fixture}`,{
      headers:{'x-apisports-key':key},
      next:{revalidate:86400}
    })
    const j=await r.json().catch(()=>({}))
    if(!r.ok || (j.errors && Object.keys(j.errors).length)) throw new Error('API unavailable')
    const f=(j.response||[])[0]
    if(!f) return NextResponse.json({ok:true,finished:false},{headers:{'Cache-Control':'public, s-maxage=21600'}})
    const finished=['FT','AET','PEN'].includes(f.fixture?.status?.short)
    return NextResponse.json({
      ok:true,
      finished,
      homeGoals:finished?f.goals?.home:null,
      awayGoals:finished?f.goals?.away:null,
      status:f.fixture?.status?.short||''
    },{headers:{'Cache-Control':finished?'public, s-maxage=86400, stale-while-revalidate=86400':'public, s-maxage=1800, stale-while-revalidate=600'}})
  }catch{
    return NextResponse.json({ok:false,finished:false},{status:503,headers:{'Cache-Control':'public, s-maxage=900'}})
  }
}
