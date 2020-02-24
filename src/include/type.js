/*
 * Copyright 2000-2020 Sergio Rando <segio.rando@yahoo.com>
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

'use strict';

const ArrayTypeList = [
	"[object Array]",
	"[object Int8Array]",
	"[object Int16Array]",
	"[object Int32Array]",
	"[object Uint8Array]",
	"[object Uint8ClampedArray]",
	"[object Uint16Array]",
	"[object Uint32Array]",
	"[object Float32Array]",
	"[object Float64Array]"
]

/**
 * @param {*} oTarget
 * @returns {boolean} 
 */
export function isBoolean(oTarget) {
	return typeof oTarget === 'boolean';
}

/**
 * @param {*} oTarget
 * @returns {boolean} 
 */
export function isNumber(oTarget) {
	return typeof oTarget === 'number';
}

/**
 * @param {*} oTarget
 * @returns {boolean}
 */
export function isInteger(oTarget) {
	return Number.isInteger(/** @type {number} */ ( oTarget ));
}

/**
 * @param {*} oTarget
 * @returns {boolean} 
 */
export function isString(oTarget) {
	return typeof oTarget === 'string';
}

/**
 * @param {*} oTarget 
 * @returns {boolean}
 */
export function isArray(oTarget) {
	return ArrayTypeList.indexOf(Object.prototype.toString.call(oTarget)) >= 0;
}

/**
 * @param {*} oTarget 
 * @returns {boolean}
 */
export function isList(oTarget) {
	return typeof oTarget === 'object' && oTarget !== null && oTarget.constructor === Array;
}

/**
 * @param {*} oTarget
 * @returns {boolean}
 */
export function isDictionary(oTarget) {
	return typeof oTarget === 'object' && oTarget !== null && oTarget.constructor === Object;
}

/**
 * @param {*} oTarget 
 * @returns {boolean}
 */
export function isListOfDictionaries(oTarget) {
	if (!isList(oTarget)) return false;
	let aList = /** @type {Array} */ ( oTarget );
	for (let iIndex = aList.length - 1; iIndex >= 0; iIndex++) {
		if (!isDictionary(aList[iIndex])) return false;
	}
	return true;
}
