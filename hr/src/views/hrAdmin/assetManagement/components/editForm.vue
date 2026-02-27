<template>
  <el-dialog class="commomDialig" v-model="dialogVisible" :show-close="false" :dialogTitle="dialogTitle"
    destroy-on-close @close="closeDialog" style="padding: 0 20px; width: 500px" align-center>
    <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules">
      <el-row justify="space-between">
        <el-col :span="8">
          <el-form-item label="" prop="images">
            <UploadImg :bussiness-code="UPLOAD_FILE_BISSONESSCODE.FIXED_ASSET" width="178px" height="178px"
              v-model="formData.images" :disabled="discardedType" />
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item label="品名：" prop="name">
            <el-input class="dialogFormItemWidth" v-model="formData.name" placeholder="请输入品名"
              :readonly="discardedType" />
          </el-form-item>
          <el-form-item label="编号：" prop="number">
            <el-input class="dialogFormItemWidth" v-model="formData.number" placeholder="请输入编号"
              :readonly="discardedType" />
          </el-form-item>

          <el-form-item label="区域：" prop="area">
            <el-select class="dialogFormItemWidth" v-model="formData.area" placeholder="请选择区域" clearable
              style="width: 100%" :disabled="discardedType">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_OFFICE_AREA, true)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="人员：" prop="user">
            <el-input class="dialogFormItemWidth" readonly v-model="formData.user" placeholder="请选择">
              <template #append v-if="!discardedType">
                <el-button @click="openChangeUser"> 选择人员 </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="space-around">
        <el-col :span="16">
          <el-form-item label="" prop="status">
            <el-radio-group v-model="formData.status" @change="changeStatus" :disabled="discardedType">
              <el-radio label="使用中">使用中</el-radio>
              <el-radio label="空闲中">空闲中</el-radio>
              <el-radio label="报废">报废</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" v-if="formType !== 'create'" @click="openUsageHistory">人员历史</el-button>
          <!-- <el-button  @click="openChangeUser"> 更换人员</el-button> -->
        </el-col>
      </el-row>
      <el-form-item label="所属部门：" prop="department" style="width: 100%">
        <Menuitem ref="menuitemRef" @change="handleSearch" />
      </el-form-item>
      <el-row>
        <el-col>
          <el-form-item label="所属公司：" prop="company" style="width: 100%">
            <el-select class="dialogFormItemWidth" v-model="formData.company" placeholder="请选择" clearable
              style="width: 100%" :disabled="discardedType">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_DYNAMIC_COMPANY, true)"
                :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select> </el-form-item></el-col>
      </el-row>
      <el-form-item label="设备唯一ID：" prop="uniquelyCoded" style="width: 100%">
        <el-input class="dialogFormItemWidth" v-model="formData.uniquelyCoded" placeholder="如MAC地址，序列号等"
          style="width: 100%" :readonly="discardedType" />
      </el-form-item>
      <el-form-item label="价格：" prop="price" style="width: 100%">
        <el-input class="dialogFormItemWidth" v-model="formData.price" placeholder="请输入价格"
          style="width: 100%; margin-left: 40px" :readonly="discardedType" />
      </el-form-item>
      <el-form-item label="备注说明：" prop="remarks">
        <s-text-area class="dialogFormItemWidth" v-model="formData.remarks" placeholder="请输入备注" style="width: 100%"
          :readonly="discardedType" :autosize="{ minRows: 4, maxRows: 5 }" />
      </el-form-item>
      <el-form-item label="条形码：" prop="notes" v-if="formType !== 'create'">
        <!-- 条形码 -->
        <img :src="formData.barcodeFileUrl" alt="" style="width: 180px" />
        <!-- <el-button @click="savebarCodeAsImage" type="primary" plain>保存本地</el-button> -->
        <printComponent :data="dataObject" />
      </el-form-item>
    </el-form>
    <img v-if="discardedType" src="@/assets/imgs/baofei.png" class="baofei-style" />

    <template #footer v-if="discardedType && formType !== 'create'">
      <div style="padding-bottom: 20px">
        <el-button @click="dialogVisible = false"> 关 闭</el-button>
      </div>
    </template>
    <template #footer v-else>
      <div style="padding-bottom: 20px">
        <el-button @click="dialogVisible = false"> 取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 人员历史 -->
  <UsageHistory ref="UsageHistoryRef" />
  <!-- 更换人员 -->
  <ChangeUser ref="ChangeUserRef" type="assetManage" @success="handleChangeUserSuccess" />
