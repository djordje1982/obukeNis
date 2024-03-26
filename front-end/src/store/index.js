import { createStore } from "vuex";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

export default createStore({
  state: {
    token: window.localStorage.getItem("token"),
    instruktorId: window.localStorage.getItem("instruktorId"),
    instruktorIme: window.localStorage.getItem("instruktorIme"),
    logoutTime: window.localStorage.getItem("logoutTime"),
    statusCode: "",
    message: "",
    instruktori: [],
    instruktorDetalji: [],
    zaposleni: [],
    zaposleniDetalji: [],
    pogoniOsnovno: [],
    pozicijeOsnovno: [],
    pozicijaDetalji: [],
    pozicijaHeading: [],
    vrste: [],
    vrstaDetalji: [],
    pogoni: [],
    pogonDetalji: [],
    zahtevi: [],
    obuke: [],
    obukaDetalji: [],
    obukeZaposleni: [],
  },
  getters,
  mutations,
  actions,
  modules: {},
});
