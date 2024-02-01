import { log } from "./logger";
import { Deployment, Environment, Project, Release } from "./models";
import { DATA_PATH, getDataset } from "./services/dataService";
import { applyRule } from "./services/retentionService";
import { api } from "@opentelemetry/sdk-node";
const { name } = require("../package.json");

export async function init() {
  // Creating a OpenTelemetry Tracer to enable effective observability
  const tracer = api.trace.getTracer(name);
  tracer.startActiveSpan("Starting applyRule", async (span) => {
    const projects = await getDataset<Project>(DATA_PATH.PROJECTS);
    const environments = await getDataset<Environment>(DATA_PATH.ENVIRONMENTS);
    const releases = await getDataset<Release>(DATA_PATH.RELEASES);
    const deployments = await getDataset<Deployment>(DATA_PATH.DEPLOYMENTS);

    // Validating data.
    const keep: number = 3;

    const keptReleases: Release[] = await applyRule(
      keep,
      projects,
      environments,
      releases,
      deployments
    );
    log.info("RESULT => Kept Releases:", keptReleases);
  });
}

init();
