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

goog.module('myphysicslab.sims.roller.LagrangeRollerSim');

const AbstractODESim = goog.require('myphysicslab.lab.model.AbstractODESim');
const EnergyInfo = goog.require('myphysicslab.lab.model.EnergyInfo');
const EnergySystem = goog.require('myphysicslab.lab.model.EnergySystem');
const EventHandler = goog.require('myphysicslab.lab.app.EventHandler');
const HumpPath = goog.require('myphysicslab.sims.roller.HumpPath');
const NumericalPath = goog.require('myphysicslab.lab.model.NumericalPath');
const ParameterNumber = goog.require('myphysicslab.lab.util.ParameterNumber');
const PathPoint = goog.require('myphysicslab.lab.model.PathPoint');
const PointMass = goog.require('myphysicslab.lab.model.PointMass');
const SimObject = goog.require('myphysicslab.lab.model.SimObject');
const Spring = goog.require('myphysicslab.lab.model.Spring');
const Util = goog.require('myphysicslab.lab.util.Util');
const VarsList = goog.require('myphysicslab.lab.model.VarsList');
const Vector = goog.require('myphysicslab.lab.util.Vector');

/** Rollercoaster simulation that uses Lagrangian method of finding equations of motion.
The shape of the roller coaster path is defined by {@link HumpPath}.

The Lagrangian method of finding the equations of motion is very different from the
methods used in the other roller coaster simulations such as
{@link myphysicslab.sims.roller.Roller1Sim}. For example, the NumericalPath is used here only
for finding the initial conditions such as the path length position corresponding to the
starting X value. Whereas in Roller1Sim the NumericalPath is used in the `evaluate()`
method to find the rates of change.

Variables and Parameters
---------------------------------

The variables stored in the VarsList are:

    vars[0] = x position of the ball
    vars[1] = v = dx/dt = x velocity of the ball
    vars[2] = s = position measured along length of track
    vars[3] = s' = ds/dt = velocity measured along length of track

The independent variables are the X position and X velocity. The position along the
track `s` and velocity along the track `s'` are derived from the X position and X
velocity of the ball.

Parameters are:

    g = gravity
    m = mass

Equation of Motion
---------------------------------

The equation of the {@link HumpPath} is

    y = 3 - (7/6) x^2 + (1/6) x^4

The equations of motion are derived from the HumpPath as shown in the file
[RollerCoaster Lagrangian](RollerCoaster_Lagrangian.pdf).
They turn out to be:

    x' = v

         -(x * (-7 + 2*x^2) * (3*g + (-7 + 6*x^2) * v^2))
    v' = ------------------------------------------------
                (9 + 49*x^2 - 28*x^4 + 4*x^6)

Track Position and Velocity
---------------------------------

The track position `s` and velocity `s' = ds/dt` are derived from the X position and X
velocity of the ball.

    s = position along length of track
    ds/dt = (ds/dx) (dx/dt)
    s = integral (ds/dt) dt
    s = integral (ds/dx) (dx/dt) dt

A fundamental result of calculus relates the path length and slope of the path (this is
only valid for curves where the slope is finite everywhere):

    ds/dx = sqrt(1 + (dy/dx)^2)

From the definition of the HumpPath we can easily find the slope `dy/dx` as a function
of `x`:

    dy/dx = -(7/3) x + (2/3) x^3

Putting these together we get the track velocity as a function of `x` and `v`:

    ds/dt = sqrt(1 + (-(7/3) x + (2/3) x^3)^2) v

The track position `s` is then found by integrating `ds/dt` over time.

Y Velocity
---------------------------------

The vertical velocity of the ball, `y' = dy/dt`, can be found as a function of the
independent variables `x` and `v` as follows:

    dy/dt = (dy/dx) (dx/dt)
    dy/dt = (-(7/3) x + (2/3) x^3) v

Note that this should agree with:

    s' = ds/dt = (+/-)sqrt((dx/dt)^2 + (dy/dt)^2)

* @implements {EnergySystem}
* @implements {EventHandler}
*/
class LagrangeRollerSim extends AbstractODESim {
/**
* @param {boolean=} hasSpring whether the simulation should have a spring attaching
*     the ball to a fixed point.
* @param {string=} opt_name name of this as a Subject
*/
constructor(hasSpring, opt_name) {
  super(opt_name);
  // 0  1   2   3   4  5   6   7     8  9
  // x, x', s, s', ke, pe, te, time, y, y'
  const var_names = [
    LagrangeRollerSim.en.X_POSITION,
    LagrangeRollerSim.en.X_VELOCITY,
    LagrangeRollerSim.en.POSITION,
    LagrangeRollerSim.en.VELOCITY,
    EnergySystem.en.KINETIC_ENERGY,
    EnergySystem.en.POTENTIAL_ENERGY,
    EnergySystem.en.TOTAL_ENERGY,
    VarsList.en.TIME,
    LagrangeRollerSim.en.Y_POSITION,
    LagrangeRollerSim.en.Y_VELOCITY
  ];
  const i18n_names = [
    LagrangeRollerSim.i18n.X_POSITION,
    LagrangeRollerSim.i18n.X_VELOCITY,
    LagrangeRollerSim.i18n.POSITION,
    LagrangeRollerSim.i18n.VELOCITY,
    EnergySystem.i18n.KINETIC_ENERGY,
    EnergySystem.i18n.POTENTIAL_ENERGY,
    EnergySystem.i18n.TOTAL_ENERGY,
    VarsList.i18n.TIME,
    LagrangeRollerSim.i18n.Y_POSITION,
    LagrangeRollerSim.i18n.Y_VELOCITY
  ];
  this.setVarsList(new VarsList(var_names, i18n_names,
      this.getName()+'_VARS'));
  this.getVarsList().setComputed(2, 3, 4, 5, 6, 8, 9);
  /**
  * @type {number}
  * @private
  */
  this.gravity_ = 2;
  /**
  * @type {!PointMass}
  * @private
  */
  this.ball1_ = PointMass.makeCircle(0.3, 'ball1').setMass(0.5);
  this.getSimList().add(this.ball1_);
  /**
  * @type {!NumericalPath }
  * @private
  */
  this.path_ = new NumericalPath(new HumpPath());
  /** lowest possible y coordinate of path
  * @type {number}
  * @private
  */
  this.lowestPoint_ = this.path_.getBoundsWorld().getBottom();
  /** potential energy offset
  * @type {number}
  * @private
  */
  this.potentialOffset_ = 0;
  /**
  * @type {?SimObject}
  * @private
  */
  this.dragObj_ = null;
  const va = this.getVarsList();
  const vars = va.getValues();
  vars[0] = 3;
  vars[1] = 0;
  vars[2] = this.path_.map_x_to_p(vars[0]);
  va.setValues(vars);
  this.modifyObjects();
  this.saveInitialState();
  this.addParameter(new ParameterNumber(this, LagrangeRollerSim.en.GRAVITY,
      LagrangeRollerSim.i18n.GRAVITY,
      () => this.getGravity(), a => this.setGravity(a)));
  this.addParameter(new ParameterNumber(this, LagrangeRollerSim.en.MASS,
      LagrangeRollerSim.i18n.MASS,
      () => this.getMass(), a => this.setMass(a)));
  this.addParameter(new ParameterNumber(this, EnergySystem.en.PE_OFFSET,
      EnergySystem.i18n.PE_OFFSET,
      () => this.getPEOffset(), a => this.setPEOffset(a))
      .setLowerLimit(Util.NEGATIVE_INFINITY)
      .setSignifDigits(5));
};

/** @override */
toString() {
  return Util.ADVANCED ? '' : this.toStringShort().slice(0, -1)
      +', ball1_: '+this.ball1_
      +', path_: '+this.path_
      +', gravity_: '+Util.NF(this.gravity_)
      +', lowestPoint_: '+Util.NF(this.lowestPoint_)
      +', potentialOffset_: '+Util.NF(this.potentialOffset_)
      + super.toString();
};

/** @override */
getClassName() {
  return 'LagrangeRollerSim';
};

/** Returns the NumericalPath that the ball follows
* @return {!NumericalPath}
*/
getPath() {
  return this.path_;
};

/** @override */
modifyObjects() {
  // 0  1   2   3   4  5   6   7     8  9
  // x, x', s, s', ke, pe, te, time, y, y'
  const va = this.getVarsList();
  // get variables, but get NaN for the many variables computed in modifyObjects()
  const vars = va.getValues(/*computed=*/false);
  this.moveObjects(vars);
  const x = vars[0];
  vars[2] = this.path_.map_x_to_p(x);
  // update track velocity
  // ds/dt = sqrt(1 + (-(7/3) x + (2/3) x^3)^2) v
  const d = -(7/3)*x + (2/3)*x*x*x;
  vars[3] = Math.sqrt(1 + d*d)*vars[1];
  const ei = this.getEnergyInfo_(vars);
  vars[4] = ei.getTranslational();
  vars[5] = ei.getPotential();
  vars[6] = ei.getTotalEnergy();
  vars[8] = this.ball1_.getPosition().getY();
  vars[9] = this.ball1_.getVelocity().getY();
  this.getVarsList().setValues(vars, /*continuous=*/true);
};

/**
* @param {!Array<number>} vars
* @private
*/
moveObjects(vars) {
  // 0  1   2   3   4  5   6   7     8  9
  // x, x', s, s', ke, pe, te, time, y, y'
  const x = vars[0];
  const x2 = x*x;
  const x3 = x2*x;
  const x4 = x3*x;
  //  From equation of HumpPath:   y = 3 - (7/6) x^2 + (1/6) x^4
  const y = 3 - (7/6)*x2 + (1/6)*x4;
  this.ball1_.setPosition(new Vector(x,  y));
  //  dy/dt = dy/dx * dx/dt = (-(7/3) x + (2/3) x^3) * dx/dt
  const yp = (-(7/3)*x + (2/3)*x3) * vars[1];
  this.ball1_.setVelocity(new Vector(vars[1], yp));
};

/** @override */
getEnergyInfo() {
  // get variables including the many variables computed in modifyObjects()
  const vars = this.getVarsList().getValues(/*computed=*/true);
  return this.getEnergyInfo_(vars);
};

/**
* @param {!Array<number>} vars
* @return {!EnergyInfo}
* @private
*/
getEnergyInfo_(vars) {
  // 0  1   2   3   4  5   6   7     8  9
  // x, x', s, s', ke, pe, te, time, y, y'
  // kinetic energy is 1/2 m v^2
  const ke = 0.5 * this.ball1_.getMass() * vars[3] * vars[3];
  const ke2 = this.ball1_.getKineticEnergy();
  if (Util.veryDifferent(ke, ke2)) {
    throw 'kinetic energy calcs differ '+ke+' vs '+ke2;
  }
  // gravity potential = m g y
  const pe = this.ball1_.getMass() * this.gravity_ *
      (this.ball1_.getPosition().getY() - this.lowestPoint_);
  return new EnergyInfo(pe + this.potentialOffset_, ke);
};

/** @override */
getPEOffset() {
  return this.potentialOffset_;
}

/** @override */
setPEOffset(value) {
  this.potentialOffset_ = value;
    // 0  1   2   3   4  5   6   7     8  9
    // x, x', s, s', ke, pe, te, time, y, y'
  // discontinuous change in energy
  this.getVarsList().incrSequence(5, 6);
  this.broadcastParameter(EnergySystem.en.PE_OFFSET);
};

/** @override */
startDrag(simObject, location, offset, dragBody, mouseEvent) {
  if (simObject == this.ball1_) {
    this.dragObj_ = simObject;
    return true;
  }
  return false;
};

/** @override */
mouseDrag(simObject, location, offset, mouseEvent) {
  const p = location.subtract(offset);
  if (simObject == this.ball1_)  {
    /** @type {!PathPoint} */
    const pathPoint = this.path_.findNearestGlobal(p);
    // 0  1   2   3   4  5   6   7     8  9
    // x, x', s, s', ke, pe, te, time, y, y'
    const va = this.getVarsList();
    const vars = va.getValues();
    vars[0] = pathPoint.x;
    vars[1] = 0;
    vars[2] = pathPoint.p;
    va.setValues(vars);
    this.moveObjects(vars);
  }
};

/** @override */
finishDrag(simObject, location, offset) {
  this.dragObj_ = null;
};

/** @override */
handleKeyEvent(keyCode, pressed, keyEvent) {
};

/** @override */
evaluate(vars, change, timeStep) {
  // 0  1   2   3   4  5   6   7     8  9
  // x, x', s, s', ke, pe, te, time, y, y'
  Util.zeroArray(change);
  change[7] = 1; // time changes at a rate of 1 by definition.
  if (this.dragObj_ != this.ball1_) {
    const x = vars[0];
    const x2 = x*x;
    const v = vars[1];
    change[0] = v;  // x' = v
    //      -(x * (-7 + 2*x^2) * (3*g + (-7 + 6*x^2) * v^2))
    // v' = ------------------------------------------------
    //             (9 + 49*x^2 - 28*x^4 + 4*x^6)
    const r = -(x * (-7 + 2*x2) * (3*this.gravity_ + (-7 + 6*x2)* v*v));
    change[1] = r/(9 + 49*x2 - 28*x2*x2 + 4*x2*x2*x2);
    // integrate position = s
    // ds/dt = (ds/dx) (dx/dt)
    // s = integral (ds/dt) dt = integral (ds/dx) (dx/dt) dt
    // ds/dx = sqrt(1 + (dy/dx)^2)
    // ds/dt = sqrt(1 + (-(7/3) x + (2/3) x^3)^2) v
    //const d = -(7/3)*x + (2/3)*x2*x;
    //change[2] = Math.sqrt(1 + d*d) * v;
    // This wasn't working in Dec 2020. Try to do it via pathPoint instead,
    // inside of modifyObjects().
  }
  return null;
};

/**
@return {number}
*/
getGravity() {
  return this.gravity_;
};

/**
@param {number} value
*/
setGravity(value) {
  this.gravity_ = value;
  // 0  1   2   3   4  5   6   7     8  9
  // x, x', s, s', ke, pe, te, time, y, y'
  // discontinuous change in energy
  this.getVarsList().incrSequence(5, 6);
  this.broadcastParameter(LagrangeRollerSim.en.GRAVITY);
};

/**
@return {number}
*/
getMass() {
  return this.ball1_.getMass();
}

/**
@param {number} value
*/
setMass(value) {
  this.ball1_.setMass(value);
  // 0  1   2   3   4  5   6   7     8  9
  // x, x', s, s', ke, pe, te, time, y, y'
  // discontinuous change in energy
  this.getVarsList().incrSequence(4, 5, 6);
  this.broadcastParameter(LagrangeRollerSim.en.MASS);
}

} // end class

