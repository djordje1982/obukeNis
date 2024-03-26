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
        class="st0"
        d="M1,12h9.8L8.3,9.5l1.4-1.4l4.9,4.9l-4.9,4.9l-1.4-1.4l2.5-2.5H1V12 M21,2H3C1.9,2,1,2.9,1,4v6.1h2V6h18v14H3v-4
	H1v4c0,1.1,0.9,2,2,2h18c1.1,0,2-0.9,2-2V4C23,2.9,22.1,2,21,2"
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
