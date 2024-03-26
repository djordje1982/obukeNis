<template>
  <div class="standard">
    <transition name="back" appear>
      <div class="backdrop" v-if="formVidljiv" @click.self="sakrijForm">
        <NovZaposleni />
      </div>
    </transition>
    <div class="top-nav">
      <div class="tabs">
        <button @click="pokaziForm">Nov</button>
      </div>
      <h1>Zaposleni</h1>
    </div>
    <div class="main">
      <div class="filter">
        <div class="filter-element">
          <label>SAP broj</label>
          <div class="input-search">
            <Search />
            <input type="text" v-model="filter.sap" />
          </div>
        </div>
        <div class="filter-element">
          <label>Ime i prezime</label>
          <div class="input-search">
            <Search />
            <input type="text" v-model="filter.ime" />
          </div>
        </div>
        <div class="filter-element">
          <label>Radno mesto</label>
          <div class="input-search">
            <Search />
            <input type="text" v-model="filter.nazivPozicije" />
          </div>
        </div>
        <div class="filter-element">
          <label>Pogon</label>
          <div class="input-search">
            <Search />
            <input type="text" v-model="filter.nazivPogona" />
          </div>
        </div>
      </div>
      <div class="tabela-container">
        <div class="tabela">
          <table>
            <thead>
              <tr>
                <th>SAP broj</th>
                <th>Ime i prezime</th>
                <th>Radno mesto</th>
                <th>Pogon</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="z in filterZaposleni"
                :key="z.id"
                @click="goToDetails(z.id)"
              >
                <td>{{ z.id }}</td>
                <td>{{ z.ime }}</td>
                <td>{{ z.nazivPozicije }}</td>
                <td>{{ z.nazivPogona }}</td>
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
import { useRouter } from "vue-router";
import { ref, reactive, computed, watch, onMounted } from "vue";

import Search from "@/components/svg/Search.vue";
import NovZaposleni from "@/components/zaposleni/NovZaposleni.vue";
export default {
  components: {
    Search,
    NovZaposleni,
  },
  setup() {
    document.title = "Zaposleni";
    const store = useStore();
    const router = useRouter();

    const statusCode = computed(() => {
      return store.getters.getStatusCode;
    });

    const formVidljiv = ref(false);
    const pokaziForm = () => {
      formVidljiv.value = true;
    };
    const sakrijForm = () => {
      formVidljiv.value = false;
    };

    const filter = reactive({
      sap: "",
      ime: "",
      nazivPozicije: "",
      nazivPogona: "",
    });

    const zaposleni = computed(() => {
      return store.getters.getZaposleni;
    });

    const filterZaposleni = computed(() => {
      if (!zaposleni.value.length) {
        return [];
      }
      const list = zaposleni.value.filter((i) => {
        return (
          i.id.toLowerCase().includes(filter.sap.toLowerCase()) &&
          i.ime.toLowerCase().includes(filter.ime.toLowerCase()) &&
          i.nazivPozicije
            .toLowerCase()
            .includes(filter.nazivPozicije.toLowerCase()) &&
          i.nazivPogona.toLowerCase().includes(filter.nazivPogona.toLowerCase())
        );
      });

      return list;
    });

    const rezultat = computed(() => {
      if (!filterZaposleni.value.length) {
        return "Nema rezultata pretrage";
      }
      return `Pronađeno: ${filterZaposleni.value.length}`;
    });

    const goToDetails = (id) => {
      router.push(`/zaposleni/${id}`);
    };

    watch(statusCode, (newVal, oldVal) => {
      if (newVal == 201) {
        formVidljiv.value = false;
        store.dispatch("actGetZaposleni");
      }
    });

    onMounted(async () => {
      await store.dispatch("actGetZaposleni");
    });
    return {
      filter,
      filterZaposleni,
      rezultat,
      formVidljiv,
      pokaziForm,
      sakrijForm,
      goToDetails,
    };
  },
};
</script>

<style scoped>
.filter {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  height: 80px;
}

.filter-element {
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
}

.filter-element:first-of-type {
  width: 150px;
}

.tabela {
  height: calc(100vh - 280px);
}

.tabela-container {
  width: 960px;
}

.rezultat {
  width: 960px;
  height: 20px;
  text-align: right;
  border-top: 1px solid var(--nis-plava);
  padding: 5px 0;
}

table {
  width: 960px;
}

td {
  width: 250px;
}

td button {
  background-color: var(--nis-crvena);
}

td:nth-of-type(1) {
  width: 150px;
}
</style>
