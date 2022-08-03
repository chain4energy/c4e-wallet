<template>
  <div v-if="proposal" class="description">
    <h2>{{ $t("GOVERNANCE_VIEW.DESCRIPTION") }}</h2>
    <div> <span style="color: gray">{{ $t("GOVERNANCE_VIEW.AUTHOR") }}: </span>Jan Kowalski</div>
    <div><span style="color: gray;">{{ $t("GOVERNANCE_VIEW.CHANGED_PARAMETER") }}</span></div>
    <div style="margin-top: 20px;">
      {{ proposal.content.description }}
    </div>
  </div>
</template>

<script setup lang="ts">

import {Proposal} from "@/models/store/proposal";

const props = defineProps<{
  proposal?: Proposal
}>();

</script>

<style scoped lang="scss">
.description {
  text-align: left;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
  border-radius: 10px;
  padding: 20px;
}
</style>
