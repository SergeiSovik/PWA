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

/** @type {string} - document event, fired on document ready without resources */
const evDocumentReady = "DOMContentLoaded";

/** @typedef {Function} EventHandler */
var EventHandler;

/**
 * Bind element event handler
 * @param {HTMLElement | Window | Document | XMLHttpRequest} oElement
 * @param {string} sEvent
 * @param {EventHandler} fEventHandler
 */
export function bindEvent(oElement, sEvent, fEventHandler) {
    if (oElement.addEventListener) {
        oElement.addEventListener(sEvent, fEventHandler, false);
    } else if (oElement.attachEvent) {
        oElement.attachEvent('on' + sEvent, fEventHandler);
    }
}

/**
 * Unbind element event handler
 * @param {HTMLElement | Window | Document | XMLHttpRequest} oElement
 * @param {string} sEvent
 * @param {EventHandler} fEventHandler
 */
export function unbindEvent(oElement, sEvent, fEventHandler) {
    if (oElement.addEventListener) {
        oElement.removeEventListener(sEvent, fEventHandler, false);
    } else if (oElement.detachEvent) {
        oElement.detachEvent('on' + sEvent, fEventHandler);
    }
}

/**
@typedef {{
	target:Document,
	type:string,
	bubbles:boolean,
	cancelable:boolean
}} EventDOMContentLoaded
 */
var EventDOMContentLoaded;

/** @typedef {function(EventDOMContentLoaded)} EventDOMContentLoadedHandler*/
var EventDOMContentLoadedHandler;

/**
 * Bind event DOMContentLoaded handler
 * If document already ready, then call handler
 * @param {EventDOMContentLoadedHandler | null} fEventHandler
 */
export function bindOnDocumentReady(fEventHandler) {
	let domDocument = platform.document || null;
	if (domDocument === null) {
		fEventHandler({ 'target': null, 'type': 'complete', 'bubbles': true, 'cancelable': false });
	} else if (domDocument.readyState === 'interactive' || domDocument.readyState === 'complete') {
        fEventHandler({ 'target': domDocument, 'type': domDocument.readyState, 'bubbles': true, 'cancelable': false });
    } else {
        bindEvent(domDocument, evDocumentReady, fEventHandler);
    }
}
