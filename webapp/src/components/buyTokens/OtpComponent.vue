<template>
  <div ref="otpCont">
    <input
      type="text"
      class="digit-box"
      v-for="(el, ind) in digits"
      :key="el+ind"
      v-model="digits[ind]"
      :autofocus="ind === 0"
      :placeholder="ind+1"
      maxlength="1"
      @keydown="handleKeyDown($event, ind)"
      :class="{bounce: digits[ind] !== null}"
    >
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";

const props = defineProps({
  default: String,
  digitCount: {
    type: Number,
    required: true
  }
});

const digits = reactive<[string | null]>([null]);
if (props.default && props.default.length === props.digitCount) {
  for (let i =0; i < props.digitCount; i++) {
    digits[i] = props.default.charAt(i);
  }
} else {
  for (let i =0; i < props.digitCount; i++) {
    digits[i] = null;
  }
}
const otpCont = ref();
const emit = defineEmits(['update:otp']);
const isDigitsFull = function () {
  for (const elem of digits) {
    if (elem == null || elem == undefined) {
      return false;
    }
  }
  return true;
};
const handleKeyDown = function (event: any, index: number) {
  console.log(event.key);
  if (event.key !== "Tab" &&
    event.key !== "ArrowRight" &&
    event.key !== "ArrowLeft"
  ) {
    event.preventDefault();
  }

  if (event.key === "Backspace") {
    digits[index] = null;

    if (index != 0) {
      (otpCont.value.children)[index-1].focus();
    }
    return;
  }
  if ((new RegExp('^[a-zA-Z0-9]$')).test(event.key)) {
    digits[index] = event.key;
    if (index != props.digitCount - 1) {
      (otpCont.value.children)[index+1].focus();
    }
    if (isDigitsFull()) {
      emit('update:otp', digits.join(''))
    }
  }
};

</script>

<style scoped lang="scss">
.digit-box {
  height: 50px;
  width: 50px;
  border: 2px solid black;
  display: inline-block;
  border-radius: 5px;
  margin: 5px;
  padding: 15px;
  font-size: 1rem;
  text-align: center;
}
.digit-box:focus {
  outline: 3px solid black;
}
.bounce {
  animation: pulse .3s ease-in-out alternate;
}
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}
</style>
