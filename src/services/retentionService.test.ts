import {
  applyRule,
  filterValidDeployments,
  filterValidEnvironments,
  filterValidProjects,
  filterValidReleases,
} from "./retentionService";

describe("filterValidProjects", () => {
  test("returns an array of valid projects", () => {
    // Mock data
    const projects = [
      { id: 1, name: "Project 1" },
      { id: "", name: "Project 2" },
      { id: null, name: "Project 3" },
      { id: 4, name: "Project 4" },
    ];

    // @ts-ignore
    const validProjects = filterValidProjects(projects);

    // Assertions
    expect(validProjects).toHaveLength(2);
    expect(validProjects).toEqual([
      { id: 1, name: "Project 1" },
      { id: 4, name: "Project 4" },
    ]);
  });
});

describe("filterValidEnvironments", () => {
  test("returns an array of valid environments", () => {
    // Mock data
    const environments = [
      { id: 1, name: "Environment 1" },
      { id: "", name: "Environment 2" },
      { id: null, name: "Environment 3" },
      { id: 4, name: "Environment 4" },
    ];

    // @ts-ignore
    const validEnvironments = filterValidEnvironments(environments);

    // Assertions
    expect(validEnvironments).toHaveLength(2);
    expect(validEnvironments).toEqual([
      { id: 1, name: "Environment 1" },
      { id: 4, name: "Environment 4" },
    ]);
  });
});

describe("filterValidReleases", () => {
  test("returns an array of valid releases", () => {
    // Mock data
    const releases = [
      { id: 1, projectId: 1, version: "1.0.0" },
      { id: 2, projectId: 2, version: null },
      { id: 3, projectId: 3, version: "2.0.0" },
    ];
    const projects = [
      { id: 1, name: "Project 1" },
      { id: 2, name: "Project 2" },
    ];

    // @ts-ignore
    const validReleases = filterValidReleases(releases, projects);

    // Assertions
    expect(validReleases).toHaveLength(1);
    expect(validReleases).toEqual([{ id: 1, projectId: 1, version: "1.0.0" }]);
  });

  test("returns an empty array when no valid releases are found", () => {
    // Mock data
    const releases = [
      { id: 1, projectId: 1, version: null },
      { id: 2, projectId: 2, version: null },
    ];
    const projects = [
      { id: 3, name: "Project 3" },
      { id: 4, name: "Project 4" },
    ];

    // @ts-ignore
    const validReleases = filterValidReleases(releases, projects);

    // Assertions
    expect(validReleases).toHaveLength(0);
    expect(validReleases).toEqual([]);
  });
});

describe("filterValidDeployments", () => {
  test("returns an array of valid deployments", () => {
    // Mock data
    const deployments = [
      {
        id: "1",
        releaseId: "1",
        environmentId: "1",
        deployedAt: "2022-01-01T11:00:00",
      },
      {
        id: "2",
        releaseId: "2",
        environmentId: "1",
        deployedAt: "2022-01-02T10:00:00",
      },
      {
        id: "3",
        releaseId: "3",
        environmentId: "2",
        deployedAt: "2022-01-03T09:00:00",
      },
      {
        id: "4",
        releaseId: "4",
        environmentId: "2",
        deployedAt: "2022-01-04T10:00:00",
      },
      {
        id: "5",
        releaseId: "5",
        environmentId: "2",
        deployedAt: "2022-01-05T06:00:00",
      },
    ];
    const environments = [
      { id: "1", name: "Environment 1" },
      { id: "2", name: "Environment 2" },
    ];
    const releases = [
      {
        id: "1",
        projectId: "1",
        version: "1.0.0",
        created: "2022-01-01T06:00:00",
      },
      {
        id: "2",
        projectId: "1",
        version: "1.1.0",
        created: "2022-01-02T06:00:00",
      },
      {
        id: "3",
        projectId: "2",
        version: "2.0.0",
        created: "2022-01-03T06:00:00",
      },
      {
        id: "4",
        projectId: "2",
        version: "2.1.0",
        created: "2022-01-04T06:00:00",
      },
      {
        id: "5",
        projectId: "2",
        version: "2.2.0",
        created: "2022-01-05T06:00:00",
      },
    ];

    // @ts-ignore
    const validDeployments = filterValidDeployments(
      deployments,
      environments,
      releases
    );

    // Assertions
    expect(validDeployments).toHaveLength(5);
    expect(validDeployments).toEqual(deployments);
  });

  test("returns an empty array when no valid deployments are found", () => {
    // Mock data
    const deployments = [
      {
        id: "1",
        releaseId: "1",
        environmentId: "3",
        deployedAt: "2022-01-01T10:00:00",
      },
      {
        id: "2",
        releaseId: "2",
        environmentId: "4",
        deployedAt: "2022-01-02T08:00:00",
      },
    ];
    const environments = [
      { id: "1", name: "Environment 1" },
      { id: "2", name: "Environment 2" },
    ];
    const releases = [
      {
        id: "1",
        projectId: "1",
        version: "1.0.0",
        created: "2022-01-04T08:00:00",
      },
      {
        id: "2",
        projectId: "1",
        version: "1.1.0",
        created: "2022-01-04T09:00:00",
      },
      {
        id: "3",
        projectId: "2",
        version: "2.0.0",
        created: "2022-01-04T10:00:00",
      },
      {
        id: "4",
        projectId: "2",
        version: "2.1.0",
        created: "2022-01-04T11:00:00",
      },
      {
        id: "5",
        projectId: "2",
        version: "2.2.0",
        created: "2022-01-04T02:00:00",
      },
    ];

    // Call the function
    const validDeployments = filterValidDeployments(
      deployments,
      environments,
      releases
    );

    // Assertions
    expect(validDeployments).toHaveLength(0);
    expect(validDeployments).toEqual([]);
  });
});

