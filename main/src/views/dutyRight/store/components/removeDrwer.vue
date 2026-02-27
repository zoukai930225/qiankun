<template>
  <scheme-details ref="detailsRef" name="StoreRemove" :width="820">
    <template #card>
      <el-form :model="dataValue" label-width="60" :rules="rules" ref="formRef" class="mr20px">
        <el-form-item prop="bizIds" label="店铺">
          <StoreCascader :cascaderProps="{ multiple: true }" v-model="dataValue.bizIds" @change="handleStoreChange"
            :filterChannel="['TaoBao', 'Tmall', 'Pdd', 'Douyin']" />
        </el-form-item>
      </el-form>
      <personnalPanel @change="handleCheckChange" ref="personnalPanelRef" opType="delete"
        :departmentAllList="departMentList" :loading="departLoading" :repeat="6" />
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="submitForm" :disabled="loading">提交</el-button>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'StoreAddDetails' };
</script>

<script lang="tsx" setup>
import { cloneDeep, debounce } from "lodash-es";
import { DataItem } from "../page/config";
import personnalPanel from "@/views/dutyRight/components/personnalPanel.vue"
import request from '@/config/axios';
const message = useMessage();

const { onSearch } = inject(`StoreForm`) as any;
const departMentList = ref<any[]>([])
const detailsRef = ref<any>(), formRef = ref(), dataValue = ref<DataItem>({ ...new DataItem() }), bukValue = ref<DataItem>({ ...new DataItem() }), viewType = ref<string>('edit'), loading = ref<boolean>(false), personnalPanelRef = ref<any>(), departLoading = ref<boolean>(false);

const title = ref('批量移除负责人');
const rules = reactive({
  bizIds: [{ required: true, message: '请选择店铺' }]
})
const directorsIds = ref<any[]>([]);
// 弹出通用
const openView = (item: any[] = []) => {
  // detailsRef openDrawer方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDrawer(async () => {
    departMentList.value = []
    dataValue.value = { ...new DataItem() };
    dataValue.value.bizIds = item.map(item => [item.channelCode, item.storeCode])
    // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
    bukValue.value = cloneDeep({ ...dataValue.value });
    handleStoreChange()
  }, () => {
    nextTick(() => {
      formRef?.value?.clearValidate();
      personnalPanelRef.value?.setCheckIds([])
    });
  });
};

const handleStoreChange = () => {
  departMentList.value = []
  if (dataValue.value.bizIds.length === 0) {
    personnalPanelRef.value?.setCheckIds([])
    return
  }
  departLoading.value = true
  request.get({
    url: "/api/opDutyAuthorityManage/dutyAuthorityUser", params: {
      bizIds: dataValue.value.bizIds.map(item => item[item.length - 1]),
      bizType: dataValue.value.bizType
    }
  }).then(res => {
    const ids: any[] = []
    const dataList = [] as any[]
    res?.map(item => {
      if (item.sysDepartment) {
        item.sysDepartment.status = 'none'
        item.sysDepartment.show = true
        dataList.push(item)
        item.personRosters?.map(child => ids.push(child.userId))
      }
    })
    directorsIds.value = directorsIds.value.filter((id) => ids.includes(id))
    console.log(directorsIds.value)
    departMentList.value = dataList
    personnalPanelRef.value?.setCheckIds(directorsIds.value)
  }).finally(() => {
    departLoading.value = false
  })
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
  if (valid && dataValue.value.directors.length < 1) {
    message.error('请选择要移除的负责人')
    return
  }
  valid && submit();
};

// 实际提交（防抖）
const submit = debounce(async () => {
  loading.value = true;
  const directors: any[] = []
  dataValue.value.directors.map(item =>
    directors.push({
      directorId: item.directorId,
      startTime: item.startTime,
      endTime: item.endTime
    }
    ))
  const params: any = {
    bizType: dataValue.value.bizType,
    bizIds: dataValue.value.bizIds.map(item => item[item.length - 1]),
    directors: directors
  }

  request.post({ url: `/api/opDutyAuthorityManage/removeBatch`, data: params }).then(() => {
    message.success('批量移除成功');
    detailsRef?.value?.closed();
    onSearch();
  }).finally(() => {
    loading.value = false;
  });
}, 500);

const handleCheckChange = (val: any[]) => {
  directorsIds.value = val
  dataValue.value.directors = dataValue.value.directors.filter((item: any) => val.includes(item.directorId))
  const ids = dataValue.value.directors.map((item: any) => item.directorId)
  const addids = val.filter((item: any) => !ids.includes(item))
  if (addids.length > 0) {
    departMentList.value.map(item => {
      item.personRosters.map(child => {
        if (addids.includes(child.userId)) {
          dataValue.value.directors.push({
            directorName: child.name,
            directorId: child.userId,
            startTime: '',
            endTime: null
          })
        }
      })
    })
  }
}


defineExpose({ openView });

provide('StoreRemoveDetails', { dataValue, bukValue, viewType, title });

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

</script>
<style lang="scss" scoped>
.table-form-2 {
  margin-top: 16px;

  :deep() {
    .el-input__wrapper {
      height: auto;
    }
  }
}

:deep(.card_info) {
  .el-card__body {
    padding: 12px 5px 12px 12px !important;
  }
}
</style>
