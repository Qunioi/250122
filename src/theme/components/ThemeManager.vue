<!-- src/theme/components/ThemeManager.vue -->
<template>
  <teleport to="body">
    <div class="themeManager-toggle-btn" v-if="panelVisible === false">
      <button type="button" class="themeManager-btn" @click="panelVisible = true">
        顯示主題面板
      </button>
    </div>

    <div class="themeManager-wrap" v-show="panelVisible">
      <button type="button" class="themeManager-hide-btn" @click="panelVisible = false">
        隱藏面板
      </button>

      <div class="themeManager-content">
        <details class="themeManager-details">
          <summary>Logo与轮播图尺寸</summary>
          <LogoUploader />
        </details>
        <details class="themeManager-details">
          <summary>版型主題</summary>
          <PlatformSelet />
        </details>
        <details class="themeManager-details">
          <summary>版型配色</summary>
          <div class="themeManager-theme-wrap">
            <button v-for="theme in themes" :key="theme.themeID ?? theme.themeName" :class="['themeManager-theme-btn',{ active: selectedThemeName === theme.themeName },]" type="button" @click="selectTheme(theme.themeName)">
              <div class="themeManager-theme-color" :style="{background: `linear-gradient(90deg, ${theme.themeColor.primary} 0, ${theme.themeColor.primary} 50%, ${theme.themeColor.secondary} 50%, ${theme.themeColor.secondary} 100%)`,}" />
              <span class="themeManager-theme-name">
                {{ theme.themeName }} ({{ theme.themeMode }})
              </span>
            </button>
            <button class="themeManager-theme-reset" type="button" :disabled="!hasModified" :title="hasModified ? '重置當前主題所有自訂顏色' : '尚未調整，無需重置'
              " @click="resetTheme">
              重置主題
            </button>
            <span class="themeManager-theme-modified">已調整：{{ hasModified ? "true" : "false" }}</span>
          </div>

          <h4>主題顏色自訂</h4>
          <div v-if="selectedColors.length">
            <ColorPicker v-for="color in selectedColors" :key="color.id" :item="color" :modified="modifiedMap[color.id]" @update="updateColor" @remove="removeColor" />
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
              匯出配色
            </button>
            <button type="button" class="themeManager-btn themeManager-btn-import" @click="triggerImport">
              匯入配色
            </button>
            <button type="button" class="themeManager-btn themeManager-btn-save" :disabled="saving" :title="saving ? '汇出保存中…' : '下載壓縮檔（含 .css 與畫面示意圖）'
              " @click="saveTheme">
              保存
            </button>
            <input ref="fileInputRef" type="file" accept=".css,.txt" class="themeManager-file-hidden"
              @change="onFileChange" />
          </div>

          <!-- 匯入結果訊息 -->
          <div v-if="importMessage" :class="['themeManager-import-msg', importSuccess ? 'ok' : 'err']">
            <pre class="themeManager-import-text">{{ importMessage }}</pre>
          </div>

        </details>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import JSZip from "jszip";
import { toPng } from "html-to-image";

import { useTheme } from "../useTheme";
import { colorDatabase } from "../colorDatabase";

import { useConfigStore } from "@/stores/configStore"; // Pinia 僅存狀態／委派給 useTheme
import themeData from "@/assets/data/theme.json";

import ColorPicker from "./ColorPicker.vue";
import LogoUploader from "./LogoUploader.vue";
import PlatformSelet from "./PlatformSelet.vue";

/** ---- UI：面板顯示 ---- */
const panelVisible = ref(true);

/** ---- 版型編號（匯出／匯入校驗） ---- */
const ENV_VERSION = String(import.meta.env?.VITE_VERSION ?? "").trim();

/** ---- useTheme： useTheme.applyTheme / initTheme ---- */
const theme = useTheme({ namespace: "app" });
const { themes, getColorVars, persistCustom } = theme;
const getCustomThemeColors = persistCustom.get;
const saveCustomThemeColors = persistCustom.set;
const clearCustomThemeColors = persistCustom.clear;

/** ---- 與 Pinia 同步 ---- */
const config = useConfigStore();

/** ---- 選中主題／主題資料 ---- */
const selectedThemeName = ref(
  config.themeColor.value || themes[0]?.themeName || ""
);
const currentTheme = computed(() =>
  themes.find((t) => t.themeName === selectedThemeName.value)
);
const colorVars = computed(() => getColorVars(selectedThemeName.value));

