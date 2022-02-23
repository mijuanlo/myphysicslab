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

goog.module('myphysicslab.sims.springs.Molecule6App');

const array = goog.require('goog.array');
const asserts = goog.require('goog.asserts');
const AbstractApp = goog.require('myphysicslab.sims.common.AbstractApp');
const CheckBoxControl = goog.require('myphysicslab.lab.controls.CheckBoxControl');
const ChoiceControl = goog.require('myphysicslab.lab.controls.ChoiceControl');
const CollisionAdvance = goog.require('myphysicslab.lab.model.CollisionAdvance');
const CommonControls = goog.require('myphysicslab.sims.common.CommonControls');
const DisplayShape = goog.require('myphysicslab.lab.view.DisplayShape');
const DisplaySpring = goog.require('myphysicslab.lab.view.DisplaySpring');
const DisplayText = goog.require('myphysicslab.lab.view.DisplayText');
const DoubleRect = goog.require('myphysicslab.lab.util.DoubleRect');
const EnergySystem = goog.require('myphysicslab.lab.model.EnergySystem');
const FunctionVariable = goog.require('myphysicslab.lab.model.FunctionVariable');
const GenericMemo = goog.require('myphysicslab.lab.util.GenericMemo');
const GenericObserver = goog.require('myphysicslab.lab.util.GenericObserver');
const LabCanvas = goog.require('myphysicslab.lab.view.LabCanvas');
const Molecule3Sim = goog.require('myphysicslab.sims.springs.Molecule3Sim');
const NumericControl = goog.require('myphysicslab.lab.controls.NumericControl');
const Observer = goog.require('myphysicslab.lab.util.Observer');
const ParameterBoolean = goog.require('myphysicslab.lab.util.ParameterBoolean');
const ParameterNumber = goog.require('myphysicslab.lab.util.ParameterNumber');
const PointMass = goog.require('myphysicslab.lab.model.PointMass');
const SimList = goog.require('myphysicslab.lab.model.SimList');
const SimObject = goog.require('myphysicslab.lab.model.SimObject');
const SimRunner = goog.require('myphysicslab.lab.app.SimRunner');
const SliderControl = goog.require('myphysicslab.lab.controls.SliderControl');
const Spring = goog.require('myphysicslab.lab.model.Spring');
const SpringNonLinear = goog.require('myphysicslab.sims.springs.SpringNonLinear');
const SpringNonLinear2 = goog.require('myphysicslab.sims.springs.SpringNonLinear2');
const Util = goog.require('myphysicslab.lab.util.Util');
const VarsList = goog.require('myphysicslab.lab.model.VarsList');
const Vector = goog.require('myphysicslab.lab.util.Vector');

