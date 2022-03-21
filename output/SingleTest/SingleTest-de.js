(/*Copyright_2020_Erik_Neumann_All_Rights_Reserved_www.myphysicslab.com*/function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';var aa=this||self;function h(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}function ba(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var d=c.slice();d.push.apply(d,arguments);return a.apply(this,d)}};const ca=Array.prototype.indexOf?function(a,b){return Array.prototype.indexOf.call(a,b,void 0)}:function(a,b){if("string"===typeof a)return"string"!==typeof b||1!=b.length?-1:a.indexOf(b,0);for(let c=0;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1};function k(a,b){a:{const c=a.length,d="string"===typeof a?a.split(""):a;for(let e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){b=e;break a}b=-1}return 0>b?null:"string"===typeof a?a.charAt(b):a[b]}
function da(a,b){b=ca(a,b);let c;(c=0<=b)&&Array.prototype.splice.call(a,b,1);return c}function ea(a,b){return a>b?1:a<b?-1:0};function fa(a){return a>Math.PI?a-2*Math.PI*Math.floor((a- -Math.PI)/(2*Math.PI)):a<-Math.PI?a+2*Math.PI*Math.floor(-(a-Math.PI)/(2*Math.PI)):a}function m(a){if(isNaN(a))throw"not a number "+a;return a}function n(a){return a.toUpperCase().replace(/[ -]/g,"_")}function r(a){if(!a.match(/^[A-Z_][A-Z_0-9]*$/))throw"not a valid name: "+a;return a}
function u(a,b,c){c=c||1E-14;if(isNaN(a)||isNaN(b))throw"argument is NaN";if(0>=c)throw"epsilon must be positive "+c;var d=d||1;if(0>=d)throw"magnitude must be positive "+d;const e=Math.max(Math.abs(a),Math.abs(b));return Math.abs(a-b)>(e>d?e:d)*c}function v(a){const b=a.length;for(let c=0;c<b;c++)a[c]=0}var ha=Number.NaN,w=Number.NEGATIVE_INFINITY,ia=Number.POSITIVE_INFINITY;function x(a,b){console.log(a);null!=y&&(b&&(a='<span class="error">'+a+"</span>"),y.innerHTML+=a+"<br>",window.scrollTo(0,document.documentElement.offsetHeight-window.innerHeight))}function ja(a){try{a()}catch(b){z+=1,x("***FAILED*** "+ka+" "+b,!0),x(b.stack,!0)}}function la(){const a=ma.shift();"function"===typeof a&&(a(),setTimeout(la,10))}function na(){var a=z;0<a?x("Tests finished -- "+a+" TESTS FAILED",!0):x("Tests finished and passed.");a=new Date;x(a.toDateString()+" "+a.toTimeString())}
function A(a,b){a=ka+" ["+a+"]";z+=1;x("FAILED "+a,!0);"string"===typeof b&&0<b.length&&x(b,!0);console.trace()}function B(a,b,c){"number"!==typeof b?A("value","not a number "+b):Math.abs(a-b)>c&&A("value","expected="+a+" but was actual="+b+" tolerance="+c)}function C(a){"boolean"===typeof a&&a||A("assert")}var ma=[],z=0,y=null,ka="";function D(a){return a instanceof E?a:new E(a.h,a.g,a.i)}function oa(a){isNaN(a.j)&&(a.j=0===a.i?a.h*a.h+a.g*a.g:a.h*a.h+a.g*a.g+a.i*a.i);return a.j}function pa(a,b,c){return u(a.h,b.h,c)||u(a.g,b.g,c)||u(a.i,b.i,c)?!1:!0}class E{constructor(a,b,c){c="number"===typeof c?c:0;this.h=m(a);this.g=m(b);this.i=m(c);this.j=this.l=ha}toString(){return""}add(a){return new E(this.h+a.h,this.g+a.g,this.i+a.i)}length(){isNaN(this.l)&&(this.l=Math.sqrt(oa(this)));return this.l}}new E(1,0);new E(0,1);
var F=new E(0,0);new E(0,-1);new E(-1,0);class qa{constructor(){m(0);m(0);m(0);m(0)}toString(){return""}}new qa;class ra{constructor(a){a=a||"SIM_OBJ"+sa++;this.v=r(n(a));this.s=ia}toString(){return""}u(){return""}l(a){return a==this}}var sa=1;class G extends ra{constructor(a){super(a);this.h=h(void 0)?void 0:F;this.g=h(void 0)?void 0:F}toString(){return""}l(a,b){return a instanceof G&&pa(a.h,this.h,b)?pa(a.g,this.g,b):!1}};class H{constructor(a,b,c){this.j=r(n(b));this.m=a;this.l=c}toString(){return this.u()}u(){const a=this.l;"object"===typeof a&&null!==a&&void 0!==a.u&&a.u();return""}h(){return this.j}i(){return this.m}g(){return this.l}o(a){return this.j==n(a)}};function ta(a){if(w>a.g()||w>a.s)throw"out of range: "+w+" value="+a.g()+" upper="+a.s;return a}class I{constructor(a,b,c){this.C=a;this.m=r(n(b));this.B=c;this.j=!1;this.s=ia}toString(){return""}u(){return""}h(){return this.m}i(){return this.C}g(){return this.B()}l(){return this.j}o(a){return this.m==n(a)}v(a){this.j=a}};function ua(a){if(!a.B){for(let b=0,c=a.v.length;b<c;b++){const d=a.v[b];d.action?a.s.includes(d.X)||a.s.push(d.X):da(a.s,d.X)}a.v=[]}}function va(a,b){b=n(b);return k(a.Z,c=>c.h()==b)}function J(a,b){a.B=!0;try{a.s.forEach(c=>{b instanceof H?(c.h++,K(c.i,b.i())):b instanceof I&&(c.g++,K(c.i,b.i()),c=b.g(),C("number"===typeof c))})}finally{a.B=!1,ua(a)}}function L(a,b){const c=va(a,b);if(null==c)throw"unknown Parameter "+b;J(a,c)}
function M(a,b){a=va(a,b);if(a instanceof I)return a;throw"ParameterNumber not found "+b;}class wa{constructor(a){if(!a)throw"no name";this.Y=r(n(a));this.s=[];this.Z=[];this.B=!1;this.v=[]}toString(){return""}u(){return""}l(a){const b=a.h(),c=va(this,b);if(null!=c)throw"parameter "+b+" already exists: "+c;this.Z.push(a)}};function xa(a){return.5*a.g*oa(a.o)+0*a.g}class ya extends ra{constructor(a){super(a);this.g=1;this.o=this.h=F}toString(){return""}i(a){if(0>=a||"number"!==typeof a)throw"mass must be positive "+a;this.g=a;return this}};function za(a){a=new N(a);a.m=.2;a.j=.2;return a}class N extends ya{constructor(a){if(void 0===a||""==a)a=Aa++,a=Ba.$+a;super(a);this.j=this.m=this.g=1}toString(){return""}i(a){if(0>a||"number"!==typeof a)throw"mass must be non-negative "+a;this.g=a;return this}l(a,b){return a instanceof N&&pa(a.h,this.h,b)&&!u(a.m,this.m,b)&&!u(a.j,this.j,b)?!0:!1}}var Aa=1,Ba={$:"PointMass"};function Ca(a,b){return k(a.g,function(c){return c.l(b,.1)})}function Da(a,b){a=a.get(b);if(a instanceof G)return a;throw"no ConcreteLine named "+b;}function Ea(a,b){a=a.get(b);if(a instanceof N)return a;throw"no PointMass named "+b;}
class Fa extends wa{constructor(){super("SIM_LIST");this.g=[]}toString(){return""}u(){return""}add(a){for(let c=0;c<arguments.length;c++){const d=arguments[c];if(!d)throw"cannot add invalid SimObject";if(isFinite(d.s))for(var b=void 0;b=Ca(this,d);)da(this.g,b)&&J(this,new H(this,"OBJECT_REMOVED",b));this.g.includes(d)||(this.g.push(d),J(this,new H(this,"OBJECT_ADDED",d)))}}get(a){if("number"===typeof a){if(0<=a&&a<this.g.length)return this.g[a]}else if("string"===typeof a){a=n(a);const b=k(this.g,
function(c){return c.v==a});if(null!=b)return b}throw"SimList did not find "+a;}length(){return this.g.length}};class Ga{constructor(a,b){this.B=a;this.s=r(n(b));this.j=0;this.m=!1}toString(){return""}u(){return""}h(){return this.s}i(){return this.B}g(){return this.j}l(){return this.m}o(a){return this.s==n(a)}v(a){this.m=a}};function O(a,b){if(0>b||b>=a.g.length)throw"bad variable index="+b+"; numVars="+a.g.length;}function Ha(a){if(0>a.i)throw"no time variable";var b=a.i;O(a,b);return a.g[b].g()}function P(a,b){return a.g.map(c=>!b&&c.l()?NaN:c.g())}function Q(a,b,c,d){O(a,b);a=a.g[b];if("DELETED"!=a.h()){if(isNaN(c)&&!a.l())throw"cannot set variable "+a.h()+" to NaN";d?a.j=c:a.j!=c&&(a.j=c)}}
function Ia(a,b,c){const d=a.g.length,e=b.length;if(e>d)throw"setValues bad length n="+e+" > N="+d;for(let g=0;g<d;g++)g<e&&Q(a,g,b[g],c)}
class Ja extends wa{constructor(a,b,c){super(void 0!==c?c:"VARIABLES");this.i=-1;if(a.length!=b.length)throw"varNames and localNames are different lengths";for(let e=0,g=a.length;e<g;e++){b=a[e];if("string"!==typeof b)throw"variable name "+b+" is not a string i="+e;b=r(n(b));a[e]=b;"TIME"==b&&(this.i=e)}a:{b=a.length;if(1<b){c=Array(b);for(var d=0;d<b;d++)c[d]=a[d];c.sort(ea);d=c[0];for(let e=1;e<b;e++){if(d==c[e]){b=!1;break a}d=c[e]}}b=!0}if(!b)throw"duplicate variable names";this.g=[];for(let e=
0,g=a.length;e<g;e++)this.g.push(new Ga(this,a[e]))}toString(){return""}u(){return""}l(){throw"addParameter not allowed on VarsList";}h(a){if(0==arguments.length)for(let b=0,c=this.g.length;b<c;b++);else for(let b=0,c=arguments.length;b<c;b++)O(this,arguments[b])}j(a){for(let b=0,c=arguments.length;b<c;b++){const d=arguments[b];O(this,d);this.g[d].v(!0)}}}var Ka={V:"time"},La=Ka;La={V:"Zeit"};function Ma(a){P(a.g);J(a,new H(a,"INITIAL_STATE_SAVED"))}function Na(a,b){a.g=b}class Oa extends wa{constructor(){super("SIM");this.R=new Fa;this.g=new Ja([],[],this.Y+"_VARS")}toString(){return""}};function Pa(a){let b=a.g+a.h;isNaN(a.i)||(b+=a.i);return b}class Qa{constructor(a,b){this.g=a||0;this.h=b||0;this.i=ha}toString(){return""}};var R={U:"potential energy",ca:"translational energy",S:"kinetic energy",aa:"rotational energy",ba:"total",W:"total energy",T:"potential energy offset"},S=R;S={U:"potenzielle Energie",ca:"Translationsenergie",S:"kinetische Energie",aa:"Rotationsenergie",ba:"gesamt",W:"gesamte Energie",T:"Potenzielle Energie Ausgleich"};function Ra(a){const b=a.g,c=P(b);for(let d=0;4>d;d++)c[d]=0;Ia(b,c);Sa(a,c)}function Sa(a,b){var c=b[0],d=Math.sin(c),e=Math.cos(c),g=b[2];c=Math.sin(g);var l=Math.cos(g);const p=a.o;g=a.m;var q=p*d;const t=-p*e;var f=q+g*c;const Va=t-g*l;q=new E(q,t);a.h.h=D(q);f=new E(f,Va);a.i.h=D(f);e*=b[1]*p;d*=b[1]*p;l=e+b[3]*g*l;b=d+b[3]*g*c;c=new E(e,d);a.h.o=D(c);b=new E(l,b);a.i.o=D(b);a.O.h=F;a.O.g=a.h.h;a.P.h=a.h.h;a.P.g=a.i.h}
function T(a){const b=a.o,c=a.m,d=xa(a.h)+xa(a.i);return new Qa(a.j*a.h.g*(a.h.h.g- -b)+a.j*a.i.g*(a.i.h.g-(-b-c))+a.C,d)}
function U(a,b,c){v(c);c[9]=1;{const d=b[0],e=b[1],g=b[2];b=b[3];const l=a.i.g,p=a.h.g,q=a.o,t=a.m;a=a.j;c[0]=e;let f=-a*(2*p+l)*Math.sin(d);f-=a*l*Math.sin(d-2*g);f-=2*l*b*b*t*Math.sin(d-g);f-=l*e*e*q*Math.sin(2*(d-g));f/=q*(2*p+l-l*Math.cos(2*(d-g)));c[1]=f;c[2]=b;f=(p+l)*e*e*q;f+=a*(p+l)*Math.cos(d);f+=l*b*b*t*Math.cos(d-g);f=2*f*Math.sin(d-g);f/=t*(2*p+l-l*Math.cos(2*(d-g)));c[3]=f}return null}
class Ta extends Oa{constructor(){super();Na(this,new Ja([V.K,V.L,V.M,V.N,V.I,V.J,R.S,R.U,R.W,Ka.V],[W.K,W.L,W.M,W.N,W.I,W.J,S.S,S.U,S.W,La.V],this.Y+"_VARS"));this.g.j(4,5,6,7,8);this.m=this.o=1;this.O=new G("rod1");this.P=new G("rod2");this.h=za("bob1").i(2);this.i=za("bob2").i(2);this.j=9.8;this.C=0;this.R.add(this.O,this.P,this.h,this.i);Ra(this);Q(this.g,0,Math.PI/8);Ma(this);this.l(new I(this,V.A,()=>this.o));this.l(new I(this,V.H,()=>this.m));this.l(new I(this,V.F,()=>this.h.g));this.l(new I(this,
V.G,()=>this.i.g));this.l(new I(this,V.D,()=>this.j));this.l(ta(new I(this,R.T,()=>this.C)))}toString(){return""}}var V={I:"acceleration-1",J:"acceleration-2",K:"angle-1",L:"angle-1 velocity",M:"angle-2",N:"angle-2 velocity",D:"gravity",F:"mass-1",G:"mass-2",A:"rod-1 length",H:"rod-2 length"},W=V;W={I:"Beschleunigung-1",J:"Beschleunigung-2",K:"Winkel-1",L:"Winkel-1 Geschwindigkeit",M:"Winkel-2",N:"Winkel-2 Geschwindigkeit",D:"Gravitation",F:"Masse-1",G:"Masse-2",A:"Stange-1 L\u00e4nge",H:"Stange-2 L\u00e4nge"};function Ua(a,b){const c=a.g.g,d=P(c),e=d.length;a.h.length<e&&(a.h=Array(e),a.i=Array(e),a.j=Array(e),a.l=Array(e),a.o=Array(e));const g=a.h,l=a.i,p=a.j,q=a.l,t=a.o;for(var f=0;f<e;f++)g[f]=d[f];v(l);f=U(a.g,g,l);if(null!==f)return f;for(f=0;f<e;f++)g[f]=d[f]+l[f]*b/2;v(p);f=U(a.g,g,p);if(null!==f)return f;for(f=0;f<e;f++)g[f]=d[f]+p[f]*b/2;v(q);f=U(a.g,g,q);if(null!==f)return f;for(f=0;f<e;f++)g[f]=d[f]+q[f]*b;v(t);f=U(a.g,g,t);if(null!==f)return f;for(a=0;a<e;a++)d[a]+=(l[a]+2*p[a]+2*q[a]+t[a])*
b/6;Ia(c,d,!0);return null}class Wa{constructor(a){this.g=a;this.h=[];this.i=[];this.j=[];this.l=[];this.o=[]}toString(){return""}u(){return""}};function Xa(a,b){var c=a.g.R,d=Ha(a.g.g);for(let e=c.g.length-1;0<=e;e--){const g=c.g[e];g.s<d&&(c.g.splice(e,1),J(c,new H(c,"OBJECT_REMOVED",g)))}b=Ua(a.h,b);if(null!=b)throw"error during advance "+b;c=a.g;a=c.g;b=P(a);d=fa(b[0]);d!=b[0]&&(Q(c.g,0,d,!1),b[0]=d);d=fa(b[2]);d!=b[2]&&(Q(c.g,2,d,!1),b[2]=d);Sa(c,b);d=Array(b.length);U(c,b,d);b[4]=d[1];b[5]=d[3];c=T(c);b[6]=c.h;b[7]=c.g;b[8]=Pa(c);Ia(a,b,!0)}class Ya{constructor(a){this.g=a;this.h=new Wa(a)}toString(){return""}u(){return""}};const K=(a,b)=>{b!==a&&A("value","expected="+a+" but was actual="+b)};class Za{constructor(a){this.i=a;this.g=this.h=0}u(){return"MockObserver1"}}
function $a(){ka="DoublePendulumTest.testDoublePendulum";x("DoublePendulumTest.testDoublePendulum");var a=new Ta,b=a.R,c=new Ya(a),d=Ea(b,"bob1");C(d instanceof N);d=Ea(b,"bob2");C(d instanceof N);d=Da(b,"rod1");C(d instanceof G);b=Da(b,"rod2");C(b instanceof G);b=M(a,V.A);K("ROD_1_LENGTH",n(V.A));C(b.o(V.A));K(n(V.A),b.h());K(1,b.g());b=M(a,V.H);K(n(V.H),b.h());K(1,b.g());b=M(a,V.F);K(n(V.F),b.h());K(2,b.g());b=M(a,V.G);K(n(V.G),b.h());K(2,b.g());b=M(a,V.D);K(n(V.D),b.h());K(9.8,b.g());b=new Za(a);
K(0,b.h);K(0,0);K(0,b.g);K(0,0);a.v.push({action:!0,X:b});ua(a);d=Array.from(a.s);K(1,d.length);C(d.includes(b));K(1,a.o);a.o=1.2;a.g.h(4,5,6,7,8);L(a,V.A);K(1.2,a.o);K(1,b.g);K(1,a.m);a.m=.9;a.g.h(4,5,6,7,8);L(a,V.H);K(.9,a.m);K(2,b.g);K(2,a.h.g);a.h.i(1);a.g.h(4,5,6,7,8);L(a,V.F);K(1,a.h.g);K(3,b.g);K(2,a.i.g);a.i.i(1.2);a.g.h(4,5,6,7,8);L(a,V.G);K(1.2,a.i.g);K(4,b.g);K(9.8,a.j);a.j=5;a.g.h(4,5,7,8);L(a,V.D);K(5,a.j);K(5,b.g);Ra(a);b=T(a);K(0,b.g);K(0,b.h);K(0,Pa(b));Q(a.g,0,Math.PI/8);Ma(a);b=
[[.39177,-.07457,.00115,.09186],[.38897,-.14902,.00459,.18354],[.38432,-.22321,.01032,.27484],[.37781,-.29694,.01833,.36545],[.36948,-.36994,.02859,.4549],[.35933,-.44182,.04106,.54255],[.3474,-.51206,.05569,.62746],[.33374,-.57996,.0724,.70839],[.31843,-.64463,.09106,.78374],[.30155,-.70497,.11152,.85156]];Xa(c,0);d=T(a);K(1.004790170851014,d.g);K(0,d.h);K(d.g,Pa(d));d=0;for(let g=0;10>g;g++){Xa(c,.025);d+=.025;var e=Ha(a.g);B(d,e,1E-15);e=P(a.g,!0);for(let l=0;4>l;l++)B(b[g][l],e[l],2E-5);B(1.0047901623242046,
e[8],2E-5)}c=99-T(a).g;a.C=c;a.g.h(7,8);L(a,R.T);a=T(a);K(99,a.g);B(.37563230349452903,a.h,1E-10)};function ab(){z=0;var a=document.getElementById("test_results");if(!h(a))throw'<p> element with id="test_results" not found';y=a;a=new Date;x(a.toDateString()+" "+a.toTimeString());x("compiled 2022-02-24 16:19:24");a:{if(window.hasOwnProperty("MYPHYSICSLAB_MACHINE_NAME")&&(a=window.MYPHYSICSLAB_MACHINE_NAME,"string"===typeof a))break a;a="UNKNOWN_MACHINE"}x("machine = "+a);a=navigator;a=null==a?"unknown":null!=a.userAgent.match(/.*Chrome.*/)?"Chrome":null!=a.userAgent.match(/.*Firefox.*/)?"Firefox":
null!=a.userAgent.match(/.*Safari.*/)?"Safari":"other";x("browser = "+a);x("COMPILE_LEVEL = advanced");x("goog.DEBUG = true");x("Util.DEBUG = false");x("myPhysicsLab version = 2.0.0");a=navigator;null!=a&&(x("userAgent = "+a.userAgent),x("platform = "+a.platform));window.MSSTream&&x("MSStream detected: probably on Internet Explorer for Windows Phone");x("NOTE: asserts are NOT enabled");ma.push(ba(ja,$a));ma.push(ba(ja,na));la()}var X=["runTests"],Y=aa;
X[0]in Y||"undefined"==typeof Y.execScript||Y.execScript("var "+X[0]);for(var Z;X.length&&(Z=X.shift());)X.length||void 0===ab?Y[Z]&&Y[Z]!==Object.prototype[Z]?Y=Y[Z]:Y=Y[Z]={}:Y[Z]=ab;}).call(window)
