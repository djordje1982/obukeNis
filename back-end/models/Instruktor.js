const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Instruktor = sequelize.define(
  "instruktor",
  {
    id: {
      type: Sequelize.STRING(10),
      primaryKey: true,
    },
    ime: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    radnoMesto: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    lozinka: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "instruktori",
  }
);

module.exports = Instruktor;
