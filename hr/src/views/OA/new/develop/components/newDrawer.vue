<template>
  <div>
    <el-drawer v-model="isVisible" :with-header="false" :size="918" @close="reset">
      <div class="drawer-wapper">
        <div class="content-wapper">
          <div class="flex-row title-wapper">
            <div class="title">企划信息</div>
            <img src="@/assets/imgs/system/fieldManageConfig/close.png" class="close" @click="reset" />
          </div>
          <ContentWrap>
            <div class="form-wapper">
              <div class="flex-row header-wapper">
                <span class="icon"></span>
                <span>基本信息</span>
              </div>

              <el-form :inline="true" :model="formInline" ref="formRef" style="width: calc(100% + 30px)">
                <div class="flex-row form-wapper">
                  <div style="flex-wrap: wrap; flex: 1" class="flex-row">
                    <div v-for="(field, index) in newFields()" :key="index">
                      <el-form-item v-if="isShowField(field)" :label="field.name ? `${field.name}` : ''"
                        label-width="78px" :required="field.required == 1 && field.type != 6" :prop="field.code"
                        :rules="getRules(field)"
                        :style="{ width: field.code === 'planningTime' ? `` : `${itemWidth}px` }">
                        <template #label v-if="field.code === 'salesTargetQuarter'">
                          <span style="color: #EA0000;">{{ field.name }}</span>
                        </template>
                        <!-- 店铺 -->
                        <StoreRangePlus v-if="field.type === 9" :style="{ width: `${inputWidth}px` }"
                          v-model="formInline[field.code]" :showAllChannels="true" :placeholder="field.placeholder"
                          :width="inputWidth" :disabled="isAduit" />

                        <!-- 企划时间 -->
                        <div v-if="field.code === 'planningTime'" :style="{ width: `${itemWidthDouble}px` }"
                          class="planningTimeDatePicker">
                          <el-date-picker :style="{ width: `${itemWidthDouble - 10}px` }"
                            v-model="formInline[field.code]" type="daterange" range-separator="-"
                            start-placeholder="开始日期" end-placeholder="结束日期" :disabled="isAduit" />
                        </div>

                        <!-- 运营负责人 -->
                        <div v-if="field.code === 'operateManageId'">
                          <SWSelectPeople :placeholder="'请选择运营负责人'" :style="{ width: `${inputWidth}px` }"
                            :isEdit="!isAduit" :multiple="true" v-model:modelValue="formInline.operateManageId" />
                        </div>

                        <!-- 计划上架月份-->
                        <el-date-picker v-if="field.code === 'planListDate' && !isAduit"
                          v-model="formInline[field.code]" type="date" :style="{ width: `${inputWidth}px` }"
                          :value-format="'YYYY-MM-DD'" placeholder="请选择计划上架日期" />

                        <el-input v-if="field.code === 'planListDate' && isAduit" prefix-icon="Calendar"
                          v-model="(formInline as any).planListDate" disabled :style="{ width: `${inputWidth}px` }" />

                        <s-text-area v-if="field.code === 'remark'" v-model="formInline[field.code]"
                          :placeholder="field.placeholder" style="width: 700px" :autosize="{ minRows: 3, maxRows: 3 }"
                          :disabled="isAduit" />

                        <!-- <el-select
                          v-if="field.code === 'oldGoodsNo'"
                          v-model="formInline[field.code]"
                          :placeholder="field.placeholder"
                          :style="{ width: `${inputWidth}px` }"
                          filterable
                          :disabled="isAduit"
                        >
                          <el-option
                            v-for="(dict, index) in oldGoodsNoList"
                            :key="index"
                            :label="dict.label"
                            :value="dict.value"
                          />
                        </el-select> -->

                        <div :style="{ width: `${inputWidth}px` }" v-if="field.code === 'oldGoodsNo'">
                          <scroll-select ref="goodsNoScrollSelectRef" v-model="formInline[field.code]"
                            :api="getUnboundGoodsApi" item-label-key="goodsNo" item-value-key="goodsNo"
                            select-key="goodsNo" :multiple="false" :placeholder="field.placeholder"
                            :disabled="isAduit" />
                        </div>

                        <el-radio-group v-if="field.code === 'isCreateGoodsNo'" v-model="formInline.isCreateGoodsNo"
                          :disabled="isAduit">
                          <el-radio :value="1">是</el-radio>
                          <el-radio :value="0">否</el-radio>
                        </el-radio-group>

                        <div v-if="field.code === 'empytLayout'" :style="{ width: `${inputWidth}px` }"></div>
                        <component v-if="
                          ![
                            'operateManageId',
                            'remark',
                            'planListDate',
                            'empytLayout',
                            'oldGoodsNo',
                            'isCreateGoodsNo',
                            'competitionLink'
                          ].includes(field.code)
                        " :style="{ width: `${inputWidth}px` }" :is="componentMap[field.type]"
                          v-model="formInline[field.code]" :placeholder="componentPlaceholder(field)"
                          :type="componentTypeMap[field.type]" :multiple="field.type === 3"
                          :value-format="field.type === 5 ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'" clearable
                          :options="field.options" :disabled="isAduit">
                          <!-- select -->
                          <template v-if="field.type === 2 || field.type === 3">
                            <template v-if="!field.dictCode">
                              <el-option v-for="option in field.options" :key="option.id" :label="option.value"
                                :value="option.code" />
                            </template>
                            <template v-else>
                              <el-option v-for="option in getDicList(field.dictCode)" :key="option.code"
                                :label="option.shortName" :value="option.code" />
                            </template>
                          </template>
                        </component>
                      </el-form-item>
                    </div>
                  </div>
                </div>

                <!-- 竞品链接 -->
                <el-form-item prop="competitionLink" label="竞品链接 " label-width="78px" :required="true"
                  :rules="[{ required: true, message: '请输入竞品链接 ', trigger: 'blur' }]">
                  <el-input v-model="formInline['competitionLink']" placeholder="请输入竞品链接" style="width: 755px"
                    :disabled="isAduit">
                    <template #append>
                      <div style="color: #0064ff; cursor: pointer"
                        :style="{ opacity: formInline['competitionLink'] ? 1 : 0.5 }"
                        @click="handleCompetitionLinkClick(formInline['competitionLink'])">跳转</div>
                    </template>
                  </el-input>
                </el-form-item>
                <!-- 风险点 -->

                <el-form-item prop="productRisk" label="风险点" label-width="78px" :required="true"
                  :rules="[{ required: true, message: '请输入风险点', trigger: 'change' }]">
                  <s-text-area v-model="formInline.productRisk" placeholder="请输入风险点" style="width: 755px"
                    :autosize="{ minRows: 3, maxRows: 3 }" :disabled="isAduit" />
                </el-form-item>
                <!--产品需求 -->
                <el-form-item prop="remark" label="产品需求" label-width="78px" :required="true"
                  :rules="[{ required: true, message: '请输入产品需求', trigger: 'change' }]">
                  <s-text-area v-model="formInline.remark" placeholder="请输入产品需求" style="width: 755px"
                    :autosize="{ minRows: 3, maxRows: 3 }" :disabled="isAduit" />
                </el-form-item>
                <div style="display: flex; flex-wrap: wrap">
                  <!-- 销售目标拆解 -->
                  <el-form-item v-if="false" label="销售目标拆解" label-width="78px" :required="true"
                    prop="salesTargetDismantling" :rules="[
                      { required: true, message: '销售目标拆解不能为空', trigger: 'change' }
                    ]" :style="{ width: `${itemWidth}px` }">
                    <uploadFile :style="{ width: inputWidth }" ref="salesTargetDismantlingUploadFileRef"
                      v-model:modelValue="formInline.salesTargetDismantling" :width="inputWidth" :disabled="isAduit"
                      @upload-bg-click="uploadBgClick(2)" />
                  </el-form-item>
                  <!-- 产品图参考 -->
                  <el-form-item label="产品图参考" label-width="78px" :required="true" prop="productDiagramReference"
                    :rules="[{ required: true, message: '产品图参考不能为空', trigger: 'change' }]"
                    :style="{ width: `${itemWidth}px` }">
                    <uploadFile :style="{ width: inputWidth }" ref="productDiagramReferenceUploadFileRef"
                      v-model:modelValue="formInline.productDiagramReference" :width="inputWidth" :disabled="isAduit"
                      @upload-bg-click="uploadBgClick(3)" />
                  </el-form-item>
                  <el-form-item label="面料图参考" label-width="78px" prop="fabricPicture"
                    :style="{ width: `${itemWidth}px` }">
                    <uploadFile :style="{ width: inputWidth }" ref="fabricPictureUploadFileRef"
                      v-model:modelValue="formInline.fabricPicture" :width="inputWidth" :disabled="isAduit"
                      @upload-bg-click="uploadBgClick(5)" />
                  </el-form-item>
                  <!-- 产品定价 -->
                  <el-form-item label="产品定价" label-width="78px" :required="true" prop="productPrice"
                    :rules="[{ required: true, message: '产品定价不能为空', trigger: 'change' }]"
                    :style="{ width: `${itemWidth}px` }">
                    <uploadFile :style="{ width: inputWidth }" ref="productPriceUploadFileRef"
                      v-model:modelValue="formInline.productPrice" :width="inputWidth" :disabled="isAduit"
                      @upload-bg-click="uploadBgClick(4)" />
                  </el-form-item>
                  <!-- 市场分析 -->
                  <el-form-item label="市场分析" label-width="78px" :required="true" prop="marketAnalysis"
                    :rules="[{ required: true, message: '市场分析不能为空', trigger: 'change' }]"
                    :style="{ width: `${itemWidth}px`, height: 'auto' }">
                    <uploadFile :style="{ width: inputWidth }" ref="marketAnalysisUploadFileRef"
                      v-model:modelValue="formInline.marketAnalysis" :width="inputWidth" :disabled="isAduit"
                      @upload-bg-click="uploadBgClick(0)" />
                  </el-form-item>
                  <!-- 需求分析 -->
                  <el-form-item label="需求分析" label-width="78px" :required="true" prop="marketAnalysis"
                    :rules="[{ required: true, message: '需求分析不能为空', trigger: 'change' }]"
                    :style="{ width: `${itemWidth}px`, height: 'auto' }">
                    <uploadFile :style="{ width: inputWidth }" ref="demandAnalysisUploadFileRef"
                      v-model:modelValue="formInline.demandAnalysis" :width="inputWidth" :disabled="isAduit"
                      @upload-bg-click="uploadBgClick(1)" />
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </ContentWrap>

          <ContentWrap>
            <div class="form-wapper">
              <div class="flex-row header-wapper">
                <span class="icon"></span>
                <span>品类明细</span>
              </div>
              <el-table class="SWCommonTable" v-horizontal-scroll="'always'"
                :header-cell-style="appStore.headerCellStyle" :data="categoryTableList" :stripe="true"
                :show-overflow-tooltip="true" row-class-name="commonTableRow" width="100%">
                <el-table-column label="品类" prop="category">
                  <template #default="scope">
                    <div>{{ formatCategory(scope.row.category) }}</div>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="数量" prop="number">
                  <template #default="scope">
                    <div>{{ scope.row.number }}</div>
                  </template>
                </el-table-column> -->
                <el-table-column label="系列" prop="series">
                  <template #default="{ row }">
                    <div class="row-center">
                      <span>{{ row.series }}</span>
                      <el-popover placement="bottom" :width="200" trigger="hover">
                        <div class="salePointBg">
                          <div class="salePointBg-title">卖点</div>
                          <div v-if="row.salePoint" class="salePointBg-content" v-html="row.salePoint"></div>
                          <div v-else class="salePointBg-content" style="margin-top: 5px; margin-left: -6px">【--】</div>
                        </div>
                        <!-- <Editor height="200px" v-model:modelValue="addForm.salePoint" /> -->
                        <template #reference>
                          <el-icon color="#C1CEE1" style="margin-left: 5px">
                            <QuestionFilled />
                          </el-icon>
                        </template>
                      </el-popover>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="类型" prop="series">
                  <template #default="scope">
                    <div>{{
                      scope.row.productType == '0'
                        ? '买手款'
                        : scope.row.productType == '1'
                          ? '定制款'
                          : '--'
                    }}</div>
                  </template>
                </el-table-column>

                <el-table-column label="包装方式" prop="packageMethod">
                  <template #default="scope">
                    <div>{{ scope.row.packageMethod || '--' }}</div>
                  </template>
                </el-table-column>

                <el-table-column label="包装图片" prop="unRoutinePackagePicture">
                  <template #default="scope">
                    <el-image v-if="scope.row.unRoutinePackagePicture" style="width: 30px; height: 30px"
                      :src="scope.row.unRoutinePackagePicture" :preview-teleported="true"
                      :preview-src-list="[scope.row.unRoutinePackagePicture]" fit="cover" />
                    <div v-else>--</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </ContentWrap>

          <ContentWrap>
            <div class="form-wapper">
              <div class="flex-row header-wapper">
                <span class="icon"></span>
                <span>计划数量</span>
              </div>
              <el-table class="SWCommonTable" v-horizontal-scroll="'always'"
                :header-cell-style="appStore.headerCellStyle" :data="planNumTableList" :stripe="true"
                :show-overflow-tooltip="true" row-class-name="commonTableRow" width="100%">
                <el-table-column label="计划数" prop="detailNum" />
                <el-table-column label="设计数" prop="designNum" />
                <el-table-column label="已上传数" prop="uploadedNum" />
                <el-table-column label="已选定数" prop="selectedQuantity" />
              </el-table>
            </div>
          </ContentWrap>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import uploadFile from '@/components/SWUoloadFile/index.vue'
