import { canonicalUrl, canonicalOrigin } from './site-urls.mjs';
const descriptions = {
  index: {
    en: ['Hakaisatsu — AI Agent Skill for Interactive Diagrams', 'Hakaisatsu is an MIT-licensed AI agent skill for validated HTML diagrams from descriptions or code, with interactive exploration and browser export.'],
    zh: ['Hakaisatsu — 用自然语言生成交互式图表', 'Hakaisatsu 是采用 MIT 许可证的 AI Agent 技能，可从自然语言或源码生成经过验证的独立 HTML 图表，支持交互探索与浏览器导出。'],
  },
  guide: {
    en: ['Hakaisatsu Scenario Guide — Choose the Right Diagram', 'Choose an Hakaisatsu diagram recipe for your question. Browse evidence checklists, use cases, boundaries, and prompts linked to the recipe source.'],
    zh: ['Hakaisatsu 场景指南 — 选择合适的图表', '从需要解释的问题出发选择图表配方，查看与 Hakaisatsu 配方源码一致的场景、证据清单、使用边界和可复制提示词。'],
  },
  start: {
    en: ['Hakaisatsu Start — Create Your First Diagram', 'Install Hakaisatsu for your AI agent and create a diagram from a description or code. Choose your agent, diagram type, and input to copy a command and prompt.'],
    zh: ['Hakaisatsu 快速上手 — 创建第一张图', '为你的 AI Agent 安装 Hakaisatsu 技能，从自然语言或代码仓库创建图表。选择 Agent、图表类型和输入方式，复制对应的命令与提示词。'],
  },
  gallery: {
    en: ['Hakaisatsu Proof Lab — Validated Diagram Gallery', 'Explore validated Hakaisatsu diagrams with interactive HTML, JSON sources, and recorded checks. Automated validation and human visual review appear separately.'],
    zh: ['Hakaisatsu 验证作品集 — 可探索的图表成品', '探索经过验证的 Hakaisatsu 图表，查看交互式 HTML 成品、对应 JSON 源码与检查记录。自动验证与人工视觉评审分别列出。'],
  },
  community: {
    en: ['Hakaisatsu Community — Packages Built on Hakaisatsu', 'Explore independent packages built on Hakaisatsu: skills, recipes, themes, locales, and CLI wrappers, with source, license, compatibility, and evidence.'],
    zh: ['Hakaisatsu 社区 — 基于 Hakaisatsu 的独立包', '浏览基于 Hakaisatsu 的独立社区包，包括技能、配方、主题、语言包与 CLI 封装，并查看源码、许可证、兼容性和验证证据。'],
  },
};
export function pageMetadata(page, lang, version) {
  const [title, description] = descriptions[page][lang];
  const canonical = canonicalUrl(page, lang);
  return { title, description, canonical, image: `${canonicalOrigin}/assets/hakaisatsu-social-preview.png`,
    schema: { '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebSite', '@id': `${canonicalOrigin}/#website`, url: `${canonicalOrigin}/`, name: 'Hakaisatsu', inLanguage: ['en', 'zh-Hans'] },
      { '@type': 'SoftwareSourceCode', '@id': `${canonicalOrigin}/#source`, name: 'Hakaisatsu', codeRepository: 'https://github.com/thomasardi/hakaisatsu', url: 'https://github.com/thomasardi/hakaisatsu', license: 'https://github.com/thomasardi/hakaisatsu/blob/main/LICENSE', version, programmingLanguage: 'JavaScript', description: descriptions.index[lang][1] },
    ] },
  };
}
