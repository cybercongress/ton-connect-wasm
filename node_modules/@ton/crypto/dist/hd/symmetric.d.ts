/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import { HDKeysState } from "./state";
export declare function getSymmetricMasterKeyFromSeed(seed: Buffer): Promise<HDKeysState>;
export declare function deriveSymmetricHardenedKey(parent: HDKeysState, offset: string): Promise<HDKeysState>;
export declare function deriveSymmetricPath(seed: Buffer, path: string[]): Promise<Buffer>;