import { useAppStore } from '@/store/modules/app'
import { developmentPlanNewPlanInfo } from '@/api/oa/new/develop'
import { getNpDetail, getBasicAttribute } from '@/api/oa/new/plan/index'
import { useCategoryList } from '../hooks.js'
import { componentMap, componentTypeMap } from '../utils.js'
import { isUrl } from '@/utils/is'
import { getDictOptions, getDictLabel, DICT_TYPE } from '@/utils/dict'
import { useDicList } from '@/views/OA/new/designGallery/hooks.js'
import { getUnboundGoodsApi } from '@/api/supplier/supplierProduct'

import SWSelectPeople from '@/views/OA/factory/components/selectPeople.vue'

const { dicList } = useDicList()
const appStore = useAppStore()
const message = useMessage() // 消息弹窗
const isVisible = ref(false)

const { categoryList, initSelectData } = useCategoryList()

const rules = ref({
  // category: [{ required: true, message: '请选择品类', trigger: 'change' }],
  // series: [{ required: true, message: '请输入系列', trigger: 'blur' }]
})

const formData = ref({
  planName: '',
  planType: '',
  storeName: '',
  store: '',
  planningPlan: '',
  planListDate: '',
  planOrderDate: '',
  remark: ''
})
const categoryTableList = ref([]) // 品类明细
const planNumTableList = ref([]) // 品类明细
const planNumMap = ref({}) // 计划数量

