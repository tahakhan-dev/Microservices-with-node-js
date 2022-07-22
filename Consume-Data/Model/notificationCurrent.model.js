function notificationCurrentModel(sequelize, Sequelize) {
  const notificationCurrent = sequelize.define(
    "notification_current",
    {
      consumer_id: {
        type: Sequelize.INTEGER,
      },
      fcm_token: {
        type: Sequelize.TEXT,
      },
      heading: {
        type: Sequelize.TEXT,
      },
      message: {
        type: Sequelize.TEXT,
      },
      deeplink: {
        type: Sequelize.TEXT,
      },
      rule: {
        type: Sequelize.INTEGER,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  notificationCurrent.removeAttribute("updatedAt");
  notificationCurrent.removeAttribute("createdAt");
  return notificationCurrent;
}
exports.notificationCurrentModel = notificationCurrentModel;