/** Set of internationalized strings.
@typedef {{
  GRAVITY: string,
  MASS: string,
  POSITION: string,
  VELOCITY: string,
  X_POSITION: string,
  Y_POSITION: string,
  X_VELOCITY: string,
  Y_VELOCITY: string
  }}
*/
LagrangeRollerSim.i18n_strings;

/**
@type {LagrangeRollerSim.i18n_strings}
*/
LagrangeRollerSim.en = {
  GRAVITY: 'gravity',
  MASS: 'mass',
  POSITION: 'position',
  VELOCITY: 'velocity',
  X_POSITION: 'X position',
  Y_POSITION: 'Y position',
  X_VELOCITY: 'X velocity',
  Y_VELOCITY: 'Y velocity'
};

/**
@private
@type {LagrangeRollerSim.i18n_strings}
*/
LagrangeRollerSim.de_strings = {
  GRAVITY: 'Gravitation',
  MASS: 'Masse',
  POSITION: 'Position',
  VELOCITY: 'Geschwindigkeit',
  X_POSITION: 'X Position',
  Y_POSITION: 'Y Position',
  X_VELOCITY: 'X Geschwindigkeit',
  Y_VELOCITY: 'Y Geschwindigkeit'
};

/**
@private
@type {LagrangeRollerSim.i18n_strings}
*/
LagrangeRollerSim.es_strings = {
  GRAVITY: 'Gravedad',
  MASS: 'Masa',
  POSITION: 'Posición',
  VELOCITY: 'Valocidad',
  X_POSITION: 'Posición X',
  Y_POSITION: 'Posición Y',
  X_VELOCITY: 'Velocidad X',
  Y_VELOCITY: 'Velocidad Y'
};

/**
@private
@type {LagrangeRollerSim.i18n_strings}
*/
LagrangeRollerSim.ca_strings = {
  GRAVITY: 'Gravetat',
  MASS: 'Massa',
  POSITION: 'Posició',
  VELOCITY: 'Valocitat',
  X_POSITION: 'Posició X',
  Y_POSITION: 'Posició Y',
  X_VELOCITY: 'Velocitat X',
  Y_VELOCITY: 'Velocitat Y'
};

/** Set of internationalized strings.
@type {LagrangeRollerSim.i18n_strings}
*/
LagrangeRollerSim.i18n = LagrangeRollerSim.en;
switch(goog.LOCALE) {
  case 'de':
    LagrangeRollerSim.i18n = LagrangeRollerSim.de_strings;
    break;
  case 'es':
    LagrangeRollerSim.i18n = LagrangeRollerSim.es_strings;
    break;
  case 'ca':
    LagrangeRollerSim.i18n = LagrangeRollerSim.ca_strings;
    break;
  default:
    LagrangeRollerSim.i18n = LagrangeRollerSim.en;
    break;
};

exports = LagrangeRollerSim;
