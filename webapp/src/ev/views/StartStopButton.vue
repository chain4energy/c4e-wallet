<template>
  <div id="wrapper">
    <div class="outer-black">
      <div class="outer-iron">
        <div class="glare"></div>
        <div class="inner-black">
          <div class="inner-black-2">
            <div class="inner-black-3">
              <button class="engine" @click="handleClick($event)">
                <div class="light"></div>
                <span>Start<br /></span>
                <span>Charging<br /></span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>


<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  buttonText: String,
  onClick: Function,
});

const handleClick = ($event: any) => {
  toggleActiveClass($event);
  updateRotation($event);
  if (props.onClick) {
    props.onClick();
  }
};

import { ref, onMounted, onUnmounted } from 'vue';

const rotation = ref(20);

const updateRotation = (e: { keyCode: number; }) => {
  const wrap = document.getElementById("wrapper");
  if (wrap == null) {
    return;
  }
  if(e.keyCode === 38){
    rotation.value += 5;
    wrap.style.transform = `rotateX(${rotation.value}deg) translateY(-110px)`;
  } else if(e.keyCode === 40){
    rotation.value -= 5;
    wrap.style.transform = `rotateX(${rotation.value}deg) translateY(-110px)`;
  }
};

const toggleActiveClass = (event: any) => {
  const btnClass = event.target.className;
  event.target.className = btnClass.match("active") ? "engine" : "engine active";
};
</script>


<style scoped lang="scss">
#wrapper{
  transform:rotateX(15deg) translateY(-110px);
  transform-style:preserve-3d;
  text-align: center;
  position:relative;
  display:flex;
  align-items:center;
  align-content:center;
  padding-top:100px;
  transition: transform 1s;
}
div.outer-black{
  background-color:rgba(2,2,2,.85);
  margin-top:200px;
  border-radius:50%;
  width:300px;
  height:300px;
  margin:0 auto;
  box-shadow:1px 2px 1px 0px rgba(160, 160, 160, 0.7), -1px -1px 1px rgba(85,85,85,0.7);
  transform-style:preserve-3d;
}
div.outer-iron{
  background: linear-gradient(135deg,  #4c4c4e 0%,#414141 34%,#6a6a6a 55%,#212121 100%);
  width:290px;
  height:290px;
  margin-left:5px;
  margin-top:5px;
  border-radius:50%;
  box-shadow: 1px 1px 4px rgba(138, 135, 135, 0.68) inset;
  overflow:hidden;
  position:relative;
  transform:translateZ(3px);
  transform-style:preserve-3d;
}
div.inner-black{
  width:260px;
  height:260px;
  background-color:#1e1e1e;
  position:absolute;
  top:15px;
  left:15px;
  border-radius:50%;
  box-shadow:3px 3px 1px 1px #505050 inset, 1px -1px 1px 1px #e6e6e6 inset;
}
div.inner-black-2{
  width:240px;
  height:240px;
  border-radius:50%;
  margin-left:10px;
  margin-top:10px;
  background-color:#101010;
  border:1px solid rgba(94,94,94,.7);
  box-shadow:-2px -2px 1px rgba(168,168,168,0.8) inset;
  transform:translateZ(5px);
}
div.inner-black-3{
  width:230px;
  height:230px;
  margin-top:5px;
  margin-left:5px;
  background-color:#252525;
  border-radius:50%;
  border:1px solid #1c1c1c;
  box-sizing:border-box;

  box-shadow:-2px 3px 1px #5f5f5f inset;
}
div.glare{
  width:220px;
  height:250px;
  border-radius:50%;
  background-color:#fff;
  margin-left:35px;
  transform:translateY(-50px);
  box-shadow:0 0 50px 37px #fff;
}
button.engine{
  -webkit-tap-highlight-color: transparent;
  background:#666;
  border-radius:50%;
  width:225px;
  height:225px;
  margin-left:2.5px;
  margin-top:2.5px;
  border:0;
  transition:all 0.1s;
  cursor:pointer;
  box-shadow:0 0 10px 3px #000 inset, 0 -50px 100px rgba(0,0,0,0.8) inset, 0 30px 60px rgba(0,0,0,0.8) inset;
  box-sizing:border-box;
}
button.engine:focus{
  outline:none;
}
button.engine:active{
  box-shadow:0 0 12px 5px #000 inset, 0 -60px 100px rgba(0,0,0,0.8) inset, 0 50px 60px rgba(0,0,0,0.8) inset;
  padding-top:13px;
  background-position-y:6.5px;
}
.light{
  width:35px;
  height:15px;
  margin:0 auto;
  background-color:#212121;
  margin-bottom:25px;
  border-radius:7px;
  border:1px solid #1b1b1b;
  transition:all 0.6s;
}
.engine.active .light{
  background-color:#f9ea1a;
  border:1px solid #923C14;
  box-shadow:0 0 11px 3px #C94A29 inset, 0 0 32px 6px #C77713, 0 0 100px #fff
}
button.engine span{
  font-family: sans-serif;
  text-transform:uppercase;
  font-weight:bold;
  font-size:30px;
  color:#212121;
  transition:all 0.6s;
}
button.engine.active span{
  color:#C5DEA1;
  text-shadow:0 0 15px #8CA579, 0 0 2px #fff;
}
button.engine span:first-of-type{
  font-size:20px;
}
</style>
