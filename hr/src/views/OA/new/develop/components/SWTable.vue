<template>
  <div>
    <el-table ref="SWTableRef" class="SWCommonTable" :data="tableList" width="100%" :show-overflow-tooltip="false"
      v-loading="loading" v-horizontal-scroll="'always'" row-class-name="commonTableRow"
      :header-cell-style="appStore.headerCellStyle" :highlight-current-row="true"
      @selection-change="handleSelectionChange" @cell-click="handleCellClick" @sort-change="handleSortChange">
      <!-- <el-table-column v-hasPermi="['oa:newDevelop:addCompetitive']" type="selection" width="55" /> -->

      <el-table-column v-for="field in showTableColumns" :key="field.id" :prop="field.code" :label="field.name"
        :sortable="field.supportSort"
        :show-overflow-tooltip="field.code === 'planName' || field.code === 'store' ? true : false"
        :min-width="getMinWidth(field)">
        <template #header>
          <div class="table-header" v-if="field.placeholder">
            <!-- v-if="
              field.code === 'planCode' ||
              field.code === 'category' ||
              field.code === 'classCode' ||
              field.code === 'competitorsInfo'
            " -->
            <span class="label">{{ field.name }}</span>
            <!-- <el-tooltip class="box-item" effect="dark" :content="field.placeholder" placement="top">
              <el-icon color="#C1CEE1">
                <QuestionFilled />
              </el-icon>
            </el-tooltip> -->
          </div>
        </template>
        <template #default="{ row }">
          <div v-if="field.code === 'customWarn' && row.newProgress === '1'" class="row-center">
            <div class="messageWarn">
              <div class="messageWarn-text">新进度！</div>
            </div>
          </div>

          <div v-else-if="field.code === 'progressBoard'"
            style="font-size: 14px; color: #0064ff; line-height: 20px; cursor: pointer">
            <div class="row-center" @click="handleDevelopProgress(row)">
              <span style="color: #0064ff"> 查看</span>
              <el-icon color="#0064FF" style="margin-left: 5px">
                <View />
              </el-icon>
            </div>
          </div>

          <span :class="[field.edit ? 'table-edite' : '']" v-if="
            (field.code === 'planName' ||
              field.code === 'store' ||
              field.code === 'planCode' ||
              field.code === 'competitorsInfo' ||
              field.code === 'progressTemplate' ||
              field.code === 'category' ||
              field.code === 'planType' ||
              field.code === 'operationAction' ||
              field.code === 'productType' ||
              field.code === 'planProductType' ||
              field.code === 'productGrade' ||
              field.code === 'isCore' ||
              field.code === 'classCode' ||
              field.code === 'designPictureCon' ||
              field.code === 'npSupplierMappingRespVos') &&
            !isEditable(row, field.code)
          " @click="handleCell(field.code, row)">
            <span v-if="field.code === 'category'">
              <!-- {{ formatCategory(row[field.code]) }} -->
              {{ row.completeCategoryName || '-'}}
            </span>
            <div v-else-if="field.code === 'store'" class="row-center">
              <img v-if="row.channel && getImageUrl(row.channel)" style="width: 14px; height: 14px; margin-right: 8px"
                :src="getImageUrl(row.channel)" alt="" />
              <div :style="{
                width: row.channel && getImageUrl(row.channel) ? 'calc(100% - 22px)' : '100%'
              }" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
                {{ row.storeName || row[field.code] }}
              </div>
            </div>
            <PlanType v-else-if="
              field.code === 'planType' ||
              field.code === 'productType' ||
              field.code === 'planProductType'
            " :fieldCode="field.code" :planType="row[field.code]" />
            <!-- <span v-else-if="field.code === 'productType'"
              >{{ formatProductType(row[field.code], field) }}
            </span> -->
            <span v-else-if="field.code === 'productGrade' || field.code === 'isCore'">
              <span> {{ getDictLabel(DICT_TYPE.NP_PRODUCTGRADE, row[field.code]) || '--' }}</span>
            </span>
            <span v-else-if="field.code === 'operationAction'" style="position: relative; cursor: pointer"
              @click="getOpenOperationDrawerFunction(row)">
              <!-- 展示运营状态 -->
              <span class="operation-status" :style="{
                backgroundColor:
                  row.operationStatus === '1'
                    ? '#0265FF'
                    : row.operationStatus === '2'
                      ? '#F68D18'
                      : row.operationStatus === '3'
                        ? '#03AC16'
                        : '#BBBBBB'
              }">{{
                row.operationStatus === '1'
                  ? '未开始'
                  : row.operationStatus === '2'
                    ? '进行中'
                    : row.operationStatus === '3'
                      ? '已结束'
                      : '未指派'
              }}</span>

              <!-- 只有【运营负责人】才能维护运营信息 -->
              <img src="@/assets/imgs/oa/develop/status_1.png" v-if="row.operationStatus === '1'"
                class="operation-status-icon" alt="" />
              <img src="@/assets/imgs/oa/develop/status_2.png" v-else-if="row.operationStatus === '2'"
                class="operation-status-icon" alt="" />
              <img src="@/assets/imgs/oa/develop/status_3.png" v-else-if="row.operationStatus === '3'"
                class="operation-status-icon" alt="" />

              <img src="@/assets/imgs/oa/develop/status_0.png" v-else class="operation-status-icon" alt="" />
            </span>
            <div v-else-if="field.code === 'planCode' || field.code === 'planName'" class="row-center">
              <div :style="field.code === 'planName' ? 'color: #0064ff;cursor: pointer;font-weight: 500;' : ''"
                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis" class="text1">
                {{ row[field.code] }}</div>
              <img style="cursor: pointer; margin-left: 6px; width: 10px; height: 10px"
                src="@/assets/imgs/common/copy.png" alt="" @click.stop.prevent="copyText(row[field.code])" />
            </div>

            <span v-else :class="[
              field.code === 'planName' ||
                field.code === 'competitorsInfo' ||
                field.code === 'progressTemplate'
                ? 'linkColor'
                : ''
            ]">
              <div v-if="field.code === 'npSupplierMappingRespVos'" class="row-center npSupplierMappingRespVos">
                <el-popover placement="right" :width="480" trigger="hover" :popper-style="{ backgroundColor: '#fff' }"
                  v-if="
                    row.npSupplierMappingRespVos &&
                    row.npSupplierMappingRespVos !== '[]' &&
                    row.npSupplierMappingRespVos.length > 0
                  ">
                  <div>
                    <SupplierCount :list="row.npSupplierMappingRespVos" />
                  </div>

                  <template #reference>
                    <span style="color: #0064ff; cursor: pointer">
                      {{
                        row.npSupplierMappingRespVos && row.npSupplierMappingRespVos.length
                      }}</span>
                  </template>
                </el-popover>
                <span v-else>{{
                  (row.npSupplierMappingRespVos &&
                    row.npSupplierMappingRespVos !== '[]' &&
                    row.npSupplierMappingRespVos.length) ||
                  0
                }}</span>
              </div>
              <div v-else-if="field.code === 'designPictureCon'" class="row-center">
                <el-popover placement="right" :width="725" trigger="hover" popper-class="npSupplierMapping-popover"
                  v-if="row.designPictureGodownList && row.designPictureGodownList.length > 0">
                  <div>
                    <DesignInfo :list="row.designPictureGodownList" />
                  </div>
                  <template #reference>
                    <span style="color: #0064ff; cursor: pointer">
                      {{ row.designPictureGodownList && row.designPictureGodownList.length }}</span>
                  </template>
                </el-popover>
                <span v-else>{{ row.designPictureCon || 0 }}</span>
              </div>
              <div v-else-if="field.code === 'classCode'" class="row-center">
                <div class="row-center">
                  <div class="textWrap text2"> {{ row[field.code] }} </div>
                  <el-popover v-if="row[field.code]" placement="bottom" popper-class="npSupplierMapping-popover"
                    :width="200" trigger="hover">
                    <div class="salePointBg">
                      <div class="salePointBg-title" style="color: #333333">卖点</div>
                      <div v-if="row.salePoint" class="salePointBg-content" v-html="row.salePoint"></div>
                      <div v-else class="salePointBg-content" style="margin-top: 5px; margin-left: -6px">【--】</div>
                    </div>
                    <template #reference>
                      <el-icon color="#C1CEE1" style="margin-left: 5px">
                        <QuestionFilled />
                      </el-icon>
                    </template>
                  </el-popover>
                </div>
              </div>
              <span v-else class="textWrap" :class="{ text2: field.code === 'planName' }">
                {{ row[field.code] || '--' }}</span>
            </span>
          </span>
          <!-- 产品图参考 -->
          <div v-else-if="field.code === 'productDiagramReference'">
            <el-image style="width: 100px;z-index:999" :preview-teleported="true"  :src="row[field.code]" :preview-src-list="[row[field.code] || '']" fit="cover"/>
          </div>
          <!-- 时间格式化 -->
          <span class="table-edite" v-else-if="
            (field.code === 'listingDate' || field.code === 'firstOrderTime' || field.code === 'designPictureDeadline') &&
            !isEditable(row, field.code)
          " @click="handleDoubleClick(row, field.code, field.edit)">
            {{ formatCustomDate(row[field.code]) }}
          </span>
          <span class="table-edite" v-else-if="
            !isEditable(row, field.code) &&
            field.type !== 8 &&
            field.code !== 'customWarn' &&
            field.code !== 'progressBoard'
          " @click="handleDoubleClick(row, field.code, field.edit)">
            {{ formatTableValue(row, field.code) }}
          </span>
          <!-- 设计师/买手 -->
          <!-- <span class="table-edite" v-else-if="
            !isEditable(row, field.code) && field.type === 8 && field.code === 'designer'
          " @click="handleDoubleClick(row, field.code, field.edit)">
            <el-tooltip content="设计图交付截止时间:2025-10-11" placement="bottom">
              <SWSelectPeople :isEdit="false" v-if="row[`${field.code}List`] && row[`${field.code}List`].length > 0"
                v-model:modelValue="row[`${field.code}List`]" @handle-focus="handleCellClick(row)" />
              <div v-else>--</div>
            </el-tooltip>
          </span> -->
          <!-- 选择人员 只有产研主管才能维护设计师/买手-->
          <!-- <div v-if="isEditable(row, field.code) && field.type === 8 && field.code === 'designer'">
            <el-tooltip content="设计图交付截止时间:2025-10-11" placement="bottom">
              <SWSelectPeople :isEdit="true" v-model:modelValue="row[`${field.code}List`]" type="operate"
                :getSearchList="remoteMethodDesigner" @save-select-people="saveSelectPeople(row, field.code)"
                @handle-focus="handleCellClick(row)" />
            </el-tooltip>
          </div> -->

          <!-- 运营负责人 只有运营主管才能维护运营负责人 -->
          <span class="table-edite" v-else-if="
            !isEditable(row, field.code) && field.type === 8 && field.code === 'operationManager'
          " @click="handleDoubleClick(row, field.code, field.edit)">
            <SWSelectPeople :isEdit="false" v-if="row[`${field.code}List`] && row[`${field.code}List`].length > 0"
              v-model:modelValue="row[`${field.code}List`]" @handle-focus="handleCellClick(row)" />
            <div v-else>--</div>
          </span>
          <!-- 选供专员 -->
          <!-- <div v-if="
            isEditable(row, field.code) &&
            field.type === 8 &&
            field.code === 'chosenSupplierStaffId'
          " @click="handleDoubleClickChosenSupplierStaff(row, field.code, field.edit)">
            <SWSelectPeople :isEdit="true" v-model:modelValue="row[`${field.code}List`]" type="operate"
              :getSearchList="remoteMethodChosenSupplierStaffId" @save-select-people="saveSelectPeople(row, field.code)"
              @handle-focus="handleCellClick(row)" />
          </div> -->

          <!-- 版师 -->
          <!-- <span class="table-edite" v-if="
            !isEditable(row, field.code) && field.type === 8 && field.code === 'patternMakerId'
          " @click="handleDoubleClick(row, field.code, field.edit)">
            <SWSelectPeople :isEdit="false" v-if="row[`${field.code}List`] && row[`${field.code}List`].length > 0"
              v-model:modelValue="row[`${field.code}List`]" @handle-focus="handleCellClick(row)" />
            <div v-else>--</div>
          </span>
          <div v-if="
            isEditable(row, field.code) && field.type === 8 && field.code === 'patternMakerId'
          ">
            <SWSelectPeople :isEdit="true" v-model:modelValue="row[`${field.code}List`]" type="operate"
              :getSearchList="remoteMethodDesigner" @selectPeopleChange="saveSelectPeople(row, field.code)"
              @handle-focus="handleCellClick(row)" @save-select-people="row.editeCode = undefined" />
          </div> -->

          <!-- <span class="table-edite" v-else-if="
            !isEditable(row, field.code) &&
            field.type === 8 &&
            field.code === 'chosenSupplierStaffId'
          " @click="handleDoubleClickChosenSupplierStaff(row, field.code, field.edit)">
            <SWSelectPeople :isEdit="false" v-if="row[`${field.code}List`] && row[`${field.code}List`].length > 0"
              v-model:modelValue="row[`${field.code}List`]" @handle-focus="handleCellClick(row)" />
            <div v-else>--</div>
          </span> -->

          <div v-if="
            isEditable(row, field.code) && field.type === 8 && field.code === 'operationManager'
          ">
            <SWSelectPeople :isEdit="true" v-model:modelValue="row[`${field.code}List`]" type="operate"
              :getSearchList="remoteMethodOperation" @save-select-people="saveSelectPeople(row, field.code)"
              @handle-focus="handleCellClick(row)" />
          </div>

          <!-- 文本编辑 -->
          <el-input v-if="isEditable(row, field.code) && field.type === 0" class="table-input" v-model="row[field.code]"
            :placeholder="field.placeholder || placeholderMap(field.type)" :maxlength="field.maxLength"
            @keyup.enter="handleBlur(row, field.code)" @blur="handleBlur(row, field.code)" clearable />
          <!-- 数字 -->
          <el-input v-if="isEditable(row, field.code) && field.type == 1" class="table-input" v-model="row[field.code]"
            type="number" :min="0" :maxlength="field.maxLength" @keyup.enter="handleBlur(row, field.code)"
            @blur="handleBlur(row, field.code)" :placeholder="field.placeholder || placeholderMap[field.type]"
            clearable />
          <!-- 单选 -->
          <el-select v-model="row[field.code]" v-if="isEditable(row, field.code) && field.type === 2"
            :placeholder="field.placeholder || placeholderMap[field.type]" clearable value-on-clear=""
            @visible-change="(val) => handleVisibleChange(row, field.code, val)" @clear="handleBlur(row, field.code)">
            <el-option v-for="dict in field.options || []" :key="dict.code" :label="dict.value" :value="dict.code" />
          </el-select>
          <!-- 日期 -->
          <el-date-picker style="width: 100%"
            v-if="isEditable(row, field.code) && (field.type === 4 || field.type === 5)" v-model="row[field.code]"
            :type="field.type === 4 ? 'date' : 'datetime'"
            :value-format="field.type === 4 ? 'YYYY-MM-DD' : 'yyyy-MM-dd HH:mm:ss'"
            :placeholder="field.placeholder || placeholderMap[field.type]" @change="handleBlur(row, field.code)"
            @blur="handleBlur(row, field.code)" />
        </template>
      </el-table-column>
      <el-table-column :width="240" align="center" label="设计组" fixed="right">
        <el-table-column :width="120" align="center" label="设计师/买手">
          <template #default="{ row }">
            <div class="row-center">
              <ListPersonShow :list="row.designerList || []" />
            </div>
          </template>
        </el-table-column>
        <el-table-column :width="120" align="center" label="版师">
          <template #default="{ row }">
            <div class="row-center">
              <ListPersonShow :list="row.patternMakerIdList || []" />
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column :width="240" align="center" label="生产组" fixed="right">
        <el-table-column :width="120" align="center" label="供应链开发">
          <template #default="{ row }">
            <div class="row-center">
              <ListPersonShow :list="row.chosenSupplierStaffIdList || []" />
            </div>
          </template>
        </el-table-column>
        <el-table-column :width="120" align="center" label="工艺师">
          <template #default="{ row }">
            <div class="row-center">
              <ListPersonShow :list="row.workmanshipIdList || []" />
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column :width="120" align="center" label="运营组" fixed="right">
        <el-table-column :width="120" align="center" label="运营负责人">
          <template #default="{ row }">
            <div class="row-center">
              <ListPersonShow :list="row.operateManages || []" />
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column :width="120" align="center" label="项目经理" fixed="right">
        <template #default="{ row }">
          <div class="row-center">
            <ListPersonShow :list="row.projectManagerList || []" />
          </div>
        </template>
      </el-table-column>
      <!-- 添加操作列 -->
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <el-button v-hasPermi="['oa:newPlan:designGallery']" link type="primary" @click="handleDesignGallery(row)"
            style="color: #0064ff">设计图库</el-button>
          <el-button link type="primary" @click="handleMemberAllocation(row)" style="color: #0064ff">人员分配</el-button>
          <!-- <el-button
            v-if="row.isShowMatchSupplier"
            style="color: #0064ff"
            link
            type="primary"
            @click="handleMatchSuppier(row)"
            >匹配供应商</el-button
          > -->
          <el-button v-if="row.displayRecycleButton" link type="primary"
            @click="handleBusinessRecycle(row)">商企回收</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total" />
    </div>
    <!-- 运营信息弹窗 -->
    <AddOperationDrawer ref="addOperationDrawer" @update="handleOperationDrawerUpdate" />
    <MatchSuppierDrawer ref="matchSuppierDrawerRef" @confirm-success="getList" />
    <SuppierVerifyPriceDialog ref="suppierVerifyPriceDialogRef" />
    <ReMatchSuppierDialog ref="reMatchSuppierDialogRef" />
    <BusinessRecycleDialog ref="businessRecycleDialogRef" @confirm="getList" />
    <MemberAllicationDialog ref="memberAllicationDialogRef" @confirm="getList" />
  </div>
