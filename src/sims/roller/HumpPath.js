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

goog.module('myphysicslab.sims.roller.HumpPath');

const Util = goog.require('myphysicslab.lab.util.Util');
const AbstractPath = goog.require('myphysicslab.sims.roller.AbstractPath');

/** A 'W' shaped path with a central hump.  Formed from a quartic
polynomial:

    x = t
    y = 3 - (7/6) t^2 + (1/6) t^4

*/
class HumpPath extends AbstractPath {
/**
* @param {number=} start
* @param {number=} finish
* @param {string=} name
* @param {string=} localName
*/
constructor(start, finish, name, localName) {
  if (typeof start !== 'number')
    start = -3;
  if (typeof finish !== 'number')
    finish = 3;
  name = name || HumpPath.en.NAME;
  localName = localName || HumpPath.i18n.NAME;
  super(name, localName, start, finish, /*closedLoop=*/false);
};

/** @override */
getClassName() {
  return 'HumpPath';
};

/** @override */
x_func(t) {
  return t;
};

/** @override */
y_func(t) {
  return 3 + t*t*(-7 + t*t)/6;
};

} // end class

/** Set of internationalized strings.
@typedef {{
  NAME: string
  }}
*/
HumpPath.i18n_strings;

/**
@type {HumpPath.i18n_strings}
*/
HumpPath.en = {
  NAME: 'Hump'
};

/**
@private
@type {HumpPath.i18n_strings}
*/
HumpPath.de_strings = {
  NAME: 'Buckel'
};

/**
@private
@type {HumpPath.i18n_strings}
*/
HumpPath.es_strings = {
  NAME: 'Montículo'
};

/**
@private
@type {HumpPath.i18n_strings}
*/
HumpPath.ca_strings = {
  NAME: 'Monticle'
};

/** Set of internationalized strings.
@type {HumpPath.i18n_strings}
*/
HumpPath.i18n = HumpPath.en;
switch(goog.LOCALE) {
  case 'de':
    HumpPath.i18n = HumpPath.de_strings;
    break;
  case 'es':
    HumpPath.i18n = HumpPath.es_strings;
    break;
  case 'ca':
    HumpPath.i18n = HumpPath.ca_strings;
    break;
  default:
    HumpPath.i18n = HumpPath.en;
    break;
};

exports = HumpPath;
