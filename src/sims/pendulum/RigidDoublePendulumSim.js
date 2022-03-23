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

goog.module('myphysicslab.sims.pendulum.RigidDoublePendulumSim');

const AbstractODESim = goog.require('myphysicslab.lab.model.AbstractODESim');
const ConcreteLine = goog.require('myphysicslab.lab.model.ConcreteLine');
const CoordType = goog.require('myphysicslab.lab.model.CoordType');
const EnergyInfo = goog.require('myphysicslab.lab.model.EnergyInfo');
const EnergySystem = goog.require('myphysicslab.lab.model.EnergySystem');
const Joint = goog.require('myphysicslab.lab.engine2D.Joint');
const ParameterNumber = goog.require('myphysicslab.lab.util.ParameterNumber');
const Polygon = goog.require('myphysicslab.lab.engine2D.Polygon');
const RigidBody = goog.require('myphysicslab.lab.engine2D.RigidBody');
const Scrim = goog.require('myphysicslab.lab.engine2D.Scrim');
const Shapes = goog.require('myphysicslab.lab.engine2D.Shapes');
const SimList = goog.require('myphysicslab.lab.model.SimList');
const Util = goog.require('myphysicslab.lab.util.Util');
const VarsList = goog.require('myphysicslab.lab.model.VarsList');
const Vector = goog.require('myphysicslab.lab.util.Vector');

