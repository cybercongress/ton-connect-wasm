/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import { HDKeysState } from "./state";
export declare function getMnemonicsMasterKeyFromSeed(seed: Buffer): Promise<HDKeysState>;
export declare function deriveMnemonicHardenedKey(parent: HDKeysState, index: number): Promise<HDKeysState>;
export declare function deriveMnemonicsPath(seed: Buffer, path: number[], wordsCount?: number, password?: string | null | undefined): Promise<string[]>;
