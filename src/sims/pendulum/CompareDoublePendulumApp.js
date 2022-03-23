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

goog.module('myphysicslab.sims.pendulum.CompareDoublePendulumApp');

const AbstractSubject = goog.require('myphysicslab.lab.util.AbstractSubject');
const AutoScale = goog.require('myphysicslab.lab.graph.AutoScale');
const CheckBoxControl = goog.require('myphysicslab.lab.controls.CheckBoxControl');
const ChoiceControl = goog.require('myphysicslab.lab.controls.ChoiceControl');
const Clock = goog.require('myphysicslab.lab.util.Clock');
const CollisionAdvance = goog.require('myphysicslab.lab.model.CollisionAdvance');
const CollisionHandling = goog.require('myphysicslab.lab.engine2D.CollisionHandling');
const CommonControls = goog.require('myphysicslab.sims.common.CommonControls');
const CompareGraph = goog.require('myphysicslab.sims.common.CompareGraph');
const CompareTimeGraph = goog.require('myphysicslab.sims.common.CompareTimeGraph');
const ConcreteLine = goog.require('myphysicslab.lab.model.ConcreteLine');
const ContactSim = goog.require('myphysicslab.lab.engine2D.ContactSim');
const DisplayAxes = goog.require('myphysicslab.lab.graph.DisplayAxes');
const DisplayClock = goog.require('myphysicslab.lab.view.DisplayClock');
const DisplayConnector = goog.require('myphysicslab.lab.view.DisplayConnector');
const DisplayGraph = goog.require('myphysicslab.lab.graph.DisplayGraph');
const DisplayList = goog.require('myphysicslab.lab.view.DisplayList');
const DisplayShape = goog.require('myphysicslab.lab.view.DisplayShape');
const DoubleRect = goog.require('myphysicslab.lab.util.DoubleRect');
const DrawingMode = goog.require('myphysicslab.lab.view.DrawingMode');
const EasyScriptParser = goog.require('myphysicslab.lab.util.EasyScriptParser');
const EnergyBarGraph = goog.require('myphysicslab.lab.graph.EnergyBarGraph');
const ExtraAccel = goog.require('myphysicslab.lab.engine2D.ExtraAccel');
const GenericObserver = goog.require('myphysicslab.lab.util.GenericObserver');
const GraphLine = goog.require('myphysicslab.lab.graph.GraphLine');
const GravityLaw = goog.require('myphysicslab.lab.model.GravityLaw');
const Joint = goog.require('myphysicslab.lab.engine2D.Joint');
const LabControl = goog.require('myphysicslab.lab.controls.LabControl');
const NumericControl = goog.require('myphysicslab.lab.controls.NumericControl');
const Parameter = goog.require('myphysicslab.lab.util.Parameter');
const ParameterBoolean = goog.require('myphysicslab.lab.util.ParameterBoolean');
const ParameterNumber = goog.require('myphysicslab.lab.util.ParameterNumber');
const ParameterString = goog.require('myphysicslab.lab.util.ParameterString');
const PointMass = goog.require('myphysicslab.lab.model.PointMass');
const RigidBodyEventHandler = goog.require('myphysicslab.lab.app.RigidBodyEventHandler');
const RigidBodyObserver = goog.require('myphysicslab.sims.engine2D.RigidBodyObserver');
const RigidBodySim = goog.require('myphysicslab.lab.engine2D.RigidBodySim');
const RigidDoublePendulumSim = goog.require('myphysicslab.sims.pendulum.RigidDoublePendulumSim');
const Scrim = goog.require('myphysicslab.lab.engine2D.Scrim');
const SimController = goog.require('myphysicslab.lab.app.SimController');
const SimList = goog.require('myphysicslab.lab.model.SimList');
const SimpleAdvance = goog.require('myphysicslab.lab.model.SimpleAdvance');
const SimRunner = goog.require('myphysicslab.lab.app.SimRunner');
const Simulation = goog.require('myphysicslab.lab.model.Simulation');
const SimView = goog.require('myphysicslab.lab.view.SimView');
const SliderControl = goog.require('myphysicslab.lab.controls.SliderControl');
const TabLayout = goog.require('myphysicslab.sims.common.TabLayout');
const Terminal = goog.require('myphysicslab.lab.util.Terminal');
const Util = goog.require('myphysicslab.lab.util.Util');
const Vector = goog.require('myphysicslab.lab.util.Vector');

