(/*Copyright_2020_Erik_Neumann_All_Rights_Reserved_www.myphysicslab.com*/function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';var n=this||self;function p(){}function r(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}function aa(a,b){function c(){}c.prototype=b.prototype;a.U=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.fa=function(d,e,f){for(var g=Array(arguments.length-2),h=2;h<arguments.length;h++)g[h-2]=arguments[h];return b.prototype[e].apply(d,g)}};const ba=Array.prototype.indexOf?function(a,b){return Array.prototype.indexOf.call(a,b,void 0)}:function(a,b){if("string"===typeof a)return"string"!==typeof b||1!=b.length?-1:a.indexOf(b,0);for(let c=0;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1};function ca(a,b){a:{const c=a.length,d="string"===typeof a?a.split(""):a;for(let e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){b=e;break a}b=-1}return 0>b?null:"string"===typeof a?a.charAt(b):a[b]}
function da(a,b){b=ba(a,b);let c;(c=0<=b)&&Array.prototype.splice.call(a,b,1);return c}function ea(a,b,c,d){Array.prototype.splice.apply(a,ha(arguments,1))}function ha(a,b,c){return 2>=arguments.length?Array.prototype.slice.call(a,b):Array.prototype.slice.call(a,b,c)}function ia(a,b){a.sort(b||ja)}
function ka(a,b){const c=Array(a.length);for(let e=0;e<a.length;e++)c[e]={index:e,value:a[e]};const d=b||ja;ia(c,function(e,f){return d(e.value,f.value)||e.index-f.index});for(b=0;b<a.length;b++)a[b]=c[b].value}function ja(a,b){return a>b?1:a<b?-1:0};function u(a,b){this.type=a;this.target=b}u.prototype.g=function(){};var la=function(){if(!n.addEventListener||!Object.defineProperty)return!1;var a=!1,b=Object.defineProperty({},"passive",{get:function(){a=!0}});try{n.addEventListener("test",p,b),n.removeEventListener("test",p,b)}catch(c){}return a}();function v(){var a=n.navigator;return a&&(a=a.userAgent)?a:""};function y(a){y[" "](a);return a}y[" "]=p;var ma=-1!=v().indexOf("Gecko")&&!(-1!=v().toLowerCase().indexOf("webkit")&&-1==v().indexOf("Edge"))&&!(-1!=v().indexOf("Trident")||-1!=v().indexOf("MSIE"))&&-1==v().indexOf("Edge");function z(a){u.call(this,a?a.type:"");this.relatedTarget=this.target=null;this.button=this.screenY=this.screenX=this.clientY=this.clientX=0;this.key="";this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1;this.pointerId=0;this.pointerType="";this.h=null;if(a){var b=this.type=a.type,c=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement;var d=a.relatedTarget;if(d){if(ma){a:{try{y(d.nodeName);var e=!0;break a}catch(f){}e=!1}e||(d=null)}}else"mouseover"==
b?d=a.fromElement:"mouseout"==b&&(d=a.toElement);this.relatedTarget=d;c?(this.clientX=void 0!==c.clientX?c.clientX:c.pageX,this.clientY=void 0!==c.clientY?c.clientY:c.pageY,this.screenX=c.screenX||0,this.screenY=c.screenY||0):(this.clientX=void 0!==a.clientX?a.clientX:a.pageX,this.clientY=void 0!==a.clientY?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0);this.button=a.button;this.key=a.key||"";this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=
a.metaKey;this.pointerId=a.pointerId||0;this.pointerType="string"===typeof a.pointerType?a.pointerType:na[a.pointerType]||"";this.h=a;a.defaultPrevented&&z.U.g.call(this)}}aa(z,u);var na={2:"touch",3:"pen",4:"mouse"};z.prototype.g=function(){z.U.g.call(this);var a=this.h;a.preventDefault?a.preventDefault():a.returnValue=!1};var B="closure_listenable_"+(1E6*Math.random()|0);var oa=0;function pa(a,b,c,d,e){this.listener=a;this.proxy=null;this.src=b;this.type=c;this.capture=!!d;this.h=e;this.key=++oa;this.g=this.L=!1}function qa(a){a.g=!0;a.listener=null;a.proxy=null;a.src=null;a.h=null};function C(a){this.src=a;this.g={};this.h=0}C.prototype.add=function(a,b,c,d,e){var f=a.toString();a=this.g[f];a||(a=this.g[f]=[],this.h++);var g;a:{for(g=0;g<a.length;++g){var h=a[g];if(!h.g&&h.listener==b&&h.capture==!!d&&h.h==e)break a}g=-1}-1<g?(b=a[g],c||(b.L=!1)):(b=new pa(b,this.src,f,!!d,e),b.L=c,a.push(b));return b};var D="closure_lm_"+(1E6*Math.random()|0),E={},ra=0;function sa(a,b,c,d,e){if(d&&d.once)ta(a,b,c,d,e);else if(Array.isArray(b))for(var f=0;f<b.length;f++)sa(a,b[f],c,d,e);else c=ua(c),a&&a[B]?a.g(b,c,r(d)?!!d.capture:!!d,e):va(a,b,c,!1,d,e)}
function va(a,b,c,d,e,f){if(!b)throw Error("Invalid event type");var g=r(e)?!!e.capture:!!e,h=wa(a);h||(a[D]=h=new C(a));c=h.add(b,c,d,g,f);if(!c.proxy){d=xa();c.proxy=d;d.src=a;d.listener=c;if(a.addEventListener)la||(e=g),void 0===e&&(e=!1),a.addEventListener(b.toString(),d,e);else if(a.attachEvent)a.attachEvent(ya(b.toString()),d);else if(a.addListener&&a.removeListener)a.addListener(d);else throw Error("addEventListener and attachEvent are unavailable.");ra++}}
function xa(){function a(c){return b.call(a.src,a.listener,c)}const b=za;return a}function ta(a,b,c,d,e){if(Array.isArray(b))for(var f=0;f<b.length;f++)ta(a,b[f],c,d,e);else c=ua(c),a&&a[B]?a.h(b,c,r(d)?!!d.capture:!!d,e):va(a,b,c,!0,d,e)}function ya(a){return a in E?E[a]:E[a]="on"+a}
function za(a,b){if(a.g)a=!0;else{b=new z(b,this);var c=a.listener,d=a.h||a.src;if(a.L&&"number"!==typeof a&&a&&!a.g){var e=a.src;if(e&&e[B])e.j(a);else{var f=a.type,g=a.proxy;e.removeEventListener?e.removeEventListener(f,g,a.capture):e.detachEvent?e.detachEvent(ya(f),g):e.addListener&&e.removeListener&&e.removeListener(g);ra--;(f=wa(e))?(g=a.type,g in f.g&&da(f.g[g],a)&&(qa(a),0==f.g[g].length&&(delete f.g[g],f.h--)),0==f.h&&(f.src=null,e[D]=null)):qa(a)}}a=c.call(d,b)}return a}
function wa(a){a=a[D];return a instanceof C?a:null}var Aa="__closure_events_fn_"+(1E9*Math.random()>>>0);function ua(a){if("function"===typeof a)return a;a[Aa]||(a[Aa]=function(b){return a.handleEvent(b)});return a[Aa]};function Ba(){window.onerror=function(a,b,c){3>Ca++&&alert(a+"\n"+b+":"+c)}}function F(){return Da&&!Ea?.001*performance.now():.001*Date.now()}function G(a){if(!isFinite(a))throw"not a finite number "+a;return a}function H(a){if(isNaN(a))throw"not a number "+a;return a}function I(a){return a.toUpperCase().replace(/[ -]/g,"_")}function J(a){if(!a.match(/^[A-Z_][A-Z_0-9]*$/))throw"not a valid name: "+a;return a}
function Fa(a,b,c){c=c||1E-14;if(isNaN(a)||isNaN(b))throw"argument is NaN";if(0>=c)throw"epsilon must be positive "+c;var d=d||1;if(0>=d)throw"magnitude must be positive "+d;const e=Math.max(Math.abs(a),Math.abs(b));return Math.abs(a-b)>(e>d?e:d)*c}var Ea=!1,Da=r(performance)&&"function"===typeof performance.now,Ga=Number.NaN,Ha=Number.NEGATIVE_INFINITY,Ca=0,Ia=Number.POSITIVE_INFINITY;class K{constructor(a,b){this.i=J(I(a));this.j=b}toString(){return this.u()}u(){const a=this.j;"object"===typeof a&&null!==a&&void 0!==a.u&&a.u();return""}h(){return this.i}g(){return this.j}};class Ja{constructor(a){this.i=J(I(L.ca));this.j=a}toString(){return""}u(){return""}h(){return this.i}g(){return this.j()}};function Ka(a){var b=Number.NEGATIVE_INFINITY;if(b>a.g()||b>a.j)throw"out of range: "+b+" value="+a.g()+" upper="+a.j;return a}class M{constructor(a,b){this.l=J(I(a));this.i=b;this.j=Ia}toString(){return""}u(){return""}h(){return this.l}g(){return this.i()}};class La{constructor(a,b,c,d){this.i=J(I(a));this.j=b;if(null!=c)if(null!=d){if(d.length!==c.length)throw"different lengths choices:"+c+" values:"+d;}else throw"values is not defined";}toString(){return""}u(){return""}h(){return this.i}g(){return this.j()}};function Ma(a){if(!a.K){for(let b=0,c=a.J.length;b<c;b++){const d=a.J[b];d.action?a.A.includes(d.T)||a.A.push(d.T):da(a.A,d.T)}a.J=[]}}function Na(a,b){b=I(b);return ca(a.O,c=>c.h()==b)}function N(a,b){const c=b.h(),d=Na(a,c);if(null!=d)throw"parameter "+c+" already exists: "+d;a.O.push(b)}function O(a,b){a.K=!0;try{a.A.forEach(c=>c.g(b))}finally{a.K=!1,Ma(a)}}function Oa(a,b){const c=Na(a,b);if(null==c)throw"unknown Parameter "+b;O(a,c)}
class P{constructor(a){if(!a)throw"no name";J(I(a));this.A=[];this.O=[];this.K=!1;this.J=[]}toString(){return""}u(){return""}};function Pa(a){a.m.forEach(b=>b.cancel())}function Q(a){return a.g?F()-a.h:a.i}function Qa(a){a.g&&(a.i=Q(a),a.j=a.g?F()-a.l:a.j,Pa(a),a.g=!1,O(a,new K("CLOCK_PAUSE")))}function Ra(a,b){a.g?(a.h=F()-b,a.m.forEach(c=>{c.cancel();if(a.g){const e=Q(a)+a.h;var d=c.h()+a.h;Fa(d,e)?d>e&&c.j(d-e):c.g()}})):a.i=b}function Sa(a,b){Fa(Q(a),b,.001)&&(Ra(a,b),O(a,new K("CLOCK_SET_TIME")))}
class Ta extends P{constructor(){super("CLOCK");this.l=this.h=F();this.j=this.i=0;this.g=!1;this.m=[];N(this,new M(Ua.da,()=>1))}toString(){return""}u(){return""}}var Ua={da:"time rate"};class R{constructor(a,b,c){c="number"===typeof c?c:0;this.g=H(a);this.h=H(b);this.j=H(c);this.i=this.l=Ga}toString(){return""}add(a){return new R(this.g+a.g,this.h+a.h,this.j+a.j)}A(a){return null===a?!1:a.g===this.g&&a.h===this.h&&a.j===this.j}length(){if(isNaN(this.l)){var a=Math,b=a.sqrt;isNaN(this.i)&&(this.i=0===this.j?this.g*this.g+this.h*this.h:this.g*this.g+this.h*this.h+this.j*this.j);this.l=b.call(a,this.i)}return this.l}}new R(1,0);new R(0,1);var Va=new R(0,0);new R(0,-1);new R(-1,0);class Wa{constructor(a,b,c,d,e,f){this.g=a;this.h=b;this.j=c;this.i=d;this.l=e;this.m=f}toString(){return""}scale(a,b){return new Wa(this.g*a,this.h*a,this.j*b,this.i*b,this.l,this.m)}transform(a,b){"number"!==typeof a&&(b=a.h,a=a.g);if("number"!==typeof a||"number"!==typeof b)throw"need a Vector or two numbers";return new R(this.g*a+this.j*b+this.l,this.h*a+this.i*b+this.m)}translate(a,b){"number"!==typeof a&&(b=a.h,a=a.g);if("number"!==typeof a||"number"!==typeof b)throw"need a Vector or two numbers";
return new Wa(this.g,this.h,this.j,this.i,this.l+this.g*a+this.j*b,this.m+this.h*a+this.i*b)}}var Xa=new Wa(1,0,0,1,0,0);class S{constructor(a,b,c,d){this.l=H(a);this.i=H(c);this.g=H(b);this.m=H(d);if(a>c)throw"DoubleRect: left > right "+a+" > "+c;if(b>d)throw"DoubleRect: bottom > top "+b+" > "+d;}toString(){return""}A(a){return a===this?!0:a instanceof S?a.o()==this.l&&a.i==this.i&&a.g==this.g&&a.s()==this.m:!1}h(){return this.m-this.g}o(){return this.l}s(){return this.m}j(){return this.i-this.l}v(){return 1E-16>this.j()||1E-16>this.h()}scale(a,b){b=void 0===b?a:b;const c=(this.l+this.i)/2,d=(this.g+this.m)/2,e=this.j(),
f=this.h();return new S(c-a*e/2,d-b*f/2,c+a*e/2,d+b*f/2)}translate(a,b){"number"!==typeof a&&(b=a.h,a=a.g);if("number"!==typeof a||"number"!==typeof b)throw"";return new S(this.l+a,this.g+b,this.i+a,this.m+b)}}new S(0,0,0,0);var T={P:"left",D:"middle",R:"right",C:"full",F:"value"};T={P:"izquierda",D:"centrado",R:"derecha",C:"completo",F:"valor"};class U{constructor(a,b){if("number"!==typeof a||"number"!==typeof b)throw"";if(0>a||0>b)throw"";this.i=a;this.g=b}toString(){return""}A(a){return this.i==a.i&&this.g==a.g}h(){return this.g}o(){return 0}s(){return 0}j(){return this.i}v(){return 1E-14>this.i||1E-14>this.g}}new U(0,0);var V={S:"top",D:"middle",M:"bottom",C:"full",F:"value"};V={S:"superior",D:"medio",M:"fondo",C:"completo",F:"valor"};function Ya(a,b){a:{var c="MIDDLE";var d=["LEFT","MIDDLE","RIGHT","FULL","VALUE"];for(let w=0,fa=d.length;w<fa;w++)if(c===d[w]){c=d[w];break a}throw"invalid HorizAlign value:  "+c;}a:{d="MIDDLE";var e=["TOP","MIDDLE","BOTTOM","FULL","VALUE"];for(let w=0,fa=e.length;w<fa;w++)if(d===e[w]){var f=e[w];break a}throw"invalid VerticalAlign value: "+d;}var g=1;if(1E-15>g||!isFinite(g))throw"bad aspectRatio "+g;d=b.o();e=b.g;const h=b.i-d,m=b.s()-e;if(1E-15>h||1E-15>m)throw"simRect cannot be empty "+b;b=a.s();
const A=a.o(),q=a.j();a=a.h();var l=0;let k=0,x=0,t=0;"FULL"==c&&(x=q/h,l=0);"FULL"==f&&(t=a/m,k=0);if("FULL"!=c||"FULL"!=f)if("FULL"==c?(t=x*g,l=!0):"FULL"==f?(x=t/g,l=!1):(x=q/h,t=x*g,l=!0,a<Math.floor(.5+t*m)&&(t=a/m,x=t/g,l=!1)),l)switch(l=0,c=Math.floor(.5+m*t),f){case "BOTTOM":k=0;break;case "MIDDLE":k=(a-c)/2;break;case "TOP":k=a-c;break;default:throw"unsupported alignment "+f;}else switch(k=0,f=Math.floor(.5+h*x),c){case "LEFT":l=0;break;case "MIDDLE":l=(q-f)/2;break;case "RIGHT":l=q-f;break;
default:throw"unsupported alignment "+c;}return new Za(A,b+a,d-l/x,e-k/t,x,t)}class Za{constructor(a,b,c,d,e,f){this.i=G(a);this.j=G(b);this.m=G(c);this.l=G(d);this.g=G(e);this.h=G(f);a=Xa;a=a.translate(this.i,this.j);a=a.scale(this.g,-this.h);a.translate(-this.m,-this.l)}toString(){return""}};function $a(a){a.h="160pt sans-serif";a.g=!0}function ab(a){a.i="center";a.g=!0}function bb(a){a.l="middle";a.g=!0}class cb{constructor(){var a=new R(2,-1);this.m="0.0";this.j=a||Va;this.g=!0}toString(){return""}u(){return""}};class db{constructor(){this.g=[]}toString(){return""}u(){return""}l(a){this.g.includes(a)||this.g.push(a)}};function eb(a){let b=!0,c=Ha;for(let d=0,e=a.g.length;d<e;d++){if(0<c){b=!1;break}c=0}b||(ka(a.g,function(){return 0}),a.h=!0)}function fb(a,b,c){eb(a);a.g.forEach(d=>{b.save();b.fillStyle=void 0!==d.o?d.o:"black";b.font=void 0!==d.h?d.h:"12pt sans-serif";b.textAlign=void 0!==d.i?d.i:"left";b.textBaseline=void 0!==d.l?d.l:"alphabetic";b.fillText(d.m,c.i+(d.j.g-c.m)*c.g,c.j-(d.j.h-c.l)*c.h);b.restore()})}
class gb extends P{constructor(){super("DISPLAY_LIST_"+hb++);this.g=[];this.h=!0}toString(){return""}u(){return""}add(a){if(!r(a))throw"non-object passed to DisplayList.add";eb(this);let b=this.g.length,c;for(c=0;c<b;c++);ea(this.g,c,0,a);this.h=!0;O(this,new K("OBJECT_ADDED",a))}get(a){const b=this.g.length;if(0>a||a>=b)throw a+" is not in range 0 to "+(b-1);eb(this);return this.g[a]}length(){return this.g.length}}var hb=1;function ib(a,b){if(0<a.j()&&0<a.h()){const c=new U(a.j(),a.h());jb(b,c)}a.i.push(b);a.l(b);a.o=!0;O(a,new K("VIEW_ADDED",b));O(a,new K("VIEW_LIST_MODIFIED"));if(null==a.B){if(null!=b&&!a.i.includes(b))throw"cannot set focus to unknown view "+b;a.B!=b&&(a.B=b,a.o=!0,O(a,new K("FOCUS_VIEW_CHANGED",b)))}}
function kb(a){let b=!1;for(let f=0,g=a.i.length;f<g;f++){var c=a.i[f];{var d=c.v;let h=!1;for(let m=0,A=d.g.length;m<A;m++){var e=d.g[m];e.g?(e.g=!1,e=!0):e=!1;h=h||e}h||d.h?(d.h=!1,d=!0):d=!1}d||c.i?(c.i=!1,c=!0):c=!1;b=b||c}return b||a.o?(a.o=!1,!0):!1}function lb(a){const b=new U(a.g.width,a.g.height);a.i.forEach(c=>jb(c,b));a.o=!0;O(a,new K("SIZE_CHANGED"))}
function mb(a){if(null!=a.g.offsetParent){0<a.m&&a.m--;const b=kb(a);if(b||0<a.m){const c=a.g.getContext("2d");c.save();try{""!=a.v?(c.globalAlpha=a.s,c.fillStyle=a.v,c.fillRect(0,0,a.g.width,a.g.height),c.globalAlpha=1,1==a.s?a.m=0:b&&(a.m=Math.floor(10/a.s))):c.clearRect(0,0,a.g.width,a.g.height),a.i.forEach(d=>{c.save();c.globalAlpha=d.aa;fb(d.v,c,d.N);c.restore()})}finally{c.restore()}}}}function nb(a){a.g.width=800;a.g.height=500;lb(a);Oa(a,W.I);Oa(a,W.H)}
class ob extends P{constructor(){var a=document.createElement("canvas");super("canvas1");this.g=a;a.contentEditable=!1;this.i=[];this.G=new db;this.B=null;this.s=1;this.v="";this.o=!0;this.m=0;N(this,new M(W.I,()=>this.j()));N(this,new M(W.H,()=>this.h()));N(this,new M(W.ALPHA,()=>this.s));N(this,new La(W.W,()=>this.v))}toString(){return""}l(a){this.G.l(a)}h(){return this.g.height}j(){return this.g.width}}var W={I:"width",H:"height",ALPHA:"alpha",W:"background"};function jb(a,b){if(!(b instanceof U))throw"not a ScreenRect: "+b;if(b.v())throw"empty screenrect";if(!a.s.A(b)){a.s=b;b=Ya(a.s,a.g);if(!(b instanceof Za))throw"not a CoordMap: "+b;a.N=b;a.i=!0;O(a,new K("COORD_MAP_CHANGED"));a.o=a.g.j();a.m=a.g.h();b=a.g;a.B=(b.l+b.i)/2;b=a.g;a.G=(b.g+b.m)/2;a.ba=a.m/a.o;a.i=!0;O(a,new K("SCREEN_RECT_CHANGED"))}}
class pb extends P{constructor(a){super("simView");if(!(a instanceof S)||a.v())throw"bad simRect: "+a;this.g=a;this.s=new U(800,600);this.v=new gb;this.aa=1;this.N=Ya(this.s,this.g);this.o=a.j();this.m=a.h();this.B=(a.l+a.i)/2;this.G=(a.g+a.m)/2;this.ba=this.m/this.o;this.i=!0;this.Z=new db;N(this,new M(L.I,()=>this.j()));N(this,new M(L.H,()=>this.h()));N(this,Ka(new M(L.X,()=>this.B)));N(this,Ka(new M(L.Y,()=>this.G)));N(this,new Ja(()=>!0));N(this,new La(L.ea,()=>"MIDDLE",[V.S,V.D,V.M,V.C,V.F],
["TOP","MIDDLE","BOTTOM","FULL","VALUE"]));N(this,new La(L.$,()=>"MIDDLE",[T.P,T.D,T.R,T.C,T.F],["LEFT","MIDDLE","RIGHT","FULL","VALUE"]));N(this,new M(L.V,()=>1))}toString(){return""}u(){return""}l(a){this.Z.l(a)}h(){return this.m}j(){return this.o}}var L={ca:"scale X-Y together",I:"width",H:"height",X:"center-x",Y:"center-y",ea:"vertical-align",$:"horizontal-align",V:"aspect-ratio"};function qb(a){if(null!=a.i){var b=F();0<=b-(a.j-a.h)&&(a.i(),a.j=b,a.h=0);a.g=a.m?setTimeout(a.o,17):requestAnimationFrame(a.o)}}function rb(a,b){a.l=!1;void 0!==a.g&&(a.m?clearTimeout(a.g):cancelAnimationFrame(a.g),a.g=void 0);a.j=NaN;a.h=0;a.i=b}function sb(a){a.l||(a.l=!0,a.h=0,a.j=F()-1E-7,qb(a))}class tb{constructor(){this.m="function"!==typeof requestAnimationFrame;this.g=void 0;this.i=null;this.o=()=>qb(this);this.l=!1;this.j=Ga;this.h=0}toString(){return""}};function ub(a){Ba();var b=window.document.getElementById("sim_applet");if(null===b)throw"cannot find sim_applet";const c=new ob;nb(c);b.appendChild(c.g);b=new S(-5,-5,5,5);const d=new pb(b);b=new tb;const e=new Ta,f=new cb;$a(f);ab(f);bb(f);d.v.add(f);ib(c,d);const g=new Audio(a);let h=10.1,m=3,A=!0;Sa(e,-m);rb(b,()=>{var k=Q(e);k=h*Math.ceil(k/h)-k;f.m=k.toFixed(1);f.g=!0;k>h-2?A&&(g.play(),A=!1):A=!0;mb(c)});a=document.getElementById("reset_button");null!=a&&(a.onclick=()=>{Qa(e);Sa(e,-m);A=!0});
a=document.getElementById("stop_button");null!=a&&(a.onclick=()=>Qa(e));a=document.getElementById("start_button");null!=a&&(a.onclick=()=>{if(!e.g){e.g=!0;Ra(e,e.i);var k=e.j;e.g?e.l=F()-k:e.j=k;O(e,new K("CLOCK_RESUME"))}});const q=document.getElementById("period_field");null!=q&&(q.textAlign="right",q.value=h.toFixed(1),sa(q,"change",()=>{const k=parseFloat(q.value);isNaN(k)?q.value=h.toFixed(1):h=k}));const l=document.getElementById("start_field");null!=l&&(l.textAlign="right",l.value=m.toFixed(1),
sa(l,"change",()=>{const k=parseFloat(l.value);isNaN(k)?l.value=m.toFixed(1):m=k}));sb(b);Qa(e)}var X=["makeBikeTimerApp"],Y=n;X[0]in Y||"undefined"==typeof Y.execScript||Y.execScript("var "+X[0]);for(var Z;X.length&&(Z=X.shift());)X.length||void 0===ub?Y[Z]&&Y[Z]!==Object.prototype[Z]?Y=Y[Z]:Y=Y[Z]={}:Y[Z]=ub;}).call(window)
