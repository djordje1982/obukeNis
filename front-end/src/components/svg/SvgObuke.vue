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
        d="M18,10c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S18.6,10,18,10 M12,10H6V5h6 M19.8,7.2L19.8,7.2l-3.7-3.7L15,4.6l2.1,2.1
	C16.2,7,15.5,7.9,15.5,9c0,1.4,1.1,2.5,2.5,2.5c0.4,0,0.7-0.1,1-0.2v7.2c0,0.6-0.4,1-1,1s-1-0.4-1-1V14c0-1.1-0.9-2-2-2h-1V5
	c0-1.1-0.9-2-2-2H6C4.9,3,4,3.9,4,5v16h10v-7.5h1.5v5c0,1.4,1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5V9C20.5,8.3,20.2,7.7,19.8,7.2z"
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
