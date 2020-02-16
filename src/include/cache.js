/*
 * Copyright 2019-2020 Sergio Rando <segio.rando@yahoo.com>
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
 * @param {string} sTarget 
 * @param {string} sSource 
 */
export async function cacheClone(sTarget, sSource) {
    await caches.delete(sTarget);
	
	let cSource = await caches.open(sSource);
	let cTarget = await caches.open(sTarget);

	/*
	let [cSource, cTarget] = await Promise.all([
		caches.open(sSource),
		caches.open(sTarget)
	]);
	*/

    const aRequests = await cSource.keys();
    return Promise.all(aRequests.map(function(oRequest) {
        return cSource.match(oRequest).then(function(oResponse) {
			if (oResponse !== undefined) {
				return cTarget.put(oRequest, oResponse)
			}
        });
    }));
}

/**
 * @param {Cache} cCache 
 * @param {!string | !Request} oRequest 
 */
export async function cacheFetch(cCache, oRequest) {
    if (!(oRequest instanceof Request)) {
		oRequest = new Request(oRequest);
	}

	return new Promise(function(fnResolve, fnReject) {
		fetch(oRequest.clone()).then(function(oResponse) {
			if ((oResponse.ok) || ((oResponse.status >= 400) && (oResponse.status < 500)))
				cCache.put(oRequest, oResponse.clone());
			fnResolve(oResponse);
		}).catch(function(oResponse) {
			if ((oResponse.status >= 400) && (oResponse.status < 500)) {
				cCache.put(oRequest, oResponse.clone());
				fnResolve(oResponse);
			} else {
				fnReject(oResponse);
			}
		});
	});
}

/**
 * @param {Cache} cCache 
 * @param {!string | !Request} oRequest 
 */
export async function cacheOrFetch(cCache, oRequest) {
	if (!(oRequest instanceof Request)) {
		oRequest = new Request(oRequest);
	}

	return new Promise(function(fnResolve, fnReject) {
		let oCachePromise = cCache.match(oRequest).then(function(oResponse) {
			if (oResponse)
				fnResolve(oResponse);
		});

		fetch(oRequest.clone()).then(function(oResponse) {
			if ((oResponse.ok) || ((oResponse.status >= 400) && (oResponse.status < 500))) {
				cCache.put(oRequest, oResponse.clone());
				fnResolve(oResponse);
			} else {
				oCachePromise.then(function() {
					fnReject(oResponse);
				});
			}
		}).catch(function(oResponse) {
			oCachePromise.then(function() {
				if ((oResponse.status >= 400) && (oResponse.status < 500)) {
					cCache.put(oRequest, oResponse.clone());
					fnResolve(oResponse);
				} else
					fnReject(oResponse);
			});
		});
	});
}

/**
 * @param {Cache} cCache 
 * @param {!string | !Request} oRequest 
 */
export async function cacheThenFetch(cCache, oRequest) {
    if (!(oRequest instanceof Request)) {
		oRequest = new Request(oRequest);
	}

	return new Promise(function(fnResolve, fnReject) {
		let oCachePromise = cCache.match(oRequest).then(function(oResponse) {
			if (oResponse)
				fnResolve(oResponse);
		});

		fetch(oRequest.clone()).then(function(oResponse) {
			if ((oResponse.ok) || ((oResponse.status >= 400) && (oResponse.status < 500)))
				cCache.put(oRequest, oResponse.clone());
			oCachePromise.then(function() {
				fnResolve(oResponse);
			});
		}).catch(function(oResponse) {
			oCachePromise.then(function() {
				if ((oResponse.status >= 400) && (oResponse.status < 500)) {
					cCache.put(oRequest, oResponse.clone());
					fnResolve(oResponse);
				} else
					fnReject(oResponse);
			});
		});
	});
}
