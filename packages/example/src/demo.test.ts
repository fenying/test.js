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
    name: 'Demo Test Module',
})
export default class TestDemo {

    @Test.Case({
        name: 'Demo Test Case',
    })
    public async testDemo() {

        Asserts.equal(1, 1);
        Asserts.notEqual(1, 2);
        Asserts.ok('123');
    }
}
