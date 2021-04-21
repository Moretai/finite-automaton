class State {
  constructor({ accepting = false } = {}) {
    this.accepting = accepting;

    this._transitions = new Map();
  }

  getTransitions() {
    return this._transitions;
  }

  addTransition(symbol, toState) {
    this.getTransitionsOnSymbol(symbol).add(toState);
    return this;
  }

  getTransitionsOnSymbol(symbol) {
    let transitions = this._transitions.get(symbol);

    if (!transitions) {
      transitions = new Set();
      this._transitions.set(symbol, transitions);
    }

    return transitions;
  }
}

module.exports = State;
