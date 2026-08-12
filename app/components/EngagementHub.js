'use client'
import Link from 'next/link'
import {useEffect,useMemo,useState} from 'react'
import {createClient} from '@supabase/supabase-js'
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL||'https://czwiqkbojqqdatqohnrs.supabase.co',process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'sb_publishable_9H0YCCeSFQ-KgWucLDQ__w_au0A3nqP')
const poll={key:'attaquant-maroc-2026-08-12',question:'Qui doit être titulaire en pointe avec les Lions ?',choices:['Ayoub El Kaabi','Youssef En-Nesyri','Yassir Zabiri','Soufiane Rahimi']}
const trends=['Lions de l’Atlas','Mercato marocain','Achraf Hakimi','Botola Pro','Champions du monde U20']

export default function EngagementHub(){
 const [user,setUser]=useState(null),[votes,setVotes]=useState([]),[choice,setChoice]=useState(''),[preds,setPreds]=useState([]),[hs,setHs]=useState(1),[as,setAs]=useState(0),[msg,setMsg]=useState(''),[match,setMatch]=useState(null),[matchLoading,setMatchLoading]=useState(true),[now,setNow]=useState(Date.now())

 useEffect(()=>{
  supabase.auth.getUser().then(({data})=>setUser(data.user||null))
  loadPoll()
  loadNextMatch()
  const clock=setInterval(()=>setNow(Date.now()),30000)
  const {data:s}=supabase.auth.onAuthStateChange((_e,x)=>setUser(x?.user||null))
  return()=>{clearInterval(clock);s.subscription.unsubscribe()}
 },[])

 async function loadPoll(){
  const {data:v}=await supabase.from('daily_poll_votes').select('choice').eq('poll_key',poll.key)
  setVotes(v||[])
 }
 async function loadNextMatch(){
  try{
   const r=await fetch('/api/next-prediction',{cache:'no-store'})
   const j=await r.json()
   if(j.ok&&j.match){setMatch(j.match);await loadPredictions(j.match.key)}
  }catch{}finally{setMatchLoading(false)}
 }
 async function loadPredictions(matchKey){
  const {data:p}=await supabase.from('predictions').select('home_score,away_score,points,voter_id').eq('match_key',matchKey)
  setPreds(p||[])
 }
 const counts=useMemo(()=>Object.fromEntries(poll.choices.map(c=>[c,votes.filter(v=>v.choice===c).length])),[votes])
 const predictionClosed=!!(match?.date && now>=new Date(match.date).getTime())
 const myPrediction=user?preds.find(p=>p.voter_id===user.id):null
 async function vote(c){
  if(!user){setMsg('Connecte-toi au Café des Lions pour voter.');return}
  const {error}=await supabase.from('daily_poll_votes').upsert({voter_id:user.id,poll_key:poll.key,choice:c},{onConflict:'voter_id,poll_key'})
  if(error){setMsg(error.message);return}
  setChoice(c);setMsg('Vote enregistré 🇲🇦');loadPoll()
 }
 async function predict(){
  if(!match){setMsg('Le prochain match n’est pas encore disponible.');return}
  if(!user){setMsg('Connecte-toi pour enregistrer ton pronostic.');return}
  if(Date.now()>=new Date(match.date).getTime()){setNow(Date.now());setMsg('Les pronostics sont fermés : le match a commencé.');return}
  const {error}=await supabase.from('predictions').upsert({voter_id:user.id,match_key:match.key,home_score:+hs,away_score:+as,updated_at:new Date().toISOString()},{onConflict:'voter_id,match_key'})
  setMsg(error?error.message:'Pronostic enregistré 🏆')
  if(!error)loadPredictions(match.key)
 }
 const formatDate=d=>{
  if(!d)return ''
  const x=new Date(d)
  return x.toLocaleString('fr-FR',{weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})
 }

 return <section className="engagementHub"><div className="engageGrid"><div className="card engageCard"><span className="eyebrow">📊 SONDAGE DU JOUR</span><h2>{poll.question}</h2>{poll.choices.map(c=>{const n=counts[c]||0,p=votes.length?Math.round(n*100/votes.length):0;return <button className="pollChoice" key={c} onClick={()=>vote(c)}><span>{c}</span><b>{p}%</b><i style={{width:p+'%'}}/></button>})}<small>{votes.length} vote{votes.length>1?'s':''} · résultats en direct</small></div>
 <div className="card engageCard"><span className="eyebrow">🏆 PRONOSTICS ATLASFOOT</span>{matchLoading?<><h2>Prochain match</h2><p>Chargement du prochain match du Maroc…</p></>:match?<><h2>{match.home} — {match.away}</h2><p><strong>{match.competition}</strong><br/>{formatDate(match.date)}{match.venue?' · '+match.venue:''}</p>{predictionClosed?<><p><strong>🔒 Pronostics fermés</strong><br/>Le match a commencé : aucun pronostic ne peut être ajouté ou modifié.</p>{myPrediction&&<p>Ton pronostic : <strong>{myPrediction.home_score} — {myPrediction.away_score}</strong></p>}</>:!user?<><p>Connecte-toi pour participer au pronostic de ce match.</p><Link className="btn red full" href="/cafe">Se connecter pour pronostiquer</Link></>:<><p>Donne ton score avant le coup d’envoi. Tu peux le modifier jusqu’au début du match.</p><div className="scorePick"><input type="number" min="0" max="20" value={hs} onChange={e=>setHs(e.target.value)}/><strong>—</strong><input type="number" min="0" max="20" value={as} onChange={e=>setAs(e.target.value)}/></div><button className="btn red full" onClick={predict}>{myPrediction?'Modifier mon pronostic':'Valider mon pronostic'}</button><small>{preds.length} pronostic{preds.length>1?'s':''} enregistré{preds.length>1?'s':''}</small></>}</>:<><h2>Prochain match du Maroc</h2><p>Le prochain match sera affiché ici dès qu’il sera disponible.</p></>}</div></div>
 <div className="engageGrid lower"><div className="card engageCard"><span className="eyebrow">🔥 TENDANCES ATLASFOOT</span><ol className="trendList">{trends.map((t,i)=><li key={t}><b>{i+1}</b><Link href={'/fil-actualite?search='+encodeURIComponent(t)}>{t}</Link></li>)}</ol></div><div className="card engageCard"><span className="eyebrow">⭐ MON ATLASFOOT</span><h2>Ton football marocain, personnalisé</h2><p>Suis tes joueurs et clubs préférés pour retrouver plus vite leurs actualités, vidéos et discussions.</p><div className="quickTags"><Link href="/fil-actualite?cat=Marocains%20du%20monde">Hakimi</Link><Link href="/fil-actualite?cat=Botola%20Pro">Botola</Link><Link href="/mon-xi">Mon XI</Link><Link href="/cafe">Mes discussions</Link></div></div></div>{msg&&<div className="toast">{msg}</div>}</section>}