</template>

<script lang="ts" setup>
const message = useMessage() // 消息弹窗
const router = useRouter()
import { Right, View } from '@element-plus/icons-vue'
import { getDictDataPage } from '@/api/system/dict/dict.data'
import { getIntDictOptions, DICT_TYPE, getDictLabel } from '@/utils/dict'
import { handleJSONParse } from '@/views/OA/new/product/utils.js'
import { useCategoryList } from '../hooks.js'
import { checkPermi } from '@/utils/permission'
import { getImageUrl } from '@/utils'
import { copyText } from '@/utils/copyText.js'
import { updateDevelopProgress } from '@/api/oa/new/develop'
import { formatCustomDate, placeholderMap } from '../utils.js'
import SWSelectPeople from './SWSelectPeople.vue'
import AddOperationDrawer from './addOperationDrawer.vue'
import MatchSuppierDrawer from './matchSuppierDrawer.vue'
import SuppierVerifyPriceDialog from './suppier‌VerifyPriceDialog.vue'
import ReMatchSuppierDialog from './reMatchSuppierDialog.vue'
import MemberAllicationDialog from './memberAllicationDialog.vue'
import SupplierCount from './supplierCount.vue'
import DesignInfo from './designInfo.vue'
import ListPersonShow from './listPersonShow.vue'

