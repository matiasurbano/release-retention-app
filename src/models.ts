export type Project = {
  id: number;
  name: string;
  releases: Release[];
};
export type Deployment = {
  id: number;
  releaseId: number;
  environmentId: number;
  deploymentDate: Date;
};

export type Release = {
  id: number;
  version: string;
  projectId: number;
  deployments: Deployment[];
};

export type Environment = {
  id: number;
  name: string;
};
