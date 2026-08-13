export const metadata = {
  title: 'Actualité Football Maroc en direct — Lions de l’Atlas, Mercato & Matchs',
  description: "Suivez en continu l’actualité du football marocain : Lions de l’Atlas, équipe du Maroc, joueurs marocains à l’étranger, mercato, matchs et dernières informations.",
  alternates: { canonical: '/fil-actualite' },
  openGraph: {
    title: 'Actualité Football Maroc en direct | AtlasFoot',
    description: "Toute l’actualité du football marocain et des Lions de l’Atlas en continu.",
    url: '/fil-actualite',
    type: 'website'
  },
  robots: { index: true, follow: true }
}

export default function Layout({ children }) { return children }
