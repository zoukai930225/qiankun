<template>
  <div>
    <stepBox />
    <div class="mainWrap">
      <!-- 搜索工作栏 -->
      <div ref="filterWrapRef" class="filterWrap">
        <el-form ref="queryFormRef" inline :model="queryParams" :label-width="100">
          <el-form-item label="姓名" prop="keyword">
            <el-input
              :prefix-icon="Search"
              class="searchFormItemWidth"
              style="width: 530px"
              v-model="queryParams.keyword"
              placeholder="工号/姓名模糊匹配，多位伙伴请用逗号或者空格分隔"
              clearable
              @keyup.enter="handleQuery"
              @clear="handleQuery"
            />
          </el-form-item>
          <el-form-item label="姓名(反选)" prop="keyword2">
            <el-input
              :prefix-icon="Search"
              class="searchFormItemWidth"
              style="width: 530px"
              v-model="queryParams.keyword2"
              placeholder="工号/姓名模糊匹配，多位伙伴请用逗号或者空格分隔"
              clearable
              @keyup.enter="handleQuery"
              @clear="handleQuery"
            />
          </el-form-item>
          <el-form-item label="所属主体" prop="company">
            <el-select class="searchFormItemWidth" v-model="queryParams.company">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PR_COMPANY)" :label="dict.label" :value="dict.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="部门" prop="departmentId">
            <el-cascader
              v-model="departmentSelectedArr"
              class="searchFormItemWidth"
              filterable
              clearable
              placeholder="请选择部门"
              :props="customProps"
              :options="departmentTreeData"
            />
          </el-form-item>
          <el-form-item label="直接上级" prop="manageId">
            <el-select
              v-model="queryParams.manageId"
              placeholder="请选择"
              clearable
              filterable
              value-on-clear=""
              class="searchFormItemWidth"
              @change="handleQuery"
            >
              <el-option
                v-for="dict in managerList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>

          <!-- 维度结果 -->
          <el-form-item
            :label="item.fieldName"
            :prop="item.fieldId"
            v-for="item in dimensionResultQueryParams"
            :key="item.fieldId"
          >
            <el-select
              v-model="queryParams[item.fieldId]"
              placeholder="请选择"
              clearable
              value-on-clear=""
              class="searchFormItemWidth"
              @change="handleQuery"
            >
              <el-option
                v-for="dict in priorities"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>

          <!-- 九宫格定位 -->
          <el-form-item label="九宫格定位" prop="position">
            <el-select
              v-model="queryParams.position"
              class="searchFormItemWidth"
              placeholder="请选择"
              clearable
              value-on-clear=""
              @change="handleQuery"
            >
              <el-option
                v-for="dict in nineGridOptions"
                :key="dict.id"
                :label="dict.position"
                :value="dict.position"
              />
            </el-select>
          </el-form-item>

          <!-- 校准状态 -->
          <el-form-item label="校准状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择"
              class="searchFormItemWidth"
              clearable
              @change="handleQuery"
            >
              <el-option
                v-for="status in statusOptions"
                :key="status.value"
                :label="status.label"
                :value="status.value"
              >
                <template #default>
                  <div>
                    <img
                      :src="status.image"
                      alt=""
                      style="width: 12px; vertical-align: middle; margin-right: 8px"
                    />
                    {{ status.label }}
                  </div>
                </template>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门名称" prop="departmentStr">
            <el-input
              :prefix-icon="Search"
              class="searchFormItemWidth"
              v-model="queryParams.departmentStr"
              placeholder="请输入部门名称"
              clearable
              @keyup.enter="handleQuery"
              @clear="handleQuery"
            />
          </el-form-item>
        </el-form>

        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <el-button @click="handleQuery" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
              重置
            </el-button>
          </div>
        </div>
      </div>
      <div class="contentWrap">
        <!-- 列表 -->
        <el-table
          ref="sortTableRef"
          :header-cell-style="{ background: '#F2F6FC' }"
          v-loading="loading"
          :data="list"
          :stripe="false"
          row-class-name="commonTableRow "
          class="SWCommonTable"
          v-horizontal-scroll="'always'"
          show-overflow-tooltip
          :max-height="tableMaxHeight"
        >
          <!-- 固定列 -->
          <el-table-column
            prop="name"
            label="姓名"
            min-width="100"
            align="center"
            :fixed="nameFixed"
          >
            <template #header>
              <div class="margin_b fixedTableHeader">
                <div class="fixedHeader" >
                  姓名
                  <!-- <el-icon @click="toggleHeaderFixed('nameFixed')"><Tools /></el-icon> -->
                  <el-tooltip
                    effect="dark"
                    :content="nameFixed? '取消固定':'固定此列'"
                    placement="top"
                  >
                  <img :src="nameFixed? fixedHeadSvg : unfixedHeadSvg" @click="toggleHeaderFixed('nameFixed')"/>
                  </el-tooltip>
                  
                </div>
              </div>
              
            </template>
          </el-table-column>
          <el-table-column
            prop="company"
            label="所属主体"
            min-width="120"
            align="center"
            :fixed="companyFixed"
          >
            <template #header>
              <div class="margin_b fixedTableHeader">
                <div class="fixedHeader" >所属主体
                  <!-- <el-icon @click="toggleHeaderFixed('companyFixed')"><Tools /></el-icon> -->
                  <el-tooltip
                    effect="dark"
                    :content="companyFixed? '取消固定':'固定此列'"
                    placement="top"
                  >
                  <img :src="companyFixed? fixedHeadSvg : unfixedHeadSvg" @click="toggleHeaderFixed('companyFixed')"/>
                  </el-tooltip>
                </div>
              </div>
            </template>
            <template #default="{ row }">
              {{ getDictLabel(DICT_TYPE.PR_COMPANY,row.company) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="departmentName"
            label="部门"
            min-width="120"
            align="center"
            :fixed="deptFixed"
          >
            <template #header>
              <div class="margin_b fixedTableHeader">
                <div class="fixedHeader" >部门
                  <!-- <el-icon @click="toggleHeaderFixed('deptFixed')"><Tools /></el-icon> -->
                  <el-tooltip
                    effect="dark"
                    :content="deptFixed? '取消固定':'固定此列'"
                    placement="top"
                  >
                    <img :src="deptFixed? fixedHeadSvg : unfixedHeadSvg" @click="toggleHeaderFixed('deptFixed')"/>
                  </el-tooltip>
                  
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="managerName"
            label="直接上级"
            min-width="120"
            align="center"
            :fixed="manaFixed"
          >
            <template #header>
              <div class="margin_b fixedTableHeader">
                <div class="fixedHeader" >直接上级
                  <!-- <el-icon @click="toggleHeaderFixed('manaFixed')"><Tools /></el-icon> -->
                  <el-tooltip
                    effect="dark"
                    :content="manaFixed? '取消固定':'固定此列'"
                    placement="top"
                  >
                    <img :src="manaFixed? fixedHeadSvg : unfixedHeadSvg" @click="toggleHeaderFixed('manaFixed')"/>
                  </el-tooltip>
                  
                </div>
              </div>
            </template>
            
          </el-table-column>
          <el-table-column
            prop="personalScore"
            label="个人绩效"
            min-width="120"
            align="center"
            :fixed="personFixed"
          >
            <template #header>
              <div class="margin_b fixedTableHeader">
                <div class="fixedHeader" >
                  个人绩效
                  <!-- <el-icon @click="toggleHeaderFixed('personFixed')"><Tools /></el-icon> -->
                  <el-tooltip
                    effect="dark"
                    :content="personFixed? '取消固定':'固定此列'"
                    placement="top"
                  >
                  <img :src="personFixed? fixedHeadSvg : unfixedHeadSvg" @click="toggleHeaderFixed('personFixed')"/>
                  </el-tooltip>
                  
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 动态列-维度1 -->
          <el-table-column
            min-width="120"
            align="center"
            v-for="(value, key) in dimension1Data"
            :key="key"
          >
            <template #header v-if="key !== '0'">
              <div class="belong margin_t">
                <div class="belong_label">{{ getDimensionValueName(key) }}</div>
              </div>
            </template>
            <el-table-column
              v-for="(item, index) in value"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="120"
              align="center"
            >
              <template #header>
                <DraggableTooltip placement="right" :disabled="!item?.programInfo">
                  <template #content>
                    <tooltipItem :item="item" />
                  </template>
                  <div
                    :class="{ belong: item.belong, margin_b: item.belong }"
                    style="cursor: pointer"
                  >
                    <div class="text1">{{ item.label }}</div>
                  </div>
                </DraggableTooltip>
              </template>
              <template #default="scope">
                <!-- 题目名称 -->
                <!-- <el-tooltip 
                :disabled="!isUpload(scope.row, item.prop)"
                placement="top"
                effect="light"
                :content="isUpload(scope.row, item.prop)">
                  <div
                    @dblclick="
                      scope.row.status == 0 ? handleDoubleClick(scope.row, item.prop) : null
                    "
                    v-if="!scope.row[item.prop + 'Editable']"
                    :style="{
                      color: scope.row.status == 0 ? '#0064ff' : '#333',
                      cursor: scope.row.status == 0 ? 'pointer' : ''
                    }"
                  >
                    {{ scope.row[item.prop] == null ? '-' : scope.row[item.prop] }}
                  </div>
                </el-tooltip> -->
                <div
                  @dblclick="scope.row.status == 0 ? handleDoubleClick(scope.row, item.prop) : null"
                  v-if="!scope.row[item.prop + 'Editable']"
                  :style="{
                    color: scope.row.status == 0 ? '#0064ff' : '#333',
                    cursor: scope.row.status == 0 ? 'pointer' : ''
                  }"
                >
                  {{ scope.row[item.prop] == null ? '-' : scope.row[item.prop] }}
                </div>
                <div
                  v-if="scope.row[item.prop + 'Editable']"
                  style="display: flex; align-items: center; margin-left: 10px"
                >
                  <el-input
                    v-model="scope.row[item.prop]"
                    style="width: 140px"
                    type="number"
                    oninput="if(value.length > 10 || (value.indexOf('.') != -1 && value.slice(value.indexOf('.')).length > 2)) value = value.slice(0, value.length - 1)"
                    :min="0"
                  />
                  <div
                    class="cursor_pointer"
                    style="display: flex; align-items: center; margin-left: 10px"
                  >
                    <img
                      src="@/assets/imgs/common/confirm.svg"
                      @click="saveEdit(scope.row, item.prop)"
                      alt="提交"
                    />
                    <div class="line"> | </div>
                    <img
                      src="@/assets/imgs/common/cancel.svg"
                      @click="concelEdit(scope.row, item.prop)"
                      alt="取消"
                    />
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- 维度1均分 -->
          <el-table-column
            :label="getDimension1Average('label')"
            :prop="getDimension1Average('prop')"
            align="center"
          >
            <template #header>
              <div class="margin_b fixedTableHeader">
                <div>{{ getDimension1Average('label') }}</div>
              </div>
            </template>
          </el-table-column>
          <!-- 维度2 -->
          <el-table-column
            min-width="120"
            align="center"
            v-for="(value, key) in dimension2Data"
            :key="key"
          >
            <template #header v-if="key !== '0'">
              <div class="belong margin_t">
                <div class="belong_label">{{ getDimensionValueName(key) }}</div>
              </div>
            </template>
            <el-table-column
              v-for="(item, index) in value"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="120"
              align="center"
            >
              <template #header>
                <DraggableTooltip placement="right" :disabled="!item?.programInfo">
                  <template #content>
                    <tooltipItem :item="item" />
                  </template>
                  <div
                    :class="{ belong: item.belong, margin_b: item.belong }"
                    style="cursor: pointer"
                  >
                    <div class="text1">{{ item.label }}</div>
                  </div>
                </DraggableTooltip>
              </template>
              <template #default="scope">
                <!-- <el-tooltip 
                :disabled="!isUpload(scope.row, item.prop)"
                placement="top"
                effect="light"
                :content="isUpload(scope.row, item.prop)"
                >
                  <div
                    @dblclick="
                      scope.row.status == 0 ? handleDoubleClick(scope.row, item.prop) : null
                    "
                    v-if="!scope.row[item.prop + 'Editable']"
                    :style="{
                      color: scope.row.status == 0 ? '#0064ff' : '#333',
                      cursor: scope.row.status == 0 ? 'pointer' : ''
                    }"
                  >
                    {{ scope.row[item.prop] == null ? '-' : scope.row[item.prop] }}
                  </div>
                </el-tooltip> -->
                <div
                  @dblclick="scope.row.status == 0 ? handleDoubleClick(scope.row, item.prop) : null"
                  v-if="!scope.row[item.prop + 'Editable']"
                  :style="{
                    color: scope.row.status == 0 ? '#0064ff' : '#333',
                    cursor: scope.row.status == 0 ? 'pointer' : ''
                  }"
                >
                  {{ scope.row[item.prop] == null ? '-' : scope.row[item.prop] }}
                </div>
                <div
                  v-if="scope.row[item.prop + 'Editable']"
                  style="display: flex; align-items: center; justify-content: center"
                >
                  <el-input
                    v-model="scope.row[item.prop]"
                    style="width: 90px"
                    type="number"
                    controls-position="right"
                    oninput="if(value.length > 10 || (value.indexOf('.') != -1 && value.slice(value.indexOf('.')).length > 2)) value = value.slice(0, value.length - 1)"
                    :min="0"
                  />
                  <div
                    class="cursor_pointer"
                    style="display: flex; align-items: center; margin-left: 10px"
                  >
                    <img
                      src="@/assets/imgs/common/confirm.svg"
                      @click="saveEdit(scope.row, item.prop)"
                      alt="提交"
                    />
                    <div class="line"> | </div>
                    <img
                      src="@/assets/imgs/common/cancel.svg"
                      @click="concelEdit(scope.row, item.prop)"
                      alt="取消"
                    />
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <!--  -->
          <el-table-column
            v-for="(item, index) in lastTableDefine"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="120"
            align="center"
          >
            <template #header>
              <div class="margin_b fixedTableHeader">
                <div>{{ item.label }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="九宫格定位" prop="position" align="center" min-width="120">
            <template #header>
              <div class="margin_b fixedTableHeader">
                <div>九宫格定位</div>
              </div>
            </template>
            <template #default="scope">
              {{ scope.row.position || '-' }}
            </template>
          </el-table-column>

          <el-table-column align="center" prop="status" label="校准状态" min-width="100">
            <template #header>
              <div class="margin_b fixedTableHeader"> 校准状态 </div>
            </template>
            <template #default="scope">
              <!-- 校准状态 -->
              <div>
                <div v-if="scope.row.status == 0">
                  <img
                    src="@/assets/imgs/otr/InventoryCalibration/status_danger.png"
                    alt=""
                    style="width: 12px; vertical-align: middle"
                  />
                  未校准</div
                >
                <div v-else-if="scope.row.status == 1">
                  <img
                    src="@/assets/imgs/otr/InventoryCalibration/status_primary.png"
                    alt=""
                    style="width: 12px; vertical-align: middle"
                  />
                  已校准</div
                >
              </div>
            </template>
          </el-table-column>

          <el-table-column fixed="right" width="480" label="操作" align="center">
            <template #header>
              <div class="margin_b fixedTableHeader"> 操作 </div>
            </template>
            <template #default="scope">
              <div class="action-wrap">
                <el-button
                  class="action-edit"
                  link
                  v-hasPermi="['otr_inventory_calibration_datail']"
                  @click="goDetail(scope.row)"
                >
                  评价详情
                </el-button>
                <el-button
                  class="action-edit"
                  link
                  @click="openForm('update', scope.row.appraiseeId, scope.row.status)"
                  >校准意见</el-button
                >
                <el-button
                  class="action-edit"
                  :loading="scope.row.loading"
                  link
                  @click="openConfirmDialog(scope.row)"
                  >校准完成</el-button
                >
                <el-button
                  class="action-edit"
                  link
                  @click="cancelComment(scope.row.appraiseeId)"
                  v-if="scope.row.isScore && checkPermi(['otr_inventory_calibration_reset'])"
                >
                  评价作废
                </el-button>
                <el-button
                  class="action-edit"
                  link
                  @click="resetComment(scope.row.appraiseeId)"
                  v-if="scope.row.isScore && checkPermi(['otr_inventory_calibration_cancel'])"
                >
                  评价还原
                </el-button>

                <el-button class="action-edit" link @click="reportView(scope.row)">
                  报告预览
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <Pagination
          :total="total"
          v-model:page="queryParams.page"
          v-model:limit="queryParams.size"
          @pagination="getList"
        />
      </div>
    </div>
  </div>

  <!-- 九宫格 -->
  <el-popover
    placement="left-end"
    title=""
    :width="544"
    trigger="click"
    :show-arrow="false"
    :popper-style="{ padding: '20px 42px 40px 60px', borderRadius: '30px' }"
  >
    <template #reference>
      <div class="sudoku-btn">
        <img src="@/assets/imgs/otr/InventoryCalibration/sudoku_btn.png" alt="" />
      </div>
    </template>
    <div class="sudoku-content" v-if="nineGridId">
      <Axis :x-axis-name="xnameAxis" :y-axis-name="ynameAxis" />
      <NineGrid
        ref="nineGridRef"
        :id="nineGridId"
        :queryParams="queryParams"
        :nineGridPosition="nineGridPosition"
        @click-item="handleClickNineGrid"
      />
    </div>
  </el-popover>

  <!-- 表单弹窗：添加/修改 -->
  <AddProdForm ref="formRef" @success="getList" />
  <!-- 校准完成 -->
  <confirmDialog
    ref="confirmDialogRef"
    @confirm="handleConfirmComplete"
    :title="'校准完成'"
    :content="'是否确认完成，完成后数据将不可更改！'"
  />

  <!-- 评价作废 -->
  <confirmDialog
    ref="commentDialogRef"
    @confirm="handleCommentConfirm"
    :title="'评价作废'"
    :content="'是否作废该员工的所有评价数据？点击确认后不可反悔！'"
    :inventoryId="inventoryId"
  />
  <!-- 重新评价 -->
  <!-- <confirmDialog
    ref="reCommentDialogRef"
    @confirm="handleReCommentConfirm"
    :title="'评价作废'"
    :content="'是否需要邀请已维护评价关系的其他员工对该员工进行重新评价?'"
  /> -->
  <DetailDialog ref="detailDialogRef" @success="getList" />

  <!-- 九宫格落位 点击弹窗 -->
  <nineGridDialog ref="nineGridDialogRef" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as DeptApi from '@/api/system/dept'
import confirmDialog from './components/confirmDialog.vue'
import NineGrid from './components/nineGrid.vue'
import Axis from './components/axis.vue'
import nineGridDialog from './components/nineGridDialog.vue'
import DetailDialog from '../reviewInvitation/components/detailDialog.vue'
import AddProdForm from './components/addProdForm.vue'
import { Search } from '@element-plus/icons-vue'
// import { useAppStore } from '@/store/modules/app'
import { useDepartmentStore } from '@/store/modules/dept'
import * as sudokuSetApi from '@/api/otr/sudokuSet'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import * as InventoryCalibrationApi from '@/api/otr/InventoryCalibration'
import status_danger from '@/assets/imgs/otr/InventoryCalibration/status_danger.png'
import status_primary from '@/assets/imgs/otr/InventoryCalibration/status_primary.png'
import fixedHeadSvg from '@/assets/imgs/otr/InventoryCalibration/fixedHead.svg'
import unfixedHeadSvg from '@/assets/imgs/otr/InventoryCalibration/unfixedHead.svg'

import stepBox from '../components/stepBox.vue'
import tooltipItem from './components/tooltipItem.vue'
import DraggableTooltip from './components/draggableTooltip.vue'
import { checkPermi } from '@/utils/permission'

const nineGridRef = ref()

const departmentStore = useDepartmentStore()
const message = useMessage()
// const { t } = useI18n() // 国际化
// const isExpand = ref(false) // 是否展开
// const appStore = useAppStore()
// const addBtnLoading = ref(false)
const route = useRoute()
const inventoryId = (route.query.inventoryId || '') as string

// 查询条件的默认值
const priorities = ref([
  { label: '低', value: '低' },
  { label: '中', value: '中' },
  { label: '高', value: '高' }
])

// 校准状态查询条件
const statusOptions = ref([
  {
    value: '0',
    label: '未校准',
    image: status_danger
  },
  {
    value: '1',
    label: '已校准',
    image: status_primary
  }
])

// 维度一和维度二结果查询条件
const dimensionResultQueryParams = ref([])

// 查询条件 -九宫格定位的下拉
const nineGridOptions = ref([])
const getNineGridOptions = async () => {
  nineGridOptions.value = []
  const res = await sudokuSetApi.getSudokuSetDetailList([nineGridId.value])

  let data = res[nineGridId.value] || []
  const seenPositions = {} // 用于跟踪已添加的position
  nineGridOptions.value = data.reduce((uniqueOptions, item) => {
    // 如果position还没有被添加过，则添加到结果数组中
    if (!seenPositions[item.position]) {
      seenPositions[item.position] = true // 标记position为已添加
      uniqueOptions.push({
        id: item.id,
        position: item.position
      })
    }
    return uniqueOptions
  }, [])
}

// 动态表头
const tableObject = ref<any>([])

// 固定表头
const tableDefine1 = [
  {
    prop: 'name',
    label: '姓名',
    width: '100',
    belong: false,
    align: 'center'
  },
  {
    prop: 'departmentName',
    label: '部门',
    width: '160',
    belong: false,
    align: 'left'
  },
  {
    prop: 'managerName',
    label: '直接上级',
    width: '120',
    belong: false,
    align: 'center'
  },
  {
    prop: 'personalScore',
    label: '个人绩效',
    width: '120',
    belong: false,
    align: 'center'
  }
]
// 动态设置表格列固定 如果固定则左边都固定 如果取消固定则右边都取消固定
const nameFixed = ref(true),companyFixed = ref(true),deptFixed = ref(true),manaFixed = ref(true),personFixed = ref(true)
const toggleHeaderFixed = (key:string)=>{
  if(key === 'nameFixed'){
    nameFixed.value = !nameFixed.value
    if(!nameFixed.value){
      companyFixed.value = false
      deptFixed.value = false
      manaFixed.value = false
      personFixed.value = false
    }
  }
  if( key === 'companyFixed'){
    companyFixed.value = !companyFixed.value 
    if(companyFixed.value){
      nameFixed.value = true
    }
    if(!companyFixed.value ){
      deptFixed.value = false
      manaFixed.value = false
      personFixed.value = false
    }
  }
  if( key === 'deptFixed' ){
    deptFixed.value = !deptFixed.value
    if(deptFixed.value){
      nameFixed.value = true
      companyFixed.value = true
    }
    if(!deptFixed.value){
      manaFixed.value = false
      personFixed.value = false
    }
  }
  if( key === 'manaFixed'){
    manaFixed.value = !manaFixed.value 
    if(manaFixed.value){
      nameFixed.value = true
      companyFixed.value = true
      deptFixed.value = true
    }
    if(!manaFixed.value){
      personFixed.value = false
    }
  }
  if(key === 'personFixed'){
    personFixed.value = !personFixed.value
    if(personFixed.value){
      nameFixed.value = true
      companyFixed.value = true
      deptFixed.value = true
      manaFixed.value = true
    }
  }
}
const dimensionAve = ref<any>({})
const dimension1Data = ref({})
const dimension2Data = ref({})
const lastTableDefine = ref([])
const getDimension1Average = (type) => {
  // console.log('dimensionAve', dimensionAve.value)
  if (type === 'label') {
    return dimensionAve.value.label
  } else {
    // console.log('asaasa', dimensionAve.value.prop)
    return dimensionAve.value.prop
  }
}

// 查询参数
const queryParams = ref({
  page: 1,
  size: 10,
  departmentId: '',
  manageId: '',
  keyword: '',
  keyword2: '',
  inventoryId: inventoryId,
  position: '',
  status: '',
  departmentStr: '',
  company:''
})

// 获取维度值的名称
const getDimensionValueName = (parentId) => {
  // console.log('a', parentId)
  return tableObject.value['0'].find((item) => item.fieldId === parentId)?.fieldName
}

const dimensionList = ref([{}])

dimensionList.value = getIntDictOptions(DICT_TYPE.OTR_PROGRAM_DIMENSION, true)
// console.log('sa', dimensionList.value)
const newTableObject = ref<any>([])
// 获取表头
const getTableHeader = async () => {
  // 清空查询条件
  dimensionResultQueryParams.value = [] as any
  const data = await InventoryCalibrationApi.getCalibrationHeadList({
    inventoryId: inventoryId
  }).catch((err) => {})

  // console.log('data', data)
  // 如果数据不是一个空数组
  if (Object.keys(data).length > 0) {
    // 处理表头数据
    // 创建一个新的对象来存储修改后的数据
    let newData = {}

    // 遍历原始数据的键值对
    Object.entries(data).forEach(([key, value]) => {
      // 创建一个新的数组来存储修改后的条目
      let newValue = value.map((item) => {
        // 创建一个新的对象来存储修改后的条目
        return {
          ...item,
          prop: item.fieldName,
          label: item.fieldName,
          // 为每个条目添加belong属性
          belong: false
        }
      })
      // 如果键值不为'0'，则添加belong属性为true
      if (key !== '0') {
        newValue.forEach((item) => {
          item.belong = true
        })
      }
      // 将修改后的数组赋值给新对象的对应键
      newData[key] = newValue
    })

    // 赋值给tableObject
    tableObject.value = newData

    newTableObject.value = { ...tableObject.value }

    // 获取维度值查询条件
    // 遍历表头数据 -将每一项的value里面的fieldId的值包含result的项赋值给dimensionResultQueryParams
    newTableObject.value['0'].forEach((item) => {
      if (item.fieldId && item.fieldId.includes('result')) {
        dimensionResultQueryParams.value.push(item)
        queryParams.value[item.fieldId] = ''
      }
    })
    console.log('查询条件', dimensionResultQueryParams.value)

    let keyArr = Object.keys(newTableObject.value)

    // console.log('keyArr', keyArr)
    // 遍历对象并删除指定的ID 去掉一级表头
    for (const key in newTableObject.value) {
      newTableObject.value[key] = newTableObject.value[key].filter(
        (item) => !keyArr.some((i) => item.fieldId === i)
      )
    }

    // 删除键为'0'的项
    lastTableDefine.value = newTableObject.value['0']
    // console.log('---aasdsf', lastTableDefine.value)
    // delete newTableObject.value['0']

    // 将newTableObject.value里面剩余的两个键中间的第一个键的值赋值给dimension1Data,dimension1Data是一对象
    // 获取剩余键的数组
    let remainingKeys = Object.keys(newTableObject.value)

    // 选择第一个键
    let firstKey = remainingKeys[1]
    let secondKey = remainingKeys[2]

    // 获取第一个键对应的值
    let firstValue = newTableObject.value[firstKey]
    // 选择第二个键对应的值
    let secondValue = newTableObject.value[secondKey]

    // 将键和值赋给dimension1Data对象
    dimension1Data.value[firstKey] = firstValue
    dimension2Data.value[secondKey] = secondValue

    // console.log('dimension1Data', dimension1Data.value)

    // console.log('tableObject', tableObject.value['0'])

    let dimension1DataName = tableObject.value['0'].find(
      (item) => item.fieldId === dimension1Data.value[firstKey][0].parentId
    )?.fieldId

    // 遍历数组，找到匹配的项并赋值给dimensionAve ---维度1均分
    lastTableDefine.value.forEach((item: any) => {
      if (item.fieldId && item.fieldId.includes(dimension1DataName + '_average')) {
        dimensionAve.value = item
        // console.log('veliveliveli=>', dimensionAve.value)
      }
    })
    console.log('维度1', dimension1Data.value)
    console.log('维度2', dimension2Data.value)

    // 使用filter方法删除匹配的项
    lastTableDefine.value = lastTableDefine.value.filter((item: any) => {
      return item.fieldId && !item.fieldId.includes(dimension1DataName + '_average')
    })

    //  console.log('dimension1DataName',dimension1DataName);
    // 往dimension1Data.value里面塞一个值
    // console.log('最后', lastTableDefine.value)

    // console.log('***', dimension1Data.value)

    // console.log('-----表头', newTableObject.value)
  }
}

// 搜索
const handleQuery = () => {
  console.log('执行搜索')
  queryParams.value.page = 1
  getList()
}

// 列表数据
const loading = ref(false)
const list = ref<any>([])
const total = ref(0)
const nineGridId = ref('')
const nineGridPosition = ref('')
const xnameAxis = ref('')
const ynameAxis = ref('')
// 处理查询条件
const handleQueryParams = (queryParams) => {
  // 处理查询条件
  let tempQueryParams = { ...queryParams }

  // 获取列表中定义的维度1的key
  const dimension1Key = Object.keys(dimension1Data.value)[0]

  // 遍历tempQueryParams，将包含下划线的键转换成JSON字符串
  for (let key in tempQueryParams) {
    if (key.includes('_')) {
      // 根据dimension1Key判断是dimension1还是dimension2
      const dimensionKey = key.includes(dimension1Key) ? 'dimension1' : 'dimension2'
      tempQueryParams[dimensionKey] = JSON.stringify({
        fieldId: key,
        value: tempQueryParams[key]
      })
      // 删除原始的键
      delete tempQueryParams[key]
    }
  }

  return tempQueryParams
}
const getList = async () => {
  loading.value = true
  try {
    // 处理查询条件
    let tempQueryParams = handleQueryParams(queryParams.value)

    // // 获取列表中定义的维度1的key
    // const dimension1Key = Object.keys(dimension1Data.value)[0]

    // // 遍历tempQueryParams，将包含下划线的键转换成JSON字符串
    // for (let key in tempQueryParams) {
    //   if (key.includes('_')) {
    //     // 根据dimension1Key判断是dimension1还是dimension2
    //     const dimensionKey = key.includes(dimension1Key) ? 'dimension1' : 'dimension2'
    //     tempQueryParams[dimensionKey] = JSON.stringify({
    //       fieldId: key,
    //       value: tempQueryParams[key]
    //     })
    //     // 删除原始的键
    //     delete tempQueryParams[key]
    //   }
    // }

    const data = await InventoryCalibrationApi.getCalibrationList(tempQueryParams).catch(() => {})

    // console.log('data', data.data)

    if (data && data.data.length == 0) {
      list.value = []
      total.value = data.total
    }
    if (data && data.data.length > 0) {
      // 保存九宫格id
      nineGridId.value = data.data[0].nineGridId
      // 保存九宫格定位
      nineGridPosition.value = data.data[0].position
      // 保存x轴名称
      xnameAxis.value = data.data[0].xnameAxis
      // 保存y轴名称
      ynameAxis.value = data.data[0].ynameAxis

      // 获取九宫格查询条件列表
      getNineGridOptions()
      // console.log('1', data.data[0].xnameAxis)
      // 处理数据
      data.data.forEach((item) => {
        const dimensionDict = {}
        const dimensionGroups = {}

        item.dimensionList.forEach((dimensionI) => {
          // 添加programId和programScore到dimensionDict
          dimensionDict[dimensionI.programName] = dimensionI.programScore
          // 为dimensionList中的每一项添加OriginalValue属性
          dimensionDict[dimensionI.programName + '_OriginalValue'] = dimensionI.programScore
          // 根据demension分类
          if (!dimensionGroups[dimensionI.dimension]) {
            dimensionGroups[dimensionI.dimension] = []
          }
          dimensionGroups[dimensionI.dimension].push(dimensionI)
        })

        // 加分项
        dimensionDict[item.plusesDimension + '_pluses'] = item.pluses

        // 维度结果

        // dimensionDict[item.xmap?.dimension + '_result'] = item.xmap?.dimensionResult

        // console.log('+++', lastTableDefine.value)
        lastTableDefine.value.find((i: any) => {
          // 维度1结果和维度2结果
          if (i.fieldId) {
            let dimensionResult = null

            // 检查 xmap 是否匹配
            if (i.fieldId === item.xmap?.dimension + '_result' && item.xmap) {
              dimensionResult = item.xmap.dimensionResult
            }
            // 检查 ymap 是否匹配
            else if (i.fieldId === item.ymap?.dimension + '_result' && item.ymap) {
              dimensionResult = item.ymap.dimensionResult
            }

            // 如果 dimensionResult 被设置，则赋值给 dimensionDict
            if (dimensionResult !== null) {
              dimensionDict[i.fieldName] = dimensionResult
            }
          }

          // 维度2均分
          if (i.fieldId) {
            // 检查 xmap 是否匹配
            if (i.fieldId === item.xmap?.dimension + '_average' && item.xmap) {
              dimensionDict[i.fieldName] = item.xmap[item.xmap.dimension + '_average']
            }
            // 检查 ymap 是否匹配
            else if (i.fieldId === item.ymap?.dimension + '_average' && item.ymap) {
              dimensionDict[i.fieldName] = item.ymap[item.ymap.dimension + '_average']
            }
          }
        })
        // 维度1均分
        if (
          dimensionAve.value.fieldId &&
          (dimensionAve.value.fieldId === item.xmap?.dimension + '_average' ||
            dimensionAve.value.fieldId === item.ymap?.dimension + '_average')
        ) {
          // 检查 xmap 是否匹配并赋值
          if (dimensionAve.value.fieldId === item.xmap?.dimension + '_average' && item.xmap) {
            dimensionDict[dimensionAve.value.fieldName] =
              item.xmap[item.xmap.dimension + '_average']
          }
          // 检查 ymap 是否匹配并赋值
          else if (dimensionAve.value.fieldId === item.ymap?.dimension + '_average' && item.ymap) {
            dimensionDict[dimensionAve.value.fieldName] =
              item.ymap[item.ymap.dimension + '_average']
          }
        }

        // dimensionDict[item.ymap?.dimension + '_result'] = item.ymap?.dimensionResult

        // lastTableDefine.value.find((i) => {
        //   if (i.fieldId && i.fieldId === item.ymap?.dimension + '_result') {
        //     dimensionDict[i.fieldName] = item.ymap?.dimensionResult
        //   }
        // })

        // dimensionDict[item.ymap?.dimension + '_result'] = item.ymap?.dimensionResult
        // console.log('___', item.xmap?.dimension + '_average')
        // 维度1均分
        // lastTableDefine.value.find((i) => {
        //   if (i.fieldId && i.fieldId === item.xmap?.dimension + '_average') {
        //     dimensionDict[i.fieldName] = item.xmap[item.xmap?.dimension + '_average']
        //   }
        // })

        // 维度2均分
        // lastTableDefine.value.find((i) => {
        //   if (i.fieldId && i.fieldId === item.ymap?.dimension + '_average') {
        //     dimensionDict[i.fieldName] = item.ymap[item.ymap?.dimension + '_average']
        //   }
        // })

        // // 计算均分并添加到item
        // for (const [groupKey, dimensions] of Object.entries(dimensionGroups)) {
        //   const totalScore = dimensions
        //     .reduce((acc, d) => {
        //       // 检查 d.weight 是否为 null，如果是，则将其视为 100
        //       const weight = d.weight === null ? 100 : d.weight
        //       return acc + (d.programScore * weight) / 100
        //     }, 0)
        //     .toFixed(1) // 四舍五入到一位小数
        //   item[`${groupKey}_average`] = parseFloat(totalScore) // 将字符串转换回数字

        //   console.log(')))', lastTableDefine.value)
        //   console.log('****', `${groupKey}_average`)
        //   // 将`${groupKey}_average`与表头lastTableDefine中的fieldId进行比较
        //   lastTableDefine.value.filter((i) => {
        //     if (i.fieldId && i.fieldId === `${groupKey}_average`) {
        //       console.log('相等啦',i.fieldName)
        //       item[i.fieldName] = parseFloat(totalScore)
        //     }
        //   })

        //   // `results` 现在包含了所有满足条件的值

        //   console.log('||||', `${groupKey}_average`)
        // }

        // 删除原始的dimensionList
        // delete item.dimensionList

        // 合并dimensionDict到item
        Object.assign(item, dimensionDict)

        // 添加dimensionGroups到item
        item.dimensionGroups = dimensionGroups
      })
      list.value = data.data
      total.value = data.total

      // 列表刷新 同步刷新九宫格
      nineGridRef.value?.freshData(tempQueryParams)

      // console.log('--', list.value)
    }
  } finally {
    loading.value = false
  }
}

// 判断当前维度是否上传
const isUpload = (item, propertyName) => {
  let tooltipStr = ''
  item.dimensionList.forEach((item) => {
    if (item.programName === propertyName) {
      tooltipStr = item.alertInfo
    }
  })
  return tooltipStr
}

// 重置
const resetQuery = () => {
  queryParams.value = {
    page: 1,
    size: 10,
    departmentId: '',
    keyword: '',
    keyword2: '',
    manageId: '',
    inventoryId: inventoryId,
    position: '',
    status: '',
    departmentStr: ''
  }
  handleQuery()
}

/** 打开校准意见 */
const formRef = ref()
const openForm = (type: string, userId: string, status: string) => {
  if (formRef.value) {
    formRef.value.open(type, userId, inventoryId, status)
  }
}

/** 打开校准完成确认框 */
const confirmDialogRef = ref()
const openConfirmDialog = async (data) => {
  if (data.status == 1) return message.error('该条目已完成校准，请勿重复操作')
  await message.confirm('是否确认完成，完成后数据将不可更改！')
  handleConfirmComplete(data)
  // if (confirmDialogRef.value) {
  //   confirmDialogRef.value.open(data)
  // }
}
// 点击校准完成确认
const handleConfirmComplete = async (itemData) => {
  // console.log('itemData', itemData)
  let data = {
    inventoryId: inventoryId,
    appraiseeId: itemData.appraiseeId,
    calibrationResultList: [] as any
  }
  // 遍历itemData对象
  for (const [key, value] of Object.entries(itemData)) {
    // console.log('key', key, 'value', value)
    // 检查键名是否包含'average'
    if (key.includes('均分')) {
      // 将符合条件的键名和值添加到calibrationResultList数组中
      data.calibrationResultList.push({
        fieldId: key,
        fieldValue: value
      })
    }
  }
  // console.log('---', data)
  try {
    itemData.loading = true
    await InventoryCalibrationApi.calibrationComplete(data)
    itemData.loading = false
    message.success('操作成功')
    getList()
  } catch (error) {
    itemData.loading = false
  } finally {
    itemData.loading = false
  }
}

// 评价作废
const commentDialogRef = ref()
const reCommentDialogRef = ref()
const cancelComment = (appraiseeId) => {
  console.log(appraiseeId)
  commentDialogRef.value?.open(appraiseeId)
}

// 确认评价作废
const handleCommentConfirm = () => {
  message.success('操作成功')
  getList()
  // openReCommentDialog()
}

// 重新评价
const openReCommentDialog = () => {
  if (reCommentDialogRef.value) {
    reCommentDialogRef.value.open()
  }
}
// 确认重新评价
// const handleReCommentConfirm = () => {}

// 还原评价
const resetComment = async (appraiseeId) => {
  await message.confirm('请确定是否还原该人员的所有评价数据？')
  await InventoryCalibrationApi.resetCalibration({ inventoryId, appraiseeId })
  message.success('操作成功')
  getList()
}

const detailDialogRef = ref()
//详情
const goDetail = (row) => {
  const params = {
    appraiseeId: row.appraiseeId,
    inventoryId: row.inventoryId
  }
  detailDialogRef.value.open(params)
}

// 报告预览
const reportView = (row: any) => {
  window.open(
    `${window.location.origin}/otr/pdf?inventoryId=${row.inventoryId}&appraiseeId=${row.appraiseeId}`
  )
}

// 点击九宫格
const nineGridDialogRef = ref()
const handleClickNineGrid = (obj) => {
  console.log('handleClickNineGrid', obj.position)
  let tempQueryParams = handleQueryParams({ ...queryParams.value, position: obj.position })
  // queryParams.value.position = obj.position
  nineGridDialogRef.value?.open(tempQueryParams)
}

// 下拉-部门树形

const customProps = {
  label: 'name',
  value: 'id',
  children: 'children',
  checkStrictly: true
}
const departmentTreeData = ref<any>([]) // 部门树形数据
const departmentSelectedArr = ref([]) // 选中的部门id数组
const departmentLoading = ref(false)

const getDepartmentTree = async () => {
  departmentLoading.value = true
  try {
    const data = await DeptApi.getAllDeptTree()
    departmentTreeData.value =
      data.map((item) => {
        return {
          ...item,
          name: `${item.name}`
        }
      }) || []
  } finally {
    departmentLoading.value = false
  }
}

// 监听渠道选择的变化
watch(departmentSelectedArr, (val) => {
  // console.log('选择的部门', val)
  if (val && val.length > 0) {
    //  将选择的val的最后一个值赋值给queryParams.departmentId
    queryParams.value.departmentId = val[val.length - 1]
    getList()
  } else {
    // 清空选择
    queryParams.value.departmentId = ''
    getList()
  }
})

// 双击
const handleDoubleClick = (item, propertyName) => {
  if (item.status == 1) return message.error('该条目已完成校准，请勿进行编辑操作')
  item[propertyName + 'Editable'] = true
}

// 保存编辑
const saveEdit = async (item, propertyName) => {
  item[propertyName + 'Editable'] = false // 关闭编辑模式
  // 判断保存的item[propertyName]是否是小于0 的数
  if (item[propertyName] < 0) {
    message.error('分值不能小于0')
    return
  }
  item[propertyName] = item[propertyName]
  let submitData = [] as any
  item.dimensionList.forEach((dimension) => {
    if (dimension.programName === propertyName) {
      dimension.programScore = item[propertyName] * 1
      submitData.push(dimension) // 将满足条件的单个对象添加到submitData数组中
    }
  })
  submitData = submitData.map((dimension) => {
    return {
      ...dimension,
      inventoryId: inventoryId,
      appraiseeId: item.appraiseeId
    }
  })

  // console.log('提交数据', submitData)

  // console.log('提交成功', item)
  await InventoryCalibrationApi.updateCalibrationList(submitData)
    .then(() => {
      message.success('修改成功')
      getList()
    })
    .catch(() => {
      console.log('提交失败')
    })
}
// 取消编辑
const concelEdit = (item, propertyName) => {
  // console.log('取消', item)
  item[propertyName + 'Editable'] = false // 关闭编辑模式
  item[propertyName] = item[propertyName + '_OriginalValue']
}

// 获取管理员列表
interface OptionItem {
  label: string
  value: string
}
const managerList = ref<OptionItem[]>([])
const getManagerList = async () => {
  let data = await InventoryCalibrationApi.getManagerList().catch((err) => {})
  if (data) {
    managerList.value = data.map((item) => ({ label: item.name, value: item.userId }))
  }
}
const tableMaxHeight = ref(0)
const filterWrapRef = ref()
const getTableMaxHeight = () => {
  const filterWrapHeight = filterWrapRef.value?.clientHeight || 0
  console.log('filterWrapHeight', filterWrapHeight, window.innerHeight)
  const clientHeight = window.document.documentElement.clientHeight
  tableMaxHeight.value = clientHeight - filterWrapHeight - 250
}
onMounted(async () => {
  await getTableHeader()
  departmentTreeData.value = departmentStore.departmentData || []
  // 获取部门数据
  getDepartmentTree()
  getList()
  // 获取管理员列表
  getManagerList()
  getTableMaxHeight()
  window.addEventListener('resize', handleResize)
})

// 在组件卸载前移除resize监听器
onBeforeUnmount(() => {
  // 移除resize监听器
  window.removeEventListener('resize', handleResize)
})
const handleResize = () => {
  getTableMaxHeight()
}
</script>

<style scoped>
:deep(.el-popover.el-popper) {
  min-width: 90px;
}
</style>

<style lang="scss" scoped>
@use './index.scss';

// 合并el-table表头的样式
.belong {
  // background-color: #fafcff !important;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-align: center;
}
:deep(.el-table--border td.el-table__cell) {
  // border-bottom: none;
  border-right: none;
}

:deep(.el-table .cell) {
  padding: 0;
}
:deep(.el-table .el-table__cell) {
  padding: 0;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 32px;
}

.fixedTableHeader {
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
  .fixedHeader{
    display: flex;
    align-items: center;
    img{
      width: 14px;
      height: 14px;
      margin-left: 2px;
    }
  }
}

.margin_b {
  // margin-bottom: 10px;
  padding: 5px 8px;
}
.margin_t {
  // margin-top: 10px;
  padding: 5px 0;
}
.belong_label {
  color: #0064ff;
  font-weight: 600;
  // margin-bottom: 5px;
}

.mainWrap {
  background-color: #ffffff;
  padding: 20px;
  padding-bottom: 80px;
}
.filterWrap {
  display: flex;
  // background-color: #ffffff;
  // padding: 20px;
}

.contentWrap {
  // margin: 0 10px;
}

.sudoku-btn {
  width: 64px;
  height: 64px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0px 2px 10px 0px rgba(1, 18, 45, 0.2);
  position: fixed;
  right: 22px;
  bottom: 100px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  img {
    width: 37px;
  }
}
// 九宫格
.sudoku-content {
  position: relative;
}

.action-wrap {
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
  .more {
    width: 14px;
  }
}

.action-edit {
  color: #0064ff;
  cursor: pointer;
  // margin-right: 8px;
  &:hover {
    color: #0064ff;
    opacity: 0.6;
  }
}
.action-delete {
  color: #eb3737;
  cursor: pointer;
}
.action-img {
  width: 14px;
  vertical-align: middle;
}
:deep(.contentWrap .el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #e5e5e5;
}

/* 分隔线 */
.line {
  color: #b3bac9;
  margin: 0 6px;
}
</style>
