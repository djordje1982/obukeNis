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
        d="M12,15c-4.4,0-8,1.8-8,4v2h16v-2C20,16.8,16.4,15,12,15 M8,9c0,2.2,1.8,4,4,4s4-1.8,4-4 M11.5,2C11.2,2,11,2.2,11,2.5v3h-1
	V3c0,0-2.2,0.9-2.2,3.8C7.8,6.7,7,6.9,7,8h10c0-1.1-0.8-1.2-0.8-1.2C16.2,3.9,14,3,14,3v2.5h-1v-3C13,2.2,12.8,2,12.5,2H11.5z"
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
