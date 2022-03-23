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

goog.module('myphysicslab.sims.common.TimeGraph2');

const AutoScale = goog.require('myphysicslab.lab.graph.AutoScale');
const ButtonControl = goog.require('myphysicslab.lab.controls.ButtonControl');
const CheckBoxControl = goog.require('myphysicslab.lab.controls.CheckBoxControl');
const ChoiceControl = goog.require('myphysicslab.lab.controls.ChoiceControl');
const CommonControls = goog.require('myphysicslab.sims.common.CommonControls');
const DisplayAxes = goog.require('myphysicslab.lab.graph.DisplayAxes');
const DisplayGraph = goog.require('myphysicslab.lab.graph.DisplayGraph');
const DisplayList = goog.require('myphysicslab.lab.view.DisplayList');
const DoubleRect = goog.require('myphysicslab.lab.util.DoubleRect');
const GenericObserver = goog.require('myphysicslab.lab.util.GenericObserver');
const GraphLine = goog.require('myphysicslab.lab.graph.GraphLine');
const HorizAlign = goog.require('myphysicslab.lab.view.HorizAlign');
const LabCanvas = goog.require('myphysicslab.lab.view.LabCanvas');
const LabControl = goog.require('myphysicslab.lab.controls.LabControl');
const LabView = goog.require('myphysicslab.lab.view.LabView');
const NumericControl = goog.require('myphysicslab.lab.controls.NumericControl');
const ParameterBoolean = goog.require('myphysicslab.lab.util.ParameterBoolean');
const ParameterNumber = goog.require('myphysicslab.lab.util.ParameterNumber');
const ParameterString = goog.require('myphysicslab.lab.util.ParameterString');
const Printable = goog.require('myphysicslab.lab.util.Printable');
const SimRunner = goog.require('myphysicslab.lab.app.SimRunner');
const SimView = goog.require('myphysicslab.lab.view.SimView');
const SubjectList = goog.require('myphysicslab.lab.util.SubjectList');
const Util = goog.require('myphysicslab.lab.util.Util');
const VarsList = goog.require('myphysicslab.lab.model.VarsList');
const VerticalAlign = goog.require('myphysicslab.lab.view.VerticalAlign');

