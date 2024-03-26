<template>
  <div class="standard">
    <transition name="back" appear>
      <div
        class="backdrop"
        v-if="potvrdaBrisanjaVidljiva"
        @click.self="sakrijPotvrdu"
      >
        <div class="backdrop-container">
          <div class="back-element">
            <div class="pitanje">
              <p>Da li želite da obrišete odabranu obuku?</p>
            </div>
          </div>
          <div class="back-element">
            <button class="warning" @click="obrisiObuku">Da</button>
            <button @click="sakrijPotvrdu">Ne</button>
          </div>
        </div>
      </div>
    </transition>
    <div class="top-nav">
      <div class="tabs">
        <button @click="goToNova">Nova</button>
      </div>
      <h1>Obuke zaposlenih u Bloku Promet</h1>
    </div>
    <div class="main">
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
              @cleared="clearDate"
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
        <div class="filter-element">
          <label>Instruktor</label>
          <div class="input-search">
            <Search />
            <input type="text" v-model="filter.instruktorIme" />
          </div>
        </div>
      </div>
      <div class="tabela">
        <table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Naziv obuke</th>
              <th>Lokacija</th>
              <th>Instruktor</th>
              <th>Kandidata</th>
              <th>Lista<br />prisustva</th>
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
              <td @click="goToDetails(o.id)">{{ o.instruktorIme }}</td>
              <td @click="goToDetails(o.id)">{{ o.kandidata }}</td>
              <td @click="kreirajFakturu(o.id)"><SvgPrinter /></td>
              <td @click="pokaziPotvrdu(o.id)"><SvgDelete /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="zbir">
        <p>{{ zbir }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref, reactive, computed, watch, onMounted } from "vue";

import Search from "@/components/svg/Search.vue";
import SvgDelete from "@/components/svg/SvgDelete.vue";
import SvgPrinter from "@/components/svg/SvgPrinter.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { srLatn, tr } from "date-fns/locale";
import { format } from "date-fns";
import { number } from "@coders-tm/vue-number-format";

export default {
  components: { Search, number, VueDatePicker, SvgDelete, SvgPrinter },
  setup() {
    document.title = "Obuke";
    const store = useStore();
    const router = useRouter();

    const filter = reactive({
      datum: "",
      nazivObuke: "",
      nazivPogona: "",
      instruktorIme: "",
    });

    const clearDate = () => {
      filter.datum = "";
    };

    const potvrdaBrisanjaVidljiva = ref(false);

    const aktivanId = ref("");

    const pokaziPotvrdu = (id) => {
      potvrdaBrisanjaVidljiva.value = true;
      aktivanId.value = id;
    };

    const sakrijPotvrdu = () => {
      potvrdaBrisanjaVidljiva.value = false;
      aktivanId.value = "";
    };

    const obrisiObuku = () => {
      store.dispatch("actObrisiObuku", aktivanId.value);
    };

    const statusCode = computed(() => {
      return store.getters.getStatusCode;
    });

    const obuke = computed(() => {
      return store.getters.getObuke;
    });

    const filterObuke = computed(() => {
      if (!obuke.value.length) {
        return [];
      }
      const pocetniDatum = new Date(filter.datum[0]);
      pocetniDatum.setHours(0);
      pocetniDatum.setMinutes(0);

      const krajnjiDatum = new Date(filter.datum[1]);
      krajnjiDatum.setHours(23);
      krajnjiDatum.setMinutes(59);

      const list = obuke.value.filter((o) => {
        return (
          (filter.datum ? new Date(o.datum) >= pocetniDatum : true) &&
          (filter.datum ? new Date(o.datum) <= krajnjiDatum : true) &&
          o.nazivObuke
            .toLowerCase()
            .includes(filter.nazivObuke.toLowerCase()) &&
          o.nazivPogona
            .toLowerCase()
            .includes(filter.nazivPogona.toLowerCase()) &&
          o.instruktorIme
            .toLowerCase()
            .includes(filter.instruktorIme.toLowerCase())
        );
      });

      return list;
    });

    const zbir = computed(() => {
      if (!filterObuke.value.length) {
        return "Nema rezultata pretrage";
      }

      return `Pronađeno: ${filterObuke.value.length}`;
    });

    const goToNova = () => {
      router.push("/nova-obuka");
    };

    const goToDetails = (id) => {
      router.push(`/obuke/${id}`);
    };

    const kreirajFakturu = (id) => {
      store.dispatch("actListaPrisustva", id);
    };

    watch(statusCode, async (newVal, oldVal) => {
      if (newVal == 202) {
        await store.dispatch("actGetObuke");
        sakrijPotvrdu();
      }
      if (newVal == 400) {
        sakrijPotvrdu();
      }
    });

    onMounted(async () => {
      await store.dispatch("actGetObuke");
    });
    return {
      goToNova,
      goToDetails,
      filter,
      srLatn,
      format,
      filterObuke,
      potvrdaBrisanjaVidljiva,
      pokaziPotvrdu,
      sakrijPotvrdu,
      obrisiObuku,
      zbir,
      kreirajFakturu,
      clearDate,
    };
  },
};
</script>

<style scoped>
.filter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 960px;
  gap: 20px;
  height: 50px;
}

.filter-element:nth-of-type(1) {
  width: 30%;
}

.tabela {
  width: 960px;
  height: calc(100% - 170px);
  overflow-y: scroll;
}

table {
  width: 100%;
  font-size: 14px;
}

td:nth-of-type(1),
td:nth-of-type(5) {
  text-align: center;
}

td:nth-of-type(1) {
  width: 10%;
}
td:nth-of-type(2) {
  width: 30%;
}
td:nth-of-type(3) {
  width: 27%;
}
td:nth-of-type(4) {
  width: 27%;
}

td svg {
  width: 80%;
  margin: 0 auto;
}
.zbir {
  width: 960px;
}
</style>
