<template>
  <div>
    <el-card shadow="never" class="qcCard">
      <template #header>
        <logo-label txt="服装面料" :is-edit="false" />
      </template>
      <el-form :model="dataValue" class="table-form" :rules="viewType !== 'view' ? rules : {}" scroll-to-error
        ref="formRef" :disabled="viewType === 'view'" :validate-on-rule-change="false" label-width="80"
        style="margin:10px 0 10px 0">
        <el-form-item prop="fabricColor" label="颜色" :rules="viewType !== 'view' ? rules.fabricColor : {}">
          <el-radio-group v-model="dataValue.fabricColor">
            <el-radio border :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="fabricPrint" label="印花" :rules="viewType !== 'view' ? rules.fabricPrint : {}">
          <el-radio-group v-model="dataValue.fabricPrint">
            <el-radio border :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="fabricColorDifference" label="色差"
          :rules="viewType !== 'view' ? rules.fabricColorDifference : {}">
          <el-radio-group v-model="dataValue.fabricColorDifference">
            <el-radio border :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="fabricFunction" label="成衣洗水" :rules="viewType !== 'view' ? rules.fabricFunction : {}">
          <el-radio-group v-model="dataValue.fabricFunction">
            <el-radio border :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item prop="fabricCylinderDifference" label="缸差"
        :rules="viewType !== 'view' ? rules.fabricCylinderDifference : {}">
        <el-radio-group v-model="dataValue.fabricCylinderDifference">
          <el-radio :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="fabricFeelWool" label="毛感" :rules="viewType !== 'view' ? rules.fabricFeelWool : {}">
        <el-radio-group v-model="dataValue.fabricFeelWool">
          <el-radio :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
        </el-radio-group>
      </el-form-item> -->
        <el-form-item prop="fabricFeel" label="手感" :rules="viewType !== 'view' ? rules.fabricFeel : {}">
          <el-radio-group v-model="dataValue.fabricFeel">
            <el-radio border :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="fabricCutting" label="拉开度" :rules="viewType !== 'view' ? rules.fabricCutting : {}">
          <el-radio-group v-model="dataValue.fabricCutting">
            <el-radio border :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="fabricGramWeight" label="克重" :rules="viewType !== 'view' ? rules.fabricGramWeight : {}">
          <el-radio-group v-model="dataValue.fabricGramWeight">
            <el-radio border :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item prop="fabricOrgan" label="组织" :rules="viewType !== 'view' ? rules.fabricOrgan : {}">
        <el-radio-group v-model="dataValue.fabricOrgan">
          <el-radio :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
        </el-radio-group>
      </el-form-item> -->

        <!-- <el-form-item prop="fabricPrint" label="印花" :rules="viewType !== 'view' ? rules.fabricPrint : {}">
        <el-radio-group v-model="dataValue.fabricPrint">
          <el-radio :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="fabricHomeWash" label="家洗" :rules="viewType !== 'view' ? rules.fabricHomeWash : {}">
        <el-radio-group v-model="dataValue.fabricHomeWash">
          <el-radio :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
        </el-radio-group>
      </el-form-item> -->

      </el-form>
    </el-card>

    <el-card shadow="never" class="qcCard">
      <template #header>
        <logo-label txt="各项辅料" :is-edit="false" />
      </template>
      <el-form :model="dataValue" class="table-form" :rules="viewType !== 'view' ? rules : {}" scroll-to-error
        ref="formRef1" :disabled="viewType === 'view'" :validate-on-rule-change="false" label-width="80"
        style="margin:10px 0 10px 0">
        <el-form-item prop="accessLogo" label="LOGO标" :rules="viewType !== 'view' ? rules.accessLogo : {}">
          <el-radio-group v-model="dataValue.accessLogo">
            <el-radio border :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="accessSuture" label="缝线" :rules="viewType !== 'view' ? rules.accessSuture : {}">
          <el-radio-group v-model="dataValue.accessSuture">
            <el-radio border :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="accessRubberBand" label="橡筋" :rules="viewType !== 'view' ? rules.accessRubberBand : {}">
          <el-radio-group v-model="dataValue.accessRubberBand">
            <el-radio border :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="accessCertificate" label="合格证" :rules="viewType !== 'view' ? rules.accessCertificate : {}">
          <el-radio-group v-model="dataValue.accessCertificate">
            <el-radio border :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="accessIngredient" label="成分" :rules="viewType !== 'view' ? rules.accessIngredient : {}">
          <el-radio-group v-model="dataValue.accessIngredient">
            <el-radio border :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="accessCareLabel" label="洗唛" :rules="viewType !== 'view' ? rules.accessCareLabel : {}">
          <el-radio-group v-model="dataValue.accessCareLabel">
            <el-radio border :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item prop="accessMainLabel" label="主唛" :rules="viewType !== 'view' ? rules.accessMainLabel : {}">
        <el-radio-group v-model="dataValue.accessMainLabel">
          <el-radio :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="accessOrnament" label="装饰物" :rules="viewType !== 'view' ? rules.accessOrnament : {}">
        <el-radio-group v-model="dataValue.accessOrnament">
          <el-radio :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
        </el-radio-group>
      </el-form-item> -->
      </el-form>
    </el-card>

    <el-card shadow="never" class="qcCard">
      <template #header>
        <logo-label txt="胸贴类别" :is-edit="false" />
      </template>
      <el-form :model="dataValue" class="table-form"
        :rules="viewType !== 'view' && dataValue?.styleDescription === '4' ? rules : {}" scroll-to-error ref="formRef4"
        :disabled="viewType === 'view'" :validate-on-rule-change="false" inline label-width="80"
        style="margin:10px 0 10px 0">
        <el-form-item prop="chestPatchesProductProcessList" label="产品工艺(多选)" class="longLabel"
          :rules="viewType !== 'view' && dataValue?.styleDescription === '4' ? rules.chestPatchesProductProcessList : []">
          <el-checkbox-group v-model="dataValue.chestPatchesProductProcessList" style="width: 300px;">
            <el-checkbox label="烤胶" value="1" border />
            <el-checkbox label="常温胶" value="2" border />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="chestPatchesStyleList" label="款式类别(多选)" class="longLabel"
          :rules="viewType !== 'view' && dataValue?.styleDescription === '4' ? rules.chestPatchesStyleList : []">
          <el-checkbox-group v-model="dataValue.chestPatchesStyleList" style="width: 300px;">
            <el-checkbox label="厚杯" value="1" border />
            <el-checkbox label="薄杯" value="2" border />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="chestPatchesStickTest" label="粘性测试"
          :rules="viewType !== 'view' && dataValue?.styleDescription === '4' ? rules.chestPatchesStickTest : []">
          <el-radio-group v-model="dataValue.chestPatchesStickTest">
            <el-radio border :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="qcCard">
      <template #header>
        <logo-label txt="包装及装箱方式" :is-edit="false" />
      </template>
      <el-form :model="dataValue" class="table-form" :rules="viewType !== 'view' ? rules : {}" scroll-to-error
        ref="formRef2" :disabled="viewType === 'view'" :validate-on-rule-change="false" label-width="80"
        style="margin:10px 0 10px 0">
        <!-- <el-form-item prop="packagFoldingMethod" label="折叠方式"
        :rules="viewType !== 'view' ? rules.packagFoldingMethod : {}">
        <el-radio-group v-model="dataValue.packagFoldingMethod">
          <el-radio :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
        </el-radio-group>
      </el-form-item> -->
        <el-form-item prop="packagBag" label="袋装密封" :rules="viewType !== 'view' ? rules.packagBag : {}">
          <el-radio-group v-model="dataValue.packagBag">
            <el-radio border :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="packagBox" label="包装盒" :rules="viewType !== 'view' ? rules.packagBox : {}">
          <el-radio-group v-model="dataValue.packagBox">
            <el-radio border :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="packagBulk" label="散货包装" :rules="viewType !== 'view' ? rules.packagBulk : {}">
          <el-radio-group v-model="dataValue.packagBulk">
            <el-radio border :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item prop="packagBag" label="包装袋" :rules="viewType !== 'view' ? rules.packagBag : {}">
        <el-radio-group v-model="dataValue.packagBag">
          <el-radio :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
        </el-radio-group>
      </el-form-item> -->

      </el-form>
    </el-card>

    <el-card shadow="never" class="qcCard">
      <template #header>
        <logo-label txt="机构检测" :is-edit="false" />
      </template>
      <el-form :model="dataValue" class="table-form" :rules="viewType !== 'view' ? rules : {}" scroll-to-error
        ref="formRef3" :disabled="viewType === 'view'" :validate-on-rule-change="false" label-width="80"
        style="margin:10px 0 10px 0">
        <el-form-item prop="institutionalTestFabric" label="面辅料检测" class="longLabel"
          :rules="viewType !== 'view' ? rules.institutionalTestFabric : {}">
          <el-radio-group v-model="dataValue.institutionalTestFabric">
            <el-radio border :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item prop="institutionalReadyWear" label="成衣"
        :rules="viewType !== 'view' ? rules.institutionalReadyWear : {}">
        <el-radio-group v-model="dataValue.institutionalReadyWear">
          <el-radio :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="institutionalLining" label="里料"
        :rules="viewType !== 'view' ? rules.institutionalLining : {}">
        <el-radio-group v-model="dataValue.institutionalLining">
          <el-radio :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
        </el-radio-group>
      </el-form-item> -->
        <el-form-item prop="institutionalFunction" label="功能性检测" class="longLabel"
          :rules="viewType !== 'view' ? rules.institutionalFunction : {}">
          <el-radio-group v-model="dataValue.institutionalFunction">
            <el-radio border :value="op.value" v-for="op in options" :key="op.value">{{ op.label }}</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
    </el-card>
    <!-- <logo-label txt="装箱方式" :is-edit="false" style="margin: 20px 0 16px 0;" />
    <el-form :model="dataValue" :rules="viewType !== 'view' ? rules : {}" scroll-to-error
      ref="formRef5" :disabled="viewType === 'view'" :validate-on-rule-change="false" inline label-width="80">
      <el-form-item prop="packingMethodList" label="装箱方式" style="width: 100%;">
        <el-checkbox-group v-model="dataValue.packingMethodList" style="width: 100%;">
          <el-checkbox v-for="item in mode" :label="item.label" :value="item.value" />
        </el-checkbox-group>
      </el-form-item>
    </el-form> -->
    <el-card shadow="never" class="qcCard">
      <template #header>
        <logo-label txt="尺寸度量情况" :is-edit="false" />
      </template>
      <el-form :model="dataValue" class="table-form" :rules="viewType !== 'view' ? rules : {}" scroll-to-error
        ref="formRef6" :disabled="viewType === 'view'" :validate-on-rule-change="false" inline label-width="80"
        style="margin:10px 0 10px 0">
        <el-form-item prop="measureSituation" label="检查结果">
          <el-radio-group v-model="dataValue.measureSituation">
            <el-radio border value="1">接受Acc</el-radio>
            <el-radio border value="2">不接受Rej</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="tsx">
