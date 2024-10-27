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
