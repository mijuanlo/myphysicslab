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

goog.module('myphysicslab.sims.engine2D.DoublePendulum2App');

const AffineTransform = goog.require('myphysicslab.lab.util.AffineTransform');
const CheckBoxControl = goog.require('myphysicslab.lab.controls.CheckBoxControl');
const ChoiceControl = goog.require('myphysicslab.lab.controls.ChoiceControl');
const CollisionAdvance = goog.require('myphysicslab.lab.model.CollisionAdvance');
const CommonControls = goog.require('myphysicslab.sims.common.CommonControls');
const ContactSim = goog.require('myphysicslab.lab.engine2D.ContactSim');
const CoordType = goog.require('myphysicslab.lab.model.CoordType');
const DampingLaw = goog.require('myphysicslab.lab.model.DampingLaw');
const DisplayShape = goog.require('myphysicslab.lab.view.DisplayShape');
const DoubleRect = goog.require('myphysicslab.lab.util.DoubleRect');
const Engine2DApp = goog.require('myphysicslab.sims.engine2D.Engine2DApp');
const GravityLaw = goog.require('myphysicslab.lab.model.GravityLaw');
const JointUtil = goog.require('myphysicslab.lab.engine2D.JointUtil');
const NumericControl = goog.require('myphysicslab.lab.controls.NumericControl');
const ParameterNumber = goog.require('myphysicslab.lab.util.ParameterNumber');
const Polygon = goog.require('myphysicslab.lab.engine2D.Polygon');
const Scrim = goog.require('myphysicslab.lab.engine2D.Scrim');
const Shapes = goog.require('myphysicslab.lab.engine2D.Shapes');
const SixThrusters = goog.require('myphysicslab.sims.engine2D.SixThrusters');
const ThrusterSet = goog.require('myphysicslab.lab.engine2D.ThrusterSet');
const Util = goog.require('myphysicslab.lab.util.Util');
const Vector = goog.require('myphysicslab.lab.util.Vector');
const Walls = goog.require('myphysicslab.lab.engine2D.Walls');

