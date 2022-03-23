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

goog.module('myphysicslab.sims.engine2D.MultipleCollisionApp');

const CheckBoxControl = goog.require('myphysicslab.lab.controls.CheckBoxControl');
const ChoiceControl = goog.require('myphysicslab.lab.controls.ChoiceControl');
const CollisionAdvance = goog.require('myphysicslab.lab.model.CollisionAdvance');
const CollisionHandling = goog.require('myphysicslab.lab.engine2D.CollisionHandling');
const CommonControls = goog.require('myphysicslab.sims.common.CommonControls');
const ContactSim = goog.require('myphysicslab.lab.engine2D.ContactSim');
const CoordType = goog.require('myphysicslab.lab.model.CoordType');
const DampingLaw = goog.require('myphysicslab.lab.model.DampingLaw');
const DoubleRect = goog.require('myphysicslab.lab.util.DoubleRect');
const Engine2DApp = goog.require('myphysicslab.sims.engine2D.Engine2DApp');
const JointUtil = goog.require('myphysicslab.lab.engine2D.JointUtil');
const NumericControl = goog.require('myphysicslab.lab.controls.NumericControl');
const ParameterNumber = goog.require('myphysicslab.lab.util.ParameterNumber');
const ParameterString = goog.require('myphysicslab.lab.util.ParameterString');
const Polygon = goog.require('myphysicslab.lab.engine2D.Polygon');
const RigidBodySim = goog.require('myphysicslab.lab.engine2D.RigidBodySim');
const Shapes = goog.require('myphysicslab.lab.engine2D.Shapes');
const Util = goog.require('myphysicslab.lab.util.Util');
const Vector = goog.require('myphysicslab.lab.util.Vector');
const Walls = goog.require('myphysicslab.lab.engine2D.Walls');

