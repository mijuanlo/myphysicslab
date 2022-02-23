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

goog.module('myphysicslab.sims.roller.BrachistoSim');

const asserts = goog.require('goog.asserts');
const AbstractODESim = goog.require('myphysicslab.lab.model.AbstractODESim');
const EventHandler = goog.require('myphysicslab.lab.app.EventHandler');
const GenericEvent = goog.require('myphysicslab.lab.util.GenericEvent');
const NumericalPath = goog.require('myphysicslab.lab.model.NumericalPath');
const ParameterNumber = goog.require('myphysicslab.lab.util.ParameterNumber');
const ParametricPath = goog.require('myphysicslab.lab.model.ParametricPath');
const PathPoint = goog.require('myphysicslab.lab.model.PathPoint');
const PointMass = goog.require('myphysicslab.lab.model.PointMass');
const ShapeType = goog.require('myphysicslab.lab.model.ShapeType');
const SimList = goog.require('myphysicslab.lab.model.SimList');
const SimObject = goog.require('myphysicslab.lab.model.SimObject');
const Spring = goog.require('myphysicslab.lab.model.Spring');
const Util = goog.require('myphysicslab.lab.util.Util');
const VarsList = goog.require('myphysicslab.lab.model.VarsList');
const Vector = goog.require('myphysicslab.lab.util.Vector');

