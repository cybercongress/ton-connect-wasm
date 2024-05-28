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
describe('newSecurePassword', () => {
    it('should generate password', async () => {
        let pass = await (0, __1.newSecureWords)();
        expect(pass.length).toBe(6);
    });
});