import PlanType from '@/views/OA/new/components/planType.vue'
import BusinessRecycleDialog from '@/views/OA/new/plan/components/businessRecycleDialog.vue'

import * as CommonApi from '@/api/common'
import * as SystemConstantApi from '@/api/system/systemConstant'

import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()

const { categoryList, initSelectData } = useCategoryList()
// 定义类型
interface Field {
  id: string
  listDisplay: boolean
  name: string
  code: string
  state: number
  type: number
  supportSort: boolean
  dictCode: string
  options: any[]
  maxLength: string
  placeholder: string
  edit: boolean
}

const addForm = ref({
  operate: ''
})

const getMinWidth = (field: Field) => {
  switch (field.code) {
    case 'designPictureDeadline':
      return 150
    case 'isCore':
      return 130
    case 'customWarn':
      return 80
    case 'planCode':
      return 220
    case 'planName':
      return 300
    case 'store':
      return 220
    default:
      return field.type === 8 ? 250 : 120
  }
}

const getPersonalInfo = (row) => {
  let submitPersonList = handleJSONParse(row.submitPersonList) || {}
  if (submitPersonList && submitPersonList.length > 0) {
    return submitPersonList[0]
  }
  return submitPersonList
}

const currentPage = ref(1)
const pageSize = ref(10)

