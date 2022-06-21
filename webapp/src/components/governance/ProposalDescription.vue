<template>
  <div class="description">
    <h2>{{ $t("GOVERNANCE_VIEW.DESCRIPTION") }}</h2>
    <div>{{ $t("GOVERNANCE_VIEW.AUTHOR") }}: </div>
    <div>Jan Kowalski</div>
    <div>{{ $t("GOVERNANCE_VIEW.CHANGED_PARAMETER") }}</div>
    <div>
      {{ proposal.content.description }}
    </div>
  </div>
</template>

<script setup lang="ts">

import {Proposal} from "@/models/Proposal";

const props = defineProps({
  proposal: {
    type: Object(Proposal),
    required: true
  }
});

</script>

<style scoped lang="scss">
.description {
  text-align: left;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
  max-width: 700px;
  border-radius: 10px;
}
</style>