</template>

<script lang="ts" setup>
defineOptions({ name: 'ListForm' })
import STextArea from "@/components/common/input/s-textarea.vue";
import * as Asset from '@/api/hrAdmin/asset'
import UploadImg from '@/components/UploadFile/src/UploadImg.vue'
import { UPLOAD_FILE_BISSONESSCODE } from '@/components/UploadFile/src/useUpload'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { ElMessageBox } from 'element-plus'
import { debounce } from 'lodash-es'
import { nextTick, onMounted, reactive, ref } from 'vue'
import ChangeUser from './changeUser.vue'
import printComponent from './printComponent.vue'
import UsageHistory from './usageHistory.vue'
import Menuitem from './MenuitemNew.vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const discardedType = ref(false)
const dataObject = ref({})
// 表单数据
const formData = ref({
  id: '',
  isAdmin: '',
  barcodeFileUrl: '', //条形码
  barcodeEncode: '',
  name: '', //品名
  number: '', //编号
  status: '使用中', //状态 -"使用中"/"报废"
  images: '', //图片
  area: '', //区域
  company: '', //公司
  department: '', //部门
  firstDepartment: '', //一级部门
  secondDepartment: '', //二级部门
  user: '', //使用人
  userId: '', //使用人Id
  remarks: '', //备注
  uniquelyCoded: '', //唯一设备ID
  price: '' //价格
})
const department = ref('')
// 编号是否重复校验
const checkNumberExist = async (rule, value, callback) => {
  // console.log('id',formData.value.id);
  await Asset.checkAssetCode(formData.value.id, value)
}

const formRules = reactive({
  number: [
    { required: true, message: '请输入编号', trigger: 'blur' },
    { validator: checkNumberExist, trigger: 'blur', message: '编号已存在' }
  ],
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  area: [{ required: true, message: '请选择区域', trigger: 'change' }],
  company: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
  department: [{ required: true, message: '请选择所属部门', trigger: 'change' }]
  // user: [{ required: true, message: '请选择设备使用人', trigger: 'change' }]
})

const formRef = ref() // 表单 Ref
const menuitemRef = ref()
/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    isAdmin: '',
    barcodeFileUrl: '',
    barcodeEncode: '',
    name: '',
    number: '',
    status: '',
    images: '',
    area: '',
    company: '',
    department: '',
    firstDepartment: '',
    secondDepartment: '',
    user: '',
    userId: '',
    remarks: '',
    uniquelyCoded: '',
    price: '' //价格
  }
  formRef.value?.resetFields()
}
/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  // console.log(type, id)
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type

  resetForm()
  formData.value.status = '使用中'
  // 修改编辑时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await Asset.getAssetDetailById(id)
      // 给部门回显值
      if (formData.value.secondDepartment) {
        formData.value.department =
          formData.value.firstDepartment + '/' + formData.value.secondDepartment
      } else {
        formData.value.department = formData.value.firstDepartment
        department.value = formData.value.firstDepartment
      }
      menuitemRef.value.HuiXian(formData.value.department)
      displayedDepartment.value = formData.value.department
      // formData.value.isAdmin = '0'
      // 当状态为报废时，禁用表单
      discardedType.value = formData.value.status == '报废' ? true : false
      // 当图片存在的时候，设置默认图片
      if (!formData.value.images) {
        formData.value.images =
          'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/fixedAssetPic/aca4b270-d3b3-490e-959d-39085f2155ed.png'
      }

      // 传递给打印组件的参数
      dataObject.value = {
        barcodeEncode: formData.value.barcodeEncode,
        barcodeFileUrl: formData.value.barcodeFileUrl,
        number: formData.value.number
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 更换人员 */
const ChangeUserRef = ref()
const openChangeUser = () => {
  if (ChangeUserRef.value) {
    ChangeUserRef.value.open()
  }
}
// 处理更换人员的回调
const handleChangeUserSuccess = (userData) => {
  formData.value.user = userData.name
  formData.value.userId = userData.id
  // console.log('打印表单数据', formData.value)
}

/** 查看人员历史 */
const UsageHistoryRef = ref()
const openUsageHistory = () => {
  if (UsageHistoryRef.value) {
    UsageHistoryRef.value.open(formData.value.name, formData.value.id)
  }
}
/** 设备状态 */
const changeStatus = (status) => {
  console.log(status)
  if (formType.value !== 'create' && status == '报废') {
    ElMessageBox.confirm('请谨慎操作，该操作不可逆', '设备是否确定报废', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        formData.value.status = '报废'
        // 调用接口并处理返回值
        await Asset.updateAsset(formData.value)
        discardedType.value = true
      })
      .catch(() => { })
  } else {
    formData.value.status = status
  }

  console.log(status)
}

