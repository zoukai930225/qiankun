<template>
  <div class="asset-edit-drawer">
    <div class="section-header">
      <template v-if="step === 'first'">
        <div class="title">基本信息</div>
        <el-link v-if="props.mode === 'update'" type="primary" @click="switchStepToSecond">历史记录</el-link>
      </template>
      <template v-else>
        <div class="back flex items-center gap-6px cursor-pointer hover:text-#0064ff" @click="switchStepToFirst">
          <el-icon :size="12">
            <ArrowLeft />
          </el-icon>
          <span class="text-14px font-500">返回</span>
        </div>
      </template>
    </div>

    <advance ref="advanceRef">
      <template #first>
        <div ref="firstSlotRef">
          <div class="section-content">
            <el-form ref="formRef" :model="formData" :rules="formRules" label-width="96px"
              :validate-on-rule-change="false">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="品名：" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入" :disabled="discardedType" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="资产类型：" prop="zclx">
                    <el-select v-model="formData.zclx" placeholder="请选择" clearable
                      :disabled="props.mode === 'update' || discardedType" style="width: 100%">
                      <el-option v-for="dict in getIntDictOptions(DICT_TYPE.FIXED_ASSET_TYPE, true)" :key="dict.value"
                        :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="编号：" prop="number">
                    <el-input v-model="formData.number" placeholder="请输入" :disabled="discardedType" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="库存：" prop="kcsl">
                    <div class="inventory-field">
                      <el-input-number v-model="formData.kcsl" :min="INVENTORY_MIN"
                        :max="isFixedAsset ? INVENTORY_MIN : INVENTORY_MAX" :precision="0" :step="1"
                        :step-strictly="true" :disabled="isFixedAsset || formData.unlimitedInventory || discardedType"
                        placeholder="请输入" />
                      <el-checkbox v-model="formData.unlimitedInventory"
                        :disabled="isFixedAsset || discardedType">无限库存</el-checkbox>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="区域：" prop="area">
                    <el-select v-model="formData.area" placeholder="请选择" clearable :disabled="discardedType"
                      style="width: 100%" filterable>
                      <el-option v-for="opt in areaOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="isFixedAsset">
                  <el-form-item label="使用人：" prop="user" class="user-form-item">
                    <el-input v-model="formData.user" readonly placeholder="请选择" :disabled="discardedType">
                      <template #append v-if="!discardedType">
                        <el-button @click="openChangeUser">选择人员</el-button>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="isFixedAsset">
                  <el-form-item label="状态：" prop="status">
                    <el-select v-model="formData.status" placeholder="请选择" @change="changeStatus"
                      :disabled="discardedType" style="width: 100%">
                      <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                  <el-form-item label="所属公司：" prop="company">
                    <el-select
                      v-model="formData.company"
                      placeholder="请选择"
                      clearable
                      style="width: 100%"
                      :disabled="discardedType"
                    >
                      <el-option
                        v-for="dict in getIntDictOptions(
                          DICT_TYPE.SYSTEM_PARAM_DYNAMIC_COMPANY,
                          true
                        )"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="所属部门：" prop="department" style="width: 100%">
                    <el-cascader
                      v-model="deptCascaderValue"
                      :options="deptMenuList"
                      :props="deptCustomProps"
                      @change="onDeptCascaderChange"
                      placeholder="请选择"
                      clearable
                      filterable
                      style="width: 100%"
                      ref="deptCascaderRef"
                      :disabled="discardedType"
                    />
                  </el-form-item>
                </el-col> -->
                <el-col :span="12">
                  <el-form-item label="设备唯一ID：" prop="uniquelyCoded">
                    <template #label>
                      <span class="lh-16px text-right">设备唯一<br />ID：</span>
                    </template>
                    <el-input v-model="formData.uniquelyCoded" placeholder="请输入" :disabled="discardedType" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="价格：" prop="price">
                    <el-input v-model="formData.price" placeholder="请输入" :disabled="discardedType" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备类型：" prop="sblx">
                    <!-- <el-input
                      v-model="formData.deviceType"
                      placeholder="请选择"
                      :disabled="discardedType"
                    /> -->
                    <el-select v-model="formData.sblx" placeholder="请选择" :disabled="discardedType">
                      <el-option label="自购" value="自购"></el-option>
                      <el-option label="租赁" value="租赁"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="formData.sblx === '租赁'">
                  <el-form-item label="租赁公司：" prop="zlgs">
                    <el-input v-model="formData.zlgs" placeholder="请输入" :disabled="discardedType" :maxlength="100" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="图片：" prop="images">
                    <UploadImg :bussiness-code="UPLOAD_FILE_BISSONESSCODE.FIXED_ASSET" width="178px" height="178px"
                      v-model="formData.images" :disabled="discardedType" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="备注说明：" prop="remarks" style="width: 100%">
                <s-text-area v-model="formData.remarks" placeholder="请输入" :autosize="{ minRows: 4, maxRows: 5 }"
                  :readonly="discardedType" />
              </el-form-item>

              <el-form-item label="条形码：" prop="notes" v-if="mode === 'update' && !!formData.number">
                <img :src="formData.barcodeFileUrl" alt="" style="width: 180px" />
                <printComponent :data="dataObject" />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </template>
      <template v-if="props.mode === 'update'" #second>
        <div ref="secondSlotRef">
          <History ref="HistoryRef" :asset-id="formData.id" />
        </div>
      </template>
    </advance>

    <img v-if="discardedType" src="@/assets/imgs/baofei.png" class="baofei-style" />

    <ChangeUser ref="ChangeUserRef" type="assetManage" @success="handleChangeUserSuccess" />
  </div>
