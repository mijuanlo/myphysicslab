// Copyright 2016 Erik Neumann.  All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.module('myphysicslab.lab.model.VarsList');

const array = goog.require('goog.array');
const asserts = goog.require('goog.asserts');
const AbstractSubject = goog.require('myphysicslab.lab.util.AbstractSubject');
const ConcreteVariable = goog.require('myphysicslab.lab.model.ConcreteVariable');
const GenericEvent = goog.require('myphysicslab.lab.util.GenericEvent');
const Parameter = goog.require('myphysicslab.lab.util.Parameter');
const Subject = goog.require('myphysicslab.lab.util.Subject');
const Util = goog.require('myphysicslab.lab.util.Util');
const Variable = goog.require('myphysicslab.lab.model.Variable');

/** A set of {@link Variable}s which represent the current state of a simulation.
Variables are numbered from `0` to `n-1` where `n` is the number of Variables.

VarsList is a {@link Subject} and each Variable is a {@link Parameter} of the VarsList.
This makes the set of Variables available for scripting with
{@link myphysicslab.lab.util.EasyScriptParser}.

Unlike other Subject classes, VarsList does not broadcast each Variable whenever the
Variable changes. And VarsList prohibits adding general Parameters in its
{@link #addParameter} method, because it can only contain Variables.

As a Subject, the VarsList will broadcast the {@link #VARS_MODIFIED} event to its
Observers whenever Variables are added or removed.


### Continuous vs. Discontinuous Changes

A change to a Variable is either continuous or discontinuous. This affects how a line
graph of the Variable is drawn: {@link myphysicslab.lab.graph.DisplayGraph}
doesn't draw a line at a point of discontinuity. A discontinuity is
indicated by incrementing the {@link Variable#getSequence sequence number} of the Variable.

It is important to note that {@link #setValue} and {@link #setValues} have an optional
parameter `continuous` which determines whether the change of variable is continuous or
discontinuous.

Here are some guidelines about when a change in a variable should be marked as being
discontinuous by incrementing the sequence number:

1. When a change increments only a few variables, be sure to increment any variables
that are **dependent** on those variables. For example, if velocity of an object is
discontinuously changed, then the kinetic, potential and total energy should all be
marked as discontinuous.

2. When **dragging** an object, don't increment variables of other objects.

3. When some **parameter** such as gravity or mass changes, increment any derived
variables (like energy) that depend on that parameter.


## Deleted Variables

When a variable is no longer used it has the reserved name 'DELETED'. Any such variable
should be ignored.  This allows variables to be added or removed without affecting the
index of other existing variables.


### Events Broadcast

+ GenericEvent name {@link VarsList.VARS_MODIFIED}

*/
class VarsList extends AbstractSubject {
/**
* @param {!Array<string>} varNames  array of language-independent variable names;
     these will be underscorized so the English names can be passed in here.
     See {@link Util#toName}.
* @param {!Array<string>} localNames  array of localized variable names
* @param {string=} opt_name name of this VarsList
* @throws {!Error} if varNames and localNames are different lengths, or contain
*     anything other than strings, or have duplicate values
*/
constructor(varNames, localNames, opt_name) {
  const name = opt_name !== undefined ? opt_name : 'VARIABLES';
  super(name);
  /**  Index of time variable, or -1 if there is no time variable.
  * @type {number}
  * @private
  */
  this.timeIdx_ = -1;
  if (varNames.length != localNames.length) {
    throw 'varNames and localNames are different lengths';
  }
  for (let i = 0, n = varNames.length; i<n; i++) {
    let s = varNames[i];
    if (typeof s !== 'string') {
      throw 'variable name '+s+' is not a string i='+i;
    }
    s = Util.validName(Util.toName(s));
    varNames[i] = s;
    // find index of the time variable.
    if (s == VarsList.TIME) {
      this.timeIdx_ = i;
    }
  }
  if (!Util.uniqueElements(varNames)) {
    throw 'duplicate variable names';
  }
  /**
  * @type {!Array<!Variable>}
  * @private
  */
  this.varList_ = [];
  for (let i = 0, n = varNames.length; i<n; i++) {
    this.varList_.push(new ConcreteVariable(this, varNames[i], localNames[i]));
  }
  /** Whether to save simulation state history.
  * @type {boolean}
  * @private
  */
  this.history_ = Util.DEBUG;
  /** Recent history of the simulation state for debugging;  an array of copies
  * of the vars array.
  * @type {!Array<!Array<number>>}
  * @private
  */
  this.histArray_ = [];
};

/** @override */
toString() {
  return Util.ADVANCED ? '' : this.toStringShort().slice(0, -1)
      +', timeIdx_: '+this.timeIdx_
      +', history_: '+this.history_
      + ', ' + this.varList_.map(
        (v, idx) => '('+idx+') '+ v.getName()+': '+Util.NF5E(v.getValue()))
      + super.toString();
};

/** @override */
toStringShort() {
  return Util.ADVANCED ? '' : super.toStringShort().slice(0, -1)
      +', numVars: '+this.varList_.length+'}';
};

/** @override */
getClassName() {
  return 'VarsList';
};

/** @override */
addParameter(parameter) {
  throw 'addParameter not allowed on VarsList';
};

/** Add a Variable to this VarsList.
@param {!Variable} variable the Variable to add
@return {number} the index number of the variable
@throws {!Error} if name if the Variable is 'DELETED'
*/
addVariable(variable) {
  const name = variable.getName();
  if (name == VarsList.DELETED) {
    throw 'variable cannot be named "'+VarsList.DELETED+'"';
  }
  // add variable to first open slot
  const position = this.findOpenSlot_(1);
  this.varList_[position] = variable;
  if (name == VarsList.TIME) {
    // auto-detect time variable
    this.timeIdx_ = position;
  }
  this.broadcast(new GenericEvent(this, VarsList.VARS_MODIFIED));
  return position;
}

/** Add a continguous block of ConcreteVariables.
@param {!Array<string>} names language-independent names of variables; these will be
     underscorized so the English name can be passed in here.
     See {@link Util#toName}.
@param {!Array<string>} localNames localized names of variables
@return {number} index index of first ConcreteVariable that was added
@throws {!Error} if any of the variable names is 'DELETED', or array of names is empty
*/
addVariables(names, localNames) {
  const howMany = names.length;
  if (howMany == 0) {
    throw '';
  }
  if (names.length != localNames.length) {
    throw 'names and localNames are different lengths';
  }
  const position = this.findOpenSlot_(howMany);
  for (let i=0; i<howMany; i++) {
    const name = Util.validName(Util.toName(names[i]));
    if (name == VarsList.DELETED) {
      throw "variable cannot be named ''+VarsList.DELETED+''";
    }
    const idx = position+i;
    this.varList_[idx] = new ConcreteVariable(this, name, localNames[i]);
    if (name == VarsList.TIME) {
      // auto-detect time variable
      this.timeIdx_ = idx;
    }
  }
  this.broadcast(new GenericEvent(this, VarsList.VARS_MODIFIED));
  return position;
};

/**
* @param {number} index
* @private
*/
checkIndex_(index) {
  if (index < 0 || index >= this.varList_.length) {
    throw 'bad variable index='+index+'; numVars='+this.varList_.length;
  }
};

/** Delete several variables, but leaves those places in the array as empty spots that
can be allocated in future with {@link #addVariables}. Until an empty spot is
reallocated, the name of the variable at that spot has the reserved name 'DELETED' and
should not be used.
@param {number} index index of first variable to delete
@param {number} howMany number of variables to delete
*/
deleteVariables(index, howMany) {
  if (howMany == 0) {
    return;
  }
  if (howMany < 0 || index < 0 || index+howMany > this.varList_.length) {
    throw 'deleteVariables';
  }
  for (let i=index; i<index+howMany; i++) {
    this.varList_[i] = new ConcreteVariable(this, VarsList.DELETED,
        VarsList.DELETED);
  }
  this.broadcast(new GenericEvent(this, VarsList.VARS_MODIFIED));
};

/** Returns index to put a contiguous group of variables.  Expands the set of variables
if necessary.
@param {number} quantity number of contiguous variables to allocate
@return {number} index of first variable
@private
*/
findOpenSlot_(quantity) {
  if (quantity < 0) {
    throw '';
  }
  let found = 0;
  let startIdx = -1;
  for (let i=0, n=this.varList_.length; i<n; i++) {
    if (this.varList_[i].getName() == VarsList.DELETED) {
      if (startIdx == -1) {
        startIdx = i;
      }
      found++;
      if (found >= quantity) {
        return startIdx;
      }
    } else {
      startIdx = -1;
      found = 0;
    }
  }
  let expand;
  if (found > 0) {
    // Found a group of deleted variables at end of VarsList, but need more.
    // Expand to get full quantity.
    expand = quantity - found;
    asserts.assert(startIdx >= 0);
    asserts.assert(expand > 0);
  } else {
    // Did not find contiguous group of deleted variables of requested size.
    // Add space at end of current variables.
    startIdx = this.varList_.length;
    expand = quantity;
  }
  for (let i=0; i<expand; i++) {
    this.varList_.push(new ConcreteVariable(this, VarsList.DELETED, VarsList.DELETED));
  }
  return startIdx;
};

/** Whether recent history is being stored, see {@link #saveHistory}.
@return {boolean} true if recent history is being stored
*/
getHistory() {
  return this.history_;
};

/** @override */
getParameter(name) {
  name = Util.toName(name);
  const p = array.find(this.varList_, p => p.getName() == name);
  if (p != null) {
    return p;
  }
  throw 'Parameter not found '+name;
};

/** @override */
getParameters() {
  return Array.from(this.varList_);
};

/** Returns the value of the time variable, or throws an exception if there is no time
variable.

There are no explicit units for the time, so you can regard a time unit as any length
of time, as long as it is consistent with other units.
See [About Units Of Measurement](Architecture.html#aboutunitsofmeasurement).
@return {number} the current simulation time
@throws {!Error} if there is no time variable
*/
getTime() {
  if (this.timeIdx_ < 0) {
    throw 'no time variable';
  }
  return this.getValue(this.timeIdx_);
};

/** Returns the current value of the variable with the given index.
@param {number} index the index of the variable of interest
@return {number} the current value of the variable of interest
*/
getValue(index) {
  this.checkIndex_(index);
  return this.varList_[index].getValue();
};

/** Returns an array with the current value of each variable.
@param {boolean=} computed whether to include computed variables,
    see {@link Parameter#isComputed}; default is false.
@return {!Array<number>} an array with the current value of each variable.
    Computed variables have value of NaN unless requested.
*/
getValues(computed) {
  return this.varList_.map(v => {
    if (!computed && v.isComputed()) {
      return NaN;
    } else {
      return v.getValue();
    }
  });
};

/** Returns the Variable object at the given index or with the given name
@param {number|string} id the index or name of the variable; the name can be the
    English or language independent version of the name
@return {!Variable} the Variable object at the given index or with the given name
*/
getVariable(id) {
  let index;
  if (typeof id === 'number') {
    index = id;
  } else if (typeof id === 'string') {
    id = Util.toName(id);
    index = array.findIndex(this.varList_,
        v => v.getName() == id);
    if (index < 0) {
      throw 'unknown variable name '+id;
    }
  } else {
    throw '';
  }
  this.checkIndex_(index);
  return this.varList_[index];
};

/** Increments the sequence number for the specified variable(s), which indicates a
discontinuity has occurred in the value of this variable. This information is used in a
graph to prevent drawing a line between points that have a discontinuity. See
{@link Variable#getSequence}.
@param {...number} indexes  the indexes of the variables;
    if no index given then all variable's sequence numbers are incremented
*/
incrSequence(indexes) {
  if (arguments.length == 0) {
    // increment sequence number on all variables
    for (let i=0, n=this.varList_.length; i<n; i++) {
      this.varList_[i].incrSequence();
    }
  } else {
    // increment sequence number only on specified variables
    for (let i = 0, n=arguments.length; i < n; i++) {
      const idx = arguments[i];
      this.checkIndex_(idx);
      this.varList_[idx].incrSequence();
    }
  }
};

/** Returns the number of variables available. This includes any deleted
variables (which are not being used and should be ignored).
@return {number} the number of variables in this VarsList
*/
numVariables() {
  return this.varList_.length;
};

/** Prints one set of history variables.
@param {number} idx the index of the snapshot to print, where 1 is most recent;
@return {string}
@private
*/
printOneHistory(idx) {
  let r = '';
  if (this.history_ && idx <= this.histArray_.length) {
    const v = this.histArray_[this.histArray_.length - idx];
    r = '//time = '+Util.NF5(v[v.length-1]);
    for (let i=0, len=v.length-1; i<len; i++) {
      r += '\nsim.getVarsList().setValue('+i+', '+v[i]+');';
    }
  }
  return r;
};

/** Prints recent 'history' set of variables to console for debugging.
Prints the `n`-th oldest snapshot, where `n=1` is the most recent snapshot, `n=2` is
the snapshot previous to the most recent, etc. See {@link #saveHistory}.
@param {number=} index the index of the snapshot to print, where 1 is most recent;
    if no index is specified, then prints a selected set of recent histories.
@return {string} the history variables formatted as code to recreate the situation
*/
printHistory(index) {
  if (typeof index === 'number') {
    return this.printOneHistory(index);
  } else {
    let r = this.printOneHistory(10);
    r += '\n' + this.printOneHistory(3);
    r += '\n' + this.printOneHistory(2);
    r += '\n' + this.printOneHistory(1);
    return r;
  }
};

/** Saves the current variables in a 'history' set, for debugging, to be able to
reproduce an error condition. See {@link #printHistory}.
@return {undefined}
*/
saveHistory() {
  if (this.history_) {
    const v = this.getValues();
    v.push(this.getTime());
    this.histArray_.push(v); // adds element to end of histArray_
    if (this.histArray_.length>20) {
      // to prevent filling memory, only keep recent history entries
      this.histArray_.shift(); // removes element at histArray_[0]
    }
  }
};

/** Indicates the specified Variables are being automatically computed.
See {@link Parameter#isComputed}.
@param {...number} indexes  the indexes of the variables
*/
setComputed(indexes) {
  for (let i = 0, n=arguments.length; i < n; i++) {
    const idx = arguments[i];
    this.checkIndex_(idx);
    this.varList_[idx].setComputed(true);
  }
};

/** Sets whether to store recent history, see {@link #saveHistory}.
@param {boolean} value true means recent history should be stored
*/
setHistory(value) {
  this.history_ = value;
};

/** Sets the current simulation time.  There are no explicit units for the time, so
you can regard a time unit as seconds or years as desired. See [About Units Of
Measurement](Architecture.html#aboutunitsofmeasurement).
@param {number} time the current simulation time.
@throws {!Error} if there is no time variable
*/
setTime(time) {
  this.setValue(this.timeIdx_, time);
};

/** Sets the specified variable to the given value. Variables are numbered starting at
zero. Assumes this is a discontinous change, so the sequence number is incremented
unless you specify that this is a continuous change in the variable.
See {@link #incrSequence}.
@param {number} index  the index of the variable within the array of variables
@param {number} value  the value to set the variable to
@param {boolean=} continuous `true` means this new value is continuous with
    previous values; `false` (the default) means the new value is discontinuous with
    previous values, so the sequence number for the variable is incremented
@throws {!Error} if value is `NaN` for a non-computed variable
*/
setValue(index, value, continuous) {
  this.checkIndex_(index);
  const variable = this.varList_[index];
  if (variable.getName() == VarsList.DELETED) {
    // ignore attempt to set deleted variable
    return;
  }
  if (isNaN(value) && !variable.isComputed()) {
    throw 'cannot set variable '+variable.getName()+' to NaN';
  }
  if (continuous) {
    variable.setValueSmooth(value);
  } else {
    variable.setValue(value);
  }
};

/** Sets the value of each variable from the given list of values. When the length of
`vars` is less than length of VarsList then the remaining variables are not modified.
Assumes this is a discontinous change, so the sequence number is incremented
unless you specify that this is a continuous change in the variable.
See {@link #incrSequence}.
@param {!Array<number>} vars array of state variables
@param {boolean=} continuous `true` means this new value is continuous with
    previous values; `false` (the default) means the new value is discontinuous with
    previous values, so the sequence number for the variable is incremented
@throws {!Error} if length of `vars` exceeds length of VarsList
*/
setValues(vars, continuous) {
  // NOTE: vars.length can be less than this.varList_.length
  const N = this.varList_.length;
  const n = vars.length;
  if (n > N) {
    throw 'setValues bad length n='+n+' > N='+N;
  }
  for (let i=0; i<N; i++) {
    if (i < n) {
      this.setValue(i, vars[i], continuous);
    }
  }
};

/** Returns the index of the time variable, or -1 if there is no time variable.
@return {number} the index of the time variable, or -1 if there is no time variable
*/
timeIndex() {
  return this.timeIdx_;
};

/** Returns the set of Variable objects in this VarsList, in their correct
ordering.
@return {!Array<!Variable>} the set of Variable objects in this VarsList,
    in their correct ordering.
*/
toArray() {
  return Array.from(this.varList_);
};

} // end class

