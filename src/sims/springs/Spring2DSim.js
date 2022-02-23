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

goog.module('myphysicslab.sims.springs.Spring2DSim');

const asserts = goog.require('goog.asserts');
const AbstractODESim = goog.require('myphysicslab.lab.model.AbstractODESim');
const ConcreteLine = goog.require('myphysicslab.lab.model.ConcreteLine');
const EnergyInfo = goog.require('myphysicslab.lab.model.EnergyInfo');
const EnergySystem = goog.require('myphysicslab.lab.model.EnergySystem');
const EventHandler = goog.require('myphysicslab.lab.app.EventHandler');
const ParameterNumber = goog.require('myphysicslab.lab.util.ParameterNumber');
const PointMass = goog.require('myphysicslab.lab.model.PointMass');
const Spring = goog.require('myphysicslab.lab.model.Spring');
const Util = goog.require('myphysicslab.lab.util.Util');
const VarsList = goog.require('myphysicslab.lab.model.VarsList');
const Vector = goog.require('myphysicslab.lab.util.Vector');

/** 2-D spring simulation with gravity. An immoveable top anchor mass with a spring and
moveable mass hanging below and swinging in 2D. The top anchor mass can however be
dragged by the user.

Variables and Parameters
-------------------------
Here is a diagram of the two masses showing the definition of the angle `th`:

       T      .
        \     .
         \ th .
          \   .
           \  .
            \ .
             U

Variables:

    U = (Ux, Uy) = position of center of bob
    V = (Vx, Vy) = velocity of bob
    th = angle with vertical (radians); 0 = hanging down; positive is counter clockwise
    L = stretch of spring from rest length

Parameters:

    T = (Tx, Ty) = position of top anchor mass
    R = rest length of spring
    k = spring constant
    b = damping constant
    m = mass of bob

Equations of Motion
-------------------------
The derivation of the equations of motion is shown in more detail at
<http://www.myphysicslab.com/spring2d.html>.

    Fx = - k L sin(th) - b Vx = m Vx'
    Fy = - m g + k L cos(th) - b Vy = m Vy'
    xx = Ux - Tx
    yy = Uy - Ty
    len = Sqrt(xx^2+yy^2)
    L = len - R
    th = atan(xx/yy)
    cos(th) = -yy / len
    sin(th) = xx / len

Differential Equations:

    Ux' = Vx
    Uy' = Vy
    Vx' = -(k/m)L sin(th) -(b/m)Vx
    Vy' = -g + (k/m)L cos(th) -(b/m)Vy

Variables Array
-------------------------
The variables are stored in the VarsList as follows

    vars[0] = Ux
    vars[1] = Uy
    vars[2] = Vx
    vars[3] = Vy
    vars[4] = KE kinetic energy
    vars[5] = PE potential energy
    vars[6] = TE total energy
    vars[7] = time
    vars[8] = anchor X
    vars[9] = anchor Y

* @implements {EnergySystem}
* @implements {EventHandler}
*/
class Spring2DSim extends AbstractODESim {
/**
* @param {string=} opt_name name of this as a Subject
*/
constructor(opt_name) {
  super(opt_name);
  // vars:   0   1   2   3   4   5   6    7      8        9
  //        Ux  Uy  Vx  Vy  KE  PE  TE  time  anchorX  anchorY
  const var_names = [
    Spring2DSim.en.X_POSITION,
    Spring2DSim.en.Y_POSITION,
    Spring2DSim.en.X_VELOCITY,
    Spring2DSim.en.Y_VELOCITY,
    EnergySystem.en.KINETIC_ENERGY,
    EnergySystem.en.POTENTIAL_ENERGY,
    EnergySystem.en.TOTAL_ENERGY,
    VarsList.en.TIME,
    Spring2DSim.en.ANCHOR_X,
    Spring2DSim.en.ANCHOR_Y
  ];
  const i18n_names = [
    Spring2DSim.i18n.X_POSITION,
    Spring2DSim.i18n.Y_POSITION,
    Spring2DSim.i18n.X_VELOCITY,
    Spring2DSim.i18n.Y_VELOCITY,
    EnergySystem.i18n.KINETIC_ENERGY,
    EnergySystem.i18n.POTENTIAL_ENERGY,
    EnergySystem.i18n.TOTAL_ENERGY,
    VarsList.i18n.TIME,
    Spring2DSim.i18n.ANCHOR_X,
    Spring2DSim.i18n.ANCHOR_Y
  ];
  const va = new VarsList(var_names, i18n_names, this.getName()+'_VARS');
  this.setVarsList(va);
  va.setComputed(4, 5, 6);
  /**
  * @type {boolean}
  * @private
  */
  this.isDragging_ = false;
  /**
  * @type {number}
  * @private
  */
  this.gravity_ = 9.8;
  /**
  * @type {number}
  * @private
  */
  this.damping_ = 0;
  /** potential energy offset
  * @type {number}
  * @private
  */
  this.potentialOffset_ = 0;
  /**
  * @type {!PointMass}
  * @private
  */
  this.anchor_ = PointMass.makeSquare(0.5, 'anchor');
  this.anchor_.setPosition(new Vector(0, 3));
  /**
  * @type {!PointMass}
  * @private
  */
  this.bob_ = PointMass.makeCircle(0.5, 'bob').setMass(0.5);
  /**
  * @type {!Spring}
  * @private
  */
  this.spring_ = new Spring('spring',
      this.anchor_, Vector.ORIGIN,
      this.bob_, Vector.ORIGIN,
      /*restLength=*/2.5, /*stiffness=*/6.0);
  this.getSimList().add(this.anchor_, this.bob_, this.spring_);
  this.addParameter(new ParameterNumber(this, Spring2DSim.en.GRAVITY,
      Spring2DSim.i18n.GRAVITY,
      () => this.getGravity(), a => this.setGravity(a)));
  this.addParameter(new ParameterNumber(this, Spring2DSim.en.MASS,
      Spring2DSim.i18n.MASS,
      () => this.getMass(), a => this.setMass(a)));
  this.addParameter(new ParameterNumber(this, Spring2DSim.en.DAMPING,
      Spring2DSim.i18n.DAMPING,
      () => this.getDamping(), a => this.setDamping(a)));
  this.addParameter(new ParameterNumber(this, Spring2DSim.en.SPRING_LENGTH,
      Spring2DSim.i18n.SPRING_LENGTH,
      () => this.getSpringRestLength(),
      a => this.setSpringRestLength(a)));
  this.addParameter(new ParameterNumber(this, Spring2DSim.en.SPRING_STIFFNESS,
      Spring2DSim.i18n.SPRING_STIFFNESS,
      () => this.getSpringStiffness(),
      a => this.setSpringStiffness(a)));
  this.addParameter(new ParameterNumber(this, EnergySystem.en.PE_OFFSET,
      EnergySystem.i18n.PE_OFFSET,
      () => this.getPEOffset(), a => this.setPEOffset(a))
      .setLowerLimit(Util.NEGATIVE_INFINITY)
      .setSignifDigits(5));
  // vars:   0   1   2   3   4   5   6    7      8        9
  //        Ux  Uy  Vx  Vy  KE  PE  TE  time  anchorX  anchorY
  this.restState();
  va.setValue(2, 1.5);
  va.setValue(3, 1.7);
  this.saveInitialState();
};

/** @override */
toString() {
  return Util.ADVANCED ? '' : this.toStringShort().slice(0, -1)
      +', gravity_: '+Util.NF(this.gravity_)
      +', damping_: '+Util.NF(this.damping_)
      +', spring_: '+this.spring_
      +', bob_: '+this.bob_
      +', anchor_: '+this.anchor_
      +', potentialOffset_: '+Util.NF(this.potentialOffset_)
      + super.toString();
};

/** @override */
getClassName() {
  return 'Spring2DSim';
};

/** Sets simulation to motionless equilibrium resting state, and sets potential energy
* to zero.
* @return {undefined}
*/
restState() {
  // vars:   0   1   2   3   4   5   6    7      8        9
  //        Ux  Uy  Vx  Vy  KE  PE  TE  time  anchorX  anchorY
  const va = this.getVarsList();
  const vars = va.getValues();
  const fixY = vars[9] = this.anchor_.getPosition().getY();
  vars[0] = vars[8] = this.anchor_.getPosition().getX();
  vars[1] = fixY - this.spring_.getRestLength()
    - this.bob_.getMass()*this.gravity_/this.spring_.getStiffness();
  vars[2] = vars[3] = 0;
  va.setValues(vars);
  this.modifyObjects();
  this.potentialOffset_ = 0;
  this.setPEOffset(-this.getEnergyInfo().getPotential());
};

/** @override */
getEnergyInfo() {
  const ke = this.bob_.getKineticEnergy();
  const y = this.bob_.getPosition().getY();
  let pe = this.gravity_ * this.bob_.getMass() * y;
  pe += this.spring_.getPotentialEnergy();
  return new EnergyInfo(pe + this.potentialOffset_, ke);
};

/** @override */
getPEOffset() {
  return this.potentialOffset_;
}

/** @override */
setPEOffset(value) {
  this.potentialOffset_ = value;
  // vars:   0   1   2   3   4   5   6    7      8        9
  //        Ux  Uy  Vx  Vy  KE  PE  TE  time  anchorX  anchorY
  // discontinuous change in energy
  this.getVarsList().incrSequence(5, 6);
  this.broadcastParameter(EnergySystem.en.PE_OFFSET);
};

/** @override */
modifyObjects() {
  const va = this.getVarsList();
  const vars = va.getValues();
  this.moveObjects(vars);
  const ei = this.getEnergyInfo();
  // vars:   0   1   2   3   4   5   6    7      8        9
  //        Ux  Uy  Vx  Vy  KE  PE  TE  time  anchorX  anchorY
  va.setValue(4, ei.getTranslational(), true);
  va.setValue(5, ei.getPotential(), true);
  va.setValue(6, ei.getTotalEnergy(), true);
};

/**
@param {!Array<number>} vars
@private
*/
moveObjects(vars) {
  // vars:   0   1   2   3   4   5   6    7      8        9
  //        Ux  Uy  Vx  Vy  KE  PE  TE  time  anchorX  anchorY
  this.bob_.setPosition(new Vector(vars[0],  vars[1]));
  this.bob_.setVelocity(new Vector(vars[2], vars[3], 0));
  this.anchor_.setPosition(new Vector(vars[8],  vars[9]));
};

/** @override */
startDrag(simObject, location, offset, dragBody, mouseEvent) {
  if (simObject == this.bob_) {
    this.isDragging_ = true;
    return true;
  } else if (simObject == this.anchor_) {
    return true;
  }
  return false;
};

/** @override */
mouseDrag(simObject, location, offset, mouseEvent) {
  // vars:   0   1   2   3   4   5   6    7      8        9
  //        Ux  Uy  Vx  Vy  KE  PE  TE  time  anchorX  anchorY
  const va = this.getVarsList();
  const p = location.subtract(offset);
  if (simObject == this.anchor_) {
    va.setValue(8, p.getX());
    va.setValue(9, p.getY());
  } else if (simObject == this.bob_) {
    va.setValue(0, p.getX());
    va.setValue(1, p.getY());
    va.setValue(2, 0);
    va.setValue(3, 0);
  }
  this.moveObjects(va.getValues());
};

/** @override */
finishDrag(simObject, location, offset) {
  this.isDragging_ = false;
};

/** @override */
handleKeyEvent(keyCode, pressed, keyEvent) {
};

/** @override */
evaluate(vars, change, timeStep) {
  // vars:   0   1   2   3   4   5   6    7      8        9
  //        Ux  Uy  Vx  Vy  KE  PE  TE  time  anchorX  anchorY
  Util.zeroArray(change);
  this.moveObjects(vars);
  change[7] = 1; // time
  if (!this.isDragging_) {
    const forces = this.spring_.calculateForces();
    const f = forces[1];
    asserts.assert(f.getBody() == this.bob_);
    const m = this.bob_.getMass();
    change[0] = vars[2]; // Ux' = Vx
    change[1] = vars[3]; // Uy' = Vy
    //Vx' = Fx / m = (- k L sin(th) - b Vx ) / m
    change[2] = (f.getVector().getX() - this.damping_ * vars[2]) / m;
    //Vy' = Fy / m = - g + (k L cos(th) - b Vy ) / m
    change[3] = -this.gravity_ + (f.getVector().getY() - this.damping_*vars[3])/m;
  }
  return null;
};

/** Return gravity strength.
@return {number} gravity strength
*/
getGravity() {
  return this.gravity_;
};

/** Set gravity strength.
@param {number} value gravity strength
*/
setGravity(value) {
  this.gravity_ = value;
  // vars:   0   1   2   3   4   5   6    7      8        9
  //        Ux  Uy  Vx  Vy  KE  PE  TE  time  anchorX  anchorY
  // discontinuous change in energy
  this.getVarsList().incrSequence(5, 6);
  this.broadcastParameter(Spring2DSim.en.GRAVITY);
};

/** Return mass of pendulum bob.
@return {number} mass of pendulum bob
*/
getMass() {
  return this.bob_.getMass();
};

/** Set mass of pendulum bob
@param {number} value mass of pendulum bob
*/
setMass(value) {
  this.bob_.setMass(value);
  // vars:   0   1   2   3   4   5   6    7      8        9
  //        Ux  Uy  Vx  Vy  KE  PE  TE  time  anchorX  anchorY
  // discontinuous change in energy
  this.getVarsList().incrSequence(4, 5, 6);
  this.broadcastParameter(Spring2DSim.en.MASS);
};

/** Return spring resting length
@return {number} spring resting length
*/
getSpringRestLength() {
  return this.spring_.getRestLength();
};

/** Set spring resting length
@param {number} value spring resting length
*/
setSpringRestLength(value) {
  this.spring_.setRestLength(value);
  // vars:   0   1   2   3   4   5   6    7      8        9
  //        Ux  Uy  Vx  Vy  KE  PE  TE  time  anchorX  anchorY
  // discontinuous change in energy
  this.getVarsList().incrSequence(5, 6);
  this.broadcastParameter(Spring2DSim.en.SPRING_LENGTH);
};

/** Returns spring stiffness
@return {number} spring stiffness
*/
getSpringStiffness() {
  return this.spring_.getStiffness();
};

/** Sets spring stiffness
@param {number} value spring stiffness
*/
setSpringStiffness(value) {
  this.spring_.setStiffness(value);
  // vars:   0   1   2   3   4   5   6    7      8        9
  //        Ux  Uy  Vx  Vy  KE  PE  TE  time  anchorX  anchorY
  // discontinuous change in energy
  this.getVarsList().incrSequence(5, 6);
  this.broadcastParameter(Spring2DSim.en.SPRING_STIFFNESS);
};

/** Return damping
@return {number} damping
*/
getDamping() {
  return this.damping_;
};

/** Set damping
@param {number} value damping
*/
setDamping(value) {
  this.damping_ = value;
  this.broadcastParameter(Spring2DSim.en.DAMPING);
};

} // end class

