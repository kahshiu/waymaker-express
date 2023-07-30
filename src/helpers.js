const fs = require("fs");
const _ = require("lodash");
const log = require("@src/logger");

const formatNumber = (value, defaultValue) => {
  if(value === undefined || value === null || value === "") return defaultValue ?? 0;
  else if(_.isString(value)) return Number(value);
  return value;
}

const formatString = (value, defaultValue) => {
  if(value === undefined || value === null) return defaultValue ?? "";
  else if(_.isNumber(value)) return value.toString();
  return value;
}

const readJson = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch(err) {
    log.error("readJson: ", err);
    return null;
  }
};

const writeJson = async (filePath, content) => {
  try {
    const data = await fs.writeFile(filePath, content, 'utf8');
    return data;
  } catch(err) {
    log.error("writeJson: ", err);
    return null;
  }
};

module.exports = {
  formatNumber
  , formatString
  , readJson
  , writeJson
} 