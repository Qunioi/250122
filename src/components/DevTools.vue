<template>
  <div v-if="isDev && configStore.showDevTools" class="dev-tools">
    <button @click="showPanel = !showPanel" class="dev-toggle">
      ⚙️ Dev Tools
    </button>

    <div v-show="showPanel" class="dev-panel">
      <h3>開發工具</h3>

      <div class="dev-section">
        <label>主題顏色:</label>
        <select v-model="configStore.themeColor" @change="configStore.setThemeColor($event.target.value)">
          <option
            v-for="option in configStore.themeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="dev-section">
        <label>語言:</label>
        <select v-model="configStore.lang" @change="configStore.setLang($event.target.value)">
          <option value="zh-cn">中文（简体）</option>
          <option value="zh-tw">中文（繁體）</option>
          <option value="en">English</option>
        </select>
      </div>

      <div class="dev-actions">
        <button @click="configStore.resetToDefault()" class="reset-btn">
          重置為 .env 預設值
        </button>
      </div>

      <div class="dev-info">
        <h4>當前設定:</h4>
        <p>主題: {{ configStore.themeColor }}</p>
        <p>語言: {{ configStore.lang }}</p>
        <p>HTML data-theme: "{{ currentDataTheme }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useConfigStore } from '@/stores/configStore.js'

const configStore = useConfigStore()
const showPanel = ref(false)

// 只在開發環境顯示
const isDev = import.meta.env.DEV

// 取得當前 HTML data-theme 值
const currentDataTheme = computed(() => {
  return document.documentElement.getAttribute('data-theme')
})

// 初始化時設定 data-theme
onMounted(() => {
  configStore.updateHtmlDataTheme()
})
</script>

<style scoped lang="scss">
.dev-tools {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 9999;
  font-family: monospace;
}

.dev-toggle {
  background: #333;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.dev-panel {
  position: absolute;
  top: 40px;
  right: 0;
  color: #333;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  min-width: 280px;
  h3 {
    margin-top: 0;
  }
}

.dev-section {
  margin-bottom: 12px;
  label {
    display: block;
    margin-bottom: 4px;
    font-weight: bold;
    font-size: 12px;
  }
  select, input {
    width: 100%;
    padding: 6px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 12px;
  }
}

.dev-actions {
  margin: 16px 0;
}

.reset-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.dev-info {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  margin-top: 16px;
  h4 {
    margin: 0 0 8px 0;
    font-size: 12px;
  }
  p {
    margin: 4px 0;
    font-size: 11px;
    color: #666;
  }
}
</style>
