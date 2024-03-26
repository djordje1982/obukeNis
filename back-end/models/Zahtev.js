const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Zahtev = sequelize.define(
  "zahtev",
  {
    vrstaObukeId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    pozicijaId: {
      type: Sequelize.STRING(12),
      primaryKey: true,
    },
  },
  {
    tableName: "zahtevi",
  }
);

module.exports = Zahtev;
