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
      <label>Radno mesto</label>
      <input type="text" v-model="formData.radnoMesto" />
    </div>

    <button>Snimi</button>
  </form>
</template>

<script>
import { useStore } from "vuex";
import { ref, reactive, computed, watch, onMounted } from "vue";
export default {
  props: ["editMode", "id", "ime", "radnoMesto"],
  setup(props, context) {
    const store = useStore();

    const formData = reactive({
      id: "",
      ime: "",
      radnoMesto: "",
    });

    const disabledSap = ref(false);

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
          message: "Unesite ispravno ime instruktora",
        });
      }
      if (!formData.radnoMesto || formData.radnoMesto.length < 3) {
        return store.commit("mutShowMessage", {
          statusCode: 300,
          message: "Unesite ispravno radno mesto instruktora",
        });
      }

      if (!props.editMode) {
        return store.dispatch("actDodajInstruktora", formData);
      }
      return store.dispatch("actPromeniInstruktora", formData);
    };

    onMounted(() => {
      if (props.editMode) {
        formData.id = props.id;
        formData.ime = props.ime;
        formData.radnoMesto = props.radnoMesto;
        disabledSap.value = true;
      }
    });

    return { formData, sendData, disabledSap };
  },
};
</script>

<style scoped>
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

button {
  margin-top: 30px;
}

.disabled {
  color: grey;
}
</style>
