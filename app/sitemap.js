import {createClient} from '@supabase/supabase-js'

const base='https://www.atlasfoot.fr'
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL||'https://czwiqkbojqqdatqohnrs.supabase.co',process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'sb_publishable_9H0YCCeSFQ-KgWucLDQ__w_au0A3nqP')

export const revalidate=3600

export default async function sitemap(){
 const staticPages=[
  {url:`${base}/`,changeFrequency:'hourly',priority:1.0},
  {url:`${base}/fil-actualite`,changeFrequency:'hourly',priority:0.95},
  {url:`${base}/videos`,changeFrequency:'daily',priority:0.85},
  {url:`${base}/mon-xi`,changeFrequency:'daily',priority:0.7},
  {url:`${base}/cafe`,changeFrequency:'hourly',priority:0.75}
 ]
 const {data}=await supabase.from('news_articles').select('slug,published_at,updated_at').order('published_at',{ascending:false}).limit(500)
 const articles=(data||[]).map(a=>({
  url:`${base}/actualite/${a.slug}`,
  lastModified:a.updated_at||a.published_at||new Date().toISOString(),
  changeFrequency:'weekly',
  priority:0.8
 }))
 return [...staticPages,...articles]
}