const currentId = ref('') // 当前编辑的 id
const open = async (id: string, planId: string) => {
  await initSelectData()
  await getConfig()
  await getNpDetailData(planId)

  isVisible.value = true

  if (id) {
    currentId.value = id
    const res = await developmentPlanNewPlanInfo(id)
    formData.value = res
    categoryTableList.value = res.detailList
    planNumMap.value = res.planNumMap
    if (res.planNumMap) {
      planNumTableList.value = [planNumMap.value]
    } else {
      planNumTableList.value = []
    }
  }
}

const formInline = ref({})
const getNpDetailData = async (id) => {
  const res = await getNpDetail(id)
  formInline.value = res
  formInline.value.isCreateGoodsNo = Number(res.isCreateGoodsNo)
  handelFormInlineData()
}

const isAduit = ref(true)
const configList = ref([])
const getConfig = async () => {
  const params = {
    code: 'Plan'
  }
  const res = await getBasicAttribute(params)
  configList.value = (res || []).filter((item) => item.state === 1)
  // handleIsShowWarnInfo()
  // console.log('configList', configList.value)
}

const goodsNoScrollSelectRef = ref()
const handelFormInlineData = () => {
  // 处理人员回显
  if (formInline.value.operateManages && formInline.value.operateManages.length) {
    formInline.value.operateManageId = formInline.value.operateManages.map((user: any) => ({
      userId: user.userId,
      name: user.name,
      avatarOrigin: user.avatarOrigin
    }))
  } else {
    formInline.value.operateManageId = null
  }

  if (formInline.value.oldGoodsNo) {
    setTimeout(() => {
      if (goodsNoScrollSelectRef.value) {
        goodsNoScrollSelectRef.value[0].initDefaultValue(formInline.value.oldGoodsNo || '')
      }
    }, 30)
  }
  // if (formInline.value.planListDate) {
  // let planListDateList = formInline.value.planListDate.split('-')
  // if (planListDateList.length === 2) {
  //   formInline.value.planListDate = `${planListDateList[0]}-${planListDateList[1]}-01`
  // }
  // }
  if (
    formInline.value.store === '全渠道' ||
    formInline.value.store === 'ALL' ||
    (formInline.value.storeName && formInline.value.storeName === '全渠道')
  ) {
    formInline.value.store = ''
  }

  // 处理企划时间的回显
  if (formInline.value.planningTime) {
    const [startStr, endStr] = formInline.value.planningTime.split('-')
    const startDate = parseChineseMonth(startStr.trim())
    const endDate = parseChineseMonth(endStr.trim())
    formInline.value.planningTime = [startDate, endDate]
  }
  // 处理回显
  if (formInline.value.marketAnalysis) {
    formInline.value.marketAnalysis = formInline.value.marketAnalysis.split(',').map((item) => {
      let array = item.split('?name=')
      console.log('aaa', array)
      return {
        name: array[1],
        url: array[0]
      }
    })

    console.log('1', formInline.value.marketAnalysis)
  }
  if (formInline.value.demandAnalysis) {
    formInline.value.demandAnalysis = formInline.value.demandAnalysis.split(',').map((item) => {
      let array = item.split('?name=')
      return {
        name: array[1],
        url: array[0]
      }
    })
  }
  if (formInline.value.salesTargetDismantling) {
    formInline.value.salesTargetDismantling = formInline.value.salesTargetDismantling
      .split(',')
      .map((item) => {
        let array = item.split('?name=')
        return {
          name: array[1],
          url: array[0]
        }
      })
  }
  if (formInline.value.productDiagramReference) {
    formInline.value.productDiagramReference = formInline.value.productDiagramReference
      .split(',')
      .map((item) => {
        let array = item.split('?name=')
        return {
          name: array[1],
          url: array[0]
        }
      })
  }
  if (formInline.value.fabricPicture) {
    formInline.value.fabricPicture = formInline.value.fabricPicture.split(',').map((item) => {
      let array = item.split('?name=')
      return {
        name: array[1],
        url: array[0]
      }
    })
  }
  if (formInline.value.productPrice) {
    formInline.value.productPrice = formInline.value.productPrice.split(',').map((item) => {
      let array = item.split('?name=')
      return {
        name: array[1],
        url: array[0]
      }
    })
  }
}

