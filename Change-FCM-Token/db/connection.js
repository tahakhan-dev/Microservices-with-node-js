const Sequelize = require("sequelize");
const fs = require("fs");
require("dotenv").config();

// const {
//   notificationCurrentModel,
// } = require("../Model/notificationCurrent.model");
// const { notificationSentModel } = require("../Model/notificationSent.model");

const { consumerProfileModel } = require("../Model/consumerProfile.model");

require("dotenv").config();
const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: process.env.MYSQL_DIALECT,
    dialectOptions: {
      ssl: {
        key: fs.readFileSync(process.env.MYSQL_KEY, "utf-8").toString(),
        cert: fs.readFileSync(process.env.MYSQL_CERT, "utf-8").toString(),
        ca: fs.readFileSync(process.env.MYSQL_CA, "utf-8").toString(),
      },
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

// db.notificationCurrent = notificationCurrentModel(sequelize, Sequelize);
// db.notificationSent = notificationSentModel(sequelize, Sequelize);

db.consumerProfile = consumerProfileModel(sequelize, Sequelize);

module.exports = db;
