import './globals.css'

export const metadata = {
  title: "Toute l’actualité du football marocain est ici",
  description: "Actualité des Lions de l’Atlas, Botola, Marocains du monde et communauté AtlasFoot."
}

export default function RootLayout({ children }) {
  return <html lang="fr"><body>{children}</body></html>
}
