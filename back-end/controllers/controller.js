const sequelize = require("../util/database");
const { QueryTypes } = require("sequelize");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { format } = require("date-fns");

const PDFDocument = require("pdfkit");

// A4 širina = 595
// A4 visina = 842

// const logo = path.join(__dirname, "../", "assets", "logo.png");
const MontserratFont = path.join(
  __dirname,
  "..",
  "assets",
  "Montserrat-SemiBold.ttf"
);
const MontserratBold = path.join(
  __dirname,
  "..",
  "assets",
  "Montserrat-Bold.ttf"
);
const MontserratItalic = path.join(
  __dirname,
  "..",
  "assets",
  "Montserrat-MediumItalic.ttf"
);

const Instruktor = require("../models/Instruktor");
const Obuka = require("../models/Obuka");
const ObukaDet = require("../models/ObukaDet");
const Pogon = require("../models/Pogon");
const Pozicija = require("../models/Pozicija");
const VrstaObuke = require("../models/VrstaObuke");
const Zaposleni = require("../models/Zaposleni");
const Zahtev = require("../models/Zahtev");

exports.postLogin = async (req, res, next) => {
  const { id, lozinka } = req.body;

  let instruktor;

  try {
    const pronadjen = await Instruktor.findOne({
      where: {
        id,
      },
    });

    if (!pronadjen) {
      return res.json({
        statusCode: 300,
        message: `Instruktor sa SAP brojem ${id} ne postoji.`,
      });
    }

    if (lozinka == "init0000" && pronadjen.lozinka == "init0000") {
      return res.json({
        statusCode: 305,
        message: "Prvi put se logujete. Potrebno je da promenite lozinku",
        instruktorId: pronadjen.id,
      });
    }

    instruktor = pronadjen;
    const isValid = await bcrypt.compare(lozinka, instruktor.lozinka);

    if (!isValid) {
      return res.json({
        statusCode: 300,
        message: "Pogrešna lozinka",
      });
    }
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        auth: 1,
        instruktorId: instruktor.id,
      },
      process.env.TOKEN_HASH
    );

    res.json({
      message: `Dobrodošli, ${instruktor.ime}`,
      instruktorId: instruktor.id,
      instruktorIme: instruktor.ime,
      logoutTime: parseInt(Date.now() + 3600000),
      statusCode: 200,
      token: token,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.patchPromenaLozinke = async (req, res, next) => {
  const { id, lozinka, ponovi } = req.body;

  if (lozinka.length < 8) {
    return res.json({
      statusCode: 300,
      message: "Lozinka mora imati minimum 8 karaktera",
    });
  }
  if (lozinka !== ponovi) {
    return res.json({
      statusCode: 300,
      message: "Lozinke moraju biti iste",
    });
  }
  if (lozinka == "init0000") {
    return res.json({
      statusCode: 400,
      message: "Ne sme se koristiti inicijelna lozinka",
    });
  }

  try {
    const pronadjen = await Instruktor.findOne({
      where: {
        id,
      },
    });

    if (!pronadjen) {
      return res.json({
        statusCode: 400,
        message: "Korisnik ne postoji u bazi",
      });
    }

    const hashedPass = await bcrypt.hash(lozinka, 12);

    const updated = await Instruktor.update(
      {
        lozinka: hashedPass,
      },
      {
        where: {
          id,
        },
      }
    );

    res.json({
      statusCode: 201,
      message: `Uspešno postavljena lozinka. Možete da se ulogujete`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postDodajInstruktora = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const { id, ime, radnoMesto } = req.body;

  try {
    const postoji = await Instruktor.findOne({
      where: {
        id,
      },
    });

    if (postoji) {
      return res.json({
        statusCode: 400,
        message: `Instruktor sa SAP brojem ${id} već postoji u bazi`,
      });
    }

    const kreiran = await Instruktor.create({
      id,
      ime,
      radnoMesto,
      lozinka: "init0000",
    });

    if (!kreiran) {
      return res.json({
        statusCode: 400,
        message: "Dodavanje nije uspelo",
      });
    }

    res.json({
      statusCode: 201,
      message: `Instruktor ${ime} je uspešno dodat u bazu`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.patchPromeniInstruktora = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const { id, ime, radnoMesto } = req.body;

  try {
    const postoji = await Instruktor.findOne({
      where: {
        id,
      },
    });

    if (!postoji) {
      return res.json({
        statusCode: 400,
        message: `Instruktor sa SAP brojem ${id} ne postoji u bazi`,
      });
    }

    const promenjen = await Instruktor.update(
      {
        id,
        ime,
        radnoMesto,
      },
      {
        where: {
          id,
        },
      }
    );

    if (!promenjen) {
      return res.json({
        statusCode: 400,
        message: "Promena nija uspela",
      });
    }

    res.json({
      statusCode: 201,
      message: `Instruktor ${ime} je uspešno promenjen`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.delObrisiInstruktora = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const { id, ime } = req.body;

  try {
    const postoji = await Instruktor.findOne({
      where: {
        id,
      },
    });

    if (!postoji) {
      return res.json({
        statusCode: 400,
        message: `Instruktor sa SAP brojem ${id} ne postoji u bazi`,
      });
    }

    const obrisan = await Instruktor.destroy({
      where: {
        id,
      },
    });

    if (!obrisan) {
      return res.json({
        statusCode: 400,
        message: "Brisanje nije uspelo",
      });
    }

    res.json({
      statusCode: 202,
      message: `Instruktor ${ime} je uspešno obrisan iz baze`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getInstruktori = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }

  try {
    const instruktori = await Instruktor.findAll({
      attributes: ["id", "ime", "radnoMesto"],
    });

    if (!instruktori.length) {
      return res.json({
        statusCode: 202,
        message: "Ne postoje instrukori u bazi",
      });
    }

    res.json(instruktori);
  } catch (err) {
    console.log(err);
  }
};

exports.getInstruktorDetalji = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const id = req.params.id;
  async function getData() {
    const sql = `
                SELECT id, ime, radnoMesto
                FROM instruktori
                where id = ${id}
                `;

    const data = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return data;
  }

  try {
    const detalji = await getData();

    res.json(detalji);
  } catch (err) {
    console.log(err);
  }
};

exports.getZaposleni = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  async function getData() {
    const sql = `
                SELECT zaposleni.id, ime, nazivPozicije, pogoni.nazivPogona
                FROM zaposleni
                JOIN pozicije ON zaposleni.pozicijaId=pozicije.id
                JOIN pogoni on pozicije.pogonId=pogoni.id
                ORDER BY pozicije.id
                `;

    const data = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return data;
  }

  try {
    const zaposleni = await getData();

    if (!zaposleni.length) {
      res.json({
        statusCode: 202,
        message: "Nema zaposlenih u bazi",
      });
    }
    res.json(zaposleni);
  } catch (err) {
    console.log(err);
  }
};

exports.getPogoniOsnovno = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  try {
    const pogoni = await Pogon.findAll({
      attributes: ["id", "nazivPogona"],
    });

    if (!pogoni.length) {
      return res.json({
        statusCode: 202,
        message: "Ne postoje pogoni u bazi",
      });
    }

    res.json(pogoni);
  } catch (err) {
    console.log(err);
  }
};

exports.getPozicijeOsnovno = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  try {
    const pozicije = await Pozicija.findAll({
      attributes: ["id", "nazivPozicije", "pogonId"],
    });

    if (!pozicije.length) {
      return res.json({
        statusCode: 202,
        message: "Ne postoje pozicije u bazi",
      });
    }

    res.json(pozicije);
  } catch (err) {
    console.log(err);
  }
};

exports.getPozicijeHeading = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const id = req.params.id;
  async function getData() {
    const sql = `
                SELECT pozicije.id, nazivPozicije, pogonId, nazivPogona
                FROM pozicije
                JOIN pogoni ON pozicije.pogonId=pogoni.id
                WHERE pozicije.id="${id}"
                `;

    const data = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return data;
  }

  try {
    const heading = await getData();

    res.json(heading);
  } catch (err) {
    console.log(err);
  }
};

exports.postDodajZaposlenog = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const { id, ime, pozicijaId } = req.body;

  try {
    const postoji = await Zaposleni.findOne({
      where: {
        id,
      },
    });

    if (postoji) {
      return res.json({
        statusCode: 400,
        message: `Zaposleni sa SAP brojem ${id} već postoji u bazi`,
      });
    }

    const kreiran = await Zaposleni.create({
      id,
      ime,
      pozicijaId,
    });

    if (!kreiran) {
      return res.json({
        statusCode: 400,
        message: "Dodavanje nije uspelo",
      });
    }

    res.json({
      statusCode: 201,
      message: `Zaposleni ${ime} je uspešno dodat u bazu`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getZaspoleniDetalji = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const id = req.params.id;
  async function getData() {
    const sql = `
                SELECT zaposleni.id, ime, nazivPozicije, pogoni.nazivPogona,
                zaposleni.pozicijaId, pozicije.pogonId
                FROM zaposleni
                JOIN pozicije ON zaposleni.pozicijaId=pozicije.id
                JOIN pogoni on pozicije.pogonId=pogoni.id
                WHERE zaposleni.id=${id}
                `;

    const data = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return data;
  }

  try {
    const detalji = await getData();

    res.json(detalji);
  } catch (err) {
    console.log(err);
  }
};

exports.patchPromeniZaposlenog = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const { id, ime, pozicijaId } = req.body;

  try {
    const postoji = await Zaposleni.findOne({
      where: {
        id,
      },
    });

    if (!postoji) {
      return res.json({
        statusCode: 400,
        message: `Zaposleni sa SAP brojem ${id} ne postoji u bazi`,
      });
    }

    const promenjen = await Zaposleni.update(
      {
        id,
        ime,
        pozicijaId,
      },
      {
        where: {
          id,
        },
      }
    );

    if (!promenjen) {
      return res.json({
        statusCode: 400,
        message: "Promena nija uspela",
      });
    }

    res.json({
      statusCode: 201,
      message: `Zaposleni ${ime} je uspešno promenjen`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.delObrisiZaposlenog = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const { id, ime } = req.body;

  try {
    const postoji = await Zaposleni.findOne({
      where: {
        id,
      },
    });

    if (!postoji) {
      return res.json({
        statusCode: 400,
        message: `Zaposleni sa SAP brojem ${id} ne postoji u bazi`,
      });
    }

    const obrisan = await Zaposleni.destroy({
      where: {
        id,
      },
    });

    if (!obrisan) {
      return res.json({
        statusCode: 400,
        message: "Brisanje nije uspelo",
      });
    }

    res.json({
      statusCode: 202,
      message: `Zaposleni ${ime} je uspešno obrisan iz baze`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postDodajVrstu = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const { nazivObuke, obnova } = req.body;

  try {
    const postoji = await VrstaObuke.findOne({
      where: {
        nazivObuke,
      },
    });

    if (postoji) {
      return res.json({
        statusCode: 400,
        message: `Ta vrsta obuke već postoji u bazi`,
      });
    }

    const kreirana = await VrstaObuke.create({
      nazivObuke,
      obnova,
    });

    if (!kreirana) {
      return res.json({
        statusCode: 400,
        message: "Dodavanje nije uspelo",
      });
    }

    res.json({
      statusCode: 201,
      message: `Vrsta obuke je uspešno dodata u bazu`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getVrste = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }

  try {
    const vrste = await VrstaObuke.findAll({
      attributes: ["id", "nazivObuke", "obnova"],
      order: [["nazivObuke"]],
    });

    if (!vrste.length) {
      return res.json({
        statusCode: 202,
        message: "Ne postoje vrste obuka u bazi",
      });
    }

    res.json(vrste);
  } catch (err) {
    console.log(err);
  }
};

exports.getVrstaDetalji = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const id = req.params.id;
  async function getData() {
    const sql = `
                SELECT id, nazivObuke, obnova
                FROM vrsteObuka
                where id = ${id}
                `;

    const data = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return data;
  }

  try {
    const detalji = await getData();

    console.log(detalji);

    res.json(detalji);
  } catch (err) {
    console.log(err);
  }
};

exports.patchPromeniVrstu = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const { id, nazivObuke, obnova } = req.body;

  try {
    const postoji = await VrstaObuke.findOne({
      where: {
        id,
      },
    });

    if (!postoji) {
      return res.json({
        statusCode: 400,
        message: `Vrsta obuke ne postoji u bazi`,
      });
    }

    const promenjena = await VrstaObuke.update(
      {
        id,
        nazivObuke,
        obnova,
      },
      {
        where: {
          id,
        },
      }
    );

    if (!promenjena) {
      return res.json({
        statusCode: 400,
        message: "Promena nija uspela",
      });
    }

    res.json({
      statusCode: 201,
      message: `Vrsta obuke je uspešno promenjena`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.delObrisiVrstu = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const { id } = req.body;

  try {
    const postoji = await VrstaObuke.findOne({
      where: {
        id,
      },
    });

    if (!postoji) {
      return res.json({
        statusCode: 400,
        message: `Vrsta obuke ne postoji u bazi`,
      });
    }

    const obrisana = await VrstaObuke.destroy({
      where: {
        id,
      },
    });

    if (!obrisana) {
      return res.json({
        statusCode: 400,
        message: "Brisanje nije uspelo",
      });
    }

    res.json({
      statusCode: 202,
      message: `Vrsta obuke je uspešno obrisana iz baze`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getPogoni = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }

  try {
    const pogoni = await Pogon.findAll({
      attributes: ["id", "nazivPogona", "mesto", "adresa"],
    });

    if (!pogoni.length) {
      return res.json({
        statusCode: 202,
        message: "Ne postoje pogoni u bazi",
      });
    }

    res.json(pogoni);
  } catch (err) {
    console.log(err);
  }
};

exports.postDodajPogon = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const { id, nazivPogona, mesto, adresa } = req.body;

  try {
    const postoji = await Pogon.findOne({
      where: {
        id,
      },
    });

    if (postoji) {
      return res.json({
        statusCode: 400,
        message: `Pogon već postoji u bazi`,
      });
    }

    const kreiran = await Pogon.create({
      id,
      nazivPogona,
      mesto,
      adresa,
    });

    if (!kreiran) {
      return res.json({
        statusCode: 400,
        message: "Dodavanje nije uspelo",
      });
    }

    res.json({
      statusCode: 201,
      message: `Pogon je uspešno dodat u bazu`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getPogonDetalji = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const id = req.params.id;
  async function getData() {
    const sql = `
                SELECT pogoni.id, pogoni.nazivPogona, pogoni.mesto, pogoni.adresa,
                pozicije.id as pozicijaId, nazivPozicije
                FROM pogoni
                LEFT JOIN pozicije ON pogoni.Id=pozicije.pogonId
                WHERE pogoni.id = "${id}"
                `;

    const data = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return data;
  }

  try {
    const detalji = await getData();

    res.json(detalji);
  } catch (err) {
    console.log(err);
  }
};

exports.patchPromeniPogon = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const { id, nazivPogona, mesto, adresa } = req.body;

  console.log(req.body);

  try {
    const postoji = await Pogon.findOne({
      where: {
        id,
      },
    });

    if (!postoji) {
      return res.json({
        statusCode: 400,
        message: `Pogon ne postoji u bazi`,
      });
    }

    const promenjen = await Pogon.update(
      {
        nazivPogona,
        mesto,
        adresa,
      },
      {
        where: {
          id,
        },
      }
    );

    if (!promenjen) {
      return res.json({
        statusCode: 400,
        message: "Promena nija uspela",
      });
    }

    res.json({
      statusCode: 201,
      message: `Pogon je uspešno promenjen`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.delObrisiPogon = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const { id, nazivPogona } = req.body;

  try {
    const postoji = await Pogon.findOne({
      where: {
        id,
      },
    });

    if (!postoji) {
      return res.json({
        statusCode: 400,
        message: `Pogon ne postoji u bazi`,
      });
    }

    const obrisan = await Pogon.destroy({
      where: {
        id,
      },
    });

    if (!obrisan) {
      return res.json({
        statusCode: 400,
        message: "Brisanje nije uspelo",
      });
    }

    res.json({
      statusCode: 202,
      message: `Pogon ${nazivPogona} je uspešno obrisan iz baze`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getPozicijaDetalji = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }

  async function getData() {
    const id = req.params.id;
    const sql = `
                SELECT zaposleni.id, ime, nazivPozicije, pogoni.nazivPogona, zaposleni.pozicijaId, pozicije.pogonId
                FROM zaposleni
                JOIN pozicije ON zaposleni.pozicijaId=pozicije.id
                JOIN pogoni on pozicije.pogonId=pogoni.id
                WHERE pozicijaId = "${id}"
                `;

    const data = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return data;
  }

  try {
    const detalji = await getData();

    res.json(detalji);
  } catch (err) {
    console.log(err);
  }
};

exports.getZahtevi = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }

  async function getData() {
    const id = req.params.id;
    const sql = `
                SELECT pozicijaId, vrstaObukeId
                FROM zahtevi
                JOIN pozicije ON pozicijaId=pozicije.id
                WHERE pozicijaId = "${id}"
                `;

    const data = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return data;
  }

  try {
    const zahtevi = await getData();

    res.json(zahtevi);
  } catch (err) {
    console.log(err);
  }
};

exports.postPostaviZahteve = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const { pozicijaId, data } = req.body;

  try {
    const brisanje = await Zahtev.destroy({
      where: {
        pozicijaId,
      },
    });

    const postavljeno = await data.forEach(async (d) => {
      await Zahtev.create({
        vrstaObukeId: d,
        pozicijaId,
      });
    });

    res.json({
      statusCode: 201,
      message: `Zahtevi uspešno postavljeni`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postDodajPoziciju = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const { id, nazivPozicije, pogonId } = req.body;

  try {
    const kreirana = await Pozicija.create({
      id,
      nazivPozicije,
      pogonId,
    });

    if (!kreirana) {
      return res.json({
        statusCode: 400,
        message: `Kreiranje nije uspelo`,
      });
    }

    res.json({
      statusCode: 201,
      message: `Uspešno kreirana pozicija`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getObuke = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }

  async function getData() {
    const sql = `
                SELECT obuke.id, obuke.datum, pogoni.nazivPogona, instruktori.ime as instruktorIme,
                obuke.instruktorId, vrsteObuka.nazivObuke, vrsteObuka.obnova, obuke.poena,
                (SELECT count(obukaId)
                FROM obukadet
                WHERE obukaDet.ObukaId=obuke.id) as kandidata
                FROM pogoni INNER JOIN (instruktori INNER JOIN
                (vrsteObuka INNER JOIN obuke ON vrsteObuka.id = obuke.vrstaId)
                ON instruktori.id = obuke.instruktorId) ON pogoni.id = obuke.lokacijaId
                ORDER BY obuke.datum DESC
                `;

    const data = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return data;
  }

  try {
    const obuke = await getData();

    res.json(obuke);
  } catch (err) {
    console.log(err);
  }
};

exports.getObukeDetalji = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }

  const id = req.params.id;

  async function getData() {
    const sql = `
                SELECT obuke.id as id, obuke.datum, obuke.lokacijaId, obuke.instruktorId, obuke.vrstaId,
                obuke.poena, obuke.napomena, obukaDet.zaposleniId, obukaDet.preTest, obukaDet.postTest,
                instruktori.ime as imeInstruktora, pogoni.nazivPogona, pozicije.nazivPozicije, vrsteObuka.nazivObuke,
                zaposleni.ime as zaposleniIme
                FROM
                ((pogoni INNER JOIN pozicije ON pogoni.id = pozicije.pogonId)
                INNER JOIN zaposleni ON pozicije.id = zaposleni.pozicijaId)
                INNER JOIN (vrsteObuka INNER JOIN ((instruktori INNER JOIN obuke ON instruktori.id = obuke.instruktorId)
                INNER JOIN obukaDet ON obuke.id = obukaDet.obukaId) ON vrsteObuka.id = obuke.vrstaId) ON zaposleni.id = obukaDet.zaposleniId
                WHERE obuke.id=${id}
                ORDER BY datum DESC;
                `;

    const data = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return data;
  }

  try {
    const obuke = await getData();

    res.json(obuke);
  } catch (err) {
    console.log(err);
  }
};

exports.postDodajObuku = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const {
    datum,
    instruktorId,
    lokacijaId,
    napomena,
    poena,
    vrstaId,
    kandidati,
  } = req.body;

  try {
    const obuka = await Obuka.create({
      datum,
      instruktorId,
      lokacijaId,
      napomena,
      poena,
      vrstaId,
    });

    kandidati.forEach(async (k) => {
      await ObukaDet.create({
        obukaId: obuka.id,
        vrstaDetId: vrstaId,
        zaposleniId: k.zaposleniId,
        preTest: parseFloat(k.preTest),
        postTest: parseFloat(k.postTest),
      });
    });

    // await kandidati.forEach(async (k) => {
    //   const sql = `
    //           DELETE
    //           FROM obukaDet
    //           WHERE zaposleniId=${k.zaposleniId} AND vrstaDetId=${vrstaId} AND obukaId<>${obuka.id}
    //             `;

    //   await sequelize.query(sql, {
    //     type: QueryTypes.SELECT,
    //   });
    // });

    res.json({
      statusCode: 201,
      message: "Obuka uspešno kreirana",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.delObrisiObuku = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const id = req.params.id;

  try {
    const postoji = await Obuka.findOne({
      where: {
        id,
      },
    });

    if (!postoji) {
      return res.json({
        statusCode: 400,
        message: `Obuka ne postoji u bazi`,
      });
    }

    const obrisan = await Obuka.destroy({
      where: {
        id,
      },
    });

    if (!obrisan) {
      return res.json({
        statusCode: 400,
        message: "Brisanje nije uspelo",
      });
    }

    res.json({
      statusCode: 202,
      message: `Obuka je uspešno obrisana iz baze`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.patchPromeniObuku = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }
  const {
    id,
    vrstaId,
    datum,
    instruktorId,
    lokacijaId,
    poena,
    napomena,
    kandidati,
  } = req.body;

  try {
    const postoji = await Obuka.findOne({
      where: {
        id,
      },
    });

    if (!postoji) {
      return res.json({
        statusCode: 400,
        message: `Obuka ne postoji u bazi`,
      });
    }

    const promenjena = await Obuka.update(
      {
        vrstaId,
        datum,
        instruktorId,
        lokacijaId,
        poena,
        napomena,
        kandidati,
      },
      {
        where: {
          id,
        },
      }
    );

    if (!promenjena) {
      return res.json({
        statusCode: 400,
        message: "Promena nija uspela",
      });
    }

    await ObukaDet.destroy({
      where: {
        obukaId: id,
      },
    });

    await kandidati.forEach(async (k) => {
      await ObukaDet.create({
        obukaId: id,
        vrstaDetId: vrstaId,
        zaposleniId: k.zaposleniId,
        preTest: parseFloat(k.preTest),
        postTest: parseFloat(k.postTest),
      });
    });

    res.json({
      statusCode: 201,
      message: `Obuka je uspešno promenjena`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getObukeZaposleni = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }

  const id = req.params.id;

  async function getData() {
    const sql = `
              SELECT DISTINCT zahtevi.pozicijaId, zahtevi.vrstaObukeId, zaposleni.id as zaposleniId,
              DATE_ADD(obuke.datum, INTERVAL vrsteobuka.obnova YEAR) as datumIsteka,
              obukadet.vrstaDetId, obuke.datum, vrsteobuka.nazivObuke
              FROM zahtevi
              JOIN pozicije ON zahtevi.pozicijaId=pozicije.id
              JOIN vrsteobuka ON zahtevi.vrstaObukeId=vrsteobuka.id	
              JOIN zaposleni ON zaposleni.pozicijaId=pozicije.id
              LEFT JOIN obukadet ON obukadet.vrstaDetId=zahtevi.vrstaObukeId
              LEFT JOIN obuke on obuke.id = obukadet.obukaId
              WHERE zaposleni.id= "${id}"
              ORDER BY obukadet.vrstaDetId DESC, obuke.datum DESC
                `;

    const data = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return data;
  }

  try {
    const obukeZaposleni = await getData();

    res.json(obukeZaposleni);
  } catch (err) {
    console.log(err);
  }
};