/** Simulation of a double pendulum as two rigid bodies. This uses RigidBodys and
Joints, but only for geometry. This does not use the general physics engine
{@link myphysicslab.lab.engine2D.ContactSim}, instead this is a specialized simulation
like {@link myphysicslab.sims.pendulum.DoublePendulum}.

For derivation of equations of motion, see the paper
[Double Pendulum as Rigid Bodies](Rigid_Double_Pendulum.pdf)
by Erik Neumann, April 2, 2011.

@todo: explain how and why the angle-1 variable is different from the angle-1 parameter.
Perhaps rename the angle-1 parameter to be omega-1 to reduce confusion. Perhaps
allow setting of the angle-1 variable directly, and then adapt accordingly.

@todo:  figure out what the real rest state is (it is not all zero angles),
which will also fix the energy calculation.

@todo:  add damping

@todo:  derive equations of motion using Lagrangian method

* @implements {EnergySystem}
*/
class RigidDoublePendulumSim extends AbstractODESim {
/**
* @param {!RigidDoublePendulumSim.Parts} parts the RigidBodys and Joints that make the
*    pendulum.
* @param {string=} opt_name name of this as a Subject
* @param {!SimList=} opt_simList
*/
constructor(parts, opt_name, opt_simList) {
  super(opt_name, opt_simList);
  // vars  0        1        2       3      4   5   6   7
  //      theta1, theta1', theta2, theta2', ke, pe, te, time
  const var_names = [
    RigidDoublePendulumSim.en.ANGLE_1,
    RigidDoublePendulumSim.en.ANGLE_1_VELOCITY,
    RigidDoublePendulumSim.en.ANGLE_2,
    RigidDoublePendulumSim.en.ANGLE_2_VELOCITY,
    EnergySystem.en.KINETIC_ENERGY,
    EnergySystem.en.POTENTIAL_ENERGY,
    EnergySystem.en.TOTAL_ENERGY,
    VarsList.en.TIME
  ];
  const i18n_names = [
    RigidDoublePendulumSim.i18n.ANGLE_1,
    RigidDoublePendulumSim.i18n.ANGLE_1_VELOCITY,
    RigidDoublePendulumSim.i18n.ANGLE_2,
    RigidDoublePendulumSim.i18n.ANGLE_2_VELOCITY,
    EnergySystem.i18n.KINETIC_ENERGY,
    EnergySystem.i18n.POTENTIAL_ENERGY,
    EnergySystem.i18n.TOTAL_ENERGY,
    VarsList.i18n.TIME
  ];
  this.setVarsList(new VarsList(var_names, i18n_names,
      this.getName()+'_VARS'));
  this.getVarsList().setComputed(4, 5, 6);
  /** upper pendulum
  * @type {!RigidBody}
  * @private
  */
  this.pendulum1_ = parts.bodies[0];
  /** lower pendulum
  * @type {!RigidBody}
  * @private
  */
  this.pendulum2_ = parts.bodies[1];
  /** upper pivot, joins scrim and pendulum1
  * @type {!Joint}
  * @private
  */
  this.pivot1_ = parts.joints[0];
  /** lower pivot, joins pendulum1 and pendulum2
  * @type {!Joint}
  * @private
  */
  this.pivot2_ = parts.joints[1];
  if (!(this.pivot1_.getBody1() instanceof Scrim)
      || this.pivot1_.getBody2() != this.pendulum1_) {
    throw '';
  }
  if (this.pivot2_.getBody1() != this.pendulum1_
      || this.pivot2_.getBody2() != this.pendulum2_) {
    throw '';
  }
  // might be able to loosen this requirement
  if (!this.pivot1_.getAttach1().equals(Vector.ORIGIN)) {
    throw '';
  }
  /** Angle of R1 with respect to vertical in body coords of pendulum 1.
  * Gamma adjustment angle is needed because vector R1 might not be vertical.
  * @type {number}
  * @private
  */
  this.gamma1_ = RigidDoublePendulumSim.getGamma(this.pendulum1_, this.pivot1_);
  /** Angle of R2 with respect to vertical in body coords of pendulum 2.
  * @type {number}
  * @private
  */
  this.gamma2_ = RigidDoublePendulumSim.getGamma(this.pendulum2_, this.pivot2_);
  /** initial angle of pendulum 1
  * @type {number}
  * @private
  */
  this.omega1_ = this.pendulum1_.getAngle();
  /** initial angle of pendulum 2
  * @type {number}
  * @private
  */
  this.omega2_ = this.pendulum2_.getAngle();
  // figure out initial conditions from angles and angular velocity of pendulums
  const theta1 = this.omega1_ + this.gamma1_;
  const theta1_velocity = this.pendulum1_.getAngularVelocity();
  const theta2 = this.omega2_ + this.gamma2_;
  const theta2_velocity = this.pendulum2_.getAngularVelocity();
  // calculate length of vectors R1, L1, R2
  const c1 = this.pendulum1_.getCenterOfMass();
  const attach1_0 = this.pivot1_.getAttach2();
  const r1 = c1.subtract(attach1_0);
  const l1 = this.pivot2_.getAttach1().subtract(attach1_0);
  const c2 = this.pendulum2_.getCenterOfMass();
  const r2 = c2.subtract(this.pivot2_.getAttach2());
  /** distance from pivot 1 to the center of mass of pendulum 1
  * @type {number}
  * @private
  */
  this.R1_ = r1.length();
  /** distance from pivot 1 to pivot 2
  * @type {number}
  * @private
  */
  this.L1_ = l1.length();
  /** distance from pivot 2 to the center of mass of pendulum 2
  * @type {number}
  * @private
  */
  this.R2_ = r2.length();
  /** angle from vector r1 to vector l1
  * @type {number}
  * @private
  */
  this.phi_ = r1.angleTo(l1);
  /** gravity
  * @type {number}
  * @private
  */
  this.gravity_ = 9.8;
  /** potential energy offset
  * @type {number}
  * @private
  */
  this.potentialOffset_ = 0;
  // find zero energy level by moving to rest state
  // (for non-centered version, this is close to rest state, but not quite there).
  const vars = this.getVarsList().getValues();
  vars[0] = 0;
  vars[1] = 0;
  vars[2] = 0;
  vars[3] = 0;
  this.getVarsList().setValues(vars);
  this.modifyObjects();
  // set potentialOffset so that PE is zero at rest state
  this.potentialOffset_ = - this.getEnergyInfo().getPotential();
  // move to initial state
  vars[0] = theta1;
  vars[1] = theta1_velocity;
  vars[2] = theta2;
  vars[3] = theta2_velocity;
  this.getVarsList().setValues(vars);
  this.saveInitialState();
  this.addParameter(new ParameterNumber(this, RigidDoublePendulumSim.en.GRAVITY,
      RigidDoublePendulumSim.i18n.GRAVITY,
      () => this.getGravity(), a => this.setGravity(a)));
  this.addParameter(new ParameterNumber(this, RigidDoublePendulumSim.en.ANGLE_1,
      RigidDoublePendulumSim.i18n.ANGLE_1,
      () => this.getAngle1(), a => this.setAngle1(a))
      .setLowerLimit(-Math.PI).setUpperLimit(Math.PI));
  this.addParameter(new ParameterNumber(this, RigidDoublePendulumSim.en.ANGLE_2,
      RigidDoublePendulumSim.i18n.ANGLE_2,
      () => this.getAngle2(), a => this.setAngle2(a))
      .setLowerLimit(-Math.PI).setUpperLimit(Math.PI));
  this.addParameter(new ParameterNumber(this, EnergySystem.en.PE_OFFSET,
      EnergySystem.i18n.PE_OFFSET,
      () => this.getPEOffset(), a => this.setPEOffset(a))
      .setLowerLimit(Util.NEGATIVE_INFINITY)
      .setSignifDigits(5));
  this.getSimList().add(this.pendulum1_, this.pendulum2_, this.pivot1_, this.pivot2_);
};

/** @override */
toString() {
  return Util.ADVANCED ? '' : this.toStringShort().slice(0, -1)
      +', gamma1_: '+Util.NF(this.gamma1_)
      +', gamma2_: '+Util.NF(this.gamma2_)
      +', pendulum1_: '+this.pendulum1_
      +', pendulum2_: '+this.pendulum2_
      +', gravity_: '+Util.NF(this.gravity_)
      +', potentialOffset_: '+Util.NF(this.potentialOffset_)
      + super.toString();
};

/** @override */
getClassName() {
  return 'RigidDoublePendulumSim';
};

/** Creates a double pendulum with offset center of mass and offset joints. The two
rectangular bodies are attached together as a double pendulum. The center of mass of the
upper pendulum is offset from its geometric center. The joint connecting the two bodies
is not along the vertical center line of either body, but is offset.
@param {number} theta1 angle at joint of scrim and pendulum1
@param {number} theta2 angle at joint of pendulum1 and pendulum2
@param {!Vector=} pivot location of fixed joint connecting to Scrim, in world coords
@return {!RigidDoublePendulumSim.Parts}
*/
static makeOffset(theta1, theta2, pivot) {
  pivot = pivot || Vector.ORIGIN;
  // body coords origin is at lower left corner with makeBlock2
  const p1 = Shapes.makeBlock2(0.3, 1.0, RigidDoublePendulumSim.en.PENDULUM+1,
      RigidDoublePendulumSim.i18n.PENDULUM+1);
  p1.setCenterOfMass(new Vector(p1.getWidth()/3.0, p1.getHeight()*0.3));
  //p1.setDragPoints([ new Vector(p1.getWidth()/2.0, p1.getHeight()*0.2) ]);
  p1.setPosition(new Vector(0,  0),  theta1);
  const p2 = Shapes.makeBlock2(0.3, 1.0, RigidDoublePendulumSim.en.PENDULUM+2,
      RigidDoublePendulumSim.i18n.PENDULUM+2);
  p2.setPosition(new Vector(0,  0),  theta2);
  //p2.setDragPoints([ new Vector(p2.getWidth()/2.0, p2.getHeight()*0.2) ]);
  const scrim = Scrim.getScrim();
  const j1 = new Joint(
      scrim, /*attach_body=*/pivot,
      p1, /*attach_body=*/new Vector(0.5*p1.getWidth(), 0.85*p1.getHeight()),
      CoordType.BODY, /*normal=*/Vector.NORTH
  );
  const j2 = new Joint(
      p1, /*attach1_body=*/new Vector(0.85*p1.getWidth(), 0.15*p1.getHeight()),
      p2, /*attach2_body=*/new Vector(0.15*p2.getWidth(), 0.85*p2.getHeight()),
      CoordType.BODY, /*normal=*/Vector.NORTH
  );
  const j1_1 = new Joint(
      scrim, /*attach_body=*/pivot,
      p1, j1.getAttach2(),
      CoordType.BODY, /*normal=*/Vector.EAST
  );
  const j2_1 = new Joint(
      p1, j2.getAttach1(),
      p2, j2.getAttach2(),
      CoordType.BODY, /*normal=*/Vector.EAST
  );
  return { bodies: [p1, p2], joints: [j1, j2, j1_1, j2_1] };
};

/** Creates a double pendulum with centered mass and joints. The two rectangular bodies
are attached together as a double pendulum. The center of mass is at geometric center of
each pendulum, and joints are along the vertical center line of each body.
@param {number} theta1 angle at joint of scrim and pendulum1
@param {number} theta2 angle at joint of pendulum1 and pendulum2
@param {!Vector=} pivot location of fixed joint connecting to Scrim, in world coords
@return {!RigidDoublePendulumSim.Parts}
*/
static makeCentered(theta1, theta2, pivot) {
  pivot = pivot || Vector.ORIGIN;
  // (body coords origin is at lower left corner with makeBlock2)
  const p1 = Shapes.makeBlock2(0.3, 1.0, RigidDoublePendulumSim.en.PENDULUM+1,
      RigidDoublePendulumSim.i18n.PENDULUM+1);
  p1.setPosition(new Vector(0,  0),  theta1);
  const p2 = Shapes.makeBlock2(0.3, 1.0, RigidDoublePendulumSim.en.PENDULUM+2,
      RigidDoublePendulumSim.i18n.PENDULUM+2);
  p2.setPosition(new Vector(0,  0),  theta2);
  const scrim = Scrim.getScrim();
  const j1 = new Joint(
      scrim, /*attach_body=*/pivot,
      p1, /*attach_body=*/new Vector(0.5*p1.getWidth(), 0.85*p1.getHeight()),
      CoordType.BODY, /*normal=*/Vector.NORTH
  );
  const j2 = new Joint(
      p1, /*attach1_body=*/new Vector(0.5*p1.getWidth(), 0.15*p1.getHeight()),
      p2, /*attach2_body=*/new Vector(0.5*p2.getWidth(), 0.85*p2.getHeight()),
      CoordType.BODY, /*normal=*/Vector.NORTH
  );
  const j1_1 = new Joint(
      scrim, /*attach_body=*/pivot,
      p1, /*attach_body=*/j1.getAttach2(),
      CoordType.BODY, /*normal=*/Vector.EAST
  );
  const j2_1 = new Joint(
      p1, j2.getAttach1(),
      p2, j2.getAttach2(),
      CoordType.BODY, /*normal=*/Vector.EAST
  );
  return { bodies: [p1, p2], joints: [j1, j2, j1_1, j2_1] };
};

/** Returns angle between vertical (in body coordinates) and the vector from joint to
center of mass of the pendulum. If the pendulum were hanging at rest from the joint
with no forces other than gravity acting, then the angle of the pendulum would be
`-gamma`.
@param {!RigidBody} pendulum the pendulum RigidBody
@param {!Joint} pivot the Joint that the pendulum is hanging from
@return {number} angle between vertical (in body coordinates) and the vector from
    joint to center of mass of the pendulum
@throws {!Error} if the pendulum is not one of the bodies of the joint
*/
static getGamma(pendulum, pivot) {
  /** @type {!Vector} */
  let attach;
  if (pivot.getBody1() == pendulum) {
    attach = pivot.getAttach1();
  } else if (pivot.getBody2() == pendulum) {
    attach = pivot.getAttach2();
  } else {
    throw '';
  }
  const v = attach.subtract(pendulum.getCenterOfMass());
  return v.getAngle() - Math.PI/2;
};

/** @override */
getEnergyInfo() {
  const p1 = this.pendulum1_;
  const p2 = this.pendulum2_;
  const ke = p1.translationalEnergy() + p2.translationalEnergy();
  const re = p1.rotationalEnergy() + p2.rotationalEnergy();
  const pe = this.gravity_ * p1.getMass() * p1.getPosition().getY()
         + this.gravity_ * p2.getMass() * p2.getPosition().getY();
  return new EnergyInfo(pe + this.potentialOffset_, ke, re);
};

/** @override */
getPEOffset() {
  return this.potentialOffset_;
}

/** @override */
setPEOffset(value) {
  this.potentialOffset_ = value;
  // vars  0        1        2       3      4   5   6   7
  //      theta1, theta1', theta2, theta2', ke, pe, te, time
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
  // vars  0        1        2       3      4   5   6   7
  //      theta1, theta1', theta2, theta2', ke, pe, te, time
  va.setValue(4, ei.getTranslational() + ei.getRotational(), true);
  va.setValue(5, ei.getPotential(), true);
  va.setValue(6, ei.getTotalEnergy(), true);
};

/**
@param {!Array<number>} vars
@private
*/
moveObjects(vars) {
  // vars  0        1        2       3      4   5   6   7
  //      theta1, theta1', theta2, theta2', ke, pe, te, time
  const sin_th1 = Math.sin(vars[0]);
  const cos_th1 = Math.cos(vars[0]);
  const sin_th2 = Math.sin(vars[2]);
  const cos_th2 = Math.cos(vars[2]);
  const sin_ph1 = Math.sin(vars[0] + this.phi_);
  const cos_ph1 = Math.cos(vars[0] + this.phi_);
  const R1 = this.R1_;
  const R2 = this.R2_;
  const L1 = this.L1_;
  this.pendulum1_.setPosition(new Vector(R1*sin_th1, -R1*cos_th1),
      vars[0] - this.gamma1_);
  this.pendulum1_.setVelocity(new Vector(vars[1]*R1*cos_th1, vars[1]*R1*sin_th1),
      vars[1]);
  this.pendulum2_.setPosition(new Vector(L1*sin_ph1 + R2*sin_th2,
      -L1*cos_ph1 - R2*cos_th2), vars[2] - this.gamma2_);
  this.pendulum2_.setVelocity(new Vector(vars[1]*L1*cos_ph1 + vars[3]*R2*cos_th2,
      vars[1]*L1*sin_ph1 + vars[3]*R2*sin_th2), vars[3]);
};

/** @override */
evaluate(vars, change, timeStep) {
  Util.zeroArray(change);
  change[7] = 1; // time
  // vars  0        1        2       3      4   5   6   7
  //      theta1, theta1', theta2, theta2', ke, pe, te, time
  const th1 = vars[0];
  const dth1 = vars[1];
  const th2 = vars[2];
  const dth2 = vars[3];
  const m1 = this.pendulum1_.getMass();
  const m2 = this.pendulum2_.getMass();
  const I1 = this.pendulum1_.momentAboutCM();
  const I2 = this.pendulum2_.momentAboutCM();
  const R1 = this.R1_;
  const R2 = this.R2_;
  const L1 = this.L1_;
  const g = this.gravity_;
  const phi = this.phi_;
  change[0] = dth1;
  change[1] = -((2*g*m1*R1*(I2 + m2*R2*R2)*Math.sin(th1) +
      L1*m2*(g*(2*I2 + m2*R2*R2)*Math.sin(th1 + phi) +
      R2*(g*m2*R2*Math.sin(th1 - 2*th2 + phi) +
      2*(dth2*dth2*(I2 + m2*R2*R2) +
      dth1*dth1*L1*m2*R2*Math.cos(th1 - th2 + phi))*Math.sin(th1 - th2 + phi))))/
      (2*I2*L1*L1*m2 + 2*I2*m1*R1*R1 + L1*L1*m2*m2*R2*R2 + 2*m1*m2*R1*R1*R2*R2 +
      2*I1*(I2 + m2*R2*R2) - L1*L1*m2*m2*R2*R2*Math.cos(2*(th1 - th2 + phi))));
  change[2] = dth2;
  change[3] =  (m2*R2*(-(g*(2*I1 + L1*L1*m2 + 2*m1*R1*R1)*Math.sin(th2)) +
      L1*(g*m1*R1*Math.sin(th2 - phi) +
      2*dth1*dth1*(I1 + L1*L1*m2 + m1*R1*R1)*Math.sin(th1 - th2 + phi) +
      dth2*dth2*L1*m2*R2*Math.sin(2*(th1 - th2 + phi)) +
      g*m1*R1*Math.sin(2*th1 - th2 + phi) +
      g*L1*m2*Math.sin(2*th1 - th2 + 2*phi))))/
      (2*I2*L1*L1*m2 + 2*I2*m1*R1*R1 + L1*L1*m2*m2*R2*R2 +
      2*m1*m2*R1*R1*R2*R2 + 2*I1*(I2 + m2*R2*R2) -
      L1*L1*m2*m2*R2*R2*Math.cos(2*(th1 - th2 + phi)));
  return null;
};

/** Returns angle of R1 with respect to vertical in body coords of pendulum 1.
@return {number} angle of R1 with respect to vertical in body coords of pendulum 1.
*/
getGamma1() {
  return this.gamma1_;
};

/** Returns angle of R2 with respect to vertical in body coords of pendulum 2.
@return {number} angle of R2 with respect to vertical in body coords of pendulum 2.
*/
getGamma2() {
  return this.gamma2_;
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
  // vars  0        1        2       3      4   5   6   7
  //      theta1, theta1', theta2, theta2', ke, pe, te, time
  // discontinuous change in energy
  this.getVarsList().incrSequence(5, 6);
  this.broadcastParameter(RigidDoublePendulumSim.en.GRAVITY);
};

/** Set the initial conditions according to the RigidBody angles omega1, omega2.
* @return {undefined}
* @private
*/
setInitialAngles() {
  this.reset();
  // figure out the new 'theta' angles
  // theta = omega + gamma, where omega is the rigid body angle.
  const va = this.getVarsList();
  const vars = va.getValues();
  vars[0] = this.omega1_ + this.gamma1_;
  vars[1] = 0;
  vars[2] = this.omega2_ + this.gamma2_;
  vars[3] = 0;
  va.setValues(vars);
  this.saveInitialState();
  this.modifyObjects();
};

/**
@return {number}
*/
getAngle1() {
  return this.omega1_;
};

/**
@param {number} value
*/
setAngle1(value) {
  this.omega1_ = value;
  this.setInitialAngles();
  this.broadcastParameter(RigidDoublePendulumSim.en.ANGLE_1);
};

/**
@return {number}
*/
getAngle2() {
  return this.omega2_;
};

/**
@param {number} value
*/
setAngle2(value) {
  this.omega2_ = value;
  this.setInitialAngles();
  this.broadcastParameter(RigidDoublePendulumSim.en.ANGLE_2);
};

} // end class

