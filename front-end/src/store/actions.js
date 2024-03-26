import router from "@/router";

let domen = "http://localhost:3000/api";

export default {
  async actLogin(context, payload) {
    const url = `${domen}/login`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      context.commit("mutShowMessage", data);
      if (data.statusCode == 305) {
        context.commit("mutSetInstruktor", data.instruktorId);
        return router.push("/promena-lozinke");
      }
      if (data.statusCode == 200) {
        router.push("/");
        context.commit("mutLogin", data);
        setTimeout(() => {
          if (context.getters.getToken) {
            context.commit("mutLogout");
            context.commit("mutShowMessage", {
              statusCode: 300,
              message: "Izlogovali ste se",
            });
          }
        }, 3600000);
        setTimeout(() => {
          if (context.getters.getToken) {
            context.commit("mutShowMessage", {
              statusCode: 300,
              message: "Sesija Vam ističe. Za 1 minut bićete izlogovani",
            });
          }
        }, 3540000);
      }
    } catch (err) {
      console.log(err);
    }
  },

  async actPromenaLozinke(context, payload) {
    const url = `${domen}/promena-lozinke`;

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      context.commit("mutShowMessage", data);
      if (data.statusCode == 201) {
        context.commit("mutSetInstruktor", "");
        return router.push("/login");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async actDodajInstruktora(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/dodaj-instruktora`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      context.commit("mutShowMessage", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actPromeniInstruktora(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/promeni-instruktora`;

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      context.commit("mutShowMessage", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actObrisiInstruktora(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/obrisi-instruktora/${payload.id}`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      context.commit("mutShowMessage", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actGetInstruktori(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/instruktori`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.statusCode == 202 || data.statusCode == 400) {
        return context.commit("mutShowMessage", data);
      }

      context.commit("mutGetInstruktori", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actGetInstruktorDetalji(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/instruktori/${payload}`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      context.commit("mutGetInstruktorDetalji", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actGetZaposleni(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/zaposleni`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.statusCode == 202) {
        return context.commit("mutShowMessage", data);
      }

      context.commit("mutGetZaposleni", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actGetPogoniOsnovno(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/pogoni-osnovno`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.statusCode == 202) {
        return context.commit("mutShowMessage", data);
      }

      context.commit("mutGetPogoniOsnovno", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actGetPozicijeOsnovno(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/pozicije-osnovno`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.statusCode == 202) {
        return context.commit("mutShowMessage", data);
      }

      context.commit("mutGetPozicijeOsnovno", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actDodajZaposlenog(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/dodaj-zaposlenog`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      context.commit("mutShowMessage", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actGetZaposleniDetalji(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/zaposleni/${payload}`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      context.commit("mutGetZaposleniDetalji", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actPromeniZaposlenog(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/promeni-zaposlenog`;

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      context.commit("mutShowMessage", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actObrisiZaposlenog(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/obrisi-zaposlenog/${payload.id}`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      context.commit("mutShowMessage", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actDodajVrstu(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/dodaj-vrstu`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      context.commit("mutShowMessage", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actGetVrste(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/vrste`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.statusCode == 202 || data.statusCode == 400) {
        return context.commit("mutShowMessage", data);
      }

      context.commit("mutGetVrste", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actGetVrstaDetalji(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/vrste/${payload}`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      context.commit("mutGetVrstaDetalji", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actPromeniVrstu(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/promeni-vrstu`;

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      context.commit("mutShowMessage", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actObrisiVrstu(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/obrisi-vrstu/${payload.id}`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      context.commit("mutShowMessage", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actGetPogoni(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/pogoni`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.statusCode == 202 || data.statusCode == 400) {
        return context.commit("mutShowMessage", data);
      }

      context.commit("mutGetPogoni", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actDodajPogon(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/dodaj-pogon`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      context.commit("mutShowMessage", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actGetPogonDetalji(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/pogoni/${payload}`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      context.commit("mutGetPogonDetalji", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actPromeniPogon(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/promeni-pogon`;

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      context.commit("mutShowMessage", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actObrisiPogon(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/obrisi-pogon/${payload.id}`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      context.commit("mutShowMessage", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actGetZahtevi(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/zahtevi/${payload}`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      context.commit("mutGetZahtevi", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actGetPozicijaDetalji(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/pozicije/${payload}`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      context.commit("mutGetPozicijaDetalji", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actGetPozicijaHeading(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/pozicija-heading/${payload}`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      context.commit("mutGetPozicijaHeading", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actPostaviZahteve(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/postavi-zahteve`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      context.commit("mutShowMessage", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actDodajPoziciju(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/dodaj-poziciju`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      context.commit("mutShowMessage", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actGetObuke(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/obuke`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      context.commit("mutGetObuke", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actGetObukaDetalji(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/obuke-detalji/${payload}`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      context.commit("mutGetObukaDetalji", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actDodajObuku(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/dodaj-obuku`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      context.commit("mutShowMessage", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actObrisiObuku(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/obrisi-obuku/${payload}`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      context.commit("mutShowMessage", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actPromeniObuku(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/promeni-obuku`;

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      context.commit("mutShowMessage", data);
    } catch (err) {
      console.log(err);
    }
  },

  async actListaPrisustva(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/lista-prisustva/${payload}`;
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const blob = await res.blob();
      let _url = window.URL.createObjectURL(blob);
      window.open(_url, "_blank").focus();
    } catch (err) {
      console.log(err);
    }
  },

  async actGetObukeZasposleni(context, payload) {
    const token = context.getters.getToken;
    const url = `${domen}/obuke-zaposleni/${payload}`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      context.commit("mutGetObukeZaposleni", data);
    } catch (err) {
      console.log(err);
    }
  },
};
