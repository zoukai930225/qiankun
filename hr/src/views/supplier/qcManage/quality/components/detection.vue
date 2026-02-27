<template>
  <div>
    <div v-if="dataValue.qualityInspectionCycle !== 3">
      <el-card shadow="never" class="qcCard">
        <template #header>
          <logo-label txt="问题描述" :is-edit="false" />
          <el-button type="primary" v-if="viewType !== 'view' && dataValue.problemDescriptionList?.length < 8"
            icon="Plus" @click="addProblemDescriptionList">新增</el-button>
        </template>
        <el-form :model="{ list: dataValue.problemDescriptionList }" :rules="viewType !== 'view' ? rules : {}"
          scroll-to-error ref="formRef" :disabled="viewType === 'view'">
          <el-table class="table-form" :data="dataValue.problemDescriptionList" width="100%"
            row-class-name="commonTableRow"
            :header-cell-style="{ backgroundColor: '#F8F8F9', color: '#666', fontSize: '14px', fontWeight: '400' }"
            border>
            <el-table-column type="index" width="55" label="序号" align="center" />
            <el-table-column label="疵点" min-width="100">
              <template #default="{ row, $index }">
                <el-form-item label=" " :prop="`list.${$index}.defect`"
                  :rules="viewType !== 'view' ? rules.defect : {}">
                  <el-select-v2 filterable clearable v-model="row.defect" :options="optionInfo.defect"
                    :disabled="viewType === 'view'" :suffix-icon="viewType === 'view' ? '' : 'ArrowDown'"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column min-width="100" label="数量" align="center">
              <template #default="{ row, $index }">
                <el-form-item :prop="`list.${$index}.defectNum`" label=" " :rules="viewType !== 'view' ? rules.defectNum : {}">
                  <el-input-number clearable v-model="row.defectNum" :min="0" style="margin: 1px 0;width: 100%;"
                    :controls="false" :precision="0" :disabled="viewType === 'view'"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column min-width="300" label="问题描述" align="center">
              <template #default="{ row, $index }">
                <el-form-item :prop="`list.${$index}.problemDescription`" label=" "
                  :rules="viewType !== 'view' ? rules.problemDescription : {}">
                  <s-text-area v-model="row.problemDescription" style="width: 100%;margin: 1px 0"
                    :disabled="viewType === 'view'" maxlength="50" show-word-limit
                    :autosize="{ minRows: 1, maxRows: 4 }" clearable />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="65" label="操作" align="center" v-if="viewType !== 'view'">
              <template #default="{ row }">
                <el-button type="danger" link @click="delProblemDescriptionList(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-card>
    </div>
    <div v-if="dataValue.qualityInspectionCycle === 3">
      <el-card shadow="never" class="qcCard">
        <template #header>
          <logo-label txt="疵点描述" :is-edit="false" />
          <el-button type="primary" v-if="viewType !== 'view' && dataValue?.defectDescriptionList?.length < 8"
            icon="Plus" @click="add">新增</el-button>
        </template>
        <el-form :model="{ list: dataValue?.defectDescriptionList || [] }" :rules="viewType !== 'view' ? rules : {}"
          scroll-to-error ref="formRef7" :disabled="viewType === 'view'">
          <el-table class="table-form" :data="dataValue?.defectDescriptionList || []" width="100%"
            row-class-name="commonTableRow"
            :header-cell-style="{ backgroundColor: '#F8F8F9', color: '#666', fontSize: '14px', fontWeight: '400' }"
            border>
            <el-table-column type="index" width="55" label="序号" align="center" />
            <el-table-column min-width="200" label="疵点" align="center">
              <template #default="{ row, $index }">
                <el-form-item :prop="`list.${$index}.defect`" label=" "
                  :rules="viewType !== 'view' ? rules.defect : {}">
                  <el-select-v2 filterable clearable v-model="row.defect" :options="pointer" :suffix-icon="viewType === 'view' ? '' : 'ArrowDown'"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column min-width="200" label="严重" align="center">
              <template #default="{ row, $index }">
                <el-form-item :prop="`list.${$index}.serious`" label=" ">
                  <el-input-number clearable v-model="row.serious" :min="0" style="margin: 1px 0;width: 100%;"
                    :controls="false" :precision="0" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column min-width="200" label="轻微" align="center">
              <template #default="{ row, $index }">
                <el-form-item :prop="`list.${$index}.slight`" label=" ">
                  <el-input-number clearable v-model="row.slight" :min="0" style="margin: 1px 0;width: 100%;"
                    :controls="false" :precision="0" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :width="400" label="图片" align="center">
              <template #default="{ row, $index }">
                <el-form-item :prop="`list.${$index}.image`" label=" ">
                  <transfer :width="350" v-if="isShowFile(row.image)" v-model="row.image" :limit="5" :tip="''"
                    :upload-data="{ code: 'QC_Quality' }" multiple :is-file-show="false" is-hidden-file />
                  <div v-if="!['', null, undefined].includes(row.image)"
                    style="text-align: center;width: 100%;position: relative;">
                    <line-image :urls="row.image" left="170px" />
                    <el-icon class="el-icon-close" v-if="viewType !== 'view'" @click="row.image = ''"
                      style="cursor: pointer;position: absolute;right:110px;top: 15px; color: #eb3737">
                      <Delete />
                    </el-icon>
                  </div>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="65" label="操作" align="center" v-if="viewType !== 'view'">
              <template #default="{ $index }">
                <el-button type="danger" link @click="del($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-card>
      <el-card shadow="never" class="qcCard">
        <template #header>
          <logo-label txt="抽查方案" :is-edit="false" />
        </template>
        <el-table class="SWCommonTable" :data="dataValue.spotCheckPlanList" width="100%"
          :row-class-name="tableRowClassName"
          :header-cell-style="{ backgroundColor: '#F8F8F9', color: '#666', fontSize: '14px', fontWeight: '400' }"
          border>
          <el-table-column type="index" width="55" label="序号" align="center" />
          <el-table-column label="批量范围" min-width="140" property="batchRangeName" />
          <el-table-column label="样本量" min-width="120" property="sampleSize" />
          <el-table-column label="AC" min-width="120" property="twoPointFiveAc" />
          <el-table-column label="RE" min-width="120" property="twoPointFiveRe" />
        </el-table>
      </el-card>
    </div>
    <el-card shadow="never" class="qcCard">
      <template #header>
        <logo-label txt="抽查结论" :is-edit="false" />
      </template>
      <el-form :model="dataValue" class="table-form"  label-width="100">
        <el-form-item prop="testResults" label="检测结果" >
          <el-radio-group v-model="dataValue.testResults" :disabled="(viewType === 'view') || (viewType === 'edit' && bukValue.testResults === '1')">
            <el-radio value="1" border>通过</el-radio>
            <el-radio value="0" border>不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item prop="spotCheckBoxNumber" label="抽查箱号" style="padding-top: 16px"
          v-if="dataValue.qualityInspectionCycle === 3">
          <el-input v-model.trim="dataValue.spotCheckBoxNumber" style="width: 40%;" placeholder="请输入" maxlength="100"
            show-word-limit clearable />
        </el-form-item> -->
        <el-form-item prop="comment" label="评语" style="padding-top: 16px">
          <STextArea v-model.trim="dataValue.comment" :rows="4" style="width: 40%;" maxlength="100" show-word-limit
            clearable placeholder="请输入(100字以内)" :disabled="viewType === 'view'"/>
          <!-- <el-input v-model.trim="dataValue.comment" maxlength="100" show-word-limit clearable /> -->
        </el-form-item>
      </el-form>
    </el-card>
    <!-- <logo-label txt="抽查箱号" :is-edit="false" style="margin-bottom: 16px" v-if="dataValue.qualityInspectionCycle === 3"/>
    <el-form :model="dataValue" class="table-form" label-width="100" :disabled="viewType === 'view'" v-if="dataValue.qualityInspectionCycle === 3">
      <el-form-item prop="spotCheckBoxNumber" label="抽查箱号">
        <el-input v-model.trim="dataValue.spotCheckBoxNumber" maxlength="100" show-word-limit clearable/>
      </el-form-item>
    </el-form>
    <logo-label txt="评语" :is-edit="false" style="margin-bottom: 16px" />
    <el-form :model="dataValue" class="table-form" label-width="100" :disabled="viewType === 'view'">
      <el-form-item prop="comment" label="评语">
        <el-input v-model.trim="dataValue.comment" maxlength="100" show-word-limit clearable/>
      </el-form-item>
    </el-form> -->
    <el-card shadow="never" class="qcCard">
      <template #header>
        <logo-label txt="附件信息" :is-edit="false" />
      </template>
      <el-form :model="dataValue" class="table-form1" label-width="100" inline>
        <el-form-item prop="fileIds" label="主要疵点图片" v-if="dataValue.qualityInspectionCycle !== 3">
          <transfer style="width: 366px" v-model="dataValue.fileIds" :limit="10" :tip="'最多上传10张大小不超过20M的图片'"
            :upload-data="{ code: 'QC_Quality' }" :disabled="viewType === 'view'" multiple />
        </el-form-item>
        <el-form-item prop="sizeMeasureImg" label="尺寸度量图" v-if="dataValue.qualityInspectionCycle !== 3">
          <transfer style="width: 366px" v-model="dataValue.sizeMeasureImg" :limit="10" :tip="'最多上传10张大小不超过20M的图片'"
            :upload-data="{ code: 'QC_Quality' }" :disabled="viewType === 'view'" multiple />
        </el-form-item>
        <el-form-item prop="packagingFileIds" label="包装图" v-if="dataValue.qualityInspectionCycle === 3"
          style="margin-bottom: 16px !important">
          <transfer style="width: 366px" v-model="dataValue.packagingFileIds" :limit="10" :tip="'最多上传10张大小不超过20M的图片'"
            :upload-data="{ code: 'QC_Quality' }" :disabled="viewType === 'view'" multiple />
        </el-form-item>
        <el-form-item prop="productFileIds" label="产品图" v-if="dataValue.qualityInspectionCycle === 3"
          style="margin-bottom: 16px !important">
          <transfer style="width: 366px" v-model="dataValue.productFileIds" :limit="10" :tip="'最多上传10张大小不超过20M的图片'"
            :upload-data="{ code: 'QC_Quality' }" :disabled="viewType === 'view'" multiple />
        </el-form-item>
        <el-form-item prop="inspectionColorFileIds" label="验货颜色" v-if="dataValue.qualityInspectionCycle === 3"
          style="margin-bottom: 16px !important">
          <transfer style="width: 366px" v-model="dataValue.inspectionColorFileIds" :limit="10"
            :tip="'最多上传10张大小不超过20M的图片'" :upload-data="{ code: 'QC_Quality' }" :disabled="viewType === 'view'"
            multiple />
        </el-form-item>
        <el-form-item prop="logoFileIds" label="LOGO标" v-if="dataValue.qualityInspectionCycle === 3"
          style="margin-bottom: 16px !important">
          <transfer style="width: 366px" v-model="dataValue.logoFileIds" :limit="10" :tip="'最多上传10张大小不超过20M的图片'"
            :upload-data="{ code: 'QC_Quality' }" :disabled="viewType === 'view'" multiple />
        </el-form-item>
        <el-form-item prop="certificateFileIds" label="合格证" v-if="dataValue.qualityInspectionCycle === 3"
          style="margin-bottom: 16px !important">
          <transfer style="width: 366px" v-model="dataValue.certificateFileIds" :limit="10" :tip="'最多上传10张大小不超过20M的图片'"
            :upload-data="{ code: 'QC_Quality' }" :disabled="viewType === 'view'" multiple />
        </el-form-item>
        <el-form-item prop="durabilityLabelFileIds" label="耐久性标签" v-if="dataValue.qualityInspectionCycle === 3"
          style="margin-bottom: 16px !important">
          <transfer style="width: 366px" v-model="dataValue.durabilityLabelFileIds" :limit="10"
            :tip="'最多上传10张大小不超过20M的图片'" :upload-data="{ code: 'QC_Quality' }" :disabled="viewType === 'view'"
            multiple />
        </el-form-item>
        <el-form-item prop="packQuantityFileIds" label="装箱量" v-if="dataValue.qualityInspectionCycle === 3">
          <transfer style="width: 366px" v-model="dataValue.packQuantityFileIds" :limit="10" :tip="'最多上传10张大小不超过20M的图片'"W
            :upload-data="{ code: 'QC_Quality' }" :disabled="viewType === 'view'" multiple />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="tsx">
