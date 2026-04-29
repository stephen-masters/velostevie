import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'

export default [
  js.configs.recommended,
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    arrowParens: false,
    braceStyle: '1tbs',
    commaDangle: 'never'
  }),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        L: 'readonly'
      }
    },
    rules: {
      '@stylistic/space-before-function-paren': ['error', { named: 'never', anonymous: 'always', asyncArrow: 'always' }],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before' } }],
      '@stylistic/max-statements-per-line': 'off',
      'no-unused-vars': ['error', { vars: 'all', args: 'after-used', argsIgnorePattern: '^_', caughtErrors: 'none', ignoreRestSiblings: true }]
    }
  },
  {
    ignores: [
      'node_modules/**'
    ]
  }
]
