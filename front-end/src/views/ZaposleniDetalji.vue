<template>
  <div class="standard">
    <transition name="back" appear>
      <div class="backdrop" v-if="formVidljiv" @click.self="sakrijPromenu">
        <NovZaposleni
          :id="id"
          :ime="ime"
          :pozicijaId="pozicijaId"
          :pogonId="pogonId"
          :editMode="editMode"
        />
      </div>
    </transition>
    <transition name="back" appear>
      <div
        class="backdrop"
        v-if="potvrdaBrisanjaVidljiva"
        @click.self="sakrijPotvrdu"
      >
        <div class="backdrop-container">
          <div class="back-element">
            <div class="pitanje">
              <p>Da li želite da obrišete zaposlenog</p>
              <p>
                <span>{{ ime }}</span
                >?
              </p>
            </div>
          </div>
          <div class="back-element">
            <button class="warning" @click="obrisiZaposlenog">Da</button>
            <button @click="sakrijPotvrdu">Ne</button>
          </div>
        </div>
      </div>
    </transition>
    <div class="top-nav">
      <div class="tabs">
        <button @click="pokaziPromenu">Promeni</button>
        <button @click="pokaziPotvrdu" class="warning">Obriši</button>
      </div>
      <h1>{{ ime }}</h1>
    </div>
    <div class="main">
      <div class="detalji">
        <div class="detalji-element">
          <p>SAP broj</p>
          <p>
            <span>{{ id }}</span>
          </p>
        </div>
        <div class="detalji-element">
          <p>Radno mesto</p>
          <p>
            <span>{{ nazivPozicije }}</span>
          </p>
        </div>
        <div class="detalji-element">
          <p>Pogon</p>
          <p>
            <span>{{ nazivPogona }}</span>
          </p>
        </div>
      </div>
      <div class="pregled">
        <div class="pregled-det">
          <div class="heading">
            <p>Održane obuke:</p>
          </div>
          <div class="tabela">
            <table>
              <thead>
                <tr>
                  <th>Datum obuke</th>
                  <th>Datum isteka</th>
                  <th>Naziv obuke</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="o in odrzane" :key="o.id">
                  <td class="text-center">
                    {{ format(new Date(o.datum), "dd.MM.yyyy") }}
                  </td>
                  <td class="text-center">
                    {{ format(new Date(o.datumIsteka), "dd.MM.yyyy") }}
                  </td>
                  <td>{{ o.nazivObuke }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="pregled-det">
          <div class="heading">
            <p>Zahtevi:</p>
          </div>
          <div class="tabela">
            <table>
              <thead>
                <tr>
                  <th>Naziv obuke</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="o in obuke" :key="o.id">
                  <td
                    :class="{
                      vazeca: o.vrstaDetId,
                      neodrzana: !o.vrstaDetId,
                    }"
                  >
                    {{ o.nazivObuke }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { ref, reactive, computed, watch, onMounted } from "vue";
import { format } from "date-fns";

import Search from "@/components/svg/Search.vue";
import NovZaposleni from "@/components/zaposleni/NovZaposleni.vue";

export default {
  components: { Search, NovZaposleni },
  setup() {
    document.title = "Zaposleni";
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const statusCode = computed(() => {
      return store.getters.getStatusCode;
    });

    const detalji = computed(() => {
      return store.getters.getZaposleniDetalji;
    });

    const obuke = computed(() => {
      return store.getters.getObukeZaposleni;
    });

    const odrzane = computed(() => {
      if (!obuke.value.length) {
        return [];
      }
      const list = obuke.value.filter((o) => {
        return o.vrstaDetId;
      });

      return list;
    });

    const zahtevi = computed(() => {
      const list = [];
      obuke.value.forEach((e) => {
        const obj = {};

        if (!e.datumIsteka) {
        }
      });
    });

    console.log(new Date());

    const ime = computed(() => {
      if (!detalji.value.length) {
        return "Nepostojeći zaposleni";
      } else {
        return detalji.value[0].ime;
      }
    });

    const id = computed(() => {
      if (!detalji.value.length) {
        return "";
      } else {
        return detalji.value[0].id;
      }
    });

    const pozicijaId = computed(() => {
      if (!detalji.value.length) {
        return "";
      } else {
        return detalji.value[0].pozicijaId;
      }
    });

    const nazivPozicije = computed(() => {
      if (!detalji.value.length) {
        return "";
      } else {
        return detalji.value[0].nazivPozicije;
      }
    });

    const pogonId = computed(() => {
      if (!detalji.value.length) {
        return "";
      } else {
        return detalji.value[0].pogonId;
      }
    });

    const nazivPogona = computed(() => {
      if (!detalji.value.length) {
        return "";
      } else {
        return detalji.value[0].nazivPogona;
      }
    });

    const editMode = ref(true);

    const formVidljiv = ref(false);
    const pokaziPromenu = () => {
      if (!ime.value) {
        return;
      }
      formVidljiv.value = true;
    };
    const sakrijPromenu = () => {
      formVidljiv.value = false;
    };

    const potvrdaBrisanjaVidljiva = ref(false);
    const sakrijPotvrdu = () => {
      potvrdaBrisanjaVidljiva.value = false;
    };
    const pokaziPotvrdu = () => {
      if (!ime.value) {
        return;
      }
      potvrdaBrisanjaVidljiva.value = true;
    };

    const obrisiZaposlenog = () => {
      store.dispatch("actObrisiZaposlenog", {
        id: route.params.id,
        ime: ime.value,
      });
    };

    watch(statusCode, (newVal, oldVal) => {
      if (newVal == 201) {
        store.dispatch("actGetZaposleniDetalji", route.params.id);
        formVidljiv.value = false;
      }
      if (newVal == 202) {
        router.push("/zaposleni");
      }
    });

    onMounted(async () => {
      await Promise.all([
        await store.dispatch("actGetZaposleniDetalji", route.params.id),
        await store.dispatch("actGetObukeZasposleni", route.params.id),
      ]);
      if (detalji.value.length) {
        document.title = detalji.value[0].ime;
      } else {
        document.title = "Zaposleni ne postoji u bazi";
      }

      console.log(odrzane.value);
    });

    return {
      detalji,
      ime,
      id,
      pozicijaId,
      nazivPozicije,
      pogonId,
      nazivPogona,
      editMode,
      formVidljiv,
      sakrijPromenu,
      pokaziPromenu,
      potvrdaBrisanjaVidljiva,
      sakrijPotvrdu,
      pokaziPotvrdu,
      obrisiZaposlenog,
      obuke,
      odrzane,
      format,
    };
  },
};
</script>

<style scoped>
.detalji {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  border-bottom: 1px solid lightgray;
}

.detalji-element {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
}

span {
  font-weight: 600;
  text-decoration: underline;
}

.pregled {
  width: 100%;
  height: calc(100% - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.pregled-det {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;

  height: 100%;
  width: 50%;
}

.heading {
  width: 100%;
  height: 30px;
}

.pregled-det p {
  font-size: 20px;
}

.tabela {
  width: 100%;
  height: calc(100% - 40px);
}

table {
  width: 100%;
}

.vazeca {
  background-color: var(--green-back);
  color: var(--green-front);
}

.neodrzana {
  background-color: var(--red-back);
  color: var(--red-front);
}
</style>
