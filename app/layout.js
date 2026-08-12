import './globals.css'

export const metadata = {
  metadataBase: new URL('https://atlasfoot.vercel.app'),
  title: {
    default: 'AtlasFoot — Actualité du football marocain, Lions de l’Atlas et Botola',
    template: '%s | AtlasFoot'
  },
  description: "Toute l’actualité du football marocain : Lions de l’Atlas, Botola Pro, joueurs marocains à l’étranger, mercato, vidéos, interviews et communauté des supporters.",
  keywords: ['football marocain','Maroc football','Lions de l Atlas','équipe du Maroc','Botola Pro','joueurs marocains','Marocains du monde','mercato Maroc','actualité Maroc football','AtlasFoot'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://atlasfoot.vercel.app',
    siteName: 'AtlasFoot',
    title: 'AtlasFoot — Toute l’actualité du football marocain',
    description: "Lions de l’Atlas, Botola, Marocains du monde, mercato, vidéos et communauté."
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AtlasFoot — Actualité du football marocain',
    description: "Lions de l’Atlas, Botola, Marocains du monde, mercato et vidéos."
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
  url: 'https://atlasfoot.vercel.app',
  inLanguage: 'fr-FR',
  description: "Actualité du football marocain, Lions de l’Atlas, Botola et joueurs marocains.",
  publisher: { '@type': 'Organization', name: 'AtlasFoot', url: 'https://atlasfoot.vercel.app' }
}

export default function RootLayout({ children }) {
  return <html lang="fr"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}} />{children}</body></html>
}
