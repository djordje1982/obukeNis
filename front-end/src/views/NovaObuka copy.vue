<template>
  <div class="standard">
    <transition name="back" appear>
      <div class="backdrop" v-if="kanVidljivi" @click.self="sakrijKan">
        <Kandidati @odaberi="odaberi" />
      </div>
    </transition>
    <div class="top-nav">
      <div class="tabs">
        <button>Nova</button>
      </div>
      <h1>Obuke zaposlenih u Bloku Promet</h1>
    </div>
    <div class="main">
      <form @submit.prevent="sendData">
        <section>
          <div class="row">
            <div class="form-element fe3">
              <label>Datum i vreme obuke</label>
              <VueDatePicker
                class="datum"
                v-model="odabranDatum"
                locale="sr-Latn-RS"
                :format-locale="srLatn"
                format="dd.MM.yyyy hh:mm"
                :enable-time-picker="true"
              ></VueDatePicker>
            </div>
            <div class="form-element fe3">
              <label>Obuka</label>
              <select>
                <option value=""></option>
                <option v-for="v in vrste" :key="v.id" :value="v.id">
                  {{ v.nazivObuke }}
                </option>
              </select>
            </div>
            <div class="form-element fe3">
              <label>Instruktor</label>
              <select v-model="formData.instruktorId">
                <option></option>
                <option v-for="i in instruktori" :key="i.id" :value="i.id">
                  {{ i.ime }}
                </option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="form-element fe3">
              <label>Lokacija</label>
              <select v-model="formData.lokacijaId">
                <option></option>
                <option v-for="p in pogoni" :key="p.id" :value="p.id">
                  {{ p.nazivPogona }}
                </option>
              </select>
            </div>
            <div class="form-element fe4">
              <label>Maksimalno poena</label>
              <number
                v-model="formData.poena"
                v-bind="numFormat"
                class="input"
              ></number>
            </div>
            <div class="form-element fe4">
              <button type="button">Napomena</button>
            </div>
            <div class="form-element fe4">
              <button class="dugme-pretraga" type="button" @click="pokaziKan">
                <Search />Pretraga
              </button>
            </div>
          </div>
        </section>
        <div class="form">
          <div class="form-element">
            <label>SAP broj</label>
            <input type="text" disabled v-model="kandidat.zaposleniId" />
          </div>
          <div class="form-element">
            <label>Ime i prezime</label>
            <input type="text" disabled v-model="kandidat.ime" />
          </div>
          <div class="form-element">
            <label>Radno mesto</label>
            <input type="text" disabled v-model="kandidat.nazivPozicije" />
          </div>
          <div class="form-element">
            <label>Pre-test</label>
            <number
              v-model="kandidat.preTest"
              v-bind="numFormat"
              class="input"
            ></number>
          </div>
          <div class="form-element">
            <label>Post-test</label>
            <number
              v-model="kandidat.postTest"
              v-bind="numFormat"
              class="input"
            ></number>
          </div>
          <button class="dodaj" type="button" @click="dodaj">Dodaj</button>
        </div>

        <div class="tabela">
          <table>
            <thead>
              <tr>
                <td>SAP broj</td>
                <td>Ime i prezime</td>
                <td>Pre-test <br />poeni</td>
                <td>Pre-test <br />%</td>
                <td>Post-test <br />poeni</td>
                <td>Post-test <br />%</td>
                <td>Obriši</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="k in kandidati" :key="k.zaposleniId">
                <td>{{ k.zaposleniId }}</td>
                <td>{{ k.ime }}</td>
                <td>
                  {{
                    new Intl.NumberFormat("de-DE", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(k.preTest)
                  }}
                </td>
                <td>
                  {{
                    new Intl.NumberFormat("de-DE", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(k.preTestProc)
                  }}
                  %
                </td>
                <td>
                  {{
                    new Intl.NumberFormat("de-DE", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(k.postTest)
                  }}
                </td>
                <td>
                  {{
                    new Intl.NumberFormat("de-DE", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(k.postTestProc)
                  }}
                  %
                </td>
                <td><SvgDelete /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="brojKandidata">Broj kandidata: {{ brojKandidata }}</p>
        <p v-else>Nema odabranih kandidata</p>
        <button>Snimi</button>
      </form>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, reactive, computed, watch, onMounted } from "vue";
import Kandidati from "@/components/obuke/Kandidati.vue";
import SvgDelete from "@/components/svg/SvgDelete.vue";
import Search from "@/components/svg/Search.vue";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { srLatn } from "date-fns/locale";
import { format } from "date-fns";
import { number } from "@coders-tm/vue-number-format";

export default {
  components: { number, VueDatePicker, Kandidati, SvgDelete, Search },
  setup() {
    document.title = "Obuke";
    const store = useStore();

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

    const kanVidljivi = ref(false);

    const pokaziKan = () => {
      kanVidljivi.value = true;
    };

    const sakrijKan = () => {
      kanVidljivi.value = false;
    };

    const odabranDatum = ref("");

    const formData = reactive({
      obuka: "",
      vrstaId: "",
      datum: "",
      instruktorId: "",
      lokacijaId: "",
      poena: "",
      napomena: "",
    });

    const kandidat = reactive({
      zaposleniId: "",
      ime: "",
      nazivPozicije: "",
      preTest: "",
      preTestProc: "",
      postTest: "",
      postTestProc: "",
    });

    const kandidati = ref([]);

    const odaberi = (kan) => {
      kanVidljivi.value = false;
      kandidat.zaposleniId = kan.id;
      kandidat.ime = kan.ime;
      kandidat.nazivPozicije = kan.nazivPozicije;
    };

    const dodaj = () => {
      if (!kandidat.zaposleniId) {
        pokaziKan();
        return store.commit("mutShowMessage", {
          statusCode: 202,
          message: "Odaberite kandidata",
        });
      }
      if (!formData.poena || formData.poena < 1) {
        return store.commit("mutShowMessage", {
          statusCode: 202,
          message: "Unesite maksimalan broj poena za ovu obuku",
        });
      }
      if (formData.poena < kandidat.preTest) {
        return store.commit("mutShowMessage", {
          statusCode: 202,
          message:
            "Broj poena na pre-testu ne može biti veći od maksimalnog broja poena",
        });
      }
      if (formData.poena < kandidat.postTest) {
        return store.commit("mutShowMessage", {
          statusCode: 202,
          message:
            "Broj poena na post-testu ne može biti veći od maksimalnog broja poena",
        });
      }

      let obj = {};

      kandidat.preTestProc = (kandidat.preTest / formData.poena) * 100;

      kandidat.postTestProc = (kandidat.postTest / formData.poena) * 100;

      obj.zaposleniId = kandidat.zaposleniId;
      obj.ime = kandidat.ime;
      obj.nazivPozicije = kandidat.nazivPozicije;
      obj.preTest = kandidat.preTest;
      obj.preTestProc = kandidat.preTestProc;
      obj.postTest = kandidat.postTest;
      obj.postTestProc = kandidat.postTestProc;

      kandidati.value.push(obj);

      kandidat.zaposleniId = "";
      kandidat.ime = "";
      kandidat.nazivPozicije = "";
      kandidat.preTest = "";
      kandidat.preTestProc = "";
      kandidat.postTest = "";
      kandidat.postTestProc = "";
    };

    const obuke = computed(() => {
      return store.getters.getObuke;
    });

    const vrste = computed(() => {
      return store.getters.getVrste;
    });

    const instruktori = computed(() => {
      return store.getters.getInstruktori;
    });

    const pogoni = computed(() => {
      return store.getters.getPogoniOsnovno;
    });

    const brojKandidata = computed(() => {
      return kandidati.value.length;
    });

    const sendData = () => {
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
      if (!kandidati.value.length) {
        store.commit("mutShowMessage", {
          statusCode: 202,
          message: "Obuka će biti snimljena bez odabranih kandidata za obuku",
        });
      }

      console.log(formData);
      console.log(kandidati.value);
    };

    const klik = () => {
      console.log(odabranDatum.value);
    };

    onMounted(() => {
      store.dispatch("actGetObuke");
      store.dispatch("actGetVrste");
      store.dispatch("actGetInstruktori");
      store.dispatch("actGetPogoniOsnovno");
    });
    return {
      klik,
      odabranDatum,
      srLatn,
      formData,
      numFormat,
      vrste,
      instruktori,
      pogoni,
      kanVidljivi,
      pokaziKan,
      sakrijKan,
      kandidat,
      kandidati,
      odaberi,
      dodaj,
      sendData,
      brojKandidata,
    };
  },
};
</script>

<style scoped>
form {
  width: 920px;
  padding: 20px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  height: 100%;
}

section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  height: 140px;
}

.row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
}

.form-element {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 5px;
  height: 55px;
  position: relative;
}

.form-element button {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.fe1 {
  width: 880px;
}

.fe2 {
  width: 430px;
}

.fe3 {
  width: 280px;
}

.fe4 {
  width: 193.33px;
}

.input {
  text-align: right;
}

.form {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 5px;
  border: 1px solid var(--nis-plava);
  border-radius: 4px;
}

.form .form-element:nth-of-type(1),
.form .form-element:nth-of-type(4),
.form .form-element:nth-of-type(5) {
  width: 12%;
}
.form .form-element:nth-of-type(2),
.form .form-element:nth-of-type(3) {
  width: 32%;
}

.tabela {
  width: 100%;
  height: calc(100% - 285px);
  overflow-y: scroll;
  border: 1px solid black;
}

table {
  width: 100%;
}

td {
  text-align: center;
  width: 115px;
}

td:nth-of-type(1) {
  width: 100px;
}
td:nth-of-type(2) {
  width: 250px;
}
td:nth-of-type(7) {
  width: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dugme-pretraga {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100px;
  align-self: flex-start;
}

.dodaj {
  height: 45px;
}
</style>
