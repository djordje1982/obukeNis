<template>
  <div class="standard">
    <transition name="back" appear>
      <div class="backdrop" v-if="formVidljiv" @click.self="sakrijPromenu">
        <NovaPozicija
          :editMode="editMode"
          :pogonId="pogonId"
          :nazivPogona="nazivPogona"
          :pozicijaId="pozicijaId"
          :nazivPozicije="nazivPozicije"
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
              <p>Da li želite da obrišete pozicju</p>
              <p>
                <span>{{ nazivPozicije }}</span
                >?
              </p>
            </div>
          </div>
          <div class="back-element">
            <button class="warning">Da</button>
            <button>Ne</button>
          </div>
        </div>
      </div>
    </transition>
    <div class="top-nav">
      <div class="tabs">
        <button @click="pokaziPromenu">Promeni</button>
        <button @click="pokaziPotvrdu" class="warning">Obriši</button>
      </div>
      <h1>{{ nazivPogona }}</h1>
    </div>
    <div class="main">
      <div class="detalji">
        <h2>{{ pozicijaId }}</h2>
        <h2>{{ nazivPozicije }}</h2>
      </div>
      <div class="heading">
        <h2>Zaposleni:</h2>
        <h2>Zahtevi:</h2>
        <button :class="{ disabled: !promenjeniZahtevi }" @click="snimiPromene">
          Snimi
        </button>
      </div>
      <div class="zaposleni-zahtevi">
        <div class="zaposleni">
          <div class="zaposlen" v-for="p in pozicijaDetalji" :key="p.id">
            <p>{{ p.id }}</p>
            <p>{{ p.ime }}</p>
          </div>
        </div>
        <div class="zahtevi">
          <div class="zahtev" v-for="v in vrste" :key="v.id">
            <input
              type="checkbox"
              :id="`id${v.id}`"
              :value="v.id"
              v-model="odabrani"
              v-if="listaVidljiva"
            />
            <label :for="`id${v.id}`" v-if="listaVidljiva">{{
              v.nazivObuke
            }}</label>
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

import Search from "@/components/svg/Search.vue";
import NovaPozicija from "@/components/pozicije/NovaPozicija.vue";

export default {
  components: { Search, NovaPozicija },
  setup() {
    document.title = "Detalji pozicije";
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const odabrani = ref([]);

    const statusCode = computed(() => {
      return store.getters.getStatusCode;
    });

    const pozicijaDetalji = computed(() => {
      return store.getters.getPozicijaDetalji;
    });

    const heading = computed(() => {
      return store.getters.getPozicijaHeading;
    });

    const nazivPogona = computed(() => {
      if (!heading.value) {
        return {};
      }
      return heading.value.nazivPogona;
    });

    const pogonId = computed(() => {
      if (!heading.value) {
        return {};
      }
      return heading.value.pogonId;
    });

    const pozicijaId = computed(() => {
      if (!heading.value) {
        return {};
      }
      return heading.value.id;
    });

    const nazivPozicije = computed(() => {
      if (!heading.value) {
        return {};
      }
      return heading.value.nazivPozicije;
    });
    const ime = computed(() => {
      if (!pozicijaDetalji.value) {
        return {};
      }
      return pozicijaDetalji.value.ime;
    });

    const vrste = computed(() => {
      return store.getters.getVrste;
    });

    const zahtevi = computed(() => {
      return store.getters.getZahtevi;
    });

    const zahteviSort = computed(() => {
      if (!zahtevi.value.length) {
        return [];
      }
      const zah = zahtevi.value.map((z) => {
        return z.vrstaObukeId;
      });
      const sortirano = zah.sort((a, b) => {
        return a > b ? 1 : -1;
      });

      return Array.from(sortirano);
    });

    const odabraniSort = computed(() => {
      if (!odabrani.value.length) {
        return [];
      }

      const sortirano = odabrani.value.sort((a, b) => {
        return a > b ? 1 : -1;
      });

      return Array.from(sortirano);
    });

    const promenjeniZahtevi = computed(() => {
      return (
        JSON.stringify(zahteviSort.value) !== JSON.stringify(odabraniSort.value)
      );
    });

    const snimiPromene = () => {
      if (!promenjeniZahtevi.value) {
        return;
      } else {
        const formData = {
          pozicijaId: pozicijaId.value,
          data: odabrani.value,
        };

        store.dispatch("actPostaviZahteve", formData);
      }
    };

    const editMode = ref(true);

    const formVidljiv = ref(false);
    const pokaziPromenu = () => {
      if (!nazivPozicije.value) {
        return;
      }
      formVidljiv.value = true;
      editMode.value = true;
    };
    const sakrijPromenu = () => {
      formVidljiv.value = false;
      editMode.value = false;
    };

    const potvrdaBrisanjaVidljiva = ref(false);
    const sakrijPotvrdu = () => {
      potvrdaBrisanjaVidljiva.value = false;
    };
    const pokaziPotvrdu = () => {
      if (!nazivPozicije.value) {
        return;
      }
      potvrdaBrisanjaVidljiva.value = true;
    };

    const listaVidljiva = ref(true);

    watch(statusCode, async (newVal, oldVal) => {
      if (newVal == 201) {
        router.go(-1);
      }
    });

    onMounted(async () => {
      await store.dispatch("actGetVrste");
      await store.dispatch("actGetZahtevi", route.params.id);
      await store.dispatch("actGetPozicijaDetalji", route.params.id);
      await store.dispatch("actGetPozicijaHeading", route.params.id);
      zahtevi.value.forEach((z) => {
        odabrani.value.push(z.vrstaObukeId);
      });
      console.log(heading.value);
    });

    return {
      editMode,
      formVidljiv,
      sakrijPromenu,
      pokaziPromenu,
      potvrdaBrisanjaVidljiva,
      sakrijPotvrdu,
      pokaziPotvrdu,
      vrste,
      odabrani,
      pozicijaDetalji,
      nazivPogona,
      pogonId,
      pozicijaId,
      nazivPozicije,
      promenjeniZahtevi,
      snimiPromene,
      listaVidljiva,
    };
  },
};
</script>

<style scoped>
.detalji {
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 5px;
  border-bottom: 1px solid lightgray;
}

.detalji h2 {
  font-size: 20px;
}

span {
  font-weight: 600;
  text-decoration: underline;
}

.heading {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid var(--nis-plava);
  gap: 20px;
  position: relative;
}

.heading h2 {
  font-size: 24px;
}

.heading h2:first-of-type {
  width: 35%;
}

.zaposleni-zahtevi {
  width: 100%;
  height: calc(100% - 125px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.zaposleni,
.zahtevi {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 5px;
  overflow-y: scroll;
}

.zaposleni {
  width: 35%;
}

.zaposlen {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  padding: 5px 0;
  border-bottom: 1px solid var(--nis-plava);
}

.zaposlen:hover {
  background-color: var(--nis-plava);
  color: #fff;
}

.zaposlen p:first-of-type {
  width: 80px;
}

.zahtevi {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 5px;
  width: calc(65% - 20px);
}

.zahtev {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  height: 20px;
  width: 100%;
}

.zahtev input {
  height: 16px;
  width: 16px;
  cursor: pointer;
}

.zahtev label {
  font-size: 14px;
  cursor: pointer;
}

.disabled {
  opacity: 0.6;
  color: grey;
  cursor: unset;
}
</style>
