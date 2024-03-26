<template>
  <div class="standard">
    <transition name="back" appear>
      <div class="backdrop" v-if="novVidljiv" @click.self="sakrijNov">
        <NovInstruktor @sakrij="dodatNov" />
      </div>
    </transition>
    <div class="top-nav">
      <div class="tabs">
        <button @click="pokaziNov">Nov</button>
      </div>
      <h1>Instruktori</h1>
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
            <input type="text" v-model="filter.radnoMesto" />
          </div>
        </div>
      </div>
      <div class="tabela">
        <table>
          <thead>
            <tr>
              <th>SAP broj</th>
              <th>Ime i prezime</th>
              <th>Radno mesto</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="i in filterInstruktori"
              :key="i.id"
              @click="goToDetails(i.id)"
            >
              <td>{{ i.id }}</td>
              <td>{{ i.ime }}</td>
              <td>{{ i.radnoMesto }}</td>
            </tr>
          </tbody>
        </table>
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
import NovInstruktor from "@/components/instruktori/NovInstruktor.vue";

export default {
  components: { Search, NovInstruktor },
  setup() {
    document.title = "Instruktori";
    const store = useStore();
    const router = useRouter();

    const statusCode = computed(() => {
      return store.getters.getStatusCode;
    });

    const novVidljiv = ref(false);
    const pokaziNov = () => {
      novVidljiv.value = true;
    };
    const sakrijNov = () => {
      novVidljiv.value = false;
    };

    const dodatNov = () => {
      store.dispatch("actGetInstruktori");
      novVidljiv.value = false;
    };

    const filter = reactive({
      sap: "",
      ime: "",
      radnoMesto: "",
    });

    const instruktori = computed(() => {
      return store.getters.getInstruktori;
    });

    const filterInstruktori = computed(() => {
      if (!instruktori.value.length) {
        return [];
      }
      const list = instruktori.value.filter((i) => {
        return (
          i.id.toLowerCase().includes(filter.sap.toLowerCase()) &&
          i.ime.toLowerCase().includes(filter.ime.toLowerCase()) &&
          i.radnoMesto.toLowerCase().includes(filter.radnoMesto.toLowerCase())
        );
      });

      return list;
    });

    const rezultat = computed(() => {
      if (!filterInstruktori.value.length) {
        return "Nema rezultata pretrage";
      }
      return `Pronađeno: ${filterInstruktori.value.length}`;
    });

    const goToDetails = (id) => {
      router.push(`/instruktori/${id}`);
    };

    watch(statusCode, (newVal, oldVal) => {
      if (newVal == 201) {
        store.dispatch("actGetInstruktori");
        novVidljiv.value = false;
      }
    });

    onMounted(async () => {
      await store.dispatch("actGetInstruktori");
    });

    return {
      filter,
      filterInstruktori,
      novVidljiv,
      sakrijNov,
      pokaziNov,
      dodatNov,
      goToDetails,
      rezultat,
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
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
}

.filter-element:first-of-type {
  width: 100px;
}

.tabela {
  height: calc(100vh - 280px);
}

.rezultat {
  width: 960px;
  height: 20px;
  text-align: right;
  border-top: 1px solid var(--nis-plava);
  padding: 5px 0;
}

table {
  width: 740px;
}

td {
  width: 310px;
}

td button {
  background-color: var(--nis-crvena);
}

td:nth-of-type(1) {
  width: 120px;
}

.tab-nov {
  display: flex;
  align-items: center;
  justify-content: center;
}

form {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
  padding: 20px;
  box-shadow: var(--shadow);
  border-radius: 6px;
  background-color: #fff;
}

.form-element {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 5px;
  width: 100%;
}

form button {
  margin-top: 30px;
}
</style>
