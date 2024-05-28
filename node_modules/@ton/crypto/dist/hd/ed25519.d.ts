/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import { HDKeysState } from "./state";
export declare function getED25519MasterKeyFromSeed(seed: Buffer): Promise<HDKeysState>;
export declare function deriveED25519HardenedKey(parent: HDKeysState, index: number): Promise<HDKeysState>;
export declare function deriveEd25519Path(seed: Buffer, path: number[]): Promise<Buffer>;