const props = defineProps({
  tableColumns: {
    type: Array as PropType<Field[]>,
    default: () => []
  },
  tableData: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  isShowSupplyChainChosen: {
    type: Boolean,
    default: false
  },
  total: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  }
})
// 品类
const formatCategory = (code) => {
  const item = categoryList.value.find((item) => item.code === code)
  return item ? item.name : '--'
}
// 企划类型
const formatPlanType = (value, field) => {
  const item = field.options.find((item) => item.code === value)
  return item ? item.value : '--'
}
// 类型
const formatProductType = (value, field) => {
  const item = field.options.find((item) => item.code === value)
  return item ? item.value : '--'
}

const tableList = ref<any[]>([])
watch(
  () => props.tableData,
  (newData) => {
    tableList.value = [...newData]
  },
  { immediate: true }
)
// 获取字典值
interface DicItem {
  id: string
  name: string
}

const dicList = ref<DicItem[]>([])

const initDicList = async () => {
  const params = {
    page: 1,
    size: 1000,
    type: 1
  }
  const res = await getDictDataPage(params)
  dicList.value = res.data || []
}
const formatTableValue = (row, code) => {
  let value = row[code]
  const column = showTableColumns.value.find((item) => item.code === code)
  // console.log(column?.options)
  // 检查是否是单选类型且dictCode有值
  if (column?.type === 2 && column.dictCode) {
    // 使用字典值来查找对应的选项
    let dictData = dicList.value.find((dict) => dict.id == column.dictCode)
    if (dictData) {
      const dictName = getDictLabel(dictData.code, value)

      if (dictName) {
        return dictName || ''
      }
      // 处理自定义选项的情况
      const selectItem = column.options?.find((item) => item.code === value || item.value === value)
      return selectItem ? selectItem.value : '--'
    } else {
      // 处理自定义选项的情况
      const selectItem = column.options?.find((item) => item.code === value || item.value === value)
      return selectItem ? selectItem.value : '--'
    }
  } else if (column?.type === 2) {
    // 处理自定义选项的情况
    const selectItem = column.options?.find((item) => item.code === value || item.value === value)
    return selectItem ? selectItem.value : '--'
  }

  // 其他类型直接返回值
  return value || '--'
}
// 判断是否编辑状态
const isEditable = (row, key) => {
  return row['editeCode'] === key
}
const handleCell = (key: string, row: any) => {
  if (key === 'planName' || 'competitorsInfo' || 'progressTemplate') {
    emit('openHandle', row, key)
  }
}

