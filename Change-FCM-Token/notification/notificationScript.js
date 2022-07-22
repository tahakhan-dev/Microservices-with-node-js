require("dotenv").config();

const db = require("../db/connection");

const { Kafka } = require("kafkajs");
const fs = require("fs");

const consumerProfiles = db.consumerProfile;

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

exports.notificationConsumser = () => {
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
          let fcmChnageToken = await consumerProfiles.findOne({
            where: {
              consumer_id: messages.consumer_id,
            },
          });
          console.log(
            "==================fcmChnageToken consumer_id===================="
          );
          console.log(fcmChnageToken.consumer_id);
          console.log(
            "==================fcmChnageToken consumer_id===================="
          );
          await producer.send({
            topic: topic2,
            messages: [
              {
                key: `${messages.parentId}`,
                value: JSON.stringify({
                  parentId: messages.parentId,
                  consumer_id: messages.consumer_id,
                  fcm_token: fcmChnageToken.fcm_token,
                  heading: messages.heading,
                  message: messages.message,
                  deeplink: messages.deeplink,
                  rule: messages.rule,
                  status: messages.status,
                  fireBaseResponse: messages.fireBaseResponse,
                  notificationDate: messages.notificationDate,
                }),
              },
            ],
          });
        },
      });
      // return resolve();
    });
  } catch (e) {
    console.log(e);
  }
};
