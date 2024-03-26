<template>
  <div class="standard">
    <transition name="back" appear>
      <div class="backdrop" v-if="formVidljiv" @click.self="sakrijPromenu">
        <NovInstruktor
          :id="id"
          :ime="ime"
          :radnoMesto="radnoMesto"
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
              <p>Da li želite da obrišete instruktora</p>
              <p>
                <span>{{ ime }}</span
                >?
              </p>
            </div>
          </div>
          <div class="back-element">
            <button class="warning" @click="obrisiInstruktora">Da</button>
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
        <h2>{{ id }}</h2>
        <h2>{{ radnoMesto }}</h2>
      </div>
      <div class="filter">
        <div class="filter-element">
          <label>Period</label>
          <div class="input-search">
            <Search />
            <VueDatePicker
              v-model="filter.datum"
              range
              multi-calendars
              class="datum"
              locale="sr-Latn-RS"
              :format-locale="srLatn"
              format="dd.MM.yyyy"
              :enable-time-picker="false"
              cancelText="otkaži"
              selectText="odaberi"
            ></VueDatePicker>
          </div>
        </div>
        <div class="filter-element">
          <label>Naziv obuke</label>
          <div class="input-search">
            <Search />
            <input type="text" v-model="filter.nazivObuke" />
          </div>
        </div>
        <div class="filter-element">
          <label>Lokacija</label>
          <div class="input-search">
            <Search />
            <input type="text" v-model="filter.nazivPogona" />
          </div>
        </div>
      </div>
      <p>{{ zaglavlje }}</p>
      <div class="tabela">
        <table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Naziv obuke</th>
              <th>Lokacija</th>
              <th>Kandidata</th>
              <th>Obriši</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in filterObuke" :key="o.id">
              <td @click="goToDetails(o.id)">
                {{ format(new Date(o.datum), "dd.MM.yyyy HH:mm") }}
              </td>
              <td @click="goToDetails(o.id)">{{ o.nazivObuke }}</td>
              <td @click="goToDetails(o.id)">{{ o.nazivPogona }}</td>
              <td @click="goToDetails(o.id)">{{ o.kandidata }}</td>
              <td @click="pokaziPotvrdu(o.id)"><SvgDelete /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="zbir">{{ zbir }}</p>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { ref, reactive, computed, watch, onMounted } from "vue";

import Search from "@/components/svg/Search.vue";
import SvgDelete from "@/components/svg/SvgDelete.vue";
import NovInstruktor from "@/components/instruktori/NovInstruktor.vue";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { srLatn } from "date-fns/locale";
import { format } from "date-fns";

export default {
  components: { Search, NovInstruktor, VueDatePicker, SvgDelete },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const statusCode = computed(() => {
      return store.getters.getStatusCode;
    });

    const detalji = computed(() => {
      return store.getters.getInstruktorDetalji;
    });

    const obuke = computed(() => {
      return store.getters.getObuke;
    });

    const filter = reactive({
      datum: "",
      nazivObuke: "",
      nazivPogona: "",
    });

    const filterObuke = computed(() => {
      if (!obuke.value.length) {
        return [];
      }
      const list = obuke.value.filter((o) => {
        return o.instruktorId == route.params.id;
      });

      return list;
    });

    const ime = computed(() => {
      if (!detalji.value.length) {
        return "Nepostojeći instruktor";
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

    const editMode = ref(true);

    const radnoMesto = computed(() => {
      if (!detalji.value.length) {
        return "";
      } else {
        return detalji.value[0].radnoMesto;
      }
    });

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

    const obrisiInstruktora = () => {
      store.dispatch("actObrisiInstruktora", {
        id: route.params.id,
        ime: ime.value,
      });
    };

    const goToDetails = (id) => {
      router.push(`/obuke/${id}`);
    };

    const zaglavlje = ref("");

    const zbir = computed(() => {
      if (!filterObuke.value.length) {
        return "Nema rezultata pretrage";
      }

      return `Pronađeno: ${filterObuke.value.length}`;
    });

    watch(statusCode, (newVal, oldVal) => {
      if (newVal == 201) {
        store.dispatch("actGetInstruktorDetalji", route.params.id);
        formVidljiv.value = false;
      }
      if (newVal == 202) {
        router.push("/instruktori");
      }
    });

    onMounted(async () => {
      await store.dispatch("actGetInstruktorDetalji", route.params.id);
      await store.dispatch("actGetObuke");
      console.log(filterObuke.value);
      console.log(obuke.value);
      if (detalji.value.length) {
        document.title = detalji.value[0].ime;
      } else {
        document.title = "Nepostojeći instruktor";
        zaglavlje.value = `Spisak obuka za instruktora: ${ime.value}`;
      }
    });

    return {
      detalji,
      ime,
      id,
      radnoMesto,
      editMode,
      formVidljiv,
      sakrijPromenu,
      pokaziPromenu,
      potvrdaBrisanjaVidljiva,
      sakrijPotvrdu,
      pokaziPotvrdu,
      obrisiInstruktora,
      format,
      srLatn,
      filter,
      filterObuke,
      goToDetails,
      zaglavlje,
      zbir,
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

.filter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 900px;
  gap: 20px;
  height: 50px;
}

.filter-element:nth-of-type(1) {
  width: 35%;
}

.tabela {
  width: 900px;
  height: calc(100% - 230px);
  overflow-y: scroll;
}

table {
  width: 100%;
  font-size: 14px;
}

td:nth-of-type(1),
td:nth-of-type(4) {
  text-align: center;
}

td:nth-of-type(1) {
  width: 150px;
}
td:nth-of-type(2) {
  width: 300px;
}
td:nth-of-type(3) {
  width: 250px;
}
td:nth-of-type(4) {
  width: 100px;
}
td:nth-of-type(5) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
}

.zbir {
  width: 900px;
  text-align: right;
}
</style>
