const fs = require("fs");
require("dotenv").config();
var moment = require("moment");
const { Kafka } = require("kafkajs");
var FCM = require("fcm-node");

const db = require("../db/connection");
const Op = db.Sequelize.Op;
var serverKey = `${process.env.SERVER_KEY}`;
var fcm = new FCM(serverKey);
let ActionId;
let rowDataResponse, statusResp;

const clientId = process.env.KAFKA_CLIENT_ID;
const brokers = [process.env.BROKER_IP];
const topic = process.env.KAFKA_TOPIC;
const topic2 = process.env.KAFKA_TOPIC2;

const kafka = new Kafka({
  clientId,
  brokers,
  ssl: {
    key: fs.readFileSync(process.env.KAFKA_SSL_KEY_FILE, "utf-8"),
    cert: fs.readFileSync(process.env.KAFKA_SSL_CERT_FILE, "utf-8"),
    ca: [fs.readFileSync(process.env.KAFKA_SSL_CA_FILE, "utf-8")],
    passphrase: process.env.KAFKA_SSL_PASSPHRASE,
    rejectUnauthorized: false,
  },
});

const consumer = kafka.consumer({
  groupId: process.env.CONSUMER_GROUP_ID,
  autoCommit: true,
  allowAutoTopicCreation: false,
});
const producer = kafka.producer({ allowAutoTopicCreation: false });

exports.SendNotification = async () => {
  try {
    return new Promise(async (resolve, reject) => {
      await consumer.connect();
      await producer.connect();
      await consumer.subscribe({ topic });
      await consumer.run({
        // this function is called every time the consumer gets a new message
        eachMessage: async ({ message }) => {
          // here, we just log the message to the standard output
          let messages = JSON.parse(message.value.toString());
          console.log(messages.consumer_id);
          let message1 = {
            to: messages.fcm_token,
            notification: {
              title: messages.heading,
              body: messages.message,
            },
          };
          await fcm.send(message1, function (err, response1) {
            // sending notification using "FCM-NODE" package
            // ActionID
            //  1) if error occur "actionId" will be one
            //  2) if error does not occur "actionId" will be 2
            err != null ? (ActionId = 1) : (ActionId = 2);

            parseFloat(ActionId) == 1
              ? (rowDataResponse = err)
              : (rowDataResponse = response1);
            parseFloat(ActionId) == 1
              ? (statusResp = "false")
              : (statusResp = "true");
          });

          await producer.send({
            topic: topic2,
            messages: [
              {
                key: `${messages.id}`,
                value: JSON.stringify({
                  parentId: messages.id,
                  consumer_id: messages.consumer_id,
                  fcm_token: messages.fcm_token,
                  heading: messages.heading,
                  message: messages.message,
                  deeplink: messages.deeplink,
                  rule: messages.rule,
                  status: statusResp,
                  fireBaseResponse: rowDataResponse,
                  notificationDate: moment().format("YYYY-MM-DD hh:mm:ss"),
                }),
              },
            ],
          });
        },
      });
    });
  } catch (e) {
    console.log("====================error=====================");
    console.log(e);
    console.log("====================error=====================");
  }
};
