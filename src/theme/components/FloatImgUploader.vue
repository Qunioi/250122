<template>
  <div class="themeManager-floatImg-wrap">
    <details class="themeManager-details" open>
      <summary>
        <span>左侧浮动图</span>
        <div class="themeManager-floatImg-controls">
            <button
                type="button"
                class="themeManager-floatImg-reset-all-btn"
                @click.stop="resetAllImages('left')"
                :disabled="!hasChanges('left')"
                title="重置所有左侧浮动图"
            >
                重置
            </button>
            <label class="themeManager-floatImg-toggle">
                <input type="checkbox" v-model="isLeftVisible" @click.stop />
                <span class="themeManager-floatImg-toggle-slider"></span>
            </label>
        </div>
      </summary>
      <div class="themeManager-detail-content">
        <div
          v-for="(item, index) in leftFloatImages"
          :key="'left-' + item.id"
          class="themeManager-floatImg-item"
          draggable="true"
          @dragstart="onDragStart($event, 'left', index)"
          @dragend="onDragEnd"
          @dragover="onDragOver"
          @dragleave="onDragLeave"
          @drop="onDrop($event, 'left', index)"
        >
          <div class="themeManager-floatImg-header">
            <span class="themeManager-floatImg-label" title="長按可拖曳改變排序">
              <svg width="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 7C9.32843 7 10 6.32843 10 5.5C10 4.67157 9.32843 4 8.5 4C7.67157 4 7 4.67157 7 5.5C7 6.32843 7.67157 7 8.5 7ZM8.5 13.5C9.32843 13.5 10 12.8284 10 12C10 11.1716 9.32843 10.5 8.5 10.5C7.67157 10.5 7 11.1716 7 12C7 12.8284 7.67157 13.5 8.5 13.5ZM10 18.5C10 19.3284 9.32843 20 8.5 20C7.67157 20 7 19.3284 7 18.5C7 17.6716 7.67157 17 8.5 17C9.32843 17 10 17.6716 10 18.5ZM15.5 7C16.3284 7 17 6.32843 17 5.5C17 4.67157 16.3284 4 15.5 4C14.6716 4 14 4.67157 14 5.5C14 6.32843 14.6716 7 15.5 7ZM17 12C17 12.8284 16.3284 13.5 15.5 13.5C14.6716 13.5 14 12.8284 14 12C14 11.1716 14.6716 10.5 15.5 10.5C16.3284 10.5 17 11.1716 17 12ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z"></path></svg>
              左圖{{ index + 1 }} <span v-if="imageSizes.left[index] && imageSizes.left[index] !== '检测失败'">(預設圖尺寸: {{ imageSizes.left[index] }})</span>
              <div class="themeManager-floatImg-tooltip">長按可拖曳改變排序</div>
            </span>
            <div class="themeManager-floatImg-header-actions">
              <button
                v-if="leftFloatImages.length > 1"
                type="button"
                class="themeManager-floatImg-remove-btn"
                @click.stop="removeItem('left', index)"
                title="删除此浮动图"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="themeManager-floatImg-content">
            <!-- 滑出效果图 -->
            <div class="themeManager-floatImg-preview">
              <div class="themeManager-floatImg-preview-label">滑出效果图</div>
              <div
                class="themeManager-floatImg-preview-box"
                :class="{ 'has-image': getPreviewUrl('left', index, 'default') }"
                @mouseenter="hoverPreviewIndex = `left-${index}`"
                @mouseleave="hoverPreviewIndex = null"
              >
                <template v-if="getPreviewUrl('left', index, 'default')">
                  <img
                    :src="getPreviewUrl('left', index, 'default')"
                    :alt="`左侧浮动图 ${index + 1}`"
                    @mouseenter="handleMouseEnter('left', index)"
                    @mouseleave="handleMouseLeave"
                  />
                  <!-- 只有尺寸不同时才显示尺寸 -->
                  <div class="themeManager-floatImg-size-badge" v-if="checkSizeMismatch('left', index)">
                    {{ imageSizes.left[index] }}
                  </div>
                  <!-- Hover时显示操作按钮 -->
                  <div class="themeManager-floatImg-preview-overlay" v-if="hoverPreviewIndex === `left-${index}`">
                    <button
                      v-if="getPreviewUrl('left', index, 'default')"
                      type="button"
                      class="themeManager-floatImg-delete-btn themeManager-floatImg-delete-btn-overlay"
                      @click.stop="resetDefaultImage('left', index)"
                      title="移除图片"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif"
                      class="themeManager-floatImg-input"
                      :id="`float-left-default-reupload-${index}`"
                      @change="(e) => onDefaultFileChange(e, 'left', index)"
                    />
                    <label :for="`float-left-default-reupload-${index}`" class="themeManager-floatImg-reupload-btn">
                      重新上传
                    </label>
                  </div>
                </template>
                <template v-else>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif"
                    class="themeManager-floatImg-input"
                    :id="`float-left-default-${index}`"
                    @change="(e) => onDefaultFileChange(e, 'left', index)"
                  />
                  <label :for="`float-left-default-${index}`" class="themeManager-floatImg-upload-area">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>上传图片</span>
                  </label>
                </template>
              </div>
            </div>

            <!-- 滑入效果图 -->
            <div class="themeManager-floatImg-upload">
              <div class="themeManager-floatImg-upload-label">滑入效果图</div>
              <div
                class="themeManager-floatImg-upload-box"
                :class="{ 'has-image': customImages.left[index] }"
                @mouseenter="hoverImageIndex = `left-${index}`"
                @mouseleave="hoverImageIndex = null"
              >
                <template v-if="customImages.left[index]">
                  <img :src="customImages.left[index]" :alt="`左侧浮动图 ${index + 1} 滑入`" />
                  <!-- 只有尺寸不同时才显示尺寸 -->
                  <div class="themeManager-floatImg-size-badge" v-if="checkSizeMismatch('left', index)">
                    {{ hoverImageSizes.left[index] }}
                  </div>
                  <!-- Hover时显示操作按钮 -->
                  <div class="themeManager-floatImg-preview-overlay" v-if="hoverImageIndex === `left-${index}`">
                    <button
                      type="button"
                      class="themeManager-floatImg-delete-btn themeManager-floatImg-delete-btn-overlay"
                      @click.stop="resetHoverImage('left', index)"
                      title="移除图片"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif"
                      class="themeManager-floatImg-input"
                      :id="`float-left-hover-${index}`"
                      @change="(e) => onFileChange(e, 'left', index)"
                    />
                    <label :for="`float-left-hover-${index}`" class="themeManager-floatImg-reupload-btn">
                      重新上传
                    </label>
                  </div>
                </template>
                <template v-else>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif"
                    class="themeManager-floatImg-input"
                    :id="`float-left-${index}`"
                    @change="(e) => onFileChange(e, 'left', index)"
                  />
                  <label :for="`float-left-${index}`" class="themeManager-floatImg-upload-area">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>上传图片</span>
                  </label>
                </template>
              </div>
            </div>
          </div>

          <!-- 尺寸不同警告 -->
          <div class="themeManager-floatImg-warning" v-if="checkSizeMismatch('left', index)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>滑出滑入图片尺寸不同，会导致滑鼠滑入时产生图片位移或抖动，请重新检查图片。</span>
          </div>
        </div>

        <!-- 新增浮动图按钮 -->
        <div class="themeManager-floatImg-add-wrap" v-if="leftFloatImages.length < 5">
          <button type="button" class="themeManager-floatImg-add-btn" @click="addNewItem('left')">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span>新增浮动图</span>
          </button>
        </div>
      </div>
    </details>

    <details class="themeManager-details" open>
      <summary>
        <span>右侧浮动图</span>
        <div class="themeManager-floatImg-controls">
            <button
                type="button"
                class="themeManager-floatImg-reset-all-btn"
                @click.stop="resetAllImages('right')"
                :disabled="!hasChanges('right')"
                title="重置所有右侧浮动图"
            >
                重置
            </button>
            <label class="themeManager-floatImg-toggle">
                <input type="checkbox" v-model="isRightVisible" @click.stop />
                <span class="themeManager-floatImg-toggle-slider"></span>
            </label>
        </div>
      </summary>
      <div class="themeManager-detail-content">
        <div
          v-for="(item, index) in rightFloatImages"
          :key="'right-' + item.id"
          class="themeManager-floatImg-item"
          draggable="true"
          @dragstart="onDragStart($event, 'right', index)"
          @dragend="onDragEnd"
          @dragover="onDragOver"
          @dragleave="onDragLeave"
          @drop="onDrop($event, 'right', index)"
        >
          <div class="themeManager-floatImg-header">
            <span class="themeManager-floatImg-label" title="長按可拖曳改變排序">
              <svg width="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 7C9.32843 7 10 6.32843 10 5.5C10 4.67157 9.32843 4 8.5 4C7.67157 4 7 4.67157 7 5.5C7 6.32843 7.67157 7 8.5 7ZM8.5 13.5C9.32843 13.5 10 12.8284 10 12C10 11.1716 9.32843 10.5 8.5 10.5C7.67157 10.5 7 11.1716 7 12C7 12.8284 7.67157 13.5 8.5 13.5ZM10 18.5C10 19.3284 9.32843 20 8.5 20C7.67157 20 7 19.3284 7 18.5C7 17.6716 7.67157 17 8.5 17C9.32843 17 10 17.6716 10 18.5ZM15.5 7C16.3284 7 17 6.32843 17 5.5C17 4.67157 16.3284 4 15.5 4C14.6716 4 14 4.67157 14 5.5C14 6.32843 14.6716 7 15.5 7ZM17 12C17 12.8284 16.3284 13.5 15.5 13.5C14.6716 13.5 14 12.8284 14 12C14 11.1716 14.6716 10.5 15.5 10.5C16.3284 10.5 17 11.1716 17 12ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z"></path></svg>
              右圖{{ index + 1 }} <span v-if="imageSizes.right[index] && imageSizes.right[index] !== '检测失败'">(預設圖尺寸: {{ imageSizes.right[index] }})</span>
              <div class="themeManager-floatImg-tooltip">長按可拖曳改變排序</div>
            </span>
            <div class="themeManager-floatImg-header-actions">
              <button
                v-if="rightFloatImages.length > 1"
                type="button"
                class="themeManager-floatImg-remove-btn"
                @click.stop="removeItem('right', index)"
                title="删除此浮动图"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="themeManager-floatImg-content">
            <!-- 滑出效果图 -->
            <div class="themeManager-floatImg-preview">
              <div class="themeManager-floatImg-preview-label">滑出效果图</div>
              <div
                class="themeManager-floatImg-preview-box"
                :class="{ 'has-image': getPreviewUrl('right', index, 'default') }"
                @mouseenter="hoverPreviewIndex = `right-${index}`"
                @mouseleave="hoverPreviewIndex = null"
              >
                <template v-if="getPreviewUrl('right', index, 'default')">
                  <img
                    :src="getPreviewUrl('right', index, 'default')"
                    :alt="`右侧浮动图 ${index + 1}`"
                    @mouseenter="handleMouseEnter('right', index)"
                    @mouseleave="handleMouseLeave"
                  />
                  <!-- 只有尺寸不同时才显示尺寸 -->
                  <div class="themeManager-floatImg-size-badge" v-if="checkSizeMismatch('right', index)">
                    {{ imageSizes.right[index] }}
                  </div>
                  <!-- Hover时显示操作按钮 -->
                  <div class="themeManager-floatImg-preview-overlay" v-if="hoverPreviewIndex === `right-${index}`">
                    <button
                      v-if="getPreviewUrl('right', index, 'default')"
                      type="button"
                      class="themeManager-floatImg-delete-btn themeManager-floatImg-delete-btn-overlay"
                      @click.stop="resetDefaultImage('right', index)"
                      title="移除图片"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif"
                      class="themeManager-floatImg-input"
                      :id="`float-right-default-reupload-${index}`"
                      @change="(e) => onDefaultFileChange(e, 'right', index)"
                    />
                    <label :for="`float-right-default-reupload-${index}`" class="themeManager-floatImg-reupload-btn">
                      重新上传
                    </label>
                  </div>
                </template>
                <template v-else>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif"
                    class="themeManager-floatImg-input"
                    :id="`float-right-default-${index}`"
                    @change="(e) => onDefaultFileChange(e, 'right', index)"
                  />
                  <label :for="`float-right-default-${index}`" class="themeManager-floatImg-upload-area">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>上传图片</span>
                  </label>
                </template>
              </div>
            </div>

            <!-- 滑入效果图 -->
            <div class="themeManager-floatImg-upload">
              <div class="themeManager-floatImg-upload-label">滑入效果图</div>
              <div
                class="themeManager-floatImg-upload-box"
                :class="{ 'has-image': customImages.right[index] }"
                @mouseenter="hoverImageIndex = `right-${index}`"
                @mouseleave="hoverImageIndex = null"
              >
                <template v-if="customImages.right[index]">
                  <img :src="customImages.right[index]" :alt="`右侧浮动图 ${index + 1} 滑入`" />
                  <!-- 只有尺寸不同时才显示尺寸 -->
                  <div class="themeManager-floatImg-size-badge" v-if="checkSizeMismatch('right', index)">
                    {{ hoverImageSizes.right[index] }}
                  </div>
                  <!-- Hover时显示操作按钮 -->
                  <div class="themeManager-floatImg-preview-overlay" v-if="hoverImageIndex === `right-${index}`">
                    <button
                      type="button"
                      class="themeManager-floatImg-delete-btn themeManager-floatImg-delete-btn-overlay"
                      @click.stop="resetHoverImage('right', index)"
                      title="移除图片"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif"
                      class="themeManager-floatImg-input"
                      :id="`float-right-hover-${index}`"
                      @change="(e) => onFileChange(e, 'right', index)"
                    />
                    <label :for="`float-right-hover-${index}`" class="themeManager-floatImg-reupload-btn">
                      重新上传
                    </label>
                  </div>
                </template>
                <template v-else>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif"
                    class="themeManager-floatImg-input"
                    :id="`float-right-${index}`"
                    @change="(e) => onFileChange(e, 'right', index)"
                  />
                  <label :for="`float-right-${index}`" class="themeManager-floatImg-upload-area">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>上传图片</span>
                  </label>
                </template>
              </div>
            </div>
          </div>

          <!-- 尺寸不同警告 -->
          <div class="themeManager-floatImg-warning" v-if="checkSizeMismatch('right', index)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>滑出滑入图片尺寸不同，会导致滑鼠滑入时产生图片位移或抖动，请重新检查图片。</span>
          </div>
        </div>

        <!-- 新增浮动图按钮 -->
        <div class="themeManager-floatImg-add-wrap" v-if="rightFloatImages.length < 5">
          <button type="button" class="themeManager-floatImg-add-btn" @click="addNewItem('right')">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span>新增浮动图</span>
          </button>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup>
