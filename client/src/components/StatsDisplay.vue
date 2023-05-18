<template>
    <div class="inline-flex w-full flex-col items-center gap-12 px-12 py-6">
        <span class="text-3xl font-[Handwritten] text-[#bebbb5] text-center" >Lets see how the World thinks!</span>

        <div class="relative w-full mt-8 flex flex-row gap-8 justify-center items-center">
            <div class="relative w-full flex flex-col justify-center items-center">
                <RadialProgress :diameter="150" :completed-steps="answer1PercentageRef" :total-steps="100" :animateSpeed="5000" :startColor="'#ffffff'" :stopColor="'#ffffff'" :innerStrokeWidth="10" :strokeWidth="16">
                    <p id="answer1Elem" class="text-bold">{{ answer1PercentageTweened.toFixed(0)  }}%</p>
                </RadialProgress>

                <p class="font-[Handwritten] text-[#bebbb5] text-center mt-4 py-2 px-4 ">{{ question.answerA }}</p>
            </div>
        
            <div class="relative w-full flex flex-col justify-center items-center">
                <RadialProgress :diameter="150" :completed-steps="answer2PercentageRef" :total-steps="100" :animateSpeed="5000" :startColor="'#ffffff'" :stopColor="'#ffffff'" :innerStrokeWidth="10" :strokeWidth="16">
                    <p id="answer2Elem" class="text-bold">{{ answer2PercentageTweened.toFixed(0) }}%</p>
                </RadialProgress>

                <p class="font-[Handwritten] text-[#bebbb5] text-center mt-4 py-2 px-4 ">{{ question.answerB }}</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import RadialProgress from "vue3-radial-progress";

import {ref, watch} from 'vue';
const answer1PercentageTweened = ref(0);
const answer2PercentageTweened = ref(0);

import {useStore} from 'vuex';
const store = useStore();

import {computed} from 'vue';
const question = computed(() => store.state.game.question);
const answerA = computed(() => store.state.game.questionStats.answerA);
const answerB = computed(() => store.state.game.questionStats.answerB);


import gsap from 'gsap';
watch([answerA, answerB], ([answer1Percentage, answer2Percentage], [prevAnswer1Percentage, prevAnswer2Percentage]) => {
    gsap.to(answer1PercentageTweened, { duration: 5.0, value: Number(answer1Percentage) || 0 });
    gsap.to(answer2PercentageTweened, { duration: 5.0, value: Number(answer2Percentage) || 0 });
});

</script>
<style scoped lang="scss">


</style>