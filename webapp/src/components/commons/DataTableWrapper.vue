<template>

  <DataTable :value="getValues()"
             class="row-spacing"
             selectionMode="single"
             :showGridlines="false"
             :lazy="isLazyLoading()"
             :removable-sort="true"
             :totalRecords="getAmount()"
             :paginator="paginator" :rows="10" v-model:first="firstRecord"
             template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
             @page="pageEvent($event)"
             @sort="sortEvent($event)"
             sortMode="single"
             :globalFilterFields="getGlobalFilterFields()"
             :expandedRows="getExpandedRows()"
             :rowsPerPageOptions="[10,20,50]"
             :filters="getFilters()"

  >

    <template #header v-if="slotPassed('header')">
      <slot name="header"></slot>
    </template>

    <template #groupheader v-if="slotPassed('groupheader')">
      <slot name="groupheader"></slot>
    </template>

    <template #empty v-if="slotPassed('empty')">
      <slot name="empty"></slot>
    </template>

    <template #loading v-if="slotPassed('loading')">
      <slot name="loading"></slot>
    </template>

    <slot name="columns"></slot>

    <template v-if="slotPassed('expanded-columns')" #expansion="slotProps">
      <div class="expansion-container">
        <slot :expandedData="slotProps" name="expanded-columns"></slot>
      </div>
    </template>

    <template #paginatorstart v-if="slotPassed('paginatorstart') || slotPassed('paginatorstartCustom')">
      <slot v-if="slotPassed('paginatorstartCustom')" name="paginatorstartCustom"/>
      <Button v-if="slotPassed('paginatorstart')" type="button" icon="pi pi-refresh" class="p-button-text"
              @click="reload()"/>
    </template>

    <template #paginatorend v-if="slotPassed('paginatorend')">
      <slot name="paginatorend"></slot>
    </template>

    <template #footer v-if="slotPassed('footer')">
      <slot name="footer"></slot>
    </template>

    <template #groupfooter v-if="slotPassed('groupfooter')">
      <slot name="groupfooter"></slot>
    </template>

  </DataTable>
</template>

<script setup lang="ts">

import {ref, useSlots, watch} from "vue";
import {DataTableFilterMeta, DataTableFilterMetaData, DataTablePageEvent, DataTableSortEvent} from "primevue/datatable";
import {PagingModel} from "@/services/model/paging.model";
import {useGlobalFilterStore} from "@/store/global-filter.store";
import {LocalSpinner} from "@/services/model/localSpinner";
import {onBeforeMount} from "@vue/runtime-core";
import {DefaultSortingModel} from "@/services/model/defaultSorting.model";
import {EagerLoadingConfig} from "@/components/commons/EagerLoadingConfig";
import {LazyLoadingConfig} from "@/components/commons/LazyLoadingConfig";
import {DataTableService} from "@/services/data-table.service";

const globalFilter = useGlobalFilterStore();
const expandedRows = ref([]);
const firstRecord = ref(0);

let paging = new PagingModel(["login"]);
const slots = useSlots();

const props = defineProps({
  dataKey: {
    type: String,
    default: undefined
  },
  useExternalGlobalFilter: {
    type: Boolean,
    default: true
  },
  eagerLoadingConfig: {
    type: EagerLoadingConfig,
    default: undefined
  },
  lazyLoadingConfig: {
    type: LazyLoadingConfig,
    default: undefined
  },
  expandedRows:{
    type: Array
  },
  paginator: {
    type: Boolean,
    default: true
  },
});

function getExpandedRows(){
  if(props.expandedRows != undefined){
    return props.expandedRows;
  } else {
    return expandedRows.value;
  }
}

function slotPassed(slotName: string) {
  return slots[slotName];
}

function isLazyLoading(): boolean {
  return props.lazyLoadingConfig != undefined;
}

function getService(): DataTableService | undefined {
  return props.lazyLoadingConfig?.dataTableService;
}

function getValues(): any {
  if (isLazyLoading()) {
    return getService()?.getListDataHolder().elements;
  } else {
    return props.eagerLoadingConfig?.elements;
  }
}

function getAmount(): number | undefined {
  if (isLazyLoading()) {
    return getService()?.getListDataHolder().amount;
  } else {
    return undefined;
  }
}

function getGlobalFilterFields(): string[] | undefined {
  if (isLazyLoading()) {
    return props.lazyLoadingConfig?.globalFilterFields;
  } else {
    return undefined;
  }
}

function getFilters(): DataTableFilterMeta | undefined {
  return props.eagerLoadingConfig?.filters;
}

