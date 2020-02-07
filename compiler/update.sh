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

# Google Closure Compiler updater/installer

# Config
TAB="	"
URL="https://dl.google.com/closure-compiler/compiler-latest.tar.gz"

# CUDIR = Current Working Directory
CUDIR="$PWD"

# SHDIR = Current Script Directory
SHDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

#--------------------------------

echo "Installing/Updating Google Closure Compiler Binary"

# Change Working Dir
mkdir -p ~/.gcc/compiler
cd ~/.gcc/compiler

# Remove Previous Container
rm -f compiler-latest.tar.gz &> /dev/null

# Make Current GCC Backup For Fallback
mv -f closure-compiler closure-compiler-fallback &> /dev/null

# Download New GCC
echo "${TAB}Downloading"
WGETRES="$( wget -q "$URL" )"
if [ $? -ne 0 ]; then
	echo "${TAB}Error: Unable to download $WGETRES" >&2

	# Restore Fallback
	mv -f closure-compuler-fallback closure-compiler &> /dev/null

	# Restore Working Dir
	cd "$CUDIR"

	exit 1
fi

# Unpack Container
echo "${TAB}Unpacking"
mkdir -p closure-compiler
tar -zxvf compiler-latest.tar.gz -C closure-compiler &> /dev/null

# Find *.jar File
JARFILES=$( find ~/.gcc/compiler/closure-compiler -type f -name "*.jar" )
if [ ! -e $JARFILES ]; then
	echo "${TAB}Error: Compiler *.jar file not found!" >&2
	echo "${TAB}Downloaded container can be located at compiler folder"

	# Restore Fallback
	rm -r closure-compiler
	mv -f closure-compuler-fallback closure-compiler &> /dev/null

	# Restore Working Dir
	cd "$CUDIR"

	exit 1
fi
JARFILE="${JARFILES[0]}"

# Delete Container
rm compiler-latest.tar.gz &> /dev/null
rm -r closure-compiler-fallback &> /dev/null

# Make Symbol Link
unlink "$SHDIR/gcc.jar" &> /dev/null
ln -s "$JARFILE" "$SHDIR/gcc.jar"

#--------------------------------

echo "Downloading/Updating Google Closure Compiler Sources"

if [ ! -d ~/.gcc/compiler/closure-compiler-source ]; then
	git clone https://github.com/google/closure-compiler.git ~/.git/compiler/closure-compiler-source
else
	cd ~/.gcc/compiler/closure-compiler-source
	git pull origin master
fi

# Find Externs - required for compiling web services
EXTERNS=( ~/.gcc/compiler/closure-compiler-source/externs )
if [ ! -e $EXTERNS ]; then
	echo "${TAB}Error: Externs not found!" >&2
	echo "${TAB}Downloaded sources can be located at compiler folder"

	exit 1
fi
EXTERNS="${EXTERNS[0]}"

# Make Symbol Link
unlink "$SHDIR/externs" &> /dev/null
ln -s "$EXTERNS" "$SHDIR/externs"

# Find JSComp - required for compiling debug versions
JSCOMP=( ~/.gcc/compiler/closure-compiler-source/src/com/google/javascript/jscomp/js )
if [ ! -e $JSCOMP ]; then
	echo "${TAB}Error: jscomp not found!" >&2
	echo "${TAB}Downloaded sources can be located at compiler folder"

	exit 1
fi
JSCOMP="${JSCOMP[0]}"

# Make Symbol Link
unlink "$SHDIR/jscomp" &> /dev/null
ln -s "$JSCOMP" "$SHDIR/jscomp"

#--------------------------------

# Restore Working Dir
cd "$CUDIR"

echo "DONE"
