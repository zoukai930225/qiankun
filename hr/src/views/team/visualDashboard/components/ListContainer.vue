<!--
 * @Date: 2025-01-22 15:15:10
-->
<template>
  <div class="list-container-wrapper" v-if="listItems?.length">
    <img
      src="@/assets/imgs/team/list-left.png"
      alt="left"
      class="arrow left"
      @click="scrollLeft"
      v-if="listItems?.length > 10"
    />
    <div class="list-container" v-if="listItems?.length" ref="listContainer" @click="canDraggable">
      <draggable
        :list="listItems"
        class="list"
        :sort="false"
        @update="updateList"
        @change="dandlechange"
        @start="onStart"
        :disabled="canDrop"
        :group="{ name: 'shared', put: false }"
      >
        <template #item="{ element }">
          <div class="list-item-wapper" :key="element.id + element.goodsCode">
            <div
              class="avator-top"
              v-if="element?.calendarState == 1 || element?.calendarState == 2"
            >
              <img class="avator" :src="element?.operatorAvatar" />
              <div class="name">{{ element?.operatorRealname }}</div>
            </div>
            <div class="list-item" :key="element.id">
              <div class="flex-row" style="align-items: center">
                <div style="height: 30px">
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

                <div class="item-right">
                  <!--  -->
                  <div
                    class="flex-row"
                    style="justify-content: left; margin-bottom: 2px; align-items: center"
                  >
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      :content="element?.goodsCode"
                      placement="top"
                    >
                      <div class="title"> {{ element.goodsCode }}</div>
                    </el-tooltip>
                  </div>
                  <div class="flex-row" style="justify-content: left">
                    <div
                      class="type-desc"
                      :class="formatClassBtnL(forOneType(element?.demandType)?.slice(0, 2))"
                      >{{ forOneType(element?.demandType)?.slice(0, 2) }}</div
                    >
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      :content="`${formarTwoType(element?.demandType, element?.secondDemandType)}`"
                      placement="top"
                    >
                      <div class="value100">
                        {{
                          `${formarTwoType(element?.demandType, element?.secondDemandType)}`
                        }}</div
                      >
                    </el-tooltip>
                  </div>
                </div>
              </div>
              <!--  -->
              <div class="flex-row bottom-info">
                <img :src="formatStoreIconInner(element?.store)" class="icon-store" />
                <div class="flex-row beizhu">
                  <span>备注：</span>
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="element?.tag"
                    placement="top"
                    raw-content
                  >
                    <div class="value-desc">{{ stripHtmlTags(element?.tag) }} </div>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <img
      src="@/assets/imgs/team/list-right.png"
      class="arrow right"
      @click="scrollRight"
      v-if="listItems?.length > 10"
    />
  </div>
</template>

<script lang="ts" setup>
import { hasPermiJs } from '@/utils/index'
import { defineEmits, defineProps } from 'vue'
import draggable from 'vuedraggable'
import { formarTwoType } from '../common'
import { formatStoreIcon } from '../utils'
const message = useMessage()

const props = defineProps({
  listItems: {
    type: Array,
    default: () => []
  },
  currentTab: {
    type: String,
    default: ''
  },
  demandTypeOne: {
    type: Array as () => Array<{ label: string; value: string }>,
    default: () => []
  }
})

const forOneType = (type) => {
  return props.demandTypeOne.find((item) => item.value == type)?.label
}
const stripHtmlTags = (html) => {
  if (!html) return '' // 如果内容为空，返回空字符串
  return html.replace(/<\/?[^>]+(>|$)/g, '') // 使用正则表达式去掉 HTML 标签
}

const formatStoreIconInner = (store) => {
  return formatStoreIcon(store)
}

const canDrop = computed(() => {
  return !hasPermiJs('team:optimization:assignment')
})

const formatGoodImg = (imgUrl) => {
  if (!imgUrl) return ''
  return imgUrl?.split(';')?.[0]
}

