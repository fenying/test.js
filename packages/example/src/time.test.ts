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
