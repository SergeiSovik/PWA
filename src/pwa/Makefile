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

# List of Libraries to exclude
EXCLUDELIBS=js-none

# Launcher entry point
# This script starts main script
LAUNCHER=launcher.js

# Main entry point
# This file executed after all modules
MAIN=main.js

# List of global modules, executed before main module
GLOBALS=$(patsubst ./%,%,$(shell find ./globals -type f -name "*.js"))

# List of dependency modules, executed only if included in main or global modules
MODULES=$(patsubst ./%,%,$(shell find ./modules -type f -name "*.js"))

# List of external modules, executed only if included in main or global modules
define EXTERNAL
	src/include/event.js
	src/include/cache.js
	src/external/example.js
endef

# List of excluded modules
define EXCLUDES
endef

# Detect Current Dir Name (pwa)
DIR_NAME=$(shell basename "$(CURDIR)")
# Detect Source Dir Relative to Project (src/pwa)
ABS_SRC=$(patsubst $(PROJECT_DIR)/%,%,$(CURDIR))
# Detect Binary Dir Relative to Project (bin/pwa)
ABS_BIN=$(patsubst src/%,bin/%,$(ABS_SRC))
# Detect Project Dir Relative to Current Source Dir (../..)
REL_ROOT=$(shell echo "$(ABS_SRC)" | sed -e 's/[^\/]\+/../g')
# Detect Binary Dir Relative to Current Dir (../../bin/pwa)
REL_BIN ?= $(REL_ROOT)/$(ABS_BIN)

## Libraries
# List of all libraries
LIBS=$(shell find ./$(REL_ROOT)/src/lib -maxdepth 1 -mindepth 1 -type d -name "js-*")
# List of all libraries names
LIB_NAMES=$(patsubst ./$(REL_ROOT)/src/lib/%,%,$(LIBS))
# List of included libraries names
LIB_LIST=$(sort $(filter-out $(EXCLUDELIBS), $(LIB_NAMES)))
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

# Launcher Binary Relative to Current Dir (../../bin/pwa/launcher.js)
BIN_LAUNCHER=$(patsubst %, $(REL_BIN)/%,$(LAUNCHER))
# GCC Launcher (src/pwa/launcher.js) 
GCC_LAUNCHER=$(patsubst %,--js $(ABS_SRC)/%,$(LAUNCHER)) $(patsubst %,--entry_point $(ABS_SRC)/%,$(LAUNCHER))

## Excludes
REL_EXCLUDES=$(strip $(EXCLUDES))

## Globals
# Main Binary Relative to Current Dir (../../bin/pwa/main.js)
BIN_MAIN_STABLE=$(patsubst %, $(REL_BIN)/%,$(MAIN))
BIN_MAIN_ECMASCRIPT2015=$(patsubst %.js, $(REL_BIN)/%.2015.js,$(MAIN))
BIN_MAIN_ECMASCRIPT2017=$(patsubst %.js, $(REL_BIN)/%.2017.js,$(MAIN))
# Relative Globals (globals/global.js main.js)
REL_GLOBALS=$(sort $(filter-out $(REL_EXCLUDES), $(strip $(GLOBALS)))) $(MAIN)
# GCC Globals (src/pwa/globals/global.js src/pwa/main.js) 
GCC_GLOBALS=$(patsubst %,--js $(ABS_SRC)/%,$(REL_GLOBALS)) $(patsubst %,--entry_point $(ABS_SRC)/%,$(REL_GLOBALS))

## Modules
# Relative Modules (modules/module.js)
REL_MODULES=$(sort $(filter-out $(REL_EXCLUDES), $(strip $(MODULES))))
# GCC Modules (src/pwa/modules/module.js)
GCC_MODULES=$(patsubst %,--js $(ABS_SRC)/%,$(REL_MODULES))

## External
# Absolute External (src/includes/example.js)
SRC_EXTERNAL=$(strip $(EXTERNAL))
# Relative External (../../../src/includes/example.js)
REL_EXTERNAL=$(patsubst %,$(REL_ROOT)/%,$(SRC_EXTERNAL))
# GCC External (src/lib/js-example/includes/example.js)
GCC_EXTERNAL=$(patsubst %,--js %,$(SRC_EXTERNAL))

