import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

import HomeView from "@/views/HomeView.vue";
import Instruktori from "@/views/Instruktori.vue";
import InstruktoriDetalji from "@/views/InstruktoriDetalji.vue";
import Izvestaji from "@/views/Izvestaji.vue";
import Login from "@/views/Login.vue";
import PromenaLozinke from "@/views/PromenaLozinke.vue";
import Obuke from "@/views/Obuke.vue";
import NovaObuka from "@/views/NovaObuka.vue";
import PromenaObuke from "@/views/PromenaObuke.vue";
import Pogoni from "@/views/Pogoni.vue";
import PogonDetalji from "@/views/PogonDetalji.vue";
import PozicijaDetalji from "@/views/PozicijaDetalji.vue";
import Vrste from "@/views/Vrste.vue";
import VrsteDetalji from "@/views/VrsteDetalji.vue";
import Zahtevi from "@/views/Zahtevi.vue";
import Zaposleni from "@/views/Zaposleni.vue";
import ZaposleniDetalji from "@/views/ZaposleniDetalji.vue";

const routes = [
  {
    path: "/",
    component: HomeView,
  },
  {
    path: "/instruktori",
    component: Instruktori,
    meta: {
      auth: true,
    },
  },
  {
    path: "/instruktori/:id",
    component: InstruktoriDetalji,
    meta: {
      auth: true,
    },
  },
  {
    path: "/izvestaji",
    component: Izvestaji,
    meta: {
      auth: true,
    },
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/promena-lozinke",
    component: PromenaLozinke,
  },
  {
    path: "/obuke",
    component: Obuke,
    meta: {
      auth: true,
    },
  },
  {
    path: "/obuke/:id",
    component: PromenaObuke,
    meta: {
      auth: true,
    },
  },
  {
    path: "/nova-obuka",
    component: NovaObuka,
    meta: {
      auth: true,
    },
  },
  {
    path: "/pogoni",
    component: Pogoni,
    meta: {
      auth: true,
    },
  },
  {
    path: "/pogoni/:id",
    component: PogonDetalji,
    meta: {
      auth: true,
    },
  },
  {
    path: "/pozicije/:id",
    component: PozicijaDetalji,
    meta: {
      auth: true,
    },
  },
  {
    path: "/vrste",
    component: Vrste,
    meta: {
      auth: true,
    },
  },
  {
    path: "/vrste/:id",
    component: VrsteDetalji,
    meta: {
      auth: true,
    },
  },
  {
    path: "/zahtevi",
    component: Zahtevi,
    meta: {
      auth: true,
    },
  },
  {
    path: "/zaposleni",
    component: Zaposleni,
    meta: {
      auth: true,
    },
  },
  {
    path: "/zaposleni/:id",
    component: ZaposleniDetalji,
    meta: {
      auth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = store.getters.getToken;
  if (to.meta.auth && !token) {
    store.commit("mutShowMessage", {
      statusCode: 401,
      message: "Niste ulogovani",
    });
    next({ path: "/login" });
  } else {
    next();
  }
});

export default router;
