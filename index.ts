// Main Modules
import AthenaClient from "./src/AthenaClient";
import Utils from "./src/Classes/Utils";

// Initializing modules
const AthenaUtils = new Utils();
const Athena = new AthenaClient(AthenaUtils.loadConfig());

// Init
Athena.initalize();

// Monitoring errors
process.on("uncaughtExceptionMonitor", (err) => {
  Athena.errorHandler.recordError(err);
});

process.on("unhandledRejection", (err) => {
  Athena.errorHandler.recordError(err as Error);
});
