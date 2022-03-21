#!/bin/bash
# Copyright 2016 Erik Neumann. All Rights Reserved.
# Use of this source code is governed by the Apache License, Version 2.0.
# See the LICENSE file and http://www.apache.org/licenses/LICENSE-2.0.

# compile a single simulation.
# param: {string} source = source file name, example: src/sims/mechanics/Spring1App.js
# param: {string} target = output file, example: build/sims/mechanics/Spring1App-en.js
# param: {boolean} goog_debug = whether to compile with goog.DEBUG=true
# param: {boolean} util_debug = whether to compile with Util.DEBUG=true
# param: {string} COMPILE_LEVEL = "simple", "advanced", or "whitespace". Specifies
#        which level of closure compiler optimizations to use
# input: the variable CLOSURE_COMPILER must be set; it is set in myConfig.mk
#        so that each user can specify it for their environment.
# output: compiled version of that file, example: build/sims/mechanics/Spring1App-de.js

#set dbg to "true" to show some debug statements
dbg=""

# check if closure-library link exists
if [ ! -f ./closure-library/goog/array/array.js ]; then
	echo "$0 ERROR: cannot find closure-library. Create a symbolic link with a command like:"
	echo "       ln -s ../closure-library/closure/ closure-library"
	exit 1
fi

source="${1}"
# -z <STRING>	True, if <STRING> is empty.
if [ -z "$source" ] ; then
	echo "$0 ERROR: no source file specified"
	exit 1
fi
if [ ".js" != "${source: -3}" ] ; then
	echo "$0 ERROR: file $source does not end with .js"
	exit 1
fi

target="${2}"
if [ -z "$target" ] ; then
	echo "$0 ERROR: no target file specified"
	exit 1
fi
REDO=1
source2=${source%%.js}.bak
if [ -n "$REDO" -a -f "${source2}" ];then
	cp ${source2} ${source}
fi
if [ ! -f "${source2}" ];then
	cp ${source} ${source2}
fi
sed -i -r 's@([^/]this.addURLScriptButton\(\).*)@\/\/\1@g' $source

