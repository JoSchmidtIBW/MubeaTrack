import * as assert from 'assert';

import { sum } from '../app.mjs';

describe('Test the sum method in Test server.mjs', function () {
  it('should return 3 --> (1+2=3)', function () {
    assert.equal(sum(1, 2), 3);
  });
});