/** ---- 版型編號：優先 .env，其次主題名稱 ---- */
const currentTemplateNumber = computed(
  () => ENV_VERSION || currentTheme.value?.themeName || selectedThemeName.value
);

/** ---- 色票與狀態 ---- */
const selectedColors = ref([]); // [{ id, name, varName, value: '#rrggbb' }]
const baselineMap = ref({}); // { [id]: '#rrggbb' } 來自目前主題預設值
const savedColors = ref({}); // { [id]: '#rrggbb' } 來自 localStorage

/** ---- 小工具：色彩轉換 ---- */
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

/** ---- DOM 讀取／清除 ---- */
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

/** ---- 主題切換（單一入口）：委派給 Pinia（Pinia 會再委派 useTheme.applyTheme） ---- */
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

/** ---- 是否有變更 ---- */
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

/** ---- 更新單一色 ---- */
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

/** ---- 移除單一色的自訂 ---- */
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

/** ---- 全部重置（當前主題） ---- */
function resetTheme() {
  clearThemeInlineColors();
  clearCustomThemeColors(selectedThemeName.value);
  savedColors.value = {};
  selectedColors.value = selectedColors.value.map((item) => ({
    ...item,
    value: normalizeHex(baselineMap.value[item.id]),
  }));
}

/** ---- 匯出／匯入 ---- */
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

  let captureEl = null;
  let originalStyle = "";
  let objectUrl = null;

  try {
    const tpl = String(currentTemplateNumber.value || "").trim() || "theme";
    const cssContent = buildCssContent();

    // 目標容器：優先 #capture-root，其次 .page-wrap
    captureEl =
      document.getElementById("capture-root") ||
      document.querySelector(".page-wrap") ||
      document.body;

    if (!captureEl) throw new Error("找不到可截圖的容器");

    // 固定寬度 1920 以利輸出
    originalStyle = captureEl.style.cssText || "";
    captureEl.style.cssText = `${originalStyle}; width: 1920px;`;

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

/** ---- UI 事件 ---- */
function selectTheme(themeName) {
  selectedThemeName.value = themeName;
}

/** 等待容器內所有 <img> 載入完成或失敗（失敗就隱藏） */
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
:root
{
  --cp-bg-primary: #fff;
  --cp-bg-secondary: #889ebc;
  --cp-color-bg: #f1f4f8;
  --cp-color-primary: #417ff7;
  --cp-color-third: #f5f7fa;
  --cp-text-primary: #3d4154;
  --cp-text-secondary: #97a2af;
}

.themeManager-wrap
{
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
}

.themeManager-toggle-btn
{
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
}

.themeManager-hide-btn
{
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

.themeManager-content
{
  font-size: 13px;
  padding: 24px;
  color: #000;
  background: #f9f9f9;
  border-radius: 8px;
  max-width: 480px;
  margin: 32px auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  h3
  {
    margin-top: 0;
  }
}

.themeManager-details summary
{
  padding: 10px 0;
}

/* 主題切換 */
.themeManager-theme-wrap
{
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
  flex-wrap: wrap;

  .themeManager-theme-btn
  {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 26px;
    height: 26px;
    border-radius: 4px;
    border: 1px solid transparent;
    background: #fff;
    cursor: pointer;
  }

  .themeManager-theme-btn.active
  {
    border-color: var(--cp-color-primary);
  }

  .themeManager-theme-color
  {
    width: 20px;
    height: 20px;
    border-radius: 2px;
  }

  .themeManager-theme-name
  {
    display: none;
  }

  .themeManager-theme-reset
  {
    margin-left: auto;
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
  }

  .themeManager-theme-reset:disabled
  {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* 匯出 / 匯入 / 保存 */
.themeManager-io-wrap
{
  display: flex;
  gap: 8px;
  margin: 12px 0 16px;
}

.themeManager-btn
{
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
}

.themeManager-btn-save:disabled
{
  opacity: 0.5;
  cursor: not-allowed;
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

.changeColor-upload
{
  grid-column: 1 / -1;
  display: flex;
  gap: 8px;
  align-items: center;

  .changeColor-upload-tips
  {
    font-size: 12px;
    color: #666;
  }

  .changeColor-upload-input
  {
    cursor: pointer;
  }
}
</style>
