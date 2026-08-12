import Link from 'next/link'

const directVideos=[
 {id:'KqiS1Phf_LQ',cat:'Lions de l’Atlas',title:'Débat et actualité des Lions de l’Atlas',source:'YouTube'},
 {id:'d7cjUg41F0I',cat:'Marocains du monde',title:'Youssef El Arabi — ses premiers mots au FC Nantes',source:'FC Nantes'}
]

const interviews=[
 ['Achraf Hakimi','Achraf Hakimi interview Maroc football'],
 ['Yassine Bounou','Yassine Bounou interview Maroc football'],
 ['Brahim Díaz','Brahim Diaz interview Maroc football'],
 ['Youssef El Arabi','Youssef El Arabi interview Maroc football'],
 ['Azzedine Ounahi','Azzedine Ounahi interview Maroc football'],
 ['Nayef Aguerd','Nayef Aguerd interview Maroc football'],
 ['Noussair Mazraoui','Noussair Mazraoui interview Maroc football']
]

const collections=[
 ['🇲🇦','Lions de l’Atlas','Lions de l Atlas Maroc football interview résumé'],
 ['🏆','Botola Pro','Botola Pro Maroc football résumé interview'],
 ['🌍','Marocains du monde','joueur marocain Europe football buts interview'],
 ['🔁','Mercato','mercato joueur marocain football transfert'],
 ['🎙️','Conférences de presse','Maroc football conférence de presse Lions Atlas']
]

const ytSearch=q=>'https://www.youtube.com/results?search_query='+encodeURIComponent(q)

export default function Videos(){return <>
<header className="top"><div className="wrap nav"><Link className="brand" href="/">ATLAS<b>FOOT</b></Link><nav className="navlinks"><Link href="/">Accueil</Link><Link href="/fil-actualite">⚡ Fil d’actualité</Link><Link className="active" href="/videos">🎥 Vidéos</Link><Link href="/mon-xi">Mon XI</Link><Link href="/cafe">☕ Café des Lions</Link></nav></div></header>
<section className="hero videoHero"><div className="wrap"><span className="eyebrow">🎥 ATLASFOOT TV</span><h1>Les vidéos du <em>football marocain</em></h1><p>Vidéos, interviews, conférences de presse, Botola, mercato et performances des Marocains du monde.</p></div></section>
<main className="wrap videoPage">
<section><div className="sectionTitle"><div><span className="eyebrow">▶ À REGARDER</span><h2>Vidéos disponibles</h2></div></div><div className="videoGrid robustVideoGrid">{directVideos.map((v,i)=><a className={'videoCard videoLinkCard '+(i===0?'videoFeatured':'')} key={v.id} href={'https://www.youtube.com/watch?v='+v.id} target="_blank" rel="noreferrer"><div className="videoThumb"><img src={'https://i.ytimg.com/vi/'+v.id+'/hqdefault.jpg'} alt=""/><span className="playBadge">▶</span></div><div className="videoInfo"><span className="eyebrow">{v.cat}</span><h2>{v.title}</h2><small>{v.source} · Ouvrir la vidéo</small></div></a>)}</div></section>
<section className="interviewSection"><div className="sectionTitle"><div><span className="eyebrow">🎙️ PAROLES DE LIONS</span><h2>Interviews de joueurs</h2></div></div><div className="interviewGrid">{interviews.map(([name,q])=><a className="interviewCard" href={ytSearch(q)} target="_blank" rel="noreferrer" key={name}><div className="interviewAvatar">🎙️</div><div><strong>{name}</strong><span>Voir les interviews disponibles</span></div><b>→</b></a>)}</div></section>
<section><div className="sectionTitle"><div><span className="eyebrow">📺 EXPLORER</span><h2>Plus de vidéos</h2></div></div><div className="videoCollectionGrid">{collections.map(([icon,title,q])=><a className="videoCollectionCard" href={ytSearch(q)} target="_blank" rel="noreferrer" key={title}><span>{icon}</span><div><strong>{title}</strong><small>Voir les dernières vidéos sur YouTube</small></div><b>→</b></a>)}</div></section>
<div className="card videoNotice"><h3>Vidéos vérifiées</h3><p>AtlasFoot privilégie les vidéos encore disponibles et les sources officielles. Les vidéos s’ouvrent sur YouTube pour éviter les lecteurs bloqués par les restrictions d’intégration des chaînes.</p></div>
</main><footer className="footer"><div className="wrap">AtlasFoot · La communauté du football marocain</div></footer></>}
