<template>
  <div>
    <form @submit.prevent="sendData">
      <div class="form-element">
        <label>Skladište / stovarište</label>
        <input
          type="text"
          disabled
          v-model="formData.nazivPogona"
          class="disabled"
        />
      </div>
      <div class="form-element">
        <label>Šifra pozicije</label>
        <input
          type="text"
          v-model="formData.id"
          :class="{ disabled: editMode }"
          :disabled="editMode"
        />
      </div>
      <div class="form-element">
        <label>Naziv pozicije</label>
        <input type="text" v-model="formData.nazivPozicije" />
      </div>
      <button>Snimi</button>
    </form>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, reactive, computed, watch, onMounted } from "vue";

export default {
  props: ["editMode", "pogonId", "nazivPogona", "nazivPozicije", "pozicijaId"],
  components: {},
  setup(props, context) {
    const store = useStore();

    const formData = reactive({
      id: "",
      nazivPozicije: "",
      pogonId: "",
      nazivPogona: "",
    });

    const sendData = () => {
      if (formData.id.length != 12) {
        return store.commit("mutShowMessage", {
          statusCode: 300,
          message: "Unesite ispravnu šifru pozicje (12 karaktera)",
        });
      }
      if (formData.nazivPozicije.trim() < 3) {
        return store.commit("mutShowMessage", {
          statusCode: 300,
          message: "Unesite ispravan naziv pozicije",
        });
      }

      store.dispatch("actDodajPoziciju", formData);
    };

    onMounted(async () => {
      formData.pogonId = props.pogonId;
      formData.nazivPogona = props.nazivPogona;

      if (props.editMode) {
        formData.id = props.pozicijaId;
        formData.nazivPozicije = props.nazivPozicije;
      }
    });

    return {
      formData,
      sendData,
    };
  },
};
</script>

<style scoped>
form {
  width: 520px;
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

.form-element:nth-of-type(2) {
  width: 130px;
}

form button {
  margin-top: 30px;
  align-self: center;
}

.input {
  text-align: center;
}

.disabled {
  color: grey;
}
</style>
