import bunyan from "bunyan";

const { name, version } = require("../package.json");

const isDevelopment = process.env.NODE_ENV === "development";

export const log = bunyan.createLogger({
  name,
  version,
  serializers: bunyan.stdSerializers,
  src: isDevelopment, // source file, line and function added to log
  level: isDevelopment ? "debug" : "info", // Showing debug logs in development
});