onBeforeMount(() => {
  if (isLazyLoading() == true) {
    paging = new PagingModel(props.lazyLoadingConfig?.globalFilterFields as string[]);
    if (getService()?.getDefaultSorting() !== undefined) {
      paging.setDefaultSorting(getService()?.getDefaultSorting() as DefaultSortingModel);
    }
    getService()?.fetchListData(paging, true, null);
  }
  if (props.useExternalGlobalFilter == true) {
    watch(() => globalFilter.getFilter, () => onFilterInput());
  }
});

function pageEvent(event: DataTablePageEvent) {
  if (isLazyLoading()) {
    console.log('onPage: ' + JSON.stringify(event, null, 2));
    getService()?.fetchListData(paging.fromDataTablePageEvent(event), true, null);
  }
}

function sortEvent(event: DataTableSortEvent) {
  console.log('onPage: ' + JSON.stringify(event, null, 2));
  if (isLazyLoading()) {
    getService()?.fetchListData(paging.fromDataTableSortEvent(event), true, null);
  }
}

const localSpinner: LocalSpinner = {
  turnOnFunction: () => {
    globalFilter.setIsLoading(true);
  },
  turnOffFunction: () => {
    globalFilter.setIsLoading(false);
  }
};

let timerId = 0;

function onFilterInput() {
  console.log('onFilterInput: ' + globalFilter.getFilter);
  if (isLazyLoading()) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      getService()?.fetchListData(paging.updateFilter(globalFilter.getFilter), false, localSpinner);
    }, 500);
  } else {
    if (props.eagerLoadingConfig?.filters != undefined) {
      const temp = props.eagerLoadingConfig?.filters['global'] as DataTableFilterMetaData;
      temp.value = globalFilter.getFilter;
    }
  }
}

function reload() {
  console.log('reload: ');
  paging.clearSorting();
  if (getService()?.fetchListData !== undefined) {
    getService()?.fetchListData(paging, true, null);
  }
}

</script>

<style scoped lang="scss">

</style>

<style lang="scss">
.p-datatable-row-expansion {
  background-color: var(--main-color) !important;
  color: var(--header-text-color) !important;
  overflow: hidden !important;
  border-radius: 10px;
}

.expansion-container {
  display: flex;
  flex-wrap: wrap;

  div{
    width: 100%;
    display: grid;
    span{
      width:100%;
      place-items: center;
      div{
        place-items: start;
      }
    }
  }
  .detail-row{
    padding: 10px 0;
    display: inline-flex;

    .detail-header{
      color: var(--secondary-color);
    }
    .detail-item{
      color: white;
    }
  }
  span {
    flex-grow: 1;
    width: 45%;
    padding: 5px;
    margin-left: 5px;
    margin-right: 5px;
    box-sizing: border-box;

    div {
      color: var(--secondary-color);
    }
  }

}

:root {
  --gray: #D3D3D3;
}

.p-datatable .p-datatable-tbody tr > td {
  border: solid 1px var(--gray);
  border-left: 0;
  border-right: 0;
}

.p-datatable .p-datatable-tbody > tr > td:first-child {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border: solid 1px var(--gray);
  border-right: 0;
}

.p-datatable .p-datatable-tbody > tr > td:last-child {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border: solid 1px var(--gray);
  border-left: 0;
}

.row-spacing table {
  border-collapse: separate;
  border-spacing: 0px 10px;
}

.status {
  padding: 5px 8px;
  border-radius: 7px;
}

.p-datatable .p-datatable-thead > tr > th {
  border-width: 0;
  color: gray;
  padding-bottom: 0px;
}

.p-datatable .p-sortable-column:not(.p-highlight):hover {
  background-color: transparent;
}

div.p-datatable-wrapper > table {
  border-collapse: separate;
}

.p-datatable-wrapper {
  overflow: initial !important;
}

.p-datatable .p-datatable-tbody > tr > td > .p-column-title {
  display: none;
}

@media screen and (max-width: 960px) {
  .p-datatable .p-datatable-thead > tr > th,
  .p-datatable .p-datatable-tfoot > tr > td {
    display: none !important;
  }

  .p-datatable .p-datatable-tbody > tr > td {
    display: flex;
    width: 100% !important;
    align-items: center;
    justify-content: space-between;
  }

  .p-datatable .p-datatable-tbody > tr > td:not(:last-child) {
    border: 0 none;
  }

  .p-datatable.p-datatable-gridlines .p-datatable-tbody > tr > td:last-child {
    border-top: 0;
    border-right: 0;
    border-left: 0;
  }

  .p-datatable .p-datatable-tbody > tr > td > .p-column-title {
    display: block;
  }
}
</style>
