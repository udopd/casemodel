import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const SRC_ROOT = path.resolve(process.cwd(), 'src');

const LAYER_ORDER = [
  'core/schema',
  'core/ports',
  'core/validators',
  'core/layout',
  'core/generators',
  'core/engine',
  'core',
  'application',
  'store',
  'adapters',
  'workers',
  'i18n',
  'components',
  'app',
];

const LAYER_RULES = {
  'core/schema': {
    allowedLayers: new Set(['core/schema']),
    allowedPackages: new Set(['zod']),
    pureGlobalsOnly: true,
  },
  'core/ports': {
    allowedLayers: new Set(['core/schema', 'core/ports']),
    allowedPackages: new Set([]),
    pureGlobalsOnly: true,
  },
  'core/validators': {
    allowedLayers: new Set(['core/schema', 'core/ports', 'core/validators']),
    allowedPackages: new Set([]),
    pureGlobalsOnly: true,
  },
  'core/layout': {
    allowedLayers: new Set(['core/schema', 'core/ports', 'core/layout']),
    allowedPackages: new Set([]),
    pureGlobalsOnly: true,
  },
  'core/generators': {
    allowedLayers: new Set(['core/schema', 'core/ports', 'core/layout', 'core/generators']),
    allowedPackages: new Set([]),
    pureGlobalsOnly: true,
  },
  'core/engine': {
    allowedLayers: new Set([
      'core/schema',
      'core/ports',
      'core/validators',
      'core/layout',
      'core/generators',
      'core/engine',
    ]),
    allowedPackages: new Set([]),
    pureGlobalsOnly: true,
  },
  core: {
    allowedLayers: new Set([
      'core/schema',
      'core/ports',
      'core/validators',
      'core/layout',
      'core/generators',
      'core/engine',
      'core',
    ]),
    allowedPackages: new Set([]),
    pureGlobalsOnly: true,
  },
  application: {
    allowedLayers: new Set([
      'core/schema',
      'core/ports',
      'core/validators',
      'core/layout',
      'core/generators',
      'core/engine',
      'core',
      'application',
    ]),
    forbiddenPackages: new Set(['react', 'react-dom', 'next', 'zustand', 'zundo']),
    forbiddenPackagePrefixes: ['next/', '@xyflow/'],
  },
  store: {
    allowedLayers: new Set([
      'core/schema',
      'core/ports',
      'core/validators',
      'core/layout',
      'core/generators',
      'core/engine',
      'core',
      'application',
      'store',
    ]),
    forbiddenPackages: new Set(['react-dom', 'next']),
    forbiddenPackagePrefixes: ['next/', '@xyflow/'],
  },
  adapters: {
    allowedLayers: new Set([
      'core/schema',
      'core/ports',
      'core/validators',
      'core/layout',
      'core/generators',
      'core/engine',
      'core',
      'adapters',
    ]),
  },
  workers: {
    allowedLayers: new Set([
      'core/schema',
      'core/ports',
      'core/validators',
      'core/layout',
      'core/generators',
      'core/engine',
      'core',
      'adapters',
      'workers',
    ]),
    forbiddenPackages: new Set(['react', 'react-dom', 'next']),
    forbiddenPackagePrefixes: ['next/', '@xyflow/'],
  },
  i18n: {
    allowedLayers: new Set(['core/schema', 'core/ports', 'core/validators', 'i18n']),
    forbiddenPackages: new Set(['react', 'react-dom', 'next', 'zustand', 'zundo']),
  },
  components: {
    allowedLayers: new Set([
      'core/schema',
      'core/ports',
      'core/layout',
      'core/generators',
      'core/validators',
      'store',
      'i18n',
      'components',
    ]),
  },
  app: {
    allowedLayers: new Set(LAYER_ORDER),
  },
};

const FORBIDDEN_CORE_IDENTIFIERS = new Set([
  'window',
  'document',
  'globalThis',
  'navigator',
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'fetch',
  'XMLHttpRequest',
  'WebSocket',
  'Worker',
  'crypto',
  'Date',
  'performance',
  'setTimeout',
  'setInterval',
  'requestAnimationFrame',
  'cancelAnimationFrame',
]);

function walkTsFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkTsFiles(fullPath));
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

export function getLayerForRelativePath(relPath) {
  const normalized = relPath.split(path.sep).join('/');
  for (const layer of LAYER_ORDER) {
    if (normalized === layer || normalized.startsWith(`${layer}/`)) {
      return layer;
    }
  }
  return null;
}

function resolveImportTarget(fromFile, specifier, srcRoot = SRC_ROOT) {
  if (specifier.startsWith('@/')) {
    const rel = specifier.slice(2);
    return { kind: 'internal', layer: getLayerForRelativePath(rel), rel };
  }
  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    const targetAbs = path.resolve(path.dirname(fromFile), specifier);
    const rel = path.relative(srcRoot, targetAbs).split(path.sep).join('/');
    if (rel.startsWith('..')) {
      return { kind: 'outside-src', rel };
    }
    return { kind: 'internal', layer: getLayerForRelativePath(rel), rel };
  }
  return { kind: 'external', pkg: specifier };
}

function collectModuleSpecifiers(sourceFile) {
  const specifiers = [];
  function visit(node) {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      specifiers.push(node.moduleSpecifier.text);
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      specifiers.push(node.moduleSpecifier.text);
    } else if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === 'require')) &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      specifiers.push(node.arguments[0].text);
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return specifiers;
}

function collectBindingNames(bindingName, targetSet) {
  if (ts.isIdentifier(bindingName)) {
    targetSet.add(bindingName.text);
  } else if (ts.isObjectBindingPattern(bindingName) || ts.isArrayBindingPattern(bindingName)) {
    for (const element of bindingName.elements) {
      if (ts.isBindingElement(element)) {
        collectBindingNames(element.name, targetSet);
      }
    }
  }
}

function collectScopeBindings(node) {
  const names = new Set();
  if (ts.isFunctionLike(node)) {
    for (const param of node.parameters) {
      collectBindingNames(param.name, names);
    }
  }
  if (ts.isBlock(node) || ts.isSourceFile(node)) {
    for (const stmt of node.statements) {
      if (ts.isVariableStatement(stmt)) {
        for (const decl of stmt.declarationList.declarations) {
          collectBindingNames(decl.name, names);
        }
      } else if (ts.isFunctionDeclaration(stmt) && stmt.name) {
        names.add(stmt.name.text);
      }
    }
  }
  if (ts.isForStatement(node) || ts.isForOfStatement(node) || ts.isForInStatement(node)) {
    if (node.initializer && ts.isVariableDeclarationList(node.initializer)) {
      for (const decl of node.initializer.declarations) {
        collectBindingNames(decl.name, names);
      }
    }
  }
  return names;
}

function checkTypingAndPurity(sourceFile, relFile, sourceText, pureGlobalsOnly) {
  const errors = [];
  if (/@ts-ignore\b|@ts-nocheck\b/.test(sourceText)) {
    errors.push(`${relFile}: @ts-ignore and @ts-nocheck are forbidden.`);
  }

  function visit(node, scopeStack) {
    if (node.kind === ts.SyntaxKind.AnyKeyword) {
      errors.push(`${relFile}: explicit any type is forbidden.`);
    }

    const ownBindings = collectScopeBindings(node);
    const nextStack = ownBindings.size > 0 ? [...scopeStack, ownBindings] : scopeStack;

    if (pureGlobalsOnly) {
      if (
        ts.isPropertyAccessExpression(node) &&
        node.expression.getText(sourceFile) === 'Math' &&
        node.name.text === 'random'
      ) {
        errors.push(`${relFile}: Math.random() is forbidden in src/core.`);
      }

      if (ts.isIdentifier(node) && FORBIDDEN_CORE_IDENTIFIERS.has(node.text)) {
        const parent = node.parent;
        const isDeclarationOrProperty =
          (ts.isPropertyAssignment(parent) && parent.name === node) ||
          (ts.isPropertySignature(parent) && parent.name === node) ||
          (ts.isPropertyAccessExpression(parent) && parent.name === node) ||
          (ts.isMethodSignature(parent) && parent.name === node) ||
          (ts.isMethodDeclaration(parent) && parent.name === node) ||
          (ts.isParameter(parent) && parent.name === node) ||
          (ts.isVariableDeclaration(parent) && parent.name === node) ||
          ts.isImportSpecifier(parent) ||
          ts.isTypeAliasDeclaration(parent) ||
          ts.isInterfaceDeclaration(parent);

        const isShadowed = nextStack.some((scope) => scope.has(node.text));
        if (!isDeclarationOrProperty && !isShadowed) {
          errors.push(`${relFile}: forbidden ambient/browser identifier "${node.text}" in src/core.`);
        }
      }
    }

    ts.forEachChild(node, (child) => visit(child, nextStack));
  }

  visit(sourceFile, []);
  return errors;
}

