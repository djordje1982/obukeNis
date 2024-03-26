const sequelize = require("../util/database");
const { QueryTypes } = require("sequelize");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Instruktor = require("../models/Instruktor");
const Obuka = require("../models/Obuka");
const ObukaDet = require("../models/ObukaDet");
const Pogon = require("../models/Pogon");
const Pozicija = require("../models/Pozicija");
const VrstaObuke = require("../models/VrstaObuke");
const Zaposleni = require("../models/Zaposleni");
const Zahtev = require("../models/Zahtev");

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

exports.getListaPrisustva = async (req, res, next) => {
  const auth = req.auth;
  if (auth !== 1) {
    return res.json({
      statusCode: 400,
      message: "Niste autorizovani",
    });
  }

  const id = req.params.id;

  async function getPodaci() {
    const sql = `
                SELECT obuke.id, obuke.datum, obuke.lokacijaId, obuke.instruktorId, obuke.vrstaId,
                pogoni.nazivPogona, pogoni.mesto, instruktori.ime as imeInstruktora, instruktori.radnoMesto,
                vrsteobuka.nazivObuke, zaposleni.ime, pozicije.nazivPozicije, obukaDet.zaposleniId
                FROM pozicije INNER JOIN
                (zaposleni INNER JOIN (vrsteobuka INNER JOIN (instruktori INNER JOIN
                (pogoni INNER JOIN (obuke INNER JOIN obukaDet ON obuke.id = obukaDet.obukaId)
                ON pogoni.id = obuke.lokacijaId) ON instruktori.id = obuke.instruktorId)
                ON vrsteobuka.id = obuke.vrstaId)
                ON zaposleni.id = obukaDet.zaposleniId) ON pozicije.id = zaposleni.pozicijaId
                WHERE obuke.id=${id}
                ORDER BY pozicije.id
              `;

    const podaci = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return podaci;
  }

  const data = await getPodaci();

  const pdfDoc = new PDFDocument({
    size: "A4",
    margins: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    layout: "landscape",
  });

  res.setHeader("Content-Type", "application/pdf");
  if (!data.length) {
    res.setHeader("Content-Disposition", 'inline; filename=Lista prisustva"');
  } else {
    res.setHeader("Content-Disposition", 'inline; filename=Lista prisustva"');
  }

  pdfDoc.pipe(res);

  pdfDoc.font(MontserratFont, 11).fillColor("#244999");
  pdfDoc.text("Mesto: " + data[0].nazivPogona + ", " + data[0].mesto, 25, 20, {
    width: 375,
    align: "left",
  });

  pdfDoc.text(
    "Datum: " + format(new Date(data[0].datum), "dd.MM.yyyy"),
    25,
    35,
    {
      width: 375,
      align: "left",
    }
  );

  pdfDoc.font(MontserratFont, 14).fillColor("#244999");
  pdfDoc.text(data[0].nazivObuke, 25, 60, {
    width: 792,
    height: 40,
    align: "center",
  });

  pdfDoc
    .rect(25, 90, 792, 35)
    .lineWidth(1)
    .fillOpacity(1)
    .fillAndStroke("#db0814", "#244999");

  pdfDoc.moveTo(90, 90).lineTo(90, 125).stroke("#244999");
  pdfDoc.moveTo(250, 90).lineTo(250, 125).stroke("#244999");
  pdfDoc.moveTo(530, 90).lineTo(530, 125).stroke("#244999");
  pdfDoc.moveTo(610, 90).lineTo(610, 125).stroke("#244999");

  let rb = 0;
  let y = 125;
  let h = 18;
  let x = 25;
  const topPadding = 2;
  const leftPadding = 4;

  let rbSirina = 65;
  let imePocetak = x + rbSirina;
  let imeSirina = 160;
  let rmPocetak = imePocetak + imeSirina;
  let rmSirina = 280;
  let sapPocetak = rmPocetak + rmSirina;
  let sapSirina = 80;
  let potpisPocetak = sapPocetak + sapSirina;
  let potpisSirina = 207;

  pdfDoc.font(MontserratFont, 12).fillColor("#fff");
  pdfDoc.text("Redni", x, 92, {
    width: rbSirina,
    height: 40,
    align: "center",
  });
  pdfDoc.text("broj", x, 107, {
    width: rbSirina,
    height: 25,
    align: "center",
  });
  pdfDoc.text("Ime i prezime", imePocetak, 100, {
    width: imeSirina,
    height: 25,
    align: "center",
  });
  pdfDoc.text("Naziv radnog mesta", rmPocetak, 100, {
    width: rmSirina,
    height: 25,
    align: "center",
  });
  pdfDoc.text("SAP", sapPocetak, 100, {
    width: sapSirina,
    height: 25,
    align: "center",
  });
  pdfDoc.text("Potpis", potpisPocetak, 100, {
    width: potpisSirina,
    height: 25,
    align: "center",
  });

  pdfDoc.font(MontserratFont, 10).fillColor("#244999");
  data.forEach((d) => {
    rb++;
    pdfDoc.text(rb + ".", x, y + topPadding, {
      width: rbSirina,
      height: h,
      align: "center",
    });
    pdfDoc.text(d.ime, imePocetak + leftPadding, y + topPadding, {
      width: imeSirina,
      height: h,
      align: "left",
    });
    pdfDoc.text(d.nazivPozicije, rmPocetak + leftPadding, y + topPadding, {
      width: rmSirina,
      height: h,
      align: "left",
    });
    pdfDoc.text(d.zaposleniId, sapPocetak, y + topPadding, {
      width: sapSirina,
      height: h,
      align: "center",
    });

    pdfDoc
      .moveTo(25, y + h)
      .lineTo(817, y + h)
      .stroke("#244999");

    pdfDoc
      .moveTo(x, y)
      .lineTo(x, y + h)
      .stroke("#244999");
    pdfDoc
      .moveTo(imePocetak, y)
      .lineTo(imePocetak, y + h)
      .stroke("#244999");
    pdfDoc
      .moveTo(rmPocetak, y)
      .lineTo(rmPocetak, y + h)
      .stroke("#244999");
    pdfDoc
      .moveTo(sapPocetak, y)
      .lineTo(sapPocetak, y + h)
      .stroke("#244999");
    pdfDoc
      .moveTo(potpisPocetak, y)
      .lineTo(potpisPocetak, y + h)
      .stroke("#244999");
    pdfDoc
      .moveTo(potpisPocetak + potpisSirina, y)
      .lineTo(potpisPocetak + potpisSirina, y + h)
      .stroke("#244999");

    y = y + h;
  });

  pdfDoc.font(MontserratFont, 10).fillColor("#244999");
  pdfDoc.text("Instruktor", 600, 495, {
    width: 180,
    height: 20,
    align: "center",
  });

  pdfDoc.moveTo(600, 530).lineTo(780, 530).stroke("#244999");
  pdfDoc.font(MontserratFont, 10).fillColor("#244999");
  pdfDoc.text(
    data[0].imeInstruktora + ", SAP " + data[0].instruktorId,
    600,
    535,
    {
      width: 180,
      height: 15,
      align: "center",
    }
  );
  pdfDoc.text(data[0].radnoMesto, 600, 550, {
    width: 180,
    height: 15,
    align: "center",
  });

  pdfDoc.end();
};
