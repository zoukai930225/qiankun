<template>
  <scheme-dialog ref="dialogRef" :name="dialogName" title="数据备注" :width="1100">
    <template #card>
      <div class="remark-dialog">
        <div class="left-panel">
          <div class="image-wrapper">
            <image-display :src="goodsInfo.imageUrl" width="442" height="535" fit="contain" />
          </div>
        </div>

        <div class="right-panel">
          <el-scrollbar ref="scrollbarRef">
            <div class="right-content-container">
              <div class="info-section">
                <FormDescription :column="1" label-width="84px" class="goods-description">
                  <FormDescriptionItem label="数据备注" align-items="flex-start">
                    <el-scrollbar v-if="remarkList.length" ref="remarkScrollbarRef">
                      <ul class="remark-list">
                        <li
                          v-for="(item, index) in remarkList"
                          :key="item.remarkId || item.remarkTime"
                          class="remark-item"
                        >
                          <div class="timeline-axis">
                            <el-image :src="dotIcon" />
                            <div v-if="index !== remarkList.length - 1" class="dashed-line"></div>
                          </div>

                          <div class="content-box">
                            <div class="flex items-center gap-6px">
                              <avatar-display
                                :avatars="[
                                  { name: item.remarkUserName, src: item.remarkUserAvatar }
                                ]"
                                :size="16"
                                :name-size="14"
                              />
                              <div class="time">{{ item.remarkTime || '-' }}</div>
                            </div>
                            <div class="remark-body">
                              <div class="remark-text">
                                {{ item.remark || '-' }}
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </el-scrollbar>
                    <span v-else>-</span>
                  </FormDescriptionItem>
                </FormDescription>
              </div>

              <div class="remark-input-area">
                <!-- <div class="input-actions-bar">
                  <el-button link type="primary" icon="Plus" @click="handleAddInput"
                    >添加备注</el-button
                  >
                </div> -->

                <div class="input-list" ref="inputListRef">
                  <div v-for="(item, index) in inputList" :key="item.key" class="input-item">
                    <el-form>
                      <el-form-item label="备注填写">
                        <s-textarea
                          v-model="item.value"
                          :rows="3"
                          maxlength="200"
                          :placeholder="`请输入备注`"
                          show-word-limit
                        />
                        <el-button
                          v-if="inputList.length > 1"
                          type="danger"
                          link
                          icon="Delete"
                          class="delete-btn"
                          @click="handleRemoveInput(index)"
                        />
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </template>
    <template #button>
      <el-button @click="dialogRef?.close()">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
    </template>
  </scheme-dialog>
</template>

