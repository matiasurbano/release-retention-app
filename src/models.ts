export interface Project {
  id: string;
  name: string;
  releases: Release[];
}
export interface Deployment {
  id: string;
  releaseId: string;
  environmentId: string;
  deployedAt: string;
}
export interface DeploymentEnrichedWithProject extends Deployment {
  projectId: string;
}

export type Release = {
  id: string;
  version: string;
  projectId: string;
  deployments: Deployment[];
};

export interface Environment {
  id: string;
  name: string;
}
