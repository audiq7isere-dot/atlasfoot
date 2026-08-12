import { NextResponse } from 'next/server'

const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()

async function api(path,revalidate=21600){
  const key=process.env.API_FOOTBALL_KEY
  if(!key) throw new Error('API unavailable')
  const r=await fetch(`https://v3.football.api-sports.io${path}`,{
    headers:{'x-apisports-key':key},
    next:{revalidate}
  })
  const j=await r.json().catch(()=>({}))
  if(!r.ok || (j.errors && Object.keys(j.errors).length)) throw new Error('API unavailable')
  return j.response||[]
}

export async function GET(){
  try{
    // Recherche de l'équipe A du Maroc, mise en cache 24 h.
    const teams=await api('/teams?search=Morocco',86400)
    const morocco=teams.find(x=>x.team?.national===true && norm(x.team?.name)==='morocco')
      || teams.find(x=>x.team?.national===true && norm(x.team?.name).includes('morocco'))
    if(!morocco?.team?.id) throw new Error('Morocco team not found')

    // Le prochain match change peu : cache 6 h pour économiser le quota.
    const fixtures=await api(`/fixtures?team=${morocco.team.id}&next=1`,21600)
    const f=fixtures[0]
    if(!f) return NextResponse.json({ok:true,match:null},{headers:{'Cache-Control':'public, s-maxage=21600, stale-while-revalidate=3600'}})

    return NextResponse.json({
      ok:true,
      match:{
        key:`fixture-${f.fixture.id}`,
        fixtureId:f.fixture.id,
        home:f.teams.home.name,
        away:f.teams.away.name,
        homeLogo:f.teams.home.logo,
        awayLogo:f.teams.away.logo,
        competition:f.league.name,
        date:f.fixture.date,
        venue:f.fixture.venue?.name||''
      }
    },{headers:{'Cache-Control':'public, s-maxage=21600, stale-while-revalidate=3600'}})
  }catch{
    return NextResponse.json({ok:false,match:null},{status:503,headers:{'Cache-Control':'public, s-maxage=1800'}})
  }
}
