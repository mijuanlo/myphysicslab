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

goog.module('myphysicslab.sims.engine2D.RigidBodyApp');

const CommonControls = goog.require('myphysicslab.sims.common.CommonControls');
const ConcreteVertex = goog.require('myphysicslab.lab.engine2D.ConcreteVertex');
const CoordType = goog.require('myphysicslab.lab.model.CoordType');
const DampingLaw = goog.require('myphysicslab.lab.model.DampingLaw');
const DoubleRect = goog.require('myphysicslab.lab.util.DoubleRect');
const Engine2DApp = goog.require('myphysicslab.sims.engine2D.Engine2DApp');
const GravityLaw = goog.require('myphysicslab.lab.model.GravityLaw');
const NumericControl = goog.require('myphysicslab.lab.controls.NumericControl');
const ParameterNumber = goog.require('myphysicslab.lab.util.ParameterNumber');
const Polygon = goog.require('myphysicslab.lab.engine2D.Polygon');
const RigidBodySim = goog.require('myphysicslab.lab.engine2D.RigidBodySim');
const Scrim = goog.require('myphysicslab.lab.engine2D.Scrim');
const Shapes = goog.require('myphysicslab.lab.engine2D.Shapes');
const SimpleAdvance = goog.require('myphysicslab.lab.model.SimpleAdvance');
const SixThrusters = goog.require('myphysicslab.sims.engine2D.SixThrusters');
const Spring = goog.require('myphysicslab.lab.model.Spring');
const ThrusterSet = goog.require('myphysicslab.lab.engine2D.ThrusterSet');
const Util = goog.require('myphysicslab.lab.util.Util');
const Vector = goog.require('myphysicslab.lab.util.Vector');

