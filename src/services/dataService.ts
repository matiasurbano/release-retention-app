import { readFile } from "fs/promises";
import { log } from "../logger";
import { Deployment, Environment, Project, Release } from "../models";
import { convertToCamelCase } from "../utils";
import { join } from "path";

enum DATA_PATH {
  RELEASES = "../data/Releases.json",
  DEPLOYMENTS = "../data/Deployments.json",
  PROJECTS = "../data/Projects.json",
  ENVIRONMENTS = "../data/Environments.json",
}

export async function parseData<T>(fileTypePath: DATA_PATH): Promise<T[]> {
  try {
    log.info("Parsing Releases.json");
    const data = await readFile(join(__dirname, fileTypePath), "utf-8");
    return convertToCamelCase<T>(data);
  } catch (error) {
    log.error("Error parsing Releases.json:", error);
    return [];
  }
}

export async function getProjects(): Promise<Project[]> {
  return parseData<Project>(DATA_PATH.PROJECTS);
}

export async function getEnvironments(): Promise<Environment[]> {
  return parseData<Environment>(DATA_PATH.ENVIRONMENTS);
}

export async function getReleases(): Promise<Release[]> {
  return parseData<Release>(DATA_PATH.RELEASES);
}

export async function getDeployments(): Promise<Deployment[]> {
  return parseData<Deployment>(DATA_PATH.DEPLOYMENTS);
}
