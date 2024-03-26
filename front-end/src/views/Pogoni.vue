<template>
  <div class="standard">
    <transition name="back" appear>
      <div class="backdrop" v-if="formVidljiv" @click.self="sakrijForm">
        <NovPogon />
      </div>
    </transition>
    <div class="top-nav">
      <div class="tabs">
        <button @click="pokaziForm">Nov</button>
      </div>
      <h1>Pogoni</h1>
    </div>
    <div class="main">
      <div class="filter">
        <div class="filter-element">
          <label>Naziv pogona</label>
          <div class="input-search">
            <Search />
            <input type="text" v-model="filter.nazivPogona" />
          </div>
        </div>
        <div class="filter-element">
          <label>Mesto</label>
          <div class="input-search">
            <Search />
            <input type="text" v-model="filter.mesto" />
          </div>
        </div>
      </div>
      <div class="tabela-container">
        <div class="tabela">
          <table>
            <thead>
              <tr>
                <th>Šifra</th>
                <th>Naziv pogona</th>
                <th>Mesto</th>
                <th>Adresa</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="p in filterPogoni"
                :key="p.id"
                @click="goToDetails(p.id)"
              >
                <td>{{ p.id }}</td>
                <td>{{ p.nazivPogona }}</td>
                <td>{{ p.mesto }}</td>
                <td>{{ p.adresa }}</td>
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
import NovPogon from "@/components/pogoni/NovPogon.vue";
export default {
  components: {
    Search,
    NovPogon,
  },
  setup() {
    document.title = "Pogoni";
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
      nazivPogona: "",
      mesto: "",
    });

    const pogoni = computed(() => {
      return store.getters.getPogoni;
    });

    const filterPogoni = computed(() => {
      if (!pogoni.value.length) {
        return [];
      }
      const list = pogoni.value.filter((i) => {
        return (
          i.nazivPogona
            .toLowerCase()
            .includes(filter.nazivPogona.toLowerCase()) &&
          i.mesto.toLowerCase().includes(filter.mesto.toLowerCase())
        );
      });

      return list;
    });

    const rezultat = computed(() => {
      if (!filterPogoni.value.length) {
        return "Nema rezultata pretrage";
      }
      return `Pronađeno: ${filterPogoni.value.length}`;
    });

    const goToDetails = (id) => {
      router.push(`/pogoni/${id}`);
    };

    watch(statusCode, (newVal, oldVal) => {
      if (newVal == 201) {
        formVidljiv.value = false;
        store.dispatch("actGetPogoni");
      }
    });

    onMounted(async () => {
      await store.dispatch("actGetPogoni");
    });
    return {
      filter,
      filterPogoni,
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