/**  RigidBodyApp demonstrates using RigidBodySim (instead of the usual ContactSim) with
a set of simple rectangular objects.

This app has a {@link #config} function which looks at a set of options
and rebuilds the simulation accordingly. UI controls are created to change the options.
*/
class RigidBodyApp extends Engine2DApp {
/**
* @param {!Object} elem_ids specifies the names of the HTML
*    elementId's to look for in the HTML document; these elements are where the user
*    interface of the simulation is created.
*/
constructor(elem_ids) {
  const simRect = new DoubleRect(-4, -4, 4, 4);
  const sim = new RigidBodySim();
  const advance = new SimpleAdvance(sim);
  super(elem_ids, simRect, sim, advance);
  /** @type {!RigidBodySim} */
  this.mySim = sim;
  this.layout.getSimCanvas().setBackground('black');
  this.rbo.protoPolygon.setNameColor('gray').setNameFont('10pt sans-serif');
  this.rbo.protoSpring.setThickness(4).setWidth(.4);
  this.elasticity.setElasticity(1.0);
  this.mySim.setShowForces(false);
  /** @type {!DampingLaw} */
  this.dampingLaw = new DampingLaw(0, 0.1, this.simList);
  /** @type {!GravityLaw} */
  this.gravityLaw = new GravityLaw(0, this.simList);
  /** @type {number} */
  this.numBods = 5;
  /** @type {number} */
  this.mass1 = 1;
  /** @type {number} */
  this.thrust = 1.5;
  /** @type {!ThrusterSet} */
  this.thrust1;
  /** @type {!ThrusterSet} */
  this.thrust2;
  /** @type {!Array<!Spring>} */
  this.springs_ = [];
  /** @type {number} */
  this.restLength = 0.75;
  /** @type {number} */
  this.stiffness = 1;

  this.addPlaybackControls();
  /** @type {!ParameterNumber} */
  let pn;
  this.addParameter(pn = new ParameterNumber(this, RigidBodyApp.en.NUM_BODIES,
      RigidBodyApp.i18n.NUM_BODIES,
      () => this.getNumBodies(), a => this.setNumBodies(a))
      .setDecimalPlaces(0).setLowerLimit(1).setUpperLimit(6));
  this.addControl(new NumericControl(pn));

  this.addParameter(pn = new ParameterNumber(this, RigidBodyApp.en.THRUST,
      RigidBodyApp.i18n.THRUST,
      () => this.getThrust(), a => this.setThrust(a)));
  this.addControl(new NumericControl(pn));

  this.addParameter(pn = new ParameterNumber(this, RigidBodyApp.en.MASS1,
      RigidBodyApp.i18n.MASS1,
      () => this.getMass1(), a => this.setMass1(a)));
  this.addControl(new NumericControl(pn));

  pn = this.gravityLaw.getParameterNumber(GravityLaw.en.GRAVITY);
  this.addControl(new NumericControl(pn));
  this.watchEnergyChange(pn);

  pn = this.dampingLaw.getParameterNumber(DampingLaw.en.DAMPING);
  this.addControl(new NumericControl(pn));

  this.addParameter(
      pn = new ParameterNumber(this, RigidBodyApp.en.SPRING_STIFFNESS,
      RigidBodyApp.i18n.SPRING_STIFFNESS,
      () => this.getStiffness(), a => this.setStiffness(a)));
  this.addControl(new NumericControl(pn));

  this.addParameter(
      pn = new ParameterNumber(this, RigidBodyApp.en.SPRING_LENGTH,
      RigidBodyApp.i18n.SPRING_LENGTH,
      () => this.getRestLength(), a => this.setRestLength(a)));
  this.addControl(new NumericControl(pn));

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
      +', gravityLaw: '+this.gravityLaw.toStringShort()
      + super.toString();
};

/**
* @param {!Spring} s
* @private
*/
addSpring(s) {
  this.springs_.push(s);
  this.mySim.addForceLaw(s);
  this.simList.add(s);
};

/** @override */
getClassName() {
  return 'RigidBodyApp';
};

/** @override */
defineNames(myName) {
  super.defineNames(myName);
  this.terminal.addRegex('gravityLaw|dampingLaw',
       myName+'.');
  this.terminal.addRegex('RigidBodyApp|Engine2DApp',
       'myphysicslab.sims.engine2D.', /*addToVars=*/false);
};

/** @override */
getSubjects() {
  return super.getSubjects().concat(this.dampingLaw, this.gravityLaw);
};

/**
* @param {number} num
* @return {!Polygon}
* @private
*/
static makeBlock(num) {
  return Shapes.makeBlock(1, 3, RigidBodyApp.en.BLOCK+num, RigidBodyApp.i18n.BLOCK+num);
};

/**
* @return {undefined}
*/
config() {
  const elasticity = this.elasticity.getElasticity();
  this.mySim.cleanSlate();
  Polygon.ID = 1;
  this.springs_ = [];
  this.advance.reset();
  this.mySim.addForceLaw(this.dampingLaw);
  this.dampingLaw.connect(this.mySim.getSimList());
  this.mySim.addForceLaw(this.gravityLaw);
  this.gravityLaw.connect(this.mySim.getSimList());

  make_blocks:
  if (this.numBods >= 1) {
    const p1 = RigidBodyApp.makeBlock(1);
    p1.setPosition(new Vector(-3.3,  0),  0);
    p1.setVelocity(new Vector(0.3858,  -0.3608),  -0.3956);
    p1.setMass(this.mass1);
    this.mySim.addBody(p1);
    this.thrust2 = SixThrusters.make(this.thrust, p1);
    this.rbeh.setThrusters(this.thrust2, 'left');
    this.mySim.addForceLaw(this.thrust2);
    this.addSpring(new Spring('spring 1',
        Scrim.getScrim(), new Vector(-2, -2),
        p1, new Vector(0.15, 0.7),
        this.restLength, this.stiffness));
    this.displayList.findShape(p1).setFillStyle('cyan');

    if (this.numBods < 2) {
      break make_blocks;
    }
    const p2 = RigidBodyApp.makeBlock(2);
    p2.setPosition(new Vector(-2.2,  0),  0);
    p2.setVelocity(new Vector(0.26993,  -0.01696),  -0.30647);
    this.mySim.addBody(p2);
    this.thrust1 = SixThrusters.make(this.thrust, p2);
    this.rbeh.setThrusters(this.thrust1, 'right');
    this.mySim.addForceLaw(this.thrust1);
    this.addSpring(new Spring('spring 2',
        Scrim.getScrim(), new Vector(2, 2),
        p2, new Vector(0.15, 0.7),
        this.restLength, this.stiffness));
    this.addSpring(new Spring('spring 3',
        p2, new Vector(0.15, -0.7),
        p1, new Vector(0.15, -0.7),
        this.restLength, this.stiffness));
    this.displayList.findShape(p2).setFillStyle('orange');

    if (this.numBods < 3) {
      break make_blocks;
    }
    const p3 = RigidBodyApp.makeBlock(3);
    p3.setPosition(new Vector(2.867,  -0.113),  0);
    p3.setVelocity(new Vector(-0.29445,  -0.11189),  -0.23464);
    this.mySim.addBody(p3);
    this.addSpring(new Spring('spring 4',
        p3, new Vector(0.15, 0.7),
        p2, new Vector(0.15, -0.7),
        this.restLength, this.stiffness));
    this.displayList.findShape(p3).setFillStyle('#9f3'); // light green

    if (this.numBods < 4) {
      break make_blocks;
    }
    const p4 = RigidBodyApp.makeBlock(4);
    p4.setPosition(new Vector(1.36,  2.5),  -Math.PI/4);
    p4.setVelocity(new Vector(-0.45535,  -0.37665),  0.36526);
    this.mySim.addBody(p4);
    this.addSpring(new Spring('spring 5',
        p4, new Vector(0.15, 0.7),
        p3, new Vector(0.15, -0.7),
        this.restLength, this.stiffness));
    this.displayList.findShape(p4).setFillStyle('#f6c'); // hot pink

    if (this.numBods < 5) {
      break make_blocks;
    }
    const p5 = RigidBodyApp.makeBlock(5);
    p5.setPosition(new Vector(-2,  2.5),  Math.PI/2+0.1);
    this.mySim.addBody(p5);
    this.addSpring(new Spring('spring 6',
        p5, new Vector(0.15, 0.7),
        p4, new Vector(0.15, -0.7),
        this.restLength, this.stiffness));
    this.displayList.findShape(p5).setFillStyle('#39f');

    if (this.numBods >= 6) {
      break make_blocks;
    }
    const p6 = RigidBodyApp.makeBlock(6);
    p6.setPosition(new Vector(0.08,  0.127),  0.888);
    this.mySim.addBody(p6);
    this.addSpring(new Spring('spring 7',
        p6, new Vector(0.15, 0.7),
        p5, new Vector(0.15, -0.7),
        this.restLength, this.stiffness));
    this.displayList.findShape(p6).setFillStyle('#c99');
  }
  this.mySim.getVarsList().setTime(0);
  this.mySim.saveInitialState();
  this.clock.setTime(0);
  this.clock.setRealTime(0);
  this.easyScript.update();
};

/**
* @return {number}
*/
getMass1() {
  return this.mass1;
};

/**
* @param {number} value
*/
setMass1(value) {
  if (this.mass1 != value) {
    this.mass1 = value;
    const body1 = this.mySim.getBody(RigidBodyApp.en.BLOCK+'1');
    body1.setMass(value);
    this.broadcastParameter(RigidBodyApp.en.MASS1);
  }
};

/**
* @return {number}
*/
getNumBodies() {
  return this.numBods;
};

/**
* @param {number} value
*/
setNumBodies(value) {
  this.numBods = value;
  this.config();
  this.broadcastParameter(RigidBodyApp.en.NUM_BODIES);
};

/**
* @return {number}
*/
getStiffness() {
  return this.stiffness;
};

/**
* @param {number} value
*/
setStiffness(value) {
  this.stiffness = value;
  this.springs_.forEach(s => s.setStiffness(value));
  // discontinuous change to energy; 1 = KE, 2 = PE, 3 = TE
  this.mySim.getVarsList().incrSequence(2, 3);
  this.broadcastParameter(RigidBodyApp.en.SPRING_STIFFNESS);
};

/**
* @return {number}
*/
getRestLength() {
  return this.restLength;
};

/**
* @param {number} value
*/
setRestLength(value) {
  this.restLength = value;
  this.springs_.forEach(s => s.setRestLength(value));
  // discontinuous change to energy; 1 = KE, 2 = PE, 3 = TE
  this.mySim.getVarsList().incrSequence(2, 3);
  this.broadcastParameter(RigidBodyApp.en.SPRING_LENGTH);
};

/**
* @return {number}
*/
getThrust() {
  return this.thrust;
};

/**
* @param {number} value
*/
setThrust(value) {
  this.thrust = value;
  this.thrust1.setMagnitude(value);
  this.thrust2.setMagnitude(value);
  this.broadcastParameter(RigidBodyApp.en.THRUST);
};

} // end class

