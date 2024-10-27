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

import * as Test from '.';
import { StringFilter, StringFilterGroup, StringFilterItem } from './Filter';

@Test.Module({ name: '@litert/test - Filter' })
export class FilterTest {

    @Test.Case({ name: 'Test operator ^=' })
    public testOperatorStartsWith(): void {

        const item = StringFilterItem.compile('name^=Abc');

        Test.Asserts.equal(item.varName, 'name');
        Test.Asserts.equal(item.operator, '^=');
        Test.Asserts.equal(item.expected, true);

        Test.Asserts.equal(item.expected, item.test('abc'), );
        Test.Asserts.equal(item.expected, item.test('ABC'), );
        Test.Asserts.equal(item.expected, item.test('abcd'), );
        Test.Asserts.equal(item.expected, item.test('AbCd'), );
        Test.Asserts.notEqual(item.expected, item.test('ab'), );
        Test.Asserts.notEqual(item.expected, item.test('1abc1'), );
        Test.Asserts.notEqual(item.expected, item.test('1abc'), );
        Test.Asserts.notEqual(item.expected, item.test(''), );
    }

    @Test.Case({ name: 'Test operator ^!' })
    public testOperatorNotStartsWith(): void {

        const item = StringFilterItem.compile('hello^!Abc');

        Test.Asserts.equal(item.varName, 'hello');
        Test.Asserts.equal(item.operator, '^!');
        Test.Asserts.equal(item.expected, false);

        Test.Asserts.equal(item.expected, item.test('abc'), );
        Test.Asserts.equal(item.expected, item.test('ABC'), );
        Test.Asserts.equal(item.expected, item.test('abcd'), );
        Test.Asserts.equal(item.expected, item.test('AbCd'), );
        Test.Asserts.notEqual(item.expected, item.test('ab'), );
        Test.Asserts.notEqual(item.expected, item.test('1abc1'), );
        Test.Asserts.notEqual(item.expected, item.test('1abc'), );
        Test.Asserts.notEqual(item.expected, item.test(''), );
    }

    @Test.Case({ name: 'Test operator $=' })
    public testOperatorEndsWith(): void {

        const item = StringFilterItem.compile('name$=Abc');

        Test.Asserts.equal(item.varName, 'name');
        Test.Asserts.equal(item.operator, '$=');
        Test.Asserts.equal(item.expected, true);

        Test.Asserts.equal(item.expected, item.test('abc'), );
        Test.Asserts.equal(item.expected, item.test('ABC'), );
        Test.Asserts.equal(item.expected, item.test('1abc'), );
        Test.Asserts.equal(item.expected, item.test('1AbC'), );
        Test.Asserts.notEqual(item.expected, item.test('bc'), );
        Test.Asserts.notEqual(item.expected, item.test('abc1'), );
        Test.Asserts.notEqual(item.expected, item.test('1abc1'), );
        Test.Asserts.notEqual(item.expected, item.test(''), );
    }

    @Test.Case({ name: 'Test operator $!' })
    public testOperatorNotEndsWith(): void {

        const item = StringFilterItem.compile('s$!Abc');

        Test.Asserts.equal(item.varName, 's');
        Test.Asserts.equal(item.operator, '$!');
        Test.Asserts.equal(item.expected, false);

        Test.Asserts.equal(item.expected, item.test('abc'), );
        Test.Asserts.equal(item.expected, item.test('ABC'), );
        Test.Asserts.equal(item.expected, item.test('1abc'), );
        Test.Asserts.equal(item.expected, item.test('1AbC'), );
        Test.Asserts.notEqual(item.expected, item.test('bc'), );
        Test.Asserts.notEqual(item.expected, item.test('abc1'), );
        Test.Asserts.notEqual(item.expected, item.test('1abc1'), );
        Test.Asserts.notEqual(item.expected, item.test(''), );
    }

