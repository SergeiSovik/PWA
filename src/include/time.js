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

/**
 * Get relative time in milliseconds
 * @type {function():number}
 */
export var getTickCounter = function() {
	return new Date().getTime();
}

/**
 * Get current time in milliseconds
 * @returns {number} count of seconds passed since 1970 Jan, 1
 */
export function unixTimeMilliseconds() {
	return new Date().getTime() | 0;
}

/**
 * Get current time in seconds
 * @returns {number} count of seconds passed since 1970 Jan, 1
 */
export function unixTime() {
	return (new Date().getTime() / 1000) | 0;
}

if (platform.performance !== undefined) {
	if (platform.performance['now'] !== undefined) {
		getTickCounter = function() { return platform.performance['now'](); };
	} else if (platform.performance['webkitNow'] !== undefined) {
		getTickCounter = function() { return platform.performance['webkitNow'](); };
	}
}
