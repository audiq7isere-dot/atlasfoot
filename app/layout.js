import './globals.css'

const siteUrl = 'https://www.atlasfoot.fr'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AtlasFoot — Actualité du football marocain et Lions de l’Atlas',
    template: '%s | AtlasFoot'
  },
  description: "Toute l’actualité du football marocain : Lions de l’Atlas, équipe du Maroc, joueurs marocains à l’étranger, mercato, matchs, vidéos et communauté des supporters.",
  keywords: ['football marocain','actualité football marocain','Maroc football','Lions de l Atlas','équipe du Maroc','joueurs marocains','Marocains du monde','mercato Maroc','match Maroc','AtlasFoot'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'AtlasFoot',
    title: 'AtlasFoot — Toute l’actualité du football marocain',
    description: "Lions de l’Atlas, équipe du Maroc, joueurs marocains à l’étranger, mercato, matchs, vidéos et communauté."
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AtlasFoot — Actualité du football marocain',
    description: "Lions de l’Atlas, équipe du Maroc, Marocains du monde, mercato, matchs et vidéos."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 }
  }
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AtlasFoot',
  alternateName: 'Atlas Foot',
  url: siteUrl,
  inLanguage: 'fr-FR',
  description: "Site d’actualité consacré au football marocain, aux Lions de l’Atlas et aux joueurs marocains à l’étranger.",
  publisher: {
    '@type': 'Organization',
    name: 'AtlasFoot',
    url: siteUrl
  }
}

export default function RootLayout({ children }) {
  return <html lang="fr"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}} />{children}</body></html>
}
