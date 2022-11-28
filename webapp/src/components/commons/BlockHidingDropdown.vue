<script lang="ts">
import Dropdown from 'primevue/dropdown/Dropdown.vue';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'block-hiding-dropdown',
  extends: Dropdown,

  props: {
    hideEnabled: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    hide(isFocus:boolean) {
      if (this.hideEnabled) {
        (Dropdown as any).methods.hide.call(this, isFocus);
      }
    }
  }
});

</script>
