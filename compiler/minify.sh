#!/bin/bash

#
# Copyright 2020 Sergei Sovik <sergeisovik@yahoo.com>
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#		http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# Minificator tool
# minify.sh TargetFile SourceFile ConfigFile MimeType

reline="^([^= 	]*)\s*=\s*[\"'](.*)[\"']$"
replaces=""
while IFS= read -r line; do
	if [[ "$line" =~ $reline ]]; then
		rep=${BASH_REMATCH[2]/\//\\\/}
		rep=${rep/\"/\\\"}
		rep=${rep/\'/\\\'}
		rep=${rep/\&/\\\&}

		if [ -z "$replaces" ]; then
			replaces="s/\${${BASH_REMATCH[1]}}/$rep/g"
		else
			replaces="${replaces}; s/\${${BASH_REMATCH[1]}}/$rep/g"
		fi

	fi
done < "$3"

sed "${replaces}" "$2" | minify -o "$1" --mime "$4"
