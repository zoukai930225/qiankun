<template>
  <div class="table-container">
    <!-- 左边按钮 -->
    <img
      src="@/assets/imgs/team/disable-table-left.png"
      alt=""
      v-if="isAtStart"
      class="circle-button left"
    />
    <img
      src="@/assets/imgs/team/table-left.png"
      @click="scrollLeft"
      alt=""
      class="circle-button left"
      v-else
    />
    <div class="table-content" ref="tableContent" @scroll="checkScrollPosition">
      <!-- table标题 -->
      <div class="table-header" v-if="dates?.length">
        <div class="name sticky flex-row topName">
          <div style="height: 42px; margin-top: 10px">
            <span
              style="
                background: #f9fafd;
                height: 42px;
                padding: 5px;
                box-sizing: border-box;
                display: inline-block;
              "
            >
              <span class="openName"> {{ openAll ? '收起全部' : '展开全部' }}</span>
              <el-switch v-model="openAll" @change="handlelChange" />
            </span>
          </div>
        </div>
        <div
          v-for="(date, index) in dates"
          :key="`${index}${date.label}`"
          class="table-cell header-cell"
        >
          {{ date.label }}
        </div>
      </div>

      <!-- table 内容 -->
      <div class="table-body" v-if="tableData?.length" style="height: scale(100vh - 400px)">
        <div v-for="(row, rowIndex) in tableData" :key="row.id" class="table-row">
          <div class="name-wapper sticky">
            <div
              class="name"
              style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding-left: 40px;
                box-sizing: border-box;
                position: relative;
              "
              :style="{ backgroundColor: formatBgColor(row?.deptRank) }"
              :class="{ MT10: formatMT(row) }"
            >
              <span
                class="bumen"
                :style="{
                  backgroundColor: formatTopColor(row?.deptRank),
                  padding: formatTopPadding(rowIndex, row)
                }"
                :class="{ bumenFirst: isFirstBumen(row) }"
              >
                <span v-if="row.dept?.split('-')[1] == 1">
                  {{ row.dept?.split('-')[0] }}
                </span>
              </span>
              <img :src="row.avatarOrigin" alt="" class="avator" />
              <span>{{ row.name }}</span>
            </div>
          </div>

          <div
            v-for="date in dates"
            :key="`${row.id}-${date.prop}`"
            class="table-cell"
            :class="{
              ...formatWeeks(date),
              'drag-over': draggingOverIndex == `${row.id}-${date.prop}`
            }"
            @click="canDraggable"
            @dblclick="handleDoubleClick(date, row[date.prop], rowIndex)"
          >
            <div
              v-if="formatShowRemark(tableData?.[rowIndex]?.[date.prop])"
              style="
                width: 100%;
                white-space: pre-wrap;
                word-break: break-word;
                color: #333333;
                font-size: 12px;
              "
              >{{ tableData?.[rowIndex]?.[date.prop][0]?.remark }}</div
            >
            <draggable
              v-else
              class="draggable-container"
              :class="{ h100: formatEmpty(row[date.prop]) }"
              v-model="row[date.prop]"
              @change="handleTableChange(rowIndex, date.prop, $event)"
              :group="{ name: 'shared', pull: true, put: true }"
              allow-drop="true"
              animation="200ms"
              :disabled="canDrop"
              :focus-fallback="true"
              @dragover="handleDragOver(`${row.id}-${date.prop}`)"
              @dragleave="handleDragLeave"
              @end="handleOnEnd"
            >
              <template #item="{ element, index }">
                <div
                  class="flex-column"
                  :key="element.id"
                  v-if="index < (!tableData[rowIndex].openFlag ? 2 : 10)"
                >
                  <div class="table-cell-content" :class="formatClass(element)">
                    <div class="logo-right">
                      <div class="status" :class="formatStatus(element?.calendarState)">
                        {{ formatStatusInner(element?.calendarState) }}
                      </div>
                    </div>
                    <div class="flex-column">
                      <div class="felx-row top-info">
                        <div style="height: 28px">
                          <el-popover
                            placement="right"
                            :width="225"
                            trigger="hover"
                            :show-arrow="false"
                            :offset="20"
                          >
                            <template #reference>
                              <img class="logo" :src="formatGoodImg(element?.goodsImage)" />
                            </template>
                            <img
                              style="width: 200px; height: 200px"
                              :src="formatGoodImg(element?.goodsImage)"
                            />
                          </el-popover>
                        </div>

                        <div
                          class="flex-column"
                          style="justify-content: space-between; margin-left: 2px"
                        >
                          <div class="felx-row" style="margin-bottom: 2px">
                            <el-tooltip
                              class="box-item"
                              effect="dark"
                              :content="element?.goodsCode"
                              placement="top"
                            >
                              <div class="title">{{ element?.goodsCode }}</div>
                            </el-tooltip>
                          </div>
                          <div class="felx-row">
                            <div
                              class="btn-common type"
                              :class="formatClassBtn(forOneType(element?.demandType)?.slice(0, 2))"
                              >{{ forOneType(element?.demandType)?.slice(0, 2) }}</div
                            >
                            <el-tooltip
                              class="box-item"
                              effect="dark"
                              :content="`${formarTwoType(element?.demandType, element?.secondDemandType)}`"
                              placement="top"
                            >
                              <div class="desc-two"
                                >{{
                                  `${formarTwoType(element?.demandType, element?.secondDemandType)}`
                                }}
                              </div>
                            </el-tooltip>
                          </div>
                        </div>
                      </div>
                      <!-- bottom-row -->
                      <div class="flex-row bottom-info">
                        <img :src="formatStoreIconInner(element?.store)" class="icon-store" />
                        <div class="beizhu">
                          <span class="beizhudesc"> 备注：</span>
                          <el-tooltip
                            class="box-item"
                            effect="dark"
                            :content="element?.recordRemark"
                            placement="top"
                          >
                            <div
                              ><span class="value-desc">{{ element?.recordRemark }}</span>
                            </div>
                          </el-tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </draggable>
            <div v-if="tableData[rowIndex][date.prop]?.length > 2">
              <img
                src="@/assets/imgs/team/open.png"
                v-if="!tableData[rowIndex].openFlag"
                class="open"
                @click="openMore(rowIndex)"
              />
              <img
                src="@/assets/imgs/team/close.png"
                v-else
                @click="openMore(rowIndex)"
                alt=""
                class="open"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 右边按钮 -->

    <img
      src="@/assets/imgs/team/disable-table-right.png"
      alt=""
      v-if="isAtEnd"
      class="circle-button right"
    />
    <img
      src="@/assets/imgs/team/table-right.png"
      @click="scrollRight"
      alt=""
      class="circle-button right"
      v-else
    />
  </div>
