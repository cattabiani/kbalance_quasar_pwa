import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import prettierSkipFormatting from 'eslint-config-prettier';
import globals from 'globals';

import quasarConfig from '@quasar/app-vite/eslint';

export default [
  {
    // add all "global" files here (files not tied to a specific plugin)
    ignores: ['dist/**', 'src-capacitor/**', 'src-cordova/**', '.quasar/**'],
  },

  ...quasarConfig.configs.recommended(),

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ga: 'readonly',
        cordova: 'readonly',
        __statics: 'readonly',
        __QUASAR_SSR__: 'readonly',
        __QUASAR_SSR_SERVER__: 'readonly',
        __QUASAR_SSR_CLIENT__: 'readonly',
        __QUASAR_SSR_PWA__: 'readonly',
        process: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly',
      },
    },

    rules: {
      'prefer-promise-reject-errors': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      // `_` is this codebase's convention for an intentionally-discarded
      // destructured value (e.g. `.filter(([_, value]) => ...)`)
      'no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_$', argsIgnorePattern: '^_$' },
      ],
    },
  },

  {
    // .vue files: let the Vue-aware rule handle unused vars, since it
    // (unlike core no-unused-vars) knows about <script setup> bindings
    // that are only referenced from the <template>.
    files: ['**/*.vue'],
    rules: {
      'no-unused-vars': 'off',
      'vue/no-unused-vars': [
        'error',
        { ignorePattern: '^_$' },
      ],
    },
  },

  prettierSkipFormatting,
];
