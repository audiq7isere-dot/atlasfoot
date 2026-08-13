export const metadata = {
  title: 'Café des Lions — Communauté des supporters du Maroc',
  description: "Rejoins le Café des Lions sur AtlasFoot : débats, sondages, mercato et discussions entre supporters du football marocain.",
  alternates: { canonical: '/cafe' },
  openGraph: {
    title: 'Café des Lions — Communauté AtlasFoot',
    description: "Débats, sondages et discussions entre supporters des Lions de l’Atlas et du football marocain.",
    url: 'https://www.atlasfoot.fr/cafe',
    type: 'website'
  }
}

export default function CafeLayout({ children }) {
  return children
}
