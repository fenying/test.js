import type * as $D from '@litert/decorator';
import type { EHooks, CLASS_FACTORY_METHOD_NAME } from './Constants';

export interface ITestConstructor<T = any> extends $D.IClassCtor<T> {

    [CLASS_FACTORY_METHOD_NAME]?(): T | Promise<T>;
}

export interface IModuleOptions {

    /**
     * The name of the test module.
     *
     * @default The name of the class.
     */
    name?: string;

    /**
     * Timeouts for the whole module (in milliseconds).
     *
     * @default Specified by `--default-module-timeout`
     */
    timeout?: number;

    /**
     * Timeouts for each test case (in milliseconds).
     *
     * @default Specified by `--default-case-timeout`
     */
    defaultCaseTimeout?: number;

    /**
     * Timeout after all test cases are finished (in milliseconds).
     *
     * > In case of process-held by refCount.
     *
     * @default 5000
     */
    forceQuitTimeout?: number;
}

export interface ICaseOptions {

    /**
     * One line description of the test case.
     *
     * > Will be displayed in the test report.
     *
     * @default The name of the method.
     */
    name?: string;

    /**
     * Additional notes for the test case.
     *
     * @default Same as name
     */
    notes?: string;

    /**
     * The tags for the test case.
     *
     * > Can be used to selectively execute test cases.
     */
    tags?: string[];

    /**
     * Mark the test case as a TODO, which means it is not implemented yet.
     *
     * @default false
     */
    todo?: string | false;

    /**
     * The timeout for the test case (in milliseconds).
     *
     * @default `Module.defaultCaseTimeout` or `--default-case-timeout`
     */
    timeout?: number;

    /**
     * Setup the mocks for the test case.
     */
    mocks?: {

        /**
         * Enable the timer mocks.
         */
        timer?: boolean | {

            /**
             * The initial time of the timer mocks.
             *
             * @default Date.now()
             */
            now: number;

            /**
             * Which timer APIs to mock.
             *
             * @default ['setTimeout', 'setInterval', 'Date']
             */
            apis: Array<'setTimeout' | 'setInterval' | 'Date'>;
        };
    };
}

export interface IHooksOptions {

    /**
     * The type of the hook.
     */
    type: EHooks;

    /**
     * The tags for the hook.
     *
     * > Can be used to selectively execute hooks.
     *
     * @default []
     */
    tags?: string[];
}
