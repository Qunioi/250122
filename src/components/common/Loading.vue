<template>
  <transition name="mask-fade">
    <div v-show="show" class="page-mask"></div>
  </transition>
</template>
<script setup>
defineProps({ show: Boolean })
</script>

<style>
.page-mask {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 50%);
  z-index: 9996;
  opacity: 1;
}
.mask-fade-leave-active {
  transition: opacity 0.4s;
}
.mask-fade-leave-to {
  opacity: 0;
}
.mask-fade-enter-to, .mask-fade-leave-from {
  opacity: 1;
}
</style>