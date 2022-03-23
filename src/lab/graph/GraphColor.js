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

goog.module('myphysicslab.lab.graph.GraphColor');

/** GraphColor enum, used to present a set of colors for user to choose from for setting
the color of a {@link myphysicslab.lab.graph.GraphLine GraphLine}.

* Note that enum types do not appear correctly in the documentation, they appear
* as the underlying type (string, number, boolean) instead of the enum type.
* see [Dossier issue #32](https://github.com/jleyba/js-dossier/issues/32).
*
* @enum {string}
*/
const GraphColor = {
  AQUA: 'aqua',
  BLACK: 'black',
  BLUE: 'blue',
  FUCHSIA: 'fuchsia',
  GRAY: 'gray',
  GREEN: 'green',
  LIME: 'lime',
  MAROON: 'maroon',
  NAVY: 'navy',
  OLIVE: 'olive',
  PURPLE: 'purple',
  RED: 'red',
  SILVER: 'silver',
  TEAL: 'teal',
  WHITE: 'white',
  YELLOW: 'yellow'
};

/** The set of localized strings corresponding to {@link #getValues}.
* @return {!Array<string>} the set of localized strings corresponding to
*     {@link #getValues}.
*/
GraphColor.getChoices = () =>
  [ GraphColor.i18n.AQUA,
    GraphColor.i18n.BLACK,
    GraphColor.i18n.BLUE,
    GraphColor.i18n.FUCHSIA,
    GraphColor.i18n.GRAY,
    GraphColor.i18n.GREEN,
    GraphColor.i18n.LIME,
    GraphColor.i18n.MAROON,
    GraphColor.i18n.NAVY,
    GraphColor.i18n.OLIVE,
    GraphColor.i18n.PURPLE,
    GraphColor.i18n.RED,
    GraphColor.i18n.SILVER,
    GraphColor.i18n.TEAL,
    GraphColor.i18n.WHITE,
    GraphColor.i18n.YELLOW ];

/** The set of GraphColor enum values.
* @return {!Array<!GraphColor>} the GraphColor enum values.
*/
GraphColor.getValues = () =>
  [ GraphColor.AQUA,
    GraphColor.BLACK,
    GraphColor.BLUE,
    GraphColor.FUCHSIA,
    GraphColor.GRAY,
    GraphColor.GREEN,
    GraphColor.LIME,
    GraphColor.MAROON,
    GraphColor.NAVY,
    GraphColor.OLIVE,
    GraphColor.PURPLE,
    GraphColor.RED,
    GraphColor.SILVER,
    GraphColor.TEAL,
    GraphColor.WHITE,
    GraphColor.YELLOW ];

/** Converts a string to an enum
* @param {string} value the string to convert
* @return {!GraphColor} the enum corresponding to the value, from {@link #getValues}
* @throws {!Error} if the value does not represent a valid enum
*/
GraphColor.stringToEnum = value => {
  const vals = GraphColor.getValues();
  for (let i=0, len=vals.length; i<len; i++) {
    if (value === vals[i]) {
      return vals[i];
    }
  }
  throw 'not found '+value;
};

/** Set of internationalized strings.
@typedef {{
  AQUA: string,
  BLACK: string,
  BLUE: string,
  FUCHSIA: string,
  GRAY: string,
  GREEN: string,
  LIME: string,
  MAROON: string,
  NAVY: string,
  OLIVE: string,
  PURPLE: string,
  RED: string,
  SILVER: string,
  TEAL: string,
  WHITE: string,
  YELLOW: string
  }}
*/
GraphColor.i18n_strings;

/**
@type {GraphColor.i18n_strings}
*/
GraphColor.en = {
  AQUA: 'aqua',
  BLACK: 'black',
  BLUE: 'blue',
  FUCHSIA: 'fuchsia',
  GRAY: 'gray',
  GREEN: 'green',
  LIME: 'lime',
  MAROON: 'maroon',
  NAVY: 'navy',
  OLIVE: 'olive',
  PURPLE: 'purple',
  RED: 'red',
  SILVER: 'silver',
  TEAL: 'teal',
  WHITE: 'white',
  YELLOW: 'yellow'
};

/**
@private
@type {GraphColor.i18n_strings}
*/
GraphColor.de_strings = {
  AQUA: 'Aquamarin',
  BLACK: 'Schwarz',
  BLUE: 'Blau',
  FUCHSIA: 'Purpurrot',
  GRAY: 'Grau',
  GREEN: 'Grün',
  LIME: 'Hellgrün',
  MAROON: 'Kastanienbraun',
  NAVY: 'Marineblau',
  OLIVE: 'Olivgrün',
  PURPLE: 'Purpur',
  RED: 'Rot',
  SILVER: 'Silber',
  TEAL: 'Blaugrün',
  WHITE: 'Weiss',
  YELLOW: 'Gelb'
};

/**
@private
@type {GraphColor.i18n_strings}
*/
GraphColor.es_strings = {
  AQUA: 'Aguamarina',
  BLACK: 'Negro',
  BLUE: 'Azul',
  FUCHSIA: 'Fucsia',
  GRAY: 'Gris',
  GREEN: 'Verde',
  LIME: 'Lima',
  MAROON: 'Granate',
  NAVY: 'Azul marino',
  OLIVE: 'Oliva',
  PURPLE: 'Purpura',
  RED: 'Rojo',
  SILVER: 'Plata',
  TEAL: 'Verde azulado',
  WHITE: 'Blanco',
  YELLOW: 'Amarillo'
};

/**
@private
@type {GraphColor.i18n_strings}
*/
GraphColor.ca_strings = {
  AQUA: 'Aiguamarina',
  BLACK: 'Negre',
  BLUE: 'Blau',
  FUCHSIA: 'Fúcsia',
  GRAY: 'Gris',
  GREEN: 'Verd',
  LIME: 'Llima',
  MAROON: 'Granat',
  NAVY: 'Blau marí',
  OLIVE: 'Oliva',
  PURPLE: 'Porpra',
  RED: 'Roig',
  SILVER: 'Plata',
  TEAL: 'Verd blavós',
  WHITE: 'Blanc',
  YELLOW: 'Groc'
};


/** Set of internationalized strings.
@type {GraphColor.i18n_strings}
*/
GraphColor.i18n = GraphColor.en;
switch(goog.LOCALE) {
  case 'de':
    GraphColor.i18n = GraphColor.de_strings;
    break;
  case 'es':
    GraphColor.i18n = GraphColor.es_strings;
    break;
  case 'ca':
    GraphColor.i18n = GraphColor.ca_strings;
    break;
  default:
    GraphColor.i18n = GraphColor.en;
    break;
};

exports = GraphColor;
