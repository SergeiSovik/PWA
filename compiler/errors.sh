#!/bin/bash

#
# Copyright 2020 Sergio Rando <segio.rando@yahoo.com>
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

# Visual Studio Code error wrapper for Google Closure Compiler

reline="^(.*):([0-9]+):\s+(WARNING|ERROR)\s+-\s(.*)$"
recol="^(\s+)?([\^]+)$"
parse=false
error=false
while IFS= read -r line; do
	if ! $parse; then
		if [[ "$line" =~ $reline ]]; then
			errlines=0
			errfile="${BASH_REMATCH[1]}"
			errline="${BASH_REMATCH[2]}"
			errseverity="${BASH_REMATCH[3]}"
			errmessage="${BASH_REMATCH[4]}"
			parse=true
			errmore=""
			#if [ "$errseverity" = "ERROR" ]; then
				error=true
			#fi
		else
			>&2 echo "$line"
		fi
	else
		if [ -z "$errmore" ]; then
			errmore="\t${line}"
		else
			errmore="${errmore}\n\t${line}"
		fi
		if [[ "$line" =~ $recol ]]; then
			errcol=$((${#BASH_REMATCH[1]}+1))
			errlen="${#BASH_REMATCH[2]}"
			errcolend=$(($errcol+$errlen))
			err="${errseverity}: ${errfile}:${errline}:${errcol}:${errcolend} -"
			if [ -z "$errmore" ]; then
				>&2 printf "${err} ${errseverity}: ${errmessage}\n"
			else
				>&2 printf "${err} ${errseverity}: ${errmessage}\n${errmore}\n"
			fi
			parse=false
		fi
	fi
done < "${1:-/dev/stdin}"

if [ $parse ]; then
	err="${errseverity}: ${errfile}:${errline}:: -"
	>&2 printf "${err} ${errseverity}: ${errmessage}\n"
fi

if $error; then
	exit 1
fi
