<template>
  <el-dialog v-model="visible" title="Tips" width="400" :before-close="handleClose" :show-close="false" align-center>
    <template #header>
      <div class="header">
        <div>{{ txt }}</div>
        <img src="@/assets/imgs/common/close.png" alt="" @click="visible = false" />
      </div>
    </template>
    <div class="container">
      <el-form :model="dataValue" label-width="80px" ref="formRef" :validate-on-rule-change="false" :rules="rules">
        <el-form-item label="一级部门" prop="departIds" v-if="viewType === 'solution'">
          <el-select v-model="dataValue.departIds" placeholder="请选择一级部门" multiple collapse-tags-tooltip collapse-tags
            style="width: 285px;">
            <el-option v-for="ops in options" :label="ops.label" :value="ops.value" :disabled="ops.disabled" />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${viewType === 'solution' ? '解封' : '封版'}月份`" prop="month">
          <el-date-picker v-model="dataValue.month" :placeholder="`请选择${viewType === 'solution' ? '解封' : '封版'}月份`"
            type="month" valueFormat="YYYY-MM" format="YYYY-MM" style="width: 285px;"
            :disabledDate="(time: Date) => time.getTime() > new Date(dayjs().add(-1, 'month').format('YYYY-MM')).getTime()" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm" :disabled="loading">提 交</el-button>
    </template>
  </el-dialog>
</template>

<script lang="tsx">
export default { name: 'MonthAssessmentPlate' };
</script>

<script lang="tsx" setup>
import { FromProvideType } from '@/components/template/config/type';
import { consistency } from "@/utils";
import { debounce } from "lodash-es";
import request from '@/config/axios';
import dayjs from "dayjs";

const message = useMessage();

const { resetForm } = inject(`MonthAssessmentForm`) as FromProvideType;

const formRef = ref(), visible = ref<boolean>(false), viewType = ref<string>('solution'), dataValue = ref<any>({}), bukValue = ref<any>({}), loading = ref<boolean>(false);

const props = defineProps({
  options: { type: Array<any>, default: () => [] }
});

const rules = computed(() => (viewType.value === 'solution' ? {
  month: [{ required: true, message: `请选择${viewType.value === 'solution' ? '解封' : '封版'}月份`, trigger: 'blur' }],
  departIds: [{ required: true, message: '请选择一级部门', trigger: 'blur' }]
} : {
  month: [{ required: true, message: `请选择${viewType.value === 'solution' ? '解封' : '封版'}月份`, trigger: 'blur' }]
}));

const txt = computed(() => viewType.value === 'solution' ? '数据解封' : '数据封版');

const openDialog = (type: string) => {
  dataValue.value = {};
  bukValue.value = {};
  viewType.value = type;
  visible.value = true;
  nextTick(() => {
    formRef?.value?.clearValidate();
  });
};

const checkValue = async () => {
  return await formRef?.value?.validate((valid: boolean) => {
    return valid
  });
};

const submitForm = async () => {
  const valid: boolean = await checkValue();
  valid && submit();
};

const submit = debounce(async () => {
  loading.value = true;
  const params: any = viewType.value === 'solution' ? { month: dataValue.value.month, departIds: dataValue.value.departIds.join(',') } : { month: dataValue.value.month };
  request.get({ url: `/api/employeeMonthlyAssessment/${viewType.value !== 'solution' ? 'dataStop' : 'dataRelease'}`, params }).then(() => {
    message.success('操作成功');
    visible.value = false;
    resetForm();
  }).finally(() => {
    loading.value = false;
  });
}, 500);

const handleClose = (done) => {
  consistency(dataValue.value, bukValue.value, () => {
    done()
  })
};

defineExpose({ openDialog });

</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  color: #333333;
  font-weight: 500;

  img {
    width: 14px;
    cursor: pointer;
  }
}
</style>
