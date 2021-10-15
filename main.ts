// Main Modules
import AthenaClient from "./src/AthenaClient";
import Utils from "./src/Classes/Utils";

// Interface
import { configInterface } from "./src/Interfaces";

// Initializing modules
const AthenaUtils = new Utils();
const config = <configInterface>AthenaUtils.loadConfig();

const Athena = new AthenaClient(config);

// Init
Athena.initalize();

// Exports
export default config;
export const logger = Athena.logger;