/** Displays the {@link Molecule3Sim} simulation.

* @implements {Observer}
*/
class Molecule6App extends AbstractApp {
/**
* @param {!Object} elem_ids specifies the names of the HTML
*    elementId's to look for in the HTML document; these elements are where the user
*    interface of the simulation is created.
* @param {number} numAtoms number of atoms to make, from 2 to 6
*/
constructor(elem_ids, numAtoms) {
  Util.setErrorHandler();
  const simRect = new DoubleRect(-6, -6, 6, 6);
  const sim = new Molecule3Sim();
  sim.setDamping(0);
  const advance = new CollisionAdvance(sim);

  super(elem_ids, simRect, sim, advance, /*eventHandler=*/sim, /*energySystem=*/sim);

  /** @type {number} */
  this.numAtoms_ = numAtoms;
  /** @type {!Molecule3Sim} */
  this.sim_ = sim;

  this.layout.getSimCanvas().setBackground('black');
  this.simRun.setTimeStep(0.005);
  if (this.showEnergyParam != null) {
    this.showEnergyParam.setValue(true);
  }

  /** @type {!DisplaySpring} */
  this.protoSpring = new DisplaySpring().setWidth(0.15).setColorCompressed('#0c0')
      .setColorExpanded('green').setThickness(3);

  // The observe() method will make DisplayObjects in response to seeing SimObjects
  // being added to the SimList.  Important that no SimObjects were added prior.
  // Except for the walls.
  asserts.assert(this.simList.length() == 1);
  this.simList.addObserver(this);
  // observe the canvas so we can know when background changes
  this.layout.getSimCanvas().addObserver(this);
  this.addBody(this.sim_.getWalls());

  /**
  * Mass-Spring-Mass matrix which says how springs & masses are connected.
  * Each row corresponds to a spring; with indices of masses connected to that spring.
  * @type {!Array<!Array<number>>}
  * @private
  */
  this.msm_ = [[0,1],[0,2],[0,3],[0,4],[0,5],
              [1,2],[1,3],[1,4],[1,5],
              [2,3],[2,4],[2,5],
              [3,4],[3,5],
              [4,5]];
  /**
  * @type {!Array<!PointMass>}
  * @private
  */
  this.atoms_ = [];
  /**
  * @type {!Array<!Spring>}
  * @private
  */
  this.springsLinear_ = [];
  /**
  * @type {!Array<!Spring>}
  * @private
  */
  this.springsNonLinear_ = [];
  /**
  * @type {!Array<!Spring>}
  * @private
  */
  this.springsPseudoGravity_ = [];
  this.createAtoms();
  /** Whether atom names should be displayed.
  * @type {boolean}
  * @private
  */
  this.showNames_ = false;
  /** Whether springs should be displayed.
  * @type {boolean}
  * @private
  */
  this.showSprings_ = true;
  /** What type of spring to create: linear, non-linear, or pseudo-gravity
  * @type {Molecule6App.SpringType}
  * @private
  */
  this.springType_ = Molecule6App.SpringType.PSEUDO_GRAVITY;
  /** atoms with KE percentage (kinetic energy) above this amount are brightly colored.
  * @type {number}
  * @private
  */
  this.ke_high_pct_ = 15;
  /** strength of attraction force in NonLinearSpring2
  * @type {number}
  * @private
  */
  this.attract_ = 5;
  /** whether to specially color atoms with high KE percentage.
  * @type {boolean}
  * @private
  */
  this.show_ke_high_ = true;
  /** array of recent kinetic energy samples.
  * @type {!Array<number>}
  * @private
  */
  this.residualEnergySamples_ = [];
  /** whether residual energy has been calculated and displayed.
  * @type {boolean}
  * @private
  */
  this.residualEnergySet_ = false;
  /** When kinetic energy is near zero, display current potential energy.
  * @type {!DisplayText}
  * @private
  */
  this.residualEnergy_ = new DisplayText('', /*position=*/new Vector(2, 2));
  this.residualEnergy_.setFillStyle('gray');
  this.displayList.add(this.residualEnergy_);

  /** @type {!ParameterNumber} */
  let pn;

  this.addPlaybackControls();
  this.addParameter(pn = new ParameterNumber(this, Molecule6App.en.NUM_ATOMS,
      Molecule6App.i18n.NUM_ATOMS,
      () => this.getNumAtoms(), a => this.setNumAtoms(a)));
  this.addControl(new SliderControl(pn, 1, 6, /*multiply=*/false, 5));

  pn = this.sim_.getParameterNumber(Molecule3Sim.en.GRAVITY);
  this.addControl(new SliderControl(pn, 0, 20, /*multiply=*/false));

  pn = this.sim_.getParameterNumber(Molecule3Sim.en.DAMPING);
  this.addControl(new SliderControl(pn, 0, 1, /*multiply=*/false));

  pn = this.sim_.getParameterNumber(Molecule3Sim.en.ELASTICITY);
  this.addControl(new SliderControl(pn, 0, 1, /*multiply=*/false));

  pn = this.sim_.getParameterNumber(EnergySystem.en.PE_OFFSET);
  this.addControl(new NumericControl(pn));

  /** @type {!ParameterBoolean} */
  let pb;
  this.addParameter(pb = new ParameterBoolean(this, Molecule6App.en.SHOW_NAMES,
      Molecule6App.i18n.SHOW_NAMES,
      () => this.getShowNames(),
      a => this.setShowNames(a)));
  this.addControl(new CheckBoxControl(pb));

  this.addParameter(pb = new ParameterBoolean(this, Molecule6App.en.SHOW_SPRINGS,
      Molecule6App.i18n.SHOW_SPRINGS,
      () => this.getShowSprings(),
      a => this.setShowSprings(a)));
  this.addControl(new CheckBoxControl(pb));

  this.addParameter(pn = new ParameterNumber(this, Molecule6App.en.SPRING_TYPE,
      Molecule6App.i18n.SPRING_TYPE,
      () => this.getSpringType(),
      a => this.setSpringType(a),
      [ Molecule6App.i18n.LINEAR,
        Molecule6App.i18n.NON_LINEAR,
        Molecule6App.i18n.PSEUDO_GRAVITY ],
      [ Molecule6App.SpringType.LINEAR,
        Molecule6App.SpringType.NON_LINEAR,
        Molecule6App.SpringType.PSEUDO_GRAVITY ]));
  this.addControl(new ChoiceControl(pn));

  this.addParameter(pb = new ParameterBoolean(this, Molecule6App.en.SHOW_KE_HIGH,
      Molecule6App.i18n.SHOW_KE_HIGH,
      () => this.getShowKEHigh(),
      a => this.setShowKEHigh(a)));
  this.addControl(new CheckBoxControl(pb));

  this.addParameter(pn = new ParameterNumber(this, Molecule6App.en.KE_HIGH_PCT,
      Molecule6App.i18n.KE_HIGH_PCT,
      () => this.getKEHighPct(), a => this.setKEHighPct(a)));
  this.addControl(new SliderControl(pn, 0, 100, /*multiply=*/false));

  this.addStandardControls();

  this.addParameter(pn = new ParameterNumber(this, Molecule6App.en.ATTRACT_FORCE,
      Molecule6App.i18n.ATTRACT_FORCE,
      () => this.getAttractForce(), a => this.setAttractForce(a)));
  this.addControl(new NumericControl(pn));

  this.addParameter(pn = new ParameterNumber(this, Molecule6App.en.WALL_SIZE,
      Molecule6App.i18n.WALL_SIZE,
      () => this.getWallSize(), a => this.setWallSize(a)));
  this.addControl(new NumericControl(pn));

  for (let i=1; i<=6; i++) {
    this.addParameter(pn = new ParameterNumber(this, Molecule6App.en.MASS+' '+i,
        Molecule6App.i18n.MASS+' '+i,
        () => this.getMass(i), a => this.setMass(i, a)));
    pn.setDecimalPlaces(5);
    this.addControl(new NumericControl(pn));
  }
  const msm = this.msm_;
  for (let i=0, len=msm.length; i<len; i++) {
    let idx1 = msm[i][0] + 1;
    let idx2 = msm[i][1] + 1;
    this.addParameter(pn = new ParameterNumber(this,
        Molecule6App.en.STIFFNESS+' '+idx1+'-'+idx2,
        Molecule6App.i18n.STIFFNESS+' '+idx1+'-'+idx2,
        () => this.getStiffness(idx1, idx2),
        a => this.setStiffness(idx1, idx2, a)));
    this.addControl(new NumericControl(pn));
  }

  this.config();

  this.graph.line.setXVariable(Molecule3Sim.START_VAR);
  this.graph.line.setYVariable(Molecule3Sim.START_VAR + 1);
  this.timeGraph.line1.setYVariable(1);
  this.timeGraph.line2.setYVariable(2);

  this.makeEasyScript();
  this.addURLScriptButton();

  // after clicking the "rewind" button, call resetResidualEnergy
  new GenericObserver(this.simRun, evt => {
    if (evt.nameEquals(SimRunner.RESET)) {
      this.resetResidualEnergy();
    }
  });

  /** Causes atoms with high KE percentage (kinetic energy) to be brightly colored.
  * @type {!GenericMemo}
  * @private
  */
  this.ke_high_memo_ = new GenericMemo(() =>
    this.sim_.getAtoms().forEach((atom, idx) => {
      const ke_var = this.sim_.getVarsList().getVariable('ke'+(idx+1)+' pct');
      const ke_pct = ke_var.getValue();
      const dispAtom = this.displayList.findShape(atom);
      if (ke_pct > this.ke_high_pct_) {
        dispAtom.setFillStyle('red');
      } else {
        dispAtom.setFillStyle('gray');
      }
    }));
  this.simRun.addMemo(this.ke_high_memo_);

  /** When kinetic energy is near zero, display current potential energy.
  * @type {!GenericMemo}
  * @private
  */
  this.residualEnergy_memo_ = new GenericMemo(() => {
    if (!this.residualEnergySet_) {
      const ei = this.sim_.getEnergyInfo();
      this.residualEnergySamples_.push(ei.getTranslational());
      if (this.residualEnergySamples_.length > 100) {
        this.residualEnergySamples_.shift();
      }
      const max = array.reduce(this.residualEnergySamples_,
        function(prev, cur) {
          return Math.max(prev, cur);
        }, /*initial value=*/0);
      if (this.residualEnergySamples_.length >= 100 &&  max < 1e-3) {
        this.residualEnergy_.setText(EnergySystem.i18n.POTENTIAL_ENERGY+
            ' '+Util.NF3(ei.getPotential()));
        this.residualEnergySet_ = true;
      }
    }
  });
  this.simRun.addMemo(this.residualEnergy_memo_);
};

/** @override */
toString() {
  return Util.ADVANCED ? '' : this.toStringShort().slice(0, -1)
      + super.toString();
};

/** @override */
getClassName() {
  return 'Molecule6App';
};

/** @override */
defineNames(myName) {
  super.defineNames(myName);
  this.terminal.addRegex('protoSpring', myName+'.');
};

/**
@param {!SimObject} obj
@private
*/
addBody(obj) {
  if (this.displayList.find(obj) != null) {
    // we already have a DisplayObject for this SimObject, don't add a new one.
    return;
  }
  if (obj instanceof PointMass) {
    const pm = /** @type {!PointMass} */(obj);
    if (pm.getName().match(/^WALL/)) {
      const walls = new DisplayShape(pm).setFillStyle('').setStrokeStyle('gray');
      this.displayList.add(walls);
    } else {
      const dispAtom = new DisplayShape(pm);
      let cm = 'gray';
      if (!this.show_ke_high_) {
        switch (pm.getName()) {
          case 'ATOM1': cm = 'red'; break;
          case 'ATOM2': cm = 'blue'; break;
          case 'ATOM3': cm = 'magenta'; break;
          case 'ATOM4': cm = 'orange'; break;
          case 'ATOM5': cm = 'gray'; break;
          case 'ATOM6': cm = 'green'; break;
          default: cm = 'pink';
        }
      }
      dispAtom.setFillStyle(cm);
      // perhaps show name of the atom
      if (this.showNames_) {
        dispAtom.setNameFont('12pt sans-serif');
        const bg = this.layout.getSimCanvas().getBackground();
        dispAtom.setNameColor(bg == 'black' ? 'white' : 'black');
      } else {
        dispAtom.setNameFont('');
      }
      this.displayList.add(dispAtom);
    }
  } else if (obj instanceof Spring || obj instanceof SpringNonLinear2) {
    if (this.showSprings_) {
      const s = /** @type {!Spring} */(obj);
      const dispSpring = new DisplaySpring(s, this.protoSpring);
      // display springs behind atoms.
      dispSpring.setZIndex(-1);
      this.displayList.add(dispSpring);
    }
  }
};

/** Recreate all bodies, to match current selected styles.
@return {undefined}
@private
*/
rebuild() {
  const atoms = this.sim_.getAtoms();
  atoms.forEach(atom => {
    this.removeBody(atom);
    this.addBody(atom);
  });
};

/**
@param {!SimObject} obj
@private
*/
removeBody(obj) {
  const dispObj = this.displayList.find(obj);
  if (dispObj) {
    this.displayList.remove(dispObj);
  }
};

/** @override */
observe(event) {
  if (event.getSubject() == this.simList) {
    const obj = /** @type {!SimObject} */ (event.getValue());
    if (event.nameEquals(SimList.OBJECT_ADDED)) {
      this.addBody(obj);
    } else if (event.nameEquals(SimList.OBJECT_REMOVED)) {
      this.removeBody(obj);
    }
  } else if (event.getSubject() == this.layout.getSimCanvas()) {
    if (event.nameEquals(LabCanvas.en.BACKGROUND)) {
      // change names to appear in black or white depending on background color
      this.rebuild();
    }
  }
};

/**
* @return {undefined}
* @private
*/
createAtoms() {
  // We make all 6 masses and all springs to interconnect, but we only add to
  // the simulation the number of masses currently requested and their springs.
  // Reason: we store the mass and stiffness in the mass and spring objects.
  // This allows user choice of mass & stiffness to persist after changing
  // number of masses.
  for (let i=0; i<6; i++) {
    const atom = PointMass.makeCircle(0.5, 'atom'+(i+1)).setMass(0.5);
    this.atoms_.push(atom);
  }
  // Mass-Spring-Mass matrix says how springs & masses are connected
  // each row corresponds to a spring, with indices of masses connected to that spring.
  const msm = this.msm_;
  for (let i=0; i<msm.length; i++) {
    const atom1 = this.atoms_[msm[i][0]];
    const atom2 = this.atoms_[msm[i][1]];
    let spring = new SpringNonLinear2('spring '+i,
        atom1, Vector.ORIGIN, atom2, Vector.ORIGIN,
        /*restLength=*/3.0, /*stiffness=*/1.0, /*attract=*/this.attract_);
    spring.setDamping(0);
    this.springsPseudoGravity_.push(spring);
    spring = new Spring('spring '+i,
        atom1, Vector.ORIGIN, atom2, Vector.ORIGIN,
        /*restLength=*/3.0, /*stiffness=*/1.0);
    spring.setDamping(0);
    this.springsLinear_.push(spring);
    spring = new SpringNonLinear('spring '+i,
        atom1, Vector.ORIGIN, atom2, Vector.ORIGIN,
        /*restLength=*/3.0, /*stiffness=*/1.0);
    spring.setDamping(0);
    this.springsNonLinear_.push(spring);
  }
};

/**
* @return {undefined}
* @private
*/
config() {
  const numAtoms = this.numAtoms_;
  if (numAtoms < 1 || numAtoms > 6) {
    throw 'too many atoms '+numAtoms;
  }
  this.sim_.cleanSlate();
  this.resetResidualEnergy();
  // Add to simulation only the atoms requested.
  for (let i=0; i<numAtoms; i++) {
    this.sim_.addAtom(this.atoms_[i]);
  }
  const atoms = this.sim_.getAtoms();
  // add all springs that connect atoms in that set
  let springs;
  switch (this.springType_) {
    case Molecule6App.SpringType.LINEAR:
      springs = this.springsLinear_; break;
    case Molecule6App.SpringType.NON_LINEAR:
      springs = this.springsNonLinear_; break
    case Molecule6App.SpringType.PSEUDO_GRAVITY:
      springs = this.springsPseudoGravity_; break;
    default:
      throw '';
  }
  springs = array.filter(springs, spr => {
      // both bodies of the spring must be in the set.
      if (array.contains(atoms, spr.getBody1()) &&
          array.contains(atoms, spr.getBody2())) {
            return true;
      } else {
        return false;
      }
    });
  for (let i=0; i<springs.length; i++) {
    this.sim_.addSpring(springs[i]);
  }
  this.initialPositions(numAtoms);
  this.sim_.saveInitialState();
  this.sim_.modifyObjects();
  this.calcMinPE();
  this.addKEVars();

  if (this.easyScript) {
    this.easyScript.update();
  }
};

/**
* @return {undefined}
* @private
*/
resetResidualEnergy() {
  this.residualEnergySet_ = false;
  this.residualEnergySamples_ = [];
  this.residualEnergy_.setText('');
};

/** add variables for kinetic energy of atoms 1, 2, 3, etc.
* @return {undefined}
* @private
*/
addKEVars()  {
  const sim = this.sim_;
  const va = sim.getVarsList();
  for (let i=1; i<=this.numAtoms_; i++) {
    const nm = 'ke'+i;
    va.addVariable(new FunctionVariable(va, nm, nm,
      () => {
        const atom1 = sim.getSimList().getPointMass('atom'+i);
        return atom1.getKineticEnergy();
      }
    ));
    const nm2 = 'ke'+i+' pct';
    va.addVariable(new FunctionVariable(va, nm2, nm2,
      () => {
        const atom = sim.getSimList().getPointMass('atom'+i);
        return 100*atom.getKineticEnergy()/sim.getEnergyInfo().getTotalEnergy();
      }
    ));
  }
};

/** Sets initial position of atoms, and velocities to zero.
* @param {number} numAtoms
* @return {undefined}
* @private
*/
initialPositions(numAtoms)  {
  const vars = this.sim_.getVarsList().getValues();
  // vars: 0   1   2   3   4   5   6   7    8  9   10  11  12  13  14
  //      time KE  PE  TE  F1  F2  F3  U1x U1y V1x V1y U2x U2y V2x V2y
  // arrange all masses around a circle
  const r = 1.0; // radius
  for (let i=0; i<numAtoms; i++) {
    const idx = Molecule3Sim.START_VAR + 4*i;
    // note: don't set the positions randomly here. That destroys the ability to
    // use the "share" button to save and share a configuration.
    vars[idx + 0] = r * Math.cos(i*2*Math.PI/numAtoms);
    vars[idx + 1] = r * Math.sin(i*2*Math.PI/numAtoms);
    vars[idx + 2] = 0;
    vars[idx + 3] = 0;
  }
  this.sim_.getVarsList().setValues(vars);
};

/** Return number of atoms
@return {number} number of atoms
*/
getNumAtoms() {
  return this.numAtoms_;
};

/** Set number of atoms
@param {number} value number of atoms
*/
setNumAtoms(value) {
  if (value < 1 || value > 6) {
    throw 'too many atoms '+value;
  }
  this.numAtoms_ = value;
  this.config();
  // discontinuous change in energy
  // vars: 0   1   2   3   4   5   6   7    8  9   10  11  12  13  14
  //      time KE  PE  TE  F1  F2  F3  U1x U1y V1x V1y U2x U2y V2x V2y
  this.sim_.getVarsList().incrSequence(1, 2, 3, 4, 5, 6);
  this.broadcastParameter(Molecule6App.en.NUM_ATOMS);
};

/** Return mass of specified atom
@param {number} index index number of atom, starting from 1
@return {number} mass of specified atom
*/
getMass(index) {
  if (index < 0 || index > 6) {
    throw '';
  }
  return this.atoms_[index-1].getMass();
};

/** Sets mass of specified atom
@param {number} index index number of atom, starting from 1
@param {number} value mass of atom
*/
setMass(index, value) {
  if (index < 0 || index > 6) {
    throw '';
  }
  this.atoms_[index-1].setMass(value);
  // discontinuous change in energy
  // vars: 0   1   2   3   4   5   6   7    8  9   10  11  12  13  14
  //      time KE  PE  TE  F1  F2  F3  U1x U1y V1x V1y U2x U2y V2x V2y
  this.sim_.getVarsList().incrSequence(1, 2, 3, 4, 5, 6);
  this.calcMinPE();
  this.broadcastParameter(Molecule6App.en.MASS+' '+index);
};

/** Returns spring connecting specified atoms
@param {!Array<!Spring>} springs the set of springs to select from
@param {number} index1 index number of atom, starting from 1
@param {number} index2 index number of atom, starting from 1, must be greater than
    index1
@return {?Spring} spring connecting specified atoms
@private
*/
getSpring(springs, index1, index2) {
  if (index2 < index1) {
    throw 'index2 must be > index1';
  }
  if (index1 < 1 || index1 > this.atoms_.length) {
    return null;
  }
  if (index2 < 1 || index2 > this.atoms_.length) {
    return null;
  }
  const atom1 = this.atoms_[index1-1];
  const atom2 = this.atoms_[index2-1];
  return array.find(springs, spr => {
    if (spr.getBody1() == atom1 && spr.getBody2() == atom2) {
      return true;
    } else if (spr.getBody1() == atom2 && spr.getBody1() == atom1) {
      return true;
    } else {
      return false;
    }
  });
};

/** Returns spring stiffness of spring connecting specified atoms
@param {number} index1 index number of atom, starting from 1
@param {number} index2 index number of atom, starting from 1
@return {number} spring stiffness
*/
getStiffness(index1, index2) {
  const spr = this.getSpring(this.springsLinear_, index1, index2);
  return spr ? spr.getStiffness() : 0;
};

/** Sets spring stiffness of spring connecting specified atoms
@param {number} index1 index number of atom, starting from 1
@param {number} index2 index number of atom, starting from 1
@param {number} value spring stiffness
*/
setStiffness(index1, index2, value) {
  let spr = this.getSpring(this.springsLinear_, index1, index2);
  if (!spr) {
    throw 'unknown spring connecting '+index1+'-'+index2;
  }
  spr.setStiffness(value);
  spr = this.getSpring(this.springsPseudoGravity_, index1, index2);
  if (!spr) {
    throw '';
  }
  spr.setStiffness(value);
  spr = this.getSpring(this.springsNonLinear_, index1, index2);
  if (!spr) {
    throw '';
  }
  spr.setStiffness(value);
  // discontinuous change in energy
  // vars: 0   1   2   3   4   5   6   7    8  9   10  11  12  13  14
  //      time KE  PE  TE  F1  F2  F3  U1x U1y V1x V1y U2x U2y V2x V2y
  this.sim_.getVarsList().incrSequence(2, 3);
  this.broadcastParameter(Molecule6App.en.STIFFNESS+' '+index1+'-'+index2);
};

/**
@return undefined
@private
*/
calcMinPE() {
  if (this.springType_ == Molecule6App.SpringType.PSEUDO_GRAVITY) {
    this.sim_.getSprings().forEach(spr => {
      if (spr instanceof SpringNonLinear2) {
        const s2 = /** SpringNonLinear2 */(spr);
        s2.calcMinPE();
      }
    });
  }
};

/** Whether names should be displayed.
@return {boolean}
*/
getShowNames() {
  return this.showNames_;
};

/** Sets whether names should be displayed.
@param {boolean} value
*/
setShowNames(value) {
  if (value != this.showNames_) {
    this.showNames_ = value;
    this.rebuild();
    this.broadcastParameter(Molecule6App.en.SHOW_NAMES);
  }
};

/** Whether springs should be displayed.
@return {boolean}
*/
getShowSprings() {
  return this.showSprings_;
};

/** Sets whether springs should be displayed.
@param {boolean} value
*/
setShowSprings(value) {
  if (value != this.showSprings_) {
    this.showSprings_ = value;
    if (value) {
      this.sim_.getSprings().forEach(spr => this.addBody(spr));
    } else {
      this.sim_.getSprings().forEach(spr => this.removeBody(spr));
    }
    this.broadcastParameter(Molecule6App.en.SHOW_SPRINGS);
  }
};

/** What type of springs to create
@return {number}
*/
getSpringType() {
  return this.springType_;
};

/** Sets type of springs to create
@param {number} value
*/
setSpringType(value) {
  if (this.springType_ != value) {
    this.springType_ = /** @type {Molecule6App.SpringType} */(value);
    this.config();
    this.broadcastParameter(Molecule6App.en.SPRING_TYPE);
  }
};

/** atoms with KE percentage (kinetic energy) above this amount are brightly colored.
@return {number}
*/
getKEHighPct() {
  return this.ke_high_pct_;
};

/** atoms with KE percentage (kinetic energy) above this amount are brightly colored.
@param {number} value
*/
setKEHighPct(value) {
  if (this.ke_high_pct_ != value) {
    this.ke_high_pct_ = value;
    this.broadcastParameter(Molecule6App.en.KE_HIGH_PCT);
  }
};

/** 
@return {number}
*/
getAttractForce() {
  return this.attract_;
};

/** 
@param {number} value
*/
setAttractForce(value) {
  if (this.attract_ != value) {
    this.attract_ = value;
    this.springsPseudoGravity_.forEach(spr => {
      if (spr instanceof SpringNonLinear2) {
        const s2 = /** SpringNonLinear2 */(spr);
        s2.setAttract(this.attract_);
      }
    });
    this.broadcastParameter(Molecule6App.en.ATTRACT_FORCE);
  }
};

/** whether to specially color atoms with high KE percentage.
@return {boolean}
*/
getShowKEHigh() {
  return this.show_ke_high_;
};

/** Sets whether to specially color atoms with high KE percentage.
@param {boolean} value
*/
setShowKEHigh(value) {
  if (value != this.show_ke_high_) {
    this.show_ke_high_ = value;
    if (value) {
      this.simRun.addMemo(this.ke_high_memo_);
    } else {
      this.simRun.removeMemo(this.ke_high_memo_);
    }
    this.rebuild();
    this.broadcastParameter(Molecule6App.en.SHOW_KE_HIGH);
  }
};

/** Returns width (and height) of walls.
@return {number}
*/
getWallSize() {
  return this.sim_.getWalls().getWidth();
};

/** Set width and height of walls.
@param {number} value
*/
setWallSize(value) {
  this.sim_.getWalls().setWidth(value);
  this.sim_.getWalls().setHeight(value);
  // Set the visible area to entire wall region, to help users understand.
  this.simRect = this.sim_.getWalls().getBoundsWorld();
  // Limit size of simView, so that we can still see the atoms.
  const max = 60;
  this.simRect = this.simRect.intersection(new DoubleRect(-max, -max, max, max));
  this.simView.setSimRect(this.simRect);
  this.broadcastParameter(Molecule6App.en.WALL_SIZE);
};

} // end class

