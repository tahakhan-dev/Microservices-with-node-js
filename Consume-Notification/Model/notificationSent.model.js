function notificationSentModel(sequelize, Sequelize) {
  const notificationSent = sequelize.define(
    "notification_sent",
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
      status: {
        type: Sequelize.TEXT,
      },
      fireBaseResponse: {
        type: Sequelize.TEXT,
      },
      notificationDate: {
        type: Sequelize.TEXT,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  notificationSent.removeAttribute("id");
  notificationSent.removeAttribute("updatedAt");
  notificationSent.removeAttribute("createdAt");
  return notificationSent;
}
exports.notificationSentModel = notificationSentModel;
