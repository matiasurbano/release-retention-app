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

export async function parseData<T>(fileTypePath: DATA_PATH): Promise<T[]> {
  try {
    log.info(`Parsing ${fileTypePath}`);
    const data = await readFile(join(__dirname, fileTypePath), "utf-8");
    return convertToCamelCase<T>(data);
  } catch (error) {
    log.error(`Error parsing ${fileTypePath}:`, error);
    return [];
  }
}

export async function getDataset<T>(dataPath: DATA_PATH): Promise<T[]> {
  return parseData<T>(dataPath);
}
