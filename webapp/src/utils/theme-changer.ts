import { getCurrentInstance } from 'vue';

export function changeTheme () :void {
  const root = getCurrentInstance();
  console.log(JSON.stringify(root, null, 2));
  // root.appContext.config.globalProperties.$vuetify.theme.dark = true;
}
