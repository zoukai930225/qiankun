<template>
  <el-form ref="formRef" :model="form" :rules="formRules" label-width="70">
    <el-form-item prop="person" :label="personMap[props.type]">
      <line-staffs
        v-model="form.person"
        :placeholder="`请选择${personMap[props.type]}`"
        :roleId="roles.getRole(`线下-新品${personMap[props.type]}`)"
      ></line-staffs>
    </el-form-item>
    <el-form-item prop="remark" label="备注">
      <s-text-area
        v-model="form.remark"
        :autosize="{ minRows: 4, maxRows: 7 }"
        style="width: 100%"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import lineStaffs from '@/components/template/table/components/lineStaffs.vue'
import request from '@/config/axios'
const message = useMessage()
const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  baseInfoId: {
    type: String,
    default: ''
  },
  currentNodeCode: {
    type: String,
    default: ''
  },
  sampleWorkers: {
    type: Array,
    default: () => []
  },
  sampleWorkerRemark: {
    type: String,
    default: ''
  }
})

const personMap = {
  patternAssign: '版师',
  sampleWorkerAssign: '样工',
  merchandiserAssign: '跟单'
}

// 权限
const roles = inject<any>('roles')

const form = ref({
    person: props.sampleWorkers ? props.sampleWorkers : [],
    remark: props.sampleWorkerRemark || ''
  }),
  formRef = ref()

const formRules = computed(() => {
  return {
    person: [{ required: true, message: `请选择${personMap[props.type]}`, trigger: 'change' }]
  }
})

const loading = ref(false)
const submit = async () => {
  if (loading.value) return
  const valid = await formRef.value.validate()
  if (valid) {
    await message.confirm('是否确定保存，保存后数据将流转至下一节点？')
    try {
      loading.value = true
      const assign: any = {}
      const dto: any = { ...form.value }
      if (props.type === 'patternAssign') {
        // 版师分配
        dto.patternMakerId = dto.person.map((item: any) => item.userId).join() || ''
        delete dto.person
        assign['offlineNpPatternAssignDTO'] = dto
      } else if (props.type === 'sampleWorkerAssign') {
        dto.sampleWorkerId = dto.person.map((item: any) => item.userId).join() || ''
        delete dto.person
        // 样工分配
        assign['offlineNpSampleWorkerAssignDTO'] = dto
      } else {
        dto.merchandiserId = dto.person.map((item: any) => item.userId).join() || ''
        delete dto.person
        // 跟单分配
        assign['offlineNpMerchandiserAssignDTO'] = dto
      }
      const data = {
        nodeCode: props?.currentNodeCode || '',
        baseInfoId: props?.baseInfoId || '',
        ...assign
      }
      await request.post({ url: '/api/offline/np/process/submitNode', data })
    } finally {
      loading.value = false
    }
  }
}

defineExpose({ submit })
</script>

<style></style>