export function checkSourceTree({ srcRoot = SRC_ROOT, filesContent } = {}) {
  const violations = [];
  const entries = filesContent
    ? Object.entries(filesContent).map(([rel, text]) => ({
        abs: path.resolve(srcRoot, rel),
        rel: rel.split(path.sep).join('/'),
        text,
      }))
    : walkTsFiles(srcRoot).map((abs) => ({
        abs,
        rel: path.relative(srcRoot, abs).split(path.sep).join('/'),
        text: fs.readFileSync(abs, 'utf8'),
      }));

  for (const file of entries) {
    const layer = getLayerForRelativePath(file.rel);
    if (!layer) continue;

    const rules = LAYER_RULES[layer];
    const sourceFile = ts.createSourceFile(
      file.abs,
      file.text,
      ts.ScriptTarget.ES2022,
      true,
      file.rel.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );

    violations.push(...checkTypingAndPurity(sourceFile, file.rel, file.text, Boolean(rules.pureGlobalsOnly)));

    const specifiers = collectModuleSpecifiers(sourceFile);
    for (const spec of specifiers) {
      const resolved = resolveImportTarget(file.abs, spec, srcRoot);
      if (resolved.kind === 'outside-src') {
        violations.push(`${file.rel}: import "${spec}" escapes src/ boundary.`);
        continue;
      }
      if (resolved.kind === 'internal') {
        if (!resolved.layer) {
          violations.push(`${file.rel}: import "${spec}" targets unknown src layer.`);
          continue;
        }
        if (!rules.allowedLayers.has(resolved.layer)) {
          violations.push(
            `${file.rel}: layer "${layer}" cannot import "${spec}" (layer "${resolved.layer}").`,
          );
        }
        continue;
      }
      if (resolved.kind === 'external') {
        if (rules.allowedPackages && !rules.allowedPackages.has(resolved.pkg)) {
          violations.push(
            `${file.rel}: layer "${layer}" cannot import external package "${resolved.pkg}".`,
          );
        }
        if (rules.forbiddenPackages && rules.forbiddenPackages.has(resolved.pkg)) {
          violations.push(
            `${file.rel}: layer "${layer}" cannot import forbidden package "${resolved.pkg}".`,
          );
        }
        if (
          rules.forbiddenPackagePrefixes &&
          rules.forbiddenPackagePrefixes.some((prefix) => resolved.pkg.startsWith(prefix))
        ) {
          violations.push(
            `${file.rel}: layer "${layer}" cannot import forbidden package "${resolved.pkg}".`,
          );
        }
      }
    }
  }

  return violations;
}

const isDirectExecution =
  Boolean(process.argv[1]) &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectExecution) {
  const violations = checkSourceTree();
  if (violations.length > 0) {
    console.error('Import boundary check failed:');
    for (const v of violations) {
      console.error(`  - ${v}`);
    }
    process.exit(1);
  }
  console.log('Import boundary check passed.');
}
