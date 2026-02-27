<template>
  <scheme-details ref="detailsRef" name="Laborcost" :width="1200">
    <template #card>
      <div style="height: calc(100vh - 190px);" class="pt15px pb15px" v-loading="loading">
        <Steps :menus="menus" v-model="active" />
        <div class="mt15px pl10px pr10px form-box">
          <span v-show="active === 0">
            <costForm ref="costFormRef" @change="handleCostFormChange" />
          </span>
          <span v-show="active === 1">
            <appalicationScopeForm ref="appalicationScopeFormRef" class="mt10px pl5px pr5px"
              @change="handleAppalicationChange" />
          </span>
          <span v-show="active === 2">
            <costRuleForm ref="costRuleFormRef" @change="handleCostFormChange" />
          </span>
        </div>
      </div>
    </template>
    <template #button>
      <el-button v-show="hasPrev" class="pre-btn" @click="toPre">上一步</el-button>
      <el-button v-show="hasNext" @click="toNext">下一步</el-button>
      <el-button @click="close" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="submitForm" :disabled="loading"
        v-show="(active === menus.length - 1) && viewType !== 'see'">提交</el-button>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'LaborcostDetails' };
</script>

<script lang="tsx" setup>
import { FromProvideType } from '@/components/template/config/type';
import { cloneDeep, debounce } from "lodash-es";
import { DataItem } from "../page/config";
import request from '@/config/axios';
import Steps from '@/views/daily/param/components/steps.vue';
import costForm from '../components/costForm.vue';
import appalicationScopeForm from '../components/appalicationScopeForm.vue';
import costRuleForm from '../components/costRuleForm.vue';
import dayjs from 'dayjs';

const message = useMessage();

const { onSearch } = inject(`LaborcostForm`) as FromProvideType;

const detailsRef = ref<any>(), formRef = ref(), dataValue = ref<DataItem>({ ...new DataItem() }), bukValue = ref<DataItem>({ ...new DataItem() }), viewType = ref<string>('see'), loading = ref<boolean>(false);

// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });
const costRuleFormRef = ref<any>();
const menus = ref<any[]>(['费用信息', '应用范围', '费用规则']);
const active = ref(0);
const title = computed(() => viewType.value === 'see' ? '详情' : viewType.value === 'add' ? '新增' : viewType.value === 'edit' ? '编辑' : '复制');
const hasNext = computed(() => active.value < menus.value.length - 1);
const hasPrev = computed(() => active.value > 0);
const toPre = () => {
  active.value > 0 && active.value--;
}
const costFormRef = ref<any>()
const appalicationScopeFormRef = ref<any>()
const toNext = async () => {
  try {
    if (active.value === 0) {
      if (!await costFormRef.value?.validate()) return
    }
    if (active.value === 1) {
      if (!appalicationScopeFormRef.value?.validate()) {
        message.error('请将当前条件填写完成后再进行下一步操作！')
        return
      }
    }
    active.value < menus.value.length - 1 && active.value++;
  } catch (e) { }
}
// 弹出通用
const openView = (item: any = {}, type: string = 'see') => {
  // detailsRef openDrawer方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDrawer(async () => {
    if (!item.id) {
      dataValue.value = { ...new DataItem() };
      // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
      bukValue.value = cloneDeep({ ...dataValue.value });
    } else {
      getDetail(item.id)
    }
    console.log("打开", type)
    viewType.value = type;
  }, () => {
    nextTick(() => {
      if (!item.id) {
        reset();
      }
      if (type === 'add') {
        costRuleFormRef.value?.setDefaultStartDate()
        bukValue.value.effectiveStartDate = dayjs().format('YYYY-MM-DD')
      }
    });
  });
};
//获取详情
const getDetail = async (id: string) => {
  try {
    loading.value = true;
    dataValue.value.id = id;
    const res = await request.get({ url: `/api/customFee/getById`, params: { id } })
    nextTick(() => {
      reset();
      console.log(active.value)
      const costParams = {
        feeNameId: res?.feeNameId ?? '',
        //费用名称
        feeName: res?.feeName ?? '',
        //计算维度
        calculateDimension: res?.calculateDimension ?? 'PAY',
        //备注
        remark: res?.remark ?? ''
      }
      costFormRef.value?.setValue(costParams);
      let condition = {}
      if (res?.scopeNodeDTO) {
        condition = res?.scopeNodeDTO;
        appalicationScopeFormRef.value?.setValue(condition);
      }
      const rulesParams = {
        //计算指标
        calculateIndex: res?.calculateIndex ?? '',
        effectiveStartDate: viewType.value === 'copy' ? dayjs().format('YYYY-MM-DD') : res?.effectiveStartDate ?? '',
        //结束日期
        effectiveEndDate: viewType.value === 'copy' ? '' : res?.effectiveEndDate ?? '',
        calculateCoefficient: res?.calculateCoefficient ?? ''
      }
      costRuleFormRef.value?.setValue(rulesParams);
      bukValue.value = cloneDeep({ ...new DataItem(), ...costParams, ...rulesParams });
      bukValue.value.scopeNodeDTO = { ...bukValue.value.scopeNodeDTO, ...condition }
      bukValue.value.id = id;
      if (viewType.value === 'copy') {
        active.value = 2;
      }
      console.log("编辑时历史数据", bukValue.value)
    })
  } catch (e) { } finally {
    loading.value = false;
  }
}

// 通用表单校验
const checkValue = async () => {
  return await costRuleFormRef?.value?.validate();
};

// 提交
const submitForm = async () => {
  const valid: boolean = await checkValue();
  valid && submit();
};

// 实际提交（防抖）
const submit = debounce(async () => {
  loading.value = true;
  console.log("提交", dataValue.value)
  const data: any = cloneDeep(dataValue.value);
  if (viewType.value !== 'edit') {
    delete data.id;
  }
  request.post({ url: `/api/customFee/saveOrUpdateBiCustomFee`, data }).then(() => {
    message.success('操作成功');
    detailsRef?.value?.closed();
    onSearch();
  }).finally(() => {
    loading.value = false;
  });
}, 500);

const handleCostFormChange = (val: any) => {
  dataValue.value = { ...dataValue.value, ...val };
  console.log("费用信息变化", val, dataValue.value)
}
const handleAppalicationChange = (val: any) => {
  dataValue.value.scopeNodeDTO = { ...dataValue.value.scopeNodeDTO, ...val };
  console.log("应用范围变化", val, dataValue.value)
}
const close = () => {
  console.log("关闭", dataValue.value)
  detailsRef.value?.close()
}

const reset = () => {
  costFormRef.value?.clear()
  appalicationScopeFormRef.value?.clear()
  costRuleFormRef.value?.clear()
  active.value = 0
}

defineExpose({ openView });

provide('LaborcostDetails', { dataValue, bukValue, viewType, title });

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
