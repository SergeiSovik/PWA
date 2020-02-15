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

# Define Backup Dir
BACKUP_DIR=.backup

# Current Timestamp
TIMESTAMP=$(subst T,-,$(subst -,,$(subst :,-,$(shell date +"%FT%T"))))

# Detect Current Dir Name
DIR_NAME=$(shell basename "$(CURDIR)")

# Export Project Dir
export PROJECT_DIR=$(CURDIR)

# Export Core External
export INC_PLATFORM=src/include/platform.js
export INC_STABLE=src/include/stable.js
export INC_ECMASCRIPT2015=src/include/ecmascript2015.js
export INC_ECMASCRIPT2017=src/include/ecmascript2017.js

define GCC_BASE_IMPL
	java -jar compiler/gcc.jar
		--module_resolution NODE
		--language_in ECMASCRIPT_NEXT
		--strict_mode_input
		--warning_level VERBOSE
		--charset UTF8
		--dependency_mode PRUNE_LEGACY
		--js src/externs/platform.js
		--js src/include/license.js
endef

define GCC_RELEASE_IMPL
	--compilation_level ADVANCED
endef

define GCC_DEBUG_IMPL
	--compilation_level WHITESPACE_ONLY
	--formatting PRETTY_PRINT
	--js compiler/jscomp/base.js
	--js compiler/jscomp/util/global.js
	--js compiler/jscomp/util/defines.js
	--js compiler/jscomp/util/defineproperty.js
	--js compiler/jscomp/es6/util/arrayiterator.js
	--js compiler/jscomp/es6/symbol.js
	--js compiler/jscomp/es6/util/makeiterator.js
	--js compiler/jscomp/util/polyfill.js
	--js compiler/jscomp/es6/promise/promise.js
	--js compiler/jscomp/es6/util/setprototypeof.js
	--js compiler/jscomp/es6/generator_engine.js
	--js compiler/jscomp/es6/execute_async_generator.js
	--js compiler/jscomp/util/objectcreate.js
	--js compiler/jscomp/es6/util/inherits.js
	--js compiler/jscomp/util/checkstringargs.js
	--js compiler/jscomp/es6/string/repeat.js
endef

define GCC_SERVICE_IMPL
	--js src/externs/service.js
endef

# Export GCC Release/Debug Command Line
export GCC_RELEASE=$(strip $(GCC_BASE_IMPL)) $(strip $(GCC_RELEASE_IMPL))
export GCC_DEBUG=$(strip $(GCC_BASE_IMPL)) $(strip $(GCC_DEBUG_IMPL))
export GCC_SERVICE=$(GCC_RELEASE) $(strip $(GCC_SERVICE_IMPL))

# Export GCC Language Out
export GCC_OUT_STABLE=--language_out STABLE
export GCC_OUT_ECMASCRIPT_2015=--language_out ECMASCRIPT_2015
export GCC_OUT_ECMASCRIPT_2017=--language_out ECMASCRIPT_2017

all: build-debug

release: clean build-release

debug: clean build-debug

rebuild: clean build-debug

build-release:
	clear
	+@make -j 8 -s -C src GCC="$(GCC_RELEASE)"

build-debug:
	clear
	+@make -j 8 -s -C src GCC="$(GCC_DEBUG)"

test:
	clear
	+@make -s -C src test GCC="$(GCC_RELEASE)"

clean:
	+@make -s -C src clean

help:
	@java -jar compiler/gcc.jar --help

backup:
	@mkdir -p $(BACKUP_DIR)
	@tar --exclude='./$(BACKUP_DIR)' --exclude='./bin' --exclude='./tmp' -pczf "$(BACKUP_DIR)/$(DIR_NAME)-$(TIMESTAMP).tar.gz" .

merge:
	@make -s -C src merge
	@$(PROJECT_DIR)/compiler/merge.sh
