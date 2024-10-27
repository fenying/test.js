// eslint.config.js
const LitertEslintRules = require('@litert/eslint-plugin-rules');

module.exports = [
    ...LitertEslintRules.configs.typescript,
    {
        plugins: {
            '@litert/rules': LitertEslintRules,
        },
        files: [
            'packages/core/src/**/*.ts',
            'packages/cli/src/**/*.ts',
        ],
        languageOptions: {
            parserOptions: {
                project: [
                    'packages/core/tsconfig.json',
                    'packages/cli/tsconfig.json',
                ],
                tsconfigRootDir: __dirname,
            },
        }
    }
];
