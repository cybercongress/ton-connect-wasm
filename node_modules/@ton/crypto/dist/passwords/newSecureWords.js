"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.newSecureWords = void 0;
const getSecureRandom_1 = require("../primitives/getSecureRandom");
const wordlist_1 = require("./wordlist");
async function newSecureWords(size = 6) {
    let words = [];
    for (let i = 0; i < size; i++) {
        words.push(wordlist_1.wordlist[await (0, getSecureRandom_1.getSecureRandomNumber)(0, wordlist_1.wordlist.length)]);
    }
    return words;
}
exports.newSecureWords = newSecureWords;
