<template>
  <div class="drawer-wrapper">
    <el-drawer v-model="drawerVisible" :with-header="false" :wrapper-closable="true" class="drawer">
      <div class="drawerTitle"
        ><div>{{ dialogTitle }}</div
        ><div @click="closeDrawer"
          ><el-icon><CloseBold /></el-icon
        ></div>
      </div>
      <div class="drawerContent">
        <el-form
          class="dialogForm"
          ref="formRef"
          v-loading="formLoading"
          :model="formData"
          :rules="formRules"
          label-width="100px"
        >
          <el-form-item label="店铺名称" prop="name">
            <el-input
              class="dialogFormItemWidth"
              v-model="formData.name"
              placeholder="请输入店铺名"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="简称" prop="nickName">
            <el-input
              class="dialogFormItemWidth"
              v-model="formData.nickName"
              placeholder="请输入简称"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="店铺code" prop="code">
            <el-input
              class="dialogFormItemWidth"
              style="width: 100%"
              v-model="formData.code"
              placeholder="请输入店铺code"
              :disabled="formData.id && formData.id != undefined ? true : false"
            />
          </el-form-item>
          <el-form-item label="标签" prop="tag">
            <el-select
              class="dialogFormItemWidth"
              v-model="formData.tag"
              filterable
              placeholder="请选择标签"
              style="width: 100%"
            >
              <el-option
                v-for="dict in tagList"
                :key="dict.id"
                :label="dict.tagName"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="责任人" prop="tag">
            <select-people
              :multiple="false"
              v-model:model-value="directorRes"
              :user-id="formData.directorId"
              @update:director="updateDirector"
            />
          </el-form-item>
          <!-- <el-form-item label="企业" prop="company">
        <el-select
          class="dialogFormItemWidth"
          v-model="formData.company"
          placeholder="请选企业"
          clearable
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_DYNAMIC_COMPANY)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
          <el-form-item label="渠道" prop="channel">
            <el-select
              class="dialogFormItemWidth"
              style="width: 100%"
              v-model="formData.channel"
              placeholder="请选渠道"
              clearable
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_CHANNEL)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="drawerFooter">
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm"> 确 定</el-button>
      </div>
      <!-- <Dialog class="commomDialig" v-model="drawerVisible" :title="dialogTitle"> -->

      <!-- <template #footer>
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      </template> -->
      <!-- </Dialog> -->
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import selectPeople from './components/selectPeople.vue'
import * as StoreApi from '@/api/system/store'
import * as GoodsShopApi from '@/api/shop'

defineOptions({ name: 'StoreFormForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const drawerVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref<{
  id?: ''
  name?: ''
  code?: ''
  // company: '',
  channel?: ''
  nickName?: ''
  tag?: any
  directorId?: ''
  directorName?: ''
}>({})
const tagList = ref<any>([])

const formRules = reactive({
  name: [{ required: true, message: '店铺名称不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '店铺Code不能为空', trigger: 'blur' }],
  company: [{ required: true, message: '请选择企业', trigger: 'blur' }],
  channel: [{ required: true, message: '请选择渠道', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  drawerVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await StoreApi.getStoreDetail(id)
      if (formData.value.directorId) directorRes.value = [formData.value.directorId]
    } finally {
      formLoading.value = false
    }
  }
  getTagList()
}

const directorRes = ref<string[]>([])
function updateDirector(value: typeof formData.value) {
  formData.value.directorId = value.directorId
  formData.value.directorName = value.directorName
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 获取标签列表
const getTagList = async () => {
  try {
    const data = await GoodsShopApi.goodsPersonalQueryTag({
      page: 1,
      size: 99999,
      tagCategory: 'store'
    }).catch(() => {})
    if (data) {
      tagList.value = data.records || []
    }
  } finally {
  }
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as StoreApi.StoreVO
    if (formType.value === 'create') {
      data.id = undefined
      await StoreApi.createOrUpdateStore(data)
      message.success(t('common.createSuccess'))
    } else {
      await StoreApi.createOrUpdateStore(data)
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
  formData.value = {}
  formRef.value?.resetFields()
}

/** 关闭弹窗 */
const closeDrawer = () => {
  drawerVisible.value = false
}
</script>
<style lang="less" scoped>
@use '@/styles/eldrawer1.scss';
</style>
