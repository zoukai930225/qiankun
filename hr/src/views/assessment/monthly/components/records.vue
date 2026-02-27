<template>
  <scheme-dialog ref="recordsRef" name="MonthAssessmentRecords" :width="800">
    <template #card>
      <div class="records-content" v-if="records && records.length > 0">
        <template v-for="(item, _index) in records" :key="_index">
          <time-line-item
            :index="records.length - _index"
            :item="item"
            :dict-info="dictInfo"
          ></time-line-item>
        </template>
      </div>
      <div v-else style="display: flex; justify-content: center; align-items: center">
        <img src="@/assets/imgs/common/nodata.svg" alt="" />
      </div>
    </template>
    <template #button>
      <!-- <div> 按钮操作区 </div> -->
      <el-button @click="recordsRef?.close()" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="recordsRef?.close()" :disabled="loading">确定</el-button>
    </template>
  </scheme-dialog>
</template>

<script lang="tsx">
export default { name: 'MonthAssessmentRecordsDetails' }
</script>

<script lang="tsx" setup>
// import { FromProvideType } from '@/components/template/config/type';
import { cloneDeep, debounce } from 'lodash-es'
import { DataItem } from '../config/config'
// import LineTages from "@/components/template/table/components/lineTage.vue";
import timeLineItem from './timeLineItem.vue'
import request from '@/config/axios'
// import request from '@/config/axios';

// const message = useMessage();

// const formRules = ref({
// categoryCode: [{ required: true, message: '请输入类目编码', trigger: ['change', 'blur'] }],
// categoryName: [{ required: true, message: '请输入类目名称', trigger: ['change', 'blur'] }],
// secondCategory: [{ required: true, message: '请选择二级类目', trigger: ['change', 'blur'] }],
// isSeasonalProduct: [{ required: true, message: '请选择是否季节品', trigger: ['change', 'blur'] }],
// })

// const seasonalProdductOptions = ref([
//   { label: '否', value: 0 },
//   { label: '是', value: 1 },
// ])

// const { onSearch } = inject(`MonthAssessmentForm`) as FromProvideType;

const recordsRef = ref<any>(),
  formRef = ref(),
  dataValue = ref<DataItem>({ ...new DataItem() }),
  bukValue = ref<DataItem>({ ...new DataItem() }),
  viewType = ref<string>('view'),
  loading = ref<boolean>(false)

// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });

const title = ref('填报记录'),
  dictInfo = ref([]),
  records = ref([])

// 弹出通用
const openView = (item: any = {}, type: string = 'view', dict: any = []) => {
  dictInfo.value = dict
  // detailsRef openDialog方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  recordsRef?.value?.openDialog(
    async () => {
      request
        .get({ url: `/api/employeeMonthlyAssessment/getRecords`, params: { recordId: item.id } })
        .then((res: any) => {
          records.value = res && res.length ? res : []
          // dataList.value = res.records?.length ? [...res.records] : []
          // page.value = { ...page.value, total: res.total }
        })
      // dataValue.value = { ...new DataItem(), ...item };
      // if (dataValue.value.parentCode) {
      //   // item.parentCodes = item.parentCode.split('-')
      //   dataValue.value.parentCodes = getParentCodes(dataValue.value.parentCode)
      // }
      // if (dataValue.value.categoryCode) {
      //   const arr = dataValue.value.categoryCode.split('-')
      //   dataValue.value.categoryCode = arr[arr.length - 1]
      // }
      // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
      // bukValue.value = cloneDeep({ ...dataValue.value });
      viewType.value = type
    },
    () => {
      nextTick(() => {
        // formRef?.value?.clearValidate();
      })
    }
  )
}

// const getParentCodes = (str: string): string[] => {
//   const arr = str.split('-')
//   const temp: string[] = []
//   for (let i = 0; i < arr.length; i++) {
//     if (i === 0) {
//       temp.push(arr[0])
//     } else {
//       temp.push(temp[i - 1] + '-' + arr[i])
//     }
//   }
//   return temp
// }

// const changeCategory = (val) => {
//   console.log(val)
//   if (!val || val.length === 0) {
//     dataValue.value.parentCode = ''
//     return
//   }
//   dataValue.value.parentCode = val[val.length - 1]
// }

// 通用表单校验
const checkValue = async () => {
  // return await formRef?.value?.validate((valid: boolean) => {
  //   return valid
  // });
}

// 提交
const submitForm = async () => {
  // const valid: boolean = await checkValue();
  // valid && submit();
}

// 实际提交（防抖）
const submit = debounce(async () => {
  // loading.value = true;
  // const query = { ...dataValue.value }
  // if (query.parentCode) {
  //   query.categoryCode = `${query.parentCode}-${query.categoryCode}`
  // }
  // request.post({ url: dataValue.value?.id ? `/api/sysCategory/update` : `/api/sysCategory/save`, data: query }).then(() => {
  //   message.success('操作成功');
  //   detailsRef?.value?.closed();
  //   getCategoryTree()
  //   onSearch();
  // }).finally(() => {
  //   loading.value = false;
  // });
}, 1000)

defineExpose({ openView })

provide('MonthAssessmentRecordsDetails', { dataValue, bukValue, viewType, title })

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */
</script>
<style lang="scss" scoped>
// @use './styles.scss';

:deep(.el-form-item) {
  margin-bottom: 15px !important;
}

:deep(.el-dialog__body) {
  padding: 15px 4px 15px 15px !important;
}

.records-content {
  // width: calc(100% - 15px);
  padding: 7px 7px 7px 5px;
  max-height: 605px;
  overflow: auto;
}
</style>
