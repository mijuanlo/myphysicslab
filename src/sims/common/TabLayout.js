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

goog.module('myphysicslab.sims.common.TabLayout');

const array = goog.require('goog.array');
const dom = goog.require('goog.dom');
const style = goog.require('goog.style');
const events = goog.require('goog.events');
const EventType = goog.require('goog.events.EventType');

const AbstractSubject = goog.require('myphysicslab.lab.util.AbstractSubject');
const CommonControls = goog.require('myphysicslab.sims.common.CommonControls');
const LabCanvas = goog.require('myphysicslab.lab.view.LabCanvas');
const LabControl = goog.require('myphysicslab.lab.controls.LabControl');
const Layout = goog.require('myphysicslab.sims.common.Layout');
const ParameterBoolean = goog.require('myphysicslab.lab.util.ParameterBoolean');
const ParameterNumber = goog.require('myphysicslab.lab.util.ParameterNumber');
const ParameterString = goog.require('myphysicslab.lab.util.ParameterString');
const SubjectList = goog.require('myphysicslab.lab.util.SubjectList');
const Terminal = goog.require('myphysicslab.lab.util.Terminal');
const Util = goog.require('myphysicslab.lab.util.Util');

/** TabLayout is a tab-based layout for showing a simulation, graph, and controls.
TabLayout implements specific ways to present the application on the web page, in this
case with a tab-based layout. TabLayout creates and manages various layout elements
(LabCanvas, `div` for controls, Terminal, etc.). It also defines regular expressions
for easy Terminal scripting of these objects using short names such as terminal,
simCanvas, graphCanvas.

### Element IDs

TabLayout constructor takes an argument that specifies the names of the HTML
elements to look for in the HTML document; these elements are where the user
interface of the simulation is created. This allows for having two separate instances
of the same simulation running concurrently on a single page.

These are the names expected to be in the element IDs object:

+  tab_list
+  container
+  term_output
+  term_input
+  sim_applet
+  div_graph
+  graph_controls
+  sim_controls
+  div_terminal
+  div_time_graph
+  time_graph_controls
+  label_terminal
+  show_terminal
+  show_sim
+  images_dir

### Layouts

There are 7 layouts:

+ *sim* shows sim-view and sim-controls
+ *graph* shows graph and graph-controls
+ *sim+graph* show graph, sim-view, and graph-controls
+ *time_graph* shows time-graph and time-graph-controls
+ *sim+time_graph*  shows time-graph and sim-view, and time-graph-controls
+ *multi_graph*  shows graph and time-graph
+ *sim+multi_graph*  shows graph, time-graph and sim-view

### Layout Tabs

The set of layout tabs is contained in a UL list. Each tab has a `className` property
which identifies the name of the tab. Clicking on a tab will change the layout.

The selected tab also has the class 'selected', for example 'sim selected' would be the
`className` of the sim tab when it is selected.

The layout tabs are expected to be:

+ sim: selects the 'sim' layout
+ graph:  selects the 'sim+graph' layout
+ time_graph: selects the 'sim+time_graph' layout
+ multi_graph: selects the 'sim+multi_graph' layout

Note that each graph tab corresponds to two different layouts: with or without the sim
view.

### 'Show Sim' Checkbox

The 'show sim' checkbox is visible in the graph views. Clicking the 'show sim' checkbox
will change the layout to pick the appropriate version of the current layout, for
example either 'sim+graph' or 'graph'. The method {@link #showSim} can be used from
JavaScript to accomplish the same result.

### Size of Sim, Graph, TimeGraph

There are three 'levels' which affect how the Simulation, Graph and TimeGraph appear:

1. There are Parameters for `SIM_WIDTH, GRAPH_WIDTH, TIME_GRAPH_WIDTH`. These stretch
or shrink the canvas, without changing the resolution of the canvas (the canvas screen
rectangle remains the same). These set the width of the <DIV> surrounding the
LabCanvas's to that fraction of the window width, and the canvas stretches or shrinks
to fit into the <DIV>. These Parameters only apply when a single canvas (Sim, Graph, or
TimeGraph) is shown alone without another canvas alongside. When there are two or more
canvases then we always use 49% width to fit two canvases side-by-side.

2. LabCanvas Parameters for `WIDTH, HEIGHT`: These set the pixel density (resolution)
and shape (ratio of width to height) of the canvas. These determine the ScreenRect that
is passed to the LabViews. The size of the Simulation LabCanvas is set according to
arguments passed to the TabLayout constructor. In contrast, the Graph and TimeGraph
LabCanvas are always square shaped. Their size is the bigger of the Sim LabCanvas width
or height. The size of any LabCanvas can be changed after construction if desired.

3. SimView Parameters for `WIDTH, HEIGHT, CENTER_X, CENTER_Y, VERTICAL_ALIGN`, etc.
These affect only the SimRect, which determines simulation coordinates. Pan and zoom of
the image can be done by changing these Parameters.

### Layout Of Controls

We use CSS style `display: inline-block` on the controls div, so that it naturally flows
to right of the canvas if there is enough room, otherwise it flows below the canvas. The
method `alignCanvasControls()` attempts to set the controls to have 2 columns when the
controls are below the canvas.

We set the canvases to 'float: left' so that the 'show sim' and 'show terminal' controls
will flow under the controls div.

The individual controls have `display: block` and are styled with CSS.

### Terminal Checkbox

A 'show terminal' checkbox is added to the controls div in all layouts, unless the
`opt_terminal` parameter is false.

When using advanced-optimizations compile mode the Terminal can still be used for
EasyScript commands. However general Javascript will not work because
all method and class names are minified and unused code is eliminated.

Parameters Created
------------------

+ ParameterNumber named `SIM_WIDTH`, see {@link #setSimWidth}

+ ParameterNumber named `GRAPH_WIDTH`, see {@link #setGraphWidth}

+ ParameterNumber named `TIME_GRAPH_WIDTH`, see {@link #setTimeGraphWidth}

+ ParameterString named `LAYOUT`, see {@link #setLayout}

+ ParameterBoolean named `SHOW_TERMINAL`, see {@link #showTerminal}

* @implements {SubjectList}
* @implements {Layout}
*/
class TabLayout extends AbstractSubject {
/**
* @param {!Object} elem_ids specifies the names of the HTML
*    elements to look for in the HTML document; these elements are where the user
*    interface of the simulation is created.
* @param {number=} canvasWidth width of sim canvas in pixels, default 800
* @param {number=} canvasHeight height of sim canvas in pixels, default 800
* @param {boolean=} opt_terminal whether to add the 'show terminal' checkbox, default
*    is true
*/
constructor(elem_ids, canvasWidth, canvasHeight, opt_terminal) {
  super('TAB_LAYOUT');
  canvasWidth = canvasWidth || 800;
  canvasHeight = canvasHeight || 800;
  opt_terminal = opt_terminal === undefined ? true : opt_terminal;
  /**
  * @type {boolean}
  * @private
  */
  this.limitSize_ = true;
  /** width of simCanvas, as fraction of available width
  * @type {number}
  * @private
  */
  this.simWidth_ = 1;
  /** width of graphCanvas, as fraction of available width
  * @type {number}
  * @private
  */
  this.graphWidth_ = 1;
  /** width of timeGraphCanvas, as fraction of available width
  * @type {number}
  * @private
  */
  this.timeGraphWidth_ = 1;
  Util.setImagesDir(elem_ids['images_dir']);
  /** Whether to put dashed borders around elements for debugging layout.
  * @type {boolean}
  * @const
  */
  this.debug_layout = false;

  /** @type {!HTMLElement}
  * @private
  */
  this.tab_list = Util.getElementById(elem_ids, 'tab_list');
  /** name of current layout
  @type {string}
  @private
  */
  this.layout_ = this.getSelectedTab();
  /** Can disable terminal with this flag.
  * @type {boolean}
  * @private
  * @const
  */
  this.terminalEnabled_ = opt_terminal;
  if (this.layout_ == '') {
    this.layout_ = TabLayout.Layout.SIM;
    this.setSelectedTab(this.layout_);
  }

  // when click on a tab (other than current selected tab) we switch to that layout.
  events.listen(this.tab_list, EventType.CLICK,
      e => {
        const target = /** @type {Element} */(e.target);
        if (target === undefined) {
          throw 'event target is undefined';
        }
        if (target == null || target.tagName != 'LI') {
          return;
        }
        if (target.className.indexOf('selected') > -1) {
          // do nothing when click on selected tab
          return;
        }
        this.setLayoutFromTab(target.className);
      });

  events.listen(window, EventType.RESIZE,
      () => this.redoLayout() );
  events.listen(window, EventType.ORIENTATIONCHANGE,
      () => this.redoLayout() );

  const term_output = /**@type {?HTMLInputElement}*/
      (Util.maybeElementById(elem_ids, 'term_output'));
  /**
  * @type {?HTMLInputElement}
  * @private
  */
  this.term_input = /**@type {?HTMLInputElement}*/
      (Util.maybeElementById(elem_ids, 'term_input'));
  /** @type {!Terminal}
  * @private
  */
  this.terminal = new Terminal(this.term_input, term_output);
  Terminal.stdRegex(this.terminal);

  /** @type {!HTMLElement}
  * @private
  */
  this.div_contain = Util.getElementById(elem_ids, 'container');
  if (this.debug_layout) {
    this.div_contain.style.border = 'dashed 1px red';
  }

  /** @type {!HTMLElement}
  * @private
  */
  this.div_sim = Util.getElementById(elem_ids, 'sim_applet');
  // 'relative' allows absolute positioning of icon controls over the canvas
  this.div_sim.style.position = 'relative';
  const canvas = /** @type {!HTMLCanvasElement} */(document.createElement('canvas'));
  /* tabIndex = 0 makes the canvas selectable via tab key or mouse, so it can
  * get text events. A value of 0 indicates that the element should be placed in the
  * default navigation order. This allows elements that are not natively focusable
  * (such as <div>, <span>, and ) to receive keyboard focus.
  */
  canvas.tabIndex = 0;
  /** @type {!LabCanvas}
  * @private
  */
  this.simCanvas = new LabCanvas(canvas, 'SIM_CANVAS');
  this.simCanvas.setSize(canvasWidth, canvasHeight);
  this.div_sim.appendChild(this.simCanvas.getCanvas());

  /** The 'show sim' checkbox is added to the graph views.
  * @type {!HTMLInputElement}
  * @private
  */
  this.show_sim_cb = /**@type {!HTMLInputElement}*/
      (Util.getElementById(elem_ids, 'show_sim'));
  const p = dom.getParentElement(this.show_sim_cb);
  if (p == null || p.tagName != 'LABEL') {
    throw '';
  }
  /** @type {!HTMLLabelElement}
  * @private
  */
  this.show_sim_label = /** @type {!HTMLLabelElement} */(p);
  events.listen(this.show_sim_cb, EventType.CLICK,
    e => {
      this.showSim(this.show_sim_cb.checked);
    });

  /** @type {!HTMLElement}
  * @private
  */
  this.div_graph = Util.getElementById(elem_ids, 'div_graph');
  // 'relative' allows absolute positioning of icon controls over the canvas
  this.div_graph.style.position = 'relative';
  const canvas2 = /** @type {!HTMLCanvasElement} */(document.createElement('canvas'));
  /** @type {!LabCanvas}
  * @private
  */
  this.graphCanvas = new LabCanvas(canvas2, 'GRAPH_CANVAS');
  canvasWidth = Math.max(canvasWidth, canvasHeight);
  this.graphCanvas.setSize(canvasWidth, canvasWidth);
  this.div_graph.appendChild(canvas2);

  /** div for graph controls
  * @type {!HTMLElement}
  * @private
  */
  this.graph_controls = Util.getElementById(elem_ids, 'graph_controls');
  if (this.debug_layout) {
    this.graph_controls.style.border = 'dashed 1px green';
  }

  /** @type {!Array<!LabControl>}
  * @private
  */
  this.controls_ = [];
  /** div for sim controls
  * @type {!HTMLElement}
  * @private
  */
  this.sim_controls = Util.getElementById(elem_ids, 'sim_controls');
  // marginLeft gives gap when controls are along side canvas.
  this.sim_controls.style.marginLeft = '10px';
  if (this.debug_layout) {
    this.sim_controls.style.border = 'dashed 1px green';
  }

  /** div element for Terminal
  * @type {!HTMLElement}
  * @private
  */
  this.div_term = Util.getElementById(elem_ids, 'div_terminal');
  this.div_term.style.display = 'none';
  if (this.debug_layout) {
    this.div_term.style.border = 'dashed 1px green';
  }

  // 'show terminal' checkbox.
  const label_term = /**@type {!HTMLInputElement}*/
      (Util.getElementById(elem_ids, 'label_terminal'));
  /**
  * @type {!HTMLInputElement}
  * @private
  */
  this.show_term_cb;
  if (!this.terminalEnabled_) {
    label_term.style.display = 'none';
  } else {
    label_term.style.display = 'inline';
    this.show_term_cb = /**@type {!HTMLInputElement}*/
        (Util.getElementById(elem_ids, 'show_terminal'));
    events.listen(this.show_term_cb, EventType.CLICK,
      e => this.showTerminal(this.show_term_cb.checked) );
  }

  /** @type {!HTMLElement}
  * @private
  */
  this.div_time_graph = Util.getElementById(elem_ids, 'div_time_graph');
  // 'relative' allows absolute positioning of icon controls over the canvas
  this.div_time_graph.style.position = 'relative';
  const canvas3 = /** @type {!HTMLCanvasElement} */(document.createElement('canvas'));
  /** @type {!LabCanvas}
  * @private
  */
  this.timeGraphCanvas = new LabCanvas(canvas3, 'TIME_GRAPH_CANVAS');
  this.timeGraphCanvas.setSize(canvasWidth, canvasWidth);
  this.div_time_graph.appendChild(canvas3);

  /** div for time graph controls
  * @type {!HTMLElement}
  * @private
  */
  this.time_graph_controls = Util.getElementById(elem_ids, 'time_graph_controls');
  if (this.debug_layout) {
    this.time_graph_controls.style.border = 'dashed 1px green';
  }

  this.redoLayout();
  this.addParameter(new ParameterNumber(this, TabLayout.en.SIM_WIDTH,
      TabLayout.i18n.SIM_WIDTH, () => this.getSimWidth(),
      a => this.setSimWidth(a)));
  this.addParameter(new ParameterNumber(this, TabLayout.en.GRAPH_WIDTH,
      TabLayout.i18n.GRAPH_WIDTH, () => this.getGraphWidth(),
      a => this.setGraphWidth(a)));
  this.addParameter(new ParameterNumber(this, TabLayout.en.TIME_GRAPH_WIDTH,
      TabLayout.i18n.TIME_GRAPH_WIDTH, () => this.getTimeGraphWidth(),
      a => this.setTimeGraphWidth(a)));
  this.addParameter(new ParameterString(this, TabLayout.en.LAYOUT,
      TabLayout.i18n.LAYOUT, () => this.getLayout(),
      a => this.setLayout(a),
      TabLayout.getValues(), TabLayout.getValues()));
  if (this.terminalEnabled_) {
    this.addParameter(new ParameterBoolean(this, TabLayout.en.SHOW_TERMINAL,
        TabLayout.i18n.SHOW_TERMINAL,
        () => this.show_term_cb.checked,
        a => this.showTerminal(a) ));
  }
};

/** @override */
toString() {
  return Util.ADVANCED ? '' : this.toStringShort().slice(0, -1)
      +', layout_: "'+this.layout_+'"'
      +', simWidth_: '+Util.NF(this.simWidth_)
      +', graphWidth_: '+Util.NF(this.graphWidth_)
      +', timeGraphWidth_: '+Util.NF(this.timeGraphWidth_)
      +', simCanvas: '+this.simCanvas.toStringShort()
      +', graphCanvas: '+this.graphCanvas.toStringShort()
      +', timeGraphCanvas: '+this.timeGraphCanvas.toStringShort()
      +', terminal: '+this.terminal
      +', controls_: ['
      + this.controls_.map(a => a.toStringShort())
      +']'
      + super.toString();
};

/** @override */
getClassName() {
  return 'TabLayout';
};

/** Returns array containing all possible layout values.
* @return {!Array<!TabLayout.Layout>} array containing all possible layout values
*/
static getValues() {
  const Layout = TabLayout.Layout;
  return [ Layout.SIM,
      Layout.GRAPH,
      Layout.GRAPH_AND_SIM,
      Layout.TIME_GRAPH,
      Layout.TIME_GRAPH_AND_SIM,
      Layout.MULTI_GRAPH,
      Layout.MULTI_GRAPH_AND_SIM
  ];
};

/** @override */
addControl(control, opt_add) {
  opt_add = opt_add === undefined ? true : opt_add;
  if (opt_add) {
    const element = control.getElement();
    element.style.display = 'block';
    this.sim_controls.appendChild(element);
  }
  this.controls_.push(control);
  return control;
};

/** Positions the controls in relation to the canvas. We use CSS style `display:
inline-block` on the controls div, so that it naturally flows to right of the canvas if
there is enough room, otherwise it flows below the canvas. This method attempts to set
the controls to have 2 columns when the controls are below the canvas.
* @param {!HTMLElement} canvas  the div containing the canvas element
* @param {!HTMLElement} controls  the div containing the controls
* @param {!HTMLElement=} canvas2
* @private
*/
alignCanvasControls(canvas, controls, canvas2) {
  canvas.style.display = 'block';
  controls.style.display = 'inline-block';
  controls.style.columnCount = '1';
  controls.style.MozColumnCount = '1';
  controls.style.webkitColumnCount = '1';
  controls.style.width = 'auto';
  // Get the 'natural width' of the controls.
  let ctrl_width = controls.getBoundingClientRect().width;
  // boundingClientRect is sometimes 0, like at startup.
  ctrl_width = ctrl_width > 150 ? ctrl_width : 300;
  // offsetWidth seems more reliable, but is sometimes 0, like at startup
  let cvs_width = canvas.offsetWidth || canvas.getBoundingClientRect().width;
  // When both canvas are visible, use sum of their widths to calculate
  // available width for controls-div.
  if (canvas2 != null) {
    canvas2.style.display = 'block';
    cvs_width += canvas2.offsetWidth || canvas2.getBoundingClientRect().width;
  }
  const contain_width = this.div_contain.offsetWidth ||
      this.div_contain.getBoundingClientRect().width;
  // avail_width = width of space to right of canvas.
  // Subtract 2 makes it work better on Safari...
  const avail_width = contain_width - cvs_width - 2;
  // If (not enough space to right of canvas) then controls will be below canvas.
  // In that case: if (enough space for 2 columns) then do 2 columns
  if (avail_width < ctrl_width && contain_width > 2*ctrl_width) {
    controls.style.width = '100%';
    controls.style.columnCount = '2';
    controls.style.MozColumnCount = '2';
    controls.style.webkitColumnCount = '2';
  }
  /*console.log('alignCanvasControls ctrl_width='+ctrl_width
      +' avail_width='+avail_width
      +' contain_width='+contain_width
      +' cvs_width='+cvs_width
      +' controls.top='+controls.getBoundingClientRect().top
      +' columnCount='+controls.style.columnCount);
  */
};

/** @override */
getGraphCanvas() {
  return this.graphCanvas;
};

/** @override */
getGraphControls() {
  return this.graph_controls;
};

/** @override */
getGraphDiv() {
  return this.div_graph;
};

/** Returns the width of the graph LabCanvas, as fraction of available width
@return {number} width of the graph LabCanvas, as fraction of available width
*/
getGraphWidth() {
  return this.graphWidth_;
};

/** Returns current layout.
@return {string} name of the current layout
*/
getLayout() {
  return this.layout_;
};

/** Returns classname of selected tab
@return {string} classname of selected tab, or empty string if none selected
@private
*/
getSelectedTab() {
  const tab = array.find(this.tab_list.childNodes,
    function(/** !Node */n) {
      if (n.nodeType != Node.ELEMENT_NODE) {
        return false;
      }
      const elem = /** @type {!Element} */(n);
      if (elem.tagName != 'LI') {
        return false;
      }
      return elem.className.match(/.*selected/) != null;
    });
  if (tab == null) {
    return '';
  }
  const tab2 = /** @type {!Element} */(tab);
  // return className minus ' selected'
  return tab2.className.replace(/[ ]*selected/, '');
};

/** @override */
getSimCanvas() {
  return this.simCanvas;
};

/** @override */
getSimControls() {
  return this.sim_controls;
};

/** @override */
getSimDiv() {
  return this.div_sim;
};

/** Returns the width of the simulation LabCanvas, as fraction of available width
@return {number} width of the simulation LabCanvas, as fraction of available width
*/
getSimWidth() {
  return this.simWidth_;
};

/** @override */
getSubjects() {
  return [ this, this.simCanvas, this.graphCanvas, this.timeGraphCanvas ];
};

/** @override */
getTerminal() {
  return this.terminal;
};

/** @override */
getTimeGraphCanvas() {
  return this.timeGraphCanvas;
};

/** @override */
getTimeGraphControls() {
  return this.time_graph_controls;
};

/** @override */
getTimeGraphDiv() {
  return this.div_time_graph;
};

/** Returns the width of the time graph LabCanvas, as fraction of available width
@return {number} width of the time graph LabCanvas, as fraction of available width
*/
getTimeGraphWidth() {
  return this.timeGraphWidth_;
};

/** Redo the current layout, either because the type of layout changed or the size
of the view port changed.
@return {undefined}
@private
*/
redoLayout() {
  // WARNING-NOTE: use goog.style.setFloat() to set float property.
  // Do NOT use style.float (it works in some browsers but is non-standard because
  // 'float' is a javascript reserved word).
  // You can use style.cssFloat, but IE uses a different name: styleFloat.
  // WARNING-NOTE: viewport size can change if scrollbars appear or disappear
  // due to layout changes.
  const Layout = TabLayout.Layout;
  const view_sz = dom.getViewportSize();
  style.setFloat(this.div_sim, 'left');
  style.setFloat(this.div_graph, 'left');
  style.setFloat(this.div_time_graph, 'left');
  switch (this.layout_) {
    case '':
    case Layout.SIM:
      this.div_graph.style.display = 'none';
      this.graph_controls.style.display = 'none';
      this.div_time_graph.style.display = 'none';
      this.time_graph_controls.style.display = 'none';
      this.setDisplaySize(0.95*this.simWidth_, this.div_graph);
      this.alignCanvasControls(this.div_sim, this.sim_controls);
      this.show_sim_label.style.display = 'none';
      break;
    case Layout.GRAPH:
      this.div_sim.style.display = 'none';
      this.sim_controls.style.display = 'none';
      this.div_time_graph.style.display = 'none';
      this.time_graph_controls.style.display = 'none';
      this.setDisplaySize(0.95*this.graphWidth_, this.div_graph);
      this.alignCanvasControls(this.div_graph, this.graph_controls);
      this.show_sim_cb.checked = false;
      this.show_sim_label.style.display = 'inline';
      break;
    case Layout.GRAPH_AND_SIM:
      this.div_time_graph.style.display = 'none';
      this.sim_controls.style.display = 'none';
      this.time_graph_controls.style.display = 'none';
      if (view_sz.width > 600) {
        this.setDisplaySize(0.49, this.div_graph);
      } else {
        this.setDisplaySize(0.95*this.graphWidth_, this.div_graph);
      }
      this.alignCanvasControls(this.div_graph, this.graph_controls, this.div_sim);
      this.show_sim_cb.checked = true;
      this.show_sim_label.style.display = 'inline';
      break;
    case Layout.TIME_GRAPH:
      this.div_graph.style.display = 'none';
      this.graph_controls.style.display = 'none';
      this.div_sim.style.display = 'none';
      this.sim_controls.style.display = 'none';
      this.setDisplaySize(0.95*this.timeGraphWidth_, this.div_time_graph);
      this.alignCanvasControls(this.div_time_graph, this.time_graph_controls);
      this.show_sim_cb.checked = false;
      this.show_sim_label.style.display = 'inline';
      break;
    case Layout.TIME_GRAPH_AND_SIM:
      this.div_graph.style.display = 'none';
      this.sim_controls.style.display = 'none';
      this.graph_controls.style.display = 'none';
      if (view_sz.width > 600) {
        this.setDisplaySize(0.49, this.div_time_graph);
      } else {
        this.setDisplaySize(0.95*this.timeGraphWidth_, this.div_time_graph);
      }
      this.alignCanvasControls(this.div_time_graph, this.time_graph_controls,
          this.div_sim);
      this.show_sim_cb.checked = true;
      this.show_sim_label.style.display = 'inline';
      break;
    case Layout.MULTI_GRAPH:
      this.div_graph.style.display = 'block';
      this.div_time_graph.style.display = 'block';
      this.div_sim.style.display = 'none';
      this.sim_controls.style.display = 'none';
      this.graph_controls.style.display = 'none';
      this.time_graph_controls.style.display = 'none';
      this.setDisplaySize(0.49, this.div_graph);
      this.setDisplaySize(0.49, this.div_time_graph);
      this.show_sim_cb.checked = false;
      this.show_sim_label.style.display = 'inline';
      break;
    case Layout.MULTI_GRAPH_AND_SIM:
      this.div_graph.style.display = 'block';
      this.div_time_graph.style.display = 'block';
      this.div_sim.style.display = 'block';
      this.sim_controls.style.display = 'none';
      this.graph_controls.style.display = 'none';
      this.time_graph_controls.style.display = 'none';
      this.setDisplaySize(0.49, this.div_graph);
      this.setDisplaySize(0.49, this.div_time_graph);
      this.show_sim_cb.checked = true;
      this.show_sim_label.style.display = 'inline';
      break;
    default:
      throw 'redoLayout: no such layout "'+this.layout_+'"';
  }
};

/** Sets the size of the SimCanvas and a graph. This limits the SimCanvas so that it
fits in the window.
* @param {number} max_width size of SimCanvas, as fraction of screen width, from 0 to 1
* @param {!HTMLElement} graph_div
* @private
*/
setDisplaySize(max_width, graph_div) {
  if (this.limitSize_) {
    // Limit size of SimCanvas so it fits in the window.
    // Let divsim_h, divsim_w be dimensions of div_sim in pixels.
    // Let cvs_h, cvs_w be dimensions of canvas in pixels.
    // To ensure that div_sim vertical dimension is all visible:
    //    divsim_h = divsim_w (cvs_h/cvs_w) <= window_h
    //    divsim_w <= window_h (cvs_w/cvs_h)
    // Convert this to fractional width:
    //    (divsim_w/window_w) <= (window_h/window_w) * (cvs_w/cvs_h)
    const window_sz = dom.getViewportSize();
    const window_h = (window_sz.height - 80);
    // Use the container div for width, not the screen. container div is more reliable.
    // This avoids issues with whether scrollbars are visible.
    const window_w = this.div_contain.offsetWidth ||
        this.div_contain.getBoundingClientRect().width;
    const cvs_sz = this.simCanvas.getScreenRect();
    const cvs_w = cvs_sz.getWidth();
    const cvs_h = cvs_sz.getHeight();
    const limit_w = (window_h/window_w) * (cvs_w/cvs_h);
    max_width = Math.min(max_width, limit_w);
  }
  const widthPct = (Math.floor(max_width*100) + '%');
  this.div_sim.style.width = widthPct;
  this.div_sim.style.height = 'auto';
  graph_div.style.width = widthPct;
  graph_div.style.height = 'auto';
};

/** Sets the width of the graph LabCanvas, as fraction of available width.
@param {number} value  width of the graph LabCanvas, as fraction of available width
*/
setGraphWidth(value) {
  if (Util.veryDifferent(value, this.graphWidth_)) {
    this.graphWidth_ = value;
  }
  this.redoLayout();
  this.broadcastParameter(TabLayout.en.GRAPH_WIDTH);
};

/** Sets current layout.
@param {string} layout name of layout
*/
setLayout(layout) {
  const Layout = TabLayout.Layout;
  layout = layout.toLowerCase().trim();
  if (this.layout_ != layout) {
    this.layout_ = layout;
    let tabName = this.layout_;
    //select the appropriate tab when in one of the 'sim+graph' layouts
    switch (tabName) {
      case Layout.GRAPH_AND_SIM:
        tabName = Layout.GRAPH;
        break;
      case Layout.TIME_GRAPH_AND_SIM:
        tabName = Layout.TIME_GRAPH;
        break
      case Layout.MULTI_GRAPH_AND_SIM:
        tabName = Layout.MULTI_GRAPH;
        break
      default:
    }
    this.setSelectedTab(tabName);
    this.redoLayout();
  }
};

/** Sets current layout based on which tab was clicked
@param {string} layout class name of tab that was clicked
*/
setLayoutFromTab(layout) {
  const Layout = TabLayout.Layout;
  layout = layout.toLowerCase().trim();
  // When click on a graph tab, set layout to include sim view also.
  switch (layout) {
    case Layout.GRAPH:
      layout = Layout.GRAPH_AND_SIM;
      break;
    case Layout.TIME_GRAPH:
      layout = Layout.TIME_GRAPH_AND_SIM;
      break
    case Layout.MULTI_GRAPH:
      layout = Layout.MULTI_GRAPH_AND_SIM;
      break
    default:
  }
  this.setLayout(layout);
};

/** Sets selected tab to be the tab with given className
@param {string} layout className of tab
@private
*/
setSelectedTab(layout) {
  if (this.getSelectedTab() != layout) {
    this.tab_list.childNodes.forEach(node => {
      if (node.nodeType != Node.ELEMENT_NODE) {
        // it's not an Element
        return;
      }
      const elem = /** @type {!Element} */(node);
      if (elem.tagName != 'LI') {
        // ignore text elements between the LI elements (usually whitespace)
        return;
      }
      if (elem.className.trim() == layout) {
        // add 'selected' to the className of target Element
        //console.log('* '+li_elem.className);
        elem.className += ' selected';
      } else {
        // remove 'selected' from className of all other elements
        //console.log('> '+li_elem.className);
        if (elem.className.indexOf('selected') > -1) {
          elem.className = elem.className.replace(/[ ]*selected/, '');
        }
      }
    });
  }
};

/** Sets the width of the simulation LabCanvas, as fraction of available width.
@param {number} value  width of the simulation LabCanvas, as fraction of available width
*/
setSimWidth(value) {
  if (Util.veryDifferent(value, this.simWidth_)) {
    this.simWidth_ = value;
  }
  this.redoLayout();
  this.broadcastParameter(TabLayout.en.SIM_WIDTH);
};

/** Sets the width of the time graph LabCanvas, as fraction of available width.
@param {number} value  width of the time graph LabCanvas, as fraction of available width
*/
setTimeGraphWidth(value) {
  if (Util.veryDifferent(value, this.timeGraphWidth_)) {
    this.timeGraphWidth_ = value;
  }
  this.redoLayout();
  this.broadcastParameter(TabLayout.en.TIME_GRAPH_WIDTH);
};

/** Change layout to hide or show simulation view.
@param {boolean} visible whether sim view should be visible
*/
showSim(visible) {
  const Layout = TabLayout.Layout;
  switch (this.layout_) {
    case '':
    case Layout.SIM:
      break;
    case Layout.GRAPH:
      if (visible) {
        this.setLayout(Layout.GRAPH_AND_SIM);
      }
      break;
    case Layout.GRAPH_AND_SIM:
      if (!visible) {
        this.setLayout(Layout.GRAPH);
      }
      break;
    case Layout.TIME_GRAPH:
      if (visible) {
        this.setLayout(Layout.TIME_GRAPH_AND_SIM);
      }
      break;
    case Layout.TIME_GRAPH_AND_SIM:
      if (!visible) {
        this.setLayout(Layout.TIME_GRAPH);
      }
      break;
    case Layout.MULTI_GRAPH:
      if (visible) {
        this.setLayout(Layout.MULTI_GRAPH_AND_SIM);
      }
      break;
    case Layout.MULTI_GRAPH_AND_SIM:
      if (!visible) {
        this.setLayout(Layout.MULTI_GRAPH);
      }
      break;
    default:
      throw 'showSim: no such layout "'+this.layout_+'"';
  }
};

/** Change layout to hide or show terminal text editor.
@param {boolean} visible whether terminal should be visible
*/
showTerminal(visible) {
  if (this.terminalEnabled_) {
    this.div_term.style.display = visible ? 'block' : 'none';
    this.show_term_cb.checked = visible;
    if (visible && this.term_input && !this.terminal.recalling) {
      // Move the focus to Terminal, for ease of typing.
      // (But not when executing a stored script that calls showTerminal).
      this.term_input.focus();
    }
  }
};

} // end class

/** Set of available layout options.
* @readonly
* @enum {string}
*/
TabLayout.Layout = {
  SIM: 'sim',
  GRAPH: 'graph',
  GRAPH_AND_SIM: 'sim+graph',
  TIME_GRAPH: 'time_graph',
  TIME_GRAPH_AND_SIM: 'sim+time_graph',
  MULTI_GRAPH: 'multi_graph',
  MULTI_GRAPH_AND_SIM: 'sim+multi_graph'
};

/** Set of internationalized strings.
@typedef {{
  SIM_WIDTH: string,
  GRAPH_WIDTH: string,
  TIME_GRAPH_WIDTH: string,
  LAYOUT: string,
  SHOW_TERMINAL: string
  }}
*/
TabLayout.i18n_strings;

/**
@type {TabLayout.i18n_strings}
*/
TabLayout.en = {
  SIM_WIDTH: 'sim-width',
  GRAPH_WIDTH: 'graph-width',
  TIME_GRAPH_WIDTH: 'time-graph-width',
  LAYOUT: 'layout',
  SHOW_TERMINAL: 'show terminal'
};

/**
@private
@type {TabLayout.i18n_strings}
*/
TabLayout.de_strings = {
  SIM_WIDTH: 'Sim Breite',
  GRAPH_WIDTH: 'Graf Breite',
  TIME_GRAPH_WIDTH: 'Zeit Graf Breite',
  LAYOUT: 'layout',
  SHOW_TERMINAL: 'zeige Terminal'
};

/**
@private
@type {TabLayout.i18n_strings}
*/
TabLayout.es_strings = {
  SIM_WIDTH: 'Ancho del simulador',
  GRAPH_WIDTH: 'Ancho del gráfico',
  TIME_GRAPH_WIDTH: 'Ancho del gráfico de tiempo',
  LAYOUT: 'disposición',
  SHOW_TERMINAL: 'mostrar terminal'
};

/**
@private
@type {TabLayout.i18n_strings}
*/
TabLayout.ca_strings = {
  SIM_WIDTH: 'Ample del simulador',
  GRAPH_WIDTH: 'Ample del gràfic',
  TIME_GRAPH_WIDTH: 'Ample del gràfic de temps',
  LAYOUT: 'disposició',
  SHOW_TERMINAL: 'mostrar terminal'
};

/** Set of internationalized strings.
@type {TabLayout.i18n_strings}
*/
TabLayout.i18n = TabLayout.en;
switch(goog.LOCALE) {
  case 'de':
    TabLayout.i18n = TabLayout.de_strings;
    break;
  case 'es':
    TabLayout.i18n = TabLayout.es_strings;
    break;
  case 'ca':
    TabLayout.i18n = TabLayout.ca_strings;
    break;
  default:
    TabLayout.i18n = TabLayout.en;
    break;
};

exports = TabLayout;