/** Creates two independent graphs which have a common horizontal time axis, but the
graphs can have very different vertical scales. Each graph consists of a SimView,
GraphLine, DisplayGraph, AutoScale, DisplayAxes. This makes it possible to see together
two GraphLines with very different scales. The horizontal variable can be changed to
something other than time, but we ensure that both graphs have the same horizontal
variable.

Creates several controls to modify the graph (but no pan-zoom control because
it gets too confusing with the independent graphs).

Each graph has its own DisplayAxes, which are shown in the same color as the GraphLine.
One of the axes are placed on the right, and the other is on the left.

* @implements {Printable}
* @implements {SubjectList}
*/
class TimeGraph2 {
/**
* @param {!VarsList} varsList the VarsList to collect
*   data from
* @param {!LabCanvas} graphCanvas the LabCanvas where the graph
*   should appear
* @param {!Element} div_controls the HTML div where controls should be added
* @param {!Element} div_graph the HTML div where the graphCanvas is located
* @param {!SimRunner} simRun the SimRunner controlling the
*   overall app
*/
constructor(varsList, graphCanvas, div_controls, div_graph, simRun) {
  /** @type {!LabCanvas} */
  this.canvas = graphCanvas;
  simRun.addCanvas(graphCanvas);
  /** @type {!SimView} */
  this.view1 = new SimView('TIME_GRAPH_1', new DoubleRect(0, 0, 1, 1));
  this.view1.setHorizAlign(HorizAlign.FULL);
  this.view1.setVerticalAlign(VerticalAlign.FULL);
  graphCanvas.addView(this.view1);
  /** @type {!DisplayList} */
  this.displayList1 = this.view1.getDisplayList();
  /** @type {!DisplayAxes} */
  this.axes1 = CommonControls.makeAxes(this.view1);
  this.axes1.setColor('lime');
  /** @type {!GraphLine} */
  this.line1 = new GraphLine('TIME_LINE_1', varsList);
  new GenericObserver(this.line1, evt => {
    if (evt.nameEquals(GraphLine.en.X_VARIABLE)) {
      this.axes1.setHorizName(this.line1.getXVarName());
    }
    if (evt.nameEquals(GraphLine.en.Y_VARIABLE)) {
      this.axes1.setVerticalName(this.line1.getYVarName());
    }
  }, 'update axes1 names');
  this.line1.setColor('lime');
  this.view1.addMemo(this.line1);
  /** @type {!AutoScale} */
  this.autoScale1 = new AutoScale('TIME_GRAPH_AUTO_SCALE_1', this.line1, this.view1);
  this.autoScale1.extraMargin = 0.05;
  /** @type {!DisplayGraph} */
  this.displayGraph1 = new DisplayGraph(this.line1);
  this.displayGraph1.setScreenRect(this.view1.getScreenRect());
  // Don't use off-screen buffer because the auto-scale causes graph to redraw
  // every frame.  Therefore no time savings from off-screen buffer.
  this.displayGraph1.setUseBuffer(false);
  this.displayList1.prepend(this.displayGraph1);
  // inform displayGraph1 when the screen rect changes.
  new GenericObserver(this.view1, evt => {
      if (evt.nameEquals(LabView.SCREEN_RECT_CHANGED)) {
        this.displayGraph1.setScreenRect(this.view1.getScreenRect());
      }
    }, 'resize DisplayGraph1');

  const timeIdx = this.line1.getVarsList().timeIndex();
  this.line1.setXVariable(timeIdx);
  this.line1.setYVariable(0);

  /** @type {!SimView} */
  this.view2 = new SimView('TIME_GRAPH_2', new DoubleRect(0, 0, 1, 1));
  this.view2.setHorizAlign(HorizAlign.FULL);
  this.view2.setVerticalAlign(VerticalAlign.FULL);
  graphCanvas.addView(this.view2);
  this.displayList2 = this.view2.getDisplayList();
  /** @type {!DisplayAxes} */
  this.axes2 = CommonControls.makeAxes(this.view2);
  this.axes2.setColor('red');
  this.axes2.setYAxisAlignment(HorizAlign.RIGHT);
  /** @type {!GraphLine} */
  this.line2 = new GraphLine('TIME_LINE_2', varsList);
  new GenericObserver(this.line2, evt => {
    if (evt.nameEquals(GraphLine.en.X_VARIABLE)) {
      this.axes2.setHorizName(this.line2.getXVarName());
    }
    if (evt.nameEquals(GraphLine.en.Y_VARIABLE)) {
      this.axes2.setVerticalName(this.line2.getYVarName());
    }
  }, 'update axes2 names');
  this.view2.addMemo(this.line2);
  this.line2.setXVariable(timeIdx);
  this.line2.setYVariable(1);
  this.line2.setColor('red');
  /** @type {!AutoScale} */
  this.autoScale2 = new AutoScale('TIME_GRAPH_AUTO_SCALE_2', this.line2, this.view2);
  this.autoScale2.extraMargin = 0.05;
  /** @type {!DisplayGraph} */
  this.displayGraph2 = new DisplayGraph(this.line2);
  this.displayGraph2.setScreenRect(this.view2.getScreenRect());
  // Don't use off-screen buffer because the auto-scale causes graph to redraw
  // every frame.  Therefore no time savings from off-screen buffer.
  this.displayGraph2.setUseBuffer(false);
  this.displayList2.prepend(this.displayGraph2);
  // inform displayGraph2 when the screen rect changes.
  new GenericObserver(this.view2, evt => {
      if (evt.nameEquals(LabView.SCREEN_RECT_CHANGED)) {
        this.displayGraph2.setScreenRect(this.view2.getScreenRect());
      }
    }, 'resize DisplayGraph2');

  /** @type {!Array<!LabControl>} */
  this.controls_ = [];
  /** @type {!Element} */
  this.div_controls = div_controls;

  this.addControl(CommonControls.makePlaybackControls(simRun));

  let pn = this.line1.getParameterNumber(GraphLine.en.Y_VARIABLE);
  this.addControl(new ChoiceControl(pn, TimeGraph2.i18n.LIME));
  pn = this.line2.getParameterNumber(GraphLine.en.Y_VARIABLE);
  this.addControl(new ChoiceControl(pn, TimeGraph2.i18n.RED));
  pn = this.line1.getParameterNumber(GraphLine.en.X_VARIABLE);
  this.addControl(new ChoiceControl(pn, 'X:'));
  pn = this.autoScale1.getParameterNumber(AutoScale.en.TIME_WINDOW)
  this.addControl(new NumericControl(pn));
  const bc = new ButtonControl(GraphLine.i18n.CLEAR_GRAPH,
      () => {
        this.line1.reset();
        this.line2.reset();
      });
  this.addControl(bc);
  /** GenericObserver ensures autoScale2 has same time window as autoScale1
  * @type {!GenericObserver}
  */
  this.auto1Obs = new GenericObserver(this.autoScale1,
      e => this.autoScale2.setTimeWindow(this.autoScale1.getTimeWindow()),
      'ensures autoScale2 has same time window as autoScale1');
  /** GenericObserver ensures line2 has same X variable as line1.
  * @type {!GenericObserver}
  */
  this.line1Obs = new GenericObserver(this.line1, e => {
      // Don't use off-screen buffer with time variable because the auto-scale causes
      // graph to redraw every frame.
      const isTimeGraph = this.line1.getXVariable() == timeIdx;
      this.displayGraph1.setUseBuffer(!isTimeGraph);
      this.displayGraph2.setUseBuffer(!isTimeGraph);
      this.line2.setXVariable(this.line1.getXVariable());
    }, 'ensures line2 has same X variable as line1');
};

/** @override */
toString() {
  return Util.ADVANCED ? '' : 'TimeGraph2{'
    +'canvas: '+this.canvas.toStringShort()
    +', view1: '+this.view1.toStringShort()
    +', view2: '+this.view2.toStringShort()
    +', line1: '+this.line1.toStringShort()
    +', line2: '+this.line2.toStringShort()
    +', axes1: '+this.axes1.toStringShort()
    +', axes2: '+this.axes2.toStringShort()
    +', autoScale1: '+this.autoScale1.toStringShort()
    +', autoScale2: '+this.autoScale2.toStringShort()
    +', displayGraph1: '+this.displayGraph1.toStringShort()
    +', displayGraph2: '+this.displayGraph2.toStringShort()
    +'}';
};

/** @override */
toStringShort() {
  return Util.ADVANCED ? '' : 'TimeGraph2{}';
};

/** Add the control to the set of simulation controls.
* @param {!LabControl} control
* @return {!LabControl} the control that was passed in
*/
addControl(control) {
  const element = control.getElement();
  element.style.display = 'block';
  this.div_controls.appendChild(element);
  this.controls_.push(control);
  return control;
};

/** @override */
getSubjects() {
  return [ this.line1, this.line2, this.view1, this.view2, this.autoScale1,
      this.autoScale2 ];
};

} // end class