    @Test.Case({ name: 'Test operator ==' })
    public testOperatorEquals(): void {

        const item = StringFilterItem.compile('a==Abc');

        Test.Asserts.equal(item.varName, 'a');
        Test.Asserts.equal(item.operator, '==');
        Test.Asserts.equal(item.expected, true);

        Test.Asserts.equal(item.expected, item.test('abc'), );
        Test.Asserts.equal(item.expected, item.test('ABC'), );
        Test.Asserts.notEqual(item.expected, item.test('1abc'), );
        Test.Asserts.notEqual(item.expected, item.test('1AbC'), );
        Test.Asserts.notEqual(item.expected, item.test('bc'), );
        Test.Asserts.notEqual(item.expected, item.test('abc1'), );
        Test.Asserts.notEqual(item.expected, item.test('1abc1'), );
        Test.Asserts.notEqual(item.expected, item.test(''), );
    }

    @Test.Case({ name: 'Test operator !=' })
    public testOperatorNotEquals(): void {

        const item = StringFilterItem.compile('a!=Abc');

        Test.Asserts.equal(item.varName, 'a');
        Test.Asserts.equal(item.operator, '!=');
        Test.Asserts.equal(item.expected, false);

        Test.Asserts.equal(item.expected, item.test('abc'), );
        Test.Asserts.equal(item.expected, item.test('ABC'), );
        Test.Asserts.notEqual(item.expected, item.test('1abc'), );
        Test.Asserts.notEqual(item.expected, item.test('1AbC'), );
        Test.Asserts.notEqual(item.expected, item.test('bc'), );
        Test.Asserts.notEqual(item.expected, item.test('abc1'), );
        Test.Asserts.notEqual(item.expected, item.test('1abc1'), );
        Test.Asserts.notEqual(item.expected, item.test(''), );
    }

    @Test.Case({ name: 'Test operator ~=' })
    public testOperatorMatchRegExp(): void {

        const item = StringFilterItem.compile('a~=i[123]{2,4}$');

        Test.Asserts.equal(item.varName, 'a');
        Test.Asserts.equal(item.operator, '~=');
        Test.Asserts.equal(item.expected, true);

        Test.Asserts.equal(item.expected, item.test('i11'));
        Test.Asserts.equal(item.expected, item.test('i112'));
        Test.Asserts.equal(item.expected, item.test('i1123'));
        Test.Asserts.equal(item.expected, item.test('fi1123'));
        Test.Asserts.equal(item.expected, item.test('fi123'));
        Test.Asserts.equal(item.expected, item.test('fi13'));

        Test.Asserts.notEqual(item.expected, item.test('i11f'));
        Test.Asserts.notEqual(item.expected, item.test('i112f'));
        Test.Asserts.notEqual(item.expected, item.test('i1123f'));
        Test.Asserts.notEqual(item.expected, item.test('fi1123f'));
        Test.Asserts.notEqual(item.expected, item.test('fi123f'));
        Test.Asserts.notEqual(item.expected, item.test('fi13f'));

        Test.Asserts.throws(() => {
            StringFilterItem.compile('a~=i[123](');
        }, 'For invalid regex should throw an error');
    }

    @Test.Case({ name: 'Test operator ~!' })
    public testOperatorNotMatchRegExp(): void {

        const item = StringFilterItem.compile('a~!i[123]{2,4}$');

        Test.Asserts.equal(item.varName, 'a');
        Test.Asserts.equal(item.operator, '~!');
        Test.Asserts.equal(item.expected, false);

        Test.Asserts.equal(item.expected, item.test('i11'));
        Test.Asserts.equal(item.expected, item.test('i112'));
        Test.Asserts.equal(item.expected, item.test('i1123'));
        Test.Asserts.equal(item.expected, item.test('fi1123'));
        Test.Asserts.equal(item.expected, item.test('fi123'));
        Test.Asserts.equal(item.expected, item.test('fi13'));

        Test.Asserts.notEqual(item.expected, item.test('i11f'));
        Test.Asserts.notEqual(item.expected, item.test('i112f'));
        Test.Asserts.notEqual(item.expected, item.test('i1123f'));
        Test.Asserts.notEqual(item.expected, item.test('fi1123f'));
        Test.Asserts.notEqual(item.expected, item.test('fi123f'));
        Test.Asserts.notEqual(item.expected, item.test('fi13f'));

        Test.Asserts.throws(() => {
            StringFilterItem.compile('a~!i[123](');
        }, 'For invalid regex should throw an error');
    }

