// src/composables/usePath.js
// 全域圖片路徑組合工具
export function getPath(path) {
  const base = import.meta.env.BASE_URL
  if (path.startsWith('/')) path = path.slice(1)
  return base + path
}
