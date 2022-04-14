const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);

module.exports = {
  extends: [
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['prettier', 'react-hooks'],
  rules: {
    'prettier/prettier': ['error', prettierOptions],
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
        'prettier/prettier': ['warn', prettierOptions],
        'no-underscore-dangle': ['error', { allow: ['_t'] }],
        '@typescript-eslint/naming-convention': ['warn'],
        '@typescript-eslint/no-unused-vars': ['error'],
        '@typescript-eslint/no-non-null-assertion': ['off'],
        'import/prefer-default-export': ['off'],
        'import/no-unresolved': ['off'],
        'no-param-reassign': ['error', { props: false }],
        'consistent-return': ['off'],
        '@typescript-eslint/explicit-module-boundary-types': ['off'],
        '@typescript-eslint/indent': ['off'],
      },
    },
    {
      files: ['**/*.stories.*'],
      rules: {
        'import/no-anonymous-default-export': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true },
        ],
      },
    },
  ],
};