import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(skillRoot, '..');

const readmeLanguages = [
  {
    file: 'README.md',
    href: './README.md',
    label: 'English',
    demos: '## See Hakaisatsu in action',
    preview: '## Preview',
    quickStart: '## Quick start',
    contributing: '## Contributing',
    noRepository: /No repository is required/,
  },
  {
    file: 'README_EN.md',
    href: './README.md',
    label: 'English',
    demos: '## See Hakaisatsu in action',
    preview: '## Preview',
    quickStart: '## Quick start',
    contributing: '## Contributing',
    noRepository: /No repository is required/,
  },
  {
    file: 'README_ZH.md',
    href: './README_ZH.md',
    label: '简体中文',
    demos: '## 看看 Hakaisatsu 能做什么',
    preview: '## 预览',
    quickStart: '## 快速开始',
    contributing: '## 参与贡献',
    noRepository: /不需要绑定代码库/,
  },
  {
    file: 'README_JA.md',
    href: './README_JA.md',
    label: '日本語',
    demos: '## 実際の Hakaisatsu',
    preview: '## プレビュー',
    quickStart: '## クイックスタート',
    contributing: '## コントリビュート',
    noRepository: /リポジトリは不要です/,
  },
];

function sectionIndex(readme, filename, heading) {
  const index = readme.indexOf(heading);
  assert.ok(index >= 0, `${filename}: section heading ${heading} is missing`);
  return index;
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

function writeStarHistoryCharts(cwd, version) {
  const assets = path.join(cwd, 'assets');
  fs.mkdirSync(assets, { recursive: true });
  fs.writeFileSync(path.join(assets, 'star-history-light.svg'), `<svg><title>light ${version}</title></svg>\n`);
  fs.writeFileSync(path.join(assets, 'star-history-dark.svg'), `<svg><title>dark ${version}</title></svg>\n`);
}

test('every README header links to the other languages', () => {
  const languageLinks = [];
  for (const { href, label } of readmeLanguages) {
    if (!languageLinks.some((entry) => entry.href === href)) languageLinks.push({ href, label });
  }
  for (const language of readmeLanguages) {
    const readme = fs.readFileSync(path.join(repoRoot, language.file), 'utf8');
    const header = readme.slice(0, sectionIndex(readme, language.file, language.demos));
    for (const { href, label } of languageLinks) {
      const anchor = `<a href="${href}"><strong>${label}</strong></a>`;
      if (href === language.href) {
        assert.ok(!header.includes(anchor), `${language.file}: header must not link its own language`);
      } else {
        assert.ok(header.includes(anchor), `${language.file}: header must link ${label} (${href})`);
      }
    }
  }
});

test('all README languages show the brand mark and hero', () => {
  for (const language of readmeLanguages) {
    const filename = language.file;
    const readme = fs.readFileSync(path.join(repoRoot, filename), 'utf8');
    const markIndex = readme.indexOf('docs/assets/hakaisatsu-lockup-light.svg');
    const heroPath = 'docs/assets/hakaisatsu-readme-hero.png';
    const heroIndex = readme.indexOf(heroPath);
    const taglineEnd = readme.indexOf('</h3>');
    assert.equal(readme.split(heroPath).length - 1, 1, `${filename}: hero must appear exactly once`);
    assert.ok(markIndex < taglineEnd && taglineEnd < heroIndex, `${filename}: hero must follow the logo and tagline`);
    assert.ok(heroIndex < readme.indexOf('<strong>', taglineEnd), `${filename}: hero must precede navigation`);
    assert.match(readme.slice(taglineEnd + 5), /^\s*<p align="center"><img src="docs\/assets\/hakaisatsu-readme-hero\.png"/);
    const demosIndex = sectionIndex(readme, filename, language.demos);
    assert.ok(markIndex >= 0 && markIndex < demosIndex, `${filename}: brand lockup is missing before the demos`);
    assert.ok(!readme.includes('docs/assets/hakaisatsu-live-proof.gif'), `${filename}: obsolete preview remains`);
    assert.match(readme, filename === 'README_ZH.md'
      ? /https:\/\/thomasardi\.github\.io\/hakaisatsu\/zh\/gallery(?=[?#)"])/
      : /https:\/\/thomasardi\.github\.io\/hakaisatsu\/gallery\.html/);
  }
  assert.equal(
    fs.readFileSync(path.join(repoRoot, 'README.md'), 'utf8'),
    fs.readFileSync(path.join(repoRoot, 'README_EN.md'), 'utf8'),
    'README.md and README_EN.md must stay synchronized',
  );
});

test('README installation tables contain a complete DeepSeek Harness row', () => {
  for (const { file: filename } of readmeLanguages) {
    const readme = fs.readFileSync(path.join(repoRoot, filename), 'utf8');
    const row = readme.split('\n').find((line) => line.startsWith('| **DeepSeek Harness** |'));
    assert.ok(row, `${filename}: DeepSeek Harness must be an installation table row`);
    assert.equal(
      (row.match(/(?<!\\)\|/g) || []).length,
      4,
      `${filename}: DeepSeek Harness must have exactly three table cells`,
    );
    assert.ok(
      row.includes('Node `^22.19.0 \\|\\| >=24.0.0`'),
      `${filename}: Node version pipes must be escaped inside the table row`,
    );
    assert.ok(
      readme.includes(`${row}\n\n`),
      `${filename}: installation table must end after the DeepSeek Harness row`,
    );
  }
});

test('README installation tables include Hermes Agent before DeepSeek Harness', () => {
  for (const { file: filename } of readmeLanguages) {
    const readme = fs.readFileSync(path.join(repoRoot, filename), 'utf8');
    const hermes = readme.split('\n').find((line) => line.startsWith('| **Hermes Agent** |'));
    const dsh = readme.split('\n').find((line) => line.startsWith('| **DeepSeek Harness** |'));
    assert.ok(hermes, `${filename}: Hermes Agent must be an installation table row`);
    assert.ok(dsh, `${filename}: DeepSeek Harness must remain an installation table row`);
    assert.equal(
      (hermes.match(/(?<!\\)\|/g) || []).length,
      4,
      `${filename}: Hermes Agent must have exactly three table cells`,
    );
    assert.ok(hermes.includes('Node `>=18`'), `${filename}: Hermes Agent must name Node >=18`);
    assert.ok(
      hermes.includes('hermes skills install skills-sh/thomasardi/hakaisatsu/hakaisatsu -y'),
      `${filename}: Hermes Agent must document the skills.sh install identifier`,
    );
    assert.ok(readme.indexOf(hermes) < readme.indexOf(dsh), `${filename}: Hermes Agent must precede DeepSeek Harness`);
  }
});

test('README demos use checked-in captures and live deep links below the existing hero', () => {
  const demos = [
    {
      asset: 'hakaisatsu-demo-reach.png',
      link: 'agent-tool-call.workflow.html?theme=dark&present=1#focus=planner&reach=downstream',
    },
    {
      asset: 'hakaisatsu-demo-route.png',
      link: 'cache-miss.sequence.html?theme=dark&present=1#route=web~db',
    },
    {
      asset: 'hakaisatsu-demo-lens.png',
      link: 'production-deployment.architecture.html?theme=dark&present=1#lens=backend~database',
    },
  ];

  for (const demo of demos) {
    const buffer = fs.readFileSync(path.join(repoRoot, 'docs', 'assets', demo.asset));
    assert.equal(buffer.subarray(1, 4).toString('ascii'), 'PNG', `${demo.asset}: invalid PNG signature`);
    assert.equal(buffer.readUInt32BE(16), 1280, `${demo.asset}: unexpected width`);
    assert.equal(buffer.readUInt32BE(20), 720, `${demo.asset}: unexpected height`);
    assert.ok(buffer.byteLength < 400 * 1024, `${demo.asset}: capture is too large`);
  }

  for (const language of readmeLanguages) {
    const filename = language.file;
    const readme = fs.readFileSync(path.join(repoRoot, filename), 'utf8');
    const markIndex = readme.indexOf('docs/assets/hakaisatsu-lockup-light.svg');
    const previewIndex = sectionIndex(readme, filename, language.preview);
    const demosIndex = sectionIndex(readme, filename, language.demos);
    const quickStartIndex = sectionIndex(readme, filename, language.quickStart);
    assert.ok(markIndex >= 0 && markIndex < demosIndex, `${filename}: brand mark must precede the demos`);
    assert.ok(demosIndex < previewIndex && previewIndex < quickStartIndex, `${filename}: demo section is misplaced`);
    for (const demo of demos) {
      assert.match(readme, new RegExp(`docs/assets/${demo.asset.replaceAll('.', '\\.')}`));
      assert.ok(readme.includes(demo.link), `${filename}: missing ${demo.link}`);
    }
  }
});

test('README preserves the visual proof set and key content', () => {
  const commonAssets = [
    'hakaisatsu-lockup-light.svg',
    'hakaisatsu-lockup-dark.svg',
    'hakaisatsu-readme-hero.png',
    'hakaisatsu-demo-reach.png',
    'hakaisatsu-demo-route.png',
    'hakaisatsu-demo-lens.png',
    'mco-runtime-share-card.png',
    'hakaisatsu-dark.png',
    'hakaisatsu-light.png',
    'hakaisatsu-menu.png',
    'hakaisatsu-workflow.png',
    'hakaisatsu-sequence.png',
    'hakaisatsu-dataflow.png',
    'hakaisatsu-lifecycle.png',
  ];

  for (const { file: filename, noRepository } of readmeLanguages) {
    const readme = fs.readFileSync(path.join(repoRoot, filename), 'utf8');
    assert.match(readme, noRepository, `${filename}: the no-repository entry point is missing`);
    for (const asset of commonAssets) {
      assert.ok(readme.includes(`docs/assets/${asset}`), `${filename}: visual proof ${asset} was removed`);
    }
  }

});

test('all README languages end with the self-hosted star history chart', () => {
  const lightChart = 'https://raw.githubusercontent.com/thomasardi/hakaisatsu/star-history/assets/star-history-light.svg';
  const darkChart = 'https://raw.githubusercontent.com/thomasardi/hakaisatsu/star-history/assets/star-history-dark.svg';
  const workflow = fs.readFileSync(path.join(repoRoot, '.github', 'workflows', 'star-history.yml'), 'utf8');

  for (const language of readmeLanguages) {
    const filename = language.file;
    const readme = fs.readFileSync(path.join(repoRoot, filename), 'utf8');
    const starHistoryIndex = readme.lastIndexOf('## Star History');
    const contributingIndex = sectionIndex(readme, filename, language.contributing);
    assert.ok(starHistoryIndex > contributingIndex, `${filename}: Star History must follow Contributing`);
    assert.ok(readme.includes(lightChart), `${filename}: missing light star history chart`);
    assert.ok(readme.includes(darkChart), `${filename}: missing dark star history chart`);
    assert.equal(readme.trimEnd().endsWith('</p>'), true, `${filename}: Star History must remain the final section`);
  }

  assert.match(workflow, /permissions:\n  contents: write/);
  assert.match(workflow, /narayann7\/star-history-action@[0-9a-f]{40}/);
  // Upstream PR #6 migrates setup-node to Node 24 without the v1.0.6 chart changes.
  assert.match(workflow, /narayann7\/star-history-action@00dfada13f106e4114ee46728aa415857078e76c\s/);
  assert.match(workflow, /output-dir: assets/);
  assert.match(workflow, /update-readme: ['"]false['"]/);
  assert.match(workflow, /commit: ['"]false['"]/);
  assert.match(workflow, /bash scripts\/publish-star-history\.sh star-history/);
  assert.doesNotMatch(workflow, /branch: star-history/);
  assert.doesNotMatch(workflow, /xpzouying\/star-history/);
});

test('Star History publishing advances the data branch without a force push', () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'hakaisatsu-star-history-'));
  const remote = path.join(fixture, 'remote.git');
  const firstCheckout = path.join(fixture, 'first');
  const secondCheckout = path.join(fixture, 'second');
  const publisher = path.join(repoRoot, 'scripts', 'publish-star-history.sh');

  try {
    git(fixture, 'init', '--bare', remote);
    git(fixture, '--git-dir', remote, 'config', 'receive.denyNonFastForwards', 'true');
    git(fixture, '--git-dir', remote, 'config', 'receive.denyDeletes', 'true');

    fs.mkdirSync(firstCheckout);
    git(firstCheckout, 'init', '-b', 'main');
    git(firstCheckout, 'config', 'user.name', 'Fixture');
    git(firstCheckout, 'config', 'user.email', 'fixture@example.com');
    fs.writeFileSync(path.join(firstCheckout, 'README.md'), 'fixture\n');
    git(firstCheckout, 'add', 'README.md');
    git(firstCheckout, 'commit', '-m', 'seed');
    git(firstCheckout, 'remote', 'add', 'origin', remote);
    git(firstCheckout, 'push', '-u', 'origin', 'main');

    const firstTemp = path.join(fixture, 'run-1');
    fs.mkdirSync(firstTemp);
    writeStarHistoryCharts(firstCheckout, 'v1');
    execFileSync('bash', [publisher, 'star-history'], {
      cwd: firstCheckout,
      env: { ...process.env, RUNNER_TEMP: firstTemp },
    });
    const firstCommit = git(fixture, '--git-dir', remote, 'rev-parse', 'refs/heads/star-history');

    git(fixture, 'clone', '--branch', 'main', remote, secondCheckout);
    const secondTemp = path.join(fixture, 'run-2');
    fs.mkdirSync(secondTemp);
    writeStarHistoryCharts(secondCheckout, 'v2');
    execFileSync('bash', [publisher, 'star-history'], {
      cwd: secondCheckout,
      env: { ...process.env, RUNNER_TEMP: secondTemp },
    });
    const secondCommit = git(fixture, '--git-dir', remote, 'rev-parse', 'refs/heads/star-history');

    assert.notEqual(secondCommit, firstCommit);
    git(fixture, '--git-dir', remote, 'merge-base', '--is-ancestor', firstCommit, secondCommit);
    assert.deepEqual(
      git(fixture, '--git-dir', remote, 'ls-tree', '-r', '--name-only', secondCommit).split('\n'),
      ['assets/star-history-dark.svg', 'assets/star-history-light.svg'],
    );
    assert.match(
      git(fixture, '--git-dir', remote, 'show', `${secondCommit}:assets/star-history-light.svg`),
      /light v2/,
    );
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});
