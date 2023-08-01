<template>
  <div class="approvalModal">
    <div class="approvalModal__background" @click="closePopup"></div>
    <div class="approvalModal__holder">
      <div style="position: absolute; right: 0; top:0; margin-right: 20px">
        <Button icon="pi pi-times" style="width: 20px; right:0" @click="$emit('close')" class="p-button-rounded p-button-secondary p-button-text" />
      </div>
      <div ref="terms" class="approvalModal__rules">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Laoreet sit amet cursus sit amet dictum sit. Risus viverra adipiscing at in.
        Semper eget duis at tellus at. Id interdum velit laoreet id donec ultrices tincidunt. Habitant morbi tristique senectus et.
        Morbi non arcu risus quis varius quam quisque id diam. Lectus urna duis convallis convallis. Turpis nunc eget lorem dolor sed.
        Quisque sagittis purus sit amet volutpat consequat.

        Est sit amet facilisis magna etiam tempor orci eu lobortis.
        Amet justo donec enim diam vulputate ut pharetra.
        Enim nec dui nunc mattis enim ut. Ac placerat vestibulum lectus mauris ultrices eros in cursus.
        Tincidunt lobortis feugiat vivamus at augue eget arcu.
        Purus in mollis nunc sed. Felis imperdiet proin fermentum leo vel orci porta non pulvinar.
        Sed odio morbi quis commodo odio aenean sed adipiscing diam. Iaculis urna id volutpat lacus laoreet.
        Varius morbi enim nunc faucibus a pellentesque sit amet. Venenatis cras sed felis eget velit aliquet sagittis id.
        Sodales ut eu sem integer vitae justo eget magna.

        Dui faucibus in ornare quam viverra orci sagittis eu volutpat.
        Ac tortor dignissim convallis aenean et tortor at risus. Mi tempus imperdiet nulla malesuada.
        Egestas integer eget aliquet nibh praesent. Arcu non odio euismod lacinia at quis risus sed vulputate.
        Gravida in fermentum et sollicitudin ac. Ac turpis egestas maecenas pharetra convallis posuere.
        Tempor orci eu lobortis elementum nibh tellus molestie. Orci nulla pellentesque dignissim enim.
        Interdum consectetur libero id faucibus nisl tincidunt eget. At auctor urna nunc id cursus metus aliquam eleifend.
        In dictum non consectetur a erat nam at.

        Aliquet risus feugiat in ante metus dictum. Porttitor lacus luctus accumsan tortor posuere. Arcu non sodales neque sodales ut.
        Scelerisque eu ultrices vitae auctor eu augue ut. Amet justo donec enim diam. Viverra orci sagittis eu volutpat.
        Consequat interdum varius sit amet mattis vulputate enim. Scelerisque eleifend donec pretium vulputate sapien nec.
        Volutpat est velit egestas dui. Feugiat nisl pretium fusce id. Lobortis mattis aliquam faucibus purus in massa.
        Purus gravida quis blandit turpis cursus in. Augue lacus viverra vitae congue eu consequat. Sit amet cursus sit amet.
        Enim ut sem viverra aliquet eget. Eu lobortis elementum nibh tellus molestie nunc non.
        Nec dui nunc mattis enim ut tellus elementum.

        Aliquam malesuada bibendum arcu vitae elementum.
        Bibendum arcu vitae elementum curabitur vitae nunc sed velit dignissim. Egestas erat imperdiet sed euismod.
        In nisl nisi scelerisque eu ultrices vitae auctor eu. Amet est placerat in egestas erat imperdiet sed.
        Magnis dis parturient montes nascetur ridiculus mus mauris. Facilisis volutpat est velit egestas dui id ornare arcu.
        Egestas dui id ornare arcu. Orci porta non pulvinar neque laoreet suspendisse interdum.
        Amet volutpat consequat mauris nunc congue nisi vitae suscipit. Diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus.
        Convallis aenean et tortor at risus viverra. Elit at imperdiet dui accumsan sit amet nulla.
        Faucibus interdum posuere lorem ipsum dolor. Viverra orci sagittis eu volutpat. Elit scelerisque mauris pellentesque pulvinar
        pellentesque habitant morbi. Tincidunt dui ut ornare lectus. Tellus orci ac auctor augue mauris.
      </div>
      <div class="approvalModal__form">
        <div class="approvalModal__checkbox">
          <Field type="checkbox"
                 :disabled="!accepted.enabled"
                 @click="accepted.checkbox = !accepted.checkbox"
                 name="accept" v-model="accepted.checkbox"
                 :value="!accepted.checkbox"/>
          <label for="accept">I've read and consent the terms of agreement </label>
        </div>
        <div>
          <Button
            :disabled="!accepted.checkbox"
            class="p-button p-component secondary accountInfo__btn"
            @click="submit">Accept</Button>
          <Button
            class="p-button p-component secondary accountInfo__btn"
            @click="closePopup()">Decline</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, reactive, ref} from "vue";
import { useUserServiceStore } from "@/store/userService.store";
import { useToast } from "vue-toastification";
import {Field } from "vee-validate";

const toast = useToast();

const emit = defineEmits(['close', 'submit']);
const accepted = reactive({checkbox : false, enabled: false});
const terms = ref();


onMounted(()=>{
  terms.value.addEventListener('scroll', checkScrollBar );
});

function closePopup(){
  emit('close');
  terms.value.removeEventListener('scroll', checkScrollBar );
}
function checkScrollBar(){
  const clientHeight = terms.value.clientHeight;
  const scrollHeight = terms.value.scrollHeight;
  const scrollTop = terms.value.scrollTop;
  const res = (scrollTop / (scrollHeight - clientHeight)) * 100;
  const percents = res.toFixed(0);
  if (percents != 100) {
    return;
  }
  accepted.enabled = true;
}
document.body.style.overflow = "hidden";
onUnmounted(() => {
  document.body.style.overflow = "auto";
});
//TODO: check this metchod
function submit(){
  useUserServiceStore().approveTerms(onSuccessPairing, onFail, true).then((res)=>{
    terms.value.removeEventListener('scroll', checkScrollBar );
    emit('submit');
  });
}

function onSuccessPairing(){
  toast.success('Sale terms accepted');
}

function onFail(){
  toast.error('An error occured');
}
</script>

<style scoped lang="scss">
.approvalModal{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1009;
  width: 100%;
  height: 100vh;
  &__background {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: #0F3153;
    opacity: 0.85;
    z-index: -1;
  }

  &__holder {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    justify-content: space-between;
    width: 800px;
    background-color: #FFFFFF;
    padding: 46px 20px 30px 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.11);
    border-radius: 8px;
    opacity: 100%;
  }
  &__inputBlock{
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    input {
      margin-left: 10px;
    }
  }
  &__form{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    div{
      margin-top: 10px;
      align-items: center;
      justify-items: center;
    }
  }
  &__rules{
    max-height: 400px;
    overflow-y: auto;
    padding: 10px;
  }
  &__form{
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    margin-top: 15px;
  }
  &__checkbox{
    display: flex;
    flex-direction: row;
  }
}

</style>
