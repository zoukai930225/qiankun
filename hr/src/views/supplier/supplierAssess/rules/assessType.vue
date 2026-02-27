<template>
  <el-card class="!rounded-8px !border-0 mb-10px min-w-1300px" shadow="never">
    <el-row :gutter="24">
      <el-col :span="20" class="!flex-1">
        <el-form :model="queryParams" ref="formRef" label-width="90">
          <el-row :gutter="12">
            <el-col :span="6">
              <el-form-item label="关键词" prop="queryKey" label-width="auto">
                <el-input
                  v-model="queryParams.queryKey"
                  placeholder="请输入关键词"
                  clearable
                  :style="{ width: '220px' }"
                  @keydown.enter="getData"
                  @clear="getData"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="4" class="!flex justify-end min-w-350px">
        <el-button @click="getData" class="commonSearchBtn">
          <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
          重置
        </el-button>
        <el-button
          v-if="permissionSet.has('SupplierAssessType:Add')"
          type="primary"
          @click="handleAdd"
        >
          <Icon icon="ep:plus" />新增
        </el-button>
      </el-col>
    </el-row>
  </el-card>

  <el-card class="!rounded-8px !border-0 mb-10px main min-w-1300px" shadow="never">
    <el-tabs v-model="queryParams.assessmentType" @tab-change="handleTabChange">
      <el-tab-pane
        v-for="item in typeOps"
        :label="item.label"
        :name="item.value"
        :key="item.value"
      />
    </el-tabs>
    <el-scrollbar v-if="progressInfo.length" v-loading="loading">
      <el-card
        v-for="progress in progressInfo"
        :key="getProgressKey(progress)"
        shadow="never"
        class="!bg-#f9f9f9 rounded-8px content mb-4"
      >
        <template #header>
          <div class="flex items-center">
            <span>{{ progress[0].name }}</span>

            <span class="ml-2"> （总分：{{ getSumMaxScore(progress) }}分） </span>

            <div class="status ml-4 text-sm !px-2 !py-1 bg-#0064ff20 color-#0064ff">
              {{ progress[0].departmentName || '--' }}
            </div>

            <span class="ml-auto text-sm text-[#0064ff] mr-10px fw-600">
              <el-button
                v-if="permissionSet.has('SupplierAssessType:Delete')"
                type="danger"
                plain
                @click="handleRemove(progress)"
                >删除</el-button
              >
              <el-button
                v-if="permissionSet.has('SupplierAssessType:Edit')"
                type="primary"
                @click="handleEdit(progress)"
                >编辑</el-button
              >
            </span>
          </div>
        </template>

        <!-- 考核项目详情 -->
        <div class="assessment-details">
          <div v-for="(item, index) in progress" :key="item.id" class="assessment-item mb-3">
            <div class="title font-normal h-[40px] p-[10px] flex items-center">
              <span>{{ index + 1 }}、{{ item.itemName }}</span>
              <span class="ml-2">（分值：{{ item.score }}分）</span>
            </div>

            <div
              :style="{
                'white-space': 'pre-line',
                'word-break': 'break-all'
              }"
              class="mt-[14px] text-[#666] text-sm overflow-hidden transition-all duration-300 bg-#fff px-12px py-10px"
            >
              {{ item.rules?.replace(/\\n/g, '\n') }}
            </div>
          </div>
        </div>
      </el-card>
    </el-scrollbar>

    <el-card v-else class="!bg-#f9f9f9 rounded-8px content mb-4" shadow="never">
      <el-empty class="" :image="EMPTYSVG" :image-size="384" />
    </el-card>
  </el-card>

  <add-assess-type-drawer
    v-bind="addDrawerProps"
    v-model="addDrawerProps.modelValue"
    @refresh="getData"
    @closed="handleClosedDrawer"
  />
</template>
<script lang="ts" setup>
import { getAssessmentTypeListApi, removeAssessmentTypeApi } from '@/api/supplier/assess'
import EmptySvg from '@/assets/svgs/supplier/empty.svg'
import AddAssessTypeDrawer from './components/addAssessTypeDrawer.vue'
import { getDictOptions, DICT_TYPE } from '@/utils/dict'
import { FormInstance } from 'element-plus'
import { getPermission } from '@/utils'

defineOptions({ name: 'SupplierAssessType' })

const message = useMessage()
const typeOps = getDictOptions(DICT_TYPE.SUPPLIER_ASSESSMENT_TYPE).reverse()
const EMPTYSVG = EmptySvg
const permissionSet = new Set(getPermission())

