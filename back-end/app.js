require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./routers/router");
const sequelize = require("./util/database");
const port = process.env.PORT || 4000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(express.json());
app.use("/api", router);

/* MODELS & RELATIONSHIPS */

const Instruktor = require("./models/Instruktor");
const Obuka = require("./models/Obuka");
const ObukaDet = require("./models/ObukaDet");
const Pogon = require("./models/Pogon");
const Pozicija = require("./models/Pozicija");
const VrstaObuke = require("./models/VrstaObuke");
const Zahtev = require("./models/Zahtev");
const Zaposleni = require("./models/Zaposleni");

Zaposleni.hasMany(ObukaDet, {
  foreignKey: "zaposleniId",
  onDelete: "CASCADE",
});

Instruktor.hasMany(Obuka, {
  foreignKey: "instruktorId",
  onDelete: "CASCADE",
});

Obuka.hasMany(ObukaDet, {
  foreignKey: "obukaId",
  onDelete: "CASCADE",
});

Pozicija.hasMany(Zaposleni, {
  foreignKey: "pozicijaId",
  onDelete: "CASCADE",
});

VrstaObuke.hasMany(Obuka, {
  foreignKey: "vrstaId",
  onDelete: "CASCADE",
});

Pogon.hasMany(Pozicija, {
  foreignKey: "pogonId",
  onDelete: "CASCADE",
});

VrstaObuke.belongsToMany(Pozicija, {
  through: "Zahtev",
});

Pozicija.belongsToMany(VrstaObuke, {
  through: "Zahtev",
});

/************************ */

sequelize
  .sync({
    force: false,
  })
  .then((result) => {
    app.listen(port, () => {
      console.log(
        `**** Database connected. Server is running on port ${port}....`
      );
    });
  })
  .catch((e) => console.log(e));