/** The Brachistochrone is a classic problem about finding the path
between two points where a ball will travel fastest (without friction). From greek:
brachistos (shortest) and chronos (time).

The equations of motion are the same as those of
{@link myphysicslab.sims.roller.RollerSingleSim}.
For derivation equations of motion see <http://www.myphysicslab.com/RollerSimple.html>
and <http://www.myphysicslab.com/RollerSpring.html>.

Variables Array
--------------------

The variables are stored in the VarsList as follows

    vars[0] time
    vars[1] position ball 0
    vars[2] velocity ball 0
    vars[3] x-position ball 0 (derived from vars[1] and path)
    vars[4] y-position ball 0 (derived from vars[1] and path)
    vars[5] position ball 1
    vars[6] velocity ball 1
    vars[7] x-position ball 1 (derived from vars[5] and path)
    vars[8] y-position ball 1 (derived from vars[5] and path)
    etc.

@todo  Graph is not very useful now.  More useful would be to show each ball with
  a different color, and show y position vs. time.  Perhaps name variables after the
  associated path.  Or number the various paths and draw numbers on the balls.

@todo  Puzzle:  if you turn off the repeat time and just let it run, the circle
  ball is ahead of the brachistochrone. Because it is a shorter path? But all the balls
  reach the same height at the same moment on the first repetition. After that they are
  no longer in sync. Why?

@todo  Don't put the x-position and y-position in the vars[] array;  instead
  calculate these in getVariable().  See RollerFlightSim for an example.

@todo could make an array of PathPoint, to avoid creating them so often.

* @implements {EventHandler}
*/
class BrachistoSim extends AbstractODESim {
/**
* @param {!Array<!ParametricPath>} paths the set of paths to show
* @param {string=} opt_name name of this as a Subject
* @param {!SimList=} opt_simList optional SimList where SimObjects should be stored
*/
constructor(paths, opt_name, opt_simList) {
  super(opt_name, opt_simList);
  const plen = paths.length;
  /** keep track of our SimObjects so that we can erase them
  * @type {!Array<!SimObject>} simObjects
  * @private
  */
  this.simObjects_ = [];
  /**
  * @type {number}
  * @private
  */
  this.damping_ = 0;
  /**
  * @type {number}
  * @private
  */
  this.gravity_ = 2.0;
  /**
  * @type {number}
  * @private
  */
  this.mass_ = 1.0;
  /** Which path was chosen by user, or -1 if no path chosen.
  * @type {number}
  * @private
  */
  this.choice_ = -1;
  /**
  * @type {!Array<!PointMass>}
  * @private
  */
  this.balls_ = new Array(plen);
  /**
  * @type {!Array<!NumericalPath>}
  * @private
  */
  this.paths_ = new Array(plen);
  for (let i=0; i<plen; i++) {
    this.paths_[i] = new NumericalPath(paths[i]);
    this.getSimList().add(this.paths_[i]);
  }
  this.setVarsList(new VarsList(
      BrachistoSim.makeVarNames(paths, /*localized=*/false),
      BrachistoSim.makeVarNames(paths, /*localized=*/true),
      this.getName()+'_VARS'));
  // the variables for x- and y- position and velocity are auto computed.
  const cv = this.getVarsList().toArray().map(
      v => {
        if (v.getName().match(/^.*_(X|Y)_(POSITION|VELOCITY)$/)) {
          v.setComputed(true);
        }
      });

  this.addParameter(new ParameterNumber(this, BrachistoSim.en.DAMPING,
      BrachistoSim.i18n.DAMPING,
      () => this.getDamping(), a => this.setDamping(a)));
  this.addParameter(new ParameterNumber(this, BrachistoSim.en.GRAVITY,
      BrachistoSim.i18n.GRAVITY,
      () => this.getGravity(), a => this.setGravity(a)));
  this.addParameter(new ParameterNumber(this, BrachistoSim.en.MASS,
      BrachistoSim.i18n.MASS,
      () => this.getMass(), a => this.setMass(a)));
};

/** @override */
toString() {
  return Util.ADVANCED ? '' : this.toStringShort().slice(0, -1)
      +', damping_: '+Util.NF(this.damping_)
      +', gravity_: '+Util.NF(this.gravity_)
      +', mass_: '+Util.NF(this.mass_)
      +', paths: '+this.paths_.length
      + super.toString();
};

/** @override */
getClassName() {
  return 'BrachistoSim';
};

/**
* @param {!Array<!ParametricPath>} paths
* @return {!Array<string>}
* @param {boolean} localized
* @private
*/
static makeVarNames(paths, localized) {
  const names = new Array(paths.length*4 + 1);
  for (let i=0, len=names.length; i<len; i++) {
    names[i] = BrachistoSim.getVariableName(i, paths, localized);
  }
  return names;
};

/**
* @param {number} i
* @param {!Array<!ParametricPath>} paths
* @param {boolean} localized
* @return {string}
*/
static getVariableName(i, paths, localized) {
  //   0   1  2  3  4  5  6  7  8  9 10 11 12 ...
  // time p0 v0 x0 y0 p1 v1 x1 y1 p2 v2 x2 y2 ...
  if (i==0) {
    return localized ? VarsList.i18n.TIME : VarsList.en.TIME;
  }
  const j = (i-1) % 4;  // % is mod, so j tells what variable is wanted
  const obj = Math.floor((i-1) / 4);  // which path: 0, 1, 2, etc.
  const name = paths[obj].getName();
  let type;
  if (j == 1) {
    type = localized ? BrachistoSim.i18n.VELOCITY : BrachistoSim.en.VELOCITY;
  } else {
    type = localized ?BrachistoSim.i18n.POSITION : BrachistoSim.en.POSITION;
  }
  switch (j) {
    case 0:
    case 1: return name+' '+type;
    case 2: return name+' x-'+type;
    case 3: return name+' y-'+type;
    default:  asserts.fail();
  }
  return '';
};

/** Returns the set of paths to choose from.
@return {!Array<!NumericalPath>} the set of paths to choose from
*/
getPaths() {
  return Array.from(this.paths_);
};

/** Which path was chosen by user, or -1 if no path chosen.
@return {number} Which path was chosen by user, or -1 if no path chosen.
*/
getPathChoice() {
  return this.choice_;
};

/** Set which path the user has chosen for the 'fastest path'. Resets the variables to
initial conditions. Creates a new set of SimObjects to represent the balls on the path.
Creates the text message to display instructions to the user.

Note: the simulation will still run without choosing a path; the path choice is only
to allow decorating one of the paths with a different colored ball, and to present text
instructions.
* @param {number} choice Which path was chosen by user, or -1 if no path chosen.
*/
setPathChoice(choice) {
  this.choice_ = choice;
  // remove from simList all of our old objects
  this.getSimList().removeAll(this.simObjects_);
  this.simObjects_.length = 0; // clears the array
  // specify iniial conditions
  const va = this.getVarsList();
  va.setValue(0, 0);  // time
  //   0   1  2  3  4  5  6  7  8  9 10 11 12 ...
  // time p0 v0 x0 y0 p1 v1 x1 y1 p2 v2 x2 y2 ...
  // set each ball to start at the same start point where x = 0
  for (let i=0, len=this.paths_.length; i<len; i++) {
    va.setValue(1 + 4*i, this.paths_[i].map_x_to_p(0.0));
    va.setValue(2 + 4*i, 0);  // start velocity is zero
  }
  this.saveInitialState();
  let p = PointMass.makeCircle(0.2, 'start');
  p.setPosition(new Vector(0,  0));
  p.setShape(ShapeType.RECTANGLE);
  this.simObjects_.push(p);
  p = PointMass.makeCircle(0.2, 'end');
  p.setPosition(new Vector(3,  -2));
  p.setShape(ShapeType.RECTANGLE);
  this.simObjects_.push(p);
  // add ball objects, one for each path
  if (choice >= 0) {
    const len = this.balls_.length;
    for (let i=0; i<len; i++) {
      const name = (i==choice) ? 'ball selected' : 'ball';
      p = this.balls_[i] = PointMass.makeCircle(0.1, name);
      this.simObjects_.push(p);
    }
  }
  this.getSimList().addAll(this.simObjects_);
  this.broadcast(new GenericEvent(this, BrachistoSim.PATH_CHOSEN, choice));
};

/** @override */
modifyObjects() {
  const va = this.getVarsList();
  const vars = va.getValues();
  //   0   1  2  3  4  5  6  7  8  9 10 11 12 ...
  // time p0 v0 x0 y0 p1 v1 x1 y1 p2 v2 x2 y2 ...
  for (let i=0, len=this.paths_.length; i<len; i++) {
    if (this.balls_[i] == null)
      continue;
    const pathPoint = new PathPoint(vars[1+4*i]);
    this.paths_[i].map_p_to_slope(pathPoint);
    this.balls_[i].setPosition(pathPoint);
    const veloVector = pathPoint.getSlope().multiply(vars[2+4*i]);
    this.balls_[i].setVelocity(veloVector);
    // update x, y location in vars array
    va.setValue(3+ 4*i, pathPoint.getX(), /*continuous=*/true);
    va.setValue(4+ 4*i, pathPoint.getY(), /*continuous=*/true);
  }
};

/** @override */
startDrag(simObject, location, offset, dragBody, mouseEvent) {
  // find the closest path to this point.
  let dist = Util.POSITIVE_INFINITY;
  let closestPath = -1;
  for (let i=0, len=this.paths_.length; i<len; i++) {
    const pathPoint = this.paths_[i].findNearestGlobal(location);
    const d = pathPoint.getPosition().distanceTo(location);
    if (d < dist) { // found a closer path
      closestPath = i;
      dist = d;
    }
  }
  this.setPathChoice(closestPath);
  return true;
};

/** @override */
mouseDrag(simObject, location, offset, mouseEvent) {
};

/** @override */
finishDrag(simObject, location, offset) {
};

/** @override */
handleKeyEvent(keyCode, pressed, keyEvent) {
};

/** @override */
evaluate(vars, change, timeStep) {
  //   0   1  2  3  4  5  6  7  8  9 10 11 12 ...
  // time p0 v0 x0 y0 p1 v1 x1 y1 p2 v2 x2 y2 ...
  change[0] = 1; // time
  for (let i=0, len=this.balls_.length; i<len; i++) {
    if (this.balls_[i] == null) {
      for (let j=1; j<=4; j++)
        change[j + 4*i] = 0;
      continue;
    }
    change[1 + 4*i] = vars[2 + 4*i];  // p' = v
    // calculate the slope at the given arc-length position on the curve
    // vars[1] is p = path length position.  xval is the corresponding x value.
    const pathPoint = new PathPoint(vars[1 + 4*i]);
    this.paths_[i].map_p_to_slope(pathPoint);
    const k = pathPoint.slope;
    // let k = slope of curve. Then sin(theta) = k/sqrt(1+k^2)
    // v' = - g sin(theta) = - g k/sqrt(1+k^2)
    const sinTheta = isFinite(k) ? k/Math.sqrt(1+k*k) : 1;
    change[2 + 4*i] = -this.gravity_*pathPoint.direction*sinTheta;
    // add friction damping:  - b*v/m
    change[2 + 4*i] -= this.damping_*vars[2 + 4*i]/this.balls_[i].getMass();
    change[3 + 4*i] = change[4 + 4*i] = 0; // x,y positions
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
  this.broadcastParameter(BrachistoSim.en.GRAVITY);
};

/**
@return {number}
*/
getDamping() {
  return this.damping_;
};

/**
@param {number} value
*/
setDamping(value) {
  this.damping_ = value;
  this.broadcastParameter(BrachistoSim.en.DAMPING);
};

/**
@return {number}
*/
getMass() {
  return this.mass_;
};

/**
@param {number} value
*/
setMass(value) {
  this.mass_ = value;
  for (let i=0, len=this.balls_.length; i<len; i++) {
    if (this.balls_[i] != null)
      this.balls_[i].setMass(value);
  }
  this.broadcastParameter(BrachistoSim.en.MASS);
};

} // end class

/** Event broadcast when a path is chosen.
* @type {string}
* @const
*/
BrachistoSim.PATH_CHOSEN = 'PATH_CHOSEN';

/** Set of internationalized strings.
@typedef {{
  DAMPING: string,
  GRAVITY: string,
  MASS: string,
  POSITION: string,
  VELOCITY: string
  }}
*/
BrachistoSim.i18n_strings;

/**
@type {BrachistoSim.i18n_strings}
*/
BrachistoSim.en = {
  DAMPING: 'damping',
  GRAVITY: 'gravity',
  MASS: 'mass',
  POSITION: 'position',
  VELOCITY: 'velocity'
};

/**
@private
@type {BrachistoSim.i18n_strings}
*/
BrachistoSim.de_strings = {
  DAMPING: 'Dämpfung',
  GRAVITY: 'Gravitation',
  MASS: 'Masse',
  POSITION: 'Position',
  VELOCITY: 'Geschwindigkeit'
};

/**
@private
@type {BrachistoSim.i18n_strings}
*/
BrachistoSim.es_strings = {
  DAMPING: 'Amortiguación',
  GRAVITY: 'Gravedad',
  MASS: 'Masa',
  POSITION: 'Posición',
  VELOCITY: 'Velocidad'
};

/** Set of internationalized strings.
@type {BrachistoSim.i18n_strings}
*/
BrachistoSim.i18n = BrachistoSim.en;
switch(goog.LOCALE) {
  case 'de':
    BrachistoSim.i18n = BrachistoSim.de_strings;
    break;
  case 'es':
    BrachistoSim.i18n = BrachistoSim.es_strings;
    break;
  default:
    BrachistoSim.i18n = BrachistoSim.en;
    break;
};

exports = BrachistoSim;