describe("applyRule", () => {
  // Common scenario
  const projects = [
    { id: "1", name: "Project 1" },
    { id: "2", name: "Project 2" },
  ];
  const environments = [
    { id: "1", name: "Environment 1" },
    { id: "2", name: "Environment 2" },
  ];
  const releases = [
    {
      id: "1",
      projectId: "1",
      version: "1.0.0",
      created: "2022-01-01T10:00:00",
    },
    {
      id: "2",
      projectId: "1",
      version: "1.1.0",
      created: "2022-01-01T11:00:00",
    },
    {
      id: "3",
      projectId: "2",
      version: "2.0.0",
      created: "2022-01-02T09:00:00",
    },
    {
      id: "4",
      projectId: "2",
      version: "2.1.0",
      created: "2022-01-03T10:00:00",
    },
    {
      id: "5",
      projectId: "2",
      version: "2.2.0",
      created: "2022-01-08T11:00:00",
    },
  ];
  const deployments = [
    {
      id: "1",
      releaseId: "1",
      environmentId: "1",
      deployedAt: "2022-01-01T08:00:00",
    },
    {
      id: "2",
      releaseId: "1",
      environmentId: "1",
      deployedAt: "2022-01-02T09:00:00",
    },
    {
      id: "3",
      releaseId: "3",
      environmentId: "2",
      deployedAt: "2022-01-03T07:00:00",
    },
    {
      id: "4",
      releaseId: "4",
      environmentId: "2",
      deployedAt: "2022-01-04T10:00:00",
    },
    {
      id: "5",
      releaseId: "5",
      environmentId: "2",
      deployedAt: "2022-01-05T12:00:00",
    },
  ];
  test("returns an array that keeps up to 3 releases per project/environment", async () => {
    // Mock data
    const keep = 3;

    const keptReleases = await applyRule(
      keep,
      projects,
      environments,
      releases,
      deployments
    );

    // Assertions
    expect(keptReleases).toHaveLength(4);
    expect(keptReleases).toEqual([
      // Up to 3 Project 1 releases should be kept.
      {
        id: "1",
        projectId: "1",
        version: "1.0.0",
        created: "2022-01-01T10:00:00",
      },
      // Up to 3 Project 2 releases should be kept.
      {
        id: "5",
        projectId: "2",
        version: "2.2.0",
        created: "2022-01-08T11:00:00",
      },
      {
        id: "4",
        projectId: "2",
        version: "2.1.0",
        created: "2022-01-03T10:00:00",
      },
      {
        id: "3",
        projectId: "2",
        version: "2.0.0",
        created: "2022-01-02T09:00:00",
      },
    ]);
  });

  test("returns an array that keeps up to 2 releases per project/environment", async () => {
    // Mock data
    const keep = 2;

    const keptReleases = await applyRule(
      keep,
      projects,
      environments,
      releases,
      deployments
    );

    // Assertions
    expect(keptReleases).toHaveLength(3);
    expect(keptReleases).toEqual([
      // Up to 2 Project 1 releases should be kept.
      {
        id: "1",
        projectId: "1",
        version: "1.0.0",
        created: "2022-01-01T10:00:00",
      },
      // Up to 2 Project 2 releases should be kept.
      {
        id: "5",
        projectId: "2",
        version: "2.2.0",
        created: "2022-01-08T11:00:00",
      },
      {
        id: "4",
        projectId: "2",
        version: "2.1.0",
        created: "2022-01-03T10:00:00",
      },
    ]);
  });

  test("returns an array that keeps up to 1 releases per project/environment", async () => {
    // Mock data
    const keep = 1;

    const keptReleases = await applyRule(
      keep,
      projects,
      environments,
      releases,
      deployments
    );

    // Assertions
    expect(keptReleases).toHaveLength(2);
    expect(keptReleases).toEqual([
      // Up to 1 Project 1 releases should be kept.
      {
        id: "1",
        projectId: "1",
        version: "1.0.0",
        created: "2022-01-01T10:00:00",
      },
      // Up to 1 Project 2 releases should be kept.
      {
        id: "5",
        projectId: "2",
        version: "2.2.0",
        created: "2022-01-08T11:00:00",
      },
    ]);
  });
});
