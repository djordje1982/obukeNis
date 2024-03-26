<template>
  <div>
    <form @submit.prevent="sendData">
      <div class="form-element">
        <label>Naziv obuke</label>
        <input type="text" v-model="formData.nazivObuke" />
      </div>
      <div class="form-element">
        <label>Obnova</label>
        <number
          v-model="formData.obnova"
          v-bind="numFormat"
          class="input"
        ></number>
      </div>
      <button>Snimi</button>
    </form>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, reactive, computed, watch, onMounted } from "vue";

import { number } from "@coders-tm/vue-number-format";
export default {
  props: ["editMode", "id", "nazivObuke", "obnova"],
  components: {
    number,
  },
  setup(props, context) {
    const store = useStore();

    const numFormat = reactive({
      decimal: ",",
      separator: ".",
      prefix: "",
      suffix: "",
      precision: 0,
      nullValue: "",
      masked: false,
      reverseFill: false,
      minimumFractionDigits: 0,
    });

    const formData = reactive({
      id: "",
      nazivObuke: "",
      obnova: "",
    });

    const sendData = () => {
      if (!formData.nazivObuke.trim()) {
        return store.commit("mutShowMessage", {
          statusCode: 300,
          message: "Unesite ispravan naziv obuke",
        });
      }
      if (!formData.obnova) {
        return store.commit("mutShowMessage", {
          statusCode: 300,
          message: "Unesite ispravan period obnove obuke",
        });
      }

      if (!props.editMode) {
        return store.dispatch("actDodajVrstu", formData);
      }

      store.dispatch("actPromeniVrstu", formData);
    };

    onMounted(async () => {
      if (props.editMode) {
        formData.id = props.id;
        formData.nazivObuke = props.nazivObuke;
        formData.obnova = props.obnova;
      }
    });

    return {
      formData,
      sendData,
      numFormat,
    };
  },
};
</script>

<style scoped>
form {
  width: 720px;
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

.form-element:last-of-type {
  width: 75px;
}

form button {
  margin-top: 30px;
  align-self: center;
}

.input {
  text-align: center;
}
</style>
