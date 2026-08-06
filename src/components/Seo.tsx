import { useEffect } from 'react';
import { BRAND } from '../lib/brand';

type SeoProps = {
  title?: string;
  description?: string;
  path?: string;
  type?: 'website' | 'article' | 'profile';
  image?: string;
  noindex?: boolean;
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Updates document title + Open Graph for marketing routes.
 * Index.html already carries the homepage defaults and JSON-LD for crawlers.
 */
export function Seo({
  title,
  description = BRAND.description,
  path = '/',
  type = 'website',
  image = `${BRAND.url}/images/hero-stadium.jpg`,
  noindex = false,
}: SeoProps) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${BRAND.name}`
      : `${BRAND.name} — ${BRAND.tagline}`;
    const url = path.startsWith('http') ? path : `${BRAND.url}${path.startsWith('/') ? path : `/${path}`}`;

    document.title = fullTitle;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    upsertLink('canonical', url);

    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:site_name', BRAND.name);
    upsertMeta('property', 'og:locale', 'en_KE');

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);
  }, [title, description, path, type, image, noindex]);

  return null;
}
