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
        d="M16.8,4.4c2,2.2,2,5.2,0,7.3l-1.7-1.7c0.8-1.2,0.8-2.7,0-3.9L16.8,4.4 M20.1,1C24,5,24,11.1,20.1,15l-1.6-1.6
	c2.8-3.2,2.8-7.7,0-10.7L20.1,1 M9,4c2.2,0,4,1.8,4,4s-1.8,4-4,4s-4-1.8-4-4S6.8,4,9,4 M13,14.5c0,1.1-0.3,3.5-2.2,6.3L10,16
	l0.9-1.9C10.3,14,9.7,14,9,14S7.7,14,7.1,14.1L8,16l-0.8,4.8C5.3,18.1,5,15.6,5,14.5c-2.4,0.7-4,2-4,3.5v4h16v-4
	C17,16.5,15.4,15.2,13,14.5z"
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
