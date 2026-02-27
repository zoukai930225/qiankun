<template>
  <div class="batch-seeting-dialog">
    <el-form ref="formRef" :model="formData" label-width="96px" :validate-on-rule-change="false">
      <el-form-item label="区域：" prop="area">
        <el-select v-model="formData.areaId" placeholder="请选择区域">
          <el-option v-for="item in areaOptions" :key="(item as OptionItem).value" :value="(item as OptionItem).value"
            :label="(item as OptionItem).label"></el-option>
            <template #label></template>
        </el-select>
      </el-form-item>
      <el-form-item label="价格：" prop="price">
        <sw-input-number v-model="formData.price" placeholder="请输入价格"></sw-input-number>
      </el-form-item>
      <el-form-item label="使用人：" prop="user" class="user-form-item">
        <el-input v-model="formData.user" readonly placeholder="请选择">
          <template #append>
            <el-button @click="openChangeUser">选择人员</el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <ChangeUser ref="ChangeUserRef" type="assetManage" @success="handleChangeUserSuccess" />
  </div>
</template>

<script lang="ts" setup name="BatchSeeting">
import { useMessage } from '@/hooks/web/useMessage'
import {batchSet} from '@/api/hrAdmin/asset'
import ChangeUser from '@/views/hrAdmin/assetManagement/components/changeUser.vue'

const message = useMessage()
const emits = defineEmits(['success'])
type OptionItem = {
  value: string
  label: string
}
class FormData {
  areaId: string = '';
  price: number | undefined = undefined;
  user: string = '';
  userId: string = '';
}
const props = defineProps({
  areaOptions: {
    type: Array,
    default: (): OptionItem[] => []
  },
  fixedAssetIds: {
    type: Array,
    default: (): string[] => []
  }
})
const formRef = ref()
const ChangeUserRef = ref()
const formData = ref({ ...new FormData })

const submit = async () => {
  try {
    const data = {
      fixedAssetIds: props.fixedAssetIds.map((item: any) => item.id),
      ...formData.value
    }
    await batchSet(data)
    message.success('批量设置成功')
    emits('success')
  } finally {

  }
}

const openChangeUser = () => ChangeUserRef.value?.open?.()

const handleChangeUserSuccess = (userData: any) => {
  formData.value.user = userData.name
  formData.value.userId = userData.id
  formRef.value?.clearValidate?.(['user'])
}

defineExpose({ submit })
</script>

<style lang="scss" scoped>
:deep(.el-form) {
  .user-form-item {
    .el-input__wrapper {
      box-shadow: 0 0 0 1px #e5e5e5 inset;
    }
  }
}
</style>