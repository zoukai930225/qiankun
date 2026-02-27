<template>
  <scheme-details ref="detailsRef" name="Dutyright" :width="1150">
    <template #card>
      <div>
        <div class="row-center mb10px" style="justify-content: space-between;">
          <div class="title">负责人明细</div>
          <div class="row-center">
            <el-checkbox v-model="validFlag" :true-value="1" :false-value="0" border
              @change="getDetail">只看生效</el-checkbox>
            <el-button type="primary" @click="addFun" :disabled="loading" class="ml20px">新增负责人</el-button>
          </div>
        </div>
        <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="dataValue"
          row-class-name="commonTableRow" class="SWCommonTable" v-horizontal-scroll="'always'" ref="tableRef" border>
          <el-table-column label="负责店铺" prop="storeName" min-width="244">
            <template v-slot="{ row, $index }">
              <!-- <template v-if="!row.id && !!row.isEdit == true">
                <el-form :ref="(el: any) => setRefMap(el, $index, 'stores')" :model="row" :rules="rules"
                  class="table-form-2">
                  <el-form-item prop="stores" label="">
                    <StoreCascader :filterChannel="[detailItem.channel]" v-model="row.stores" popper-append-to-body
                      style="width: 100%;" />
                  </el-form-item>
                </el-form>
              </template> -->
              <StoreCell :row='row' :width="220" />
            </template>
          </el-table-column>
          <el-table-column label="负责人" prop="directorName" min-width="195">
            <template v-slot="{ row, $index }">
              <template v-if="!row.id && !!row.isEdit == true">
                <el-form :ref="(el: any) => setRefMap(el, $index, 'directors')" :model="row" class="table-form-2"
                  inline>
                  <el-form-item :prop="'directors.' + index + '.directorId'" label=""
                    v-for="(director, index) in row.directors" :key="index" :rules="{
                      required: true,
                      message: '请选择负责人',
                      trigger: ['blur', 'change'],
                    }">
                    <div class="row-center">
                      <select-people v-model:user-id="director.directorId" :multiple="false"
                        v-model:operator-name="director.directorName"
                        v-model:director-avatar="director.directorAvatar" />
                      <!-- <div class="add-icon ml5px">
                        <el-icon :size="14" @click="addDirector(row)" v-if="Number(index) === 0">
                          <Plus />
                        </el-icon>
                      </div>
                      <div class="add-icon ml5px" v-if="row.directors.length > 1">
                        <el-icon :size="14" @click="removeDirector(row)">
                          <Minus />
                        </el-icon>
                      </div> -->
                    </div>
                  </el-form-item>
                </el-form>
              </template>
              <template v-else>
                <line-avatar :user="row" image="directorAvatar" name="directorName" />
              </template>
            </template>
          </el-table-column>
          <el-table-column label="负责时间" prop="startTime" min-width="500">
            <template v-slot="{ row, $index }">
              <span v-show="!!row.isEdit == false" :style="!row.validFlag ? 'color:#999' : ''">{{ getTime(row) }}</span>
              <el-form :ref="(el: any) => setRefMap(el, $index, 'times')" :model="row" v-show="!!row.isEdit == true"
                inline class="table-form-2">
                <template v-for="(director, index) in row.directors" :key="index">
                  <el-form-item :prop="'directors.' + index + '.startTime'" label="开始时间" :rules="[
                    { required: true, validator: (rule, value, callback) => validateBeginDate(rule, value, callback, director), trigger: ['blur', 'change'] }
                  ]">
                    <el-date-picker v-model="director.startTime" value-format="YYYY/MM/DD" format="YYYY/MM/DD"
                      type="date" placeholder="请选择" style="width: 150px;" />
                  </el-form-item>
                  <el-form-item :prop="'directors.' + index + '.endTime'" label="结束时间" :rules="[
                    { validator: (rule, value, callback) => validateEndDate(rule, value, callback, director), trigger: ['blur', 'change'] }
                  ]" style="margin-left:20px">
                    <el-date-picker v-model="director.endTime" value-format="YYYY/MM/DD" format="YYYY/MM/DD" type="date"
                      placeholder="请选择结束时间" style="width: 150px;" />
                  </el-form-item>
                </template>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template v-slot="{ row, $index }">
              <template v-if="!!row.isEdit == false">
                <el-button link type="primary" :disabled="!row.validFlag" @click="onEdit(row, $index)">
                  修改
                </el-button>
                <el-button link type="primary" @click="onStop($index)" :disabled="!row.validFlag || row.loading">
                  截止
                </el-button>
                <el-button link type="danger" @click="onRemove($index)" v-if="row.validFlag">
                  移除
                </el-button>
              </template>
              <template v-if="row.isEdit">
                <el-button link type="primary" @click="onSave($index)" :disabled="row.loading">保存</el-button>
                <el-button link type="primary" @click="onCancle(row, $index)">取消</el-button>
              </template>
            </template>
          </el-table-column>
          <template #empty>
            <div class="flex-column" style="align-items: center;">
              <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" object-fit="contain" />
              <span>暂无数据</span>
            </div>
          </template>
        </el-table>
      </div>
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'DutyrightDetails' };
</script>

