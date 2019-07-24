module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  plugins: [
    'vue'
  ],
  rules: {
    // "off"或者0，不启用这个规则
    // "warn"或者1，出现问题会有警告
    // "error"或者2，出现问题会报错
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-unused-vars': 0,
    "no-useless-rename": [2, {
      "ignoreDestructuring": false,
      "ignoreImport": false,
      "ignoreExport": false
    }],
    "vue/html-self-closing": 0,
    // "vue/attributes-order": 0,
    // "vue/html-quotes": [2, "double" | "single"],
    "vue/html-closing-bracket-newline": [2, {
      "singleline": "never",
      "multiline": "never"
    }],
    "vue/max-attributes-per-line": [2, {
      "singleline": 3,
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      }
    }],
    "vue/no-parsing-error": 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
