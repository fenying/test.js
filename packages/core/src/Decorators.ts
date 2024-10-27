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

/* eslint-disable @typescript-eslint/naming-convention */
import $Reflect from '@litert/reflect';
import * as $D from '@litert/decorator';
import * as iL from './Internal';
import type * as dL from './Decl';
import { TestRunner } from './Runner';
import { EHooks } from './Constants';

/**
 * Mark a class as a test module.
 *
 * @param opts  The options for the module.
 */
export function Module(opts: Partial<dL.IModuleOptions> = {}): $D.IClassDecorator {

    return $D.default.createClassDecorator((ctor) => {

        setImmediate(() => {

            // eslint-disable-next-line no-console
            new TestRunner(ctor, opts).run().catch(console.error);
        });
    });
}

/**
 * Mark a method as a test case.
 *
 * @param opts  The options for the case.
 */
export function Case(opts: Partial<dL.ICaseOptions> = {}): $D.IMethodDecorator {

    return $Reflect.metadata(iL.META_CASE, opts);
}

/**
 * Mark a method as a `BEFORE_EACH` hook, which will be triggered before each test case.
 *
 * > Can't work together with `Case` decorator.
 *
 * > The only argument will be passed to the decorated method is a value of type
 * > `Record<'method' | 'name' | 'notes', string>`, which contains the information of the current
 * > test case.
 *
 * @param opts  The options for the hook.
 */
export function BeforeEach(opts?: Omit<dL.IHooksOptions, 'type'>): $D.IMethodDecorator {

    return $Reflect.metadata(iL.META_HOOK, {
        ...opts,
        'type': EHooks.BEFORE_EACH,
    } satisfies dL.IHooksOptions);
}

/**
 * Mark a method as a `BEFORE_ALL` hook, which will be triggered before testing this class.
 *
 * > Can't work together with `Case` decorator.
 *
 * @param opts  The options for the hook.
 */
export function BeforeAll(opts?: Omit<dL.IHooksOptions, 'type'>): $D.IMethodDecorator {

    return $Reflect.metadata(iL.META_HOOK, {
        ...opts,
        'type': EHooks.BEFORE_ALL,
    } satisfies dL.IHooksOptions);
}

/**
 * Mark a method as a `AFTER_EACH` hook, which will be triggered after each test case.
 *
 * > Can't work together with `Case` decorator.
 *
 * > The only argument will be passed to the decorated method is a value of type
 * > `Record<'method' | 'name' | 'notes', string>`, which contains the information of the current
 * > test case.
 *
 * @param opts  The options for the hook.
 */
export function AfterEach(opts?: Omit<dL.IHooksOptions, 'type'>): $D.IMethodDecorator {

    return $Reflect.metadata(iL.META_HOOK, {
        ...opts,
        'type': EHooks.AFTER_EACH,
    } satisfies dL.IHooksOptions);
}

/**
 * Mark a method as a `AFTER_ALL` hook, which will be triggered after testing this class.
 *
 * > Can't work together with `Case` decorator.
 *
 * @param opts  The options for the hook.
 */
export function AfterAll(opts?: Omit<dL.IHooksOptions, 'type'>): $D.IMethodDecorator {

    return $Reflect.metadata(iL.META_HOOK, {
        ...opts,
        'type': EHooks.AFTER_ALL,
    } satisfies dL.IHooksOptions);
}
