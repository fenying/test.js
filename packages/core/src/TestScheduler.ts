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

import * as NodeFS from 'node:fs/promises';
import * as NodeTest from 'node:test';
import * as NodePath from 'node:path';
import * as NodeTestReporters from 'node:test/reporters';
import { finished } from 'node:stream/promises';

export class TestScheduler {

    private _running: boolean = false;

    public constructor(
        private readonly _paths: string[],
        private readonly _filters: string[],
        private readonly _timeout: number,
        private readonly _defaultModuleTimeout: number,
        private readonly _defaultCaseTimeout: number,
    ) {

        if (Number.isFinite(this._timeout) && this._timeout < 1) {

            throw new Error('The timeout value must be a positive integer.');
        }

        if (Number.isFinite(this._defaultCaseTimeout) && this._defaultCaseTimeout < 1) {

            throw new Error('The default timeout for cases must be a positive integer.');
        }

        if (Number.isFinite(this._defaultModuleTimeout) && this._defaultModuleTimeout < 1) {

            throw new Error('The default timeout for modules must be a positive integer.');
        }
    }

    public async run(): Promise<void> {

        if (this._running) {

            throw new Error('The test scheduler is already running.');
        }

        this._running = true;

        try {

            const files = (await Promise.all(this._paths.map(i => this._scanTestFiles(i)))).flat(2);

            await this._execute(files);
        }
        finally {

            this._running = false;
        }
    }

    private _isValidTestFileName(file: string): boolean {

        return file.toLowerCase().endsWith('.test.js');
    }

    private async _scanTestFiles(rootPath: string): Promise<string[]> {

        if ((await NodeFS.stat(rootPath)).isFile()) {

            if (this._isValidTestFileName(rootPath)) {

                return [rootPath];
            }

            return [];
        }

        const items = await NodeFS.readdir(rootPath, { withFileTypes: true, recursive: true });

        const ret: string[] = [];

        for (const item of items) {

            if (!item.isFile()) {

                continue;
            }

            if (!this._isValidTestFileName(item.name)) {

                continue;
            }

            ret.push(NodePath.join(item.parentPath, item.name));
        }

        return ret;
    }

    private async _execute(files: string[]): Promise<void> {

        process.env.LITERT_TEST_FILTER = Buffer.from(JSON.stringify(this._filters)).toString('base64url');
        process.env.LITERT_TEST_MODULES_TIMEOUT = `${
            Number.isFinite(this._defaultModuleTimeout) ? this._defaultModuleTimeout : 0
        }`;
        process.env.LITERT_TEST_CASES_TIMEOUT = `${
            Number.isFinite(this._defaultCaseTimeout) ? this._defaultCaseTimeout : 0
        }`;

        await finished(
            NodeTest.run({
                files,
                timeout: this._timeout,
            })
                .compose(new NodeTestReporters.spec())
                .pipe(process.stdout)
        );
    }
}
