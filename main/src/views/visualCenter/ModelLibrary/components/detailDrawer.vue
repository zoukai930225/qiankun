<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle" custom-class="custom-drawer" :showBeforClose="true"
    :width="512" @before-close="handleDrawerClose">
    <div class="content" v-loading="drawerLoading">
      <el-form :model="formParams" label-width="80" :rules="fromRules" ref="formRef" class="form-wapper" :key="formKey">
        <el-card shadow="never" style="margin-bottom: 10px; background-color: #fff; position: relative;">
          <el-form-item label="图片" :prop="disabled ? '' : 'pictureUrls'">
            <img-upload :key="imgKey" :is-detail="disabled" v-model:up-load-list="upLoadList" @change="handleChange" />
          </el-form-item>
          <el-form-item label="名称" :prop="disabled ? '' : 'name'">
            <el-input class="!w100%" v-model="formParams.name" placeholder="请输入名称" maxlength="20" show-word-limit
              clearable filterable :disabled="disabled" />
          </el-form-item>
          <el-form-item label="模特类型" :prop="disabled ? '' : 'modelType'">
            <el-select class="!w100%" v-model="formParams.modelType" placeholder="请选择模特类型" filterable
              :disabled="disabled" :suffix-icon="disabled ? '' : 'ArrowDown'">
              <el-option v-for="item in getIntDictOptions(DICT_TYPE.VC_MODEL_LIB_MODEl_TYPE, true)" :key="item.value"
                :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="产品类型" :prop="disabled ? '' : 'productType'">
            <el-select class="!w100%" v-model="formParams.productType" placeholder="请选择产品类型" filterable
              :disabled="disabled" :suffix-icon="disabled ? '' : 'ArrowDown'">
              <el-option v-for="item in getIntDictOptions(DICT_TYPE.VC_MODEL_LIB_PRODUCT_TYPE, true)" :key="item.value"
                :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <s-text-area v-model="formParams.remark" class="!w100%" placeholder="请填写备注"
              :autosize="{ minRows: 3, maxRows: 4 }" maxlength="200" show-word-limit clearable :disabled="disabled" />
          </el-form-item>
        </el-card>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="closeValiate">取消</el-button>
      <el-button @click="submit" type="primary" class="mr0px">{{ disabled ? "编辑" : "提交" }}</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import ImgUpload from './imgUpload.vue'
import * as vcModelLibApi from '@/api/visualCenter/vcModelLib'
import { v4 as uuidv4 } from 'uuid';
const props = defineProps(['role'])
const message = useMessage()
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerLoading = ref(false)
const drawerType = ref('')
const disabled = ref(false)
const imgKey = ref(0)
const upLoadList = ref([])
const formKey = ref(0)
const lastSource = ref('')

