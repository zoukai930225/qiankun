<template>
  <div class="report-wrapper late-stage-report">
    <table class="report-table">
      <thead class="report-header">
        <tr>
          <th class="title-cell" :colspan="5" rowspan="2">
            <div class="title-content">
              <div class="company">杭州顶秀电子商务有限公司</div>
              <div class="title">品质检验报告</div>
            </div>
          </th>
          <!-- <th class="subtitle-cell stage-cell" :colspan="3">
            <div class="subtitle-content stage-options">
              <span v-for="option in stageOptions" :key="option" class="stage-checkbox stage-checkbox--export"
                :class="{ 'is-checked': option === resolvedStageLabel }">
                <span class="stage-checkbox__box"></span>
                <span class="stage-checkbox__label">{{ option }}</span>
              </span>
            </div>
            
          </th>  -->
          <td class="label-cell redBg">检验结果：</td>
          <td class="value-cell redBg" colspan="2">{{ safeValue(testResultText) }}</td>
        </tr>
        
        <tr>
          <th class="label-cell">订单号：</th>
          <th class="value-cell" colspan="2">{{ safeValue(scPurchaseOrderNo) }}</th>
        </tr>
      </thead>

      <tbody class="base-info">
        <!-- <tr>
          <td class="label-cell">检验结果：</td>
          <td class="value-cell">{{ safeValue(testResultText) }}</td>
          <td class="label-cell">款式描述：</td>
          <td class="value-cell" colspan="2">{{ safeValue(styleDescriptionText) }}</td>
          <td class="label-cell">采购跟单人：</td>
          <td class="value-cell" colspan="2">{{ safeValue(purchaserText) }}</td>
        </tr> -->
        <tr class="base-info-label-row">
          <td class="label-cell">供应商</td>
          <td class="label-cell">款号</td>
          <td class="label-cell">货期</td>
          <td class="label-cell">数量</td>
          <td class="label-cell">装箱量</td>
          <!-- <td class="label-cell" rowspan="2">生产进度：</td>
          <td v-for="(item, index) in progressTableRows[0]" :key="`progress-first-${index}`" class="progress-cell"
            colspan="1">
            <template v-if="item">
              <span class="progress-label">{{ item.label }}：</span>
              <span class="progress-value">{{ safeValue(item.value) }}</span>
            </template>
            <span v-else>-</span>
          </td> -->
          <td class="label-cell">生产跟单：</td>
          <td class="value-cell" colspan="2">{{ safeValue(purchaserText) }}</td>
        </tr>
        <tr class="base-info-value-row">
          <td class="value-cell yellowBg">{{ safeValue(supplierDisplay) }}</td>
          <td class="value-cell yellowBg">{{ safeValue(itemNumberDisplay) }}</td>
          <td class="value-cell">{{ safeValue(deliveryTimeText) }}</td>
          <td class="value-cell">{{ safeValue(quantityText) }}</td>
          <td class="value-cell">{{ safeValue(packQuantityText) }}</td>
          <!-- <td v-for="(item, index) in progressTableRows[1]" :key="`progress-second-${index}`" class="progress-cell"
            colspan="1">
            <template v-if="item">
              <span class="progress-label">{{ item.label }}：</span>
              <span class="progress-value">{{ safeValue(item.value) }}</span>
            </template>
            <span v-else>-</span>
          </td> -->
          <td class="label-cell">检验日期：</td>
          <td class="value-cell" colspan="2">{{ safeValue(submissionDateText) }}</td>
        </tr>
        <tr class="base-info-value-row">
          <td class="label-cell">款式描述：</td>
          <td class="value-cell" colspan="7">{{ safeValue(styleDescriptionText) }}</td>
        </tr>
      </tbody>
    </table>
    <table class="report-table second-table">
      <colgroup>
        <col style="width: 11%" />
        <col style="width: 14%" />
        <col style="width: 11%" />
        <col style="width: 14%" />
        <col style="width: 9.5%" />
        <col style="width: 2.5%" />
        <col style="width: 14%" />
        <col style="width: 6%" />
        <col style="width: 6%" />
        <col style="width: 6%" />
        <col style="width: 6%" />
      </colgroup>
      <thead>
        <tr class="section-title">
          <th class="section-title__fabric" colspan="4">一、服装面料</th>
          <th class="section-title__aql" colspan="7">七、可视检查AQL：2.5标准</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="label-cell">颜色：</td>
          <td class="value-cell">{{ safeValue(fabricColorText) }}</td>
          <td class="label-cell">印花：</td>
          <td class="value-cell">{{ safeValue(fabricPrintText) }}</td>
          <td class="label-cell sampling-center" colspan="3">抽样方案表</td>
          <!-- <td class="label-cell sampling-center" colspan="4">1.5</td> -->
          <td class="label-cell sampling-center" colspan="4">2.5</td>
          <!-- <td class="label-cell sampling-center" colspan="2" rowspan="2">检查选项</td> -->
        </tr>
        <tr>
          <td class="label-cell">色差：</td>
          <td class="value-cell">{{ safeValue(fabricColorDifferenceText) }}</td>
          <td class="label-cell">成衣水洗：</td>
          <td class="value-cell">{{ safeValue(fabricFunctionText) }}</td>
          <td class="label-cell" colspan="2">批量范围</td>
          <td class="label-cell">样本量</td>
          <!-- <td class="label-cell" >AC</td>
          <td class="label-cell" >RE</td> -->
          <td class="label-cell" colspan="2">AC</td>
          <td class="label-cell" colspan="2">RE</td>
        </tr>
        <tr>
          <td class="label-cell">手感：</td>
          <td class="value-cell">{{ safeValue(fabricFeelText) }}</td>
          <td class="label-cell">拉开度：</td>
          <td class="value-cell">{{ safeValue(fabricCuttingText) }}</td>
          <td class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[0]?.isHit }" colspan="2">
            {{ safeValue(spotCheckPlanRows[0]?.batchRangeName) }}
          </td>
          <td class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[0]?.isHit }">
            {{ safeValue(spotCheckPlanRows[0]?.sampleSize) }}
          </td>
          <!-- <td  class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[0]?.isHit }">
            {{ safeValue(spotCheckPlanRows[0]?.onePointFiveAc) }}
          </td>
          <td class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[0]?.isHit }">
            {{ safeValue(spotCheckPlanRows[0]?.onePointFiveRe) }}
          </td> -->
          <td colspan="2" class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[0]?.isHit }">
            {{ safeValue(spotCheckPlanRows[0]?.twoPointFiveAc) }}
          </td>
          <td colspan="2" class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[0]?.isHit }">
            {{ safeValue(spotCheckPlanRows[0]?.twoPointFiveRe) }}
          </td>
          <!-- <td colspan="2" class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[0]?.isHit }">
            
          </td> -->
        </tr>
        <tr>
          <td class="label-cell">克重：</td>
          <td class="value-cell" colspan="3">{{ safeValue(fabricGramWeightText) }}</td>
          <!-- <td class="label-cell">家洗：</td>
          <td class="value-cell">{{ safeValue(fabricHomeWashText) }}</td> -->
          <td class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[1]?.isHit }" colspan="2">
            {{ safeValue(spotCheckPlanRows[1]?.batchRangeName) }}
          </td>
          <td class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[1]?.isHit }">
            {{ safeValue(spotCheckPlanRows[1]?.sampleSize) }}
          </td>
          <!-- <td class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[1]?.isHit }">
            {{ safeValue(spotCheckPlanRows[1]?.onePointFiveAc) }}
          </td>
          <td class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[1]?.isHit }">
            {{ safeValue(spotCheckPlanRows[1]?.onePointFiveRe) }}
          </td> -->
          <td colspan="2" class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[1]?.isHit }">
            {{ safeValue(spotCheckPlanRows[1]?.twoPointFiveAc) }}
          </td>
          <td colspan="2" class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[1]?.isHit }">
            {{ safeValue(spotCheckPlanRows[1]?.twoPointFiveRe) }}
          </td>
          <!-- <td colspan="2" class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[0]?.isHit }">
            
          </td> -->
        </tr>
        <tr class="section-subtitle-row">
          <td class="section-subtitle__cell" colspan="4">二、各项辅料</td>
          <td class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[2]?.isHit }" colspan="2">
            {{ safeValue(spotCheckPlanRows[2]?.batchRangeName) }}
          </td>
          <td class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[2]?.isHit }">
            {{ safeValue(spotCheckPlanRows[2]?.sampleSize) }}
          </td>
          <!-- <td class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[2]?.isHit }">
            {{ safeValue(spotCheckPlanRows[2]?.onePointFiveAc) }}
          </td>
          <td class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[2]?.isHit }">
            {{ safeValue(spotCheckPlanRows[2]?.onePointFiveRe) }}
          </td> -->
          <td colspan="2" class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[2]?.isHit }">
            {{ safeValue(spotCheckPlanRows[2]?.twoPointFiveAc) }}
          </td>
          <td colspan="2" class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[2]?.isHit }">
            {{ safeValue(spotCheckPlanRows[2]?.twoPointFiveRe) }}
          </td>
          <!-- <td colspan="2" class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[0]?.isHit }">
            
          </td> -->
        </tr>
        <tr>
          <td class="label-cell">LOGO标:</td>
          <td class="value-cell">{{ safeValue(accessLogoText) }}</td>
          <td class="label-cell">缝线：</td>
          <td class="value-cell">{{ safeValue(accessSutureText) }}</td>
          <!-- <td class="label-cell">洗唛：</td>
          <td class="value-cell">{{ safeValue(accessCareLabelText) }}</td> -->
          <td class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[3]?.isHit }" colspan="2">
            {{ safeValue(spotCheckPlanRows[3]?.batchRangeName) }}
          </td>
          <td class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[3]?.isHit }">
            {{ safeValue(spotCheckPlanRows[3]?.sampleSize) }}
          </td>
          <!-- <td class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[3]?.isHit }">
            {{ safeValue(spotCheckPlanRows[3]?.onePointFiveAc) }}
          </td>
          <td class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[3]?.isHit }">
            {{ safeValue(spotCheckPlanRows[3]?.onePointFiveRe) }}
          </td> -->
          <td colspan="2" class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[3]?.isHit }">
            {{ safeValue(spotCheckPlanRows[3]?.twoPointFiveAc) }}
          </td>
          <td colspan="2" class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[3]?.isHit }">
            {{ safeValue(spotCheckPlanRows[3]?.twoPointFiveRe) }}
          </td>
          <!-- <td colspan="2" class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[0]?.isHit }">
            
          </td> -->
        </tr>
        <tr>
          <td class="label-cell">橡筋：</td>
          <td class="value-cell">{{ safeValue(accessRubberBandText) }}</td>
          <td class="label-cell">合格证：</td>
          <td class="value-cell">{{ safeValue(accessCertificateText) }}</td>
          <td class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[4]?.isHit }" colspan="2">
            {{ safeValue(spotCheckPlanRows[4]?.batchRangeName) }}
          </td>
          <td class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[4]?.isHit }">
            {{ safeValue(spotCheckPlanRows[4]?.sampleSize) }}
          </td>
          <!-- <td class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[4]?.isHit }">
            {{ safeValue(spotCheckPlanRows[4]?.onePointFiveAc) }}
          </td>
          <td class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[4]?.isHit }">
            {{ safeValue(spotCheckPlanRows[4]?.onePointFiveRe) }}
          </td> -->
          <td colspan="2" class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[4]?.isHit }">
            {{ safeValue(spotCheckPlanRows[4]?.twoPointFiveAc) }}
          </td>
          <td colspan="2" class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[4]?.isHit }">
            {{ safeValue(spotCheckPlanRows[4]?.twoPointFiveRe) }}
          </td>
          <!-- <td colspan="2" class="value-cell aql-cell" :class="{ 'is-highlight': spotCheckPlanRows[0]?.isHit }">
            
          </td> -->
        </tr>
        <tr>
          <td class="label-cell">成分：</td>
          <td class="value-cell">{{ safeValue(accessIngredientText) }}</td>
          <td class="label-cell">洗唛：</td>
          <td class="value-cell">{{ safeValue(accessCareLabelText) }}</td>
          <!-- <td class="note-cell" colspan="7">
            <div class="aql-note flex items-center text-#E26A00"><el-icon color="#E26A00" size="22">
                <Warning />
              </el-icon>
              判定标准：按照AQL2.5执行；
            </div>
          </td> -->
          <td colspan="7">
            <div class="aql-result"> 检查结果：{{ safeValue(measureSituationText) }} </div>
          </td>
        </tr>
        <tr class="section-subtitle-row">
          <!-- <td class="label-cell">成分：</td>
          <td class="value-cell">{{ safeValue(accessIngredientText) }}</td>
          <td class="label-cell">合格证：</td>
          <td class="value-cell">{{ safeValue(accessCertificateText) }}</td> -->
          <td class="section-subtitle__cell" colspan="4">三、胸贴类别</td>
          <!-- <td colspan="7">
            <div class="aql-result"> 检查结果：接受Acc </div>
          </td> -->
          <td class="label-cell center-cell">序号</td>
          <td class="label-cell" colspan="4">疵点描述</td>
          <td class="label-cell center-cell">严重</td>
          <td class="label-cell center-cell">轻微</td>
        </tr>
        <tr >
          <!-- <td class="section-subtitle__cell" colspan="4">三、胸贴类别</td> -->
          <td class="label-cell">产品工艺：</td>
          <td class="value-cell">{{ safeValue(chestPatchesProductProcessText) }}</td>
          <td class="label-cell">款式类型：</td>
          <td class="value-cell">{{ safeValue(chestPatchesStyleText) }}</td>
          <td class="defect-cell defect-index">1</td>
          <td class="defect-cell defect-desc" colspan="4">
            {{ safeValue(defectRows[0]?.defect) }}
          </td>
          <td class="defect-cell defect-severity">{{ safeValue(defectRows[0]?.serious) }}</td>
          <td class="defect-cell defect-severity">{{ safeValue(defectRows[0]?.slight) }}</td>
        </tr>
        <tr>
         <td class="label-cell">粘性测试：</td>
          <td class="value-cell" colspan="3">{{ safeValue(chestPatchesStickTestText) }}</td>
          <td class="defect-cell defect-index">2</td>
          <td class="defect-cell defect-desc" colspan="4">
            {{ safeValue(defectRows[1]?.defect) }}
          </td>
          <td class="defect-cell defect-severity">{{ safeValue(defectRows[1]?.serious) }}</td>
          <td class="defect-cell defect-severity">{{ safeValue(defectRows[1]?.slight) }}</td>
        </tr>
        <tr class="section-subtitle-row">
          <td class="section-subtitle__cell" colspan="4">四、包装及装箱方式</td>
          <td class="defect-cell defect-index">3</td>
          <td class="defect-cell defect-desc" colspan="4">
            {{ safeValue(defectRows[2]?.defect) }}
          </td>
          <td class="defect-cell defect-severity">{{ safeValue(defectRows[2]?.serious) }}</td>
          <td class="defect-cell defect-severity">{{ safeValue(defectRows[2]?.slight) }}</td>
        </tr>
        <tr>
          <td class="label-cell">袋装密封：</td>
          <td class="value-cell">{{ safeValue(packagBagText) }}</td>
          <td class="label-cell">包装盒：</td>
          <td class="value-cell">{{ safeValue(packagBoxText) }}</td>
          <td class="defect-cell defect-index">4</td>
          <td class="defect-cell defect-desc" colspan="4">
            {{ safeValue(defectRows[3]?.defect) }}
          </td>
          <td class="defect-cell defect-severity">{{ safeValue(defectRows[3]?.serious) }}</td>
          <td class="defect-cell defect-severity">{{ safeValue(defectRows[3]?.slight) }}</td>
        </tr>
        <tr >
          <td class="label-cell">散货包装：</td>
          <td class="value-cell" colspan="3">{{ safeValue(packagBulkText) }}</td>
          <td class="defect-cell defect-index">5</td>
          <td class="defect-cell defect-desc" colspan="4">
            {{ safeValue(defectRows[4]?.defect) }}
          </td>
          <td class="defect-cell defect-severity">{{ safeValue(defectRows[4]?.serious) }}</td>
          <td class="defect-cell defect-severity">{{ safeValue(defectRows[4]?.slight) }}</td>
        </tr>
        <tr class="section-subtitle-row">
           <td class="section-subtitle__cell" colspan="4">五、机构检测</td>
          <!-- <td class="label-cell">折叠方式：</td>
          <td class="value-cell">{{ safeValue(packagFoldingMethodText) }}</td>
          <td class="label-cell">包装盒：</td>
          <td class="value-cell">{{ safeValue(packagBoxText) }}</td> -->
          <td class="defect-cell defect-index">6</td>
          <td class="defect-cell defect-desc" colspan="4">
            {{ safeValue(defectRows[5]?.defect) }}
          </td>
          <td class="defect-cell defect-severity">{{ safeValue(defectRows[5]?.serious) }}</td>
          <td class="defect-cell defect-severity">{{ safeValue(defectRows[5]?.slight) }}</td>
        </tr>
        <tr>
          <td class="label-cell">面辅料检测：</td>
          <td class="value-cell">{{ safeValue(institutionalTestFabricText) }}</td>
          <td class="label-cell">功能性检测：</td>
          <td class="value-cell">{{ safeValue(institutionalFunctionText) }}</td>
          <!-- <td class="label-cell">散货包装：</td>
          <td class="value-cell">{{ safeValue(packagBulkText) }}</td> -->
          <!-- <td class="label-cell">包装袋：</td>
          <td class="value-cell">{{ safeValue(packagBagText) }}</td> -->
          <td class="defect-cell defect-index">7</td>
          <td class="defect-cell defect-desc" colspan="4">
            {{ safeValue(defectRows[6]?.defect) }}
          </td>
          <td class="defect-cell defect-severity">{{ safeValue(defectRows[6]?.serious) }}</td>
          <td class="defect-cell defect-severity">{{ safeValue(defectRows[6]?.slight) }}</td>
        </tr>
        <tr class="section-subtitle-row">
          <td class="section-subtitle__cell" colspan="4">六、尺寸度量情况</td>
          <td class="defect-cell defect-index">8</td>
          <td class="defect-cell defect-desc" colspan="4">
            {{ safeValue(defectRows[7]?.defect) }}
          </td>
          <td class="defect-cell defect-severity">{{ safeValue(defectRows[7]?.serious) }}</td>
          <td class="defect-cell defect-severity">{{ safeValue(defectRows[7]?.slight) }}</td>
        </tr>
        <!-- <tr>
          <td class="label-cell">面料：</td>
          <td class="value-cell">{{ safeValue(institutionalTestFabricText) }}</td>
          <td class="label-cell">里料：</td>
          <td class="value-cell">{{ safeValue(institutionalLiningText) }}</td>
          <td class="defect-cell defect-index">8</td>
          <td class="defect-cell defect-desc" colspan="4">
            {{ safeValue(defectRows[7]?.defect) }}
          </td>
          <td class="defect-cell defect-severity">{{ safeValue(defectRows[7]?.serious) }}</td>
          <td class="defect-cell defect-severity">{{ safeValue(defectRows[7]?.slight) }}</td>
        </tr> -->
        <tr class="summary-row">
          <td class="label-cell">检查结果：</td>
          <td class="value-cell" colspan="3">{{  safeValue(measureSituationText)  }}</td>
          <!-- <td class="label-cell">功能性：</td>
          <td class="value-cell">{{ safeValue(institutionalFunctionText) }}</td> -->
          <td class="defect-cell defect-index summary-cell">汇总</td>
          <td class="defect-cell defect-desc summary-cell" colspan="4">
            严重与轻微问题数量之和：{{ safeValue(defectSummary.total) }}
          </td>
          <td class="defect-cell defect-severity summary-cell">
            {{ safeValue(defectSummary.serious) }}
          </td>
          <td class="defect-cell defect-severity summary-cell">
            {{ safeValue(defectSummary.slight) }}
          </td>
        </tr>
        <!-- <tr class="section-subtitle-row">
          <td class="section-subtitle__cell" colspan="12">八、装箱方式</td>
        </tr> -->
        <!-- <tr>
          <td class="label-cell">装箱方式：</td>
          <td class="value-cell" colspan="10">{{ safeValue(packingMethodText) }}</td>
        </tr>
        <tr>
          <td class="label-cell">抽查箱号：</td>
          <td class="value-cell" colspan="10">{{ safeValue(spotCheckBoxNumber) }}</td>
        </tr> -->
        <tr>
          <td class="label-cell" rowspan="2">评语：</td>
          <td class="value-cell textArea" colspan="10" rowspan="2">{{ safeValue(comment) }}</td>
        </tr>
        <tr></tr>
        <tr>
          <td class="label-cell">验货QC：</td>
          <td class="value-cell" colspan="3">{{ safeValue(createName) }}</td>
          <td class="label-cell">供应商：</td>
          <td class="value-cell" colspan="6"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { Warning } from '@element-plus/icons-vue'
