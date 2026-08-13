const base = 'https://www.atlasfoot.fr'

export const dynamic = 'force-static'

export default function sitemap() {
  return [
    { url: `${base}/`, changeFrequency: 'hourly', priority: 1.0 },
    { url: `${base}/actualite`, changeFrequency: 'hourly', priority: 0.95 },
    { url: `${base}/fil-actualite`, changeFrequency: 'hourly', priority: 0.95 },
    { url: `${base}/videos`, changeFrequency: 'daily', priority: 0.85 },
    { url: `${base}/mon-xi`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/cafe`, changeFrequency: 'hourly', priority: 0.75 },
  ]
}
