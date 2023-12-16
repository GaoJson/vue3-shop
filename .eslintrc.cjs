/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // 自定义你的规则
    'no-console': 'off',
    // js 和 ts 的规则重合
    'no-undef': 'off',
    // @typescript-eslint
    '@typescript-eslint/prefer-optional-chain': 'off',
    // vue
    'vue/no-duplicate-attributes': [
      'error',
      {
        allowCoexistClass: true,
        allowCoexistStyle: true,
      },
    ],
  },
}
