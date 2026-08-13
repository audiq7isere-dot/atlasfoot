const siteUrl = 'https://www.atlasfoot.fr'

export default function robots(){
 return {
  rules:{userAgent:'*',allow:'/',disallow:['/api/','/admin/']},
  sitemap:siteUrl+'/sitemap.xml',
  host:siteUrl
 }
}