// 请求参数
const formParams = ref({
  id: '',
  pictureUrls: [],
  name: '',
  modelType: '',
  productType: '',
  remark: ''
})
const formRef = ref()
const open = async (type, id) => {
  console.log("id", id)
  reset()
  imgKey.value++;
  drawerVisible.value = true
  drawerType.value = type

  switch (type) {
    case 'add':
      // 当expression的值等于value1时执行的代码块
      drawerTitle.value = '新增'
      disabled.value = false
      break;
    case 'edit':
      disabled.value = false
      drawerTitle.value = '编辑'
      break;
    case 'detail':
      disabled.value = true
      drawerTitle.value = '查看详情'
      break;
  }
  if (id) {
    try {
      drawerLoading.value = true
      const { pictureUrl, updatedAt, updatedId, updater, ...rest } = await vcModelLibApi.getDetailsById(id)
      if (rest) {
        formParams.value = rest
        upLoadList.value = pictureUrl.split(',').map(x => {
          const temp = {
            name: uuidv4(),
            url: x
          }
          return temp
        })
        formParams.value.modelType = String(formParams.value.modelType)
        formParams.value.productType = String(formParams.value.productType)
        imgKey.value++;
        setTimeout(() => {
          lastSource.value = JSON.stringify(formParams.value)
        }, 0);

      }
    } finally {
      drawerLoading.value = false
    }
  } else {
  }
}
const fromRules = reactive({
  pictureUrls: [{ required: true, message: '请上传模特图片', trigger: 'change' }],
  modelType: [{ required: true, message: '请选择模特类型', trigger: 'change' }],
  productType: [{ required: true, message: '请选择产品类型', trigger: 'change' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
})

const handleChange = (fileList) => {
  formParams.value.pictureUrls = fileList
  formRef.value.validateField('pictureUrls')
}

const submit = async () => {
  if (disabled.value) {
    disabled.value = false
    drawerTitle.value = '编辑'
    drawerType.value = 'edit'
    imgKey.value++
    formKey.value++
    return
  }
  const valid = await formRef.value.validate()
  if (!valid) return
  try {
    drawerLoading.value = true
    let params = { ...formParams.value }
    if (drawerType.value === 'edit') {
      await vcModelLibApi.edit(params)
      message.success('编辑成功')
    } else {
      await vcModelLibApi.save(params)
      message.success('保存成功')
    }
    reset()
    emits('success')
    emits('handleRefresh', false)
  } finally {
    drawerLoading.value = false
  }
}
const reset = () => {
  formRef.value?.resetFields()
  drawerVisible.value = false
}

const closeValiate = () => {
  const source = JSON.stringify(formParams.value)
  if (drawerType.value !== 'edit' || lastSource.value === source) {
    formRef.value?.resetFields()
    drawerVisible.value = false
    return
  }

  if (lastSource.value !== source && drawerType.value === 'edit') {
    ElMessageBox.confirm('有编辑内容未保存，确定关闭?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        formRef.value?.resetFields()
        drawerVisible.value = false
      })
  }


}



const handleDrawerClose = () => {
  console.log("beforeClase")
  reset()
}
const emits = defineEmits(['success', 'handleRefresh', 'getRole'])
defineExpose({ open })
</script>

<style lang="scss" scoped>
:deep() {
  --el-text-color-placeholder: #999;
}

:deep(.el-input__count-inner) {
  color: #999;
}

:deep(.el-input__count) {
  color: #999;
}

:deep(.el-drawer__footer) {
  display: none !important;
}

:deep(.el-card) {
  border: none;
  border-radius: 8px;
}

:deep(.upload_info .file_list .file_card .file_icon .img) {
  box-shadow: 0 0 0 0 !important;
}

.card-content {
  width: calc(100% - 0px);
  padding-right: 0px;
}

.textWapper {
  :deep(.el-form-item__label) {
    width: 80px;
    line-height: 16px !important;
    text-align: right;
  }

}

.content {
  //  background-color: #fff;
  // width: 100%;
  // min-height: 100%;
  // border-radius: 20px;
  // padding: 20px;
}

.handle-content {
  margin-top: 10px;
  margin-bottom: 10px;
}

.title-wapper {
  width: calc(100% - 20px);
  height: 52px;
  border-bottom: 1px #F0F0F0 solid;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  padding-left: 20px;

  span {
    font-size: 14px;
    font-weight: 600;
    position: relative;
    margin-left: 25px;
  }

  span::before {
    content: '';
    width: 3px;
    height: 13px;
    background-color: #0064FF;
    position: absolute;
    left: -20px;
    top: 1px;
  }
}

.user {
  display: flex;
  align-items: center;

  .ava {
    margin-right: 10px;
  }
}

.expand-body {
  cursor: pointer;
  color: var(--el-color-primary);
  display: inline-block;
  position: absolute;
  right: 50px;
  top: 25px;
  font-size: 14px;

  .expand-icon {
    position: absolute;
    right: -20px;
    top: -2px;
  }
}
</style>
