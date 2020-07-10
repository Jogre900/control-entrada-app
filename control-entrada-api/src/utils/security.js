// Dependencies
import crypto from "crypto";

// Utils
import { isString, isJson, isObject } from "./is";

// Configuration
import { $security } from "@config";

export function encrypt(str) {
  return crypto
    .createHash("sha1")
    .update(`${$security().secretKey}${str.toString()}`)
    .digest("hex");
}

export function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  length = length || 12;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function getBase64(value) {
  let buff = Buffer.from(value, "base64");
  let base64data = buff.toString("utf8");
  let data = JSON.parse(base64data);

  return data;
}

export function setBase64(value) {
  let data = JSON.stringify(value);
  let buff = Buffer.from(data, "utf8");
  let base64data = buff.toString("base64");

  return base64data;
}
