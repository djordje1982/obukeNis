const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Zaposleni = sequelize.define(
  "zaposleni",
  {
    id: {
      type: Sequelize.STRING(10),
      primaryKey: true,
    },
    ime: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    pozicijaId: {
      type: Sequelize.STRING(12),
      allowNull: false,
    },
  },
  {
    tableName: "zaposleni",
  }
);

module.exports = Zaposleni;
