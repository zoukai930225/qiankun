<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle" :width="516" @close="reset">
    <el-scrollbar>
      <!-- v-loading="drawerLoading0 || drawerLoading1" -->
      <div class="card">
        <div class="header">
          <CardTitle :title="'供应商选择'" />
          <div class="btn" v-if="!disabled">
            <el-button type="primary" @click="addList">
              <Icon :size="14" icon="ep:plus" class="mr4px" />
              添加供应商
            </el-button>
          </div>
        </div>
        <div class="inner">
          <div class="infoCard" v-for="(form, index) in supplierCardList" :key="index">
            <div class="flex justify-between">
              <div class="title">
                <span style="margin-right: 20px;">{{ `供应商 ${index + 1}` }}</span>
                <img v-if="!!(form as any)?.id" :src="form?.status === 1 ? statusDetail : statusEdit"
                  style="margin-right: 5px;width: 16px;height: 16px;" />
                <div :class="[form?.status === 1 ? 'status_detail' : 'status_edit']" v-if="!!(form as any)?.id">
                  {{ form?.status === 1 ? '已提交' : '暂存中' }}
                </div>
              </div>
              <div class="btn">
                <img :src="delSvg" style="display: inline-block;margin-left: 8px;" @click="handleListDel(index)"
                  v-if="index > 0 && !disabled && form?.status !== 1" />
              </div>
            </div>
            <div class="form">
              <el-form scroll-to-error label-width="100" :model="form" ref="formRef" :rules="formRules"
                :disabled="disabled || form?.status === 1">
                <el-form-item label="供应商名称" prop="supplierId">
                  <el-select v-if="!(disabled || form?.status === 1)" :placeholder="'请选择供应商'" clearable filterable
                    v-model="form.supplierId">
                    <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id"
                      :disabled="disabledSupplierSelect(item.id)" />
                  </el-select>
                  <el-input v-else class="dialogFormItemWidth" v-model.trim="form.supplierName" />
                </el-form-item>
                <el-form-item label="匹配原因" prop="matchReason">
                  <s-text-area v-model="form.matchReason" maxlength="500" show-word-limit :rows="4" />
                </el-form-item>
                <el-form-item label="预估报价" prop="matchPrice">
                  <el-input v-model="form.matchPrice" maxlength="50" show-word-limit />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>

      </div>
    </el-scrollbar>

    <template #footer>
      <el-button @click="reset" style="color:#666;">关闭</el-button>
      <el-button @click="submit(0)" :loading="drawerLoading0" class="borderBtn">暂存</el-button>
      <el-button @click="submit(1)" :loading="drawerLoading1" type="primary">提交</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import * as fabricDevelopmentApi from '@/api/supplier/fabricManagement/fabricDevelopment'
import CardTitle from '@/views/OA/factory/components/cardTitle.vue'
import delSvg from '@/assets/svgs/del.svg';
import statusDetail from '@/assets/svgs/statusDetail.svg'
import statusEdit from '@/assets/svgs/statusEdit.svg'
import * as factoryDevelopApi from '@/api/oa/factory/develop'
import { useUserStore } from '@/store/modules/user';
import request from '@/config/axios'

const userStore = useUserStore();
const message = useMessage()
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerLoading0 = ref(false)
const drawerLoading1 = ref(false)
const drawerType = ref('')
const fabricId = ref('') // 工厂二开任务id

const disabled = computed(() => drawerType.value === 'supplierInfo');
const pickerSupplierDisabled = inject<any>('pickerSupplierDisabled')
const assignUserDisabled = ref(false)





const isFinish = ref(false)


const open = async (type, id, row) => {
  drawerType.value = type
  drawerTitle.value = type === 'supplierInfo' ? '供应商信息' : '供应商信息'
  fabricId.value = id
  const listIds = row.productDevelopmentList.map(x => x.userId)
  isFinish.value = row.currentNodeName === '已终止'
  assignUserDisabled.value = listIds.includes(userStore.user.id)

  getAllSuppliers().then(async () => {
    if (id) {
      try {

        const data = await fabricDevelopmentApi.getSupplierMappingList(id)
        if (data && data.length) {
          supplierCardList.value = data
        }
      } finally {
        drawerVisible.value = true
      }
    } else {
      drawerVisible.value = true
    }
  });


}

const supplierList = ref<any>([])
const getAllSuppliers = async () => {
  const data = await request.get({ url: `/api/np/plan/queryAdoptSupplier` })
  if (data && data.length) {
    supplierList.value = data
  }
}
//  控制供应商不可重复选择
const disabledSupplierSelect = (id: string) => {
  return supplierCardList.value.map((li: any) => li.supplierId).includes(id)
}
// 表单校验
const formRules = reactive({
  supplierId: [{ required: true, message: '请选择供应商', trigger: ['blur', 'change'] }],
  matchReason: [{ required: true, message: '请填写匹配原因', trigger: ['blur', 'change'] }],
  matchPrice: [{ required: true, message: '请填写预估报价', trigger: ['blur', 'change'] }],
})

// 请求参数
const supplierCardList = ref([{
  supplierId: '',
  supplierName: '',
  matchReason: '',
  matchPrice: '',
  status: 0
}])
const formRef = ref()

// list 操作
const addList = () => {
  supplierCardList.value.push({
    supplierId: '',
    supplierName: '',
    matchReason: '',
    matchPrice: '',
    status: 0
  })
}
const handleListDel = (index) => {
  supplierCardList.value.splice(index, 1)
}

// status 0 暂存 1 提交
const submit = async (status: number) => {
  await Promise.all(formRef.value?.map(formRef => formRef?.validate()))
  const params = {
    status,
    fabricId: fabricId.value,
    dataList: supplierCardList.value.map((supplier: any) => ({
      id: supplier.id,
      supplierId: supplier.supplierId,
      matchReason: supplier.matchReason,
      matchPrice: supplier.matchPrice,
    }))
  }
  if (status === 1) await message.confirm('正在提交当前“匹配供应商”节点，提交完成后，该节点流程将结束且不可修改，是否继续提交？')
  if (status === 0) {
    drawerLoading0.value = true
  } else {
    drawerLoading1.value = true
  }
  try {
    await fabricDevelopmentApi.saveOrSubmitSupplier(params)
    message.success('保存成功')
    reset()
    emits('success')
  } finally {
    drawerLoading0.value = false
    drawerLoading1.value = false
  }
}
const reset = async () => {
  supplierCardList.value = [{
    supplierId: '',
    supplierName: '',
    matchReason: '',
    matchPrice: '',
    status: 0
  }]
  await Promise.all(formRef.value?.map(formRef => formRef?.resetFields()))
  drawerVisible.value = false
}
const emits = defineEmits(['success'])
defineExpose({ open })
</script>

<style lang="less" scoped>
@import '@/views/OA/factory/style/card.scss';

:deep(.el-textarea.is-disabled .el-textarea__inner) {
  color: #666666 !important;
}

.btn {
  float: right;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.title {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .status_detail {
    color: #349B34;
    display: inline-block;
    font-size: 14px;
    height: 16px;
    line-height: 14px;
    font-weight: 500;
  }

  .status_edit {
    color: #EE9F00;
    display: inline-block;
    font-size: 14px;
    height: 16px;
    line-height: 14px;
    font-weight: 500;
  }
}
</style>