/** Set of internationalized strings.
@typedef {{
  LIME: string,
  RED: string
  }}
*/
TimeGraph2.i18n_strings;

/**
@type {TimeGraph2.i18n_strings}
*/
TimeGraph2.en = {
  LIME: 'lime',
  RED: 'red'
};

/**
@private
@type {TimeGraph2.i18n_strings}
*/
TimeGraph2.de_strings = {
  LIME: 'hell grün',
  RED: 'rot'
};

/**
@private
@type {TimeGraph2.i18n_strings}
*/
TimeGraph2.es_strings = {
  LIME: 'lima',
  RED: 'rojo'
};

/**
@private
@type {TimeGraph2.i18n_strings}
*/
TimeGraph2.ca_strings = {
  LIME: 'llima',
  RED: 'roig'
};

/** Set of internationalized strings.
@type {TimeGraph2.i18n_strings}
*/
TimeGraph2.i18n = TimeGraph2.en;
switch(goog.LOCALE) {
  case 'de':
    TimeGraph2.i18n = TimeGraph2.de_strings;
    break;
  case 'es':
    TimeGraph2.i18n = TimeGraph2.es_strings;
    break;
  case 'ca':
    TimeGraph2.i18n = TimeGraph2.ca_strings;
    break;
  default:
    TimeGraph2.i18n = TimeGraph2.en;
    break;
};

exports = TimeGraph2;
