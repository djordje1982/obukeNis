<template>
  <div>
    <div class="navig">
      <Navigation />
    </div>
    <main>
      <router-view v-slot="{ Component }">
        <transition name="base-app" mode="out-in" appear>
          <component :is="Component"></component>
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";

import { useStore } from "vuex";
import { useToast } from "vue-toastification";
import { ref, reactive, computed, watch } from "vue";
export default {
  components: {
    Navigation,
  },
  setup() {
    const store = useStore();

    const statusCode = computed(() => {
      return store.getters.getStatusCode;
    });
    const toast = useToast();
    const message = computed(() => {
      return store.getters.getMessage;
    });

    const minut = computed(() => {
      if (logOutTime.value < 60000) {
        return true;
      } else {
        return false;
      }
    });

    const toastOptions = {
      position: "bottom-right",
      timeout: 5000,
      closeOnClick: true,
      pauseOnFocusLoss: false,
      pauseOnHover: true,
      draggable: false,
      draggablePercent: 0.6,
      showCloseButtonOnHover: true,
      hideProgressBar: false,
      closeButton: false,
      icon: true,
      rtl: false,
    };

    const toastInfo = () => {
      toast.info(message.value, toastOptions);
    };

    const toastSuccess = () => {
      toast.success(message.value, toastOptions);
    };

    const toastWarning = () => {
      toast.warning(message.value, toastOptions);
    };

    const toastError = () => {
      toast.error(message.value, toastOptions);
    };

    watch(statusCode, (newVal, oldVal) => {
      if (newVal == 200 || newVal == 201) {
        toastSuccess();
      }
      if (newVal == 202 || newVal == 203 || newVal == 305) {
        toastInfo();
      }
      if (newVal == 400 || newVal == 401) {
        toastError();
      }
      if (newVal == 300) {
        toastWarning();
      }
    });
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--nis-plava);
}

.navig {
  position: fixed;
  top: 0;
  left: 0;
  width: 230px;
  height: 100vh;
}

main {
  width: 100%;
  height: 100%;
  padding: 20px 20px 20px 250px;
  background-image: linear-gradient(to right bottom, #fff, #c3c3ce);
}
</style>
