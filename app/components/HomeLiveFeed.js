'use client'
import Link from 'next/link'
import {useEffect,useState} from 'react'

export default function HomeLiveFeed(){
 const [items,setItems]=useState([]),[matches,setMatches]=useState([]),[loading,setLoading]=useState(true)
 async function load(){try{const [newsRes,liveRes]=await Promise.all([fetch('/api/fil-actualite?ts='+Date.now(),{cache:'no-store'}),fetch('/api/football-live?ts='+Date.now(),{cache:'no-store'})]);const [news,live]=await Promise.all([newsRes.json(),liveRes.json()]);setItems((news.items||[]).slice(0,16));setMatches(live.matches||[])}finally{setLoading(false)}}
 useEffect(()=>{load();const id=setInterval(load,60000);return()=>clearInterval(id)},[])
 const time=d=>{const x=new Date(d);return isNaN(x)?'':x.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
 const status=p=>p.starter===true?'titulaire':p.starter===false?'remplaçant':'dans l’effectif'
 return <aside className="homeLiveRail">
   <div className="homeLiveHead"><div><span className="liveDot"></span><b>DIRECT ATLASFOOT</b><small>Scores & actualités · actualisé chaque minute</small></div><Link href="/fil-actualite">Tout voir →</Link></div>
   {matches.length>0&&<div className="homeLiveScores">{matches.map(m=><div className="homeLiveScore" key={m.id}><div className="homeLiveMeta"><span>🔴 {m.minute?m.minute+"'":m.status}</span><span>{m.league}</span></div><h3>{m.home} <b>{m.homeGoals} — {m.awayGoals}</b> {m.away}</h3><small>🇲🇦 {m.moroccans.map(p=>p.name+' · '+status(p)).join(' • ')}</small></div>)}</div>}
   <div className="homeLiveList">
    {loading&&<div className="homeLiveLoading">Chargement du direct…</div>}
    {!loading&&items.map((x,i)=><a key={x.link+i} className="homeLiveItem" href={x.link} target="_blank" rel="noreferrer"><div className="homeLiveMeta"><time>{time(x.publishedAt)}</time><span>{x.category}</span></div><h3>{x.title}</h3><small>{x.source}</small></a>)}
   </div>
   <Link className="btn red full" href="/fil-actualite">Voir tout le direct AtlasFoot</Link>
 </aside>
}
