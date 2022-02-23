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

goog.module('myphysicslab.sims.engine2D.DoNothingApp');

const CheckBoxControl = goog.require('myphysicslab.lab.controls.CheckBoxControl');
const ChoiceControl = goog.require('myphysicslab.lab.controls.ChoiceControl');
const CollisionAdvance = goog.require('myphysicslab.lab.model.CollisionAdvance');
const CommonControls = goog.require('myphysicslab.sims.common.CommonControls');
const ContactSim = goog.require('myphysicslab.lab.engine2D.ContactSim');
const ConstantForceLaw = goog.require('myphysicslab.lab.model.ConstantForceLaw');
const CoordType = goog.require('myphysicslab.lab.model.CoordType');
const DampingLaw = goog.require('myphysicslab.lab.model.DampingLaw');
const DoubleRect = goog.require('myphysicslab.lab.util.DoubleRect');
const Engine2DApp = goog.require('myphysicslab.sims.engine2D.Engine2DApp');
const ExtraAccel = goog.require('myphysicslab.lab.engine2D.ExtraAccel');
const Force = goog.require('myphysicslab.lab.model.Force');
const ForceLaw = goog.require('myphysicslab.lab.model.ForceLaw');
const GenericObserver = goog.require('myphysicslab.lab.util.GenericObserver');
const JointUtil = goog.require('myphysicslab.lab.engine2D.JointUtil');
const NumericControl = goog.require('myphysicslab.lab.controls.NumericControl');
const ParameterBoolean = goog.require('myphysicslab.lab.util.ParameterBoolean');
const ParameterNumber = goog.require('myphysicslab.lab.util.ParameterNumber');
const RotatingTestForce = goog.require('myphysicslab.sims.engine2D.RotatingTestForce');
const Shapes = goog.require('myphysicslab.lab.engine2D.Shapes');
const Util = goog.require('myphysicslab.lab.util.Util');
const Vector = goog.require('myphysicslab.lab.util.Vector');