/** Demonstrates that collision handling policies produce different results.

+ One Hits Two:  two stationary blocks in resting contact;  one block hits them

+ Two Hit One:  central block is stationary;  2 blocks come in from left and right
    to hit it.  See Physics-Based Animation chapter 6.2 'Multiple Points of Collision'
    by Erleben, et. al, which describes this scenario. This should result in an
    infinite loop for the serial collision handler, and it would except for some
    'panic mode' error handling that occurs.

+ One Hits Two On Wall:  two stationary blocks in resting contact against wall;
    one block hits them.

+ Two On Wall: row of two balls in contact with each other and a wall; only the ball
     touching the wall is moving (colliding into the wall).

to do:  another to add:  1x3 block on ground, lying horizontally, pick up one corner
      (so the other corner still in contact) and let go.  With simultaneous solver,
      the corner in contact stays in contact (unrealistic).  With hybrid or serial
      it alternates which corner is bouncing.

This app has a {@link #config} function which looks at a set of options
and rebuilds the simulation accordingly. UI controls are created to change the options.
*/
class MultipleCollisionApp extends Engine2DApp {
/**
* @param {!Object} elem_ids specifies the names of the HTML
*    elementId's to look for in the HTML document; these elements are where the user
*    interface of the simulation is created.
* @param {string=} opt_name name of this as a Subject
*/
constructor(elem_ids, opt_name) {
  const w = 6;
  const h = 2;
  const simRect = new DoubleRect(-w, -h, w, h);
  const sim = new ContactSim();
  const advance = new CollisionAdvance(sim);
  super(elem_ids, simRect, sim, advance, opt_name);
  /** @type {!ContactSim} */
  this.mySim = sim;
  /** @type {number} */
  this.space_half_width = w;
  /** @type {number} */
  this.space_half_height = h;
  this.layout.getSimCanvas().setBackground('black');
  this.mySim.setCollisionHandling(CollisionHandling.SERIAL_GROUPED_LASTPASS);
  this.elasticity.setElasticity(1.0);
  this.mySim.setShowForces(true);
  //this.advance.setDebugLevel(CollisionAdvance.DebugLevel.OPTIMAL);
  /** @type {!DampingLaw} */
  this.dampingLaw = new DampingLaw(/*damping=*/0, /*rotateRatio=*/0.15,
      this.simList);
  /** @type {string} */
  this.shape = MultipleCollisionApp.Shape.SQUARE;
  /** @type {number} */
  this.offset = 0;
  /** @type {number} */
  this.angle = 0;
  /** @type {number} */
  this.speed = 3;
  const choices = [ MultipleCollisionApp.i18n.ONE_HITS_TWO,
      MultipleCollisionApp.i18n.ONE_HITS_THREE,
      MultipleCollisionApp.i18n.ONE_HITS_TWO_SEPARATE,
      MultipleCollisionApp.i18n.ONE_HITS_ONE_ON_WALL,
      MultipleCollisionApp.i18n.ONE_HITS_TWO_ON_WALL,
      MultipleCollisionApp.i18n.TWO_HIT_ONE,
      MultipleCollisionApp.i18n.TWO_HIT_ONE_ASYMMETRIC,
      MultipleCollisionApp.i18n.ONE_HITS_ONE,
      MultipleCollisionApp.i18n.ONE_HITS_ONE_ASYMMETRIC,
      MultipleCollisionApp.i18n.ONE_HITS_WALL,
      MultipleCollisionApp.i18n.ONE_HITS_CHAIN,
      MultipleCollisionApp.i18n.ONE_HITS_CHAIN_PLUS_ONE,
      MultipleCollisionApp.i18n.TWO_IN_BOX,
      MultipleCollisionApp.i18n.ONE_HITS_TWO_IN_BOX,
      MultipleCollisionApp.i18n.TWO_ON_WALL
    ];
  /** @type {!Array<string>} */
  this.formations = [ MultipleCollisionApp.en.ONE_HITS_TWO,
      MultipleCollisionApp.en.ONE_HITS_THREE,
      MultipleCollisionApp.en.ONE_HITS_TWO_SEPARATE,
      MultipleCollisionApp.en.ONE_HITS_ONE_ON_WALL,
      MultipleCollisionApp.en.ONE_HITS_TWO_ON_WALL,
      MultipleCollisionApp.en.TWO_HIT_ONE,
      MultipleCollisionApp.en.TWO_HIT_ONE_ASYMMETRIC,
      MultipleCollisionApp.en.ONE_HITS_ONE,
      MultipleCollisionApp.en.ONE_HITS_ONE_ASYMMETRIC,
      MultipleCollisionApp.en.ONE_HITS_WALL,
      MultipleCollisionApp.en.ONE_HITS_CHAIN,
      MultipleCollisionApp.en.ONE_HITS_CHAIN_PLUS_ONE,
      MultipleCollisionApp.en.TWO_IN_BOX,
      MultipleCollisionApp.en.ONE_HITS_TWO_IN_BOX,
      MultipleCollisionApp.en.TWO_ON_WALL
    ];
  this.formations = this.formations.map(v => Util.toName(v));
  /** @type {string} */
  this.formation = this.formations[0];

  this.addPlaybackControls();
  /** @type {!ParameterNumber} */
  let pn;
  /** @type {!ParameterString} */
  let ps;
  this.addParameter(ps = new ParameterString(this, MultipleCollisionApp.en.FORMATION,
      MultipleCollisionApp.i18n.FORMATION,
      () => this.getFormation(),
      a => this.setFormation(a), choices, this.formations));
  this.addControl(new ChoiceControl(ps));

  this.addParameter(ps = new ParameterString(this, MultipleCollisionApp.en.SHAPE,
      MultipleCollisionApp.i18n.SHAPE,
      () => this.getShape(), a => this.setShape(a),
      [ MultipleCollisionApp.i18n.SQUARE, MultipleCollisionApp.i18n.CIRCLE ],
      [ MultipleCollisionApp.Shape.SQUARE, MultipleCollisionApp.Shape.CIRCLE ]));
  this.addControl(new ChoiceControl(ps));

  this.addParameter(pn = new ParameterNumber(this, MultipleCollisionApp.en.OFFSET,
      MultipleCollisionApp.i18n.OFFSET,
      () => this.getOffset(), a => this.setOffset(a)));
  this.addControl(new NumericControl(pn));

  this.addParameter(pn = new ParameterNumber(this, MultipleCollisionApp.en.ANGLE,
      MultipleCollisionApp.i18n.ANGLE,
      () => this.getAngle(), a => this.setAngle(a)));
  pn.setLowerLimit(Util.NEGATIVE_INFINITY);
  this.addControl(new NumericControl(pn));

  this.addParameter(pn = new ParameterNumber(this, MultipleCollisionApp.en.SPEED,
      MultipleCollisionApp.i18n.SPEED,
      () => this.getSpeed(), a => this.setSpeed(a)));
  this.addControl(new NumericControl(pn));

  pn = this.dampingLaw.getParameterNumber(DampingLaw.en.DAMPING);
  this.addControl(new NumericControl(pn));

  ps = this.mySim.getParameterString(RigidBodySim.en.COLLISION_HANDLING);
  this.addControl(new ChoiceControl(ps));

  //ps = this.mySim.getParameterString(RigidBodySim.en.EXTRA_ACCEL);
  //this.addControl(new ChoiceControl(ps));

  this.addStandardControls();

  this.makeEasyScript();
  this.addURLScriptButton();
  this.config();
  this.graphSetup();
};

/** @override */
toString() {
  return Util.ADVANCED ? '' : this.toStringShort().slice(0, -1)
      +', dampingLaw: '+this.dampingLaw.toStringShort()
      +', formation: '+this.formation
      +', shape: '+this.shape
      +', angle: '+Util.NF(this.angle)
      +', offset: '+Util.NF(this.offset)
      +', speed: '+Util.NF(this.speed)
      + super.toString();
};

/** @override */
getClassName() {
  return 'MultipleCollisionApp';
};

/** @override */
defineNames(myName) {
  super.defineNames(myName);
  this.terminal.addRegex('dampingLaw',
       myName+'.');
  this.terminal.addRegex('MultipleCollisionApp|Engine2DApp',
       'myphysicslab.sims.engine2D.', /*addToVars=*/false);
};

/** @override */
getSubjects() {
  return super.getSubjects().concat(this.dampingLaw);
};

/**
* @return {!Polygon}
* @private
*/
makePuck() {
  if (this.shape == MultipleCollisionApp.Shape.SQUARE) {
    return Shapes.makeBlock(1, 1);
  } else if (this.shape == MultipleCollisionApp.Shape.CIRCLE) {
    return Shapes.makeBall(0.5);
  } else {
    throw 'unknown shape';
  }
};

/** Add body to simulation, setting color based on mass.  Heavier body will
* have darker color.
* @param {!Polygon} body
* @private
*/
addBody(body) {
  const c = MultipleCollisionApp.massToColor(body.getMass());
  this.mySim.addBody(body);
  this.displayList.findShape(body).setFillStyle(c).setDrawCenterOfMass(true);
};

/** Returns dark color for heavier mass, light color for light mass.

    mass log10(mass)  rgb
    0.1    -1         229
    1.0     0         186
    10      1         143
    100     2         100

This translates to equation:

    rgb = 100 + 43 (-log10(mass) + 2)

* @param {number} mass
* @return {string} color corresponding to mass
*/
static massToColor(mass) {
  let logm = Math.LOG10E * Math.log((mass));
  if (logm < -1) {
    logm = -1;
  } else if (logm > 2) {
    logm = 2;
  }
  const rgb = Math.floor(0.5 + 100 + 43 * (-logm + 2));
  const s = rgb.toString();
  return 'rgb('+s+','+s+','+s+')';
};

/**
* @return {undefined}
* @private
*/
config() {
  const elasticity = this.elasticity.getElasticity();
  this.mySim.cleanSlate();
  Polygon.ID = 1;
  this.advance.reset();
  const distTol = this.mySim.getDistanceTol();
  let body, body1, body2, body3, body4;
  const idx = this.formations.indexOf(this.formation);
  switch (idx) {

    case 0: //ONE_HITS_TWO:
      body = this.makePuck();
      body.setPosition(new Vector(-5,  0),  this.angle);
      body.setVelocity(new Vector(this.speed,  0),  0);
      this.addBody(body);

      body = this.makePuck();
      body.setPosition(new Vector(0,  0));
      this.addBody(body);

      body = this.makePuck();
      body.setPosition(new Vector(1 + distTol/2 + this.offset,  0));
      this.addBody(body);
      break;

    case 1: //ONE_HITS_THREE:
      body = this.makePuck();
      body.setPosition(new Vector(-5,  0),  this.angle);
      body.setVelocity(new Vector(this.speed,  0),  0);
      this.addBody(body);

      body = this.makePuck();
      body.setPosition(new Vector(-1 - distTol/2 + this.offset,  0));
      this.addBody(body);

      body = this.makePuck();
      body.setPosition(new Vector(0,  0));
      this.addBody(body);

      body = this.makePuck();
      body.setPosition(new Vector(1 + distTol/2 + this.offset,  0));
      this.addBody(body);
      break;

    case 2: //ONE_HITS_TWO_SEPARATE:
      body = Shapes.makeBlock(1, 3);
      body.setMass(2);
      body.setPosition(new Vector(-5,  0),  this.angle);
      body.setVelocity(new Vector(this.speed,  0),  0);
      this.addBody(body);

      body = this.makePuck();
      body.setPosition(new Vector(0,  1),  0);
      this.addBody(body);

      body = this.makePuck();
      body.setPosition(new Vector(0,  -1),  0);
      this.addBody(body);
      break;

    case 3: //ONE_HITS_ONE_ON_WALL:
      body = this.makePuck();
      body.setMass(1000);
      body.setPosition(new Vector(0,  0),  this.angle);
      body.setVelocity(new Vector(this.speed,  0),  0);
      this.addBody(body);

      body = this.makePuck();
      body.setPosition(new Vector(this.space_half_width - 0.5 - distTol/2,  0),  0);
      this.addBody(body);
      break;

    case 4: //ONE_HITS_TWO_ON_WALL:
      body = this.makePuck();
      body.setPosition(new Vector(0,  0),  this.angle);
      body.setVelocity(new Vector(this.speed,  0),  0);
      this.addBody(body);

      body = this.makePuck();
      body.setPosition(new Vector(this.space_half_width - 1.5 - distTol,  0),  0);
      this.addBody(body);

      body = this.makePuck();
      body.setPosition(new Vector(this.space_half_width - 0.5 - distTol/2,  0),  0);
      this.addBody(body);
      break;

    case 5: //TWO_HIT_ONE:
      body = this.makePuck();
      body.setPosition(new Vector(-5,  0),  this.angle);
      body.setVelocity(new Vector(this.speed,  0),  0);
      this.addBody(body);

      body = this.makePuck();
      body.setPosition(new Vector(0,  0));
      this.addBody(body);

      body = this.makePuck();
      body.setPosition(new Vector(5,  0),  this.angle);
      body.setVelocity(new Vector(-this.speed,  0),  0);
      this.addBody(body);
      break;

    case 6: //TWO_HIT_ONE_ASYMMETRIC:
      /* Here is why we need to add distTol/2 to starting position of body1:
       * The collision happens when the blocks are distTol/2 apart, so the distance
       * travelled is slightly less than you would expect.
       * Suppose distTol = 0.01; and distTol/2 = 0.005.
       * body2.left = 0.5;  body3.right = 2.5; body3 travels 2.5 - 0.5 - 0.005 = 1.995
       * If body1 starts at -5, it travels a distance of 3.995 which is more than
       * twice the distance that body3 travels, so it arrives after body3 collision.
       * To have them collide at the same moment:
       * Since body1 travels at twice the speed, it should travel 1.995 * 2 = 3.99
       * Therefore body1.right = body2.left - 0.005 - 3.99 = -4.495
       * Therefore body1.center = -4.995 = -5 + distTol/2
       */
      body = this.makePuck();
      body.setPosition(new Vector(-5 + distTol/2,  0),  this.angle);
      body.setVelocity(new Vector(this.speed,  0),  0);
      this.addBody(body);

      body = this.makePuck();
      body.setPosition(new Vector(0,  0));
      this.addBody(body);

      body = this.makePuck();
      body.setPosition(new Vector(3,  0));
      body.setVelocity(new Vector(-this.speed/2,  0),  0);
      this.addBody(body);
      break;

    case 7: //ONE_HITS_ONE:
      body = this.makePuck();
      body.setPosition(new Vector(-5,  0),  this.angle);
      body.setVelocity(new Vector(this.speed,  0),  0);
      this.addBody(body);

      body = this.makePuck();
      body.setPosition(new Vector(0,  0));
      this.addBody(body);
      break;

    case 8: //ONE_HITS_ONE_ASYMMETRIC:
      body = this.makePuck();
      body.setPosition(new Vector(-5,  0),  this.angle);
      body.setVelocity(new Vector(this.speed,  0),  0);
      this.addBody(body);

      body = this.makePuck();
      body.setPosition(new Vector(2.75,  0));
      body.setVelocity(new Vector(-this.speed/2,  0),  0);
      this.addBody(body);
      break;

    case 9: //ONE_HITS_WALL:
      body = this.makePuck();
      body.setPosition(new Vector(0,  0),  this.angle);
      body.setVelocity(new Vector(this.speed,  0),  0);
      this.addBody(body);
      break;

    case 11: //ONE_HITS_CHAIN_PLUS_ONE:
      body = this.makePuck();
      body.setMass(2);
      body.setPosition(new Vector(1 + distTol/2,  0));
      this.addBody(body);
      // ***** INTENTIONAL FALL-THRU ******

    case 10: //ONE_HITS_CHAIN:
      body = this.makePuck();
      body.setMass(2);
      body.setPosition(new Vector(-5,  0),  this.angle);
      body.setVelocity(new Vector(this.speed,  0),  0);
      this.addBody(body);

      body3 = Shapes.makeBlock(2, 1);
      body3.setPosition(new Vector(-0.5,  0));
      body3.setMass(1.5);
      this.addBody(body3);

      body2 = Shapes.makeBlock(2, 1);
      body2.setPosition(new Vector(-2,  0));
      body2.setMass(0.5);
      this.mySim.addBody(body2);
      this.displayList.findShape(body2).setFillStyle('rgb(240,240,240)')

      JointUtil.attachRigidBody(this.mySim,
        body2, /*attach_body1=*/new Vector(0.75, 0),
        body3, /*attach_body2=*/new Vector(-0.75, 0),
        /*normalType=*/CoordType.BODY
        );
      this.mySim.alignConnectors();
      break;

    case 12: //TWO_IN_BOX:
      body = Shapes.makeFrame(/*width=*/2 + 3*distTol/2 + 0.2,
          /*height=*/1 + 2*distTol/2 + 0.2, /*thickness=*/0.2);
      body.setPosition(new Vector(0,  0));
      this.addBody(body);

      body = Shapes.makeBall(0.5 - this.offset/2);
      body.setPosition(new Vector(-0.5-distTol/4,  0));
      this.addBody(body);

      body = Shapes.makeBall(0.5 - this.offset/2);
      body.setPosition(new Vector(0.5+distTol/4,  0));
      body.setVelocity(new Vector(this.speed,  0),  0);
      this.addBody(body);
      break;

    case 13: //ONE_HITS_TWO_IN_BOX:
      body1 = Shapes.makeFrame(/*width=*/2 + 3*distTol/2 + 0.2,
          /*height=*/1 + 2*distTol/2 + 0.2, /*thickness=*/0.2);
      body1.setPosition(new Vector(0,  0));
      this.addBody(body1);

      body2 = Shapes.makeBall(0.5 - this.offset/2);
      body2.setPosition(new Vector(-0.5-distTol/4,  0));
      this.addBody(body2);

      body3 = Shapes.makeBall(0.5 - this.offset/2);
      body3.setPosition(new Vector(0.5+distTol/4,  0));
      this.addBody(body3);

      body4 = Shapes.makeBall(0.5);
      body4.setPosition(new Vector(-5,  0));
      body4.setVelocity(new Vector(this.speed,  0),  0);
      this.addBody(body4);
      break;

    case 14: //TWO_ON_WALL:
      body = this.makePuck();
      body.setMass(1);
      body.setPosition(new Vector(this.space_half_width - 1.5 - distTol,  0),  0);
      this.addBody(body);

      body = this.makePuck();
      body.setPosition(new Vector(this.space_half_width - 0.5 - distTol/2,  0),  0);
      body.setVelocity(new Vector(this.speed,  0),  0);
      this.addBody(body);
      break;

    default:
      throw '';
  }

  Walls.make(this.mySim, 2*this.space_half_width, 2*this.space_half_height,
      /*thickness=*/1.0);

  this.mySim.setElasticity(elasticity);
  this.mySim.addForceLaw(this.dampingLaw);
  this.dampingLaw.connect(this.mySim.getSimList());
  this.mySim.getVarsList().setTime(0);
  this.mySim.saveInitialState();
  this.clock.setTime(this.mySim.getTime());
  this.clock.setRealTime(this.mySim.getTime());
  this.easyScript.update();
};

/**
* @return {string}
*/
getFormation() {
  return this.formation;
};

/**
* @param {string} value
*/
setFormation(value) {
  value = Util.toName(value);
  if (this.formation != value) {
    if (!this.formations.includes(value)) {
      throw 'unknown formation: '+value;
    }
    this.formation = value;
    this.config();
    this.broadcastParameter(MultipleCollisionApp.en.FORMATION);
  }
};

/**
* @return {number}
*/
getOffset() {
  return this.offset;
};

/**
* @param {number} value
*/
setOffset(value) {
  this.offset = value;
  this.config();
  this.broadcastParameter(MultipleCollisionApp.en.OFFSET);
};

/**
* @return {number}
*/
getSpeed() {
  return this.speed;
};

/**
* @param {number} value
*/
setSpeed(value) {
  this.speed = value;
  this.config();
  this.broadcastParameter(MultipleCollisionApp.en.SPEED);
};

/**
* @return {number}
*/
getAngle() {
  return this.angle;
};

/**
* @param {number} value
*/
setAngle(value) {
  this.angle = value;
  this.config();
  this.broadcastParameter(MultipleCollisionApp.en.ANGLE);
};

/**
* @return {string}
*/
getShape() {
  return this.shape;
};

/**
* @param {string} value
*/
setShape(value) {
  value = Util.toName(value);
  if (this.shape != value) {
    this.shape = value;
    this.config();
    this.broadcastParameter(MultipleCollisionApp.en.SHAPE);
  }
};

} // end class

