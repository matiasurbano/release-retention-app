import { Project } from "../models";
import * as dataService from "./dataService";

jest.mock("fs/promises", () => ({
  readFile: jest.fn().mockResolvedValue(
    JSON.stringify([
      { Id: 1, Name: "Project A" },
      { Id: 2, Name: "Project B" },
    ])
  ),
}));

jest.mock("fs", () => ({
  existsSync: jest.fn().mockResolvedValue(true),
  readFile: jest.fn().mockImplementation((path, options, callback) => {
    callback(null, [
      { Id: 1, Name: "Project A" },
      { Id: 2, Name: "Project B" },
    ]);
  }),
}));

describe("dataService", () => {
  describe("parseData", () => {
    test("returns an array of parsed data", async () => {
      // Call the function
      const parsedData = await dataService.parseData(
        dataService.DATA_PATH.PROJECTS
      );

      // Assertions
      expect(parsedData).toEqual([
        { id: 1, name: "Project A" },
        { id: 2, name: "Project B" },
      ]);
    });
  });

  describe("getDataset", () => {
    test("returns an array of parsed data", async () => {
      // Call the function
      const dataset = await dataService.getDataset<Project>(
        dataService.DATA_PATH.PROJECTS
      );

      // Assertions
      expect(dataset).toEqual([
        { id: 1, name: "Project A" },
        { id: 2, name: "Project B" },
      ]);
      expect(dataset).toBeInstanceOf(Array<Project>);
    });
  });
});
