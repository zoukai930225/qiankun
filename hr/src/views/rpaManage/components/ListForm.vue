<template>
  <div class="drawer-wrapper">
    <el-drawer v-model="drawerVisible" :with-header="false" :wrapper-closable="true" class="drawer" size="968">
      <div>
        <div class="drawerTitle">
          <div>{{ drawerTitle }}</div>
          <div @click="drawerVisible = false"><el-icon>
              <CloseBold />
            </el-icon></div>
        </div>
      </div>
      <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
        label-width="80px">
        <div class="drawerContent">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="应用名称" prop="name">
                <el-input class="dialogFormItemWidth" v-model="formData.name" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="应用类型" prop="typeId" label-width="110px">
                <el-select class="dialogFormItemWidth" v-model="formData.typeId" placeholder="请选择">
                  <el-option v-for="dict in typeList" :key="dict.id" :label="dict.typeName" :value="dict.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="检测时间" prop="checkTime">
                <el-time-select v-model="formData.checkTime" class="dialogFormItemWidth" start="00:00" step="00:30"
                  end="23:59" placeholder="请选择" @clear="hanleClear('checkTime')" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status" label-width="110px">
                <el-select class="dialogFormItemWidth" v-model="formData.status" placeholder="请选择" clearable
                  @clear="hanleClear('status')">
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_STATUS, true)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="浏览器" prop="browser">
                <el-select class="dialogFormItemWidth" v-model="formData.browser" placeholder="请选择" clearable
                  @clear="hanleClear('browser')">
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.YINGDAO_BROWSER, true)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="运行环境" prop="runEnvironment" label-width="110px">
                <el-select class="dialogFormItemWidth" v-model="formData.runEnvironment" placeholder="请选择" clearable>
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_PROGRAM, true)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <div>
                <el-form-item label="基础入库应用" prop="isBase" label-width="120px">
                  <el-radio-group v-model="formData.isBase">
                    <el-radio value="1">是</el-radio>
                    <el-radio value="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <el-form-item label="执行时间" prop="executionTime" label-width="110px">
                <el-input class="dialogFormItemWidth" v-model="formData.executionTime" placeholder="请输入" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注" prop="remark">
            <Editor height="200px" v-model:modelValue="formData.remark" :key="formData.id" />
          </el-form-item>
        </div>

        <div class="drawerContent">
          <!-- 关联账号信息 -->
          <div style="display: flex; justify-content: space-between; align-items: center">
            <div class="drawerContent-title">
              <div class="drawerContent-title-icon"></div>
              <div>关联账号信息</div>
            </div>
            <div style="color: #0064ff; font-size: 14px; cursor: pointer" @click="linkAccount">
              <img src="@/assets/imgs/rpaManage/relateAccount.png" alt=""
                style="vertical-align: middle; margin-right: 2px" />
              关联账号
            </div>
          </div>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="关联账号" prop="account">
                <div class="drawerContent-disabledInput">{{ formData.account }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="店铺名称" prop="storeName">
                <div class="drawerContent-disabledInput">{{ formData.storeName }}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="关联名称" prop="manageName">
                <div class="drawerContent-disabledInput">{{ formData.manageName }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="店铺编码" prop="storeCode">
                <div class="drawerContent-disabledInput">{{ formData.storeCode }}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 节点信息展示 -->
          <div style="display: flex; justify-content: space-between; align-items: center">
            <div class="drawerContent-title">
              <div class="drawerContent-title-icon"></div>
              <div>节点信息展示</div>
            </div>
            <div style="color: #0064ff; font-size: 14px; cursor: pointer" @click="linkNode">
              <img src="@/assets/imgs/rpaManage/relateNode.png" alt=""
                style="vertical-align: middle; margin-right: 2px" />
              关联节点
            </div>
          </div>
          <el-row :gutter="10">
            <el-col :span="12">
              <div class="longlabel">
                <el-form-item label="影刀登录账户" prop="loginUserName">
                  <div class="drawerContent-disabledInput">{{ formData.loginUserName }}</div>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="longlabel">
                <el-form-item label="统一登录应用UUID" prop="yingyongUuid">
                  <div class="drawerContent-disabledInput">{{ formData.yingyongUuid }}</div>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="节点类型" prop="nodeType">
                <div class="drawerContent-disabledInput">
                  {{ getDictLabel(DICT_TYPE.YINGDAO_NOTE_TYPE, formData.nodeType) }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <div class="longlabel">
                <el-form-item label="todesk账号" prop="todeskUserName">
                  <div class="drawerContent-disabledInput">{{ formData.todeskUserName }}</div>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 类型 -->
        <div class="drawerContent">
          <div class="drawerContent-title">
            <div class="drawerContent-title-icon"></div>
            <div>类型</div>
          </div>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="类型编码" prop="typeCode" label-width="80px">
                <el-input v-model="formData.typeCode" placeholder="" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型名称" prop="typeName" label-width="110px">
                <el-input v-model="formData.typeName" placeholder="" readonly>类型名称</el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="类型类别" prop="typeCategory" label-width="80px">
                <el-input v-model="formData.typeCategory" placeholder="" readonly>类型类别</el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据库表" prop="typeDbName" label-width="110px">
                <el-input v-model="formData.typeDbName" placeholder="" readonly>数据库表</el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- 新增子程序 -->
        <div class="drawerContent" v-for="(item, index) in formData.skTabulates" :key="index">
          <div style="display: flex; justify-content: space-between; align-items: center">
            <div class="drawerContent-title">
              <div class="drawerContent-title-icon"></div>
              <div>子程序</div>
            </div>

            <el-icon class="drawerContent-delete" @click="deleteSubProgram(item)">
              <Delete />
            </el-icon>
            <!-- <img src="@/assets/imgs/programGroup/delete_default.png" alt=""/> -->
          </div>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="应用类型" :prop="`skTabulates[${index}].type`" :rules="[
                { required: true, message: '请选择应用类型', trigger: ['blur', 'change'] }
              ]" label-width="80px">
                <el-select class="dialogFormItemWidth" v-model="item.type" placeholder="请选择" clearable>
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SUBROUTINE_TYPE, true)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="应用名称" :prop="`skTabulates[${index}].skName`"
                :rules="[{ required: true, message: '请输入应用名称', trigger: 'blur' }]" label-width="80px">
                <el-input class="dialogFormItemWidth" v-model="item.skName" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="应用编码" :prop="`skTabulates[${index}].serviceCode`"
                :rules="[{ required: true, message: '请输入应用编码', trigger: 'blur' }]" label-width="110px">
                <el-input class="dialogFormItemWidth" v-model="item.serviceCode" placeholder="请输入" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 点击添加子程序按钮 -->
        <div @click="addSubProgram" class="drawerContent-addSubProgram cursor-pointer">
          <el-icon color="#0064FF" style="vertical-align: middle; color: #0064ff">
            <Plus />
          </el-icon>
          添加子程序
        </div>
      </el-form>
      <div class="drawerFooter" v-if="formType == 'create' || formType == 'update'">
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">
          {{ formType === 'create' ? '保 存' : '提 交' }}</el-button>
      </div>
    </el-drawer>
    <LinkAccountDialog ref="linkAccountRef" @select-link-object="selectLinkAccountObject" />
    <LinkNodeDialog ref="linkNodeRef" @select-link-object="selectLinkNodeObject" />
    <!-- <StoreRange ref="storeRangeRef" @submit="onRangeUseSubmit" /> -->
  </div>
</template>
<script lang="ts" setup>
import LinkAccountDialog from './linkAccountDialog.vue'
import LinkNodeDialog from './linkNodeDialog.vue'
import { isValidCron } from 'cron-validator'
defineOptions({ name: 'ListForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
import * as TagMngApi from '@/api/tagMng'
import * as rpaApi from '@/api/rpaManage'
import * as rpaProgramTypeApi from '@/api/rpaManage/programType'
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'

const activeName = ref('first') // 选项卡的名称

const formData = reactive({
  id: '',

  // 关联账号信息
  platformManageId: '', // 平台管理ID
  account: '', // 关联账号
  storeName: '', // 店铺名称
  storeCode: '', // 店铺编码
  manageName: '', // 关联名称

  // 关联节点信息
  nodeId: '', // 节点ID
  loginUserName: '', // 影刀登录账户
  yingyongUuid: '', // 统一登录应用UUID
  nodeType: '', // 节点类型
  todeskUserName: '', // todesk账号

  // 基础信息
  name: '', // 应用名称
  code: '', // 应用编码
  typeId: '', // 应用类型
  oldTypeId: '', // 原来的类型
  typeCode: '', // 类型编码
  typeName: '', // 类型名称
  typeCategory: '', // 类型类别
  typeDbName: '', // 数据库表
  status: '', // 状态
  checkTime: '', // 检测时间
  browser: '', // 浏览器
  runEnvironment: '', // 运行环境
  remark: '', // 备注
  isBase: 0, // 是否基础入库应用
  executionTime: '', // 执行时间

  // 子程序
  skTabulates: [] // 子程序列表
})
const formRules = reactive({
  name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入应用编码', trigger: 'blur' }],
  typeId: [{ required: true, message: '请选择应用类型', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  runEnvironment: [{ required: true, message: '请选择运行环境', trigger: 'change' }],
  executionTime: [
    {
      validator: (rule, value, callback) => {
        // 检查输入是否为空（空字符串或只包含空格）
        if (!value || value.trim() === '') {
          // 如果输入为空，则不执行Cron校验，直接通过
          callback()
        } else {
          const isOk = isValidCron(value, {
            seconds: true,
            alias: true,
            allowBlankDay: true,
            allowSevenAsSunday: true
          })

          if (!isOk) {
            callback(new Error('请输入可用的Cron表达式'))
          } else {
            callback()
          }
        }
      },
      trigger: 'blur'
    }
  ]
})

const formRef = ref() // 表单 Ref

// 点清空按钮时，将对应字段变成空字符串
const hanleClear = (prop: string) => {
  formData[prop] = ''
}
/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  drawerVisible.value = true
  drawerTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  // 获取应用类型列表
  await getTypeList()
  activeName.value = 'first'
  console.log('打开弹窗', formData)
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const newData = await rpaApi.getApplicationDetail({ id: id })
      Object.assign(formData, newData)
      formData.oldTypeId = formData.typeId // 保存原来的类型
      console.log('修改时的数据：', formData)
      // 回显负责人
      // if (formData.superintendent) {
      //   formData.superintendent = formData.superintendent.split(',')
      // }
      // 回显店铺
      // if (formData.store) {
      //   const ChannelData = await TagMngApi.getQueryChannels().catch(() => {})
      //   const matchedShopNames = ChannelData.filter((shop) =>
      //     formData.store.includes(shop.storeCode)
      //   ).map((shop) => shop.shopName)

      //   const result = matchedShopNames.join(',')
      //   searchStoreName.value = result // 回显到表单
      // }
    } finally {
      formLoading.value = false
    }
  }
  // 获取负责人列表
  // getUserList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const linkAccountRef = ref()
const linkNodeRef = ref()

// 关联账号
const linkAccount = () => {
  linkAccountRef.value?.open()
}

// 关联节点
const linkNode = () => {
  linkNodeRef.value?.open()
}

// 选择关联账号的数据
const selectLinkAccountObject = (data: any) => {
  console.log('关联账号的数据：', data)
  formData.platformManageId = data.id

  formData.account = data.account
  formData.storeName = data.storeName
  formData.storeCode = data.storeCode
  // formData.platform = data.platform
  formData.manageName = data.name
  // console.log('--', formData)
  // platformManageId
}

// 选择关联节点的数据
const selectLinkNodeObject = (data: any) => {
  console.log('关联节点的数据：', data)
  formData.nodeId = data.id

  formData.loginUserName = data.loginUserName // 影刀登录账户
  formData.nodeType = data.type // 节点类型
  formData.todeskUserName = data.todeskUserName // todesk账号
  formData.yingyongUuid = data.yingyongUuid // 统一登录应用UUID

  // nodeId
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = { ...formData }
    console.log('数据）', data)
    if (data.skTabulates) {
      // 处理子程序数据，去掉前端自定义的id属性
      data.skTabulates = data.skTabulates.map((item) => {
        return {
          type: item.type,
          skName: item.skName,
          serviceCode: item.serviceCode
        }
      })
    }
    // data.superintendent = data.superintendent?.length > 0 ? data.superintendent.join(',') : ''

    // 处理下拉的清空
    // data.superintendent = data.superintendent ? data.superintendent : ''
    // data.runEnvironment = data.runEnvironment ? data.runEnvironment : ''
    // data.rpaType = data.rpaType ? data.rpaType : ''
    // data.browser = data.browser ? data.browser : ''

    // console.log('提交的数据：', data)
    if (formType.value === 'create') {
      data.id = undefined
      await rpaApi.addApplication(data)
      message.success(t('common.createSuccess'))
    } else {
      await rpaApi.updateApplication(data)
      message.success(t('common.updateSuccess'))
    }
    drawerVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.id = ''
  formData.platformManageId = '' // 平台管理ID
  formData.account = '' // 关联账号
  formData.storeName = '' // 店铺名称
  formData.storeCode = '' // 店铺编码
  formData.manageName = '' // 关联名称

  formData.nodeId = '' // 节点ID
  formData.loginUserName = '' // 影刀登录账户
  formData.nodeType = '' // 节点类型
  formData.todeskUserName = '' // todesk账号
  formData.yingyongUuid = '' // 统一登录应用UUID
  formData.name = '' // 应用名称
  formData.code = '' // 应用编码
  formData.typeId = '' // 应用类型
  formData.oldTypeId = '' // 原来的类型
  formData.typeCode = '' // 类型编码
  formData.typeName = '' // 类型名称
  formData.typeCategory = '' // 类型类别
  formData.typeDbName = '' // 数据库表
  formData.status = '' // 状态
  formData.checkTime = '' // 检测时间
  formData.browser = '' // 浏览器
  formData.runEnvironment = '' // 运行环境
  formData.remark = '' // 备注
  formData.isBase = 0 // 是否基础入库应用
  formData.skTabulates = [] // 子程序列表

  formRef.value?.resetFields()
}

// 新增子程序
const addSubProgram = () => {
  if (!formData.skTabulates) {
    formData.skTabulates = [] //当子程序列表为null时，初始化一个空数组
  }
  let lgth = formData.skTabulates.length
  let lastId = formData.skTabulates[lgth - 1]?.id || 0
  formData.skTabulates.push({
    id: lastId + 1,
    type: '',
    skName: '',
    serviceCode: ''
  })
}
// 删除子程序
const deleteSubProgram = (data: any) => {
  // 根据id删除对应的数据
  const index = formData.skTabulates.findIndex((item) => item.id === data.id)
  formData.skTabulates.splice(index, 1)
}

// 查询负责人
interface User {
  label: string
  value: string
}
const userList = ref<User[]>([])
const getUserList = async () => {
  let data = await rpaApi.getUserList({ page: 1, size: 99999 })
  userList.value = data?.data.map((item) => ({ label: item.realName, value: item.username }))
}

// 查询应用类型
const typeList = ref<any[]>([])
const getTypeList = async () => {
  let data = await rpaProgramTypeApi.getProgramTypeList({ page: 1, pageSize: 99999 })
  // console.log('应用类型：', data)
  typeList.value = data.records
  // console.log('应用类型列表：', typeList.value)
}

// 监听应用类型typeId变化
watch(
  () => formData.typeId,
  (newVal, oldVal) => {
    if (newVal) {
      const type = typeList.value.find((item) => item.id === newVal)
      console.log('应用类型：', type)
      if (type) {
        formData.typeCode = type.typeCode
        formData.typeCategory = type.typeCategory
        formData.typeName = type.typeName
        formData.typeDbName = type.typeDbName
        // console.log('后',formData);
      }
    }
  }
)
</script>

<style lang="scss" scoped>
:deep(.el-tag, .el-tag.el-tag--primary) {
  background-color: #d2d9ec66;
  border-radius: 15px;
}

// 修改表单label的行高
:deep(.longlabel .el-form-item--default .el-form-item__label) {
  line-height: 1.5;
}

// 修改备注的文本框背景

:deep(.drawer .el-textarea__inner),
:deep(.drawer .el-input__wrapper),
:deep(.drawer .el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

:deep(.el-drawer) {
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 背景
:deep(.el-drawer__body) {
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

.drawer-wrapper {
  overflow: hidden;
  border-radius: 16px;
}

.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.drawerContent {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;

  &-title {
    margin: 0 0 18px 0;
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .drawerContent-title-icon {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }

  &-addSubProgram {
    width: 117px;
    height: 36px;
    border-radius: 4px;
    border: 1px solid #0064ff;
    color: #0064ff;
    margin: 0 auto;
    line-height: 36px;
    text-align: center;
  }

  &-delete {
    &:hover {
      color: #ff0000;
      cursor: pointer;
    }
  }

  &-disabledInput {
    width: 310px;
    padding: 0 16px;
    min-height: 32px;
    box-sizing: border-box;
    background-image: url(@/assets/imgs/common/input_disabled.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    word-wrap: break-word;
  }

  .disabledInput_cover {
    background-image: url(@/assets/imgs/common/input_disabled_cover.png);
    width: 100%;
  }

  .disabledInput_remark {
    background-image: url(@/assets/imgs/common/input_disabled_remark.png);
    width: 100%;
    min-height: 92px;
  }
}

// 点击跳转
:deep(.docUrl .el-input__inner) {
  color: #0064ff;
  cursor: pointer;
  text-decoration: underline;
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
</style>
