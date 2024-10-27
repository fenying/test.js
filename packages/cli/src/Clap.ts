/* eslint-disable no-console */
import * as LibClap from '@litert/clap';

export function parseArgs(): LibClap.IParseResult | null {

    const parser = LibClap.createHelper({
        'command': 'li-test',
        'description': 'A simple test kits for LiteRT.',
        'title': 'LiteRT Test Kit',
    });

    parser.addOption({
        name: 'filter',
        shortcut: 'f',
        description: 'The filters of test cases.',
        multiple: true,
    })
        .addOption({
            name: 'timeout',
            description: 'The timeout for the whole test execution. [Default: Infinity]',
        })
        .addOption({
            name: 'default-module-timeout',
            description: 'The default timeout for each module (file). [Default: Infinity]',
        })
        .addOption({
            name: 'default-case-timeout',
            description: 'The default timeout for each test case. [Default: Infinity]',
        })
        .addFlag({
            name: 'no-coverage',
            description: 'Don\'t add the coverage report flags of NodeJS.',
        });

    const ret = parser.parseAndProcess(process.argv.slice(2));

    if (Array.isArray(ret)) {

        console.info(ret.join('\n'));
        return null;
    }

    return ret;
}
