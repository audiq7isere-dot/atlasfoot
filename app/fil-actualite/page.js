'use client'
import Link from 'next/link'
import {useEffect,useMemo,useState} from 'react'
import './feed.css'

const cats=['Tout','Lions de l’Atlas','Botola Pro','Marocains du monde','Mercato','Jeunes talents']
export default function FilActualite(){
 const [items,setItems]=useState([]),[cat,setCat]=useState('Tout'),[updated,setUpdated]=useState(null),[loading,setLoading]=useState(true)
 async function load(){try{const r=await fetch('/api/fil-actualite?ts='+Date.now(),{cache:'no-store'});const j=await r.json();setItems(j.items||[]);setUpdated(j.updatedAt||null)}finally{setLoading(false)}}
 useEffect(()=>{const requested=new URLSearchParams(window.location.search).get('cat');if(requested&&cats.includes(requested))setCat(requested);load();const id=setInterval(load,120000);return()=>clearInterval(id)},[])
 const visible=useMemo(()=>cat==='Tout'?items:items.filter(x=>x.category===cat),[items,cat])
 const time=d=>{const x=new Date(d);return isNaN(x)?'':x.toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}
 return <><header className="top"><div className="wrap nav"><Link className="brand" href="/">ATLAS<b>FOOT</b></Link><nav className="navlinks"><Link href="/">Actualités</Link><Link className="active" href="/fil-actualite">⚡ Fil d’actualité</Link><Link href="/mon-xi">Mon XI</Link><Link href="/cafe">☕ Café des Lions</Link></nav></div></header>
 <section className="hero feedHero"><div className="wrap"><span className="eyebrow">⚡ MISE À JOUR AUTOMATIQUE</span><h1>FIL D’ACTUALITÉ <em>MAROC FOOT</em></h1><p>Toutes les informations qui comptent sur le football marocain, classées par heure et actualisées automatiquement.</p><div className="feedStatus"><span className="liveDot"></span><b>Fil en direct</b><span>{updated?'Dernière mise à jour : '+time(updated):'Connexion aux sources…'}</span><button className="btn dark" onClick={()=>{setLoading(true);load()}}>Actualiser</button></div></div></section>
 <main className="wrap feedPage"><div className="feedTabs">{cats.map(c=><button key={c} className={cat===c?'active':''} onClick={()=>setCat(c)}>{c}</button>)}</div>
 <div className="feedGrid"><section className="feedList">{loading&&<div className="card empty">Chargement des dernières informations…</div>}{!loading&&visible.length===0&&<div className="card empty">Aucune information disponible pour le moment.</div>}{visible.map((x,i)=><a className="feedItem" key={x.link+i} href={x.link} target="_blank" rel="noopener noreferrer"><div className="feedTime">{time(x.publishedAt)}</div><div className="feedBody"><div className="feedTop"><span className="feedCategory">{x.category}</span><span className="feedSource">{x.source}</span></div><h2>{x.title}</h2></div><div className="feedArrow">›</div></a>)}</section>
 <aside className="feedAside"><div className="card"><span className="eyebrow">🇲🇦 ATLASFOOT</span><h3>Le fil 100% Maroc</h3><p>Le fil rassemble en continu les informations concernant la sélection, la Botola, les joueurs marocains à l’étranger, le mercato et les jeunes.</p></div><div className="card"><h3>☕ Réagir avec les supporters</h3><p>Une actualité te fait réagir ? Viens en débattre dans le Café des Lions.</p><Link className="btn red full" href="/cafe">Ouvrir le Café</Link></div></aside></div></main></>}
