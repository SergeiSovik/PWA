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

ifndef PROJECT_DIR
$(error Use make only inside Project dir, submake requires variable imports)
endif

# Binary Path Relative To Project
PWA=bin/pwa

# List of Libraries to include
LIB_LIST=js-example

# Main entry point
# This file executed after all modules
MAIN=service.js

# List of global modules, executed before main module
GLOBALS=$(patsubst ./%,%,$(shell find ./globals/ -type f -name "*.js"))

# List of dependency modules, executed only if included in main or global modules
MODULES=$(patsubst ./%,%,$(shell find ./modules/ -type f -name "*.js"))

# List of external modules, executed only if included in main or global modules
define EXTERNAL
	src/include/cache.js
endef

# List of excluded modules
define EXCLUDES
endef

# Detect Current Dir Name (service)
DIR_NAME=$(shell basename "$(CURDIR)")
# Detect Source Dir Relative to Project (src/service)
ABS_SRC=$(patsubst $(PROJECT_DIR)/%,%,$(CURDIR))
# Detect Binary Dir Relative to Project (bin/pwa)
ABS_BIN=$(PWA)
# Detect Project Dir Relative to Current Source Dir (../..)
REL_ROOT=$(shell echo "$(ABS_SRC)" | sed -e 's/[^\/]\+/../g')
# Detect Binary Dir Relative to Current Dir (../../bin/pwa)
REL_BIN ?= $(REL_ROOT)/$(ABS_BIN)

