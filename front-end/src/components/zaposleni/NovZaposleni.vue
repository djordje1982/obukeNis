<template>
  <form @submit.prevent="sendData">
    <div class="form-element">
      <label>SAP broj</label>
      <input
        type="text"
        v-model="formData.id"
        :disabled="disabledSap"
        :class="{ disabled: disabledSap }"
      />
    </div>
    <div class="form-element">
      <label>Ime i prezime</label>
      <input type="text" v-model="formData.ime" />
    </div>
    <div class="form-element">
      <label>Skladište / Stovarište</label>
      <select v-model="pogonId" @change="promenaPogona">
        <option value=""></option>
        <option v-for="p in pogoniOsnovno" :key="p.id" :value="p.id">
          {{ p.nazivPogona }}
        </option>
      </select>
    </div>
    <div class="form-element">
      <label>Radno mesto</label>
      <select v-model="formData.pozicijaId">
        <option value=""></option>
        <option v-for="p in pozicije" :key="p.id" :value="p.id">
          {{ p.nazivPozicije }}
        </option>
      </select>
    </div>

    <button>Snimi</button>
  </form>
</template>

<script>
import { useStore } from "vuex";
import { ref, reactive, computed, watch, onMounted } from "vue";
export default {
  props: ["editMode", "id", "ime", "pogonId", "pozicijaId"],
  setup(props, context) {
    const store = useStore();

    const pogonId = ref("");

    const formData = reactive({
      id: "",
      ime: "",
      pozicijaId: "",
    });

    const disabledSap = ref(false);

    const pogoniOsnovno = computed(() => {
      return store.getters.getPogoniOsnovno;
    });

    const pozicijeOsnovno = computed(() => {
      return store.getters.getPozicijeOsnovno;
    });

    const pozicije = computed(() => {
      if (!pogonId) {
        return [];
      }

      const list = pozicijeOsnovno.value.filter((p) => {
        return p.pogonId == pogonId.value;
      });

      return list;
    });

    const promenaPogona = () => {
      formData.pozicijaId = "";
    };

    const sendData = () => {
      if (
        !formData.id ||
        (formData.id.length < 1) & (formData.id.length > 10)
      ) {
        return store.commit("mutShowMessage", {
          statusCode: 300,
          message: "Unesite ispravan SAP broj",
        });
      }
      if (!formData.ime || formData.ime.length < 5) {
        return store.commit("mutShowMessage", {
          statusCode: 300,
          message: "Unesite ispravno ime zaposlenog",
        });
      }
      if (!formData.pozicijaId) {
        return store.commit("mutShowMessage", {
          statusCode: 300,
          message: "Odaberite radno mesto",
        });
      }

      if (!props.editMode) {
        return store.dispatch("actDodajZaposlenog", formData);
      }
      return store.dispatch("actPromeniZaposlenog", formData);
    };

    onMounted(async () => {
      await Promise.all([
        store.dispatch("actGetPogoniOsnovno"),
        store.dispatch("actGetPozicijeOsnovno"),
      ]);
      if (props.editMode) {
        formData.id = props.id;
        formData.ime = props.ime;
        pogonId.value = props.pogonId;
        formData.pozicijaId = props.pozicijaId;
        disabledSap.value = true;
      }
    });

    return {
      formData,
      disabledSap,
      pogoniOsnovno,
      pogonId,
      pozicije,
      sendData,
      promenaPogona,
    };
  },
};
</script>

<style scoped>
form {
  width: 420px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 15px;
  padding: 30px;
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

.form-element:first-of-type {
  width: 150px;
}

form button {
  margin-top: 30px;
  align-self: center;
}

.disabled {
  color: grey;
}
</style>