</template>

<script lang="ts" setup>
import { hasPermiJs } from '@/utils/index'
import html2canvas from 'html2canvas-plus'
import { defineEmits, defineProps, ref } from 'vue'
import draggable from 'vuedraggable'
import { formarTwoType } from '../common'
import { formatStoreIcon } from '../utils'
const message = useMessage()
const openAll = ref(true)

interface DateItem {
  label: string
  prop: string
}

interface TableRow {
  id: string
  name: string
  [key: string]: any // 允许其他动态属性
}

const forOneType = (type) => {
  return props.demandTypeOne.find((item) => item.value == type)?.label
}

const formatShowRemark = (arr) => {
  return arr.some((item) => {
    return item?.calendarDate
  })
}

const formatStoreIconInner = (store) => {
  return formatStoreIcon(store)
}

const draggingOverIndex = ref('')
const handleDragOver = (index) => {
  draggingOverIndex.value = index
}
const handleDragLeave = () => {
  draggingOverIndex.value = ''
}

const handleOnEnd = () => {
  draggingOverIndex.value = ''
}

const isFirstBumen = (row) => {
  return row?.dept?.split('-')[1] == 1
}

// table数据格式
const props = defineProps({
  tableData: {
    type: Array as () => Array<TableRow>,
    default: () => []
  },
  dates: {
    type: Array as () => Array<DateItem>,
    default: () => []
  },
  demandTypeOne: {
    type: Array as () => Array<{ label: string; value: string }>,
    default: () => []
  },
  currentIndex: {
    type: Number,
    default: 0
  }
})

