import router from "@/router";
export default {
  mutSetInstruktor(state, payload) {
    console.log(payload);
    window.localStorage.clear();
    state.token = window.localStorage.getItem("token");
    state.instruktorIme = window.localStorage.getItem("instruktorIme");
    window.localStorage.setItem("instruktorId", payload);
    state.instruktorId = window.localStorage.getItem("instruktorId");
  },
  mutLogin(state, payload) {
    window.localStorage.setItem("token", payload.token);
    window.localStorage.setItem("instruktorId", payload.instruktorId);
    window.localStorage.setItem("instruktorIme", payload.instruktorIme);
    window.localStorage.setItem("logoutTime", payload.logoutTime);
    state.token = window.localStorage.getItem("token");
    state.instruktorId = window.localStorage.getItem("instruktorId");
    state.instruktorIme = window.localStorage.getItem("instruktorIme");
    state.logoutTime = window.localStorage.getItem("logoutTime");
  },
  mutLogout(state, payload) {
    window.localStorage.clear();
    state.token = window.localStorage.getItem("token");
    state.instruktorId = window.localStorage.getItem("instruktorId");
    state.instruktorIme = window.localStorage.getItem("instruktorIme");
    state.logoutTime = localStorage.getItem("logoutTime");
    router.push("/");
    this.commit("mutShowMessage", {
      statusCode: 202,
      message: "Uspešno ste se izlogovali",
    });
  },
  mutHideMessage(state, payload) {
    state.message = "";
    state.statusCode = "";
  },

  mutShowMessage(state, payload) {
    state.message = payload.message;
    state.statusCode = payload.statusCode;

    setTimeout(() => {
      if (state.message) {
        state.message = "";
        state.statusCode = "";
      }
    }, 100);
  },

  mutGetInstruktori(state, payload) {
    state.instruktori = payload;
  },

  mutGetInstruktorDetalji(state, payload) {
    state.instruktorDetalji = payload;
  },

  mutGetZaposleni(state, payload) {
    state.zaposleni = payload;
  },

  mutGetPogoniOsnovno(state, payload) {
    state.pogoniOsnovno = payload;
  },

  mutGetPozicijeOsnovno(state, payload) {
    state.pozicijeOsnovno = payload;
  },

  mutGetZaposleniDetalji(state, payload) {
    state.zaposleniDetalji = payload;
  },

  mutGetVrste(state, payload) {
    state.vrste = payload;
  },

  mutGetVrstaDetalji(state, payload) {
    state.vrstaDetalji = payload;
  },

  mutGetPogoni(state, payload) {
    state.pogoni = payload;
  },

  mutGetPogonDetalji(state, payload) {
    state.pogonDetalji = payload;
  },

  mutGetZahtevi(state, payload) {
    state.zahtevi = payload;
  },

  mutGetPozicijaDetalji(state, payload) {
    state.pozicijaDetalji = payload;
  },

  mutGetPozicijaHeading(state, payload) {
    state.pozicijaHeading = payload;
  },

  mutGetObuke(state, payload) {
    state.obuke = payload;
  },

  mutGetObukaDetalji(state, payload) {
    state.obukaDetalji = payload;
  },

  mutGetObukeZaposleni(state, payload) {
    state.obukeZaposleni = payload;
  },
};
