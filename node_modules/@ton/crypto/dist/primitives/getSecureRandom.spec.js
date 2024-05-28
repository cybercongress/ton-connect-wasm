"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe('getSecureRandom', () => {
    it('should generate correct numbers', async () => {
        for (let i = 0; i < 1000; i++) {
            let r = await (0, __1.getSecureRandomNumber)(0, 10);
            expect(r).toBeGreaterThanOrEqual(0);
            expect(r).toBeLessThan(10);
        }
    });
});