import { getPath } from '@/composables/usePath.js';
import { useConfigStore } from '@/stores/configStore';
import data from '@/assets/data/data.json';

const MAX_SIZE = 300 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'gif'];

const config = useConfigStore();
const themeName = computed(() => config.themeColor);
const lang = computed(() => config.lang);

// 浮动图列表（支持动态添加/删除，最多5张）
const leftFloatImages = ref([]);
const rightFloatImages = ref([]);

// 从 data.json 或 localStorage 载入浮动图列表
const loadFloatImagesList = () => {
  try {
    const saved = localStorage.getItem('floatImagesList');
    if (saved) {
      const parsed = JSON.parse(saved);
      leftFloatImages.value = parsed.left || data.flatImg.left || [];
      rightFloatImages.value = parsed.right || data.flatImg.right || [];
    } else {
      leftFloatImages.value = data.flatImg.left || [];
      rightFloatImages.value = data.flatImg.right || [];
    }
  } catch (e) {
    console.error('载入浮动图列表失败:', e);
    leftFloatImages.value = data.flatImg.left || [];
    rightFloatImages.value = data.flatImg.right || [];
  }
};

// 保存浮动图列表到 localStorage
const saveFloatImagesList = () => {
  try {
    localStorage.setItem('floatImagesList', JSON.stringify({
      left: leftFloatImages.value,
      right: rightFloatImages.value
    }));
    // 触发自定义更新事件
    window.dispatchEvent(new CustomEvent('float-img-update'));
  } catch (e) {
    console.error('保存浮动图列表失败:', e);
  }
};

