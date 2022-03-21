(/*Copyright_2020_Erik_Neumann_All_Rights_Reserved_www.myphysicslab.com*/function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';var aa=this||self;function ba(a){var b=typeof a;return"object"==b&&null!=a||"function"==b};const ca=Array.prototype.indexOf?function(a,b){return Array.prototype.indexOf.call(a,b,void 0)}:function(a,b){if("string"===typeof a)return"string"!==typeof b||1!=b.length?-1:a.indexOf(b,0);for(var c=0;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1};function da(a,b){a:{for(var c=a.length,d="string"===typeof a?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){b=e;break a}b=-1}return 0>b?null:"string"===typeof a?a.charAt(b):a[b]}
function ea(a,b,c,d){Array.prototype.splice.apply(a,fa(arguments,1))}function fa(a,b,c){return 2>=arguments.length?Array.prototype.slice.call(a,b):Array.prototype.slice.call(a,b,c)}function ha(a,b){a.sort(b||ia)}function ja(a,b){for(var c=Array(a.length),d=0;d<a.length;d++)c[d]={index:d,value:a[d]};var e=b||ia;ha(c,function(f,g){return e(f.value,g.value)||f.index-g.index});for(d=0;d<a.length;d++)a[d]=c[d].value}function ia(a,b){return a>b?1:a<b?-1:0};function ka(){window.onerror=function(a,b,c){3>la++&&alert(a+"\n"+b+":"+c)}}function k(){return ma&&!na?.001*performance.now():.001*Date.now()}function l(a){if(!isFinite(a))throw"not a finite number "+a;return a}function q(a){if(isNaN(a))throw"not a number "+a;return a}function r(a){return a.toUpperCase().replace(/[ -]/g,"_")}function t(a){if(!a.match(/^[A-Z_][A-Z_0-9]*$/))throw"not a valid name: "+a;return a}
var na=!1,ma=ba(performance)&&"function"===typeof performance.now,oa=Number.NaN,pa=Number.NEGATIVE_INFINITY,la=0,w=Number.POSITIVE_INFINITY;class x{constructor(a,b){this.i=t(r(a));this.j=b}toString(){return""}h(){return this.i}g(){return this.j}};class qa{constructor(a){this.j=t(r(y.ca));this.i=a}toString(){return""}h(){return this.j}g(){return this.i()}};function ra(a){var b=Number.NEGATIVE_INFINITY;if(b>a.g()||b>a.i)throw"out of range: "+b+" value="+a.g()+" upper="+a.i;return a}class z{constructor(a,b){this.l=t(r(a));this.j=b;this.i=w}toString(){return""}h(){return this.l}g(){return this.j()}};class A{constructor(a,b,c,d){this.j=t(r(a));this.i=b;if(null!=c)if(null!=d){if(d.length!==c.length)throw"different lengths choices:"+c+" values:"+d;}else throw"values is not defined";}toString(){return""}h(){return this.j}g(){return this.i()}};function sa(a){if(!a.D){for(let d=0,e=a.B.length;d<e;d++){var b=a.B[d];if(b.action)a.v.includes(b.S)||a.v.push(b.S);else{var c=a.v;b=ca(c,b.S);0<=b&&Array.prototype.splice.call(c,b,1)}}a.B=[]}}function ta(a,b){b=r(b);return da(a.G,c=>c.h()==b)}function B(a,b){const c=b.h(),d=ta(a,c);if(null!=d)throw"parameter "+c+" already exists: "+d;a.G.push(b)}function C(a,b){a.D=!0;try{a.v.forEach(c=>c.g(b))}finally{a.D=!1,sa(a)}}function ua(a,b){const c=ta(a,b);if(null==c)throw"unknown Parameter "+b;C(a,c)}
class D{constructor(a){if(!a)throw"no name";t(r(a));this.v=[];this.G=[];this.D=!1;this.B=[]}toString(){return""}};function va(a,b){a.g?(a.h=k()-b,a.m.forEach(c=>{c.cancel();if(a.g){const g=(a.g?k()-a.h:a.i)/1+a.h;var d=c.h()+a.h;{var e=e||1E-14;if(isNaN(d)||isNaN(g))throw"argument is NaN";if(0>=e)throw"epsilon must be positive "+e;var f=f||1;if(0>=f)throw"magnitude must be positive "+f;const h=Math.max(Math.abs(d),Math.abs(g));e=Math.abs(d-g)>(h>f?h:f)*e}e?d>g&&c.i(d-g):c.g()}})):a.i=b}function wa(a){if(!a.g){a.g=!0;va(a,a.i);var b=a.j;a.g?a.l=k()-b:a.j=b;C(a,new x("CLOCK_RESUME"))}}
class xa extends D{constructor(){super("CLOCK");this.l=this.h=k();this.j=this.i=0;this.g=!1;this.m=[];B(this,new z(ya.da,()=>1))}toString(){return""}}var ya={da:"time rate"};var za={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",
darkgrey:"#a9a9a9",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",
ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",grey:"#808080",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",
lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",
moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",
seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};function Aa(a){var b={};a=String(a);var c="#"==a.charAt(0)?a:"#"+a;if(Ba.test(c))return b.P=Ca(c),b.type="hex",b;a:{var d=a.match(Da);if(d){c=Number(d[1]);var e=Number(d[2]);d=Number(d[3]);if(0<=c&&255>=c&&0<=e&&255>=e&&0<=d&&255>=d){c=[c,e,d];break a}}c=[]}if(c.length){a=c[0];e=c[1];c=c[2];a=Number(a);e=Number(e);c=Number(c);if(a!=(a&255)||e!=(e&255)||c!=(c&255))throw Error('"('+a+","+e+","+c+'") is not a valid RGB color');c|=a<<16|e<<8;b.P=16>a?"#"+(16777216|c).toString(16).substr(1):"#"+c.toString(16);
b.type="rgb";return b}if(za&&(c=za[a.toLowerCase()]))return b.P=c,b.type="named",b;throw Error(a+" is not a valid color string");}var Ea=/#(.)(.)(.)/;function Ca(a){if(!Ba.test(a))throw Error("'"+a+"' is not a valid hex color");4==a.length&&(a=a.replace(Ea,"#$1$1$2$2$3$3"));return a.toLowerCase()}var Ba=/^#(?:[0-9a-f]{3}){1,2}$/i,Da=/^(?:rgb)?\((0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2})\)$/i;function E(a){return a instanceof F?a:new F(a.g,a.h,a.i)}class F{constructor(a,b,c){c="number"===typeof c?c:0;this.g=q(a);this.h=q(b);this.i=q(c);this.j=this.l=oa}toString(){return""}add(a){return new F(this.g+a.g,this.h+a.h,this.i+a.i)}v(a){return null===a?!1:a.g===this.g&&a.h===this.h&&a.i===this.i}length(){if(isNaN(this.l)){var a=Math,b=a.sqrt;isNaN(this.j)&&(this.j=0===this.i?this.g*this.g+this.h*this.h:this.g*this.g+this.h*this.h+this.i*this.i);this.l=b.call(a,this.j)}return this.l}}
new F(1,0);new F(0,1);var G=new F(0,0);new F(0,-1);new F(-1,0);function Fa(a,b){b.transform(a.g,a.h,a.i,a.j,a.l,a.m)}function Ga(a,b){return new I(a.g*b.g+a.i*b.h,a.h*b.g+a.j*b.h,a.g*b.i+a.i*b.j,a.h*b.i+a.j*b.j,a.g*b.l+a.i*b.m+a.l,a.h*b.l+a.j*b.m+a.m)}function J(a,b,c,d){a=a.transform(b,c);d.lineTo(a.g,a.h)}function K(a,b){const c=Math.cos(b);b=Math.sin(b);return new I(c*a.g+b*a.i,c*a.h+b*a.j,-b*a.g+c*a.i,-b*a.h+c*a.j,a.l,a.m)}function L(a,b){b.setTransform(a.g,a.h,a.i,a.j,a.l,a.m)}
class I{constructor(a,b,c,d,e,f){this.g=a;this.h=b;this.i=c;this.j=d;this.l=e;this.m=f}toString(){return""}scale(a,b){return new I(this.g*a,this.h*a,this.i*b,this.j*b,this.l,this.m)}transform(a,b){"number"!==typeof a&&(b=a.h,a=a.g);if("number"!==typeof a||"number"!==typeof b)throw"need a Vector or two numbers";return new F(this.g*a+this.i*b+this.l,this.h*a+this.j*b+this.m)}translate(a,b){"number"!==typeof a&&(b=a.h,a=a.g);if("number"!==typeof a||"number"!==typeof b)throw"need a Vector or two numbers";
return new I(this.g,this.h,this.i,this.j,this.l+this.g*a+this.i*b,this.m+this.h*a+this.j*b)}}var Ha=new I(1,0,0,1,0,0);class M{constructor(a,b,c,d){this.l=q(a);this.j=q(c);this.i=q(b);this.m=q(d);if(a>c)throw"DoubleRect: left > right "+a+" > "+c;if(b>d)throw"DoubleRect: bottom > top "+b+" > "+d;}toString(){return""}v(a){return a===this?!0:a instanceof M?a.o()==this.l&&a.j==this.j&&a.i==this.i&&a.s()==this.m:!1}h(){return this.m-this.i}o(){return this.l}s(){return this.m}g(){return this.j-this.l}u(){return 1E-16>this.g()||1E-16>this.h()}scale(a,b){b=void 0===b?a:b;const c=(this.l+this.j)/2,d=(this.i+this.m)/2,e=this.g(),
f=this.h();return new M(c-a*e/2,d-b*f/2,c+a*e/2,d+b*f/2)}translate(a,b){"number"!==typeof a&&(b=a.h,a=a.g);if("number"!==typeof a||"number"!==typeof b)throw"";return new M(this.l+a,this.i+b,this.j+a,this.m+b)}}new M(0,0,0,0);var N={aa:"left",N:"middle",ba:"right",J:"full",O:"value"};class O{constructor(a,b){if("number"!==typeof a||"number"!==typeof b)throw"";if(0>a||0>b)throw"";this.j=a;this.i=b}toString(){return""}v(a){return this.j==a.j&&this.i==a.i}h(){return this.i}o(){return 0}s(){return 0}g(){return this.j}u(){return 1E-14>this.j||1E-14>this.i}}new O(0,0);var Q={ea:"top",N:"middle",V:"bottom",J:"full",O:"value"};function Ia(a,b){a:{var c="MIDDLE";var d=["LEFT","MIDDLE","RIGHT","FULL","VALUE"];for(let u=0,V=d.length;u<V;u++)if(c===d[u]){c=d[u];break a}throw"invalid HorizAlign value:  "+c;}a:{d="MIDDLE";var e=["TOP","MIDDLE","BOTTOM","FULL","VALUE"];for(let u=0,V=e.length;u<V;u++)if(d===e[u]){var f=e[u];break a}throw"invalid VerticalAlign value: "+d;}var g=1;if(1E-15>g||!isFinite(g))throw"bad aspectRatio "+g;d=b.o();e=b.i;const h=b.j-d,n=b.s()-e;if(1E-15>h||1E-15>n)throw"simRect cannot be empty "+b;b=a.s();
const W=a.o(),P=a.g();a=a.h();var m=0;let H=0,v=0,p=0;"FULL"==c&&(v=P/h,m=0);"FULL"==f&&(p=a/n,H=0);if("FULL"!=c||"FULL"!=f)if("FULL"==c?(p=v*g,m=!0):"FULL"==f?(v=p/g,m=!1):(v=P/h,p=v*g,m=!0,a<Math.floor(.5+p*n)&&(p=a/n,v=p/g,m=!1)),m)switch(m=0,c=Math.floor(.5+n*p),f){case "BOTTOM":H=0;break;case "MIDDLE":H=(a-c)/2;break;case "TOP":H=a-c;break;default:throw"unsupported alignment "+f;}else switch(H=0,f=Math.floor(.5+h*v),c){case "LEFT":m=0;break;case "MIDDLE":m=(P-f)/2;break;case "RIGHT":m=P-f;break;
default:throw"unsupported alignment "+c;}return new Ja(W,b+a,d-m/v,e-H/p,v,p)}function Ka(a,b){return new F(a.j+(b.g-a.m)*a.g,a.i-(b.h-a.l)*a.h)}class Ja{constructor(a,b,c,d,e,f){this.j=l(a);this.i=l(b);this.m=l(c);this.l=l(d);this.g=l(e);this.h=l(f);a=Ha;a=a.translate(this.j,this.i);a=a.scale(this.g,-this.h);this.o=a=a.translate(-this.m,-this.l)}toString(){return""}};function La(a){return a.i?(a.i=!1,!0):!1}class Ma{constructor(a,b){a=a||"SIM_OBJ"+Na++;t(r(a));this.A=b||a;this.i=!0}toString(){return""}}var Na=1;function Oa(a,b){const c=b.g-a.m.g;b=b.h-a.m.h;return new F(a.o.g+(c-0*b),a.o.h+(0*c+b))}function Pa(a){let b=new I(1,0,0,1,a.o.g,a.o.h);b=K(b,0);return b.translate(-a.m.g,-a.m.h)}function Qa(a,b){a.o=E(b);a.i=!0}class Ra extends Ma{constructor(a,b){super(a,b);this.s=1;this.m=this.o=G;this.u=[G]}toString(){return""}h(){return this.j/2- -this.j/2}g(){return this.l/2- -this.l/2}B(a){if(0>=a||"number"!==typeof a)throw"mass must be positive "+a;this.s=a;this.i=!0;return this}};function Sa(){const a=new R("fixed",void 0);a.l=1;a.j=1;a.v=1;a.i=!0;return a}function Ta(){const a=new R("block",void 0);a.l=1;a.j=1.5;a.v=1;a.i=!0;return a}function Ua(a,b){b.beginPath();const c=a.j/2,d=a.l/2;if(1==a.v)b.rect(-d,-c,a.l,a.j);else if(2==a.v)"function"===typeof b.ellipse?(b.moveTo(d,0),b.ellipse(0,0,d,c,0,0,2*Math.PI,!1)):(b.arc(0,0,Math.min(d,c),0,2*Math.PI,!1),b.closePath());else throw"";}
class R extends Ra{constructor(a,b){void 0===a||""==a?(b=Va++,a=Wa.R+b,b=Xa.R+b):b=b?b:a;super(a,b);this.s=1;this.v=2;this.j=this.l=1}toString(){return""}B(a){if(0>a||"number"!==typeof a)throw"mass must be non-negative "+a;this.s=a;this.i=!0;return this}}var Va=1,Wa={R:"PointMass"},Xa=Wa;function Ya(a){if("string"!==typeof a||""==a)return!1;var b=a.match(/^rgba\((.*),\s*\d*\.?\d+\)/);null!=b?a="rgb("+b[1]+")":(b=a.match(/^(#[0-9a-hA-H]{3})[0-9a-hA-H]$/),null!=b?a=b[1]:(b=a.match(/^(#[0-9a-hA-H]{6})[0-9a-hA-H]{2}$/),null!=b&&(a=b[1])));a=Aa(a).P;a=Ca(a);a=parseInt(a.substr(1),16);var c=[a>>16,a>>8&255,a&255];a=c[0];b=c[1];var d=c[2];c=Math.max(Math.max(a,b),d);var e=Math.min(Math.min(a,b),d);if(e==c)e=a=0;else{var f=c-e;e=f/c;a=60*(a==c?(b-d)/f:b==c?2+(d-a)/f:4+(a-b)/f);0>a&&(a+=360);
360<a&&(a-=360)}a=[a,e,c];return 167>a[2]||.57<a[1]&&40>Math.abs(a[0]-240)}function Za(a){a.h="orange";a.m=!0;return a}
class $a{constructor(a){this.g=null!=a?a:new R("proto");isFinite(this.g.s)&&Array.from(this.g.u);this.l=void 0!==this.h?this.h:"lightGray";this.j=Ya(this.l);this.m=!0}toString(){return""}s(a,b){a.save();const c=1/b.g;var d=Ga(b.o,Pa(this.g));L(d,a);Ua(this.g,a);void 0!==this.C&&this.C&&a.clip();var e=void 0!==this.h?this.h:"lightGray";e&&(a.fillStyle=e,a.fill());var f=void 0!==this.$?this.$:"";if(f){a.lineWidth=(void 0!==this.K?this.K:1)/b.g;var g=void 0!==this.u?this.u:[];0<g.length&&"function"===
typeof a.setLineDash&&(g=g.map(h=>h/b.g),a.setLineDash(g));a.strokeStyle=f;a.stroke();a.setLineDash([])}f=void 0!==this.G?this.G:null;g=void 0!==this.F?this.F:null;if(null!=f||null!=g)a.translate(-this.g.l/2,this.g.j/2),a.scale(c,-c),Fa(void 0!==this.D?this.D:Ha,a),null!=f&&a.drawImage(f,0,0),null!=g&&g(a);if(this.g.s!=w){L(d,a);this.l!==e&&(this.l=e,this.j=Ya(e));e=1/b.g;a.lineWidth=e;if(void 0!==this.B&&this.B){f=this.g.m;a.strokeStyle=this.j?"#ccc":"black";g=.2*Math.min(this.g.g(),this.g.h());
const h=8*e;g>h&&(g=h);a.beginPath();a.moveTo(f.g-g,f.h);a.lineTo(f.g+g,f.h);a.stroke();a.beginPath();a.moveTo(f.g,f.h-g);a.lineTo(f.g,f.h+g);a.stroke()}if(void 0!==this.A&&this.A){let h=4*e;e=.15*Math.min(this.g.g(),this.g.h());e<h&&(h=e);Array.from(this.g.u).forEach(n=>{a.fillStyle=this.j?"#ccc":"gray";a.beginPath();a.arc(n.g,n.h,h,0,2*Math.PI,!1);a.closePath();a.fill()})}}void 0!==this.o&&this.o&&(d=d.translate(G),(e=void 0!==this.Z?this.Z:0)&&(d=K(d,e)),d=d.scale(c,-c),L(d,a),a.fillStyle=void 0!==
this.M?this.M:"black",a.font=void 0!==this.o?this.o:"",a.textAlign="center",a.fillText(this.g.A,0,a.measureText("M").width/2));a.restore()}v(){return La(this.g)||this.m?(this.m=!1,!0):!1}i(){return void 0!==this.L?this.L:0}};function S(a){if(null==a.g||null==a.j)throw"";return Oa(a.j,a.g)}function T(a){if(null==a.h||null==a.l)throw"";return Oa(a.l,a.h)}class ab extends Ma{constructor(a,b){super("spring");this.j=a;this.g=E(G);this.l=b;this.h=E(G)}toString(){return""}};function bb(a){a.l="yellow";a.j=!0;return a}function cb(a){a.m="blue";a.j=!0;return a}function db(a){a.o=1;a.j=!0;return a}
class eb{constructor(a){this.h=null!=a?a:null;this.j=!0}toString(){return""}s(a,b){if(null!=this.h){var c=this.h;var d=T(c);var e=S(c);c=d.g-e.g;var f=d.h-e.h;d=d.i-e.i;d=c*c+f*f+d*d;d=Math.sqrt(d);if(!(1E-6>d)){a.save();a.lineWidth=void 0!==this.B?this.B:4;a.strokeStyle=.99999>d?void 0!==this.l?this.l:"red":void 0!==this.m?this.m:"green";if(1===(void 0!==this.u?this.u:1)){b=b.o;c=S(this.h);f=T(this.h);b=b.translate(c.g,c.h);b=K(b,Math.atan2(f.h-c.h,f.g-c.g));b=b.scale(d/6,this.g()/.5);a.beginPath();
d=b.transform(0,0);a.moveTo(d.g,d.h);J(b,.375,0,a);J(b,.75,.25,a);for(d=1;3>=d;d++)J(b,1.5*d,-.25,a),J(b,.375*(4*d+2),.25,a);J(b,5.625,0,a);J(b,6,0,a)}else d=Ka(b,S(this.h)),b=Ka(b,T(this.h)),a.beginPath(),a.moveTo(d.g,d.h),a.lineTo(b.g,b.h);a.stroke();a.restore()}}}v(){return(null==this.h?0:La(this.h))||this.j?(this.j=!1,!0):!1}g(){return void 0!==this.o?this.o:.5}i(){return void 0!==this.A?this.A:0}};class fb{constructor(){this.g=[]}toString(){return""}l(a){this.g.includes(a)||this.g.push(a)}};function gb(a){let b=!0,c=pa;for(let d=0,e=a.g.length;d<e;d++){const f=a.g[d].i();if(f<c){b=!1;break}c=f}b||(ja(a.g,function(d,e){d=d.i();e=e.i();return d<e?-1:d>e?1:0}),a.h=!0)}function hb(a,b,c){gb(a);a.g.forEach(d=>d.s(b,c))}
class ib extends D{constructor(){super("DISPLAY_LIST_"+jb++);this.g=[];this.h=!0}toString(){return""}add(a){if(!ba(a))throw"non-object passed to DisplayList.add";const b=a.i();gb(this);let c=this.g.length,d;for(d=0;d<c&&!(b<this.g[d].i());d++);ea(this.g,d,0,a);this.h=!0;C(this,new x("OBJECT_ADDED",a))}get(a){const b=this.g.length;if(0>a||a>=b)throw a+" is not in range 0 to "+(b-1);gb(this);return this.g[a]}length(){return this.g.length}}var jb=1;function kb(a,b){if(0<a.g()&&0<a.h()){const c=new O(a.g(),a.h());lb(b,c)}a.j.push(b);a.l(b);a.o=!0;C(a,new x("VIEW_ADDED",b));C(a,new x("VIEW_LIST_MODIFIED"));if(null==a.A){if(null!=b&&!a.j.includes(b))throw"cannot set focus to unknown view "+b;a.A!=b&&(a.A=b,a.o=!0,C(a,new x("FOCUS_VIEW_CHANGED",b)))}}
function mb(a){let b=!1;for(let e=0,f=a.j.length;e<f;e++){var c=a.j[e];{var d=c.j;let g=!1;for(let h=0,n=d.g.length;h<n;h++){const W=d.g[h].v();g=g||W}g||d.h?(d.h=!1,d=!0):d=!1}d||c.m?(c.m=!1,c=!0):c=!1;b=b||c}return b||a.o?(a.o=!1,!0):!1}function nb(a){const b=new O(a.i.width,a.i.height);a.j.forEach(c=>lb(c,b));a.o=!0;C(a,new x("SIZE_CHANGED"))}
function ob(a){if(null!=a.i.offsetParent){0<a.m&&a.m--;const b=mb(a);if(b||0<a.m){const c=a.i.getContext("2d");c.save();try{""!=a.u?(c.globalAlpha=a.s,c.fillStyle=a.u,c.fillRect(0,0,a.i.width,a.i.height),c.globalAlpha=1,1==a.s?a.m=0:b&&(a.m=Math.floor(10/a.s))):c.clearRect(0,0,a.i.width,a.i.height),a.j.forEach(d=>{c.save();c.globalAlpha=d.L;hb(d.j,c,d.F);c.restore()})}finally{c.restore()}}}}function pb(a){a.i.width=500;a.i.height=300;nb(a);ua(a,U.I);ua(a,U.H)}
class qb extends D{constructor(){var a=document.createElement("canvas");super("canvas1");this.i=a;a.contentEditable=!1;this.j=[];this.C=new fb;this.A=null;this.s=1;this.u="";this.o=!0;this.m=0;B(this,new z(U.I,()=>this.g()));B(this,new z(U.H,()=>this.h()));B(this,new z(U.ALPHA,()=>this.s));B(this,new A(U.U,()=>this.u))}toString(){return""}l(a){this.C.l(a)}h(){return this.i.height}g(){return this.i.width}}var U={I:"width",H:"height",ALPHA:"alpha",U:"background"};function lb(a,b){if(!(b instanceof O))throw"not a ScreenRect: "+b;if(b.u())throw"empty screenrect";if(!a.u.v(b)){a.u=b;b=Ia(a.u,a.i);if(!(b instanceof Ja))throw"not a CoordMap: "+b;a.F=b;a.m=!0;C(a,new x("COORD_MAP_CHANGED"));a.s=a.i.g();a.o=a.i.h();b=a.i;a.A=(b.l+b.j)/2;b=a.i;a.C=(b.i+b.m)/2;a.M=a.o/a.s;a.m=!0;C(a,new x("SCREEN_RECT_CHANGED"))}}
class rb extends D{constructor(a){super("simView");if(!(a instanceof M)||a.u())throw"bad simRect: "+a;this.i=a;this.u=new O(800,600);this.j=new ib;this.L=1;this.F=Ia(this.u,this.i);this.s=a.g();this.o=a.h();this.A=(a.l+a.j)/2;this.C=(a.i+a.m)/2;this.M=this.o/this.s;this.m=!0;this.K=new fb;B(this,new z(y.I,()=>this.g()));B(this,new z(y.H,()=>this.h()));B(this,ra(new z(y.W,()=>this.A)));B(this,ra(new z(y.X,()=>this.C)));B(this,new qa(()=>!0));B(this,new A(y.fa,()=>"MIDDLE",[Q.ea,Q.N,Q.V,Q.J,Q.O],["TOP",
"MIDDLE","BOTTOM","FULL","VALUE"]));B(this,new A(y.Y,()=>"MIDDLE",[N.aa,N.N,N.ba,N.J,N.O],["LEFT","MIDDLE","RIGHT","FULL","VALUE"]));B(this,new z(y.T,()=>1))}toString(){return""}l(a){this.K.l(a)}h(){return this.o}g(){return this.s}}var y={ca:"scale X-Y together",I:"width",H:"height",W:"center-x",X:"center-y",fa:"vertical-align",Y:"horizontal-align",T:"aspect-ratio"};function sb(a){if(null!=a.j){var b=k();0<=b-(a.i-a.h)&&(a.j(),a.i=b,a.h=0);a.g=a.m?setTimeout(a.o,17):requestAnimationFrame(a.o)}}function tb(a,b){a.l=!1;void 0!==a.g&&(a.m?clearTimeout(a.g):cancelAnimationFrame(a.g),a.g=void 0);a.i=NaN;a.h=0;a.j=b}function ub(a){a.l||(a.l=!0,a.h=0,a.i=k()-1E-7,sb(a))}class vb{constructor(){this.m="function"!==typeof requestAnimationFrame;this.g=void 0;this.j=null;this.o=()=>sb(this);this.l=!1;this.i=oa;this.h=0}toString(){return""}};function wb(){ka();var a=window.document.getElementById("canvas_div");if(!a)throw"";const b=new qb;pb(b);a.appendChild(b.i);const c=Ta();a=Sa().B(w);Qa(a,new F(-4,0));a=new ab(a,c);var d=new M(-5,-5,5,5);d=new rb(d);const e=Za(new $a(c));d.j.add(e);a=cb(bb(db(new eb(a))));d.j.add(a);kb(b,d);const f=new xa;a=new vb;tb(a,()=>{Qa(c,new F(1+3*Math.sin(3*(f.g?k()-f.h:f.i)),0));ob(b)});ub(a);wa(f)}var X=["makeSimpleApp"],Y=aa;X[0]in Y||"undefined"==typeof Y.execScript||Y.execScript("var "+X[0]);
for(var Z;X.length&&(Z=X.shift());)X.length||void 0===wb?Y[Z]&&Y[Z]!==Object.prototype[Z]?Y=Y[Z]:Y=Y[Z]={}:Y[Z]=wb;}).call(window)
