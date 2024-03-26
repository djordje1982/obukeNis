<template>
  <div class="svg">
    <svg
      x="0px"
      y="0px"
      viewBox="0 0 24 24"
      style="enable-background: new 0 0 24 24"
      xml:space="preserve"
    >
      <path
        d="M4,18v2h4v-2H4 M4,14v2h10v-2H4 M10,18v2h4v-2H10 M16,14v2h4v-2H16 M16,18v2h4v-2H16 M2,22V8l5,4V8l5,4V8l5,4l1-10h3l1,10
	v10H2z"
      />
    </svg>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, reactive, computed, watch } from "vue";
export default {
  setup() {
    const store = useStore();
    return {};
  },
};
</script>

<style scoped>
.svg {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

svg {
  fill: #fff;
}

a.router-link-exact-active svg {
  animation: exactSvg 1s forwards;
}

@keyframes exactSvg {
  from {
    fill: #fff;
  }
  to {
    fill: var(--nis-plava);
  }
}
</style>