/**
* @enum {number}
*/
Molecule6App.SpringType = {
  LINEAR: 1,
  NON_LINEAR: 2,
  PSEUDO_GRAVITY: 3
};

/** Set of internationalized strings.
@typedef {{
  MASS: string,
  LENGTH: string,
  STIFFNESS: string,
  NUM_ATOMS: string,
  SHOW_SPRINGS: string,
  KE_HIGH_PCT: string,
  SHOW_KE_HIGH: string,
  SHOW_NAMES: string,
  ATTRACT_FORCE: string,
  WALL_SIZE: string,
  LINEAR: string,
  NON_LINEAR: string,
  PSEUDO_GRAVITY: string,
  SPRING_TYPE: string
  }}
*/
Molecule6App.i18n_strings;

/**
@type {Molecule6App.i18n_strings}
*/
Molecule6App.en = {
  MASS: 'mass',
  LENGTH: 'spring length',
  STIFFNESS: 'spring stiffness',
  NUM_ATOMS: 'number of atoms',
  SHOW_SPRINGS: 'show springs',
  KE_HIGH_PCT: 'KE high pct',
  SHOW_KE_HIGH: 'show KE high pct',
  SHOW_NAMES: 'show names',
  ATTRACT_FORCE: 'attract force',
  WALL_SIZE: 'wall size',
  LINEAR: 'linear',
  NON_LINEAR: 'non-linear',
  PSEUDO_GRAVITY: 'pseudo-gravity',
  SPRING_TYPE: 'spring type'
};