export default { name: 'QualityDetailsDetection' }
</script>

<script lang="tsx" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import LineImage from "@/components/template/table/components/lineImage.vue";
import { DetailProvideType } from '@/components/template/config/type'
import LogoLabel from '@/components/common/label/logoLabel.vue'
import Transfer from '@/components/common/upload/transfer.vue'
import { DefectDescriptionItem } from "../details/details";
import { getIntDictOptions } from '@/utils/dict';
import { ProblemItem } from "../details/details";
import { vi } from "element-plus/es/locale";

const { dataValue, viewType,bukValue } = inject('QualityDetails') as DetailProvideType

const pointer = ref<Array<any>>([]), mode = ref<Array<any>>([]);

const formRef = ref(), formRef7 = ref(), optionInfo = ref<any>({});
const rules = reactive({
  measureSituation: [{ required: true, message: '请选择检查结果', trigger: ['blur', 'change'] }],
  defect: [{ required: true, message: '请选择疵点', trigger: ['blur', 'change'] }],
  defectNum: [{ required: true, message: '请输入数量', trigger: ['blur', 'change'] }],
  problemDescription: [{ required: true, message: '请输入问题描述', trigger: ['blur', 'change'] }]
})
const checkValue = async () => {
  const valid = formRef?.value ? await formRef?.value?.validate((valid: boolean) => valid) : true
  const valid7 = formRef7?.value ? await formRef7?.value?.validate((valid: boolean) => valid) : true;
  return valid && valid7
};
defineExpose({ checkValue });
const initDic = () => {
  mode.value = getIntDictOptions('packing_method', true) || [];
  pointer.value = getIntDictOptions('defect_description', true) || [];
  optionInfo.value = {
    defect: getIntDictOptions('defect_description', true) || [],
  };
};

