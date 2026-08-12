'use client'
import {useEffect,useState} from 'react'

export default function EuropeanMoroccansLive(){
 const [data,setData]=useState(null)
 const load=()=>fetch('/api/football-live',{cache:'no-store'}).then(r=>r.json()).then(setData).catch(()=>{})
 useEffect(()=>{load();const t=setInterval(load,60000);return()=>clearInterval(t)},[])
 if(!data) return <div className="card"><b>🔴 Live Marocains en Europe</b><p>Chargement des scores…</p></div>
 if(!data.ok) return <div className="card"><b>🔴 Live Marocains en Europe</b><p>Connexion aux scores live momentanément indisponible.</p></div>
 return <section className="euroLive"><div className="sectionTitle"><div><span className="eyebrow">🔴 EN DIRECT</span><h2>Marocains en Europe</h2></div></div>{data.matches.length===0?<div className="card"><b>Aucun match concerné en direct actuellement.</b><p>Dès qu’un club européen avec un joueur marocain joue, son score apparaîtra ici automatiquement.</p></div>:<div className="cards">{data.matches.map(m=><div className="card" key={m.id}><span className="eyebrow">{m.league} · {m.minute?m.minute+"'":m.status}</span><h3>{m.home} {m.homeGoals} — {m.awayGoals} {m.away}</h3><p>🇲🇦 {m.moroccans.map(p=>p.name+(p.starter?' · titulaire':' · remplaçant')).join(' • ')}</p></div>)}</div>}</section>
}
