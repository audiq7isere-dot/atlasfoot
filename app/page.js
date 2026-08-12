import Link from 'next/link'
import HomeLiveFeed from './components/HomeLiveFeed'

const players=[
['Bounou','GK',50,88],['Hakimi','DD',84,72],['Aguerd','DC',62,72],['Chadi Riad','DC',38,72],['Mazraoui','DG',16,72],
['Amrabat','MDC',50,51],['Ounahi','MC',32,42],['El Khannouss','MC',68,42],['Brahim Díaz','AD',80,22],['El Kaabi','BU',50,16],['Ezzalzouli','AG',20,22]
]

const videos=[
 {date:'26/07/2026',cat:'LIONNES DE L’ATLAS',title:'Réactions des Lionnes de l’Atlas après le succès contre le Kenya',source:'Le360 Sport',url:'https://sport.le360.ma/football/can/can-feminine-reactions-des-lionnes-de-latlas-apres-le-succes-contre-le-kenya_2ZKM52LUFFG4BHPAUOPW2HZHMY/'},
 {date:'26/07/2026',cat:'INTERVIEW',title:'Jorge Vilda : « fier de l’équipe » après Maroc–Kenya',source:'Le360 Sport',url:'https://sport.le360.ma/football/can/can-feminine-jorge-vilda-fier-de-lequipe-apres-le-carton-des-lionnes-face-au-kenya_GHH6LMB2WRHOFHAKOYAYHQ6BQ4/'},
 {date:'26/07/2026',cat:'FOOTBALL MAROCAIN',title:'Fouzi Lekjaa et Patrice Motsepe au Stade Moulay El Hassan',source:'Le360 Sport',url:'https://sport.le360.ma/football/can/can-feminine-fouzi-lekjaa-et-patrice-motsepe-au-stade-moulay-el-hassan-pour-maroc-kenya_QKZZ3H5CDRBDLIFWSEA3IH7SFI/'}
]

export default function Home(){return <>
<header className="top"><div className="wrap nav"><Link className="brand" href="/">ATLAS<b>FOOT</b></Link><nav className="navlinks"><a href="#actus">Actualités</a><Link href="/fil-actualite">⚡ Fil d’actualité</Link><Link href="/videos">🎥 Vidéos</Link><Link href="/mon-xi">Mon XI</Link><Link href="/cafe">☕ Café des Lions</Link></nav><Link className="btn red" href="/cafe">Rejoindre la communauté</Link></div></header>
<section className="hero"><div className="wrap"><span className="eyebrow">🇲🇦 FOOTBALL MAROCAIN</span><h1>Toute l’actualité du <em>football marocain</em> est ici.</h1><p>Lions de l’Atlas, Botola, Marocains du monde, mercato, jeunes talents et la voix des supporters réunis au même endroit.</p></div></section>
<main className="wrap homeWithRail"><div className="homeMainColumn"><section id="actus"><div className="sectionTitle"><h2>À la une</h2><Link className="btn dark" href="/fil-actualite">Voir le fil en direct →</Link></div><div className="cards">
<Link className="card headlineCard" href="/fil-actualite?cat=Lions%20de%20l%E2%80%99Atlas"><span className="eyebrow">LIONS DE L’ATLAS</span><h3>Toute l’actualité de la sélection</h3><p>Résultats, préparation, déclarations et informations autour de l’équipe nationale masculine.</p><span className="cardCta">Voir les dernières infos →</span></Link>
<Link className="card headlineCard" href="/fil-actualite?cat=Marocains%20du%20monde"><span className="eyebrow">MAROCAINS DU MONDE</span><h3>Nos joueurs à l’étranger</h3><p>Performances, transferts et actualités des internationaux marocains dans leurs clubs.</p><span className="cardCta">Voir les dernières infos →</span></Link>
<Link className="card headlineCard" href="/fil-actualite?cat=Botola%20Pro"><span className="eyebrow">BOTOLA PRO</span><h3>Le championnat marocain</h3><p>Classement, résultats, mercato et actualités des clubs du Royaume.</p><span className="cardCta">Voir les dernières infos →</span></Link>
</div></section>
<section className="homeVideos"><div className="sectionTitle"><div><span className="eyebrow">🎥 ATLASFOOT TV · MIS À JOUR CHAQUE JOUR</span><h2>Dernières vidéos</h2></div><Link className="btn dark" href="/videos">Voir toutes les vidéos et interviews →</Link></div><div className="homeVideoGrid">{videos.slice(0,2).map((v,i)=><a className={'videoCard videoLinkCard '+(i===0?'videoFeatured':'')} key={v.url} href={v.url} target="_blank" rel="noreferrer"><div className="videoThumb verifiedVideoThumb"><span className="playBadge">▶</span><span className="verifiedVideoDate">{v.date}</span></div><div className="videoInfo"><span className="eyebrow">{v.cat}</span><h3>{v.title}</h3><small>{v.source} · Vidéo vérifiée</small></div></a>)}</div></section>
<section id="xi"><div className="sectionTitle"><div><span className="eyebrow">LE CHOIX DES SUPPORTERS</span><h2>XI du Maroc — joueurs à leur poste</h2></div><Link className="btn red" href="/mon-xi">Composer mon XI</Link></div><div className="pitch">{players.map((p,i)=><div className="player" key={p[0]} style={{left:p[2]+'%',top:p[3]+'%'}}><div className="shirt">{i+1}</div><div className="playerName">{p[0]}</div><div className="pct">Position {p[1]}</div></div>)}</div></section>
<section style={{padding:'42px 0'}}><div className="card" style={{textAlign:'center',padding:'36px'}}><span className="eyebrow">☕ COMMUNAUTÉ</span><h2 style={{fontSize:34}}>Le Café des Lions</h2><p>Publie, commente, aime, vote dans les sondages et échange avec les supporters du football marocain.</p><Link className="btn red" href="/cafe">Entrer dans le Café des Lions</Link></div></section></div><HomeLiveFeed/></main><footer className="footer"><div className="wrap">AtlasFoot · La communauté du football marocain</div></footer></>}
