'use client'
import Link from 'next/link'
import {useEffect,useState} from 'react'

export default function HomeLiveFeed(){
 const [items,setItems]=useState([]),[matches,setMatches]=useState([]),[newsLoading,setNewsLoading]=useState(true),[liveLoading,setLiveLoading]=useState(true),[liveError,setLiveError]=useState(''),[refreshSeconds,setRefreshSeconds]=useState(900)
 async function loadLive(){try{setLiveError('');const r=await fetch('/api/football-live',{cache:'no-store'});const j=await r.json();setRefreshSeconds(j.refreshSeconds||900);if(!r.ok||!j.ok){setMatches([]);setLiveError(j.reason==='quota'?'Quota API-Football atteint pour aujourd’hui. Le Live reprendra automatiquement après réinitialisation.':'Scores momentanément indisponibles');return}setMatches(j.matches||[])}catch{setLiveError('Scores momentanément indisponibles')}finally{setLiveLoading(false)}}
 async function loadNews(){try{const r=await fetch('/api/fil-actualite?ts='+Date.now(),{cache:'no-store'});const j=await r.json();setItems((j.items||[]).slice(0,16))}catch{}finally{setNewsLoading(false)}}
 useEffect(()=>{loadLive();loadNews();const liveId=setInterval(loadLive,refreshSeconds*1000);const newsId=setInterval(loadNews,120000);return()=>{clearInterval(liveId);clearInterval(newsId)}},[refreshSeconds])
 const time=d=>{const x=new Date(d);return isNaN(x)?'':x.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
 return <aside className="homeLiveRail">
   <div className="homeLiveHead"><div><span className="liveDot"></span><b>DIRECT ATLASFOOT</b><small>Scores des matchs avec Marocains</small></div><Link href="/fil-actualite">Tout voir →</Link></div>
   <div className="homeLiveScores">
    {liveLoading&&<div className="homeLiveLoading">Chargement des scores en direct…</div>}
    {!liveLoading&&liveError&&<div className="homeLiveLoading">{liveError}</div>}
    {!liveLoading&&!liveError&&matches.length===0&&<div className="homeLiveLoading">Aucun match avec Marocain en direct pour le moment.</div>}
    {!liveLoading&&!liveError&&matches.map(m=><div className="homeLiveScore" key={m.id}><div className="homeLiveMeta"><span>🔴 {m.status==='HT'?'Mi-temps':m.minute?m.minute+"'":m.status}</span><span>{m.league}</span></div><h3>{m.home} <b>{m.homeGoals} — {m.awayGoals}</b> {m.away}</h3><small>🇲🇦 {m.moroccans.map(p=>p.name).join(' • ')}</small></div>)}
   </div>
   <div className="homeLiveHead sub"><div><b>Fil d’actualité</b><small>Actualisé toutes les 2 minutes</small></div></div>
   <div className="homeLiveList">
    {newsLoading&&<div className="homeLiveLoading">Chargement des dernières infos…</div>}
    {!newsLoading&&items.map((x,i)=><a key={x.link+i} className="homeLiveItem" href={x.link} target="_blank" rel="noreferrer"><div className="homeLiveMeta"><time>{time(x.publishedAt)}</time><span>{x.category}</span></div><h3>{x.title}</h3><small>{x.source}</small></a>)}
   </div>
   <Link className="btn red full" href="/fil-actualite">Voir tout le direct AtlasFoot</Link>
 </aside>
}
