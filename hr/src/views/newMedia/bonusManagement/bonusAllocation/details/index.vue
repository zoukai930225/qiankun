<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2025-12-15 18:19:45
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2025-12-22 18:11:32
-->
<template>
  <scheme-details
    ref="detailsRef"
    name="BonusAllocation"
    class="bonusAllocation"
    :title="title"
    :width="976"
  >
    <template #card>
      <!-- 挂车组表单 -->
      <div v-if="groupType === GroupType.GC || groupType === GroupType.ZN">
        <el-form
          ref="gcFormRef"
          :model="gcDataRulesValue"
          :rules="gcRules"
          label-width="auto"
          inline
          class="bonus-form"
        >
          <div class="card-base-cnt">
            <div class="card-sec-tit">基本信息</div>
            <div class="card-sec-content">
              <el-form-item label="所属模块" prop="module">
                <el-input v-model="moduleName" placeholder="请输入所属模块" disabled />
              </el-form-item>
              <el-form-item label="所属月份" prop="month">
                <el-date-picker
                  v-model="gcDataRulesValue.month"
                  type="month"
                  :disabled="viewType === 'edit'"
                  placeholder="请选择所属月份"
                  value-format="YYYY-MM"
                  format="YYYY-MM"
                  class="w-100%"
                />
              </el-form-item>
              <el-form-item label="所属分组" prop="groupId">
                <el-select
                  v-model="gcDataRulesValue.groupId"
                  placeholder="请选择所属分组"
                  :disabled="viewType === 'edit'"
                >
                  <el-option
                    v-for="item in groupOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="card-main-cnt">
            <div class="card-sec-tit main-sec-tit-btn"
              ><span>GMV配置</span>
              <div class="add-row-btn">
                <el-button type="primary" @click="addRow">新增</el-button>
              </div>
            </div>
            <div class="card-sec-main">
              <el-table :data="gcDataRulesValue.list" border class="bonus-config-table">
                <el-table-column type="index" width="65" label="序号" fixed="left" align="center">
                  <template #default="scope">
                    <line-txt :txt="`${scope.$index + 1}`" class="line-text" />
                  </template>
                </el-table-column>
                <el-table-column label="*单条GMV（元）" prop="gmv" min-width="200">
                  <template #header>
                    <span class="required-icon">*</span><span>单条GMV（元）</span>
                  </template>
                  <template #default="{ row, $index }">
                    <div class="gmv-range-container">
                      <div class="gmv-range-inputs">
                        <el-form-item
                          :prop="`list.${$index}.gmvRangeStart`"
                          class="table-form-item range-form-item"
                        >
                          <el-input
                            v-model="row.gmvRangeStart"
                            placeholder="请输入起始值"
                            size="small"
                            class="range-input"
                            @blur="handleRangeInputChange($index, 'gmvRangeStart')"
                          />
                        </el-form-item>
                        <span class="range-separator">—</span>
                        <el-form-item
                          :prop="`list.${$index}.gmvRangeEnd`"
                          class="table-form-item range-form-item"
                        >
                          <el-input
                            v-model="row.gmvRangeEnd"
                            placeholder="请输入结束值"
                            size="small"
                            class="range-input"
                            @blur="handleRangeInputChange($index, 'gmvRangeEnd')"
                          />
                        </el-form-item>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="*奖金档位（元）" align="center" width="140">
                  <template #header>
                    <span class="required-icon">*</span><span>奖金档位（元）</span>
                  </template>
                  <template #default="{ row, $index }">
                    <el-form-item :prop="`list.${$index}.bonusLevel`" class="table-form-item">
                      <el-input v-model="row.bonusLevel" placeholder="请输入" size="small" />
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column label="*剪辑占比（%）" align="center" width="140">
                  <template #header>
                    <span class="required-icon">*</span><span>剪辑占比（%）</span>
                  </template>
                  <template #default="{ row, $index }">
                    <el-form-item :prop="`list.${$index}.editRatio`" class="table-form-item">
                      <el-input
                        v-model="row.editRatio"
                        placeholder="请输入"
                        size="small"
                        @input="handleRatioChange(row, $index, 'editRatio', 'directorRatio')"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column label="*编导占比（%）" align="center" width="140">
                  <template #header>
                    <span class="required-icon">*</span><span>编导占比（%）</span>
                  </template>
                  <template #default="{ row, $index }">
                    <el-form-item :prop="`list.${$index}.directorRatio`" class="table-form-item">
                      <el-input
                        v-model="row.directorRatio"
                        placeholder="请输入"
                        size="small"
                        @input="handleRatioChange(row, $index, 'directorRatio', 'editRatio')"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column label="操作" align="center" width="100">
                  <template #default="{ $index }">
                    <el-button
                      type="danger"
                      text
                      @click="gcDataRulesValue.list.splice($index, 1)"
                      :disabled="gcDataRulesValue.list.length <= 1 && viewType !== 'edit'"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table></div
            >
          </div>
        </el-form>
      </div>

      <!-- 千川组表单 -->
      <div v-else>
        <el-form
          ref="qcFormRef"
          :model="qcDataRulesValue"
          :rules="qcRules"
          inline
          label-width="auto"
          class="bonus-form"
        >
          <div class="card-base-cnt">
            <div class="card-sec-tit">基本信息</div>
            <div class="card-sec-content card-sec-content-gc">
              <el-form-item label="所属模块" prop="module">
                <el-input v-model="moduleName" placeholder="请输入所属模块" disabled />
              </el-form-item>
              <el-form-item label="所属月份" prop="month">
                <el-date-picker
                  @change="getSettingRules(qcDataRulesValue.month)"
                  v-model="qcDataRulesValue.month"
                  :disabled="viewType === 'edit'"
                  type="month"
                  placeholder="请选择所属月份"
                  value-format="YYYY-MM"
                  format="YYYY-MM"
                  class="w-100%"
                />
              </el-form-item>
              <el-form-item label="所属分组" prop="groupId">
                <el-select
                  v-model="qcDataRulesValue.groupId"
                  placeholder="请选择所属分组"
                  :disabled="viewType === 'edit'"
                >
                  <el-option
                    v-for="item in groupOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="所属项目" prop="owningProjectId">
                <el-select
                  v-model="qcDataRulesValue.owningProjectId"
                  :disabled="viewType === 'edit'"
                  placeholder="请选择所属项目"
                >
                  <el-option
                    v-for="item in projectOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="消耗总量(元)" prop="consumptionTotal">
                <el-input
                  v-model="qcDataRulesValue.consumptionTotal"
                  placeholder="请输入消耗总量"
                  type="text"
                  @input="handleDecimalInput($event, 'consumptionTotal', 'qcDataRulesValue')"
                />
              </el-form-item>
              <el-form-item label="消耗提点" prop="consumptionPoint">
                <el-input
                  v-model="qcDataRulesValue.consumptionPoint"
                  type="text"
                  placeholder="请输入消耗提点"
                  @input="handleDecimalInput($event, 'consumptionPoint', 'qcDataRulesValue')"
                />
              </el-form-item>
              <el-form-item label="roi系数" prop="roiCoefficient">
                <el-input
                  v-model="qcDataRulesValue.roiCoefficient"
                  type="text"
                  placeholder="请输入roi系数"
                  @input="handleDecimalInput($event, 'roiCoefficient', 'qcDataRulesValue')"
                />
              </el-form-item>
              <el-form-item label="总奖金包(元)" prop="totalBonusPackage">
                <el-input v-model="qcDataRulesValue.totalBonusPackage" disabled />
              </el-form-item>
              <el-form-item label="剪辑第一名比例" prop="clipFirstPlaceRatio">
                <el-input-number
                  style="width: 100%;"
                  align="left"
                  v-model="qcDataRulesValue.clipFirstPlaceRatio"
                  :controls="false"
                  :value-on-clear="null"
                  placeholder="请输入剪辑第一名比例"
                  @input="handleClipRatioChange('clipFirstPlaceRatio')"
                >
                <template #suffix>
                  <span>%</span>
                </template>
                </el-input-number>
              </el-form-item>
              <el-form-item label="剪辑第二名比例" prop="clipSecondPlaceRatio">
                <el-input-number
                  style="width: 100%;"
                  align="left"
                  v-model="qcDataRulesValue.clipSecondPlaceRatio"
                  :controls="false"
                  :value-on-clear="null"
                  placeholder="请输入剪辑第二名比例"
                  @input="handleClipRatioChange('clipSecondPlaceRatio')"
                >
                <template #suffix>
                  <span>%</span>
                </template>
                </el-input-number>
              </el-form-item>
              <el-form-item label="剪辑第三名比例" prop="clipThirdPlaceRatio">
                <el-input-number
                  style="width: 100%;"
                  align="left"
                  v-model="qcDataRulesValue.clipThirdPlaceRatio"
                  :controls="false"
                  :value-on-clear="null"
                  placeholder="请输入剪辑第三名比例"
                  @input="handleClipRatioChange('clipThirdPlaceRatio')"
                >
                <template #suffix>
                  <span>%</span>
                </template>
                </el-input-number>
              </el-form-item>
            </div>
          </div>
          <div class="card-main-cnt">
            <div class="card-sec-tit main-sec-tit-btn"
              ><span>消耗配置</span>
              <div class="add-row-btn">
                <el-button type="primary" @click="addRow">新增</el-button>
              </div>
            </div>
            <div class="card-sec-main">
              <el-table :data="qcDataRulesValue.list" border class="bonus-config-table">
                <el-table-column label="*单条消耗（元）" prop="consumptionRange" min-width="200">
                  <template #header>
                    <span class="required-icon">*</span><span>单条消耗（元）</span>
                  </template>
                  <template #default="{ row, $index }">
                    <div class="gmv-range-container">
                      <div class="gmv-range-inputs">
                        <el-form-item
                          :prop="`list.${$index}.consumptionRangeStart`"
                          class="table-form-item range-form-item"
                        >
                          <el-input
                            v-model="row.consumptionRangeStart"
                            placeholder="请输入起始值"
                            :disabled="
                              (settingRules.length > 0 || viewType === 'edit') && !row.addFlag
                            "
                            size="small"
                            class="range-input"
                            @blur="handleRangeInputChange($index, 'consumptionRangeStart')"
                          />
                        </el-form-item>
                        <span class="range-separator">—</span>
                        <el-form-item
                          :prop="`list.${$index}.consumptionRangeEnd`"
                          class="table-form-item range-form-item"
                        >
                          <el-input
                            v-model="row.consumptionRangeEnd"
                            placeholder="请输入结束值"
                            :disabled="
                              (settingRules.length > 0 || viewType === 'edit') && !row.addFlag
                            "
                            size="small"
                            class="range-input"
                            @blur="handleRangeInputChange($index, 'consumptionRangeEnd')"
                          />
                        </el-form-item>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="*对应分数（分）" align="center" width="140">
                  <template #header>
                    <span class="required-icon">*</span><span>对应分数（分）</span>
                  </template>
                  <template #default="{ row, $index }">
                    <el-form-item :prop="`list.${$index}.score`" class="table-form-item">
                      <el-input
                        v-model="row.score"
                        placeholder="请输入"
                        size="small"
                        :disabled="(settingRules.length > 0 || viewType === 'edit') && !row.addFlag"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="*剪辑占比（%）" align="center" width="140">
                  <template #header>
                    <span class="required-icon">*</span><span>剪辑占比（%）</span>
                  </template>
                  <template #default="{ row, $index }">
                    <el-form-item :prop="`list.${$index}.editor`" class="table-form-item">
                      <el-input
                        v-model="row.editor"
                        placeholder="请输入"
                        size="small"
                        @input="handleRatioChange(row, $index, 'editor', 'director')"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column align="center" width="140">
                  <template #header>
                    <span class="required-icon">*</span><span>编导占比（%）</span>
                  </template>
                  <template #default="{ row, $index }">
                    <el-form-item :prop="`list.${$index}.director`" class="table-form-item">
                      <el-input
                        v-model="row.director"
                        placeholder="请输入"
                        size="small"
                        @input="handleRatioChange(row, $index, 'director', 'editor')"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="100">
                  <template #default="{ $index }">
                    <el-button
                      type="danger"
                      text
                      @click="qcDataRulesValue.list.splice($index, 1)"
                      :disabled="qcDataRulesValue.list.length <= 1 && viewType !== 'edit'"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form>
      </div>
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="submitForm" :disabled="loading">提交</el-button>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'BonusAllocationDetails' }
</script>