</template>

<script lang="ts" setup>
// 历史记录效果 参考 http://localhost/admin/SC/admin/supplier/index 的已通过状态 的 点击数字 验厂记录
import * as Asset from '@/api/hrAdmin/asset'
import UploadImg from '@/components/UploadFile/src/UploadImg.vue'
import { UPLOAD_FILE_BISSONESSCODE } from '@/components/UploadFile/src/useUpload'
import STextArea from "@/components/common/input/s-textarea.vue";
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { nextTick, onMounted, onUnmounted, ref, watch, computed } from 'vue'
import { useMessage } from '@/hooks/web/useMessage'
import ChangeUser from '@/views/hrAdmin/assetManagement/components/changeUser.vue'
import History from './history.vue'
// import Menuitem from './MenuitemNew.vue'
import { ElMessageBox } from 'element-plus'
import { getAllDeptTree } from '@/api/system/dept'
import Advance from './advance.vue'
import PrintComponent from '@/views/hrAdmin/assetManagement/components/printComponent.vue'

const areaOptions = ref<{ label: string; value: string | number }[]>([])

const loadAreaOptions = async () => {
  try {
    const list = await Asset.getAssetAreaAll()
    areaOptions.value = Array.isArray(list)
      ? list.map((it: any) => ({ label: it?.qymc, value: it?.id }))
      : []
  } catch (error) { }
}

const STATUS_IN_USE = '使用中'
const STATUS_IDLE = '空闲中'
const STATUS_SCRAPPED = '报废'

const message = useMessage()
const step = ref<'first' | 'second'>('first')
const contentHeight = ref('800px')
const firstSlotRef = ref<HTMLElement | null>(null)
const secondSlotRef = ref<HTMLElement | null>(null)

const statusOptions = [
  { label: STATUS_IN_USE, value: STATUS_IN_USE },
  { label: STATUS_IDLE, value: STATUS_IDLE },
  { label: STATUS_SCRAPPED, value: STATUS_SCRAPPED }
]

const props = defineProps<{ mode: 'create' | 'update'; id?: string; onRefresh?: () => void }>()

const formRef = ref()
const discardedType = ref(false)
const dataObject = ref({})
const lastStatus = ref<string>('')

// 部门级联数据
const deptMenuList = ref<any[]>([])
const deptCustomProps = {
  label: 'name',
  value: 'id',
  children: 'children',
  checkStrictly: true
}
const deptCascaderValue = ref<any[]>([])
const deptCascaderRef = ref<any>(null)

const deptTreeLoaded = ref(false)
const detailLoaded = ref(false)

const findPathByNames = (nodes: any[], names: string[]): string[] | null => {
  const dfs = (list: any[], idx: number, path: string[]): string[] | null => {
    if (idx >= names.length) return path
    for (const item of list || []) {
      if (item?.name === names[idx]) {
        const nextPath = [...path, item.id]
        if (idx === names.length - 1) return nextPath
        const found = dfs(item.children || [], idx + 1, nextPath)
        if (found) return found
      }
    }
    return null
  }
  return dfs(nodes || [], 0, [])
}

