<template>
    <div class="relative w-full h-full flex justify-center items-center">

        <FadeTransition name="fade-slow" mode="out-in" >
            <div v-if="!revealScore"  class="inline-flex w-full flex-col items-center justify-center grow">
                <span class="text-3xl font-[Handwritten] text-[#bebbb5] text-center font-semibold" >Round is over! Let's see how you did!</span>
            </div>
       
            <div v-else class="inline-flex w-full h-full flex-col items-center px-2 py-1 md:px-12 md:py-6">

                <div class="inline-flex w-full flex-col items-center justify-center grow">
                    <span class="text-sm md:text-3xl font-[Handwritten] text-[#bebbb5] text-center font-semibold" >Average Score</span>
                    <span class="text-md md:text-5xl font-[Handwritten] text-[#bebbb5] text-center font-bold mt-2 md:mt-8" >{{ avgScoreTweened.toFixed(0) }}%</span>
                </div>

                <div class="inline-flex w-full grow flex-row flex-wrap items-center justify-between gap-2 md:gap-12 ">
                    
                    <div v-for="player of playerScoreTweened" :key="player.name" class="inline-flex flex-col justify-center items-center gap-1 md:gap-4">
                        <span class="text-sm md:text-3xl font-[Handwritten] text-[#bebbb5] text-center font-semibold" >{{ player.score.toFixed(0) }}%</span>
                        <span class="text-sm md:text-3xl font-[Handwritten] text-[#bebbb5] text-center font-semibold" >{{ player.name }}</span>
                    </div>
                    
                </div>
            </div>
        </FadeTransition>
    </div>
</template>

<script setup>

import FadeTransition from './FadeTransition.vue';

import {useStore} from 'vuex';
const store = useStore();

import {ref} from 'vue';
const avgScoreTweened = ref(0);
const playerScoreTweened = ref({});

import {computed} from 'vue';
const avgScoreRef = computed(() => store.state.game.avgScore);
const playerScoreRef = computed(() => store.state.game.playerScore);

const revealScore = ref(false);

import gsap from 'gsap';

const revealScoreTimeout = setTimeout(() => {
    revealScore.value = true;

    const displayScoreTimeout = setTimeout(() => {
        gsap.to(avgScoreTweened, { duration: 5.0, value: Number(avgScoreRef.value) || 0 });
        
        for(let player of playerScoreRef.value.scores) {
            playerScoreTweened.value[player.Index] = {name: player.FirstDisplayName, score: player.ScorePercentage};
            gsap.to(playerScoreTweened.value[player.name], { duration: 5.0, score: Number(player.ScorePercentage) || 0 });
        }
    }, 1000);
}, 1500);

</script>
<style scoped lang="scss">


</style>