<script lang="tsx" setup>
import { FromProvideType } from '@/components/template/config/type'
import { cloneDeep, debounce } from 'lodash-es'
import { GroupType } from '../page/config'
import { GcDataRules, QcDataRules } from './config'
import request from '@/config/axios'
import type { FormInstance, FormRules } from 'element-plus'
import dayjs from 'dayjs'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

const props = defineProps<{
  groupType: GroupType
}>()

const message = useMessage()

const { onSearch, groupOptions, searchData } = inject(`BonusAllocationForm`) as FromProvideType & {
  groupOptions: Ref<any[]>
  searchData: Ref<any>
}

const detailsRef = ref<any>()
const gcFormRef = ref<FormInstance>()
const qcFormRef = ref<FormInstance>()
const gcDataRulesValue = ref<GcDataRules>({ ...new GcDataRules() })
const qcDataRulesValue = ref<QcDataRules>({ ...new QcDataRules() })
const bukGcRulesValue = ref<GcDataRules>({ ...new GcDataRules() })
const bukQcRulesValue = ref<QcDataRules>({ ...new QcDataRules() })
const viewType = ref<string>('add')
const loading = ref<boolean>(false)
const projectOptions = ref<any[]>([])
const settingRules = ref<any[]>([])
const moduleName = computed(() => {
  return props.groupType === GroupType.GC
    ? '挂车组'
    : props.groupType === GroupType.ZN
      ? '站内组'
      : '千川组'
})
const title = computed(() => {
  if (viewType.value === 'add') return `新增${moduleName.value}配置`
  if (viewType.value === 'edit') return `编辑${moduleName.value}配置`
  return `${moduleName.value}配置详情`
})
watch(
  () => [qcDataRulesValue.value.consumptionTotal, qcDataRulesValue.value.consumptionPoint, qcDataRulesValue.value.roiCoefficient],
  ([consumptionTotal, consumptionPoint, roiCoefficient]) => {
    console.log(consumptionTotal, consumptionPoint, roiCoefficient)
    if (Number(consumptionTotal) && Number(consumptionPoint) && Number(roiCoefficient)) {
      qcDataRulesValue.value.totalBonusPackage = (
        Number(consumptionTotal) * Number(consumptionPoint) * Number(roiCoefficient)
      ).toFixed(4)
    } else {
      if (consumptionTotal == '0' && consumptionPoint == '0') {
        qcDataRulesValue.value.totalBonusPackage = '0'
      } else {
        qcDataRulesValue.value.totalBonusPackage = ''
      }
    }
  },
  { immediate: true }
)
// 验证起始值小于结束值
const validateRange = (rule: any, _value: any, callback: any) => {
  // 从 rule.field 中提取索引，格式为 "list.0.gmvRangeStart"
  const match = rule.field.match(/list\.(\d+)\./)
  const index = match ? parseInt(match[1]) : 0

  const { row, start, end, prevRowEnd } = (() => {
    if (props.groupType === GroupType.GC || props.groupType === GroupType.ZN) {
      const row = gcDataRulesValue.value.list[index]
      return {
        row,
        start: Number(row?.gmvRangeStart),
        end: Number(row?.gmvRangeEnd),
        prevRowEnd: Number(gcDataRulesValue.value.list[index - 1]?.gmvRangeEnd)
      }
    } else {
      const row = qcDataRulesValue.value.list[index]
      return {
        row,
        start: Number(row?.consumptionRangeStart),
        end: Number(row?.consumptionRangeEnd),
        prevRowEnd: Number(qcDataRulesValue.value.list[index - 1]?.consumptionRangeEnd)
      }
    }
  })()

  if (!row) {
    return callback()
  }

  if (isNaN(start) || isNaN(end)) {
    return callback(new Error('请输入有效的数字'))
  }

  if (start <= 0) {
    return callback(new Error('起始值必须大于0'))
  }

  if (end <= 0) {
    return callback(new Error('结束值必须大于0'))
  }

  if (start >= end) {
    return callback(new Error('起始值必须小于结束值'))
  }

  // 检查是否与上一行的结束值重叠
  if (index > 0) {
    if (Number(prevRowEnd) >= Number(start)) {
      return callback(new Error('起始值必须大于上一行的结束值'))
    }
  }

  callback()
}

