<template>
  <div class="color-picker">
    <label>{{ item.name }}</label>
    <input type="color" :value="rgbToHex(item.value)" @input="$emit('update', item, rgbToHex($event.target.value))" />
    <span>{{ rgbToHex(item.value) }}</span>
    <button @click="$emit('remove', item)">重置</button>
  </div>
</template>

<script setup>
const props = defineProps({
  item: Object
})

function rgbToHex(rgb) {
  // 支援 'rgb(r,g,b)' 或 [r,g,b] 格式
  if (typeof rgb === 'string' && rgb.startsWith('rgb')) {
    const result = rgb.match(/\d+/g);
    if (result && result.length === 3) {
      return (
        '#' +
        result
          .map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
          })
          .join('')
      );
    }
  } else if (Array.isArray(rgb) && rgb.length === 3) {
    return (
      '#' +
      rgb
        .map(x => {
          const hex = Number(x).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  }
  return rgb;
}
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