/** Simulation of the Do Nothing Grinder, which consists of two shuttle
blocks, each moving in its own groove, and a handle connects the shuttles. You can move
the shuttles by pulling on the handle.

This is a strong test of the physics engine in ComputeForces. The contacts are very
redundant, especially when a shuttle straddles the middle point.

This app has a config() method which looks at a set of options
and rebuilds the simulation accordingly. UI controls are created to change the options.

@todo  Make a control for magnitude of handle force.

*/
class DoNothingApp extends Engine2DApp {
/**
* @param {!Object} elem_ids specifies the names of the HTML
*    elementId's to look for in the HTML document; these elements are where the user
*    interface of the simulation is created.
*/
constructor(elem_ids) {
  const simRect = new DoubleRect(-6, -6, 6, 6);
  const sim = new ContactSim();
  sim.setExtraAccel(ExtraAccel.VELOCITY_AND_DISTANCE);
  const advance = new CollisionAdvance(sim);
  super(elem_ids, simRect, sim, advance);
  /** @type {!ContactSim} */
  this.mySim = sim;
  this.rbo.protoFixedPolygon.setFillStyle('rgb(240,240,240)');
  this.mySim.setShowForces(false);
  this.elasticity.setElasticity(0.8);
  /** @type {!DampingLaw} */
  this.dampingLaw = new DampingLaw(0.1, 0.15, this.simList);

  /**  Whether there is slack in the fit of shuttles in the grooves.
  * @type {boolean}
  */
  this.tightFit = true;
  /** @type {number} */
  this.handleForce = 0;
  /** @type {number} */
  this.rotateRate = 0.3;
  /** @type {boolean} */
  this.extraBlock = false;

  this.addPlaybackControls();
  /** @type {!ParameterBoolean} */
  let pb;
  /** @type {!ParameterNumber} */
  let pn;
  this.addParameter(pb = new ParameterBoolean(this, DoNothingApp.en.TIGHT_FIT,
      DoNothingApp.i18n.TIGHT_FIT,
      () => this.getTightFit(), a => this.setTightFit(a)));
  this.addControl(new CheckBoxControl(pb));

  this.addParameter(pb= new ParameterBoolean(this, DoNothingApp.en.EXTRA_BLOCK,
      DoNothingApp.i18n.EXTRA_BLOCK,
      () => this.getExtraBlock(), a => this.setExtraBlock(a)));
  this.addControl(new CheckBoxControl(pb));

  this.addParameter(pn=new ParameterNumber(this, DoNothingApp.en.HANDLE_FORCE,
      DoNothingApp.i18n.HANDLE_FORCE,
      () => this.getHandleForce(), a => this.setHandleForce(a)));
  this.addControl(new NumericControl(pn));

  this.addParameter(pn= new ParameterNumber(this, DoNothingApp.en.ROTATE_RATE,
      DoNothingApp.i18n.ROTATE_RATE,
      () => this.getRotateRate(), a => this.setRotateRate(a)));
  this.addControl(new NumericControl(pn));

  pn = this.dampingLaw.getParameterNumber(DampingLaw.en.DAMPING);
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
      + super.toString();
};

/** @override */
getClassName() {
  return 'DoNothingApp';
};

/** @override */
defineNames(myName) {
  super.defineNames(myName);
  this.terminal.addRegex('dampingLaw',
       myName+'.');
  this.terminal.addRegex('DoNothingApp|Engine2DApp',
       'myphysicslab.sims.engine2D.', /*addToVars=*/false);
};

/** @override */
getSubjects() {
  return super.getSubjects().concat(this.dampingLaw);
};

/**
* @return {undefined}
*/
config() {
  const elasticity = this.elasticity.getElasticity();
  this.mySim.cleanSlate();
  this.advance.reset();
  this.mySim.addForceLaw(this.dampingLaw);
  this.dampingLaw.connect(this.mySim.getSimList());
  DoNothingApp.setup(this.mySim, this.tightFit);
  this.displayList.findShape(DoNothingApp.en.HANDLE)
      .setFillStyle('rgba(51,204,255,0.5)').setZIndex(2);
  this.displayList.findShape(DoNothingApp.en.SHUTTLE+1)
      .setFillStyle('rgb(200,200,200)');
  this.displayList.findShape(DoNothingApp.en.SHUTTLE+2)
      .setFillStyle('rgb(200,200,200)');
  if (this.extraBlock) {
    // add an optional extra free block
    const block = Shapes.makeBlock(1, 3, DoNothingApp.en.EXTRA_BLOCK,
        DoNothingApp.i18n.EXTRA_BLOCK);
    block.setPosition(new Vector(-5.5,  -4));
    this.mySim.addBody(block);
    this.displayList.findShape(block).setFillStyle('blue');
    // the free block does not collide with fixed blocks
    this.mySim.getBodies().forEach(bod => {
      if (bod.getName().match(/^FIXED.*/) != null) {
        bod.addNonCollide([block]);
        block.addNonCollide([bod]);
      }
    });
  }
  if (this.handleForce > 0) {
    // add a force to the handle
    const handle = this.mySim.getBody('handle');
    /** @type {!ForceLaw} */
    let f_law;
    if (this.rotateRate > 0) {
      // rotating handle force; good for long term test
      f_law = new RotatingTestForce(this.mySim, handle,
          /*location_body=*/new Vector(0, -3),
          /*magnitude=*/this.handleForce, /*rotation_rate=*/this.rotateRate);
    } else {
      // force is constant direction relative to handle; results in high speeds
      const f = new Force('turning', handle,
          /*location=*/new Vector(0, -3), CoordType.BODY,
          /*direction=*/new Vector(this.handleForce, 0), CoordType.BODY);
      f_law = new ConstantForceLaw(f);
    }
    this.mySim.addForceLaw(f_law);
  }
  this.mySim.setElasticity(elasticity);
  this.mySim.getVarsList().setTime(0);
  this.mySim.saveInitialState();
  this.clock.setTime(0);
  this.clock.setRealTime(0);
  this.easyScript.update();
};

/**  Makes the Do Nothing Grinder and adds it to the given simulation.
There are four fixed 'groove' blocks which form the channels that the shuttles
move in.  There are two shuttles, one in the horizontal groove, one in the
vertical groove.  A handle connects between the two shuttles with joints.
The handle does not interact with the fixed groove blocks.
@param {!ContactSim} sim  the simulation to add to
@param {boolean} tightFit  true means that the fixed grooves are spaced so that the
  shuttles are in constant contact at all four corners;  false gives a little
  wiggle room for the shuttles.
*/
static setup(sim, tightFit) {
  const handle = Shapes.makeBlock(0.8, 6.2, DoNothingApp.en.HANDLE,
      DoNothingApp.i18n.HANDLE);
  handle.setMass(0.5);
  handle.setDragPoints([new Vector(0, -2.8)]);
  sim.addBody(handle);
  // 2 shuttle pieces
  const shuttle_width = tightFit ? 1.0 : 0.98;
  const s1 = Shapes.makeBlock(shuttle_width, 2.5, DoNothingApp.en.SHUTTLE+1,
      DoNothingApp.i18n.SHUTTLE+1);
  s1.setPosition(new Vector(0,  2.0),  Math.PI);
  sim.addBody(s1);
  const s2 = Shapes.makeBlock(shuttle_width, 2.5, DoNothingApp.en.SHUTTLE+2,
      DoNothingApp.i18n.SHUTTLE+2);
  s2.setPosition(new Vector(-2.5,  0),  Math.PI/2);
  sim.addBody(s2);
  // create 4 fixed blocks that form the grooves which the shuttles move thru
  for (let i=0; i<2; i++) {
    for (let j=0; j<2; j++) {
      const size = 4;
      const id = j + 2*i;
      const p = Shapes.makeBlock(size, size, DoNothingApp.en.FIXED_BLOCK+id,
          DoNothingApp.i18n.FIXED_BLOCK+id);
      const d = 0.507 + size/2;
      p.setPosition(new Vector(d*(1 - 2*i), d*(1 - 2*j)), 0);
      p.setMass(Util.POSITIVE_INFINITY);
      sim.addBody(p);
      // the handle does not collide with fixed blocks
      handle.addNonCollide([p]);
      p.addNonCollide([handle]);
    }
  }
  // Position the handle to connect the 2 shuttle pieces.
  const p1 = s1.getPosition();
  const p2 = s2.getPosition();
  const handleLength = p1.distanceTo(p2);
  //console.log('p1 to p2 '+Util.NF5(p1.distanceTo(p2)));
  const a = Math.atan(-p1.getY()/p2.getX());
  //console.log('a '+Util.NF5(a));
  handle.setAngle(-Math.PI/2 + a);
  JointUtil.attachRigidBody(sim,
    s1,  /*attach point on s1, body coords=*/new Vector(0, 0),
    handle,  /*attach point on handle, body coords=*/new Vector(0, 2.8),
    /*normalType=*/CoordType.BODY
    );
  JointUtil.attachRigidBody(sim,
    s2, /*attach point on s2, body coords=*/new Vector(0, 0),
    handle, /*attach point on handle, body coords*/new Vector(0, 2.8 - handleLength),
    /*normalType=*/CoordType.BODY
    );
  sim.alignConnectors();
};

/** @return {number} */
getHandleForce() {
  return this.handleForce;
};

/** @param {number} value */
setHandleForce(value) {
  this.handleForce = value;
  this.config();
  this.broadcastParameter(DoNothingApp.en.HANDLE_FORCE);
};

/** @return {number} */
getRotateRate() {
  return this.rotateRate;
};

/** @param {number} value */
setRotateRate(value) {
  this.rotateRate = value;
  this.config();
  this.broadcastParameter(DoNothingApp.en.ROTATE_RATE);
};

/** @return {boolean} */
getTightFit() {
  return this.tightFit;
};

/** @param {boolean} value */
setTightFit(value) {
  this.tightFit = value;
  this.config();
  this.broadcastParameter(DoNothingApp.en.TIGHT_FIT);
};

/** @return {boolean} */
getExtraBlock() {
  return this.extraBlock;
};

/** @param {boolean} value */
setExtraBlock(value) {
  this.extraBlock = value;
  this.config();
  this.broadcastParameter(DoNothingApp.en.EXTRA_BLOCK);
};

} // end class

