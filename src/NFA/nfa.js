const NFAState = require("./nfa-state");
const { EPSILON, EPSILON_CLOSURE } = require("../symbols");
class NFA {
  constructor(inState, outState) {
    this.in = inState;
    this.out = outState;
  }

  matches(string) {
    return this.in.matches(string);
  }

  /**
   * Returns an alphabet for this NFA
   */
  getAlphabet() {
    if (!this._alphabets) {
      this._alphabets = new Set();
      const table = this.getTransitionTable();
      for (let state in table) {
        const transitions = table[state];
        for (let symbol in transitions) {
          if (symbol !== EPSILON_CLOSURE) {
            this._alphabets.add(symbol);
          }
        }
      }
    }

    return this._alphabets;
  }

  /**
   * Returns set of accepting states.
   */
  getAcceptingStates() {
    if (!this._acceptingStates) {
      // States are determined during table construction.
      this.getTransitionTable();
    }
    return this._acceptingStates;
  }

  /**
   * Returns accepting state numbers.
   */
  getAcceptingStateNumbers() {
    if (!this._acceptingStateNumbers) {
      this._acceptingStateNumbers = new Set();
      for (const acceptingState of this.getAcceptingStates()) {
        this._acceptingStateNumbers.add(acceptingState.number);
      }
    }

    return this._acceptingStateNumbers;
  }

  /**
   * Builds and returns transition table.
   * {
   *  '1': { 'ε*': [ 1, 2, 5 ] },
   *  '2': { x: [ 3 ], 'ε*': [ 2 ] },
   *  '3': { 'ε*': [ 3, 4 ] },
   *  '4': { 'ε*': [ 4 ] },
   *  '5': { y: [ 6 ], 'ε*': [ 5 ] },
   *  '6': { 'ε*': [ 6, 4 ] }
   * }
   */
  getTransitionTable() {
    if (!this._transitionTable) {
      this._transitionTable = {};
      this._acceptingStates = new Set();

      const visited = new Set();
      const symbols = new Set();

      const visitState = (state) => {
        if (visited.has(state)) {
          return;
        }

        visited.add(state);
        state.number = visited.size;
        this._transitionTable[state.number] = {};

        if (state.accepting) {
          this._acceptingStates.add(state);
        }

        const transitions = state.getTransitions();

        for (const [symbol, symbolTransitions] of transitions) {
          let combinedState = [];
          symbols.add(symbol);
          for (const nextState of symbolTransitions) {
            if (!visited.has(nextState)) {
              visitState(nextState);
              combinedState.push(nextState.number);
            }
          }

          this._transitionTable[state.number][symbol] = combinedState;
        }
      };

      visitState(this.in);

      visited.forEach((state) => {
        delete this._transitionTable[state.number][EPSILON];
        this._transitionTable[state.number][EPSILON_CLOSURE] = [
          ...state.getEpsilonClosure(),
        ].map((s) => s.number);
      });
    }

    return this._transitionTable;
  }
}

function getDefaultNFA() {
  const A = new NFAState();
  const B = new NFAState();
  const C = new NFAState();
  const D = new NFAState();
  const E = new NFAState();
  const F = new NFAState({
    accepting: true,
  });

  // x|y

  A.addTransition(EPSILON, B);
  A.addTransition(EPSILON, C);

  // x
  B.addTransition("x", D);

  // y
  C.addTransition("y", E);

  D.addTransition(EPSILON, F);
  E.addTransition(EPSILON, F);

  return new NFA(A, F);
}

const nfa = getDefaultNFA();
console.log("==>", nfa.getTransitionTable());
console.log("==>", nfa.getAlphabet());
console.log("==>", nfa.getAcceptingStateNumbers());
