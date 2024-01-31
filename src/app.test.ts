import { parseReleases, sillyFunction } from "./app";

describe("silly function", () => {
  test("returns true", () => {
    expect(sillyFunction()).toEqual(true);
  });
});

describe("Init function", () => {
  test("Get assets", async () => {
    const releases = await parseReleases();
    console.log(releases);
    expect(releases).toBeTruthy();
  });
});
