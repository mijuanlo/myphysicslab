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

goog.module('myphysicslab.sims.pendulum.ReactionPendulumSim');

const asserts = goog.require('goog.asserts');

const AbstractODESim = goog.require('myphysicslab.lab.model.AbstractODESim');
const ConcreteLine = goog.require('myphysicslab.lab.model.ConcreteLine');
const EnergyInfo = goog.require('myphysicslab.lab.model.EnergyInfo');
const EnergySystem = goog.require('myphysicslab.lab.model.EnergySystem');
const GenericEvent = goog.require('myphysicslab.lab.util.GenericEvent');
const ParameterNumber = goog.require('myphysicslab.lab.util.ParameterNumber');
const PointMass = goog.require('myphysicslab.lab.model.PointMass');
const Polygon = goog.require('myphysicslab.lab.engine2D.Polygon');
const RigidBody = goog.require('myphysicslab.lab.engine2D.RigidBody');
const Shapes = goog.require('myphysicslab.lab.engine2D.Shapes');
const SimList = goog.require('myphysicslab.lab.model.SimList');
const UtilEngine = goog.require('myphysicslab.lab.engine2D.UtilEngine');
const Util = goog.require('myphysicslab.lab.util.Util');
const VarsList = goog.require('myphysicslab.lab.model.VarsList');
const Vector = goog.require('myphysicslab.lab.util.Vector');

