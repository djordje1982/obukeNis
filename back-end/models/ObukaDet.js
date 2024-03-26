const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const ObukaDet = sequelize.define(
  "obukadet",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    obukaId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    vrstaDetId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    zaposleniId: {
      type: Sequelize.STRING(10),
      allowNull: true,
    },
    preTest: {
      type: Sequelize.DECIMAL(6, 2),
      allowNull: true,
    },
    postTest: {
      type: Sequelize.DECIMAL(6, 2),
      allowNull: true,
    },
  },
  {
    tableName: "obukaDet",
  }
);

module.exports = ObukaDet;
