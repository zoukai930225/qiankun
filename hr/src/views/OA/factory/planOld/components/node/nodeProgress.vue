<template>
  <div class="nodeWrapper" style="width: 360px;">
    <el-scrollbar ref="scrollRef" height="400" class="relative">
      <div style="height: 10px;"></div>
      <nodeCard @nodeClick="handleSelectNode" :params="nodeProgressData" :selectedNode="selectedNode"
        v-if="nodeProgressData?.taskDefinitionKey" />
      <!-- <div v-for="(node, index) in list" :key="index" class="innerNode"> -->

      <!-- 如果存在并行节点 -->
      <!-- <div class="startLine" v-if="node.childNodes && node.childNodes.length"></div>
        <div class="parallelNode" v-if="node.childNodes && node.childNodes.length">
          <div class="nodes" v-for="child in node.childNodes" :key="child.nodeName">
            <nodeCard @nodeClick="handleSelectNode(child)" :isSelected="selectedNode.nodeName === child.nodeName"
              :params="child" />
            <nodeCard :isSelected="selectedNode.nodeName === parallelNode.nodeName"
              @nodeClick="handleSelectNode(parallelNode)" :params="parallelNode" v-for="parallelNode in child.nodeList"
              :key="parallelNode.nodeName" />
            <div class="parallelLine" v-if="child.nodeList.length === 1"></div>
          </div>
        </div>
        <div class="endLine" v-if="node.childNodes && node.childNodes.length"></div>
        <div class="endVerticalLine" v-if="node.childNodes && node.childNodes.length"></div> -->
      <!-- </div> -->
      <div style="height: 10px;"></div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import nodeCard from './nodeCard.vue'
const emit = defineEmits(['changeSelectedNode'])
const selectedNode = ref<any>()
const handleSelectNode = (node: any) => {
  selectedNode.value = node
  emit('changeSelectedNode', node)
}

const props = defineProps({
  nodeProgressData: {
    type: Object as any,
    default: () => { }
  }
})

const scrollRef = ref()
const findNodeInprogress = (data: any) => {
  if (data?.status === 'active') {
    handleSelectNode(data)
    nextTick(() => {
      const domRef = document.querySelector(`#${data.taskDefinitionKey}`)
      // console.log(domRef?.getClientRects()[0])
      domRef?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: "nearest"
      })
      // scrollRef.value?.scrollTo({
      //   behavior: 'smooth',
      //   top:domRef?.getClientRects()[0].top
      // })

    })
  } else {
    if (data?.nextProgress) {
      data?.nextProgress.forEach((node: any) => {
        findNodeInprogress(node)
      })
    }
  }
}
watch(() => props.nodeProgressData, async (val) => {
  if (val) {
    findNodeInprogress(val)
  }
}, {
  immediate: true,
  deep: true
})

</script>

<style lang="scss" scoped>
.nodeWrapper {
  box-sizing: border-box;
  width: 100%;
  height: 410px;
  background: rgb(244, 247, 254);
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #fff;
  padding: 0;
  position: relative;

  .innerNode {
    width: 96%;
    margin: auto;

    .startLine {
      width: 50%;
      height: 16px;
      margin: auto;
      border: 1px solid #cecece;
      border-bottom: none;
    }

    .endLine {
      width: 50%;
      height: 1px;
      margin: auto;
      background: #cecece;
    }

    .endVerticalLine {
      width: 1px;
      height: 16px;
      background: #cecece;
      margin: auto;
    }

    .parallelNode {
      display: flex;
      justify-content: space-around;

      .nodes {
        .parallelLine {
          width: 1px;
          height: 103px;
          background: #cecece;
          margin: auto;
        }
      }
    }
  }

}
</style>