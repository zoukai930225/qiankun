<template>
  <scheme-details ref="detailsRef" name="Edition">
    <template #card>
      <div>
        <logo-label :txt="`基本信息`" :is-edit="false" is-logo style="margin-bottom: 20px;" />
        <el-form :model="dataValue" label-width="auto" :rules="rules" ref="formRef">
          <el-form-item label="版本编号" prop="version">
            <el-input v-model="dataValue.version" placeholder="请输入版本编号" />
          </el-form-item>
          <el-form-item label="发布日期" prop="releaseDate">
            <el-date-picker v-model="dataValue.releaseDate" type="date" placeholder="请选择发布日期" style="width: 100%;" />
          </el-form-item>
        </el-form>
        <div style="position: relative;">
          <logo-label :txt="`日志内容`" :is-edit="false" is-logo style="margin-bottom: 20px;" />
          <el-button @click="addItem" type="primary" style="position: absolute;top: -6px;right: 0px;">新增</el-button>
          <el-table ref="tableRef" :data="dataValue.modules" style="width: 100%" v-horizontal-scroll="'always'"
            row-key="moduleName"
            :header-cell-style="{ backgroundColor: '#F2F6FC', color: '#666', fontWeight: '500', fontSize: '14px' }">
            <el-table-column label="排序" width="55" prop="sortOrder" align="center">
              <template #default>
                <el-icon class="drag-handle">
                  <Rank />
                </el-icon>
              </template>
            </el-table-column>
            <el-table-column type="index" width="55" label="序号" align="center" :index="indexMethod" />
            <el-table-column prop="moduleName" label="模块功能名" min-width="180" />
            <el-table-column prop="operate" label="操作" width="110">
              <template #default="scope">
                <el-button type="primary" link @click="open(scope.row)">维护</el-button>
                <el-button type="danger" link @click="del(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog v-model="visible" :show-close="false" :width="900" append-to-body align-center destroy-on-close>
          <template #header="{ close }">
            <slot name="header" :close="close" :title="'日志内容'">
              <div class="header_txt">日志内容</div>
              <el-icon @click="close" class="header_close">
                <CloseBold />
              </el-icon>
            </slot>
          </template>
          <template #default>
            <el-form :model="dataItem" label-width="auto" :rules="ruleInfo" ref="itemRef">
              <el-form-item label="功能模块名" prop="moduleName">
                <el-input v-model="dataItem.moduleName" placeholder="请输入功能模块名" />
              </el-form-item>
              <el-form-item label="更新内容" prop="updateContent">
                <Editor height="300px" v-model:modelValue="dataItem.updateContent" ref="myEdit" />
                <!-- <s-text-area v-model="dataItem.updateContent" :autosize="{ minRows: 10, maxRows: 12 }"
                  style="width: 100%" maxlength="100000" show-word-limit /> -->
              </el-form-item>
            </el-form>
          </template>
          <template #footer>
            <div class="contain_btn">
              <el-button @click="closeItem" :disabled="loading">取消</el-button>
              <el-button type="primary" @click="saveItem" :disabled="loading">保存</el-button>
            </div>
          </template>
        </el-dialog>
      </div>
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="submitForm" :disabled="loading">提交</el-button>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'EditionDetails' };
</script>

<script lang="tsx" setup>
import { FromProvideType } from '@/components/template/config/type';
import { viewTypeCheck } from "@/components/template/config/index";
import { DataItem, ModuleItem } from "../page/config";
import { cloneDeep, debounce } from "lodash-es";
import request from '@/config/axios';
import Sortable from 'sortablejs';

const message = useMessage();

const { onSearch } = inject(`EditionForm`) as FromProvideType;

const detailsRef = ref<any>(), formRef = ref(), dataValue = ref<DataItem>({ ...new DataItem() }), bukValue = ref<DataItem>({ ...new DataItem() }), viewType = ref<string>('view'), loading = ref<boolean>(false);

const visible = ref<boolean>(false), dataItem = ref<ModuleItem>({ ...new ModuleItem() }), itemRef = ref(), tableRef = ref();

const rules = computed(() => ({
  version: [{ required: true, message: '请输入版本编号', trigger: ['blur', 'change'] }],
  releaseDate: [{ required: true, message: '请选择发布日期', trigger: ['blur', 'change'] }],
}));

const ruleInfo = computed(() => ({
  moduleName: [{ required: true, message: '请输入功能模块名', trigger: ['blur', 'change'] }],
  updateContent: [{ required: true, message: '请输入更新内容', trigger: ['blur', 'change'] }],
}));

const title = computed(() => viewTypeCheck(viewType.value, [{ type: 'edit', label: '维护' }]));

const indexMethod = (index: number) => index + 1;

// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  detailsRef?.value?.openDrawer(async () => {
    if (type !== 'add') {
      await getDetailItem(item.id);
    } else {
      dataValue.value = { ...new DataItem(), ...item };
      bukValue.value = cloneDeep({ ...dataValue.value });
    }
    viewType.value = type;
  }, () => {
    nextTick(() => {
      formRef?.value?.clearValidate();
      const tbody = tableRef.value.$el.querySelector('.el-table__body-wrapper tbody')

      Sortable.create(tbody, {
        handle: '.drag-handle', animation: 150, ghostClass: 'sortable-ghost',
        onEnd({ oldIndex, newIndex }) {
          if (oldIndex === newIndex) return
          const currRow = dataValue.value.modules.splice(oldIndex, 1)[0];
          dataValue.value.modules.splice(newIndex, 0, currRow);
          dataValue.value.modules = dataValue.value.modules.map((ms: any, index: number) => ({ ...ms, sortOrder: index + 1 }));
        }
      })
    });
  });
};

const getDetailItem = (id: string) => {
  request.get({ url: `/api/sysVersionUpdate/get/${id}` }).then((res: any) => {
    dataValue.value = { ...new DataItem(), ...res };
    bukValue.value = cloneDeep({ ...dataValue.value });
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
  request.post({ url: `/api/sysVersionUpdate/${!!dataValue.value?.id ? 'update' : 'save'}`, data: dataValue.value }).then(() => {
    message.success('操作成功');
    detailsRef?.value?.closed();
    onSearch();
  }).finally(() => {
    loading.value = false;
  });
}, 500);

const addItem = () => {
  const index: number = dataValue.value?.modules?.length || 0;
  dataItem.value = { ...new ModuleItem, sortOrder: index + 1 };
  visible.value = true;
};

const closeItem = () => {
  visible.value = false;
};

const checkValues = async () => {
  return await itemRef?.value?.validate((valid: boolean) => {
    return valid
  });
};

const saveItem = async () => {
  const valid: boolean = await checkValues();
  if (valid) {
    const index: number = (dataItem.value.sortOrder as any) - 1;
    dataValue.value.modules.splice(index, 1, dataItem.value);
    closeItem();
  }
};

const open = (item: any) => {
  visible.value = true;
  dataItem.value = item;
};

const del = (index: any) => {
  dataValue.value.modules.splice(index, 1);
};

defineExpose({ openView });

provide('EditionDetails', { dataValue, bukValue, viewType, title });

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

</script>
<style lang="scss" scoped>
@use './styles.scss';

.header_txt {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.header_close,
.header-close {
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 12px;
}

.drag-handle {
  cursor: move;
  color: #409eff;
}

.sortable-ghost {
  opacity: 0.4;
}
</style>