const parseChineseMonth = (chineseMonthStr) => {
  if (chineseMonthStr && chineseMonthStr.endsWith('日')) {
    const regex = /(\d{4})年(\d{1,2})月(\d{1,2})日/
    const match = chineseMonthStr.match(regex)
    if (match) {
      const year = parseInt(match[1], 10)
      const month = parseInt(match[2], 10) - 1 // 月份是从0开始的
      const day = parseInt(match[3], 10) - 1 // 月份是从0开始的
      return new Date(year, month, day)
    }
  } else {
    const regex = /(\d{4})年(\d{1,2})月/
    const match = chineseMonthStr.match(regex)
    if (match) {
      const year = parseInt(match[1], 10)
      const month = parseInt(match[2], 10) - 1 // 月份是从0开始的
      return new Date(year, month)
    }
  }

  return null
}

// 新生成的字段列表
const newFields = () => {
  if (preUploadFileCount() % 2 !== 0) {
    let tempFileds = [] as any
    configList.value.forEach((item) => {
      if (item.code === 'marketAnalysis' && item.edit) {
        tempFileds.push({ code: 'empytLayout', edit: true, name: '', type: -1 })
      }
      tempFileds.push(item)
    })
    return tempFileds || []
  } else {
    return configList.value || []
  }
}

