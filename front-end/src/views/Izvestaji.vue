<template>
  <h1>Izveštaji</h1>
</template>

<script>
import { useStore } from "vuex";
import { ref, reactive, computed, watch } from "vue";
export default {
  setup() {
    const store = useStore();
    document.title = "Izveštaji";
    return {};
  },
};
</script>

<style scoped></style>
