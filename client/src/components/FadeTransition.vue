<template>
    <transition v-bind="$attrs">
        <slot></slot>
    </transition>  
</template>

<script>
    export default {
        name: "FadeTransition",
        inheritAttrs: true
    };
</script>

<style lang="scss">
.slide-enter { transform: translateY(100%); opacity: 1; }
.slide-enter-to { transform: translateY(0) }

.slide-leave { transform: translateY(0) }
.slide-leave-to { transform: translateY(-100%); opacity: 0;}

.slide-enter-active,
.slide-leave-active { transition: all 750ms ease-in-out }


.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.fade-slow-enter-active,
.fade-slow-leave-active {
    transition: opacity 1.0s;
}

.fade-slow-enter,
.fade-slow-leave-to {
    opacity: 0;
}
</style>
  