// 验证奖金档位/分数
const validateBonusLevelOrScore = (_rule: any, value: any, callback: any) => {
  if (value === '' || value === null || value === undefined) {
    return callback(
      new Error(
        `请输入${props.groupType === GroupType.GC || props.groupType === GroupType.ZN ? '奖金档位' : '分数'}`
      )
    )
  }
  const num = Number(value)
  if (isNaN(num) || num <= 0) {
    return callback(
      new Error(
        `请输入有效的${props.groupType === GroupType.GC || props.groupType === GroupType.ZN ? '奖金档位' : '分数'}`
      )
    )
  }
  callback()
}

// 验证占比
const validateRatio = (rule: any, value: any, callback: any) => {
  // 从 rule.field 中提取索引，格式为 "list.0.editRatio"
  const match = rule.field.match(/list\.(\d+)\./)
  const index = match ? parseInt(match[1]) : 0
  const isEdit = rule.field.includes('edit')

  const { row, total } = (() => {
    if (props.groupType === GroupType.GC || props.groupType === GroupType.ZN) {
      const row = gcDataRulesValue.value.list[index]
      return {
        row,
        total: Number(row?.editRatio || 0) + Number(row?.directorRatio || 0)
      }
    } else {
      const row = qcDataRulesValue.value.list[index]
      return {
        row,
        total: Number(row?.editor || 0) + Number(row?.director || 0)
      }
    }
  })()

  if (!row) {
    return callback()
  }

  if (value === '' || value === null || value === undefined) {
    return callback(new Error(`请输入${isEdit ? '剪辑' : '编导'}占比`))
  }

  const num = Number(value)
  if (isNaN(num) || num < 0 || num > 100) {
    return callback(new Error('占比必须在0-100之间'))
  }

  if (total !== 100) {
    return callback(new Error('剪辑和编导占比之和必须等于100%'))
  }

  callback()
}

