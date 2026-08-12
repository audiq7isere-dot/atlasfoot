import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const TEAM_MOROCCANS={
  'paris saint germain':['Achraf Hakimi'],
  'psg':['Achraf Hakimi'],
  'manchester united':['Noussair Mazraoui'],
  'real madrid':['Brahim Díaz'],
  'fenerbahce':['Youssef En-Nesyri','Sofyan Amrabat'],
  'fenerbahçe':['Youssef En-Nesyri','Sofyan Amrabat'],
  'girona':['Azzedine Ounahi'],
  'olympiacos':['Ayoub El Kaabi'],
  'olympiakos':['Ayoub El Kaabi'],
  'psv eindhoven':['Ismael Saibari'],
  'real betis':['Abde Ezzalzouli'],
  'west ham':['Nayef Aguerd'],
  'west ham united':['Nayef Aguerd'],
  'lille':['Hamza Igamane'],
  'feyenoord':['Oussama Targhalline']
}

const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()
function moroccansForTeam(name){
 const n=norm(name)
 for(const [team,players] of Object.entries(TEAM_MOROCCANS)) if(n===norm(team)||n.includes(norm(team))||norm(team).includes(n)) return players
 return []
}

async function getLiveFixtures(){
 const key=process.env.API_FOOTBALL_KEY
 if(!key) throw new Error('API_FOOTBALL_KEY manquante')
 const r=await fetch('https://v3.football.api-sports.io/fixtures?live=all',{headers:{'x-apisports-key':key},cache:'no-store'})
 if(!r.ok) throw new Error(`API-Football ${r.status}`)
 const j=await r.json()
 if(j.errors && Object.keys(j.errors).length) throw new Error(JSON.stringify(j.errors))
 return j.response||[]
}

export async function GET(){
 try{
  const fixtures=await getLiveFixtures()
  const matches=fixtures.map(f=>{
    const home=moroccansForTeam(f.teams?.home?.name)
    const away=moroccansForTeam(f.teams?.away?.name)
    if(!home.length&&!away.length) return null
    const moroccans=[...home.map(name=>({name,team:f.teams.home.name})),...away.map(name=>({name,team:f.teams.away.name}))]
    return {id:f.fixture.id,minute:f.fixture.status.elapsed,status:f.fixture.status.short,league:f.league.name,country:f.league.country,home:f.teams.home.name,away:f.teams.away.name,homeLogo:f.teams.home.logo,awayLogo:f.teams.away.logo,homeGoals:f.goals.home,awayGoals:f.goals.away,moroccans}
  }).filter(Boolean)
  return NextResponse.json({ok:true,updatedAt:new Date().toISOString(),matches},{headers:{'Cache-Control':'no-store, max-age=0','CDN-Cache-Control':'no-store'}})
 }catch(e){return NextResponse.json({ok:false,error:e.message,matches:[]},{status:500,headers:{'Cache-Control':'no-store'}})}
}
