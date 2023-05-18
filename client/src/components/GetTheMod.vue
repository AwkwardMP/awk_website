<template>
    <div id="downloadMod" class="inline-flex w-full flex-col items-center justify-center hover:-translate-y-1 hover:border-[#9d9c8d6f] active:border-[#9d9c8d1f] active:translate-y-0 ">
        <button @click="downloadMod()" class="w-full px-8 py-4 font-semibold text-md rounded-md shadow-lg">
            Get the Mod
        </button>
    </div>
</template>
<script setup>

</script>
<style scoped lang="scss">
@keyframes tilt-shaking {
    0% { transform: rotate(0deg); }
    1% { transform: rotate(1deg); }
    2% { transform: rotate(0deg); }
    3% { transform: rotate(-1deg); }
    4% { transform: rotate(0deg); }
    5% { transform: rotate(1deg); }
    6% { transform: rotate(0deg); }
    7% { transform: rotate(-1deg); }
    8% { transform: rotate(0deg); }
    
    100% { transform: rotate(0deg); }
}


#downloadMod {
    font-family: 'Handwritten', cursive;
    font-size: 1.25rem;
    color: #bebbb5;

    button {
        padding: 0.5rem 0.5rem;
        margin: .5rem .25rem .25rem;
        outline: none;
        box-shadow: 1em 1.5em 1.5em -1em rgba(0, 0, 0, 0.5);
        border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
        box-sizing: border-box;
        border: solid 0.1em #dbdbda8a;

        animation: tilt-shaking 5s infinite;
    }
}
</style>