/**
@private
@type {Molecule6App.i18n_strings}
*/
Molecule6App.de_strings = {
  MASS: 'Masse',
  LENGTH: 'Federlänge',
  STIFFNESS: 'Federsteifheit',
  NUM_ATOMS: 'zahl Masse',
  SHOW_SPRINGS: 'zeige Federn',
  KE_HIGH_PCT: 'KE hoch prozent',
  SHOW_KE_HIGH: 'zeige KE hoch prozent',
  SHOW_NAMES: 'zeige Namen',
  ATTRACT_FORCE: 'anziehen Kraft',
  WALL_SIZE: 'Wand Größe',
  LINEAR: 'linear',
  NON_LINEAR: 'nichtlinear',
  PSEUDO_GRAVITY: 'pseudo-Gravitation',
  SPRING_TYPE: 'FederTyp'
};

/**
@private
@type {Molecule6App.i18n_strings}
*/
Molecule6App.es_strings = {
  MASS: 'Masa',
  LENGTH: 'Longitud',
  STIFFNESS: 'Rigidez',
  NUM_ATOMS: 'número de átomos',
  SHOW_SPRINGS: 'mostrar muelles',
  KE_HIGH_PCT: 'mayor percentil cinético',
  SHOW_KE_HIGH: 'mostrar mayor percentil cinético',
  SHOW_NAMES: 'mostrat nombres',
  ATTRACT_FORCE: 'fuerza de atracción',
  WALL_SIZE: 'Tamaño del muro',
  LINEAR: 'lineal',
  NON_LINEAR: 'no lineal',
  PSEUDO_GRAVITY: 'pseudo-gravedad',
  SPRING_TYPE: 'tipo de muelle'
};

/** Set of internationalized strings.
@type {Molecule6App.i18n_strings}
*/
Molecule6App.i18n = Molecule6App.en;
switch(goog.LOCALE) {
  case 'de':
    Molecule6App.i18n = Molecule6App.de_strings;
    break;
  case 'es':
    Molecule6App.i18n = Molecule6App.es_strings;
    break;
  default:
    Molecule6App.i18n = Molecule6App.en;
    break;
};

/**
* @param {!Object} elem_ids
* @param {number} numAtoms number of atoms to make, from 2 to 6
* @return {!Molecule6App}
*/
function makeMolecule6App(elem_ids, numAtoms) {
  return new Molecule6App(elem_ids, numAtoms);
};
goog.exportSymbol('makeMolecule6App', makeMolecule6App);

exports = Molecule6App;
