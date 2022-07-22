function consumerProfileModel(sequelize, Sequelize) {
  const consumerProfile = sequelize.define(
    "consumer_profile",
    {
      consumer_id: {
        type: Sequelize.INTEGER,
      },
      consumer_name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      mobile: {
        type: Sequelize.STRING,
      },
      admin_user_id: {
        type: Sequelize.INTEGER,
      },
      address: {
        type: Sequelize.STRING,
      },
      country_name: {
        type: Sequelize.STRING,
      },
      server_created_on: {
        type: Sequelize.DATE,
      },
      fcm_token: {
        type: Sequelize.STRING,
      },
      google_map_lat: {
        type: Sequelize.STRING,
      },
      google_map_lng: {
        type: Sequelize.STRING,
      },
      ip_address: {
        type: Sequelize.STRING,
      },
      device_type: {
        type: Sequelize.STRING,
      },
      currency_iso_3dg: {
        type: Sequelize.STRING,
      },
      ip_city: {
        type: Sequelize.STRING,
      },
      ip_country: {
        type: Sequelize.STRING,
      },
      ip_country_code_3dg: {
        type: Sequelize.STRING,
      },
      ip_timezone: {
        type: Sequelize.STRING,
      },
      ip_currency_3dg: {
        type: Sequelize.STRING,
      },
      consumer_profession_type: {
        type: Sequelize.STRING,
      },
      signup_type: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.STRING,
      },
      server_updated_on: {
        type: Sequelize.STRING,
      },
      date_of_birth: {
        type: Sequelize.STRING,
      },
      otp_token: {
        type: Sequelize.STRING,
      },
      budget_currency_3dg: {
        type: Sequelize.STRING,
      },
      budget_currency_symbol: {
        type: Sequelize.STRING,
      },
      consumer_interests: {
        type: Sequelize.STRING,
      },
      backup_available: {
        type: Sequelize.INTEGER,
      },
      debug_id: {
        type: Sequelize.STRING,
      },
      device_id: {
        type: Sequelize.STRING,
      },
      wipe_requested: {
        type: Sequelize.INTEGER,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  return consumerProfile;
}
exports.consumerProfileModel = consumerProfileModel;