// 上传文件前面字段的数量
const preUploadFileCount = () => {
  let count = 0
  let flag = false
  configList.value.forEach((item) => {
    if (item.code === 'marketAnalysis' && item.edit) {
      flag = true
    }
    if (!flag && item.edit) {
      count++
    }
  })
  return count
}

const itemWidth = ref(260)
const itemWidthDouble = ref(474)
const inputWidth = ref(194)

const isShowField = (field) => {
  if (field.edit) {
    if (
      formInline.value &&
      formInline.value.planProductType &&
      (formInline.value.planProductType == 2 || formInline.value.planProductType == 3)
    ) {
      if (
        ![
          'productRisk',
          'productDemand',
          'marketAnalysis',
          'demandAnalysis',
          'salesTargetDismantling',
          'productDiagramReference',
          'productPrice',
          'remark',
          'competitionLink'
        ].includes(field.code)
      ) {
        return true
      } else {
        return false
      }
    } else {
      if (
        ![
          'productRisk',
          'productDemand',
          'marketAnalysis',
          'demandAnalysis',
          'salesTargetDismantling',
          'productDiagramReference',
          'productPrice',
          'remark',
          'competitionLink',
          'oldGoodsNo',
          'isCreateGoodsNo'
        ].includes(field.code)
      ) {
        return true
      } else {
        return false
      }
    }
  }
  return false
}

