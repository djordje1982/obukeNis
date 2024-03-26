const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Obuka = sequelize.define(
  "obuka",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vrstaId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    datum: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    instruktorId: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
    lokacijaId: {
      type: Sequelize.STRING(12),
      allowNull: false,
    },
    poena: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    napomena: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "obuke",
  }
);

module.exports = Obuka;
