/*
 * Copyright 2000-2020 Sergei Sovik <sergeisovik@yahoo.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

/** @suppress {duplicate} */
var platform = /** @type {Window} */ (
	('object' == typeof window && window && window['Math'] == Math) ? window :
	('object' == typeof self && self && self['Math'] == Math) ? self :
	('object' == typeof global && global && global['Math'] == Math) ? global :
	(eval("this['Math']") == Math) ? this :
	('object' == typeof globalThis && globalThis) ? globalThis : null
);

/**
 * @suppress {duplicate}
 * @type {string | null}
 */
var ROOT = platform['ROOT'] || null;
if (ROOT === null) {
	try {
		throw new Error();
	} catch (oError) {
		let eError = /** @type {Error} */ ( oError );
		let aStackLines = eError.stack.split('\n');
		let reFind = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		let reParse = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/;
		for (let iIndex in aStackLines) {
			/** @type {Array<string | undefined> | null} */ let reaLine;
			/** @type {string | null} */ let sFirst = null;
			let aStackLine = aStackLines[iIndex | 0].replace('Object.<anonymous> (', 'Object.<anonymous> (file://');
			while ((reaLine = reFind.exec(aStackLine)) != null) {
				if (sFirst === null) sFirst = reaLine[1];
			}
			if (sFirst) {
				/** @type {Array<string | undefined> | null} */ let reaURI = reParse.exec(sFirst);
				let jIndex = 14;
				while (jIndex--) reaURI[jIndex] = reaURI[jIndex] || '';
				let sPath = (reaURI[1] != '' ? reaURI[1] + '://' : '') +
					((reaURI[4] != '' || reaURI[5] != '') ? reaURI[4] + ':' + reaURI[5] + '@' : '') +
					reaURI[6] +
					(reaURI[7] != '' ? ':' + reaURI[7] : '') +
					reaURI[10].replace(/\/$/, '');
				ROOT = sPath + '/';
				break;
			}
		}
	}

	platform['ROOT'] = ROOT;
}

/**
 * @suppress {duplicate}
 * @type {boolean}
 */
var MOBILE = (platform['navigator'] === undefined) ? false : (
	(navigator.userAgent.match(/Android/i)
		|| navigator.userAgent.match(/webOS/i)
		|| navigator.userAgent.match(/iPhone/i)
		|| navigator.userAgent.match(/iPad/i)
		|| navigator.userAgent.match(/iPod/i)
		|| navigator.userAgent.match(/BlackBerry/i)
		|| navigator.userAgent.match(/Windows Phone/i)) ? true : false
	);

/**
 * @suppress {duplicate}
 * @param {*} oTarget 
 * @param  {...*} va_args
 * @returns {*} target
 */
var inject = function(oTarget, va_args) {
	let args = Array.prototype.slice.call(arguments, 1);
	while (args.length) {
		let arg = args.shift();
		if (!arg) continue;
		if (typeof arg !== 'object')
			throw new TypeError(arg + ' is non-object');
		for (let i in arg)
			if (arg.hasOwnProperty(i)) {
				if ((oTarget[i] === undefined) || (typeof oTarget[i] !== 'object'))
					oTarget[i] = arg[i];
				else if (typeof arg[i] === 'object') {
					if (Array.isArray(oTarget[i]) || Array.isArray(arg[i])) {
						if (Array.isArray(oTarget[i]))
							oTarget[i] = arg[i];
					} else
						platform.inject(oTarget[i], arg[i]);
				}
			}
	}
	return oTarget;
}

platform['inject'] = inject;

/**
 * @suppress {duplicate}
 * @param {*} oSource
 * @returns {*} clone
 */
var clone = function(oSource) {
	if (typeof oSource === 'string') {
		return (' ' + oSource).slice(1);
	} else if (typeof oSource === 'number') {
		return oSource;
	}

	return platform.inject(oSource.constructor(), oSource);
}

platform['clone'] = clone;

const Int32ArrayFallback = (typeof Int32Array !== 'undefined' ? Int32Array : Array);

/**
 * @suppress {duplicate}
 * @param {...*} va_args
 * @returns {Array<number>}
 */
var FixedInt32Array = function(va_args) {
	let args = /** @type {Array} */ ( Array.prototype.slice.call(arguments, 0) );

	// FIX: Safari bug Type error
	//return /** @type {Array<number>} */ ( new (Function.prototype.bind.apply(Int32ArrayFallback, [null].concat(args))) );
	
	if (args.length === 0) {
		return /** @type {Array<number>} */ ( new Int32ArrayFallback() );
	} else if (args.length === 1) {
		return /** @type {Array<number>} */ ( new Int32ArrayFallback(args[0]) );
	}
	return /** @type {Array<number>} */ ( new Int32ArrayFallback(args) );
}

platform['FixedInt32Array'] = FixedInt32Array;

const DoubleArrayFallback = (typeof Float64Array !== 'undefined' ? Float64Array : Array);

/**
 * @suppress {duplicate}
 * @param {...*} va_args
 * @returns {Array<number>}
 */
var FixedDoubleArray = function(va_args) {
	let args = /** @type {Array} */ ( Array.prototype.slice.call(arguments, 0) );
	
	// FIX: Safari bug Type error
	//return /** @type {Array<number>} */ ( new (Function.prototype.bind.apply(DoubleArrayFallback, [null].concat(args))) );
	
	if (args.length === 0) {
		return /** @type {Array<number>} */ ( new DoubleArrayFallback() );
	} else if (args.length === 1) {
		return /** @type {Array<number>} */ ( new DoubleArrayFallback(args[0]) );
	}
	return /** @type {Array<number>} */ ( new DoubleArrayFallback(args) );
}

platform['FixedDoubleArray'] = FixedDoubleArray;
