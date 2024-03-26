<template>
  <div class="standard">
    <transition name="back" appear>
      <div class="backdrop" v-if="novaVidljiva" @click.self="sakrijNovu">
        <NovaVrsta :editMode="editMode" />
      </div>
    </transition>
    <div class="top-nav">
      <div class="tabs">
        <button @click="pokaziNovu">Nova</button>
      </div>
      <h1>Vrste obuka</h1>
    </div>
    <div class="main">
      <div class="filter">
        <div class="filter-element">
          <label>Naziv obuke</label>
          <div class="input-search">
            <Search />
            <input type="text" v-model="filterNaziv" />
          </div>
        </div>
      </div>
      <div class="tabela">
        <div class="tabela-container">
          <table>
            <thead>
              <tr>
                <th>Naziv obuke</th>
                <th>Obnova</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="v in filterVrste"
                :key="v.id"
                @click="goToDetails(v.id)"
              >
                <td>{{ v.nazivObuke }}</td>
                <td>{{ v.obnova }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="rezultat">
        <p>{{ rezultat }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref, reactive, computed, watch, onMounted } from "vue";

import Search from "@/components/svg/Search.vue";
import NovaVrsta from "@/components/vrsteobuka/NovaVrsta.vue";
export default {
  components: {
    Search,
    NovaVrsta,
  },
  setup() {
    document.title = "Vrste obuka";
    const store = useStore();
    const router = useRouter();

    const filterNaziv = ref("");

    const editMode = ref(false);

    const statusCode = computed(() => {
      return store.getters.getStatusCode;
    });

    const vrste = computed(() => {
      return store.getters.getVrste;
    });

    const filterVrste = computed(() => {
      if (!vrste.value.length) {
        return [];
      }

      const list = vrste.value.filter((v) => {
        return v.nazivObuke
          .toLowerCase()
          .includes(filterNaziv.value.toLowerCase());
      });

      return list;
    });

    const rezultat = computed(() => {
      if (!filterVrste.value.length) {
        return "Nema rezultata pretrage";
      }
      return `Pronađeno: ${filterVrste.value.length}`;
    });

    const novaVidljiva = ref(false);

    const pokaziNovu = () => {
      novaVidljiva.value = true;
    };

    const sakrijNovu = () => {
      novaVidljiva.value = false;
    };

    const goToDetails = (id) => {
      router.push(`/vrste/${id}`);
    };

    watch(statusCode, (newVal, oldVal) => {
      if (newVal == 201) {
        novaVidljiva.value = false;
        store.dispatch("actGetVrste");
      }
    });

    onMounted(async () => {
      await store.dispatch("actGetVrste");
    });

    return {
      filterNaziv,
      novaVidljiva,
      pokaziNovu,
      sakrijNovu,
      filterVrste,
      rezultat,
      goToDetails,
      editMode,
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
  width: 750px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
}

.tabela {
  height: calc(100vh - 280px);
}

td:last-of-type {
  width: 100px;
  text-align: center;
}

.tabela-container {
  width: 860px;
}

.rezultat {
  width: 860px;
  height: 20px;
  text-align: right;
  border-top: 1px solid var(--nis-plava);
  padding: 5px 0;
}

table {
  width: 860px;
}
</style>
