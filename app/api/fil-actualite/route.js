import {createClient} from '@supabase/supabase-js'

export const dynamic='force-dynamic'
export const revalidate=0

const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL||'https://czwiqkbojqqdatqohnrs.supabase.co',process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'sb_publishable_9H0YCCeSFQ-KgWucLDQ__w_au0A3nqP')

const feeds=[
 {category:'Lions de l’Atlas',q:'Maroc football équipe nationale OR "Lions de l Atlas"'},
 {category:'Botola Pro',q:'Botola Pro football Maroc'},
 {category:'Marocains du monde',q:'("Achraf Hakimi" OR "Brahim Diaz" OR "Yassine Bounou" OR "Youssef En-Nesyri" OR "Sofyan Amrabat" OR "Azzedine Ounahi" OR "Bilal El Khannouss" OR "Ismael Saibari" OR "Nayef Aguerd" OR "Noussair Mazraoui" OR "Soufiane Rahimi") football'},
 {category:'Mercato',q:'mercato joueur marocain football transfert'},
 {category:'Jeunes talents',q:'jeune talent marocain football U20 U23 Maroc'}
]

const decode=s=>(s||'')
 .replace(/<!\[CDATA\[|\]\]>/g,'')
 .replace(/&nbsp;|&#160;/gi,' ')
 .replace(/&amp;/g,'&').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"')
 .replace(/&lt;/g,'<').replace(/&gt;/g,'>')
 .replace(/\s+/g,' ').trim()
const tag=(block,name)=>decode((block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`,'i'))||[])[1]||'')
const stripHtml=s=>decode((s||'').replace(/<[^>]+>/g,' '))
const slugify=s=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,110)

function parse(xml,category){
 const items=xml.match(/<item>[\s\S]*?<\/item>/gi)||[]
 return items.map(item=>{
   const full=tag(item,'title')
   const parts=full.split(' - ')
   const source=parts.length>1?parts.pop():'Google Actualités'
   const title=parts.join(' - ')||full
   let description=stripHtml(tag(item,'description')).replace(title,'').trim()
   if(description===source||description.length<35)description=''
   const publishedAt=tag(item,'pubDate')
   const stamp=publishedAt?new Date(publishedAt).toISOString().slice(0,10):new Date().toISOString().slice(0,10)
   return {title,source,category,link:tag(item,'link'),publishedAt,summary:description,slug:`${slugify(title)}-${stamp}`}
 }).filter(x=>x.title&&x.link)
}

export async function GET(){
 try{
   const results=await Promise.allSettled(feeds.map(async f=>{
     const url='https://news.google.com/rss/search?q='+encodeURIComponent(f.q)+'&hl=fr&gl=FR&ceid=FR:fr&when=1d'
     const r=await fetch(url,{headers:{'user-agent':'AtlasFoot/1.0'},cache:'no-store'})
     if(!r.ok) throw new Error('RSS '+r.status)
     const parsed=parse(await r.text(),f.category)
     const seenLocal=new Set()
     return parsed.filter(x=>{const k=x.title.toLowerCase().replace(/\W/g,'');if(seenLocal.has(k))return false;seenLocal.add(k);return true})
       .sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt)).slice(0,22)
   }))

   const byCategory=results.flatMap(r=>r.status==='fulfilled'?r.value:[])
   const seen=new Set()
   const items=byCategory.filter(x=>{const k=x.title.toLowerCase().replace(/\W/g,'');if(seen.has(k))return false;seen.add(k);return true})
     .sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt)).slice(0,100)

   if(items.length){
     const rows=items.map(x=>({slug:x.slug,title:x.title,source:x.source,category:x.category,original_url:x.link,published_at:x.publishedAt||null,summary:x.summary||null,updated_at:new Date().toISOString()}))
     await supabase.from('news_articles').upsert(rows,{onConflict:'slug'}).select('slug')
   }

   return Response.json({updatedAt:new Date().toISOString(),items},{headers:{'Cache-Control':'no-store, no-cache, must-revalidate, max-age=0'}})
 }catch(e){
   return Response.json({updatedAt:new Date().toISOString(),items:[],error:'Flux temporairement indisponible'},{status:200,headers:{'Cache-Control':'no-store'}})
 }
}
