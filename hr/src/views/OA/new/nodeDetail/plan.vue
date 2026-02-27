<template>
  <div class="treeNodeDetail">
    <div class="topBg">
      <div class="closeBg" @click="closeCurrentPage">
        <img
          style="margin-left: 12px; margin-right: 10px; width: 12px; height: 12px"
          src="@/assets/imgs/common/route_back.png"
        />
        关闭</div
      >
      <div style="font-size: 16px; font-weight: 500; line-height: normal"
        >企划名称（{{ planName }}）</div
      >
    </div>
    <div class="treeBg" v-if="nodeList && nodeList.length > 0">
      <div style="margin-bottom: 12px">
        <TreeNode :list="nodeList" :nodeList="getAllNodes(nodeList)" />
      </div>
    </div>
    <div v-if="dataRequested && nodeList && nodeList.length === 0" class="empty">
      <img src="@/assets/imgs/empty-box.png" class="empty-img" alt="" />
      <span class="desc">暂无数据</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TreeNode from '@/views/OA/new/components/treeNode.vue'
import { ElScrollbar } from 'element-plus'
import { useRouter } from 'vue-router'

import { queryProgressBoardByEnterprise } from '@/api/oa/new/plan/index'

import { closeCurrentTag } from '@/utils/index'

const { currentRoute, push } = useRouter()

const route = useRoute() // 路由

const planId = route.params.planId
const planName = route.query.planName

const nodeList = ref([])
onMounted(() => {
  getProgressDetial()
})

const dataRequested = ref(false)
const loadingInstance = ref()

const getProgressDetial = async () => {
  loadingInstance.value = ElLoading.service({ fullscreen: true, text: '数据加载中' })
  const res = await queryProgressBoardByEnterprise(planId).catch(() => {
    loadingInstance.value.close()
    dataRequested.value = true
  })
  if (res) {
    nodeList.value = res || []
  }
  dataRequested.value = true
  loadingInstance.value.close()
}
function getAllNodes(nodes) {
  let allNodes = []
  function traverse(nodeList) {
    nodeList.forEach((node) => {
      allNodes.push(node) // 将当前节点添加到结果数组中
      if (node.children) {
        // 如果当前节点有子节点，则递归处理子节点
        traverse(node.children)
      }
    })
  }
  traverse(nodes) // 从根节点开始遍历
  return allNodes // 返回包含所有节点的数组
}

const closeCurrentPage = () => {
  // router.back()
  closeCurrentTag(currentRoute, push)
}
</script>

<style lang="scss" scoped>
.treeNodeDetail {
  .topBg {
    height: 54px;
    background: #ffffff;
    box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
    border-radius: 2px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 17px;
    margin-bottom: 10px;

    .closeBg {
      cursor: pointer;
      box-shadow: 0px 0px 8px 0px rgba(0, 50, 125, 0.2);
      border-radius: 16px;
      height: 32px;
      width: 80px;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-right: 20px;
      margin-left: 3px;
      font-size: 13px;

      color: #0064ff;
    }
  }
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    .empty-img {
      width: 390px;
      height: 220px;
    }
    .desc {
      font-weight: 400;
      font-size: 14px;
      color: #999999;
      line-height: 20px;
      text-align: left;
      font-style: normal;
      margin-top: 20px;
    }
  }
}
.treeBg {
  overflow: auto;
  max-height: calc(100vh - 160px);
  // background: red;
}
</style>
