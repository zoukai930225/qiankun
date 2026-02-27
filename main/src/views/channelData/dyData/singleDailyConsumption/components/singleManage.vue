<template>
  <div>
    <s-w-drawer v-model="dialogVisible" title="单品管理">
      <div class="flex justify-end items-center">
        <!-- <el-form inline>
          <el-form-item label="状态">
            <el-select v-model="statusValue" placeholder="请选择" clearable style="width: 200px">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form> -->
        <el-button type="primary" @click="openAddDialog">添加商品id</el-button>
      </div>
      <div v-if="dialogVisible" class="mt-16px">
        <s-table
          ref="tableRef"
          :fetch="getDouyinSkuControlConfigList"
          :columns="columns"
          show-loading
          pagination
        />
      </div>
      <template #footer>
        <div class="flex justify-end mr-16px">
          <el-button @click="dialogVisible = false">取消</el-button>
          <!-- <el-button type="primary" @click="handleAddSuccess">确定</el-button> -->
        </div>
      </template>
    </s-w-drawer>

    <!-- 使用抽离的编辑商品ID组件 -->
    <edit-product-ids
      ref="editProductIdsRef"
      v-model:selectedProductsData="selectedProducts"
      @success="handleAddSuccess"
    />
  </div>
</template>
<script lang="tsx" setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import EditProductIds from './editProductIds.vue'
import { getDouyinSkuControlConfigList, deleteDouyinSkuControlConfig } from '@/api/channelData'

const dialogVisible = ref(false)
const editProductIdsRef = ref()
const selectedProducts = ref(['12321312', '654654654', '78787776', '8787789'])
const tableRef = ref()

// 状态选择
const statusValue = ref('')
const statusOptions = [
  { value: '0', label: '全部' },
  { value: '1', label: '启用' },
  { value: '2', label: '禁用' }
]

const tableData = ref([])

const columns = ref([
  { prop: 'storeName', label: '店铺名称', width: '220' },
  {
    prop: 'goodsId',
    label: '商品列表',
    customRender: ({ row }) => {
      if (!row.goodsId) return '-'
      let goodsIdList = []
      if (typeof row.goodsId === 'string') {
        goodsIdList = row.goodsId.split(',')
      }
      const displayGoods = goodsIdList.slice(0, 3).map((id, index) => {
        if (index === 2) {
          return id
        }
        return `${id} `
      })
      const tooltipGoods = goodsIdList.slice(3)

      return (
        <ul class="flex items-center gap-2">
          <li class="flex items-center">{displayGoods}</li>
          {goodsIdList.length > 3 && (
            <li class="flex items-center">
              <el-tooltip placement="bottom" effect="dark">
                {{
                  default: () => (
                    <el-tag round size="small" type="info">
                      {goodsIdList.length - 3}
                    </el-tag>
                  ),
                  content: () => (
                    <div class="tooltip-content">
                      {tooltipGoods.map((id) => (
                        <div>{id}</div>
                      ))}
                    </div>
                  )
                }}
              </el-tooltip>
            </li>
          )}
        </ul>
      )
    }
  },
  {
    prop: 'operate',
    label: '操作',
    width: '150',
    customRender: ({ row }) => {
      return [
        <el-button type="primary" link onClick={() => handleEdit(row)}>
          编辑
        </el-button>,
        <el-button type="danger" link onClick={() => handleDelete(row)}>
          作废
        </el-button>
      ]
    }
  }
])

function open() {
  dialogVisible.value = true
}

function handleEdit(row) {
  console.log('编辑', row)
  // 打开编辑对话框
  if (editProductIdsRef.value) {
    // 调用统一的open方法，传递行数据
    editProductIdsRef.value.open({
      id: row.id,
      store: row.store,
      storeName: row.storeName,
      goodsId: row.goodsId
    })
  }
}

function handleDelete(row) {
  // 确定作废${店铺名称}的所有商品ID？
  ElMessageBox.confirm(`确认要作废${row.storeName}的所有商品ID？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteDouyinSkuControlConfig(row.id)
        .then(() => {
          tableRef.value.refresh()
          ElMessage.success('作废成功')
        })
        .catch(() => {
          ElMessage.error('作废失败')
        })
    })
    .catch(() => {})
}

// 打开添加商品对话框
function openAddDialog() {
  editProductIdsRef.value.open()
}

// 处理添加成功事件
function handleAddSuccess() {
  // 可以将新增的数据添加到表格
  tableRef.value.refresh(true)
}

defineExpose({
  open
})
</script>
<style scoped lang="scss">
.filter-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10px;

  .filter-item {
    display: flex;
    align-items: center;
    margin-right: 20px;
    margin-bottom: 10px;

    .label {
      margin-right: 5px;
      color: #606266;
    }
  }
}
:deep(.el-form-item) {
  margin-bottom: 0;
}
</style>
