<template>
    <div class="inline-flex flex-col items-center gap-2 font-[Handwritten] justify-center px-12 py-6 border-paper bg-[#7d7c6d1f] text-[#bebbb5] outline-none shadow-lg box-border border-4 border-[#9d9c8d4f]">
        <div class="inline-flex flex-row gap-2">
            <div class="mb-4">
                <input v-model="userName" class="shadow appearance-none rounded border-paper box-border border-2 border-[#9d9c8d4f] bg-transparent w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username">
            </div>
            <div class="mb-4">
                <input v-model="roomCode" class="shadow appearance-none rounded border-paper box-border border-2 border-[#9d9c8d4f] bg-transparent w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" id="roomcode" type="text" placeholder="Room Code">
            </div>
        </div>
        <button @click.prevent="joinRoom" class="w-full py-2 text-md border-paper box-border border-2 border-[#9d9c8d4f] hover:-translate-y-1 hover:border-[#9d9c8d6f] active:border-[#9d9c8d1f] active:translate-y-0 shadow-lg">Join Room</button>
    </div>
</template>
<script setup>

import {useStore} from 'vuex';
const store = useStore();

import {ref} from 'vue';
const userName = ref('');
const roomCode = ref('');

import {useSocket} from '../socket';
const socket = useSocket();

const joinRoom = async() => {
    try {
        if(username.value == '' || roomcode.value == '') return;

        await store.dispatch("game/roomCode", roomCode.value);
        await store.dispatch("game/userName", userName.value);

        socket.send("C_JoinRoom", { username: username.value, roomcode: roomcode.value });
    } catch(error) {
        console.log(error);

        await store.dispatch("game/roomCode", "");
    }
} 

</script>
<style scoped lang="scss">

.border-paper {
    border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
}

button {
  -webkit-transition: all 0.1s;
  -moz-transition: all 0.1s;
  transition: all 0.1s;
}

button:after {
  content: '';
  position: absolute;
  z-index: -1;
  -webkit-transition: all 0.1s;
  -moz-transition: all 0.1s;
  transition: all 0.1s;
}
</style>