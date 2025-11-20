<template>
  <div class="themeManager-editer-wrap">
    <TemplateZoom />
    <div class="themeManager-edit-wrap">
      <div class="themeManager-toggle-btn">
        <button
          type="button"
          :class="['themeManager-preview-btn', { 'is-show': panelVisible }]"
          @click="panelVisible = !panelVisible"
          :title="panelVisible ? '隱藏主題面板' : '開啟主題面板'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.1642 12L12.9571 5.79291L11.5429 7.20712L16.3358 12L11.5429 16.7929L12.9571 18.2071L19.1642 12ZM13.5143 12L7.30722 5.79291L5.89301 7.20712L10.6859 12L5.89301 16.7929L7.30722 18.2071L13.5143 12Z"></path></svg>
        </button>
      </div>
      <div class="themeManager-container">
        <div class="themeManager-header">
          <button
            type="button"
            class="themeManager-instructions-btn"
            :title="instructionsVisible ? '' : '開啟使用說明'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM13 13.3551V14H11V12.5C11 11.9477 11.4477 11.5 12 11.5C12.8284 11.5 13.5 10.8284 13.5 10C13.5 9.17157 12.8284 8.5 12 8.5C11.2723 8.5 10.6656 9.01823 10.5288 9.70577L8.56731 9.31346C8.88637 7.70919 10.302 6.5 12 6.5C13.933 6.5 15.5 8.067 15.5 10C15.5 11.5855 14.4457 12.9248 13 13.3551Z"></path></svg>
            <div class="themeManager-instructions-tips">操作说明&规范</div>
          </button>
          <button
            type="button"
            class="themeManager-save-btn"
            :disabled="saving"
            :title="saving ? '汇出保存中…' : '下載壓縮檔（含 .css 與畫面示意圖）'"
            @click="saveTheme"
          >
            <span>保存</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 19V13H17V19H19V7.82843L16.1716 5H5V19H7ZM4 3H17L21 7V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM9 15V19H15V15H9Z"></path></svg>
          </button>
        </div>
        <div class="themeManager-body">
          <details class="themeManager-details" open>
            <summary>Logo与轮播图尺寸</summary>
            <div class="themeManager-detail-content">
              <LogoUploader />
            </div>
          </details>
          <details class="themeManager-details" open>
            <summary>版型主題</summary>
            <div class="themeManager-detail-content">
              <PlatformSelet />
            </div>
          </details>
          <details class="themeManager-details" open>
            <summary>版型配色</summary>
            <div class="themeManager-detail-content">
              <div class="themeManager-theme-wrap">
                <div class="themeManager-theme-title">
                  预设配色
                </div>
                <div class="themeManager-theme-content">
                  <button v-for="theme in sortedThemes" :key="theme.themeSort ?? theme.themeName" :class="['themeManager-theme-btn',{ active: selectedThemeName === theme.themeName },]" type="button" @click="selectTheme(theme.themeName)">
                    <div class="themeManager-theme-color" :style="{background: `linear-gradient(90deg, ${theme.themeColor.primary} 0, ${theme.themeColor.primary} 50%, ${theme.themeColor.secondary} 50%, ${theme.themeColor.secondary} 100%)`,}" />
                    <span class="themeManager-theme-name">
                      {{ theme.themeName }} ({{ theme.themeMode }})
                    </span>
                  </button>
                  <button
                    class="themeManager-theme-reset-btn"
                    type="button"
                    :disabled="!hasModified"
                    :title="hasModified ? '重置当前主题所有自订颜色' : '尚未调整，无需重置'"
                    @click="confirmResetTheme">
                    重置
                  </button>
                </div>
              </div>
              <h4>主题颜色自订</h4>
              <div class="themeManager-picker-wrap" v-if="selectedColors.length">
                <ColorPicker
                  v-for="color in selectedColors"
                  :key="color.id"
                  :item="color"
                  :pickerId="color.id"
                  :isOpen="activePickerId === color.id"
                  :modified="modifiedMap[color.id]"
                  @update="updateColor"
                  @remove="removeColor"
                  @toggle-picker="handleTogglePicker"
                />
              </div>
              <div v-else>
                <p>此主題尚未設定 colorVariables。</p>
              </div>
              <!-- 匯出 / 匯入 / 保存 -->
              <div class="themeManager-io-wrap">
                <button type="button" class="themeManager-btn themeManager-btn-export" @click="exportTheme" :title="hasModified
                    ? '汇出目前自订配色'
                    : '没有自订变更，汇出将与预设相同'
                  ">
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.625 7.9375V9.15625C0.625 9.47948 0.753404 9.78948 0.981964 10.018C1.21052 10.2466 1.52052 10.375 1.84375 10.375H9.15625C9.47948 10.375 9.78948 10.2466 10.018 10.018C10.2466 9.78948 10.375 9.47948 10.375 9.15625V7.9375M8.75 3.875L5.5 7.125M5.5 0.625V7.125M2.25 3.875L5.5 7.125" stroke="currentColor" stroke-width="0.8125" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  导出配色
                </button>
                <button type="button" class="themeManager-btn themeManager-btn-import" @click="triggerImport">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75v-2.25m-3-7.5L12 3m0 0L6 9m6-6v12"></path></svg>
                  导入配色
                </button>
                <input ref="fileInputRef" type="file" accept=".css,.txt" class="themeManager-file-hidden"
                  @change="onFileChange" />
              </div>
              <!-- 匯入結果訊息 -->
              <div v-if="importMessage" :class="['themeManager-import-msg', importSuccess ? 'ok' : 'err']">
                <pre class="themeManager-import-text">{{ importMessage }}</pre>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
    <div class="themeManager-site-wrap">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import JSZip from "jszip";
