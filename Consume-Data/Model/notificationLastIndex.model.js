function notificationLastIndexModel(sequelize, Sequelize) {
  const notificationLastIndex = sequelize.define(
    "notification_lastIndex",
    {
      lastIndex: {
        type: Sequelize.INTEGER,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  notificationLastIndex.removeAttribute("id");
  notificationLastIndex.removeAttribute("updatedAt");
  notificationLastIndex.removeAttribute("createdAt");
  return notificationLastIndex;
}
exports.notificationLastIndexModel = notificationLastIndexModel;
