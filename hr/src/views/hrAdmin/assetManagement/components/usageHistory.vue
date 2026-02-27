<template>
  <el-dialog
    class="commomDialig"
    v-model="dialogVisible"
    :title="dialogTitle"
    :destroy-on-close="true"
    style="width: 700px"
    :align-center="true"
  >
    <ContentWrap>
      <el-table
        :data="list"
        style="width: 100%"
        :border="true"
        v-loading="loading"
        key="table1"
        :show-overflow-tooltip="true"
        @selection-change="handleSelectionChange"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
      >
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column label="使用人" prop="username" align="center" />
        <el-table-column label="手机号码" prop="phone" align="center" />
        <el-table-column
          label="使用开始时间"
          prop="beginDate"
          :formatter="translateDate"
          align="center"
        />
        <el-table-column
          label="使用结束时间"
          prop="endDate"
          :formatter="translateDate"
          align="center"
          :show-overflow-tooltip="false"
        />
      </el-table>
    </ContentWrap>
    <template #footer>
      <el-button @click="dialogVisible = false"> 关 闭</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import * as Asset from '@/api/hrAdmin/asset'

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
defineOptions({ name: 'RelatedProgramList' })

const list = ref<any[]>([])
const loading = ref(false) // 列表的加载中

const fixedAssetId = ref('')
/** 打开弹窗 */
const open = async (paramName?: string, id?: string) => {
  dialogVisible.value = true
  if (paramName !== undefined) {
    dialogTitle.value = paramName
  }

  // 修改时，设置数据
  // console.log('接收到paramName', paramName)
  if (id) {
    formLoading.value = true
    try {
      // console.log('接收到id', id)
      fixedAssetId.value = id
      getList()
    } finally {
      formLoading.value = false
    }
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/**
 * 多选
 */
const multipleSelection = ref<any[]>([])
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
}

/** 查询字典类型列表 */
const getList = async () => {
  loading.value = true
  try {
    // console.log('查询参数', fixedAssetId.value)
    const data = await Asset.getAssetHistoryUser(fixedAssetId.value).catch(() => {
      loading.value = false
    })
    console.log('data', data)
    list.value = data || []
  } finally {
    loading.value = false
  }
}
// 时间格式化
const translateDate = (row, column) => {
  // 检查值是否为null
  if (row[column.property] === null) {
    return '---'
  }
  let date = new Date(row[column.property])
  return date.toLocaleString('zh-CN', { hour12: false })
}
</script>
