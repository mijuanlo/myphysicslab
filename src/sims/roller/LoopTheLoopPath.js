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

goog.module('myphysicslab.sims.roller.LoopTheLoopPath');

const Util = goog.require('myphysicslab.lab.util.Util');
const AbstractPath = goog.require('myphysicslab.sims.roller.AbstractPath');

/** Loop-the-loop curve, like a roller coaster that has a loop in it where
the car will go upside down. Formed from part of a parabola, then part of a circle, then
another parabola. For details see Mathematica file 'roller.nb'.

*/
class LoopTheLoopPath extends AbstractPath {
/**
* @param {number=} start
* @param {number=} finish
* @param {string=} name
* @param {string=} localName
*/
constructor(start, finish, name, localName) {
  if (typeof start !== 'number') {
    start = -3.7;
  }
  if (typeof finish !== 'number') {
    finish = 8.5;
  }
  name = name || LoopTheLoopPath.en.NAME;
  localName = localName || LoopTheLoopPath.i18n.NAME;
  super(name, localName, start, finish, /*closedLoop=*/false);
};

/** @override */
getClassName() {
  return 'LoopTheLoopPath';
};

/** @override */
x_func(t) {
  if (t<0.5) {
    return t;
  } else if (t < 0.5 + LoopTheLoopPath.theta1 - LoopTheLoopPath.theta2) {
    return LoopTheLoopPath.radius * Math.cos(t - 0.5 + LoopTheLoopPath.theta2)
        + LoopTheLoopPath.xcenter;
  } else {
    return t - LoopTheLoopPath.theta1 + LoopTheLoopPath.theta2 - 1;
  }
};

/** @override */
y_func(t) {
  if (t<0.5) {
    return (t+1)*(t+1) + LoopTheLoopPath.yoffset;
  } else if (t < 0.5 + LoopTheLoopPath.theta1 - LoopTheLoopPath.theta2) {
    return LoopTheLoopPath.radius * Math.sin(t - 0.5 + LoopTheLoopPath.theta2)
        + LoopTheLoopPath.ycenter + LoopTheLoopPath.yoffset;
  } else {
    const dd = t - LoopTheLoopPath.theta1 + LoopTheLoopPath.theta2 - 2;
    return dd*dd + LoopTheLoopPath.yoffset;
  }
};

} // end class

/**
* @type {number}
* @const
* @private
*/
LoopTheLoopPath.theta1 = 3.46334;
/**
* @type {number}
* @const
* @private
*/
LoopTheLoopPath.theta2 = -0.321751;
/**
* @type {number}
* @const
* @private
*/
LoopTheLoopPath.radius = 0.527046;
/**
* @type {number}
* @const
* @private
*/
LoopTheLoopPath.ycenter = 2.41667;
/**
* @type {number}
* @const
* @private
*/
LoopTheLoopPath.xcenter = 0;
/**
* @type {number}
* @const
* @private
*/
LoopTheLoopPath.yoffset = 1;

/** Set of internationalized strings.
@typedef {{
  NAME: string
  }}
*/
LoopTheLoopPath.i18n_strings;

/**
@type {LoopTheLoopPath.i18n_strings}
*/
LoopTheLoopPath.en = {
  NAME: 'Loop'
};

/**
@private
@type {LoopTheLoopPath.i18n_strings}
*/
LoopTheLoopPath.de_strings = {
  NAME: 'Schleife'
};

/**
@private
@type {LoopTheLoopPath.i18n_strings}
*/
LoopTheLoopPath.es_strings = {
  NAME: 'Bucle'
};

/**
@private
@type {LoopTheLoopPath.i18n_strings}
*/
LoopTheLoopPath.ca_strings = {
  NAME: 'Bucle'
};

/** Set of internationalized strings.
@type {LoopTheLoopPath.i18n_strings}
*/
LoopTheLoopPath.i18n = LoopTheLoopPath.en;
switch(goog.LOCALE) {
  case 'de':
    LoopTheLoopPath.i18n = LoopTheLoopPath.de_strings;
    break;
  case 'es':
    LoopTheLoopPath.i18n = LoopTheLoopPath.es_strings;
    break;
  case 'ca':
    LoopTheLoopPath.i18n = LoopTheLoopPath.ca_strings;
    break;
  default:
    LoopTheLoopPath.i18n = LoopTheLoopPath.en;
    break;
};

exports = LoopTheLoopPath;