// 存储自定义图片（使用 localStorage）
const customImages = reactive({
  left: {},
  right: {}
});

// 存储图片尺寸
const imageSizes = reactive({
  left: {},
  right: {}
});

// 存储滑入图片尺寸
const hoverImageSizes = reactive({
  left: {},
  right: {}
});

// 当前 hover 的图片索引
const hoverImageIndex = ref(null);
const hoverPreviewIndex = ref(null);

// 浮动图显示状态（与 FloatImg.vue 同步）
const isLeftVisible = ref(true);
const isRightVisible = ref(true);

// 监听显示状态变化，保存到 localStorage 并触发 storage 事件
watch([isLeftVisible, isRightVisible], () => {
  try {
    const visibility = {
      left: isLeftVisible.value,
      right: isRightVisible.value
    };
    localStorage.setItem('floatImgVisibility', JSON.stringify(visibility));
    // 手动触发 storage 事件以同步到 FloatImg.vue
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'floatImgVisibility',
      newValue: JSON.stringify(visibility)
    }));
    // 触发自定义更新事件
    window.dispatchEvent(new CustomEvent('float-img-update'));
  } catch (e) {
    console.error('保存浮动图显示状态失败:', e);
  }
});

// 当前高亮的元素
let currentHighlight = null;

// 从 localStorage 载入自定义图片
onMounted(() => {
  loadFloatImagesList();
  loadCustomImages();
  loadVisibility();
  detectImageSizes();
  detectHoverImageSizes();
  detectImageSizes();
  detectHoverImageSizes();

  window.addEventListener('storage', onStorageChange);
  window.addEventListener('float-img-update', onUpdate);
});