/** Single pendulum done with reaction forces instead of the analytic equations of
motion as in {@link myphysicslab.sims.pendulum.PendulumSim}. This is similar to how the
rigid body physics engine in {@link myphysicslab.lab.engine2D.ContactSim} calculates
forces, but this is specific to only this particular single pendulum scenario.

The pendulum is regarded as a _rigid body_ consisting of a uniform disk at end of a
massless rigid arm. We find the reaction forces by solving a matrix equation, following
the steps shown at <http://www.myphysicslab.com/contact.html>.

Variables
--------------------------
The pivot is fixed at the origin.

+ `(x,y)` = center of disk
+ `w` = angle of pendulum

Note that `w` is the angle of the pendulum in relation to the pivot point, which happens
to also correspond to the angle of the disk rigid body (perhaps adding a constant).

@todo  make dragable for setting start angle?

* @implements {EnergySystem}
*/
class ReactionPendulumSim extends AbstractODESim {
/**
* @param {number} length length of pendulum rod
* @param {number} radius radius of rigid body pendulum disk
* @param {number} startAngle starting angle for the pendulum; in radians; zero is
*     straight down; counter-clockwise is positive
* @param {string=} opt_name name of this as a Subject
* @param {!SimList=} opt_simList SimList to use (optional)
*/
constructor(length, radius, startAngle,
      opt_name, opt_simList) {
  super(opt_name, opt_simList);
  // 0  1   2  3     4      5       6    7   8   9
  // x, x', y, y', angle, angle', time, ke, pe, te
  const var_names = [
    ReactionPendulumSim.en.X_POSITION,
    ReactionPendulumSim.en.X_VELOCITY,
    ReactionPendulumSim.en.Y_POSITION,
    ReactionPendulumSim.en.Y_VELOCITY,
    ReactionPendulumSim.en.ANGLE,
    ReactionPendulumSim.en.ANGULAR_VELOCITY,
    VarsList.en.TIME,
    EnergySystem.en.KINETIC_ENERGY,
    EnergySystem.en.POTENTIAL_ENERGY,
    EnergySystem.en.TOTAL_ENERGY
  ];
  const i18n_names = [
    ReactionPendulumSim.i18n.X_POSITION,
    ReactionPendulumSim.i18n.X_VELOCITY,
    ReactionPendulumSim.i18n.Y_POSITION,
    ReactionPendulumSim.i18n.Y_VELOCITY,
    ReactionPendulumSim.i18n.ANGLE,
    ReactionPendulumSim.i18n.ANGULAR_VELOCITY,
    VarsList.i18n.TIME,
    EnergySystem.i18n.KINETIC_ENERGY,
    EnergySystem.i18n.POTENTIAL_ENERGY,
    EnergySystem.i18n.TOTAL_ENERGY
  ];
  this.setVarsList(new VarsList(var_names, i18n_names,
      this.getName()+'_VARS'));
  this.getVarsList().setComputed(7, 8, 9);
  /** radius of rigid body pendulum disk
  * @type {number}
  * @private
  */
  this.radius_ = radius;
  /**
  * @type {number}
  * @private
  */
  this.length_ = length;
  /**
  * @type {number}
  * @private
  */
  this.mass_ = 1;
  /**
  * @type {number}
  * @private
  */
  this.gravity_ = 1;
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
  * @type {!ConcreteLine}
  * @private
  */
  this.rod_ = new ConcreteLine('rod');
  this.getSimList().add(this.rod_);
  /**
  * @type {!RigidBody}
  * @private
  */
  this.bob_;
  this.config(length, radius, startAngle);
  this.addParameter(new ParameterNumber(this, ReactionPendulumSim.en.DAMPING,
      ReactionPendulumSim.i18n.DAMPING,
      () => this.getDamping(), a => this.setDamping(a)));
  this.addParameter(new ParameterNumber(this, ReactionPendulumSim.en.MASS,
      ReactionPendulumSim.i18n.MASS,
      () => this.getMass(), a => this.setMass(a)));
  this.addParameter(new ParameterNumber(this, ReactionPendulumSim.en.GRAVITY,
      ReactionPendulumSim.i18n.GRAVITY,
      () => this.getGravity(), a => this.setGravity(a)));
  this.addParameter(new ParameterNumber(this, EnergySystem.en.PE_OFFSET,
      EnergySystem.i18n.PE_OFFSET,
      () => this.getPEOffset(), a => this.setPEOffset(a))
      .setLowerLimit(Util.NEGATIVE_INFINITY)
      .setSignifDigits(5));
};

/** @override */
toString() {
  return Util.ADVANCED ? '' : this.toStringShort().slice(0, -1)
      +', gravity_: '+Util.NF(this.gravity_)
      +', damping_: '+Util.NF(this.damping_)
      +', length_: '+Util.NF(this.length_)
      +', rod_: '+this.rod_
      +', bob_: '+this.bob_
      +', potentialOffset_: '+Util.NF(this.potentialOffset_)
      + super.toString();
};

/** @override */
getClassName() {
  return 'ReactionPendulumSim';
};

/**
* @param {number} length
* @param {number} radius
* @param {number} startAngle
*/
config(length, radius, startAngle) {
  // 0  1   2  3     4      5       6    7   8   9
  // x, x', y, y', angle, angle', time, ke, pe, te
  this.length_ = length;
  this.radius_ = radius;
  const va = this.getVarsList();
  const vars = va.getValues();
  vars[4] = startAngle;
  vars[0] = length * Math.sin(vars[4]);
  vars[2] = -length * Math.cos(vars[4]);
  vars[1] = vars[3] = vars[5] = 0;
  vars[6] = 0; // time
  va.setValues(vars);
  if (this.bob_ != null) {
    this.getSimList().remove(this.bob_);
  }
  this.bob_ = Shapes.makeBall(radius);
  this.bob_.setMass(this.mass_);
  this.getSimList().add(this.bob_);
  this.saveInitialState();
};

/** @override */
getEnergyInfo() {
  const vars = this.getVarsList().getValues();
  // 0  1   2  3     4      5       6    7   8   9
  // x, x', y, y', angle, angle', time, ke, pe, te
  const ke = 0.5* this.mass_ *(vars[1]*vars[1] + vars[3]*vars[3]);
  asserts.assert(!Util.veryDifferent(ke, this.bob_.translationalEnergy()));
  // rotational inertia I = m r^2 / 2
  const I = this.mass_ * this.radius_ * this.radius_ / 2;
  asserts.assert(!Util.veryDifferent(I, this.bob_.momentAboutCM()));
  const re = 0.5 * I * vars[5] * vars[5];
  asserts.assert(!Util.veryDifferent(re, this.bob_.rotationalEnergy()));
  const pe = this.gravity_ * this.mass_ * (vars[2] + this.length_);
  return new EnergyInfo(pe + this.potentialOffset_, ke, re);
};

/** @override */
getPEOffset() {
  return this.potentialOffset_;
}

/** @override */
setPEOffset(value) {
  this.potentialOffset_ = value;
  // 0  1   2  3     4      5       6    7   8   9
  // x, x', y, y', angle, angle', time, ke, pe, te
  // discontinuous change in energy
  this.getVarsList().incrSequence(8, 9);
  this.broadcastParameter(EnergySystem.en.PE_OFFSET);
};

/** @override */
modifyObjects() {
  const va = this.getVarsList();
  const vars = va.getValues();
  this.moveObjects(vars);
  // 0  1   2  3     4      5       6    7   8   9
  // x, x', y, y', angle, angle', time, ke, pe, te
  const ei = this.getEnergyInfo();
  va.setValue(7, ei.getTranslational(), true);
  va.setValue(8, ei.getPotential(), true);
  va.setValue(9, ei.getTotalEnergy(), true);
};

/**
@param {!Array<number>} vars
@private
*/
moveObjects(vars) {
  // 0  1   2  3     4      5       6    7   8   9
  // x, x', y, y', angle, angle', time, ke, pe, te
  this.bob_.setPosition(new Vector(vars[0],  vars[2]),  vars[4]);
  this.bob_.setVelocity(new Vector(vars[1],  vars[3]),  vars[5]);
  this.rod_.setStartPoint(Vector.ORIGIN);
  this.rod_.setEndPoint(this.bob_.getPosition());
};

/** @override */
evaluate(vars, change, timeStep) {
  // 0  1   2  3     4      5       6    7   8   9
  // x, x', y, y', angle, angle', time, ke, pe, te
  Util.zeroArray(change);
  change[6] = 1; // time
  const m = this.mass_;
  change[0] = vars[1]; // x' = vx
  change[1] = -this.damping_*vars[1];  // vx' = -b vx
  change[2] = vars[3];  // y' = vy
  change[3] = - this.gravity_ - this.damping_*vars[3];    // vy' = -g - b vy
  change[4] = vars[5]; // th' = w
  change[5] = 0;  // w' = 0

  // figure out and apply contact force
  const len = this.length_;
  // parallel axis theorem: I = Icm + m R^2
  // rotational inertia of disk radius r about center = m r^2 /2
  const I = m*(this.radius_ * this.radius_/2.0);
  // We regard there being two contact points at the pivot.
  // Contact 0 is with a horizontal surface, contact 1 is with a vertical surface.
  // two normal vectors, n0 and n1
  // n1 points downwards. n2 points rightward.
  const n0x = 0;
  const n0y = -1;
  const n1x = -1;
  const n1y = 0;
  const rx = -len*Math.sin(vars[4]);
  const ry = len*Math.cos(vars[4]);
  const vx = vars[1];
  const vy = vars[3];
  const w = vars[5];
  // A matrix:  Aij = effect of fj on acceleration at contact i
  // last column of Aij is where -B goes
  const A = [ new Float64Array(3), new Float64Array(3) ];
  const B = [ 0, 0 ];
  const f = [ 0, 0 ];
  let nx, ny, nix, niy, b;
  nx = n0x;
  ny = n0y;
  // regard the point on the stick as p1, and the point on wall as p2
  // eqn (10) gives 2 (w x ni) . (v + w x r)
  // = 2* w (-niy, nix, 0) . (vx -w ry, vy + w rx, 0)
  // = 2* w (-niy(vx - w ry) + nix(vy + w rx))
  //b = 2*w*(-ny*(vx - w*ry) + nx*(vy + w*rx));
  // W' = (0, 0, w'), so W' x r = (-w' ry, w' rx, 0)
  // w x (w x r) = w x (-w ry, w rx, 0) = w^2 (-rx, -ry, 0)
  // eqn (11) gives n . (v' + W' x r + w x (w x r))
  // = n . (vx' -w' ry - w^2 rx, vy' + w' rx - w^2 ry, 0)
  // = nx*(vx' -w' ry - w^2 rx) +ny*(vy' + w' rx - w^2 ry)
  b = nx*(change[1] -change[5]*ry - w*w*rx) + ny*(change[3] + change[5]*rx - w*w*ry);
  B[0] = b;

  // same formulas, but now for contact 1
  nx = n1x;
  ny = n1y;
  //b = 2*w*(-ny*(vx - w*ry) + nx*(vy + w*rx));
  b = nx*(change[1] -change[5]*ry - w*w*rx) + ny*(change[3] + change[5]*rx - w*w*ry);
  B[1] = b;

  // notation:  here nj = {nx, ny, 0}  and ni = {nix, nyx, 0}
  // I = m (width^2 + height^2)/ 12
  // eqn (9)  a = ni . (nj/ m + (r x nj) x r /I)
  // (r x n) x r =[0, 0, rx ny - ry nx] x r =[-ry(rx ny - ry nx), rx(rx ny - ry nx), 0]
  // a = ni . [nx/m -ry(rx ny - ry nx)/I, ny/m + rx(rx ny - ry nx)/I, 0]
  nx = n0x; ny = n0y;  nix = n0x; niy = n0y;
  A[0][0] = nix*(nx/m -ry*(rx*ny - ry*nx)/I) + niy*(ny/m + rx*(rx*ny - ry*nx)/I);
  nx = n1x; ny = n1y;  nix = n0x; niy = n0y;
  A[0][1] = nix*(nx/m -ry*(rx*ny - ry*nx)/I) + niy*(ny/m + rx*(rx*ny - ry*nx)/I);
  nx = n0x; ny = n0y;  nix = n1x; niy = n1y;
  A[1][0] = nix*(nx/m -ry*(rx*ny - ry*nx)/I) + niy*(ny/m + rx*(rx*ny - ry*nx)/I);
  nx = n1x; ny = n1y;  nix = n1x; niy = n1y;
  A[1][1] = nix*(nx/m -ry*(rx*ny - ry*nx)/I) + niy*(ny/m + rx*(rx*ny - ry*nx)/I);

  // d'' = 0 = A f + B
  // A f = -B
  B[0] = -B[0];
  B[1] = -B[1];
  const err = UtilEngine.matrixSolve4(A, f, B);
  if (err != -1) {
    throw err;
  }
  // now apply the force f n to the pivot end.
  nx = n0x; ny = n0y;
  // x and y change according to f nx and f ny
  // acceleration = force/mass
  let Fx, Fy;
  Fx = f[0]*nx;
  Fy = f[0]*ny;
  change[1] += f[0]*nx/m;
  change[3] += f[0]*ny/m;
  // w' = (r x f n) /I  = {0, 0, rx f ny - ry f nx} /I
  // not sure why, but needs a sign change here!
  change[5] += (rx*f[0]*ny - ry*f[0]*nx)/I;

  nx = n1x; ny = n1y;
  Fx += f[1]*nx;
  Fy += f[1]*ny;
  change[1] += f[1]*nx/m;
  change[3] += f[1]*ny/m;
  change[5] += (rx*f[1]*ny - ry*f[1]*nx)/I;
  this.showForce(Fx, 0);
  this.showForce(0, Fy);
  //this.showForce(Fx, Fy);
  return null;
};

/**
* @param {number} fx
* @param {number} fy
* @private
*/
showForce(fx, fy) {
  const v = new ConcreteLine('contact_force', Vector.ORIGIN, new Vector(fx, fy));
  v.setExpireTime(this.getTime());
  this.getSimList().add(v);
};

/** Return mass of pendulum bob.
@return {number} mass of pendulum bob
*/
getMass() {
  return this.mass_;
};

/** Set mass of pendulum bob
@param {number} value mass of pendulum bob
*/
setMass(value) {
  if (this.mass_ != value) {
    this.mass_ = value;
    this.bob_.setMass(value);
    // 0  1   2  3     4      5       6    7   8   9
    // x, x', y, y', angle, angle', time, ke, pe, te
    // discontinuous change in energy
    this.getVarsList().incrSequence(7, 8, 9);
    this.broadcastParameter(ReactionPendulumSim.en.MASS);
  }
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
  // 0  1   2  3     4      5       6    7   8   9
  // x, x', y, y', angle, angle', time, ke, pe, te
  // discontinuous change in energy
  this.getVarsList().incrSequence(8, 9);
  this.broadcastParameter(ReactionPendulumSim.en.GRAVITY);
};

/** Return damping factor
@return {number} damping factor
*/
getDamping() {
  return this.damping_;
};

/** Set damping factor
@param {number} value damping factor
*/
setDamping(value) {
  this.damping_ = value;
  this.broadcastParameter(ReactionPendulumSim.en.DAMPING);
};

} // end class