// 挂车组表单验证规则（动态生成）
const gcRules = computed(() => {
  const rules: FormRules = {
    groupId: [{ required: true, message: '请选择所属分组', trigger: 'change' }]
  }
  // 为每一行动态添加验证规则
  gcDataRulesValue.value.list.forEach((_item, index) => {
    rules[`list.${index}.gmvRangeStart`] = [
      { required: true, validator: validateRange, trigger: 'blur' }
    ]
    rules[`list.${index}.gmvRangeEnd`] = [
      { required: true, validator: validateRange, trigger: 'blur' }
    ]
    rules[`list.${index}.bonusLevel`] = [
      { required: true, validator: validateBonusLevelOrScore, trigger: 'blur' }
    ]
    rules[`list.${index}.editRatio`] = [
      { required: true, validator: validateRatio, trigger: 'blur' }
    ]
    rules[`list.${index}.directorRatio`] = [
      { required: true, validator: validateRatio, trigger: 'blur' }
    ]
  })

  return rules
})

// 变更剪辑比例时，显式触发联动校验
const handleClipRatioChange = (_field: 'clipFirstPlaceRatio' | 'clipSecondPlaceRatio' | 'clipThirdPlaceRatio') => {
  nextTick(() => {
    qcFormRef?.value?.validateField?.(['clipFirstPlaceRatio', 'clipSecondPlaceRatio', 'clipThirdPlaceRatio'])
  })
}
//
// 验证剪辑占比
const validateClipRatio = (rule: any, value: any, callback: any) => {
  // 允许空值（因为可能还没输入完）
  if (value === null || value === undefined || value === '') {
    return callback()
  }
  
  const num = Number(value)
  if (isNaN(num) || num < 0 || num > 100) {
    return callback(new Error('占比必须在0-100之间'))
  }
  
  // 获取所有剪辑比例值
  const first = Number(qcDataRulesValue.value.clipFirstPlaceRatio) || 0
  const second = Number(qcDataRulesValue.value.clipSecondPlaceRatio) || 0
  const third = Number(qcDataRulesValue.value.clipThirdPlaceRatio) || 0
  
  // 只验证所有值都有输入时的情况
  const allFilled = 
    qcDataRulesValue.value.clipFirstPlaceRatio !== null &&
    qcDataRulesValue.value.clipSecondPlaceRatio !== null &&
    qcDataRulesValue.value.clipThirdPlaceRatio !== null
  
  if (allFilled && Math.abs(first + second + third - 100) > 0.0001) {
    return callback(new Error('剪辑占比之和必须等于100%'))
  }
  
  callback()
}

