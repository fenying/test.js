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

import type { TestContext } from 'node:test';

function immediate(): Promise<void> {

    return new Promise<void>((resolve) => {

        setImmediate(() => {

            resolve();
        });
    });
}

/**
 * Using the mocked timer APIs, to automatically trigger the pending timers (Timeout) until
 * the Promise is completed (resolved).
 *
 * > Mainly used for `setTimeout`.
 * > As for `setInterval`, you can use the `ctx.mock.timers.tick` method to control it.
 *
 * @param ctx   The test context
 * @param pr    The Promise to be waited
 * @returns     The Promise from the input
 */
export async function autoTick<T>(ctx: TestContext, pr: Promise<T>): Promise<T> {

    let done = false;

    (async () => {

        while (!done) {

            ctx.mock.timers.tick(10);
            await immediate();
        }

    // eslint-disable-next-line no-console
    })().catch(console.error);

    try {

        await pr;
    }
    catch {

        // do nothing
    }
    finally {

        done = true;
    }

    return pr;
}
