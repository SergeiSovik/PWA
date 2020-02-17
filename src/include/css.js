/*
 * Copyright 2020 Sergio Rando <segio.rando@yahoo.com>
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

export class CSS {
	/**
	 * @param {HTMLStyleElement=} domStyle 
	 */
	constructor(domStyle) {
		/** @type {Array<string>} */ this.oRules = [];

		if (domStyle !== undefined) {
			this.domStyle = domStyle;
		} else {
			this.domStyle = /** @type {HTMLStyleElement} */ ( document.createElement('style') );
			let domHead = /** @type {HTMLHeadElement} */ ( document.getElementsByTagName('head')[0] );
            domHead.appendChild(this.domStyle);
		}

		this.oSheet = /** @type {StyleSheet} */ ( this.domStyle['sheet'] ? this.domStyle['sheet'] : this.domStyle['styleSheet'] );

		if (domStyle !== undefined) {
			let oRules = /** @type {Array} */ ( this.oSheet['rules'] || this.oSheet['cssRules'] );
    		for (let iIndex = 0; iIndex < oRules.length; iIndex++) {
				let sRule = /** @type {string} */ ( oRules[iIndex]['selectorText'] );
				this.oRules.push(sRule);
			}
		}
	}

	/**
	 * Create new rule if not defined
	 * @param {string} sRule 
	 * @param {string} sDefineBlock 
	 * @returns {boolean} false - already defined
	 */
	create(sRule, sDefineBlock) {
		let aRules = this.findRules(sRule);
		if (aRules.length > 0)
			return false;
		this.insertRule(sRule, sDefineBlock);
	}

	/**
	 * Add rule to the end of list
	 * @param {string} sRule 
	 * @param {string} sDefineBlock 
	 */
	add(sRule, sDefineBlock) {
		this.insertRule(sRule, sDefineBlock);
	}

	/**
	 * Insert rule at iIndex position
	 * @param {string} sRule 
	 * @param {string} sDefineBlock 
	 * @param {number} iIndex 
	 */
	insert(sRule, sDefineBlock, iIndex) {
		this.insertRule(sRule, sDefineBlock, iIndex);
	}

	/**
	 * Update rule if exists
	 * @param {*} sRule 
	 * @param {*} sDefineBlock 
	 * @returns {boolean} false - not exists
	 */
	update(sRule, sDefineBlock) {
		let aRules = this.findRules(sRule);
		if (aRules.length === 0)
			return false;

		for (let iIndex = aRules.length - 1; iIndex > 0; iIndex--) {
			this.deleteRule(aRules[iIndex]);
		}

		let iIndex = aRules[0];
		this.deleteRule(iIndex);
		this.insertRule(sRule, sDefineBlock, iIndex);
	}

	/**
	 * Replace rule if exists, or create new
	 * @param {*} sRule 
	 * @param {*} sDefineBlock 
	 */
	replace(sRule, sDefineBlock) {
		if (update(sRule, sDefineBlock))
			return;
		
		this.insertRule(sRule, sDefineBlock);
	}

	/**
	 * @param {string} sRule 
	 * @returns {boolean} false - not found
	 */
	remove(sRule) {
		let aRules = this.findRules(sRule);
		if (aRules.length === 0)
			return false;

		for (let iIndex = aRules.length - 1; iIndex >= 0; iIndex--) {
			this.deleteRule(aRules[iIndex]);
		}

		return true;
	}

	/**
	 * @private
	 * @param {string} sRule 
	 * @param {string} sDefineBlock 
	 * @param {number=} iIndex 0..length
	 * @returns {number} iIndex
	 */
	insertRule(sRule, sDefineBlock, iIndex) {
		if (iIndex === undefined) {
			this.oRules.push(sRule);
		} else {
			this.oRules.splice(iIndex, 0, sRUle);
		}

		if (this.oSheet['insertRule']) {
			iIndex = this.oSheet['insertRule'](sRule + ' { ' + sDefineBlock + ' } ', iIndex);
		} else if (this.oSheet['addRule']) {
			iIndex = this.oSheet['addRule'](sRule, sDefineBlock, iIndex);
		}

		return iIndex;
	}

	/**
	 * @private
	 * @param {number} iIndex 0..(length-1)
	 */
	deleteRule(iIndex) {
		this.oRules.splice(iIndex, 1);

		if (this.oSheet['cssRules']) {
			if (this.oSheet['cssRules'].length > 0) {
				this.oSheet['deleteRule'](iIndex);
			}
		} else if (this.oSheet['removeRule']) {
			if (this.oSheet['rules'].length > 0) {
				this.oSheet['removeRule'](iIndex);
			}
		}
	}

	/**
	 * @private
	 * @param {string} sRule
	 * @returns {Array<number>}
	 */
	findRules(sRule) {
		let aResult = [];
		let iNext = 0;
		/** @type {number} */ let iIndex;;
		while ((iIndex = this.oRules.indexOf(sRule, iNext)) >= 0) {
			iNext = iIndex + 1;
			aResult.push(iIndex);
		}
		return aResult;
	}

	/**
	 * @param {number} iIndex 0..(length-1)
	 */
	getText(iIndex) {
		let oRules = /** @type {Array} */ ( this.oSheet['rules'] || this.oSheet['cssRules'] );
		return oRules[iIndex].cssText || oRules[iIndex].style.cssText;
	}
}
