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

echo ""
echo "Merging $PWD"
echo ""

# TODO: Add Upstream on a new Clone
#gitlist="$( git remote -v )"
#reline="^([^ 	]+)[ 	]+([^ 	]+)[ 	]+\((.*)\)$"
#while IFS= read -r line; do
#    echo "$line"
#    if [[ "$line" =~ $reline ]]; then
#        echo "${BASH_REMATCH[1]}"
#	    echo "${BASH_REMATCH[2]}"
#	    echo "${BASH_REMATCH[3]}"
#    fi
#done < <(printf '%s\n' "$gitlist")

git fetch upstream 2>&1
git merge upstream/master 2>&1

exit 0
