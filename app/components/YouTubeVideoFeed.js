'use client'
import {useEffect,useState} from 'react'

function fmtDate(v){
  try{return new Intl.DateTimeFormat('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(v))}catch{return ''}
}

export default function YouTubeVideoFeed({limit=2}){
  const [items,setItems]=useState([])
  const [loading,setLoading]=useState(true)
  useEffect(()=>{
    let ok=true
    const load=()=>fetch('/api/videos',{cache:'no-store'}).then(r=>r.json()).then(d=>{if(ok)setItems((d.items||[]).slice(0,limit))}).finally(()=>{if(ok)setLoading(false)})
    load()
    const t=setInterval(load,30*60*1000)
    return()=>{ok=false;clearInterval(t)}
  },[limit])
  if(loading)return <div className="homeLiveLoading">Chargement des dernières vidéos YouTube…</div>
  if(!items.length)return <div className="card"><p>Aucune vidéo YouTube disponible pour le moment.</p></div>
  return <div className={limit<=2?'homeVideoGrid':'videoGrid robustVideoGrid'}>{items.map((v,i)=><a className={'videoCard videoLinkCard '+(i===0?'videoFeatured':'')} key={v.id} href={v.url} target="_blank" rel="noreferrer"><div className="videoThumb"><img src={v.thumbnail||('https://i.ytimg.com/vi/'+v.id+'/hqdefault.jpg')} alt=""/><span className="playBadge">▶</span><span className="verifiedVideoDate">{fmtDate(v.publishedAt)}</span></div><div className="videoInfo"><span className="eyebrow">YOUTUBE · FRMF</span><h3>{v.title}</h3><small>{v.channel} · Publiée le {fmtDate(v.publishedAt)}</small></div></a>)}</div>
}
