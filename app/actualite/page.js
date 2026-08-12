'use client'
import Link from 'next/link'
import {useSearchParams} from 'next/navigation'

export default function Actualite(){
 const params=useSearchParams()
 const title=params.get('title')||'Actualité AtlasFoot'
 const source=params.get('source')||'Source externe'
 const category=params.get('category')||'Actualité'
 const publishedAt=params.get('publishedAt')||''
 const summary=params.get('summary')||''
 const link=params.get('link')||''
 const date=publishedAt?new Date(publishedAt):null
 const dateText=date&&!isNaN(date)?date.toLocaleString('fr-FR',{dateStyle:'long',timeStyle:'short'}):''
 return <><header className="top"><div className="wrap nav"><Link className="brand" href="/">ATLAS<b>FOOT</b></Link><nav className="navlinks"><Link href="/">Actualités</Link><Link href="/fil-actualite">⚡ Actualité en direct</Link><Link href="/videos">🎥 Vidéos</Link><Link href="/cafe">☕ Café</Link></nav></div></header>
 <main className="wrap" style={{maxWidth:900,padding:'38px 0 70px'}}><Link href="/fil-actualite" className="btn dark">← Retour au fil</Link><article className="card" style={{marginTop:18,padding:'34px'}}><span className="eyebrow">{category}</span><h1 style={{fontSize:'clamp(32px,5vw,58px)',lineHeight:1.04,margin:'14px 0 12px'}}>{title}</h1><div className="meta">{dateText}{dateText?' · ':''}{source}</div><div style={{height:1,background:'#26382f',margin:'28px 0'}}></div><h2>Ce qu’il faut retenir</h2><p style={{fontSize:19,lineHeight:1.75}}>{summary||`AtlasFoot a repéré cette information concernant ${category.toLowerCase()}. Consulte la source originale ci-dessous pour retrouver tous les détails publiés par le média.`}</p><div className="card" style={{marginTop:34,background:'#101d17'}}><span className="eyebrow">SOURCE</span><h3 style={{marginTop:8}}>{source}</h3><p className="meta">AtlasFoot présente un résumé de l’information et crédite le média à l’origine de la publication.</p>{link&&<a className="btn red" href={link} target="_blank" rel="noreferrer">Voir l’article original →</a>}</div></article><div className="card" style={{marginTop:20}}><h3>☕ Une réaction ?</h3><p>Discute de cette actualité avec les supporters marocains dans le Café des Lions.</p><Link className="btn dark" href="/cafe">Réagir dans le Café →</Link></div></main></>}