    @Test.Case({ name: 'Test operator *=' })
    public testOperatorContains(): void {

        const item = StringFilterItem.compile('a*=Abc');

        Test.Asserts.equal(item.varName, 'a');
        Test.Asserts.equal(item.operator, '*=');
        Test.Asserts.equal(item.expected, true);

        Test.Asserts.equal(item.expected, item.test('abc'), );
        Test.Asserts.equal(item.expected, item.test('ABC'), );
        Test.Asserts.equal(item.expected, item.test('1abc'), );
        Test.Asserts.equal(item.expected, item.test('1AbC'), );
        Test.Asserts.equal(item.expected, item.test('abc1'), );
        Test.Asserts.equal(item.expected, item.test('1abc1'), );
        Test.Asserts.equal(item.expected, item.test('1ABC1'), );
        Test.Asserts.equal(item.expected, item.test('1AbC1'), );
        Test.Asserts.equal(item.expected, item.test('1aBC1'), );
        Test.Asserts.notEqual(item.expected, item.test('bc'), );
        Test.Asserts.notEqual(item.expected, item.test('ab'), );
        Test.Asserts.notEqual(item.expected, item.test('ab-c'), );
        Test.Asserts.notEqual(item.expected, item.test('a-bc'), );
        Test.Asserts.notEqual(item.expected, item.test('a-b-c'), );
        Test.Asserts.notEqual(item.expected, item.test('a_b_c'), );
        Test.Asserts.notEqual(item.expected, item.test('a b c'), );
        Test.Asserts.notEqual(item.expected, item.test(''), );
    }

    @Test.Case({ name: 'Test operator *!' })
    public testOperatorNotContains(): void {

        const item = StringFilterItem.compile('a*!Abc');

        Test.Asserts.equal(item.varName, 'a');
        Test.Asserts.equal(item.operator, '*!');
        Test.Asserts.equal(item.expected, false);

        Test.Asserts.equal(item.expected, item.test('abc'), );
        Test.Asserts.equal(item.expected, item.test('ABC'), );
        Test.Asserts.equal(item.expected, item.test('1abc'), );
        Test.Asserts.equal(item.expected, item.test('1AbC'), );
        Test.Asserts.equal(item.expected, item.test('abc1'), );
        Test.Asserts.equal(item.expected, item.test('1abc1'), );
        Test.Asserts.equal(item.expected, item.test('1ABC1'), );
        Test.Asserts.equal(item.expected, item.test('1AbC1'), );
        Test.Asserts.equal(item.expected, item.test('1aBC1'), );
        Test.Asserts.notEqual(item.expected, item.test('bc'), );
        Test.Asserts.notEqual(item.expected, item.test('ab'), );
        Test.Asserts.notEqual(item.expected, item.test('ab-c'), );
        Test.Asserts.notEqual(item.expected, item.test('a-bc'), );
        Test.Asserts.notEqual(item.expected, item.test('a-b-c'), );
        Test.Asserts.notEqual(item.expected, item.test('a_b_c'), );
        Test.Asserts.notEqual(item.expected, item.test('a b c'), );
        Test.Asserts.notEqual(item.expected, item.test(''), );
    }

    @Test.Case({ name: 'Array with positive filter should pass if any element matches' })
    public testArrayWithPositiveFilter(): void {

        const item = StringFilterItem.compile('name^=Abc');

        Test.Asserts.equal(item.expected, true);

        Test.Asserts.equal(item.expected, item.testArray(['123', 'abc', '456']));
        Test.Asserts.equal(item.expected, item.testArray(['123', 'Abc', '456']));
        Test.Asserts.equal(item.expected, item.testArray(['123', 'ABC', '456']));
        Test.Asserts.equal(item.expected, item.testArray(['123', 'ABCd', '456']));
        Test.Asserts.equal(item.expected, item.testArray(['123', 'ABCe', '456']));
        Test.Asserts.notEqual(item.expected, item.testArray([]));
        Test.Asserts.notEqual(item.expected, item.testArray(['123']));
        Test.Asserts.notEqual(item.expected, item.testArray(['123', 'ab']));
        Test.Asserts.notEqual(item.expected, item.testArray(['123', 'abd']));
        Test.Asserts.notEqual(item.expected, item.testArray(['123', 'ab_c']));
    }