// 叶子名单步匹配（参考 MenuitemNew.vue 的回显策略）：按最后一级名称在任意深度查找路径
const findPathByLeafName = (nodes: any[], targetName: string): string[] | null => {
  const dfs = (list: any[], path: string[]): string[] | null => {
    for (const item of list || []) {
      const nextPath = [...path, item.id]
      if (item?.name === targetName) {
        return nextPath
      }
      const found = dfs(item.children || [], nextPath)
      if (found) return found
    }
    return null
  }
  return dfs(nodes || [], [])
}

// 统一切分部门名，兼容 ' / ' 与 '/'
const splitDepartmentNames = (text: string): string[] => {
  if (!text) return []
  return text
    .split('/')
    .map((s) => String(s).trim())
    .filter((s) => !!s)
}

const tryEchoDepartmentToCascader = () => {
  if (!deptTreeLoaded.value || !detailLoaded.value) return
  const depStr = formData.value.department
  let names: string[] = []
  if (depStr) {
    names = splitDepartmentNames(depStr)
  } else {
    if (formData.value.firstDepartment) names.push(String(formData.value.firstDepartment).trim())
    if (formData.value.secondDepartment) names.push(String(formData.value.secondDepartment).trim())
  }
  if (names.length === 0) {
    deptCascaderValue.value = []
    return
  }
  // 1) 优先按完整路径匹配
  let path = findPathByNames(deptMenuList.value, names)
  // 2) 兼容去掉首段（如公司前缀）的匹配
  if (!path && names.length > 1) {
    path = findPathByNames(deptMenuList.value, names.slice(1))
  }
  // 3) 兜底仅按叶子名称匹配（与 MenuitemNew.vue 行为一致）
  if (!path) {
    path = findPathByLeafName(deptMenuList.value, names[names.length - 1])
  }
  deptCascaderValue.value = path || []
}
const onDeptCascaderChange = () => {
  const presentText = (deptCascaderRef.value as any)?.presentText as string | undefined
  const normalized = presentText ? splitDepartmentNames(presentText).join(DEPT_SEPARATOR) : ''
  handleSearch(normalized)
  console.log('presentText', presentText)
}
const initDeptMenu = async () => {
  try {
    const data = await getAllDeptTree()
    deptMenuList.value = data
    deptTreeLoaded.value = true
    tryEchoDepartmentToCascader()
  } catch (error) { }
}

const formData = ref<any>({
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
  price: '',
  zclx: '',
  kcsl: 0,
  yykcs: 0,
  unlimitedInventory: false,
  sblx: '',
  zlgs: ''
})

const FIXED_ASSET_VALUE = '1'
const isFixedAsset = computed(() => String(formData.value.zclx) === FIXED_ASSET_VALUE)

const DEFAULT_ASSET_IMAGE_URL =
  'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/fixedAssetPic/aca4b270-d3b3-490e-959d-39085f2155ed.png'
const INVENTORY_MIN = 1
const INVENTORY_MAX = 9999
const DEPT_SEPARATOR = ' / '

const formRules = computed(() => ({
  number: [
    { required: isFixedAsset.value, message: '请输入编号', trigger: 'blur' },
    {
      validator: (_r: any, v: string, callback: any) => {
        if (!v) {
          // 非固定资产时，编号可为空；固定资产时，必填由上条规则处理
          callback()
          return
        }
        Asset.checkAssetCode(formData.value.id, v)
          .then((isOk: any) => {
            if (isOk === false) {
              callback(new Error('编号已存在'))
            } else {
              callback()
            }
          })
          .catch(() => callback(new Error('编号已存在')))
      },
      trigger: 'blur'
    }
  ],
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  area: [{ required: true, message: '请选择区域', trigger: 'change' }],
  // company: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
  // department: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
  zclx: [{ required: true, message: '请选择资产类型', trigger: 'change' }],
  kcsl: [
    {
      validator: (_r: any, v: number, callback: any) => {
        if (isFixedAsset.value) {
          if (v !== 1) {
            callback(new Error('固定资产库存固定为1'))
          } else {
            callback()
          }
          return
        }
        if (formData.value.unlimitedInventory) {
          callback()
          return
        }
        if (v === null || v === undefined || v < INVENTORY_MIN || v > INVENTORY_MAX) {
          callback(new Error(`库存需为${INVENTORY_MIN}-${INVENTORY_MAX}的正整数`))
        } else {
          const used = Number(formData.value.yykcs || 0)
          if (v < used) {
            callback(new Error(`库存数不得低于已用库存（${used}）`))
          } else {
            callback()
          }
        }
      },
      trigger: 'change',
      required: true
    }
  ],
  status: [
    {
      validator: (_r: any, v: string, callback: any) => {
        if (!isFixedAsset.value) {
          callback()
          return
        }
        if (!v) {
          callback(new Error('请选择状态'))
        } else {
          callback()
        }
      },
      trigger: 'change',
      required: true
    }
  ],
  user: [
    {
      required: isFixedAsset.value && formData.value.status === STATUS_IN_USE,
      message: '请选择使用人',
      trigger: 'change'
    }
  ],
  // images: [{ required: true, message: '请上传图片', trigger: 'change' }]
  sblx: [{
    required: true,
    message: '请选择设备类型',
    trigger: ['blur', 'change']
  }],
  zlgs: [{
    required: formData.value.sblx === '租赁',
    message: '请输入租赁公司',
    trigger: 'blur'
  }]
}))

