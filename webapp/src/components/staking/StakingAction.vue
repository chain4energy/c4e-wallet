<template>
  <Dropdown v-model="stakingAction" @change="onValueChange" :options="actions" optionLabel="name" placeholder="Select a action" :disabled="disabled">
    <template #value="slotProps">
        <div v-if="slotProps.value" >
          <StakeManagementIcon :icon="slotProps.value.icon" class="dropdown-option"/>
          {{slotProps.value.name}}
        </div>
    </template>
    <template #option="slotProps">
      <div>
        <StakeManagementIcon :icon="slotProps.option.icon" class="dropdown-option"/>
        {{slotProps.option.name}}
      </div>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { PropType, ref } from "vue";
import i18n from "@/plugins/i18n";
import StakeManagementIcon, { StakeManagementIconType }from "@/components/commons/StakeManagementIcon.vue";
import { DropdownChangeEvent } from "primevue/dropdown";
import { StakingAction } from "@/components/staking/StakingAction.ts";
import { getRedelagatePlaceholder, RedelegationDirection } from "@/components/staking/StakingRedelegate.ts";

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  modelValue: Number,
  redelegationDirection: {
    type: String as PropType<RedelegationDirection>,
    required: true
  }
});

function onValueChange(e: DropdownChangeEvent) {
  emit('update:modelValue', e.value.type);
}

interface ActionData {
  type: StakingAction,
  name: string,
  icon: StakeManagementIconType
}
const defualtAction: ActionData = {type: StakingAction.DELEGATE, name: i18n.global.t('STAKING_VIEW.STAKING_POPUP.DELEGATE'), icon: 'delegate'};
const actions: ActionData[] = [
  defualtAction,
  {type: StakingAction.UNDELEGATE, name: i18n.global.t('STAKING_VIEW.STAKING_POPUP.UNDELEGATE'), icon: 'undelegate'},
  {type: StakingAction.REDELEGATE, name: getRedelagatePlaceholder(props.redelegationDirection), icon: 'redelegate'},
  ];

const stakingAction = ref<ActionData | undefined>(actions.find((val) => {return val.type === props.modelValue;}));

</script>

<style scoped lang="scss">

.dropdown-option {
  float: left;
}
</style>
