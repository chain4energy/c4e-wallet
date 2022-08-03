<template>
  <span v-if="menu.length > 0">

    <div @click="showSidebar" class="open-sidebar">
      <Icon name="SidebarOpen"/>
    </div>
    <nav class="sidebar display-none">
      <router-link :to="menuItem.href" v-for="(menuItem,index) of menu" @click="changeSelected(index)" :key="index">
        <span class="sidebar-element">
          <span :class="menuItem.href === this.$route.path ? 'icon active' : 'icon'">
            <Icon :name="menuItem.icon.element"/>
          </span>
          <span class="title">{{ menuItem.title }}</span>
        </span>
      </router-link>
      <span @click="hideSidebar" class="hide-sidebar">
        <Icon name="SidebarClose"/>
      </span>
    </nav>
  </span>

</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Icon from "../features/IconComponent.vue";
import {PermissionsService} from "@/services/permissions/permissions.service";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const selected = ref(0);

const permissionsService = new PermissionsService();
const menu = computed(() =>{
  const temp = permissionsService.createSideBar();

  if(route.name != undefined) {
    const sidebarElement = temp.find(element => element.href == "/" + route.name?.toString());
    if(sidebarElement !== undefined) {
      // TODO: czy da się to zrobić inaczej
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      selected.value = temp.indexOf(sidebarElement);
    }else{
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      selected.value =-1;
    }
  }
  return temp;
});

function showSidebar() {
  let sidebar = document.getElementsByClassName('sidebar')[0] as HTMLElement;
  sidebar.classList.remove('display-none');
  sidebar.classList.add('display-flex');
  let showSidebar = document.getElementsByClassName('open-sidebar')[0] as HTMLElement;
  showSidebar.classList.remove('display-flex');
  showSidebar.classList.add('display-none');
}

function hideSidebar() {
  let sidebar = document.getElementsByClassName('sidebar')[0] as HTMLElement;
  sidebar.classList.remove('display-flex');
  sidebar.classList.add('display-none');
  let showSidebar = document.getElementsByClassName('open-sidebar')[0] as HTMLElement;
  showSidebar.classList.remove('display-none');
  showSidebar.classList.add('display-flex');
}

function changeSelected(index: number) {
  selected.value = index;
}

</script>

<style scoped lang="scss">


</style>
