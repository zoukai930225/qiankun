<template>
  <scheme-dialog ref="detailsRef" name="CategoryManager">
    <template #card>
      <el-form ref="formRef" label-width="80" :model="dataValue" :rules="formRules" class="cusForm">
        <el-form-item label="流程" prop="process">
          <el-select v-model="dataValue.process" clearable>
            <el-option :label="dict.label" :value="dict.value"
              v-for="dict in getIntDictOptions(DICT_TYPE.SYS_CATEGORY_MANAGER_PROCESS)" :key="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="dataValue.role" clearable>
            <el-option :label="dict.label" :value="dict.value"
              v-for="dict in getIntDictOptions(DICT_TYPE.SYS_CATEGORY_MANAGER_ROLE)" :key="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="品类" prop="category">
          <el-cascader v-model="dataValue.category" :options="categoryList" :props="cascaderProps" clearable
            style="width: 100%;" :persistent="!!dataValue.category?.length" separator=">"/>
        </el-form-item>
        <el-form-item label="负责人" prop="managers">
          <selectPeople v-model="dataValue.managers"/>
        </el-form-item>
      </el-form>
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()" :disabled="loading">关闭</el-button>
      <el-button type="primary" @click="submitForm" :disabled="loading">提交</el-button>
    </template>
  </scheme-dialog>
</template>

<script lang="tsx">
export default { name: 'CategoryManagerDetails' };
</script>

<script lang="tsx" setup>
import { FromProvideType } from '@/components/template/config/type';
import { cloneDeep, debounce } from "lodash-es";
import { DataItem } from "../config/config";
import { getIntDictOptions, DICT_TYPE, } from '@/utils/dict';
import { saveSysCategoryManager, updateSysCategoryManager } from '@/api/system/categoryManager';
import selectPeople from '@/components/template/table/components/lineStaffs.vue'

const message = useMessage();

const { onSearch } = inject(`CategoryManagerForm`) as FromProvideType;
const { categoryList } = inject('categoryList') as any

const detailsRef = ref<any>(), formRef = ref(), dataValue = ref<DataItem>({ ...new DataItem() }), bukValue = ref<DataItem>({ ...new DataItem() }), viewType = ref<string>('view'), loading = ref<boolean>(false);

const cascaderProps = {
  label: 'categoryName',
  value: 'categoryCode',
  children: 'subCategories',
  checkStrictly: true
}


// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });

const title = computed(() => viewType.value === 'add' ? '新增' : '编辑');

// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  // detailsRef openDialog方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDialog(async () => {
    // let category = [] as any
    // if (item.secondCategory) {
    //   if (item.thirdCategory) {
    //     category = [item.firstCategory, item.secondCategory, item.thirdCategory]
    //   } else {
    //     category = [item.firstCategory, item.secondCategory]
    //   }
    // } else {
    //   category = [item.firstCategory]
    // }
    const category = getParentCodes(item.categoryCode)
    dataValue.value = {
      ...new DataItem(), ...item,
      category
    };
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
  if(!str) return []
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

// 表单校验规则
const formRules = reactive({
  process: [{ required: true, message: '请选择流程', trigger: ['blur', 'change'] }],
  role: [{ required: true, message: '请选择角色', trigger: ['blur', 'change'] }],
  category: [{ required: true, message: '请选择品类', trigger: ['blur', 'change'] }],
  managers: [{ required: true, message: '请选择负责人', trigger: ['blur', 'change'] }]
})

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
  const params = { ...dataValue.value }
  if (params?.category?.length) {
    params.categoryCode = params.category[params.category.length - 1]
  }
  params.managerId = params.managers.map((user: any) => user.userId).join(',')
  delete params.category
  loading.value = true;
  const request = viewType.value === 'add' ? saveSysCategoryManager : updateSysCategoryManager
  request(params).then(() => {
    message.success('操作成功');
    detailsRef?.value?.closed();
    onSearch();
  }).finally(() => {
    loading.value = false;
  });
}, 1000);

defineExpose({ openView });

provide('CategoryManagerDetails', { dataValue, bukValue, viewType, title });

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>