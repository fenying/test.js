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
