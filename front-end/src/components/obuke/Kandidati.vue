<template>
  <div class="kandidati">
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
              @click="aktiviraj(z.id)"
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
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, reactive, computed, watch, onMounted } from "vue";

import { number } from "@coders-tm/vue-number-format";
import Search from "@/components/svg/Search.vue";

export default {
  components: {
    number,
    Search,
  },
  setup(props, context) {
    const store = useStore();

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

    const aktivanId = ref("");

    const odabrani = computed(() => {
      if (!aktivanId.value) {
        return "nema 1";
      }

      if (!filterZaposleni.value.length) {
        return "nema 2";
      }

      const list = zaposleni.value.filter((z) => {
        return z.id == aktivanId.value;
      });

      return list[0];
    });

    const aktiviraj = (id) => {
      aktivanId.value = id;
      context.emit("odaberi", odabrani.value);
    };

    onMounted(async () => {
      await store.dispatch("actGetZaposleni");
    });

    return { filter, filterZaposleni, aktiviraj };
  },
};
</script>

<style scoped>
.kandidati {
  background-color: #fff;
  padding: 20px;
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
