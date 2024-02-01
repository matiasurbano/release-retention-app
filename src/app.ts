import { log } from "./logger";
import { Deployment, Environment, Project, Release } from "./models";
import { DATA_PATH, getDataset } from "./services/dataService";
import { applyRule } from "./services/retentionService";
import { api } from "@opentelemetry/sdk-node";
const { name } = require("../package.json");

const KEEP_NUBER_OF_RELEASES =
  parseInt(process.env.KEEP_NUBER_OF_RELEASES ?? "", 10) || 1;

export const init = async () => {
  // Creating a OpenTelemetry Tracer to enable effective observability
  const tracer = api.trace.getTracer(name);
  tracer.startActiveSpan("Starting applyRule", async (span) => {
    const projects = await getDataset<Project>(DATA_PATH.PROJECTS);
    const environments = await getDataset<Environment>(DATA_PATH.ENVIRONMENTS);
    const releases = await getDataset<Release>(DATA_PATH.RELEASES);
    const deployments = await getDataset<Deployment>(DATA_PATH.DEPLOYMENTS);

    const keptReleases: Release[] = await applyRule(
      KEEP_NUBER_OF_RELEASES,
      projects,
      environments,
      releases,
      deployments
    );
    log.info("Kept Releases: ", keptReleases);
  });
};

(async () => {
  await init();
})();
