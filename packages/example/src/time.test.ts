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

import { Asserts } from "@litert/test";
import * as Test from '@litert/test';

@Test.Module({
    name: 'Demo Test With Timer Mocks',
})
export default class TestTimerMocks {

    @Test.Case({
        name: 'Demo for setTimeout',
        mocks: {
            'timer': {
                'apis': ['setTimeout', 'Date'],
                'now': 0,
            }
        }
    })
    public async testDemo(ctx: Test.TestContext) {

        Asserts.equal(Date.now(), 0);
        ctx.mock.timers.tick(1000);
        Asserts.equal(Date.now(), 1000);
    }
}
