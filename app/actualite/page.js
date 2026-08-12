import Link from 'next/link'

const decode=s=>(s||'')
 .replace(/&nbsp;|&#160;/gi,' ')
 .replace(/&amp;/g,'&').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"')
 .replace(/&lt;/g,'<').replace(/&gt;/g,'>')
 .replace(/<[^>]+>/g,' ')
 .replace(/\s+/g,' ').trim()

const badDescription=s=>{
 const x=(s||'').toLowerCase()
 return !s||s.length<70||x.includes('google actualités')||x.includes('google news')||x.includes('informations complètes et à jour')
}

function headlineSummary(title,source,category){
 const t=decode(title).replace(/\s+/g,' ').trim()
 const src=decode(source)||'la source citée'
 const cat=decode(category)||'football marocain'
 const chunks=t.split(/\s*[:;–—]\s*/).map(x=>x.trim()).filter(Boolean)
 const first=chunks[0]||t
 const rest=chunks.slice(1).join(' : ')
 let summary=''
 if(rest){
   summary=`Selon ${src}, ${first.charAt(0).toLowerCase()+first.slice(1)}. L’information principale concerne ${rest.charAt(0).toLowerCase()+rest.slice(1)}.`
 }else{
   summary=`${src} rapporte cette actualité concernant ${cat.toLowerCase()} : ${t}. AtlasFoot en retient l’information essentielle sans reprendre le texte intégral du média.`
 }
 const points=[]
 if(first)points.push(first)
 if(rest)points.push(rest)
 if(points.length<2&&t)points.push(`Actualité publiée par ${src}`)
 return {summary,points}
}

async function enrich(link,fallback,title,source,category){
 const cleanFallback=decode(fallback)
 let extracted=''
 if(link){
  try{
   const r=await fetch(link,{redirect:'follow',headers:{'user-agent':'Mozilla/5.0 AtlasFoot/1.0','accept-language':'fr-FR,fr;q=0.9'},next:{revalidate:900}})
   if(r.ok){
    const html=await r.text()
    const meta=(name)=>{
      const patterns=[
       new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["'][^>]*>`,'i'),
       new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["'][^>]*>`,'i')
      ]
      for(const p of patterns){const m=html.match(p);if(m?.[1])return decode(m[1])}
      return ''
    }
    const metaDescription=meta('og:description')||meta('description')||meta('twitter:description')
    const paragraphs=[...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map(m=>decode(m[1])).filter(x=>x.length>80&&!/cookie|newsletter|publicit|abonn|javascript/i.test(x))
    const paragraphText=paragraphs.slice(0,4).join(' ')
    extracted=!badDescription(metaDescription)?metaDescription:(paragraphText.length>140?paragraphText:'')
   }
  }catch{}
 }
 const candidate=!badDescription(extracted)?extracted:(!badDescription(cleanFallback)?cleanFallback:'')
 if(candidate){
   const sentences=decode(candidate).split(/(?<=[.!?])\s+/).filter(s=>s.length>35)
   const summary=(sentences.slice(0,3).join(' ')||candidate).slice(0,850)
   const points=sentences.slice(0,4).map(s=>s.replace(/^[-–•]\s*/, '').trim()).filter(Boolean)
   return {summary,points,mode:'source'}
 }
 return {...headlineSummary(title,source,category),mode:'headline'}
}

export default async function Actualite({searchParams}){
 const params=await searchParams
 const title=decode(params?.title)||'Actualité AtlasFoot'
 const source=decode(params?.source)||'Source externe'
 const category=decode(params?.category)||'Actualité'
 const publishedAt=params?.publishedAt||''
 const link=params?.link||''
 const date=publishedAt?new Date(publishedAt):null
 const dateText=date&&!isNaN(date)?date.toLocaleString('fr-FR',{dateStyle:'long',timeStyle:'short'}):''
 const enriched=await enrich(link,params?.summary||'',title,source,category)
 const summary=enriched.summary
 const points=enriched.points.length?enriched.points:[title]
 return <><header className="top"><div className="wrap nav"><Link className="brand" href="/">ATLAS<b>FOOT</b></Link><nav className="navlinks"><Link href="/">Actualités</Link><Link href="/fil-actualite">⚡ Actualité en direct</Link><Link href="/videos">🎥 Vidéos</Link><Link href="/cafe">☕ Café</Link></nav></div></header>
 <main className="wrap" style={{maxWidth:900,padding:'38px 0 70px'}}><Link href="/fil-actualite" className="btn dark">← Retour au fil</Link><article className="card" style={{marginTop:18,padding:'34px'}}><span className="eyebrow">{category}</span><h1 style={{fontSize:'clamp(32px,5vw,58px)',lineHeight:1.04,margin:'14px 0 12px'}}>{title}</h1><div className="meta">{dateText}{dateText?' · ':''}{source}</div><div style={{height:1,background:'#26382f',margin:'28px 0'}}></div><h2>Ce qu’il faut retenir</h2><p style={{fontSize:19,lineHeight:1.75}}>{summary}</p><div className="card" style={{marginTop:28,background:'#101d17'}}><span className="eyebrow">POINTS CLÉS</span><ul style={{margin:'14px 0 0',paddingLeft:22,lineHeight:1.7}}>{points.slice(0,4).map((p,i)=><li key={i} style={{marginBottom:8}}>{p}</li>)}</ul></div><div className="card" style={{marginTop:28,background:'#101d17'}}><span className="eyebrow">SOURCE</span><h3 style={{marginTop:8}}>{source}</h3><p className="meta">{enriched.mode==='source'?'AtlasFoot synthétise les informations disponibles et crédite le média à l’origine de la publication.':'Le flux ne fournit pas le texte complet : AtlasFoot présente une synthèse du titre et des métadonnées disponibles, sans inventer de détails.'}</p>{link&&<a className="btn red" href={link} target="_blank" rel="noreferrer">Voir l’article original →</a>}</div></article><div className="card" style={{marginTop:20}}><h3>☕ Une réaction ?</h3><p>Discute de cette actualité avec les supporters marocains dans le Café des Lions.</p><Link className="btn dark" href="/cafe">Réagir dans le Café →</Link></div></main></>}
