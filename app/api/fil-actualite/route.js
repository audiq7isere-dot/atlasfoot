export const dynamic='force-dynamic'
export const revalidate=0

const feeds=[
 {category:'Lions de l’Atlas',q:'Maroc football équipe nationale OR "Lions de l Atlas"'},
 {category:'Botola Pro',q:'Botola Pro football Maroc'},
 {category:'Marocains du monde',q:'("Achraf Hakimi" OR "Brahim Diaz" OR "Yassine Bounou" OR "Youssef En-Nesyri" OR "Sofyan Amrabat" OR "Azzedine Ounahi" OR "Bilal El Khannouss" OR "Ismael Saibari" OR "Nayef Aguerd" OR "Noussair Mazraoui" OR "Soufiane Rahimi") football'},
 {category:'Mercato',q:'mercato joueur marocain football transfert'},
 {category:'Jeunes talents',q:'jeune talent marocain football U20 U23 Maroc'}
]

const decode=s=>(s||'').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim()
const tag=(block,name)=>decode((block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`,'i'))||[])[1]||'')

function parse(xml,category){
 const items=xml.match(/<item>[\s\S]*?<\/item>/gi)||[]
 return items.map(item=>{
   const full=tag(item,'title')
   const parts=full.split(' - ')
   const source=parts.length>1?parts.pop():'Google Actualités'
   const title=parts.join(' - ')||full
   return {title,source,category,link:tag(item,'link'),publishedAt:tag(item,'pubDate')}
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

   return Response.json({updatedAt:new Date().toISOString(),items},{headers:{'Cache-Control':'no-store, no-cache, must-revalidate, max-age=0'}})
 }catch(e){
   return Response.json({updatedAt:new Date().toISOString(),items:[],error:'Flux temporairement indisponible'},{status:200,headers:{'Cache-Control':'no-store'}})
 }
}
