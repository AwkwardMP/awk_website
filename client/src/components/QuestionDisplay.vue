<template>
    <div class="inline-flex w-full flex-col items-center justify-between px-12 py-6">
        <span class="text-3xl font-[Handwritten] text-[#bebbb5] text-center" >{{ turnMessage }}</span>
        <span class="text-5xl font-[Handwritten] text-[#bebbb5] text-center" >{{ question.title }}</span>


        <div class="inline-flex w-full flex-row justify-between gap-8 mb-4">
            <button :disabled="!canAnswer" @click="SendAnswer(1)" :class="canAnswer ? 'hover:-translate-y-1 hover:border-[#9d9c8d6f] active:border-[#9d9c8d1f] active:translate-y-0' : ''" class="relative w-full h-24 my-4 mx-4 font-semibold text-2xl rounded-md border-paper box-border border-2 border-[#9d9c8d4f] shadow-lg">
                {{ question.answerA }}

                <transition name="fadeSlow" mode="out-in">
                    <div v-if="showAnswer && choosenAnswerId == 1" class="absolute font-semibold text-xs left-8 px-4 pt-1 h-10 stamp is-correct flex justify-center items-center opacity-80"> 
                        {{ chooserName  }} 
                    </div>
                </transition>

                <transition name="fadeSlow" mode="out-in">
                    <div v-if="showAnswer && guessedAnswerId == 1" :class="sameGuess ? 'is-correct' : 'is-wrong'" class="absolute font-semibold text-xs right-8 px-4 pt-1 h-10 stamp flex justify-center items-center opacity-80"> 
                        {{ guesserName  }} 
                    </div>
                </transition>
            </button>
            <button :disabled="!canAnswer" @click="SendAnswer(2)" :class="canAnswer ? 'hover:-translate-y-1 hover:border-[#9d9c8d6f] active:border-[#9d9c8d1f] active:translate-y-0' : ''" class="relative w-full h-24 my-4 mx-4 font-semibold text-2xl rounded-md border-paper box-border border-2 border-[#9d9c8d4f]  shadow-lg">
                {{ question.answerB }}
                
                <transition name="fadeSlow" mode="out-in">
                    <div v-if="showAnswer && choosenAnswerId == 2" class="absolute font-semibold text-xs left-8 px-4 pt-1 h-10 stamp is-correct flex justify-center items-center opacity-80"> 
                        {{ chooserName  }} 
                    </div>
                </transition>

                <transition name="fadeSlow" mode="out-in">
                    <div v-if="showAnswer && guessedAnswerId == 2" :class="sameGuess ? 'is-correct' : 'is-wrong'" class="absolute font-semibold text-xs px-4 pt-1 right-8 h-10 stamp flex justify-center items-center opacity-80"> 
                        {{ guesserName  }} 
                    </div>
                </transition>
            </button>
        </div>


    </div>
</template>
<script setup>
import {useStore} from 'vuex';
const store = useStore();

import {computed} from 'vue';
const roomCode = computed(() => store.state.game.roomCode);
const showAnswer = computed(() => store.state.game.showAnswer);
const choosenAnswerId = computed(() => store.state.game.choserAnswer);
const guessedAnswerId = computed(() => store.state.game.guesserAnswer);
const sameGuess = computed(() => store.state.game.sameGuess);

const chooserName = computed(() => store.state.game.chooser);
const guesserName = computed(() => store.state.game.guesser);
const isChoosing = computed(() => store.state.game.isChoosing);

const playerName = computed(() => store.state.game.userName);
const playerIndex = computed(() => store.state.game.playerIndex);

const question = computed(() => store.state.game.question);

const canAnswer = computed(() => {
    if(isChoosing.value == true && chooserName.value == playerName.value) return true;
    if(isChoosing.value == false && guesserName.value == playerName.value) return true;

    return false;
});

const turnMessage = computed(() => {
    let turnMessages = {
        "YOU_ARE_GUESSING": "Guess what $ChoosingPlayer$ chose!",
        "YOU_ARE_CHOOSING": "It's your turn! Answer this question in secret!",
        "ANYONE_IS_GUESSING": "$GuessingPlayer$ is now guessing what $ChoosingPlayer$ chose.",
        "ANYONE_IS_CHOOSING": "It's $ChoosingPlayer$ turn! $ChoosingPlayer$ is now choosing an answer.",
    }

    if(isChoosing.value == true) {
        if(chooserName == playerName) {
            return turnMessages["YOU_ARE_CHOOSING"];
        }

        return turnMessages["ANYONE_IS_CHOOSING"].replaceAll("$ChoosingPlayer$", chooserName.value);
    } else {
        if(guesserName == playerName) {
            return turnMessages["YOU_ARE_GUESSING"].replaceAll("$ChoosingPlayer$", chooserName.value)
        }

        if(chooserName == playerName) {
            return turnMessages["ANYONE_IS_GUESSING"].replaceAll("$GuessingPlayer$", guesserName.value).replaceAll("$ChoosingPlayer$", "You");
        }

        return turnMessages["ANYONE_IS_GUESSING"].replaceAll("$GuessingPlayer$", guesserName.value).replaceAll("$ChoosingPlayer$", chooserName.value);
    }
});

import {useSocket} from '../socket';
const socket = useSocket();

const SendAnswer = async (answerId) => {
    try {
        socket.send("C_SendAnswer",  {roomId: roomCode.value, answer: answerId, playerId: playerIndex.value});
    } catch(err) {
        console.log(err);
    }
}

</script>
<style scoped lang="scss">

.stamp {
    transform: rotate(12deg);
	color: #555;


	border: 0.25rem solid #555;
	display: inline-block;
	text-transform: uppercase;
	border-radius: 1rem;

    mask-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/8399/grunge.png');
	-webkit-mask-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/8399/grunge.png');
    mask-size: 944px 604px;
    -webkit-mask-size: 944px 604px;
}

.is-wrong {
    color: rgb(250, 0, 21);
    border: 0.5rem double rgb(250, 0, 21);
    transform: rotate(14deg);
    mask-position: 2rem 3rem;
    -webkit-mask-position: 2rem 3rem;
}

.is-correct {
	color: #05fa3a;
	border: 0.5rem solid #05fa3a;
    mask-position: 13rem 6rem;
	-webkit-mask-position: 13rem 6rem;
	transform: rotate(-14deg);
    border-radius: 0;

}

</style>