<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2025-12-17 14:00:00
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2025-12-19 17:48:43
-->
<template>
  <div class="board-card main-container">
    <div class="card-header">
      <div class="card-title">千川组看板</div>
    </div>
    <div class="qc-board-layout">
      <!-- 左侧：男组装金分配 -->
      <el-card class="box-card">
        <template #header>
          <div class="section-header">
            <div class="section-header-left"
              ><span class="section-label">剪辑奖金分配</span>
              <el-select
                v-model="selectedProject1"
                placeholder="请选择项目"
                class="project-selector"
                @change="handleProjectChange('editor')"
              >
                <el-option
                  v-for="item in projectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>

            <el-button
              text
              type="primary"
              class="more-btn"
              v-if="qcContributionData.length > 6"
              @click="handleShowMore('contribution')"
            >
              查看更多
              <el-icon class="ml-4px"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </template>
        <div class="qc-table-section">
          <qc-contribution-table :data="displayContributionData" :border="true" />
        </div>
      </el-card>
      <el-card class="box-card">
        <template #header>
          <div class="section-header">
            <div class="section-header-left"
              ><span class="section-label">编导奖金分配</span>
              <el-select
                v-model="selectedProject2"
                placeholder="请选择项目"
                class="project-selector"
                @change="handleProjectChange('director')"
                ><el-option
                  v-for="item in projectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                /> </el-select
            ></div>

            <el-button
              text
              type="primary"
              class="more-btn"
              v-if="qcEditData.length > 6"
              @click="handleShowMore('edit')"
            >
              查看更多
              <el-icon class="ml-4px"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </template>
        <div class="qc-table-section">
          <qc-edit-table :data="displayEditData" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import QcContributionTable from './tables/QcContributionTable.vue'
import QcEditTable from './tables/QcEditTable.vue'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import request from '@/config/axios'
const emit = defineEmits(['show-detail'])
const { selectedMonth } = inject('bonusBoard') as { selectedMonth: Ref<string> }
const selectedProject1 = ref('')
const selectedProject2 = ref('')
const projectOptions = ref<any[]>([])

// onMounted(async () => {
//   getData()
// })
const getData = async () => {
  await getProjectOptions()
  getQcEditorBoardData()
  getQcDirectorBoardData()
}
const getQcEditorBoardData = async () => {
  const res = await request.get({
    url: '/api/nmBonusBoard/getQcEditorBoard',
    params: { month: selectedMonth.value, owningProjectId: selectedProject1.value }
  })
  qcContributionData.value = res || []
}
const getQcDirectorBoardData = async () => {
  const res = await request.get({
    url: '/api/nmBonusBoard/getQcDirectorBoard',
    params: { month: selectedMonth.value, owningProjectId: selectedProject2.value }
  })
  qcEditData.value = res || []
}
// 千川组 - 剪辑奖金分配
const qcContributionData = ref<any[]>([])

// 千川组 - 编导奖金分配
const qcEditData = ref<any[]>([])

const getProjectOptions = async () => {
  const res = await getIntDictOptions(DICT_TYPE.CONTENT_BONUS_CALCULATION_PROJECT, true)
  projectOptions.value = res
  selectedProject1.value = res[0].value as string
  selectedProject2.value = res[0].value as string
}

// 显示数据（前6条）
const displayContributionData = computed(() => qcContributionData.value.slice(0, 6))
const displayEditData = computed(() => qcEditData.value.slice(0, 6))

// 项目筛选变化
const handleProjectChange = (type: string) => {
  if (type === 'editor') {
    getQcEditorBoardData()
  } else {
    getQcDirectorBoardData()
  }
}

// 查看更多
const handleShowMore = (type: string) => {
  if (type === 'contribution') {
    emit('show-detail', {
      type: 'qcContribution',
      title: '男组装金分配明细',
      data: qcContributionData.value
    })
  } else {
    emit('show-detail', {
      type: 'qcEdit',
      title: '编辑装金分配明细',
      data: qcEditData.value
    })
  }
}

defineExpose({
  getData
})
</script>

<style lang="scss" scoped>
@use './style.scss';
.qc-board-layout {
  display: flex;
  gap: 20px;
  padding: 0 16px 16px;
  .box-card {
    width: calc(50% - 10px);
  }
  .section-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 300px;
    .section-label {
      white-space: nowrap;
    }
    .project-selector {
      width: 180px;
    }
  }
}
</style>
