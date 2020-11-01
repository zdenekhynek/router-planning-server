import { expect } from "chai";

import { enforceTimeWindow } from "./journey";

describe("Journey", () => {
  describe("enforceTimeWindow", () => {
    it("should return correct result", () => {
      let result = enforceTimeWindow(new Date("2020-12-01T13:00:00"));
      expect(result.getTime()).to.equal(
        new Date("2020-12-01T13:00:00").getTime()
      );
      
      result = enforceTimeWindow(new Date("2020-12-01T05:00:00"));
      expect(result.getTime()).to.equal(
        new Date("2020-12-01T08:00:00").getTime()
      );

      result = enforceTimeWindow(new Date("2020-12-01T21:00:00"));
      expect(result.getTime()).to.equal(
        new Date("2020-12-02T08:00:00").getTime()
      );
    });
  });
});