/** Set of internationalized strings.
@typedef {{
  ANCHOR_X: string,
  ANCHOR_Y: string,
  X_POSITION: string,
  Y_POSITION: string,
  X_VELOCITY: string,
  Y_VELOCITY: string,
  DAMPING: string,
  GRAVITY: string,
  MASS: string,
  SPRING_LENGTH: string,
  SPRING_STIFFNESS: string,
  REST_STATE: string
  }}
*/
Spring2DSim.i18n_strings;

/**
@type {Spring2DSim.i18n_strings}
*/
Spring2DSim.en = {
  ANCHOR_X: 'anchor X',
  ANCHOR_Y: 'anchor Y',
  X_POSITION: 'X position',
  Y_POSITION: 'Y position',
  X_VELOCITY: 'X velocity',
  Y_VELOCITY: 'Y velocity',
  DAMPING: 'damping',
  GRAVITY: 'gravity',
  MASS: 'mass',
  SPRING_LENGTH: 'spring length',
  SPRING_STIFFNESS: 'spring stiffness',
  REST_STATE: 'rest state'
};

/**
@private
@type {Spring2DSim.i18n_strings}
*/
Spring2DSim.de_strings = {
  ANCHOR_X: 'Anker X',
  ANCHOR_Y: 'Anker Y',
  X_POSITION: 'X Position',
  Y_POSITION: 'Y Position',
  X_VELOCITY: 'X Geschwindigkeit',
  Y_VELOCITY: 'Y Geschwindigkeit',
  DAMPING: 'Dämpfung',
  GRAVITY: 'Gravitation',
  MASS: 'Masse',
  SPRING_LENGTH: 'Federlänge',
  SPRING_STIFFNESS: 'Federsteifheit',
  REST_STATE: 'ruhe Zustand'
};

/**
@private
@type {Spring2DSim.i18n_strings}
*/
Spring2DSim.es_strings = {
  ANCHOR_X: 'Ancla X',
  ANCHOR_Y: 'Ancla Y',
  X_POSITION: 'Posición X',
  Y_POSITION: 'Posición Y',
  X_VELOCITY: 'Velocidad X',
  Y_VELOCITY: 'Velocidad Y',
  DAMPING: 'Amortiguación',
  GRAVITY: 'Gravedad',
  MASS: 'Masa',
  SPRING_LENGTH: 'Longitud del muelle',
  SPRING_STIFFNESS: 'Rigidez del muelle',
  REST_STATE: 'estado de reposo'
};

/** Set of internationalized strings.
@type {Spring2DSim.i18n_strings}
*/
Spring2DSim.i18n = Spring2DSim.en;
switch(goog.LOCALE) {
  case 'de':
    Spring2DSim.i18n = Spring2DSim.de_strings;
    break;
  case 'es':
    Spring2DSim.i18n = Spring2DSim.es_strings;
    break;
  default:
    Spring2DSim.i18n = Spring2DSim.en;
    break;
};

exports = Spring2DSim;
