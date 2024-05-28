/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
export declare function getSecureRandomBytes(size: number): Promise<Buffer>;
export declare function getSecureRandomWords(size: number): Promise<Uint16Array>;
export declare function getSecureRandomNumber(min: number, max: number): Promise<number>;