watch(
  () => props.tableData,
  (value) => {
    const all = value.every((item) => item?.openFlag == true)
    openAll.value = all
  },
  { deep: true }
)

watch(
  () => props.currentIndex,
  () => {
    openAll.value = true
  }
)

const canDrop = computed(() => {
  return !hasPermiJs('team:optimization:assignment')
})

const canDraggable = () => {
  if (canDrop.value) {
    message.error('您没有指派操作权限')
  }
}

const handleDoubleClick = (data, row, rowIndex) => {
  // 调用接口
  console.log('双击事件', props.tableData[rowIndex])
  emit('cusDbClick', data, row, {
    id: props.tableData[rowIndex]?.id,
    name: props.tableData[rowIndex]?.name,
    dept: props.tableData[rowIndex]?.dept.split('-')[0]
  })
}

const headerColor = ['#FFD999', '#BFE8F4', '#B3E579']
const itemColor = ['#FFF3DF', '#F2FCFF', '#F1FFE1']

const formatTopColor = (deptRank) => {
  return headerColor[deptRank % 3]
}

const formatTopPadding = (rowIndex, row) => {
  console.log(row?.name?.length, 'row?.name?.length')
  if (row.dept?.split('-')[0]?.length < 5) {
    return '10px 10px'
  } else {
    return props?.tableData[rowIndex].openFlag && !openAll.value ? '10px 10px' : '10px 3px'
  }
}

const formatBgColor = (deptRank) => {
  return itemColor[deptRank % 3]
}

const formatMT = (row) => {
  return row?.dept?.split('-')[1] == 1
}

const formatClass = (element) => {
  return {
    // 'table-cell-content-ing': element?.calendarState == 1,
    // 'table-cell-content-danger': element?.calendarState == 2,
    // 'table-cell-content-finish': element?.calendarState == 3,
    'table-cell-content-common': true
    //未指派
    // 'table-cell-content-empty': true
  }
}

const formatClassBtn = (value) => {
  return {
    xin: value == '新品',
    you: value == '优化',
    lin: value == '临时',
    nei: value == '内部'
  }
}

const formatEmpty = (element) => {
  return !element || element.length == 0
}

const formatWeeks = (element) => {
  return {
    weekend: element.label.includes('五') || element.label.includes('六')
  }
}
const formatGoodImg = (imgUrl) => {
  if (!imgUrl) return ''
  return imgUrl?.split(';')?.[0]
}

const formatStatus = (state) => {
  return {
    'state-ing': state == 1,
    'state-danger': state == 2,
    'state-finish': state == 3
  }
}

const formatStatusInner = (state) => {
  return {
    1: '进行中',
    2: '进行中',
    3: '已完成'
  }[state]
}

const tableContent = ref() //table内容
const emit = defineEmits([
  'tableChange',
  'tableAdd',
  'tableDataChange',
  'tableDataChangeAll',
  'cusDbClick',
  'tableExport',
  'exportSuccess'
])

const imgExporting = ref(false) // 导出图片状态

