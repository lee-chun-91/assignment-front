module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    indent: ['error', 2], // tab size 2
    'object-curly-spacing': ['error', 'always'], // 중괄호 내 공백
    semi: [2, 'always'], // 세미콜론
    quotes: ['error', 'single', { allowTemplateLiterals: true }], // 싱글쿼트, 템플릿리터럴 허용,
    'jsx-quotes': ['error', 'prefer-double'], // jsx 내에서는 더블쿼트
    '@typescript-eslint/no-non-null-assertion': 'off' // ! 사용에 대한 허용
  }
};