/**  下拉-部门树形 */
const displayedDepartment = ref('')

const departmentTreeData = ref<Array<{ id: string; name: string }>>([])
const defaultProps = ref({
  children: 'children',
  label: 'name'
})
const getDepartmentTree = async () => {
  const data = await Asset.getDeptPage()
  departmentTreeData.value = data || []
  handleCategoryData(departmentTreeData.value, 1, '')
}
//处理请求到的分类数据
const handleCategoryData = (list, level, parentName) => {
  if (list) {
    list.forEach((item, index) => {
      if (item.name) {
        item.level = level
        item.index = index + 1
        item.parentName = parentName || ''
        handleCategoryData(item.children, level + 1, item.name)
      }
    })
  }
}

const handleNodeClick = (data) => {
  if (data.name) {
    if (data.level == 1) {
      formData.value.firstDepartment = data.name
      formData.value.secondDepartment = ''
      formData.value.department = formData.value.firstDepartment
    } else {
      formData.value.secondDepartment = data.name
      formData.value.firstDepartment = data.parentName
      formData.value.department =
        formData.value.firstDepartment + '/' + formData.value.secondDepartment
    }

    displayedDepartment.value = formData.value.department
  }
}

// 下拉框出现或隐藏
const handleVisibleChangeEvent = () => {
  nextTick(() => {
    displayedDepartment.value = formData.value.department
    // console.log(displayedDepartment.value)
  })
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = debounce(async () => {
  console.log('提交：', formData.value)
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as any
    if (formType.value === 'create') {
      data.id = undefined
      await Asset.addAsset(data)
      message.success(t('common.createSuccess'))
    } else {
      await Asset.updateAsset(data)
      if (!discardedType.value) {
        message.success(t('common.updateSuccess'))
      }
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } catch (error) {
    console.log(error)
  } finally {
    formLoading.value = false
  }
}, 200)

// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false
  discardedType.value = false
  displayedDepartment.value = ''
  resetForm()
  menuitemRef.value?.reset()
  // 关闭对话框，列表重新加载
  // emit('success')
  // console.log('关闭对话框', formData.value)
}

//  部门
const handleSearch = (value) => {
  if (value.includes(' / ') && value) {
    formData.value.department = value
    const arr = value.split(' / ')
    formData.value.secondDepartment = arr[arr.length - 1]
    formData.value.firstDepartment = arr[arr.length - 2]
  } else {
    formData.value.department = ''
    formData.value.secondDepartment = ''
    formData.value.firstDepartment = ''
  }
  console.log(formData.value, 'formData.value')
}

onMounted(() => {
  getDepartmentTree()
})
</script>

<style lang="scss" scoped>
:deep(.el-dialog__header) {
  padding: 0;
}

// 修改备注的文本框背景
:deep(.el-textarea__inner) {
  background-color: #f1f1f1 !important;
}
</style>
<style>
.el-input-group__append {
  background-color: #ecf5ff;
  color: #409eff;
}

/* 报废图片的样式 */
.baofei-style {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style></style>
