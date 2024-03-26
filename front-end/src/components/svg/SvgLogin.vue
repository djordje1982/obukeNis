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
        d="M18,1c-2.8,0-5,2.2-5,5v2H4c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10c0-1.1-0.9-2-2-2h-1V6
	c0-1.7,1.3-3,3-3s3,1.3,3,3v2h2V6C23,3.2,20.8,1,18,1 M10,13c1.1,0,2,0.9,2,2s-0.9,2-2,2c-1.1,0-2-0.9-2-2C8,13.9,8.9,13,10,13z"
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
