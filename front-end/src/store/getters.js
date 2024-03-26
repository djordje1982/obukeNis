export default {
  getInstruktorId(state, getters) {
    return state.instruktorId;
  },
  getInstruktorIme(state, getters) {
    return state.instruktorIme;
  },
  getToken(state, getters) {
    return state.token;
  },
  getLogoutTime(state, getters) {
    return state.logoutTime;
  },
  getStatusCode(state, getters) {
    return state.statusCode;
  },
  getMessage(state, getters) {
    return state.message;
  },
  getInstruktori(state, getters) {
    return state.instruktori;
  },
  getInstruktorDetalji(state, getters) {
    return state.instruktorDetalji;
  },
  getZaposleni(state, getters) {
    return state.zaposleni;
  },
  getZaposleniDetalji(state, getters) {
    return state.zaposleniDetalji;
  },
  getPogoniOsnovno(state, getters) {
    return state.pogoniOsnovno;
  },
  getPozicijeOsnovno(state, getters) {
    return state.pozicijeOsnovno;
  },
  getVrste(state, getters) {
    return state.vrste;
  },
  getVrstaDetalji(state, getters) {
    return state.vrstaDetalji;
  },
  getPogoni(state, getters) {
    return state.pogoni;
  },
  getPogonDetalji(state, getters) {
    return state.pogonDetalji;
  },
  getZahtevi(state, getters) {
    return state.zahtevi;
  },
  getPozicijaDetalji(state, getters) {
    return state.pozicijaDetalji;
  },
  getPozicijaHeading(state, getters) {
    return state.pozicijaHeading[0];
  },
  getObuke(state, getters) {
    return state.obuke;
  },
  getObukaDetalji(state, getters) {
    return state.obukaDetalji;
  },
  getObukeZaposleni(state, getters) {
    return state.obukeZaposleni;
  },
};
