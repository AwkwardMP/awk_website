<template>
    <div class="inline-flex items-center justify-center px-2 py-1 md:px-12 md:py-6">
        <span class="w-full py-2 px-3 text-1xl md:text-3xl font-[Handwritten] text-[#bebbb5] text-center" >{{ turnMessage }}</span>  
    </div>
</template>
<script setup>

import {useStore} from 'vuex';
const store = useStore();

import {computed} from 'vue';
const chooserName = computed(() => store.state.game.chooser);
const guesserName = computed(() => store.state.game.guesser);
const isChoosing = computed(() => store.state.game.isChoosing);
const playerName = computed(() => store.state.game.userName);

const turnMessage = computed(() => {
    let turnMessages = {
        "YOU_ARE_GUESSING": "Guess what $ChoosingPlayer$ chose!",
        "YOU_ARE_CHOOSING": "It's your turn! Answer this question in secret!",
        "ANYONE_IS_GUESSING": "$GuessingPlayer$ is now guessing what $ChoosingPlayer$ chose.",
        "ANYONE_IS_CHOOSING": "It's $ChoosingPlayer$ turn! $ChoosingPlayer$ is now choosing an answer.",
    }

    if(isChoosing.value == true) {
        if(chooserName.value == playerName.value) {
            return turnMessages["YOU_ARE_CHOOSING"];
        } 

        return turnMessages["ANYONE_IS_CHOOSING"].replaceAll("$ChoosingPlayer$", chooserName.value);
    } else {
        if(guesserName.value == playerName.value) {
            return turnMessages["YOU_ARE_GUESSING"].replaceAll("$ChoosingPlayer$", chooserName.value)
        }

        if(chooserName.value == playerName.value) {
            return turnMessages["ANYONE_IS_GUESSING"].replaceAll("$GuessingPlayer$", guesserName.value).replaceAll("$ChoosingPlayer$", "You");
        }

        return turnMessages["ANYONE_IS_GUESSING"].replaceAll("$GuessingPlayer$", guesserName.value).replaceAll("$ChoosingPlayer$", chooserName.value);
    }
});
</script>
<style scoped lang="scss">


</style>