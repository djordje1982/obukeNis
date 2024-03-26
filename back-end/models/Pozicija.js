const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Pozicija = sequelize.define(
  "pozicija",
  {
    id: {
      type: Sequelize.STRING(12),
      primaryKey: true,
    },
    nazivPozicije: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    pogonId: {
      type: Sequelize.STRING(12),
      allowNull: false,
    },
  },
  {
    tableName: "pozicije",
  }
);

module.exports = Pozicija;
