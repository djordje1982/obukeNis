const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Pogon = sequelize.define(
  "pogon",
  {
    id: {
      type: Sequelize.STRING(10),
      primaryKey: true,
    },
    nazivPogona: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    mesto: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    adresa: {
      type: Sequelize.STRING(200),
      allowNull: true,
    },
  },
  {
    tableName: "pogoni",
  }
);

module.exports = Pogon;
