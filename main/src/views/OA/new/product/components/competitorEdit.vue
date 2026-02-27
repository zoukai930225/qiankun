<template>
  <div>
    <div class="form-wapper">
      <el-table
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
        :header-cell-style="appStore.headerCellStyle"
        :data="dataList"
        :stripe="true"
        :show-overflow-tooltip="true"
        row-class-name="commonTableRow"
        width="100%"
      >
        <el-table-column
          v-for="field in showTableColumns"
          :key="field.code"
          :prop="field.code"
          :label="field.name"
          :min-width="field.width || '100px'"
        >
          <template #default="{ row }">
            <span
              class="table-edite"
              v-if="
                !isEditable(row, field.code) &&
                field.code !== 'imgUrl' &&
                field.code !== 'competitiveLink'
              "
            >
              {{ row[field.code] || '--' }}
            </span>
            <!-- 链接点击跳转 -->

            <span
              class="table-edite"
              v-if="!isEditable(row, field.code) && field.code === 'competitiveLink'"
            >
              <el-icon
                color="#409eff"
                @click="handleLinkTo(row[field.code])"
                style="cursor: pointer; margin-right: 5px"
                ><Link
              /></el-icon>

              <span>
                {{ row[field.code] }}
              </span>
            </span>
            <!-- 文本编辑 -->
            <el-input
              v-if="isEditable(row, field.code) && field.type === 0"
              class="table-input"
              v-model="row[field.code]"
              clearable
            />
            <!-- 上传图片 -->

            <div v-if="field.type === 7">
              <div v-if="row.imgUrl">
                <img :src="row.imgUrl" class="upload-image" @click="imagePreview(row.imgUrl)" />
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- 添加操作列 -->
        <el-table-column v-if="!forbidEdit" label="操作" width="120" fixed="right" align="left">
          <template #default="{ row, $index }">
            <el-button link type="primary" style="color: #0064ff" @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button link type="danger" @click="handleDel(row, $index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="pagination"> -->
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="params.page"
        v-model:limit="params.pageSize"
        @pagination="getList"
      />
      <!-- </div> -->
    </div>
    <CompetiorAddDialog ref="competiorAddDialogRef" @confirm="addCompetiorSuccess" />
  </div>
</template>

<script lang="ts" setup>
import { Delete, CircleCheck } from '@element-plus/icons-vue'
import { createImageViewer } from '@/components/ImageViewer'
import { useAppStore } from '@/store/modules/app'
import { defineProps } from 'vue'

import CompetiorAddDialog from './competiorAddDialog.vue'

import { getCompetorsList, addCompetor, delCompetor, updateCompetitive } from '@/api/oa/new/develop'
const appStore = useAppStore()
const message = useMessage() // 消息弹窗
const isVisible = ref(false)
const showTableColumns = ref([
  { name: '店铺', code: 'store', type: 0, require: true },
  { name: '链接', code: 'competitiveLink', type: 0, require: true, width: 200 },
  { name: '销量', code: 'salesVolume', type: 0, require: false },
  { name: '客单价', code: 'customerUnitPrice', type: 0, require: false },
  { name: '平台备注', code: 'remarks', type: 0, require: false },
  { name: '图片', code: 'imgUrl', type: 7, require: false }
])
const total = ref(0)
const params = ref({
  page: 1,
  pageSize: 10
})

const props = defineProps({
  currentId: {
    type: String,
    default: ''
  },
  developmentPlanId: {
    type: String,
    default: ''
  },
  forbidEdit: {
    type: Boolean,
    default: false
  }
})
const handleLinkTo = (link: string) => {
  window.open(link)
}

const competiorAddDialogRef = ref()
// 添加竞品信息成功
const addCompetiorSuccess = () => {
  getList()
}

// 判断是否编辑状态
const isEditable = (row, key) => {
  return false
  let name = key + 'Editable'
  return row[name]
}

const dataList = ref<any[]>([])
// 新增
const handleAdd = () => {
  competiorAddDialogRef.value.open(null, props.currentId, props.developmentPlanId)
}

const open = async (id) => {
  handleAdd()
}
// 列表
const getList = async () => {
  const res = await getCompetorsList({ ...params.value, npDesignPictureId: props.currentId })
  dataList.value = res.records || []
  total.value = res.total
}
const imagePreview = (path: string) => {
  createImageViewer({
    zIndex: 9999999,
    urlList: [path]
  })
}

// 编辑
const handleEdit = (row: any) => {
  competiorAddDialogRef.value.open(row, props.currentId, props.developmentPlanId)
}
// 删除
const handleDel = async (row: any, index: number) => {
  // 删除二次确认
  await message.confirm('确认删除吗？')
  if (!row.id) {
    dataList.value.splice(index, 1)
  } else {
    await delCompetor({ id: row.id })
    getList()
  }
  message.success('删除成功')
}
const reset = () => {
  dataList.value = []
  isVisible.value = false
  currentId.value = ''
  emit('success')
}

const emit = defineEmits(['success'])

defineExpose({ open, getList })
</script>

<style lang="scss" scoped>
:deep(.el-drawer__body){
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
  border: 1px solid #e5e5e5;
}

.drawer-wapper {
  min-width: 700px;
  background: #f6f6f6;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
}

.title-wapper {
  justify-content: space-between;
  width: 100%;
  padding-bottom: 18px;

  .close {
    width: 23px;
    height: 23px;
    cursor: pointer;
  }

  .title {
    font-size: 14px;
    color: #333333;
    font-weight: 500;
  }
}

.form-wapper {
  // min-height: calc(100vh - 110px);
  margin-left: 20px;
  margin-right: 20px;
  .header-wapper {
    margin-bottom: 16px;
    align-items: center;

    .icon {
      width: 3px;
      height: 10px;
      background: #0064ff;
      margin-right: 5px;
    }
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
}
.upload-image {
  width: 60px;
  height: 60px;
  cursor: pointer;
}
</style>