import { toPng } from "html-to-image";

import { useTheme } from "../useTheme";
import { colorDatabase } from "../colorDatabase";

import { useConfigStore } from "@/stores/configStore"; // Pinia 僅存狀態／委派給 useTheme
import themeData from "@/assets/data/theme.json";

import ColorPicker from "./ColorPicker.vue";
import LogoUploader from "./LogoUploader.vue";
import PlatformSelet from "./PlatformSelet.vue";
import TemplateZoom from "./TemplateZoom.vue";


// 處理顏色選擇器開關
const activePickerId = ref(null);
const handleTogglePicker = (pickerId) => {
  if (activePickerId.value === pickerId) {
    // 如果點擊的是已開啟的選擇器，則關閉
    activePickerId.value = null;
  } else {
    // 否則開啟新的選擇器（會自動關閉其他的）
    activePickerId.value = pickerId;
  }
};

// 面板顯示
const panelVisible = ref(true);
watch(panelVisible, async (val) => {
  await nextTick(); // 等待 DOM 更新
  if (typeof window !== 'undefined' && window.document && window.document.body) {
    if (val) {
      document.body.classList.add('is-edit');
    } else {
      document.body.classList.remove('is-edit');
    }
  }
}, { immediate: true });
onMounted(async () => {
  await nextTick();
  if (panelVisible.value) {
    document.body.classList.add('is-edit');
  }
});

// 說明顯示
const instructionsVisible = ref(false);

// 版型編號（匯出／匯入校驗）
const ENV_VERSION = String(import.meta.env?.VITE_VERSION ?? "").trim();

// useTheme： useTheme.applyTheme / initTheme
const theme = useTheme({ namespace: "app" });
const { themes, getColorVars, persistCustom } = theme;
const getCustomThemeColors = persistCustom.get;
const saveCustomThemeColors = persistCustom.set;
const clearCustomThemeColors = persistCustom.clear;

// 與 Pinia 同步
const config = useConfigStore();

// 選中主題／主題資料
const selectedThemeName = ref(
  config.themeColor.value || themes[0]?.themeName || ""
);
const currentTheme = computed(() =>
  themes.find((t) => t.themeName === selectedThemeName.value)
);
const colorVars = computed(() => getColorVars(selectedThemeName.value));

const sortedThemes = computed(() => {
  return [...themes].sort((a, b) => a.themeSort - b.themeSort);
});

// 版型編號：優先 .env，其次主題名稱
const currentTemplateNumber = computed(
  () => ENV_VERSION || currentTheme.value?.themeName || selectedThemeName.value
);

// 色票與狀態
const selectedColors = ref([]); // [{ id, name, varName, value: '#rrggbb' }]
const baselineMap = ref({}); // { [id]: '#rrggbb' } 來自目前主題預設值
const savedColors = ref({}); // { [id]: '#rrggbb' } 來自 localStorage

