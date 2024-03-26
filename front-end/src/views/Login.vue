<template>
  <div class="standard">
    <div class="top-nav">
      <p class="naslov">Sektor za HR Bloka Promet</p>
      <h1>Login</h1>
    </div>
    <div class="main">
      <form @submit.prevent="sendData">
        <img src="~@/assets/img/logo.png" alt="" />
        <p>
          Služba za obuku i razvoj zaposlenih <br />
          Bloka Promet
        </p>
        <div class="form-element">
          <label></label>
          <input type="text" placeholder="SAP broj" v-model="formData.id" />
        </div>
        <div class="form-element">
          <label></label>
          <input
            type="password"
            placeholder="Lozinka"
            v-model="formData.lozinka"
          />
        </div>
        <button>Login</button>
      </form>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, reactive, computed, watch } from "vue";
export default {
  setup() {
    document.title = "Login";
    const store = useStore();

    const formData = reactive({
      id: "",
      lozinka: "",
    });

    const sendData = () => {
      if (!formData.id || formData.id.length > 10) {
        return store.commit("mutShowMessage", {
          statusCode: 300,
          message: "Unesite ispravan SAP broj",
        });
      }
      if (!formData.lozinka) {
        return store.commit("mutShowMessage", {
          statusCode: 300,
          message: "Unesite lozinku",
        });
      }

      return store.dispatch("actLogin", formData);
    };

    return { formData, sendData };
  },
};
</script>

<style scoped>
.top-nav p {
  font-size: 24px;
}

.main {
  justify-content: center;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  gap: 20px;
  border: 1px solid var(--nis-plava);
  border-radius: 4px;
  width: 360px;
  box-shadow: var(--shadow);
}

form p {
  text-align: center;
}

form button {
  width: 75px;
  margin-top: 30px;
}

.form-element {
  width: 250px;
}
</style>