export default { name: 'QualityDetailsTrail' };
</script>

<script lang="tsx" setup>
// import LineImage from "@/components/template/table/components/lineImage.vue";
import { DetailProvideType } from '@/components/template/config/type';
import LogoLabel from '@/components/common/label/logoLabel.vue';
// import Transfer from "@/components/common/upload/transfer.vue";
import { DefectDescriptionItem } from "../details/details";
import { getIntDictOptions } from '@/utils/dict';

const { dataValue, viewType } = inject('QualityDetails') as DetailProvideType;

const formRef = ref(), formRef1 = ref(), formRef2 = ref(), formRef3 = ref(), formRef4 = ref(), formRef5 = ref(), formRef6 = ref(), formRef7 = ref(), listData = ref<any>([{}]), options = ref<any>([{ label: '合格', value: '1' }, { label: '不合格', value: '2' }]);

const pointer = ref<Array<any>>([]), mode = ref<Array<any>>([]);

const rules = reactive({
  fabricColor: [{ required: true, message: '请选择颜色', trigger: ['blur', 'change'] }],
  fabricCylinderDifference: [{ required: true, message: '请选择缸差', trigger: ['blur', 'change'] }],
  fabricFeelWool: [{ required: true, message: '请选择毛感', trigger: ['blur', 'change'] }],
  fabricGramWeight: [{ required: true, message: '请选择克重', trigger: ['blur', 'change'] }],
  fabricOrgan: [{ required: true, message: '请选择组织', trigger: ['blur', 'change'] }],
  fabricFeel: [{ required: true, message: '请选择手感', trigger: ['blur', 'change'] }],
  fabricPrint: [{ required: true, message: '请选择印花', trigger: ['blur', 'change'] }],
  fabricColorDifference: [{ required: true, message: '请选择颜色差', trigger: ['blur', 'change'] }],
  fabricHomeWash: [{ required: true, message: '请选择印花', trigger: ['blur', 'change'] }],
  fabricFunction: [{ required: true, message: '请选择成衣', trigger: ['blur', 'change'] }],
  fabricCutting: [{ required: true, message: '请选择拉开度', trigger: ['blur', 'change'] }],
  accessMainLabel: [{ required: true, message: '请选择主唛', trigger: ['blur', 'change'] }],
  accessOrnament: [{ required: true, message: '请选择装饰物', trigger: ['blur', 'change'] }],
  accessRubberBand: [{ required: true, message: '请选择橡筋', trigger: ['blur', 'change'] }],
  accessIngredient: [{ required: true, message: '请选择成分', trigger: ['blur', 'change'] }],
  accessCareLabel: [{ required: true, message: '请选择洗唛', trigger: ['blur', 'change'] }],
  accessSuture: [{ required: true, message: '请选择缝线', trigger: ['blur', 'change'] }],
  accessLogo: [{ required: true, message: '请选择LOGO标', trigger: ['blur', 'change'] }],
  accessCertificate: [{ required: true, message: '请选择合格证', trigger: ['blur', 'change'] }],
  chestPatchesStickTest: [{ required: true, message: '请选择粘性测试', trigger: ['blur', 'change'] }],
  packagFoldingMethod: [{ required: true, message: '请选择折叠方式', trigger: ['blur', 'change'] }],
  packagBulk: [{ required: true, message: '请选择散货包装', trigger: ['blur', 'change'] }],
  packagBox: [{ required: true, message: '请选择包装盒', trigger: ['blur', 'change'] }],
  packagBag: [{ required: true, message: '请选择包装袋', trigger: ['blur', 'change'] }],
  institutionalTestFabric: [{ required: true, message: '请选择面料', trigger: ['blur', 'change'] }],
  institutionalReadyWear: [{ required: true, message: '请选择成衣', trigger: ['blur', 'change'] }],
  institutionalLining: [{ required: true, message: '请选择里料', trigger: ['blur', 'change'] }],
  institutionalFunction: [{ required: true, message: '请选择功能性', trigger: ['blur', 'change'] }],
  chestPatchesProductProcessList: [{ required: true, message: '请选择产品工艺', trigger: ['blur', 'change'] }],
  chestPatchesStyleList: [{ required: true, message: '请选择款式类别', trigger: ['blur', 'change'] }],
  packingMethodList: [{ required: true, message: '请选择装箱方式', trigger: ['blur', 'change'] }],
  measureSituation: [{ required: true, message: '请选择检查结果', trigger: ['blur', 'change'] }],
  defect: [{ required: true, message: '请选择疵点', trigger: ['blur', 'change'] }],
});

