const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");
const controllerStampa = require("../controllers/controller-stampa");
const security = require("../middleware/security");

/*******AUTH */

router.post("/login", controller.postLogin);
router.patch("/promena-lozinke", controller.patchPromenaLozinke);

/*******INSTRUKTORI */

router.post("/dodaj-instruktora", security, controller.postDodajInstruktora);
router.get("/instruktori", security, controller.getInstruktori);
router.patch(
  "/promeni-instruktora",
  security,
  controller.patchPromeniInstruktora
);
router.get("/instruktori/:id", security, controller.getInstruktorDetalji);
router.delete(
  "/obrisi-instruktora/:id",
  security,
  controller.delObrisiInstruktora
);

/*******ZAPOSLENI */

router.get("/zaposleni", security, controller.getZaposleni);
router.patch(
  "/promeni-zaposlenog",
  security,
  controller.patchPromeniZaposlenog
);
router.get("/zaposleni/:id", security, controller.getZaspoleniDetalji);
router.delete(
  "/obrisi-zaposlenog/:id",
  security,
  controller.delObrisiZaposlenog
);
router.get("/obuke-zaposleni/:id", security, controller.getObukeZaposleni);

/*******VRSTE OBUKA */

router.post("/dodaj-vrstu", security, controller.postDodajVrstu);
router.get("/vrste", security, controller.getVrste);
router.patch("/promeni-vrstu", security, controller.patchPromeniVrstu);
router.get("/vrste/:id", security, controller.getVrstaDetalji);
router.delete("/obrisi-vrstu/:id", security, controller.delObrisiVrstu);

/*******POGONI / POZICIJE */

router.get("/pogoni-osnovno", security, controller.getPogoniOsnovno);
router.get("/pozicije-osnovno", security, controller.getPozicijeOsnovno);
router.post("/dodaj-zaposlenog", security, controller.postDodajZaposlenog);
router.get("/pogoni", security, controller.getPogoni);
router.post("/dodaj-pogon", security, controller.postDodajPogon);
router.get("/pogoni/:id", security, controller.getPogonDetalji);
router.post("/postavi-zahteve", security, controller.postPostaviZahteve);
router.post("/dodaj-poziciju", security, controller.postDodajPoziciju);
router.patch("/promeni-pogon", security, controller.patchPromeniPogon);
router.get("/pozicija-heading/:id", security, controller.getPozicijeHeading);
router.delete("/obrisi-pogon/:id", security, controller.delObrisiPogon);
router.get("/zahtevi/:id", security, controller.getZahtevi);
router.get("/pozicije/:id", security, controller.getPozicijaDetalji);

/*******OBUKE */

router.get("/obuke", security, controller.getObuke);
router.post("/dodaj-obuku", security, controller.postDodajObuku);
router.get("/obuke-detalji/:id", security, controller.getObukeDetalji);
router.delete("/obrisi-obuku/:id", security, controller.delObrisiObuku);
router.patch("/promeni-obuku", security, controller.patchPromeniObuku);

/*******ŠTAMPA */

router.get(
  "/lista-prisustva/:id",
  security,
  controllerStampa.getListaPrisustva
);

module.exports = router;
