module.exports = {
    printWidth: 100,
    endOfLine: 'auto',
    tabWidth: 4,
    singleQuote: true,
    semi: true,
    trailingComma: 'es5',
    arrowParens: 'always',
    overrides: [
        {
            files: '*.{js,jsx,tsx,ts,scss,json,html}',
            options: {
                tabWidth: 4,
            },
        },
    ],
};