import { computed } from 'vue'

import { getDictLabel } from '@/utils/dict'
import { STAGE_LABEL_MAP, type QualityInspectionReportInfo } from './types'

const stageOptions = ['尾期']

const props = defineProps<{
  report?: (QualityInspectionReportInfo & Record<string, any>) | null
  stageLabel?: string
}>()

const reportValue = computed(
  () => (props.report ?? {}) as QualityInspectionReportInfo & Record<string, any>
)

const PASS_FAIL_LABELS: Record<string, string> = {
  '1': '合格',
  '2': '不合格'
}

const PASS_FAIL_FIELDS = new Set<string>([
  'fabricColor',
  'fabricCylinderDifference',
  'fabricFeelWool',
  'fabricGramWeight',
  'fabricOrgan',
  'fabricFeel',
  'fabricPrint',
  'fabricHomeWash',
  'fabricFunction',
  'fabricCutting',
  'fabricColorDifference', 
  'accessMainLabel',
  'accessOrnament',
  'accessRubberBand',
  'accessIngredient',
  'accessCareLabel',
  'accessSuture',
  'accessLogo',
  'accessCertificate',
  'packagFoldingMethod',
  'packagBulk',
  'packagBox',
  'packagBag',
  'institutionalTestFabric',
  'institutionalReadyWear',
  'institutionalLining',
  'institutionalFunction',
  'chestPatchesStickTest',
])