/**
* @enum {string}
*/
MultipleCollisionApp.Shape = {
  SQUARE: 'SQUARE',
  CIRCLE: 'CIRCLE'
};

/** Set of internationalized strings.
@typedef {{
  FORMATION: string,
  ONE_HITS_THREE: string,
  ONE_HITS_TWO: string,
  TWO_HIT_ONE: string,
  ONE_HITS_ONE_ON_WALL: string,
  ONE_HITS_TWO_ON_WALL: string,
  ONE_HITS_TWO_SEPARATE: string,
  TWO_HIT_ONE_ASYMMETRIC: string,
  ONE_HITS_ONE: string,
  ONE_HITS_ONE_ASYMMETRIC: string,
  ONE_HITS_WALL: string,
  ONE_HITS_CHAIN: string,
  ONE_HITS_CHAIN_PLUS_ONE: string,
  TWO_IN_BOX: string,
  ONE_HITS_TWO_IN_BOX: string,
  TWO_ON_WALL: string,
  ANGLE: string,
  SHAPE: string,
  CIRCLE: string,
  SQUARE: string,
  OFFSET: string,
  PUCK_TYPE: string,
  SPEED: string,
  MASS: string
  }}
*/
MultipleCollisionApp.i18n_strings;

/**
@type {MultipleCollisionApp.i18n_strings}
*/
MultipleCollisionApp.en = {
  FORMATION: 'formation',
  ONE_HITS_THREE: 'one hits three',
  ONE_HITS_TWO: 'one hits two',
  TWO_HIT_ONE: 'two hit one',
  ONE_HITS_ONE_ON_WALL: 'one hits one on wall',
  ONE_HITS_TWO_ON_WALL: 'one hits two on wall',
  ONE_HITS_TWO_SEPARATE: 'one hits two separate',
  TWO_HIT_ONE_ASYMMETRIC: 'two hit one asymmetric',
  ONE_HITS_ONE: 'one hits one',
  ONE_HITS_ONE_ASYMMETRIC: 'one hits one asymmetric',
  ONE_HITS_WALL: 'one hits wall',
  ONE_HITS_CHAIN: 'one hits chain',
  ONE_HITS_CHAIN_PLUS_ONE: 'one hits chain plus one',
  TWO_IN_BOX: 'two in box',
  ONE_HITS_TWO_IN_BOX: 'one hits two in box',
  TWO_ON_WALL: 'two on wall',
  ANGLE: 'angle',
  SHAPE: 'shape',
  CIRCLE: 'circle',
  SQUARE: 'square',
  OFFSET: 'offset',
  PUCK_TYPE: 'puck type',
  SPEED: 'speed',
  MASS: 'mass'
};

