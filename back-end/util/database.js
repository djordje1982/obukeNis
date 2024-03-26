const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "vlada-obuke",
  process.env.USER_NAME,
  process.env.USER_PASS,
  {
    dialect: "mysql",
    host: "localhost",
  }
);

module.exports = sequelize;