## Global External
GCC_STABLE=$(GCC_OUT_STABLE) $(patsubst %,--js %,$(INC_STABLE)) $(patsubst %,--entry_point %,$(INC_STABLE))
GCC_ECMASCRIPT2015=$(GCC_OUT_ECMASCRIPT2015) $(patsubst %,--js %,$(INC_ECMASCRIPT2015)) $(patsubst %,--entry_point %,$(INC_ECMASCRIPT2015))
GCC_ECMASCRIPT2017=$(GCC_OUT_ECMASCRIPT2017) $(patsubst %,--js %,$(INC_ECMASCRIPT2017)) $(patsubst %,--entry_point %,$(INC_ECMASCRIPT2017))
GCC_PLATFORM=$(patsubst %,--js %,$(INC_PLATFORM))

## Resources
# All Resources
SRC_CSS=$(patsubst ./%,%,$(shell find ./css -type f -name "*" -not -name ".*" -not -name "*.md"))
SRC_HTML=$(patsubst ./%,%,$(shell find . -type f -name "*.html"))
SRC_IMAGES=$(patsubst ./%,%,$(shell find ./images -type f -name "*" -not -name ".*" -not -name "*.md"))
SRC_SOUNDS=$(patsubst ./%,%,$(shell find ./sounds -type f -name "*" -not -name ".*" -not -name "*.md"))
SRC_FAVICON=$(patsubst ./%,%,$(shell find . -type f -name "favicon.*"))
SRC_APPICON=$(patsubst ./%,%,$(shell find ./appicon -type f \( -name "*.png" -o -name "*.svg" \) ))
SRC_MANIFEST=$(patsubst ./%,%,$(shell find . -type f -name "manifest.webmanifest"))
SRC_PHP=$(patsubst ./%,%,$(shell find . -type f -name "*.php"))
SRC_INCLUDE=$(patsubst ./%,%,$(shell find ./include -type f -name "*" -not -name ".*" -not -name "*.md"))

# List of resources for simple copy to binary
SRC_UNCOMPRESSED=$(SRC_IMAGES) $(SRC_SOUNDS) $(SRC_FAVICON) $(SRC_APPICON) $(SRC_INCLUDE)
# List of resources for minification and string replace from string.conf
SRC_JSON=$(SRC_MANIFEST)
# List of resources for string replace from string.conf
SRC_PROCESSED=$(SRC_PHP)

BIN_UNCOMPRESSED=$(patsubst %,$(REL_BIN)/%,$(SRC_UNCOMPRESSED))
BIN_CSS=$(patsubst %,$(REL_BIN)/%,$(SRC_CSS))
BIN_HTML=$(patsubst %,$(REL_BIN)/%,$(SRC_HTML))
BIN_JSON=$(patsubst %,$(REL_BIN)/%,$(SRC_JSON))
BIN_PROCESSED=$(patsubst %,$(REL_BIN)/%,$(SRC_PROCESSED))

## Targets

all: build-release

test:

build-release: resources $(BIN_LAUNCHER) $(BIN_MAIN_STABLE) $(BIN_MAIN_ECMASCRIPT2015) $(BIN_MAIN_ECMASCRIPT2017)

resources: $(BIN_UNCOMPRESSED) $(BIN_CSS) $(BIN_HTML) $(BIN_JSON) $(BIN_PROCESSED)

$(BIN_UNCOMPRESSED): $(SRC_UNCOMPRESSED)
	@echo "Updating $(patsubst $(REL_ROOT)/%,%,$@)"
	@mkdir -p $(dir $@)
	@cp -r $(patsubst $(REL_BIN)/%,%,$@) $@

$(BIN_CSS): $(SRC_CSS) ./../strings.conf
	@echo "Updating $(patsubst $(REL_ROOT)/%,%,$@)"
	@mkdir -p $(dir $@)
	@./$(REL_ROOT)/compiler/minify.sh "$@" "$(patsubst $(REL_BIN)/%,%,$@)" "./../strings.conf" "text/css"

$(BIN_HTML): $(SRC_HTML) ./../strings.conf
	@echo "Updating $(patsubst $(REL_ROOT)/%,%,$@)"
	@mkdir -p $(dir $@)
	@./$(REL_ROOT)/compiler/minify.sh "$@" "$(patsubst $(REL_BIN)/%,%,$@)" "./../strings.conf" "text/html"

