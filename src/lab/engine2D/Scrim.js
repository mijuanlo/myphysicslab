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

goog.module('myphysicslab.lab.engine2D.Scrim');

const AffineTransform = goog.require('myphysicslab.lab.util.AffineTransform');
const DoubleRect = goog.require('myphysicslab.lab.util.DoubleRect');
const RigidBody = goog.require('myphysicslab.lab.engine2D.RigidBody');
const Util = goog.require('myphysicslab.lab.util.Util');
const Vector = goog.require('myphysicslab.lab.util.Vector');

/** The fixed background to which objects can be attached with Springs, Joints or Ropes;
it is an immutable singleton object. Access the singleton Scrim object via
{@link #getScrim}.

As a RigidBody, Scrim has infinite mass, infinite extent, and never moves. Its
body coordinatess are the same as world coordinatess.

Scrim does not collide with anything, so it is excluded from the collision and contact
detection phases of the physics engine. It can however appear in a
{@link myphysicslab.lab.engine2D.ConnectorCollision} which are generated by
{@link myphysicslab.lab.engine2D.Joint} or {@link myphysicslab.lab.engine2D.Rope}.

Scrim is never on the list of bodies in {@link myphysicslab.lab.engine2D.RigidBodySim},
only Polygons are on that list.

* @implements {RigidBody}
*/
class Scrim {
/**
* @private
*/
constructor() {};

/** Returns the singleton instance of Scrim.
* @return {!Scrim} the singleton instance of Scrim
*/
static getScrim() {
  return Scrim.singleton;
};

/** @override */
toString() {
  return Util.ADVANCED ? '' : 'Scrim{}';
};

/** @override */
toStringShort() {
  return Util.ADVANCED ? '' : 'Scrim{}';
};

/** @override */
addNonCollide(bodies) {
};

/** @override */
alignTo(p_body, p_world, opt_angle) {
  throw '';
};

/** @override */
bodyToWorld(p_body) {
  return Vector.clone(p_body);
};

/** @override */
bodyToWorldTransform() {
  return AffineTransform.IDENTITY;
};

/** @override */
createCanvasPath(context) {
  // make an empty path
  context.beginPath();
  context.closePath();
};

/** @override */
doesNotCollide(body) {
  return true;
};

/** @override */
eraseOldCoords() {
};

/** @override */
getAccuracy() {
  return 0;
};

/** @override */
getAngle() {
  return 0;
};

/** @override */
getAngularVelocity() {
  return 0;
};

/** @override */
getBottomBody() {
  return Util.NEGATIVE_INFINITY;
};

/** @override */
getBottomWorld() {
  return Util.NEGATIVE_INFINITY;
};

/** @override */
getBoundsBody() {
  return new DoubleRect(this.getLeftBody(), this.getBottomBody(),
      this.getRightBody(), this.getTopBody());
};

/** @override */
getBoundsWorld() {
  return this.getBoundsBody();
};

/** @override */
getCenterOfMassBody() {
  return Vector.ORIGIN;
};

/** @override */
getCentroidBody() {
  return Vector.ORIGIN;
};

/** @override */
getCentroidRadius() {
  return Util.POSITIVE_INFINITY;
};

/** @override */
getCentroidWorld() {
  return Vector.ORIGIN;
};

/** @override */
getDistanceTol() {
  return 0;
};

/** @override */
getDragPoints() {
  return [];
};

/** @override */
getElasticity() {
  return 1;
};

/** @override */
getExpireTime() {
  return Util.POSITIVE_INFINITY;
};

/** @override */
getHeight() {
  return Util.POSITIVE_INFINITY;
};

/** @override */
getKineticEnergy() {
  return 0;
};

/** @override */
getLeftBody() {
  return Util.NEGATIVE_INFINITY;
};

/** @override */
getLeftWorld() {
  return Util.NEGATIVE_INFINITY;
};

/** @override */
getMass() {
  return Util.POSITIVE_INFINITY;
};

/** @override */
getName(opt_localized) {
  return 'SCRIM';
};

/** @override */
getMinHeight() {
  return Util.POSITIVE_INFINITY;
};

/** @override */
getOldCoords() {
  return null;
};

/** @override */
getPosition() {
  return Vector.ORIGIN;
};

/** @override */
getRightBody() {
  return Util.POSITIVE_INFINITY;
};

/** @override */
getRightWorld() {
  return Util.POSITIVE_INFINITY;
};

/** @override */
getTopBody() {
return Util.POSITIVE_INFINITY;
};

/** @override */
getTopWorld() {
return Util.POSITIVE_INFINITY;
};

/** @override */
getVarsIndex() {
  return -1;
};

/** @override */
getVelocity(p_body) {
  return Vector.ORIGIN;
};

/** @override */
getVelocityTol() {
  return 0;
};

/** @override */
getVerticesBody() {
  return [];
};

/** @override */
getWidth() {
  return Util.POSITIVE_INFINITY;
};

/** @override */
getZeroEnergyLevel() {
  return null;
};

/** @override */
isMassObject() {
  return true;
};

/** @override */
momentAboutCM() {
  return Util.POSITIVE_INFINITY;
};

/** @override */
momentum() {
  const r = new Array(3);
  r[0] = r[1] = r[2] = Util.POSITIVE_INFINITY;
  return r;
};

/** @override */
nameEquals(name) {
  return this.getName() == Util.toName(name);
};

/** @override */
removeNonCollide(bodies) {
};

/** @override */
rotateBodyToWorld(v_body) {
  return Vector.clone(v_body);
};

/** @override */
rotateWorldToBody(v_world) {
  return Vector.clone(v_world);
};

/** @override */
rotationalEnergy() {
  return 0;
};

/** @override */
saveOldCoords() {
};

/** @override */
setAccuracy(accuracy) {
};

/** @override */
setAngle(angle) {
};

/** @override */
setAngularVelocity(angular_velocity) {
};

/** @override */
setCenterOfMass(x_body, y_body) {
};

/** @override */
setDistanceTol(value) {
};

/** @override */
setDragPoints(dragPts) {
};

/** @override */
setElasticity(value) {
};

/** @override */
setExpireTime(time) {
  return this;
};

/** @override */
setMass(mass) {
  throw '';
};

/** @override */
setMinHeight(minHeight) {
};

/** @override */
setMomentAboutCM(moment) {
};

/** @override */
setPosition(loc_world, angle) {
  if (loc_world.getX() != 0 || loc_world.getY() != 0) {
    throw '';
  }
  if (angle !== undefined && angle != 0) {
    throw '';
  }
};

/** @override */
setVelocity(velocity_world, angular_velocity) {
  if (velocity_world.getX() != 0 || velocity_world.getY() != 0) {
    throw '';
  }
  if (angular_velocity !== undefined && angular_velocity != 0) {
    throw '';
  }
};

/** @override */
setVelocityTol(value) {
};

/** @override */
setZeroEnergyLevel(zeroEnergyLevel) {
  return this;
};

/** @override */
similar(obj, opt_tolerance) {
  return false;
};

/** @override */
translationalEnergy() {
  return 0;
};

/** @override */
worldToBody(p_world) {
  return Vector.clone(p_world);
};

} // end class

/**
* @type {!Scrim}
* @private
*/
Scrim.singleton = new Scrim();

exports = Scrim;
