"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Builder_1 = require("../boc/Builder");
const Cell_1 = require("../boc/Cell");
const MessageRelaxed_1 = require("./MessageRelaxed");
describe('MessageRelaxed', () => {
    it('should parse message relaxed', () => {
        const state = 'te6ccsEBAgEAkQA3kQFoYgBgSQkXjXbkhpC1sju4zUJsLIAoavunKbfNsPFbk9jXL6BfXhAAAAAAAAAAAAAAAAAAAQEAsA+KfqUAAAAAAAAAAEO5rKAIAboVCXedy2J0RCseg4yfdNFtU8/BfiaHVEPkH/ze1W+fABicYUqh1j9Lnqv9ZhECm0XNPaB7/HcwoBb3AJnYYfqByAvrwgCqR2XE';
        const cell = Cell_1.Cell.fromBoc(Buffer.from(state, 'base64'))[0];
        const relaxed = (0, MessageRelaxed_1.loadMessageRelaxed)(cell.beginParse());
        let stored = (0, Builder_1.beginCell)()
            .store((0, MessageRelaxed_1.storeMessageRelaxed)(relaxed))
            .endCell();
        expect(stored.equals(cell)).toBe(true);
    });
    it('should store exotic message relaxed', () => {
        let boc = 'te6cckEBBgEApwAJRgMNtncFfUUJSR6XK02Y/bjHpB1pj8VtOlnKAxgDtajfKgACASIFgZABAwIoSAEBN4Yioo+yQnBEkgpN5SV1lnSGuoJhL3ShCi0dcMHbuFcAACIBIAUEAE2/fOtFTZyY8zlmFJ8dch//XZQ4QApiXOGPZXvjFv5j0LSgZ7ckWPAoSAEBr+h0Em3TbCgl+CpPMKKoQskNFu4vLU/8w4Zuaz7PRP8AAOG0rdg=';
        let cell = Cell_1.Cell.fromBase64(boc);
        let payload = (0, Builder_1.beginCell)().store((0, MessageRelaxed_1.storeMessageRelaxed)({
            body: cell,
            info: {
                createdAt: 0,
                createdLt: 0n,
                type: 'external-out',
                dest: null,
                src: null,
            }
        })).endCell();
    });
});
