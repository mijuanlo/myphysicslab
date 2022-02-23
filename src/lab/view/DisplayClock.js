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

goog.module('myphysicslab.lab.view.DisplayClock');

const CoordMap = goog.require('myphysicslab.lab.view.CoordMap');
const DisplayObject = goog.require('myphysicslab.lab.view.DisplayObject');
const DoubleRect = goog.require('myphysicslab.lab.util.DoubleRect');
const SimObject = goog.require('myphysicslab.lab.model.SimObject');
const Util = goog.require('myphysicslab.lab.util.Util');
const Vector = goog.require('myphysicslab.lab.util.Vector');

/** Draws a clock with two 'second hands': one tracks the simulation time, the other
tracks real time. This makes it easy to see whether the simulation time is keeping up
with real time.

* @implements {DisplayObject}
*/
class DisplayClock {
/**
* @param {function():number} simTimeFn  function that returns current simulation time
* @param {function():number} realTimeFn  function that returns current real time
* @param {number=} period  Period of clock in seconds, the time it takes for the
*     seconds hand to wrap around; default is 2 seconds.
* @param {number=} radius  Radius of clock in simulation coords, default is 1.0.
* @param {!Vector=} location  Location of center of clock, in simulation coords.
*/
constructor(simTimeFn, realTimeFn, period, radius, location) {
  /**
  * @type {function():number}
  * @private
  */
  this.simTimeFn_ = simTimeFn;
  /**
  * @type {function():number}
  * @private
  */
  this.realTimeFn_ = realTimeFn;
  /** Period of clock in seconds, the time it takes for the seconds hand to wrap around
  * @type {number}
  * @private
  */
  this.period_ = typeof period === 'number' ? period : 2.0;
  /** Radius of clock in simulation coords
  * @type {number}
  * @private
  */
  this.radius_ = typeof radius === 'number' ? radius : 1.0;
  /**
  * @type {!Vector}
  * @private
  */
  this.location_ = goog.isObject(location) ? location : Vector.ORIGIN;
  /**
  * @type {boolean}
  * @private
  */
  this.dragable_ = true;
  /** Font to use for drawing the time, for example '10pt sans-serif'.
  * @type {string}
  * @private
  */
  this.font_ = '14pt sans-serif';
  /** Color to use for drawing the time, a CSS3 color value.
  * @type {string}
  * @private
  */
  this.textColor_ = 'blue';
  /**  Color to draw the second-hand showing simulation time.
  * @type {string}
  * @private
  */
  this.handColor_ = 'blue';
  /**  Color to draw the second-hand showing real time.
  * @type {string}
  * @private
  */
  this.realColor_ = 'red';
  /** Thickness of clock hands, in screen coords (1 means one pixel).
  * @type {number}
  * @private
  */
  this.handWidth_ = 1;
  /** Thickness of outline, in screen coords (1 means one pixel).
  * @type {number}
  * @private
  */
  this.outlineWidth_ = 1;
  /** Color to use for drawing the outline of the clock, a CSS3 color value.
  * @type {string}
  * @private
  */
  this.outlineColor_ = 'black';
  /** Color to fill circle with; default is transparent white so that it is visible
  * over a black background.
  * @type {string}
  * @private
  */
  this.fillStyle_ = 'rgba(255, 255, 255, 0.75)';
  /**
  * @type {number}
  * @private
  */
  this.zIndex_ = 0;
  /**
  * @type {boolean}
  * @private
  */
  this.changed_ = true;
  /** Last sim time drawn.
  * @type {number}
  * @private
  */
  this.lastSimTime_ = 0;
};

/** @override */
toString() {
  return Util.ADVANCED ? '' : this.toStringShort().slice(0, -1)
      +', radius: '+Util.NF(this.radius_)
      +', period: '+Util.NF(this.period_)
      +', location_: '+this.location_
      +', zIndex: '+this.zIndex_
      +'}';
};

/** @override */
toStringShort() {
  return Util.ADVANCED ? '' :
      'DisplayClock{'+'time: '+Util.NF(this.simTimeFn_())+'}';
};

/** @override */
contains(point) {
  return point.distanceTo(this.location_) <= this.radius_;
};

/** @override */
draw(context, map) {
  const center = map.simToScreen(this.location_);
  const r = map.simToScreenScaleX(this.radius_);
  // fill circle with transparent white, so that it is visible with black background
  context.save();
  context.beginPath();
  context.arc(center.getX(), center.getY(), r, 0, 2*Math.PI, false);
  context.closePath();
  context.lineWidth = this.outlineWidth_;
  context.strokeStyle = this.outlineColor_;
  context.stroke();
  context.fillStyle = this.fillStyle_;
  context.fill();
  const time = this.simTimeFn_();
  this.lastSimTime_ = time;
  const realTime = this.realTimeFn_();
  this.drawHand(context, map, this.handColor_, time, center);
  // show the real-time hand
  this.drawHand(context, map, this.realColor_, realTime, center);
  const tx = time.toFixed(3);
  context.fillStyle = this.textColor_;
  context.font = this.font_;
  context.textAlign = 'center';
  context.fillText(tx, center.getX(), center.getY());
  context.restore();
};

/**
* @param {!CanvasRenderingContext2D} context
* @param {!CoordMap} map
* @param {string} color
* @param {number} time
* @param {!Vector} center
* @private
*/
drawHand(context, map, color, time, center) {
  time = time - this.period_ * Math.floor(time/this.period_);
  const fraction = time / this.period_;
  const endx = map.simToScreenScaleX(this.radius_ * Math.sin(2*Math.PI * fraction));
  const endy = map.simToScreenScaleY(this.radius_ * Math.cos(2*Math.PI * fraction));
  context.lineWidth = this.handWidth_;
  context.strokeStyle = color;
  context.beginPath();
  context.moveTo(center.getX(), center.getY());
  context.lineTo(center.getX() + endx, center.getY() - endy);
  context.stroke();
};

/** @override */
isDragable() {
  return this.dragable_;
};

/** @override */
getChanged() {
  if (this.simTimeFn_() != this.lastSimTime_ || this.changed_) {
    this.changed_ = false;
    return true;
  }
  return false;
};

/** Returns color to fill circle with; default is transparent white so that it is
* visible over a black background.
* @return {string} a CSS3 color value
*/
getFillStyle() {
  return this.fillStyle_;
};

/** Font used when drawing the text, a CSS font specification.
* @return {string} a CSS font specification
*/
getFont() {
  return this.font_;
};

/** Returns color to draw the second-hand showing simulation time.
* @return {string} a CSS3 color value
*/
getHandColor() {
  return this.handColor_;
};

/** Returns thickness of clock hands, in screen coords (1 means one pixel).
* @return {number}
*/
getHandWidth() {
  return this.handWidth_;
};

/** @override */
getMassObjects() {
  return [];
};

/** Returns color to draw the second-hand showing real time.
* @return {string} a CSS3 color value
*/
getOutlineColor() {
  return this.outlineColor_;
};

/** Returns thickness of outline, in screen coords (1 means one pixel).
* @return {number}
*/
getOutlineWidth() {
  return this.outlineWidth_;
};

/** @override */
getPosition() {
  return this.location_;
};

/** Returns color to draw the second-hand showing real time.
* @return {string} a CSS3 color value
*/
getRealColor() {
  return this.realColor_;
};

/** @override */
getSimObjects() {
  return [];
};

/** Returns color for drawing the time.
* @return {string} a CSS3 color value
*/
getTextColor() {
  return this.textColor_;
};

/** @override */
getZIndex() {
  return this.zIndex_;
};

/** @override */
setDragable(dragable) {
  this.dragable_ = dragable;
};

/** Sets color to fill circle with; default is transparent white so that it is
* visible over a black background.
* @param {string} value a CSS3 color value
* @return {!DisplayClock} this object for chaining setters
*/
setFillStyle(value) {
  this.fillStyle_ = value;
  this.changed_ = true;
  return this;
};

/** Font used when drawing the text, a CSS font specification.
* @param {string} value a CSS font specification
* @return {!DisplayClock} this object for chaining setters
*/
setFont(value) {
  this.font_ = value;
  this.changed_ = true;
  return this;
};

/** Sets color to draw the second-hand showing simulation time.
* @param {string} value a CSS3 color value
* @return {!DisplayClock} this object for chaining setters
*/
setHandColor(value) {
  this.handColor_ = value;
  this.changed_ = true;
  return this;
};

/** Sets thickness of clock hands, in screen coords (1 means one pixel).
* @param {number} value
* @return {!DisplayClock} this object for chaining setters
*/
setHandWidth(value) {
  this.handWidth_ = value;
  this.changed_ = true;
  return this;
};

/** Sets color to use for drawing the outline of the clock.
* @param {string} value a CSS3 color value
* @return {!DisplayClock} this object for chaining setters
*/
setOutlineColor(value) {
  this.outlineColor_ = value;
  this.changed_ = true;
  return this;
};

/** Sets thickness of outline, in screen coords (1 means one pixel).
* @param {number} value
* @return {!DisplayClock} this object for chaining setters
*/
setOutlineWidth(value) {
  this.outlineWidth_ = value;
  this.changed_ = true;
  return this;
};

/** @override */
setPosition(position) {
  this.location_ = position;
  this.changed_ = true;
};

/** Sets color to draw the second-hand showing real time.
* @param {string} value a CSS3 color value
* @return {!DisplayClock} this object for chaining setters
*/
setRealColor(value) {
  this.realColor_ = value;
  this.changed_ = true;
  return this;
};

/** Returns color for drawing the time.
* @param {string} value a CSS3 color value
* @return {!DisplayClock} this object for chaining setters
*/
setTextColor(value) {
  this.textColor_ = value;
  this.changed_ = true;
  return this;
};

/** @override */
setZIndex(zIndex) {
  this.zIndex_ = zIndex !== undefined ? zIndex : 0;
  this.changed_ = true;
};

} // end class

/** Set of internationalized strings.
@typedef {{
  SHOW_CLOCK: string
  }}
*/
DisplayClock.i18n_strings;

/**
@type {DisplayClock.i18n_strings}
*/
DisplayClock.en = {
  SHOW_CLOCK: 'show clock'
};

/**
@private
@type {DisplayClock.i18n_strings}
*/
DisplayClock.de_strings = {
  SHOW_CLOCK: 'Zeit anzeigen'
};

/**
@private
@type {DisplayClock.i18n_strings}
*/
DisplayClock.es_strings = {
  SHOW_CLOCK: 'Mostrar reloj'
};

/** Set of internationalized strings.
@type {DisplayClock.i18n_strings}
*/
DisplayClock.i18n = DisplayClock.en;
switch(goog.LOCALE) {
  case 'de':
    DisplayClock.i18n = DisplayClock.de_strings;
    break;
  case 'es':
    DisplayClock.i18n = DisplayClock.es_strings;
    break;
  default:
    DisplayClock.i18n = DisplayClock.en;
    break;
};

exports = DisplayClock;