// 列表展示 && 启用状态
const showTableColumns = computed(() => {
  // 如果type为2或者3，但是options为null，则需要根据dictCode获取options
  props.tableColumns.forEach((item) => {
    if ((item.type === 2 || item.type === 3) && !item.options) {
      let dictData = dicList.value.find((dict) => dict.id == item.dictCode)
      if (dictData) {
        item.options = getIntDictOptions(dictData.code, true)
        // console.log('item.options', item.options);
      }
    }
  })
  let list = props.tableColumns.filter((item) => item.listDisplay && item.state == 1)
  let contactList = [] as any
  list.forEach((item) => {
    contactList.push(item)
    if (item.code === 'designPictureCon') {
      // contactList.push({
      //   id: '1',
      //   name: '供应商数',
      //   code: 'npSupplierMappingRespVos',
      //   type: 1
      // })
    } else if (item.code === 'designer') {
      contactList.push({
        id: '2',
        name: '选供专员',
        code: 'chosenSupplierStaffId',
        type: 8,
        edit: true
      })
    }
  })

  return contactList || []
})

const getList = () => {
  emit('getList')
}

const emit = defineEmits([
  'pageChange',
  'sortChange',
  'doubleClick',
  'blur',
  'saveDesigner',
  'saveChosenSupplierStaff',
  'openHandle',
  'handleSelectionChange',
  'updateProgress',
  'getList',
  'savePatternMaker',
  'sortChange'
])

