<template>
  <scheme-details ref="detailsRef" name="Biclear" :width="800">
    <template #card>
      <div>
        <el-descriptions :column="2" border :label-width="110">
          <el-descriptions-item label="任务名称">{{ dataValue.cleanIndicators }}</el-descriptions-item>
          <el-descriptions-item label="店铺">
            <img v-if="getImageUrl(dataValue.channel)" class="channel-img" :src="getImageUrl(dataValue.channel)"
              object-fit="contain" />
            <span class="ml25px">{{ dataValue.storeName }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="来源表">{{ dataValue.originTable || '-' }}</el-descriptions-item>
          <el-descriptions-item label="来源列">{{ dataValue.originColumn || '-' }}</el-descriptions-item>
          <el-descriptions-item label="目标表">{{ dataValue.targetTable || '-' }}</el-descriptions-item>
          <el-descriptions-item label="目标列">{{ dataValue.targetColumn || '-' }}</el-descriptions-item>
          <el-descriptions-item label="开始时间">{{ dataValue.startTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{ dataValue.endTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <sapn class="each-tag each-tag-success" v-if="dataValue.status === '成功'">成功</sapn>
            <sapn class="each-tag each-tag-fail" v-else>失败</sapn>
          </el-descriptions-item>
          <el-descriptions-item label="处理行数">{{ dataValue.resultSize || '-' }}</el-descriptions-item>
          <el-descriptions-item label="执行条件等" :span="2">{{ dataValue.item || '-' }}</el-descriptions-item>
          <el-descriptions-item label="执行SQL代码" :span="2">{{ dataValue.executeSql || '-' }}</el-descriptions-item>
          <el-descriptions-item label="其他信息" :span="2">{{ dataValue.failMsg || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </template>
    <template #button>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'BiclearDetails' };
</script>

<script lang="tsx" setup>
import { FromProvideType } from '@/components/template/config/type';
import { cloneDeep, debounce } from "lodash-es";
import { DataItem } from "../page/config";
import request from '@/config/axios';
import { getImageUrl } from '@/utils/index'
const message = useMessage();

const { onSearch } = inject(`BiclearForm`) as FromProvideType;

const detailsRef = ref<any>(), formRef = ref(), dataValue = ref<DataItem>({ ...new DataItem() }), bukValue = ref<DataItem>({ ...new DataItem() }), viewType = ref<string>('view'), loading = ref<boolean>(false);

// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });

const title = computed(() => viewType.value === 'view' ? '任务详情' : '任务编辑');

// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  // detailsRef openDrawer方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDrawer(async () => {
    dataValue.value = { ...new DataItem(), ...item };
    // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
    bukValue.value = cloneDeep({ ...dataValue.value });
    viewType.value = type;
  }, () => {
    nextTick(() => {
      formRef?.value?.clearValidate();
    });
  });
};

// 通用表单校验
const checkValue = async () => {
  return await formRef?.value?.validate((valid: boolean) => {
    return valid
  });
};

// 提交
const submitForm = async () => {
  const valid: boolean = await checkValue();
  valid && submit();
};

// 实际提交（防抖）
const submit = debounce(async () => {
  // loading.value = true;
  // request.post({ url: `/api/employeeMonthlyAssessment/update`, data: dataValue.value }).then(() => {
  //   message.success('操作成功');
  //   detailsRef?.value?.closed();
  //   onSearch();
  // }).finally(() => {
  //   loading.value = false;
  // });
}, 500);

defineExpose({ openView });

provide('BiclearDetails', { dataValue, bukValue, viewType, title });

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