// 验证ROI系数
const validateRoiCoefficient = (rule: any, value: any, callback: any) => {
  const num = Number(value)
  if (isNaN(num) || num <= 0) {
    return callback(new Error('ROI系数必须大于0'))
  }
  callback()
}

// 千川组表单验证规则
const qcRules = computed(() => {
  const rules: FormRules = {
    groupId: [{ required: true, message: '请选择所属分组', trigger: 'change' }],
    owningProjectId: [{ required: true, message: '请选择所属项目', trigger: 'change' }],
    roiCoefficient: [{ required: false, validator: validateRoiCoefficient, trigger: ['blur', 'change'] }],
    clipFirstPlaceRatio: [{ required: false, validator: validateClipRatio, trigger: 'change' }],
    clipSecondPlaceRatio: [{ required: false, validator: validateClipRatio, trigger: 'change' }],
    clipThirdPlaceRatio: [{ required: false, validator: validateClipRatio, trigger: 'change' }],
    // consumptionTotal: [{ required: true, message: '请输入消耗总量', trigger: 'blur' }],
    // consumptionPoint: [{ required: true, message: '请输入消耗提点', trigger: 'blur' }]
  }
  qcDataRulesValue.value.list.forEach((_item, index) => {
    rules[`list.${index}.consumptionRangeStart`] = [
      { required: true, validator: validateRange, trigger: 'blur' }
    ]
    rules[`list.${index}.consumptionRangeEnd`] = [
      { required: true, validator: validateRange, trigger: 'blur' }
    ]
    rules[`list.${index}.score`] = [
      { required: true, validator: validateBonusLevelOrScore, trigger: 'blur' }
    ]
    rules[`list.${index}.editor`] = [{ required: true, validator: validateRatio, trigger: 'blur' }]
    rules[`list.${index}.director`] = [
      { required: true, validator: validateRatio, trigger: 'blur' }
    ]
  })
  return rules
})