/** The parts that make up a RigidDoublePendulumSim: two RigidBodys and the four Joints
that connect them.
@typedef {{
  bodies: !Array<!Polygon>,
  joints: !Array<!Joint>
}}
*/
RigidDoublePendulumSim.Parts;

/** Set of internationalized strings.
@typedef {{
  ANGLE_1: string,
  ANGLE_1_VELOCITY: string,
  ANGLE_2: string,
  ANGLE_2_VELOCITY: string,
  GRAVITY: string,
  MASS_1: string,
  MASS_2: string,
  ROD_1_LENGTH: string,
  ROD_2_LENGTH: string,
  PENDULUM: string
  }}
*/
RigidDoublePendulumSim.i18n_strings;

/**
@type {RigidDoublePendulumSim.i18n_strings}
*/
RigidDoublePendulumSim.en = {
  ANGLE_1: 'angle-1',
  ANGLE_1_VELOCITY: 'angle-1 velocity',
  ANGLE_2: 'angle-2',
  ANGLE_2_VELOCITY: 'angle-2 velocity',
  GRAVITY: 'gravity',
  MASS_1: 'mass-1',
  MASS_2: 'mass-2',
  ROD_1_LENGTH: 'rod-1 length',
  ROD_2_LENGTH: 'rod-2 length',
  PENDULUM: 'pendulum'
};

