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

'use strict';

const oEscapeMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#039;'
};

/**
 * @param {string} sText 
 * @returns {string}
 */
export function escapeHtml(sText) {
	return sText.replace(/[&<>"']/g, function(iMap) { return oEscapeMap[iMap]; });
}

/**
 * @param {HTMLElement} domTarget 
 * @returns {string}
 */
export function getOuterHtml(domTarget) {
	if (typeof(domTarget.outerHTML) !== undefined)
	    return domTarget.outerHTML;

	let sResult = '';
	switch (domTarget.nodeType) {
	    // An element.
	    case 1:
	        sResult += '<' + domTarget.nodeName;
	        for (let i = 0; i < domTarget.attributes.length; i++) {
	            if (domTarget.attributes[i].nodeValue != null)
	                sResult += ' ' + domTarget.attributes[i].nodeName + '="' + domTarget.attributes[i].nodeValue + '"';
	        }
	        if (domTarget.childNodes.length == 0 && in_array(domTarget.nodeName.toLowerCase(), ['hr', 'input', 'img', 'link', 'meta', 'br']))
	            sResult += ' />';
	        else
	            sResult += '>' + window.getInnerHTML(domTarget) + '</' + domTarget.nodeName + '>';
	        break;
	    // 2 is an attribute.
	    // Just some text..
	    case 3:
	        sResult += domTarget.nodeValue;
	        break;
	    // A CDATA section.
	    case 4:
	        sResult += '<![CDATA' + '[' + domTarget.nodeValue + ']' + ']>';
	        break;
	    // Entity reference..
	    case 5:
	        sResult += '&' + domTarget.nodeName + ';';
	        break;
	    // 6 is an actual entity, 7 is a PI.
	    // Comment.
	    case 8:
	        sResult += '<!--' + domTarget.nodeValue + '-->';
	        break;
	}
	return sResult;
}

/**
 * @param {HTMLElement} domTarget 
 * @param {string} sValue 
 */
export function setInnerHTML(domTarget, sValue) {
	// IE has this built in...
	if (typeof(domTarget.innerHTML) != 'undefined')
		domTarget.innerHTML = sValue;
	// Otherwise, try createContextualFragment()
	else {
		var range = document.createRange();
		range.selectNodeContents(domTarget);
		range.deleteContents();
		domTarget.appendChild(range.createContextualFragment(sValue));
	}
}

const aStringSizes = [
	1,
	1024,
	1024 * 1024,
	1024 * 1024 * 1024,
	1024 * 1024 * 1024 * 1024,
	1024 * 1024 * 1024 * 1024 * 1024,
	1024 * 1024 * 1024 * 1024 * 1024 * 1024
];

const aStringSizeNames = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

/**
 * @param {number} iSize 
 * @returns {string}
 */
export function sizeToString(iSize) {
	iSize = iSize | 0;
	if (iSize < aStringSizes[1]) {
		return ((iSize / aStringSizes[0]) | 0) + ' ' + aStringSizeNames[0];
	} else if (iSize < aStringSizes[2]) {
		return (((iSize * 10 / aStringSizes[1]) | 0) / 10) + ' ' + aStringSizeNames[1];
	} else if (iSize < aStringSizes[3]) {
		return (((iSize * 10 / aStringSizes[2]) | 0) / 10) + ' ' + aStringSizeNames[2];
	} else if (iSize < aStringSizes[4]) {
		return (((iSize * 10 / aStringSizes[3]) | 0) / 10) + ' ' + aStringSizeNames[3];
	} else if (iSize < aStringSizes[5]) {
		return (((iSize * 10 / aStringSizes[4]) | 0) / 10) + ' ' + aStringSizeNames[4];
	} else {
		return (((iSize * 10 / aStringSizes[5]) | 0) / 10) + ' ' + aStringSizeNames[5];
	}
}

/**
 * Simple text formatting
 * 
 * Replaces {N} to relative function argument
 * 
 * @param {string} sFormat - formatting text
 * @param {...*} va_args - arguments
 * @returns {string} formatted text
 *
 * @example
 * 	format("Hello {0}", "friend") = "Hello friend"
 */
export function format(sFormat, va_args) {
	let args = Array.prototype.slice.call(arguments, 1);
	return sFormat.replace(/{(\d+)}/g, function(sMatch, iNumber) {
		return typeof args[iNumber] != 'undefined' ? args[iNumber] : sMatch;
	});
}

/**
 * @param {number} iValue 
 * @returns {string}
 */
export function toHex(iValue) {
	let sHigh = ('00' + ((iValue >> 24) & 0xFF).toString(16)).substr(-2);
	let sLow = ('000000' + (iValue & 0xFFFFFF).toString(16)).substr(-6);
	return sHigh + sLow;
}

/**
 * @suppress {duplicate}
 * @param {string} sInfo
 * @param {Array<number>} aArrayOfNumbers
 */
export function intdump(sInfo, aArrayOfNumbers) {
	let aStrings = [];
	for (let i = 0; i < aArrayOfNumbers.length; i++) {
		aStrings.push('0x' + toHex(aArrayOfNumbers[i]));
	}
	console.log(sInfo, aStrings.join(', '));
}