const canDraggable = () => {
  if (canDrop.value) {
    message.error('您没有指派操作权限')
  }
}

const formatClassBtnL = (value) => {
  return {
    xin: value == '新品',
    you: value == '优化',
    lin: value == '临时',
    nei: value == '内部'
  }
}

const emit = defineEmits(['update:listItems', 'change', 'onStart'])

const onStart = (event) => {
  console.log(event)
  const draggedElement = props.listItems[event.oldIndex]
  const draggedIndex = event.oldIndex
  emit('onStart', { draggedElement, draggedIndex })
}

const dandlechange = (event) => {
  console.log(event, 'dandlechange')
  // emit('change', event)
}

const updateList = (newList) => {
  console.log(newList, 'updateList')
  // emit('update:listItems', newList)
}

const listContainer = ref()

const scrollLeft = () => {
  if (listContainer.value) {
    listContainer.value.scrollBy({ left: -300, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (listContainer.value) {
    listContainer.value.scrollBy({ left: 300, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.list-container-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  background: white;
}

.list-container {
  display: flex;
  overflow-x: auto;
  padding: 16px;
  box-sizing: border-box;
  background: white;
}

.list {
  display: flex;
  gap: 10px;
}
.list-item-wapper {
  display: flex;
  flex-direction: row;

  border-radius: 4px;
  background: #c9d1e2;
  .avator-top {
    width: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .avator {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      margin-top: 4px;
      margin-bottom: 1px;
    }
    .name {
      text-align: center;
      font-family: PingFang SC;
      font-size: 10px;
      font-weight: normal;
      line-height: 12px;
      letter-spacing: normal;
      color: #3d3d3d;
    }
  }
}

.list-item {
  background-color: #409eff;
  cursor: pointer;
  background: #f8f8f9;
  border-radius: 4px;
  padding: 5px 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .logo {
    width: 30px;
    height: 30px;
    margin-right: 3px;
    border-radius: 50%;
  }
  .item-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-weight: 400;
    font-size: 12px;
    color: #333333;
    justify-content: space-between;
    margin-left: 2px;
  }
  .flex-row {
    display: flex;
    flex-direction: row;
  }
  .item-right-title {
    color: #666666;
    width: 30px;
  }
  .item-right-desc {
    width: 128px;
    white-space: nowrap; /* 不换行 */
    overflow: hidden; /* 超出部分隐藏 */
    text-overflow: ellipsis; /* 超出部分显示省略号 */
  }
  .value100 {
    white-space: nowrap;
    width: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 400;
    font-size: 10px;
    color: #333333;
    margin-top: 2px;
  }
  .mb10 {
    margin-bottom: 10px;
  }
}

.arrow {
  width: 30px;
  height: 30px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.arrow.left {
  left: 10px;
}

.arrow.right {
  right: 10px;
}

.icon-store {
  width: 16px;
  height: 16px;
  margin-right: 3px;
}
.type-desc {
  width: 30px;
  background: #d8e1f5;
  border-radius: 4px;
  font-weight: 400;
  font-size: 10px;
  color: #0064ff;
  text-align: center;
  font-style: normal;
  padding: 1px 3px;
  box-sizing: border-box;
  margin-right: 5px;
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

.btn-common {
  font-weight: 400;
  font-size: 10px;
  color: #f97f00;
  border: 1px solid #f97f00;
  box-sizing: border-box;
  padding: 1px 6px;
}
.type {
  margin-right: 10px;
}
.remarkbtn {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
  background: #f97f00;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.18);
  border-radius: 4px;
}

.beizhu-icon {
  width: 7px;
  height: 9px;
  margin-right: 2px;
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
.bottom-info {
  margin-top: 4px;
  align-items: center;
  .beizhu {
    font-family: PingFang SC;
    font-size: 10px;
    color: #666666;
    .value-desc {
      width: 70px;
      height: 14px;
      text-overflow: ellipsis;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
</style>
