<template>
    <div class="inline-flex w-full flex-col items-center justify-between gap-2 md:gap-12 px-2 py-1 md:px-12 md:py-6">
        <div class="inline-flex w-full flex-col items-center justify-center">
            <span class="text-sm md:text-3xl font-[Handwritten] text-[#bebbb5] text-center" >Lets see how the World thinks!</span>
        </div>
        <div class="inline-flex w-full flex-col items-center justify-center">
            <span class="text-lg md:text-5xl font-[Handwritten] text-[#bebbb5] text-center" >{{ question.title }}</span>
        </div>
        <div class="relative w-full mt-8 flex flex-row gap-2 md:gap-8 justify-center items-center">
            <div class="relative w-full flex flex-col justify-center items-center">
                <RadialProgress :diameter="detectMobile ? 75 : 150" :completed-steps="answer1Ref" :total-steps="100" :animateSpeed="5000" :startColor="'#ffffff'" :stopColor="'#ffffff'" :innerStrokeWidth="detectMobile ? 5 : 10" :strokeWidth="detectMobile ? 8 : 16">
                    <p id="answer1Elem" class="text-bold">{{ answer1PercentageTweened.toFixed(0)  }}%</p>
                </RadialProgress>

                <p class="font-[Handwritten] text-[#bebbb5] text-center mt-4 py-2 px-4 ">{{ question.answerA }}</p>
            </div>
        
            <div class="relative w-full flex flex-col justify-center items-center">
                <RadialProgress :diameter="detectMobile ? 75 : 150" :completed-steps="answer2Ref" :total-steps="100" :animateSpeed="5000" :startColor="'#ffffff'" :stopColor="'#ffffff'" :innerStrokeWidth="detectMobile ? 5 : 10" :strokeWidth="detectMobile ? 8 : 16">
                    <p id="answer2Elem" class="text-bold">{{ answer2PercentageTweened.toFixed(0) }}%</p>
                </RadialProgress>

                <p class="font-[Handwritten] text-[#bebbb5] text-center mt-4 py-2 px-4 ">{{ question.answerB }}</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { detectMobile } from "../utils/MobileDetection";
import RadialProgress from "vue3-radial-progress";

import {ref, watch} from 'vue';
const answer1Ref = ref(0);
const answer2Ref = ref(0);

const answer1PercentageTweened = ref(0);
const answer2PercentageTweened = ref(0);

import {useStore} from 'vuex';
const store = useStore();

import {computed} from 'vue';
const question = computed(() => store.state.game.question);
const answerA = computed(() => store.state.game.questionStats.answerA);
const answerB = computed(() => store.state.game.questionStats.answerB);


import gsap from 'gsap';
const animScore = setTimeout(() => {
    gsap.to(answer1PercentageTweened, { duration: 5.0, value: Number(answerA.value) || 0 });
    gsap.to(answer2PercentageTweened, { duration: 5.0, value: Number(answerB.value) || 0 });

    answer1Ref.value = answerA.value;
    answer2Ref.value = answerB.value;
}, 1000);

</script>
<style scoped lang="scss">


</style>