onBeforeUnmount(() => {
  window.removeEventListener('storage', onStorageChange);
  window.removeEventListener('float-img-update', onUpdate);
});

// 监听更新事件
const onUpdate = () => {
  loadVisibility();
  loadFloatImagesList();
  loadCustomImages();
  detectImageSizes();
  detectHoverImageSizes();
};

// 监听 storage 事件
const onStorageChange = (e) => {
  if (e.key === 'floatImgVisibility') {
    loadVisibility();
  } else if (e.key === 'customFloatImages') {
    loadCustomImages();
    detectHoverImageSizes();
  } else if (e.key === 'floatImagesList') {
    loadFloatImagesList();
    detectImageSizes();
  }
};

// 载入显示状态
const loadVisibility = () => {
  try {
    const saved = localStorage.getItem('floatImgVisibility');
    if (saved) {
      const parsed = JSON.parse(saved);
      isLeftVisible.value = parsed.left !== false;
      isRightVisible.value = parsed.right !== false;
    }
  } catch (e) {
    console.error('载入浮动图显示状态失败:', e);
  }
};

// 载入自定义图片
const loadCustomImages = () => {
  try {
    const saved = localStorage.getItem('customFloatImages');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(customImages.left, parsed.left || {});
      Object.assign(customImages.right, parsed.right || {});
    }
  } catch (e) {
    console.error('载入自定义浮动图失败:', e);
  }
};

// 检测图片尺寸
const detectImageSizes = async () => {
  // 检测左侧图片
  for (let i = 0; i < leftFloatImages.value.length; i++) {
    const url = getPreviewUrl('left', i, 'default');
    const size = await getImageSize(url);
    imageSizes.left[i] = size;
  }

  // 检测右侧图片
  for (let i = 0; i < rightFloatImages.value.length; i++) {
    const url = getPreviewUrl('right', i, 'default');
    const size = await getImageSize(url);
    imageSizes.right[i] = size;
  }
};

