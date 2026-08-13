import Link from 'next/link'
import {notFound} from 'next/navigation'
import {createClient} from '@supabase/supabase-js'

const siteUrl='https://www.atlasfoot.fr'
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL||'https://czwiqkbojqqdatqohnrs.supabase.co',process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'sb_publishable_9H0YCCeSFQ-KgWucLDQ__w_au0A3nqP')

async function getArticle(slug){
 const {data}=await supabase.from('news_articles').select('slug,title,source,category,original_url,published_at,summary').eq('slug',slug).maybeSingle()
 return data||null
}

export async function generateMetadata({params}){
 const {slug}=await params
 const a=await getArticle(slug)
 if(!a)return {title:'Actualité football marocain | AtlasFoot',robots:{index:false,follow:true}}
 const description=(a.summary&&a.summary.length>60?a.summary:`Retrouvez cette actualité du football marocain sur AtlasFoot : ${a.title}. Source : ${a.source||'média partenaire'}.`).slice(0,160)
 const url=`${siteUrl}/actualite/${a.slug}`
 return {
  title:a.title,
  description,
  alternates:{canonical:url},
  openGraph:{type:'article',url,title:a.title,description,siteName:'AtlasFoot',locale:'fr_FR',publishedTime:a.published_at||undefined},
  twitter:{card:'summary_large_image',title:a.title,description},
  robots:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1}
 }
}

export default async function ArticlePage({params}){
 const {slug}=await params
 const a=await getArticle(slug)
 if(!a)notFound()
 const date=a.published_at?new Date(a.published_at):null
 const dateText=date&&!isNaN(date)?date.toLocaleString('fr-FR',{dateStyle:'long',timeStyle:'short'}):''
 const intro=a.summary&&a.summary.length>60?a.summary:`AtlasFoot a repéré cette information concernant ${a.category||'le football marocain'}. Consultez la publication d’origine pour lire tous les détails et le contexte complet.`
 const schema={
  '@context':'https://schema.org','@type':'NewsArticle',
  headline:a.title,
  datePublished:a.published_at||undefined,
  dateModified:a.published_at||undefined,
  mainEntityOfPage:`${siteUrl}/actualite/${a.slug}`,
  articleSection:a.category||'Football marocain',
  inLanguage:'fr-FR',
  publisher:{'@type':'NewsMediaOrganization',name:'AtlasFoot',url:siteUrl},
  isBasedOn:a.original_url
 }
 return <>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
  <header className="top"><div className="wrap nav"><Link className="brand" href="/">ATLAS<b>FOOT</b></Link><nav className="navlinks"><Link href="/">Actualités</Link><Link href="/fil-actualite">⚡ Actualité en direct</Link><Link href="/videos">🎥 Vidéos</Link><Link href="/cafe">☕ Café</Link></nav></div></header>
  <main className="wrap" style={{maxWidth:920,padding:'38px 0 70px'}}>
   <Link href="/fil-actualite" className="btn dark">← Retour aux actualités</Link>
   <article className="card" style={{marginTop:18,padding:'34px'}}>
    <span className="eyebrow">{a.category||'ACTUALITÉ'}</span>
    <h1 style={{fontSize:'clamp(32px,5vw,58px)',lineHeight:1.04,margin:'14px 0 12px'}}>{a.title}</h1>
    <div className="meta">{dateText}{dateText?' · ':''}{a.source||'Source externe'}</div>
    <div style={{height:1,background:'#26382f',margin:'28px 0'}}/>
    <p style={{fontSize:20,lineHeight:1.75}}>{intro}</p>
    <div className="card" style={{marginTop:28,background:'#101d17'}}>
     <span className="eyebrow">SOURCE ORIGINALE</span>
     <h3 style={{marginTop:8}}>{a.source||'Média source'}</h3>
     <p className="meta">AtlasFoot référence cette actualité et renvoie vers le média à l’origine de l’information.</p>
     <a className="btn red" href={a.original_url} target="_blank" rel="noopener noreferrer nofollow">Lire l’article original →</a>
    </div>
   </article>
  </main>
 </>
}
