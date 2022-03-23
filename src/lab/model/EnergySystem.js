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

goog.module('myphysicslab.lab.model.EnergySystem');

const EnergyInfo = goog.require('myphysicslab.lab.model.EnergyInfo');
const Printable = goog.require('myphysicslab.lab.util.Printable');

/** An object that provides information about its energy state. See {@link EnergyInfo}.

### Potential Energy Offset

It is only changes in potential energy that are meaningful. We can add a constant to
the potential energy of a system, and still see the same pattern of changes.

It is often desirable that potential energy be in a specific numerical range. For
example, we might want an object resting on the ground to have zero potential energy.

The potential energy reported in {@link #getEnergyInfo} is the sum of the calculated
potential energy and the constant potential energy offset. See {@link #setPEOffset}.

* @interface
*/
class EnergySystem extends Printable {

/** Returns the current EnergyInfo for this system.
* @return {!EnergyInfo} an EnergyInfo object representing
*    the current energy of this system.
*/
getEnergyInfo() {}

/** Returns the potential energy offset.
@return {number} the potential energy offset
*/
getPEOffset() {}

/** Sets the potential energy offset.
* @param {number} value the potential energy offset
* @return {undefined}
*/
setPEOffset(value) {}

} // end class

/** Set of internationalized strings.
@typedef {{
  POTENTIAL_ENERGY: string,
  TRANSLATIONAL_ENERGY: string,
  KINETIC_ENERGY: string,
  ROTATIONAL_ENERGY: string,
  TOTAL: string,
  TOTAL_ENERGY: string,
  PE_OFFSET: string
  }}
*/
EnergySystem.i18n_strings;

/**
@type {EnergySystem.i18n_strings}
*/
EnergySystem.en = {
  POTENTIAL_ENERGY: 'potential energy',
  TRANSLATIONAL_ENERGY: 'translational energy',
  KINETIC_ENERGY: 'kinetic energy',
  ROTATIONAL_ENERGY: 'rotational energy',
  TOTAL: 'total',
  TOTAL_ENERGY: 'total energy',
  PE_OFFSET: 'potential energy offset'
};

/**
@private
@type {EnergySystem.i18n_strings}
*/
EnergySystem.de_strings = {
  POTENTIAL_ENERGY: 'potenzielle Energie',
  TRANSLATIONAL_ENERGY: 'Translationsenergie',
  KINETIC_ENERGY: 'kinetische Energie',
  ROTATIONAL_ENERGY: 'Rotationsenergie',
  TOTAL: 'gesamt',
  TOTAL_ENERGY: 'gesamte Energie',
  PE_OFFSET: 'Potenzielle Energie Ausgleich'
};

/**
@private
@type {EnergySystem.i18n_strings}
*/
EnergySystem.es_strings = {
  POTENTIAL_ENERGY: 'Energía potencial',
  TRANSLATIONAL_ENERGY: 'Energía translacional',
  KINETIC_ENERGY: 'Energía cinética',
  ROTATIONAL_ENERGY: 'Energía rotacional',
  TOTAL: 'total',
  TOTAL_ENERGY: 'Energía total',
  PE_OFFSET: 'Desplazamiento de energía potencial'
};

/**
@private
@type {EnergySystem.i18n_strings}
*/
EnergySystem.ca_strings = {
  POTENTIAL_ENERGY: 'Energia potencial',
  TRANSLATIONAL_ENERGY: 'Energia translacional',
  KINETIC_ENERGY: 'Energia cinètica',
  ROTATIONAL_ENERGY: 'Energia rotacional',
  TOTAL: 'total',
  TOTAL_ENERGY: 'Energia total',
  PE_OFFSET: 'Desplaçament d\'energia potencial'
};

/** Set of internationalized strings.
@type {EnergySystem.i18n_strings}
*/
EnergySystem.i18n = EnergySystem.en;
switch(goog.LOCALE) {
  case 'de':
    EnergySystem.i18n = EnergySystem.de_strings;
    break;
  case 'es':
    EnergySystem.i18n = EnergySystem.es_strings;
    break;
  case 'ca':
    EnergySystem.i18n = EnergySystem.ca_strings;
    break;
  default:
    EnergySystem.i18n = EnergySystem.en;
    break;
};

exports = EnergySystem;
