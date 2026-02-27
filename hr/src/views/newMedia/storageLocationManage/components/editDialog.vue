<template>
  <div>
    <el-dialog
      class="editDialog"
      v-model="dialogVisible"
      :destroy-on-close="true"
      :before-close="handleClose"
    >
      <template #header="{}">
        <div class="header">
          <span class="title">{{ dialogTitle }}</span>
        </div>
      </template>
      <div class="dialog-content">
        <el-scrollbar>
          <el-form
            class="form"
            ref="ruleFormRef"
            :model="form"
            label-width="80"
            label-position="right"
            :validate-on-rule-change="false"
            :rules="fromRule"
          >
            <el-form-item
              label="位置编码"
              prop="locationCode"
              v-if="dialogType === 'update'"
              required
            >
              <el-input style="width: 300px" v-model="form.locationCode" readonly disabled />
            </el-form-item>
            <el-form-item label="位置" prop="location">
              <el-input style="width: 300px" v-model="form.location" placeholder="请输入位置" />
            </el-form-item>
            <el-form-item label="最大容量" prop="maximumCapacity">
              <el-input
                style="width: 300px"
                v-model="form.maximumCapacity"
                placeholder="请输入最大容量"
              />
            </el-form-item>
            <el-form-item label="图片" prop="imgList">
              <UploadImg v-model:modelValue="imgList" :limit="1" />
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
      <template #footer>
        <div class="footer">
          <el-button @click="dialogVisible = false"> 取 消 </el-button>
          <el-button @click="handleSubmit" type="primary">提 交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import UploadImg from '../../components/uploadImg.vue'
import * as LocationApi from '@/api/sample/storageLocationManage'

const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示

defineOptions({ name: 'StorageDialog' })

const form = ref({
  id: '',
  location: '',
  locationCode: '',
  maximumCapacity: '',
  image: ''
})
const ruleFormRef = ref()
const imgList = ref<any>([])
const fromRule = reactive({
  location: [{ required: true, message: '请填写位置信息', trigger: 'blur' }]
})

const dialogTitle = ref('新增库位')

const loading = ref(false) // 表单的加载中
const dialogType = ref('')
/** 打开弹窗 */
const open = async (type, id) => {
  console.log(type, id)
  dialogType.value = type
  dialogVisible.value = true
  if (id) {
    //编辑
    dialogTitle.value = '编辑库位'
    getDetail(id)
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 关闭dialog
const handleClose = () => {
  dialogVisible.value = false
  ruleFormRef.value.resetFields()
  imgList.value = []
}

// 获取详细数据
const getDetail = async (id) => {
  const data = await LocationApi.getLocationById(id)
  console.log(data)
  if (data) {
    form.value = data
    if (data.image) imgList.value.push({ fileUrl: data.image })
  }
}
// 提交
const handleSubmit = async () => {
  const { location, locationCode, maximumCapacity, id } = form.value
  const image = imgList.value.length ? imgList.value[0].fileUrl : ''
  if (!ruleFormRef.value) return
  const valid = await ruleFormRef.value.validate()
  if (!valid) return
  if (dialogType.value === 'update') {
    // 编辑
    const params = { location, locationCode, maximumCapacity, image, id }
    await LocationApi.updateLocation(params)
    message.success('编辑成功')
  } else {
    // 新增
    const params = { location, maximumCapacity, image }
    await LocationApi.addLocation(params)
    message.success('新增成功')
  }
  handleClose()
  emit('success')
}
const emit = defineEmits(['success'])
</script>
<style scoped lang="scss">
:deep(.editDialog) {
  width: 500px;
  border-radius: 20px;
  // background: linear-gradient(226deg, #f2f3ff 0%, #ffffff 39%, #ffffff 87%, #f0f8ff 100%);
}
:deep(.el-dialog__header) {
  border-bottom: 1px solid #eee;
}
.header {
  text-align: center;
  .title {
    margin: auto;
  }
}
.dialog-content {
  padding: 10px;
  .form {
    margin-top: 10px;
  }
}
.footer {
  text-align: center;
}
</style>
