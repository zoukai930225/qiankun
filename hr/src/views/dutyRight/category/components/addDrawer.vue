<template>
  <scheme-details ref="detailsRef" name="CategoryAdd" :width="1250">
    <template #card>
      <div class="all-box">
        <div>
          <el-form :model="dataValue" label-width="80" :rules="rules" ref="formRef" class="mr20px">
            <el-form-item prop="completeCategoryNames" label="类目">
              <categorySelect v-model:channel="channel" v-model="dataValue.completeCategoryNames"
                @channelChange="handleChannelChange" ref="categorySelectRef" :filterChannel="['TaoBao', 'Tmall', 'Pdd', 'Douyin']"/>
            </el-form-item>
            <el-form-item prop="stores" label="店铺">
              <StoreCascader :filter-channel="[channel]" ref="storeCascaderRef" v-model="dataValue.stores"
                :cascaderProps="{ multiple: true }" @change="handleStoresChange" :otherProps="{ disabled: !channel }" />
            </el-form-item>
          </el-form>
          <personnalPanel @change="handleCheckChange" ref="personnalPanelRef" :departmentAllList="departmentAllList"
            :topHeight="345" />
        </div>
        <div>
          <div class="mb10px" style="font-size: 14px;">已选择店铺：{{ storeTagList.length }} 个</div>
          <div class="row-center select-box">
            <span class="mt5px mb5px ml5px mr5px" v-for="(item, index) in storeTagList" :key="index">
              <el-tag closable type="primary" @close="handleClose(index)">
                <div class="row-center">
                  <img v-if="getImageUrl(channel)" class="channel-img" :src="getImageUrl(channel)"
                    object-fit="contain" />
                  {{ item }}
                </div>
              </el-tag>
            </span>
          </div>
          <multipleAddTable ref="multipleRef" @remove="onRemove" v-model="dataValue" :topHeight="311" />
        </div>
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
import multipleAddTable from "../../components/multipleAddTable.vue";
import categorySelect from './categroySelect.vue'
import { getImageUrl } from '@/utils/index'
const message = useMessage();

const { onSearch } = inject(`CategoryForm`) as any;
const { departmentAllList } = inject(`DutyrightForm`) as any;
const detailsRef = ref<any>(), formRef = ref(), dataValue = ref<DataItem>({ ...new DataItem() }), bukValue = ref<DataItem>({ ...new DataItem() }), viewType = ref<string>('edit'), loading = ref<boolean>(false), personnalPanelRef = ref<any>(), multipleRef = ref<any>(), storeCascaderRef = ref<any>(), categorySelectRef = ref<any>(), storeTagList = ref<any[]>([]);


const title = ref('批量添加负责人');
const rules = reactive({
  completeCategoryNames: [{ required: true, message: '请选择类目' }],
  stores: [{ required: true, message: '请选择店铺' }]
})
const directorsIds = ref<any[]>([]);
const channel = ref<string>('')
// 弹出通用
const openView = (item: any[] = []) => {
  // detailsRef openDrawer方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDrawer(async () => {
    directorsIds.value = []
    storeTagList.value = []
    channel.value = item.length > 0 ? item[0].channel : '';
    dataValue.value = { ...new DataItem() };
    let completeCategoryNames: any[] = []
    let stores: any[] = []
    if (item?.length > 0) {
      item.forEach(each => {
        if (each.completeCategoryName) {
          completeCategoryNames.push(JSON.stringify(each.completeCategoryName.split('>>')))
        }
        if (each.store) {
          stores.push(JSON.stringify([each.channel, each.store]))
          storeTagList.value.push(each.storeName)
        }
      })
      completeCategoryNames = [...new Set(completeCategoryNames)]
      stores = [...new Set(stores)]
      storeTagList.value = [...new Set(storeTagList.value)]
    }
    dataValue.value = { ...dataValue.value, completeCategoryNames: completeCategoryNames.map(item => JSON.parse(item)), stores: stores.map(item => JSON.parse(item)) };
    // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
    bukValue.value = cloneDeep({ ...dataValue.value });
  }, () => {
    nextTick(() => {
      if (channel.value) {
        categorySelectRef.value?.setChannelChange(channel.value)
      }
      formRef?.value?.clearValidate();
      personnalPanelRef.value?.setCheckIds([])
      multipleRef.value?.clear()
    });
  });
};
const handleStoresChange = (val: any[], node: any[]) => {
  storeTagList.value = node?.map(item => item?.label) || []
}
const handleChannelChange = () => {
  storeCascaderRef.value?.getList();
  dataValue.value.stores = []
  storeTagList.value = []
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
  const validTable = await multipleRef.value?.validate()
  if (valid && dataValue.value.directors.length === 0) {
    message.error('请选择负责人')
    return
  }
  valid && !validTable.some(item => !item) && submit();
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
    completeCategoryNames: dataValue.value.completeCategoryNames.map(item => item.join('>>')),
    stores: dataValue.value.stores.map(item => item[item.length - 1]),
    directors: directors
  }

  request.post({ url: `/api/opDutyAuthorityManage/saveBatchCategoryDutyAuthority`, data: params }).then(() => {
    message.success('批量新增成功');
    detailsRef?.value?.closed();
    onSearch();
  }).finally(() => {
    loading.value = false;
  });
}, 500);

const onRemove = (index: number) => {
  directorsIds.value = directorsIds.value.filter(item => item !== dataValue.value.directors[index].directorId)
  personnalPanelRef.value?.setCheckIds(directorsIds.value)
  handleCheckChange(directorsIds.value)
}

const handleCheckChange = (val: any[]) => {
  directorsIds.value = val
  dataValue.value.directors = dataValue.value.directors.filter((item: any) => val.includes(item.directorId))
  const ids = dataValue.value.directors.map((item: any) => item.directorId)
  const addids = val.filter((item: any) => !ids.includes(item))
  if (addids.length > 0) {
    departmentAllList.value.map(item => {
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


const handleClose = (index: number) => {
  dataValue.value.stores = dataValue.value.stores.filter((item, i) => i !== index)
  storeTagList.value.splice(index, 1)
}
defineExpose({ openView });

provide('CategoryAddDetails', { dataValue, bukValue, viewType, title });

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
      max-width: 200px !important;
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

.channel-img {
  width: 18px;
  margin-right: 5px;
}

:deep(.card_info) {
  .el-card__body {
    padding: 12px 5px 12px 12px !important;
  }
}
</style>