const tableExport = (value) => {
  console.log('导出表格数据', value)
  const tableContentEl = tableContent.value // .table-content 的 ref
  let oldOverflowX, oldWidth, oldOverflowY, oldHeight

  nextTick(async () => {
    try {
      imgExporting.value = true

      // 1. 展开所有内容
      if (tableContentEl) {
        oldOverflowX = tableContentEl.style.overflowX
        oldWidth = tableContentEl.style.width
        oldOverflowY = tableContentEl.style.overflowY
        oldHeight = tableContentEl.style.height

        tableContentEl.style.overflowX = 'visible'
        tableContentEl.style.width = tableContentEl.scrollWidth + 'px'
        tableContentEl.style.overflowY = 'visible'
        tableContentEl.style.height = tableContentEl.scrollHeight + 'px'
      }

      // 等待所有图片加载完成
      await waitImagesLoaded(tableContentEl)

      // 2. 截图
      await nextTick() // 等待 DOM 更新
      const canvas = await html2canvas(tableContent.value, {
        useCORS: true, // 允许跨域图片
        scale: 2 // 提高分辨率
      })
      const img = canvas.toDataURL('image/png')
      // 创建一个a标签模拟点击进行下载
      const downloadLink = document.createElement('a')
      downloadLink.id = 'imgDownload'
      downloadLink.style.display = 'none'
      downloadLink.href = img
      downloadLink.download = value.filename
      document.body.appendChild(downloadLink)
      downloadLink.click()
      imgExporting.value = false
      document.body.removeChild(downloadLink)
      imgExporting.value = false
    } catch (error) {
      imgExporting.value = false
      message.warning('导出图片失败')
    } finally {
      // 4. 恢复原样式
      if (tableContentEl) {
        tableContentEl.style.overflowX = oldOverflowX
        tableContentEl.style.width = oldWidth
        tableContentEl.style.overflowY = oldOverflowY
        tableContentEl.style.height = oldHeight
      }
      emit('exportSuccess')
    }
  })
}

// 工具函数
const waitImagesLoaded = (container) => {
  const imgs = container.querySelectorAll('img')
  return Promise.all(
    Array.from(imgs).map((img) => {
      if (img.complete) return Promise.resolve()
      return new Promise((resolve) => {
        img.onload = img.onerror = resolve
      })
    })
  )
}

defineExpose({ tableExport })

const openMore = (index) => {
  emit('tableDataChange', index)
}

const handlelChange = (value) => {
  emit('tableDataChangeAll', value)
}

const handleTableChange = (rowIndex, colIndex, event) => {
  draggingOverIndex.value = ''
  emit('tableChange', rowIndex, colIndex, event)
}

const isAtStart = ref(false) //是否在最左边
const isAtEnd = ref(false) //是否在最右边

const checkScrollPosition = () => {
  if (tableContent.value) {
    isAtStart.value = tableContent.value.scrollLeft == 0
    isAtEnd.value =
      tableContent.value.scrollWidth - tableContent.value.clientWidth ==
      tableContent.value.scrollLeft
  }
}

// 左边滑动200px
const scrollLeft = () => {
  if (tableContent.value) {
    tableContent.value.scrollBy({ left: -600, behavior: 'smooth' })
    setTimeout(checkScrollPosition, 300) // 延迟检查滚动位置
  }
}

// 右滑200px
const scrollRight = () => {
  if (tableContent.value) {
    tableContent.value.scrollBy({ left: 600, behavior: 'smooth' })
    setTimeout(checkScrollPosition, 300) // 延迟检查滚动位置
  }
}
</script>

<style scoped>
.table-container {
  background: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  margin-bottom: 16px;
  box-sizing: border-box;
}

.table-content {
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  flex: 1;
}

.table-row {
  display: flex;
  min-width: max-content;
  border-radius: 0px 8px 8px 8px;
  /* 应用/灰色底色 */
  background: #f8f8f9;
}

.table-header {
  display: flex;
  min-width: max-content;
  position: sticky;
  top: 0;
  z-index: 1;
}

