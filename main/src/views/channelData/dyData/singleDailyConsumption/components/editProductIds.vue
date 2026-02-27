<template>
  <div>
    <s-w-dialog v-model="dialogVisible" :title="isEditMode ? '编辑商品id' : '添加商品id'" width="700px" @close="resetForm"
      :before-close="beforeClose">
      <div v-loading="loading">
        <el-form :model="formData" ref="formRef" label-width="100px" :rules="formRules">
          <el-form-item label="店铺名称" prop="store">
            <el-select filterable clearable v-model="formData.store" placeholder="请选择店铺名称" :disabled="isEditMode">
              <el-option v-for="item in storeList" :key="item.id" :label="item.nickName" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="商品ID" prop="goodsId">
            <el-select filterable remote multiple v-model="formData.goodsId" placeholder="请选择商品ID"
              :remote-method="searchGoods" :loading="loading" value-key="goodsId" collapse-tags>
              <el-option v-for="(item, idx) in goodsList" :key="idx" :label="item.goodsName" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="已选择商品">
            <div class="tags-container">
              <el-tooltip v-for="(v, k) in formData.goodsId" :key="k" :content="`${v.goodsId} - ${v.goodsName}`"
                placement="top" effect="dark">
                <el-tag closable @close="handleClose(k)" class="tag-item">
                  {{ v.goodsId }} - {{ v.goodsName }}
                </el-tag>
              </el-tooltip>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="loading">确定</el-button>
      </template>
    </s-w-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, watch, nextTick, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getGoodsInfoByStoreAndId,
  saveDouyinSkuControlConfig,
  getDouyinSkuControlConfig,
  updateDouyinSkuControlConfig
} from '@/api/channelData'
import { Store, Goods } from '../types/channelData'

const emits = defineEmits(['success'])

// 使用inject获取父组件提供的storeList
const storeList = inject<Store[]>('storeList', [])

// 表单数据
const dialogVisible = ref(false)
const loading = ref(false)
const formRef = ref()
const isEditMode = ref(false)
const formData = reactive({
  store: '',
  goodsId: [] as Goods[],
  id: ''
})
const goodsList = ref<Goods[]>([])

// 表单验证规则
const formRules = {
  store: [{ required: true, message: '请选择店铺名称', trigger: 'blur' }],
  goodsId: [{ required: true, message: '请选择商品ID', trigger: 'blur' }]
}

// 初始化的列表
const initialFormData = ref({})

// 当店铺变化时，清空商品ID
watch(
  () => formData.store,
  () => {
    formData.goodsId = []
    goodsList.value = []
  }
)

// 远程搜索商品
async function searchGoods(query: string) {
  if (!formData.store) {
    ElMessage.warning('请先选择店铺')
    return
  }

  if (query) {
    loading.value = true
    try {
      const res = await getGoodsInfoByStoreAndId({
        store: formData.store,
        goodsId: query
      })
      goodsList.value = res || []
    } catch (error) {
      console.error('获取商品失败:', error)
      goodsList.value = []
    } finally {
      loading.value = false
    }
  } else {
    goodsList.value = []
  }
}

// 整合的打开对话框函数
async function open(rowData?: any) {
  // 根据是否有rowData和id来判断是否是编辑模式
  isEditMode.value = !!(rowData && rowData.id)
  dialogVisible.value = true

  // 重置表单数据
  formData.id = ''
  formData.store = ''
  formData.goodsId = []
  goodsList.value = []

  // 如果是编辑模式
  if (isEditMode.value && rowData.id) {
    loading.value = true
    try {
      // 通过ID获取详情
      const detailData = await getDouyinSkuControlConfig(rowData.id)
      if (detailData) {
        formData.id = detailData.id
        formData.store = detailData.store

        // 如果有商品ID列表和商品名称列表，直接构建商品数据
        if (detailData.goodsId && detailData.remark) {
          const goodsIds = detailData.goodsId.split(',')
          const goodsNames = detailData.remark.split(',')

          // 构建商品列表数据并更新
          const goodsItemList: Goods[] = []
          goodsIds.forEach((id, index) => {
            if (id.trim()) {
              const goodsItem: Goods = {
                id: id.trim(),
                goodsId: id.trim(),
                goodsName: goodsNames[index] || id.trim(),
                store: detailData.store
              }
              goodsItemList.push(goodsItem)
            }
          })

          // 使用nextTick确保DOM更新后再设置数据
          await nextTick()
          goodsList.value = [...goodsItemList]
          formData.goodsId = [...goodsItemList]

          console.log(formData.goodsId, 'formData.goodsId')
          console.log(goodsList.value, 'goodsList.value')
        }
      }
    } catch (error) {
      console.error('获取详情失败:', error)
      ElMessage.error('获取详情失败')
    } finally {
      loading.value = false
    }
  }
  initialFormData.value = JSON.parse(JSON.stringify(formData))
}

// 提交表单
function submitForm() {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        // 更新已选择列表
        if (formData.goodsId && formData.goodsId.length > 0) {
          const params: {
            goodsId: string
            store: string
            id?: string | number
          } = {
            goodsId: formData.goodsId.map((v) => v.goodsId).join(','),
            store: formData.store
          }

          // 如果是编辑模式，添加ID参数
          if (isEditMode.value && formData.id) {
            params.id = formData.id
          }

          await (isEditMode.value ? updateDouyinSkuControlConfig : saveDouyinSkuControlConfig)(
            params
          )
          ElMessage.success(isEditMode.value ? '更新成功' : '保存成功')
          resetForm()
          emits('success')
        } else {
          ElMessage.error('请选择商品ID')
        }
      } catch (error) {
        console.error('添加失败:', error)
        ElMessage.error('添加失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 重置表单
function resetForm() {
  if (formRef.value) {
    nextTick(() => {
      formRef.value.resetFields()
    })
  }
  dialogVisible.value = false
}

// 标签关闭处理
function handleClose(index: number) {
  formData.goodsId.splice(index, 1)
}

function onClose() {
  handleCloseConfirm(resetForm)
}

// 检查表单是否有未保存的修改
function hasUnsavedChanges() {
  return JSON.stringify(formData) !== JSON.stringify(initialFormData.value)
}

// 处理关闭确认
async function handleCloseConfirm(callback: () => void) {
  if (hasUnsavedChanges()) {
    try {
      await ElMessageBox.confirm('内容已修改，是否确认关闭？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      callback()
    } catch (error) {
      // 用户取消关闭
    }
  } else {
    callback()
  }
}

function beforeClose(done: () => void) {
  handleCloseConfirm(done)
}

defineExpose({
  open
})

onMounted(() => {
  // getStoreList()
})
</script>
<style scoped lang="scss">
.selected-products {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  min-height: 60px;
  word-break: break-all;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 8px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  overflow: hidden auto;
  max-height: 300px;

  /* Adjust as needed */
  :deep(.el-tag) {
    max-width: 100%;

    .el-tag__content {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.tag-item {
  white-space: nowrap;
}
</style>
