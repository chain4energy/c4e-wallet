<template>
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup lang="ts">
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import {defineEmits} from "vue";
import {useI18n} from "vue-i18n";
const confirm = useConfirm();
const i18n = useI18n();

const emit = defineEmits(['accepted', 'rejected']);

defineExpose({confirmRequired});

function confirmRequired(data:any){
  confirm.require({
    message: i18n.t('MODAL.CONFIRMATION_MESSAGE_REMOVE_ELEMENT'),
    header: i18n.t('MODAL.CONFIRMATION_HEADER'),
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    acceptLabel: i18n.t('POPUPS.GENERAL.yes'),
    rejectLabel: i18n.t('POPUPS.GENERAL.no'),
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    accept: () => {
      //callback to execute when user confirms the action
      emit('accepted',  data);
    },
    reject: () => {
      //callback to execute when user rejects the action
      emit('rejected',  data);
    }
  });
}

</script>

<style scoped>

</style>
