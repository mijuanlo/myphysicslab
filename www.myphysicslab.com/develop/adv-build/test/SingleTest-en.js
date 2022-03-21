(/*Copyright_2020_Erik_Neumann_All_Rights_Reserved_www.myphysicslab.com*/function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';var aa=this||self;function h(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}function ba(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var d=c.slice();d.push.apply(d,arguments);return a.apply(this,d)}};const ca=Array.prototype.indexOf?function(a,b){return Array.prototype.indexOf.call(a,b,void 0)}:function(a,b){if("string"===typeof a)return"string"!==typeof b||1!=b.length?-1:a.indexOf(b,0);for(var c=0;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1};function k(a,b){a:{for(var c=a.length,d="string"===typeof a?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){b=e;break a}b=-1}return 0>b?null:"string"===typeof a?a.charAt(b):a[b]}
function da(a,b){b=ca(a,b);var c;(c=0<=b)&&Array.prototype.splice.call(a,b,1);return c}function ea(a,b){return a>b?1:a<b?-1:0};function fa(a){return a>Math.PI?a-2*Math.PI*Math.floor((a- -Math.PI)/(2*Math.PI)):a<-Math.PI?a+2*Math.PI*Math.floor(-(a-Math.PI)/(2*Math.PI)):a}function m(a){if(isNaN(a))throw"not a number "+a;return a}function n(a){return a.toUpperCase().replace(/[ -]/g,"_")}function r(a){if(!a.match(/^[A-Z_][A-Z_0-9]*$/))throw"not a valid name: "+a;return a}
function u(a,b,c){c=c||1E-14;if(isNaN(a)||isNaN(b))throw"argument is NaN";if(0>=c)throw"epsilon must be positive "+c;var d=d||1;if(0>=d)throw"magnitude must be positive "+d;const e=Math.max(Math.abs(a),Math.abs(b));return Math.abs(a-b)>(e>d?e:d)*c}function v(a){const b=a.length;for(let c=0;c<b;c++)a[c]=0}var ha=Number.NaN,w=Number.NEGATIVE_INFINITY,ia=Number.POSITIVE_INFINITY;function x(a,b){console.log(a);null!=y&&(b&&(a='<span class="error">'+a+"</span>"),y.innerHTML+=a+"<br>",window.scrollTo(0,document.documentElement.offsetHeight-window.innerHeight))}function ja(a){try{a()}catch(b){z+=1,x("***FAILED*** "+A+" "+b,!0),x(b.stack,!0)}}function ka(){const a=la.shift();"function"===typeof a&&(a(),setTimeout(ka,10))}function ma(){var a=z;0<a?x("Tests finished -- "+a+" TESTS FAILED",!0):x("Tests finished and passed.");a=new Date;x(a.toDateString()+" "+a.toTimeString())}
function B(a,b){a=A+" ["+a+"]";z+=1;x("FAILED "+a,!0);"string"===typeof b&&0<b.length&&x(b,!0);console.trace()}function C(a,b,c){"number"!==typeof b?B("value","not a number "+b):Math.abs(a-b)>c&&B("value","expected="+a+" but was actual="+b+" tolerance="+c)}function D(a){"boolean"===typeof a&&a||B("assert")}var la=[],z=0,y=null,A="";function E(a){return a instanceof F?a:new F(a.h,a.g,a.i)}function na(a){isNaN(a.j)&&(a.j=0===a.i?a.h*a.h+a.g*a.g:a.h*a.h+a.g*a.g+a.i*a.i);return a.j}function oa(a,b,c){return u(a.h,b.h,c)||u(a.g,b.g,c)||u(a.i,b.i,c)?!1:!0}class F{constructor(a,b,c){c="number"===typeof c?c:0;this.h=m(a);this.g=m(b);this.i=m(c);this.j=this.l=ha}toString(){return""}add(a){return new F(this.h+a.h,this.g+a.g,this.i+a.i)}length(){isNaN(this.l)&&(this.l=Math.sqrt(na(this)));return this.l}}new F(1,0);new F(0,1);
var G=new F(0,0);new F(0,-1);new F(-1,0);class pa{constructor(){m(0);m(0);m(0);m(0)}toString(){return""}}new pa;class qa{constructor(a){a=a||"SIM_OBJ"+ra++;this.u=r(n(a));this.s=ia}toString(){return""}l(a){return a==this}}var ra=1;class H extends qa{constructor(a){super(a);this.h=h(void 0)?void 0:G;this.g=h(void 0)?void 0:G}toString(){return""}l(a,b){return a instanceof H&&oa(a.h,this.h,b)?oa(a.g,this.g,b):!1}};class I{constructor(a,b,c){this.j=r(n(b));this.l=a;this.m=c}toString(){return""}h(){return this.j}i(){return this.l}g(){return this.m}o(a){return this.j==n(a)}};function sa(a){if(w>a.g()||w>a.s)throw"out of range: "+w+" value="+a.g()+" upper="+a.s;return a}class J{constructor(a,b,c){this.B=a;this.m=r(n(b));this.v=c;this.j=!1;this.s=ia}toString(){return""}h(){return this.m}i(){return this.B}g(){return this.v()}l(){return this.j}o(a){return this.m==n(a)}u(a){this.j=a}};function ta(a){if(!a.v){for(let b=0,c=a.u.length;b<c;b++){const d=a.u[b];d.action?a.s.includes(d.K)||a.s.push(d.K):da(a.s,d.K)}a.u=[]}}function ua(a,b){b=n(b);return k(a.T,c=>c.h()==b)}function K(a,b){a.v=!0;try{a.s.forEach(c=>{b instanceof I?(c.h++,L(c.i,b.i())):b instanceof J&&(c.g++,L(c.i,b.i()),c=b.g(),D("number"===typeof c))})}finally{a.v=!1,ta(a)}}function M(a,b){const c=ua(a,b);if(null==c)throw"unknown Parameter "+b;K(a,c)}
function N(a,b){a=ua(a,b);if(a instanceof J)return a;throw"ParameterNumber not found "+b;}class va{constructor(a){if(!a)throw"no name";this.S=r(n(a));this.s=[];this.T=[];this.v=!1;this.u=[]}toString(){return""}l(a){const b=a.h(),c=ua(this,b);if(null!=c)throw"parameter "+b+" already exists: "+c;this.T.push(a)}};function wa(a){return.5*a.g*na(a.o)+0*a.g}class xa extends qa{constructor(a){super(a);this.g=1;this.o=this.h=G}toString(){return""}i(a){if(0>=a||"number"!==typeof a)throw"mass must be positive "+a;this.g=a;return this}};function ya(a){a=new O(a);a.m=.2;a.j=.2;return a}class O extends xa{constructor(a){if(void 0===a||""==a)a=za++,a=Aa.Z+a;super(a);this.j=this.m=this.g=1}toString(){return""}i(a){if(0>a||"number"!==typeof a)throw"mass must be non-negative "+a;this.g=a;return this}l(a,b){return a instanceof O&&oa(a.h,this.h,b)&&!u(a.m,this.m,b)&&!u(a.j,this.j,b)?!0:!1}}var za=1,Aa={Z:"PointMass"};function Ba(a,b){return k(a.g,function(c){return c.l(b,.1)})}function Ca(a,b){a=a.get(b);if(a instanceof H)return a;throw"no ConcreteLine named "+b;}function Da(a,b){a=a.get(b);if(a instanceof O)return a;throw"no PointMass named "+b;}
class Ea extends va{constructor(){super("SIM_LIST");this.g=[]}toString(){return""}add(a){for(let c=0;c<arguments.length;c++){const d=arguments[c];if(!d)throw"cannot add invalid SimObject";if(isFinite(d.s))for(var b=void 0;b=Ba(this,d);)da(this.g,b)&&K(this,new I(this,"OBJECT_REMOVED",b));this.g.includes(d)||(this.g.push(d),K(this,new I(this,"OBJECT_ADDED",d)))}}get(a){if("number"===typeof a){if(0<=a&&a<this.g.length)return this.g[a]}else if("string"===typeof a){a=n(a);const b=k(this.g,function(c){return c.u==
a});if(null!=b)return b}throw"SimList did not find "+a;}length(){return this.g.length}};class Fa{constructor(a,b){this.v=a;this.s=r(n(b));this.j=0;this.m=!1}toString(){return""}h(){return this.s}i(){return this.v}g(){return this.j}l(){return this.m}o(a){return this.s==n(a)}u(a){this.m=a}};function P(a,b){if(0>b||b>=a.g.length)throw"bad variable index="+b+"; numVars="+a.g.length;}function Ga(a){if(0>a.i)throw"no time variable";var b=a.i;P(a,b);return a.g[b].g()}function Q(a,b){return a.g.map(c=>!b&&c.l()?NaN:c.g())}function R(a,b,c,d){P(a,b);a=a.g[b];if("DELETED"!=a.h()){if(isNaN(c)&&!a.l())throw"cannot set variable "+a.h()+" to NaN";d?a.j=c:a.j!=c&&(a.j=c)}}
function Ha(a,b,c){const d=a.g.length,e=b.length;if(e>d)throw"setValues bad length n="+e+" > N="+d;for(let g=0;g<d;g++)g<e&&R(a,g,b[g],c)}
class Ia extends va{constructor(a,b,c){super(void 0!==c?c:"VARIABLES");this.i=-1;if(a.length!=b.length)throw"varNames and localNames are different lengths";for(let e=0,g=a.length;e<g;e++){b=a[e];if("string"!==typeof b)throw"variable name "+b+" is not a string i="+e;b=r(n(b));a[e]=b;"TIME"==b&&(this.i=e)}a:{b=a.length;if(1<b){c=Array(b);for(var d=0;d<b;d++)c[d]=a[d];c.sort(ea);d=c[0];for(let e=1;e<b;e++){if(d==c[e]){b=!1;break a}d=c[e]}}b=!0}if(!b)throw"duplicate variable names";this.g=[];for(let e=
0,g=a.length;e<g;e++)this.g.push(new Fa(this,a[e]))}toString(){return""}l(){throw"addParameter not allowed on VarsList";}h(a){if(0==arguments.length)for(let b=0,c=this.g.length;b<c;b++);else for(let b=0,c=arguments.length;b<c;b++)P(this,arguments[b])}j(a){for(let b=0,c=arguments.length;b<c;b++){const d=arguments[b];P(this,d);this.g[d].u(!0)}}}var Ja={X:"time"};function Ka(a){Q(a.g);K(a,new I(a,"INITIAL_STATE_SAVED"))}function La(a,b){a.g=b}class Ma extends va{constructor(){super("SIM");this.J=new Ea;this.g=new Ia([],[],this.S+"_VARS")}toString(){return""}};function Na(a){let b=a.g+a.h;isNaN(a.i)||(b+=a.i);return b}class Oa{constructor(a,b){this.g=a||0;this.h=b||0;this.i=ha}toString(){return""}};var S={W:"potential energy",ba:"translational energy",U:"kinetic energy",$:"rotational energy",aa:"total",Y:"total energy",V:"potential energy offset"};(class{constructor(a,b){this.g=b===Pa?a:""}}).prototype.toString=function(){return this.g.toString()};var Pa={};function Qa(a){const b=a.g,c=Q(b);for(let d=0;4>d;d++)c[d]=0;Ha(b,c);Ra(a,c)}function Ra(a,b){var c=b[0],d=Math.sin(c),e=Math.cos(c),g=b[2];c=Math.sin(g);var l=Math.cos(g);const p=a.o;g=a.m;var q=p*d;const t=-p*e;var f=q+g*c;const Ua=t-g*l;q=new F(q,t);a.h.h=E(q);f=new F(f,Ua);a.i.h=E(f);e*=b[1]*p;d*=b[1]*p;l=e+b[3]*g*l;b=d+b[3]*g*c;c=new F(e,d);a.h.o=E(c);b=new F(l,b);a.i.o=E(b);a.H.h=G;a.H.g=a.h.h;a.I.h=a.h.h;a.I.g=a.i.h}
function T(a){const b=a.o,c=a.m,d=wa(a.h)+wa(a.i);return new Oa(a.j*a.h.g*(a.h.h.g- -b)+a.j*a.i.g*(a.i.h.g-(-b-c))+a.B,d)}
function U(a,b,c){v(c);c[9]=1;{const d=b[0],e=b[1],g=b[2];b=b[3];const l=a.i.g,p=a.h.g,q=a.o,t=a.m;a=a.j;c[0]=e;let f=-a*(2*p+l)*Math.sin(d);f-=a*l*Math.sin(d-2*g);f-=2*l*b*b*t*Math.sin(d-g);f-=l*e*e*q*Math.sin(2*(d-g));f/=q*(2*p+l-l*Math.cos(2*(d-g)));c[1]=f;c[2]=b;f=(p+l)*e*e*q;f+=a*(p+l)*Math.cos(d);f+=l*b*b*t*Math.cos(d-g);f=2*f*Math.sin(d-g);f/=t*(2*p+l-l*Math.cos(2*(d-g)));c[3]=f}return null}
class Sa extends Ma{constructor(){super();La(this,new Ia([V.N,V.O,V.P,V.R,V.L,V.M,S.U,S.W,S.Y,Ja.X],[W.N,W.O,W.P,W.R,W.L,W.M,S.U,S.W,S.Y,Ja.X],this.S+"_VARS"));this.g.j(4,5,6,7,8);this.m=this.o=1;this.H=new H("rod1");this.I=new H("rod2");this.h=ya("bob1").i(2);this.i=ya("bob2").i(2);this.j=9.8;this.B=0;this.J.add(this.H,this.I,this.h,this.i);Qa(this);R(this.g,0,Math.PI/8);Ka(this);this.l(new J(this,V.A,()=>this.o));this.l(new J(this,V.G,()=>this.m));this.l(new J(this,V.D,()=>this.h.g));this.l(new J(this,
V.F,()=>this.i.g));this.l(new J(this,V.C,()=>this.j));this.l(sa(new J(this,S.V,()=>this.B)))}toString(){return""}}var V={L:"acceleration-1",M:"acceleration-2",N:"angle-1",O:"angle-1 velocity",P:"angle-2",R:"angle-2 velocity",C:"gravity",D:"mass-1",F:"mass-2",A:"rod-1 length",G:"rod-2 length"},W=V;function Ta(a,b){const c=a.g.g,d=Q(c),e=d.length;a.h.length<e&&(a.h=Array(e),a.i=Array(e),a.j=Array(e),a.l=Array(e),a.o=Array(e));const g=a.h,l=a.i,p=a.j,q=a.l,t=a.o;for(var f=0;f<e;f++)g[f]=d[f];v(l);f=U(a.g,g,l);if(null!==f)return f;for(f=0;f<e;f++)g[f]=d[f]+l[f]*b/2;v(p);f=U(a.g,g,p);if(null!==f)return f;for(f=0;f<e;f++)g[f]=d[f]+p[f]*b/2;v(q);f=U(a.g,g,q);if(null!==f)return f;for(f=0;f<e;f++)g[f]=d[f]+q[f]*b;v(t);f=U(a.g,g,t);if(null!==f)return f;for(a=0;a<e;a++)d[a]+=(l[a]+2*p[a]+2*q[a]+t[a])*
b/6;Ha(c,d,!0);return null}class Va{constructor(a){this.g=a;this.h=[];this.i=[];this.j=[];this.l=[];this.o=[]}toString(){return""}};function Wa(a,b){var c=a.g.J,d=Ga(a.g.g);for(let e=c.g.length-1;0<=e;e--){const g=c.g[e];g.s<d&&(c.g.splice(e,1),K(c,new I(c,"OBJECT_REMOVED",g)))}b=Ta(a.h,b);if(null!=b)throw"error during advance "+b;c=a.g;a=c.g;b=Q(a);d=fa(b[0]);d!=b[0]&&(R(c.g,0,d,!1),b[0]=d);d=fa(b[2]);d!=b[2]&&(R(c.g,2,d,!1),b[2]=d);Ra(c,b);d=Array(b.length);U(c,b,d);b[4]=d[1];b[5]=d[3];c=T(c);b[6]=c.h;b[7]=c.g;b[8]=Na(c);Ha(a,b,!0)}class Xa{constructor(a){this.g=a;this.h=new Va(a)}toString(){return""}};const L=(a,b)=>{b!==a&&B("value","expected="+a+" but was actual="+b)};class Ya{constructor(a){this.i=a;this.g=this.h=0}}
function Za(){A="DoublePendulumTest.testDoublePendulum";x("DoublePendulumTest.testDoublePendulum");var a=new Sa,b=a.J,c=new Xa(a),d=Da(b,"bob1");D(d instanceof O);d=Da(b,"bob2");D(d instanceof O);d=Ca(b,"rod1");D(d instanceof H);b=Ca(b,"rod2");D(b instanceof H);b=N(a,V.A);L("ROD_1_LENGTH",n(V.A));D(b.o(V.A));L(n(V.A),b.h());L(1,b.g());b=N(a,V.G);L(n(V.G),b.h());L(1,b.g());b=N(a,V.D);L(n(V.D),b.h());L(2,b.g());b=N(a,V.F);L(n(V.F),b.h());L(2,b.g());b=N(a,V.C);L(n(V.C),b.h());L(9.8,b.g());b=new Ya(a);
L(0,b.h);L(0,0);L(0,b.g);L(0,0);a.u.push({action:!0,K:b});ta(a);d=Array.from(a.s);L(1,d.length);D(d.includes(b));L(1,a.o);a.o=1.2;a.g.h(4,5,6,7,8);M(a,V.A);L(1.2,a.o);L(1,b.g);L(1,a.m);a.m=.9;a.g.h(4,5,6,7,8);M(a,V.G);L(.9,a.m);L(2,b.g);L(2,a.h.g);a.h.i(1);a.g.h(4,5,6,7,8);M(a,V.D);L(1,a.h.g);L(3,b.g);L(2,a.i.g);a.i.i(1.2);a.g.h(4,5,6,7,8);M(a,V.F);L(1.2,a.i.g);L(4,b.g);L(9.8,a.j);a.j=5;a.g.h(4,5,7,8);M(a,V.C);L(5,a.j);L(5,b.g);Qa(a);b=T(a);L(0,b.g);L(0,b.h);L(0,Na(b));R(a.g,0,Math.PI/8);Ka(a);b=
[[.39177,-.07457,.00115,.09186],[.38897,-.14902,.00459,.18354],[.38432,-.22321,.01032,.27484],[.37781,-.29694,.01833,.36545],[.36948,-.36994,.02859,.4549],[.35933,-.44182,.04106,.54255],[.3474,-.51206,.05569,.62746],[.33374,-.57996,.0724,.70839],[.31843,-.64463,.09106,.78374],[.30155,-.70497,.11152,.85156]];Wa(c,0);d=T(a);L(1.004790170851014,d.g);L(0,d.h);L(d.g,Na(d));d=0;for(let g=0;10>g;g++){Wa(c,.025);d+=.025;var e=Ga(a.g);C(d,e,1E-15);e=Q(a.g,!0);for(let l=0;4>l;l++)C(b[g][l],e[l],2E-5);C(1.0047901623242046,
e[8],2E-5)}c=99-T(a).g;a.B=c;a.g.h(7,8);M(a,S.V);a=T(a);L(99,a.g);C(.37563230349452903,a.h,1E-10)};function $a(){z=0;var a=document.getElementById("test_results");if(!h(a))throw'<p> element with id="test_results" not found';y=a;a=new Date;x(a.toDateString()+" "+a.toTimeString());x("compiled 2021-03-25 23:47:47");a:{if(window.hasOwnProperty("MYPHYSICSLAB_MACHINE_NAME")&&(a=window.MYPHYSICSLAB_MACHINE_NAME,"string"===typeof a))break a;a="UNKNOWN_MACHINE"}x("machine = "+a);a=navigator;a=null==a?"unknown":null!=a.userAgent.match(/.*Chrome.*/)?"Chrome":null!=a.userAgent.match(/.*Firefox.*/)?"Firefox":
null!=a.userAgent.match(/.*Safari.*/)?"Safari":"other";x("browser = "+a);x("COMPILE_LEVEL = advanced");x("goog.DEBUG = true");x("Util.DEBUG = false");x("myPhysicsLab version = 2.0.0");a=navigator;null!=a&&(x("userAgent = "+a.userAgent),x("platform = "+a.platform));window.MSSTream&&x("MSStream detected: probably on Internet Explorer for Windows Phone");x("NOTE: asserts are NOT enabled");la.push(ba(ja,Za));la.push(ba(ja,ma));ka()}var X=["runTests"],Y=aa;
X[0]in Y||"undefined"==typeof Y.execScript||Y.execScript("var "+X[0]);for(var Z;X.length&&(Z=X.shift());)X.length||void 0===$a?Y[Z]&&Y[Z]!==Object.prototype[Z]?Y=Y[Z]:Y=Y[Z]={}:Y[Z]=$a;}).call(window)