const getProjectOptions = async () => {
  const res = await getIntDictOptions(DICT_TYPE.CONTENT_BONUS_CALCULATION_PROJECT, true)
  projectOptions.value = res
}
const getSettingRules = async (month: string) => {
  const res = await request.get({
    url: `/api/nmQcBonusConfig/integral`,
    params: {
      month: month || searchData.value.month || ''
    }
  })
  settingRules.value = res || []
  settingRules.value.length > 0
    ? (qcDataRulesValue.value.list = settingRules.value.map((item: any) => ({
        consumptionRangeStart: item.expenditureSingleStart,
        consumptionRangeEnd: item.expenditureSingleEnd,
        score: item.score,
        editor: item.editorProportion,
        director: item.directorProportion
      })))
    : (qcDataRulesValue.value.list = [
        {
          consumptionRangeStart: 10000,
          consumptionRangeEnd: 20000,
          score: 1,
          editor: 50,
          director: 50
        }
      ])
}
// 弹出通用
const openView = (item: any = {}, type: string = 'add') => {
  detailsRef?.value?.openDrawer(
    async () => {
      viewType.value = type
      if (props.groupType === GroupType.GC || props.groupType === GroupType.ZN) {
        // 如果是编辑，使用传入的item数据，否则初始化一条空数据
        if (type === 'edit') {
          const res = await request.post({
            url: `/api/nmTrailerBonusConfig/editInfo`,
            data: { groupId: item.groupId, month: item.month }
          })
          gcDataRulesValue.value = {
            groupId: res.groupId || '',
            month: item.month || '',
            list: res.configInfoList.map((item: any) => ({
              id: item.id,
              gmvRangeStart: item.gmvStart,
              gmvRangeEnd: item.gmvEnd,
              bonusLevel: item.bonus,
              editRatio: Number(item.editorProportion),
              directorRatio: Number(item.directorProportion)
            }))
          }
        } else {
          gcDataRulesValue.value = {
            groupId: groupOptions.value[0].value || '',
            month: dayjs().format('YYYY-MM') || '',
            list: [
              {
                gmvRangeStart: 10000,
                gmvRangeEnd: 20000,
                bonusLevel: 500,
                editRatio: 50,
                directorRatio: 50
              }
            ]
          }
        }
        bukGcRulesValue.value = cloneDeep(gcDataRulesValue.value)
      } else {
        // 千川组的处理
        await getProjectOptions()
        if (type === 'edit') {
          const res = await request.post({
            url: `/api/nmQcBonusConfig/editInfo`,
            data: {
              groupId: item.groupId,
              month: item.month,
              owningProjectId: item.owningProjectId
            }
          })
          qcDataRulesValue.value = {
            groupId: res.groupId || '',
            month: item.month || '',
            owningProjectId: res.owningProjectId || '',
            consumptionTotal: res.expenditureTotal,
            consumptionPoint: res.expenditurePoint,
            totalBonusPackage: res.bonusTotal,
            roiCoefficient: res.roiCoefficient,
            clipFirstPlaceRatio: res.clipFirstPlaceRatio,
            clipSecondPlaceRatio: res.clipSecondPlaceRatio,
            clipThirdPlaceRatio: res.clipThirdPlaceRatio,
            list: res.configInfoList.map((item: any) => ({
              id: item.id,
              consumptionRangeStart: item.expenditureSingleStart,
              consumptionRangeEnd: item.expenditureSingleEnd,
              score: item.score,
              editor: item.editorProportion,
              director: item.directorProportion
            }))
          }
          bukQcRulesValue.value = cloneDeep(qcDataRulesValue.value)
        } else {
          await getSettingRules(searchData.value.month)
          qcDataRulesValue.value = {
            groupId: groupOptions.value[0].value || '',
            month: searchData.value.month || '',
            owningProjectId: projectOptions.value[0].value || '',
            consumptionTotal: '',
            consumptionPoint: '',
            totalBonusPackage: '',
            roiCoefficient: 1,
            clipFirstPlaceRatio: null,
            clipSecondPlaceRatio: null,
            clipThirdPlaceRatio: null,
            list: qcDataRulesValue.value.list
          }
        }
      }
    },
    () => {
      nextTick(() => {
        gcFormRef?.value?.clearValidate()
        qcFormRef?.value?.clearValidate()
      })
    }
  )
}

