<template>
  <div class="treeNode">
    <div class="TreeRight" v-if="list.length">
      <div class="childs">
        <div class="child" v-for="(item, index) in list" :key="item.id + '-child-' + index">
          <div
            class="child-item"
            :style="{ marginRight: item.children && item.children.length > 1 ? '20px' : '' }"
          >
            <div class="childname" :id="item.id">
              <div class="shows">
                <NodeItem :nodeList="[]" :tab="item" :index="index" />
              </div>
              <div class="position-arrow" v-if="list.length > 1">
                <div class="row-center">
                  <div style="width: 24px; height: 1px; background: #d3d9dd"></div>
                </div>
              </div>
              <div
                class="position-top"
                v-if="isFirst(item.id) && domready"
                :style="position_top(item.id, 'top')"
              ></div>
              <div
                class="position-top"
                v-if="isLast(item.id)"
                :style="position_top(item.id, 'bottom')"
              ></div>
            </div>
            <div
              v-if="item.children && item.children.length"
              class="childarrow"
              :style="{
                borderRight:
                  item.children && item.children.length > 1
                    ? '1px solid #d3d9dd'
                    : '3px solid transparent'
              }"
            >
              <div class="row-center">
                <div style="width: 24px; height: 1px; background: #d3d9dd"></div>
              </div>
            </div>
          </div>
          <div class="child-children" v-if="item.children && item.children.length">
            <TreeNode :list="item.children" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import TreeNode from '@/views/OA/new/components/treeNode.vue'
import NodeItem from './nodeItem.vue'

const props = defineProps({
  nodeList: {
    type: Array as PropType<any[]>,
    default: () => {
      return []
    }
  },
  list: propTypes.array.def([])
})
const domready = ref(false)

const position_top = (id, position) => {
  let dom = document.getElementById(id)
  let height
  if (dom) {
    height = dom.clientHeight
  }
  let rt
  if (position === 'top') {
    rt = {
      height: height / 2 - 0 + 'px',
      top: 0
    }
  }
  if (position === 'bottom') {
    rt = {
      height: height / 2 + 0 + 'px',
      bottom: 0
    }
  }
  return rt
}

const isFirst = (id) => {
  return props.list.length > 1 && props.list.map((x) => x.id).indexOf(id) === 0
}

const isLast = (id) => {
  return props.list.length > 1 && props.list.map((x) => x.id).indexOf(id) === props.list.length - 1
}

onMounted(() => {
  nextTick(() => {
    domready.value = true
  })
})
</script>

<style lang="scss" scoped>
.treeNode {
  // width: calc(100vw);
}
</style>
<style lang="less" scoped>
.TreeRight {
  p {
    margin: 0;
    font-size: 13px;
  }
  display: flex;
  .father {
    width: 70px;
    background-color: red;
    padding: 100px 10px;
  }
  .childs {
    .child {
      display: flex;
      background-color: #eff1f7;
      .child-item {
        display: flex;
        align-items: center;
        margin: 4px 0;
        // margin-top: 18px;
        .childname {
          .shows {
            text-align: left;
            height: 104px;
            border-radius: 5px;
            width: 100%;
            margin-left: 2px;
            background: #ffffff;
            box-shadow: 0px 3px 11px 0px rgba(0, 0, 0, 0.13);
            border-radius: 10px;
          }
          .shows:hover {
            border: 1px solid #0064ff;
          }
          cursor: pointer;
          height: 100%;
          display: flex;
          align-items: center;
          width: calc(221px + 0px);
          text-align: center;
          justify-content: center;
          position: relative;
          padding: 4px 0;
          .position-arrow {
            position: absolute;
            left: -22px;
          }
          .position-top {
            position: absolute;
            width: 3px;
            background-color: #eff1f7;
            left: -23px;
            height: 0px;
          }
        }
        .childarrow {
          height: 100%;
          display: flex;
          align-items: center;
        }
      }
    }
    .child-children {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
</style>
