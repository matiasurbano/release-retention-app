import { readFile } from "fs/promises";
import { convertToCamelCase } from "./utils";
import { join } from "path";
import { Release } from "./models";

export function sillyFunction() {
  return true;
}

export async function parseReleases(): Promise<Release[]> {
  try {
    const data = await readFile(
      join(__dirname, "./data/Releases.json"),
      "utf-8"
    );
    return convertToCamelCase<Release>(data);
  } catch (error) {
    console.error("Error parsing Releases.json:", error);
    return [];
  }
}

export async function init() {
  const releases = await parseReleases();
  console.log(releases);
}

// init();