/**
@private
@type {MultipleCollisionApp.i18n_strings}
*/
MultipleCollisionApp.de_strings = {
  FORMATION: 'Formation',
  ONE_HITS_THREE: 'eins schlägt drei',
  ONE_HITS_TWO: 'eins schlägt zwei',
  TWO_HIT_ONE: 'zwei schlagen eins',
  ONE_HITS_ONE_ON_WALL: 'eins schlägt eins an einer Mauer',
  ONE_HITS_TWO_ON_WALL: 'eins schlägt zwei an einer Mauer',
  ONE_HITS_TWO_SEPARATE: 'eins schlägt zwei getrennt',
  TWO_HIT_ONE_ASYMMETRIC: 'zwei schlagen eins asymmetrisch',
  ONE_HITS_ONE: 'eins schlägt eins',
  ONE_HITS_ONE_ASYMMETRIC: 'eins schlägt eins asymmetrisch',
  ONE_HITS_WALL: 'eins schlägt eine Mauer',
  ONE_HITS_CHAIN: 'eins schlägt eine Kette',
  ONE_HITS_CHAIN_PLUS_ONE: 'eins schlägt eine Kette+1',
  TWO_IN_BOX: 'zwei in einer Schachtel',
  ONE_HITS_TWO_IN_BOX: 'eins schlägt zwei in einer Schachtel',
  TWO_ON_WALL: 'zwei an der Mauer',
  ANGLE: 'Winkel',
  SHAPE: 'Form',
  CIRCLE: 'Kreis',
  SQUARE: 'Quadrat',
  OFFSET: 'Abstand',
  PUCK_TYPE: 'Scheiben Typ',
  SPEED: 'Geschwindigkeit',
  MASS: 'Masse'
};

