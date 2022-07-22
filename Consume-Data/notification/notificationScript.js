const fs = require("fs");
require("dotenv").config();
var moment = require("moment");
const { Kafka } = require("kafkajs");

const db = require("../db/connection");
const Op = db.Sequelize.Op;

const notificationCurrent = db.notificationCurrent;
const notificationLastIndex = db.notificationLastIndex;

let lastIndexNotification,
  notificationIndex,
  totalSizes,
  notificationIndex1,
  notificationResp;
const clientId = process.env.KAFKA_CLIENT_ID;
const brokers = [process.env.BROKER_IP];
const topic = process.env.KAFKA_TOPIC;

const kafka = new Kafka({
  clientId,
  brokers,
  // ssl: false,
  ssl: {
    key: fs.readFileSync(process.env.KAFKA_SSL_KEY_FILE, "utf-8"),
    cert: fs.readFileSync(process.env.KAFKA_SSL_CERT_FILE, "utf-8"),
    ca: [fs.readFileSync(process.env.KAFKA_SSL_CA_FILE, "utf-8")],
    passphrase: process.env.KAFKA_SSL_PASSPHRASE,
    rejectUnauthorized: false,
  },
});

const producer = kafka.producer({ allowAutoTopicCreation: false });

exports.SendNotification = async () => {
  try {
    await producer.connect();
    notificationIndex = await notificationLastIndex.findOne();
    let totalCount = await notificationCurrent.count({
      where: {
        id: {
          [Op.gt]: notificationIndex.lastIndex,
        },
      },
    });

    if (totalCount == 0) {
      console.log("no data found");
    } else {
      totalSizes = Math.ceil(totalCount / process.env.BATCH_SIZE);
      return new Promise(async (resolve, reject) => {
        for (let i = 0; i < totalSizes; i++) {
          notificationIndex1 = await notificationLastIndex.findOne();
          // finding all notification with limit of BatchSize
          notificationResp = await notificationCurrent.findAll({
            where: {
              id: {
                [Op.gt]: notificationIndex1.lastIndex,
              },
            },
            limit: parseInt(process.env.BATCH_SIZE),
          });
          for (const value of notificationResp) {
            console.log(
              "=====================",
              value.id,
              "is produce in Kafka ============================"
            );
            await producer.send({
              topic,
              messages: [
                {
                  key: `${value.id}`,
                  value: JSON.stringify({
                    parentId: value.id,
                    consumer_id: value.consumer_id,
                    fcm_token: value.fcm_token,
                    heading: value.heading,
                    message: value.message,
                    deeplink: value.deeplink,
                    rule: value.rule,
                    notificationDate: moment().format("YYYY-MM-DD hh:mm:ss"),
                  }),
                },
              ],
            });
            lastIndexNotification = value.id;
          }
          await notificationLastIndex.update(
            { lastIndex: lastIndexNotification },
            { where: { id: 1 } }
          );
          let inc = i + 1;
          if (inc >= totalSizes) {
            return resolve();
          }
        }
      });
    }
  } catch (e) {
    console.log("====================error=====================");
    console.log(e);
    console.log("====================error=====================");
  }
};
