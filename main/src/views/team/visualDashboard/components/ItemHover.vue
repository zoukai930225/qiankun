<!--
 * @Date: 2025-10-13 10:18:45
-->
<template>
  <div class="item-hover">
    <!-- left -->
    <div class="left-wapper">
      <div class="title-wapper">
        <img :src="formatStoreIconInner(task?.store)" class="img" alt="" />
        <div class="title">{{ task?.goodsCode }}</div>
      </div>
      <el-image
        class="goods"
        :src="task?.goodsImage && task?.goodsImage?.split(';')?.[0]"
        :zoom-rate="1.2"
        :max-scale="7"
        :min-scale="0.2"
        :preview-src-list="task?.goodsImage?.split(';')"
        show-progress
        :initial-index="4"
        fit="cover"
      />

      <div class="type-wapper">
        <div class="type-left-wapper">
          <div
            class="type-desc"
            :class="formatClassBtnL(forOneType(task?.demandType)?.slice(0, 2))"
            >{{ forOneType(task?.demandType)?.slice(0, 2) }}</div
          >

          <el-tooltip
            class="type-title"
            effect="dark"
            :content="`${formarTwoType(task?.demandType, task?.secondDemandType)}`"
            placement="top"
          >
            <div class="type-title"
              >{{ `${formarTwoType(task?.demandType, task?.secondDemandType)}` }}
            </div>
          </el-tooltip>
        </div>
        <!-- 点击编辑 弹出富文本编辑器 -->
        <div class="edit" @click="onEdit">
          <img src="@/assets/imgs/team/edit2.png" alt="" class="icon" /> <span>编辑</span></div
        >
      </div>
      <div class="desc"
        >备注：<span v-html="beizhu == 'tag' ? task?.tag : task?.recordRemark"></span
      ></div>
    </div>
    <!-- right -->
    <div class="right-wapper">
      <!-- title -->
      <stepItem v-for="item in task?.calendarRecords" :key="item.processNodeCode" :item="item" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { formarTwoType } from '../common.js'
import { formatStoreIcon } from '../utils.js'
import stepItem from './stepItem.vue'

const props = defineProps<{
  task: {
    id: string
    name: string
    type: string
    desc: string
    store: string
    goodsCode: string
    goodsImage: string
    demandType: string
    secondDemandType: string
    tag: string
    recordRemark: string
    calendarRecords: any[]
  }
  beizhu: string
  processNode?: string // 添加流程节点标识
}>()

const formatClassBtnL = (value) => {
  return {
    xin: value == '新品',
    you: value == '优化',
    lin: value == '临时',
    nei: value == '内部'
  }
}

const forOneType = (type) => {
  return demandTypeOne.value.find((item) => item.value == type)?.label
}

const demandTypeOne = ref([
  {
    label: '新品需求',
    value: 'newProduct'
  },
  {
    label: '优化需求',
    value: 'optimization'
  },
  {
    label: '临时需求',
    value: 'temporary'
  },
  {
    label: '内部需求',
    value: 'internal'
  }
])

const formatStoreIconInner = (store) => {
  return formatStoreIcon(store)
}

const emit = defineEmits<{
  (e: 'handleEdit', task: any): void
}>()

const onEdit = () => {
  emit('handleEdit', {
    ...props.task,
    beizhu: props.beizhu,
    processNode: props.processNode
  })
}
</script>

<style scoped>
.item-hover {
  display: flex;
  flex-direction: row;
  .left-wapper {
    margin-right: 10px;
    width: 200px;
    display: flex;
    flex-direction: column;
    .title-wapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 8px;
      margin-bottom: 8px;
      .img {
        width: 26px;
        height: 26px;
        margin-right: 5px;
      }
      /* 超两行点点点 */
      .title {
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* 显示几行 */
        -webkit-box-orient: vertical;
        font-size: 12px;
        font-weight: 500;
        color: #333333;
      }
    }
    .type-wapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .type-left-wapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        .type-title {
          width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-left: 8px;
          color: #333333;
          font-size: 12px;
          cursor: pointer;
        }
      }

      .edit {
        color: #0064ff;
        cursor: pointer;
        font-size: 12px;
        .icon {
          width: 12px;
          height: 12px;
          margin-right: 2px;
        }
      }
    }
    .desc {
      font-size: 12px;
      color: #666666;
    }
    .goods {
      width: 180px;
      height: 172px;
      margin-bottom: 8px;
    }
  }
  .right-wapper {
    width: 100%;
  }
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
</style>
