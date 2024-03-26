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
        d="M12,2c5.5,0,10,4.5,10,10s-4.5,10-10,10S2,17.5,2,12S6.5,2,12,2 M12,10.5c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5
	s1.5-0.7,1.5-1.5S12.8,10.5,12,10.5 M6.5,10.5C5.7,10.5,5,11.2,5,12s0.7,1.5,1.5,1.5S8,12.8,8,12S7.3,10.5,6.5,10.5 M17.5,10.5
	c-0.8,0-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5S19,12.8,19,12S18.3,10.5,17.5,10.5z"
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