/**
@private
@type {MultipleCollisionApp.i18n_strings}
*/
MultipleCollisionApp.es_strings = {
  FORMATION: 'Formación',
  ONE_HITS_THREE: 'uno golpea tres',
  ONE_HITS_TWO: 'uno golpea dos',
  TWO_HIT_ONE: 'dos golpean uno',
  ONE_HITS_ONE_ON_WALL: 'uno golpea uno en el muro',
  ONE_HITS_TWO_ON_WALL: 'uno golpea dos en el muro',
  ONE_HITS_TWO_SEPARATE: 'uno golpea dos separados',
  TWO_HIT_ONE_ASYMMETRIC: 'dos golpean uno asimétricamente',
  ONE_HITS_ONE: 'uno golpea uno',
  ONE_HITS_ONE_ASYMMETRIC: 'uno golpea uno asimétricamente',
  ONE_HITS_WALL: 'uno golpea en el muro',
  ONE_HITS_CHAIN: 'uno golpea en cadena',
  ONE_HITS_CHAIN_PLUS_ONE: 'uno golpea en cadena más otro',
  TWO_IN_BOX: 'dos en caja',
  ONE_HITS_TWO_IN_BOX: 'uno golpea dos en caja',
  TWO_ON_WALL: 'dos en muro',
  ANGLE: 'Ángulo',
  SHAPE: 'Forma',
  CIRCLE: 'Círculo',
  SQUARE: 'Cuadrado',
  OFFSET: 'Desplazamiento',
  PUCK_TYPE: 'Tipo de disco',
  SPEED: 'Velocidad',
  MASS: 'Masa'
};

