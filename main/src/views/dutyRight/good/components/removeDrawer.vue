<template>
  <scheme-details ref="detailsRef" name="GoodAdd" :width="900">
    <template #card>
      <div>
        <div class="row-center" style="align-items: flex-start;">
          <el-form :model="dataValue" label-width="80" :rules="rules" ref="formRef">
            <el-form-item prop="bizIds" label="商品ID" label-position="top">
              <el-select v-model="dataValue.bizIds" multiple filterable clearable remote placeholder="商品名/商品ID"
                :remote-method="remoteMethod" :loading="searchLoading" style="width: 260px" collapse-tags
                class="goods-select" @change="handleStoreChange" :max-collapse-tags="3">
                <el-option v-for="item in options" :key="item.id" :label="item.goodsName"
                  :value="JSON.stringify(item)" />
              </el-select>
            </el-form-item>
          </el-form>
          <div style="width: calc(100% - 280px);" class="ml20px">
            <div class="mb10px" style="font-size: 14px;">已选择商品：{{ dataValue.bizIds.length }} 件</div>
            <div class="row-center select-box">
              <span class="mt5px mb5px ml5px mr5px" v-for="(item, index) in dataValue.bizIds" :key="index">
                <el-tag closable type="primary" @close="handleClose(index)">
                  <div class="row-center">
                    {{ JSON.parse(item).goodsId }}
                    <el-tooltip :content="JSON.parse(item).goodsName" placement="top">
                      <el-icon color="#666" class="ml5px" style="cursor: pointer;">
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </el-tag>
              </span>
            </div>
          </div>
        </div>
        <personnalPanel @change="handleCheckChange" ref="personnalPanelRef" :departmentAllList="departMentList"
          :top-height="419" :repeat="6" :loading="searchLoading || departLoading" opType="delete" />
      </div>
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

const { onSearch } = inject(`GoodForm`) as any;
const departMentList = ref<any[]>([])
const detailsRef = ref<any>(), formRef = ref(), dataValue = ref<DataItem>({ ...new DataItem() }), bukValue = ref<DataItem>({ ...new DataItem() }), viewType = ref<string>('edit'), loading = ref<boolean>(false), personnalPanelRef = ref<any>(), options = ref<any[]>([]), searchLoading = ref<boolean>(false), departLoading = ref<boolean>(false);


const title = ref('批量移除负责人');
const rules = reactive({
  bizIds: [{ required: true, message: '请选择商品' }]
})
const directorsIds = ref<any[]>([]);
// 弹出通用
const openView = (item: any[] = []) => {
  // detailsRef openDrawer方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDrawer(async () => {
    departMentList.value = []
    options.value = cloneDeep(item)
    dataValue.value = { ...new DataItem() };
    dataValue.value.bizIds = item.map(item => JSON.stringify(item))
    handleStoreChange()
    // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
    bukValue.value = cloneDeep({ ...dataValue.value });
  }, () => {
    nextTick(() => {
      formRef?.value?.clearValidate();
      personnalPanelRef.value?.setCheckIds([])
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
    bizIds: dataValue.value.bizIds.map(item => JSON.parse(item).goodsId),
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

const remoteMethod = (query: string) => {
  if (query) {
    searchLoading.value = true
    request.get({
      url: '/api/goods-person-responsibility/list',
      params: {
        nameAndId: query,
        page: 1,
        size: 20
      }
    }).then((res: any) => {
      options.value = Array.isArray(res?.records) ? res?.records : []
    }).finally(() => {
      searchLoading.value = false
    })
  } else {
    options.value = []
  }
}


const handleStoreChange = () => {
  departMentList.value = []
  if (dataValue.value.bizIds.length === 0) {
    personnalPanelRef.value?.setCheckIds([])
    return
  }
  departLoading.value = true
  request.get({
    url: "/api/opDutyAuthorityManage/dutyAuthorityUser", params: {
      bizIds: dataValue.value.bizIds.map(item => JSON.parse(item).goodsId),
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
        item.personRosters.map(child => ids.push(child.userId))
      }
    })
    directorsIds.value = directorsIds.value.filter((id) => ids.includes(id))
    departMentList.value = dataList
    personnalPanelRef.value?.setCheckIds(directorsIds.value)
  }).finally(() => {
    departLoading.value = false
  })
}
const handleClose = (index: number) => {
  dataValue.value.bizIds.splice(index, 1)
  handleStoreChange()
}
defineExpose({ openView });

provide('GoodAddDetails', { dataValue, bukValue, viewType, title });

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

</script>
<style lang="scss" scoped>
.all-box {
  grid-template-columns: 546px 640px;
  grid-gap: 10px;
  display: grid;
}

.goods-select {
  :deep() {
    .el-tag {
      max-width: 150px !important;
    }
  }
}

.select-box {
  padding: 5px 5px;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  height: 118px;
  overflow-y: auto;
  align-items: flex-start;
  align-content: flex-start;
}

:deep(.card_info) {
  .el-card__body {
    padding: 12px 5px 12px 12px !important;
  }
}
</style>