// 通用表单校验
const checkValue = async () => {
  try {
    if (props.groupType === GroupType.GC || props.groupType === GroupType.ZN) {
      await gcFormRef?.value?.validate()
      return true
    } else {
      await qcFormRef?.value?.validate()
      return true
    }
  } catch (error) {
    return false
  }
}

// 提交
const submitForm = async () => {
  const valid = await checkValue()
  if (valid) {
    submit()
  }
}

// 实际提交（防抖）
const submit = debounce(async () => {
  loading.value = true

  try {
    const isGc = props.groupType === GroupType.GC || props.groupType === GroupType.ZN
    const baseData = isGc ? cloneDeep(gcDataRulesValue.value) : cloneDeep(qcDataRulesValue.value)
    const groupName = groupOptions.value.find((item: any) => item.value === baseData.groupId)?.label

    // 根据不同组类型构造提交数据
    const submitData = isGc
      ? {
          // 挂车组/站内组
          groupId: baseData.groupId,
          groupName,
          month: baseData.month,
          configInfoList: baseData.list.map((item: any) => ({
            ...(item.id && { id: item.id }),
            gmvStart: Number(item.gmvRangeStart),
            gmvEnd: Number(item.gmvRangeEnd),
            bonus: Number(item.bonusLevel),
            editorProportion: Number(item.editRatio),
            directorProportion: Number(item.directorRatio)
          }))
        }
      : {
          // 千川组
          groupId: baseData.groupId,
          groupName,
          month: baseData.month,
          owningProjectId: (baseData as QcDataRules).owningProjectId,
          owningProject: projectOptions.value.find(
            (item: any) => item.value === (baseData as QcDataRules).owningProjectId
          )?.label,
          expenditureTotal: (baseData as QcDataRules).consumptionTotal || '',
          expenditurePoint: (baseData as QcDataRules).consumptionPoint || '',
          roiCoefficient: (baseData as QcDataRules).roiCoefficient || '',
          clipFirstPlaceRatio: (baseData as QcDataRules).clipFirstPlaceRatio || '',
          clipSecondPlaceRatio: (baseData as QcDataRules).clipSecondPlaceRatio || '',
          clipThirdPlaceRatio: (baseData as QcDataRules).clipThirdPlaceRatio || '',
          bonusTotal: (baseData as QcDataRules).totalBonusPackage || '',
          configInfoList: baseData.list.map((item: any) => ({
            ...(item.id && { id: item.id }),
            expenditureSingleStart: Number(item.consumptionRangeStart),
            expenditureSingleEnd: Number(item.consumptionRangeEnd),
            score: Number(item.score),
            editorProportion: Number(item.editor),
            directorProportion: Number(item.director)
          }))
        }
    const url = () => {
      if (isGc) {
        return viewType.value === 'add'
          ? `/api/nmTrailerBonusConfig/insert`
          : `/api/nmTrailerBonusConfig/editSubmit`
      } else {
        return viewType.value === 'add'
          ? `/api/nmQcBonusConfig/insert`
          : `/api/nmQcBonusConfig/editSubmit`
      }
    }
    await request.post({ url: url(), data: submitData })

    message.success('操作成功')
    detailsRef?.value?.closed()
    onSearch()
  } catch (error: any) {
    message.error(error?.msg || '操作失败')
    console.error('提交失败:', error)
  } finally {
    loading.value = false
  }
}, 500)