/** Name of event signifying that the set of variables has been modified: variables may
have been added or removed, or the name of variables changed.
@type {string}
@const
*/
VarsList.VARS_MODIFIED = 'VARS_MODIFIED';

/** If a variable name is 'DELETED' then that variable is not in use and should be
ignored.
* @type {string}
* @const
*/
VarsList.DELETED = 'DELETED';

/** Language-independent name of time variable.
* @type {string}
* @const
*/
VarsList.TIME = 'TIME';

/** Set of internationalized strings.
@typedef {{
  TIME: string
  }}
*/
VarsList.i18n_strings;

/**
@type {VarsList.i18n_strings}
*/
VarsList.en = {
  TIME: 'time'
};

/**
@private
@type {VarsList.i18n_strings}
*/
VarsList.de_strings = {
  TIME: 'Zeit'
};

/**
@private
@type {VarsList.i18n_strings}
*/
VarsList.es_strings = {
  TIME: 'Tiempo'
};

/** Set of internationalized strings.
@type {VarsList.i18n_strings}
*/
VarsList.i18n = VarsList.en;
switch(goog.LOCALE) {
  case 'de':
    VarsList.i18n = VarsList.de_strings;
    break;
  case 'es':
    VarsList.i18n = VarsList.es_strings;
    break;
  default:
    VarsList.i18n = VarsList.en;
    break;
};

exports = VarsList;
