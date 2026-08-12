import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const TEAM_MOROCCANS={
  'paris saint germain':['Achraf Hakimi'],'psg':['Achraf Hakimi'],
  'manchester united':['Noussair Mazraoui'],'real madrid':['Brahim Díaz'],
  'fenerbahce':['Youssef En-Nesyri','Sofyan Amrabat'],'fenerbahçe':['Youssef En-Nesyri','Sofyan Amrabat'],
  'girona':['Azzedine Ounahi'],'olympiacos':['Ayoub El Kaabi'],'olympiakos':['Ayoub El Kaabi'],
  'psv eindhoven':['Ismael Saibari'],'real betis':['Abde Ezzalzouli'],
  'west ham':['Nayef Aguerd'],'west ham united':['Nayef Aguerd'],
  'lille':['Hamza Igamane'],'feyenoord':['Oussama Targhalline']
}

const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()
function moroccansForTeam(name){const n=norm(name);for(const [team,players] of Object.entries(TEAM_MOROCCANS)) if(n===norm(team)||n.includes(norm(team))||norm(team).includes(n)) return players;return []}
function isMoroccoNationalTeam(name){
  const n=norm(name)
  return n==='morocco'||n==='maroc'||n.startsWith('morocco ')||n.startsWith('maroc ')||n.includes('morocco u')||n.includes('maroc u')||n.includes('morocco women')||n.includes('morocco w')||n.includes('morocco olympic')||n.includes('morocco olympics')
}

async function api(path,revalidate){
 const key=process.env.API_FOOTBALL_KEY
 if(!key) throw new Error('API_FOOTBALL_KEY manquante')
 const r=await fetch(`https://v3.football.api-sports.io${path}`,{headers:{'x-apisports-key':key},next:{revalidate}})
 const remaining=r.headers.get('x-ratelimit-requests-remaining')
 const limit=r.headers.get('x-ratelimit-requests-limit')
 const j=await r.json().catch(()=>({}))
 if(!r.ok||j.errors&&Object.keys(j.errors).length){
   const msg=JSON.stringify(j.errors||{})
   const quota=/limit|request|quota|rate/i.test(msg)||r.status===429
   const err=new Error(quota?'QUOTA_EXCEEDED':`API-Football ${r.status}`);err.quota=quota;throw err
 }
 return {response:j.response||[],remaining,limit}
}

export async function GET(){
 try{
  // Un seul flux live : joueurs marocains à l'étranger + sélections du Maroc.
  // Les clubs marocains ne sont plus recherchés ni affichés.
  const {response:fixtures,remaining,limit}=await api('/fixtures?live=all',120)
  const matches=fixtures.map(f=>{
    const homeName=f.teams?.home?.name||''
    const awayName=f.teams?.away?.name||''
    const homePlayers=moroccansForTeam(homeName)
    const awayPlayers=moroccansForTeam(awayName)
    const moroccanNationalMatch=isMoroccoNationalTeam(homeName)||isMoroccoNationalTeam(awayName)
    if(!homePlayers.length&&!awayPlayers.length&&!moroccanNationalMatch)return null
    const moroccans=[...homePlayers.map(name=>({name,team:homeName})),...awayPlayers.map(name=>({name,team:awayName}))]
    return {
      id:f.fixture.id,
      minute:f.fixture.status.elapsed,
      status:f.fixture.status.short,
      league:f.league.name,
      country:f.league.country,
      home:homeName,
      away:awayName,
      homeLogo:f.teams.home.logo,
      awayLogo:f.teams.away.logo,
      homeGoals:f.goals.home,
      awayGoals:f.goals.away,
      moroccans,
      moroccanNationalMatch
    }
  }).filter(Boolean)
  return NextResponse.json({ok:true,updatedAt:new Date().toISOString(),matches,refreshSeconds:120,quota:{remaining,limit}},{headers:{'Cache-Control':'public, s-maxage=120, stale-while-revalidate=30'}})
 }catch(e){
  const quota=e.quota||e.message==='QUOTA_EXCEEDED'
  return NextResponse.json({ok:false,reason:quota?'quota':'api',error:quota?'Live temporairement indisponible.':e.message,matches:[],refreshSeconds:120},{status:quota?429:500,headers:{'Cache-Control':'no-store'}})
 }
}