const FIELD_SPECIFIC_LABELS: Record<string, Record<string, string>> = {
  chestPatchesProductProcess: {
    '1': '烤胶',
    '2': '常温胶'
  },
  chestPatchesStyle: {
    '1': '厚杯',
    '2': '薄杯'
  },
  measureSituation: {
    '1': '接受Acc',
    '2': '不接受Rej'
  }
}

const camelToSnakeCase = (input: string) =>
  input.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()

const isMeaningfulValue = (value: unknown): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return true
}

const safeValue = (value: unknown) => {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'string' && value.trim() === '') return '-'
  return value
}

const mapDictLabel = (field: string, value: unknown): string => {
  if (!isMeaningfulValue(value)) return ''
  const dictKey = camelToSnakeCase(field)
  const label = getDictLabel(dictKey, value)
  return typeof label === 'string' && label.trim() ? label : ''
}

const mapCustomFieldLabel = (field: string, value: unknown): string => {
  if (!isMeaningfulValue(value)) return ''
  const key = String(value)
  if (PASS_FAIL_FIELDS.has(field)) {
    return PASS_FAIL_LABELS[key] ?? ''
  }
  const specificOptions = FIELD_SPECIFIC_LABELS[field]
  if (specificOptions) {
    return specificOptions[key] ?? ''
  }
  return ''
}

