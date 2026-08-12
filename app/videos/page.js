import Link from 'next/link'

const videos=[
 {id:'KqiS1Phf_LQ',cat:'Lions de l’Atlas',title:'Débat et actualité des Lions de l’Atlas',source:'MOUNIR FOOT'},
 {id:'itWn89uTqtU',cat:'Marocains du monde',title:'Youssef El Arabi buteur avec l’Olympiakos',source:'YouTube'}
]

export default function Videos(){return <>
<header className="top"><div className="wrap nav"><Link className="brand" href="/">ATLAS<b>FOOT</b></Link><nav className="navlinks"><Link href="/">Accueil</Link><Link href="/fil-actualite">⚡ Fil d’actualité</Link><Link className="active" href="/videos">🎥 Vidéos</Link><Link href="/mon-xi">Mon XI</Link><Link href="/cafe">☕ Café des Lions</Link></nav></div></header>
<section className="hero videoHero"><div className="wrap"><span className="eyebrow">🎥 ATLASFOOT TV</span><h1>Les vidéos du <em>football marocain</em></h1><p>Lions de l’Atlas, analyses, interviews, Botola, mercato et performances des Marocains du monde.</p></div></section>
<main className="wrap videoPage"><div className="videoFilters"><span className="active">Toutes</span><span>Lions de l’Atlas</span><span>Botola</span><span>Marocains du monde</span><span>Mercato</span><span>Interviews</span></div><div className="videoGrid">{videos.map((v,i)=><article className={'videoCard '+(i===0?'videoFeatured':'')} key={v.id}><div className="videoFrame"><iframe src={'https://www.youtube.com/embed/'+v.id} title={v.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe></div><div className="videoInfo"><span className="eyebrow">{v.cat}</span><h2>{v.title}</h2><small>{v.source} · YouTube</small></div></article>)}</div><div className="card videoNotice"><h3>📺 AtlasFoot Vidéos</h3><p>Cette rubrique est conçue pour accueillir automatiquement les nouvelles vidéos consacrées au football marocain et les classer par thème. Les vidéos restent hébergées par leurs plateformes et sont intégrées dans AtlasFoot.</p></div></main>
<footer className="footer"><div className="wrap">AtlasFoot · La communauté du football marocain</div></footer></>}
