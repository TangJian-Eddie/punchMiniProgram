module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    plugins: ['prettier'],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    globals: {
        __DEV__: true,
        __WECHAT__: true,
        __ALIPAY__: true,
        __wxConfig: true,
        App: true,
        Page: true,
        Component: true,
        Behavior: true,
        wx: true,
        getApp: true,
        getCurrentPages: true,
    },
    rules: {
        'linebreak-style': ['error', 'unix'], //换行样式
        quotes: ['error', 'single', { avoidEscape: true }], //单引号
        semi: ['error', 'always'], //分号
        'no-mixed-spaces-and-tabs': [2, false], //禁止混用tab和空格
        'object-curly-spacing': [0, 'never'], //大括号内是否允许不必要的空格
        'no-multiple-empty-lines': [2, { max: 2, },], // 不允许多个空行
        'brace-style': [2, '1tbs', { allowSingleLine: true, },], // if while function 后面的{必须与if在同一行，java风格。
        'no-redeclare': 2, //禁止重复声明变量
        'no-trailing-spaces': 1, //一行结束后面不要有空格
        'no-unused-vars': [2, { vars: 'all', args: 'none' }], //不能有声明后未被使用的变量或参数
        'default-case': 2, //switch语句最后必须有default
        'prefer-const': 2, //未被赋值的常量 使用const
        'template-curly-spacing': 1, //强制使用大括号内的间距 Bad: {people.name} 正确{ people.name }
        'array-bracket-spacing': [2, 'never'], //是否允许非空数组里面有多余的空格 Bad:[ 'foo', 'bar' ] Good:['foo', 'bar'];
        'key-spacing': [2, { beforeColon: false, afterColon: true, },], //冒号前后的空格
    },
};