const normalizeFieldValueSegments = (value: unknown): unknown[] => {
  if (value === null || value === undefined) return []
  if (Array.isArray(value)) {
    return value.reduce<unknown[]>((accumulator, current) => {
      accumulator.push(...normalizeFieldValueSegments(current))
      return accumulator
    }, [])
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return []
    if (trimmed.includes(',')) {
      return trimmed
        .split(',')
        .map((segment) => segment.trim())
        .filter((segment) => segment)
    }
    return [trimmed]
  }
  return [value]
}

const formatFieldValue = (field: string, value: unknown): string => {
  if (!isMeaningfulValue(value)) return ''
  const segments = normalizeFieldValueSegments(value)
  if (!segments.length) return ''
  const formattedSegments = segments
    .map((segment) => {
      if (!isMeaningfulValue(segment)) return ''
      const dictLabel = mapDictLabel(field, segment)
      if (dictLabel) return dictLabel
      const customLabel = mapCustomFieldLabel(field, segment)
      if (customLabel) return customLabel
      return String(segment).trim()
    })
    .filter((segment) => segment)
  return formattedSegments.join(', ')
}

const resolveFieldText = (field: string, ...fallbacks: unknown[]): string => {
  const record = reportValue.value as Record<string, any>
  const candidateKeys = [`${field}Value`, `${field}Label`, `${field}Text`]

  for (const key of candidateKeys) {
    if (key in record) {
      const candidate = record[key]
      if (isMeaningfulValue(candidate)) {
        return formatFieldValue(field, candidate)
      }
    }
  }

  for (const fallback of fallbacks) {
    if (isMeaningfulValue(fallback)) {
      return formatFieldValue(field, fallback)
    }
  }

  const raw = record[field]
  if (isMeaningfulValue(raw)) {
    return formatFieldValue(field, raw)
  }

  return ''
}

