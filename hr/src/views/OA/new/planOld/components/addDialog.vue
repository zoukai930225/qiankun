<!--
 * @Date: 2024-12-05 13:54:45
-->
<template>
  <div>
    <SWDrawer v-if="isVisible" v-model="isVisible" :width="936" :title="isAduit ? '详情' : currentId ? '编辑' : '新增'"
      :showBeforClose="true" @before-close="handleBeforClose">
      <div class="drawer-wapper" v-loading="saveLoading" @click="bgClick">
        <div class="content-wapper">
          <ContentWrap>
            <div class="form-wapper">
              <div class="flex-row header-wapper">
                <span class="icon"></span>
                <span>基本信息</span>
              </div>
              <!--  -->
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
                          :placeholder="field.placeholder" style="width: 740px" :autosize="{ minRows: 3, maxRows: 3 }"
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
                            select-key="goodsNo" :multiple="false" :placeholder="field.placeholder" :disabled="isAduit"
                            @change="handleChangeGoodsNo" />
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
                  <el-input v-model="formInline['competitionLink']" placeholder="请输入竞品链接" style="width: 770px"
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
                  <s-text-area v-model="formInline.productRisk" placeholder="请输入风险点" style="width: 770px"
                    :autosize="{ minRows: 3, maxRows: 3 }" :disabled="isAduit" />
                </el-form-item>
                <!--产品需求 -->
                <el-form-item prop="remark" label="产品需求" label-width="78px" :required="true"
                  :rules="[{ required: true, message: '请输入产品需求', trigger: 'change' }]">
                  <s-text-area v-model="formInline.remark" placeholder="请输入产品需求" style="width: 770px"
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
              <!--  -->
              <div style="margin-bottom: 16px">
                <el-button type="primary" @click="add" :disabled="isAduit">新增</el-button>
              </div>
              <el-table class="SWCommonTable" v-horizontal-scroll="'always'"
                :header-cell-style="appStore.headerCellStyle" :data="categoryTableList" :stripe="true"
                :show-overflow-tooltip="true" row-class-name="commonTableRow" width="100%">
                <el-table-column label="品类" prop="category">
                  <template #default="scope">
                    <div style="color: #0064ff">{{ scope.row.completeCategoryName }}</div>
                  </template>
                </el-table-column>

                <el-table-column property="series" label="系列">
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

                <el-table-column label="类型" prop="productType">
                  <template #default="scope">
                    <div>{{
                      scope.row.productType == '0'
                        ? '买手款'
                        : scope.row.productType == '1'
                          ? '定制款'
                          : ''
                    }}</div>
                  </template>
                </el-table-column>
                <el-table-column v-if="isNewGoods" label="工艺类型" prop="craftType">
                  <template #default="scope">
                    <div>{{ scope.row.craftType || '--' }}</div>
                  </template>
                </el-table-column>
                <el-table-column v-if="isNewGoods" label="包装方式" prop="packageMethod">
                  <template #default="scope">
                    <div>{{ scope.row.packageMethod || '--' }}</div>
                  </template>
                </el-table-column>
                <el-table-column v-if="addType === 'newGoods'" label="包装图片" prop="unRoutinePackagePicture">
                  <template #default="scope">
                    <el-image v-if="scope.row.unRoutinePackagePicture" style="width: 30px; height: 30px"
                      :src="scope.row.unRoutinePackagePicture" :preview-teleported="true"
                      :preview-src-list="[scope.row.unRoutinePackagePicture]" fit="cover" />
                    <div v-else>--</div>
                  </template>
                </el-table-column>
                <el-table-column v-if="addType === 'newGoods'" label="包装流程图" prop="packageProgressPicture">
                  <template #default="scope">
                    <el-image v-if="scope.row.packageProgressPicture" style="width: 30px; height: 30px"
                      :src="scope.row.packageProgressPicture" :preview-teleported="true"
                      :preview-src-list="[scope.row.packageProgressPicture]" fit="cover" />
                    <div v-else>--</div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" align="right" v-if="!isAduit">
                  <template #default="scope">
                    <el-button link type="primary" :icon="Edit" @click="handleEdit(scope.row)">
                      编辑
                    </el-button>
                    <el-button link type="danger" :icon="Delete" size="small" @click="handleDelItem(scope.row)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </ContentWrap>

          <!-- <div class="btn-wapper" v-if="!isAduit">
            <el-button @click="reset">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </div> -->
        </div>
      </div>

      <template #footer>
        <div class="btn-wapper" v-if="!isAduit">
          <el-button @click="reset">取消</el-button>
          <el-button class="templeSaveBtn" v-if="!currentId" @click="tempSave">暂存</el-button>
          <el-button type="primary" @click="save(false)">保存</el-button>
        </div>
      </template>
    </SWDrawer>

    <SWDialog v-model="dialogVisible" width="800" :title="addCategoryTitle" :showTitleLine="true"
      :showBottomLine="true">
      <div style="width: 770px; overflow-x: hidden; margin-top: 15px" @click="bgClick2">
        <ElScrollbar class="dialog-content" style="height: 75vh">
          <el-form :inline="true" :model="addForm" class="demo-form-inline p6px" :rules="itemRules" ref="addFormRef"
            :label-width="isNewGoods ? '110' : '80'">
            <el-form-item label="品类：" style="width: 300px" prop="category">
              <!-- <el-select
                style="width: 240px"
                v-model="addForm.category"
                placeholder="请选择"
                clearable
              >
                <el-option
                  :label="item.name"
                  :value="item.code"
                  v-for="item in addType === 'newGoods'
                    ? categoryList
                    : [{ code: 'PACKAGE_CATEGORY_GROUP', name: '包装' }]"
                  :key="item.code"
                />
              </el-select> -->
              <CategorySelect style="width: 240px" v-model="addForm.category" />
            </el-form-item>

            <el-form-item label="系列：" style="width: 300px" prop="series">
              <el-input v-model="addForm.series" style="width: 240px" placeholder="请输入" />
            </el-form-item>

            <el-form-item v-if="!isAddCatrgory && isPackage()" label="类型：" style="width: 300px" prop="productType">
              <el-select style="width: 240px" v-model="addForm.productType" placeholder="请选择类型" :teleported="false"
                disabled>
                <el-option v-for="item in [
                  {
                    label: '买手款',
                    value: '0'
                  },
                  {
                    label: '定制款',
                    value: '1'
                  }
                ]" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item v-if="isAddCatrgory" label="类型：" style="width: 300px" prop="productType">
              <div class="row">
                <el-radio-group v-model="addForm.productType" style="width: 240px" disabled>
                  <el-radio label="0" size="large">买手款</el-radio>
                  <el-radio label="1" size="large">定制款</el-radio>
                </el-radio-group>
                <div v-if="isAddCatrgory" class="row-center" style="margin-left: 76px">
                  <el-input-number v-if="addForm.productType === '0'" :min="1" v-model="addForm.designNumber" />
                  <el-input-number v-if="addForm.productType === '1'" :min="1" v-model="addForm.marketNumber" />
                </div>
              </div>
            </el-form-item>

            <el-form-item label="卖点：">
              <Editor height="200px" :hideFullScreen="true" v-model:modelValue="addForm.salePoint" />
            </el-form-item>
            <el-form-item v-if="isNewGoods" label="包装方式：" prop="packageMethod"
              :rules="[{ required: true, message: '请选择包装方式', trigger: 'change' }]">
              <el-select v-model="addForm.packageMethod" placeholder="请选择包装方式" style="width: 300px" clearable>
                <el-option label="常规包装" value="常规包装" />
                <el-option label="非常规包装" value="非常规包装" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="isNewGoods" label="工艺类型：" prop="craftType">
              <el-select v-model="addForm.craftType" placeholder="请选择艺类型" style="width: 300px" clearable>
                <el-option label="车缝" value="车缝" />
                <el-option label="贴合" value="贴合" />
                <el-option label="无缝" value="无缝" />
              </el-select>
            </el-form-item>
            <div class="row" style="width: 730px">
              <el-form-item v-if="isNewGoods" label="包装图片：" class="packageMethod" style="margin-bottom: 20px"
                prop="unRoutinePackagePicture" :rules="[{ required: true, message: '请上传包装图片', trigger: 'change' }]">
                <uploadFile :style="{ width: inputWidth }" ref="unRoutinePackagePictureUploadFileRef"
                  v-model:modelValue="addForm.unRoutinePackagePicture" :width="inputWidth" :disabled="isAduit"
                  @upload-bg-click="uploadBgClick2(1)" />
              </el-form-item>

              <el-form-item v-if="isNewGoods" label="包装流程图：" class="packageMethod" style="margin-bottom: 20px"
                prop="packageProgressPicture" :rules="[{ required: true, message: '请上传包装流程图', trigger: 'change' }]">
                <uploadFile :style="{ width: inputWidth }" ref="packageProgressPictureUploadFileRef"
                  v-model:modelValue="addForm.packageProgressPicture" :width="inputWidth" :disabled="isAduit"
                  @upload-bg-click="uploadBgClick2(2)" />
              </el-form-item>
            </div>
          </el-form>
        </ElScrollbar>
      </div>

      <template #footer>
        <div class="dialog-footer" style="margin-top: 15px; margin-right: 15px">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="isAddCatrgory" type="primary" @click="continueSaveItem">继续添加</el-button>
          <el-button type="primary" @click="saveItem(false)"> 确定 </el-button>
        </div>
      </template>
    </SWDialog>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { getNpDetail, queryTempData, saveNp, updateNp } from '@/api/oa/new/plan/index'
