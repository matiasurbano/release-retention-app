import { readFile } from "fs/promises";
import { convertToCamelCase } from "./utils";
import { join } from "path";
import { Release } from "./models";
import { log } from "./logger";

export function sillyFunction() {
  return true;
}

export async function parseReleases(): Promise<Release[]> {
  try {
    log.info("Parsing Releases.json");
    const data = await readFile(
      join(__dirname, "./data/Releases.json"),
      "utf-8"
    );
    return convertToCamelCase<Release>(data);
  } catch (error) {
    log.error("Error parsing Releases.json:", error);
    return [];
  }
}

export async function init() {
  log.info("Initializing");
  const releases = await parseReleases();
  log.debug(releases);
}

// init();