const initDic = () => {
  mode.value = getIntDictOptions('packing_method', true) || [];
  pointer.value = getIntDictOptions('defect_description', true) || [];
};

const add = () => {
  dataValue.value.defectDescriptionList.push({ ...new DefectDescriptionItem() });
};

const del = (index: number) => {
  dataValue.value.defectDescriptionList.splice(index, 1);
};

const checkValue = async () => {
  const valid: boolean = await formRef?.value?.validate((valid: boolean) => valid);
  const valid1: boolean = await formRef1?.value?.validate((valid: boolean) => valid);
  const valid2: boolean = await formRef2?.value?.validate((valid: boolean) => valid);
  const valid3: boolean = await formRef3?.value?.validate((valid: boolean) => valid);
  const valid4: boolean = await formRef4?.value?.validate((valid: boolean) => valid);
  // const valid5: boolean = await formRef5?.value?.validate((valid: boolean) => valid);
  const valid6: boolean = await formRef6?.value?.validate((valid: boolean) => valid);
  // const valid7: boolean = await formRef7?.value?.validate((valid: boolean) => valid);
  console.log(valid, valid1, valid2, valid3, valid4, valid6);
  return valid && valid1 && valid2 && valid3 && valid4 && valid6;
};

const resetFields = () => {
  formRef?.value?.resetFields();
  formRef1?.value?.resetFields();
  formRef2?.value?.resetFields();
  formRef3?.value?.resetFields();
  formRef4?.value?.resetFields();
  // formRef5?.value?.resetFields();
  formRef6?.value?.resetFields();
  // formRef7?.value?.resetFields();
};
const clearValidate = () => {
  formRef?.value?.clearValidate();
  formRef1?.value?.clearValidate();
  formRef2?.value?.clearValidate();
  formRef3?.value?.clearValidate();
  formRef4?.value?.clearValidate();
  // formRef5?.value?.clearValidate();
  formRef6?.value?.clearValidate();
  // formRef7?.value?.clearValidate();
};


const tableRowClassName = ({ row }) => {
  return Number(row?.isHit || 0) === 1 ? 'mark_line' : '';
};

onMounted(() => {
  initDic();
  setTimeout(() => {
    clearValidate();
  }, 500);
});

const isShowFile = (url: string) => {
  const matches = url.split('?name=').length - 1;
  return matches !== 5 && viewType.value !== 'view'
};

defineExpose({ checkValue, clearValidate, resetFields });

</script>
<style lang="scss" scoped>
:deep() {
  .el-input-number {
    width: 100%;

    .el-input__inner {
      text-align: left !important;
    }
  }



  .el-checkbox {
    &.is-checked {
      .el-checkbox__label {
        font-weight: 500 !important;
      }
    }

    .el-checkbox__label {
      font-weight: 400;
    }
  }

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

.el-table {
  :deep() {
    .mark_line {
      background-color: #FBF0E7;
    }
  }
}

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
