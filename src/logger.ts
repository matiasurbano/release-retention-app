import bunyan from "bunyan";

const { name, version } = require("../package.json");

export const log = bunyan.createLogger({
  name,
  version,
  serializers: bunyan.stdSerializers,
  src: true, // ONLY FOR DEVELOPMENT
  //   streams: [
  //     {
  //       path: "./logs.log",
  //     },
  //   ],
});
