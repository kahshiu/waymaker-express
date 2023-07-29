const _ = require("lodash");

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

module.exports = {
  formatNumber,
  formatString
} 