<script lang="tsx" setup>
import { cloneDeep, debounce } from "lodash-es";
import { useAppStore } from '@/store/modules/app';
import LineAvatar from '@/components/template/table/components/lineAvatar.vue';
import request from '@/config/axios';
import { DataItem } from '../page/config'
import { getDictLabel, DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import StoreCell from '@/views/dutyRight/store/components/storeCell.vue'
import dayjs from "dayjs";
import SelectPeople from "../../components/selectPeople.vue"
const appStore = useAppStore();
const message = useMessage();

const { onSearch } = inject(`CategoryForm`) as any;

const detailsRef = ref<any>(), formRef = ref(), dataValue = ref<DataItem[]>([]), bukValue = ref<DataItem[]>([]), viewType = ref<string>('edit'), loading = ref<boolean>(false);
//只看生效
const validFlag = ref<0 | 1>(1)
// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });
const nameVal = ref<string>('')
const title = computed(() => `类目 [ ${detailItem.value.completeCategoryName} ] 负责人设置`);
const detailItem = ref<any>({});

const validateBeginDate = (rule: any, value: any, callback: any, source: any) => {
  if (!value) {
    callback(new Error('请选择开始日期！'))
  } else if (source.endTime && dayjs(value).isAfter(dayjs(source.endTime))) {
    callback(new Error("开始日期不能后于结束日期!"))
  } else {
    callback()
  }
}

const validateEndDate = (rule: any, value: any, callback: any, source: any) => {
  if (!!value && source.startTime && dayjs(value).isBefore(dayjs(source.startTime))) {
    callback(new Error("结束日期不能前于开始日期!"))
  } else {
    callback()
  }
}
const rules = reactive({
  stores: [{
    required: true, message: '请选择店铺', trigger: ['blur', 'change']
  }],
})

let refMap: Record<string, any> = {}
function setRefMap(el: any, index: number, name: 'role' | 'times' | 'directors' | 'stores') {
  if (el) {
    refMap[`${name}_${index}`] = el
  }
}
// 弹出通用
const openView = (item: any = {}) => {
  // detailsRef openDrawer方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDrawer(async () => {
    validFlag.value = 1;
    refMap = {}
    detailItem.value = cloneDeep(item)
    nameVal.value = item.title
    getDetail()
  }, () => {
    nextTick(() => {
      // formRef?.value?.clearValidate();
    });
  });
};
const getDetail = async () => {
  try {
    loading.value = true;
    const res = await request.get({
      url: '/api/opDutyAuthorityManage/list', params: {
        bizId: detailItem.value.id,
        bizType: 2,
        validFlag: validFlag.value,
        store: detailItem.value.store,
      }
    })
    const data: DataItem[] = [];
    res?.forEach((item: any) => {
      data.push({
        ...item,
        ...{
          id: item.id,
          bizType: 2,
          completeCategoryNames: [detailItem.value.completeCategoryName],
          directors: [
            {
              directorId: item.directorId,
              startTime: item.startTime,
              endTime: item.endTime,
              role: item.role,
              directorName: item.directorName,
              directorAvatar: item.directorAvatar,
            }
          ],
          stores: [item.channelCode, item.store],
          role: item.role,
          loading: false,
          isEdit: false
        }
      })
    })
    console.log(data)
    dataValue.value = cloneDeep(data)
    bukValue.value = cloneDeep(data);
  } catch (err) {

  } finally {
    loading.value = false
  }
}

