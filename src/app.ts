import { log } from "./logger";
import { Release } from "./models";
import {
  getDeployments,
  getEnvironments,
  getProjects,
  getReleases,
} from "./services/dataService";
import { applyRule } from "./services/retentionService";

export function sillyFunction() {
  return true;
}

export async function init() {
  const projects = await getProjects();
  const environments = await getEnvironments();
  const releases = await getReleases();
  const deployments = await getDeployments();

  // Validating data.
  const keep: number = 3;
  const keptReleases: Release[] = await applyRule(
    keep,
    projects,
    environments,
    releases,
    deployments
  );
  log.info("Kept Releases:", keptReleases);
}