const resolvedStageLabel = computed(() => {
  if (props.stageLabel && props.stageLabel.trim()) {
    return props.stageLabel
  }
  const cycle = reportValue.value.qualityInspectionCycle
  const cycleKey = cycle === undefined || cycle === null ? '' : String(cycle)
  return STAGE_LABEL_MAP[cycleKey as '1' | '2' | '3'] ?? '尾期'
})

const submissionDateText = computed(() =>
  resolveFieldText('submissionDate', (reportValue.value as Record<string, any>).submissionDate)
)

const testResultText = computed(() => mapTestResult(reportValue.value.testResults))
const styleDescriptionText = computed(() =>
  resolveFieldText(
    'styleDescription',
    (reportValue.value as Record<string, any>).styleDescriptionValue,
    (reportValue.value as Record<string, any>).styleName,
    (reportValue.value as Record<string, any>).fabricStatus
  )
)
const purchaserText = computed(() => resolveFieldText('orderFollowName'))

const supplierDisplay = computed(() => {
  return resolveFieldText('abbreviationCompany')
})

const itemNumberDisplay = computed(() => {
  const names = resolveFieldText('itemNumberNames')
  if (isMeaningfulValue(names)) return names
  const styleNo = resolveFieldText('styleNo')
  if (isMeaningfulValue(styleNo)) return styleNo
  return resolveFieldText('itemNumberIds')
})