/**
@private
@type {MultipleCollisionApp.i18n_strings}
*/
MultipleCollisionApp.ca_strings = {
  FORMATION: 'Formació',
  ONE_HITS_THREE: 'un colpeja tres',
  ONE_HITS_TWO: 'un colpeja dos',
  TWO_HIT_ONE: 'dos colpegen un',
  ONE_HITS_ONE_ON_WALL: 'un colpeja un en el mur',
  ONE_HITS_TWO_ON_WALL: 'un colpeja dos en el mur',
  ONE_HITS_TWO_SEPARATE: 'un colpeja dos separats',
  TWO_HIT_ONE_ASYMMETRIC: 'dos colpegen un asimètricament',
  ONE_HITS_ONE: 'un colpeja un',
  ONE_HITS_ONE_ASYMMETRIC: 'un colpeja un asimètricament',
  ONE_HITS_WALL: 'un colpeja en el mur',
  ONE_HITS_CHAIN: 'un colpeja en cadena',
  ONE_HITS_CHAIN_PLUS_ONE: 'un colpeja en cadena més altre',
  TWO_IN_BOX: 'dos en caixa',
  ONE_HITS_TWO_IN_BOX: 'un colpeja dos en caixa',
  TWO_ON_WALL: 'dos en mur',
  ANGLE: 'Angle',
  SHAPE: 'Forma',
  CIRCLE: 'Cercle',
  SQUARE: 'Quadrat',
  OFFSET: 'Desplaçament',
  PUCK_TYPE: 'Tipus de disc',
  SPEED: 'Velocitat',
  MASS: 'Massa'
};

/** Set of internationalized strings.
@type {MultipleCollisionApp.i18n_strings}
*/
MultipleCollisionApp.i18n = MultipleCollisionApp.en;

switch(goog.LOCALE) {
  case 'de':
    MultipleCollisionApp.i18n = MultipleCollisionApp.de_strings;
    break;
  case 'es':
    MultipleCollisionApp.i18n = MultipleCollisionApp.es_strings;
    break;
  case 'ca':
    MultipleCollisionApp.i18n = MultipleCollisionApp.ca_strings;
    break;
  default:
    MultipleCollisionApp.i18n = MultipleCollisionApp.en;
    break;
};

/**
* @param {!Object} elem_ids
* @param {string=} opt_name name of this as a Subject
* @return {!MultipleCollisionApp}
*/
function makeMultipleCollisionApp(elem_ids, opt_name) {
  return new MultipleCollisionApp(elem_ids, opt_name);
};
goog.exportSymbol('makeMultipleCollisionApp', makeMultipleCollisionApp);

exports = MultipleCollisionApp;
