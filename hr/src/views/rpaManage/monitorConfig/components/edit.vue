<template>
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="150px">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="监控数据名称" prop="dataName">
          <el-input v-model="formData.dataName" placeholder="请输入监控数据名称" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="服务类型" prop="serviceType">
          <el-select v-model="formData.serviceType" placeholder="请选择服务类型" style="width: 100%"
            @change="handleServiceTypeChange">
            <el-option v-for="item in dictOptions.serviceTypeOptions" :key="item.value" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="应用名称" prop="serviceCode">
          <el-select v-model="formData.serviceCode" placeholder="请选择应用名称" style="width: 100%" filterable>
            <el-option v-for="item in appOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="统计类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择统计类型" style="width: 100%">
            <el-option v-for="item in dictOptions.statisticsTypeOptions" :key="item.value" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="指标列" prop="indicatorsFiled">
          <el-input v-model="formData.indicatorsFiled" placeholder="请输入指标列" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="数据库类型" prop="dataBaseType">
          <el-select v-model="formData.dataBaseType" placeholder="请选择数据库类型" style="width: 100%">
            <el-option v-for="item in dictOptions.dbTypeOptions" :key="item.value" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="查询时间列(字符串)" prop="queryDateField"
          :rules="[{ validator: validateQueryDate, trigger: 'change' }]">
          <el-input v-model="formData.queryDateField" placeholder="请输入查询时间列(字符串)" @input="onQueryDateFieldChange" />
          <div class="field-help-text">与查询时间列(时间)互斥，只能填写一个</div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="查询时间列(时间)" prop="queryDateTimeField"
          :rules="[{ validator: validateQueryDate, trigger: 'change' }]">
          <el-input v-model="formData.queryDateTimeField" placeholder="请输入查询时间列(时间)"
            @input="onQueryDateTimeFieldChange" />
          <div class="field-help-text">与查询时间列(字符串)互斥，只能填写一个</div>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="查询店铺列" prop="queryStoreField">
          <el-input v-model="formData.queryStoreField" placeholder="请输入查询店铺列" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="浮动阈值" prop="indicators">
          <el-input v-model="formData.indicators" placeholder="请输入浮动阈值" type="number" step="0.01" max="0.99"
            min="0.01" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="业务表" prop="businessTable">
          <el-input v-model="formData.businessTable" placeholder="请输入业务表" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="查询扩展列" prop="extWhereFiled">
          <el-input v-model="formData.extWhereFiled" placeholder="请输入查询扩展列" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="查询时间" prop="checkYesterdayOrToday">
          <el-select v-model="formData.checkYesterdayOrToday" placeholder="请选择查询时间" style="width: 100%">
            <el-option v-for="item in dictOptions.queryTimeOptions" :key="item.value" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="优先级" prop="taskPriority">
          <el-select v-model="formData.taskPriority" placeholder="请选择优先级" style="width: 100%">
            <el-option v-for="item in dictOptions.priorityOptions" :key="item.value" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="自定义SQL" prop="customSql">
      <s-text-area v-model="formData.customSql" :rows="4" placeholder="请输入自定义SQL语句" />
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <s-text-area v-model="formData.remark" :rows="4" placeholder="请输入备注" />
    </el-form-item>
    <el-form-item label="查询SQL" prop="querySql">
      <s-text-area v-model="formData.querySql" :rows="4" placeholder="请输入SQL语句" readonly />
      <el-button type="primary" class="mt-10px" @click="getQuerySql" :loading="sqlLoading">
        获取SQL
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { useAttrs } from 'vue'
import { ref, reactive, onMounted, watch } from 'vue'
import type { Ref } from 'vue'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { getProgramTypeList } from '@/api/rpaManage/programType' // 类型
import { getApplicationListNew } from '@/api/rpaManage' // 实例
import { useMessage } from '@/hooks/web/useMessage'
import { getSql, save, getDetail } from '@/api/rpaManage/dataMonitor' // 导入API
import { consistency } from '@/utils'

const message = useMessage()
const visible: Ref<boolean> = ref<boolean>(false)
const currentId: Ref<string> = ref<string>('')
const formRef = ref()
const sqlLoading = ref(false) // SQL加载状态
const attrs = useAttrs() as any
// 定义事件
const emit = defineEmits(['success'])