/** Set of internationalized strings.
@typedef {{
  HANDLE_FORCE: string,
  ROTATE_RATE: string,
  TIGHT_FIT: string,
  EXTRA_BLOCK: string,
  HANDLE: string,
  SHUTTLE: string,
  FIXED_BLOCK: string
  }}
*/
DoNothingApp.i18n_strings;

/**
@type {DoNothingApp.i18n_strings}
*/
DoNothingApp.en = {
  HANDLE_FORCE: 'handle force',
  ROTATE_RATE: 'force rotation rate',
  TIGHT_FIT: 'tight fit',
  EXTRA_BLOCK: 'extra block',
  HANDLE: 'handle',
  SHUTTLE: 'shuttle',
  FIXED_BLOCK: 'fixed block'
};

/**
@private
@type {DoNothingApp.i18n_strings}
*/
DoNothingApp.de_strings = {
  HANDLE_FORCE: 'Griff Kraft',
  ROTATE_RATE: 'Kraft, Rotation Tempo',
  TIGHT_FIT: 'exakt passend',
  EXTRA_BLOCK: 'extra Block',
  HANDLE: 'Griff',
  SHUTTLE: 'Shuttle',
  FIXED_BLOCK: 'Festblock'
};

/**
@private
@type {DoNothingApp.i18n_strings}
*/
DoNothingApp.es_strings = {
  HANDLE_FORCE: 'Fuerza de agarre',
  ROTATE_RATE: 'Tasa de fuerza de rotación',
  TIGHT_FIT: 'Ajuste exacto',
  EXTRA_BLOCK: 'Bloque adicional',
  HANDLE: 'Agarre',
  SHUTTLE: 'Lanzador',
  FIXED_BLOCK: 'Bloque fijo'
};

/** Set of internationalized strings.
@type {DoNothingApp.i18n_strings}
*/
DoNothingApp.i18n = DoNothingApp.en;
switch(goog.LOCALE) {
  case 'de':
    DoNothingApp.i18n = DoNothingApp.de_strings;
    break;
  case 'es':
    DoNothingApp.i18n = DoNothingApp.es_strings;
    break;
  default:
    DoNothingApp.i18n = DoNothingApp.en;
    break;
};

/**
* @param {!Object} elem_ids
* @return {!DoNothingApp}
*/
function makeDoNothingApp(elem_ids) {
  return new DoNothingApp(elem_ids);
};
goog.exportSymbol('makeDoNothingApp', makeDoNothingApp);

exports = DoNothingApp;
