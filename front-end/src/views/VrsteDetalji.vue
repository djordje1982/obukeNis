<template>
  <div class="standard">
    <transition name="back" appear>
      <div class="backdrop" v-if="formVidljiv" @click.self="sakrijPromenu">
        <NovaVrsta
          :editMode="editMode"
          :id="id"
          :nazivObuke="nazivObuke"
          :obnova="obnova"
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
              <p>Da li želite da obrišete izabranu obuku?</p>
            </div>
          </div>
          <div class="back-element">
            <button class="warning" @click="obrisiVrstu">Da</button>
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
      <h1>Detalji obuke</h1>
    </div>
    <div class="main">
      <div class="detalji">
        <h2>{{ nazivObuke }}</h2>
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
import NovaVrsta from "@/components/vrsteobuka/NovaVrsta.vue";

export default {
  components: { Search, NovaVrsta },
  setup() {
    document.title = "Detalji obuke";
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const statusCode = computed(() => {
      return store.getters.getStatusCode;
    });

    const detalji = computed(() => {
      return store.getters.getVrstaDetalji;
    });

    const nazivObuke = computed(() => {
      if (!detalji.value.length) {
        return "";
      } else {
        return detalji.value[0].nazivObuke;
      }
    });

    const id = computed(() => {
      if (!detalji.value.length) {
        return "";
      } else {
        return detalji.value[0].id;
      }
    });

    const obnova = computed(() => {
      if (!detalji.value.length) {
        return "";
      } else {
        return detalji.value[0].obnova;
      }
    });

    const editMode = ref(true);

    const formVidljiv = ref(false);
    const pokaziPromenu = () => {
      if (!id.value) {
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
      if (!id.value) {
        return;
      }
      potvrdaBrisanjaVidljiva.value = true;
    };

    const obrisiVrstu = () => {
      store.dispatch("actObrisiVrstu", {
        id: route.params.id,
      });
    };

    watch(statusCode, (newVal, oldVal) => {
      if (newVal == 201) {
        store.dispatch("actGetVrstaDetalji", route.params.id);
        formVidljiv.value = false;
      }
      if (newVal == 202) {
        router.push("/vrste");
      }
    });

    onMounted(async () => {
      await store.dispatch("actGetVrstaDetalji", route.params.id);
    });

    return {
      detalji,
      nazivObuke,
      id,
      obnova,
      editMode,
      formVidljiv,
      sakrijPromenu,
      pokaziPromenu,
      potvrdaBrisanjaVidljiva,
      sakrijPotvrdu,
      pokaziPotvrdu,
      obrisiVrstu,
    };
  },
};
</script>

<style scoped>
.detalji {
  width: 100%;
  height: 40px;
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
</style>
