<template>

  <DataTable :value="service.getListDataHolder().elements"
             class="row-spacing"

             selectionMode="single"
             :showGridlines="false"
             :lazy="true"
             :totalRecords="service.getListDataHolder().amount"
             dataKey="id"
             :paginator="true" :rows="10" v-model:first="firstRecord"
             template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
             @page="pageEvent($event)"
             @sort="sortEvent($event)"
             sortMode="single"
             v-model:expandedRows="expandedRows"
             :rowsPerPageOptions="[10,20,50]"
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
      <slot v-if="slotPassed('paginatorstartCustom')" name="paginatorstartCustom"  />
      <Button v-if="slotPassed('paginatorstart')" type="button" icon="pi pi-refresh" class="p-button-text" @click="reload()"/>
    </template>

    <template #paginatorend v-if="slotPassed('paginatorend')" >
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

import {onMounted, PropType, ref, watch, useSlots} from "vue";
import {DataTablePageEvent, DataTableSortEvent} from "primevue/datatable";
import {DataTableService} from "@/services/data-table.service";
import {PagingModel} from "@/services/model/paging.model";
import {useGlobalFilterStore} from "@/store/global-filter.store";
import {LocalSpinner} from "@/services/model/localSpinner";

const globalFilter = useGlobalFilterStore();
const expandedRows = ref([]);
const firstRecord = ref(0);

//TODO: dlaczego ??? to musi być tu tworzone a nie w mount
let paging = new PagingModel(['']);
const slots = useSlots();

const props = defineProps({
  service: {
    type: Object as PropType<DataTableService<any>>,
    required: true
  },
  globalFilterFields: {
    type: Array
  }
})


function slotPassed(slotName: string) {
  return slots[slotName];
}

// function test() {
//   console.log(props.columns)
// }

onMounted(() => {
  paging = new PagingModel(props.globalFilterFields as string[]);
  props.service.fetchListData(paging, true, null);
});


function pageEvent (event: DataTablePageEvent) {
  console.log('onPage: ' + JSON.stringify(event, null, 2));
  props.service.fetchListData( paging.fromDataTablePageEvent( event), true, null);
}

function sortEvent (event: DataTableSortEvent) {
  console.log('onPage: ' + JSON.stringify(event, null, 2));
  props.service.fetchListData( paging.fromDataTableSortEvent( event), true, null);
}

const localSpinner: LocalSpinner = {
  turnOnFunction :  () => {globalFilter.setIsLoading(true);},
  turnOffFunction : () => {globalFilter.setIsLoading(false);}
};

let timerId = 0;

function onFilterInput() {
  console.log('onFilterInput: ' + globalFilter.getFilter);
  clearTimeout(timerId);
  timerId = setTimeout(() => {
    props.service.fetchListData(paging.updateFilter( globalFilter.getFilter), false, localSpinner);
  }, 500);
}

watch(()=>globalFilter.getFilter, () => onFilterInput());


function reload(){
  console.log('reload: ');
  props.service.fetchListData(paging, true, null);
}

</script>

<style scoped lang="scss">

</style>

<style lang="scss">
.expansion-container {
  display:flex;
  flex-wrap:wrap;

  span {
    flex-grow:1;
    width:33%;
    border-bottom: 1px solid gray;
    padding: 5px 0;
  }

}
:root {
  --gray: #D3D3D3;
}
.p-datatable .p-datatable-tbody tr > td{
  border: solid 1px var(--gray);
  border-left: 0 ;
  border-right: 0;
}
.p-datatable .p-datatable-tbody > tr > td:first-child{
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border: solid 1px var(--gray);
  border-right: 0;
}
.p-datatable .p-datatable-tbody > tr > td:last-child{
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
  background-color:transparent;
}
div.p-datatable-wrapper > table  {
  border-collapse: separate;
}
</style>
