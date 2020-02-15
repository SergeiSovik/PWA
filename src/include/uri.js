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

const reSTRICT = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/;
const reLOOSE = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
const reQUERY = /(?:^|&)([^&=]*)=?([^&]*)/g;
const reEXT = /(\.[^\.]*)$/;

export class URI {
	/**
	 * @param {string | null} sBasePath (Default) null
	 * @param {string} sURI 
	 * @param {boolean=} bStrictMode 
	 */
	constructor(sBasePath, sURI, bStrictMode) {
		/** @type {string | null} */ this.sBasePath = sBasePath || null;

		let bMode = bStrictMode || true;
		let a = (bMode ? reSTRICT : reLOOSE).exec(sURI);

		/** @type {string} */ this.sSource = a[0];
		/** @type {string} */ this.sProtocol = a[1] || "";
		/** @type {string} */ this.sAuthority = a[2] || "";
		/** @type {string} */ this.sUserInfo = a[3] || "";
		/** @type {string} */ this.sUser = a[4] || "";
		/** @type {string} */ this.sPassword = a[5] || "";
		/** @type {string} */ this.sHost = a[6] || "";
		/** @type {string} */ this.sPort = a[7] || "";
		/** @type {string} */ this.sRelative = a[8] || "";
		/** @type {string} */ this.sPath = a[9] || "";
		/** @type {string} */ this.sDirectory = a[10] || "";
		/** @type {string} */ this.sFile = a[11] || "";
		/** @type {string} */ this.sQuery = a[12] || "";
		/** @type {string} */ this.sAnchor = a[13] || "";

		/** @type {Object<string, string>} */ this.dQueryKeys = {};

		let THIS = this;
		this.sQuery.replace(reQUERY, function (_$0, $1, $2) {
			if ($1) THIS.dQueryKeys[$1] = $2;
		});

		let res = reEXT.exec(this.sFile);
		/** @type {string} */ this.sExtension = (res && res[1] || "").toLowerCase();

		/** @private @type {string | undefined} */ this.sScheme;
		/** @private @type {string | undefined} */ this.sServer;
		/** @private @type {string | undefined} */ this.sFullPath;
		/** @private @type {string | undefined} */ this.sAbsolutePath;
		/** @private @type {string | undefined} */ this.sURI;
	}

	/** @returns {string} */
	scheme() {
		if (this.sScheme === undefined)
			/** @private */ this.sScheme = (this.sProtocol != "" ? this.sProtocol + "://" : "");
		return this.sScheme;
	}

	/** @returns {string} */
	server() {
		if (this.sServer === undefined)
			/** @private */ this.sServer = ((this.sUser != "" || this.sPassword != "") ? this.sUser + ":" + this.sPassword + "@" : "") +
				this.sHost +
				(this.sPort != "" ? ":" + this.sPort : "");
		return this.sServer;
	}

	/** @returns {string} */
	fullPath() {
		if (this.sFullPath === undefined)
			/** @private */ this.sFullPath = this.scheme() + this.server() + this.sDirectory.replace(/\/$/, "");
		return this.sFullPath;
	}

	/**
	 * @param {string=} sBasePath 
	 * @returns {string}
	 */
	absolutePath(sBasePath) {
		if ((this.sAbsolutePath === undefined) || (sBasePath !== undefined)) {
			if (this.scheme() == "" || this.server() == "") {
				let path = this.sDirectory.replace(/^\//, "").replace(/\/$/, "");
				if (sBasePath !== undefined) {
					/** @private */ this.sAbsolutePath = sBasePath.replace(/\/$/, "") + (path != "" ? "/" + path : "");
				} else if (path.lastIndexOf('.', 0) !== 0) {
					/** @private */ this.sAbsolutePath = this.sBasePath.replace(/\/$/, "") + (path != "" ? "/" + path : "");
				} else {
					/** @private */ this.sAbsolutePath = path;
				}
			} else {
				/** @private */ this.sAbsolutePath = this.fullPath();
			}
		}
		return this.sAbsolutePath;
	}

	/**
	 * @param {string=} sBasePath
	 * @returns {string}
	 */
	build(sBasePath) {
		if ((this.sURI === undefined) || (sBasePath !== undefined)) {
			/** @private */ this.sURI = this.absolutePath(sBasePath) + "/" + this.sFile + (this.sQuery != "" ? "?" + this.sQuery : "");
		}
		return this.sURI;
	}
}
