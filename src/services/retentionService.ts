import {
  Deployment,
  DeploymentEnrichedWithProject,
  Environment,
  Project,
  Release,
} from "../models";
import { log } from "../logger";
import { arrayToObject, convertToOrdinal, groupByKey } from "../utils";

/**
 * Filters out invalid projects with null or empty string Ids.
 *
 * @param projects - The array of projects to filter.
 * @returns An array of valid projects.
 */
export const filterValidProjects = (projects: Project[]): Project[] => {
  return projects.filter((project) => project.id !== null && project.id !== "");
};

/**
 * Filters out invalid environments with null or empty string Ids
 *
 * @param environments - The array of environments to filter.
 * @returns The filtered array of valid environments.
 */
export const filterValidEnvironments = (
  environments: Environment[]
): Environment[] => {
  return environments.filter(
    (environment) => environment.id !== null && environment.id !== ""
  );
};

/**
 * Filters out releases with null versions or invalid project Ids.
 *
 * @param releases - The list of releases to filter.
 * @param projects - The list of projects to check for release validity.
 * @returns The filtered list of valid releases.
 */
export const filterValidReleases = (
  releases: Release[],
  projects: Project[]
): Release[] => {
  const filteredReleases = releases
    // only keep releases that have a valid version
    .filter((release) => release.version !== null)
    // only keep releases that have a valid project
    .filter((release) =>
      projects.some((project) => project.id === release.projectId)
    );
  return filteredReleases;
};

/**
 * Filters out deployments with invalid environment or release Ids.
 *
 * @param deployments - The list of deployments to filter.
 * @param environments - The list of environments to match against.
 * @param releases - The list of releases to validate against.
 * @returns The filtered list of deployments.
 */
export const filterValidDeployments = (
  deployments: Deployment[],
  environments: Environment[],
  releases: Release[]
): Deployment[] => {
  const filteredDeployments = deployments
    // only keep deployments that have a valid environment
    .filter((deployment) =>
      environments.some(
        (environment) => environment.id === deployment.environmentId
      )
    )
    // only keep deployments that have a valid project
    .filter((deployment) =>
      releases.some((release) => release.id === deployment.releaseId)
    );
  return filteredDeployments;
};

/**
 * Applies release retention rule to filter and keep
 * a specified number of releases based certain criteria.
 *
 * @param keep - The number of releases to keep.
 * @param projects - An array of projects.
 * @param environments - An array of environments.
 * @param releases - An array of releases.
 * @param deployments - An array of deployments.
 * @returns An array of releases that meet the retention rule.
 */
export function applyRule(
  keep: number,
  projects: Project[],
  environments: Environment[],
  releases: Release[],
  deployments: Deployment[]
): Release[] {
  log.info("Applying rule");

  const filteredEnvironments = filterValidEnvironments(environments);
  const filteredProjects = filterValidProjects(projects);
  const filteredReleases = filterValidReleases(releases, filteredProjects);
  const filteredDeployments = filterValidDeployments(
    deployments,
    filteredEnvironments,
    filteredReleases
  );

  // converting the filtered releases array to an object for easier lookup
  const filteredReleasesDictionary = arrayToObject(
    filteredReleases,
    (release) => release.id
  );

  // enriching the deployment information to include the project based on the release
  const enrichedDeployments = filteredDeployments.map((deployment) => {
    return {
      ...deployment,
      projectId: filteredReleasesDictionary[deployment?.releaseId]?.projectId,
    };
  });

  // grouping deployments by environment id
  const deploymentsByEnvironmentIds = groupByKey(
    enrichedDeployments as DeploymentEnrichedWithProject[],
    (deployment) => deployment.environmentId
  );

  const keptReleasesResult: Release[] = [];
  Object.entries(deploymentsByEnvironmentIds).forEach(
    ([environmentId, deploymentsInEnvironment]) => {
      log.info("Environment Id:", environmentId);

      // Sub-Grouping deployments by project
      const deploymentsByEnvironmentAndProject = groupByKey(
        deploymentsInEnvironment as DeploymentEnrichedWithProject[],
        (deployment) => deployment.projectId
      );

      Object.entries(deploymentsByEnvironmentAndProject).forEach(
        ([projectId, deploymentReleases]) => {
          log.info("Project Id:", projectId);

          const keptReleasesWithLatestDeploymentDates: DeploymentEnrichedWithProject[] =
            [];
          const keptReleases = deploymentReleases
            .sort(
              (
                a: DeploymentEnrichedWithProject,
                b: DeploymentEnrichedWithProject
              ) => b.deployedAt.localeCompare(a.deployedAt)
            )
            .filter((deployment) => {
              if (
                !keptReleasesWithLatestDeploymentDates.some(
                  (keptDeployment) =>
                    keptDeployment.releaseId === deployment.releaseId
                )
              ) {
                keptReleasesWithLatestDeploymentDates.push(deployment);
                return deployment;
              }
            })
            .slice(0, keep);

          if (keptReleases && keptReleases.length > 0) {
            // Iterate and add justification for keeping the release
            keptReleasesResult.push(
              ...keptReleases.map(
                (
                  enrichedDeployment: DeploymentEnrichedWithProject,
                  index: number
                ) => {
                  log.info(
                    `Release (${
                      enrichedDeployment.releaseId
                    }) kept from project (${
                      enrichedDeployment.projectId
                    }) because it was the ${convertToOrdinal(
                      index + 1
                    )} most recently deployed to the environment (${
                      enrichedDeployment.environmentId
                    }) by deployment (${enrichedDeployment.id})`
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
    }
  );
  return keptReleasesResult;
}