/**
@private
@type {RigidDoublePendulumSim.i18n_strings}
*/
RigidDoublePendulumSim.de_strings = {
  ANGLE_1: 'Winkel-1',
  ANGLE_1_VELOCITY: 'Winkel-1 Geschwindigkeit',
  ANGLE_2: 'Winkel-2',
  ANGLE_2_VELOCITY: 'Winkel-2 Geschwindigkeit',
  GRAVITY: 'Gravitation',
  MASS_1: 'Masse-1',
  MASS_2: 'Masse-2',
  ROD_1_LENGTH: 'Stange-1 Länge',
  ROD_2_LENGTH: 'Stange-2 Länge',
  PENDULUM: 'Pendel'
};

/**
@private
@type {RigidDoublePendulumSim.i18n_strings}
*/
RigidDoublePendulumSim.es_strings = {
  ANGLE_1: 'Ángulo 1',
  ANGLE_1_VELOCITY: 'Velocidad ángulo 1',
  ANGLE_2: 'Ángulo 2',
  ANGLE_2_VELOCITY: 'Velocidad ángulo 2',
  GRAVITY: 'Gravedad',
  MASS_1: 'Masa 1',
  MASS_2: 'Masa 2',
  ROD_1_LENGTH: 'Longitud barra 1',
  ROD_2_LENGTH: 'Longitud barra 2',
  PENDULUM: 'Péndulo'
};

