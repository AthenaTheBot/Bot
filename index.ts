// Main Modules
import AthenaClient from "./src/AthenaClient";
import Utils from "./src/Classes/Utils";

// Initializing modules
const AthenaUtils = new Utils();
const Athena = new AthenaClient(AthenaUtils.loadConfig());

// Init
Athena.initalize();
