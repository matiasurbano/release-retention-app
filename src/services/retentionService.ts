import { Deployment, Environment, Project, Release } from "../models";
import { log } from "../logger";
import { groupByKey } from "../utils";

export function applyRule(
  keep: number,
  projects: Project[],
  environments: Environment[],
  releases: Release[],
  deployments: Deployment[]
): Release[] {
  log.info("Applying rule");

  /*
   Projects can have zero or more releases, which can be released to an environment by creating a deployment. A release can have zero or more deployments for a project and environment. For each project/environment combination, keep n releases that have most recently been deployed, where n is the number of releases to keep. note: A release is considered to have "been deployed" if the release has one or more deployments.
   5. For each project/environment combination, keep n releases that have most recently been deployed, 
      where n is the number of releases to keep.
   6. A release is considered to have "been deployed" if the release has one or more deployments.
   7. Get all deployments for a project/environment combination
   8. Get all releases for a project/environment combination
   9. Sort releases by most recently deployed
   10. Keep n releases, where n is the number of releases to keep
   11. Return releases

    const filteredReleases: Release[] = [];

  // Step 5: For each project/environment combination, keep n releases that have most recently been deployed
  for (const project of projects) {
    for (const environment of environments) {
      // Step 7: Get all deployments for a project/environment combination
      const deploymentsForProjectAndEnvironment = deployments.filter(
        (deployment) =>
          deployment.projectId === project.id &&
          deployment.environmentId === environment.id
      );

      // Step 8: Get all releases for a project/environment combination
      const releasesForProjectAndEnvironment = releases.filter(
        (release) =>
          release.projectId === project.id &&
          release.environmentId === environment.id
      );

      // Step 9: Sort releases by most recently deployed
      const sortedReleases = releasesForProjectAndEnvironment.sort(
        (a, b) => b.deployedAt.getTime() - a.deployedAt.getTime()
      );

      // Step 10: Keep n releases, where n is the number of releases to keep
      const releasesToKeep = sortedReleases.slice(0, keep);

      // Add the releases to the filteredReleases array
      filteredReleases.push(...releasesToKeep);
    }
  }
*/

  const deploymentsByEnvironmentId = groupByKey(deployments, "environmentId");

  log.info("Deployments by environment ID", deploymentsByEnvironmentId);

  return [];
}
