<template>
  <div class="themeManager-picker">
    <label class="themeManager-picker-label">{{ item.name }}</label>

    <!-- 不要在 template 用 TS 斷言；直接拿 $event.target.value 即可 -->
    <input
      class="themeManager-picker-input"
      type="color"
      :value="rgbToHex(item.value)"
      @input="$emit('update', item, $event.target && $event.target.value)"
    />

    <span class="themeManager-picker-hex">{{ rgbToHex(item.value) }}</span>
    <small class="themeManager-picker-modified">已調整：{{ modified ? 'true' : 'false' }}</small>

    <button
      class="themeManager-btn themeManager-picker-reset"
      type="button"
      :disabled="!modified"
      :title="modified ? '重置為主題預設值' : '尚未調整，無需重置'"
      @click="$emit('remove', item)"
    >
      重置
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  item: { type: Object, required: true },
  modified: { type: Boolean, default: false }
})

/** 支援 'rgb(r,g,b)'、'r g b'、'#rgb'、'#rrggbb' */
function rgbToHex(rgb) {
  if (!rgb) return '#000000'
  const v = String(rgb).toLowerCase()

  if (v.startsWith('#')) {
    if (v.length === 4) return '#' + v.slice(1).split('').map(ch => ch + ch).join('')
    return v
  }
  if (v.startsWith('rgb')) {
    const result = v.match(/\d+/g)
    if (result && result.length === 3) {
      return '#' + result.map(x => {
        const hex = (parseInt(x, 10) || 0).toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }).join('')
    }
  }
  if (/^\d+\s+\d+\s+\d+$/.test(v)) {
    const arr = v.split(' ')
    return '#' + arr.map(x => {
      const hex = (parseInt(x, 10) || 0).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }
  return v
}
</script>


<style scoped lang="scss">
.themeManager-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.themeManager-picker-label {
  min-width: 80px;
  input[type="color"] {
    border: none;
    width: 32px;
    height: 32px;
    cursor: pointer;
  }
  .themeManager-picker-hex {
    font-size: 12px;
    color: #333;
  }
}
</style>