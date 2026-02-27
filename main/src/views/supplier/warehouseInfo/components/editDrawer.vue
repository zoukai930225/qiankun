<template>
  <div>
    <s-w-drawer
      v-model="drawerVisible"
      :wrapper-closable="true"
      :before-close="handleBeforeClose"
      class="drawer"
      size="936"
      :title="drawerTitle"
      @close="reset"
    >
      <div class="form">
        <el-form
          ref="formRef"
          v-loading="formLoading"
          :model="formData"
          :rules="formRules"
          label-width="90px"
          label-position="right"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="仓库名称" prop="name">
                <el-input
                  v-model.trim="formData.name"
                  placeholder="请输入仓库名称"
                  maxlength="50"
                  show-word-limit
                  :disabled="isShow"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="仓库地址" prop="address">
                <el-input
                  v-model.trim="formData.address"
                  placeholder="请输入仓库地址"
                  maxlength="200"
                  show-word-limit
                  :disabled="isShow"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="联系人" prop="contacts">
                <el-input
                  v-model.trim="formData.contacts"
                  placeholder="请输入联系人"
                  maxlength="50"
                  show-word-limit
                  :disabled="isShow"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="contactNumber">
                <el-input
                  v-model.trim="formData.contactNumber"
                  placeholder="请输入联系电话"
                  :disabled="isShow"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="库存类型" prop="stockType">
                <el-select
                  v-model="formData.stockType"
                  placeholder="请选择库存类型"
                  :disabled="isShow"
                >
                  <el-option value="1" label="成品" />
                  <el-option value="2" label="半成品" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="收货能力" prop="receivingCapability">
                <div class="flex items-center flex-1">
                  <el-input-number
                    :min="0"
                    class="drawerFormItemWidth"
                    v-model="formData.receivingCapability"
                    placeholder="请输入收货能力"
                    :disabled="isShow"
                  >
                    <template #suffix>
                      <span>件/日</span>
                    </template>
                  </el-input-number>
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="填写仓库每日最大收货能力，该参数是工厂预约发货的重要参考依据"
                    placement="right"
                  >
                    <el-icon size="20" color="#666" class="ml-10px">
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="ERP仓库" prop="erpWarehouseCodes">
                <!-- <el-input v-model="formData.erpWarehouseCode" placeholder="请选择ERP仓库"/> -->
                <el-select
                  v-model="formData.erpWarehouseCodes"
                  multiple
                  filterable
                  placeholder="请选择ERP仓库"
                  class="drawerFormItemWidth"
                  value-key="code"
                  :disabled="isShow"
                >
                  <el-option
                    v-for="item in erpWarehouseList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注">
                <s-text-area
                  v-model.trim="formData.remark"
                  placeholder="请输入备注信息"
                  maxlength="2000"
                  show-word-limit
                  :disabled="isShow"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="drawerVisible = false">关 闭</el-button>
        <component :is="easyBtnGroup(btnOps)" />
      </template>
    </s-w-drawer>
  </div>
</template>
<script lang="tsx" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import * as WarehouseInfoApi from '@/api/supplier/warehouseInfo'
import { FormInstance } from 'element-plus'
import Icon from '@/components/Icon/src/Icon.vue'
import { easyBtnGroup } from '../../components/twoFourSix'

const message = useMessage() // 消息弹窗
const route = useRoute()
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerType = ref('')
const drawerLoading = ref(false)
const isShow = ref(false)
const formRef = ref<FormInstance>()
const formLoading = ref(false)
const formData = ref({
  id: '',
  name: '',
  address: '',
  contacts: '',
  contactNumber: '',
  receivingCapability: 0,
  erpWarehouseCode: '',
  erpWarehouseCodes: [],
  remark: '',
  stockType: undefined
})
const formRules = reactive({
  name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
  address: [{ required: true, message: '请输入仓库地址', trigger: 'blur' }],
  contacts: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  contactNumber: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    {
      pattern: /^((0\d{2,3}-?\d{7,8})|(1[3465789]\d{9}))$/,
      message: '请输入正确的联系电话',
      trigger: ['change', 'blur']
    }
  ],
  receivingCapability: [{ required: true, message: '请输入收货能力', trigger: 'blur' }],
  erpWarehouseCodes: [{ required: true, message: '请选择ERP仓库', trigger: 'blur' }],
  stockType: [{ required: true, message: '请选择库存类型' }]
})
const btnOps = computed(() => [
  {
    label: '保存',
    onClick: submitForm,
    permission: `${String(route.name)}:Save`,
    icon: <Icon icon="ep:plus" />,
    loading: drawerLoading.value,
    type: 'primary'
  }
])

const open = async (type, id) => {
  drawerVisible.value = true
  drawerType.value = type
  getERPWarehouse()
  if (type === 'add') {
    drawerTitle.value = '新增'
    isShow.value = false
  } else if (type === 'update') {
    drawerTitle.value = '编辑'
    isShow.value = false
  } else {
    drawerTitle.value = '查看'
    isShow.value = true
  }
  if (id) {
    const data = await WarehouseInfoApi.getWarehouseById({ id })
    if (data) formData.value = data
  }
}
// 获取ERP仓库数据
const erpWarehouseList = ref<any>([])
const getERPWarehouse = async () => {
  const data = await WarehouseInfoApi.getwdtWarehouseList()
  erpWarehouseList.value = data || []
}
// 关闭前的确认
// const oldData = ref()
// const haveChanged = ref(false)
const handleBeforeClose = async (done: () => void) => {
  if (!isShow.value) await message.confirm('当前页面还有未保存的数据，确认关闭吗？')
  done()
}
const reset = () => {
  drawerVisible.value = false
  Object.assign(formData.value, {})
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

const emits = defineEmits(['success'])
// 提交
async function submitForm() {
  await formRef.value?.validate()
  // 校验通过
  try {
    formLoading.value = true
    const params = {
      ...formData.value
    }
    await WarehouseInfoApi.saveOrUpdateWarehouse(params)
    message.success('保存成功')
    drawerVisible.value = false
    emits('success')
  } finally {
    formLoading.value = false
  }
}
defineExpose({ open })
</script>

<style lang="less" scoped>
:deep(.el-drawer__header) {
  margin-bottom: 0px;
}

:deep(.el-drawer__title) {
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 500;
}

:deep(.el-drawer) {
  border-radius: 12px 0px 0px 0px;
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
}

.form {
  background: #fff;
  padding: 20px;
  border-radius: 20px;
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}

.drawerFormItemWidth {
  width: 100%;
}
</style>
