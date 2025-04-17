import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      react: pluginReact,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-param-reassign': ['error', { props: false }],
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
    },
  },
  {
    files: ['webpack.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: globals.node,
    },
    rules: {},
  },
  {
    ignores: ['node_modules/', 'dist/', 'build/'],
  },
]);