// 检测滑入图片尺寸
const detectHoverImageSizes = async () => {
  // 检测左侧滑入图片
  for (let i = 0; i < leftFloatImages.value.length; i++) {
    if (customImages.left[i]) {
      const size = await getImageSize(customImages.left[i]);
      hoverImageSizes.left[i] = size;
    }
  }

  // 检测右侧滑入图片
  for (let i = 0; i < rightFloatImages.value.length; i++) {
    if (customImages.right[i]) {
      const size = await getImageSize(customImages.right[i]);
      hoverImageSizes.right[i] = size;
    }
  }
};

// 获取图片尺寸
const getImageSize = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve(`${img.naturalWidth}x${img.naturalHeight}px`);
    };
    img.onerror = () => {
      resolve('检测失败');
    };
    img.src = url;
  });
};

// 检查尺寸是否不匹配
const checkSizeMismatch = (side, index) => {
  const defaultSize = imageSizes[side][index];
  const hoverSize = hoverImageSizes[side][index];

  if (!defaultSize || !hoverSize || defaultSize === '检测失败' || hoverSize === '检测失败') {
    return false;
  }

  return defaultSize !== hoverSize;
};

// 保存自定义图片到 localStorage
const saveCustomImages = () => {
  try {
    localStorage.setItem('customFloatImages', JSON.stringify(customImages));
    // 触发自定义更新事件
    window.dispatchEvent(new CustomEvent('float-img-update'));
  } catch (e) {
    console.error('保存自定义浮动图失败:', e);
  }
};

// 获取预览图片 URL
const getPreviewUrl = (side, index, type = 'default') => {
  // type: 'default' 为滑出效果图，'hover' 为滑入效果图
  if (type === 'hover' && customImages[side][index]) {
    return customImages[side][index];
  }

  // 滑出效果图使用预设图片
  const images = side === 'left' ? leftFloatImages.value : rightFloatImages.value;
  const item = images[index];

  if (!item || !item.imgDefault) {
    return '';
  }

  const filename = item.imgDefault;

  // 如果是 DataURL（上传的图片），直接返回
  if (filename.startsWith('data:')) {
    return filename;
  }

  // 否则使用主题路径
  return getPath(`/image/${themeName.value}/lang/${lang.value}/${filename}`);
};

// 处理滑鼠进入事件（高亮对应的浮动图）
const handleMouseEnter = (side, index) => {
  removeHighlight();

  const selector = side === 'left'
    ? `.float-left-wrap a:nth-child(${index + 1})`
    : `.float-right-wrap a:nth-child(${index + 1})`;

  const targetEl = document.querySelector(selector);
  if (targetEl) {
    const highlightDiv = document.createElement('div');
    highlightDiv.className = 'ele-highlight ele-highlight-float';
    highlightDiv.textContent = `${side === 'left' ? '左' : '右'} ${index + 1}`;

    targetEl.style.position = 'relative';
    targetEl.appendChild(highlightDiv);
    currentHighlight = highlightDiv;
  }
};

// 处理滑鼠离开事件
const handleMouseLeave = () => {
  removeHighlight();
};

// 移除高亮
const removeHighlight = () => {
  if (currentHighlight) {
    currentHighlight.remove();
    currentHighlight = null;
  }
};

// 处理文件上传
const onFileChange = async (e, side, index) => {
  const file = e?.target?.files?.[0];
  if (!file) return;

  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (!ALLOWED_TYPES.includes(file.type) || !ALLOWED_EXTS.includes(ext)) {
    alert('仅接受 JPG、PNG 或 GIF 档案');
    resetInput(e);
    return;
  }

  if (file.size > MAX_SIZE) {
    alert('档案过大，请压缩至 300KB 以下');
    resetInput(e);
    return;
  }

  try {
    const dataUrl = await readFileAsDataURL(file);
    customImages[side][index] = dataUrl;
    saveCustomImages();

    // 重新检测滑入图片尺寸
    const size = await getImageSize(dataUrl);
    hoverImageSizes[side][index] = size;

    resetInput(e);
    // alert(`${side === 'left' ? '左侧' : '右侧'}浮动图 ${index + 1} 滑入效果图已更新完成`);
  } catch (error) {
    alert('图片读取失败，请重新选择');
    resetInput(e);
  }
};

