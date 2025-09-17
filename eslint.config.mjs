import antfu from '@antfu/eslint-config'

export default antfu(
  {
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: false,
      objectCurlySpacing: true,
      arrayBracketSpacing: false,
      arrowParens: 'avoid',
      trailingComma: 'all',
      maxLineLength: 120,
      spaceBeforeFunctionParen: false,
      bracketSpacing: true,
      blockSpacing: true,
      keySpacing: true,
      commaDangle: 'always-multiline',
    },
  },
  {
    files: ['**/*.js', '**/*.ts'],
    rules: {
      'node/prefer-global/process': 'off',
      'no-console': 'off',
      'antfu/no-top-level-await': 'off',

      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'style/comma-spacing': ['error', { before: false, after: true }],
      'style/object-curly-newline': ['error', {
        multiline: true,
        consistent: true,
      }],
      'style/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      ],
    },
  },
)
