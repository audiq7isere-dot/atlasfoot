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
  // Le cache partagé empêche chaque visiteur de consommer une nouvelle requête API.
  // 15 min par défaut reste compatible avec les 100 requêtes/jour du plan gratuit.
  const {response:fixtures,remaining,limit}=await api('/fixtures?live=all',900)
  const matches=fixtures.map(f=>{
    const home=moroccansForTeam(f.teams?.home?.name),away=moroccansForTeam(f.teams?.away?.name)
    if(!home.length&&!away.length)return null
    const moroccans=[...home.map(name=>({name,team:f.teams.home.name,starter:null})),...away.map(name=>({name,team:f.teams.away.name,starter:null}))]
    return {id:f.fixture.id,minute:f.fixture.status.elapsed,status:f.fixture.status.short,league:f.league.name,country:f.league.country,home:f.teams.home.name,away:f.teams.away.name,homeLogo:f.teams.home.logo,awayLogo:f.teams.away.logo,homeGoals:f.goals.home,awayGoals:f.goals.away,moroccans}
  }).filter(Boolean)
  return NextResponse.json({ok:true,updatedAt:new Date().toISOString(),matches,refreshSeconds:900,quota:{remaining,limit}},{headers:{'Cache-Control':'public, s-maxage=900, stale-while-revalidate=60'}})
 }catch(e){
  const quota=e.quota||e.message==='QUOTA_EXCEEDED'
  return NextResponse.json({ok:false,reason:quota?'quota':'api',error:quota?'Quota API-Football atteint. Réinitialisation quotidienne nécessaire ou passage au plan Pro.':e.message,matches:[],refreshSeconds:900},{status:quota?429:500,headers:{'Cache-Control':'no-store'}})
 }
}
