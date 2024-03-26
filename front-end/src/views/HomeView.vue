<template>
  <div class="standard">
    <div class="top-nav">
      <p class="naslov">Služba za obuku i razvoj zaposlenih Bloka Promet</p>
      <h1 v-if="token">{{ instruktorIme }}</h1>
      <h1 v-else>Sektor za HR Bloka Promet</h1>
    </div>
    <div class="main">
      <div class="red" v-if="token">
        <router-link to="/obuke">
          <SvgObuke />
          <p>Obuke</p>
        </router-link>
        <router-link to="/izvestaji">
          <StrelicaDesno />
          <p>Izveštaji</p>
        </router-link>
        <router-link to="/vrste">
          <SvgVrste />
          <p>Vrste obuka</p>
        </router-link>
      </div>
      <div class="red" v-if="token">
        <router-link to="/pogoni">
          <SvgPogon />
          <p>Pogoni / Pozicije</p>
        </router-link>
        <router-link to="/zaposleni">
          <SvgZaposleni />
          <p>Zaposleni</p>
        </router-link>
        <router-link to="/instruktori">
          <SvgInstrukor />
          <p>Instruktori</p>
        </router-link>
      </div>
      <div class="notSigned" v-if="!token">
        <p>
          Niste ulogovani. <br />
          Molimo Vas ulogujte se
        </p>
        <button @click="goToLogin">Login</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref, reactive, computed, watch } from "vue";

import StrelicaDesno from "@/components/svg/StrelicaDesno.vue";
import SvgZaposleni from "@/components/svg/SvgZaposleni.vue";
import SvgInstrukor from "@/components/svg/SvgInstrukor.vue";
import SvgZahtevi from "@/components/svg/SvgZahtevi.vue";
import SvgVrste from "@/components/svg/SvgVrste.vue";
import SvgObuke from "@/components/svg/SvgObuke.vue";
import SvgPogon from "@/components/svg/SvgPogon.vue";
import SvgLogin from "@/components/svg/SvgLogin.vue";
export default {
  components: {
    StrelicaDesno,
    SvgZaposleni,
    SvgInstrukor,
    SvgZahtevi,
    SvgVrste,
    SvgObuke,
    SvgPogon,
    SvgLogin,
  },
  setup() {
    document.title = "Obuke zaposlenih";
    const store = useStore();
    const router = useRouter();

    const instruktorIme = computed(() => {
      return store.getters.getInstruktorIme;
    });

    const token = computed(() => {
      return store.getters.getToken;
    });

    const goToLogin = () => {
      router.push("/login");
    };

    return { instruktorIme, token, goToLogin };
  },
};
</script>

<style scoped>
.top-nav p {
  font-size: 20px;
}
.main {
  gap: 100px;
  padding-top: 150px;
}

.red {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
}

.main a {
  width: 120px;
  height: 100%;
  border-radius: 4px;
  box-shadow: var(--shadow);
  background-color: var(--nis-plava);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  transition: all 0.3s ease;
}

.main a:hover {
  background-color: var(--nis-svetlo-plava);
  transform: translateY(-2px);
  box-shadow: 3px 5px 9px rgba(36, 73, 153, 0.5);
}

.main p {
  text-align: center;
}

.notSigned {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.notSigned p {
  font-size: 20px;
}

.notSigned button {
  width: 75px;
}
</style>
