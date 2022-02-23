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

goog.module('myphysicslab.sims.engine2D.PileConfig');

const ContactSim = goog.require('myphysicslab.lab.engine2D.ContactSim');
const CoordType = goog.require('myphysicslab.lab.model.CoordType');
const DoubleRect = goog.require('myphysicslab.lab.util.DoubleRect');
const JointUtil = goog.require('myphysicslab.lab.engine2D.JointUtil');
const Polygon = goog.require('myphysicslab.lab.engine2D.Polygon');
const Random = goog.require('myphysicslab.lab.util.Random');
const RandomLCG = goog.require('myphysicslab.lab.util.RandomLCG');
const RigidBody = goog.require('myphysicslab.lab.engine2D.RigidBody');
const Shapes = goog.require('myphysicslab.lab.engine2D.Shapes');
const Util = goog.require('myphysicslab.lab.util.Util');
const Vector = goog.require('myphysicslab.lab.util.Vector');
const Walls = goog.require('myphysicslab.lab.engine2D.Walls');

/** Utility functions for making the 'pile of blocks' simulation.
*/
class PileConfig {
/**
* @private
*/
constructor() {
  throw '';
};

/** Makes a single V-shaped 'pit' for blocks to fall into.
@param {!ContactSim} sim
@param {number=} opt_offset  vertical offset for position of walls
@return {number} suggested zero energy level for blocks
*/
static makeVPit(sim, opt_offset) {
  const offset = opt_offset !== undefined ? opt_offset : 0;
  const p1 = Shapes.makeWall(15.3, 1, Shapes.TOP_EDGE,
      Walls.en.WALL_BOTTOM + '_' + PileConfig.en.LEFT,
      Walls.i18n.WALL_BOTTOM + '_' + PileConfig.i18n.LEFT);
  p1.setPosition(new Vector(-5,  -5+offset),  -Math.PI/4);
  p1.setMass(Util.POSITIVE_INFINITY);
  sim.addBody(p1);
  const p2 = Shapes.makeWall(15.3, 1, Shapes.TOP_EDGE,
      Walls.en.WALL_BOTTOM + '_' + PileConfig.en.RIGHT,
      Walls.i18n.WALL_BOTTOM + '_' + PileConfig.i18n.RIGHT);
  p2.setPosition(new Vector(5,  -5+offset),  Math.PI/4);
  p2.setMass(Util.POSITIVE_INFINITY);
  sim.addBody(p2);
  const p3 = Shapes.makeWall(1, 15, Shapes.LEFT_EDGE, Walls.en.WALL_RIGHT,
      Walls.i18n.WALL_RIGHT);
  p3.setPosition(new Vector(10.5,  7.5+offset),  0);
  p3.setMass(Util.POSITIVE_INFINITY);
  sim.addBody(p3);
  const p4 = Shapes.makeWall(1, 15, Shapes.RIGHT_EDGE, Walls.en.WALL_LEFT,
      Walls.i18n.WALL_LEFT);
  p4.setPosition(new Vector(-10.5,  7.5+offset),  0);
  p4.setMass(Util.POSITIVE_INFINITY);
  sim.addBody(p4);
  // set each wall to not collide with any other wall
  const walls = [p1, p2, p3, p4];
  walls.forEach(w => w.addNonCollide(walls));
  // return lowest possible point
  return p1.bodyToWorld(new Vector(15.3/2 - 1, 0.5)).getY();
};

/** Makes two 'pits' for the blocks to fall into.
@param {!ContactSim} sim
@param {number=} opt_offset  vertical offset for position of walls
@return {number} suggested zero energy level for blocks
*/
static makeDoubleVPit(sim, opt_offset) {
  const offset = opt_offset !== undefined ? opt_offset : 0;
  const walls = [];
  const b = 1.0/(2*Math.sqrt(2.0));  // to get center of block, = 1 / (2 * sqrt(2))
  const h = -2.5 - b;
  const len = Math.sqrt(2*5*5);
  let w = Shapes.makeWall(len, 1, Shapes.TOP_EDGE,
      Walls.en.WALL_BOTTOM + '_' + PileConfig.en.LEFT+1,
      Walls.i18n.WALL_BOTTOM + '_' + PileConfig.i18n.LEFT+1);
  const w1 = w;
  w.setPosition(new Vector(-7.5 - b,  h+offset),  -Math.PI/4);
  walls.push(w);
  w = Shapes.makeWall(len, 1, Shapes.TOP_EDGE,
      Walls.en.WALL_BOTTOM + '_' + PileConfig.en.LEFT+2,
      Walls.i18n.WALL_BOTTOM + '_' + PileConfig.i18n.LEFT+2);
  w.setPosition(new Vector(-2.5 + b,  h+offset),  Math.PI/4);
  walls.push(w);
  w = Shapes.makeWall(len, 1, Shapes.TOP_EDGE,
      Walls.en.WALL_BOTTOM + '_' + PileConfig.en.RIGHT+1,
      Walls.i18n.WALL_BOTTOM + '_' + PileConfig.i18n.RIGHT+1);
  w.setPosition(new Vector(2.5 - b,  h+offset),  -Math.PI/4);
  walls.push(w);
  w = Shapes.makeWall(len, 1, Shapes.TOP_EDGE,
      Walls.en.WALL_BOTTOM + '_' + PileConfig.en.RIGHT+2,
      Walls.i18n.WALL_BOTTOM + '_' + PileConfig.i18n.RIGHT+2);
  w.setPosition(new Vector(7.5 + b,  h+offset),  Math.PI/4);
  walls.push(w);
  w = Shapes.makeWall(1, 15, Shapes.LEFT_EDGE, Walls.en.WALL_RIGHT,
      Walls.i18n.WALL_RIGHT);
  w.setPosition(new Vector(10.5,  7.5+offset),  0);
  walls.push(w);
  w = Shapes.makeWall(1, 15, Shapes.RIGHT_EDGE, Walls.en.WALL_LEFT,
      Walls.i18n.WALL_LEFT);
  w.setPosition(new Vector(-10.5,  7.5+offset),  0);
  walls.push(w);
  walls.forEach(p => {
    p.setMass(Util.POSITIVE_INFINITY);
    sim.addBody(p);
    // set each wall to not collide with any other wall
    p.addNonCollide(walls);
  });
  return w1.bodyToWorld(new Vector(len/2, 0.5)).getY();
};

/** Makes a rectangular array of same-sized square blocks or circular balls that fill
the given rectangle.
@param {!ContactSim} sim  the ContactSim to add the blocks to
@param {!DoubleRect} rect rectangle to fill with blocks
@param {boolean} circular whether to make circular balls or square blocks
@param {number} size the radius of circular balls or half-width of square blocks
@param {number} buffer distance between each block
@param {number} limit maximum number of blocks to make
*/
static makeUniformBlocks(sim, rect, circular, size, buffer, limit) {
  let row = 0;
  let col = 0;
  let index = 0;
  while (true) {
    const y = rect.getBottom() + size + buffer + row * 2 * size
        + row * buffer;
    if (y + size + buffer > rect.getTop()) {
      break;
    }
    while (true) {
      const x = buffer + size + rect.getLeft() + col * 2 * size
          + col*buffer;
      if (x + size + buffer > rect.getRight()) {
        break;
      }
      let p;
      const id = index++;
      if (circular) {
        p = Shapes.makeBall(size);
      } else {
        p = Shapes.makeBlock(2*size, 2*size);
      }
      p.setPosition(new Vector(x, y));
      p.setMass(1);
      sim.addBody(p);
      if (index > limit) {
        return;
      }
      col++;
    }
    col = 0;
    row++;
  }
};

/**  Make several blocks of random sizes (and default colors), position
the first one at the given location and position the others to the right
of that first block.  The sizes of the blocks range from 0.2 to 1.2 on each
side.
@param {!ContactSim} sim  the ContactSim to add the bodies
@param {number} n  the number of blocks to create
@param {number} x  the location for the first block
@param {number} y  the location for the first block
@param {!Random} random  the random number generator to use for building blocks
@param {boolean=} rightAngle whether to make right-angle blocks
@return {!Array<!Polygon>} the blocks that were created
*/
static makeRandomBlocks(sim, n, x, y, random, rightAngle) {
  rightAngle = rightAngle !== undefined ? rightAngle : true;
  const bods = [];
  for (let i=0; i<n; i++) {
    const width = 0.2+ random.nextFloat();
    const height = 0.2+ random.nextFloat();
    const angle = Math.PI * random.nextFloat();
    // this is here only to preserve test results (legacy code)
    const unusedColor = PileConfig.getRandomColor(random);
    let p;
    if (rightAngle) {
      p = Shapes.makeBlock(width, height);
    } else {
      p = Shapes.makeRandomPolygon(/*sides=*/4,
         /*radius=*/Math.sqrt(width*width+height*height)/2);
    }
    let cmx = width*random.nextFloat()/4;
    let cmy = height*random.nextFloat()/4;
    // ensure the center of mass is within the body, and not right at an edge
    const xmin = 0.9*width/2.0;
    const ymin = 0.9*height/2.0;
    if (cmx < -xmin) {
      cmx = -xmin;
    } else if (cmx > xmin) {
      cmx = xmin;
    } if (cmy < -ymin) {
      cmy = -ymin;
    } else if (cmy > ymin) {
      cmy = ymin;
    }
    p.setCenterOfMass(new Vector(cmx, cmy));
    // set temp position to (x, y), but only to find how much we need to move it
    p.setPosition(new Vector(x,  y),  angle);
    const left = p.getLeftWorld();
    // set actual position so that left is at x
    p.setPosition(new Vector(x + (x-left), y), angle);
    // set x to left position for next block
    x = p.getRightWorld() + 0.05;
    p.setMass(p.getWidth() * p.getHeight());
    sim.addBody(p);
    bods.push(p);
  }
  return bods;
};

/** Makes two blocks that are rigidly connected by two double joints, so that
the blocks cannot move relative to each other.  This is for testing that
situations with redundant joints can be handled correctly.
@param {!ContactSim} sim  the ContactSim to add the bodies
@param {number} x  the horizontal location to move the first block
@param {number} y  the vertical location to move the first block
@param {number} angle  the angle to set the blocks
@return {!Array<!Polygon>} array containing the two blocks
*/
static makeConnectedBlocks(sim, x, y, angle) {
  const p1 = Shapes.makeBlock(1.0, 1.0);
  p1.setMass(0.6);
  p1.setPosition(new Vector(x,  y),  angle);
  sim.addBody(p1);
  const p2 = Shapes.makeBlock(0.9, 1.1);
  p2.setMass(0.6);
  p2.setPosition(new Vector(x,  y),  angle);
  sim.addBody(p2);
  JointUtil.attachRigidBody(sim,
    p1,  /* attach point on p1, body coords=*/new Vector(0, -0.4),
    p2, /* attach point on p2, body coords=*/new Vector(-0.4, 0),
    /*normalType=*/CoordType.BODY);
  JointUtil.attachRigidBody(sim,
    p1, /* attach point on p1, body coords=*/new Vector(0.4, 0),
    p2, /* attach point on p2, body coords=*/new Vector(0, 0.4),
    /*normalType=*/CoordType.BODY);
  sim.alignConnectors();
  return [p1, p2];
};

/** Returns a random 'somewhat bright' color.  Avoids near-white colors.
* @param {!Random=} random
* @return {string} a random color
*/
static getRandomColor(random) {
  random = random || PileConfig.randomColor_;
  const colors = new Array(3);
  let nearWhite = true;
  for (let i=0; i<3; i++) {
    // bias the color to be brighter
    const c = Math.min(1, Math.max(0, 0.1 + 1.5 * random.nextFloat()));
    if (c < 0.9) {
      nearWhite = false;
    }
    colors[i] = c;
  }
  if (nearWhite) {
    return PileConfig.getRandomColor(random);
  } else {
    return Util.colorString6(colors[0], colors[1], colors[2]);
  }
};

} // end class

