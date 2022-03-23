(/*Copyright_2020_Erik_Neumann_All_Rights_Reserved_www.myphysicslab.com*/function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';var r=this||self;function aa(){}function ca(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}function da(a,b){function c(){}c.prototype=b.prototype;a.ka=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.ta=function(d,e,f){for(var h=Array(arguments.length-2),g=2;g<arguments.length;g++)h[g-2]=arguments[g];return b.prototype[e].apply(d,h)}};const ea=Array.prototype.indexOf?function(a,b){return Array.prototype.indexOf.call(a,b,void 0)}:function(a,b){if("string"===typeof a)return"string"!==typeof b||1!=b.length?-1:a.indexOf(b,0);for(let c=0;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},fa=Array.prototype.forEach?function(a,b){Array.prototype.forEach.call(a,b,void 0)}:function(a,b){const c=a.length,d="string"===typeof a?a.split(""):a;for(let e=0;e<c;e++)e in d&&b.call(void 0,d[e],e,a)},ha=Array.prototype.reduce?function(a,b,c){return Array.prototype.reduce.call(a,
b,c)}:function(a,b,c){let d=c;fa(a,function(e,f){d=b.call(void 0,d,e,f,a)});return d};function ia(a,b){b=ja(a,b,void 0);return 0>b?null:"string"===typeof a?a.charAt(b):a[b]}function ja(a,b,c){const d=a.length,e="string"===typeof a?a.split(""):a;for(let f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return f;return-1}function ka(a,b){b=ea(a,b);let c;(c=0<=b)&&Array.prototype.splice.call(a,b,1);return c}function na(a,b,c,d){Array.prototype.splice.apply(a,pa(arguments,1))}
function pa(a,b,c){return 2>=arguments.length?Array.prototype.slice.call(a,b):Array.prototype.slice.call(a,b,c)}function qa(a,b){a.sort(b||ra)}function sa(a,b){const c=Array(a.length);for(let e=0;e<a.length;e++)c[e]={index:e,value:a[e]};const d=b||ra;qa(c,function(e,f){return d(e.value,f.value)||e.index-f.index});for(b=0;b<a.length;b++)a[b]=c[b].value}function ra(a,b){return a>b?1:a<b?-1:0}function ta(a){const b=[];for(let c=0;c<a;c++)b[c]=-1;return b};function ua(){window.onerror=function(a,b,c){3>va++&&alert(a+"\n"+b+":"+c)}}function t(a){if(!isFinite(a))throw"not a finite number "+a;return a}function v(a){if(isNaN(a))throw"not a number "+a;return a}function w(a){return a.toUpperCase().replace(/[ -]/g,"_")}function x(a){if(!a.match(/^[A-Z_][A-Z_0-9]*$/))throw"not a valid name: "+a;return a}var wa=Math.pow(2,53),xa=Number.NaN,ya=Number.NEGATIVE_INFINITY,va=0,za=Number.POSITIVE_INFINITY;function Aa(a,b){return new y(a.i-b.g(),a.l-b.h(),a.j-b.m())}
class y{constructor(a,b,c){c="number"===typeof c?c:0;this.i=v(a);this.l=v(b);this.j=v(c);this.o=this.s=xa}toString(){return""}add(a){return new y(this.i+a.g(),this.l+a.h(),this.j+a.m())}u(a){return null===a?!1:a.g()===this.i&&a.h()===this.l&&a.m()===this.j}g(){return this.i}h(){return this.l}m(){return this.j}length(){if(isNaN(this.s)){var a=Math,b=a.sqrt;isNaN(this.o)&&(this.o=0===this.j?this.i*this.i+this.l*this.l:this.i*this.i+this.l*this.l+this.j*this.j);this.s=b.call(a,this.o)}return this.s}}
new y(1,0);new y(0,1);var Ba=new y(0,0);new y(0,-1);new y(-1,0);class Ca{constructor(a,b,c,d,e,f){this.g=a;this.h=b;this.i=c;this.l=d;this.j=e;this.m=f}toString(){return""}scale(a,b){return new Ca(this.g*a,this.h*a,this.i*b,this.l*b,this.j,this.m)}transform(a,b){"number"!==typeof a&&(b=a.h(),a=a.g());if("number"!==typeof a||"number"!==typeof b)throw"need a Vector or two numbers";return new y(this.g*a+this.i*b+this.j,this.h*a+this.l*b+this.m)}translate(a,b){"number"!==typeof a&&(b=a.h(),a=a.g());if("number"!==typeof a||"number"!==typeof b)throw"need a Vector or two numbers";
return new Ca(this.g,this.h,this.i,this.l,this.j+this.g*a+this.i*b,this.m+this.h*a+this.l*b)}}var Da=new Ca(1,0,0,1,0,0);function Ea(a,b){return b.g()>=a.o&&b.g()<=a.h&&b.h()>=a.g&&b.h()<=a.s}function Fa(a){return(a.o+a.h)/2}function Ga(a){return(a.g+a.s)/2}function Ja(a,b,c){if(Ea(a,b)||Ea(a,c))return!0;const d=b.g();b=b.h();const e=c.g();c=c.h();let f=a.o;if(d<f&&e<f)return!1;f=a.h;if(d>f&&e>f)return!1;f=a.g;if(b<f&&c<f)return!1;f=a.s;return b>f&&c>f?!1:!0}
class z{constructor(a,b,c,d){this.o=v(a);this.h=v(c);this.g=v(b);this.s=v(d);if(a>c)throw"DoubleRect: left > right "+a+" > "+c;if(b>d)throw"DoubleRect: bottom > top "+b+" > "+d;}toString(){return""}u(a){return a===this?!0:a instanceof z?a.j()==this.o&&a.h==this.h&&a.g==this.g&&a.m()==this.s:!1}l(){return this.s-this.g}j(){return this.o}m(){return this.s}i(){return this.h-this.o}v(){return 1E-16>this.i()||1E-16>this.l()}scale(a,b){b=void 0===b?a:b;const c=Fa(this),d=Ga(this),e=this.i(),f=this.l();
return new z(c-a*e/2,d-b*f/2,c+a*e/2,d+b*f/2)}translate(a,b){"number"!==typeof a&&(b=a.h(),a=a.g());if("number"!==typeof a||"number"!==typeof b)throw"";return new z(this.o+a,this.g+b,this.h+a,this.s+b)}}var Ka=new z(0,0,0,0);var La=a=>{const b=["LEFT","MIDDLE","RIGHT","FULL","VALUE"];for(let c=0,d=b.length;c<d;c++)if(a===b[c])return b[c];throw"invalid HorizAlign value:  "+a;},A={ha:"left",M:"middle",ia:"right",K:"full",N:"value"};A={ha:"esquerra",M:"centrat",ia:"dreta",K:"complet",N:"valor"};class B{constructor(a,b){if("number"!==typeof a||"number"!==typeof b)throw"";if(0>a||0>b)throw"";this.h=a;this.g=b}toString(){return""}u(a){return this.h==a.h&&this.g==a.g}l(){return this.g}j(){return 0}m(){return 0}i(){return this.h}v(){return 1E-14>this.h||1E-14>this.g}}var Ma=new B(0,0);var Na=a=>{const b=["TOP","MIDDLE","BOTTOM","FULL","VALUE"];for(let c=0,d=b.length;c<d;c++)if(a===b[c])return b[c];throw"invalid VerticalAlign value: "+a;},C={ja:"top",M:"middle",ba:"bottom",K:"full",N:"value"};C={ja:"superior",M:"mitj\u00e0",ba:"fons",K:"complet",N:"valor"};function Oa(a,b,c,d){var e=1;c=La(c||"MIDDLE");d=Na(d||"MIDDLE");e=e||1;if(1E-15>e||!isFinite(e))throw"bad aspectRatio "+e;const f=b.j(),h=b.g,g=b.h-f,k=b.m()-h;if(1E-15>g||1E-15>k)throw"simRect cannot be empty "+b;b=a.m();const n=a.j(),l=a.i();a=a.l();var m=0;let u=0,p=0,q=0;"FULL"==c&&(p=l/g,m=0);"FULL"==d&&(q=a/k,u=0);if("FULL"!=c||"FULL"!=d)if("FULL"==c?(q=p*e,m=!0):"FULL"==d?(p=q/e,m=!1):(p=l/g,q=p*e,m=!0,a<Math.floor(.5+q*k)&&(q=a/k,p=q/e,m=!1)),m)switch(m=0,c=Math.floor(.5+k*q),d){case "BOTTOM":u=
0;break;case "MIDDLE":u=(a-c)/2;break;case "TOP":u=a-c;break;default:throw"unsupported alignment "+d;}else switch(u=0,d=Math.floor(.5+g*p),c){case "LEFT":m=0;break;case "MIDDLE":m=(l-d)/2;break;case "RIGHT":m=l-d;break;default:throw"unsupported alignment "+c;}return new Pa(n,b+a,f-m/p,h-u/q,p,q)}function Qa(a,b){return a.m+(b-a.l)/a.g}function Ra(a,b){return a.j+(a.i-b)/a.h}
function Sa(a,b){let c;"number"===typeof b?c=void 0:(c=b.h(),b=b.g());if("number"!==typeof b||"number"!==typeof c)throw"";return new y(Qa(a,b),Ra(a,c))}function Ta(a,b){return new z(Qa(a,b.j()),Ra(a,b.m()+b.l()),Qa(a,b.j()+b.i()),Ra(a,b.m()))}function D(a,b){return a.l+(b-a.m)*a.g}function E(a,b){return a.i-(b-a.j)*a.h}function Ua(a,b){return new y(D(a,b.g()),E(a,b.h()))}
class Pa{constructor(a,b,c,d,e,f){this.l=t(a);this.i=t(b);this.m=t(c);this.j=t(d);this.g=t(e);this.h=t(f);a=Da;a=a.translate(this.l,this.i);a=a.scale(this.g,-this.h);a.translate(-this.m,-this.j)}toString(){return""}};function Va(a,b){var c=Math.pow(10,Math.floor(Math.log(b)/Math.LN10));b/=c;c*=8<=b?2:5<=b?1:3<=b?.5:2<=b?.4:.2;b=Math.log(c)/Math.LN10;a.i=0>b?Math.ceil(-b):0;return c}
class Wa{constructor(a){this.g=a||Ka;this.m="14pt sans-serif";this.j="gray";this.i=0;this.h=!0}toString(){return""}C(){return""}F(){return!1}B(a,b){a.save();a.strokeStyle=this.j;a.fillStyle=this.j;a.font=this.m;a.textAlign="start";a.textBaseline="alphabetic";var c=this.g;var d=c.j(),e=c.h,f=c.g,h=c.m();c=e-.06*(e-d);var g=d+.01*(e-d);var k=0;k<g?k=g:k>c&&(k=c);c=D(b,k);k=E(b,h);var n=E(b,f);g=E(b,0);g<k+30?g=k+30:g>n-30&&(g=n-30);a.beginPath();a.moveTo(D(b,d),g);a.lineTo(D(b,e),g);a.stroke();d=g;
k=this.g;e=d-4;g=e+8;var l=k.j();k=k.h;n=Va(this,k-l);for(var m=Math.ceil(l/n)*n;m<k;){l=D(b,m);a.beginPath();a.moveTo(l,e);a.lineTo(l,g);a.stroke();const u=m+n;if(u>m)m=m.toFixed(this.i),a.fillText(m,l-a.measureText(m).width/2,g+12);else{a.fillText("scale is too small",l,g+12);break}m=u}e=a.measureText("x").width;a.fillText("x",D(b,k)-e-5,d-8);a.beginPath();a.moveTo(c,E(b,f));a.lineTo(c,E(b,h));a.stroke();d=this.g;f=c-4;h=f+8;g=d.g;d=d.m();e=Va(this,d-g);for(g=Math.ceil(g/e)*e;g<d;){k=E(b,g);a.beginPath();
a.moveTo(f,k);a.lineTo(h,k);a.stroke();n=g+e;if(n>g)a.fillText(g.toFixed(this.i),h+5,k+6);else{a.fillText("scale is too small",h,k);break}g=n}a.fillText("y",c+6,E(b,d)+13);a.restore()}D(){return this.h?(this.h=!1,!0):!1}s(){return[]}u(){return Ba}v(){return[]}l(){return 100}A(){return!1}};var Xa={ca:"Dots",LINES:"Lines"};Xa={ca:"Punts",LINES:"L\u00ednies"};class F{constructor(a,b,c){this.j=x(w(b));this.o=a;this.m=c}toString(){return this.C()}C(){const a=this.m;"object"===typeof a&&null!==a&&void 0!==a.C&&a.C();return""}g(){return this.j}l(){return this.o}h(){return this.m}i(a){return this.j==w(a)}};class Ya{constructor(a,b){var c=G.Z,d=H.Z;this.s=a;this.j=x(w(c));this.o=d;this.m=b}toString(){return""}C(){return""}g(a){return a?this.o:this.j}l(){return this.s}h(){return this.m()}i(a){return this.j==w(a)}};function Za(a,b,c){if(c.length!==b.length)throw"choices and values not same length";b=new F(a.j,"CHOICES_MODIFIED",a);I(a.j,b)}function $a(a,b){if(b>a.h()||b>a.o)throw"out of range: "+b+" value="+a.h()+" upper="+a.o;return a}class J{constructor(a,b,c,d){this.j=a;this.m=x(w(b));this.u=c;this.s=d;this.o=za}toString(){return""}C(){return""}g(a){return a?this.u:this.m}l(){return this.j}h(){return this.s()}i(a){return this.m==w(a)}};class K{constructor(a,b,c,d,e,f){this.s=a;this.j=x(w(b));this.o=c;this.m=d;if(null!=e)if(null!=f){if(f.length!==e.length)throw"different lengths choices:"+e+" values:"+f;}else throw"values is not defined";}toString(){return""}C(){return""}g(a){return a?this.o:this.j}l(){return this.s}h(){return this.m()}i(a){return this.j==w(a)}};function I(a,b){a.L=!0;try{a.J.forEach(c=>c.v(b))}finally{a.L=!1,ab(a)}}function ab(a){if(!a.L){for(let b=0,c=a.F.length;b<c;b++){const d=a.F[b];d.action?a.J.includes(d.aa)||a.J.push(d.aa):ka(a.J,d.aa)}a.F=[]}}function bb(a,b){a.F.push({action:!0,aa:b});ab(a)}function cb(a,b){b=w(b);return ia(a.ga,c=>c.g()==b)}function L(a,b){const c=cb(a,b);if(null==c)throw"unknown Parameter "+b;I(a,c)}
class M{constructor(a){if(!a)throw"no name";x(w(a));this.J=[];this.ga=[];this.L=!1;this.F=[]}toString(){return""}C(){return""}h(a){const b=a.g(),c=cb(this,b);if(null!=c)throw"parameter "+b+" already exists: "+c;this.ga.push(a)}};function N(a,b){if(1E5>a.g)return b;a=b+1E5*(a.i-(b<a.h?0:1));if(a>=wa)throw"exceeded max int";return a}function O(a){return 0==a.g?-1:0==a.h?N(a,a.g-1):N(a,a.h-1)}function db(a,b){return 1E5>a.g?b:b-1E5*(a.i-(b%1E5<a.h?0:1))}function eb(a){const b=O(a);return-1==b?null:a.j[db(a,b)]}
class fb{constructor(){this.h=this.i=this.g=0;this.l=-1;this.j=Array(1E5)}toString(){return""}reset(){this.i=this.h=this.g=0;this.l=-1}store(a){this.l=this.h;this.j[this.h]=a;this.h++;1E5>this.g&&this.g++;1E5<=this.h&&(this.i++,this.h=0);return N(this,this.l)}}function gb(a){if(0==a.g.g)throw"no data";return a.h}function hb(a){if(0===a.g.g)throw"no data";if(a.i)a.i=!1;else{if(a.h+1>O(a.g))throw"cannot iterate past end of list";a.h++;a.l=db(a.g,a.h)}return a.g.j[a.l]}
class ib{constructor(a,b){this.i=0<a.g;this.g=a;if(void 0===b||0>b)b=1E5>a.g?0:N(a,a.h);if(0<a.g&&(b<(1E5>a.g?0:N(a,a.h))||b>O(a)))throw"out of range startIndex="+b;this.h=b;this.l=db(a,b)}};class jb{constructor(a,b){if(isNaN(a)||isNaN(b))throw"NaN in GraphPoint";this.x=a;this.y=b}toString(){return""}u(a){return this.x==a.x&&this.y==a.y&&!0}g(){return this.x}h(){return this.y}m(){return 0}};class kb{constructor(a){this.h=a;this.g="lime";this.i=1}toString(){return""}};class lb{constructor(a,b,c){this.o=a;this.j=x(w(b));this.m=c}toString(){return""}C(){return""}g(a){return a?this.m:this.j}l(){return this.o}h(){return 0}i(a){return this.j==w(a)}};function mb(a,b){let c;if("number"===typeof b)c=b;else if("string"===typeof b){if(b=w(b),c=ja(a.g,d=>d.g()==b),0>c)throw"unknown variable name "+b;}else throw"";if(0>c||c>=a.g.length)throw"bad variable index="+c+"; numVars="+a.g.length;return a.g[c]}
class nb extends M{constructor(){var a=["x","y"],b=["x","y"];super("VARIABLES");if(a.length!=b.length)throw"varNames and localNames are different lengths";for(let e=0,f=a.length;e<f;e++){var c=a[e];if("string"!==typeof c)throw"variable name "+c+" is not a string i="+e;c=x(w(c));a[e]=c}a:{c=a.length;if(1<c){const e=Array(c);for(var d=0;d<c;d++)e[d]=a[d];qa(e);d=e[0];for(let f=1;f<c;f++){if(d==e[f]){c=!1;break a}d=e[f]}}c=!0}if(!c)throw"duplicate variable names";this.g=[];for(let e=0,f=a.length;e<f;e++)this.g.push(new lb(this,
a[e],b[e]))}toString(){return""}C(){return""}h(){throw"addParameter not allowed on VarsList";}};function ob(a){if(1>a.i.g.length-1)throw"setYVariable bad index 1";1!=a.o&&(a.o=1,a.reset(),L(a,P.U))}function pb(a){if(0>a.i.g.length-1)throw"setXVariable bad index 0";0!=a.j&&(a.j=0,a.reset(),L(a,P.T))}function qb(a){const b=[Q.NONE],c=[-1];for(let d=0,e=a.i.g.length;d<e;d++)b.push(mb(a.i,d).g(!0)),c.push(d);Za(a.B,b,c);Za(a.A,b,c)}function rb(a){a.s.push(new kb(O(a.g)+1));a.l=!0}
function sb(a,b){a=a.s;if(0==a.length)throw"graph styles list is empty";let c=a[0];for(let d=1,e=a.length;d<e;d++){const f=a[d];if(f.h>b)break;c=f}return c}function tb(a){a.u="";a.l=!0}
class vb extends M{constructor(a){super("GRAPH_LINE");this.i=a;bb(a,this);this.o=this.j=-1;this.B=$a(new J(this,P.U,Q.U,()=>this.o),-1);this.h(this.B);this.A=$a(new J(this,P.T,Q.T,()=>this.j),-1);this.h(this.A);qb(this);this.g=new fb;this.l=!0;this.u="red";this.s=[];rb(this);this.D=function(b){return b};this.I=function(b){return b};this.h(new J(this,P.LINE_WIDTH,Q.LINE_WIDTH,()=>1));this.h(new K(this,P.X,Q.X,()=>"lines",[Xa.ca,Xa.LINES],["dots","lines"]));this.h(new K(this,P.Y,Q.Y,()=>"lime"))}toString(){return""}C(){return""}m(){if(-1<
this.j&&-1<this.o){var a=mb(this.i,this.j),b=mb(this.i,this.o);a=a.h();b=b.h();b=new jb(this.D(a),this.I(b));a=eb(this.g);null!=a&&a.u(b)||(this.g.store(b),this.l=!0)}}v(a){a.l()==this.i&&a.i("VARS_MODIFIED")&&qb(this)}reset(){this.g.reset();this.s=[];rb(this);this.l=!0;this.m();I(this,new F(this,"RESET"))}}var P={X:"draw mode",Y:"graph color",ma:"graph draw mode",na:"graph points",LINE_WIDTH:"draw width",T:"X variable",U:"Y variable",la:"clear graph",NONE:"-none-"},Q=P;
Q={X:"Manera de dibuixat",Y:"Color de gr\u00e0fic",ma:"Manera de dibuixat del gr\u00e0fic",na:"Punts del gr\u00e0fic",LINE_WIDTH:"Ample de l\u00ednia",T:"Variable X",U:"Variable Y",la:"Netejar gr\u00e0fic",NONE:"-res-"};function wb(a){let b=!0,c=ya;for(let d=0,e=a.g.length;d<e;d++){const f=a.g[d].l();if(f<c){b=!1;break}c=f}b||(sa(a.g,function(d,e){d=d.l();e=e.l();return d<e?-1:d>e?1:0}),a.i=!0)}function xb(a,b,c){wb(a);a.g.forEach(d=>d.B(b,c))}
class yb extends M{constructor(){super("DISPLAY_LIST_"+zb++);this.g=[];this.i=!0}toString(){return""}C(){return""}add(a){if(!ca(a))throw"non-object passed to DisplayList.add";const b=a.l();wb(this);let c=this.g.length,d;for(d=0;d<c&&!(b<this.g[d].l());d++);na(this.g,d,0,a);this.i=!0;I(this,new F(this,"OBJECT_ADDED",a))}get(a){const b=this.g.length;if(0>a||a>=b)throw a+" is not in range 0 to "+(b-1);wb(this);return this.g[a]}length(){return this.g.length}}var zb=1;function Ab(a,b,c){for(let l=0,m=a.g.length;l<m;l++){var d=a.j,e=l;a:{var f=b;var h=c,g=a.j[l],k=a.g[l];const u=Ta(h,a.m),p=new ib(k.g,g);if(!(p.i||p.h<O(p.g))){f=g;break a}g=hb(p);let q;for(sb(k,gb(p));p.i||p.h<O(p.g);){var n=g;g=hb(p);if(g.x!=n.x||g.y!=n.y){q=sb(k,gb(p));{if(!Ja(u,n,g))continue;const S=D(h,n.x);n=E(h,n.y);const la=D(h,g.x),ma=E(h,g.y);f.strokeStyle=q.g;f.lineWidth=q.i;f.beginPath();f.moveTo(S,n);f.lineTo(la,ma);f.stroke()}}}f=gb(p)}d[e]=f}}
function Bb(a,b){a.m=b;a.i=null;a.h=!0}
class Cb{constructor(a){if(void 0!==a&&!(a instanceof vb))throw"not a GraphLine "+a;this.g=void 0!==a?[a]:[];this.j=ta(this.g.length);this.o=this.i=null;this.m=Ma;this.h=!1}toString(){return""}C(){return""}F(){return!1}B(a,b){if(!this.m.v()){a.save();if(null==this.o||this.o!=b)this.o=b,this.h=!0;for(let h=0,g=this.g.length;h<g;h++)if(this.j[h]>O(this.g[h].g)){this.reset();break}var c=this.m.i(),d=this.m.l();null==this.i&&(this.i=document.createElement("canvas"),this.i.width=c,this.i.height=d,this.h=
!0);var e=this.i.getContext("2d");this.h?(e.clearRect(0,0,c,d),this.j=ta(this.g.length),Ab(this,e,b),this.h=!1):Ab(this,e,b);a.drawImage(this.i,0,0,c,d);for(let h=0,g=this.g.length;h<g;h++){{c=a;var f=b;e=this.g[h];const k=eb(e.g);null!=k&&(d=D(f,k.g()),f=E(f,k.h()),e=e.u)&&(c.fillStyle=e,c.fillRect(d-2,f-2,5,5))}}a.restore()}}D(){let a=!1;for(let c=0,d=this.g.length;c<d;c++){var b=this.g[c];b.l?(b.l=!1,b=!0):b=!1;a=a||b}return a||this.h}s(){return[]}u(){return Ba}v(){return[]}l(){return 0}A(){return!1}reset(){this.j=
ta(this.g.length);this.h=!0}};class Db{constructor(a,b){bb(a,this);this.g=b}toString(){return""}C(){return""}v(a){this.g(a)}};class Eb{constructor(){this.h=[];this.g=!1}toString(){return""}C(){return""}s(a){if(this.g)throw"addMemo during memorize";this.h.includes(a)||this.h.push(a)}m(){try{this.g=!0,this.h.forEach(a=>a.m())}finally{this.g=!1}}};function Fb(a,b){if(0<a.i()&&0<a.l()){const c=new B(a.i(),a.l());Gb(b,c)}a.j.push(b);a.s(b);a.v=!0;I(a,new F(a,"VIEW_ADDED",b));I(a,new F(a,"VIEW_LIST_MODIFIED"));if(null==a.u){if(null!=b&&!a.j.includes(b))throw"cannot set focus to unknown view "+b;a.u!=b&&(a.u=b,a.v=!0,I(a,new F(a,"FOCUS_VIEW_CHANGED",b)))}}
function Hb(a){let b=!1;for(let e=0,f=a.j.length;e<f;e++){var c=a.j[e];{var d=c.u;let h=!1;for(let g=0,k=d.g.length;g<k;g++){const n=d.g[g].D();h=h||n}h||d.i?(d.i=!1,d=!0):d=!1}d||c.A?(c.A=!1,c=!0):c=!1;b=b||c}return b||a.v?(a.v=!1,!0):!1}function Ib(a){const b=new B(a.g.width,a.g.height);a.j.forEach(c=>Gb(c,b));a.v=!0;I(a,new F(a,"SIZE_CHANGED"))}
function Jb(a){if(null!=a.g.offsetParent){0<a.o&&a.o--;const b=Hb(a);if(b||0<a.o){const c=a.g.getContext("2d");c.save();try{""!=a.B?(c.globalAlpha=a.A,c.fillStyle=a.B,c.fillRect(0,0,a.g.width,a.g.height),c.globalAlpha=1,1==a.A?a.o=0:b&&(a.o=Math.floor(10/a.A))):c.clearRect(0,0,a.g.width,a.g.height),a.j.forEach(d=>{c.save();c.globalAlpha=d.oa;xb(d.u,c,d.j);c.restore()})}finally{c.restore()}}}}function Kb(a){a.g.width=800;a.g.height=800;Ib(a);L(a,R.H);L(a,R.G)}
class Lb extends M{constructor(){var a=document.createElement("canvas");super("canvas1");this.g=a;a.contentEditable=!1;this.j=[];this.D=new Eb;this.u=null;this.A=1;this.B="";this.v=!0;this.o=0;this.h(new J(this,R.H,T.H,()=>this.i()));this.h(new J(this,R.G,T.G,()=>this.l()));this.h(new J(this,R.ALPHA,T.ALPHA,()=>this.A));this.h(new K(this,R.W,T.W,()=>this.B))}toString(){return""}s(a){this.D.s(a)}l(){return this.g.height}i(){return this.g.width}m(){this.D.m()}}
var R={H:"width",G:"height",ALPHA:"alpha",W:"background"},T=R;T={H:"Ample",G:"Alt",ALPHA:"transpar\u00e8ncia",W:"Fons"};function Mb(a,b){this.type=a;this.target=b}Mb.prototype.h=function(){};var Nb=function(){if(!r.addEventListener||!Object.defineProperty)return!1;var a=!1,b=Object.defineProperty({},"passive",{get:function(){a=!0}});try{r.addEventListener("test",aa,b),r.removeEventListener("test",aa,b)}catch(c){}return a}();function U(){var a=r.navigator;return a&&(a=a.userAgent)?a:""};function Ob(a){Ob[" "](a);return a}Ob[" "]=aa;var Pb=-1!=U().indexOf("Gecko")&&!(-1!=U().toLowerCase().indexOf("webkit")&&-1==U().indexOf("Edge"))&&!(-1!=U().indexOf("Trident")||-1!=U().indexOf("MSIE"))&&-1==U().indexOf("Edge");function Qb(a){Mb.call(this,a?a.type:"");this.relatedTarget=this.target=null;this.button=this.screenY=this.screenX=this.clientY=this.clientX=0;this.key="";this.g=0;this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1;this.pointerId=0;this.pointerType="";this.i=null;if(a){var b=this.type=a.type,c=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement;var d=a.relatedTarget;if(d){if(Pb){a:{try{Ob(d.nodeName);var e=!0;break a}catch(f){}e=!1}e||(d=null)}}else"mouseover"==
b?d=a.fromElement:"mouseout"==b&&(d=a.toElement);this.relatedTarget=d;c?(this.clientX=void 0!==c.clientX?c.clientX:c.pageX,this.clientY=void 0!==c.clientY?c.clientY:c.pageY,this.screenX=c.screenX||0,this.screenY=c.screenY||0):(this.clientX=void 0!==a.clientX?a.clientX:a.pageX,this.clientY=void 0!==a.clientY?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0);this.button=a.button;this.g=a.keyCode||0;this.key=a.key||"";this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;
this.metaKey=a.metaKey;this.pointerId=a.pointerId||0;this.pointerType="string"===typeof a.pointerType?a.pointerType:Rb[a.pointerType]||"";this.i=a;a.defaultPrevented&&Qb.ka.h.call(this)}}da(Qb,Mb);var Rb={2:"touch",3:"pen",4:"mouse"};Qb.prototype.h=function(){Qb.ka.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var Sb="closure_listenable_"+(1E6*Math.random()|0);var Tb=0;function Ub(a,b,c,d,e){this.listener=a;this.proxy=null;this.src=b;this.type=c;this.capture=!!d;this.h=e;this.key=++Tb;this.g=this.$=!1}function Vb(a){a.g=!0;a.listener=null;a.proxy=null;a.src=null;a.h=null};function Wb(a){this.src=a;this.g={};this.h=0}Wb.prototype.add=function(a,b,c,d,e){var f=a.toString();a=this.g[f];a||(a=this.g[f]=[],this.h++);var h;a:{for(h=0;h<a.length;++h){var g=a[h];if(!g.g&&g.listener==b&&g.capture==!!d&&g.h==e)break a}h=-1}-1<h?(b=a[h],c||(b.$=!1)):(b=new Ub(b,this.src,f,!!d,e),b.$=c,a.push(b));return b};var Xb="closure_lm_"+(1E6*Math.random()|0),Yb={},Zb=0;function V(a,b,c,d,e){if(d&&d.once)$b(a,b,c,d,e);else if(Array.isArray(b))for(var f=0;f<b.length;f++)V(a,b[f],c,d,e);else c=ac(c),a&&a[Sb]?a.g(b,c,ca(d)?!!d.capture:!!d,e):bc(a,b,c,!1,d,e)}
function bc(a,b,c,d,e,f){if(!b)throw Error("Invalid event type");var h=ca(e)?!!e.capture:!!e,g=cc(a);g||(a[Xb]=g=new Wb(a));c=g.add(b,c,d,h,f);if(!c.proxy){d=dc();c.proxy=d;d.src=a;d.listener=c;if(a.addEventListener)Nb||(e=h),void 0===e&&(e=!1),a.addEventListener(b.toString(),d,e);else if(a.attachEvent)a.attachEvent(ec(b.toString()),d);else if(a.addListener&&a.removeListener)a.addListener(d);else throw Error("addEventListener and attachEvent are unavailable.");Zb++}}
function dc(){function a(c){return b.call(a.src,a.listener,c)}const b=fc;return a}function $b(a,b,c,d,e){if(Array.isArray(b))for(var f=0;f<b.length;f++)$b(a,b[f],c,d,e);else c=ac(c),a&&a[Sb]?a.h(b,c,ca(d)?!!d.capture:!!d,e):bc(a,b,c,!0,d,e)}function ec(a){return a in Yb?Yb[a]:Yb[a]="on"+a}
function fc(a,b){if(a.g)a=!0;else{b=new Qb(b,this);var c=a.listener,d=a.h||a.src;if(a.$&&"number"!==typeof a&&a&&!a.g){var e=a.src;if(e&&e[Sb])e.i(a);else{var f=a.type,h=a.proxy;e.removeEventListener?e.removeEventListener(f,h,a.capture):e.detachEvent?e.detachEvent(ec(f),h):e.addListener&&e.removeListener&&e.removeListener(h);Zb--;(f=cc(e))?(h=a.type,h in f.g&&ka(f.g[h],a)&&(Vb(a),0==f.g[h].length&&(delete f.g[h],f.h--)),0==f.h&&(f.src=null,e[Xb]=null)):Vb(a)}}a=c.call(d,b)}return a}
function cc(a){a=a[Xb];return a instanceof Wb?a:null}var gc="__closure_events_fn_"+(1E9*Math.random()>>>0);function ac(a){if("function"===typeof a)return a;a[gc]||(a[gc]=function(b){return a.handleEvent(b)});return a[gc]};class hc{constructor(a,b,c,d){if(null==a)throw"";this.m=a;this.s=b;this.g=null;this.j=!1;this.h=null;null!=a&&(b=a.v(),0<b.length&&(this.h=b[0]));this.l=c;this.o=d;this.i=Ba;null!=a&&(this.i=Aa(c,a.u()),null==this.h&&(this.g=null))}};function ic(a,b){b=Aa(a.l,b);var c=Sa(a.h,a.i.add(b)),d=a.g.g;{b=d.i();d=d.l();const e=c.g();c=c.h();b=new z(e-b/2,c-d/2,e+b/2,c+d/2)}a=a.g;if(!(b instanceof z))throw"not a DoubleRect: "+b;b.u(a.g)||(a.g=b,jc(a),L(a,G.H),L(a,G.G),L(a,G.O),L(a,G.P),I(a,new F(a,"SIM_RECT_CHANGED")))}class kc{constructor(a,b){this.g=a;var c=this.h=a.j;a=a.g;a=new y(Fa(a),Ga(a));this.i=Ua(c,a);this.l=b}};function lc(a,b,c,d){if(b.target==a.g.g)if(a.g.g.focus(),a.i=!0,c=mc(a,c,d),a.m&&a.F==b.ctrlKey&&a.B==b.metaKey&&a.D==b.shiftKey&&a.A==b.altKey)b=a.g.u,null!=b&&(a.l=new kc(b,c),ic(a.l,c));else{{d=a.g;let n=null;let l,m=null,u=za;const p=Array.from(d.j);b:for(let q=p.length-1;0<=q;q--){const S=p[q],la=S.j,ma=Sa(la,c);var e=S.u;wb(e);e=Array.from(e.g);c:for(let Ha=e.length-1;0<=Ha;Ha--){const ba=e[Ha];if(!ba.A())continue c;var f=ba.s();if(!(1<f.length))if(0==f.length){if(ba.F()){n=ba;var h=S;l=ma;
m=Ba;break b}}else{f=f[0];const Ia=f.h();for(let oa=Ia.length-1;0<=oa;oa--){var g=f.g(Ia[oa]),k=Ua(la,g);{g=c.i-k.g();const ub=c.l-k.h();k=c.j-k.m();g=g*g+ub*ub+k*k}g=Math.sqrt(g);g<=u&&(u=g,n=ba,h=S,m=Ia[oa],l=ma)}}}}null==n?(h=d.u,null!=h&&Sa(h.j,c),c=null):c=void 0!==h&&void 0!==l?new hc(n,h,l,m):null}a.h=c;null!=a.h&&(a=a.h,a.j=null!=a.g?a.g.i(a.h,a.l,a.i,a.o,b):!1)}}
function mc(a,b,c){const d=a.g.g,e=d.getBoundingClientRect();b=new y(b-e.left,c-e.top);a=d.offsetWidth/a.g.i();if(1===a)a=b;else{if(1E-10>a)throw"Vector.divide by near zero factor "+(null!=a?a.toExponential(7):null===a?"null":"undefined");a=new y(b.i/a,b.l/a,b.j/a)}return a}
function nc(a,b,c,d){const e=a.g.g;null!=e.offsetParent&&(c=mc(a,c,d),(b.target==e||b.target==document.body)&&a.i&&b.h(),null!=a.l?ic(a.l,c):null!=a.h&&(a=a.h,a.l=Sa(a.s.j,c),null==a.m||null!=a.h&&a.j?null!=a.g&&a.j&&a.g.h(a.h,a.l,a.i,b):Aa(a.l,a.i)))}function oc(a){if(null==a.l&&null!=a.h){var b=a.h;null!=b.g&&b.g.g(b.h,b.l,b.i)}a.h=null;a.l=null;a.i=!1}
class pc{constructor(a){var b={alt:!0,control:!1,ra:!1,shift:!1};this.g=a;this.m=null!=b;this.F=null!=b?1==b.control:!1;this.B=null!=b?1==b.ra:!1;this.D=null!=b?1==b.shift:!1;this.A=null!=b?1==b.alt:!0;this.i=!1;this.l=this.h=null;V(a.g,"mousedown",this.u,!1,this);V(document,"mousemove",this.v,!1,this);V(document,"mouseup",this.j,!1,this);V(document,"keydown",this.o,!1,this);V(document,"keyup",this.s,!1,this);V(document,"touchstart",this.L,!1,this);V(document,"touchmove",this.I,!1,this);V(document,
"touchend",this.J,!1,this)}toString(){return""}C(){return""}u(a){lc(this,a,a.clientX,a.clientY)}v(a){nc(this,a,a.clientX,a.clientY)}j(a){const b=this.g.g;null!=b.offsetParent&&((a.target==b||a.target==document.body)&&this.i&&a.h(),oc(this))}o(){}s(){}L(a){if(a.target==this.g.g){var b=a.i;null!=b&&((b=b.touches)&&1==b.length?lc(this,a,b[0].clientX,b[0].clientY):oc(this))}}I(a){var b=a.i;b=null!=b?b.touches:[];this.i&&b&&1==b.length?nc(this,a,b[0].clientX,b[0].clientY):oc(this)}J(a){this.i&&this.j(a)}}
;function Gb(a,b){if(!(b instanceof B))throw"not a ScreenRect: "+b;if(b.v())throw"empty screenrect";a.o.u(b)||(a.o=b,jc(a),I(a,new F(a,"SCREEN_RECT_CHANGED")))}function qc(a){a.I=Na("FULL");jc(a);L(a,G.S)}function rc(a){a.v=La("FULL");jc(a);L(a,G.R)}function jc(a){var b=Oa(a.o,a.g,a.v,a.I);if(!(b instanceof Pa))throw"not a CoordMap: "+b;a.j=b;a.A=!0;I(a,new F(a,"COORD_MAP_CHANGED"));a.D=a.g.i();a.B=a.g.l();a.da=Fa(a.g);a.ea=Ga(a.g);a.pa=a.B/a.D;a.A=!0}
class sc extends M{constructor(a){super("graphView");if(!(a instanceof z)||a.v())throw"bad simRect: "+a;this.g=a;this.o=new B(800,600);this.I=this.v="MIDDLE";this.u=new yb;this.oa=1;this.j=Oa(this.o,this.g,this.v,this.I);this.D=a.i();this.B=a.l();this.da=Fa(a);this.ea=Ga(a);this.pa=this.B/this.D;this.A=!0;this.fa=new Eb;this.h(new J(this,G.H,H.H,()=>this.i()));this.h(new J(this,G.G,H.G,()=>this.l()));this.h($a(new J(this,G.O,H.O,()=>this.da),Number.NEGATIVE_INFINITY));this.h($a(new J(this,G.P,H.P,
()=>this.ea),Number.NEGATIVE_INFINITY));this.h(new Ya(this,()=>!0));this.h(new K(this,G.S,H.S,()=>this.I,[C.ja,C.M,C.ba,C.K,C.N],["TOP","MIDDLE","BOTTOM","FULL","VALUE"]));this.h(new K(this,G.R,H.R,()=>this.v,[A.ha,A.M,A.ia,A.K,A.N],["LEFT","MIDDLE","RIGHT","FULL","VALUE"]));this.h(new J(this,G.V,H.V,()=>1))}toString(){return""}C(){return""}s(a){this.fa.s(a)}l(){return this.B}i(){return this.D}m(){this.fa.m()}}
var G={Z:"scale X-Y together",H:"width",G:"height",O:"center-x",P:"center-y",S:"vertical-align",R:"horizontal-align",V:"aspect-ratio"},H=G;H={Z:"Escalar X-Y junts",H:"Ample",G:"Alt",O:"Centrat en X",P:"Centrat en Y",S:"Alineament vertical",R:"Alineament horizontal",V:"Relaci\u00f3 d'aspecte"};function tc(a){return a.replace(/\\(x|u00)([0-9a-fA-F]{2})/g,function(b,c,d){return String.fromCharCode(Number("0x"+d))})}
function uc(a,b){for(let d in window){a:{for(let e=0,f=b.length;e<f;e++)if(d==b[e]){var c=!1;break a}c=(new RegExp("\\b"+d+"\\b","g")).test(a)}if(c)throw'prohibited name: "'+d+'" found in script: '+a;}if(/\b(myEval|Function|with|__proto__|call|apply|caller|callee|arguments|addAllowList|vetCommand|badCommand|allowList_|addRegex|addRegex2|regexs_|afterEvalFn_|setAfterEval|parentNode|parentElement|innerHTML|outerHTML|offsetParent|insertAdjacentHTML|appendChild|insertBefore|replaceChild|removeChild|ownerDocument|insertBefore|setParser|defineNames|globalEval|window|defineProperty|defineProperties|__defineGetter__|__defineSetter__)\b/g.test(a))throw"prohibited name in script: "+a;
}function W(a,b){a.l&&(a.l.value+=b+"\n",vc(a))}function wc(a){let b=0,c="",d,e,f="",h=!1,g=!1,k=!1,n="",l,m;l=0;for(m=a.length;l<m;l++)if(d=f," "!=f&&"\t"!=f&&"\n"!=f&&(c=f),f=a[l],e=l+1<m?a[l+1]:"\x00",h){if("\n"==f&&(h=!1,0==b))break}else if(g)"/"==f&&"\\"!=d&&(g=!1);else if(k)f==n&&"\\"!=d&&(k=!1,n="");else if("/"==f)"/"==e?h=!0:"*"==e||!c||"="!=c&&"("!=c||(g=!0);else if('"'==f||"'"==f)k=!0,n=f;else if(";"==f&&0==b)break;else"{"==f?b++:"}"==f&&b--;return[a.slice(0,l+1),a.slice(l+1)]}
function xc(a,b){b=yc(b);let c="",d=0;for(;b;){if(1E4<++d)throw"Terminal.expand";var e=b.match(/^[^'"/]+/);if(null!==e&&(e=e[0],b=b.slice(e.length),e=ha(a.B,function(f,h){return f.replace(h.ua,h.replace)},e),uc(e,a.v),c+=e,0==b.length))break;if(c.match(/.*[=(][ ]*$/)&&(e=b.match(/^\/[^*/](\\\/|[^\\/])*\//),null!==e)){e=e[0];b=b.slice(e.length);c+=e;continue}0<b.length&&"/"==b[0]?(c+="/",b=b.slice(1)):(e=b.match(/^"(\\.|[^\\"])*"/),null!==e?(e=e[0],b=b.slice(e.length),c+=e):0<b.length&&'"'==b[0]?(c+=
'"',b=b.slice(1)):(e=b.match(/^'(\\.|[^\\'])*'/),null!==e?(e=e[0],b=b.slice(e.length),c+=e):0<b.length&&"'"==b[0]&&(c+="'",b=b.slice(1))))}return c}function vc(a){a.g&&a.l&&(a.l.scrollTop=a.l.scrollHeight-a.l.offsetHeight,a.g.value="")}function yc(a){const b=a.match(/^\s*(var|let|const)\s+(\w[\w_\d]*)(.*)/);return b?b[2]+b[3]:a}function zc(){let a=window.location.href;const b=a.indexOf("?");-1<b&&(a=a.slice(0,b));return a}
function Ac(a){try{const b=window.localStorage;if(null!=b){const c=b.getItem(zc());c&&(W(a,"//start of stored scripts"),c.split("\n").forEach(d=>a.eval(d)),W(a,"//end of stored scripts"))}}catch(b){W(a,"//cannot access localStorage due to: "+b)}}function Bc(a,b){a.s=b}
class Cc{constructor(a,b){if(this.g=a)a.spellcheck=!1;if(this.l=b)b.spellcheck=!1;this.g&&V(this.g,"keydown",this.A,!1,this);this.g&&V(this.g,"change",this.F,!0,this);this.u=!1;this.j=[];this.h=-1;this.B=[];this.o=[];this.z={};this.v="myphysicslab goog length name terminal find setTimeout alert".split(" ");this.m=0;W(this,"myPhysicsLab version 2.0.0, advanced-compiled on 2022-03-23 22:53:10.")}toString(){return""}eval(a,b,c){b="boolean"===typeof b?b:!0;if((c=c||!1)&&!b)throw"";a=tc(a).trim();if(!a.match(/^\s*$/)){this.m++;
1<this.m&&(b=!1);b?(this.j.unshift(a),this.h=-1):(this.o.push(this.i),this.i=void 0);try{{var d=a;const f=/^\w\s*\[\s*\d*\s*\]$/;var e=d.match(/\w\s*\[[^\]]*?\]/g);if(null!=e)for(let h=0,g=e.length;h<g;h++)if(!f.test(e[h]))throw"prohibited usage of square brackets in script: "+d+" Only positive integer is allowed in brackets.  Try using Util.get(array, index) or Util.set(array, index, value).";}for(e=["",a];e=wc(e[1]),e[0];){const f=e[0].trim();if(0!=f.length){{b&&W(this,"> "+f);if(f.match(/^\s*\/\/.*/))continue;
const h=xc(this,f);console.log("JavaScript is disabled due to advanced compilation; try a simple-compiled version: "+h);W(this,"JavaScript is disabled due to advanced compilation; try a simple-compiled version");this.i=void 0}}}b&&void 0!==this.i&&";"!=a.slice(-1)&&W(this,String(this.i));b&&void 0!==this.s&&this.s()}catch(f){if(b?(this.i=void 0,W(this,f)):this.i=this.o.pop(),!c)throw this.m--,f;}this.m--;if(b)return vc(this),this.i;a=this.i;this.i=this.o.pop();return a}}A(a){this.g&&this.l&&(a.metaKey&&
75==a.g?(this.l.value="",a.h()):38==a.g||40==a.g?(-1==this.h&&""!=this.g.value&&(this.j.unshift(this.g.value),this.h=0),38==a.g?this.h<this.j.length-1&&(this.h++,this.g.value=this.j[this.h]):40==a.g&&(0<this.h?(this.h--,this.g.value=this.j[this.h]):(this.h=-1,this.g.value="")),a.h()):13==a.g&&this.eval(this.g.value,!0,!0))}F(){this.g&&this.eval(this.g.value,!0,!0)}};function Dc(a,b){a=a[b];if("string"!==typeof a)throw"unknown elementId: "+b;return document.getElementById(a)}
class X{constructor(a){ua();if(void 0===a.images_dir)throw"images directory not found";this.x=0;var b=Dc(a,"graph_div");if(null==b)throw"graph_div not found";this.h=new Lb;Kb(this.h);b.appendChild(this.h.g);b=Dc(a,"term_output");a=Dc(a,"term_input");this.j=new Cc(a,b);this.o=new nb;this.s=new z(-10,-10,10,10);this.g=new sc(this.s);rc(this.g);qc(this.g);Fb(this.h,this.g);a=this.g.o;this.l=new vb(this.o);pb(this.l);ob(this.l);tb(this.l);this.i=new Cb(this.l);Bb(this.i,a);this.g.u.add(this.i);this.m=
new Wa(Ta(this.g.j,a));this.g.u.add(this.m);new Db(this.g,c=>{if(c.i("SCREEN_RECT_CHANGED"))Bb(this.i,this.g.o);else if(c.i("SIM_RECT_CHANGED")){const d=Ta(this.g.j,this.g.o);c=this.m;c.g=d;c.h=!0}});new pc(this.h);Bc(this.j,()=>{this.i.reset();Jb(this.h)})}qa(){}eval(a,b){try{return this.j.eval(a,b)}catch(c){a=this.j,b=c,a.u?console.log(b):(a.u=!0,alert(b))}}sa(){var a=this.j;{var b=window.location.href;const c=b.indexOf("?");-1<c?(b=b.slice(c+1),b=decodeURIComponent(b),a.eval(b),b=!0):b=!1}b||Ac(a)}start(){}}
X.prototype.start=X.prototype.start;X.prototype.setup=X.prototype.sa;X.prototype.eval=X.prototype.eval;X.prototype.defineNames=X.prototype.qa;function Ec(a){return new X(a)}var Fc=["makeGraphCalcApp"],Y=r;Fc[0]in Y||"undefined"==typeof Y.execScript||Y.execScript("var "+Fc[0]);for(var Z;Fc.length&&(Z=Fc.shift());)Fc.length||void 0===Ec?Y[Z]&&Y[Z]!==Object.prototype[Z]?Y=Y[Z]:Y=Y[Z]={}:Y[Z]=Ec;}).call(window)
