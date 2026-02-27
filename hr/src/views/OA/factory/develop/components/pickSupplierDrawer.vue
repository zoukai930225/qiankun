<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle" :width="516" @close="reset">
    <el-scrollbar>
      <div class="card" v-loading="drawerLoading">
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
                    v-model="form.supplierId" placement="bottom-end">
                    <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id"
                      :disabled="disabledSupplierSelect(item.id) || item.isRecycled === 1">
                      <span>
                        <line-tage v-if="item.isRecycled === 1" txt="已回收" color="#999999" background="#EBEBEB"></line-tage>
                        <span style="margin-left: 5px;">{{ item.supplierName }}</span>
                      </span>
                    </el-option>
                  </el-select>
                  <el-input v-else class="dialogFormItemWidth" v-model.trim="form.supplierName" disabled />
                </el-form-item>
                <el-form-item label="匹配原因" prop="matchReason">
                  <s-text-area v-model="form.matchReason" maxlength="500" show-word-limit  :rows="4" />
                </el-form-item>
                <el-form-item label="预估报价" prop="matchPrice">
                  <el-input v-model="form.matchPrice" />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>

      </div>
    </el-scrollbar>

    <template #footer>
      <el-button @click="reset">关闭</el-button>
      <el-button v-if="drawerType !== 'supplierInfo'" @click="submit(0)" :loading="drawerLoading"
        class="borderBtn">暂存</el-button>
      <el-button v-if="drawerType !== 'supplierInfo'" @click="submit(1)" :loading="drawerLoading"
        type="primary">提交</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import * as factoryDevelopApi from '@/api/oa/factory/develop'
import CardTitle from '@/views/OA/factory/components/cardTitle.vue'
import delSvg from '@/assets/svgs/del.svg';
import statusDetail from '@/assets/svgs/statusDetail.svg'
import statusEdit from '@/assets/svgs/statusEdit.svg'
import lineTage from "@/components/template/table/components/lineTage.vue";

const message = useMessage()
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerLoading = ref(false)
const drawerType = ref('')
const fsTaskId = ref('') // 工厂二开任务id

const disabled = computed(() => drawerType.value === 'supplierInfo');

const open = async (type, id) => {
  drawerType.value = type
  drawerTitle.value = type === 'supplierInfo' ? '供应商信息' : '匹配供应商'
  fsTaskId.value = id
  getAllSuppliers().then(async () => {
    if (id) {
      try {
        drawerLoading.value = true
        const data = await factoryDevelopApi.getSupplierMappingList(id)
        if (data && data.length) {
          supplierCardList.value = data
        }
      } finally {
        drawerVisible.value = true
        drawerLoading.value = false
      }
    } else {
      drawerVisible.value = true
    }
  });


}

const supplierList = ref<any>([])
const getAllSuppliers = async () => {
  const data = await factoryDevelopApi.queryAdoptSupplier(fsTaskId.value)
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
    fsTaskId: fsTaskId.value,
    dataList: supplierCardList.value.map((supplier: any) => ({
      id: supplier.id,
      supplierId: supplier.supplierId,
      matchReason: supplier.matchReason,
      matchPrice: supplier.matchPrice,
    }))
  }
  if (status === 1) await message.confirm('正在提交当前“匹配供应商”节点，提交完成后，该节点流程将结束且不可修改，是否继续提交？')
  drawerLoading.value = true
  try {
    await factoryDevelopApi.saveOrSubmitSupplier(params)
    message.success('保存成功')
    reset()
    emits('success')
  } finally {
    drawerLoading.value = false
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
