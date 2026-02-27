<template>
  <div>
    <el-card shadow="never" class="qcCard">
      <template #header>
        <logo-label txt="面辅料测试" :is-edit="false" />
      </template>
      <el-form :model="dataValue" :rules="rules" ref="formRef" :disabled="viewType === 'view'">
        <el-form-item prop="matAccTestQualified" label="测试项目：色牢度、缩率、扭曲度、纬斜、克重、手感、拉开度、布面效果"  style="margin:10px 0 10px 0">
          <el-radio-group v-model="dataValue.matAccTestQualified">
            <el-radio border label="合格" value="1" />
            <el-radio border label="不合格" value="0" />
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="qcCard">
      <template #header>
        <logo-label txt="资料核对" :is-edit="false" />
      </template>
      <el-form :model="dataValue" :rules="rules" ref="formRef1" :disabled="viewType === 'view'">
        <el-form-item prop="dataCheckIsQualified" label="核对项目：产前样、工艺单核对项目：颜色、针距、工艺、烫标洗唛、底面线、针数、粘合牢度、合格证信息" style="margin:10px 0 10px 0">
          <el-radio-group v-model="dataValue.dataCheckIsQualified">
            <el-radio border label="已核对" value="1" />
            <el-radio border label="未核对" value="0" />
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="qcCard">
      <template #header>
        <logo-label txt="供应商检验记录核对" :is-edit="false" />
      </template>
      <el-form class="table-form" label-width="80" :disabled="viewType === 'view'" :model="dataValue" :rules="rules" ref="formRef2" style="margin:10px 0 10px 0">
        <el-form-item prop="checkRecordIsQualified" label="验布记录">
          <el-radio-group v-model="dataValue.checkRecordIsQualified">
            <el-radio border label="已核对" value="1" />
            <el-radio border label="未核对" value="0" />
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="inspectionRecordIsQualified" label="巡检记录">
          <el-radio-group v-model="dataValue.inspectionRecordIsQualified">
            <el-radio border label="已核对" value="1" />
            <el-radio border label="未核对" value="0" />
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="finishProductQualified" label="成品抽查记录" class="longLabel">
          <el-radio-group v-model="dataValue.finishProductQualified">
            <el-radio border label="已核对" value="1" />
            <el-radio border label="未核对" value="0" />
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- <logo-label txt="面辅料测试" :is-edit="false" style="margin-bottom: 16px;" />
    
    <logo-label txt="资料核对" :is-edit="false" style="margin-bottom: 16px;" /> -->

    <!-- <logo-label txt="供应商检验记录核对" :is-edit="false" style="margin-bottom: 16px;" />
    <el-form class="table-form" label-width="80" :model="dataValue">
      <el-form-item label="验布记录">
        <el-radio-group>
          <el-radio label="已核对" value="1"/>
          <el-radio label="未核对" value="2"/>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="巡检记录">
        <el-radio-group>
          <el-radio label="已核对" value="1"/>
          <el-radio label="未核对" value="2"/>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="成品抽查记录" class="longLabel">
        <el-radio-group>
          <el-radio label="已核对" value="1"/>
          <el-radio label="未核对" value="2"/>
        </el-radio-group>
      </el-form-item>
    </el-form> -->
    <!-- <logo-label txt="尺寸度量" :is-edit="false" style="margin-bottom: 16px;" />
    <el-table class="SWCommonTable" :data="dataValue.dimenMeasureList" width="100%" row-class-name="commonTableRow"
      :header-cell-style="{ backgroundColor: '#F2F6FC', color: '#666', fontSize: '14px', fontWeight: '400' }" border>
      <el-table-column type="index" width="55" label="序号" align="center" />
      <el-table-column label="部位名称" min-width="140" property="partName" />
      <el-table-column label="公差±cm" min-width="120" property="tolerance" />
      <el-table-column label="160/85M" align="center">
        <el-table-column label="标准" min-width="120" property="standard"
          :formatter="(row: any) => row.sizeDetailsOne.standard" />
        <el-table-column label="样品" min-width="200" property="sample">
          <template #default="{ row }">
            <el-input v-model="row.sizeDetailsOne.sample" style="width: 100%;margin: 1px 0;"
              :disabled="viewType === 'view'" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="165/90L" align="center">
        <el-table-column label="标准" min-width="120" property="standard"
          :formatter="(row: any) => row.sizeDetailsTwo.standard" />
        <el-table-column label="样品" min-width="200" property="sample">
          <template #default="{ row }">
            <el-input v-model="row.sizeDetailsTwo.sample" style="width: 100%;margin: 1px 0;"
              :disabled="viewType === 'view'" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="170/95XL" align="center">
        <el-table-column label="标准" min-width="120" property="standard"
          :formatter="(row: any) => row.sizeDetailsThree.standard" />
        <el-table-column label="样品" min-width="200" property="sample">
          <template #default="{ row }">
            <el-input v-model="row.sizeDetailsThree.sample" style="width: 100%;margin: 1px 0;"
              :disabled="viewType === 'view'" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="175/100XXL" align="center">
        <el-table-column label="标准" min-width="120" property="standard"
          :formatter="(row: any) => row.sizeDetailsFour.standard" />
        <el-table-column label="样品" min-width="200" property="sample">
          <template #default="{ row }">
            <el-input v-model="row.sizeDetailsFour.sample" style="width: 100%;margin: 1px 0;"
              :disabled="viewType === 'view'" />
          </template>
        </el-table-column>
      </el-table-column>
    </el-table> -->

  </div>
