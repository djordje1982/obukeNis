const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const VrstaObuke = sequelize.define(
  "vrstaObuke",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nazivObuke: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    obnova: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "vrsteObuka",
  }
);

module.exports = VrstaObuke;
