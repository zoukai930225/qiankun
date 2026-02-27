<template>
  <scheme-details ref="detailsRef" name="Unsalable">
    <template #card>
      <el-form ref="formRef" :model="dataValue" label-width="90" :rules="rules" style="margin-right: 10px;">
        <el-form-item label="编码类型" prop="codeType">
          <el-radio-group v-model="dataValue.codeType" :disabled="!!dataValue.id" @change="handleChangeCodeType">
            <el-radio v-for="item in codeTypeOps" :key="item.value" :label="item.label" :value="item.value" />
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="productNumber" label="编码:">
          <GoodsNoSelector :type="(dataValue.codeType! as any)" v-model:model-value="dataValue.productNumber"
            :disabled="!!dataValue.id" @change="handleNumberChange" />
        </el-form-item>
        <el-form-item prop="productName" label="货品名称:">
          <el-input v-model.trim="dataValue.productName" clearable :disabled="true" placeholder="请输入货品名称" />
        </el-form-item>
        <el-form-item prop="costs" label="成本:">
          <el-input v-model.trim="dataValue.costs" clearable placeholder="请输入成本" />
        </el-form-item>
        <el-form-item prop="type" label="类别:">
          <el-select v-model="(dataValue.type as any)" clearable placeholder="请选择类别">
            <el-option v-for="item in typeOps" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item prop="category" label="品类:">
          <el-select v-model="(dataValue.category as any)" clearable>
            <el-option v-for="item in categoryOps" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item prop="seasonCategory" label="季节分类:">
          <el-select v-model="(dataValue.seasonCategory as any)" clearable>
            <el-option v-for="item in seasonCategoryOps" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item prop="directorId" label="责任人:">
          <select-people :multiple="false" v-model:modelValue="directorNames"
            v-model:operatorName="dataValue.directorName" :userId="dataValue.directorId"
            @update:user-id="handleUpdateUserId" />
        </el-form-item>
        <el-form-item prop="image" label="图片">
          <UploadImg v-model:model-value="dataValue.image" disabled />
        </el-form-item>
      </el-form>
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
      <el-button v-if="!dataValue.id" type="primary" plain @click="submitForm('add')">保存并继续</el-button>
      <el-button type="primary" @click="submitForm()">保存</el-button>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'UnsalableDetails' };
</script>

<script lang="tsx" setup>
import { categoryOps, typeOps, seasonCategoryOps, codeTypeOps } from '../page/options';
import { FromProvideType } from '@/components/template/config/type';
import GoodsNoSelector from '../components/goodsNoSelector.vue';
import { getRowDetail } from '@/api/productManage/deadStock';
import SelectPeople from '../components/selectPeople.vue';
import { cloneDeep, debounce } from "lodash-es";
import { DataItem } from "../page/config";
import request from '@/config/axios';

const message = useMessage(), directorNames = ref<string[]>([]);

const { onSearch, searchData } = inject(`UnsalableForm`) as FromProvideType;

const detailsRef = ref<any>(), formRef = ref(), dataValue = ref<DataItem>({ ...new DataItem() }), bukValue = ref<DataItem>({ ...new DataItem() }), viewType = ref<string>('view'), loading = ref<boolean>(false);

const rules = {
  productNumber: [{ required: true, message: '请选择编码' }],
  costs: [
    { required: true, message: '请输入成本' },
    {
      validator: (_, val: string, callback: (err?: Error) => any) => {
        if (val === '' || val === undefined || val === null) {
          return callback(new Error('请输入成本'))
        } else {
          const regex = /^-?\d{1,4}(?:\.\d{1,9})?$/
          regex.test(val)
            ? callback()
            : callback(new Error('请输入整数位不超过4位，小数位不超过9位的数字'))
        }
      }
    }
  ],
  productName: [{ required: true, message: '请输入货品名称' }],
  type: [{ required: true, message: '请选择类别' }],
  category: [{ required: true, message: '请选择品类' }],
  seasonCategory: [{ required: true, message: '请选择季节分类' }]
}

const title = computed(() => viewType.value === 'view' ? `详情(${searchData.value.dataDate})` : (viewType.value === 'edit' ? `编辑(${searchData.value.dataDate})` : `新增(${searchData.value.dataDate})`));

// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  detailsRef?.value?.openDrawer(async () => {
    if (type === 'add') {
      dataValue.value = { ...new DataItem(), ...item };
      bukValue.value = cloneDeep({ ...dataValue.value });
    } else {
      getDetail(item.productNumber, item.codeType);
    }
    viewType.value = type;
  }, () => {
    nextTick(() => {
      formRef?.value?.clearValidate();
    });
  });
};

const getDetail = async (id: string, type: any) => {
  const res = await getRowDetail({
    codeType: type || 1,
    dataDate: searchData.value.dataDate || '',
    productNumber: id
  })
  directorNames.value = res.directorId ? [res.directorId] : [];
  dataValue.value = res;
  bukValue.value = cloneDeep({ ...dataValue.value });
}

const handleChangeCodeType = (val: any) => {
  const value = val;
  formRef.value.resetFields();
  dataValue.value.codeType = value;
};

const handleNumberChange = async (val: any) => {
  if (val) {
    const res = await getRowDetail({
      codeType: dataValue.value.codeType || 1,
      dataDate: searchData.value.dataDate || '',
      productNumber: val
    })
    directorNames.value = res.directorId ? [res.directorId] : []
    dataValue.value.productNumber = res?.productNumber
    dataValue.value.productName = res?.productName || undefined
    dataValue.value.image = res.image || undefined
    dataValue.value.category = res.category === 0 || res.category ? res.category : undefined
    dataValue.value.type = res.type === 0 || res.type ? res.type : undefined
    dataValue.value.seasonCategory =
      res.seasonCategory === 0 || res.seasonCategory ? res.seasonCategory : undefined
    dataValue.value.costs = res.costs === 0 || res.costs ? res.costs : undefined
    dataValue.value.directorId = res.directorId
  } else {
    formRef.value.resetFields()
  }
};

const handleUpdateUserId = (val: string) => {
  dataValue.value.directorId = val;
}

// 通用表单校验
const checkValue = async () => {
  return await formRef?.value?.validate((valid: boolean) => {
    return valid
  });
};

// 提交
const submitForm = async (type: string = '') => {
  const valid: boolean = await checkValue();
  valid && submit(type);
};

// 实际提交（防抖）
const submit = debounce(async (type: string = '') => {
  loading.value = true;
  request.post({ url: `/api/opUnsalableGoods/save`, data: { ...dataValue.value, dataDate: searchData.value.dataDate } }).then(() => {
    message.success('操作成功');
    if (type !== 'add') {
      detailsRef?.value?.closed();
    } else {
      dataValue.value = { ...new DataItem() };
      bukValue.value = cloneDeep({ ...dataValue.value });
      directorNames.value = [];
      setTimeout(() => {
        formRef?.value?.clearValidate();
      }, 0)
    }
    onSearch();
  }).finally(() => {
    loading.value = false;
  });
}, 500);

defineExpose({ openView });

provide('UnsalableDetails', { dataValue, bukValue, viewType, title });

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
