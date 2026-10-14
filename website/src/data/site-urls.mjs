// Preferred public root: the GitHub Pages project site (origin plus repository base path).
export const canonicalOrigin = 'https://thomasardi.github.io/hakaisatsu';
export const sitePages = ['index', 'guide', 'start', 'gallery', 'community'];
export function canonicalPath(page, lang = 'en') {
  return page === 'index' ? (lang === 'zh' ? '/zh' : '/') : `${lang === 'zh' ? '/zh/' : '/'}${page}`;
}
export function canonicalUrl(page, lang = 'en') {
  return `${canonicalOrigin}${canonicalPath(page, lang)}`;
}
// Paths are relative to the site's root <base>, so exported files also work on file://.
export function localPagePath(page, lang = 'en', cleanUrls = false) {
  if (page === 'index') return lang === 'zh' ? 'zh' + (cleanUrls ? '' : '.html') : './';
  return `${lang === 'zh' ? 'zh/' : ''}${page}${cleanUrls ? '' : '.html'}`;
}