const queryParams = reactive({
  queryKey: '',
  assessmentType: '1'
})
const progressInfo = ref<Supplier.Assess.SupplierAssessmentQuizDetailDto[][]>([])
const loading = ref(false)
const addDrawerProps = reactive({
  modelValue: false,
  rowData: {} as any,
  assessmentType: '1',
  sort: 0
})
const formRef = ref<FormInstance>()

// 获取进度项唯一标识（替代index作为key）
function getProgressKey(progress: Supplier.Assess.SupplierAssessmentQuizDetailDto[]) {
  return progress[0]?.assessmentItemId ?? progress[0]?.id
}

// 计算总分
function getSumMaxScore(progress: Supplier.Assess.SupplierAssessmentQuizDetailDto[]) {
  return progress.reduce((sum, item) => sum + (item.score ?? 0), 0)
}

async function getData() {
  if (loading.value) return
  try {
    loading.value = true
    const res = await getAssessmentTypeListApi(queryParams)

    progressInfo.value = reverseFlatMap(res, (item) => item?.id)
      .map((ele) => ele.sort((a, b) => (a.itemSort ?? 0) - (b.itemSort ?? 0)))
      .sort((a, b) => (a[0].sort ?? 0) - (b[0].sort ?? 0))
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

/**
 * 分组函数
 * @param array 被分组的数据
 * @param groupFn 分组的标准
 */
function reverseFlatMap<T, K>(array: T[], groupFn: (item: T, index: number) => K): T[][] {
  const groups = new Map<K, T[]>()

  array.forEach((item, index) => {
    const key = groupFn(item, index)
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)?.push(item)
  })

  return Array.from(groups.values())
}

function resetQuery() {
  formRef.value?.resetFields()
  getData()
}

function handleTabChange() {
  getData()

  addDrawerProps.assessmentType = queryParams.assessmentType
}

async function handleRemove(item: any) {
  await message.confirm('删除当前考核模块存在数据缺失，是否确定删除？')

  try {
    const res = await removeAssessmentTypeApi({ id: item[0].id })

    if (res.success) {
      ElMessage.success('删除成功！')
      getData()
    }
  } catch (error) {}
}

function handleEdit(item: any) {
  addDrawerProps.rowData = item
  addDrawerProps.modelValue = true
  addDrawerProps.sort = item[0].sort ?? 0
}

function handleAdd() {
  addDrawerProps.modelValue = true
  delete addDrawerProps.rowData
  addDrawerProps.sort = Math.max(...progressInfo.value.map((ele) => ele[0].sort ?? 0)) + 1
}

function handleClosedDrawer() {
  delete addDrawerProps.rowData
}

onBeforeMount(getData)
onActivated(getData)
</script>
<style lang="less" scoped>
@import url(../../index.scss);

* {
  --content-height: calc(
    100vh - var(--app-content-padding) - var(--app-content-padding) - var(--app-footer-height) -
      145px
  );
}

.el-form-item {
  margin-bottom: 0;
}

// 空状态样式
.empty-state {
  padding: 40px 0;
  text-align: center;
}

// 卡片样式
.content {
  margin-bottom: 12px;

  :deep(.el-card__header) {
    padding: 10px;
    padding-bottom: 10px;
  }

  :deep(.el-card__body) {
    padding: 15px;
    overflow: hidden;
    box-sizing: border-box;
    transition: all 0.3s ease;
  }

  :deep(.el-card__footer) {
    padding-top: 10px;
    padding-bottom: 10px;
  }
}

// 隐藏状态
.hide {
  :deep(.el-card__body) {
    padding-top: 0;
    padding-bottom: 0;
    max-height: 0;
    opacity: 0;
    overflow: hidden;
  }

  :deep(.el-card__footer) {
    border-top: 0;
  }
}

// 标题样式
.title {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
  box-sizing: border-box;

  // &::before {
  //   content: '';
  //   display: block;
  //   margin-right: 6px;
  //   width: 3px;
  //   height: 10px;
  //   background-color: #0064ff;
  // }
}

// 考核人员样式
.assess-persons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 5px 0;
}

.order-handler-item {
  align-items: center;
}

.assessment-item {
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }
}

// 状态标签样式
.status {
  border-radius: 14px;
  font-size: 14px;
  width: fit-content;
  min-width: 74px;
}
.main {
  & > :deep(.el-card__body) {
    padding-top: 0;

    height: var(--content-height);
  }

  .el-empty {
    height: calc(var(--content-height) - 95px);
  }

  :deep(.el-tabs__item) {
    --el-tabs-header-height: 46px;

    width: 64px;
    padding: 0;
  }
}

.el-scrollbar {
  height: calc(100% - 66px);
}
</style>
