<template>
  <div class="standard">
    <transition name="back" appear>
      <div class="backdrop" v-if="kanVidljivi" @click.self="sakrijKan">
        <Kandidati @odaberi="odaberi" />
      </div>
    </transition>
    <div class="top-nav">
      <div class="tabs">
        <p>Obuke zaposlenih u Bloku Promet</p>
      </div>
      <h1>Promena obuke</h1>
    </div>
    <div class="main">
      <form @submit.prevent="submitData">
        <div class="elementi">
          <div
            class="element"
            :class="{ neaktivan: odabranTab == 2 }"
            @click="odaberiTab(1)"
          >
            <p>Osnovni podaci</p>
          </div>
          <div
            class="element"
            :class="{ neaktivan: odabranTab == 1 }"
            @click="odaberiTab(2)"
          >
            <p>Odabir kandidata</p>
          </div>
        </div>
        <transition name="switchTab" appear mode="out-in">
          <section v-if="odabranTab == 1">
            <div class="row">
              <div class="form-element">
                <label>Datum i vreme obuke</label>
                <VueDatePicker
                  class="datum"
                  v-model="odabranDatum"
                  locale="sr-Latn-RS"
                  :format-locale="srLatn"
                  format="dd.MM.yyyy HH:mm"
                  :enable-time-picker="true"
                ></VueDatePicker>
              </div>
              <div class="form-element">
                <label>Obuka</label>
                <select v-model="formData.vrstaId">
                  <option value=""></option>
                  <option v-for="v in vrste" :key="v.id" :value="v.id">
                    {{ v.nazivObuke }}
                  </option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="form-element">
                <label>Instruktor</label>
                <select v-model="formData.instruktorId">
                  <option></option>
                  <option v-for="i in instruktori" :key="i.id" :value="i.id">
                    {{ i.ime }}
                  </option>
                </select>
              </div>
              <div class="form-element">
                <label>Lokacija</label>
                <select v-model="formData.lokacijaId">
                  <option></option>
                  <option v-for="p in pogoni" :key="p.id" :value="p.id">
                    {{ p.nazivPogona }}
                  </option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="form-element fe4">
                <label>Maksimalno poena</label>
                <number
                  v-model="formData.poena"
                  v-bind="numFormat"
                  class="input"
                ></number>
              </div>
            </div>
            <div class="row">
              <div class="form-element napomena">
                <label>Napomena:</label>
                <textarea
                  cols="1000"
                  rows="10"
                  v-model="formData.napomena"
                ></textarea>
              </div>
            </div>
          </section>
          <section v-else>
            <div class="red">
              <div class="red-element">
                <button class="pretraga" type="button" @click="pokaziKan">
                  <Search />Pretraga
                </button>
              </div>
              <div class="red-element">
                <label>SAP broj</label>
                <input type="text" disabled v-model="kandidat.zaposleniId" />
              </div>
              <div class="red-element">
                <label>Ime i prezime</label>
                <input type="text" disabled v-model="kandidat.ime" />
              </div>
              <div class="red-element">
                <label>Pre-test</label>
                <number
                  v-model="kandidat.preTest"
                  v-bind="numFormat"
                  class="input"
                ></number>
              </div>
              <div class="red-element">
                <label>Post-test</label>
                <number
                  v-model="kandidat.postTest"
                  v-bind="numFormat"
                  class="input"
                ></number>
              </div>
              <div class="red-element">
                <button
                  type="button"
                  class="dodaj"
                  @click="dodaj"
                  v-if="!aktivanKandidatId"
                >
                  Dodaj
                </button>
                <button
                  type="button"
                  class="dodaj"
                  @click="promeniKandidata"
                  v-else
                >
                  Promeni
                </button>
              </div>
            </div>
            <div class="tabela">
              <table>
                <thead>
                  <tr>
                    <th>SAP broj</th>
                    <th>Ime i prezime</th>
                    <th>Pre-test <br />poeni</th>
                    <th>Pre-test <br />%</th>
                    <th>Post-test <br />poeni</th>
                    <th>Post-test <br />%</th>
                    <th>Obriši</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="k in formData.kandidati" :key="k.zaposleniId">
                    <td @click="aktivirajRed(k.zaposleniId)">
                      {{ k.zaposleniId }}
                    </td>
                    <td @click="aktivirajRed(k.zaposleniId)">{{ k.ime }}</td>
                    <td @click="aktivirajRed(k.zaposleniId)">
                      {{
                        new Intl.NumberFormat("de-DE", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(k.preTest)
                      }}
                    </td>
                    <td
                      @click="aktivirajRed(k.zaposleniId)"
                      :class="{
                        ispod: k.preTestProc < 70,
                        iznad: k.preTestProc >= 70,
                      }"
                    >
                      {{
                        new Intl.NumberFormat("de-DE", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(k.preTestProc)
                      }}
                      %
                    </td>
                    <td @click="aktivirajRed(k.zaposleniId)">
                      {{
                        new Intl.NumberFormat("de-DE", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(k.postTest)
                      }}
                    </td>
                    <td
                      @click="aktivirajRed(k.zaposleniId)"
                      :class="{
                        ispod: k.postTestProc < 70,
                        iznad: k.postTestProc >= 70,
                      }"
                    >
                      {{
                        new Intl.NumberFormat("de-DE", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(k.postTestProc)
                      }}
                      %
                    </td>
                    <td @click="obrisiKandidata(k.zaposleniId)">
                      <SvgDelete />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </transition>
        <footer>
          <p v-if="brojKandidata">Broj kandidata: {{ brojKandidata }}</p>
          <p v-else>Nema odabranih kandidata</p>
          <button type="submit" class="snimi">Snimi</button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { ref, reactive, computed, watch, onMounted } from "vue";

import SvgDelete from "@/components/svg/SvgDelete.vue";
import Search from "@/components/svg/Search.vue";
import Kandidati from "@/components/obuke/Kandidati.vue";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { srLatn } from "date-fns/locale";
import { format } from "date-fns";
import { number } from "@coders-tm/vue-number-format";
export default {
  components: {
    number,
    VueDatePicker,
    SvgDelete,
    Search,
    Kandidati,
  },
  setup() {
    document.title = "Promena obuke";
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const kanVidljivi = ref(false);

    const pokaziKan = () => {
      kanVidljivi.value = true;
    };

    const sakrijKan = () => {
      kanVidljivi.value = false;
    };

    const numFormat = reactive({
      decimal: ",",
      separator: ".",
      prefix: "",
      suffix: "",
      precision: 2,
      nullValue: "",
      masked: false,
      reverseFill: false,
      minimumFractionDigits: 2,
    });

    const odabranDatum = ref("");

    const formData = reactive({
      vrstaId: "",
      datum: "",
      instruktorId: "",
      lokacijaId: "",
      poena: "",
      napomena: "",
      kandidati: [],
    });

    const brojKandidata = computed(() => {
      return formData.kandidati.length;
    });

    const kandidat = reactive({
      zaposleniId: "",
      ime: "",
      preTest: 0,
      postTest: 0,
    });

    const odaberi = (kan) => {
      kanVidljivi.value = false;
      kandidat.zaposleniId = kan.id;
      kandidat.ime = kan.ime;
    };

    const dodaj = () => {
      if (!kandidat.zaposleniId) {
        pokaziKan();
        return store.commit("mutShowMessage", {
          statusCode: 202,
          message: "Odaberite kandidata",
        });
      }
      if (parseFloat(formData.poena) < parseFloat(kandidat.preTest)) {
        return store.commit("mutShowMessage", {
          statusCode: 202,
          message:
            "Broj poena na pre-testu ne može biti veći od maksimalnog broja poena",
        });
      }
      if (parseFloat(formData.poena) < parseFloat(kandidat.postTest)) {
        return store.commit("mutShowMessage", {
          statusCode: 202,
          message:
            "Broj poena na post-testu ne može biti veći od maksimalnog broja poena",
        });
      }

      const nadjen = formData.kandidati.filter((k) => {
        return k.zaposleniId == kandidat.zaposleniId;
      });

      if (nadjen.length) {
        return store.commit("mutShowMessage", {
          statusCode: 202,
          message: "Kandidat je već unet u listu",
        });
      }

      let obj = {};

      kandidat.preTestProc = (kandidat.preTest / formData.poena) * 100;

      kandidat.postTestProc = (kandidat.postTest / formData.poena) * 100;

      obj.zaposleniId = kandidat.zaposleniId;
      obj.ime = kandidat.ime;
      obj.preTest = kandidat.preTest;
      obj.preTestProc = kandidat.preTestProc;
      obj.postTest = kandidat.postTest;
      obj.postTestProc = kandidat.postTestProc;

      formData.kandidati.push(obj);

      formData.kandidati = formData.kandidati.sort((a, b) => {
        return a.ime > b.ime ? 1 : -1;
      });

      kandidat.zaposleniId = "";
      kandidat.ime = "";
      kandidat.preTest = "";
      kandidat.preTestProc = "";
      kandidat.postTest = "";
      kandidat.postTestProc = "";
    };

    const odabranTab = ref(1);

    const odaberiTab = (id) => {
      if (id == 1) {
        formData.poena = formData.poena * 1;
      }

      if (id == 2) {
        if (!odabranDatum.value) {
          return store.commit("mutShowMessage", {
            statusCode: 202,
            message: "Unesite datum i vreme obuke",
          });
        }
        if (!formData.vrstaId) {
          return store.commit("mutShowMessage", {
            statusCode: 202,
            message: "Odaberite naziv obuke",
          });
        }
        if (!formData.instruktorId) {
          return store.commit("mutShowMessage", {
            statusCode: 202,
            message: "Odaberite instruktora obuke",
          });
        }
        if (!formData.lokacijaId) {
          return store.commit("mutShowMessage", {
            statusCode: 202,
            message: "Odaberite lokaciju obuke",
          });
        }
        if (!formData.poena || formData.poena <= 0) {
          return store.commit("mutShowMessage", {
            statusCode: 202,
            message: "Unesite maksimalan broj poena",
          });
        }
      }
      odabranTab.value = id;
    };

    const aktivanKandidatId = ref("");

    const odabraniKandidat = computed(() => {
      if (!aktivanKandidatId) {
        return {};
      }
      const list = formData.kandidati.filter((k) => {
        return k.zaposleniId == aktivanKandidatId.value;
      });
      return list[0];
    });

    const aktivirajRed = (id) => {
      aktivanKandidatId.value = id;

      kandidat.zaposleniId = odabraniKandidat.value.zaposleniId;
      kandidat.ime = odabraniKandidat.value.ime;
      kandidat.preTest = odabraniKandidat.value.preTest * 1;
      kandidat.postTest = odabraniKandidat.value.postTest * 1;
    };

    const obrisiKandidata = (id) => {
      formData.kandidati = formData.kandidati.filter((k) => {
        return k.zaposleniId != id;
      });
    };

    const promeniKandidata = () => {
      formData.kandidati = formData.kandidati.filter((k) => {
        return k.zaposleniId != aktivanKandidatId.value;
      });

      let obj = {};

      kandidat.preTestProc = (kandidat.preTest / formData.poena) * 100;

      kandidat.postTestProc = (kandidat.postTest / formData.poena) * 100;

      obj.zaposleniId = kandidat.zaposleniId;
      obj.ime = kandidat.ime;
      obj.preTest = kandidat.preTest;
      obj.preTestProc = kandidat.preTestProc;
      obj.postTest = kandidat.postTest;
      obj.postTestProc = kandidat.postTestProc;

      formData.kandidati.push(obj);

      formData.kandidati = formData.kandidati.sort((a, b) => {
        return a.ime > b.ime ? 1 : -1;
      });

      aktivanKandidatId.value = "";
      kandidat.zaposleniId = "";
      kandidat.ime = "";
      kandidat.preTest = "";
      kandidat.preTestProc = "";
      kandidat.postTest = "";
      kandidat.postTestProc = "";
    };

    const vrste = computed(() => {
      return store.getters.getVrste;
    });

    const obuka = computed(() => {
      return store.getters.getObukaDetalji;
    });

    const pogoni = computed(() => {
      return store.getters.getPogoniOsnovno;
    });

    const instruktori = computed(() => {
      return store.getters.getInstruktori;
    });

    const statusCode = computed(() => {
      return store.getters.getStatusCode;
    });

    const submitData = () => {
      if (!odabranDatum.value) {
        return store.commit("mutShowMessage", {
          statusCode: 202,
          message: "Unesite datum i vreme obuke",
        });
      }
      if (!formData.vrstaId) {
        return store.commit("mutShowMessage", {
          statusCode: 202,
          message: "Odaberite naziv obuke",
        });
      }
      if (!formData.instruktorId) {
        return store.commit("mutShowMessage", {
          statusCode: 202,
          message: "Odaberite instruktora obuke",
        });
      }
      if (!formData.lokacijaId) {
        return store.commit("mutShowMessage", {
          statusCode: 202,
          message: "Odaberite lokaciju obuke",
        });
      }
      if (!formData.poena || formData.poena <= 0) {
        return store.commit("mutShowMessage", {
          statusCode: 202,
          message: "Unesite maksimalan broj poena",
        });
      }

      if (!formData.kandidati.length) {
        store.commit("mutShowMessage", {
          statusCode: 202,
          message: "Niste uneli ni jednog kandidata",
        });
        return (greskaPoena.value = true);
      }

      let brojGresaka = 0;

      formData.kandidati.forEach((k) => {
        if (
          parseFloat(k.preTest) > parseFloat(formData.poena) ||
          parseFloat(k.postTest) > parseFloat(formData.poena)
        ) {
          brojGresaka++;
        }
      });

      if (brojGresaka) {
        return store.commit("mutShowMessage", {
          statusCode: 400,
          message: `Za neke zaposlen broj poena na testovima je veći od maksimalnog broja poena`,
        });
      }

      formData.datum = format(
        new Date(odabranDatum.value),
        "yyyy-MM-dd HH:mm:ss"
      );

      store.dispatch("actPromeniObuku", formData);
    };

    watch(statusCode, (newVal, oldVal) => {
      if (newVal == 201) {
        router.push("/obuke");
      }
    });

    const popuni = () => {
      const datum1 = new Date(obuka.value[0].datum);
      formData.id = obuka.value[0].id;
      formData.vrstaId = obuka.value[0].vrstaId;
      odabranDatum.value = obuka.value[0].datum;
      formData.instruktorId = obuka.value[0].instruktorId;
      formData.lokacijaId = obuka.value[0].lokacijaId;
      formData.poena = obuka.value[0].poena;
      formData.napomena = obuka.value[0].napomena;

      obuka.value.forEach((k) => {
        let obj = {};
        obj.zaposleniId = k.zaposleniId;
        obj.ime = k.zaposleniIme;
        obj.preTest = k.preTest * 1;
        obj.preTestProc = ((k.preTest * 1) / obuka.value[0].poena) * 100;
        obj.postTest = k.postTest * 1;
        obj.postTestProc = ((k.postTest * 1) / obuka.value[0].poena) * 100;
        formData.kandidati.push(obj);
      });
    };

    onMounted(async () => {
      await store.dispatch("actGetObukaDetalji", route.params.id);
      await store.dispatch("actGetVrste");
      await store.dispatch("actGetInstruktori");
      await store.dispatch("actGetPogoniOsnovno");
      popuni();
    });

    return {
      odabranTab,
      odaberiTab,
      formData,
      odabranDatum,
      vrste,
      pogoni,
      instruktori,
      srLatn,
      numFormat,
      kanVidljivi,
      pokaziKan,
      sakrijKan,
      odaberi,
      kandidat,
      dodaj,
      brojKandidata,
      aktivirajRed,
      aktivanKandidatId,
      promeniKandidata,
      obrisiKandidata,
      submitData,
    };
  },
};
</script>

<style scoped>
form {
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 20px;
}

.elementi {
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 20px;
  width: 100%;
  background-color: var(--nis-plava);
  height: 40px;
  padding-left: 10px;
}

.element {
  background-color: #fff;
  color: var(--nis-plava);
  width: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
  border-right: 1px solid #fff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  cursor: pointer;
}

.neaktivan {
  background-color: var(--nis-plava);
  color: #fff;
}

section {
  width: 100%;
  height: calc(100% - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
}

footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

footer p {
  align-self: flex-start;
}

.row {
  width: 620px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
}

.form-element {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 3px;
}

.fe4 {
  width: 150px;
}

.input {
  width: 75px;
  text-align: center;
}
.napomena {
  width: 100%;
}

textarea {
  width: 620px;
  resize: none;
  border: none;
  border-radius: 4px;
  background-color: var(--nis-plava);
  color: #fff;
  padding: 4px;
}

.snimi {
  align-self: flex-end;
}

.pretraga {
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.red {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  height: 60px;
}

.red-element {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 3px;
}

.red-element:nth-of-type(2) {
  width: 120px;
}

.red-element:nth-of-type(3) {
  width: 320px;
}
.red-element:nth-of-type(4),
.red-element:nth-of-type(5) {
  width: 70px;
}

.tabela {
  width: 100%;
  height: calc(100% - 110px);
  overflow-y: scroll;
  border: 1px solid black;
}

table {
  width: 100%;
}

th:nth-of-type(1) {
  width: 10.5%;
}
th:nth-of-type(2) {
  width: 40%;
}
th:nth-of-type(3),
th:nth-of-type(4),
th:nth-of-type(5),
th:nth-of-type(6) {
  width: 10.5%;
}
th:nth-of-type(7) {
  width: 7.5%;
}
td:nth-of-type(7) {
  display: flex;
  align-items: center;
  justify-content: center;
}

td {
  text-align: center;
}

td:nth-of-type(2) {
  text-align: left;
}

.ispod {
  background-color: var(--red-back);
  color: var(--red-front);
}

.iznad {
  background-color: var(--green-back);
  color: var(--green-front);
}

.nula {
  background-color: var(--yellow-back);
  color: var(--yellow-front);
}

.dodaj {
  width: 85px;
}
</style>
