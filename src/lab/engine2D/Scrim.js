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

goog.provide('myphysicslab.lab.engine2D.Scrim');

goog.require('myphysicslab.lab.engine2D.RigidBody');
goog.require('myphysicslab.lab.util.AffineTransform');
goog.require('myphysicslab.lab.util.DoubleRect');
goog.require('myphysicslab.lab.util.Util');
goog.require('myphysicslab.lab.util.Vector');

goog.scope(function() {

const AffineTransform = goog.module.get('myphysicslab.lab.util.AffineTransform');
const DoubleRect = goog.module.get('myphysicslab.lab.util.DoubleRect');
const RigidBody = goog.module.get('myphysicslab.lab.engine2D.RigidBody');
const Util = goog.module.get('myphysicslab.lab.util.Util');
const Vector = goog.module.get('myphysicslab.lab.util.Vector');

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

* @constructor
* @final
* @struct
* @implements {RigidBody}
* @private
*/
myphysicslab.lab.engine2D.Scrim = function() {};

var Scrim = myphysicslab.lab.engine2D.Scrim;

/**
* @type {!Scrim}
* @private
*/
Scrim.singleton = new Scrim();

/** Returns the singleton instance of Scrim.
* @return {!Scrim} the singleton instance of Scrim
*/
Scrim.getScrim = function() {
  return Scrim.singleton;
};

/** @override */
Scrim.prototype.toString = function() {
  return Util.ADVANCED ? '' : 'Scrim{}';
};

/** @override */
Scrim.prototype.toStringShort = function() {
  return Util.ADVANCED ? '' : 'Scrim{}';
};

/** @override */
Scrim.prototype.addNonCollide = function(bodies) {
};

/** @override */
Scrim.prototype.alignTo = function(p_body, p_world, opt_angle) {
  throw new Error();
};

/** @override */
Scrim.prototype.bodyToWorld = function(p_body) {
  return Vector.clone(p_body);
};

/** @override */
Scrim.prototype.bodyToWorldTransform = function() {
  return AffineTransform.IDENTITY;
};

/** @override */
Scrim.prototype.createCanvasPath = function(context) {
  // make an empty path
  context.beginPath();
  context.closePath();
};

/** @override */
Scrim.prototype.doesNotCollide = function(body) {
  return true;
};

/** @override */
Scrim.prototype.eraseOldCoords = function() {
};

/** @override */
Scrim.prototype.getAccuracy = function() {
  return 0;
};

/** @override */
Scrim.prototype.getAngle = function() {
  return 0;
};

/** @override */
Scrim.prototype.getAngularVelocity = function() {
  return 0;
};

/** @override */
Scrim.prototype.getBottomBody = function() {
  return Util.NEGATIVE_INFINITY;
};

/** @override */
Scrim.prototype.getBottomWorld = function() {
  return Util.NEGATIVE_INFINITY;
};

/** @override */
Scrim.prototype.getBoundsBody = function() {
  return new DoubleRect(this.getLeftBody(), this.getBottomBody(),
      this.getRightBody(), this.getTopBody());
};

/** @override */
Scrim.prototype.getBoundsWorld = function() {
  return this.getBoundsBody();
};

/** @override */
Scrim.prototype.getCenterOfMassBody = function() {
  return Vector.ORIGIN;
};

/** @override */
Scrim.prototype.getCentroidBody = function() {
  return Vector.ORIGIN;
};

/** @override */
Scrim.prototype.getCentroidRadius = function() {
  return Util.POSITIVE_INFINITY;
};

/** @override */
Scrim.prototype.getCentroidWorld = function() {
  return Vector.ORIGIN;
};

/** @override */
Scrim.prototype.getDistanceTol = function() {
  return 0;
};

/** @override */
Scrim.prototype.getDragPoints = function() {
  return [];
};

/** @override */
Scrim.prototype.getElasticity = function() {
  return 1;
};

/** @override */
Scrim.prototype.getExpireTime = function() {
  return Util.POSITIVE_INFINITY;
};

/** @override */
Scrim.prototype.getHeight = function() {
  return Util.POSITIVE_INFINITY;
};

/** @override */
Scrim.prototype.getKineticEnergy = function() {
  return 0;
};

/** @override */
Scrim.prototype.getLeftBody = function() {
  return Util.NEGATIVE_INFINITY;
};

/** @override */
Scrim.prototype.getLeftWorld = function() {
  return Util.NEGATIVE_INFINITY;
};

/** @override */
Scrim.prototype.getMass = function() {
  return Util.POSITIVE_INFINITY;
};

/** @override */
Scrim.prototype.getName = function(opt_localized) {
  return 'SCRIM';
};

/** @override */
Scrim.prototype.getMinHeight = function() {
  return Util.POSITIVE_INFINITY;
};

/** @override */
Scrim.prototype.getOldCoords = function() {
  return null;
};

/** @override */
Scrim.prototype.getPosition = function() {
  return Vector.ORIGIN;
};

/** @override */
Scrim.prototype.getRightBody = function() {
  return Util.POSITIVE_INFINITY;
};

/** @override */
Scrim.prototype.getRightWorld = function() {
  return Util.POSITIVE_INFINITY;
};

/** @override */
Scrim.prototype.getTopBody = function() {
return Util.POSITIVE_INFINITY;
};

/** @override */
Scrim.prototype.getTopWorld = function() {
return Util.POSITIVE_INFINITY;
};

/** @override */
Scrim.prototype.getVarsIndex = function() {
  return -1;
};

/** @override */
Scrim.prototype.getVelocity = function(p_body) {
  return Vector.ORIGIN;
};

/** @override */
Scrim.prototype.getVelocityTol = function() {
  return 0;
};

/** @override */
Scrim.prototype.getVerticesBody = function() {
  return [];
};

/** @override */
Scrim.prototype.getWidth = function() {
  return Util.POSITIVE_INFINITY;
};

/** @override */
Scrim.prototype.getZeroEnergyLevel = function() {
  return null;
};

/** @override */
Scrim.prototype.isMassObject = function() {
  return true;
};

/** @override */
Scrim.prototype.momentAboutCM = function() {
  return Util.POSITIVE_INFINITY;
};

/** @override */
Scrim.prototype.momentum = function() {
  var r = new Array(3);
  r[0] = r[1] = r[2] = Util.POSITIVE_INFINITY;
  return r;
};

/** @override */
Scrim.prototype.nameEquals = function(name) {
  return this.getName() == Util.toName(name);
};

/** @override */
Scrim.prototype.removeNonCollide = function(bodies) {
};

/** @override */
Scrim.prototype.rotateBodyToWorld = function(v_body) {
  return Vector.clone(v_body);
};

/** @override */
Scrim.prototype.rotateWorldToBody = function(v_world) {
  return Vector.clone(v_world);
};

/** @override */
Scrim.prototype.rotationalEnergy = function() {
  return 0;
};

/** @override */
Scrim.prototype.saveOldCoords = function() {
};

/** @override */
Scrim.prototype.setAccuracy = function(accuracy) {
};

/** @override */
Scrim.prototype.setAngle = function(angle) {
};

/** @override */
Scrim.prototype.setAngularVelocity = function(angular_velocity) {
};

/** @override */
Scrim.prototype.setCenterOfMass = function(x_body, y_body) {
};

/** @override */
Scrim.prototype.setDistanceTol = function(value) {
};

/** @override */
Scrim.prototype.setDragPoints = function(dragPts) {
};

/** @override */
Scrim.prototype.setElasticity = function(value) {
};

/** @override */
Scrim.prototype.setExpireTime = function(time) {
  return this;
};

/** @override */
Scrim.prototype.setMass = function(mass) {
  throw new Error();
};

/** @override */
Scrim.prototype.setMinHeight = function(minHeight) {
};

/** @override */
Scrim.prototype.setMomentAboutCM = function(moment) {
};

/** @override */
Scrim.prototype.setPosition = function(loc_world, angle) {
  if (loc_world.getX() != 0 || loc_world.getY() != 0) {
    throw new Error();
  }
  if (goog.isDef(angle) && angle != 0) {
    throw new Error();
  }
};

/** @override */
Scrim.prototype.setVelocity = function(velocity_world, angular_velocity) {
  if (velocity_world.getX() != 0 || velocity_world.getY() != 0) {
    throw new Error();
  }
  if (goog.isDef(angular_velocity) && angular_velocity != 0) {
    throw new Error();
  }
};

/** @override */
Scrim.prototype.setVelocityTol = function(value) {
};

/** @override */
Scrim.prototype.setZeroEnergyLevel = function(zeroEnergyLevel) {
  return this;
};

/** @override */
Scrim.prototype.similar = function(obj, opt_tolerance) {
  return false;
};

/** @override */
Scrim.prototype.translationalEnergy = function() {
  return 0;
};

/** @override */
Scrim.prototype.worldToBody = function(p_world) {
  return Vector.clone(p_world);
};

}); // goog.scope
