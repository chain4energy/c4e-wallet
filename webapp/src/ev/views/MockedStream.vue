<template>
  <h1>Mocked stream</h1>
  <h2>Stock data: {{stockData}}</h2>

</template>


<script setup lang="ts">
import {ref} from "vue";

let stockData= ref("")
function setupStream() {
  let es = new EventSource('http://localhost:8080/progress/1');

  es.addEventListener('status_update', event => {
    let data = JSON.parse(event.data);
    stockData.value = data
  }, false);

  es.addEventListener('error', event => {
    console.log('Event was closed');
  }, false);
}
setupStream();
</script>

<style scoped lang="scss">

</style>
