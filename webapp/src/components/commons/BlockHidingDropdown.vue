<script lang="ts">
import Dropdown from 'primevue/dropdown';

export default {
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
      console.log('hide: '  + this.hideEnabled);
      if (this.hideEnabled) {
        (Dropdown as any).methods.hide.call(this, isFocus);
      }
      
    }
  }

}

</script>