watch(
  () => formData.value.zclx,
  () => {
    if (isFixedAsset.value) {
      formData.value.kcsl = 1
      formData.value.unlimitedInventory = false
      if (props.mode === 'create') {
        formData.value.user = ''
        formData.value.userId = ''
        formData.value.status = ''
      }
    }
    nextTick(() => {
      formRef.value?.clearValidate?.(['number', 'kcsl'])
    })
  }
)

watch(
  () => formData.value.unlimitedInventory,
  (newVal: boolean) => {
    if (isFixedAsset.value) {
      formData.value.unlimitedInventory = false
      return
    }
    if (!newVal && (!formData.value.kcsl || formData.value.kcsl < 1)) {
      formData.value.kcsl = 1
    }
  }
)

watch(
  () => formData.value.images,
  (newVal: any) => {
    const hasImage = Array.isArray(newVal)
      ? newVal.length > 0
      : newVal != null && String(newVal).trim() !== ''
    if (hasImage) {
      formRef.value?.clearValidate?.(['images'])
    }
  }
)

const loadDetail = async () => {
  if (props.mode !== 'update' || !props.id) return
  const data = await Asset.getAssetDetailById(props.id)
  formData.value = { ...formData.value, ...data }
  // 无限库存回显（后端 -1 表示无限）
  if (Number(formData.value.kcsl) === -1) {
    formData.value.unlimitedInventory = true
    formData.value.kcsl = 1
  } else {
    formData.value.unlimitedInventory = false
  }
  // 部门回显
  if (formData.value.secondDepartment) {
    formData.value.department =
      formData.value.firstDepartment + DEPT_SEPARATOR + formData.value.secondDepartment
  } else {
    formData.value.department = formData.value.firstDepartment
  }

  dataObject.value = {
    barcodeEncode: formData.value.barcodeEncode,
    barcodeFileUrl: formData.value.barcodeFileUrl,
    number: formData.value.number
  }

  discardedType.value = formData.value.status === STATUS_SCRAPPED
  lastStatus.value = formData.value.status || ''
  detailLoaded.value = true
  tryEchoDepartmentToCascader()
}

const submit = async () => {
  if (!formRef.value) return
  await formRef.value.validate()
  const data = { ...formData.value } as any
  // 提交时将无限库存映射为 -1
  if (data.unlimitedInventory) {
    data.kcsl = -1
  }
  // 租赁公司是自购时清空
  data.zlgs = data.sblx === '自购' ? '' : data.zlgs
  if (props.mode === 'create') {
    data.id = undefined
    await Asset.addAsset(data)
    message.success('创建成功')
  } else {
    await Asset.updateAsset(data)
    if (!discardedType.value) message.success('更新成功')
  }
}

defineExpose({ submit })

const ChangeUserRef = ref()
const openChangeUser = () => ChangeUserRef.value?.open?.()
const handleChangeUserSuccess = (userData: any) => {
  formData.value.user = userData.name
  formData.value.userId = userData.id
  // 选择使用人后，状态置为使用中
  formData.value.status = STATUS_IN_USE
  lastStatus.value = STATUS_IN_USE
  formRef.value?.clearValidate?.(['user'])
}

