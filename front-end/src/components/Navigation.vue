<template>
  <div class="navigacija">
    <transition name="back" appear>
      <div class="backdrop" v-if="potvrdaVidljiva" @click.self="sakrijPotvrdu">
        <div class="backdrop-container">
          <div class="back-element">
            <div class="pitanje">
              <p>Da li želite da se izlogujete?</p>
            </div>
          </div>
          <div class="back-element">
            <button class="warning" @click="logOut">Da</button>
            <button @click="sakrijPotvrdu">Ne</button>
          </div>
        </div>
      </div>
    </transition>
    <div class="logo" @click="goToHome">
      <img src="~@/assets/img/logo.png" alt="" />
    </div>
    <nav>
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

      <router-link to="/pogoni">
        <SvgPogon />
        <p>Pogoni / Pozicije</p>
      </router-link>

      <router-link to="/zaposleni">
        <SvgZaposleni />
        <p>Zasposleni</p>
      </router-link>

      <router-link to="/instruktori">
        <SvgInstrukor />
        <p>Instruktori</p>
      </router-link>
    </nav>
    <div class="auth">
      <transition name="switch" appear mode="out-in">
        <div class="set" v-if="!token">
          <router-link to="/login">
            <SvgLogin />
            <p>Login</p>
          </router-link>
        </div>
        <div class="set" v-else>
          <p>
            <span>{{ instruktorIme }}</span>
          </p>
          <vue-countdown
            preserve
            :time="logOutTime"
            v-slot="{ minutes, seconds }"
            @end="logOut"
          >
            <p
              :class="{
                yellow: minutes < 10 && minutes >= 5,
                red: minutes < 5 && minutes >= 1,
                blink: minutes < 1,
              }"
            >
              Sesija：{{ minutes < 10 ? "0" + minutes : minutes }}:{{
                seconds < 10 ? "0" + seconds : seconds
              }}
            </p>
          </vue-countdown>
          <vue-countdown
            preserve
            :time="logOutTime1"
            v-slot="{ minutes, seconds }"
            @end="upozorenje1"
            v-show="nevidljivo"
          >
            <p>
              Sesija：{{ minutes < 10 ? "0" + minutes : minutes }}:{{
                seconds < 10 ? "0" + seconds : seconds
              }}
            </p>
          </vue-countdown>
          <vue-countdown
            preserve
            :time="logOutTime5"
            v-slot="{ minutes, seconds }"
            @end="upozorenje5"
            v-show="nevidljivo"
          >
            <p>
              Sesija：{{ minutes < 10 ? "0" + minutes : minutes }}:{{
                seconds < 10 ? "0" + seconds : seconds
              }}
            </p>
          </vue-countdown>
          <vue-countdown
            preserve
            :time="logOutTime10"
            v-slot="{ minutes, seconds }"
            @end="upozorenje10"
            v-show="nevidljivo"
          >
            <p>
              Sesija：{{ minutes < 10 ? "0" + minutes : minutes }}:{{
                seconds < 10 ? "0" + seconds : seconds
              }}
            </p>
          </vue-countdown>
          <hr />
          <router-link to="/promena-lozinke">
            <Promena />
            <p>Promena lozinke</p>
          </router-link>
          <div @click="pokaziPotvrdu">
            <SvgLogin />
            <p>LOGOUT</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref, reactive, computed, watch } from "vue";

import VueCountdown from "@chenfengyuan/vue-countdown";

import StrelicaDesno from "@/components/svg/StrelicaDesno.vue";
import SvgZaposleni from "@/components/svg/SvgZaposleni.vue";
import SvgInstrukor from "@/components/svg/SvgInstrukor.vue";
import SvgZahtevi from "@/components/svg/SvgZahtevi.vue";
import SvgVrste from "@/components/svg/SvgVrste.vue";
import SvgObuke from "@/components/svg/SvgObuke.vue";
import SvgPogon from "@/components/svg/SvgPogon.vue";
import SvgLogin from "@/components/svg/SvgLogin.vue";
import Promena from "@/components/svg/Promena.vue";
export default {
  components: {
    VueCountdown,
    StrelicaDesno,
    SvgZaposleni,
    SvgInstrukor,
    SvgZahtevi,
    SvgVrste,
    SvgObuke,
    SvgPogon,
    SvgLogin,
    Promena,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const token = computed(() => {
      return store.getters.getToken;
    });

    const instruktorIme = computed(() => {
      return store.getters.getInstruktorIme;
    });

    const potvrdaVidljiva = ref(false);

    const pokaziPotvrdu = () => {
      potvrdaVidljiva.value = true;
    };

    const sakrijPotvrdu = () => {
      potvrdaVidljiva.value = false;
    };

    const logOutTime = computed(() => {
      return store.getters.getLogoutTime - parseInt(Date.now());
    });

    const logOutTime10 = computed(() => {
      return store.getters.getLogoutTime - parseInt(Date.now()) - 600000;
    });

    const logOutTime5 = computed(() => {
      return store.getters.getLogoutTime - parseInt(Date.now()) - 300000;
    });

    const logOutTime1 = computed(() => {
      return store.getters.getLogoutTime - parseInt(Date.now()) - 60000;
    });

    const upozorenje10 = () => {
      store.commit("mutShowMessage", {
        statusCode: 400,
        message: "Sesija Vam ističe za 10 minuta",
      });
    };

    const upozorenje5 = () => {
      store.commit("mutShowMessage", {
        statusCode: 400,
        message: "Sesija Vam ističe za 5 minuta",
      });
    };

    const upozorenje1 = () => {
      return store.commit("mutShowMessage", {
        statusCode: 400,
        message: "Sesija Vam ističe za 1 minut",
      });
    };

    const nevidljivo = false;

    const logOut = () => {
      potvrdaVidljiva.value = false;
      router.push("/");
      return store.commit("mutLogout");
    };

    const goToHome = () => {
      router.push("/");
    };

    return {
      goToHome,
      token,
      logOut,
      logOutTime,
      logOutTime1,
      logOutTime5,
      logOutTime10,
      instruktorIme,
      potvrdaVidljiva,
      pokaziPotvrdu,
      sakrijPotvrdu,
      upozorenje1,
      upozorenje5,
      upozorenje10,
      nevidljivo,
    };
  },
};
</script>

<style scoped>
.navigacija {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: var(--nis-plava);
  padding: 100px 0 20px 0;
  overflow: hidden;
}

.logo {
  width: 230px;
  height: 80px;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  margin-bottom: 20px;
  cursor: pointer;
}

nav,
.auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  width: 100%;
  padding-left: 15px;
}

.link {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}

a {
  color: #fff;
  text-transform: uppercase;
  width: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 4px 0px 4px 10px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

a.router-link-active {
  animation: exact 1s forwards;
}

a.router-link-active svg {
  animation: exactSvg 1s forwards;
}

.set {
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
}

.set > div > p {
  color: #fff;
}

span {
  display: block;
  color: #fff;
  margin-left: 15px;
  width: 100%;
}

.set > div {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 4px 0px 4px 10px;
}

@keyframes exact {
  from {
    background-color: var(--nis-plava);
    letter-spacing: 0;
    color: #fff;
  }
  to {
    background-color: #fff;
    letter-spacing: 1;
    color: var(--nis-plava);
  }
}

hr {
  width: 100%;
  color: #fff;
}

.red {
  color: var(--nis-crvena);
}
.yellow {
  color: yellow;
}

.blink {
  color: red;
  animation: blinking 1s ease infinite;
}

@keyframes blinking {
  from {
    color: red;
  }
  to {
    color: yellow;
  }
}
</style>