const handleSizeChange = (val: number) => {
  pageSize.value = val
  emit('pageChange', { page: currentPage.value, size: val })
}

const handleSortChange = ({column, prop, order}) => {
  if(!order) {
    emit('sortChange', {sortField: null, sortOrder: null })
    return
  }
  emit('sortChange', {sortField: prop, sortOrder: order === 'ascending' ? 'asc' : 'desc'})
}

// 分页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  emit('pageChange', { page: val, size: pageSize.value })
}

const handleDoubleClick = (row: any, key: string, edit: boolean) => {
  handleCellClick(row)
  if (!checkPermi(['oa:newDevelop:clickEdit'])) {
    return
  }
  if (key === 'designer') {
    // 只有【产研主管】才能维护设计师/买手
    // if (!checkPermi(['oa:newDevelop:designerBuyerMaintain'])) {
    //   return message.error('您没有权限维护设计师/买手')
    // }
    // if(Number(row.operationStatus) < 3){
    //   return message.error('请先完成运营状态')
    // }
  }
  if (key === 'operationManager') {
    // 只有【运营主管】才能维护运营负责人
    if (!checkPermi(['oa:newDevelop:maintainLeader'])) {
      return message.error('您没有权限维护运营负责人')
    }
    if (row.operationStatus === '3') {
      return message.error('运营状态为已结束，无法编辑运营负责人')
    }
  }

  if (edit) {
    row.editeCode = key
  }
  console.log('点击', key, edit)
}

const handleDoubleClickChosenSupplierStaff = (row: any, key: string, edit: boolean) => {
  handleCellClick(row)

  if (edit && row.isChangeSupplyChainChosen) {
    row.editeCode = key
  }
}
const handleBlur = (row, key) => {
  row.editeCode = undefined
  emit('blur', row, key)
}

// 运营信息 提交
const handleOperationDrawerUpdate = (data: any) => {
  console.log('触发提交事件', data)
  emit('blur', data, '')
}
const handleVisibleChange = (row, key, val) => {
  if (!val) {
    row.editeCode = undefined
    emit('blur', row, key)
  }
}

// 选中的table数据
const selectTableValue = ref([])
const handleSelectionChange = (value) => {
  selectTableValue.value = value
  emit('handleSelectionChange', selectTableValue.value)
  console.log(value)
}

const handleDesignGallery = (row: any) => {
  if (row.productType && row.designer) {
    if (Number(row.designPictureCon || '') > 0) {
      router.push({
        name: 'DesignGallery',
        query: {
          planId: row.npBusinessEnterprisePlanId || '',
          developId: row.id || '',
          designPictureCon: row.designPictureCon,
          productNumber: row.planCode
        }
      })
    } else {
      router.push({
        name: 'DesignGallery',
        query: {
          planId: row.npBusinessEnterprisePlanId || '',
          developId: row.id || '',
          designPictureCon: row.designPictureCon,
        }
      })
    }
  } else {
    if (!row.productType) {
      ElMessage.warning('请先选择类型')
      return
    }
    if (!row.designer) {
      ElMessage.warning('请先指派设计师/买手')
      return
    }
  }
}

const matchSuppierDrawerRef = ref()
const suppierVerifyPriceDialogRef = ref()
const reMatchSuppierDialogRef = ref()
//匹配供应商

const handleMatchSuppier = (row: any) => {
  matchSuppierDrawerRef.value?.open(row)
  // suppierVerifyPriceDialogRef.value?.open(row)
  // reMatchSuppierDialogRef.value?.open(row)
}

const memberAllicationDialogRef = ref()
// 人员分配
const handleMemberAllocation = (row: any) => {
  memberAllicationDialogRef.value?.open(row)
}

const designerOpenIds = ref('')
// 获取设计师/买手-产研部门
const remoteMethodDesigner = async (value) => {
  if (!designerOpenIds.value) {
    designerOpenIds.value = await SystemConstantApi.getSystemConstantConfigbyCode(
      'NEW_PRODUCT_DEPT_DEVELOP'
    ).catch((e) => { })
  }

  const data = await CommonApi.getPersonByOpenId(designerOpenIds.value).catch(() => { })
  return data || []
}

const chosenSupplierStaffIdOpenIds = ref('')

// 选供专员
const remoteMethodChosenSupplierStaffId = async (value) => {
  if (!chosenSupplierStaffIdOpenIds.value) {
    chosenSupplierStaffIdOpenIds.value = await SystemConstantApi.getSystemConstantConfigbyCode(
      'NEW_PRODUCT_DEPT_SUPPLY'
    ).catch((e) => { })
  }

  const data = await CommonApi.getPersonByOpenId(chosenSupplierStaffIdOpenIds.value).catch(() => { })
  return data || []
}

// 获取运营部门
const operationOpenIds = ref('')
const remoteMethodOperation = async (value) => {
  if (!operationOpenIds.value) {
    operationOpenIds.value = await SystemConstantApi.getSystemConstantConfigbyCode(
      'NEW_PRODUCT_DEPT_OPERATION'
    ).catch((e) => { })
  }

  const data = await CommonApi.getPersonByOpenId(operationOpenIds.value).catch(() => { })
  return data || []
}

const saveSelectPeople = async (row, fieldCode) => {
  row.editeCode = undefined
  row[`${fieldCode}`] =
    (row[`${fieldCode}List`] && row[`${fieldCode}List`].map((item) => item.userId).join(',')) ||
    undefined
  if (fieldCode === 'operationManager') {
    if (row.operationManager == null || row.operationManager === '') return

    // 判断当前运营状态只要不是0，就不要修改状态
    if (row.operationStatus === '0') {
      row.operationStatus = '1'
    }
  }
  if (fieldCode === 'chosenSupplierStaffId') {
    emit('saveChosenSupplierStaff', row, '')
    return
  }

  // 版师
  if (fieldCode === 'patternMakerId') {
    emit('savePatternMaker', row, '')
    return
  }
  emit('saveDesigner', row, '')
}

// 打开运营信息弹窗
const getOpenOperationDrawerFunction = (row: any) => {
  if (row.operationStatus === '1' || row.operationStatus === '2') {
    return openOperationDrawer(row, 'edit')
  } else if (row.operationStatus === '3') {
    return openOperationDrawer(row, 'view')
  }
}

const addOperationDrawer = ref()
const openOperationDrawer = (row: any, type: string) => {
  if (addOperationDrawer.value) {
    console.log('00', props.tableColumns)

    addOperationDrawer.value.open(row, props.tableColumns, type)
  }
}

const handleDevelopProgress = (row: any) => {
  router.push({
    name: 'DevPlanDetail',
    params: {
      developPlanId: row.id || '',
    }, query: {
      planCode: row.planCode || ''
    }
  })
}

const businessRecycleDialogRef = ref()
// 商企回收
const handleBusinessRecycle = (row: any) => {
  row.recycleType = 2
  businessRecycleDialogRef.value?.open(row)
}

onMounted(() => {
  initSelectData()
  initDicList()
})

// 更新当前页
const updateCurrentPage = (page: number) => {
  currentPage.value = page
}
const SWTableRef = ref()
const currentRow = ref()

// 处理点击列事件
const handleCellClick = async (row: any) => {
  currentRow.value = row
  SWTableRef.value?.setCurrentRow(currentRow.value)
  if (Number(row.newProgress || 0) === 1) {
    // 有新提醒
    await updateDevelopProgress({ id: row.id, newProgress: 0 })
    emit('updateProgress', { id: row.id, newProgress: '0' })
  }
}

defineExpose({
  updateCurrentPage
})
</script>

<style lang="scss" scoped>
.operation-status {
  width: 80px;
  height: 32px;
  // background-color: #F68D18;
  display: inline-block;
  line-height: 32px;
  color: white;
  border-radius: 15px;
  text-indent: 6px;
}

.operation-status-icon {
  width: 28px;
  vertical-align: middle;
  position: absolute;
  right: 0;
  top: -4px;
}

.table-header {
  display: flex;
  align-items: center;

  .label {
    padding-right: 5px;
  }
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.table-edite {
  display: inline-block;
  width: 100%;
  // padding: 0 11px;
  // height: 32px;
  line-height: 32px;
  // background-color: #f2f6fc;
}

.editeTable {
  :deep(.el-input__wrapper) {
    box-shadow: none !important;
    border: 1px solid #e5e5e5;
  }
}

.linkColor {
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: #0064ff;
}

.tableValueStyle {
  font-weight: 400;
  font-size: 14px;
  color: #333333;
}

.is-sorted .cell {
  background-color: #f5f5f5;
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
    color: #333333;
    // opacity: 0.9;
  }
}

.messageWarn {
  font-weight: 500;
  font-size: 12px;
  color: #ffffff;
  line-height: 21px;
  height: 21px;
  background: #ff0000;
  border-radius: 100px 6px 0px 100px;

  &-text {
    padding-left: 5px;
    padding-right: 0px;
  }
}

.SupplierCount {
  color: #0064ff;
  cursor: pointer;
}

:deep(p) {
  margin: 0px !important;
  padding: 0px !important;
}

/* 使用/deep/或::v-deep穿透作用域样式 */
:deep(.supplierCountTable .el-table__body tr:hover > td) {
  background-color: #ffffff !important;
  /* 自定义背景色 */
}

:deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid #e5e5e5 !important;
}

:deep(.el-table__inner-wrapper:before) {
  /* background: transparent !important; */
}

/* 隐藏最后一行的分割线 */
/* :deep(.el-table .el-table__body-wrapper .el-table__body tr:last-child td) {
  border-bottom: none !important;
} */
</style>
<style lang="scss" scoped>
.el-table {
  :deep(.el-popper) {
    max-width: 400px !important;
    white-space: pre-wrap !important;
  }
}

:deep(.el-table__body tr.current-row > td.el-table__cell) {
  background-color: rgb(236, 245, 255);
}
</style>