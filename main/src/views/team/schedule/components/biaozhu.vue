<!--
 * @Date: 2024-09-12 13:12:09
-->
<!--圆形进度条-->
<template>
  <el-dialog v-model="dialogVisible" title="标注" width="800">
    <el-form :model="detail" label-width="80px">
      <el-form-item label="排序" v-if="!isTemporary">
        <el-input v-model="detail.priority" type="number" />
      </el-form-item>
      <el-form-item label="上架周期" v-if="!isTemporary">
        <el-select v-model="detail.cycle" placeholder="请选择上架周期" clearable>
          <el-option-group v-for="group in cycleList" :key="group?.name" :label="group?.name">
            <el-option
              v-for="dict in group?.children"
              :key="dict.code"
              :label="dict.name"
              :value="dict.code"
            />
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <div style="width: calc(100% - 30px)">
          <Editor height="200px" v-model:modelValue="detail.tag" />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit" :loading="loading"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { updateVisualInfo } from '@/api/team/index'
import { getListingCycle } from '@/api/team/index'
const message = useMessage() // 消息弹窗

import { Editor } from '@/components/Editor'
const dialogVisible = ref(false)
const detail = ref({
  id: undefined,
  priority: undefined,
  tag: undefined,
  cycle: undefined
})

// 上架周期
const cycleList = ref([])
const initBaseList = async () => {
  const res = await getListingCycle()
  cycleList.value = res || []
}

const isTemporary = ref(false)
const open = (item, type) => {
  initBaseList()
  isTemporary.value = type == 2
  dialogVisible.value = true
  const params = {
    id: item.id,
    priority: item.priority,
    tag: item.tag,
    cycle: item.cycle
  }
  detail.value = params
}

const emit = defineEmits(['success'])
const loading = ref(false)
const submit = async () => {
  try {
    const params = {
      id: detail.value.id,
      priority: isTemporary.value ? undefined : detail.value.priority,
      tag: detail.value.tag,
      cycle: isTemporary.value ? undefined : detail.value.cycle
    }
    loading.value = true
    await updateVisualInfo(params)
    loading.value = false
    message.success('操作成功')
    dialogVisible.value = false
    emit('success')
  } catch (error) {
    loading.value = false
  }
}

defineExpose({ open, close })
</script>

<style scoped lang="scss"></style>
