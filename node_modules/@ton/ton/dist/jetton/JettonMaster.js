"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JettonMaster = void 0;
const core_1 = require("@ton/core");
class JettonMaster {
    static create(address) {
        return new JettonMaster(address);
    }
    constructor(address) {
        this.address = address;
    }
    async getWalletAddress(provider, owner) {
        let res = await provider.get('get_wallet_address', [{ type: 'slice', cell: (0, core_1.beginCell)().storeAddress(owner).endCell() }]);
        return res.stack.readAddress();
    }
    async getJettonData(provider) {
        let res = await provider.get('get_jetton_data', []);
        let totalSupply = res.stack.readBigNumber();
        let mintable = res.stack.readBoolean();
        let adminAddress = res.stack.readAddress();
        let content = res.stack.readCell();
        let walletCode = res.stack.readCell();
        return {
            totalSupply,
            mintable,
            adminAddress,
            content,
            walletCode
        };
    }
}
exports.JettonMaster = JettonMaster;
