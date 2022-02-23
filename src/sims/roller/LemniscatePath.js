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

goog.module('myphysicslab.sims.roller.LemniscatePath');

const Util = goog.require('myphysicslab.lab.util.Util');
const AbstractPath = goog.require('myphysicslab.sims.roller.AbstractPath');

/** Lemniscate curve; a 'figure eight' path.

Equation in polar coords is:

    r^2  =  2 a^2  cos(2t)

    r = (+/-) a Sqrt(2 cos(2t))

where a=constant, t=angle from -Pi/4 to Pi/4, and r=radius

To get both lobes with the direction of travel increasing across the origin, define

    T = -t + Pi/2

Then

    r = a Sqrt(2 cos(2t))   for -Pi/4 < t < Pi/4
    r = -a Sqrt(2 cos(2T))   for Pi/4 < t < 3 Pi/4

To get into Cartesian coords, we use

    x = r cos(t)
    y = r sin(t)

*/
class LemniscatePath extends AbstractPath {
/**
* @param {number} size
* @param {number=} start
* @param {number=} finish
* @param {boolean=} closedLoop
* @param {string=} name
* @param {string=} localName
*/
constructor(size, start, finish, closedLoop, name, localName) {
  if (typeof start !== 'number')
    start = -Math.PI/4;
  if (typeof finish !== 'number')
    finish = 3*Math.PI/4;
  if (closedLoop === undefined)
    closedLoop = true;
  name = name || LemniscatePath.en.NAME;
  localName = localName || LemniscatePath.i18n.NAME;
  super(name, localName, start, finish, closedLoop);
  /** @type {number}
  * @private
  * @const
  */
  this.a_ = size;
};

/** @override */
toString() {
  return Util.ADVANCED ? '' :
      super.toString().slice(0, -1)
      + ', size: '+Util.NF(this.a_)+'}';
};

/** @override */
getClassName() {
  return 'LemniscatePath';
};

/** @override */
x_func(t) {
  if (t<=Math.PI/4) {
    return this.a_ *Math.sqrt(2*Math.cos(2*t))*Math.cos(t);
  } else if (t<=3*Math.PI/4) {
    const T = -t + Math.PI/2;
    return -this.a_ *Math.sqrt(2*Math.cos(2*T))*Math.cos(T);
  } else {
    return 0;
  }
};

/** @override */
y_func(t) {
  if (t<=Math.PI/4) {
    return this.a_*Math.sqrt(2*Math.cos(2*t))*Math.sin(t);
  } else if (t<=3*Math.PI/4) {
    const T = -t + Math.PI/2;
    return -this.a_*Math.sqrt(2*Math.cos(2*T))*Math.sin(T);
  } else {
    return 0;
  }
};

} // end class

/** Set of internationalized strings.
@typedef {{
  NAME: string
  }}
*/
LemniscatePath.i18n_strings;

/**
@type {LemniscatePath.i18n_strings}
*/
LemniscatePath.en = {
  NAME: 'Lemniscate'
};

/**
@private
@type {LemniscatePath.i18n_strings}
*/
LemniscatePath.de_strings = {
  NAME: 'Lemniscate'
};

/**
@private
@type {LemniscatePath.i18n_strings}
*/
LemniscatePath.es_strings = {
  NAME: 'Lemniscate'
};

/** Set of internationalized strings.
@type {LemniscatePath.i18n_strings}
*/
LemniscatePath.i18n = LemniscatePath.en;
switch(goog.LOCALE) {
  case 'de':
    LemniscatePath.i18n = LemniscatePath.de_strings;
    break;
  case 'es':
    LemniscatePath.i18n = LemniscatePath.es_strings;
    break;
  default:
    LemniscatePath.i18n = LemniscatePath.en;
    break;
};

exports = LemniscatePath;
