<template>
  <div class="progressWrapper">
    <div class="flex items-center relative">
      <nodeDot :isNextParallelNode="isNextParallelNode(nodeData)" :params="nodeData"
        v-if="nodeData?.taskDefinitionKey" />
      <!-- <div v-if="item.nextProgress">

      </div> -->
      <!-- 如果存在并行节点 -->
      <!-- <div class="parallelNodeStartLine" v-if="isNextParallelNode(node)">
        <img :src="left_top_line" />
        <img :src="left_bottom_line" />
      </div>
      <div class="parallelNode" v-if="isNextParallelNode(node)">
        <div class="nodes" v-for="(child,idx) in node.childNodes" :key="child.nodeName">
          <nodeDot :isNextParallelNode="isNextParallelNode(child)"/>
          <nodeDot :isNextParallelNode="isNextParallelNode(child)" v-for="parallelNode in child.nodeList" :key="parallelNode.nodeName"/>
          <div class="parallelLine" v-if="child.nodeList.length === 1"></div>
        </div>
      </div>
      <div class="parallelNodEndLine" v-if="isNextParallelNode(node)">
        <img :src="right_top_line" />
        <img :src="right_bottom_line"/>
      </div> -->
    </div>

  </div>
</template>

<script lang="ts" setup>
import nodeDot from './nodeDot.vue'

// import left_top_line from '@/assets/svgs/newProduct/left_top.svg'
// import left_bottom_line from '@/assets/svgs/newProduct/left_bottom.svg'
// import right_top_line from '@/assets/svgs/newProduct/right_top.svg'
// import right_bottom_line from '@/assets/svgs/newProduct/right_bottom.svg'

const props = defineProps({
  nodeData: {
    type: Object as any,
    default: () => { }
  }
})

const isNextParallelNode = (node: any) => {
  return node.nextProgress && node.nextProgress.length > 1
}

</script>

<style lang="scss" scoped>
.progressWrapper {
  // height: 100%;
  min-height: 100px;
  display: flex;
  align-items: center;
  padding: 16px 10px;

  .parallelNodeStartLine {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    left: 90px;

    // top:-33%;
    img {
      width: 180px;
    }
  }

  .parallelNodEndLine {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -2px;

    img {
      width: 180px;
    }
  }

  .parallelNode {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 292px;
    margin-left: -36px;
    margin-bottom: -12px;

    .nodes {
      display: flex;
      align-items: center;

      .parallelLine {
        width: 240px;
        height: 2px;
        background-color: #0064ff;
        opacity: .6;
        margin-left: 64px;
        margin-top: -14px
      }
    }
  }
}
</style>