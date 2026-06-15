/** Token build script (`npm run tokens:build`): reads `tokens.json`, emits the committed `tokens.css` + `generated.ts`. */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const tokensPath = resolve(here, 'tokens.json');
const cssOutPath = resolve(here, 'tokens.css');
const tsOutPath = resolve(here, 'generated.ts');

type TokenTree = Record<string, unknown>;

/** Resolve a `{primitive.color.accent.500}` reference against the tree, recursing when a resolved value is itself a reference. */
const resolveReference = (value: string, tree: TokenTree): string => {
  const referenceMatch = /^\{([^}]+)\}$/.exec(value);
  if (!referenceMatch) return value;
  const path = referenceMatch[1].split('.');
  let current: unknown = tree;
  for (const segment of path) {
    if (current && typeof current === 'object' && segment in current) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      throw new Error(`Unresolved token reference: {${referenceMatch[1]}}`);
    }
  }

  if (typeof current !== 'string') {
    throw new Error(`Token reference {${referenceMatch[1]}} did not resolve to a string`);
  }

  return resolveReference(current, tree);
};

/** Flatten a nested token object to `[--ds-cssName, value]` pairs (e.g. `space.025` becomes `--ds-space-025`). */
const flatten = (
  subtree: TokenTree,
  prefix: string[],
  tree: TokenTree,
): Array<[string, string]> => {
  const pairs: Array<[string, string]> = [];
  for (const [key, value] of Object.entries(subtree)) {
    if (key.startsWith('$')) continue;
    const next = [...prefix, key];

    if (typeof value === 'string') {
      pairs.push([`--ds-${next.join('-')}`, resolveReference(value, tree)]);
    } else if (value && typeof value === 'object') {
      pairs.push(...flatten(value as TokenTree, next, tree));
    }
  }

  return pairs;
};

const renderBlock = (selector: string, pairs: Array<[string, string]>): string => {
  const lines = pairs.map(([name, value]) => `  ${name}: ${value};`);

  return `${selector} {\n${lines.join('\n')}\n}`;
};

/** Strip the theme axis from semantic-color names (the selector already differentiates themes): `semantic-color-light-bg-page` becomes `color-bg-page`. */
const rewriteSemantic = (name: string): string =>
  name
    .replace(/^--ds-semantic-color-(light|dark)-/, '--ds-color-')
    .replace(/^--ds-primitive-/, '--ds-primitive-');

const tokens = JSON.parse(readFileSync(tokensPath, 'utf8')) as TokenTree;

const allPairs = flatten(tokens, [], tokens);

const lightSemantic = allPairs
  .filter(([name]) => name.startsWith('--ds-semantic-color-light-'))
  .map(([name, value]) => [rewriteSemantic(name), value] as [string, string]);

const darkSemantic = allPairs
  .filter(([name]) => name.startsWith('--ds-semantic-color-dark-'))
  .map(([name, value]) => [rewriteSemantic(name), value] as [string, string]);

const lightShadow = allPairs
  .filter(([name]) => name.startsWith('--ds-shadow-light-'))
  .map(([name, value]) => [name.replace('-light-', '-'), value] as [string, string]);

const darkShadow = allPairs
  .filter(([name]) => name.startsWith('--ds-shadow-dark-'))
  .map(([name, value]) => [name.replace('-dark-', '-'), value] as [string, string]);

const themeAgnostic = allPairs.filter(
  ([name]) =>
    !name.startsWith('--ds-semantic-color-') &&
    !name.startsWith('--ds-shadow-light-') &&
    !name.startsWith('--ds-shadow-dark-'),
);

const css = `/**
 * AUTO-GENERATED, do not edit by hand.
 * Regenerate with \`npm run tokens:build\` after editing tokens.json.
 */

${renderBlock(':root', [...themeAgnostic, ...lightSemantic, ...lightShadow])}

${renderBlock('[data-theme="dark"]', [...darkSemantic, ...darkShadow])}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${[...darkSemantic, ...darkShadow].map(([n, v]) => `    ${n}: ${v};`).join('\n')}
  }
}
`;

writeFileSync(cssOutPath, css);

const tsLines: string[] = [
  '/**',
  ' * AUTO-GENERATED, do not edit by hand.',
  ' * Regenerate with `npm run tokens:build` after editing tokens.json.',
  ' */',
  '',
  'export const tokens = {',
];

const tsNames = [...new Set([
  ...themeAgnostic.map(([name]) => name),
  ...lightSemantic.map(([name]) => name),
  ...lightShadow.map(([name]) => name),
])];

for (const name of tsNames) {
  const camel = name
    .replace(/^--ds-/, '')
    .replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase());
  tsLines.push(`  ${JSON.stringify(camel)}: 'var(${name})',`);
}

tsLines.push('} as const;');
tsLines.push('');
tsLines.push('export type TokenName = keyof typeof tokens;');
tsLines.push('');

writeFileSync(tsOutPath, tsLines.join('\n'));

console.log(`Wrote ${cssOutPath}`);
console.log(`Wrote ${tsOutPath}`);
console.log(`Generated ${tsNames.length} tokens.`);
