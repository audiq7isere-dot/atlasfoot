import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const MOROCCAN_NAMES = [
  'Achraf Hakimi','Noussair Mazraoui','Brahim Diaz','Brahim Díaz','Yassine Bounou','Bono',
  'Sofyan Amrabat','Azzedine Ounahi','Bilal El Khannouss','Nayef Aguerd','Abde Ezzalzouli',
  'Youssef En-Nesyri','Ayoub El Kaabi','Eliesse Ben Seghir','Amine Adli','Ismael Saibari',
  'Hamza Igamane','Oussama Targhalline','Chadi Riad','Issa Diop','Neil El Aynaoui','Adam Aznou',
  'Ibrahim Maza','Anass Zaroury','Zakaria Aboukhlal','Ilias Akhomach','Amir Richardson'
]

const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
const isMoroccan=p=>MOROCCAN_NAMES.some(n=>norm(p?.name).includes(norm(n))||norm(n).includes(norm(p?.name)))

async function api(path){
  const key=process.env.API_FOOTBALL_KEY
  if(!key) throw new Error('API_FOOTBALL_KEY manquante')
  const r=await fetch(`https://v3.football.api-sports.io${path}`,{headers:{'x-apisports-key':key},cache:'no-store'})
  if(!r.ok) throw new Error(`API-Football ${r.status}`)
  const j=await r.json()
  if(j.errors && Object.keys(j.errors).length) throw new Error(JSON.stringify(j.errors))
  return j.response||[]
}

export async function GET(){
 try{
  const fixtures=await api('/fixtures?live=all')
  const candidates=fixtures.filter(f=>['Europe','World','England','Spain','France','Germany','Italy','Netherlands','Portugal','Belgium','Turkey'].includes(f.league?.country)||/Champions League|Europa League|Conference League|Super Cup/i.test(f.league?.name||''))
  const out=[]
  for(const f of candidates.slice(0,30)){
    try{
      const lineups=await api(`/fixtures/lineups?fixture=${f.fixture.id}`)
      const maroc=[]
      for(const l of lineups){
        for(const x of [...(l.startXI||[]),...(l.substitutes||[])]) if(isMoroccan(x.player)) maroc.push({name:x.player.name,team:l.team.name,starter:(l.startXI||[]).some(y=>y.player.id===x.player.id)})
      }
      if(maroc.length) out.push({id:f.fixture.id,minute:f.fixture.status.elapsed,status:f.fixture.status.short,league:f.league.name,country:f.league.country,home:f.teams.home.name,away:f.teams.away.name,homeLogo:f.teams.home.logo,awayLogo:f.teams.away.logo,homeGoals:f.goals.home,awayGoals:f.goals.away,moroccans:maroc})
    }catch{}
  }
  return NextResponse.json({ok:true,updatedAt:new Date().toISOString(),matches:out},{headers:{'Cache-Control':'no-store, max-age=0'}})
 }catch(e){return NextResponse.json({ok:false,error:e.message,matches:[]},{status:500,headers:{'Cache-Control':'no-store'}})}
}
