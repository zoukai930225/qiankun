<!--
 * @Date: 2025-02-11 17:22:22
-->
<template>
  <el-dialog
    v-model="dialogVisible"
    :width="form.imgLinksArr.length === 1 ? '412px' : '732px'"
    title="图片"
    class="img-preview-dialog"
    style="padding: 0"
    :show-close="false"
  >
    <div class="content-wrapper">
      <!-- 单张图片 -->
      <div v-if="form.imgLinksArr.length == 1" class="single-img-wrapper">
        <el-image
          style="height: 371px"
          :src="form.imgLinksArr[0]"
          fit="contain"
          preview-teleported
          :preview-src-list="form.imgLinksArr"
          :initial-index="0"
        />
      </div>
      <!-- 多张图片 -->
      <div v-else class="multiple-img-wrapper">
        <div class="leftBtn" @click="prev" :class="{ disabled: currentIndex === 0 }"></div>
        <div class="img-scroll-container">
          <div
            class="img-wrapper"
            :style="{ transform: 'translateX(' + currentIndex * -slideWidth + 'px)' }"
          >
            <div class="img-item" v-for="(item, index) in form.imgLinksArr" :key="index">
              <el-image
                style="height: 371px; width: 290px"
                :src="item"
                fit="contain"
                preview-teleported
                :preview-src-list="form.imgLinksArr"
                :initial-index="index"
              />
            </div>
          </div>
        </div>

        <div class="rightBtn" @click="next" :class="{ disabled: currentIndex >= maxIndex }"></div>
      </div>
    </div>

    <template #header>
      <div class="header-class">
        <span>图片</span>
        <img
          src="@/assets/imgs/negativeReviewDashboard/close.svg"
          alt=""
          style="cursor: pointer"
          class="icon"
          @click="dialogVisible = false"
        />
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
const dialogVisible = ref(false)

const form = ref<any>({
  imgLinksArr: []
})
const totalItems = ref(0)

// 打开弹窗
const open = async (imgLinks: string) => {
  dialogVisible.value = true

  form.value.imgLinksArr = imgLinks.split(',')
  totalItems.value = form.value.imgLinksArr.length
  currentIndex.value = 0 // 重置索引
}

// 用于获取所有 img 元素的 ref
const imgRefs = ref([])

// 设置图片尺寸
const setImageDimensions = () => {
  imgRefs.value.forEach((img: HTMLImageElement | null) => {
    // 确保图片已加载完成
    if (!img) return

    const loadImage = () => {
      const { naturalWidth, naturalHeight } = img
      console.log('---宽度----', naturalWidth)
      console.log('---高度----', naturalHeight)

      if (naturalWidth > naturalHeight) {
        // 宽度更大 → 固定宽度 300px，高度自适应
        img.style.width = '300px'
        img.style.height = 'auto'
      } else {
        // 高度更大或相等 → 固定高度 200px，宽度自适应
        img.style.height = '200px'
        img.style.width = 'auto'
      }
    }

    // 如果图片已经加载完成
    if (img.complete && img.naturalWidth > 0) {
      loadImage()
    } else {
      // 否则等待加载完成后执行
      img.onload = loadImage
    }
  })
}

const visibleCount = 2 // 一次显示几张图
const slideWidth = 290 + 20 // 每张图宽度 + gap
const currentIndex = ref(0)

// 最大可切换索引
const maxIndex = computed(() => {
  return Math.max(0, totalItems.value - visibleCount)
})

// 下一张
const next = () => {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value++
  }
}

// 上一张
const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

onMounted(() => {
  nextTick(() => {
    setImageDimensions()
  })
})

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style scoped lang="scss">
:deep(.textarea) {
  .el-textarea__inner {
    resize: none;
  }
}
.img-preview-dialog {
  padding: 0 !important;
}

.dialog-footer {
  text-align: right;
}

.header-class {
  height: 54px;
  line-height: 54px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 20px;
  box-sizing: border-box;
  width: 100%;
}

.content-wrapper {
  width: 100%;
  padding: 4px 20px 20px 20px;
  box-sizing: border-box;
}
.single-img-wrapper {
  width: 372px;
  height: 371px;
  // margin: 0 auto;
  background: #f2f6fc;
  display: flex;
  justify-content: center;
  align-items: center;
}

// 多个轮播图
.multiple-img-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // max-width: 640px;
  margin: 0 auto;
  position: relative;
  .img-scroll-container {
    width: 600px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;

    // margin: 0 auto;
  }
  .img-wrapper {
    width: 290px;
    height: 371px;
    background: #f2f6fc;
    display: flex;
    align-items: center;

    transition: transform 0.3s ease-in-out;

    .dynamic-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
  .img-item {
    flex-shrink: 0;
    width: 290px;
    height: 371px;
    background: #f2f6fc;
    display: flex;
    justify-content: center;
    align-items: center;
    &:not(:last-child) {
      margin-right: 20px;
    }
  }
  .leftBtn,
  .rightBtn {
    width: 30px;
    height: 30px;
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    transition: opacity 0.3s;
  }

  .leftBtn:hover {
    background-image: url('@/assets/imgs/negativeReviewDashboard/left-arrow-hover.png');
  }

  .rightBtn:hover {
    background-image: url('@/assets/imgs/negativeReviewDashboard/right-arrow-hover.png');
  }

  .leftBtn {
    background-image: url('@/assets/imgs/negativeReviewDashboard/left-arrow.png');
  }

  .rightBtn {
    background-image: url('@/assets/imgs/negativeReviewDashboard/right-arrow.png');
  }

  .leftBtn.disabled,
  .rightBtn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
