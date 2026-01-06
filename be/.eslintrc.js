module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2022,
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended-type-checked', 'plugin:@typescript-eslint/stylistic-type-checked', 'plugin:prettier/recommended'],
  root: true,
  env: {
    es2022: true,
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    'no-shadow': 'off',
    "prettier/prettier": ["error", {
      "endOfLine": "auto"
    }
    ],

  },

  // rules: {
  //   'import/extensions': [
  //     'error',
  //     'ignorePackages',
  //     {
  //       js: 'never',
  //       ts: 'never',
  //       json: 'never',
  //     },
  //   ],
  // },
};