// 表单校验规则
const formRules = computed(() => {
  const rules: any = {}
  configList.value.forEach((field) => {
    const type = field.code
    rules[type] = [{ required: true, message: `${field.name}不能为空`, trigger: ['change'] }]
  })

  return rules
})

// 店铺自定义校验
const storeValidator = (rule: any, value: any, callback: any) => {
  callback()
}

const getRules = (field) => {
  if (field.code === 'store') {
    return [{ required: true, validator: storeValidator, trigger: 'blur' }]
  }
  const type = field.code
  return formRules.value[type] || []
}

const handleCompetitionLinkClick = (value) => {
  if (value) {
    if (isUrl(value)) {
      window.open(value, '_blank')
    } else {
      ElMessage.warning('非链接无法跳转')
    }
  }
}

const componentPlaceholder = (field) => {
  if (field.placeholder) {
    return field.placeholder
  }
  return `请输入${field.name}`
}

const formatCategory = (code) => {
  const item = categoryList.value.find((item) => item.code === code)
  return item ? item.name : ''
}

const listDic = ref([])

watch(dicList, (newVal) => {
  // @ts-ignore
  listDic.value = newVal || []
})

const getDicList = (dictCode) => {
  // @ts-ignore
  const item = listDic.value.filter((item) => item?.id == dictCode)
  //@ts-ignore
  const dictList = getDictOptions(item?.[0]?.code).filter((item) => item?.code != 'ALL')
  return dictList
}

