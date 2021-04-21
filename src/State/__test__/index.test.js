const State = require("../index");

/**
 * Basic tests.
 */
const s1 = new State();
const s2 = new State({ accepting: true });
const s3 = new State({ accepting: true });

s1.addTransition("c", s2);
s1.addTransition("c", s3);

describe("state", () => {
  it("Case1: basic tests. ", () => {
    expect(s1.accepting).toEqual(false);
    expect(s2.accepting).toEqual(true);
    expect(s1.getTransitions().get("c").has(s2)).toEqual(true);
    expect(s1.getTransitions().get("c").has(s3)).toEqual(true);
    expect(s1.getTransitions().get("c").size).toEqual(2);
    expect(s1.getTransitionsOnSymbol("c").has(s2)).toEqual(true);
  });

  /**
   * Duplicate add same state.
   */
  s1.addTransition("c", s3);
  it("Case2: Duplicate add same state.", () => {
    expect(s1.getTransitions().get("c").has(s2)).toEqual(true);
    expect(s1.getTransitions().get("c").has(s3)).toEqual(true);
    expect(s1.getTransitions().get("c").size).toEqual(2);
  });
});
