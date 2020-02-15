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

# Make all submakes exclude externs and include

TOPTARGETS := all test clean merge
SUBDIRS := $(sort $(dir $(filter-out externs/ include/ external/, $(wildcard */))))

all: $(SUBDIRS) ../bin/index.html

../bin/index.html: index.html
	@echo "Updating $(patsubst ../%,%,$@)"
	@mkdir -p $(dir $@)
	@./../compiler/minify.sh "$@" "$(patsubst ../bin/%,%,$@)" "strings.conf" "text/html"

$(TOPTARGETS): $(SUBDIRS)
$(SUBDIRS):
	+@make -j 8 -s -C $@ $(MAKECMDGOALS)

.PHONY: $(TOPTARGETS) $(SUBDIRS)