const scPurchaseOrderNo = computed(() => resolveFieldText('scPurchaseOrderNo'))
// const orderFollowName = computed(() => resolveFieldText('orderFollowName'))
const deliveryTimeText = computed(() => resolveFieldText('deliveryTime'))
const quantityText = computed(() => resolveFieldText('num'))
const packQuantityText = computed(() => resolveFieldText('packQuantity'))

const progressItems = computed(() => {
  const formatProgressValue = (value: string): string => {
    if (!isMeaningfulValue(value)) return ''
    return `${value}%`
  }

  return [
    { label: '裁剪', value: formatProgressValue(resolveFieldText('crop')) },
    { label: '缝制', value: formatProgressValue(resolveFieldText('sew')) },
    { label: '检验', value: formatProgressValue(resolveFieldText('inspection')) },
    { label: '包装', value: formatProgressValue(resolveFieldText('pack')) }
  ]
})

const progressTableRows = computed(() => {
  const items = progressItems.value
  const normalized = [
    items[0] ?? { label: '裁剪', value: '' },
    items[1] ?? { label: '缝制', value: '' },
    items[2] ?? { label: '检验', value: '' },
    items[3] ?? { label: '包装', value: '' }
  ]

  return [normalized.slice(0, 2), normalized.slice(2, 4)]
})

