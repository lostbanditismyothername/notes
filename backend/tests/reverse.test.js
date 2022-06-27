const reverse = require("../utils/for_testing.js").reverse;

describe("reverse string", () => {
  test("reverse of hello", () => {
    expect(reverse("hello")).toBe("olleh");
  });

  test("reverse of react", () => {
    expect(reverse("react")).toBe("tcaer");
  });
});