// 处理滑出效果图上传
const onDefaultFileChange = async (e, side, index) => {
  const file = e?.target?.files?.[0];
  if (!file) return;

  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (!ALLOWED_TYPES.includes(file.type) || !ALLOWED_EXTS.includes(ext)) {
    alert('仅接受 JPG、PNG 或 GIF 档案');
    resetInput(e);
    return;
  }

  if (file.size > MAX_SIZE) {
    alert('档案过大，请压缩至 300KB 以下');
    resetInput(e);
    return;
  }

  try {
    const dataUrl = await readFileAsDataURL(file);

    // 更新列表中的 imgDefault
    const images = side === 'left' ? leftFloatImages : rightFloatImages;
    if (images.value[index]) {
      images.value[index].imgDefault = dataUrl;
      saveFloatImagesList();

      // 重新检测滑出图片尺寸
      const size = await getImageSize(dataUrl);
      imageSizes[side][index] = size;

      resetInput(e);
    //   alert(`${side === 'left' ? '左侧' : '右侧'}浮动图 ${index + 1} 滑出效果图已更新完成`);
    }
  } catch (error) {
    alert('图片读取失败，请重新选择');
    resetInput(e);
  }
};

// 检查滑出图片是否已修改
const isDefaultModified = (side, index) => {
  const images = side === 'left' ? leftFloatImages : rightFloatImages;
  const defaultData = side === 'left' ? data.flatImg.left : data.flatImg.right;

  const current = images.value[index]?.imgDefault;
  const original = defaultData[index]?.imgDefault || '';

  // 如果当前是 dataURL (上传的)，或者与原始值不同
  if (current && current.startsWith('data:')) return true;
  return current !== original;
};

// 删除滑入图片 (Slide-in)
const resetHoverImage = (side, index) => {
  // 删除滑入图片（自定义图片）
  if (customImages[side][index]) {
    delete customImages[side][index];
    saveCustomImages();
  }

  // 清除滑入图片尺寸
  if (hoverImageSizes[side][index]) {
    delete hoverImageSizes[side][index];
  }

  // 手动触发 storage 事件以同步到 FloatImg.vue
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'customFloatImages',
    newValue: localStorage.getItem('customFloatImages')
  }));
};

// --- 拖曳排序邏輯 ---

const draggingIndex = ref(null);
const draggingSide = ref(null);

const onDragStart = (e, side, index) => {
  draggingIndex.value = index;
  draggingSide.value = side;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.dropEffect = 'move';
  // 設置拖曳時的透明度，讓用戶知道正在拖曳
  e.target.style.opacity = '0.5';
};

const onDragEnd = (e) => {
  draggingIndex.value = null;
  draggingSide.value = null;
  e.target.style.opacity = '1';
  
  // 移除所有可能的 drag-over 樣式
  document.querySelectorAll('.themeManager-floatImg-item').forEach(el => {
    el.classList.remove('drag-over');
  });
};

const onDragOver = (e) => {
  e.preventDefault(); // 允許放置
  e.dataTransfer.dropEffect = 'move';
  
  // 添加視覺提示
  const item = e.target.closest('.themeManager-floatImg-item');
  if (item) {
    item.classList.add('drag-over');
  }
};

const onDragLeave = (e) => {
  const item = e.target.closest('.themeManager-floatImg-item');
  if (item) {
    item.classList.remove('drag-over');
  }
};

const onDrop = (e, side, index) => {
  e.preventDefault();
  
  // 移除樣式
  const item = e.target.closest('.themeManager-floatImg-item');
  if (item) {
    item.classList.remove('drag-over');
  }

  // 檢查是否同側且索引不同
  if (draggingSide.value === side && draggingIndex.value !== null && draggingIndex.value !== index) {
    moveItem(side, draggingIndex.value, index);
  }
};

// 移動項目並同步所有相關數據
const moveItem = (side, fromIndex, toIndex) => {
  // 1. 移動主列表 (leftFloatImages / rightFloatImages)
  const list = side === 'left' ? leftFloatImages : rightFloatImages;
  const itemToMove = list.value[fromIndex];
  list.value.splice(fromIndex, 1);
  list.value.splice(toIndex, 0, itemToMove);
  
  // 2. 同步移動 customImages (滑入圖)
  // 將對象轉換為數組 -> 移動 -> 轉回對象
  const syncObject = (objRef) => {
    const arr = [];
    // 找出最大索引以確定數組長度
    const maxIndex = Math.max(...Object.keys(objRef[side]).map(Number), Math.max(fromIndex, toIndex));
    
    for (let i = 0; i <= maxIndex; i++) {
      arr[i] = objRef[side][i];
    }
    
    // 移動數組元素
    const valToMove = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, valToMove);
    
    // 重建對象
    const newObj = {};
    arr.forEach((val, i) => {
      if (val !== undefined) {
        newObj[i] = val;
      }
    });
    objRef[side] = newObj;
  };

  syncObject(customImages);
  syncObject(imageSizes);
  syncObject(hoverImageSizes);

  // 3. 保存所有變更
  saveFloatImagesList();
  saveCustomImages();
};

// 删除滑出图片 (Slide-out) - 直接清空
const resetDefaultImage = (side, index) => {
  const images = side === 'left' ? leftFloatImages : rightFloatImages;

  if (images.value[index]) {
    // 直接清空图片
    images.value[index].imgDefault = '';
    saveFloatImagesList();

    // 清除尺寸信息
    imageSizes[side][index] = '';

    // 手动触发 storage 事件
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'floatImagesList',
      newValue: localStorage.getItem('floatImagesList')
    }));
  }
};

