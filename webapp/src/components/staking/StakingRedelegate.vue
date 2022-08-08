<template>
  <BlockHidingDropdown v-model="redelegateTo" :hide-enabled="enableValidatorsHide" name="redelegateToValidator" input-id="redelegateToValidator" :options="filteredValidators" optionLabel="description.moniker" :placeholder="$t('STAKING_VIEW.STAKING_POPUP.INPUT.REDELEGATE_VALIDATOR')" :showClear="true"
          :filterFields="['description.moniker', 'rank']" 
          @update:modelValue="onValueChange"  :class="props.class" :disabled="disabled">
      <template #value="slotProps">
          <div v-if="slotProps.value">
            {{slotProps.value.rank}}
            <ValidatorLogo :validator="slotProps.value" class="validator-image-small"></ValidatorLogo>
            {{slotProps.value.description.moniker}}
          </div>
      </template>
      <template #option="slotProps">
          <div>
            {{slotProps.option.rank}}
            <ValidatorLogo :validator="slotProps.option" class="validator-image-small"></ValidatorLogo>
            {{slotProps.option.description.moniker}}
          </div>
      </template>
      <template #header>
        <div style="background-color: blue; padding: 10px">
          <div style="display: inline-block;">
            <span class="p-input-icon-left" >
              <i class="pi pi-search" />
              <InputText v-model="redelagateToFilter" type="text" placeholder="Search" />
            </span>
          </div>
          <div style="display: inline-block;">
            <Dropdown style="background-color: green; width: 200px !important;" @show="atShowChild" @hide="atHideChild" name="activityFilter" input-id="activityFilter" v-model="activityFilter" :options="activityFilterOptions" optionLabel="name" placeholder="Select type">
              <template #value="slotProps">
                <ValidatorsStatusLabel :status="slotProps.value.status"/>
              </template>
              <template #option="slotProps">
                  <ValidatorsStatusLabel :status="slotProps.option.status"/>
              </template>
            </Dropdown>
          </div>
        </div>
      </template>
  </BlockHidingDropdown>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import {useUserStore} from "@/store/user.store";
import { Validator, ValidatorBase, ValidatorStatus } from "@/models/store/validator";
import { useValidatorsStore } from "@/store/validators.store";
import ValidatorLogo from "../commons/ValidatorLogo.vue";
import BlockHidingDropdown from "../commons/BlockHidingDropdown.vue";
import ValidatorsStatusLabel, { ValidatorsStatusLabelType } from "../commons/ValidatorsStatusLabel.vue";

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  validator: {
    type: Validator,
    required: true
  },
  modelValue: Validator,
  class: String,
  field: Object

})

function onValueChange(e: any) {
  emit('update:modelValue', e)
}

const enableValidatorsHide = ref(true);

function atHideChild(e: any) {
  enableValidatorsHide.value = true;
}
function atShowChild(e: any) {
  enableValidatorsHide.value = false;
}

interface ActivityFilterData {
  types: ValidatorStatus[],
  status: ValidatorsStatusLabelType,
}

const activityFilterOptions: ActivityFilterData[] = [
  {types: [ValidatorStatus.Bonded, ValidatorStatus.Unbonded, ValidatorStatus.Unbonding, ValidatorStatus.Unspecified], status: 'all'},
  {types: [ValidatorStatus.Bonded], status: 'active'},
  {types: [ValidatorStatus.Unbonded, ValidatorStatus.Unbonding, ValidatorStatus.Unspecified], status: 'inactive'},
  ]

const activityFilter = ref<ActivityFilterData>(activityFilterOptions[0])

const redelagateToFilter = ref('');


const filteredValidators = computed<ValidatorBase[]>(() => {
  return filterForRedelegation((val: Validator) => {
    const activityTypeFilter = activityFilter.value.types.some((type) => {
      return type === val.status})
    if (!redelagateToFilter.value) {
      return activityTypeFilter;
    }
    const valToLowerCase = redelagateToFilter.value.toLowerCase();
    const searchFilter = String(val.rank).toLowerCase().includes(valToLowerCase) 
    || val.description.moniker.toLowerCase().includes(valToLowerCase);

    return searchFilter && activityTypeFilter;
  });
})
const redelegateTo = ref<Validator>()

function filterForRedelegation(filter?: (val: Validator) => boolean): ValidatorBase[]{
  const filtred = useValidatorsStore().getValidators.filter(
    element => {
        const condition = element.operatorAddress !== props.validator.operatorAddress;
        if (!filter) {
          return condition;
        } else {
          return condition && filter(element);
        }
      }
    )
    .map((val) => { // mapping to new object because of vee validate uses JSON.stringify that does not support bigint
        return {
        rank: val.rank,
        operatorAddress: val.operatorAddress,
        description: {
          moniker: val.description.moniker,
          pictureUrl: val.description.pictureUrl
        }
      }
      }
    );
  return filtred
}

</script>

<style scoped lang="scss">

.validator-image-small {
  height: 18px;
  width: 18px;
}

</style>
