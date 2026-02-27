<template>
  <scheme-dialog ref="detailsRef" name="Category">
    <template #card>
      <!-- <div> 详情内容区(外围卡片样式无需书写) </div> -->
      <el-form :model="dataValue" label-width="80" ref="formRef" :rules="formRules">
        <el-form-item prop="parentCode" label="父级类目">
          <el-cascader style="width: 100%;" clearable v-model="dataValue.parentCodes" :options="categoryTree"
            placeholder="请选择父级类目"
            :props="{ label: 'categoryName', value: 'categoryCode', children: 'subCategories', checkStrictly: true }"
            @change="changeCategory" :disabled="viewType === 'edit'" separator=">"></el-cascader>
        </el-form-item>
        <sw-text-input prop="categoryCode" label="类目编码" v-model="dataValue.categoryCode" required
          :disabled="viewType === 'edit'" :pattern="/^[a-zA-Z0-9]{3}$/">
          <template #prefix v-if="dataValue.parentCode">
            <view>{{ dataValue.parentCode }}-</view>
          </template>
        </sw-text-input>
        <sw-text-input prop="categoryName" label="类目名称" v-model="dataValue.categoryName"></sw-text-input>
        <sw-text-input prop="mainPromotedMonth" label="主推月份" v-model="dataValue.mainPromotedMonth"></sw-text-input>
        <sw-text-input prop="suitableTemperature" label="适合温度" v-model="dataValue.suitableTemperature"></sw-text-input>
        <el-form-item prop="isSeasonalProduct" label="是否季节品">
          <el-select v-model="dataValue.isSeasonalProduct" placeholder="请选择是否季节品">
            <el-option v-for="item in seasonalProdductOptions" :key="item.value" :value="item.value"
              :label="item.label"></el-option>
          </el-select>
          <template #label>
            <div style="height: 32px;line-height: 16px">
              <div>是否季节</div>
              <div>品</div>
            </div>
          </template>
        </el-form-item>
      </el-form>
    </template>
    <template #button>
      <!-- <div> 按钮操作区 </div> -->
      <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="submitForm" :disabled="loading">提交</el-button>
    </template>
  </scheme-dialog>
</template>

<script lang="tsx">
export default { name: 'CategoryDetails' };
</script>

<script lang="tsx" setup>
import { FromProvideType } from '@/components/template/config/type';
import { cloneDeep, debounce } from "lodash-es";
import { DataItem, CategoryItem } from "../config/config";
import request from '@/config/axios';

const message = useMessage();

const formRules = ref({
  // categoryCode: [{ required: true, message: '请输入类目编码', trigger: ['change', 'blur'] }],
  categoryName: [{ required: true, message: '请输入类目名称', trigger: ['change', 'blur'] }],
  secondCategory: [{ required: true, message: '请选择二级类目', trigger: ['change', 'blur'] }],
  isSeasonalProduct: [{ required: true, message: '请选择是否季节品', trigger: ['change', 'blur'] }],
})

const seasonalProdductOptions = ref([
  { label: '否', value: 0 },
  { label: '是', value: 1 },
])

const { onSearch, categoryTree, getCategoryTree } = inject(`CategoryForm`) as FromProvideType & { categoryTree: Ref<CategoryItem[]>, getCategoryTree: () => void };

const detailsRef = ref<any>(), formRef = ref(), dataValue = ref<DataItem>({ ...new DataItem() }), bukValue = ref<DataItem>({ ...new DataItem() }), viewType = ref<string>('view'), loading = ref<boolean>(false);

// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });

const title = computed(() => viewType.value === 'add' ? '新增' : '编辑');

// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  // detailsRef openDialog方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDialog(async () => {
    dataValue.value = { ...new DataItem(), ...item };
    if (dataValue.value.parentCode) {
      // item.parentCodes = item.parentCode.split('-')
      dataValue.value.parentCodes = getParentCodes(dataValue.value.parentCode)
    }
    if (dataValue.value.categoryCode) {
      const arr = dataValue.value.categoryCode.split('-')
      dataValue.value.categoryCode = arr[arr.length - 1]
    }
    // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
    bukValue.value = cloneDeep({ ...dataValue.value });
    viewType.value = type;
  }, () => {
    nextTick(() => {
      formRef?.value?.clearValidate();
    });
  });
};

const getParentCodes = (str: string): string[] => {
  const arr = str.split('-')
  const temp: string[] = []
  for (let i = 0; i < arr.length; i++) {
    if (i === 0) {
      temp.push(arr[0])
    } else {
      temp.push(temp[i - 1] + '-' + arr[i])
    }
  }
  return temp
}

const changeCategory = (val) => {
  console.log(val)
  if (!val || val.length === 0) {
    dataValue.value.parentCode = ''
    return
  }
  dataValue.value.parentCode = val[val.length - 1]
}

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
  loading.value = true;
  const query = { ...dataValue.value }
  if (query.parentCode) {
    query.categoryCode = `${query.parentCode}-${query.categoryCode}`
  }
  request.post({ url: dataValue.value?.id ? `/api/sysCategory/update` : `/api/sysCategory/save`, data: query }).then(() => {
    message.success('操作成功');
    detailsRef?.value?.closed();
    getCategoryTree()
    onSearch();
  }).finally(() => {
    loading.value = false;
  });
}, 1000);

defineExpose({ openView });

provide('CategoryDetails', { dataValue, bukValue, viewType, title });

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

</script>
<style lang="scss" scoped>
@use './styles.scss';

:deep(.el-form-item) {
  margin-bottom: 15px !important;
}
</style>