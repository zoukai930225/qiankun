<template>
  <scheme-details ref="detailsRef" name="Dutyright" :width="900">
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
          <el-table-column label="负责人" prop="directorName" min-width="160" fixed="left">
            <template v-slot="{ row, $index }">
              <template v-if="!row.id && !!row.isEdit == true">
                <el-form :ref="(el: any) => setRefMap(el, $index, 'director')" :model="row" :rules="rules" inline
                  class="table-form-2">
                  <el-form-item prop="directorId" label="">
                    <select-people v-model:user-id="row.directorId" v-model:operator-name="row.directorName"
                      v-model:director-avatar="row.directorAvatar" :multiple="false" />
                  </el-form-item>
                </el-form>
              </template>
              <template v-else>
                <line-avatar :user="row" image="directorAvatar" name="directorName" />
              </template>
            </template>
          </el-table-column>
          <!-- <el-table-column label="责权角色" prop="role" width="120">
            <template #default="scope">
              <span v-show="!!scope.row.isEdit == false">{{ getDictLabel(DICT_TYPE.DUTY_AUTHORITY_ROLE, scope.row.role)
                ||
                '-'
              }}</span>
              <el-form :ref="(el: any) => setRefMap(el, scope.$index, 'role')" :model="scope.row"
                v-show="!!scope.row.isEdit == true" :rules="rules" inline class="table-form">
                <el-form-item prop="role" label="">
                  <el-select v-model="scope.row.role" clearable placeholder="请选择" filterable style="width: 100%;">
                    <el-option v-for="item in getIntDictOptions(DICT_TYPE.DUTY_AUTHORITY_ROLE, true)" :key="item.value"
                      :value="item.value" :label="item.label" />
                  </el-select>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column> -->
          <el-table-column label="负责时间" prop="startTime" min-width="500">
            <template v-slot="{ row, $index }">
              <span v-show="!!row.isEdit == false" :style="!row.validFlag ? 'color:#999' : ''">{{ getTime(row) }}</span>
              <el-form :ref="(el: any) => setRefMap(el, $index, 'time')" :model="row" v-show="!!row.isEdit == true"
                inline class="table-form-2">
                <el-form-item prop="startTime" label="开始时间" :rules="[
                  { required: true, validator: (rule, value, callback) => validateBeginDate(rule, value, callback, row), trigger: ['blur', 'change'] }
                ]">
                  <el-date-picker v-model="row.startTime" value-format="YYYY/MM/DD" format="YYYY/MM/DD" type="date"
                    placeholder="请选择" style="width: 150px;" />
                </el-form-item>
                <el-form-item prop="endTime" label="结束时间" :rules="[
                  { validator: (rule, value, callback) => validateEndDate(rule, value, callback, row), trigger: ['blur', 'change'] }
                ]" style="margin-left:20px">
                  <el-date-picker v-model="row.endTime" value-format="YYYY/MM/DD" format="YYYY/MM/DD" type="date"
                    placeholder="请选择结束时间" style="width: 150px;" />
                </el-form-item>
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
import { DataItem } from "../page/config";
import { useAppStore } from '@/store/modules/app';
import LineAvatar from '@/components/template/table/components/lineAvatar.vue';
import request from '@/config/axios';
import { getDictLabel, DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import dayjs from "dayjs";
import SelectPeople from "../components/selectPeople.vue"
const appStore = useAppStore();
const message = useMessage();

const { onSearch, tabsName } = inject(`DutyrightForm`) as any;

const detailsRef = ref<any>(), formRef = ref(), dataValue = ref<DataItem[]>([]), bukValue = ref<DataItem[]>([]), viewType = ref<string>('edit'), loading = ref<boolean>(false);
//只看生效
const validFlag = ref<0 | 1>(1)
// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });
const nameVal = ref<string>('')
const title = computed(() => `${tabsName.value} [ ${nameVal.value} ] 负责人设置`);
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
  directorId: [{
    required: true, message: '请选择负责人', trigger: ['blur', 'change']
  }]
})

let refMap: Record<string, any> = {}
function setRefMap(el: any, index: number, name: 'role' | 'time' | 'director') {
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
        bizId: detailItem.value.bizId,
        bizType: detailItem.value.bizType, validFlag: validFlag.value
      }
    })
    dataValue.value = cloneDeep(res)
    bukValue.value = cloneDeep(res);
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
  if (dayjs(item.startTime).isAfter(dayjs(new Date()))) {
    message.warning('当前责权还未开始！')
    return
  }
  try {
    await message.confirm(`确定截止当前负责人 [ ${item.directorName} ] 责权吗？`)
    dataValue.value[index].loading = true
    dataValue.value[index].endTime = dayjs().format('YYYY/MM/DD')
    onSave(index)
  } catch (err) {

  } finally {
  }
}
/** 保存 */
async function onSave(index: number) {
  const formRefRole = refMap[`role_${index}`]
  const formRefTime = refMap[`time_${index}`]
  const formRefDirector = refMap[`director_${index}`]

  try {
    await Promise.all([
      formRefRole?.validate(),
      formRefTime?.validate(),
      formRefDirector?.validate()
    ])
    saveFun(index)
  } catch (error) { }
}

const saveFun = debounce((index: number) => {
  console.log("saveFun", dataValue.value[index])
  dataValue.value[index].loading = true;
  const item = cloneDeep(dataValue.value[index])
  const params: any = {
    bizId: detailItem.value.bizId,
    bizType: detailItem.value.bizType,
    startTime: item.startTime,
    directorId: item.directorId,
    endTime: item.endTime || null,
    role: item.role ?? null,
    directorName: item.directorName,
    directorAvatar: item.directorAvatar,
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
//新增
const addFun = () => {
  dataValue.value.push({
    role: null,
    directorId: '',
    startTime: '',
    endTime: null,
    directorAvatar: '',
    directorName: '',
    isEdit: true,
  })
}
//移除负责人
const onRemove = async (index: number) => {
  const item = cloneDeep(dataValue.value[index])
  try {
    await message.confirm(`确定移除负责人 [ ${item.directorName} ] 吗？`)
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
@use './styles.scss';
</style>
