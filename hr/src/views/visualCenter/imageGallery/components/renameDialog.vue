<template>
  <SchemeDialog ref="schemeDialogRef" name="Rename" :width="480" :align="true">
    <template #card>
      <div class="form-content">
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="80px" @submit.prevent>
          <el-form-item :label="`重命名收\n藏夹`" class="multiline-label-item" prop="favoritesName">
            <s-textarea
              v-model="formData.favoritesName"
              :rows="3"
              placeholder="请输入收藏夹名称"
              clearable
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
    </template>

    <template #button>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="dialogLoading" @click="handleConfirm"> 确定 </el-button>
    </template>
  </SchemeDialog>
</template>

<script lang="ts" setup>
import { ref, reactive, provide, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { editFavorites } from '@/api/gallery'
import { cloneDeep } from 'lodash-es'

const emit = defineEmits(['success'])

interface RenameForm {
  favoritesId: string
  favoritesName: string
  favoritesType: string
}

// --- 内部状态 ---
const schemeDialogRef = ref()
const formRef = ref<FormInstance>()

const formData = reactive<RenameForm>({
  favoritesId: '',
  favoritesName: '',
  favoritesType: ''
})

const dialogLoading = ref(false)
const dialogTitle = ref('重命名收藏夹')

const dataValue = ref<RenameForm>(cloneDeep(formData))
const bukValue = ref<RenameForm>(cloneDeep(formData))

// --- SchemeDialog 的依赖注入 ---
// SchemeDialog 内部会通过 inject('RenameDetails') 获取数据
// 必须提供 dataValue, bukValue, viewType, title, loading
provide('RenameDetails', {
  dataValue,
  bukValue,
  viewType: ref('edit'), // 'edit' 模式会显示底部按钮插槽
  title: dialogTitle,
  loading: dialogLoading
})

watch(
  () => formData,
  () => {
    dataValue.value = cloneDeep(formData)
  },
  { deep: true }
)

const rules = reactive<FormRules>({
  favoritesName: [{ required: true, message: '请输入收藏夹名称', trigger: 'blur' }]
})

// --- 方法 ---

const open = (item: { id: string; name: string; type: string }) => {
  formData.favoritesId = item.id
  formData.favoritesName = item.name
  formData.favoritesType = item.type

  const snapshot = cloneDeep(formData)
  dataValue.value = snapshot
  bukValue.value = cloneDeep(snapshot)

  // 调用 SchemeDialog 暴露的 openDialog 方法
  schemeDialogRef.value?.openDialog(() => {
    // preCall: 打开前的逻辑
    // 清除校验结果
    formRef.value?.clearValidate()
  })
}

const close = () => {
  // 调用 SchemeDialog 暴露的 close 方法
  schemeDialogRef.value?.close()
}

const handleConfirm = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      dialogLoading.value = true
      try {
        await editFavorites({
          favoritesId: formData.favoritesId,
          favoritesName: formData.favoritesName,
          favoritesType: formData.favoritesType
        })

        ElMessage.success('修改成功')
        emit('success')
        bukValue.value = cloneDeep(formData)
        close()
      } catch (error) {
        console.error('重命名失败', error)
      } finally {
        dialogLoading.value = false
      }
    }
  })
}

defineExpose({ open })
</script>

<style scoped>
.form-content {
  padding-top: 10px;
}
</style>
