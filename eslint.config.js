import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      react: reactPlugin,
    },
    rules: {
      'no-param-reassign': ['error', { props: false }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
