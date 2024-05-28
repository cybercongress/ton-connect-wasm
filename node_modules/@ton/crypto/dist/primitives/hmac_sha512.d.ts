/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
export declare function hmac_sha512_fallback(key: string | Buffer, data: string | Buffer): Promise<Buffer>;
export declare function hmac_sha512(key: string | Buffer, data: string | Buffer): Promise<Buffer>;
