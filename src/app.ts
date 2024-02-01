import { log } from "./logger";
import { DeploymentEnrichedWithProject, Release } from "./models";
import {
  getEnvironments,
  getProjects,
  getReleases,
  getDeployments,
} from "./services/dataService";
import { arrayToObject, convertToOrdinal, groupByKey } from "./utils";

export function sillyFunction() {
  return true;
}

export async function init() {
  log.info("Initializing");
  const projects = await getProjects();
  const environments = await getEnvironments();
  const releases = await getReleases();
  const deployments = await getDeployments();

  // Validating data.
  const KEEP: number = 10;
  const keptReleasesResult: Release[] = [];

  // only keep deployments that have a valid release
  const filteredReleases = releases
    .filter((release) => release.version !== null)
    .filter((release) =>
      projects.some((project) => project.id === release.projectId)
    );

  // only keep deployments that have a valid environment
  const filteredDeployments = deployments
    .filter((deployment) =>
      environments.some(
        (environment) => environment.id === deployment.environmentId
      )
    )
    // only keep deployments that have a valid project
    .filter((deployment) =>
      filteredReleases.some((release) => release.id === deployment.releaseId)
    );

  // converting to object for easier lookup
  const filteredReleasesDictionary = arrayToObject(
    filteredReleases,
    (release) => release.id
  );

  // enrich the deployment information to include the project based on the release
  const enrichedDeployments = filteredDeployments.map((deployment) => {
    return {
      ...deployment,
      projectId: filteredReleasesDictionary[deployment?.releaseId]?.projectId,
    };
  });

  const deploymentsByEnvironmentIds = groupByKey(
    enrichedDeployments as DeploymentEnrichedWithProject[],
    (deployment) => deployment.environmentId
  );

  Object.entries(deploymentsByEnvironmentIds).forEach(
    ([environmentId, deploymentsInEnvironment]) => {
      log.info("Environment Id:", environmentId);

      // Grouping deployments by project
      const deploymentsByEnvironmentAndProject = groupByKey(
        deploymentsInEnvironment as DeploymentEnrichedWithProject[],
        (deployment) => deployment.projectId
      );

      Object.entries(deploymentsByEnvironmentAndProject).forEach(
        ([projectId, deploymentReleases]) => {
          log.info("Project Id:", projectId);

          const keptReleases = deploymentReleases
            .sort(
              (
                a: DeploymentEnrichedWithProject,
                b: DeploymentEnrichedWithProject
              ) => b.deployedAt.localeCompare(a.deployedAt)
            )
            .slice(0, KEEP);

          if (keptReleases && keptReleases.length > 0) {
            // Iterate and add justification

            keptReleasesResult.push(
              ...keptReleases.map(
                (
                  enrichedDeployment: DeploymentEnrichedWithProject,
                  index: number
                ) => {
                  log.info(
                    `${enrichedDeployment.releaseId} kept from ${
                      enrichedDeployment.projectId
                    } because it was the ${convertToOrdinal(
                      index + 1
                    )} most recently deployed to ${
                      enrichedDeployment.environmentId
                    } by deployment ${enrichedDeployment.id}`
                  );

                  return filteredReleasesDictionary[
                    enrichedDeployment.releaseId
                  ] as Release;
                }
              )
            );
          }
        }
      );

      log.info("Kept Releases:", keptReleasesResult);
    }
  );
}

// init();
