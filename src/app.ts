import { log } from "./logger";
import {
  getEnvironments,
  getProjects,
  getReleases,
  getDeployments,
} from "./services/dataService";

export function sillyFunction() {
  return true;
}

export async function init() {
  log.info("Initializing");
  const projects = await getProjects();
  const environment = await getEnvironments();
  const releases = await getReleases();
  const deployments = await getDeployments();
}

// init();
