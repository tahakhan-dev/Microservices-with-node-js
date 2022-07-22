const fs = require("fs");
var moment = require("moment");

require("dotenv").config();

const PORT = process.env.PORT;

const { SendNotification } = require("./notification/notificationScript");
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
    SendNotification()
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
  .catch(async (err) => {
    console.error(`❌ Server Stopped (listening on PORT : ${PORT})`);
    console.info(`⌚`, moment().format("DD-MM-YYYY hh:mm:ss a"));
    console.error("❗️ Could not connect to database...", err);
    if (process.env.LAST_INDEX) {
      let dataJson = JSON.stringify(
        { errorLastIndex: `${process.env.LAST_INDEX}` },
        null,
        2
      );
      fs.writeFile("errorLastIndex.json", dataJson, (err) => {
        if (err) throw err;
        console.log("Data written to file");
      });
    }
    process.exit();
  });