const fabricColorText = computed(() => resolveFieldText('fabricColor'))
const fabricOrganText = computed(() => resolveFieldText('fabricOrgan'))
const fabricCylinderDifferenceText = computed(() => resolveFieldText('fabricCylinderDifference'))
const fabricFeelText = computed(() => resolveFieldText('fabricFeel'))
const fabricFeelWoolText = computed(() => resolveFieldText('fabricFeelWool'))
const fabricPrintText = computed(() => resolveFieldText('fabricPrint'))
const fabricGramWeightText = computed(() => resolveFieldText('fabricGramWeight'))
const fabricHomeWashText = computed(() => resolveFieldText('fabricHomeWash'))
const fabricFunctionText = computed(() => resolveFieldText('fabricFunction'))
const fabricCuttingText = computed(() => resolveFieldText('fabricCutting'))
const fabricColorDifferenceText = computed(() => resolveFieldText('fabricColorDifference'))
const accessMainLabelText = computed(() => resolveFieldText('accessMainLabel'))
const accessCareLabelText = computed(() => resolveFieldText('accessCareLabel'))
const accessOrnamentText = computed(() => resolveFieldText('accessOrnament'))
const accessSutureText = computed(() => resolveFieldText('accessSuture'))
const accessRubberBandText = computed(() => resolveFieldText('accessRubberBand'))
const accessLogoText = computed(() => resolveFieldText('accessLogo'))
const accessIngredientText = computed(() => resolveFieldText('accessIngredient'))
const accessCertificateText = computed(() => resolveFieldText('accessCertificate'))

const chestPatchesProductProcessText = computed(() =>
  resolveFieldText('chestPatchesProductProcess')
)
const chestPatchesStyleText = computed(() => resolveFieldText('chestPatchesStyle'))

const measureSituationText = computed(() => resolveFieldText('measureSituation'))
const chestPatchesStickTestText = computed(() => resolveFieldText('chestPatchesStickTest'))
const packagFoldingMethodText = computed(() => resolveFieldText('packagFoldingMethod'))
const packagBoxText = computed(() => resolveFieldText('packagBox'))
const packagBulkText = computed(() => resolveFieldText('packagBulk'))
const packagBagText = computed(() => resolveFieldText('packagBag'))

const institutionalTestFabricText = computed(() => resolveFieldText('institutionalTestFabric'))
const institutionalReadyWearText = computed(() => resolveFieldText('institutionalReadyWear'))
const institutionalLiningText = computed(() => resolveFieldText('institutionalLining'))
const institutionalFunctionText = computed(() => resolveFieldText('institutionalFunction'))

const packingMethodText = computed(() => {
  const record = reportValue.value as Record<string, any>
  // 优先使用 packingMethodValue，其次使用 packingMethod
  return record.packingMethodValue

  // if (!isMeaningfulValue(rawValue)) {
  //   return ''
  // }

  // const valueStr = String(rawValue).trim()
  // if (!valueStr) {
  //   return ''
  // }

  // // 如果是逗号分隔的字符串，分割并转换每个值
  // const values = valueStr.split(',').map(v => v.trim()).filter(v => v)
  // if (values.length === 0) {
  //   return ''
  // }

  // // 将每个值转换为字典标签
  // const labels = values
  //   .map(value => {
  //     const label = getDictLabel('packing_method', value)
  //     return label && label.trim() ? label : ''
  //   })
  //   .filter(label => label)

  // // 用逗号连接标签
  // return labels.join(',')
})
// 登记人(验货QC)
const createName = computed(() => resolveFieldText('createName'))

// 抽查箱号
const spotCheckBoxNumber = computed(()=> resolveFieldText('spotCheckBoxNumber'))

// 评语
const comment = computed(()=>resolveFieldText('comment'))
const inspectionQcText = computed(() => resolveFieldText('inspectionQc'))