# Find locale from suffix of target:  foo-en.js is "en";  bar-de.js is "de"
# ${variable##pattern} Trim the longest match from the beginning
locale=${target##*-}
# ${variable%%pattern} Trim the longest match from the end:  remove the ".js"
locale=${locale%%.*}
if [ -z "$locale" ] ; then
	echo "cannot determine locale from $target"
	exit 1
fi

# ${parameter:-word} Use Default Values. If parameter is unset or null, 
# the expansion of word is substituted. Otherwise, the value of parameter 
# is substituted.
goog_debug="${3:-false}"
util_debug="${4:-false}"
COMPILE_LEVEL="${5:-simple}"

if [[ "$COMPILE_LEVEL" == "advanced" ]] ; then
	comp_level="ADVANCED"
	advanced="true"
	wrapper="--output_wrapper=(/*Copyright_2020_Erik_Neumann_All_Rights_Reserved_www.myphysicslab.com*/function(){%output%}).call(window)"
elif [[ "$COMPILE_LEVEL" == "simple" ]] ; then
	comp_level="SIMPLE"
	advanced="false"
	wrapper="--output_wrapper=/*Copyright_2020_Erik_Neumann_All_Rights_Reserved_www.myphysicslab.com*/%output%"
elif [[ "$COMPILE_LEVEL" == "whitespace" ]] ; then
	comp_level="WHITESPACE_ONLY"
	advanced="false"
	wrapper="--output_wrapper=/*Copyright_2020_Erik_Neumann_All_Rights_Reserved_www.myphysicslab.com*/%output%"
else
	echo "COMPILE_LEVEL=$COMPILE_LEVEL, must be simple or advanced"
	exit 1
fi

echo $wrapper

if [ -z "$CLOSURE_COMPILER" ] ; then
	echo "CLOSURE_COMPILER not set"; exit 1;
fi
if [ ! -e "$CLOSURE_COMPILER" ] ; then
	echo "$CLOSURE_COMPILER does not exist"; exit 1;
fi

# We are starting with
# source = src/sims/mechanics/Spring1App.js
# target:  build/sims/mechanics/Spring1App-de.js

# We need to generate the strings:
# buildRoot: build/
# namespace:  myphysicslab.sims.mechanics.Spring1App
# rootDir:  src

# ${variable%%pattern}  Trim the longest match from the end
buildRoot="${target%%/*}"

# ${variable%pattern}  Trim the shortest match from the end
buildDir="${target%/*}"
mkdir -p "$buildDir"

# ${variable%%pattern}  Trim the longest match from the end
rootDir="${source%%/*}"

# ${variable%pattern}  Trim the shortest match from the end
# This removes the ".js" from end of string.
namespace="${source%.js}"
# ${variable#pattern} Trim the shortest match from the beginning
# This removes the source directory name, such as "src/" from start of string.
namespace="${namespace#*/}"
# Search and Replace:  ${variable//pattern/string}
# The two slashes mean "replace all occurences".
# Here we replace the / in the filename with .   Note that / is escaped.
namespace="myphysicslab.${namespace//\//.}"

# -n <STRING>	True, if <STRING> is not empty
if [ -n "$dbg" ] ; then
	echo "source=$source, target=$target, locale=$locale, buildRoot=$buildRoot, buildDir=$buildDir, goog_debug=$goog_debug, COMPILE_LEVEL=$COMPILE_LEVEL, namespace=$namespace";
fi

#exit 0

# Creates a single compiled script containing the required functions
# from the Closure Library and myphysicslab that are needed to realize
# things in the specified closure_entry_point(s).
#
# Note that the compiler arranges the order of files using a "dependency analysis"
# in order to run the target closure_entry_point.
# See https://github.com/google/closure-compiler/wiki/Managing-Dependencies
# See the compiler --help about options --dependency_mode, and --closure_entry_point.
#
# Dec 25, 2020: Change language_in to ECMASCRIPT_2017 to use the mock clock stuff 
# (which I use in ClockTest.js).
#
# The myphysicslab.lab.util.Util.ADVANCED flag should be set 'true' when
# ADVANCED_OPTIMIZATIONS is used.
#
# It is possible to use Terminal for interactive debugging under advanced compile by
# leaving ADVANCED = false. In that case all the
# toString() methods are defined, but most other names are minified.
# Use goog.exportSymbol to make certain variables (e.g. sim, timer, labCanvas, etc.)
# available under advanced compile (for debugging via Terminal).
#
# To debug compiled code use the following flags,
# and see Chapter 16 of "Closure: The Definitive Guide" by Bolin.
# --debug prevents names being minimized and obfuscated
# --formatting=PRETTY_PRINT maintains line breaks similar to original code
# --formatting=PRINT_INPUT_DELIMITER adds a comment for every new input file processed,
# so you can tell what file the compiled code is from.
# --debug \
# --formatting=PRETTY_PRINT \
# --formatting=PRINT_INPUT_DELIMITER \
#
# compilation_levels: WHITESPACE_ONLY, SIMPLE, ADVANCED
# --version  displays compiler version to stdout and quit
# --help  displays compiler options to stdout and quit
#
# This option gives LOTS of errors, mostly in closure-library.  This option is
# "intended for the compiler team to debug issues in the typechecker, not for users".
# --jscomp_error=reportUnknownTypes \
#
# To see list of all inputs processed in sorted order, add this flag:
# --output_manifest="${target%.js}.MF" \
#
# To see compiler options:
#  java -jar ../compiler-latest/closure-compiler-v20201207.jar --help
# To see compiler version:
#  java -jar ../compiler-latest/closure-compiler-v20201207.jar --version
#
# Use this to turn conformance violations from warning to error:
# --jscomp_error=conformanceViolations \
#
# We use `readlink` to convert a symbolic link to a regular file reference.
# See this discussion:
# https://stackoverflow.com/questions/7665/how-to-resolve-symbolic-links-in-a-shell-script/
#
# Use --output_wrapper to fix a performance problem under advanced-compile.
# See https://github.com/google/closure-compiler/issues/171
# --output_wrapper="'(function(){%output%}).call(window)'" \
# Note that the `call(window)` is required when using ECMASCRIPT5_STRICT.
# Note that under simple-compile the wrapper prevents names from being available,
# therefore we don't use the wrapper under simple-compile.

closure_lib=`readlink closure-library`
working_dir=`pwd`
# Using set -x shows the commands being executed, but the problem is that
# the set +x always returns zero which means "success".
set -x
java -jar "$CLOSURE_COMPILER" \
--entry_point=goog:$namespace \
--compilation_level=$comp_level \
--define=goog.DEBUG=$goog_debug \
--define=goog.LOCALE="'$locale'" \
--define=module\$exports\$myphysicslab\$lab\$util\$Util.ADVANCED=$advanced \
--define=module\$exports\$myphysicslab\$lab\$util\$Util.DEBUG=$util_debug \
--define=module\$exports\$myphysicslab\$lab\$util\$Util.COMPILE_TIME="`date +%F' '%T`" \
--generate_exports \
--js=$closure_lib \
--js=$rootDir \
--jscomp_error=accessControls \
--jscomp_error=checkTypes \
--jscomp_error=checkVars \
--jscomp_error=const \
--jscomp_error=constantProperty \
--jscomp_error=globalThis \
--jscomp_error=invalidCasts \
--jscomp_error=misplacedTypeAnnotation \
--jscomp_error=missingProperties \
--jscomp_error=missingProvide \
--jscomp_error=missingRequire \
--jscomp_error=missingReturn \
--jscomp_error=strictModuleDepCheck \
--jscomp_error=suspiciousCode \
--jscomp_error=typeInvalidation \
--jscomp_error=undefinedNames \
--jscomp_error=undefinedVars \
--jscomp_error=unknownDefines \
--jscomp_error=uselessCode \
--jscomp_error=visibility \
--hide_warnings_for=$closure_lib \
--conformance_configs=$working_dir/conformance_config.textproto \
--emit_use_strict \
--language_in=ECMASCRIPT_2017 \
--language_out=ECMASCRIPT_2017 \
--dependency_mode=PRUNE \
--warning_level=VERBOSE \
$wrapper \
> $target
result=$?

if [ -f "${source2}" ];then
	mv ${source2} ${source}
fi

set +x

# for simple-compile apps, do a search/replace to make shorter names
# replace "module$exports$myphysicslab$" with ""
# This makes typical file about 10% smaller.
# WARNING: Closure Compiler could change how these module exports are named.
if [[ $comp_level == 'SIMPLE' ]] ; then
	sed -E -i '' "s/module\\\$exports\\\$myphysicslab\\\$//g" $target;
	sed -E -i '' "s/module\\\$contents\\\$goog\\\$/goog\\\$/g" $target;
fi

# Check the error code in $?, if non-zero then return non-zero error code.
# This avoids the problem of `set +x` always returning "success".
if [[ $result -ne 0 ]] ; then
    exit 1
fi
