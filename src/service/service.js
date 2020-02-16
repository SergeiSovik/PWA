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

import { Example as Example1 } from "./../lib/js-example/modules/module.js"

import { cacheClone, cacheFetch, cacheOrFetch, cacheThenFetch } from "./../include/cache.js"

/**
 * @this {ServiceWorkerGlobalScope}
 * @param {ServiceWorkerGlobalScope} self
 */
function service(self) {
	console.log('service', Example1);

	let bCacheEnabled = false;
	const sCacheStaticPreload = "static-v1-preload";
	const sCacheStatic = "static-v1";
	const sCache = "cache-v1";

	let aStaticResources = [
		"",
		"index.html",
		"?utm_source=web_app_manifest",

		"launcher.js",
		(ECMASCRIPT_2015 ? "main.2015.js" :  "main.2017.js"),

		"favicon.png",
		"manifest.webmanifest",
		"appicon/appicon-1024.png",

		"css/main.css",
	];

	this.onerror = console.error.bind(console);

	const dirBase = new URL("./", self.location.href) + "";
	const dirScope = ((self.registration) ? self.registration.scope : (self.scope || dirBase)).replace(/\/$/, "") + '/';
	console.log('Scope', dirScope);

	const fnInstall = async function() {
		await caches.delete(sCacheStatic);
	
		const cCache = await caches.open(sCacheStatic);
	
		await Promise.all(aStaticResources.map(function(sResource) {
			return cacheFetch(cCache, dirBase + sResource);
		}));
	
		console.log("Service Installed (Service Static PreCache Load Complete)");
	}

	this.addEventListener("install",
		function(oEvent) {
			console.log("Service Installation...");
			oEvent.waitUntil(fnInstall());
		}
	);

	const fnCleaner = async function() {
		console.log("Service Cache Cleaner...");
		let aKeyList = await caches.keys();

		await Promise.all(aKeyList.map(function(sKey) {
			if (sKey != sCacheStatic) {
				return caches.delete(sKey);
			}
		}));

		console.log("Service Cache Cleaner (Complete)");
	};

	const fnSmartFetch = async function(oRequest) {
		// If Requested File From Working Path
		let iScopeIndex = oRequest.url.indexOf(dirScope);
		if (iScopeIndex !== -1) {
			let sFile = oRequest.url.substr(dirScope.length);

			// If Request In Static Resource List, Then Return Quickest Result (Cache or Network)
			if (aStaticResources.indexOf(sFile) !== -1) {
				const cCache = await caches.open(sCacheStatic);
				//console.log('Cache Or Fetch', sFile);
				return cacheOrFetch(cCache, oRequest);
			}
			// If Request Not In Static Resource List, But Detected As Static, Then Add And Remember In Cache (Once)
			else if ((sFile.indexOf('appicon/') === 0) || (sFile.indexOf('images/static/') === 0)) {
				aStaticResources.push(sFile);
				const cCache = await caches.open(sCacheStatic);
				//console.log('Cache Fetch', sFile);
				return cacheFetch(cCache, oRequest);
			}
		}

		// All Other Requests Get From Cache And Background Update Cache From Network
		const cCache = await caches.open(sCache);
		//console.log('Cache Then Fetch', oRequest.url);
		return cacheThenFetch(cCache, oRequest);
	};

	this.addEventListener("activate",
		function(oEvent) {
			console.log("Service Activation...");
			oEvent.waitUntil(cacheClone(sCacheStatic, sCacheStaticPreload).then(function() {
				console.log("Service Activated (Cache Updated)");
				return fnCleaner();
			}));
		}
	);

	this.addEventListener("fetch", /** @type {EventListener} */ (
		/** @param {FetchEvent} oEvent */
		function(oEvent) {
			if ((oEvent.request.method != 'GET') ||
				(oEvent.request.url.indexOf(dirScope) === -1))
				return;
	
			if (!bCacheEnabled)
				return;
	
			return oEvent.respondWith(fnSmartFetch(oEvent.request));
		}
	));
}

service.call(/** @type {ServiceWorkerGlobalScope} */ ( self ), /** @type {ServiceWorkerGlobalScope} */ ( self ));