/** Set of internationalized strings.
@typedef {{
  NUM_BODIES: string,
  SPRING_LENGTH: string,
  SPRING_STIFFNESS: string,
  THRUST: string,
  BLOCK: string,
  MASS1: string
  }}
*/
RigidBodyApp.i18n_strings;

/**
@type {RigidBodyApp.i18n_strings}
*/
RigidBodyApp.en = {
  NUM_BODIES: 'number of objects',
  SPRING_LENGTH: 'spring length',
  SPRING_STIFFNESS: 'spring stiffness',
  THRUST: 'thrust',
  BLOCK: 'block',
  MASS1: 'mass of block1'
};

/**
@private
@type {RigidBodyApp.i18n_strings}
*/
RigidBodyApp.de_strings = {
  NUM_BODIES: 'Anzahl von Objekten',
  SPRING_LENGTH: 'Federlänge',
  SPRING_STIFFNESS: 'Federsteifheit',
  THRUST: 'Schubkraft',
  BLOCK: 'Block',
  MASS1: 'Masse von Block1'
};

/**
@private
@type {RigidBodyApp.i18n_strings}
*/
RigidBodyApp.es_strings = {
  NUM_BODIES: 'Número de objetos',
  SPRING_LENGTH: 'Longitud del muelle',
  SPRING_STIFFNESS: 'Rigidez del muelle',
  THRUST: 'Empuje',
  BLOCK: 'Bloque',
  MASS1: 'Masa del bloque 1'
};

/** Set of internationalized strings.
@type {RigidBodyApp.i18n_strings}
*/
RigidBodyApp.i18n = RigidBodyApp.en;
switch(goog.LOCALE) {
  case 'de':
    RigidBodyApp.i18n = RigidBodyApp.de_strings;
    break;
  case 'es':
    RigidBodyApp.i18n = RigidBodyApp.es_strings;
    break;
  default:
    RigidBodyApp.i18n = RigidBodyApp.en;
    break;
};

/**
* @param {!Object} elem_ids
* @return {!RigidBodyApp}
*/
function makeRigidBodyApp(elem_ids) {
  return new RigidBodyApp(elem_ids);
};
goog.exportSymbol('makeRigidBodyApp', makeRigidBodyApp);

exports = RigidBodyApp;
