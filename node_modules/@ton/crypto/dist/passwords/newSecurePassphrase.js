"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.newSecurePassphrase = void 0;
const __1 = require("..");
async function newSecurePassphrase(size = 6) {
    return (await (0, __1.newSecureWords)(size)).join('-');
}
exports.newSecurePassphrase = newSecurePassphrase;