// following are only required for possible use in Terminal
const VarsHistory = goog.require('myphysicslab.lab.graph.VarsHistory');
const ExpressionVariable = goog.require('myphysicslab.lab.model.ExpressionVariable');
const FunctionVariable = goog.require('myphysicslab.lab.model.FunctionVariable');
const ClockTask = goog.require('myphysicslab.lab.util.ClockTask');
const GenericMemo = goog.require('myphysicslab.lab.util.GenericMemo');
const DisplayText = goog.require('myphysicslab.lab.view.DisplayText');

/** Compares two double pendulum simulations that are run simultaneously: the
theoretically accurate {@link RigidDoublePendulumSim} and the equivalent double
pendulum using the engine2D physics engine's {@link ContactSim}. The purpose is to show
that the two are closely equivalent.

The angles shown in graphs are modified for the ContactSim so that they are equivalent
to the corresponding RigidDoublePendulumSim angles. The adjustment is given by
{@link RigidDoublePendulumSim#getGamma1} and {@link RigidDoublePendulumSim#getGamma2}.

Creates instance objects such as the simulation and display objects;
defines regular expressions for easy Terminal scripting of these objects using short
names instead of fully qualified property names.

The constructor takes an argument that specifies the names of the HTML elementId's to
look for in the HTML document; these elements are where the user interface of the
simulation is created. This allows for having two separate simulation apps running
concurrently on a single page.

No global variables are created other than two root global variables: the
`myphysicslab` global holds all of the myPhysicsLab classes; and a global variable is
created for this application instance. This application global is created outside of
this file in the HTML where the constructor is called. The name of that global variable
holding the application is passed to defineNames() method so that short-names in scripts
can be properly expanded.
*/
class CompareDoublePendulumApp extends AbstractSubject {
/**
* @param {!Object} elem_ids specifies the names of the HTML
*    elementId's to look for in the HTML document; these elements are where the user
*    interface of the simulation is created.
* @param {boolean} centered determines which pendulum configuration to make: centered
*    (true) or offset (false)
*/
constructor(elem_ids, centered) {
  Util.setErrorHandler();
  super('APP');
  /** horizontal distance between the fixed pivot points of the two sims.
  * @type {number}
  */
  this.separation = 1.0;
  /** @type {!TabLayout} */
  this.layout = new TabLayout(elem_ids);
  this.layout.getSimCanvas().setBackground('black');
  this.layout.getSimCanvas().setAlpha(CommonControls.SHORT_TRAILS);
  // keep reference to terminal to make for shorter 'expanded' names
  /** @type {!Terminal} */
  this.terminal = this.layout.getTerminal();
  const simCanvas = this.layout.getSimCanvas();

  /** @type {!RigidDoublePendulumSim.Parts} */
  this.parts = centered ? RigidDoublePendulumSim.makeCentered(0.25 * Math.PI, 0)
        : RigidDoublePendulumSim.makeOffset(0.25 * Math.PI, 0);
  /** @type {!RigidDoublePendulumSim} */
  this.sim1 = new RigidDoublePendulumSim(this.parts, 'SIM_1');
  /** @type {!SimpleAdvance} */
  this.advance1 = new SimpleAdvance(this.sim1);
  // Ensure that changes to parameters or variables cause display to update
  new GenericObserver(this.sim1, evt => this.sim1.modifyObjects(),
      'modifyObjects after parameter or variable change');

  /** @type {!ContactSim} */
  this.sim2 = new ContactSim('SIM_2');
  /** @type {!CollisionAdvance} */
  this.advance2 = new CollisionAdvance(this.sim2);
  this.terminal.setAfterEval( () => {
      this.sim1.modifyObjects();
      this.sim2.modifyObjects();
    });
  // Ensure that changes to parameters or variables cause display to update
  new GenericObserver(this.sim2, evt => this.sim2.modifyObjects(),
      'modifyObjects after parameter or variable change');
  // These settings are important to stop joints from drifting apart,
  // and have energy be stable.
  this.sim2.setCollisionHandling(CollisionHandling.SERIAL_GROUPED);
  this.sim2.setExtraAccel(ExtraAccel.NONE);
  this.advance2.setJointSmallImpacts(true);
  /** @type {!DoubleRect} */
  this.simRect = new DoubleRect(-2, -2, 2, 2);
  /** @type {!SimView} */
  this.simView = new SimView('simView', this.simRect);
  /** @type {!DisplayList} */
  this.displayList = this.simView.getDisplayList();
  simCanvas.addView(this.simView);
  /** @type {!SimView} */
  this.statusView = new SimView('status', new DoubleRect(-10, -10, 10, 10));
  simCanvas.addView(this.statusView);
  /** @type {!DisplayAxes} */
  this.axes = CommonControls.makeAxes(this.simView, /*bottomLeft=*/true);
  /** @type {!SimRunner} */
  this.simRun = new SimRunner(this.advance1);
  this.simRun.addStrategy(this.advance2);
  this.simRun.addCanvas(simCanvas);
  /** @type {!Clock} */
  this.clock = this.simRun.getClock();
  /** @type {!RigidBodyEventHandler} */
  this.rbeh = new RigidBodyEventHandler(this.sim2, this.clock);
  /** @type {!SimController} */
  this.simCtrl = new SimController(simCanvas, /*eventHandler=*/this.rbeh);
  /** @type {!SimList} */
  this.simList2 = this.sim2.getSimList();
  /** @type {!RigidBodyObserver} */
  this.rbo = new RigidBodyObserver(this.simList2, this.simView.getDisplayList());
  this.rbo.protoDragSpring.setWidth(0.2);
  this.rbo.protoPolygon = new DisplayShape().setDrawCenterOfMass(true)
      .setDrawDragPoints(true);
  // move the parts horizontally so that we can see them side-by-side with other sim
  const pivot = new Vector(this.separation, 0);
  /** @type {!RigidDoublePendulumSim.Parts} */
  this.parts2 = centered ? RigidDoublePendulumSim.makeCentered(0.25 * Math.PI, 0, pivot)
        : RigidDoublePendulumSim.makeOffset(0.25 * Math.PI, 0, pivot);
  const bod0 = this.parts2.bodies[0];
  this.sim2.addBody(bod0);
  this.displayList.findShape(bod0).setFillStyle('#f99');
  const bod1 =this.parts2.bodies[1]
  this.sim2.addBody(bod1);
  this.displayList.findShape(bod1).setFillStyle('#f66');
  this.sim2.addConnectors(this.parts2.joints);
  this.sim2.alignConnectors();
  this.sim2.saveInitialState();
  /** @type {!GravityLaw} */
  this.gravityLaw = new GravityLaw(this.sim1.getGravity(), this.simList2);
  this.sim2.addForceLaw(this.gravityLaw);
  this.gravityLaw.connect(this.simList2);

  const angle1Name = Util.toName(RigidDoublePendulumSim.en.ANGLE_1);
  const angle2Name = Util.toName(RigidDoublePendulumSim.en.ANGLE_2);
  new GenericObserver(this.sim1, evt => {
    if (evt.nameEquals(Simulation.RESET)) {
      // When initial angles are changed in sim, then clock time is also reset.
      // This helps with feedback when dragging angle slider,
      // especially if the clock is running.
      this.clock.setTime(this.sim1.getTime());
    } else if (evt.nameEquals(RigidDoublePendulumSim.en.ANGLE_1) ||
        evt.nameEquals(RigidDoublePendulumSim.en.ANGLE_2)) {
      // When initial angles are changed in sim, set sim2 to use same angles.
      this.sim2.reset();
      const p1 = this.sim2.getBody('pendulum1');
      const p2 = this.sim2.getBody('pendulum2');
      p1.setAngle(this.sim1.getAngle1());
      p2.setAngle(this.sim1.getAngle2());
      p1.setVelocity(new Vector(0,  0),  0);
      p2.setVelocity(new Vector(0,  0),  0);
      this.sim2.alignConnectors();
      this.sim2.saveInitialState();
    }
  }, 'match initial angles');

  // Changing separation doesn't modify initial conditions; so we have to
  // set the separation after a RESET occurs.
  new GenericObserver(this.simRun, evt => {
    if (evt.nameEquals(SimRunner.RESET)) {
      this.setSeparation_();
      this.sim2.saveInitialState();
    }
  }, 'set separation after reset');

  /** @type {!DisplayShape} */
  this.protoRigidBody = new DisplayShape().setDrawCenterOfMass(true);
  /** @type {!DisplayShape} */
  this.bob0 = new DisplayShape(this.parts.bodies[0], this.protoRigidBody)
      .setFillStyle('#3cf');
  this.bob0.setDragable(false);
  this.displayList.add(this.bob0);
  /** @type {!DisplayShape} */
  this.bob1 = new DisplayShape(this.parts.bodies[1], this.protoRigidBody)
      .setFillStyle('#39c');
  this.bob1.setDragable(false);
  this.displayList.add(this.bob1);
  /** @type {!DisplayConnector} */
  this.joint0 = new DisplayConnector(this.parts.joints[0]);
  this.displayList.add(this.joint0);
  /** @type {!DisplayConnector} */
  this.joint1 = new DisplayConnector(this.parts.joints[1]);
  this.displayList.add(this.joint1);
  this.sim1.saveInitialState();

  // adjust sim2 so that it matches potential energy of sim1
  const energyInfo1 = this.sim1.getEnergyInfo();
  const energyInfo2 = this.sim2.getEnergyInfo();
  this.sim2.setPEOffset(energyInfo1.getPotential() - energyInfo2.getPotential() );

  /** @type {!ParameterBoolean} */
  let pb;
  /** @type {!ParameterNumber} */
  let pn;
  /** @type {!ParameterString} */
  let ps;

  // ********* simulation controls  *************
  this.addControl(CommonControls.makePlaybackControls(this.simRun));

  pn = new ParameterNumber(this, CompareDoublePendulumApp.en.SEPARATION,
      CompareDoublePendulumApp.i18n.SEPARATION,
      () => this.getSeparation(), a => this.setSeparation(a));
  this.addParameter(pn);
  this.addControl(new SliderControl(pn, 0, 1, /*multiply=*/false));

  pn = this.sim1.getParameterNumber(RigidDoublePendulumSim.en.GRAVITY);
  this.addControl(new SliderControl(pn, 0, 20, /*multiply=*/false));

  // sync gravity in both sims
  new GenericObserver(this.sim1, evt => {
    if (evt.nameEquals(RigidDoublePendulumSim.en.GRAVITY)) {
      this.gravityLaw.setGravity(this.sim1.getGravity());
    }
  }, 'sync gravity in both sims');

  pn = this.sim1.getParameterNumber(RigidDoublePendulumSim.en.ANGLE_1);
  this.addControl(new SliderControl(pn, -Math.PI, Math.PI, /*multiply=*/false));

  pn = this.sim1.getParameterNumber(RigidDoublePendulumSim.en.ANGLE_2);
  this.addControl(new SliderControl(pn, -Math.PI, Math.PI, /*multiply=*/false));

  pb = this.sim2.getParameterBoolean(RigidBodySim.en.SHOW_FORCES);
  this.addControl(new CheckBoxControl(pb));

  /** @type {!EnergyBarGraph} */
  this.energyGraph1 = new EnergyBarGraph(this.sim1);
  this.energyGraph1.potentialColor = '#039';
  this.energyGraph1.translationColor = '#06c';
  this.energyGraph1.rotationColor = '#6cf';
  /** @type {!ParameterBoolean} */
  this.showEnergyParam1 = CommonControls.makeShowEnergyParam(this.energyGraph1,
      this.statusView, this);
  this.addControl(new CheckBoxControl(this.showEnergyParam1));

  /** @type {!EnergyBarGraph} */
  this.energyGraph2 = new EnergyBarGraph(this.sim2);
  this.energyGraph2.potentialColor = '#903';
  this.energyGraph2.translationColor = '#f33';
  this.energyGraph2.rotationColor = '#f99';
  this.energyGraph2.setPosition(new Vector(0, 6));
  /** @type {!ParameterBoolean} */
  this.showEnergyParam2 = CommonControls.makeShowEnergyParam(this.energyGraph2,
      this.statusView, this, CompareDoublePendulumApp.en.SHOW_ENERGY_2,
      CompareDoublePendulumApp.i18n.SHOW_ENERGY_2);
  this.addControl(new CheckBoxControl(this.showEnergyParam2));

  /** @type {!DisplayClock} */
  this.displayClock = new DisplayClock( () => this.sim1.getTime(),
      () => this.clock.getRealTime(), /*period=*/2, /*radius=*/2);
  this.displayClock.setPosition(new Vector(8, 4));
  pb = CommonControls.makeShowClockParam(this.displayClock, this.statusView, this);
  this.addControl(new CheckBoxControl(pb));

  const panzoom_simview = CommonControls.makePanZoomControls(this.simView,
      /*overlay=*/true, () => this.simView.setSimRect(this.simRect));
  this.layout.getSimDiv().appendChild(panzoom_simview);
  pb = CommonControls.makeShowPanZoomParam(panzoom_simview, this);
  pb.setValue(false);
  this.addControl(new CheckBoxControl(pb));

  pn = this.simRun.getParameterNumber(SimRunner.en.TIME_STEP);
  this.addControl(new NumericControl(pn));
  pn = this.simRun.getClock().getParameterNumber(Clock.en.TIME_RATE);
  this.addControl(new NumericControl(pn));
  const bm = CommonControls.makeBackgroundMenu(this.layout.getSimCanvas());
  this.addControl(bm);

  const gamma1 = this.sim1.getGamma1();
  const gamma2 = this.sim1.getGamma2();
  const line1 = new GraphLine('GRAPH_LINE_1', this.sim1.getVarsList());
  line1.setXVariable(0);
  line1.setYVariable(2);
  line1.setColor('blue');
  line1.setDrawingMode(DrawingMode.DOTS);

  const line2 = new GraphLine('GRAPH_LINE_2', this.sim2.getVarsList());
  line2.setXVariable(8);
  line2.setYVariable(14);
  line2.xTransform = function(x, y) { return x + gamma1; };
  line2.yTransform = function(x, y) { return y + gamma2; };
  line2.setColor('red');
  line2.setDrawingMode(DrawingMode.DOTS);

  /** translate variable index of sim1 to equivalent variable of sim2
  * @type {function(number): number}
  */
  const translate = v1 => {
    switch (v1) {
      case 0: return 8; // angle1
      case 1: return 9; // angle1 velocity
      case 2: return 14; // angle2
      case 3: return 15; // angle2 velocity
      case 4: return 1; // kinetic energy
      case 5: return 2; // potential energy
      case 6: return 3; // total energy
      case 7: return 0; // time
      default: throw '';
    }
  };

  // keep line2's X and Y variable in sync with line1
  const paramY = line1.getParameterNumber(GraphLine.en.Y_VARIABLE);
  const paramX = line1.getParameterNumber(GraphLine.en.X_VARIABLE);
  new GenericObserver(line1, evt => {
    if (evt == paramY) {
      const yVar1 = paramY.getValue();
      line2.setYVariable(translate(yVar1));
      // adjust the angles of sim2 to be comparable to those of sim1
      if (yVar1 == 0) {
        line2.yTransform = function(x, y) { return y + gamma1; };
      } else if (yVar1 == 2) {
        line2.yTransform = function(x, y) { return y + gamma2; };
      } else {
        line2.yTransform = function(x, y) { return y; };
      }
    } else if (evt == paramX) {
      const xVar1 = paramX.getValue();
      line2.setXVariable(translate(xVar1));
      // adjust the angles of sim2 to be comparable to those of sim1
      if (xVar1 == 0) {
        line2.xTransform = function(x, y) { return x + gamma1; };
      } else if (xVar1 == 2) {
        line2.xTransform = function(x, y) { return x + gamma2; };
      } else {
        line2.xTransform = function(x, y) { return x; };
      }
    }
  }, 'keep line2\'s X and Y variable in sync with line1');

  /** @type {!CompareGraph} */
  this.graph = new CompareGraph(line1, line2,
      this.layout.getGraphCanvas(),
      this.layout.getGraphControls(), this.layout.getGraphDiv(), this.simRun);

  const timeLine1 = new GraphLine('TIME_LINE_1', this.sim1.getVarsList());
  timeLine1.setYVariable(0); // angle1
  timeLine1.setColor('blue');
  timeLine1.setDrawingMode(DrawingMode.DOTS);
  const timeLine2 = new GraphLine('TIME_LINE_2', this.sim2.getVarsList());
  timeLine2.setYVariable(8); // angle1
  timeLine2.yTransform = function(x, y) { return y + gamma1; };
  timeLine2.setColor('red');
  timeLine2.setDrawingMode(DrawingMode.DOTS);
  // keep timeLine2's Y variable in sync with timeLine1
  const timeParamY = timeLine1.getParameterNumber(GraphLine.en.Y_VARIABLE);
  new GenericObserver(timeLine1, evt => {
    if (evt == timeParamY) {
      const yVar1 = timeParamY.getValue();
      timeLine2.setYVariable(translate(yVar1));
      // adjust the angles of sim2 to be comparable to those of sim1
      if (yVar1 == 0) {
        timeLine2.yTransform = function(x, y) { return y + gamma1; };
      } else if (yVar1 == 2) {
        timeLine2.yTransform = function(x, y) { return y + gamma2; };
      } else {
        timeLine2.yTransform = function(x, y) { return y; };
      }
    }
  }, 'keep timeLine2\'s Y variable in sync with timeLine1');
  /** @type {!CompareTimeGraph} */
  this.timeGraph = new CompareTimeGraph(timeLine1, timeLine2,
      this.layout.getTimeGraphCanvas(),
      this.layout.getTimeGraphControls(), this.layout.getTimeGraphDiv(), this.simRun);

  let subjects = [
    this,
    this.sim1,
    this.sim2,
    this.simRun,
    this.clock,
    this.simView,
    this.statusView,
    this.gravityLaw,
    this.sim1.getVarsList(),
    this.sim2.getVarsList()
  ];
  subjects = subjects.concat(this.layout.getSubjects(),
      this.graph.getSubjects(), this.timeGraph.getSubjects());
  /** @type {!EasyScriptParser} */
  this.easyScript = CommonControls.makeEasyScript(subjects, [], this.simRun,
      this.terminal);
  this.addControl(CommonControls.makeURLScriptButton(this.easyScript, this.simRun));
  this.graph.addControl(
    CommonControls.makeURLScriptButton(this.easyScript, this.simRun));
  this.timeGraph.addControl(
    CommonControls.makeURLScriptButton(this.easyScript, this.simRun));
};

/** @override */
toString() {
  return Util.ADVANCED ? '' : this.toStringShort().slice(0, -1)
      +', sim1: '+this.sim1.toStringShort()
      +', sim2: '+this.sim2.toStringShort()
      +', terminal: '+this.terminal
      +', graph: '+this.graph
      +', timeGraph: '+this.timeGraph
      + super.toString();
};

/** @override */
getClassName() {
  return 'CompareDoublePendulumApp';
};

/** Define short-cut name replacement rules.  For example 'sim' is replaced
* by 'app.sim' when `myName` is 'app'.
* @param {string} myName  the name of this object, valid in global Javascript context.
* @export
*/
defineNames(myName) {
  if (Util.ADVANCED)
    return;
  this.terminal.addAllowList(myName);
  this.terminal.addRegex('advance1|advance2|axes|clock|displayClock'
      +'|energyGraph1|energyGraph2|graph|layout|sim1|sim2|simCtrl|simList'
      +'|simRect|simRun|simView|statusView|timeGraph|easyScript'
      +'|displayList|bob0|bob1|joint0|joint1|terminal|rbo',
      myName+'.');
  this.terminal.addRegex('simCanvas',
      myName+'.layout.');
};

/** Add the control to the set of simulation controls.
* @param {!LabControl} control
* @return {!LabControl} the control that was passed in
*/
addControl(control) {
  return this.layout.addControl(control);
};

/**
* @return {undefined}
* @export
*/
setup() {
  this.clock.resume();
  this.terminal.parseURLorRecall();
  this.sim1.saveInitialState();
  this.sim1.modifyObjects();
};

/** Start the application running.
* @return {undefined}
* @export
*/
start() {
  this.simRun.startFiring();
  //console.log(Util.prettyPrint(this.toString()));
};

/**
* @param {string} script
* @param {boolean=} opt_output whether to print the result to the output text area and
*    add the script to session history; default is `true`
* @return {*}
* @export
*/
eval(script, opt_output) {
  try {
    return this.terminal.eval(script, opt_output);
  } catch(ex) {
    this.terminal.alertOnce(ex);
  }
};

/** Returns the distance between the fixed pivot points of the two double pendulums.
* @return {number} distance between the fixed pivot points
*/
getSeparation() {
  return this.separation;
};

/** Sets the distance between the fixed pivot points of the two double pendulums.
* @param {number} value distance between the fixed pivot points
*/
setSeparation(value) {
  if (this.separation != value) {
    this.separation = value;
    this.setSeparation_();
    this.broadcastParameter(CompareDoublePendulumApp.en.SEPARATION);
  }
};

/**
* @return {undefined}
* @private
*/
setSeparation_() {
    // Because Joint is immutable we have to replace with a different Joint.
    // (Alternative: connect to an infinite mass 'anchor' body instead of Scrim, and
    // then move the anchor body).
    this.sim2.getConnectors().forEach(connector => {
      if (!(connector instanceof Joint)) {
        return;
      }
      const joint = /** @type {!Joint} */(connector);
      if (joint.getBody1() == Scrim.getScrim()) {
        this.sim2.removeConnector(joint);
        // same joint info, except different attachment point
        const j_new = new Joint(
          joint.getBody1(), /*attach_body=*/new Vector(this.separation, 0),
          joint.getBody2(), /*attach_body=*/joint.getAttach2(),
          joint.getNormalType(), joint.getNormal()
        );
        // 'follow=null' means: add to front of list of connectors
        // (order is significant when doing alignConnectors)
        this.sim2.addConnector(j_new, /*follow=*/null);
      }
    });
    this.sim2.alignConnectors();
};

} // end class

