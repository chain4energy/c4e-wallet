declare module '*.vue' {
//   import Vue from 'vue';
//   export default Vue;

  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
