export default function sitemap(){
 const base='https://atlasfoot.vercel.app'
 const now=new Date()
 return [
  {url:base,lastModified:now,changeFrequency:'hourly',priority:1},
  {url:base+'/fil-actualite',lastModified:now,changeFrequency:'hourly',priority:.95},
  {url:base+'/videos',lastModified:now,changeFrequency:'daily',priority:.9},
  {url:base+'/mon-xi',lastModified:now,changeFrequency:'daily',priority:.75},
  {url:base+'/cafe',lastModified:now,changeFrequency:'hourly',priority:.8}
 ]
}
