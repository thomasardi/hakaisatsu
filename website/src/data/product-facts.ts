import release from '../../../hakaisatsu/skill-release.json';

// The release identity belongs to this checkout; no stable capability is inferred
// from a development recipe or from the host where the site is deployed.
export const productVersion = release.version;
export const productChannel = release.channel === 'development' ? 'development' : 'stable';
export const sourceRef = productChannel === 'development' ? 'dev' : 'main';
export const recipeSourceUrl = `https://github.com/thomasardi/hakaisatsu/blob/${sourceRef}/hakaisatsu/recipes/scenarios.mjs`;