## Libraries
# Relative List of global modules of included libraries
REL_LIBS_GLOBALS=$(wildcard $(patsubst %,$(REL_ROOT)/src/lib/%/globals/*.js,$(LIB_LIST)))
# Relative List of dependency modules of included libraries
REL_LIBS_MODULES=$(wildcard $(patsubst %,$(REL_ROOT)/src/lib/%/modules/*.js,$(LIB_LIST)))
# Absolute List of global modules of included libraries
ABS_LIBS_GLOBALS=$(patsubst $(REL_ROOT)/%,%,$(REL_LIBS_GLOBALS))
# Absolute List of dependency modules of included libraries
ABS_LIBS_MODULES=$(patsubst $(REL_ROOT)/%,%,$(REL_LIBS_MODULES))
# GCC Libs Globals (src/pwa/globals/global.js src/pwa/main.js) 
GCC_LIBS_GLOBALS=$(patsubst %,--js %,$(ABS_LIBS_GLOBALS)) $(patsubst %,--entry_point %,$(ABS_LIBS_GLOBALS))
# GCC Libs Globals (src/pwa/globals/global.js src/pwa/main.js) 
GCC_LIBS_MODULES=$(patsubst %,--js %,$(ABS_LIBS_MODULES)) $(patsubst %,--entry_point %,$(ABS_LIBS_MODULES))
# Refs
REL_LIBS=$(REL_LIBS_GLOBALS) $(REL_LIBS_MODULES)
GCC_LIBS=$(GCC_LIBS_GLOBALS) $(GCC_LIBS_MODULES)

## Excludes
REL_EXCLUDES=$(strip $(EXCLUDES))

## Globals
# Main Binary Relative to Current Dir (../../bin/pwa/service.js)
BIN_MAIN_ECMASCRIPT2015=$(patsubst %.js, $(REL_BIN)/%.2015.js,$(MAIN))
BIN_MAIN_ECMASCRIPT2017=$(patsubst %.js, $(REL_BIN)/%.2017.js,$(MAIN))
# Relative Globals (globals/global.js main.js)
REL_GLOBALS=$(sort $(filter-out $(REL_EXCLUDES), $(strip $(GLOBALS)))) $(MAIN)
# GCC Globals (src/service/globals/global.js src/service/service.js) 
GCC_GLOBALS=$(patsubst %,--js $(ABS_SRC)/%,$(REL_GLOBALS)) $(patsubst %,--entry_point $(ABS_SRC)/%,$(REL_GLOBALS))

## Modules
# Relative Modules (modules/module.js)
REL_MODULES=$(sort $(filter-out $(REL_EXCLUDES), $(strip $(MODULES))))
# GCC Modules (src/service/modules/module.js)
GCC_MODULES=$(patsubst %,--js $(ABS_SRC)/%,$(REL_MODULES))

## External
# Absolute External (src/includes/example.js)
SRC_EXTERNAL=$(strip $(EXTERNAL))
# Relative External (../../../src/includes/example.js)
REL_EXTERNAL=$(patsubst %,$(REL_ROOT)/%,$(SRC_EXTERNAL))
# GCC External (src/lib/js-example/includes/example.js)
GCC_EXTERNAL=$(patsubst %,--js %,$(SRC_EXTERNAL))

## Global External
REL_PLATFORM=$(patsubst %,$(REL_ROOT)/%,$(INC_PLATFORM))
GCC_ECMASCRIPT2015=$(GCC_OUT_ECMASCRIPT2015) $(patsubst %,--js %,$(INC_ECMASCRIPT2015)) $(patsubst %,--entry_point %,$(INC_ECMASCRIPT2015))
GCC_ECMASCRIPT2017=$(GCC_OUT_ECMASCRIPT2017) $(patsubst %,--js %,$(INC_ECMASCRIPT2017)) $(patsubst %,--entry_point %,$(INC_ECMASCRIPT2017))
GCC_PLATFORM=$(patsubst %,--js %,$(INC_PLATFORM))

all: build-release

test:

build-release: $(BIN_LAUNCHER) $(BIN_MAIN_ECMASCRIPT2015) $(BIN_MAIN_ECMASCRIPT2017)

$(BIN_MAIN_ECMASCRIPT2015): $(REL_PLATFORM) $(REL_GLOBALS) $(REL_MODULES) $(REL_EXTERNAL) $(REL_LIBS) Makefile
	@echo "Building $(patsubst $(REL_ROOT)/%,%,$@)"
	@( cd $(REL_ROOT); $(strip $(GCC_SERVICE)) $(GCC_ECMASCRIPT2015) $(GCC_PLATFORM) $(GCC_EXTERNAL) $(GCC_LIBS) $(GCC_MODULES) $(GCC_GLOBALS) --create_source_map "$(patsubst $(REL_ROOT)/%,%,$@).map" --js_output_file "$(patsubst $(REL_ROOT)/%,%,$@)" 2>&1 | ./compiler/errors.sh )
	@echo "//# sourceMappingURL=$(patsubst $(REL_BIN)/%,%,$@).map" >> $@
	@sed -i 's:\"src/:\"../src/:g' $@.map

$(BIN_MAIN_ECMASCRIPT2017): $(REL_PLATFORM) $(REL_GLOBALS) $(REL_MODULES) $(REL_EXTERNAL) $(REL_LIBS) Makefile
	@echo "Building $(patsubst $(REL_ROOT)/%,%,$@)"
	@( cd $(REL_ROOT); $(strip $(GCC_SERVICE)) $(GCC_ECMASCRIPT2017) $(GCC_PLATFORM) $(GCC_EXTERNAL) $(GCC_LIBS) $(GCC_MODULES) $(GCC_GLOBALS) --create_source_map "$(patsubst $(REL_ROOT)/%,%,$@).map" --js_output_file "$(patsubst $(REL_ROOT)/%,%,$@)" 2>&1 | ./compiler/errors.sh )
	@echo "//# sourceMappingURL=$(patsubst $(REL_BIN)/%,%,$@).map" >> $@
	@sed -i 's:\"src/:\"../src/:g' $@.map

clean:
	@echo "Cleaning $(ABS_BIN)"
	@rm -r -f $(BIN_MAIN_ECMASCRIPT2015) $(BIN_MAIN_ECMASCRIPT2017)
	@rm -r -f $(BIN_MAIN_ECMASCRIPT2015).map $(BIN_MAIN_ECMASCRIPT2017).map

merge:
