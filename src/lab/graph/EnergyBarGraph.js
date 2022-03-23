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

goog.module('myphysicslab.lab.graph.EnergyBarGraph');

const asserts = goog.require('goog.asserts');

const DisplayObject = goog.require('myphysicslab.lab.view.DisplayObject');
const DoubleRect = goog.require('myphysicslab.lab.util.DoubleRect');
const EnergyInfo = goog.require('myphysicslab.lab.model.EnergyInfo');
const EnergySystem = goog.require('myphysicslab.lab.model.EnergySystem');
const ScreenRect = goog.require('myphysicslab.lab.view.ScreenRect');
const SimObject = goog.require('myphysicslab.lab.model.SimObject');
const Util = goog.require('myphysicslab.lab.util.Util');
const Vector = goog.require('myphysicslab.lab.util.Vector');

/** Displays a bar graph of the various forms of energy (potential, kinetic, etc.) in an
{@link EnergySystem}. The visible area must be set via
{@link #setVisibleArea} in order for EnergyBarGraph to draw.

### Display Formats

If the {@link EnergyInfo} of the EnergySystem only has data for
the potential and translational energy, then the names shown are 'potential' and
'kinetic' (in English, the names are translated for the current locale). Here is the
display for a typical situation:

*```
* 0                2                4                 6                 8
* ---------- potential ----------  *********** kinetic ***********
*                                                         total  ^
*```

If the EnergyInfo returns a value other than `NaN` for the **rotational energy**, then
the the names shown are 'potential', 'translational', and 'rotational'. Here is the
display for a typical situation:

*```
* 0                2                4                 6                 8
* ----- potential -----  ***** rotational *****  ===== translational ======
*                                                                  total  ^
*```

When potential energy is positive, all the energy components are on the same line of
the graph, as shown above.

When **potential energy is negative**, the potential energy is shown on a
separate line of the bar graph, extending left from the zero position; the kinetic and
rotational energy is drawn underneath the potential energy bar starting from the left.
Here is a typical situation:

*```
*     -2               0               2                 4
* ----- potential -----
* ******* rotational *******  ===== translational ======
*                                                total ^
*```

EnergyBarGraph draws with a transparent white rectangle to ensure it is readable
against a black background.

### Color and Font

Public properties can be set for changing the color of the bars and the font used.
See {@link #graphFont}, {@link #potentialColor}, {@link #translationColor}, and
{@link #rotationColor}.

### Position and Size

The EnergyBarGraph will only draw after the visible area has been set via
{@link #setVisibleArea}. Usually this is set to be the entire visible area of the
{@link myphysicslab.lab.view.LabView} containing the EnergyBarGraph.

The width of the EnergyBarGraph is always the full width of the visible area.

The vertical position of the EnergyBarGraph is initially at the top of the visible area.
If the EnergyBarGraph is not moved, then whenever the visible area is changed we
continue to align the EnergyBarGraph at the top of the visible area.

Once the EnergyBarGraph is moved via {@link #setPosition}, we retain that vertical
position when the visible area changes, except that we ensure the EnergyBarGraph is
entirely within the visible area.

@todo Create some unit tests for this? It is complex enough that it could benefit.
For example, see the kludge about 'energy is zero at startup' which previously resulted
in an assertion failing.

@todo larger fonts (size 14) have formatting problems where the text is overlapping
the color key and other pieces of text. (Nov 2012)

* @implements {DisplayObject}
*/
class EnergyBarGraph {
/**
* @param {!EnergySystem} system the EnergySystem to display
*/
constructor(system) {
  /** The font to use for numbers on the bar chart energy graph, a CSS3 font
  * specification.
  * @type {string}
  */
  this.graphFont = '10pt sans-serif';
  /**
  * @type {!EnergySystem}
  * @private
  */
  this.system_ = system;
  /** the bounding rectangle, in simulation coords
  * @type {!DoubleRect}
  * @private
  */
  this.rect_ = DoubleRect.EMPTY_RECT;
  /**  Font ascent in pixels (guesstimate).
  * @todo find a way to get this for the current font, similar to the
  * TextMetrics object.
  * http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
  * http://pomax.nihongoresources.com/pages/Font.js/
  * @type {number}
  * @private
  */
  this.fontDescent_ = 8;
  /**  Font ascent in pixels (guesstimate).
  * @type {number}
  * @private
  */
  this.fontAscent_ = 12;
  /** where zero energy is in pixels
  * @type {number}
  * @private
  */
  this.graphOrigin_ = 0;
  /** pixels
  * @type {number}
  * @private
  */
  this.leftEdge_ = 0;
  /** pixels
  * @type {number}
  * @private
  */
  this.rightEdge_ = 0;
  /**
  * @type {number}
  * @private
  */
  this.graphFactor_ = 10;  // scale factor from energy to pixels
  /**
  * @type {number}
  * @private
  */
  this.graphDelta_ = 2;  // spacing of the numbers in the bar chart
  /**
  * @type {boolean}
  * @private
  */
  this.needRescale_ = true;
  /** Whether to draw a semi-transparent white rectangle, in case background is black.
  * @type {boolean}
  * @private
  */
  this.drawBackground_ = true;
  /** Color of the potential energy bar, a CSS3 color value
  * @type {string}
  */
  this.potentialColor = '#666';  // dark gray
  /** Color of the translation energy bar, a CSS3 color value
  * @type {string}
  */
  this.translationColor = '#999'; // gray
  /** Color of the rotational energy bar, a CSS3 color value
  * @type {string}
  */
  this.rotationColor = '#ccc'; //lightGray;
  /** when we last checked whether to rescale for small range.
  * we don't want to change the total energy display so fast you can't read it.
  * @type {number}
  * @private
  */
  this.lastTime_ = Util.systemTime();
  /**
  * @type {number}
  * @private
  */
  this.lastTime2_ = 0;
  /**
  * @type {number}
  * @private
  */
  this.totalEnergyDisplay_ = 0;  // the total energy now being displayed
  /**
  * @type {number}
  * @private
  */
  this.lastEnergyDisplay_ = 0;  // the total energy that was last displayed
  /**
  * @type {number}
  * @private
  */
  this.totalDigits_ = 1; // number of digits to show for total energy
  /**
  * @type {number}
  * @private
  * @const
  */
  this.totalEnergyPeriod_ = 0.3; // how long to display the total energy
  /** when total energy was last calculated
  * @type {number}
  * @private
  */
  this.lastTotalEnergyTime_ = Util.NEGATIVE_INFINITY;
  /**
  * @type {number}
  * @private
  */
  this.megaMinEnergy_ = 0;
  /**
  * @type {number}
  * @private
  */
  this.megaMaxEnergy_ = 0;
  /**
  * @type {number}
  * @private
  */
  this.minEnergy_ = 0;
  /**
  * @type {number}
  * @private
  */
  this.maxEnergy_ = 0;
  /**
  * @type {number}
  * @private
  */
  this.totalEnergy_ = 0;
  /**
  * @type {number}
  * @private
  * @const
  */
  this.BUFFER_ = 12;
  /** Each slot in history has the most negative minEnergy during each second for the
  * last BUFFER seconds.
  * @type {!Array<number>}
  * @private
  */
  this.history_ = new Array(this.BUFFER_);
  /**
  * @type {number}
  * @private
  */
  this.bufptr_ = 0; // pointer to next slot in history
  /**
  * @type {boolean}
  * @private
  */
  this.dragable_ = true;
  /**
  * @type {!DoubleRect}
  * @private
  */
  this.visibleRect_ = DoubleRect.EMPTY_RECT;
  /**
  * @type {boolean}
  * @private
  */
  this.needResize_ = true;
  /**
  * @type {number}
  */
  this.zIndex = 0;
  /**
  * @type {boolean}
  * @private
  */
  this.changed_ = true;
  /**
  * @type {boolean}
  * @private
  * @const
  */
  this.debug_ = false;
};

/** @override */
toString() {
  return Util.ADVANCED ? '' : this.toStringShort().slice(0, -1)
      +', visibleRect: '+this.visibleRect_
      +', rect: '+this.rect_
      +', needRescale: '+this.needRescale_
      +', leftEdge: '+Util.NF(this.leftEdge_)
      +', rightEdge: '+Util.NF(this.rightEdge_)
      +', graphOrigin: '+Util.NF(this.graphOrigin_)
      +', graphFactor: '+Util.NF(this.graphFactor_)
      +', minHistory: '+Util.NF(this.minHistory())
      +', minEnergy: '+Util.NF(this.minEnergy_)
      +', megaMinEnergy: '+Util.NF(this.megaMinEnergy_)
      +', megaMinEnergyLoc: '+Math.floor(this.graphOrigin_ + 0.5 +
            this.graphFactor_*this.megaMinEnergy_)
      +', maxEnergy: '+Util.NF(this.maxEnergy_)
      +', megaMaxEnergy: '+Util.NF(this.megaMaxEnergy_)
      +', totalEnergy: '+Util.NF(this.totalEnergy_)
      +', time: '+Util.NF(Util.systemTime()-this.lastTime_)
      +', zIndex: '+this.zIndex
      +'}';
};

/** @override */
toStringShort() {
  return Util.ADVANCED ? '' :
      'EnergyBarGraph{system: '+this.system_.toStringShort()+'}';
};

/** @override */
contains(point) {
  return this.rect_.contains(point);
};

/** @override */
draw(context, map) {
  if (this.visibleRect_.isEmpty())
    return;
  context.save();
  context.font = this.graphFont;
  context.textAlign = 'start';
  context.textBaseline = 'alphabetic';
  const e = this.system_.getEnergyInfo();
  const te = e.getTranslational();
  const pe = e.getPotential();
  const re = e.getRotational();
  let tes2 = EnergyBarGraph.i18n.TRANSLATIONAL_ENERGY+',';
  if (isNaN(re)) {
    tes2 = EnergyBarGraph.i18n.KINETIC_ENERGY+',';
  }
  const height2 = EnergyBarGraph.TOP_MARGIN + 3 * EnergyBarGraph.HEIGHT
      + this.fontAscent_ + 8 + this.fontDescent_;
  const h2 = map.screenToSimScaleY(height2);
  // NOTE WELL: this.rect_ is empty first time thru here!
  if (this.needResize_ || this.rect_.isEmpty()
      || Util.veryDifferent(h2, this.rect_.getHeight())) {
    if (this.debug_ && Util.DEBUG) {
      console.log('h2 = '+h2+' this.rect_.getHeight='+this.rect_.getHeight());
    }
    this.resizeRect(h2);
  }
  if (this.debug_ && Util.DEBUG) {
    const r = map.simToScreenRect(this.rect_);
    context.fillStyle = 'rgba(255,255,0,0.5)'; // transparent yellow
    context.fillRect(r.getLeft(), r.getTop(), r.getWidth(), r.getHeight());
  }
  this.leftEdge_ = map.simToScreenX(this.rect_.getLeft()) + EnergyBarGraph.LEFT_MARGIN;
  this.rightEdge_ = map.simToScreenX(this.rect_.getRight())
      - EnergyBarGraph.RIGHT_MARGIN;
  const maxWidth = this.rightEdge_ - this.leftEdge_;
  const top = map.simToScreenY(this.rect_.getTop());
  if (this.drawBackground_) {
    // draw a semi-transparent white rectangle, in case background is black
    context.fillStyle = 'rgba(255,255,255,0.75)'; // transparent white
    context.fillRect(this.leftEdge_- EnergyBarGraph.LEFT_MARGIN,
        top + EnergyBarGraph.TOP_MARGIN,
        maxWidth + EnergyBarGraph.LEFT_MARGIN + EnergyBarGraph.RIGHT_MARGIN,
        height2);
  }
  // for debugging:  draw outline
  if (this.debug_ && Util.DEBUG) {
    context.strokeStyle = '#90c'; // purple
    context.strokeRect(this.leftEdge_- EnergyBarGraph.LEFT_MARGIN,
        top + EnergyBarGraph.TOP_MARGIN,
        maxWidth+EnergyBarGraph.LEFT_MARGIN+EnergyBarGraph.RIGHT_MARGIN,
        height2);
  }
  //g.setColor(Color.red);  // for debugging, draw outline in red
  //g.drawRect(left, top, width, height);
  this.totalEnergy_ = te + pe + (isNaN(re) ? 0 : re);
  asserts.assert(Math.abs(this.totalEnergy_ - e.getTotalEnergy()) < 1e-12);
  // find the minimum and maximum energy being graphed
  this.minEnergy_ = pe < 0 ? pe : 0;
  this.maxEnergy_ = this.totalEnergy_ > 0 ? this.totalEnergy_ : 0;
  // update the total energy displayed, but not so often you can't read it
  if (Util.systemTime()-this.lastTotalEnergyTime_ > this.totalEnergyPeriod_){
    this.lastTotalEnergyTime_ = Util.systemTime();
    this.lastEnergyDisplay_ = this.totalEnergyDisplay_;
    this.totalEnergyDisplay_ = e.getTotalEnergy();
  }
  //console.log('pe='+pe+'  energy bar total='+total+' maxWidth='+maxWidth);
  this.rescale(maxWidth);
  let w = this.graphOrigin_;
  let w2 = 0;
  // draw a bar chart of the various energy types.
  context.fillStyle = this.potentialColor;
  if (pe < 0) {
    w2 = Math.floor(0.5 - pe*this.graphFactor_);
    context.fillRect(w-w2, top + EnergyBarGraph.TOP_MARGIN, w2,
        EnergyBarGraph.HEIGHT);
    w = w - w2;
  } else {
    w2 = Math.floor(0.5+pe*this.graphFactor_);
    context.fillRect(w, top + EnergyBarGraph.HEIGHT+EnergyBarGraph.TOP_MARGIN, w2,
        EnergyBarGraph.HEIGHT);
    w += w2;
  }
  if (!isNaN(re)) {
    w2 = Math.floor(0.5 + re*this.graphFactor_);
    context.fillStyle = this.rotationColor;
    context.fillRect(w, top + EnergyBarGraph.HEIGHT+EnergyBarGraph.TOP_MARGIN, w2,
        EnergyBarGraph.HEIGHT);
    w += w2;
  }
  w2 = Math.floor(0.5 + te*this.graphFactor_);
  // To stabilize the width of the bar and prevent flickering at the right edge
  // due to rounding in sims where energy is constant,
  // we find where the total should be.
  const totalLoc = this.graphOrigin_ +
    Math.floor(0.5 + this.totalEnergy_ * this.graphFactor_);
  // check this is no more than 2 pixels away from the 'flicker' way to calc.
  asserts.assert(Math.abs(w + w2 - totalLoc) <= 2);
  w2 = totalLoc - w;
  context.fillStyle = this.translationColor;
  context.fillRect(w, top + EnergyBarGraph.HEIGHT+EnergyBarGraph.TOP_MARGIN, w2,
      EnergyBarGraph.HEIGHT);
  // rightEnergy = energy at right-hand edge of the display
  const rightEnergy = (this.rightEdge_ - this.graphOrigin_)/this.graphFactor_;
  const y = this.drawScale(context,
        /*left=*/this.leftEdge_,
        /*top=*/top + EnergyBarGraph.HEIGHT + EnergyBarGraph.TOP_MARGIN,
        /*total=*/rightEnergy);
  // draw legend:  boxes and text
  let x = this.leftEdge_;
  x = this.drawLegend(context, EnergyBarGraph.i18n.POTENTIAL_ENERGY+',',
      this.potentialColor, /*filled=*/true, x, y);
  if (!isNaN(re)) {
    x = this.drawLegend(context, EnergyBarGraph.i18n.ROTATIONAL_ENERGY+',',
      this.rotationColor, /*filled=*/true, x, y);
  }
  x = this.drawLegend(context, tes2, this.translationColor, /*filled=*/true, x, y);
  x = this.drawTotalEnergy(context, x, y);
  context.restore();
};

/**
* @param {!CanvasRenderingContext2D} context the canvas's context to draw into
* @param {string} s
* @param {string} c  CSS3 color
* @param {boolean} filled
* @param {number} x
* @param {number} y
* @return {number}
* @private
*/
drawLegend(context, s, c, filled, x, y) {
  const BOX = 10;
  if (filled) {
    context.fillStyle = c;
    context.fillRect(x, y, BOX, BOX);
  } else {
    context.strokeStyle = c;
    context.strokeRect(x, y, BOX, BOX);
  }
  x += BOX + 3;
  const textWidth = context.measureText(s).width;
  context.fillStyle = '#000'; // black
  context.fillText(s, x, y+this.fontAscent_);
  x += textWidth+5;
  return x;
};

/** Draws the numeric scale for the bar chart.
@param {!CanvasRenderingContext2D} context the canvas's context to draw into
@param {number} left
@param {number} top
@param {number} total
@return {number}
@private
*/
drawScale(context, left, top, total) {
  const graphAscent = this.fontAscent_;
  // don't draw anything when total is zero.
  if (Math.abs(total) > 1E-18 && this.graphDelta_ > 1E-18) {
    context.fillStyle = '#000'; // black
    context.strokeStyle = '#000'; // black
    let scale = 0;
    // draw positive part of scale, from 0 to total
    let loopCtr = 0;
    do {
      const x = this.graphOrigin_ + Math.floor(scale*this.graphFactor_);
      context.beginPath();
      context.moveTo(x, top+EnergyBarGraph.HEIGHT/2);
      context.lineTo(x, top+EnergyBarGraph.HEIGHT+2);
      context.stroke();
      const s = EnergyBarGraph.numberFormat1(scale);
      const textWidth = context.measureText(s).width;
      context.fillText(s, x -textWidth/2, top+EnergyBarGraph.HEIGHT+graphAscent+3);
      scale += this.graphDelta_;
      if (this.debug_ && Util.DEBUG && ++loopCtr > 100) {
        console.log('loop 1 x='+x+' s='+s+' scale='+Util.NFE(scale)
          +' total='+Util.NFE(total)+' graphDelta='+Util.NFE(this.graphDelta_)  );
      }
    } while (scale < total + this.graphDelta_ + 1E-16);
    if (this.debug_ && Util.DEBUG) {
      console.log('megaMinEnergy='+Util.NFE(this.megaMinEnergy_)
        +' graphDelta='+Util.NFE(this.graphDelta_)
        +' graphFactor='+Util.NFE(this.graphFactor_)
        +' scale='+Util.NFE(scale));
    }
    // draw negative part of scale, from -graphDelta to megaMinEnergy
    if (this.megaMinEnergy_ < -1E-12) {
      scale = -this.graphDelta_;
      let x;
      do {
        x = this.graphOrigin_ + Math.floor(scale*this.graphFactor_);
        context.beginPath();
        context.moveTo(x, top+EnergyBarGraph.HEIGHT/2);
        context.lineTo(x, top+EnergyBarGraph.HEIGHT+2);
        context.stroke();
        const s = EnergyBarGraph.numberFormat1(scale);
        const textWidth = context.measureText(s).width;
        context.fillText(s, x -textWidth/2, top+EnergyBarGraph.HEIGHT+graphAscent+3);
        scale -= this.graphDelta_;
        if (this.debug_ && Util.DEBUG) {
          console.log('loop 2 x='+x+' s='+s+' scale='+Util.NFE(scale)
            +' megaMinEnergy='+Util.NFE(this.megaMinEnergy_) );
        }
      } while (scale > this.megaMinEnergy_ && x >= left);
    }
  }
  return top+EnergyBarGraph.HEIGHT+graphAscent+3+this.fontDescent_;
};

/**
* @param {!CanvasRenderingContext2D} context the canvas's context to draw into
* @param {number} x
* @param {number} y
* @return {number}
* @private
*/
drawTotalEnergy(context, x, y) {
  const s = EnergyBarGraph.i18n.TOTAL+' '+
    this.formatTotalEnergy(this.totalEnergyDisplay_, this.lastEnergyDisplay_);
  context.fillStyle = '#000'; // black
  context.fillText(s, x, y+this.fontAscent_);
  return x + context.measureText(s).width + 5;
};

/** Convert number to a string, using a format based on how large the value is,
and the difference from the previous version shown.
Designed to format total energy.
When the total energy does not change (for example when sim is paused)
then we retain the previous setting for number of digits to show.
@param {number} value  the value to be formatted
@param {number} previous  the previous value that was formatted
@return {string}
@private
*/
formatTotalEnergy(value, previous) {
  const diff = Math.abs(value - previous);
  if (diff > 1E-15) {
    // number of decimal places is based on difference to previous value
    const logDiff = -Math.floor(Math.log(diff)/Math.log(10));
    const digits = logDiff > 0 ? logDiff : 1;
    this.totalDigits_ = digits < 20 ? digits : 20;
  }
  const v = Math.abs(value);
  const sign = value < 0 ? '-' : '+';
  if (v < 1E-6) {
    return sign + v.toExponential(5);
  } else if (v < 1000) {
    return sign + v.toFixed(this.totalDigits_);
  } else {
    return sign + v.toFixed(this.totalDigits_);
  }
};

/** @override */
getChanged() {
  if (this.changed_) {
    this.changed_ = false;
    return true;
  }
  return false;
};

/** @override */
getSimObjects() {
  return [];
};

/** @override */
getMassObjects() {
  return [];
};

/** @override */
getPosition() {
  return !this.rect_.isEmpty() ? this.rect_.getCenter() : new Vector(0, 0);
};

/** Returns the area within which this EnergyBarGraph is drawn, in simulation
coordinates.
@return {!DoubleRect} the area within which this
    EnergyBarGraph is drawn, in simulation coordinates.
*/
getVisibleArea() {
  return this.visibleRect_;
};

/** @override */
getZIndex() {
  return this.zIndex;
};

/** @override */
isDragable() {
  return this.dragable_;
};

/**
* @return {number}
* @private
*/
minHistory() {
  let min = 0;
  for (let i=0, len=this.history_.length; i<len; i++) {
    if (this.history_[i] < min)
      min = this.history_[i];
  }
  return min;
};

/** Convert number to a string, using a format based on how large the value is.
Designed to format scale tick marks.
@param {number} value  the value to be formatted
@return {string}
@private
*/
static numberFormat1(value) {
  const v = Math.abs(value);
  let s;
  // use regexp to remove trailing zeros, and maybe decimal point
  if (v < 1E-16) {
    s = '0';
  } else if (v < 1E-3) {
    s = v.toExponential(3);
    s = s.replace(/\.0+([eE])/, '$1');
    s = s.replace(/(\.\d*[1-9])0+([eE])/, '$1$2');
  } else if (v < 10) {
    s = v.toFixed(4);
    s = s.replace(/\.0+$/, '');
    s = s.replace(/(\.\d*[1-9])0+$/, '$1');
  } else if (v < 100) {
    s = v.toFixed(3);
    s = s.replace(/\.0+$/, '');
    s = s.replace(/(\.\d*[1-9])0+$/, '$1');
  } else if (v < 1000) {
    s = v.toFixed(2);
    s = s.replace(/\.0+$/, '');
    s = s.replace(/(\.[1-9])0$/, '$1');
  } else if (v < 10000) {
    s = v.toFixed(0);
  } else {
    s = v.toExponential(3);
    s = s.replace(/\.0+([eE])/, '$1');
    s = s.replace(/(\.\d*[1-9])0+([eE])/, '$1$2');
  }
  return value < 0 ? '-'+s : s;
};

/**
* @param {string} s
* @private
*/
printEverything(s) {
  if (Util.DEBUG && this.debug_) {
    console.log(s + this);
    if (0 == 1) {  // equiv to 'if (false)'
      Util.printArray(this.history_);
    }
  }
};

/**
* @param {number} maxWidth
* @private
*/
rescale(maxWidth) {
  const time_check = this.timeCheck(this.minEnergy_);
  if (Util.DEBUG) { this.printEverything('(status)'); }
  // keep track of most negative min energy value during this time check period
  this.megaMinEnergy_ = this.minHistory();
  asserts.assert(isFinite(this.megaMinEnergy_));
  // Note: Don't rescale when megaMinEnergy is very near to zero.
  if (this.megaMinEnergy_ < -1E-6) {
    // rescale when minEnergy is negative and has gone past left edge
    if (this.graphOrigin_ + Math.floor(0.5 + this.megaMinEnergy_*this.graphFactor_) <
        this.leftEdge_ - EnergyBarGraph.LEFT_MARGIN) {
      if (Util.DEBUG) { this.printEverything('BIG MIN ENERGY'); }
      this.needRescale_ = true;
    }
    if (time_check) {
      // every few seconds, check if minEnergy is staying in smaller negative range
      if (-this.megaMinEnergy_*this.graphFactor_ <
            0.2*(this.graphOrigin_ - this.leftEdge_)) {
        if (Util.DEBUG) { this.printEverything('SMALL MIN ENERGY'); }
        this.needRescale_ = true;
      }
    }
  } else if (this.megaMinEnergy_ > 1E-6) {
    // minEnergy is not negative, ensure left edge is zero
    if (this.graphOrigin_ > this.leftEdge_) {
      if (Util.DEBUG) { this.printEverything('POSITIVE MIN ENERGY'); }
      this.needRescale_ = true;
    }
  } else {
    // megaMinEnergy is small, reset the origin to not show negative numbers
    if (time_check) {
      if (this.graphOrigin_ - this.leftEdge_ > EnergyBarGraph.LEFT_MARGIN) {
        this.needRescale_ = true;
      }
    }
  }
  if (this.totalEnergy_ > this.megaMaxEnergy_)
    this.megaMaxEnergy_ = this.totalEnergy_;
  // Note: Don't rescale when totalEnergy is very near to zero.
  if (this.totalEnergy_ > 1E-12) {
    // rescale when max energy is too big
    if (this.graphOrigin_ + this.totalEnergy_*this.graphFactor_ > this.rightEdge_) {
      this.needRescale_ = true;
      if (Util.DEBUG) { this.printEverything('BIG TOTAL ENERGY'); }
    }
    // rescale when max energy is small,
    // but only when positive part of graph is large compared to negative part.
    if (this.rightEdge_ - this.graphOrigin_ >
            0.2*(this.graphOrigin_ - this.leftEdge_)
        && this.totalEnergy_*this.graphFactor_ <
            0.2*(this.rightEdge_ - this.graphOrigin_)) {
      this.needRescale_ = true;
      this.megaMaxEnergy_ = this.totalEnergy_;
      if (Util.DEBUG) { this.printEverything('SMALL TOTAL ENERGY'); }
    }

  } else if (this.totalEnergy_ < -1E-12) {
    // every few seconds, if total is staying negative, then rescale
    if (time_check) {
      if (this.megaMaxEnergy_ < 0 && this.graphOrigin_ < this.rightEdge_) {
        this.needRescale_ = true;
        if (Util.DEBUG) { this.printEverything('NEGATIVE TOTAL ENERGY'); }
      }
      this.megaMaxEnergy_ = this.totalEnergy_;
    }
  }
  // if graph has gotten too big or too small, reset the scale.
  if (this.needRescale_) {
    this.lastTime_ = Util.systemTime(); // time reset
    this.needRescale_ = false;
    // scale goes from megaMinEnergy to totalEnergy or zero.
    let total = this.totalEnergy_ > 0 ? this.totalEnergy_ : 0;
    total -= this.megaMinEnergy_;
    if (total < 1E-16) {
      // kludge by ERN 11-14-2014; Problem is when energy is zero at startup
      // and EnergyBarGraph is displayed right away.
      // Found in GearsApp when 'show energy' is a remembered command.
      total = 1.0;
    }
    if (total*this.graphFactor_ > maxWidth) { // increasing
      this.graphFactor_ = 0.75*maxWidth/total;
    } else {  // decreasing
      this.graphFactor_ = 0.95*maxWidth/total;
    }
    asserts.assert(isFinite(this.graphFactor_));
    if (this.megaMinEnergy_ < -1E-12) {
      this.graphOrigin_ = this.leftEdge_ +
          Math.floor(0.5 + this.graphFactor_ * (-this.megaMinEnergy_));
    } else {
      this.graphOrigin_ = this.leftEdge_;
    }
    const power = Math.pow(10, Math.floor(Math.log(total)/Math.log(10)));
    const logTot = total/power;
    // logTot should be in the range from 1.0 to 9.999
    // choose a nice delta for the numbers on the chart
    if (logTot >= 8)
      this.graphDelta_ = 2;
    else if (logTot >= 5)
      this.graphDelta_ = 1;
    else if (logTot >= 3)
      this.graphDelta_ = 0.5;
    else if (logTot >= 2)
      this.graphDelta_ = 0.4;
    else
      this.graphDelta_ = 0.2;
    this.graphDelta_ *= power;
    //console.log('rescale '+total+' '+logTot+' '+power+' '+this.graphDelta_);
  }
};

/**
* @param {number} height
* @private
*/
resizeRect(height) {
  asserts.assertObject(this.visibleRect_);
  let top = this.rect_.isEmpty() ?
      this.visibleRect_.getTop() : this.rect_.getTop();
  let bottom = top - height;
  if (top > this.visibleRect_.getTop() || height > this.visibleRect_.getHeight()) {
    top = this.visibleRect_.getTop();
    bottom = top - height;
  } else if (bottom < this.visibleRect_.getBottom()) {
    bottom = this.visibleRect_.getBottom();
    top = bottom + height;
  }
  if (this.debug_ && Util.DEBUG) {
    console.log('resizeRect visibleRect='+this.visibleRect_
      +' rect='+this.rect_+ ' top='+top+' bottom='+bottom);
  }
  this.rect_ = new DoubleRect(this.visibleRect_.getLeft(), bottom,
      this.visibleRect_.getRight(), top);
  if (this.debug_ && Util.DEBUG) {
    console.log('resizeRect new rect='+this.rect_);
  }
  this.needRescale_ = true;
  this.needResize_ = false;
};

/** @override */
setDragable(dragable) {
  this.dragable_ = dragable;
};

/** @override */
setPosition(position) {
  if (!this.rect_.isEmpty()) {
    const h = this.rect_.getHeight()/2;
    this.rect_ = new DoubleRect(this.rect_.getLeft(), position.getY() - h,
        this.rect_.getRight(), position.getY() + h);
    if (this.debug_ && Util.DEBUG) {
      console.log('setPosition '+this.rect_);
    }
  } else {
    // Make a non-empty rectangle to save the desired vertical position.
    this.rect_ = new DoubleRect(-5, position.getY()-0.5,
        5, position.getY()+0.5);
  }
  this.changed_ = true;
};

/** Sets the area within which this EnergyBarGraph is drawn, in simulation coordinates.
@param {!DoubleRect} visibleArea the area within which this
    EnergyBarGraph is drawn, in simulation coordinates.
*/
setVisibleArea(visibleArea) {
  this.visibleRect_ = visibleArea;
  this.needResize_ = true;
  this.changed_ = true;
};

/** @override */
setZIndex(zIndex) {
  this.zIndex = zIndex !== undefined ? zIndex : 0;
  this.changed_ = true;
};

/**
* @param {number} minEnergy
* @return {boolean}
* @private
*/
timeCheck(minEnergy) {
  const nowTime = Util.systemTime();
  if (nowTime - this.lastTime2_ > 1.0) {
    this.lastTime2_ = nowTime;
    if (++this.bufptr_ >= this.history_.length)
      this.bufptr_ = 0;
    this.history_[this.bufptr_] = minEnergy;
  } else {
    if (this.minEnergy_ < this.history_[this.bufptr_])
      this.history_[this.bufptr_] = minEnergy;
  }
  if (nowTime - this.lastTime_ > this.BUFFER_) {
    this.lastTime_ = nowTime;
    return true;
  } else {
    return false;
  }
};

} // end class

/**
* @type {number}
* @const
* @private
*/
EnergyBarGraph.HEIGHT = 10;

/**
* @type {number}
* @const
* @private
*/
EnergyBarGraph.LEFT_MARGIN = 10;

/**
* @type {number}
* @const
* @private
*/
EnergyBarGraph.RIGHT_MARGIN = 0;

/**
* @type {number}
* @const
* @private
*/
EnergyBarGraph.TOP_MARGIN = 0;

/** Set of internationalized strings.
@typedef {{
  SHOW_ENERGY: string,
  POTENTIAL_ENERGY: string,
  TRANSLATIONAL_ENERGY: string,
  KINETIC_ENERGY: string,
  ROTATIONAL_ENERGY: string,
  TOTAL: string
  }}
*/
EnergyBarGraph.i18n_strings;

/**
@type {EnergyBarGraph.i18n_strings}
*/
EnergyBarGraph.en = {
  SHOW_ENERGY: 'show energy',
  POTENTIAL_ENERGY: 'potential',
  TRANSLATIONAL_ENERGY: 'translational',
  KINETIC_ENERGY: 'kinetic',
  ROTATIONAL_ENERGY: 'rotational',
  TOTAL: 'total'
};

/**
@private
@type {EnergyBarGraph.i18n_strings}
*/
EnergyBarGraph.de_strings = {
  SHOW_ENERGY: 'Energie anzeigen',
  POTENTIAL_ENERGY: 'potenzielle',
  TRANSLATIONAL_ENERGY: 'translation',
  KINETIC_ENERGY: 'kinetische',
  ROTATIONAL_ENERGY: 'rotation',
  TOTAL: 'gesamt'
};

/**
@private
@type {EnergyBarGraph.i18n_strings}
*/
EnergyBarGraph.es_strings = {
  SHOW_ENERGY: 'Mostrar energía',
  POTENTIAL_ENERGY: 'potencial',
  TRANSLATIONAL_ENERGY: 'translacional',
  KINETIC_ENERGY: 'cinética',
  ROTATIONAL_ENERGY: 'rotación',
  TOTAL: 'total'
};

/**
@private
@type {EnergyBarGraph.i18n_strings}
*/
EnergyBarGraph.ca_strings = {
  SHOW_ENERGY: 'Mostrar energia',
  POTENTIAL_ENERGY: 'potencial',
  TRANSLATIONAL_ENERGY: 'translacional',
  KINETIC_ENERGY: 'cinètica',
  ROTATIONAL_ENERGY: 'rotació',
  TOTAL: 'total'
};

/** Set of internationalized strings.
@type {EnergyBarGraph.i18n_strings}
*/
EnergyBarGraph.i18n = EnergyBarGraph.en;
switch(goog.LOCALE) {
  case 'de':
    EnergyBarGraph.i18n = EnergyBarGraph.de_strings;
    break;
  case 'es':
    EnergyBarGraph.i18n = EnergyBarGraph.es_strings;
    break;
  case 'ca':
    EnergyBarGraph.i18n = EnergyBarGraph.ca_strings;
    break;
  default:
    EnergyBarGraph.i18n = EnergyBarGraph.en;
    break;
};

exports = EnergyBarGraph;
