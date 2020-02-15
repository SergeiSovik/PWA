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

/**
 * @fileoverview This is an externs file.
 * @externs
 */

/**
 * @type {Window}
 */
var platform;

/**
 * @type {string}
 */
var ROOT;

/**
 * @param {*} oTarget 
 * @param  {...*} va_args
 * @returns {*} target
 */
function inject(oTarget, va_args) {}

/**
 * @param {*} oSource
 * @returns {*} clone
 */
function clone(oSource) {}

/**
 * @param {...*} va_args
 * @returns {Array<number>}
 */
function FixedInt32Array(va_args) {}

/**
 * @param {...*} va_args
 * @returns {Array<number>}
 */
function FixedDoubleArray(va_args) {}

/**
 * @param {string} n
 * @param {Array<number>} a
 */
function intdump(n, a) {}
