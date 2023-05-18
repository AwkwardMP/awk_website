<template>
  <div class="relative min-h-screen flex flex-col items-center overflow-x-hidden">
    
    <!-- Header -->
    <div class="relative header">
      <span>
        <h1 class="text-5xl sm:text-6xl md:text-6xl lg:text-8xl drop-shadow-xl">AwkwardMP</h1>
        <p class="text-xs sm:text-sm md:text-sm lg:text-sm px-4 py-2 drop-shadow-xl text-[#bebbb5]">A Multiplayer Mod for the most controversial game</p>
      </span>
    </div>
    <!-- Header -->

    <div class="inline-flex relative h-full w-full grow">
      <router-view  v-slot="{ Component }">
        <fade-transition mode="out-in">
          <component :is="Component" />
        </fade-transition>
      </router-view>
    </div>

      <!-- Footer -->
    <footer id="footer" class="relative w-[calc(100vw-12px)] mt-auto mb-2 inline-flex justify-center items-center p-2 text-[#bebbb5] outline-none shadow-lg shadow-gray-dark box-border border-2 border-[#9d9c8d4f] overflow-hidden z-10">
      <span class="text-center text-xs sm:text-sm md:text-sm lg:text-sm">*This mod is not affiliated with <a href="https://snapfingerclick.com/game-awkward.html" target="_blank" alt="Awkward">Awkward</a> or <a href="https://snapfingerclick.com" target="_blank" alt="Snap Finger Click Limited">Snap Finger Click Limited</a>, and the content contained therein is not endorsed or otherwise sponsored by <a href="https://snapfingerclick.com" target="_blank" alt="Snap Finger Click">Snap Finger Click Limited</a>. Portions of the materials contained herein are property of <a href="https://snapfingerclick.com" target="_blank" alt="Snap Finger Click">Snap Finger Click Limited</a>. <a href="https://snapfingerclick.com" target="_blank" alt="Snap Finger Click">© Snap Finger Click Limited</a>.​</span>
    </footer>
    <!-- /Footer -->

   
    <div class="clouds"></div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'

import FadeTransition from './components/FadeTransition.vue';


</script>

<style scoped lang="scss">
.header {
  opacity: 1 !important;
  text-align: center;

  span {
    color: #fff;

    font-family: 'KingThings_TypeWriter_2', Arial, sans-serif;
    font-weight: normal;
    font-style: normal;

    &::before {
      -webkit-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 0, 0, 0.1) inset;
      -moz-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 0, 0, 0.1) inset;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 0, 0, 0.1) inset;
    }
  }
}

#footer {
  font-family: 'Handwritten', cursive;
  font-size: 1.25rem;
  background: transparent;
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;

  a {
      text-decoration: underline;
  }
}

.clouds {
  width:10000px;
  height: 100%;
  background: transparent url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/clouds_repeat.png") repeat;
  background-size: 1000px 1000px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -10;

  -moz-animation:move-background 150s linear infinite;
  -ms-animation:move-background 150s linear infinite;
  -o-animation:move-background 150s linear infinite;
  -webkit-animation:move-background 150s linear infinite;
  animation:move-background 150s linear infinite;
}


@keyframes move-background {
  from {
    -webkit-transform: translate3d(0px, 0px, 0px);
  }
  to { 
    -webkit-transform: translate3d(1000px, 0px, 0px);
  }
}
@-webkit-keyframes move-background {
  from {
    -webkit-transform: translate3d(0px, 0px, 0px);
  }
  to { 
    -webkit-transform: translate3d(1000px, 0px, 0px);
  }
}

@-moz-keyframes move-background {    
  from {
    -webkit-transform: translate3d(0px, 0px, 0px);
  }
  to { 
    -webkit-transform: translate3d(1000px, 0px, 0px);
  }
}

@-webkit-keyframes move-background {
  from {
    -webkit-transform: translate3d(0px, 0px, 0px);
  }
  to { 
    -webkit-transform: translate3d(1000px, 0px, 0px);
  }
}
</style>