$(BIN_JSON): $(SRC_JSON) ./../strings.conf
	@echo "Updating $(patsubst $(REL_ROOT)/%,%,$@)"
	@mkdir -p $(dir $@)
	@./$(REL_ROOT)/compiler/minify.sh "$@" "$(patsubst $(REL_BIN)/%,%,$@)" "./../strings.conf" "application/json"

$(BIN_PROCESSED): $(SRC_PROCESSED) ./../strings.conf
	@echo "Updating $(patsubst $(REL_ROOT)/%,%,$@)"
	@mkdir -p $(dir $@)
	@./$(REL_ROOT)/compiler/replace.sh "$@" "$(patsubst $(REL_BIN)/%,%,$@)" "./../strings.conf"

$(BIN_LAUNCHER):
	@echo "Building $(patsubst $(REL_ROOT)/%,%,$@)"
	@( cd $(REL_ROOT); $(strip $(GCC)) $(GCC_STABLE) $(GCC_PLATFORM) $(GCC_LAUNCHER) --create_source_map "$(patsubst $(REL_ROOT)/%,%,$@).map" --js_output_file "$(patsubst $(REL_ROOT)/%,%,$@)" 2>&1 | ./compiler/errors.sh )
	@echo "//# sourceMappingURL=$(patsubst $(REL_BIN)/%,%,$@).map" >> $@
	@sed -i 's:\"src/:\"../src/:g' $@.map

$(BIN_MAIN_STABLE): $(REL_GLOBALS) $(REL_MODULES) $(REL_EXTERNAL) $(REL_LIBS) Makefile
	@echo "Building $(patsubst $(REL_ROOT)/%,%,$@)"
	@( cd $(REL_ROOT); $(strip $(GCC)) $(GCC_STABLE) $(GCC_PLATFORM) $(GCC_EXTERNAL) $(GCC_LIBS) $(GCC_MODULES) $(GCC_GLOBALS) --create_source_map "$(patsubst $(REL_ROOT)/%,%,$@).map" --js_output_file "$(patsubst $(REL_ROOT)/%,%,$@)" 2>&1 | ./compiler/errors.sh )
	@echo "//# sourceMappingURL=$(patsubst $(REL_BIN)/%,%,$@).map" >> $@
	@sed -i 's:\"src/:\"../src/:g' $@.map

$(BIN_MAIN_ECMASCRIPT2015): $(REL_GLOBALS) $(REL_MODULES) $(REL_EXTERNAL) $(REL_LIBS) Makefile
	@echo "Building $(patsubst $(REL_ROOT)/%,%,$@)"
	@( cd $(REL_ROOT); $(strip $(GCC)) $(GCC_ECMASCRIPT2015) $(GCC_PLATFORM) $(GCC_EXTERNAL) $(GCC_LIBS) $(GCC_MODULES) $(GCC_GLOBALS) --create_source_map "$(patsubst $(REL_ROOT)/%,%,$@).map" --js_output_file "$(patsubst $(REL_ROOT)/%,%,$@)" 2>&1 | ./compiler/errors.sh )
	@echo "//# sourceMappingURL=$(patsubst $(REL_BIN)/%,%,$@).map" >> $@
	@sed -i 's:\"src/:\"../src/:g' $@.map

$(BIN_MAIN_ECMASCRIPT2017): $(REL_GLOBALS) $(REL_MODULES) $(REL_EXTERNAL) $(REL_LIBS) Makefile
	@echo "Building $(patsubst $(REL_ROOT)/%,%,$@)"
	@( cd $(REL_ROOT); $(strip $(GCC)) $(GCC_ECMASCRIPT2017) $(GCC_PLATFORM) $(GCC_EXTERNAL) $(GCC_LIBS) $(GCC_MODULES) $(GCC_GLOBALS) --create_source_map "$(patsubst $(REL_ROOT)/%,%,$@).map" --js_output_file "$(patsubst $(REL_ROOT)/%,%,$@)" 2>&1 | ./compiler/errors.sh )
	@echo "//# sourceMappingURL=$(patsubst $(REL_BIN)/%,%,$@).map" >> $@
	@sed -i 's:\"src/:\"../src/:g' $@.map

clean:
	@echo "Cleaning $(ABS_BIN)"
	@rm -r -f $(REL_BIN)

merge:
