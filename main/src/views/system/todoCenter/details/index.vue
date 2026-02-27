<template>
  <scheme-details ref="detailsRef" name="Todocenter">
    <template #card>
      <div>
        <el-form class="pt15px pr7px" ref="formRef" v-loading="loading" :model="dataValue" :rules="formRules"
          label-width="80px">
          <el-form-item label="待办类型" prop="todoType">
            <el-select v-model="dataValue.todoType" clearable placeholder="请选择待办类型" style="width: 100%" filterable>
              <el-option v-for="item in getIntDictOptions(DICT_TYPE.SYS_TODO_TYPE, true)" :key="item.value"
                :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="待办事项" prop="todoText">
            <s-text-area v-model="dataValue.todoText" :autosize="{ minRows: 2, maxRows: 4 }" style="width: 100%" />
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <transfer style="width: 334px" v-model="dataValue.icon" width="100%" :tip="'最多上传1张大小不超过20M的图片'" :limit="1"
              :is-joint="false" />
          </el-form-item>
          <el-form-item label="事项编码" prop="itemCode">
            <s-text-area v-model="dataValue.itemCode" :autosize="{ minRows: 2, maxRows: 3 }" style="width: 100%"
              maxlength="200" show-word-limit />
          </el-form-item>
          <sw-input-number prop="orderNum" label="顺序" v-model="dataValue.orderNum" :min="0" ref="inputRef"
            style="width: 100%;" placeholder="请输入排序，数字越小越靠前" form-item>
          </sw-input-number>
          <el-form-item label="跳转资源" prop="jumpResourcesMenuId">
            <menu-select :multiple="false" v-model="dataValue.jumpResourcesMenuId" ref="menuSelectRef" />
          </el-form-item>
          <el-form-item label="查询参数" prop="customParameters">
             <s-text-area v-model="dataValue.customParameters" :row="5"/>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="submitForm" :disabled="loading">提交</el-button>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'TodocenterDetails' };
</script>

<script lang="tsx" setup>
import { FromProvideType } from '@/components/template/config/type';
import { cloneDeep, debounce } from "lodash-es";
import { DataItem } from "../page/config";
import STextArea from '@/components/common/input/s-textarea.vue'
import swInputNumber from '@/components/common/inputNumber/index.vue'
import request from '@/config/axios';
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import MenuSelect from "../components/menuSelect.vue";
const message = useMessage();

const { onSearch } = inject(`TodocenterForm`) as FromProvideType;

const detailsRef = ref<any>(), formRef = ref(), dataValue = ref<DataItem>({ ...new DataItem() }), bukValue = ref<DataItem>({ ...new DataItem() }), viewType = ref<string>('view'), loading = ref<boolean>(false);

// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });

const title = computed(() => viewType.value === 'view' ? '详情' : viewType.value === 'add' ? '新增' : '编辑');
const menuSelectRef = ref()
// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  // detailsRef openDrawer方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDrawer(async () => {
    viewType.value = type;
    if (item && item.id) {
      try {
        loading.value = true;
        const res = await request.get({ url: `/api/todoConfig/get/${item.id}` })
        const params: any = {};
        Object.keys(dataValue.value).forEach(key => {
          if (Object.keys(res).includes(key)) {
            params[key] = res[key]
          }
        })
        dataValue.value = { ...new DataItem(), ...params };
        bukValue.value = cloneDeep({ ...dataValue.value });
        nextTick(() => {
          if (params.jumpResourcesMenuId) {
            menuSelectRef.value?.initValue()
          }
        })
      } catch (e) { } finally {
        loading.value = false
      }
    } else {
      dataValue.value = { ...new DataItem() };
      bukValue.value = cloneDeep({ ...dataValue.value });
    }

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
const formRules = reactive({
  todoType: [{ required: true, message: '请选择待办类型！', trigger: ['blur', 'change'] }],
  todoText: [{ required: true, message: '请输入待办事项！', trigger: ['blur', 'change'] }],
  itemCode: [{ required: true, message: '请输入事项编码！', trigger: ['blur', 'change'] }],
})
// 提交
const submitForm = async () => {
  const valid: boolean = await checkValue();
  valid && submit();
};

// 实际提交（防抖）
const submit = debounce(async () => {
  loading.value = true;
  request.post({ url: `/api/todoConfig/save`, data: dataValue.value }).then(() => {
    message.success('操作成功');
    detailsRef?.value?.closed();
    onSearch();
  }).finally(() => {
    loading.value = false;
  });
}, 500);

defineExpose({ openView });

provide('TodocenterDetails', { dataValue, bukValue, viewType, title });

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