.table-cell {
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #d4d4d4;
  cursor: pointer;
  flex: 1;
  width: 300px;
  position: relative;
}
.table-cell {
  border-bottom: 0.5px solid #d4d4d4;
  border-right: 0.5px solid #d4d4d4;
}

.header-cell {
  color: white;
  font-weight: bold;
  text-align: center;
  background: rgba(239, 242, 249, 0.4);
  font-weight: 400;
  font-size: 14px;
  color: #333333;
  border: none;
  margin: 10px 0;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid transparent;
  width: 300px;
}

.name {
  width: 130px;
  height: 100%;
  border: none;
  background: white;
  display: block;
  text-align: center;
  align-items: center;
  margin: 0px 10px 0 10px;
}
.topName {
  margin-left: 0px;
  padding-left: 10px;
}

.sticky {
  position: sticky;
  left: 0;
  z-index: 2;
  background: white;
}
.top-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.table-cell-content {
  display: flex;
  flex-direction: row;
  overflow: visible;
  width: 133px;
  margin-bottom: 10px;
  border-radius: 4px;
  padding: 8px;
  box-sizing: border-box;
  position: relative;
  .logo {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin-right: 2px;
  }
  .status {
    height: 14px;
    margin-left: -5px;
    font-weight: 500;
    font-size: 10px;
    text-align: left;
    font-style: normal;
    line-height: 14px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 1px 3px;

    box-sizing: border-box;
    .status-icon {
      width: 8px;
      height: 8px;
      margin-right: 2px;
    }
  }

  .state-ing {
    background: #ffe5c6;
    color: #f97f00;
  }
  .state-danger {
    background: #ffd5d9;
    color: #f33c51;
  }
  .state-finish {
    background: #ddf7e0;
    color: #008631;
  }

  .icon-store {
    width: 18px;
    height: 16px;
    margin-right: 3px;
  }

  .title {
    font-weight: 500;
    font-size: 12px;
    color: #333333;
    line-height: 17px;
    text-align: left;
    font-style: normal;
    width: 55px;
    overflow: hidden;
    text-overflow: ellipsis;
    /* 新增代码：限制最多展示两行 */
    display: -webkit-box;
    -webkit-line-clamp: 2; /* 限制最多两行 */
    -webkit-box-orient: vertical; /* 设置盒子方向为垂直 */
  }

  .logo-right {
    height: 12px;
    line-height: 12px;
    position: absolute;
    line-height: 14px;
    text-align: left;
    font-style: normal;
    border-radius: 0px 4px 0px 4px;
    text-align: center;
    right: 0;
    top: 0;
    font-weight: 400;
    font-size: 10px;
    color: #333333;
    .danger-top-icon {
      width: 8px;
      height: 8px;
      margin-left: 5px;
    }
  }
  .ing {
    background: url('@/assets/imgs/team/apmpbg.png') no-repeat;
    background-size: 100% 100%;
    color: #008631;
  }
  .finish {
    background: url('@/assets/imgs/team/apmpbg.png') no-repeat;
    background-size: 100% 100%;
    color: #ff931f;
  }
  .deager {
    width: 30px;
    background: url('@/assets/imgs/team/ampmdanger.png') no-repeat;
    background-size: 100% 100%;
  }
}

.table-cell-content-ing {
  background: #fff3df;
}
.table-cell-content-finish {
  background: #f1ffe1;
}
.table-cell-content-danger {
  background: #feecee;
}
.table-cell-content-empty {
  border-bottom: 2px solid #0064ff;
}
.table-cell-content-common {
  background: #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.08);
}

.circle-button {
  width: 25px;
  height: 40px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.circle-button.left {
  top: 30px;
  left: 120px;
  z-index: 10;
}

.circle-button.right {
  top: 30px;
  right: 0px;
}

.circle-button.disabled {
  background-color: #d4d4d4;
  cursor: not-allowed;
}

.desc-two {
  margin-top: 3px;
  text-align: left;
  font-style: normal;
  width: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
  font-size: 10px;
  color: #333333;
}

.flex-column {
  display: flex;
  flex-direction: column;
  width: 133px;
  margin-right: 9px;
}
.flex-column:nth-child(2n) {
  margin-right: 0;
}
.avator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-bottom: 6px;
}

