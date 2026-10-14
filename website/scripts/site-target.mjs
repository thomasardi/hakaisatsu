export function siteTarget(value = process.env.HAKAISATSU_SITE_TARGET) {
  if (value === undefined || value === '' || value === 'github') {
    return { name: 'github', site: 'https://thomasardi.github.io', base: '/hakaisatsu', outDir: './dist' };
  }
  throw new Error(`Unknown HAKAISATSU_SITE_TARGET: ${value}`);
}
