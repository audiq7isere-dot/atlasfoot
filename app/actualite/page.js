import Link from 'next/link'

const decode=s=>(s||'').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/g,'&').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()
const bad=s=>{const x=(s||'').toLowerCase();return !s||s.length<80||x.includes('google actualités')||x.includes('google news')||x.includes('informations complètes et à jour')}
const noise=s=>/cookie|newsletter|publicit|abonn|javascript|politique de confidentialité|tous droits réservés|inscrivez-vous|connexion|partagez cet article/i.test(s)

function fallbackSummary(title,source,category){
 const t=decode(title),src=decode(source)||'la source citée',cat=decode(category)||'football marocain'
 return {summary:`${src} rapporte cette actualité concernant ${cat.toLowerCase()} : ${t}. Le contenu intégral de la publication n’est pas accessible automatiquement ; AtlasFoot évite donc d’ajouter des faits qui ne peuvent pas être vérifiés.`,points:[t,`Source : ${src}`],mode:'headline'}
}

function summarizeText(text,title){
 const clean=decode(text).slice(0,18000)
 const sentences=clean.split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(s=>s.length>45&&s.length<500&&!noise(s))
 if(!sentences.length)return null
 const words=decode(title).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(w=>w.length>3)
 const scored=sentences.map((s,i)=>({s,i,score:words.reduce((n,w)=>n+(s.toLowerCase().includes(w)?2:0),0)+(i<8?3:i<20?1:0)}))
 const selected=scored.sort((a,b)=>b.score-a.score||a.i-b.i).slice(0,8).sort((a,b)=>a.i-b.i).map(x=>x.s)
 const summary=selected.slice(0,6).join(' ').slice(0,2200)
 const points=scored.sort((a,b)=>b.score-a.score||a.i-b.i).slice(0,5).map(x=>x.s)
 return summary.length>160?{summary,points,mode:'full'}:null
}

async function enrich(link,fallback,title,source,category){
 let articleText='',metaDescription=''
 if(link){try{
  const r=await fetch(link,{redirect:'follow',headers:{'user-agent':'Mozilla/5.0 (compatible; AtlasFoot/1.0; +https://atlasfoot.vercel.app)','accept-language':'fr-FR,fr;q=0.9,en;q=0.7'},next:{revalidate:1800}})
  if(r.ok){
   const html=await r.text()
   const meta=(name)=>{for(const p of [new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["'][^>]*>`,'i'),new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["'][^>]*>`,'i')]){const m=html.match(p);if(m?.[1])return decode(m[1])}return ''}
   metaDescription=meta('og:description')||meta('description')||meta('twitter:description')
   const articleMatch=html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)
   const scope=articleMatch?.[1]||html
   const paragraphs=[...scope.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map(m=>decode(m[1])).filter(p=>p.length>70&&!noise(p))
   articleText=paragraphs.join(' ')
  }
 }catch{}}
 const full=summarizeText(articleText,title)
 if(full)return full
 const candidate=!bad(metaDescription)?metaDescription:(!bad(decode(fallback))?decode(fallback):'')
 if(candidate){const s=summarizeText(candidate,title);if(s)return {...s,mode:'description'}}
 return fallbackSummary(title,source,category)
}

export default async function Actualite({searchParams}){
 const params=await searchParams,title=decode(params?.title)||'Actualité AtlasFoot',source=decode(params?.source)||'Source externe',category=decode(params?.category)||'Actualité',publishedAt=params?.publishedAt||'',link=params?.link||''
 const date=publishedAt?new Date(publishedAt):null,dateText=date&&!isNaN(date)?date.toLocaleString('fr-FR',{dateStyle:'long',timeStyle:'short'}):''
 const enriched=await enrich(link,params?.summary||'',title,source,category),points=enriched.points?.length?enriched.points:[title]
 return <><header className="top"><div className="wrap nav"><Link className="brand" href="/">ATLAS<b>FOOT</b></Link><nav className="navlinks"><Link href="/">Actualités</Link><Link href="/fil-actualite">⚡ Actualité en direct</Link><Link href="/videos">🎥 Vidéos</Link><Link href="/cafe">☕ Café</Link></nav></div></header><main className="wrap" style={{maxWidth:900,padding:'38px 0 70px'}}><Link href="/fil-actualite" className="btn dark">← Retour au fil</Link><article className="card" style={{marginTop:18,padding:'34px'}}><span className="eyebrow">{category}</span><h1 style={{fontSize:'clamp(32px,5vw,58px)',lineHeight:1.04,margin:'14px 0 12px'}}>{title}</h1><div className="meta">{dateText}{dateText?' · ':''}{source}</div><div style={{height:1,background:'#26382f',margin:'28px 0'}}/><h2>Résumé AtlasFoot</h2><p style={{fontSize:19,lineHeight:1.75,whiteSpace:'pre-line'}}>{enriched.summary}</p><div className="card" style={{marginTop:28,background:'#101d17'}}><span className="eyebrow">POINTS CLÉS</span><ul style={{margin:'14px 0 0',paddingLeft:22,lineHeight:1.7}}>{points.slice(0,5).map((p,i)=><li key={i} style={{marginBottom:8}}>{p}</li>)}</ul></div><div className="card" style={{marginTop:28,background:'#101d17'}}><span className="eyebrow">SOURCE</span><h3 style={{marginTop:8}}>{source}</h3><p className="meta">{enriched.mode==='full'?'Résumé original AtlasFoot réalisé à partir du contenu accessible de l’article source.':enriched.mode==='description'?'Résumé réalisé à partir des informations accessibles publiées par la source.':'Le texte complet n’était pas accessible automatiquement ; AtlasFoot n’ajoute pas de détails non vérifiés.'}</p>{link&&<a className="btn red" href={link} target="_blank" rel="noreferrer">Voir l’article original →</a>}</div></article><div className="card" style={{marginTop:20}}><h3>☕ Une réaction ?</h3><p>Discute de cette actualité avec les supporters marocains dans le Café des Lions.</p><Link className="btn dark" href="/cafe">Réagir dans le Café →</Link></div></main></>}
