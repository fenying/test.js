/**
 * Copyright 2024 Angus.Fenying <fenying@litert.org>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
