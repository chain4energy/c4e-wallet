<template>

</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {useChargerStore} from "@/store/chargers.store";

const chargerStore = useChargerStore();


defineProps({
    cpId: {
      type: Object as () => string,
      required: true
    }
  }
);

onMounted(async () => {
  await chargerStore.fetch();
})
</script>

<style scoped lang="scss">

</style>
