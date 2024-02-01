import { readFile } from "fs/promises";
import { join } from "path";
import { log } from "../logger";
import { convertToCamelCase } from "../utils";

export enum DATA_PATH {
  RELEASES = "../data/Releases.json",
  DEPLOYMENTS = "../data/Deployments.json",
  PROJECTS = "../data/Projects.json",
  ENVIRONMENTS = "../data/Environments.json",
}

export const parseData = async <T>(fileTypePath: DATA_PATH): Promise<T[]> => {
  try {
    log.debug(`Parsing ${fileTypePath}`);
    const data = await readFile(join(__dirname, fileTypePath), "utf-8");
    return convertToCamelCase<T>(data);
  } catch (error) {
    log.error(`Error parsing ${fileTypePath}:`, error);
    return [];
  }
};

/**
 * Retrieves a type dataset from the specified data path.
 * @param dataPath The path to the data.
 * @returns A promise that resolves to an array of type T.
 */
export const getDataset = async <T>(dataPath: DATA_PATH): Promise<T[]> => {
  return parseData<T>(dataPath);
};
