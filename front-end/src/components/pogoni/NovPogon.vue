<template>
  <form @submit.prevent="submitData">
    <div class="form-element">
      <label>Šifra pogona</label>
      <input
        type="text"
        v-model="formData.id"
        :disabled="disabledSap"
        :class="{ disabled: disabledSap }"
      />
    </div>
    <div class="form-element">
      <label>Naziv pogona</label>
      <input type="text" v-model="formData.nazivPogona" />
    </div>
    <div class="form-element">
      <label>Mesto</label>
      <input type="text" v-model="formData.mesto" />
    </div>
    <div class="form-element">
      <label>Adresa</label>
      <input type="text" v-model="formData.adresa" />
    </div>

    <button>Snimi</button>
  </form>
</template>

<script>
import { useStore } from "vuex";
import { ref, reactive, computed, watch, onMounted } from "vue";
export default {
  props: ["editMode", "id", "nazivPogona", "mesto", "adresa"],
  setup(props, context) {
    const store = useStore();

    const formData = reactive({
      id: "",
      nazivPogona: "",
      mesto: "",
      adresa: "",
    });

    const disabledSap = ref(false);

    const submitData = () => {
      if (formData.id.length != 9) {
        return store.commit("mutShowMessage", {
          statusCode: 300,
          message: "Unesite ispravnu šifru pogona (9 karaktera)",
        });
      }
      if (!formData.nazivPogona || formData.nazivPogona.length < 5) {
        return store.commit("mutShowMessage", {
          statusCode: 300,
          message: "Unesite ispravan naziv pogona",
        });
      }
      if (!formData.mesto || formData.mesto.length < 3) {
        return store.commit("mutShowMessage", {
          statusCode: 300,
          message: "Unesite ispravno mesto pogona",
        });
      }

      if (!props.editMode) {
        return store.dispatch("actDodajPogon", formData);
      }
      return store.dispatch("actPromeniPogon", formData);
    };

    onMounted(() => {
      if (props.editMode) {
        formData.id = props.id;
        formData.nazivPogona = props.nazivPogona;
        formData.mesto = props.mesto;
        formData.adresa = props.adresa;
        disabledSap.value = true;
      }
    });

    return { formData, submitData, disabledSap };
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