/** Set of internationalized strings.
@typedef {{
  X_POSITION: string,
  Y_POSITION: string,
  X_VELOCITY: string,
  Y_VELOCITY: string,
  ANGLE: string,
  ANGULAR_VELOCITY: string,
  START_ANGLE: string,
  DAMPING: string,
  GRAVITY: string,
  LENGTH: string,
  MASS: string,
  TIME: string,
  RADIUS: string
  }}
*/
ReactionPendulumSim.i18n_strings;

/**
@type {ReactionPendulumSim.i18n_strings}
*/
ReactionPendulumSim.en = {
  X_POSITION: 'X position',
  Y_POSITION: 'Y position',
  X_VELOCITY: 'X velocity',
  Y_VELOCITY: 'Y velocity',
  ANGLE: 'angle',
  ANGULAR_VELOCITY: 'angle velocity',
  START_ANGLE: 'start angle',
  DAMPING: 'damping',
  GRAVITY: 'gravity',
  LENGTH: 'length',
  MASS: 'mass',
  TIME: 'time',
  RADIUS: 'radius'
};

/**
@private
@type {ReactionPendulumSim.i18n_strings}
*/
ReactionPendulumSim.de_strings = {
  X_POSITION: 'X Position',
  Y_POSITION: 'Y Position',
  X_VELOCITY: 'X Geschwindigkeit',
  Y_VELOCITY: 'Y Geschwindigkeit',
  ANGLE: 'Winkel',
  ANGULAR_VELOCITY: 'Winkelgeschwindigkeit',
  START_ANGLE: 'anfangs Winkel',
  DAMPING: 'Dämpfung',
  GRAVITY: 'Gravitation',
  LENGTH: 'Länge',
  MASS: 'Masse',
  TIME: 'Zeit',
  RADIUS: 'Radius'
};

/**
@private
@type {ReactionPendulumSim.i18n_strings}
*/
ReactionPendulumSim.es_strings = {
  X_POSITION: 'Posición X',
  Y_POSITION: 'Posición Y',
  X_VELOCITY: 'Velocidad X',
  Y_VELOCITY: 'Velocidad Y',
  ANGLE: 'Ángulo',
  ANGULAR_VELOCITY: 'Velocidad angular',
  START_ANGLE: 'ángulo de inicio',
  DAMPING: 'Amortiguación',
  GRAVITY: 'Gravedad',
  LENGTH: 'Longitud',
  MASS: 'Masa',
  TIME: 'Tiempo',
  RADIUS: 'Radio'
};

/** Set of internationalized strings.
@type {ReactionPendulumSim.i18n_strings}
*/
ReactionPendulumSim.i18n = ReactionPendulumSim.en;
switch(goog.LOCALE) {
  case 'de':
    ReactionPendulumSim.i18n = ReactionPendulumSim.de_strings;
    break;
  case 'es':
    ReactionPendulumSim.i18n = ReactionPendulumSim.es_strings;
    break;
  default:
    ReactionPendulumSim.i18n = ReactionPendulumSim.en;
    break;
};

exports = ReactionPendulumSim;
