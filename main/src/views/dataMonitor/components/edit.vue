<template>
  <el-dialog v-model="visible" :title="props.editable ? '编辑' : props.row.checkFlag == '1' ? '查看' : '确认'" width="650px"
    :close-on-click-modal="false" destroy-on-close>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <!-- <el-form-item label="状态" prop="checkFlag">
        <el-tag :type="form.checkFlag === '1' ? 'success' : 'info'">
          {{ form.checkFlag === '1' ? '已确认' : '未确认' }}
        </el-tag>
      </el-form-item> -->
      <el-form-item label="上传图片" prop="checkImg">
        <UploadImgs bussiness-code="COMMON" :onlyUploadImg="true" v-model:modelValue="form.checkImg"
          :disabled="!props.editable && props.row.checkFlag == '1'" uploadText="添加图片" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <s-text-area v-model="form.remark" :rows="4" placeholder="请输入备注"
          :disabled="!props.editable && props.row.checkFlag == '1'" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="props" @click="cancel">取消</el-button>
        <el-button v-if="props.row.checkFlag != '1' || props.editable" type="primary" @click="submitForm"
          :loading="loading">
          {{ props.row.checkFlag != '1' ? '确认' : '保存' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { ref, reactive, watch, nextTick } from 'vue'
import { updateCheckStatus, getDetail } from '@/api/dataMonitor'
import { useMessage } from '@/hooks/web/useMessage'
// import { UploadImgs } from '@/components/UploadFile'
import UploadImgs from '@/components/SWUoloadFile/index.vue'

const message = useMessage()
const emit = defineEmits(['success', 'update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  row: {
    type: Object,
    default: () => ({})
  },
  editable: {
    type: Boolean,
    default: false
  }
})

// 表单数据
const visible = ref(false)
const loading = ref(false)
const formRef = ref()
interface EditFormModel {
  id: string
  checkImg: any[]
  remark: string
  checkFlag: string
}
const form = reactive<EditFormModel>({
  id: '',
  checkImg: [] as any[],
  remark: '',
  checkFlag: ''
})

// 表单验证规则
const rules = {
  // remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
}

// 解析后端回显的图片字段，支持以下形式：
// - 字符串："url1?name=xx,url2?name=yy"
// - 字符串数组：["url?name=xx", "url?name=yy"]
// - 对象数组：[{ url, name }]
function parseCheckImgInput(input: any): Array<{ url: string; name: string }> {
  const toItem = (s: string): { url: string; name: string } => {
    if (!s) return { url: '', name: '' }
    const idx = s.indexOf('?name=')
    if (idx >= 0) {
      const base = s.substring(0, idx)
      const name = decodeURIComponent(s.substring(idx + 6))
      return { url: base, name }
    }
    try {
      const urlObj = new URL(s)
      const path = urlObj.pathname || ''
      const name = decodeURIComponent(path.split('/').pop() || '')
      return { url: s, name }
    } catch {
      return { url: s, name: '' }
    }
  }

  if (typeof input === 'string') {
    return input
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
      .map(toItem)
  }
  if (Array.isArray(input)) {
    return input
      .map((it) => {
        if (typeof it === 'string') return toItem(it)
        const rawUrl = it?.url || ''
        const rawName = it?.name || ''
        if (rawUrl.includes('?name=')) return toItem(rawUrl)
        return { url: rawUrl, name: rawName }
      })
      .filter((it) => it.url)
  }
  if (input && typeof input === 'object') {
    const rawUrl = input.url || ''
    const rawName = input.name || ''
    if (rawUrl.includes('?name=')) return [toItem(rawUrl)]
    return rawUrl ? [{ url: rawUrl, name: rawName }] : []
  }
  return []
}

// 获取详情
const fetchDetail = async (id) => {
  try {
    loading.value = true
    const data = await getDetail(id)
    if (data) {
      form.remark = data.remark || ''
      // 回显图片：规范化为对象数组 [{ url, name }]
      form.checkImg = parseCheckImgInput(data.checkImg)
      form.checkFlag = data.checkFlag
    }
  } catch (error) {
    console.error('获取详情失败:', error)
    message.error('获取详情失败')
  } finally {
    loading.value = false
  }
}

// 监听visible变化
watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
    if (val && props.row) {
      form.id = props.row.id || ''
      fetchDetail(form.id)
    }
  }
)

// 监听组件内部visible变化
watch(
  () => visible.value,
  (val) => {
    emit('update:modelValue', val)
    if (!val) {
      reset()
    }
  }
)

// 取消
const cancel = () => {
  visible.value = false
  reset()
}

// 重置表单
const reset = async () => {
  await nextTick()
  form.checkImg = [] as any[]
  form.remark = ''
  form.checkFlag = ''
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 将图片数组转换为逗号分隔字符串，并拼接 ?name= 文件名
function buildCheckImgString(imgs: any): string {
  if (Array.isArray(imgs)) {
    return imgs
      .map((item) => {
        if (typeof item === 'string') return item
        const url = item?.url || ''
        const name = item?.name || ''
        return url ? `${url}?name=${encodeURIComponent(name)}` : ''
      })
      .filter(Boolean)
      .join(',')
  }
  if (imgs && typeof imgs === 'object') {
    const url = imgs.url || ''
    const name = imgs.name || ''
    return url ? `${url}?name=${encodeURIComponent(name)}` : ''
  }
  return typeof imgs === 'string' ? imgs : ''
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        // 处理图片数据：将数组或对象转为逗号分隔字符串，并为每项拼接 ?name= 文件名
        const checkImgString = buildCheckImgString(form.checkImg)

        await updateCheckStatus({
          id: form.id,
          checkImg: checkImgString,
          remark: form.remark,
          checkFlag: '1'
        })

        // 更新本地状态
        form.checkFlag = '1'
        message.success('确认成功')

        // 通知父组件刷新列表
        emit('success')

        // 关闭对话框
        visible.value = false
        reset()
      } catch (error) {
        console.error('确认失败:', error)
        message.error('确认失败')
      } finally {
        loading.value = false
      }
    }
  })
}

defineExpose({
  visible
})
</script>

<style scoped lang="scss">
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
