<template>
  <div class="color-picker">
    <label>{{ item.name }}</label>
    <input type="color" :value="item.value" @input="$emit('update', item, $event.target.value)" />
    <span>{{ item.value }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  item: Object
})
</script>

<style scoped>
.color-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
label {
  min-width: 80px;
}
input[type="color"] {
  border: none;
  width: 32px;
  height: 32px;
  cursor: pointer;
}
span {
  font-size: 12px;
  color: #333;
}
</style>
