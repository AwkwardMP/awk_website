<template>
    <div class="inline-flex items-center justify-center px-12 py-6">
        <span class="w-full py-2 px-3 text-1xl md:text-3xl font-[Handwritten] text-[#bebbb5] text-center" >Get ready for round {{ round }}</span>
          
    </div>
</template>
<script setup>
import {useStore} from 'vuex';
const store = useStore();

import {computed} from 'vue';
const round = computed(() => store.state.game.round);

</script>
<style scoped lang="scss">


</style>