const express = require("express");
const http = require("http");
const fs = require("fs");
var moment = require("moment");

require("dotenv").config();

const PORT = process.env.PORT;

const { notificationConsumser } = require("./notification/notificationScript");
const db = require("./db/connection");

// .sync({
//   force: false, // To create table if exists , so make it false
// })
db.sequelize
  .sync({
    force: false, // To create table if exists , so make it false
  })
  .then(async () => {
    console.info(`✔️ Database Connected`);
    notificationConsumser()
      .then(() => {
        console.log(`✔️ Success`);
      })
      .finally((res) => {
        // when notification is send connection will be close
        // db.sequelize.close();
        // exiting process or close program
        // process.exit();
      })
      .catch((e) => {
        if (e) {
          console.error("❗️ Error", e);
        }
        console.log(`✔️ Default Data Exists`);
      });
  })
  .catch((err) => {
    console.error(`❌ Server Stopped (listening on PORT : ${PORT})`);
    console.info(`⌚`, moment().format("DD-MM-YYYY hh:mm:ss a"));
    console.error("❗️ Could not connect to database...", err);
    process.exit();
  });

// app.use(SendNotification());
