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
        d="M12.7,13.7c-0.5,0.5-1,0.8-1.7,1.1V23H8v-2H5v-3h3v-3.3c-1.7-0.6-3-2.3-3-4.2C5,8,7,6,9.5,6c0,0,0.1,0,0.1,0
	C9.1,6.9,8.9,8,9,9.1c-0.6,0.2-1,0.8-1,1.4C8,11.3,8.7,12,9.5,12c0.2,0,0.4-0.1,0.6-0.1C10.8,12.7,11.7,13.3,12.7,13.7 M20.7,19.4
	L18,20.6l-0.8-1.8l-2.8,1.2l-1.2-2.8L16,16l-1.3-3c-1.9,0.1-3.7-0.9-4.4-2.8c-1-2.3,0.1-4.9,2.4-5.9c0.2-0.1,0.5-0.2,0.7-0.2
	C12.8,2.9,11.5,2,10,2C7.8,2,6,3.8,6,6c0,0.1,0,0.2,0,0.2C5.7,6.5,5.4,6.8,5.2,7.1C5.1,6.8,5,6.4,5,6c0-2.8,2.2-5,5-5s5,2.2,5,5
	c0,1.4-0.6,2.7-1.6,3.6c0.4,0.4,1.1,0.6,1.6,0.3c0.8-0.3,1.1-1.2,0.8-2c0-0.1-0.1-0.2-0.1-0.3C15.9,7.1,16,6.6,16,6
	c0-0.6-0.1-1.2-0.3-1.8c1.3,0.4,2.4,1.2,2.9,2.6c0.8,1.8,0.2,3.8-1.1,5.1L20.7,19.4 M13,8.6c0.4-0.4,0.6-0.9,0.8-1.4
	C13.3,7.4,13,8,13,8.6z"
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
