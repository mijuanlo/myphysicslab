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

goog.module('myphysicslab.sims.engine2D.ChainConfig');

const ContactSim = goog.require('myphysicslab.lab.engine2D.ContactSim');
const CoordType = goog.require('myphysicslab.lab.model.CoordType');
const DisplayShape = goog.require('myphysicslab.lab.view.DisplayShape');
const DoubleRect = goog.require('myphysicslab.lab.util.DoubleRect');
const JointUtil = goog.require('myphysicslab.lab.engine2D.JointUtil');
const Shapes = goog.require('myphysicslab.lab.engine2D.Shapes');
const Vector = goog.require('myphysicslab.lab.util.Vector');

/** Makes chain of rigid bodies.
*/
class ChainConfig {
/**
* @private
*/
constructor() {
  throw '';
};

/**
* @param {!ContactSim} sim
* @param {!ChainConfig.options} options
* @return {!DoubleRect} rectangle that contains all chain links, in sim coords
*/
static makeChain(sim, options) {
  /* where 'lower' joint1 attaches, in body coords*/
  const joint1X = 0.5 * options.blockWidth;
  const joint1Y = 0.15 * options.blockHeight;
  /* where 'upper' joint2 attaches, in body coords*/
  const joint2X = 0.5 * options.blockWidth;
  const joint2Y = 0.85 * options.blockHeight;
  let body_angle = -180;
  const links = [];
  let bodyi;
  for (let i=0; i<options.numLinks; i++) {
    bodyi = Shapes.makeBlock2(options.blockWidth, options.blockHeight,
        ChainConfig.en.CHAIN+'-'+i, ChainConfig.i18n.CHAIN+'-'+i);
    links.push(bodyi);
    sim.addBody(bodyi);
    body_angle += 180/(options.numLinks + 1);
    bodyi.setAngle(Math.PI*body_angle/180);
    if (i == 0) {
      bodyi.alignTo(/*p_body=*/new Vector(joint1X, joint1Y),
          /*p_world=*/new Vector(options.wallPivotX, options.wallPivotY),
          /*angle=*/Math.PI*body_angle/180);
    }
  }
  /* Create Joints to attach bodies together */
  for (let i=0; i<options.numLinks; i++) {
    if (i == 0 && options.fixedLeft) {
      JointUtil.attachFixedPoint(sim,
        links[i], /*attach_body=*/new Vector(joint1X, joint1Y),
        /*normalType=*/CoordType.BODY);
    }
    if (i > 0) {
      JointUtil.attachRigidBody(sim,
        links[i-1], /*attach_body1=*/new Vector(joint2X, joint2Y),
        links[i], /*attach_body2=*/new Vector(joint1X, joint1Y),
        /*normalType=*/CoordType.BODY
        );
    }
    if (options.fixedRight && i == options.numLinks - 1) {
      JointUtil.attachFixedPoint(sim,
        links[i], /*attach_body=*/new Vector(joint2X, joint2Y),
        /*normalType=*/CoordType.BODY);
    }
  }
  sim.alignConnectors();
  /* find rectangle that contains all chain links */
  let r = DoubleRect.EMPTY_RECT;
  for (let i=0; i<options.numLinks; i++) {
    const body = links[i];
    body.setZeroEnergyLevel();
    r = r.union(body.getBoundsWorld());
  }
  return r;
};

} // end class

/** @typedef {{
    wallPivotX: number,
    wallPivotY: number,
    fixedLeft: boolean,
    fixedRight: boolean,
    blockWidth: number,
    blockHeight: number,
    numLinks: number
  }}
*/
ChainConfig.options;

/** Set of internationalized strings.
@typedef {{
  NUM_LINKS: string,
  WALLS: string,
  EXTRA_BODY: string,
  FIXED_LEFT: string,
  FIXED_RIGHT: string,
  FIXED_LEFT_X: string,
  FIXED_LEFT_Y: string,
  BLOCK_LENGTH: string,
  BLOCK_WIDTH: string,
  CHAIN: string,
  WALL_WIDTH: string,
  }}
*/
ChainConfig.i18n_strings;

/**
@type {ChainConfig.i18n_strings}
*/
ChainConfig.en = {
  NUM_LINKS: 'chain links',
  WALLS: 'walls',
  EXTRA_BODY: 'extra body',
  FIXED_LEFT: 'fixed point left',
  FIXED_RIGHT: 'fixed point right',
  FIXED_LEFT_X: 'fixed point left X',
  FIXED_LEFT_Y: 'fixed point left Y',
  BLOCK_LENGTH: 'block length',
  BLOCK_WIDTH: 'block width',
  CHAIN: 'chain',
  WALL_WIDTH: 'wall width'
};

/**
@private
@type {ChainConfig.i18n_strings}
*/
ChainConfig.de_strings = {
  NUM_LINKS: 'Kettenglieder',
  WALLS: 'Wände',
  EXTRA_BODY: 'extra Körper',
  FIXED_LEFT: 'Fixpunkt links',
  FIXED_RIGHT: 'Fixpunkt rechts',
  FIXED_LEFT_X: 'Fixpunkt links X',
  FIXED_LEFT_Y: 'Fixpunkt links Y',
  BLOCK_LENGTH: 'Blocklänge',
  BLOCK_WIDTH: 'Blockbreite',
  CHAIN: 'Kette',
  WALL_WIDTH: 'Wand breite'
};

/**
@private
@type {ChainConfig.i18n_strings}
*/
ChainConfig.es_strings = {
  NUM_LINKS: 'Enlaces de cadena',
  WALLS: 'Muros',
  EXTRA_BODY: 'cuerpo extra',
  FIXED_LEFT: 'Punto fijo izquierdo',
  FIXED_RIGHT: 'Punto fijo derecho',
  FIXED_LEFT_X: 'Punto fijo enlaces X',
  FIXED_LEFT_Y: 'Punto fijo enlaces Y',
  BLOCK_LENGTH: 'Longitud del bloque',
  BLOCK_WIDTH: 'Ancho del bloque',
  CHAIN: 'Cadena',
  WALL_WIDTH: 'Ancho del muro'
};

/**
@private
@type {ChainConfig.i18n_strings}
*/
ChainConfig.ca_strings = {
  NUM_LINKS: 'Enllaços de cadena',
  WALLS: 'Murs',
  EXTRA_BODY: 'cos extra',
  FIXED_LEFT: 'Punt fix esquerre',
  FIXED_RIGHT: 'Punt fix dret',
  FIXED_LEFT_X: 'Punt fix enllaços X',
  FIXED_LEFT_Y: 'Punt fix enllaços Y',
  BLOCK_LENGTH: 'Longitud del bloc',
  BLOCK_WIDTH: 'Ample del bloc',
  CHAIN: 'Cadena',
  WALL_WIDTH: 'Ample del mur'
};

/** Set of internationalized strings.
@type {ChainConfig.i18n_strings}
*/
ChainConfig.i18n = ChainConfig.en;
switch(goog.LOCALE) {
  case 'de':
    ChainConfig.i18n = ChainConfig.de_strings;
    break;
  case 'es':
    ChainConfig.i18n = ChainConfig.es_strings;
    break;
  case 'ca':
    ChainConfig.i18n = ChainConfig.ca_strings;
    break;
  default:
    ChainConfig.i18n = ChainConfig.en;
    break;
};

exports = ChainConfig;
