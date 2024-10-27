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

import $Reflect from '@litert/reflect';
import * as NodeTest from 'node:test';
import * as iL from './Internal';
import * as cL from './Constants';
import type * as dL from './Decl';
import { EHooks } from './Constants';
import { StringFilterGroup } from './Filter';

interface ICase extends Required<dL.ICaseOptions> {

    skipped: boolean;
}

type IHook = Required<dL.IHooksOptions>;

type IModuleInfo = Required<dL.IModuleOptions>;

export class TestRunner {

    private readonly _module: IModuleInfo;

    private readonly _cases: Record<string, ICase> = {};

    private readonly _hooks: Record<EHooks, Record<string, IHook>> = {
        [EHooks.BEFORE_ALL]: {},
        [EHooks.BEFORE_EACH]: {},
        [EHooks.AFTER_ALL]: {},
        [EHooks.AFTER_EACH]: {},
    };

    private _filter!: StringFilterGroup;

    public constructor(
        private readonly _ctor: dL.ITestConstructor,
        opts: dL.IModuleOptions,
    ) {

        const defaultModuleTimeout = /^\d+$/.test(process.env.LITERT_TEST_MODULES_TIMEOUT ?? '') ?
            (parseInt(process.env.LITERT_TEST_MODULES_TIMEOUT!) || Infinity) : Infinity;

        const defaultCaseTimeout = /^\d+$/.test(process.env.LITERT_TEST_CASES_TIMEOUT ?? '') ?
            (parseInt(process.env.LITERT_TEST_CASES_TIMEOUT!) || Infinity) : Infinity;

        const defaultForceQuitTimeout = /^\d+$/.test(process.env.LITERT_TEST_FORCE_QUIT_TIMEOUT ?? '') ?
            (parseInt(process.env.LITERT_TEST_CASES_TIMEOUT!) || 5000) : 5000;

        this._module = {
            'name': opts.name ?? _ctor.name,
            'timeout': typeof opts.timeout === 'number' && !Number.isNaN(opts.timeout) && opts.timeout > 0 ?
                opts.timeout : defaultModuleTimeout,
            'defaultCaseTimeout': opts.defaultCaseTimeout ?? defaultCaseTimeout,
            'forceQuitTimeout': opts.forceQuitTimeout ?? defaultForceQuitTimeout,
        };

        this._init();
    }

    public async run(): Promise<void> {

        const ctor = this._ctor;
        const obj = ctor[cL.CLASS_FACTORY_METHOD_NAME] ? await ctor[cL.CLASS_FACTORY_METHOD_NAME]() : new ctor();

        const isFileSkipped = Object.values(this._cases).every(i => i.skipped);

        let timeout = false;

        if (Number.isFinite(this._module.timeout) && this._module.timeout > 0) {

            setTimeout(() => { timeout = true; }, this._module.timeout);
        }

        try {

            await NodeTest.test(this._module.name, {
                'skip': isFileSkipped,
                'timeout': this._module.timeout,
            }, async (ctx) => {

                for (const [method] of Object.entries(this._hooks[EHooks.BEFORE_ALL])) {

                    const pH = obj[method](ctx);

                    if (pH instanceof Promise) {

                        await pH;
                    }
                }

                for (const [method, caseOpts] of Object.entries(this._cases)) {

                    const testOpts = {
                        'todo': caseOpts.todo ? `TODO: ${caseOpts.todo}` : false,
                        'timeout': caseOpts.timeout,
                        'skip': caseOpts.skipped,
                    };

                    if (timeout) {

                        caseOpts.notes += ' [TIMEOUT]';
                        testOpts.skip = true;
                    }

                    await ctx.test(caseOpts.notes, testOpts, async (ctx) => {

                        if (caseOpts.mocks.timer) {

                            ctx.mock.timers.enable(caseOpts.mocks.timer === true ? {
                                'apis': ['Date', 'setInterval', 'setTimeout'],
                                'now': new Date().getTime(),
                            } : {
                                'apis': caseOpts.mocks.timer.apis,
                                'now': caseOpts.mocks.timer.now
                            });
                        }

                        for (const [method] of Object.entries(this._hooks[EHooks.BEFORE_EACH])) {

                            const pH = obj[method](ctx, caseOpts.name);

                            if (pH instanceof Promise) {

                                await pH;
                            }
                        }

                        const pM = obj[method](ctx);

                        if (pM instanceof Promise) {

                            await pM;
                        }

                        for (const [method] of Object.entries(this._hooks[EHooks.AFTER_EACH])) {

                            const pH = obj[method](ctx, caseOpts.name);

                            if (pH instanceof Promise) {

                                await pH;
                            }
                        }
                    });
                }

                for (const [method] of Object.entries(this._hooks[EHooks.AFTER_ALL])) {

                    const pH = obj[method](ctx);

                    if (pH instanceof Promise) {

                        await pH;
                    }
                }
            });
        }
        finally {

            setTimeout(() => {
                // eslint-disable-next-line no-console
                console.warn(`[WARNING] The test module '${this._module.name}' can not quit correctly, forcedly killed.`);
                process.exit(0);
            }, this._module.forceQuitTimeout).unref();
        }
    }

    private _init(): void {

        if (process.env.LITERT_TEST_FILTER) {

            const filters: string[] = JSON.parse(Buffer.from(process.env.LITERT_TEST_FILTER, 'base64url').toString());

            this._filter = StringFilterGroup.build(filters);
        }
        else {

            this._filter = StringFilterGroup.build([]);
        }

        const hooks: Record<string, IHook> = {};

        for (const method of Object.getOwnPropertyNames(this._ctor.prototype)) {

            if (typeof this._ctor.prototype[method] !== 'function') {

                continue;
            }

            const caseOpts: Partial<dL.ICaseOptions> = $Reflect.getMethodMetadata(this._ctor, method, iL.META_CASE);

            const hookOpts: dL.IHooksOptions = $Reflect.getMethodMetadata(this._ctor, method, iL.META_HOOK);

            if (hookOpts) {

                if (caseOpts) {

                    throw new TypeError(`The method '${method}' in class '${this._ctor.name}' cannot be both a case and a hook.`);
                }

                hooks[method] = { 'tags': hookOpts.tags ?? [], type: hookOpts.type };

                continue;
            }

            if (!caseOpts) {

                continue;
            }

            if (this._ctor.prototype[method].length > 1) {

                throw new TypeError(`Invalid test method '${method}' in class '${this._ctor.name}'.`);
            }

            const caseInfo: ICase = {
                'name': caseOpts.name ?? method,
                'notes': caseOpts.notes ?? caseOpts.name ?? method,
                'tags': caseOpts.tags ?? [],
                'mocks': caseOpts.mocks ?? {},
                'todo': caseOpts.todo ?? false,
                'timeout': typeof caseOpts.timeout === 'number' && !Number.isNaN(caseOpts.timeout) ?
                    caseOpts.timeout : this._module.defaultCaseTimeout,
                'skipped': false,
            };

            caseInfo.skipped = !this._filter.test({
                'tags': caseInfo.tags,
                'name': caseInfo.name,
                'notes': caseInfo.notes,
                'module': this._module.name,
                'file': process.argv[1],
            });

            this._cases[method] = caseInfo;
        }

        for (const [method, hook] of Object.entries(hooks)) {

            this._hooks[hook.type][method] = hook;
        }
    }
}
