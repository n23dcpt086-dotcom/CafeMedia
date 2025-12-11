// models/index.js

const { Sequelize } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
    timezone: '+07:00'
  }
);

const Account = require('./Account')(sequelize);

module.exports = {
  sequelize,
  Account
};