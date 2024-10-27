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
import { TestScheduler } from '@litert/test';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { parseArgs } from './Clap';

(async () => {

    const clArgs = parseArgs();

    if (!clArgs) {

        return;
    }

    if (!clArgs.flags['no-coverage']) {

        const p = spawn(process.argv[0], [
            '--experimental-test-coverage',
            '--enable-source-maps',
            ...process.argv.slice(1, 4),
            '--no-coverage',
            ...process.argv.slice(4),
        ], {
            stdio: 'inherit' as any
        });

        await once(p, 'close');

        return 0;
    }

    const scheduler = new TestScheduler(
        clArgs.arguments.length ? clArgs.arguments : ['.'],
        clArgs.options['filter'] ?? [],
        Number.isSafeInteger(parseInt(clArgs.options['timeout']?.[0] ?? '')) ?
            parseInt(clArgs.options['timeout'][0]) : Infinity,
        Number.isSafeInteger(parseInt(clArgs.options['default-module-timeout']?.[0] ?? '')) ?
            parseInt(clArgs.options['default-module-timeout'][0]) : Infinity,
        Number.isSafeInteger(parseInt(clArgs.options['default-case-timeout']?.[0] ?? '')) ?
            parseInt(clArgs.options['default-case-timeout'][0]) : Infinity,
    );

    await scheduler.run();

    return 0;

})().catch(console.error);