<script setup lang="ts">
import { ref, provide, nextTick, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import { addRemarkInfo, getRemarkInfo } from '@/api/gallery'
import { useMessage } from '@/hooks/web/useMessage'
import { FormDescription, FormDescriptionItem } from '@/components/Descriptions'
import type { ElScrollbar } from 'element-plus'
const dotIcon = new URL('@/assets/svgs/gallery/dot.svg', import.meta.url).href

const dialogName = 'FavoritesRemarkDialog'
type RemarkRecord = {
  remarkId?: string
  remark?: string
  remarkTime?: string
  remarkUserId?: string
  remarkUserName?: string
  remarkUserAvatar?: string
}

type GoodsInfo = {
  goodsId?: string
  favoritesId?: string
  imageUrl?: string
  goodsCode?: string
  channel?: string
  lastUpdatePersonInfo?: any
}

type InputItem = {
  key: number
  value: string
}

const dialogRef = ref()
// 滚动条 Ref
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const remarkScrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

const dataValue = ref<Record<string, any>>({})
const bukValue = ref<Record<string, any>>({})
const viewType = ref('edit')
const title = ref('数据备注')
const loading = ref(false)
const remarkList = ref<RemarkRecord[]>([])

const inputList = ref<InputItem[]>([{ key: Date.now(), value: '' }])
const inputListRef = ref<HTMLElement>()

const remarksLoading = ref(false)
const submitting = ref(false)
const goodsInfo = ref<GoodsInfo>({
  goodsId: '',
  favoritesId: '',
  imageUrl: '',
  goodsCode: '',
  channel: '',
  lastUpdatePersonInfo: null
})

const message = useMessage()

provide(`${dialogName}Details`, { dataValue, bukValue, viewType, title, loading })

const buildSnapshot = () => ({
  goodsInfo: { ...goodsInfo.value },
  remarkList: cloneDeep(remarkList.value),
  inputList: cloneDeep(inputList.value)
})

const syncBukValue = () => {
  const snapshot = buildSnapshot()
  dataValue.value = snapshot
  bukValue.value = cloneDeep(snapshot)
}

const syncDataValue = () => {
  dataValue.value = buildSnapshot()
}

const fetchRemarkList = async () => {
  if (!goodsInfo.value.goodsId) {
    remarkList.value = []
    syncBukValue()
    return
  }
  remarksLoading.value = true
  try {
    const res = await getRemarkInfo({
      goodsId: goodsInfo.value.goodsId,
      favoritesId: goodsInfo.value.favoritesId
    })
    remarkList.value = Array.isArray(res) ? res : res ? [res] : []
    syncBukValue()
  } catch (error) {
    console.error('获取备注失败', error)
  } finally {
    remarksLoading.value = false
  }
}

const open = async (payload: GoodsInfo) => {
  goodsInfo.value = {
    ...goodsInfo.value,
    ...payload
  }
  console.log('goodsInfo.value', goodsInfo.value)
  inputList.value = [{ key: Date.now(), value: '' }]
  await fetchRemarkList()
  dialogRef.value?.openDialog?.(
    () => {},
    () => {}
  )
}

watch(
  () => inputList.value,
  () => {
    syncDataValue()
  },
  { deep: true }
)

const scrollRemarksToBottom = () => {
  const wrap = remarkScrollbarRef.value?.wrapRef
  wrap?.scrollTo?.({ top: wrap.scrollHeight, behavior: 'smooth' })
}

const handleAddInput = async () => {
  inputList.value.push({ key: Date.now(), value: '' })
  await nextTick()

  // 滚动到底部逻辑优化：使用 inputListRef 的最后一个子元素
  if (inputListRef.value) {
    const lastItem = inputListRef.value.lastElementChild
    if (lastItem) {
      lastItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  const wrap = scrollbarRef.value?.wrapRef
  wrap?.scrollTo?.({ top: wrap.scrollHeight, behavior: 'smooth' })
}

const handleRemoveInput = (index: number) => {
  inputList.value.splice(index, 1)
}

const handleSubmit = async () => {
  const validRemarks = inputList.value.map((item) => item.value.trim()).filter((val) => val !== '')

  if (validRemarks.length === 0) {
    message?.warning?.('请至少填写一条备注')
    return
  }
  if (!goodsInfo.value.goodsId) {
    message?.warning?.('缺少商品信息')
    return
  }

  try {
    submitting.value = true
    await addRemarkInfo({
      goodsId: goodsInfo.value.goodsId,
      favoritesId: goodsInfo.value.favoritesId,
      remark: validRemarks
    })

    message?.success?.('添加成功')
    inputList.value = [{ key: Date.now(), value: '' }]
    await fetchRemarkList()
    await nextTick()
    scrollRemarksToBottom()
    syncBukValue()
    // dialogRef.value?.close()
  } catch (error) {
    console.error('添加备注失败', error)
    message?.error?.('添加失败')
  } finally {
    submitting.value = false
  }
}

defineExpose({ open })
</script>

<style scoped lang="scss">
.remark-dialog {
  display: flex;
  gap: 12px;
  /* 确保弹窗内容区域高度固定，以适应左侧图片高度 */
  height: 535px;
}

.left-panel {
  width: 442px;
  flex-shrink: 0;
  height: 100%;
}

.image-wrapper {
  //   width: 376px;
  //   height: 535px; /* 图片区域高度固定 */
  //   border: 1px dashed #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  //   background: #f9fbff;
  //   border-radius: 4px;
  overflow: hidden;
}

.right-panel {
  flex: 1;
  min-width: 0;
  height: 100%;
  /* 移除原有的 flex 布局，改由内部 scrollbar 接管 */
  //   border: 1px solid #f0f0f0;
  border-radius: 4px;
  background-color: #fff;
  :deep(.el-scrollbar) {
    width: 100%;
  }
}

/* 滚动条内部容器 padding */
.right-content-container {
  //   padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  padding-left: 8px;
  border-left: 3px solid var(--el-color-primary);
  line-height: 1.2;
}

.remark-list {
  max-height: 420px;
  /* 增加左侧内边距，根据需要调整，防止左侧太贴边 */
  padding-left: 4px;
}

.remark-item {
  display: flex;
  gap: 8px; /* 点与内容之间的间距 */
  /* 使用 padding-bottom 代替 margin-bottom，确保线条能连接到下一个元素 */
  padding-bottom: 20px;
  position: relative;

  &:last-child {
    padding-bottom: 0;
  }

  .time {
    color: #8c8e90;
  }
}

/* 时间轴轴体容器 */
.timeline-axis {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 宽度与 DotIcon 或 Avatar 对齐，防止错位 */
  width: 14px;
  flex-shrink: 0;
  position: relative;
  /* 适当的 padding-top 让点与右侧 Avatar 垂直居中对齐 */
  padding-top: 4px;
}

/* 圆点图标 */
.dot-icon {
  //   width: 6px;
  //   height: 6px;
  color: #d9d9d9; /* 如果 SVG 也是用 currentColor，这里控制点的颜色，参考图似乎是灰色 */
  z-index: 1; /* 确保点在线的上方 */
  background: #fff; /* 避免线穿过点的中间 */
}

/* 虚线 */
.dashed-line {
  position: absolute;
  top: 18px; /* 从点的下方开始 */
  bottom: -20px; /* 延伸到 padding-bottom 的底部，连接下一个点 */
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  border-left: 1px dashed #e5e5e5;
  height: calc(100% + 14px); /* 这里的计算是为了填补间距，也可以直接用 absolute bottom 负值 */
}

/* 右侧内容容器 */
.content-box {
  flex: 1;
  min-width: 0;
}

/* 调整原有样式 */
.remark-body {
  margin-top: 6px;
  margin-left: 0; /* 移除原有的 margin-left，因为现在是 flex 布局 */
}
.remark-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 13px;
}

.remark-text {
  color: #555;
  line-height: 1.6;
  word-break: break-all;
  white-space: pre-wrap;
}

/* 输入区域 */
.remark-input-area {
  display: flex;
  flex-direction: column;
  gap: 16px;
  //   padding-top: 10px;
  //   border-top: 1px dashed #eee;
}

.input-actions-bar {
  display: flex;
  align-items: center;
}

.input-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-item {
  display: flex;
  gap: 8px;
  align-items: flex-start;

  :deep(.el-form) {
    width: 100%;

    .el-form-item {
      margin-bottom: 0;
      .el-form-item__content {
        display: flex;
        align-items: flex-start;
        //   align-items: center;
        .s-text-area {
          flex: 1;
        }
      }
    }

    .delete-btn {
      margin-top: 4px;
      margin-right: 8px;
    }
  }
}

.remark-footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}
</style>
