<template>
    <div id="content" class="relative grow flex flex-col justify-center items-center px-4">
 
        <div v-if="!inRoom" class="inline-flex flex-col justify-center items-center gap-4">
            <JoinRoom />
            <span class="text-xl font-semibold mt-4 mb-4 font-[Mono]">or</span>
            <GetTheMod />
        </div>
        <div v-else class="relative w-4/5 h-5/6 px-12 py-6 flex justify-center border-paper bg-[#7d7c6d1f] outline-none shadow-lg box-border border-4 border-[#9d9c8d4f]">
            <FadeTransition name="slide" mode="out-in" >
                <RoundDisplay v-if="showNextRound" />
                <TurnDisplay v-if="showNextTurn" />
                <QuestionDisplay v-if="showQuestion" />
                <StatsDisplay v-if="showStats" />
                <ScoreDisplay v-if="showScore" />
            </FadeTransition>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

import JoinRoom from '../components/JoinRoom.vue';
import GetTheMod from '../components/GetTheMod.vue';
import FadeTransition from '../components/FadeTransition.vue';

import RoundDisplay from '../components/RoundDisplay.vue';
import TurnDisplay from '../components/TurnDisplay.vue';
import QuestionDisplay from '../components/QuestionDisplay.vue';
import StatsDisplay from '../components/StatsDisplay.vue';
import ScoreDisplay from '../components/ScoreDisplay.vue';


const store = useStore();
const inRoom = computed(() => store.state.game.status.inRoom);
const currentScene = computed(() => store.state.game.scene);

console.log(store.state.game.status);

watch([currentScene], ([scene], [prevScene]) => {
    showNextRound.value = scene == 1 ? true : false;
    showNextTurn.value = scene == 2 ? true : false;
    showQuestion.value = scene == 3 ? true : false;
    showStats.value = scene == 4 ? true : false;
    showScore.value = scene == 5 ? true : false;
});

const showNextRound = ref(false);
const showNextTurn = ref(false);
const showQuestion = ref(false);
const showStats = ref(false);
const showScore = ref(false);

import {useSocket} from '../socket';
const socket = useSocket();

socket.on("onMessage", (msg) => {
    const {_type, _params} = msg;

    console.log(`Index> ${_type}`);
    switch(_type) {
        case "S_JoinRoomSuccess": {
            onJoinRoomSuccess(_params.playerIndex);
        } break;
        case "S_JoinRoomFailed": {
            onJoinRoomFailed(_params.reason);
        } break;
        case "S_ShowNextRound": {
            onShowNextRound(_params.roundIndex);
        } break;
        case "S_StartNextTurn": {
            onStartNextTurn(_params.isChoosing, _params.choosingPlayerName, _params.guessingPlayerName);
        } break;
        case "S_BroadcastQuestion": {
            onBroadcastQuestion(_params.question);
        } break;
        case "S_RevealAnswer": {
            onRevealAnswer(_params.chosenAnswerID, _params.guessedAnswerID, _params.isCorrect);
        } break;
        case "S_AnnounceStats": {
            onStats(_params.answer1Percentage, _params.answer2Percentage);
        } break;
        case "S_ShowScore": {
            onShowScore(_params.avgScore, _params.playerScore, _params.isEndOfGame);
        } break;
        default: {
            return;
        }
    }
});


const onJoinRoomFailed = async(reason) => {
    console.log(`Failed to join room: ${reason}`);

    await store.dispatch("game/roomCode", "");
    await store.dispatch("game/leaveRoom");
}

const onJoinRoomSuccess = async(playerIndex) => {
    await store.dispatch("game/playerIndex", playerIndex);
    await store.dispatch("game/joinRoom");
}

const onShowNextRound = async(roundIndex) => {
    await store.dispatch("game/round", roundIndex);
    await store.dispatch("game/scene", 1);
}

const onStartNextTurn = async(isChoosing, choosingPlayer, guessingPlayer) => {
    console.log(`${isChoosing}  - ${choosingPlayer} - ${guessingPlayer}`)
    await store.dispatch("game/isChoosing", isChoosing);
    await store.dispatch("game/chooser", choosingPlayer);
    await store.dispatch("game/guesser", guessingPlayer);

    await store.dispatch("game/scene", 2);
}

const onBroadcastQuestion = async(question) => {
    console.log(question);
    await store.dispatch("game/question", question);
    await store.dispatch("game/scene", 3);
    await store.dispatch("game/showAnswer", false);
}

const onRevealAnswer = async(chosenAnswerID, guessedAnswerID, isCorrect) => {
    await store.dispatch("game/choserAnswer", chosenAnswerID);
    await store.dispatch("game/guesserAnswer", guessedAnswerID);
    await store.dispatch("game/sameGuess", isCorrect);
    await store.dispatch("game/showAnswer", true);
}

const onStats = async(answer1Percentage, answer2Percentage) => {
    await store.dispatch("game/questionStats", { answerA: answer1Percentage, answerB: answer2Percentage});
    await store.dispatch("game/scene", 4);
}


const onShowScore = async(avgScore, playerScore, isEndOfGame) => {
    await store.dispatch("game/avgScore", avgScore);
    await store.dispatch("game/playerScore", playerScore);
    await store.dispatch("game/isEndOfGame", isEndOfGame);

    await store.dispatch("game/scene", 5);
}
</script>

<style scoped lang="scss">


</style>