<template>
  <div class="instruktori-spisak">
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
          <tr v-for="i in filterInstruktori" :key="i.id" @click="promeni(i.id)">
            <td>{{ i.id }}</td>
            <td>{{ i.ime }}</td>
            <td>{{ i.radnoMesto }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Search from "@/components/svg/Search.vue";

import { useStore } from "vuex";
import { ref, reactive, computed, watch, onMounted } from "vue";
export default {
  components: {
    Search,
  },
  setup(props, context) {
    const store = useStore();

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

    const aktivanId = ref("");

    const aktivanInstruktor = computed(() => {
      if (!aktivanId.value) {
        return {};
      }
      const list = instruktori.value.filter((i) => {
        return i.id == aktivanId.value;
      });

      return list[0];
    });

    const promeni = (id) => {
      aktivanId.value = id;
      context.emit("promeni", {
        tab: 2,
        id: id,
        ime: aktivanInstruktor.ime,
        radnoMesto: aktivanInstruktor.radnoMesto,
      });
    };

    onMounted(async () => {
      await store.dispatch("actGetInstruktori");
    });

    return { filter, filterInstruktori, promeni };
  },
};
</script>

<style scoped>
.instruktori-spisak {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
}

.filter {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
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

table {
  width: 740px;
}

td {
  width: 310px;
}

td:nth-of-type(1) {
  width: 120px;
}
</style>
