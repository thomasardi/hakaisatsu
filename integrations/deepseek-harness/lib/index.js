import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

export const name = 'hakaisatsu-dsh';
export const PACKAGE_NAME = '@thomasardi/hakaisatsu-dsh';

export function resolveHakaisatsuSkillRoot(profileBaseUrl) {
  if (!profileBaseUrl) {
    throw new Error('hakaisatsu-dsh: missing DSH profile baseUrl for package resolution');
  }
  let manifestPath;
  try {
    manifestPath = createRequire(profileBaseUrl).resolve(`${PACKAGE_NAME}/package.json`);
  } catch (error) {
    throw new Error(
      `hakaisatsu-dsh: cannot resolve ${PACKAGE_NAME}/package.json from the DSH profile`,
      { cause: error },
    );
  }
  return join(dirname(manifestPath), 'skills');
}