// 初始化标记：用于在初始加载阶段屏蔽脏检查与重复加载
const isInitializing = ref<boolean>(false)

// 标题由外部容器控制

// 表单数据
const formData = reactive({
  id: '',
  dataName: '',
  serviceType: '',
  serviceCode: '',
  indicatorsFiled: '',
  dataBaseType: '',
  queryDateField: '',
  queryDateTimeField: '',
  queryStoreField: '',
  indicators: '',
  businessTable: '',
  type: '',
  extWhereFiled: '',
  taskPriority: '3',
  checkYesterdayOrToday: '',
  querySql: '',
  customSql: '',
  remark: '',
  typeCategory: 'RPA' // 添加固定参数
})

// 脏检查：初始快照与比较
const initialSnapshot = ref<string>('')
async function snapshotForm() {
  await nextTick()
  initialSnapshot.value = JSON.stringify(formData)
}
function hasChanges() {
  return JSON.stringify(formData) !== initialSnapshot.value
}

// 表单校验规则
const rules = reactive({
  dataName: [{ required: true, message: '请输入监控数据名称', trigger: 'change' }],
  serviceType: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
  serviceCode: [{ required: true, message: '请选择应用名称', trigger: 'change' }],
  indicatorsFiled: [{ required: true, message: '请输入指标列', trigger: 'change' }],
  indicators: [
    { required: true, message: '请输入浮动阈值', trigger: 'change' },
    {
      validator: (_rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入浮动阈值'))
        } else if (isNaN(Number(value))) {
          callback(new Error('请输入数字'))
        } else if (Number(value) <= 0) {
          callback(new Error('浮动阈值必须大于0'))
        } else if (Number(value) > 0.99) {
          callback(new Error('浮动阈值必须小于等于0.99'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  businessTable: [{ required: true, message: '请输入业务表', trigger: 'change' }],
  type: [{ required: true, message: '请选择统计类型', trigger: 'change' }],
  dataBaseType: [{ required: true, message: '请选择数据库类型', trigger: 'change' }],
  checkYesterdayOrToday: [{ required: true, message: '请选择查询时间', trigger: 'change' }]
})

// 下拉选项
const dictOptions = reactive<{
  serviceTypeOptions: Array<{ label: string; value: string | number }>
  statisticsTypeOptions: Array<{ label: string; value: string | number }>
  queryTimeOptions: Array<{ label: string; value: string | number }>
  dbTypeOptions: Array<{ label: string; value: string | number }>
  priorityOptions: Array<{ label: string; value: string | number }>
}>({
  serviceTypeOptions: [],
  statisticsTypeOptions: [],
  queryTimeOptions: [],
  dbTypeOptions: [],
  priorityOptions: []
})

const appOptions = ref<Array<{ label: string; value: string | number }>>([])

// 服务类型改变处理函数
function handleServiceTypeChange(value: string | number) {
  formData.serviceCode = '' // 清空已选择的应用
  if (!value) {
    appOptions.value = []
  }
}

// 根据服务类型加载应用列表选项
async function loadAppOptionsByServiceType(serviceType: string | number) {
  if (!serviceType) {
    appOptions.value = []
    return
  }

  try {
    if (serviceType === '1') {
      // 调用类型接口
      const { records = [] } = (await getProgramTypeList({ page: 1, pageSize: 99999 })) || {}
      appOptions.value = records.map((item: any) => ({
        label: item.typeName,
        value: item.typeCode
      }))
    } else if (serviceType === '0') {
      // 调用实例接口
      const { records = [] } = (await getApplicationListNew({ page: 1, pageSize: 99999 })) || {}
      appOptions.value = records.map((item: any) => ({
        label: item.name,
        value: item.code
      }))
    } else {
      appOptions.value = []
    }
  } catch (error) {
    console.error('获取应用列表失败', error)
    message.error('获取应用列表失败')
    appOptions.value = []
  }
}

// 监听服务类型变化，加载对应的应用列表
watch(
  () => formData.serviceType,
  async (newValue) => {
    if (!newValue) {
      appOptions.value = []
      formData.serviceCode = ''
      return
    }

    // 初始阶段由 fetchDetail 显式加载，避免重复请求
    if (isInitializing.value) return

    await loadAppOptionsByServiceType(newValue)
  }
)

async function getDicts() {
  dictOptions.serviceTypeOptions =
    (await getIntDictOptions(DICT_TYPE.DATA_CHECK_SERVICE_TYPE, true)) || []
  dictOptions.statisticsTypeOptions =
    (await getIntDictOptions(DICT_TYPE.DATA_CHECK_TYPE, true)) || []
  dictOptions.queryTimeOptions = (await getIntDictOptions(DICT_TYPE.CHECK_DATA_DATE, true)) || []
  dictOptions.dbTypeOptions = (await getIntDictOptions(DICT_TYPE.CHECK_DATA_BASE_TYPE, true)) || []
  dictOptions.priorityOptions = [
    { label: '高', value: '1' },
    { label: '中', value: '2' },
    { label: '低', value: '3' }
  ]
}

// 实现获取SQL功能
async function getQuerySql() {
  try {
    // 表单验证
    await formRef.value.validate(async (valid: boolean) => {
      if (!valid) {
        message.warning('请先完成必填项')
        return
      }

      // 检查必填字段
      const requiredFields = [
        'serviceType',
        'serviceCode',
        'indicatorsFiled',
        'businessTable',
        'type',
        'dataBaseType'
      ]

      const missingFields = requiredFields.filter((field) => !formData[field])
      if (missingFields.length > 0) {
        message.warning('请填写所有必填字段')
        return
      }

      // 查询时间列检查
      if (!formData.queryDateField && !formData.queryDateTimeField) {
        message.warning('查询时间列(字符串)和(时间)至少填写一个')
        return
      }

      sqlLoading.value = true

      // 构建请求参数，包含表单数据
      const params = {
        dataName: formData.dataName,
        serviceType: formData.serviceType,
        serviceCode: formData.serviceCode,
        indicatorsFiled: formData.indicatorsFiled,
        dataBaseType: formData.dataBaseType,
        queryDateField: formData.queryDateField,
        queryDateTimeField: formData.queryDateTimeField,
        queryStoreField: formData.queryStoreField,
        indicators: formData.indicators,
        businessTable: formData.businessTable,
        type: formData.type,
        extWhereFiled: formData.extWhereFiled,
        checkYesterdayOrToday: formData.checkYesterdayOrToday,
        customSql: formData.customSql
      }

      const result = await getSql(params)
      if (result) {
        formData.querySql = result
        message.success('SQL获取成功')
      }
    })
  } catch (error) {
    console.error('获取SQL失败:', error)
    message.error('获取SQL失败')
  } finally {
    sqlLoading.value = false
  }
}

// 自定义校验函数 - 检查查询时间列二选一必填
const validateQueryDate = (_rule: any, _value: string, callback: any) => {
  if (!formData.queryDateField && !formData.queryDateTimeField) {
    callback(new Error('查询时间列(字符串)和(时间)至少填写一个'))
  } else if (formData.queryDateField && formData.queryDateTimeField) {
    callback(new Error('查询时间列(字符串)和(时间)只能填写一个'))
  } else {
    callback()
  }
}

// 当字符串类型时间列输入时的处理
function onQueryDateFieldChange(val: string) {
  if (val && formData.queryDateTimeField) {
    // 如果输入了字符串类型，且时间类型有值，询问是否清空时间类型
    message
      .confirm('您已输入查询时间列(字符串)，是否清空查询时间列(时间)？', '提示')
      .then(() => {
        formData.queryDateTimeField = ''
      })
      .catch(() => {
        // 用户选择保留两者，恢复之前的值
        formData.queryDateField = ''
      })
  }
}

// 当时间类型时间列输入时的处理
function onQueryDateTimeFieldChange(val: string) {
  if (val && formData.queryDateField) {
    // 如果输入了时间类型，且字符串类型有值，询问是否清空字符串类型
    message
      .confirm('您已输入查询时间列(时间)，是否清空查询时间列(字符串)？', '提示')
      .then(() => {
        formData.queryDateField = ''
      })
      .catch(() => {
        // 用户选择保留两者，恢复之前的值
        formData.queryDateTimeField = ''
      })
  }
}

// 修改提交表单函数，添加SQL检查
async function submitForm() {
  if (!formRef.value) throw new Error('表单未初始化')

  // 使用 Promise 形式的校验：未通过会抛出异常，阻止抽屉关闭
  await formRef.value.validate()

  if (!formData.querySql) {
    message.warning('SQL为空，请先获取SQL')
    throw new Error('SQL 为空')
  }

  await saveData()
}

// 实际保存数据的函数
async function saveData() {
  try {
    // 开启全局加载状态
    // loadStart()
    // 确保typeCategory参数固定为RPA
    formData.typeCategory = 'RPA'

    // 复制模式：不传 id
    const isCopyMode = attrs?.mode === 'copy'
    const payload = { ...formData } as any
    if (isCopyMode) {
      delete payload.id
    }

    await save(payload)
    // 保存成功后更新快照，避免关闭时误提示
    snapshotForm()
    message.success('保存成功')
    // 触发成功事件，通知父组件刷新表格
    emit('success')
    // 不在这里关闭抽屉，交由外层 useDrawer 在 submit 成功后统一关闭
  } catch (error) {
    console.error('保存失败:', error)
    message.error('保存失败')
    // 抛出错误阻止外层关闭
    throw error
  } finally {
    // 关闭全局加载状态
    // loadDone()
  }
}

// 根据ID获取详情数据
async function fetchDetail(id: string) {
  try {
    isInitializing.value = true
    const result = await getDetail(id)
    if (result) {
      // 将详情数据赋值给表单，确保包含ID
      Object.assign(formData, result)

      // 复制模式：名称追加 _copy（不在此处清空 id，提交时处理）
      if (attrs?.mode === 'copy') {
        formData.dataName = `${result.dataName || ''}_copy`
      }

      // 根据服务类型的应用列表（初始化时显式加载，watcher 被抑制）
      if (result.serviceType) {
        await loadAppOptionsByServiceType(result.serviceType)
      }

      // 加载完成后记录初始快照
      await snapshotForm()
    }
  } catch (error) {
    console.error('获取详情失败:', error)
    message.error('获取详情失败')
  } finally {
    isInitializing.value = false
  }
}

function open(id?: string) {
  isInitializing.value = true
  if (id) {
    currentId.value = id
    // 保存ID到表单数据
    formData.id = id
    // 调用获取详情接口
    fetchDetail(id)
  } else {
    currentId.value = ''
    // 重置表单
    resetForm()
    // 新增时记录初始快照
    snapshotForm().finally(() => {
      isInitializing.value = false
    })
  }
  // visible.value = true
}

function close() {
  visible.value = false
  resetForm()
}

function resetForm() {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  // 确保清空ID字段
  formData.id = ''
  // 确保保留typeCategory参数
  formData.typeCategory = 'RPA'
}

// 关闭前钩子：有修改时提示确认
function beforeClose(done: () => void) {
  // 初始化阶段或尚未建立快照时不提示
  if (isInitializing.value || !initialSnapshot.value) {
    done()
    return
  }
  consistency(formData, JSON.parse(initialSnapshot.value), done)
  // if (!hasChanges()) {
  //   done()
  //   return
  // }
  // message
  //   .confirm('当前页面存在内容未保存，继续关闭将清空已填写内容，是否继续取消？', '提示')
  //   .then(() => {
  //     done()
  //   })
  //   .catch(() => {
  //     // 取消关闭
  //   })
}

onMounted(() => {
  getDicts()
  const { id } = attrs as any
  open(id)
  // 移除这里的getAppOptions()调用，因为初始时应用列表应该为空
})

defineExpose({
  open,
  close,
  submit: submitForm,
  beforeClose
})
</script>
<style scoped lang="scss">
.el-form-item {
  margin-bottom: 20px;
}

.field-help-text {
  font-size: 12px;
  color: #909399;
  line-height: 1.2;
  margin-top: 4px;
}
</style>