const advanceRef = ref()
const HistoryRef = ref()

// 动态计算高度
const getActiveSlotEl = () => (step.value === 'first' ? firstSlotRef.value : secondSlotRef.value)
const measureContentHeight = () => {
  const el = getActiveSlotEl()
  if (!el) return
  const h = el.scrollHeight
  contentHeight.value = `${Math.max(h, 1)}px`
}
let firstRO: ResizeObserver | null = null
let secondRO: ResizeObserver | null = null
const observeSlot = () => {
  if (typeof window === 'undefined' || !('ResizeObserver' in window)) return
  if (!firstRO)
    firstRO = new ResizeObserver(() => {
      if (step.value === 'first') measureContentHeight()
    })
  if (!secondRO)
    secondRO = new ResizeObserver(() => {
      if (step.value === 'second') measureContentHeight()
    })
  if (firstSlotRef.value) firstRO.observe(firstSlotRef.value)
  if (secondSlotRef.value) secondRO.observe(secondSlotRef.value)
}
const onWindowResize = () => measureContentHeight()

const switchStepToSecond = () => {
  advanceRef.value?.next()
  step.value = 'second'
  nextTick(() => measureContentHeight())
}

const switchStepToFirst = () => {
  advanceRef.value?.prev()
  step.value = 'first'
  nextTick(() => measureContentHeight())
}

const changeStatus = (status: string) => {
  if (props.mode !== 'create' && status === STATUS_SCRAPPED) {
    // 先回退到上一次的状态，等待二次确认
    const prev = lastStatus.value
    formData.value.status = prev
    ElMessageBox.confirm('请谨慎操作，该操作不可逆', '设备是否确定报废', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        formData.value.status = STATUS_SCRAPPED
        lastStatus.value = STATUS_SCRAPPED
        await Asset.updateAsset(formData.value as any)
        discardedType.value = true
        // 报废后刷新外部列表
        props.onRefresh?.()
      })
      .catch(() => {
        // 取消时保持原状态
        formData.value.status = prev
      })
  } else {
    formData.value.status = status
    lastStatus.value = status
    // 状态切为空闲时，清空使用人
    if (status === STATUS_IDLE) {
      formData.value.user = ''
      formData.value.userId = ''
      formRef.value?.clearValidate?.(['user'])
    } else if (status === STATUS_IN_USE) {
      // 使用中时校验使用人必填
      formRef.value?.validateField?.(['user'])
    } else {
      formRef.value?.clearValidate?.(['user'])
    }
  }
}

const handleSearch = (value: string) => {
  const names = splitDepartmentNames(value)
  if (names.length >= 2) {
    formData.value.department = names.join(DEPT_SEPARATOR)
    formData.value.secondDepartment = names[names.length - 1]
    formData.value.firstDepartment = names[names.length - 2]
  } else if (names.length === 1) {
    formData.value.department = names[0]
    formData.value.firstDepartment = names[0]
    formData.value.secondDepartment = ''
  } else {
    formData.value.department = ''
    formData.value.secondDepartment = ''
    formData.value.firstDepartment = ''
  }
}

onMounted(async () => {
  await initDeptMenu()
  await loadAreaOptions()
  await loadDetail()
  window.addEventListener('resize', onWindowResize)
  await nextTick()
  // observeSlot()
  measureContentHeight()
})

onUnmounted(() => {
  firstRO?.disconnect()
  firstRO = null
  secondRO?.disconnect()
  secondRO = null
  window.removeEventListener('resize', onWindowResize)
})
</script>

<style scoped lang="scss">
.asset-edit-drawer {
  position: relative;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  position: relative;

  &:after {
    content: '';
    width: calc(100% + 40px);
    height: 1px;
    background-color: #f0f0f0;
    position: absolute;
    left: -20px;
    bottom: 0;
  }
}

.section-header .title {
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;

  &:before {
    content: '';
    width: 3px;
    height: 10px;
    background-color: #0064ff;
  }
}

.section-content {
  padding: 20px 1px 20px 0;
}

.inventory-field {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;

  .el-input-number {
    flex: 1 0 auto;
  }
}

.baofei-style {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

:deep(.el-form) {
  .user-form-item {
    .el-input__wrapper {
      box-shadow: 0 0 0 1px #e5e5e5 inset;
    }
  }
}
</style>
