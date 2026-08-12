'use client'
import Link from 'next/link'
import {useEffect,useMemo,useState} from 'react'
import {createClient} from '@supabase/supabase-js'
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL||'https://czwiqkbojqqdatqohnrs.supabase.co',process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'sb_publishable_9H0YCCeSFQ-KgWucLDQ__w_au0A3nqP')
const poll={key:'attaquant-maroc-2026-08-12',question:'Qui doit être titulaire en pointe avec les Lions ?',choices:['Ayoub El Kaabi','Youssef En-Nesyri','Yassir Zabiri','Soufiane Rahimi']}
const trends=['Lions de l’Atlas','Mercato marocain','Achraf Hakimi','Botola Pro','Champions du monde U20']

export default function EngagementHub(){
 const [user,setUser]=useState(null),[votes,setVotes]=useState([]),[choice,setChoice]=useState(''),[preds,setPreds]=useState([]),[hs,setHs]=useState(1),[as,setAs]=useState(0),[msg,setMsg]=useState(''),[match,setMatch]=useState(null),[matchLoading,setMatchLoading]=useState(true),[now,setNow]=useState(Date.now()),[leaderboard,setLeaderboard]=useState([]),[leaderLoading,setLeaderLoading]=useState(true)

 useEffect(()=>{
  supabase.auth.getUser().then(({data})=>setUser(data.user||null))
  loadPoll();loadNextMatch();loadLeaderboard()
  const clock=setInterval(()=>setNow(Date.now()),30000)
  const {data:s}=supabase.auth.onAuthStateChange((_e,x)=>setUser(x?.user||null))
  return()=>{clearInterval(clock);s.subscription.unsubscribe()}
 },[])

 async function loadPoll(){const {data:v}=await supabase.from('daily_poll_votes').select('choice').eq('poll_key',poll.key);setVotes(v||[])}
 async function loadNextMatch(){try{const r=await fetch('/api/next-prediction',{cache:'no-store'});const j=await r.json();if(j.ok&&j.match){setMatch(j.match);await loadPredictions(j.match.key)}}catch{}finally{setMatchLoading(false)}}
 async function loadPredictions(matchKey){const {data:p}=await supabase.from('predictions').select('home_score,away_score,points,voter_id').eq('match_key',matchKey);setPreds(p||[])}
 function outcome(a,b){return a>b?'H':a<b?'A':'D'}
 function scorePrediction(ph,pa,rh,ra){if(ph===rh&&pa===ra)return 100;return outcome(ph,pa)===outcome(rh,ra)?30:0}
 async function loadLeaderboard(){
  try{
   setLeaderLoading(true)
   const {data:all,error}=await supabase.from('predictions').select('voter_id,match_key,home_score,away_score')
   if(error||!all?.length){setLeaderboard([]);return}
   const fixtureIds=[...new Set(all.map(p=>String(p.match_key||'').match(/^fixture-(\d+)$/)?.[1]).filter(Boolean))].slice(-20)
   const results={}
   await Promise.all(fixtureIds.map(async id=>{try{const r=await fetch('/api/prediction-result?fixture='+id);const j=await r.json();if(j.ok&&j.finished)results[id]=j}catch{}}))
   const map={}
   for(const p of all){
    const id=String(p.match_key||'').match(/^fixture-(\d+)$/)?.[1],res=id&&results[id]
    if(!res)continue
    const pts=scorePrediction(+p.home_score,+p.away_score,+res.homeGoals,+res.awayGoals)
    if(!map[p.voter_id])map[p.voter_id]={id:p.voter_id,points:0,exact:0,correct:0,played:0}
    map[p.voter_id].points+=pts;map[p.voter_id].played++
    if(pts===100)map[p.voter_id].exact++
    else if(pts===30)map[p.voter_id].correct++
   }
   const ids=Object.keys(map)
   let names={}
   if(ids.length){
    try{const {data:profiles}=await supabase.from('profiles').select('*').in('id',ids);for(const p of profiles||[])names[p.id]=p.username||p.display_name||p.full_name||p.name}catch{}
   }
   setLeaderboard(Object.values(map).map(x=>({...x,name:names[x.id]||('Supporter '+String(x.id).slice(0,6))})).sort((a,b)=>b.points-a.points||b.exact-a.exact||b.correct-a.correct).slice(0,10))
  }finally{setLeaderLoading(false)}
 }
 const counts=useMemo(()=>Object.fromEntries(poll.choices.map(c=>[c,votes.filter(v=>v.choice===c).length])),[votes])
 const predictionClosed=!!(match?.date && now>=new Date(match.date).getTime())
 const myPrediction=user?preds.find(p=>p.voter_id===user.id):null
 async function vote(c){if(!user){setMsg('Connecte-toi au Café des Lions pour voter.');return}const {error}=await supabase.from('daily_poll_votes').upsert({voter_id:user.id,poll_key:poll.key,choice:c},{onConflict:'voter_id,poll_key'});if(error){setMsg(error.message);return}setChoice(c);setMsg('Vote enregistré 🇲🇦');loadPoll()}
 async function predict(){if(!match){setMsg('Le prochain match n’est pas encore disponible.');return}if(!user){setMsg('Connecte-toi pour enregistrer ton pronostic.');return}if(Date.now()>=new Date(match.date).getTime()){setNow(Date.now());setMsg('Les pronostics sont fermés : le match a commencé.');return}const {error}=await supabase.from('predictions').upsert({voter_id:user.id,match_key:match.key,home_score:+hs,away_score:+as,updated_at:new Date().toISOString()},{onConflict:'voter_id,match_key'});setMsg(error?error.message:'Pronostic enregistré 🏆');if(!error){loadPredictions(match.key);loadLeaderboard()}}
 const formatDate=d=>{if(!d)return '';const x=new Date(d);return x.toLocaleString('fr-FR',{weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})}

 return <section className="engagementHub"><div className="engageGrid"><div className="card engageCard"><span className="eyebrow">📊 SONDAGE DU JOUR</span><h2>{poll.question}</h2>{poll.choices.map(c=>{const n=counts[c]||0,p=votes.length?Math.round(n*100/votes.length):0;return <button className="pollChoice" key={c} onClick={()=>vote(c)}><span>{c}</span><b>{p}%</b><i style={{width:p+'%'}}/></button>})}<small>{votes.length} vote{votes.length>1?'s':''} · résultats en direct</small></div>
 <div className="card engageCard"><span className="eyebrow">🏆 PRONOSTICS ATLASFOOT</span>{matchLoading?<><h2>Prochain match</h2><p>Chargement du prochain match du Maroc…</p></>:match?<><h2>{match.home} — {match.away}</h2><p><strong>{match.competition}</strong><br/>{formatDate(match.date)}{match.venue?' · '+match.venue:''}</p>{predictionClosed?<><p><strong>🔒 Pronostics fermés</strong><br/>Le match a commencé : aucun pronostic ne peut être ajouté ou modifié.</p>{myPrediction&&<p>Ton pronostic : <strong>{myPrediction.home_score} — {myPrediction.away_score}</strong></p>}</>:!user?<><p>Connecte-toi pour participer au pronostic de ce match.</p><Link className="btn red full" href="/cafe">Se connecter pour pronostiquer</Link></>:<><p>Donne ton score avant le coup d’envoi. Tu peux le modifier jusqu’au début du match.</p><div className="scorePick"><input type="number" min="0" max="20" value={hs} onChange={e=>setHs(e.target.value)}/><strong>—</strong><input type="number" min="0" max="20" value={as} onChange={e=>setAs(e.target.value)}/></div><button className="btn red full" onClick={predict}>{myPrediction?'Modifier mon pronostic':'Valider mon pronostic'}</button><small>{preds.length} pronostic{preds.length>1?'s':''} enregistré{preds.length>1?'s':''}</small></>}</>:<><h2>Prochain match du Maroc</h2><p>Le prochain match sera affiché ici dès qu’il sera disponible.</p></>}</div></div>
 <div className="card engageCard leaderboardCard"><span className="eyebrow">🥇 CLASSEMENT PRONOSTIQUEURS</span><h2>Les meilleurs supporters</h2><p><strong>100 pts</strong> score exact · <strong>30 pts</strong> bon vainqueur ou bon match nul · <strong>0 pt</strong> sinon.</p>{leaderLoading?<p>Calcul du classement…</p>:leaderboard.length?<div className="leaderboardList">{leaderboard.map((x,i)=><div className="leaderRow" key={x.id}><span className="leaderRank">{i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</span><div><b>{user?.id===x.id?'Moi · ':''}{x.name}</b><small>{x.exact} score{x.exact>1?'s':''} exact{x.exact>1?'s':''} · {x.correct} bon{x.correct>1?'s':''} résultat{x.correct>1?'s':''}</small></div><strong>{x.points} pts</strong></div>)}</div>:<p>Le classement apparaîtra après les premiers matchs terminés.</p>}</div>
 <div className="engageGrid lower"><div className="card engageCard"><span className="eyebrow">🔥 TENDANCES ATLASFOOT</span><ol className="trendList">{trends.map((t,i)=><li key={t}><b>{i+1}</b><Link href={'/fil-actualite?search='+encodeURIComponent(t)}>{t}</Link></li>)}</ol></div><div className="card engageCard"><span className="eyebrow">⭐ MON ATLASFOOT</span><h2>Ton football marocain, personnalisé</h2><p>Suis tes joueurs et clubs préférés pour retrouver plus vite leurs actualités, vidéos et discussions.</p><div className="quickTags"><Link href="/fil-actualite?cat=Marocains%20du%20monde">Hakimi</Link><Link href="/fil-actualite?cat=Botola%20Pro">Botola</Link><Link href="/mon-xi">Mon XI</Link><Link href="/cafe">Mes discussions</Link></div></div></div>{msg&&<div className="toast">{msg}</div>}</section>}
