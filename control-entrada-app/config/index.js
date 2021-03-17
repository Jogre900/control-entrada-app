import config from "./config.json";

const env = process.env.NODE_ENV || "development";

export const API_PORT = () => config.API_PORT[env];
export const MainColor = "#ff7e00";
export const SecundaryColor = "#ff8d1f";
export const ThirdColor = "#ff9e40";
export const lightColor = "#ffb873";