/**
* @type {!Random}
* @private
*/
PileConfig.randomColor_ = new RandomLCG(901745);

/** Set of internationalized strings.
@typedef {{
  NUM_BLOCKS: string,
  ADD_BLOCK: string,
  REBUILD: string,
  TWO_PILES: string,
  CONNECTED_BLOCKS: string,
  ENDLESS_LOOP: string,
  LOOP_TIME: string,
  RANDOM_SEED: string,
  WALL: string,
  LEFT: string,
  RIGHT: string,
  SQUARE_BLOCKS: string
  }}
*/
PileConfig.i18n_strings;

/**
@type {PileConfig.i18n_strings}
*/
PileConfig.en = {
  NUM_BLOCKS: 'number of blocks',
  ADD_BLOCK: 'add block',
  REBUILD: 'rebuild',
  TWO_PILES: 'two piles',
  CONNECTED_BLOCKS: 'connected blocks',
  ENDLESS_LOOP: 'endless loop',
  LOOP_TIME: 'loop time',
  RANDOM_SEED: 'random seed',
  WALL: 'wall',
  LEFT: 'left',
  RIGHT: 'right',
  SQUARE_BLOCKS: 'square blocks'
};

/**
@private
@type {PileConfig.i18n_strings}
*/
PileConfig.de_strings = {
  NUM_BLOCKS: 'Blöckezahl',
  ADD_BLOCK: 'Block hinzu fügen',
  REBUILD: 'wieder aufbauen',
  TWO_PILES: 'zwei Haufen',
  CONNECTED_BLOCKS: 'zusammenhängende Blöcke',
  ENDLESS_LOOP: 'endliche Schleife',
  LOOP_TIME: 'Schleifezeit',
  RANDOM_SEED: 'Zufallskern',
  WALL: 'Wand',
  LEFT: 'links',
  RIGHT: 'rechts',
  SQUARE_BLOCKS: 'rechteckig Blöcke'
};

/**
@private
@type {PileConfig.i18n_strings}
*/
PileConfig.es_strings = {
  NUM_BLOCKS: 'Número de bloques',
  ADD_BLOCK: 'Añadir bloque',
  REBUILD: 'reconstruir',
  TWO_PILES: 'dos montones',
  CONNECTED_BLOCKS: 'bloques conectados',
  ENDLESS_LOOP: 'bucle infinito',
  LOOP_TIME: 'tiempo de repetición',
  RANDOM_SEED: 'Semilla aleatoria',
  WALL: 'Muro',
  LEFT: 'izquierda',
  RIGHT: 'derecha',
  SQUARE_BLOCKS: 'bloques cuadrados'
};

/** Set of internationalized strings.
@type {PileConfig.i18n_strings}
*/
PileConfig.i18n = PileConfig.en;
switch(goog.LOCALE) {
  case 'de':
    PileConfig.i18n = PileConfig.de_strings;
    break;
  case 'es':
    PileConfig.i18n = PileConfig.es_strings;
    break;
  default:
    PileConfig.i18n = PileConfig.en;
    break;
};

exports = PileConfig;
