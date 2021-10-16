module.exports = {
    // 使用 4 个空格缩进
    tabWidth: 2,
    // 不使用缩进符，而使用空格
    useTabs: false,
    semi: true,
    singleQuote: true,
    overrides: [
    // 使用css/html的规则格式化wxss/wxml
        {
            files: '*.wxss',
            options: {
                parser: 'css',
            },
        },
        {
            files: '*.wxml',
            options: {
                parser: 'html',
            },
        },
    ],
};