const getTime = (item: any) => {
  const time: string[] = [];
  if (item.startTime && dayjs(item.startTime).isValid()) {
    time.push(dayjs(item.startTime).format('YYYY/MM/DD'));
  } else {
    time.push('-')
  }
  if (item.endTime && dayjs(item.endTime).isValid()) {
    time.push(dayjs(item.endTime).format('YYYY/MM/DD'));
  } else {
    time.push('未来')
  }
  return time.join('-')
}
function onEdit(row: any, index: number) {
  row.isEdit = !row.isEdit
  bukValue.value[index].isEdit = !bukValue.value[index].isEdit
}
async function onStop(index: number) {
  const item = cloneDeep(dataValue.value[index])
  const errorName: string[] = []
  item.directors.forEach((item: any) => {
    if (dayjs(item.startTime).isAfter(dayjs(new Date()))) {
      errorName.push(item.directorName)

    }
  })
  if (errorName.length > 0) {
    message.warning(`当前 [ ${errorName.join(',')} ] 责权还未开始！`)
    return
  }

  try {
    await message.confirm(`确定截止当前负责人责权吗？`)
    dataValue.value[index].loading = true
    dataValue.value[index].directors.map((item: any) => {
      item.endTime = dayjs().format('YYYY/MM/DD')
    })
    onSave(index)
  } catch (err) {

  } finally {
  }
}
/** 保存 */
async function onSave(index: number) {
  const formRefStore = refMap[`stores_${index}`]
  const formRefRole = refMap[`role_${index}`]
  const formRefTime = refMap[`times_${index}`]
  const formRefDirector = refMap[`directors_${index}`]

  try {
    await Promise.all([
      formRefStore?.validate(),
      formRefRole?.validate(),
      formRefTime?.validate(),
      formRefDirector?.validate()
    ])
    saveFun(index)
  } catch (error) {
    console.log('表格验证错误', error)
  }
}

const saveFun = debounce((index: number) => {
  console.log("saveFun", dataValue.value[index])
  dataValue.value[index].loading = true;
  const item = cloneDeep(dataValue.value[index])
  const params: any = {
    bizId: detailItem.value.id,
    bizType: 2,
    startTime: item.directors[0].startTime,
    directorId: item.directors[0].directorId,
    endTime: item.directors[0].endTime || null,
    role: item.directors[0].role || null,
    directorName: item.directors[0].directorName || '',
    directorAvatar: item.directors[0].directorAvatar || '',
    store: item.stores[item.stores.length - 1],
    completeCategoryName: detailItem.value.completeCategoryName,
  }
  if (item.id) {
    params.id = item.id
  }

  request.post({
    url: `/api/opDutyAuthorityManage/saveOrUpdate`, data: params
  }).then(() => {
    message.success('操作成功');
    getDetail()
    onSearch();
    dataValue.value[index].isEdit = false;
  }).finally(() => {
    dataValue.value[index].loading = false;
  });
}, 500);

//取消
const onCancle = (row: any, index: number) => {
  if (row.id) {
    dataValue.value[index] = cloneDeep(bukValue.value[index])
    dataValue.value[index].isEdit = false;
    bukValue.value[index].isEdit = false;
  } else {
    dataValue.value.splice(index, 1)
  }
}
const addDirector = (row: any, index?: number) => {
  row.directors.push({
    directorId: '',
    startTime: '',
    endTime: '',
    directorName: '',
    directorAvatar: '',
  })
}
const removeDirector = (row: any) => {
  row.directors.splice(row.directors.length - 1, 1)
}
//新增
const addFun = () => {
  const item: any = { ...new DataItem(), isEdit: true, loading: false, stores: [detailItem.value.channel, detailItem.value.store], channelCode: detailItem.value.channel, storeName: detailItem.value.storeName }
  addDirector(item)
  dataValue.value.push(item)
}
//移除负责人
const onRemove = async (index: number) => {
  const item = cloneDeep(dataValue.value[index])
  try {
    await message.confirm(`确定移除负责人 [ ${item.directors.map(item => item.directorName).join(',')} ] 吗？`)
    await request.get({ url: '/api/opDutyAuthorityManage/removeDirector', params: { id: item.id } })
    dataValue.value.splice(index, 1)
    bukValue.value.splice(index, 1)
    message.success('移除成功！')
    onSearch()
  } catch (err) {

  } finally { }
}
defineExpose({ openView });

provide('DutyrightDetails', { dataValue, bukValue, viewType, title });

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

.add-icon {
  color: #666;
  cursor: pointer;

  :hover {
    color: #999;
  }
}

:deep(.card_info) {
  .el-card__body {
    padding: 12px 5px 12px 12px !important;
  }
}
</style>