    @Test.Case({ name: 'Array with negative filter should reject if any element matches' })
    public testArrayWithNegativeFilter(): void {

        const item = StringFilterItem.compile('name^!Abc');

        Test.Asserts.equal(item.expected, false);

        Test.Asserts.equal(item.expected, item.testArray(['123', 'abc', '456']));
        Test.Asserts.equal(item.expected, item.testArray(['123', 'Abc', '456']));
        Test.Asserts.equal(item.expected, item.testArray(['123', 'ABC', '456']));
        Test.Asserts.equal(item.expected, item.testArray(['123', 'ABCd', '456']));
        Test.Asserts.equal(item.expected, item.testArray(['123', 'ABCe', '456']));
        Test.Asserts.notEqual(item.expected, item.testArray([]));
        Test.Asserts.notEqual(item.expected, item.testArray(['123']));
        Test.Asserts.notEqual(item.expected, item.testArray(['123', 'ab']));
        Test.Asserts.notEqual(item.expected, item.testArray(['123', 'abd']));
        Test.Asserts.notEqual(item.expected, item.testArray(['123', 'ab_c', '你好']));
    }

    @Test.Case({ name: 'Invalid operator should trigger an error' })
    public testInvalidOperator(): void {

        Test.Asserts.throws(() => {

            StringFilterItem.compile('a=!Abc');
        });
    }

    @Test.Case({ name: 'Invalid expression should trigger an error' })
    public testInvalidExpression(): void {

        for (const expr of [
            'a-s!=ffff', 'a!=', '!=ffff', '!=', ''
        ]) {

            Test.Asserts.throws(() => {

                StringFilterItem.compile(expr);

            }, `For expr "${expr}", an SyntaxError should be thrown.`);
        }
    }

    @Test.Case({ name: 'Mixed filter expressions should work with AND relationship' })
    public testFilter(): void {

        const filter = StringFilter.compile('tag==abc && file*=/User');

        Test.Asserts.equal(true, filter.test({
            tag: ['abc'],
            file: '/api/Users/abc'
        }));

        Test.Asserts.equal(false, filter.test({
            tag: ['abcd'],
            file: '/api/Users/abc'
        }));

        Test.Asserts.equal(false, filter.test({
            tag: ['abc'],
            file: '/Use/abc'
        }));

        Test.Asserts.equal(false, filter.test({
            file: '/User/abc'
        }));

        Test.Asserts.equal(false, filter.test({
            file: '/User/abc',
            tag: []
        }));
    }

    @Test.Case({ name: 'Multiple filters should work as OR relationship' })
    public testMultipleFilter(): void {

        const group = StringFilterGroup.build([
            'tag==abc && file*=/User',
            'name*!def && file*=/Device'
        ]);

        Test.Asserts.equal(true, group.test({
            tag: ['abc'],
            file: '/api/Users/abc',
            name: 'hello',
        }));

        Test.Asserts.equal(true, group.test({
            tag: ['s'],
            file: '/api/Device/abc',
            name: 'hello',
        }));

        Test.Asserts.equal(true, group.test({
            tag: ['abc'],
            file: ['/api/Users/abc', '/api/Devices/abc'],
            name: 'hello-def',
        }));

        Test.Asserts.equal(true, group.test({
            tag: ['abcd'],
            file: ['/api/Users/abc', '/api/Devices/abc'],
            name: 'hello',
        }));

        Test.Asserts.equal(false, group.test({
            tag: ['s'],
            file: '/api/Device/abc',
            name: 'hello-def-s',
        }));

        Test.Asserts.equal(false, group.test({
            tag: ['s'],
            file: ['/api/Users/abc', '/api/Device/abc'],
            name: 'hello-def-s',
        }));

        Test.Asserts.equal(false, group.test({}));
    }
}
