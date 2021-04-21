const { EPSILON } = require("../../symbols");
const NFAState = require("../nfa-state");

const s0 = new NFAState();
const s1 = new NFAState({ accepting: true });
const s2 = new NFAState({ accepting: true });
const s3 = new NFAState({ accepting: true });
const s4 = new NFAState();

s0.addTransition(EPSILON, s1);
s0.addTransition("a", s1);
s0.addTransition("b", s2);
s0.addTransition("c", s3);
s0.addTransition("d", s4);
s1.addTransition(EPSILON, s2);

describe("nfa-state", () => {
  /**
   * Test epsilon closure.
   */
  it("epsilon closure", () => {
    expect(s0.getEpsilonClosure().has(s0)).toEqual(true);
    expect(s0.getEpsilonClosure().has(s1)).toEqual(true);
    expect(s0.getEpsilonClosure().has(s2)).toEqual(true);
  });

  /**
   * Test matches.
   */
  it("matches", () => {
    expect(s0.matches("a")).toEqual(true);
    expect(s0.matches("b")).toEqual(true);
    expect(s0.matches("c")).toEqual(true);
    expect(s0.matches("d")).toEqual(false);
    expect(s0.matches("")).toEqual(true);
  });
});