const spotCheckPlanRows = computed(() => {
  const list = Array.isArray(reportValue.value.spotCheckPlanList)
    ? reportValue.value.spotCheckPlanList
    : []

  return list.map((item) => {
    const isHitText = String(item?.isHit ?? '')
      .trim()
      .toLowerCase()
    const isHit = isHitText === '1'

    return {
      batchRangeName: item?.batchRangeName ?? '',
      sampleSize: item?.sampleSize ?? '',
      onePointFiveAc: item?.onePointFiveAc ?? '',
      onePointFiveRe: item?.onePointFiveRe ?? '',
      twoPointFiveAc: item?.twoPointFiveAc ?? '',
      twoPointFiveRe: item?.twoPointFiveRe ?? '',
      isHit
    }
  })
})

const defectRows = computed(() => {
  const list = Array.isArray(reportValue.value.defectDescriptionList)
    ? reportValue.value.defectDescriptionList
    : []

  const rows: Array<{ defect: string; serious: string; slight: string }> = []
  for (let index = 0; index < 8; index += 1) {
    const item = list[index]
    rows.push({
      defect: item?.defectValue ?? (item?.defect ? String(item.defect) : ''),
      serious: item?.serious ?? '',
      slight: item?.slight ?? ''
    })
  }

  return rows
})

const normalizeCount = (value: unknown): number => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return 0
    const parsed = Number(trimmed)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

const defectSummary = computed(() => {
  return defectRows.value.reduce(
    (acc, row) => {
      const seriousCount = normalizeCount(row.serious)
      const slightCount = normalizeCount(row.slight)

      acc.serious += seriousCount
      acc.slight += slightCount
      acc.total += seriousCount + slightCount

      return acc
    },
    { serious: 0, slight: 0, total: 0 }
  )
})

function mapTestResult(value: unknown): string {
  if (value === '1' || value === 1) return '通过'
  if (value === '0' || value === 0) return '不通过'
  return ''
}
</script>

<style scoped lang="scss">
@use './reportCommon.scss';

.late-stage-report {
  .stage-cell {
    vertical-align: top;
  }

  .stage-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .progress-cell {
    padding: 12px 16px;
    text-align: left;
    vertical-align: middle;
  }

  .progress-label {
    color: #666;
    margin-right: 4px;
  }

  .report-header .label-cell {
    background-color: #f2f6fc;
    color: #666;
    font-weight: normal;
    text-align: left;
    // font-size: 17px;
    &.redBg {
      background-color: #fcf2f2;
    }
  }

  .report-header .value-cell {
    color: #333;
    text-align: left;
    &.redBg {
      background-color: #fcf2f2;
    }
  }

  .date-cell {
    vertical-align: middle;
  }

  .date-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .date-label {
    color: #666;
  }
}

// .second-table .section-title__fabric,
// .second-table .section-title__aql {
//   width: 50%;
// }

.second-table .label-cell {
  background-color: #f2f6fc;
  white-space: nowrap;
  // padding: 6px;
}
.textArea {
  line-height: 1.6;
}



.second-table {
  border-top: unset;

  tr {
    height: 50px;
  }

  th,
  td {
    padding: 8px 10px;
    text-align: left;
    font-size: 18px;
  }

  .section-subtitle-row {
    height: 50px;

    td {
      // line-height: 45px;
      padding: 0 16px;
    }
  }

  thead {
    .section-title {
      height: 50px;

      th {
        border-top: unset;
        height: 50px;
        line-height: 50px;
        padding: 0 16px;
        // border: 1px solid transparent;
      }
    }
  }

  .section-title__fabric,
  .section-title__aql,
  .section-subtitle__cell {
    background-color: rgba(2, 69, 255, 0.2);
    color: #333;
    font-weight: 600;
    font-size: 18px;
    text-align: center;
    line-height: 50px;
  }

  .sampling-center {
    text-align: center;
  }

  .center-cell {
    text-align: center;
  }

  // border: 1px solid transparent;
}

.section-subtitle-row .value-cell {
  background-color: #fff;
}

.second-table .note-cell {
  text-align: left;
  background-color: #fff;
  color: #666;
  line-height: 1.6;
}

.aql-note {
  display: flex;
  align-items: center;
  gap: 8px;
}

.aql-note__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ff9f43;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
}

.aql-result {
  font-weight: 600;
  color: #333;
}

.second-table .defect-cell {
  background-color: #fff;
  color: #333;
  text-align: left;
}

.second-table .defect-cell.defect-index,
.second-table .defect-cell.defect-severity {
  text-align: center;
}

.second-table .summary-row .summary-cell {
  background-color: #fcf2f2;
}

.second-table .defect-desc {
  text-align: left;
}

.defect-summary-row .defect-summary-label {
  font-weight: 600;
}

.defect-summary-row .defect-summary-value {
  text-align: left;
}

.value-cell.is-highlight {
  background-color: #ffff00;
}

.label-cell {
  color: #666;
  font-weight: normal;
}
</style>
