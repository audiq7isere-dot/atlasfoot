import Link from 'next/link'

const decode=s=>(s||'').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/g,'&').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()
const bad=s=>{const x=(s||'').toLowerCase();return !s||s.length<80||x.includes('google actualités')||x.includes('google news')||x.includes('informations complètes et à jour')}
const noise=s=>/cookie|newsletter|publicit|abonn|javascript|politique de confidentialité|tous droits réservés|inscrivez-vous|connexion|partagez cet article|lire aussi|à découvrir|articles similaires/i.test(s)

function fallbackSummary(title,source,category){
 const t=decode(title),src=decode(source)||'la source citée',cat=decode(category)||'football marocain'
 return {paragraphs:[`${src} rapporte cette actualité concernant ${cat.toLowerCase()} : ${t}.`,`Le contenu complet de cette publication n’est pas accessible automatiquement depuis AtlasFoot. Pour éviter toute information inventée ou déformée, le résumé détaillé ne peut pas être généré au-delà des éléments vérifiables disponibles dans le titre et les métadonnées.`],points:[t,`Information publiée par ${src}`],mode:'headline'}
}

function detailText(text,title){
 const clean=decode(text).slice(0,40000)
 const sentences=clean.split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(s=>s.length>35&&s.length<700&&!noise(s))
 if(sentences.length<2)return null
 const titleWords=decode(title).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(w=>w.length>3)
 const scored=sentences.map((s,i)=>({s,i,score:titleWords.reduce((n,w)=>n+(s.toLowerCase().includes(w)?3:0),0)+(i<10?5:i<25?3:i<45?1:0)}))
 const ranked=[...scored].sort((a,b)=>b.score-a.score||a.i-b.i)
 const chosen=ranked.slice(0,Math.min(16,sentences.length)).sort((a,b)=>a.i-b.i).map(x=>x.s)
 const paragraphSize=4,paragraphs=[]
 for(let i=0;i<chosen.length;i+=paragraphSize){const p=chosen.slice(i,i+paragraphSize).join(' ');if(p.length>100)paragraphs.push(p)}
 const points=ranked.slice(0,7).map(x=>x.s)
 return paragraphs.length?{paragraphs:paragraphs.slice(0,4),points,mode:'full'}:null
}

async function enrich(link,fallback,title,source,category){
 let articleText='',metaDescription=''
 if(link){try{
  const r=await fetch(link,{redirect:'follow',headers:{'user-agent':'Mozilla/5.0 (compatible; AtlasFoot/1.0; +https://atlasfoot.vercel.app)','accept-language':'fr-FR,fr;q=0.9,en;q=0.7'},next:{revalidate:1800}})
  if(r.ok){
   const html=await r.text()
   const meta=name=>{for(const p of [new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["'][^>]*>`,'i'),new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["'][^>]*>`,'i')]){const m=html.match(p);if(m?.[1])return decode(m[1])}return ''}
   metaDescription=meta('og:description')||meta('description')||meta('twitter:description')
   const articleMatch=html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)
   const mainMatch=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)
   const scope=articleMatch?.[1]||mainMatch?.[1]||html
   const paragraphs=[...scope.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map(m=>decode(m[1])).filter(p=>p.length>55&&!noise(p))
   articleText=paragraphs.join(' ')
  }
 }catch{}}
 const full=detailText(articleText,title)
 if(full)return full
 const candidate=!bad(metaDescription)?metaDescription:(!bad(decode(fallback))?decode(fallback):'')
 if(candidate){const d=detailText(candidate,title);if(d)return {...d,mode:'description'};return {paragraphs:[candidate],points:[candidate],mode:'description'}}
 return fallbackSummary(title,source,category)
}

export default async function Actualite({searchParams}){
 const params=await searchParams,title=decode(params?.title)||'Actualité AtlasFoot',source=decode(params?.source)||'Source externe',category=decode(params?.category)||'Actualité',publishedAt=params?.publishedAt||'',link=params?.link||''
 const date=publishedAt?new Date(publishedAt):null,dateText=date&&!isNaN(date)?date.toLocaleString('fr-FR',{dateStyle:'long',timeStyle:'short'}):''
 const enriched=await enrich(link,params?.summary||'',title,source,category),points=enriched.points?.length?enriched.points:[title]
 return <><header className="top"><div className="wrap nav"><Link className="brand" href="/">ATLAS<b>FOOT</b></Link><nav className="navlinks"><Link href="/">Actualités</Link><Link href="/fil-actualite">⚡ Actualité en direct</Link><Link href="/videos">🎥 Vidéos</Link><Link href="/cafe">☕ Café</Link></nav></div></header><main className="wrap" style={{maxWidth:920,padding:'38px 0 70px'}}><Link href="/fil-actualite" className="btn dark">← Retour au fil</Link><article className="card" style={{marginTop:18,padding:'34px'}}><span className="eyebrow">{category}</span><h1 style={{fontSize:'clamp(32px,5vw,58px)',lineHeight:1.04,margin:'14px 0 12px'}}>{title}</h1><div className="meta">{dateText}{dateText?' · ':''}{source}</div><div style={{height:1,background:'#26382f',margin:'28px 0'}}/><span className="eyebrow">SYNTHÈSE COMPLÈTE</span><h2 style={{marginTop:8}}>Résumé détaillé AtlasFoot</h2><div style={{fontSize:19,lineHeight:1.8}}>{enriched.paragraphs.map((p,i)=><p key={i} style={{margin:'0 0 20px'}}>{p}</p>)}</div><div className="card" style={{marginTop:30,background:'#101d17'}}><span className="eyebrow">LES INFORMATIONS ESSENTIELLES</span><ul style={{margin:'16px 0 0',paddingLeft:22,lineHeight:1.75}}>{points.slice(0,7).map((p,i)=><li key={i} style={{marginBottom:10}}>{p}</li>)}</ul></div><div className="card" style={{marginTop:28,background:'#101d17'}}><span className="eyebrow">SOURCE</span><h3 style={{marginTop:8}}>{source}</h3><p className="meta">{enriched.mode==='full'?'Synthèse détaillée originale AtlasFoot réalisée à partir des informations accessibles dans l’ensemble de l’article source.':enriched.mode==='description'?'Le média ne rend pas tout le corps de l’article accessible automatiquement : la synthèse utilise toutes les informations vérifiables disponibles.':'Le média bloque l’accès automatique au contenu complet. AtlasFoot n’invente donc aucun détail manquant.'}</p>{link&&<a className="btn red" href={link} target="_blank" rel="noreferrer">Voir l’article original →</a>}</div></article><div className="card" style={{marginTop:20}}><h3>☕ Une réaction ?</h3><p>Discute de cette actualité avec les supporters marocains dans le Café des Lions.</p><Link className="btn dark" href="/cafe">Réagir dans le Café →</Link></div></main></>}