// 检查是否有变更（用于判断重置按钮是否可用）
const hasChanges = (side) => {
  // 检查是否有自定义图片
  if (Object.keys(customImages[side]).length > 0) {
    return true;
  }

  // 检查列表是否与预设不同
  const images = side === 'left' ? leftFloatImages : rightFloatImages;
  const defaultData = side === 'left' ? data.flatImg.left : data.flatImg.right;

  if (images.value.length !== defaultData.length) {
    return true;
  }

  // 检查每个项目的 imgDefault 是否与预设相同
  for (let i = 0; i < images.value.length; i++) {
    if (images.value[i].imgDefault !== defaultData[i]?.imgDefault) {
      return true;
    }
  }

  return false;
};

// 重置所有图片
const resetAllImages = (side) => {
  if (!hasChanges(side)) {
    return;
  }

  const confirmed = confirm(`确定要重置所有${side === 'left' ? '左侧' : '右侧'}浮动图吗？`);
  if (!confirmed) return;

  // 清除所有滑入图片
  customImages[side] = {};
  saveCustomImages();

  // 清除所有滑入图片尺寸
  hoverImageSizes[side] = {};

  // 恢复所有滑出图片为预设值
  const images = side === 'left' ? leftFloatImages : rightFloatImages;
  const defaultData = side === 'left' ? data.flatImg.left : data.flatImg.right;

  images.value = JSON.parse(JSON.stringify(defaultData));
  saveFloatImagesList();

  // 重新检测所有滑出图片尺寸
  detectImageSizes();

  // 手动触发 storage 事件以同步到 FloatImg.vue
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'customFloatImages',
    newValue: localStorage.getItem('customFloatImages')
  }));
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'floatImagesList',
    newValue: localStorage.getItem('floatImagesList')
  }));

//   alert(`已重置所有${side === 'left' ? '左侧' : '右侧'}浮动图`);
};

// 新增浮动图项目
const addNewItem = (side) => {
  const images = side === 'left' ? leftFloatImages : rightFloatImages;

  if (images.value.length >= 5) {
    alert('最多只能添加 5 张浮动图');
    return;
  }

  const newId = Math.max(...images.value.map(item => item.id), 0) + 1;
  images.value.push({
    id: newId,
    imgDefault: '',
    imgHover: ''
  });

  saveFloatImagesList();
  // alert(`已新增${side === 'left' ? '左侧' : '右侧'}浮动图 ${images.value.length}`);
};

// 删除浮动图项目
const removeItem = (side, index) => {
  const confirmed = confirm(`确定要删除${side === 'left' ? '左侧' : '右侧'}浮动图 ${index + 1} 吗？`);
  if (!confirmed) return;

  const images = side === 'left' ? leftFloatImages : rightFloatImages;

  if (images.value.length <= 1) {
    alert('至少需要保留一张浮动图');
    return;
  }

  // 删除项目
  images.value.splice(index, 1);

  // 删除对应的自定义图片
  delete customImages[side][index];

  // 重新整理自定义图片的索引
  const newCustomImages = {};
  Object.keys(customImages[side]).forEach(key => {
    const oldIndex = parseInt(key);
    if (oldIndex > index) {
      newCustomImages[oldIndex - 1] = customImages[side][key];
    } else if (oldIndex < index) {
      newCustomImages[oldIndex] = customImages[side][key];
    }
  });
  customImages[side] = newCustomImages;

  saveFloatImagesList();
  saveCustomImages();
//   alert(`已删除${side === 'left' ? '左侧' : '右侧'}浮动图 ${index + 1}`);
};

// 清理输入
const resetInput = (e) => {
  if (e?.target) e.target.value = '';
};

// 读取文件为 DataURL
const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
};

// 清理高亮元素
onUnmounted(() => {
  removeHighlight();
});
</script>

<style scoped lang="scss">
:global(.ele-highlight-float) {
  align-items: center;
  background-color: #55d97f99;
  color: #fff;
  display: flex;
  font-size: 1.2rem;
  font-weight: 700;
  height: 100%;
  justify-content: center;
  left: 0;
  pointer-events: none;
  position: absolute;
  text-shadow: 0 0 10px rgba(0, 0, 0, .7);
  top: 0;
  width: 100%;
  z-index: 999;
  transition: all .3s ease;
}

.themeManager-floatImg-wrap {
  display: flex;
  flex-direction: column;
  gap: 0;
}

// Summary 控制按钮样式
:global(.themeManager-details summary) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}

.themeManager-floatImg-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  margin-right: 30px;
}

.themeManager-floatImg-toggle {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  cursor: pointer;
  input {
    opacity: 0;
    width: 0;
    height: 0;
    &:checked + .themeManager-floatImg-toggle-slider {
      background-color: var(--cp-color-secondary);
      &::before {
        transform: translateX(20px);
      }
    }
  }
}

.themeManager-floatImg-toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 20px;
  transition: .3s;
  &::before {
    content: "";
    position: absolute;
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: .3s;
  }
}