</template>

<script lang="tsx">
export default { name: 'QualityDetailsSize' };
</script>

<script lang="tsx" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { DetailProvideType } from '@/components/template/config/type';
import LogoLabel from '@/components/common/label/logoLabel.vue';
import { ProblemItem } from "../details/details";
import { getIntDictOptions } from '@/utils/dict';

const { dataValue, viewType } = inject('QualityDetails') as DetailProvideType;

const formRef = ref(),formRef1 = ref(),formRef2 = ref(), optionInfo = ref<any>({});

const rules = reactive({
  matAccTestQualified: [{ required: true, message: '请选择面辅料测试是否合格', trigger: ['blur', 'change'] }],
  dataCheckIsQualified: [{ required: true, message: '请选择资料是否核对', trigger: ['blur', 'change'] }],
  checkRecordIsQualified: [{ required: true, message: '请选择验布记录是否核对', trigger: ['blur', 'change'] }],
  inspectionRecordIsQualified: [{ required: true, message: '请选择巡检记录是否核对', trigger: ['blur', 'change'] }],
  finishProductQualified: [{ required: true, message: '请选择成品抽查记录是否核对', trigger: ['blur', 'change'] }],
});

const initDic = () => {
  optionInfo.value = {
    defect: getIntDictOptions('defect_description', true) || [],
  };
};


const checkValue = async () => {
  const valid = await formRef?.value?.validate((valid: boolean) => valid);
  const valid1 = await formRef1?.value?.validate((valid: boolean) => valid);
  const valid2 = await formRef2?.value?.validate((valid: boolean) => valid);
  return valid && valid1 && valid2;
};

const clearValidate = () => {
  formRef?.value?.clearValidate();
  formRef1?.value?.clearValidate();
  formRef2?.value?.clearValidate();
}

onMounted(() => {
  initDic();
})
defineExpose({ checkValue,clearValidate });

</script>
<style lang="scss" scoped>
.table-form {
  width: 100%;
  display: inline-grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  justify-content: stretch;
  gap: 16px;

  .el-form-item {
    display: flex;
    align-items: center;
  }
}

.longLabel {
  :deep(.el-form-item__label) {
    line-height: 16px;
    text-align: right;
  }
}
</style>