// 根据groupType动态提供dataValue和bukValue
const dataValue = computed(() => {
  return props.groupType === GroupType.GC || props.groupType === GroupType.ZN
    ? gcDataRulesValue.value
    : qcDataRulesValue.value
})

const bukValue = computed(() => {
  return props.groupType === GroupType.GC || props.groupType === GroupType.ZN
    ? bukGcRulesValue.value
    : bukQcRulesValue.value
})

// 范围输入变化时触发校验
const handleRangeInputChange = (index: number, field: string) => {
  nextTick(() => {
    const formRef =
      props.groupType === GroupType.GC || props.groupType === GroupType.ZN ? gcFormRef : qcFormRef

    const isGc = props.groupType === GroupType.GC || props.groupType === GroupType.ZN
    const startField = isGc ? 'gmvRangeStart' : 'consumptionRangeStart'
    const endField = isGc ? 'gmvRangeEnd' : 'consumptionRangeEnd'
    const list = isGc ? gcDataRulesValue.value.list : qcDataRulesValue.value.list

    // 触发当前行起始值和结束值的校验
    formRef?.value?.validateField([`list.${index}.${startField}`, `list.${index}.${endField}`])

    // 如果修改的是结束值，还需要触发下一行起始值的校验（因为下一行起始值必须大于当前行结束值）
    if (field === endField && index < list.length - 1) {
      formRef?.value?.validateField([`list.${index + 1}.${startField}`])
    }

    // 如果修改的是起始值且不是第一行，需要触发上一行结束值的校验
    if (field === startField && index > 0) {
      formRef?.value?.validateField([`list.${index - 1}.${endField}`])
    }
  })
}

// 剪辑占比变化时自动计算编导占比
const handleRatioChange = (row: any, index: number, curField: string, editField: string) => {
  const curRatio = Number(row[curField])
  if (!isNaN(curRatio) && curRatio >= 0 && curRatio <= 100) {
    row[editField] = 100 - curRatio
    // 清除该行的验证错误
    nextTick(() => {
      const formRef =
        props.groupType === GroupType.GC || props.groupType === GroupType.ZN ? gcFormRef : qcFormRef
      formRef?.value?.clearValidate([`list.${index}.${curField}`, `list.${index}.${editField}`])
    })
  }
}

// 限制小数位数的输入处理
const handleDecimalInput = (value: string, field: string, dataKey: string) => {
  // 只允许数字和小数点
  let newValue = value.replace(/[^\d.]/g, '')

  // 只保留第一个小数点
  const parts = newValue.split('.')
  if (parts.length > 2) {
    newValue = parts[0] + '.' + parts.slice(1).join('')
  }

  // 限制小数点后最多两位
  if (parts.length === 2 && parts[1].length > 2) {
    newValue = parts[0] + '.' + parts[1].substring(0, 4)
  }

  // 更新对应的值
  if (dataKey === 'qcDataRulesValue') {
    qcDataRulesValue.value[field] = newValue
  } else if (dataKey === 'gcDataRulesValue') {
    gcDataRulesValue.value[field] = newValue
  }
}

// 添加新行
const addRow = () => {
  if (props.groupType === GroupType.GC || props.groupType === GroupType.ZN) {
    const { gmvRangeEnd = 0, bonusLevel = 0 } =
      gcDataRulesValue.value.list[gcDataRulesValue.value.list.length - 1] || {}
    gcDataRulesValue.value.list.push({
      gmvRangeStart: Number(gmvRangeEnd) + 1,
      gmvRangeEnd: Number(gmvRangeEnd) + 10000,
      bonusLevel: Number(bonusLevel) + 500,
      editRatio: 50,
      directorRatio: 50,
      addFlag: true
    })
  } else {
    const { consumptionRangeEnd = 0, score = 0 } =
      qcDataRulesValue.value.list[qcDataRulesValue.value.list.length - 1] || {}
    qcDataRulesValue.value.list.push({
      consumptionRangeStart: Number(consumptionRangeEnd) + 1,
      consumptionRangeEnd: Number(consumptionRangeEnd) + 10000,
      score: Number(score) + 1,
      editor: 50,
      director: 50,
      addFlag: true
    })
  }
}

defineExpose({ openView })

provide('BonusAllocationDetails', {
  dataValue,
  bukValue,
  viewType,
  title
})

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
