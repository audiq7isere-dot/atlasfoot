import Link from 'next/link'
import YouTubeVideoFeed from '../components/YouTubeVideoFeed'

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
<section className="hero videoHero"><div className="wrap"><span className="eyebrow">🎥 ATLASFOOT TV</span><h1>Les vidéos du <em>football marocain</em></h1><p>Dernières vidéos officielles de la FRMF, plus des accès directs aux interviews et recherches YouTube sur les joueurs marocains.</p></div></section>
<main className="wrap videoPage">
<section><div className="sectionTitle"><div><span className="eyebrow">▶ YOUTUBE OFFICIEL FRMF</span><h2>Dernières vidéos publiées</h2></div></div><YouTubeVideoFeed limit={12}/></section>
<section className="interviewSection"><div className="sectionTitle"><div><span className="eyebrow">🎙️ PAROLES DE LIONS</span><h2>Interviews de joueurs</h2></div></div><div className="interviewGrid">{interviews.map(([name,q])=><a className="interviewCard" href={ytSearch(q)} target="_blank" rel="noreferrer" key={name}><div className="interviewAvatar">🎙️</div><div><strong>{name}</strong><span>Rechercher ses interviews sur YouTube</span></div><b>→</b></a>)}</div></section>
<section><div className="sectionTitle"><div><span className="eyebrow">📺 EXPLORER YOUTUBE</span><h2>Plus de vidéos</h2></div></div><div className="videoCollectionGrid">{collections.map(([icon,title,q])=><a className="videoCollectionCard" href={ytSearch(q)} target="_blank" rel="noreferrer" key={title}><span>{icon}</span><div><strong>{title}</strong><small>Voir les résultats vidéo sur YouTube</small></div><b>→</b></a>)}</div></section>
<div className="card videoNotice"><h3>Source vidéo fiable</h3><p>Le bloc principal utilise directement le flux YouTube officiel de la Fédération Royale Marocaine de Football. Chaque carte correspond donc à une vraie vidéo YouTube avec son identifiant, sa miniature et sa date de publication.</p></div>
</main><footer className="footer"><div className="wrap">AtlasFoot · La communauté du football marocain</div></footer></>}
