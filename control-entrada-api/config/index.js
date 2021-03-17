// Configuration
import "dotenv/config";
import config from "./config.json";

const NODE_ENV = process.env.NODE_ENV || "development";

// Configurations
export const $db = () => config.db[NODE_ENV];
export const $security = () => config.security;
export const $serverPort = () => config.serverPort;
