<template>
  <div class="standard">
    <div class="top-nav">
      <p class="naslov">Sektor za HR Bloka Promet</p>
      <h1>Promena lozinke</h1>
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
          <input
            type="password"
            placeholder="Nova lozinka"
            v-model="formData.lozinka"
          />
        </div>
        <div class="form-element">
          <label></label>
          <input
            type="password"
            placeholder="Ponovi lozinku"
            v-model="formData.ponovi"
          />
        </div>
        <button>Promeni</button>
      </form>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, reactive, computed, watch } from "vue";
export default {
  setup() {
    document.title = "Promena lozinke";
    const store = useStore();

    const formData = reactive({
      lozinka: "",
      ponovi: "",
      id: "",
    });

    const isntruktorId = computed(() => {
      return store.getters.getInstruktorId;
    });

    const sendData = () => {
      if (formData.lozinka.length < 8) {
        return store.commit("mutShowMessage", {
          statusCode: 400,
          message: "Lozinka mora imati minimum 8 karaktera",
        });
      }
      if (formData.lozinka != formData.ponovi) {
        return store.commit("mutShowMessage", {
          statusCode: 400,
          message: "Lozinke moraju biti iste",
        });
      }
      if (!isntruktorId.value) {
        return store.commit("mutShowMessage", {
          statusCode: 400,
          message: "Niste ulogovani",
        });
      }

      formData.id = isntruktorId.value;

      return store.dispatch("actPromenaLozinke", formData);
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