/**
@private
@type {RigidDoublePendulumSim.i18n_strings}
*/
RigidDoublePendulumSim.ca_strings = {
  ANGLE_1: 'Angle 1',
  ANGLE_1_VELOCITY: 'Velocitat angle 1',
  ANGLE_2: 'Angle 2',
  ANGLE_2_VELOCITY: 'Velocitat angle 2',
  GRAVITY: 'Gravetat',
  MASS_1: 'Massa 1',
  MASS_2: 'Massa 2',
  ROD_1_LENGTH: 'Longitud barra 1',
  ROD_2_LENGTH: 'Longitud barra 2',
  PENDULUM: 'Pèndol'
};

/** Set of internationalized strings.
@type {RigidDoublePendulumSim.i18n_strings}
*/
RigidDoublePendulumSim.i18n = RigidDoublePendulumSim.en;
switch(goog.LOCALE) {
  case 'de':
    RigidDoublePendulumSim.i18n = RigidDoublePendulumSim.de_strings;
    break;
  case 'es':
    RigidDoublePendulumSim.i18n = RigidDoublePendulumSim.es_strings;
    break;
  case 'ca':
    RigidDoublePendulumSim.i18n = RigidDoublePendulumSim.ca_strings;
    break;
  default:
    RigidDoublePendulumSim.i18n = RigidDoublePendulumSim.en;
    break;
};

exports = RigidDoublePendulumSim;
