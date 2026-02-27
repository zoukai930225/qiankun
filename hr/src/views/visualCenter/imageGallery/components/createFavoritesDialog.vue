<template>
  <SchemeDialog ref="schemeDialogRef" name="CreateFavorites" :width="424" :align="true">
    <template #card>
      <div class="create-container">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="96px" @submit.prevent>
          <el-form-item label="收藏夹名称" prop="name">
            <el-input
              v-model="formData.name"
              maxlength="100"
              placeholder="请输入收藏夹名称"
              clearable
            />
          </el-form-item>
        </el-form>
      </div>
    </template>

    <template #button>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleConfirm">确定</el-button>
    </template>
  </SchemeDialog>
</template>

<script setup lang="ts">
import { ref, provide, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { addFavorites } from '@/api/gallery'
import { useMessage } from '@/hooks/web/useMessage'

type FavoritesType = '1' | '2'

interface CreateFavoritesForm {
  name: string
  favoritesType: FavoritesType
  pId: string | undefined
}

const emit = defineEmits<{ (e: 'success'): void }>()

const schemeDialogRef = ref()
const formRef = ref<FormInstance>()
const loading = ref(false)
const dialogTitle = ref('新建收藏夹')

const formData = ref<CreateFavoritesForm>({
  name: '',
  favoritesType: '2',
  pId: undefined
})

const dataValue = ref<CreateFavoritesForm>({ ...formData.value })
const bukValue = ref<CreateFavoritesForm>({ ...formData.value })

provide('CreateFavoritesDetails', {
  dataValue,
  bukValue,
  viewType: ref('edit'),
  title: dialogTitle,
  loading
})

watch(
  formData,
  (val) => {
    dataValue.value = { ...val }
  },
  { deep: true }
)

const rules: FormRules = {
  name: [{ required: true, message: '请输入收藏夹名称', trigger: 'blur' }]
}

const message = useMessage()

const resetState = (payload: { favoritesType: FavoritesType; title?: string, favoritesId?: string }) => {
  formData.value.name = ''
  formData.value.favoritesType = payload.favoritesType
  dialogTitle.value = payload.title ?? '新建收藏夹'
  formData.value.pId = payload.favoritesId || undefined
  dataValue.value = { ...formData.value }
  bukValue.value = { ...formData.value }
}

const open = (payload: { favoritesType: FavoritesType; title?: string, favoritesId?: string }) => {
  resetState(payload)
  schemeDialogRef.value?.openDialog?.(() => {
    formRef.value?.clearValidate?.()
  })
}

const close = () => {
  schemeDialogRef.value?.close?.()
}

const handleConfirm = async () => {
  if (!formRef.value) return
  await formRef.value.validate()
  loading.value = true
  try {
    await addFavorites({
      favoritesName: formData.value.name,
      favoritesType: formData.value.favoritesType,
      pId: formData.value.pId
    })
    message?.success?.('新建收藏夹成功')
    bukValue.value = { ...formData.value }
    emit('success')
    close()
  } catch (error) {
    console.error('addFavorites error:', error)
  } finally {
    loading.value = false
  }
}

defineExpose({ open, close })
</script>

<style scoped>
.create-container {
  padding: 20px 0;
}
</style>
