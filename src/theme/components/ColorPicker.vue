<template>
  <div class="themeManager-picker">
    <label class="themeManager-picker-label">
      <div class="tips">
        <svg xmlns="http://www.w3.org/2000/svg" width="14px" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z"></path></svg>
      </div>
      {{ item.name }}</label>
    <div class="themeManager-picker-input-wrap" @click.stop>
      <div
        class="themeManager-picker-input"
        @click="togglePicker"
        ref="pickerTarget"
      >
        <!-- 顯示當前顏色 -->
        <span
          class="themeManager-picker-color"
          :style="{ backgroundColor: rgbToHex(item.value) }"
        ></span>

        <div class="themeManager-picker-hex-input-wrap">
          <input
            type="text"
            class="themeManager-picker-hex-input"
            :value="hexValue"
            @input="handleHexInput"
            @blur="handleHexBlur"
            @keydown.enter="handleHexEnter"
            placeholder="rgb(0 0 0)"
            maxlength="7"
          />
          <span class="themeManager-picker-hex-error"></span>
        </div>

        <!-- 顏色選擇器彈出層 -->
        <div v-if="isOpen" class="themeManager-picker-popup" @click.stop>
          <Vue3ColorPicker
            :modelValue="rgbToHex(item.value)"
            theme="light"
            mode="solid"
            type="HEX"
            :showAlpha="false"
            :showEyeDrop="true"
            :showInputMenu="true"
            :showPickerMode="false"
            @update:modelValue="handleColorChange"
          />
        </div>
      </div>
    </div>

    <button
      class="themeManager-btn themeManager-picker-reset"
      type="button"
      v-if="modified"
      :disabled="!modified"
      :title="modified ? '重置為主題預設值' : '尚未調整，無需重置'"
      @click="$emit('remove', item)"
    >
      <svg width="12px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12C22 17.5228 17.5229 22 12 22C6.4772 22 2 17.5228 2 12C2 6.47715 6.4772 2 12 2V4C7.5817 4 4 7.58172 4 12C4 16.4183 7.5817 20 12 20C16.4183 20 20 16.4183 20 12C20 9.25022 18.6127 6.82447 16.4998 5.38451L16.5 8H14.5V2L20.5 2V4L18.0008 3.99989C20.4293 5.82434 22 8.72873 22 12Z"></path></svg>
    </button>
  </div>
</template>

<script setup>
import { Vue3ColorPicker } from '@cyhnkckali/vue3-color-picker';
import '@cyhnkckali/vue3-color-picker/dist/style.css';

const props = defineProps({
  item: { type: Object, required: true },
  modified: { type: Boolean, default: false },
  // 新增：從父層控制是否開啟
  isOpen: { type: Boolean, default: false },
  // 新增：當前項目的唯一識別
  pickerId: { type: [String, Number], required: true }
})

const emit = defineEmits(['update', 'remove', 'toggle-picker'])

const pickerTarget = ref(null)
const hexValue = ref(rgbToHex(props.item.value))

// 監聽 item.value 變化，同步更新 hexValue
watch(() => props.item.value, (newValue) => {
  hexValue.value = rgbToHex(newValue)
})

// 切換顏色選擇器顯示狀態
const togglePicker = () => {
  // 通知父層要切換這個選擇器
  emit('toggle-picker', props.pickerId)
}

// 處理顏色選擇器的顏色變更
const handleColorChange = (newColor) => {
  hexValue.value = newColor
  emit('update', props.item, newColor)
}

// 處理手動輸入 hex 值
const handleHexInput = (event) => {
  let value = event.target.value.trim()
  
  // 自動添加 # 前綴
  if (value && !value.startsWith('#')) {
    value = '#' + value
    event.target.value = value
  }
  
  hexValue.value = value
}

// 處理輸入失焦事件
const handleHexBlur = (event) => {
  validateAndApplyHex(event.target.value)
}

// 處理按下 Enter 鍵
const handleHexEnter = (event) => {
  validateAndApplyHex(event.target.value)
  event.target.blur() // 失去焦點
}

// 驗證並應用 hex 顏色值
const validateAndApplyHex = (value) => {
  const cleanValue = value.trim().toLowerCase()
  
  if (isValidHexColor(cleanValue)) {
    const normalizedHex = normalizeHexColor(cleanValue)
    hexValue.value = normalizedHex
    emit('update', props.item, normalizedHex)
  } else {
    // 如果格式不正確，恢復原值
    hexValue.value = rgbToHex(props.item.value)
    // 可選：顯示錯誤提示
    alert('請輸入正確的顏色格式，例如：rgb(255 0 0) 或 rgb(255 0 0)')
  }
}

// 驗證 hex 顏色格式
const isValidHexColor = (hex) => {
  if (!hex.startsWith('#')) return false
  
  const hexPattern = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
  return hexPattern.test(hex)
}

// 標準化 hex 顏色格式（rgb(170 187 204) -> rgb(170 187 204)）
const normalizeHexColor = (hex) => {
  if (hex.length === 4) {
    // rgb(170 187 204) -> rgb(170 187 204)
    return '#' + hex.slice(1).split('').map(ch => ch + ch).join('')
  }
  return hex.toUpperCase()
}

// 點擊外部關閉選擇器
const handleClickOutside = (event) => {
  if (props.isOpen && pickerTarget.value && !pickerTarget.value.contains(event.target)) {
    emit('toggle-picker', null) // 通知父層關閉所有選擇器
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

/** 支援 'rgb(r,g,b)'、'r g b'、'#rgb'、'#rrggbb' */
function rgbToHex(rgb) {
  if (!rgb) return 'rgb(0 0 0)'
  const v = String(rgb).toLowerCase()

  if (v.startsWith('#')) {
    if (v.length === 4) return '#' + v.slice(1).split('').map(ch => ch + ch).join('')
    return v.toUpperCase()
  }
  if (v.startsWith('rgb')) {
    const result = v.match(/\d+/g)
    if (result && result.length === 3) {
      return '#' + result.map(x => {
        const hex = (parseInt(x, 10) || 0).toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }).join('').toUpperCase()
    }
  }
  if (/^\d+\s+\d+\s+\d+$/.test(v)) {
    const arr = v.split(' ')
    return '#' + arr.map(x => {
      const hex = (parseInt(x, 10) || 0).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('').toUpperCase()
  }
  return v
}
</script>

<style lang="scss">
.ck-cp-color-list-label {
  justify-content: flex-start;
  > div {
    font-size: 0;
  }
  &:first-child:before {
    content: "储存喜好颜色";
    display: inline-block;
    font-size: 13px;
  }
}
.themeManager-picker-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.themeManager-picker {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  position: relative;
  .themeManager-picker-label {
    display: flex;
    gap: 4px;
    font-size: 12px;
    color: var(--cp-text-secondary);
  }
  .themeManager-picker-reset {
    width: 36px;
    height: 42px;
    background-color: transparent;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
}
.themeManager-picker-popup {
  position: absolute;
  left: 0;
  z-index: 1109;
}
.themeManager-picker-input-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  background-color: rgb(245 247 250);
  border-radius: 4px;
  padding: 6px 12px;
  .themeManager-picker-hex-input {
    width: 100px;
    font-size: 12px;
    background-color: transparent;
    border: 0;
  }
}
.themeManager-picker-input {
  display: flex;
  gap: 8px;
}
.themeManager-picker-color {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 1px solid rgb(255 255 255);
  border-radius: 4px;
}
</style>