<template>
  <span v-if="menu.length > 0">

    <div @click="showSidebar" class="open-sidebar">
      <Icon name="SidebarOpen"/>
    </div>
    <nav class="sidebar display-none">
      <router-link :to="menuItem.href" v-for="(menuItem,index) of menu" :key="menuItem">
        <span class="sidebar-element">
          <span class="icon" :class="{ 'active': index === selected }">
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
import { computed, onMounted, ref } from "vue";
// import 'vue-sidebar-menu/dist/vue-sidebar-menu.css';
import Icon from "../features/IconComponent.vue";
import {PermissionsService} from "@/services/permissions/permissions.service";
import { useRoute, useRouter } from "vue-router";

const permissionsService = new PermissionsService();
const router = useRouter()
const menu = computed(() => {
  return permissionsService.createSideBar();
});


const selected = computed(()=> {
  let current = menu.value.find(element => element.href == router.currentRoute.value.path);
    return current?.id
})


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


</script>

<style scoped lang="scss">


</style>
