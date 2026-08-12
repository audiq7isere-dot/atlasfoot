export default function robots(){
 return {
  rules:{userAgent:'*',allow:'/',disallow:['/api/']},
  sitemap:'https://atlasfoot.vercel.app/sitemap.xml',
  host:'https://atlasfoot.vercel.app'
 }
}
