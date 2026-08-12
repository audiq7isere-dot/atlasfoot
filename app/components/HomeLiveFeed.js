'use client'
import Link from 'next/link'
import {useEffect,useState} from 'react'

export default function HomeLiveFeed(){
 const [items,setItems]=useState([]),[loading,setLoading]=useState(true)
 async function load(){try{const r=await fetch('/api/fil-actualite',{cache:'no-store'});const j=await r.json();setItems((j.items||[]).slice(0,16))}finally{setLoading(false)}}
 useEffect(()=>{load();const id=setInterval(load,300000);return()=>clearInterval(id)},[])
 const time=d=>{const x=new Date(d);return isNaN(x)?'':x.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
 return <aside className="homeLiveRail">
   <div className="homeLiveHead"><div><span className="liveDot"></span><b>Fil d’actualité</b><small>Mis à jour automatiquement</small></div><Link href="/fil-actualite">Tout voir →</Link></div>
   <div className="homeLiveList">
    {loading&&<div className="homeLiveLoading">Chargement des dernières infos…</div>}
    {!loading&&items.map((x,i)=><a key={x.link+i} className="homeLiveItem" href={x.link} target="_blank" rel="noreferrer"><div className="homeLiveMeta"><time>{time(x.publishedAt)}</time><span>{x.category}</span></div><h3>{x.title}</h3><small>{x.source}</small></a>)}
   </div>
   <Link className="btn red full" href="/fil-actualite">Voir tout le fil Maroc Foot</Link>
 </aside>
}
