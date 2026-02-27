<template>
  <scheme-details ref="detailsRef" name="MonthAssessment" :before-close="beforeClose">
    <template #card>
      <div class="row-center" style="margin-bottom: 16px" v-if="viewType === 'quickEdit'">
        <img src="@/assets/imgs/common/warning_icon.png" alt="" style="width: 14px; height: 14px" />
        <div style="font-size: 14px; color: #e26a00; margin-left: 5px"
          >{{
            `您共有${list.length || 0}名人员需要填报，还剩${
              (list.length || 0) - (finishedList.length || 0)
            }名人员需要填报`
          }}
        </div>
      </div>
      <div>
        <el-form :model="dataValue" label-width="auto" disabled>
          <el-form-item label="姓名">
            <line-reveal
              class="user_border"
              :options-list="[{ name: dataValue.name, avatarOrigin: dataValue.tx }]"
            />
          </el-form-item>
          <el-form-item label="一级部门">
            <el-input v-model="dataValue.firstDepart" />
          </el-form-item>
          <el-form-item label="二级部门">
            <el-input v-model="dataValue.secondDepart" />
          </el-form-item>
          <el-form-item label="考核周期">
            <el-input v-model="dataValue.khzq" />
          </el-form-item>
        </el-form>
        <el-form
          :model="dataValue"
          label-width="110"
          :rules="rules"
          ref="formRef"
          :disabled="viewType === 'view'"
          :validate-on-rule-change="false"
        >
          <el-card shadow="never" class="info_card">
            <div style="font-size: 14px; font-weight: 500; margin-bottom: 16px">月度考评</div>
            <el-form-item label="" prop="nl">
              <div class="custom-form_label">
                <header-line
                  :info="{
                    title: '能力',
                    tips: tipsInfo.nl,
                    tipsWidth: 416
                  }"
                ></header-line>
              </div>
              <el-radio-group v-model="dataValue.nl" @change="clearCheck">
                <el-radio
                  v-for="(ops, index) in dicInfo"
                  :key="`nl_${ops.value}_${index}`"
                  :value="ops.value"
                >
                  {{ ops.label }}
                </el-radio>
              </el-radio-group>
              <!-- <template #label> -->
              <!-- </template> -->
            </el-form-item>
            <el-form-item label="" prop="ql">
              <div class="custom-form_label">
                <header-line
                  :info="{
                    title: '潜力',
                    tips: tipsInfo.ql,
                    tipsWidth: 416
                  }"
                ></header-line>
              </div>
              <el-radio-group v-model="dataValue.ql" @change="clearCheck">
                <el-radio
                  v-for="(ops, index) in dicInfo"
                  :key="`ql_${ops.value}_${index}`"
                  :value="ops.value"
                >
                  {{ ops.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="" prop="jzg">
              <div class="custom-form_label">
                <header-line
                  :info="{
                    title: '价值观',
                    tips: tipsInfo.jzg,
                    tipsWidth: 416
                  }"
                ></header-line>
              </div>
              <el-radio-group v-model="dataValue.jzg" @change="clearCheck">
                <el-radio
                  v-for="(ops, index) in dicInfo"
                  :key="`jzg_${ops.value}_${index}`"
                  :value="ops.value"
                >
                  {{ ops.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="" prop="tdzjz">
              <div class="custom-form_label">
                <header-line
                  :info="{
                    title: '团队中价值',
                    tips: tipsInfo.tdzjz,
                    tipsWidth: 416
                  }"
                ></header-line>
              </div>
              <el-radio-group v-model="dataValue.tdzjz" @change="clearCheck">
                <el-radio
                  v-for="(ops, index) in dicInfo"
                  :key="`tdzjz_${ops.value}_${index}`"
                  :value="ops.value"
                >
                  {{ ops.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <s-text-area
                v-model="dataValue.remark"
                :autosize="{ minRows: 4, maxRows: 7 }"
                style="width: 100%"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
            <template v-if="dataValue.tdzjz === '5'">
              <div style="font-size: 14px; font-weight: 500; margin-bottom: 16px">延展问题</div>
              <el-form-item
                style="margin-left: 55px"
                v-for="(ql, index) in dataValue.questions"
                :label="`${ql.label}${ql.desc}`"
                label-position="top"
                :prop="ql.prop"
                :rules="[{ required: ql.required, message: `请选择${ql.label}`, trigger: 'blur' }]"
              >
                <template v-if="ql.type === 'radio'">
                  <el-radio-group v-model="dataValue[ql.prop]" style="margin-left: 55px">
                    <el-radio
                      v-for="(ops, index) in ql.options"
                      :key="`${ql.prop}_${ops.value}_${index}`"
                      :value="ops.value"
                    >
                      {{ ops.label }}
                    </el-radio>
                  </el-radio-group>
                </template>
                <template v-else>
                  <el-input :placeholder="`请输入${ql.label}`" v-model="ql.value"></el-input>
                </template>
              </el-form-item>
            </template>
          </el-card>
          <el-card shadow="never" class="info_card">
            <!-- <el-form
              :model="dataValue"
              label-width="100"
              :rules="rules"
              ref="formRef"
              :disabled="viewType === 'view'"
              :validate-on-rule-change="false"
            > -->
            <div style="font-size: 14px; font-weight: 500; margin-bottom: 16px">人才卡片</div>
            <el-form-item label="" prop="zdx">
              <div class="custom-form_label">
                <header-line
                  :info="{
                    title: '主动性',
                    tips: tipsInfo.zdx,
                    tipsWidth: 416
                  }"
                ></header-line>
              </div>
              <el-radio-group v-model="dataValue.zdx">
                <el-radio
                  v-for="(ops, index) in otherOptions"
                  :key="`zdx_${ops.value}_${index}`"
                  :value="ops.value"
                >
                  {{ ops.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="" prop="gnsw">
              <div class="custom-form_label">
                <header-line
                  :info="{
                    title: '概念思维',
                    tips: tipsInfo.gnsw,
                    tipsWidth: 416
                  }"
                ></header-line>
              </div>
              <el-radio-group v-model="dataValue.gnsw">
                <el-radio
                  v-for="(ops, index) in otherOptions"
                  :key="`zdx_${ops.value}_${index}`"
                  :value="ops.value"
                >
                  {{ ops.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="" prop="yxl">
              <div class="custom-form_label">
                <header-line
                  :info="{
                    title: '影响力',
                    tips: tipsInfo.yxl,
                    tipsWidth: 416
                  }"
                ></header-line>
              </div>
              <el-radio-group v-model="dataValue.yxl">
                <el-radio
                  v-for="(ops, index) in otherOptions"
                  :key="`zdx_${ops.value}_${index}`"
                  :value="ops.value"
                >
                  {{ ops.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="" prop="cjdx">
              <div class="custom-form_label">
                <header-line
                  :info="{
                    title: '成就导向',
                    tips: tipsInfo.cjdx,
                    tipsWidth: 416
                  }"
                ></header-line>
              </div>
              <el-radio-group v-model="dataValue.cjdx">
                <el-radio
                  v-for="(ops, index) in otherOptions"
                  :key="`zdx_${ops.value}_${index}`"
                  :value="ops.value"
                >
                  {{ ops.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="" prop="jrx">
              <div class="custom-form_label">
                <header-line
                  :info="{
                    title: '坚韧性',
                    tips: tipsInfo.jrx,
                    tipsWidth: 416
                  }"
                ></header-line>
              </div>
              <el-radio-group v-model="dataValue.jrx">
                <el-radio
                  v-for="(ops, index) in otherOptions"
                  :key="`zdx_${ops.value}_${index}`"
                  :value="ops.value"
                >
                  {{ ops.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- </el-form> -->
          </el-card>
        </el-form>
      </div>
    </template>
    <template #button>
      <div>
        <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
        <el-button
          v-if="viewType === 'quickEdit' && currentIndex !== 0"
          @click="preView"
          :disabled="loading"
          >上一个</el-button
        >
        <el-button
          v-if="viewType === 'quickEdit' && currentIndex !== list.length - 1"
          type="primary"
          @click="submitForm('1')"
          :disabled="loading"
          >下一个</el-button
        >
        <el-button
          v-if="viewType !== 'quickEdit' || currentIndex === list.length - 1"
          type="primary"
          @click="submitForm('0')"
          :disabled="loading"
          >提交</el-button
        >
      </div>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'MonthAssessmentDetails' }
</script>

<script lang="tsx" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import LineReveal from '@/components/template/table/components/lineReveal.vue'
import HeaderLine from '@/components/template/table/components/headerLine.vue'
import { FromProvideType } from '@/components/template/config/type'
import { DataItem, tipsInfo, otherOptions } from '../config/config'
import { cloneDeep, debounce } from 'lodash-es'
import request from '@/config/axios'

const message = useMessage()

const { onSearch } = inject(`MonthAssessmentForm`) as FromProvideType

const detailsRef = ref<any>(),
  formRef = ref(),
  dataValue = ref<DataItem>({ ...new DataItem() }),
  bukValue = ref<DataItem>({ ...new DataItem() }),
  viewType = ref<string>('view'),
  loading = ref<boolean>(false)

const props = defineProps({
  dicInfo: { type: Array<any>, default: () => [] }
})

const rules = computed(() => {
  const obj: any = {
    nl: [{ required: true, message: '请选择能力', trigger: 'blur' }],
    ql: [{ required: true, message: '请选择潜力', trigger: 'blur' }],
    jzg: [{ required: true, message: '请选择价值观', trigger: 'blur' }],
    tdzjz: [{ required: true, message: '请选择团队中价值', trigger: 'blur' }],
    zdx: [{ required: true, message: '请选择主动性', trigger: 'blur' }],
    gnsw: [{ required: true, message: '请选择概念思维', trigger: 'blur' }],
    yxl: [{ required: true, message: '请选择影响力', trigger: 'blur' }],
    cjdx: [{ required: true, message: '请选择成就导向', trigger: 'blur' }],
    jrx: [{ required: true, message: '请选择坚韧性', trigger: 'blur' }]
  }
  const tar: any = props.dicInfo.find((di: any) => di.value === '1')
  const isRemark: boolean = [
    dataValue.value.ql,
    dataValue.value.nl,
    dataValue.value.jzg,
    dataValue.value.tdzjz
  ].includes(tar.value)
  // const isQl: boolean = dataValue.value.tdzjz === '5'
  // let other = {}
  // if(isQl) {
  //   questionList.value.map((item: any) => {
  //     if(item.required) {
  //       other[item.prop] = [{required: item.required, message: `请选择${item.label}`, trigger: 'blur'}]
  //     }
  //   })
  // }
  return isRemark
    ? { ...obj, remark: [{ required: true, message: '请输入备注', trigger: 'blur' }] }
    : { ...obj }
})

const title = computed(() =>
  viewType.value === 'view'
    ? '详情'
    : `填报${viewType.value === 'quickEdit' ? `(${finishedList.value.length}/${list.value.length})` : ''}`
)

const clearCheck = () => {
  formRef?.value?.validateField('remark')
  if (dataValue.value.tdzjz === '5') {
    dataValue.value.questions = dataValue.value.questions || questionList.value
  } else {
    dataValue.value.questions = null
  }
}

const list = ref<DataItem[]>([])
const currentIndex = ref(0)
const finishedList = computed(() => {
  return list.value.filter((item: any) => item.nl) || []
})
const openDrawer = (item: any = {}, type: string = 'view', directSubs: DataItem[] = []) => {
  detailsRef?.value?.openDrawer(
    async () => {
      if (type === 'quickEdit') {
        currentIndex.value = 0
        list.value = directSubs
        dataValue.value = { ...new DataItem(), ...list.value[currentIndex.value] }
      } else {
        dataValue.value = { ...new DataItem(), ...item }
      }
      if (!dataValue.value.questions) {
        if (dataValue.value.tdzjz === '5') {
          dataValue.value.questions = questionList.value
        }
      } else {
        dataValue.value.questions = JSON.parse(dataValue.value.questions)
        dataValue.value.questions.forEach((item: any) => {
          dataValue.value[item['prop']] = item.value
        })
      }
      bukValue.value = cloneDeep({ ...dataValue.value })
      viewType.value = type
    },
    () => {
      nextTick(() => {
        formRef?.value?.clearValidate()
      })
    }
  )
}

const checkValue = async () => {
  return await formRef?.value?.validate((valid: boolean) => {
    return valid
  })
}

const preView = () => {
  currentIndex.value--
  dataValue.value = { ...list.value[currentIndex.value] }
  if (!dataValue.value.questions) {
    if (dataValue.value.tdzjz === '5') {
      dataValue.value.questions = questionList.value
    }
  } else {
    dataValue.value.questions = JSON.parse(dataValue.value.questions)
    dataValue.value.questions.forEach((item: any) => {
      dataValue.value[item['prop']] = item.value
    })
  }
  bukValue.value = cloneDeep({ ...dataValue.value })
}

const submitForm = async (type: string = '0') => {
  const valid: boolean = await checkValue()
  if (type === '1') {
    // 保存下一个
    if (valid) {
      formRef?.value?.clearValidate()
      // 数据未发生变化
      if (JSON.stringify(dataValue.value) === JSON.stringify(bukValue.value)) {
        ++currentIndex.value
        dataValue.value = { ...list.value[currentIndex.value] }
        if (!dataValue.value.questions) {
          if (dataValue.value.tdzjz === '5') {
            dataValue.value.questions = questionList.value
          }
        } else {
          dataValue.value.questions = JSON.parse(dataValue.value.questions)
          dataValue.value.questions.forEach((item: any) => {
            dataValue.value[item['prop']] = item.value
          })
        }
        bukValue.value = cloneDeep({ ...dataValue.value })
      } else {
        submit(type)
      }
    }
  } else {
    // 提交
    if (valid) {
      // 快速填报&数据未发生变化
      if (
        viewType.value === 'quickEdit' &&
        JSON.stringify(dataValue.value) === JSON.stringify(bukValue.value)
      ) {
        detailsRef?.value?.closed()
        onSearch()
      } else {
        submit(type)
      }
    }
  }
}

const beforeClose = () => {
  if (viewType.value !== 'quickEdit') return
  onSearch()
}

const submit = debounce(async (type: string = '0') => {
  loading.value = true
  const data = { ...dataValue.value }
  if (data.questions && data.questions.length) {
    data.questions[0]['value'] = dataValue.value['ql1']
    data.questions[1]['value'] = dataValue.value['ql2']
    data.questions = JSON.stringify(data.questions)
  }
  request
    .post({ url: `/api/employeeMonthlyAssessment/update`, data })
    .then(() => {
      message.success('操作成功')
      if (type === '1') {
        list.value[currentIndex.value] = dataValue.value
        ++currentIndex.value
        dataValue.value = { ...list.value[currentIndex.value] }
        if (!dataValue.value.questions) {
          if (dataValue.value.tdzjz === '5') {
            dataValue.value.questions = questionList.value
          }
        } else {
          dataValue.value.questions = JSON.parse(dataValue.value.questions)
          dataValue.value.questions.forEach((item: any) => {
            dataValue.value[item['prop']] = item.value
          })
        }
        bukValue.value = cloneDeep({ ...dataValue.value })
      } else {
        detailsRef?.value?.closed()
        onSearch()
      }
    })
    .finally(() => {
      loading.value = false
    })
}, 500)

const questionList = ref([
  {
    label: '问题1：',
    prop: 'ql1',
    value: '',
    desc: '如果这个时候让你再做一次当初聘用的选择,你还会聘用他/她吗?',
    type: 'radio',
    required: true,
    options: [
      { label: '是', value: '1' },
      { label: '否', value: '0' }
    ]
  },
  {
    label: '问题2：',
    prop: 'ql2',
    value: '',
    desc: '如果这个人这时候对说他/她要离职,你非常想挽留他/她吗?',
    type: 'radio',
    required: true,
    options: [
      { label: '是', value: '1' },
      { label: '否', value: '0' }
    ]
  }
])

defineExpose({ openDrawer })

provide('MonthAssessmentDetails', { dataValue, bukValue, viewType, title })
</script>
<style lang="scss" scoped>
.info_card {
  margin: 10px 10px 0 0;
  width: calc(100% - 2px);
  background-color: rgba(244, 246, 250, 0.7);
  &:last-child {
    margin-top: 20px;
  }
  :deep(){
    .el-card__body {
      padding-right: 10px;
    }
    .el-radio-group {
      // width: 100%;
      // justify-content: space-between;
      .el-radio__label {
        min-width: 58px;
      }
    }
  }
}

.custom-form_label {
  width: 120px;
  display: inline-flex;
  justify-content: flex-end;
  position: absolute;
  left: -130px;
  top: 0;
}

:deep(.header_txt) {
  color: #666;
  &::before {
    color: var(--el-color-danger);
    content: '*';
    margin-right: 4px;
  }
}

.user_border {
  width: 100%;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
  background-color: var(--el-disabled-bg-color);
  padding: 4.5px 11px;
}
</style>
