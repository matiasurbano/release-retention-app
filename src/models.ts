export interface Project {
  id: number;
  name: string;
  releases: Release[];
}
export interface Deployment {
  id: number;
  releaseId: number;
  environmentId: number;
  deploymentDate: Date;
}

export type Release = {
  id: number;
  version: string;
  projectId: number;
  deployments: Deployment[];
};

export interface Environment {
  id: number;
  name: string;
}
