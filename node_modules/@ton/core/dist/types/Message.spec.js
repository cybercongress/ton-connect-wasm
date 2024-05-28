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
const Message_1 = require("./Message");
describe('Message', () => {
    it('should handle edge case with extra currency', () => {
        const tx = 'te6cckEBBwEA3QADs2gB7ix8WDhQdzzFOCf6hmZ2Dzw2vFNtbavUArvbhXqqqmEAMpuMhx8zp7O3wqMokkuyFkklKpftc4Dh9_5bvavmCo-UXR6uVOIGMkCwAAAAAAC3GwLLUHl_4AYCAQCA_____________________________________________________________________________________gMBPAUEAwFDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAUACAAAAAAAAAANoAAAAAEIDF-r-4Q';
        const cell = Cell_1.Cell.fromBase64(tx);
        const message = (0, Message_1.loadMessage)(cell.beginParse());
        let stored = (0, Builder_1.beginCell)()
            .store((0, Message_1.storeMessage)(message))
            .endCell();
        expect(stored.equals(cell)).toBe(true);
    });
});