.weekend {
  background: #f2fcff;
}
.mid-line {
  width: 100%;
  border-bottom: 2px dashed #d4d4d4;
  margin: 10px 0;
}
.mid-line-inner {
  border-bottom: 2px dashed #d4d4d4;
  border-image: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 10px,
      #d4d4d4 10px,
      #d4d4d4 20px
    )
    1;
  position: absolute;
  left: 5%;
  top: 50%;
  width: 90%;
}
.mid-line-out {
  border-bottom: 2px dashed #d4d4d4;
  border-image: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 10px,
      #d4d4d4 10px,
      #d4d4d4 20px
    )
    1;
}

.draggable-container {
  min-height: 90px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}

.h100 {
  height: 50%;
}

.riqi {
  display: flex;
  flex-direction: row;
  justify-content: end;
  margin-bottom: 5px;
  .item {
    width: 56px;
    height: 20px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 24, 31, 0.13);
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .data-icon {
      width: 12px;
      height: 10px;
    }
    .desc {
      font-weight: 400;
      font-size: 10px;
      color: #333333;
      line-height: 14px;
      text-align: left;
      font-style: normal;
    }
  }
}

.bumen {
  display: inline-block;
  position: absolute;
  left: 0;
  top: 0px;
  height: 100%;
  width: 50px;
  padding: 10px 3px;
  box-sizing: border-box;
}
.bumenFirst {
  border-radius: 6px 0px 0px 0px;
}

.remark {
  display: inline-block; /* 或者 block */
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出部分显示为省略号 */
  width: 180px;
}
.MT10 {
  margin-top: 10px;
}
.felx-row {
  display: flex;
  flex-direction: row;
}
.btn-common {
  font-weight: 400;
  font-size: 10px;
  color: #f97f00;
  border: 1px solid #f97f00;
  box-sizing: border-box;
  padding: 1px 3px;
  border-radius: 2px;
  background: #ffe5c6;
}

.btn-common-finish {
  color: #139040;
  border: 1px solid #008631;
  background: #ddf7e0;
}
.btn-common-danger {
  color: #f93b50;
  border: 1px solid #f93b50;
}

.type {
  margin-right: 4px;
}
.xin {
  background: #defbff;
  color: #01bed4;
  border: 0.5px solid #04aa94;
}
.you {
  background: #fef9e0;
  color: #ff9f00;
  border: 0.5px solid #fbd432;
}
.lin {
  background: #e7def9;
  color: #843af8;
  border: 0.5px solid #843af8;
}
.nei {
  background: #d8e1f5;
  color: #0064ff;
  border: 0.5px solid #0064ff;
}
.remarkbtn {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
  background: #f97f00;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.18);
}

.remarkbtn-finish {
  background: #008631;
  border: none;
}

.remarkbtn-danger {
  background: #f93b50;
  border: none;
}

.beizhu-icon {
  width: 7px;
  height: 9px;
  margin-right: 2px;
}

.drag-over {
  background-color: #f1f1fe !important; /* 浅蓝色背景 */
}

.open {
  width: 16px;
  height: 14px;
  position: absolute;
  left: 47%;
  bottom: 6px;
}
.openName {
  font-weight: 500;
  font-size: 12px;
  color: #0064ff;
  font-style: normal;
  margin-right: 5px;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.beizhu {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: PingFang SC;
  font-size: 10px;
  /* 文字/二级 */
  color: #666666;

  .value-desc {
    padding-top: 3px;
    width: 60px;
    text-overflow: ellipsis;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
  }
}
.bottom-info {
  align-items: center;
}
</style>
