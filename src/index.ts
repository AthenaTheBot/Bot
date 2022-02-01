// Main Modules
import AthenaClient from "./AthenaClient";
import Utils from "./Classes/Utils";

// Initializing modules
const AthenaUtils = new Utils();

// Loading config
const AthenaConfig = AthenaUtils.loadConfig();

// Initializing Athena instance
const Athena = new AthenaClient(AthenaConfig);

// Init
Athena.initalize();

// Monitoring errors
process.on("uncaughtExceptionMonitor", (err) => {
  Athena.errorHandler.recordError(err);
});

process.on("unhandledRejection", (err) => {
  Athena.errorHandler.recordError(err as Error);
});

export { AthenaConfig };
