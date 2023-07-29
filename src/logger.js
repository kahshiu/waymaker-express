const bunyan = require("bunyan");
const { APP_NAME } = require("./vars");

const log = bunyan.createLogger({name: APP_NAME})

module.exports = log