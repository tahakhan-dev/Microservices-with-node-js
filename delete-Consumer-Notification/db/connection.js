const Sequelize = require("sequelize");
require("dotenv").config();

const {
  notificationCurrentModel,
} = require("../Model/notificationCurrent.model");
const { notificationSentModel } = require("../Model/notificationSent.model");

require("dotenv").config();

const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: process.env.MYSQL_DIALECT,
    dialectOptions: {
      connectTimeout: parseInt(process.env.MYSQL_REQ_TIMEOUT),
    },
    operatorsAliases: process.env.MYSQL_OPERATORSALIASES,
    // sync: { force: false, alert: false },
    pool: {
      max: parseInt(process.env.MYSQL_POOL_MAX),
      min: parseInt(process.env.MYSQL_POOL_MIN),
      acquire: parseInt(process.env.MYSQL_ACQUIRE),
      idle: parseInt(process.env.MYSQL_IDLE),
    },
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.notificationCurrent = notificationCurrentModel(sequelize, Sequelize);
db.notificationSent = notificationSentModel(sequelize, Sequelize);

module.exports = db;
