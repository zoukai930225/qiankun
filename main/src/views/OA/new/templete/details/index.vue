<template>
  <scheme-dialog ref="detailsRef" name="OaNewTemplete">
    <template #card>
      <div class="dialog-content" style="margin-bottom: 20px">
        <el-form :inline="true" :model="dataValue" ref="formRef">
          <div class="flex-row form-wapper">
            <div style="flex-wrap: wrap; flex: 1" class="flex-row">
              <div v-for="(field, index) in configList" :key="index">
                <el-form-item v-if="field.edit" :label="`${field.name}:`" label-width="100px"
                  :required="field.required == 1 && field.type != 6" :prop="field.code" :rules="getRules(field)">
                  <component style="width: 300px" :is="componentMap[field.type]" v-model="dataValue[field.code]"
                    :placeholder="field.placeholder" :type="componentTypeMap[field.type]" :maxlength="field.maxLength"
                    :multiple="field.type === 3" :value-format="field.type === 5 ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'"
                    clearable :options="field.options">
                    <template v-if="field.type === 2 || field.type === 3">
                      <el-option v-for="option in field.options" :key="option.id" :label="option.value"
                        :value="option.code" />
                    </template>
                  </component>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="submitForm" :disabled="loading">提交</el-button>
    </template>
  </scheme-dialog>
</template>

<script lang="tsx">
export default { name: 'OaNewTempleteDetails' };
</script>

<script lang="tsx" setup>
import { FromProvideType } from '@/components/template/config/type';
import { cloneDeep, debounce } from "lodash-es";
import { DataItem } from "../page/config";
import request from '@/config/axios';

const componentMap = {
  0: 'el-input',
  1: 'el-input-number',
  2: 'el-select',
  3: 'el-select',
  4: 'el-date-picker',
  5: 'el-date-picker',
  6: 'el-switch'
}

const componentTypeMap = {
  0: 'text',
  1: 'undefined',
  2: 'single',
  3: 'undefined',
  4: 'date',
  5: 'datetime',
  6: 'undefined'
}

const message = useMessage(), configList = ref<Array<any>>([]);

const { onSearch } = inject(`OaNewTempleteForm`) as FromProvideType;

const detailsRef = ref<any>(), formRef = ref(), dataValue = ref<DataItem>({ ...new DataItem() }), bukValue = ref<DataItem>({ ...new DataItem() }), viewType = ref<string>('view'), loading = ref<boolean>(false);

const title = computed(() => viewType.value === 'add' ? '新增' : '编辑');

const formRules = computed(() => {
  const rules: any = {}
  configList.value.forEach((field) => {
    const type = field.code
    rules[type] = [{ required: true, message: `${field.name}不能为空`, trigger: 'blur' }]
  })
  return rules
});

const getConfig = async () => {
  const res = await request.get({ url: `/basicAttribute/queryByCode?code=OaNewTemplete` })
  configList.value = res || []
  configList.value.sort((a, b) => a.sort - b.sort)
};

// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  // detailsRef openDialog方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDialog(async () => {
    await getConfig();
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
  loading.value = true;
  request.post({ url: `/api/np/progress/${!dataValue.value?.id ? 'save' : 'update'}`, data: dataValue.value }).then(() => {
    message.success('操作成功');
    detailsRef?.value?.closed();
    onSearch();
  }).finally(() => {
    loading.value = false;
  });
}, 500);

const getRules = (field) => {
  const type = field.code
  return formRules.value[type] || []
}

defineExpose({ openView });

provide('OaNewTempleteDetails', { dataValue, bukValue, viewType, title });

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>