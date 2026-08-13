import './globals.css'

const siteUrl = 'https://www.atlasfoot.fr'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AtlasFoot — Actualité Football Maroc, Lions de l’Atlas & Mercato',
    template: '%s | AtlasFoot'
  },
  description: "Toute l’actualité du football marocain sur AtlasFoot : Lions de l’Atlas, équipe nationale du Maroc, joueurs marocains à l’étranger, mercato, matchs, résultats, vidéos et actualités en direct.",
  keywords: ['football marocain','actualité football marocain','Maroc football','Lions de l Atlas','équipe nationale Maroc','joueurs marocains','Marocains du monde','mercato Maroc','match Maroc','résultats Maroc','AtlasFoot'],
  applicationName: 'AtlasFoot',
  category: 'sports',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'AtlasFoot',
    title: 'AtlasFoot — Actualité du football marocain et Lions de l’Atlas',
    description: "Suivez toute l’actualité des Lions de l’Atlas, de l’équipe du Maroc, des joueurs marocains à l’étranger, du mercato et des matchs."
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AtlasFoot — Actualité Football Maroc',
    description: "Lions de l’Atlas, équipe du Maroc, Marocains du monde, mercato, matchs, résultats et vidéos."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 }
  }
}

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': siteUrl + '/#website',
    name: 'AtlasFoot',
    alternateName: 'Atlas Foot',
    url: siteUrl,
    inLanguage: 'fr-FR',
    description: "Site français spécialisé dans l’actualité du football marocain, des Lions de l’Atlas et des joueurs marocains à l’étranger.",
    publisher: { '@id': siteUrl + '/#organization' }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    '@id': siteUrl + '/#organization',
    name: 'AtlasFoot',
    alternateName: 'Atlas Foot',
    url: siteUrl,
    description: "Média consacré à l’actualité du football marocain : Lions de l’Atlas, sélection nationale, joueurs marocains, mercato et matchs.",
    areaServed: ['MA','FR'],
    knowsAbout: ['Football marocain','Lions de l’Atlas','Équipe nationale du Maroc','Joueurs marocains','Mercato','Football international']
  }
]

export default function RootLayout({ children }) {
  return <html lang="fr"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}} />{children}</body></html>
}