/** A simple example app using ContactSim, this shows two blocks
connected like a double pendulum, and a third free moving block.

DoublePendulum2App also demonstrates having an image inside a DisplayShape. It uses an
AffineTransform to rotate, scale, and position the image within the DisplayShape.
*/
class DoublePendulum2App extends Engine2DApp {
/**
* @param {!Object} elem_ids specifies the names of the HTML
*    elementId's to look for in the HTML document; these elements are where the user
*    interface of the simulation is created.
*/
constructor(elem_ids) {
  const simRect = new DoubleRect(-6, -6, 6, 6);
  const sim = new ContactSim();
  const advance = new CollisionAdvance(sim);
  super(elem_ids, simRect, sim, advance);
  /** @type {!ContactSim} */
  this.mySim = sim;
  this.layout.getSimCanvas().setBackground('black');
  this.layout.getSimCanvas().setAlpha(CommonControls.SHORT_TRAILS);
  this.mySim.setShowForces(false);
  /** @type {!DampingLaw} */
  this.dampingLaw = new DampingLaw(0, 0.15, this.simList);
  this.mySim.addForceLaw(this.dampingLaw);
  /** @type {!GravityLaw} */
  this.gravityLaw = new GravityLaw(8, this.simList);
  this.mySim.addForceLaw(this.gravityLaw);

  /** @type {!Polygon} */
  this.block1 = Shapes.makeBlock(1, 3, DoublePendulum2App.en.BLOCK+1,
      DoublePendulum2App.i18n.BLOCK+1);
  this.block1.setPosition(new Vector(-1,  -1),  Math.PI/4);
  /** @type {!Polygon} */
  this.block2 = Shapes.makeBlock(1, 3, DoublePendulum2App.en.BLOCK+2,
      DoublePendulum2App.i18n.BLOCK+2);
  this.block2.setPosition(new Vector(0,  0),  0);
  /** @type {!Polygon} */
  this.block3 = Shapes.makeBlock(1, 3, DoublePendulum2App.en.BLOCK+3,
      DoublePendulum2App.i18n.BLOCK+3);
  this.block3.setPosition(new Vector(-4,  -4),  Math.PI/2);
  /** @type {!DisplayShape} */
  this.protoBlock = new DisplayShape().setStrokeStyle('lightGray')
      .setFillStyle('').setThickness(3);
  const b1 = new DisplayShape(this.block1, this.protoBlock);
  this.displayList.add(b1);
  this.mySim.addBody(this.block1);
  const b2 = new DisplayShape(this.block2, this.protoBlock);
  this.displayList.add(b2);
  this.mySim.addBody(this.block2);
  const b3 = new DisplayShape(this.block3, this.protoBlock).setStrokeStyle('orange');
  this.displayList.add(b3);
  this.mySim.addBody(this.block3);

  // demonstrate using an image with DisplayShape.
  const img = /** @type {!HTMLImageElement} */(document.getElementById('tipper'));
  if (goog.isObject(img)) {
    b3.setImage(img);
    let at = AffineTransform.IDENTITY;
    // See notes in DisplayShape:  the origin here is at top left corner
    // of bounding rectangle, and we are in semi-screen coords, except rotated
    // along with the body.  Kind of 'body-screen' coords.
    // Also, think of these happening in reverse order.
    at = at.scale(2.8, 2.8);
    at = at.translate(27, 20);
    at = at.rotate(Math.PI/2);
    b3.setImageAT(at);
    b3.setImageClip(false);
    b3.setNameFont('');
  }

  // draw a gradient for block2, and demo some fancy name options
  const cg = this.layout.getSimCanvas().getContext().createLinearGradient(-1, -1, 1, 1);
  if (cg) {
    cg.addColorStop(0, '#87CEFA'); // light blue
    cg.addColorStop(1, 'white');
    b2.setFillStyle(cg);
  }
  b2.setNameColor('gray');
  b2.setNameFont('12pt sans-serif');
  b2.setNameRotate(Math.PI/2);

  // draw pattern of repeating trucks for block1
  if (goog.isObject(img)) {
    b1.setImageDraw(function(/** !CanvasRenderingContext2D*/context) {
      const pat = context.createPattern(img, 'repeat');
      if (pat != null) {
        context.fillStyle = pat;
        context.fill();
      }
    });
    b1.setNameFont('');
  }

  /* joints to attach upper block to a fixed point, and both blocks together */
  JointUtil.attachFixedPoint(this.mySim,
      this.block2, /*attach_body*/new Vector(0, -1.0), CoordType.WORLD);
  JointUtil.attachRigidBody(this.mySim,
      this.block2, /*attach_body=*/new Vector(0, 1.0),
      this.block1, /*attach_body=*/new Vector(0, 1.0),
      /*normalType=*/CoordType.BODY
    );
  /* move the bodies so their joints line up over each other. */
  this.mySim.alignConnectors();

  const zel = Walls.make2(this.mySim, this.simView.getSimRect());
  this.gravityLaw.setZeroEnergyLevel(zel);

  /* demonstrate using ChainConfig.makeChain
  const options = {
    wallPivotX: -7,
    wallPivotY: 10,
    fixedLeft: true,
    fixedRight: true,
    blockWidth: 1.0,
    blockHeight: 3.0,
    numLinks: 7,
    extraBody: false,
    walls: false
  };
  this.rbo.protoPolygon = new DisplayShape().setStrokeStyle('black');
  ChainConfig.makeChain(this.mySim, options);
  */

  this.mySim.setElasticity(0.8);
  this.mySim.saveInitialState();

  /* thrust forces are operated by pressing keys like up/down/left/right arrows */
  /** @type {!ThrusterSet} */
  this.thrustForce1 = SixThrusters.make(1.0, this.block3);
  /** @type {!ThrusterSet} */
  this.thrustForce2 = SixThrusters.make(1.0, this.block1);
  this.rbeh.setThrusters(this.thrustForce1, 'right');
  this.rbeh.setThrusters(this.thrustForce2, 'left');
  this.mySim.addForceLaw(this.thrustForce1);
  this.mySim.addForceLaw(this.thrustForce2);

  this.addPlaybackControls();
  let pn = this.gravityLaw.getParameterNumber(GravityLaw.en.GRAVITY);
  this.addControl(new NumericControl(pn));
  this.watchEnergyChange(pn);

  pn = this.dampingLaw.getParameterNumber(DampingLaw.en.DAMPING);
  this.addControl(new NumericControl(pn));
  this.addStandardControls();
  this.makeEasyScript();
  this.addURLScriptButton();
  this.graphSetup();
};

/** @override */
toString() {
  return Util.ADVANCED ? '' : this.toStringShort().slice(0, -1)
      +', dampingLaw: '+this.dampingLaw.toStringShort()
      +', gravityLaw: '+this.gravityLaw.toStringShort()
      + super.toString();
};

/** @override */
getClassName() {
  return 'DoublePendulum2App';
};

/** @override */
defineNames(myName) {
  super.defineNames(myName);
  this.terminal.addRegex('gravityLaw|dampingLaw',
       myName+'.');
  this.terminal.addRegex('DoublePendulum2App|Engine2DApp',
       'myphysicslab.sims.engine2D.', /*addToVars=*/false);
};

/** @override */
getSubjects() {
  return super.getSubjects().concat(this.dampingLaw, this.gravityLaw);
};

} // end class

/** Set of internationalized strings.
@typedef {{
  BLOCK: string
  }}
*/
DoublePendulum2App.i18n_strings;

/**
@type {DoublePendulum2App.i18n_strings}
*/
DoublePendulum2App.en = {
  BLOCK: 'block'
};

/**
@private
@type {DoublePendulum2App.i18n_strings}
*/
DoublePendulum2App.de_strings = {
  BLOCK: 'Block'
};

/**
@private
@type {DoublePendulum2App.i18n_strings}
*/
DoublePendulum2App.es_strings = {
  BLOCK: 'Bloque'
};

/**
@private
@type {DoublePendulum2App.i18n_strings}
*/
DoublePendulum2App.ca_strings = {
  BLOCK: 'Bloc'
};

/** Set of internationalized strings.
@type {DoublePendulum2App.i18n_strings}
*/
DoublePendulum2App.i18n = DoublePendulum2App.en;
switch(goog.LOCALE) {
  case 'de':
    DoublePendulum2App.i18n = DoublePendulum2App.de_strings;
    break;
  case 'es':
    DoublePendulum2App.i18n = DoublePendulum2App.es_strings;
    break;
  case 'ca':
    DoublePendulum2App.i18n = DoublePendulum2App.ca_strings;
    break;
  default:
    DoublePendulum2App.i18n = DoublePendulum2App.en;
    break;
};

/**
* @param {!Object} elem_ids
* @return {!DoublePendulum2App}
*/
function makeDoublePendulum2App(elem_ids) {
  return new DoublePendulum2App(elem_ids);
};
goog.exportSymbol('makeDoublePendulum2App', makeDoublePendulum2App);

exports = DoublePendulum2App;