.themeManager-floatImg-reset-all-btn {
  cursor: pointer;
  padding: 4px 12px;
  font-size: 12px;
  background-color: var(--cp-color-third);
  border: none;
  border-radius: 4px;
  transition: background-color .3s, opacity .3s;
  &:hover:not(:disabled) {
    color: #fff;
    background-color: var(--cp-color-secondary);
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.themeManager-floatImg-item {
  background: var(--cp-color-third);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 4px;
  transition: border-color .3s, opacity 0.2s;
  cursor: grab; /* 提示可拖曳 */

  &:active {
    cursor: grabbing;
  }

  /* 拖曳時的樣式 */
  &.drag-over {
    border: 2px dashed var(--cp-color-secondary);
    background: rgba(var(--cp-color-secondary-rgb), 0.1);
  }

  &:hover {
    border-color: var(--cp-color-secondary);
  }
}

.themeManager-floatImg-label {
  font-weight: 500;
  color: var(--cp-text-primary);
  position: relative; /* 為 Tooltip 定位 */
  cursor: help;

  /* Tooltip 樣式 */
  .themeManager-floatImg-tooltip {
    display: none;
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 8px;
    padding: 6px 10px;
    background-color: #333;
    color: #fff;
    font-size: 12px;
    border-radius: 4px;
    white-space: nowrap;
    z-index: 10;
    pointer-events: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    /* 小三角形 */
    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 5px;
      border-style: solid;
      border-color: #333 transparent transparent transparent;
    }
  }

  &:hover .themeManager-floatImg-tooltip {
    display: block;
    animation: fadeIn 0.2s ease-in-out;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, 5px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

.themeManager-floatImg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.themeManager-floatImg-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.themeManager-floatImg-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--cp-text-primary);
}

.themeManager-floatImg-delete-btn,
.themeManager-floatImg-remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: transparent;
  border: 1px solid #e8e8ef;
  cursor: pointer;
  transition: all .3s;
  svg {
    stroke: var(--cp-text-secondary);
    transition: stroke .3s;
  }
  &:hover:not(:disabled) {
    background: #fee;
    border-color: #f44;
    svg {
      stroke: #f44;
    }
  }
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.themeManager-floatImg-delete-btn-overlay {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  &:hover {
    background: #fee;
  }
}

.themeManager-floatImg-add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px;
  font-size: 13px;
  color: var(--cp-color-secondary);
  background: transparent;
  border: 1px dashed var(--cp-color-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all .3s;
  svg {
    stroke: var(--cp-color-secondary);
    transition: stroke .3s;
  }
  &:hover {
    background: rgba(65, 127, 247, 0.05);
    border-color: var(--cp-color-primary);
    color: var(--cp-color-primary);
    svg {
      stroke: var(--cp-color-primary);
    }
  }
}

.themeManager-floatImg-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.themeManager-floatImg-preview,
.themeManager-floatImg-upload {
  display: flex;
  flex-direction: column;
}

.themeManager-floatImg-preview-label,
.themeManager-floatImg-upload-label {
  font-size: 12px;
  color: var(--cp-text-secondary);
  margin-bottom: 8px;
  font-weight: 500;
}

.themeManager-floatImg-preview-box {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #f5f7fa;
  border: 1px solid #e8e8ef;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color .3s;
  &:hover {
    border-color: var(--cp-color-secondary);
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.themeManager-floatImg-upload-box {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #f5f7fa;
  border: 1px solid #e8e8ef;
  border-radius: 4px;
  overflow: hidden;
  &.has-image {
    background: transparent;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}

.themeManager-floatImg-size-badge {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: var(--cp-red);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  pointer-events: none;
}

.themeManager-floatImg-reupload {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.themeManager-floatImg-preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.themeManager-floatImg-reupload-btn {
  padding: 8px 16px;
  font-size: 12px;
  background: var(--cp-color-secondary);
  background-color: var(--cp-color-third);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color .3s;
  &:hover {
    color: #fff;
    background: var(--cp-color-secondary);
  }
}

.themeManager-floatImg-warning {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 12px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 6px;
  svg {
    flex-shrink: 0;
    stroke: #ff9800;
    margin-top: 2px;
  }
  span {
    font-size: 12px;
    color: #856404;
    line-height: 1.5;
  }
}

.themeManager-floatImg-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  border: 0;
}

.themeManager-floatImg-upload-area {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  border: 1px dashed #d0d0d0;
  border-radius: 4px;
  cursor: pointer;
  transition: all .3s;
  gap: 8px;
  svg {
    stroke: var(--cp-text-third);
    transition: stroke .3s;
  }
  span {
    font-size: 12px;
    color: var(--cp-text-secondary);
    transition: color .3s;
  }
  &:hover {
    background: #eef2f7;
    border-color: var(--cp-color-secondary);
    svg {
      stroke: var(--cp-color-secondary);
    }
    span {
      color: var(--cp-color-secondary);
    }
  }
}
</style>
