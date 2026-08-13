export default function sitemap(){
 const base='https://www.atlasfoot.fr'
 const now=new Date()
 return [
  {url:base,lastModified:now,changeFrequency:'hourly',priority:1},
  {url:base+'/fil-actualite',lastModified:now,changeFrequency:'hourly',priority:.95},
  {url:base+'/actualite',lastModified:now,changeFrequency:'hourly',priority:.95},
  {url:base+'/videos',lastModified:now,changeFrequency:'daily',priority:.85},
  {url:base+'/mon-xi',lastModified:now,changeFrequency:'daily',priority:.7},
  {url:base+'/cafe',lastModified:now,changeFrequency:'hourly',priority:.75}
 ]
}