/** Set of internationalized strings.
@typedef {{
  SEPARATION: string,
  SHOW_ENERGY_2: string
  }}
*/
CompareDoublePendulumApp.i18n_strings;

/**
@private
@type {CompareDoublePendulumApp.i18n_strings}
*/
CompareDoublePendulumApp.en = {
  SEPARATION: 'separation',
  SHOW_ENERGY_2: 'show energy 2'
};

/**
@private
@type {CompareDoublePendulumApp.i18n_strings}
*/
CompareDoublePendulumApp.de_strings = {
  SEPARATION: 'Abstand',
  SHOW_ENERGY_2: 'Energieanzeige 2'
};

/**
@private
@type {CompareDoublePendulumApp.i18n_strings}
*/
CompareDoublePendulumApp.es_strings = {
  SEPARATION: 'Separación',
  SHOW_ENERGY_2: 'Mostrar energía 2'
};

/**
@private
@type {CompareDoublePendulumApp.i18n_strings}
*/
CompareDoublePendulumApp.ca_strings = {
  SEPARATION: 'Separació',
  SHOW_ENERGY_2: 'Mostrar energia 2'
};

/** Set of internationalized strings.
@type {CompareDoublePendulumApp.i18n_strings}
*/
CompareDoublePendulumApp.i18n = CompareDoublePendulumApp.en;
switch(goog.LOCALE) {
  case 'de':
    CompareDoublePendulumApp.i18n = CompareDoublePendulumApp.de_strings;
    break;
  case 'es':
    CompareDoublePendulumApp.i18n = CompareDoublePendulumApp.es_strings;
    break;
  case 'ca':
    CompareDoublePendulumApp.i18n = CompareDoublePendulumApp.ca_strings;
    break;
  default:
    CompareDoublePendulumApp.i18n = CompareDoublePendulumApp.en;
    break;
};

/**
* @param {!Object} elem_ids
* @param {boolean} centered determines which pendulum configuration to make: centered
*    (true) or offset (false)
* @return {!CompareDoublePendulumApp}
*/
function makeCompareDoublePendulumApp(elem_ids, centered) {
  return new CompareDoublePendulumApp(elem_ids, centered);
};
goog.exportSymbol('makeCompareDoublePendulumApp', makeCompareDoublePendulumApp);

exports = CompareDoublePendulumApp;