const addProblemDescriptionList = () => {
  dataValue.value.problemDescriptionList.push({ ...new ProblemItem(), number: dataValue.value.problemDescriptionList.length + 1 });
};

const delProblemDescriptionList = (item: ProblemItem) => {
  dataValue.value.problemDescriptionList = dataValue.value.problemDescriptionList.filter((ds: any) => ds.number !== item.number).map((des: any, idx: number) => ({ ...des, number: idx + 1 }));
};

const add = () => {
  dataValue.value.defectDescriptionList.push({ ...new DefectDescriptionItem() });
};

const del = (index: number) => {
  dataValue.value.defectDescriptionList.splice(index, 1);
};

const tableRowClassName = ({ row }) => {
  return Number(row?.isHit || 0) === 1 ? 'mark_line' : '';
};
const isShowFile = (url: string) => {
  const matches = url.split('?name=').length - 1;
  return matches !== 5 && viewType.value !== 'view'
};
onMounted(() => {
  initDic();
})


</script>
<style lang="scss" scoped>
:deep() {
  .el-radio {
    &.is-checked {
      .el-radio__label {
        font-weight: 500 !important;
      }
    }

    .el-radio__label {
      font-weight: 400;
    }
  }
}

.required_txt {
  position: relative;

  &::before {
    content: '*';
    position: absolute;
    left: -10px;
    top: 3px;
    color: #eb3737;
  }
}

.table-form1 {
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  .el-form-item {
    flex: 1;
  }
}
</style>