import uploadFile from '@/components/SWUoloadFile/index.vue'
import { useAppStore } from '@/store/modules/app'
import { debounce } from 'lodash-es'
import { componentMap, componentTypeMap, formattedDates } from '../utils.js'

import { getUnboundGoodsApi } from '@/api/supplier/supplierProduct'
import { generateUUID } from '@/utils'
import { deepEqual } from '@/utils/common'
import { isUrl } from '@/utils/is'
import { useCategoryList } from '../hooks.js'
import CategorySelect from '@/views/OA/new/components/selectCategory.vue'


import SWSelectPeople from '@/views/OA/factory/components/selectPeople.vue'

import { getDictOptions } from '@/utils/dict'
import { useDicList } from '@/views/OA/new/designGallery/hooks.js'
const { dicList } = useDicList()
const appStore = useAppStore()
const message = useMessage() // 消息弹窗
const isVisible = ref(false)
const dialogVisible = ref(false)
const { categoryList, initSelectData } = useCategoryList()
const saveLoading = ref(false) // 保存 loading
const addForm = ref<any>({
  category: undefined,
  series: undefined,
  salePoint: undefined,
  productType: '1',
  designNumber: 0,
  marketNumber: 0,
  packageMethod: undefined,
  craftType: undefined,
  unRoutinePackagePicture: undefined,
  packageProgressPicture: undefined
})

// 定义类型
interface Field {
  name: string
  code: string
  type: number
  placeholder: string
  options: any[]
  searchDisplay: boolean
  state: number
  required: number
  edit: boolean
}
const props = defineProps({
  fields: {
    type: Array as PropType<Field[]>,
    default: () => []
  },
  addType: {
    type: String,
    default: 'newGoods'
  }
})

const itemWidth = ref(274)
const itemWidthDouble = ref(484)
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

const itemRules = ref({
  category: [{ required: true, message: '请选择品类', trigger: 'change' }],
  series: [{ required: true, message: '请输入系列', trigger: 'blur' }],
  productType: [{ required: true, message: '请选择类型', trigger: 'blur' }]
})

// 表单校验规则
const formRules = computed(() => {
  const rules: any = {}
  props.fields.forEach((field) => {
    const type = field.code
    rules[type] = [{ required: true, message: `${field.name}不能为空`, trigger: ['change'] }]
  })

  return rules
})

const componentPlaceholder = (field) => {
  if (field.placeholder) {
    return field.placeholder
  }
  return `请输入${field.name}`
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

const isPackage = () => {
  return props.addType === 'package'
}

const isNewGoods = computed(() => props.addType === 'newGoods')

const handleBeforClose = async (done: () => void) => {
  if (deepEqual(oldFormData.value, formInline.value)) return done()
  await message.confirm('当前页面还有未保存的数据，确认关闭吗？')
  done()
}

// 新生成的字段列表
const newFields = () => {
  if (preUploadFileCount() % 2 !== 0) {
    let tempFileds = [] as any
    props.fields.forEach((item) => {
      if (item.code === 'marketAnalysis' && item.edit) {
        tempFileds.push({ code: 'empytLayout', edit: true, name: '', type: -1 })
      }
      tempFileds.push(item)
    })
    return tempFileds || []
  } else {
    return props.fields || []
  }
}
// 上传文件前面字段的数量
const preUploadFileCount = () => {
  let count = 0
  let flag = false
  props.fields.forEach((item) => {
    if (item.code === 'marketAnalysis' && item.edit) {
      flag = true
    }
    if (!flag && item.edit) {
      count++
    }
  })
  return count
}

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

const formInline = ref<any>({})
const categoryTableList = ref<any>([]) // 品类明细

const currentId = ref('') // 当前编辑的 id
const isAduit = ref(false) // 是否是审核状态

const marketAnalysisUploadFileRef = ref()
const demandAnalysisUploadFileRef = ref()
const salesTargetDismantlingUploadFileRef = ref()
const productDiagramReferenceUploadFileRef = ref()
const productPriceUploadFileRef = ref()
const fabricPictureUploadFileRef = ref()
const bgClick = () => {
  marketAnalysisUploadFileRef.value?.cancelUploadSelect()
  demandAnalysisUploadFileRef.value?.cancelUploadSelect()
  salesTargetDismantlingUploadFileRef.value?.cancelUploadSelect()
  productDiagramReferenceUploadFileRef.value?.cancelUploadSelect()
  productPriceUploadFileRef.value?.cancelUploadSelect()
  fabricPictureUploadFileRef.value?.cancelUploadSelect()
}
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

const unRoutinePackagePictureUploadFileRef = ref()
const packageProgressPictureUploadFileRef = ref()

const bgClick2 = () => {
  packageProgressPictureUploadFileRef.value?.cancelUploadSelect()
  unRoutinePackagePictureUploadFileRef.value?.cancelUploadSelect()
}
const uploadBgClick2 = (index) => {
  if (index === 1) {
    // 包装图片
    packageProgressPictureUploadFileRef.value?.cancelUploadSelect()
  } else if (index === 2) {
    // 流程图
    unRoutinePackagePictureUploadFileRef.value?.cancelUploadSelect()
  }
}

const goodsNoScrollSelectRef = ref()
const oldFormData = ref<typeof formInline.value>()

const open = async (id?, isView = false) => {
  await initSelectData()
  reset()
  addForm.value.productType = '1'
  isVisible.value = true
  isAduit.value = isView

  if (id) {
    // 编辑
    currentId.value = id
    try {
      saveLoading.value = true
      const res = await getNpDetail(id)
      formInline.value = res
      formInline.value.isCreateGoodsNo = Number(res.isCreateGoodsNo)
      handelFormInlineData()
      categoryTableList.value = res.details
    } finally {
      saveLoading.value = false
      oldFormData.value = { ...formInline.value }
    }
  } else {
    saveLoading.value = true
    const res = await queryTempData().catch((err) => { })
    saveLoading.value = false
    if (res) {
      formInline.value = res
      formInline.value.isCreateGoodsNo = Number(res.isCreateGoodsNo)
      handelFormInlineData()
      categoryTableList.value = res.details
    }
    if (props.addType === 'package') {
      addForm.value.category = 'PACKAGE_CATEGORY_GROUP'
    }
    oldFormData.value = { ...formInline.value }
    setTimeout(() => {
      formRef.value?.clearValidate()
    }, 30)
  }
}

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

function handleChangeGoodsNo(_: any, selectItem: typeof formInline.value) {
  formInline.value = { ...formInline.value, oldGoodsNo: selectItem.goodsNo }
}

const formatCategory = (code) => {
  console.log('**', code)
  const item = categoryList.value.find((item) => item.code === code)
  return item ? item.name : ''
}

const addFormRef = ref() // 表单 Ref

const continueSaveItem = () => {
  saveItem(true)
}
const saveItem = async (isContinue = false) => {
  if (!isAddCatrgory.value) {
    editItemInfo()
    return
  }
  // 校验表单
  if (!addFormRef) return
  const valid = await addFormRef.value.validate()
  if (!valid) return

  if (addForm.value.unRoutinePackagePicture && addForm.value.unRoutinePackagePicture.length > 0) {
    addForm.value.unRoutinePackagePicture = addForm.value.unRoutinePackagePicture
      .map((item) => {
        return item.url && item.url + '?name=' + item.name
      })
      .join(',')
  }

  if (addForm.value.packageProgressPicture && addForm.value.packageProgressPicture.length > 0) {
    addForm.value.packageProgressPicture = addForm.value.packageProgressPicture
      .map((item) => {
        return item.url && item.url + '?name=' + item.name
      })
      .join(',')
  }

  // 初始化一个空数组来存储将要添加的数据
  let itemsToAdd = [] as any

  if (Number(addForm.value.productType || '') == 0) {
    // 根据 designNumber 生成对应数量的数据项，productType 设为 '0'
    for (let i = 0; i < addForm.value.designNumber; i++) {
      itemsToAdd.push({
        ...addForm.value,
        productType: '0'
      })
    }
  }

  // 根据 marketNumber 生成对应数量的数据项，productType 设为 '1'
  if (Number(addForm.value.productType || '') == 1) {
    // 根据 marketNumber 生成对应数量的数据项，productType 设为 '1'
    for (let i = 0; i < addForm.value.marketNumber; i++) {
      itemsToAdd.push({
        ...addForm.value,
        productType: '1'
      })
    }
  }

  // 将生成的数据项添加到 categoryTableList 中
  categoryTableList.value.push(...itemsToAdd)

  categoryTableList.value.forEach((item, index) => {
    if (!item.id) {
      // 如果 item 没有 id，则赋值
      item.id = generateUUID() // 赋予唯一的 ID
    }
  })

  console.log('打印品类明细', categoryTableList.value)
  // @ts-ignore
  if (isContinue) {
    resetAddParam()
  } else {
    dialogVisible.value = false
  }
}

const editItemInfo = () => {
  if (addForm.value.unRoutinePackagePicture && addForm.value.unRoutinePackagePicture.length > 0) {
    addForm.value.unRoutinePackagePicture = addForm.value.unRoutinePackagePicture
      .map((item) => {
        return item.url && item.url + '?name=' + item.name
      })
      .join(',')
  }

  if (addForm.value.packageProgressPicture && addForm.value.packageProgressPicture.length > 0) {
    addForm.value.packageProgressPicture = addForm.value.packageProgressPicture
      .map((item) => {
        return item.url && item.url + '?name=' + item.name
      })
      .join(',')
  }
  if (editItemIndex.value >= 0 && editItemIndex.value < categoryTableList.value.length) {
    categoryTableList.value[editItemIndex.value] = { ...addForm.value }
  }
  dialogVisible.value = false
}

const editItemIndex = ref(-1)
// 编辑品类明细
const handleEdit = (row) => {
  const index = categoryTableList.value.findIndex((item) => item === row)
  console.log('编辑品类明细', index, row)
  editItemIndex.value = index
  isAddCatrgory.value = false
  addCategoryTitle.value = '编辑'
  dialogVisible.value = true
  addForm.value = { ...row }

  if (addForm.value.unRoutinePackagePicture) {
    addForm.value.unRoutinePackagePicture = addForm.value.unRoutinePackagePicture
      .split(',')
      .map((item) => {
        let array = item.split('?name=')
        return {
          name: array[1],
          url: array[0]
        }
      })
  }
  if (addForm.value.packageProgressPicture) {
    addForm.value.packageProgressPicture = addForm.value.packageProgressPicture
      .split(',')
      .map((item) => {
        let array = item.split('?name=')
        return {
          name: array[1],
          url: array[0]
        }
      })
  }
}
// 删除品类明细
const handleDelItem = (row) => {
  const index = categoryTableList.value.findIndex((item) => item === row)
  categoryTableList.value.splice(index, 1)
}

const isAddCatrgory = ref(false)
const addCategoryTitle = ref('新增')
const add = () => {
  addForm.value = {
    category: props.addType === 'package' ? 'PACKAGE_CATEGORY_GROUP' : undefined,
    series: undefined,
    salePoint: undefined,
    productType: '1',
    designNumber: 0,
    marketNumber: 0,
    packageMethod: undefined,
    craftType: undefined,
    unRoutinePackagePicture: undefined,
    packageProgressPicture: undefined
  }
  isAddCatrgory.value = true
  addCategoryTitle.value = '新增'
  dialogVisible.value = true
}

const formRef = ref() // 表单 Ref

const tempSave = () => {
  save(true)
}
const save = debounce(async (isTempSave = false) => {
  if (!isTempSave) {
    // 校验表单
    if (!formRef) return
    const valid = await formRef.value.validate()
    if (!valid) return
    // 校验品类明细

    if (categoryTableList.value.length === 0) {
      message.error('请至少添加一项品类明细')
      return
    }
  }

  try {
    saveLoading.value = true

    const data = {
      ...formInline.value,
      store: formInline.value && formInline.value.store ? formInline.value.store : 'ALL',
      details: categoryTableList.value,
      planTemplate: props.addType === 'newGoods' ? 1 : 2,
      operateManageId: formInline.value.operateManageId.map((user: any) => user.userId)?.join(',')
    } as any

    if (data.jsonData) {
      delete data.jsonData
    }
    if (data.planningTime) {
      let planningTimeArr = formattedDates(data.planningTime)
      data.planningStartTime = planningTimeArr[0]
      data.planningEndTime = planningTimeArr[1]
      data.planningTime = planningTimeArr.join('-')
    }

    // 市场分析和需求分析的图片处理
    if (data.marketAnalysis && data.marketAnalysis.length > 0) {
      data.marketAnalysis = data.marketAnalysis
        .map((item) => {
          return item.url && item.url + '?name=' + item.name
        })
        .join(',')
    }

    if (data.demandAnalysis && data.demandAnalysis.length > 0) {
      data.demandAnalysis = data.demandAnalysis
        .map((item) => {
          return item.url && item.url + '?name=' + item.name
        })
        .join(',')
    }

    if (data.salesTargetDismantling && data.salesTargetDismantling.length > 0) {
      data.salesTargetDismantling = data.salesTargetDismantling
        .map((item) => {
          return item.url && item.url + '?name=' + item.name
        })
        .join(',')
    }

    if (data.productDiagramReference && data.productDiagramReference.length > 0) {
      data.productDiagramReference = data.productDiagramReference
        .map((item) => {
          return item.url && item.url + '?name=' + item.name
        })
        .join(',')
    }
    if (data.fabricPicture && data.fabricPicture.length > 0) {
      data.fabricPicture = data.fabricPicture
        .map((item) => {
          return item.url && item.url + '?name=' + item.name
        })
        .join(',')
    }

    if (data.productPrice && data.productPrice.length > 0) {
      data.productPrice = data.productPrice
        .map((item) => {
          return item.url && item.url + '?name=' + item.name
        })
        .join(',')
    }

    // 品类明细 需要去掉前端自己生成的 id
    data.details.forEach((item) => {
      delete item.id
    })
    if (currentId.value) {
      await updateNp(data)
    } else {
      if (isTempSave) {
        data['submitStatus'] = 0
      } else {
        data['submitStatus'] = 1
      }
      await saveNp(data)
    }
    message.success('操作成功')
    emit('success')
    reset()
  } catch (error) {
  } finally {
    saveLoading.value = false
  }
}, 300)

const reset = () => {
  formInline.value = {}
  categoryTableList.value = []
  isVisible.value = false
  currentId.value = ''
}

const resetAddParam = () => {
  addForm.value = {}
  addForm.value.productType = '1'
  addForm.value.designNumber = 0
  addForm.value.marketNumber = 0
}

const emit = defineEmits(['cancle', 'success', 'close'])

const close = () => {
  reset()
  isVisible.value = false
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

defineExpose({ open, close })
</script>

<style lang="scss" scoped>
.drawer-wapper {
  // min-width: 700px;
  // background: #f6f6f6;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  // background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);

  .content-wapper {
    width: calc(100% + 4px);
  }
}

.form-wapper {
  width: calc(100%);

  .header-wapper {
    margin-bottom: 16px;
    align-items: center;
    font-weight: 600;
    font-size: 14px;
    color: #333333;
    margin-left: -20px;
    border-bottom: 1px solid #f0f0f0;
    width: calc(100% + 40px);
    padding-bottom: 16px;

    .icon {
      margin-left: 20px;
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

.btn-wapper {
  margin-right: 20px;
  display: flex;
  flex-direction: row;
  justify-content: end;
}

.salePointBg {
  display: flex;
  flex-direction: column;

  &-title {
    font-size: 14px;
    color: #333333;
    font-weight: 500;
    margin-bottom: 8px;
  }

  &-content {
    // font-size: 14px;
    // color: #666666;
  }
}

.numberNormal {
  margin-left: auto;
  margin-right: auto;
  width: 120px;
  height: 32px;
  background: #f2f6fc;
  border-radius: 4px;
  text-align: center;
  line-height: 32px;
  font-size: 14px;
  color: #333333;
}

.numberEdit {
  margin-left: auto;
  margin-right: auto;
  width: 120px;
  height: 32px;
}

.packageMethod {
  width: 320px;
  height: auto;
  padding-bottom: 5px;
}
</style>

<style scoped>
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

<style lang="scss">
.oadialog-background {
  border-radius: 20px;
  background-image: url('@/assets/imgs/oa/oa_design_audit_bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .dialog-content {
    background: #ffffff;
    border-radius: 20px;
    margin: 0 auto;
    padding-top: 20px;
    box-sizing: border-box;
  }
}
</style>

<style scoped>
:deep(.el-form--inline .el-form-item) {
  margin-right: 15px !important;
}

:deep(.el-form-item__content) {
  display: flex;
  align-items: flex-start;
  /* 将内容对齐方式设置为顶部对齐 */
}

:deep(.el-input-group__append) {
  padding: 0 10px !important;
}
</style>
<style lang="scss">
.planningTimeDatePicker {
  .el-date-editor .el-input__icon {
    display: none;
  }

  .el-date-editor .el-range-separator {
    width: 10px;
    display: flex;
    flex: 0;
    padding-left: 8px;
    padding-right: 8px;
  }

  .el-input__wrapper {
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>
