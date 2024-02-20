/*
	In order to avoid running "npm install" in non-js jsii runtimes
	we decided to extract part of "flat" package directly to the repository


	Docs: https://aws.github.io/jsii/user-guides/lib-author/configuration/#dependencies-that-are-not-jsii-modules
	Package: https://www.npmjs.com/package/flat


	Original: https://github.com/hughsk/flat/blob/master/index.js

	Copyright (c) 2014, Hugh Kennedy
	All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

	2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

	3. Neither the name of the  nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isBuffer(obj: any): obj is Buffer {
	/* c8 ignore start */
	return (
		obj?.constructor &&
		typeof obj.constructor.isBuffer === 'function' &&
		obj.constructor.isBuffer(obj)
	)
	/*c8 ignore end */
}

export function flatten(target: object): Record<string, unknown> {
	const output: Record<string, unknown> = {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function step(object: any, prev?: string, currentDepth: number = 1): void {
		Object.keys(object).forEach(function (key) {
			const value = object[key]
			const isarray = false //Array.isArray(value)
			const type = Object.prototype.toString.call(value)
			const isbuffer = isBuffer(value)
			const isobject = type === '[object Object]' || type === '[object Array]'

			const newKey = prev ? prev + '.' + key : key

			if (!isarray && !isbuffer && isobject && Object.keys(value).length) {
				return step(value, newKey, currentDepth + 1)
			}

			output[newKey] = value
		})
	}

	step(target)

	return output
}
