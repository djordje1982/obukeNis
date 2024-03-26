<template>
  <h1>Zahtevi</h1>
</template>

<script>
import { useStore } from "vuex";
import { ref, reactive, computed, watch } from "vue";
export default {
  setup() {
    document.title = "Zahtevi";
    const store = useStore();
    return {};
  },
};
</script>

<style scoped></style>
