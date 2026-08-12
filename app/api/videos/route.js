const CHANNELS=[
  {name:'FRMF',id:'UCbQlejA3nCVMq-9qw-oZEtQ'}
]

const decode=s=>(s||'').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim()
const tag=(block,name)=>decode((block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`,'i'))||[])[1]||'')
const attr=(block,name,attrName)=>((block.match(new RegExp(`<${name}[^>]*${attrName}="([^"]+)"[^>]*>`,'i'))||[])[1]||'')

function parse(xml,channel){
  const entries=xml.match(/<entry>[\s\S]*?<\/entry>/gi)||[]
  return entries.map(entry=>{
    const videoId=tag(entry,'yt:videoId')
    const title=tag(entry,'title')
    const publishedAt=tag(entry,'published')
    const author=tag(entry,'name')||channel.name
    const thumb=attr(entry,'media:thumbnail','url')||`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    return {
      id:videoId,
      title,
      channel:author,
      publishedAt,
      thumbnail:thumb,
      url:`https://www.youtube.com/watch?v=${videoId}`
    }
  }).filter(v=>v.id&&v.title&&v.publishedAt)
}

export async function GET(){
  try{
    const results=await Promise.all(CHANNELS.map(async ch=>{
      const r=await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${ch.id}`,{
        headers:{'user-agent':'AtlasFoot/1.0'},
        next:{revalidate:1800}
      })
      if(!r.ok) throw new Error(`YouTube RSS ${r.status}`)
      return parse(await r.text(),ch)
    }))
    const items=results.flat().sort((a,b)=>new Date(b.publishedAt)-new Date(a.publishedAt)).slice(0,20)
    return Response.json({updatedAt:new Date().toISOString(),items},{headers:{'Cache-Control':'public, s-maxage=1800, stale-while-revalidate=3600'}})
  }catch(e){
    return Response.json({updatedAt:new Date().toISOString(),items:[],error:'Flux vidéo temporairement indisponible'},{status:200})
  }
}