// 小工具：色彩轉換
const normalizeHex = (hex) => (hex || "").toLowerCase();
function hexToRgbSpace(hex) {
  const v = normalizeHex(hex).replace("#", "");
  const full =
    v.length === 3
      ? v
        .split("")
        .map((x) => x + x)
        .join("")
      : v;
  const num = parseInt(full, 16) || 0;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r} ${g} ${b}`;
}
function toHex(val) {
  if (!val) return "#000000";
  const v = String(val).toLowerCase();
  if (v.startsWith("#")) {
    if (v.length === 4)
      return (
        "#" +
        v
          .slice(1)
          .split("")
          .map((ch) => ch + ch)
          .join("")
      );
    return v;
  }
  if (v.startsWith("rgb")) {
    const result = v.match(/\d+/g);
    if (result?.length === 3) {
      return (
        "#" +
        result
          .map((x) => {
            const hex = (parseInt(x, 10) || 0).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
          })
          .join("")
      );
    }
  }
  if (/^\d+\s+\d+\s+\d+$/.test(v)) {
    const arr = v.split(" ");
    return (
      "#" +
      arr
        .map((x) => {
          const hex = (parseInt(x, 10) || 0).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }
  return v;
}

// DOM 讀取／清除
function getThemeColorValue(varName) {
  if (typeof window === "undefined") return "#000000";
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim() || "#000000"
  );
}
function clearThemeInlineColors() {
  const el = document.documentElement;
  colorDatabase
    .filter((item) => colorVars.value.includes(item.id))
    .forEach((item) => el.style.removeProperty(item.varName));
}

// 主題切換（單一入口）：委派給 Pinia（Pinia 會再委派 useTheme.applyTheme）
function onThemeChange() {
  // 1) 先讓 Pinia 設定主題（Pinia 會基於主題預設 mode 或 keepMode 呼叫 useTheme.applyTheme）
  config.setThemeColor(selectedThemeName.value);

  // 2) 清掉舊的 inline 覆寫，再讀 baseline
  clearThemeInlineColors();

  const items = colorDatabase.filter((item) =>
    colorVars.value.includes(item.id)
  );

  // 量 baseline（以主題原生值為準）
  const base = {};
  for (const item of items) {
    base[item.id] = normalizeHex(toHex(getThemeColorValue(item.varName)));
  }
  baselineMap.value = base;

  // 讀取 localStorage（自訂覆寫）
  savedColors.value = getCustomThemeColors(selectedThemeName.value) || {};

  // 組合畫面色票（如有存檔，覆寫 baseline）
  selectedColors.value = items.map((item) => {
    const cur = normalizeHex(savedColors.value[item.id] || base[item.id]);
    return { ...item, value: cur };
  });

  // 對已存的項目套 inline 覆寫
  for (const item of items) {
    const hex = savedColors.value[item.id];
    if (hex) {
      document.documentElement.style.setProperty(
        item.varName,
        hexToRgbSpace(hex)
      );
    }
  }
}

watch(selectedThemeName, onThemeChange, { immediate: true });

// 是否有變更
const modifiedMap = computed(() => {
  const map = {};
  for (const item of selectedColors.value) {
    const base = normalizeHex(baselineMap.value[item.id]);
    const cur = normalizeHex(item.value);
    map[item.id] = !!(base && cur && base !== cur);
  }
  return map;
});
const hasModified = computed(() =>
  Object.values(modifiedMap.value).some(Boolean)
);

// 更新單一色
function updateColor(item, newHex) {
  const themeName = selectedThemeName.value;
  const next = normalizeHex(newHex);
  const base = normalizeHex(baselineMap.value[item.id]);

  // 先更新 UI
  item.value = next;

  // 若回到 baseline，視為刪除自訂
  if (next === base) {
    const colors = getCustomThemeColors(themeName) || {};
    delete colors[item.id];
    saveCustomThemeColors(themeName, colors);

    const c = { ...savedColors.value };
    delete c[item.id];
    savedColors.value = c;

    document.documentElement.style.removeProperty(item.varName);
    return;
  }

  // 否則保存並套用
  const colors = getCustomThemeColors(themeName) || {};
  colors[item.id] = next;
  saveCustomThemeColors(themeName, colors);
  savedColors.value = { ...savedColors.value, [item.id]: next };
  document.documentElement.style.setProperty(item.varName, hexToRgbSpace(next));
}

// 移除單一色的自訂
function removeColor(item) {
  const themeName = selectedThemeName.value;

  const colors = getCustomThemeColors(themeName) || {};
  delete colors[item.id];
  saveCustomThemeColors(themeName, colors);

  const c = { ...savedColors.value };
  delete c[item.id];
  savedColors.value = c;

  const base = normalizeHex(
    baselineMap.value[item.id] || toHex(getThemeColorValue(item.varName))
  );
  item.value = base;
  document.documentElement.style.removeProperty(item.varName);
}

// 修改重置函數，加上確認提示
function confirmResetTheme() {
  const confirmed = confirm('您确定要重置当前主题的配色吗？');
  if (confirmed) {
    resetTheme();
  }
}

// 全部重置（當前主題）
function resetTheme() {
  clearThemeInlineColors();
  clearCustomThemeColors(selectedThemeName.value);
  savedColors.value = {};
  selectedColors.value = selectedColors.value.map((item) => ({
    ...item,
    value: normalizeHex(baselineMap.value[item.id]),
  }));
}

// 匯出／匯入
const fileInputRef = ref(null);
const importMessage = ref("");
const importSuccess = ref(false);

function triggerImport() {
  importMessage.value = "";
  importSuccess.value = false;
  if (fileInputRef.value && fileInputRef.value.click)
    fileInputRef.value.click();
}

function onFileChange(e) {
  const file = e?.target?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const text = String(reader.result || "");
    importFromCssText(text);
    if (e?.target) e.target.value = ""; // 允許同檔連續上傳
  };
  reader.readAsText(file, "utf-8");
}

/** 由 CSS 文字匯入 */
function importFromCssText(text) {
  // 1) 擷取 Template number（例如：/* Template number: test_250123 */）
  const tplMatch = text.match(
    /\/\*\s*Template\s+number\s*:\s*([^\*]+?)\s*\*\//i
  );
  const importedTpl = tplMatch ? tplMatch[1].trim() : "";
  const currentTpl = String(currentTemplateNumber.value || "").trim();

  if (!importedTpl) {
    importSuccess.value = false;
    importMessage.value = `未找到 Template number 註解！\n當前版型: ${currentTpl}`;
    return;
  }

  if (importedTpl !== currentTpl) {
    importSuccess.value = false;
    importMessage.value = `當前版型: ${currentTpl}\n匯入版型: ${importedTpl}`;
    return;
  }

  // 3) 解析 CSS 變數：--var: #HEX;
  const varPairs = [
    ...text.matchAll(/--([a-z0-9\-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\s*;/g),
  ].map((m) => [`--${m[1]}`, normalizeHex(m[2])]);

  if (!varPairs.length) {
    importSuccess.value = false;
    importMessage.value = `未讀取到任何配色變數！\n版型编号 ${importedTpl} 匯入取消。`;
    return;
  }

  const themeName = selectedThemeName.value;
  const colors = getCustomThemeColors(themeName) || {};
  const varNameToId = Object.fromEntries(
    colorDatabase.map((i) => [i.varName, i.id])
  );

  for (const [varName, hex] of varPairs) {
    const id = varNameToId[varName];
    if (!id) continue;

    // 更新 UI
    const uiItem = selectedColors.value.find((i) => i.id === id);
    if (uiItem) uiItem.value = hex;

    // 覆寫 inline
    document.documentElement.style.setProperty(varName, hexToRgbSpace(hex));

    // 與 baseline 比較：相同就不存
    const base = normalizeHex(baselineMap.value[id]);
    if (hex === base) {
      delete colors[id];
    } else {
      colors[id] = hex;
    }
  }

  saveCustomThemeColors(themeName, colors);
  savedColors.value = { ...colors };

  importSuccess.value = true;
  importMessage.value = `版型编号 ${importedTpl} 配色已成功汇入！`;
}

/** 產生匯出 CSS 文字 */
function buildCssContent() {
  const tpl = String(currentTemplateNumber.value || "").trim() || "theme";
  const colorVariables = themeData.colorVariables;
  const exportVars = colorVariables
    .map((id) => {
      const item = colorDatabase.find((c) => c.id === id);
      return item ? [`/* ${item.name} */`, item.varName] : null;
    })
    .filter(Boolean);

  const lines = [];
  lines.push(
    "/* ※注意 - Template number 汇入配色时会判断是否同一个版型，请勿删除 */"
  );
  lines.push(`/* Template number: ${tpl} */`);
  lines.push("");
  for (const [label, varName] of exportVars) {
    const hex = toHex(getThemeColorValue(varName)).toUpperCase();
    lines.push(label);
    lines.push(`${varName}: ${hex};`);
    lines.push("");
  }
  return lines.join("\n");
}

/** 匯出配色（.css）或打包保存（.zip） */
async function exportTheme() {
  if (!hasModified.value) {
    const ok = confirm(
      "目前没有任何自订变更，汇出将与主题预设值相同。\n仍要汇出吗？"
    );
    if (!ok) return;
  }
  const tpl = String(currentTemplateNumber.value || "").trim() || "theme";
  const content = buildCssContent();
  const cssBlob = new Blob([content], { type: "text/css;charset=utf-8" });

  if ("showSaveFilePicker" in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: `${tpl}.css`,
        types: [{ description: "CSS 檔案", accept: { "text/css": [".css"] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(cssBlob);
      await writable.close();
      alert("檔案已成功保存！");
      return;
    } catch (e) {
      if (e?.name === "AbortError") return;
      console.error(e);
      alert(`保存失敗：${e.message || e}`);
      return;
    }
  }

  // Fallback：啟動下載（無法得知是否成功）
  const a = document.createElement("a");
  const url = URL.createObjectURL(cssBlob);
  a.href = url;
  a.download = `${tpl}.css`;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
  alert("下載已開始（無法偵測是否完成）。");
}

const saving = ref(false);
async function saveTheme() {
  if (saving.value) return;
  saving.value = true;

  if (!hasModified.value) {
    const ok = confirm(
      "目前没有任何自订变更，汇出将与主题预设值相同。\n仍要汇出吗？"
    );
    if (!ok) {
      saving.value = false;
      return;
    }
  }

  let siteWrapEl = null;
  let originalSiteWrapStyle = "";
  let objectUrl = null;

  try {
    const tpl = String(currentTemplateNumber.value || "").trim() || "theme";
    const cssContent = buildCssContent();

    // 截圖目標：固定為 .page-wrap
    const captureEl = document.querySelector(".page-wrap");
    if (!captureEl) throw new Error("找不到 .page-wrap 容器");

    // 修改寬度的目標：固定為 .themeManager-site-wrap
    siteWrapEl = document.querySelector(".themeManager-site-wrap");
    if (siteWrapEl) {
      originalSiteWrapStyle = siteWrapEl.style.cssText || "";
      siteWrapEl.style.cssText = `${originalSiteWrapStyle}; width: 1920px;`;

      // 修正右側浮動元素位置
      const rightFloatElements = siteWrapEl.querySelectorAll('.float-right-wrap');
      rightFloatElements.forEach((el) => {
        el.style.cssText = `${el.style.cssText}; position: absolute; right: 0px; left: auto;`;
      });
    }

    // 等待 2 秒讓佈局穩定再進行截圖作業
    await new Promise(resolve => setTimeout(resolve, 300));

    const imgs = captureEl.querySelectorAll("img");
    imgs.forEach((img) => {
      img.onerror = () => {
        console.warn("圖片載入失敗，已隱藏：", img.src);
        img.style.display = "none";
      };
    });

    await waitForImages(captureEl);
    await nextTick();

    const dataUrl = await toPng(captureEl, {
      cacheBust: true,
      pixelRatio: 1,
      style: { transform: "scale(1)" },
      filter: (node) => {
        if (node.classList?.contains?.("ignore-screenshot")) return false;
        if (node.classList?.contains?.("themeManager-wrap")) return false;
        if (node.tagName === "IMG" && node.style?.display === "none")
          return false;
        return true;
      },
      backgroundColor:
        getComputedStyle(document.body).backgroundColor || "#ffffff",
    });

    const imageBlob = await fetch(dataUrl).then((r) => r.blob());
    if (imageBlob.size > 10 * 1024 * 1024) {
      throw new Error("截圖檔案過大，請調整畫面大小或內容");
    }

    const zip = new JSZip();
    zip.file(`${tpl}.css`, cssContent);
    zip.file(`${tpl}.png`, imageBlob, { compression: "STORE" });

    const zipBlob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
      streamFiles: true,
      comment: `Generated at ${new Date().toISOString()}`,
    });

    const a = document.createElement("a");
    objectUrl = URL.createObjectURL(zipBlob);
    a.href = objectUrl;
    a.download = `${tpl}.zip`;

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("下載超時")), 30000);
      const onClick = () => {
        clearTimeout(timeout);
        setTimeout(() => {
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
            objectUrl = null;
          }
          a.removeEventListener("click", onClick);
          resolve();
        }, 1000);
      };
      a.addEventListener("click", onClick);
      a.click();
    });

    alert("檔案已成功保存，請查看下載列表。");
  } catch (err) {
    console.error("保存過程發生錯誤：", err);
    alert(`保存失敗：${err.message || err.toString()}`);
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    if (captureEl) captureEl.style.cssText = originalStyle;
    saving.value = false;
    if (window.gc)
      try {
        window.gc();
      } catch { }
  }
}

// UI 事件
function selectTheme(themeName) {
  selectedThemeName.value = themeName;
}

// 等待容器內所有 <img> 載入完成或失敗（失敗就隱藏）
function waitForImages(root, timeoutMs = 15000) {
  const imgs = Array.from(root.querySelectorAll("img"));
  if (imgs.length === 0) return Promise.resolve();

  return new Promise((resolve) => {
    let pending = imgs.length;
    const done = () => --pending <= 0 && resolve();

    imgs.forEach((img) => {
      img.onerror = () => {
        img.style.display = "none";
        done();
      };
      if (img.complete && img.naturalWidth > 0) {
        done();
      } else if (img.complete && img.naturalWidth === 0) {
        img.style.display = "none";
        done();
      } else {
        const onEnd = () => {
          img.removeEventListener("load", onEnd);
          img.removeEventListener("error", onEnd);
          if (img.naturalWidth === 0) img.style.display = "none";
          done();
        };
        img.addEventListener("load", onEnd);
        img.addEventListener("error", onEnd);
      }
    });

    setTimeout(resolve, timeoutMs);
  });
}

</script>

<style lang="scss">
:root {
  --cp-bg-primary: #fff;
  --cp-bg-secondary: #889ebc;
  --cp-color-bg: #f1f4f8;
  --cp-color-primary: #889ebc;
  --cp-color-secondary: #417FF7;
  --cp-color-third: #f5f7fa;
  --cp-text-primary: #3d4154;
  --cp-text-secondary: #8e97a5;
  --cp-text-third: #aab4c4;
}

.is-edit .themeManager-site-wrap,
.themeManager-body {
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: var(--cp-color-third);
  }
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: black;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--cp-bg-secondary);
  }
}

html,
body,
.is-edit,
.page-layout,
.themeManager-editer-wrap,
.themeManager-site-wrap {
  height: 100%;
}

.themeManager-edit-wrap {
  width: 310px;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  transform: translateX(100%);
  transition: .3s transform ease;
}
body.is-edit {
  min-width: auto;
  .themeManager-edit-wrap {
    transform: translateX(0);
  }
}

.themeManager-preview-btn {
  background-color: var(--cp-bg-secondary);
  border-radius: 10px 0 0 10px;
  color: var(--cp-text-primary);
  cursor: pointer;
  height: 52px;
  position: absolute;
  right: 100%;
  top: 0;
  width: 36px;
  z-index: 1099;
  svg {
    color: #fff;
    transform: rotate(180deg);
    position: relative;
    top: 2px;
    transition: .5s ease;
    width: 24px;
  }
  .is-edit & {
    background-color: var(--cp-bg-primary);
    svg {
      color: var(--cp-bg-secondary);
      transform: rotate(0deg);
    }
  }
}



.themeManager-site-wrap {
  width: calc(100% - 0px);
  transition: all 0.3s ease;
}

.is-edit .themeManager-site-wrap {
  transition: all 0.3s ease;
  width: calc(100% - 310px);
  overflow: auto;
  position: relative;
}

.page-wrap {
  min-width: var(--page-width);
}
.is-edit.ele-fixed-inner.fixed {
  position: sticky !important;
}

.themeManager-wrap {
  &.is-visible {
    transform: translateX(0);
  }
}

.themeManager-hide-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  color: #888;
}

.themeManager-container {
  font-size: 13px;
  color: var(--cp-text-primary);
  background: var(--cp-bg-primary);
  width: 100%;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.themeManager-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 0 10px;
  background: var(--cp-bg-primary);

  .themeManager-instructions-btn {
    width: 24px;
    height: 24px;
    color: #fff;
    border-radius: 50%;
    background-color: var(--cp-bg-secondary);
    cursor: pointer;
  }
  .themeManager-save-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    height: 34px;
    font-family: Google Sans, Roboto, Arial, sans-serif;
    font-size: 14px;
    color: #fff;
    background-color: var(--cp-color-secondary);
    border-radius: 4px;
    padding: 0 12px;
    cursor: pointer;
    &:hover {
      background-color: #366edc;
    }
  }
}

.themeManager-body {
    overflow: auto;
  height: calc(100% - 52px);
}

.themeManager-details {
  &[open] {
    margin-bottom: 1rem;
  }
  &:before {
    content: '';
    pointer-events: none;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    opacity: .15;
    transition: opacity .2s;
  }
  summary {
    list-style: none;
    color: var(--cp-text-primary);
    cursor: pointer;
    font-size: 15px;
    font-weight: 700;
    padding: 16px;
    position: relative;
    &::before,
    &::after {
      content: '';
      width: .75em;
      height: 1px;
      text-align: right;
      background-color: currentColor;
      position: absolute;
      top: 50%;
      right: 10px;
      transition: transform .2s ease-in-out, opacity .3s ease-in-out;
      transform: translateY(-50%);
    }
    &::after {
      transform: translateY(-50%) rotate(90deg);
      opacity: 1;
    }
    &::-webkit-details-marker {
      display: none;
    }
  }
  &:hover {
    background-color: var(--cp-color-third);
  }
  &[open] {
    background-color: var(--cp-bg-primary);
    summary::after  {
      transform: translateY(-50%) rotate(0deg);
      opacity: 0;
    }
  }
}
.themeManager-detail-content {
  padding: 0 16px 6px;
}


/* 主題切換 */
.themeManager-theme-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-bottom: 1px solid rgba(233, 237, 246, .5);
  margin-bottom: 16px;
  padding-bottom: 16px;
  .themeManager-theme-title {
    font-size: 12px;
    color: var(--cp-text-secondary);
  }
  .themeManager-theme-content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
  }
  .themeManager-theme-btn {
    width: 26px;
    height: 26px;
    border-radius: 4px;
    background: var(--cp-color-third);
    border: 1px solid transparent;
    cursor: pointer;
    &.active {
      border-color: var(--cp-color-primary);
    }
  }
  .themeManager-theme-color{
    width: 20px;
    height: 20px;
    border-radius: 2px;
    margin: 0 auto;
  }
  .themeManager-theme-name{
    display: none;
  }
  .themeManager-theme-reset-btn {
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    height: 26px;
    line-height: 1;
    color: var(--cp-text-primary);
    background-color: var(--cp-color-third);
    padding: 0 8px;
    transition: background-color 0.3s, color 0.3s;
    &:hover {
      color: #fff;
      background-color: var(--cp-color-secondary);
    }
    &:disabled {
      color: var(--cp-text-secondary);
    }
  }
}

button {
  cursor: pointer;
  &:disabled {
    pointer-events: none;
    color: var(--cp-text-secondary);
    background-color: var(--cp-color-third);
    cursor: not-allowed;
  }
}

/* 匯出 / 匯入 / 保存 */
.themeManager-io-wrap {
  display: flex;
  gap: 8px;
  margin: 12px 0 16px;
  .themeManager-btn {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    height: 30px;
    color: var(--cp-text-primary);
    background-color: transparent;
    border: 1px solid #e9edf3;
    border-radius: 4px;
    transition: background-color 0.3s, color 0.3s, border-color 0.3s;
    &:hover {
      color: #fff;
      background-color: var(--cp-color-secondary);
      border-color: var(--cp-color-secondary);
    }
  }
}

.themeManager-file-hidden
{
  display: none;
}

.themeManager-import-msg
{
  padding: 8px 10px;
  border-radius: 8px;
  white-space: pre-wrap;
  margin-bottom: 12px;
}

.themeManager-import-msg.ok
{
  background: #e9f7ef;
  border: 1px solid #b8e0c8;
  color: #156a42;
}

.themeManager-import-msg.err
{
  background: #fff3f3;
  border: 1px solid #f1c0c0;
  color: #8b1f1f;
}

.themeManager-import-text
{
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", monospace;
}

/* Logo&輪播圖尺寸 / Logo上傳 */
.changeColor-images-wrap
{
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 12px;
  align-items: center;
  margin: 8px 0 16px;
}

.changeColor-upload {
  grid-column: 1 / -1;
  display: flex;
  gap: 8px;
  align-items: center;

  .changeColor-upload-tips {
    font-size: 12px;
    color: #666;
  }

  .changeColor-upload-input
  {
    cursor: pointer;
  }
}
</style>
