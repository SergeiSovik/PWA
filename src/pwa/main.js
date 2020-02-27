/*
 * Copyright 2020 Sergei Sovik <sergeisovik@yahoo.com>
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

import { Example as Example1 } from "./../lib/js-example/modules/module.js"
import { Example as Example2 } from "./../lib/js-template/modules/module.js"

// Main Application Class

class Main {
	constructor() {
		console.log('pwa', 'Progressive Web Application Started')
		console.log('pwa', Example1);
		console.log('pwa', Example2);
	}
}

// Start/Create Main

new Main();

// Start ServiceWorker

if (!STABLE) {
	if ('serviceWorker' in navigator) {
		// Register Service Worker
		navigator.serviceWorker.register(ECMASCRIPT_2015 ? './service.2015.js' : './service.2017.js', {scope: './'})
		.then(function(registration) {
			console.log('pwa', 'Service worker registered:', registration);
		})
		.catch(function(error) {
			console.log('pwa', 'Error register service worker:', error);
		});
	} else {
		console.log('pwa', 'Warning: Service worker not supported.');
	}
}
