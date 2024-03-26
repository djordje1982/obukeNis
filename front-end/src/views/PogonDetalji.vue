<template>
  <div class="standard">
    <transition name="back" appear>
      <div class="backdrop" v-if="formVidljiv" @click.self="sakrijPromenu">
        <NovPogon
          :id="id"
          :nazivPogona="nazivPogona"
          :mesto="mesto"
          :adresa="adresa"
          :editMode="editMode"
        />
      </div>
    </transition>
    <transition name="back" appear>
      <div
        class="backdrop"
        v-if="pozicijaFormVidljiva"
        @click.self="sakrijPozicijuForm"
      >
        <NovaPozicija
          :editMode="editMode"
          :nazivPogona="nazivPogona"
          :pogonId="id"
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
              <p>Da li želite da obrišete pogon</p>
              <p>
                <span>{{ nazivPogona }}</span
                >?
              </p>
            </div>
          </div>
          <div class="back-element">
            <button class="warning" @click="obrisiPogon">Da</button>
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
      <h1>{{ nazivPogona }}</h1>
    </div>
    <div class="main">
      <div class="detalji">
        <div class="pozicije">
          <button @click="pokaziPozicijuForm">Dodaj poziciju</button>
        </div>
        <h2>Šifra: {{ id }}, {{ mesto }}</h2>
      </div>
      <div class="filter">
        <div class="filter-element">
          <label>Naziv pozicije</label>
          <div class="input-search">
            <Search />
            <input type="text" v-model="filterPozicija" />
          </div>
        </div>
      </div>
      <div class="tabela-container">
        <div class="tabela">
          <table>
            <thead>
              <tr>
                <th>Šifra</th>
                <th>Naziv pozicije</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="p in filterDetalji"
                :key="p.pozicijaId"
                @click="goToDetails(p.pozicijaId)"
              >
                <td>{{ p.pozicijaId }}</td>
                <td>{{ p.nazivPozicije }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="rezultat">
        <p>
          {{ rezultat }}
        </p>
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
import NovPogon from "@/components/pogoni/NovPogon.vue";
import NovaPozicija from "@/components/pozicije/NovaPozicija.vue";

export default {
  components: { Search, NovPogon, NovaPozicija },
  setup() {
    document.title = "Detalji pogona";
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const filterPozicija = ref("");

    const statusCode = computed(() => {
      return store.getters.getStatusCode;
    });

    const pozicijaFormVidljiva = ref(false);
    const pokaziPozicijuForm = () => {
      pozicijaFormVidljiva.value = true;
    };
    const sakrijPozicijuForm = () => {
      pozicijaFormVidljiva.value = false;
    };

    const detalji = computed(() => {
      return store.getters.getPogonDetalji;
    });

    const filterDetalji = computed(() => {
      if (!detalji.value.length || !detalji.value[0].nazivPozicije) {
        return [];
      }
      const list = detalji.value.filter((d) => {
        return d.nazivPozicije
          .toLowerCase()
          .includes(filterPozicija.value.toLowerCase());
      });

      return list;
    });

    const nazivPogona = computed(() => {
      if (!detalji.value.length) {
        return "";
      } else {
        return detalji.value[0].nazivPogona;
      }
    });

    const id = computed(() => {
      if (!detalji.value.length) {
        return "";
      } else {
        return detalji.value[0].id;
      }
    });

    const editMode = ref(false);

    const mesto = computed(() => {
      if (!detalji.value.length) {
        return "";
      } else {
        return detalji.value[0].mesto;
      }
    });

    const adresa = computed(() => {
      if (!detalji.value.length) {
        return "";
      } else {
        return detalji.value[0].adresa;
      }
    });

    const formVidljiv = ref(false);
    const pokaziPromenu = () => {
      if (!id.value) {
        return;
      }
      editMode.value = true;
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
      if (!id.value) {
        return;
      }
      potvrdaBrisanjaVidljiva.value = true;
    };

    const obrisiPogon = () => {
      store.dispatch("actObrisiPogon", {
        id: route.params.id,
        nazivPogona: nazivPogona.value,
      });
    };

    const rezultat = computed(() => {
      if (!filterDetalji.value.length) {
        return "Nema rezultata pretrage";
      }
      return `Pronađeno: ${filterDetalji.value.length}`;
    });

    watch(statusCode, (newVal, oldVal) => {
      if (newVal == 201) {
        store.dispatch("actGetPogonDetalji", route.params.id);
        formVidljiv.value = false;
        pozicijaFormVidljiva.value = false;
      }
      if (newVal == 202) {
        router.push("/pogoni");
      }
    });

    const goToDetails = (id) => {
      router.push(`/pozicije/${id}`);
    };

    onMounted(async () => {
      await store.dispatch("actGetPogonDetalji", route.params.id);
    });

    return {
      filterPozicija,
      detalji,
      filterDetalji,
      id,
      nazivPogona,
      mesto,
      adresa,
      editMode,
      formVidljiv,
      sakrijPromenu,
      pokaziPromenu,
      potvrdaBrisanjaVidljiva,
      sakrijPotvrdu,
      pokaziPotvrdu,
      obrisiPogon,
      rezultat,
      goToDetails,
      pozicijaFormVidljiva,
      pokaziPozicijuForm,
      sakrijPozicijuForm,
    };
  },
};
</script>

<style scoped>
.detalji {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid lightgray;
}

.detalji h2 {
  font-size: 20px;
}

span {
  font-weight: 600;
  text-decoration: underline;
}

.filter {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  height: 80px;
}

.filter-element {
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
}

.tabela-container {
  width: 960px;
  height: calc(100vh - 340px);
}

.tabela {
  width: 100%;
}

table {
  width: 100%;
}

td:first-of-type {
  width: 150px;
  text-align: center;
}

.rezultat {
  width: 960px;
  height: 20px;
  text-align: right;
  border-top: 1px solid var(--nis-plava);
  padding: 5px 0;
}
</style>