const marketAnalysisUploadFileRef = ref()
const demandAnalysisUploadFileRef = ref()
const salesTargetDismantlingUploadFileRef = ref()
const productDiagramReferenceUploadFileRef = ref()
const productPriceUploadFileRef = ref()
const fabricPictureUploadFileRef = ref()
const uploadBgClick = (index) => {
  if (index === 0) {
    // 市场分析
    demandAnalysisUploadFileRef.value?.cancelUploadSelect()
    salesTargetDismantlingUploadFileRef.value?.cancelUploadSelect()
    productDiagramReferenceUploadFileRef.value?.cancelUploadSelect()
    productPriceUploadFileRef.value?.cancelUploadSelect()
    fabricPictureUploadFileRef.value?.cancelUploadSelect()
  } else if (index === 1) {
    // 需求分析
    marketAnalysisUploadFileRef.value?.cancelUploadSelect()
    salesTargetDismantlingUploadFileRef.value?.cancelUploadSelect()
    productDiagramReferenceUploadFileRef.value?.cancelUploadSelect()
    productPriceUploadFileRef.value?.cancelUploadSelect()
    fabricPictureUploadFileRef.value?.cancelUploadSelect()
  } else if (index === 2) {
    // 销售目标 拆解
    demandAnalysisUploadFileRef.value?.cancelUploadSelect()
    marketAnalysisUploadFileRef.value?.cancelUploadSelect()
    productDiagramReferenceUploadFileRef.value?.cancelUploadSelect()
    productPriceUploadFileRef.value?.cancelUploadSelect()
    fabricPictureUploadFileRef.value?.cancelUploadSelect()
  } else if (index === 3) {
    // 产品图 参考
    demandAnalysisUploadFileRef.value?.cancelUploadSelect()
    marketAnalysisUploadFileRef.value?.cancelUploadSelect()
    salesTargetDismantlingUploadFileRef.value?.cancelUploadSelect()
    productPriceUploadFileRef.value?.cancelUploadSelect()
    fabricPictureUploadFileRef.value?.cancelUploadSelect()
  } else if (index === 4) {
    //产品定价
    marketAnalysisUploadFileRef.value?.cancelUploadSelect()
    demandAnalysisUploadFileRef.value?.cancelUploadSelect()
    salesTargetDismantlingUploadFileRef.value?.cancelUploadSelect()
    productDiagramReferenceUploadFileRef.value?.cancelUploadSelect()
    fabricPictureUploadFileRef.value?.cancelUploadSelect()
  }
}

const formRef = ref() // 表单 Ref

const reset = () => {
  formData.value = {
    planName: '',
    planType: '',
    storeName: '',
    store: '',
    planningPlan: '',
    planListDate: '',
    planOrderDate: '',
    remark: ''
  }
  categoryTableList.value = []
  isVisible.value = false
  currentId.value = ''
}

const emit = defineEmits(['success'])
defineExpose({ open })
</script>

<style lang="scss" scoped>
:deep(.el-drawer__body) {
  // background-image: url('@/assets/imgs/drawer_bg.png') !important;
  // background-size: cover !important;
  background: #f6f6f6;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
}

.drawer-wapper {
  min-width: 700px;
  background: #f6f6f6;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
}

.title-wapper {
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;

  .close {
    width: 23px;
    height: 23px;
    cursor: pointer;
  }

  .title {
    font-size: 14px;
    color: #333333;
    font-weight: 500;
  }
}

.form-wapper {
  .header-wapper {
    margin-bottom: 16px;
    align-items: center;

    .icon {
      width: 3px;
      height: 10px;
      background: #0064ff;
      margin-right: 5px;
    }
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.form-main {
  flex-wrap: wrap;

  .el-form-item {
    width: calc(50%);

    &.w-100 {
      width: 100%;
    }
  }

  .valueBg {
    width: 284px;
    height: 32px;
    background: #f8f8f9;
    border-radius: 4px;
    padding-left: 16px;
  }

  .valueRemarkBg {
    width: 684px;
    min-height: 92px;
    background: #f8f8f9;
    border-radius: 4px;
    padding-left: 16px;
    padding-right: 16px;
  }
}

.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
}

:deep(p) {
  margin: 0px !important;
  padding: 0px !important;
}

:deep(.el-form-item__content) {
  min-width: 290px;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 20px;
}

:deep(.el-form-item.is-required:not(.is-no-asterisk).asterisk-left > .el-form-item__label:before) {
  margin-right: 0px;
}

:deep(.el-form-item--default .el-form-item__label) {
  line-height: 20px;
  text-align: right;
  display: flex;
  /* align-items: center; */
  padding-left: 0px;

  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-align: right;
  letter-spacing: normal;
  color: #666666;
}
</style>
