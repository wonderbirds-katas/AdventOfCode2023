import "chai/register-should";
import { config } from "chai";
config.truncateThreshold = 0;

it('should fail', () => {
    const actual = false;
    actual.should.be.true;
});
