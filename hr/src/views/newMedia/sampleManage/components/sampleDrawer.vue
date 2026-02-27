<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle">
    <div class="drawerContent">
      <el-form class="dialogForm" :class="{ editForm: isEdit }" ref="formRef" v-loading="formLoading" :model="formData"
        :rules="formRules" label-width="100px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="productCategory" label="产品类目">
              <el-input style="width: 300px" placeholder="请输入产品类目" v-model="formData.productCategory" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="SKU编码" prop="skuCode">
              <el-input style="width: 300px" placeholder="请输入SKU编码" v-model="formData.skuCode" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="productModelNumber" label="产品款号">
              <el-input style="width: 300px" placeholder="请输入产品款号" v-model="formData.productModelNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌" prop="brand">
              <el-input style="width: 300px" placeholder="请输入品牌" v-model="formData.brand" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="sampleCategory" label="样品类别">
              <el-input style="width: 300px" placeholder="请输入样品类别" v-model="formData.sampleCategory" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="尺码" prop="size">
              <el-select class="!w-300px" v-model="formData.size" placeholder="请选择尺码" clearable filterable>
                <el-option v-for="dict in sampleSizeList" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="colour" label="颜色">
              <el-input style="width: 300px" placeholder="请输入颜色" v-model="formData.colour" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="registrant" label="登记人">
              <SWSelectPeople style="width: 300px" :isEdit="true" v-model:modelValue="operatorList"
                :getSearchList="remoteMethod" @select-people-change="selectPeopleChange('registrant')"
                :multiple="false" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 库位增加 -->
        <el-row v-for="(loc, index) in formData.details" :key="index">
          <el-col :span="12">
            <el-form-item :label="`库位位置${index + 1}`" :prop="`details.${index}.locationId`"
              :rules="[{ required: true, message: '请选择库位位置', trigger: 'blur' }]">
              <el-select class="!w-300px" v-model="loc.locationId" placeholder="请选择库位位置" clearable>
                <el-option v-for="dict in locationList" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`库存数${index + 1}`" :rules="[{ required: true, message: '请输入库存数', trigger: 'blur' }]">
              <el-input-number style="width: 300px" placeholder="请输入库存数" v-model="loc.number" :min="0" />
              <img :src="plusSvg" class="iconButton" v-if="index === 0" @click.stop="addLocation" />
              <img :src="delSvg" class="iconButton" v-else @click.stop="delLocation(index)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="图片" prop="imageList">
              <UploadImg v-model:modelValue="imageList" :limit="1" @validate="emitValidate" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注信息" prop="remark">
              <s-text-area v-model="formData.remark" :autosize="{ minRows: 3, maxRows: 4 }" maxlength="100"
                show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="drawerVisible = false">关 闭</el-button>
      <el-button :disabled="formLoading" class="mr20px" type="primary" @click="submitForm">{{
        formType === 'create' ? '保 存' : '提 交'
      }}</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import UploadImg from '../../components/uploadImg.vue'
import { sampleSizeList } from '@/views/newMedia/hooks/useSample'
import plusSvg from '@/assets/imgs/newMedia/plus.svg'
import delSvg from '@/assets/imgs/newMedia/del.svg'
import * as sampleManageApi from '@/api//sample/sampleManage'
// 选择人员
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import * as PersonRosterApi from '@/api/hrAdmin/personRoster'

const props = defineProps({
  locationList: {
    type: Array as any,
    default: () => []
  }
})

const message = useMessage() // 消息弹窗

const scrollRef = ref()
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  productCategory: '', //产品类目
  skuCode: '', // SKU编码
  productModelNumber: '',
  brand: '',
  sampleCategory: '',
  size: '',
  colour: '',
  registrant: '',
  registrantId: '',
  image: '',
  details: [] as any,
  remark: ''
})
const imageList = ref<any>([])

const formRef = ref()
const isEdit = ref(false) // 是否编辑

// 人员选择
const personList = ref([])
const personalRequest = ref(false)
const remoteMethod = async (value) => {
  if (personalRequest.value) {
    return []
  }
  if (personList.value && personList.value.length > 0) {
    return personList.value
  }
  personalRequest.value = true
  const data = await PersonRosterApi.getPersonRosterAvatarOriginList({
    status: '2'
  }).catch(() => {
    personalRequest.value = false
  })
  personList.value = data || []
  personalRequest.value = false
  return personList.value
}
// 更新选择的人
const operatorList = ref<any>([])
const selectPeopleChange = (field: string) => {
  const codeList = operatorList.value
  if (codeList && codeList.length > 0) {
    console.log(codeList)
    const names = codeList.map((item: any) => item.name) || []
    const ids = codeList.map((item: any) => item.userId) || []
    formData.value[`${field}`] = names.join(',')
    formData.value[`${field}Id`] = ids.join(',')
  }
}

// 库位相关操作

// 增加
const addLocation = () => {
  formData.value.details.push({
    locationId: '',
    number: 0
  })
}
// 删除
const delLocation = (index) => {
  formData.value.details.splice(index, 1)
}

/** 打开drawer */
const open = async (type: string, id?: string) => {
  resetForm()
  drawerVisible.value = true
  drawerTitle.value = type === 'add' ? '新增' : '编辑'
  formType.value = type
  isEdit.value = type === 'edit'
  if (id) {
    // 查详情
    console.log(id)
    const data = await sampleManageApi.queryByBarcode({ barcode: id })
    if (data) {
      formData.value = data
      if (data.image) imageList.value.push({ fileUrl: data.image })
      if (data.registrant) {
        operatorList.value.push({
          name: data.registrant,
          userId: data.registrantId,
          avatarOrigin: data.avatarOrigin
        })
      }
    }
  } else {
    formData.value.details = [
      {
        locationId: '',
        number: 0
      }
    ]
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 表单校验规则

// 校验图片上传
const validateImg = (rule: any, value: any, callback: any) => {
  if (imageList.value.length === 0) {
    callback(new Error('请上传图片'))
  } else {
    callback()
  }
}

const emitValidate = () => {
  formRef.value && formRef.value.validateField('imageList')
}
const formRules = reactive({
  productCategory: [{ required: true, message: '请输入产品类目', trigger: 'blur' }],
  skuCode: [{ required: false, message: '请输入skuCode', trigger: 'blur' }],
  productModelNumber: [{ required: false, message: '请输入产品款号', trigger: 'blur' }],
  brand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
  sampleCategory: [{ required: true, message: '请输入样品类别', trigger: 'blur' }],
  size: [{ required: true, message: '请选择尺码', trigger: 'change' }],
  colour: [{ required: true, message: '请输入颜色', trigger: 'blur' }],
  imageList: [{ required: true, validator: validateImg, trigger: 'blur' }]
})

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 校验通过 提交
  formLoading.value = true
  try {
    const params = { ...formData.value }
    params.image = imageList.value[0].fileUrl
    if (formType.value === 'add') {
      // 新增
      console.log(params)
      await sampleManageApi.addInventory(params)
    } else {
      // 编辑
      console.log(params)
      await sampleManageApi.updateInventory(params)
    }
    message.success('保存成功')
    formLoading.value = false
    drawerVisible.value = false
    emit('success')
  } catch {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  imageList.value = []
  operatorList.value = []
}

const reset = () => {
  resetForm()
  drawerVisible.value = false
  emit('success')
}
</script>

<style lang="less" scoped>
@import '@/views/newMedia/style/drawer.scss';

:deep(.el-select__wrapper) {
  background: #ffffff !important;
}
</style>
