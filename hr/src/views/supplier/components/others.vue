<template>
  <div>
    <el-card shadow="never">
      <div style="display: flex; justify-content: space-between">
        <Tips>生产相关设备及生产能力</Tips>
        <el-button text @click="addhandle" v-if="!disabled"><img :src="plus"
            style="width: 14px; height: 14px; margin-right: 8px" />添加</el-button>
      </div>
      <el-table class="SWCommonTable" v-horizontal-scroll="'always'" :stripe="true" :data="equipmentList"
        :show-overflow-tooltip="true" row-class-name="commonTableRow">
        <el-table-column prop="equipmentName" :show-overflow-tooltip="false" label="设备名称" />
        <el-table-column prop="brand" :show-overflow-tooltip="false" label="品牌" />
        <el-table-column prop="applicationDepartment" :show-overflow-tooltip="false" label="应用部门" />
        <el-table-column prop="count" :show-overflow-tooltip="false" label="数量" />
        <el-table-column label="操作" align="center" fixed="right" v-if="!disabled">
          <template #default="scope">
            <el-button text type="danger" :icon="Delete" @click="delRow(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card shadow="never">
      <div class="check-box">
        <Tips class="m-bot">认证质量体系</Tips>
        <el-checkbox-group v-model="otherInfo.supplierCertifiedQuality" :disabled="disabled"
          @change="(e: any) => changeHandle(e, 'supplierCertifiedQuality')">
          <el-checkbox v-for="dict in getIntDictOptions(DICT_TYPE.SUPPLIER_CERTIFIED_QUALITY, true)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-checkbox-group>
      </div>
      <div class="check-box">
        <Tips class="m-bot">生产内部管控</Tips>
        <el-checkbox-group v-model="otherInfo.supplierInternalControlProduction" :disabled="disabled"
          @change="(e: any) => changeHandle(e, 'supplierInternalControlProduction')">
          <el-checkbox v-for="dict in getIntDictOptions(DICT_TYPE.SUPPLIER_INTERNAL_CONTROL_PRODUCTION, true)"
            :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-checkbox-group>
      </div>
      <div>
        <Tips class="m-bot">其他</Tips>
        <s-text-area v-model.trim="otherInfo.otherRemarks" class="dialogFormItemWidth" :rows="5" style="width: 100%"
          :disabled="disabled" />
      </div>
    </el-card>
    <el-card shadow="never">
      <div>
        <el-checkbox v-model="aloneChecked" :disabled="disabled">我承诺</el-checkbox>
        <s-text-area class="dialogFormItemWidth" :rows="5" style="width: 100%" :disabled="true" value="1.所提供的基本信息和相关附件(包括但不限于营业执照、税务登记证、组织机构代码证、生成许可证、产品合格证明、财务报表等）均为真实、合法、有效，且无任何虚假记载、误导性陈诉或重大遗漏。
2.在与贵公司的经营活动中，将严格遵守中华人民共和国的法律法规，以及双方签订的合同或协议中的所有条款和条件。" />
      </div>
    </el-card>
    <div class="drawerFooter" v-if="!disabled">
      <el-button type="primary" @click="submitHandle">提交</el-button>
    </div>
    <AddDevice ref="addDeviceRef" :id="props.id" @on-close="getDeviceData()" />
  </div>
</template>
<script setup lang="tsx" scoped>
import STextArea from "@/components/common/input/s-textarea.vue";
import { Delete } from '@element-plus/icons-vue'
const message = useMessage() // 消息弹窗
import Tips from './tips.vue'
import plus from '@/assets/imgs/supplier/plus.png'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import {
  getProductDeviceById,
  getSupplierById,
  delProductDevice,
  updateOther,
  updateSupplierOther,
  addOther
} from '@/api/supplier'
import AddDevice from './addDevice.vue'
defineOptions({ name: 'Others' })

const props = defineProps<{
  id: String
  type?: 'add' | 'edit' | 'view'
}>()

const disabled = computed(() => props?.type === 'view');
// 获取数据
const equipmentList = ref([])
const getDeviceData = async () => {
  const res = await getProductDeviceById(props.id)
  equipmentList.value = res || []
}
// 字典数据 -- 质量体系
const otherInfo = ref({
  id: '',
  supplierCertifiedQuality: [],
  supplierInternalControlProduction: [],
  otherRemarks: ''
})
const aloneChecked = ref(false)
const getOtherInfo = async () => {
  const res = await getSupplierById(props.id)
  const {
    supplierCertifiedQuality,
    supplierInternalControlProduction,
    otherRemarks,
    id,
    isPromise
  } = res
  otherInfo.value = {
    ...res,
    supplierCertifiedQuality: !supplierCertifiedQuality ? [] : supplierCertifiedQuality.split(','),
    supplierInternalControlProduction: !supplierInternalControlProduction
      ? []
      : supplierInternalControlProduction.split(','),
    otherRemarks,
    id
  }
  aloneChecked.value = isPromise === 1
}
const changeHandle = async (val: any, key: string) => {
  const { supplierCertifiedQuality, supplierInternalControlProduction } = otherInfo.value
  const obj = Object.assign(
    {},
    {
      ...otherInfo.value,
      supplierCertifiedQuality: !supplierCertifiedQuality.length
        ? ''
        : supplierCertifiedQuality.join(','),
      supplierInternalControlProduction: !supplierInternalControlProduction.length
        ? ''
        : supplierInternalControlProduction.join(','),
      [key]: val.length ? val.join(',') : '',
      isPromise: aloneChecked.value ? 1 : 0
    }
  )

  await updateSupplierOther(obj)
}
const addDeviceRef = ref()
const addhandle = () => {
  addDeviceRef.value.open()
}
// 删除
const delRow = async (item: any) => {
  try {
    await message.delConfirm()
    await delProductDevice(item.id)
    message.success('删除成功')
    getDeviceData()
  } catch (error) {
    console.log(error)
  }
}
const emit = defineEmits(['next', 'refresh'])
const submitHandle = async () => {
  if (!aloneChecked.value) {
    message.success('请先阅读承诺书并同意')
    return
  }
  const { supplierCertifiedQuality, supplierInternalControlProduction } = otherInfo.value
  const obj = Object.assign(
    {},
    {
      ...otherInfo.value,
      supplierCertifiedQuality: !supplierCertifiedQuality ? '' : supplierCertifiedQuality.join(','),
      supplierInternalControlProduction: !supplierInternalControlProduction
        ? ''
        : supplierInternalControlProduction.join(','),
      isPromise: aloneChecked.value ? 1 : 0
    }
  )

  const api = props.type === 'add' ? addOther : updateOther

  const res = await api(obj)
  if (res.success) {
    message.success('提交成功')
    emit('next')
    emit('refresh')
  }
}
onMounted(() => {
  otherInfo.value.id = props.id
  if (otherInfo.value.id) {
    getDeviceData()
    getOtherInfo()
  }
})
</script>
<style lang="scss" scoped>
.m-bot {
  margin-bottom: 10px;
}

.el-card {
  border-radius: 8px;

  &+.el-card {
    margin-top: 20px;
  }
}

.check-box {
  margin-bottom: 20px;
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
</style>
