<template>
  <ContentWrap>
    <search-form ref="searchRef" @get-list="handleResearch" @handleAdd="handleAdd" :showSearchButton="false" />
    <el-table class="SWCommonTable" :data="list" width="100%" v-horizontal-scroll="'always'"
      row-class-name="commonTableRow" :header-cell-style="appStore.headerCellStyle" :max-height="800"
      :tooltip-options="{ popperClass: 'cust_width' }" v-loading="loading" border>
      <el-table-column label="店铺" prop="store" min-width="200" show-overflow-tooltip fixed="left">
        <template #default="{ row }" >
          <div class="row-center">
            <!-- <img v-if="getImageUrl('Tmall')" style="width: 14px; height: 14px; margin-right: 8px"
              :src="getImageUrl('Tmall')" alt="" /> -->
            <div :style="{
              width: row.platFormId && getImageUrl('Tmall') ? 'calc(100% - 22px)' : '100%'
            }" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
              <!-- {{ getDictLabel('wdt_urgent_order_channel',row.orderChannel) }} -->
                {{ row.store || '-' }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单号" prop="orderNo" min-width="200" show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'orderNo', '-')" fixed="left"/>
      <el-table-column label="审核结果" prop="examResult" min-width="160" show-overflow-tooltip
        :formatter="(row: any) => formatTime(row.examResult, 'yyyy-MM-dd HH:mm') || '-'">
        <template #default="{ row }">
          <div class="examResult"
            :style="{ border: statusMap(row.examResult)?.border, color: statusMap(row.examResult)?.color, backgroundColor: statusMap(row.examResult)?.bg }">
            {{ row.examResult }}</div>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" min-width="200" show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'remark', '-')" />
      <el-table-column label="审核备注" prop="handleRemark" min-width="200" show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'handleRemark', '-')" />
      <el-table-column label="登记人" prop="createdName" min-width="160" show-overflow-tooltip
        :formatter="(row: any) => formatTime(row.expectHandleTime, 'yyyy-MM-dd HH:mm') || '-'">
        <template #default="{ row }">
          <LineAvatar :user="{ image: row.createdHeadImg, name: row.createdName }" image="image" />
        </template>
      </el-table-column>
      <el-table-column label="登记时间" prop="createdAt" min-width="160" show-overflow-tooltip
        :formatter="(row: any) => formatTime(row.createdAt, 'yyyy-MM-dd HH:mm') || '-'" />
      <el-table-column label="处理人" prop="handleUserName" min-width="160" show-overflow-tooltip>
        <template #default="{ row }">
          <LineAvatar v-if="row.handleUserName" :user="{ image: row.handleUserAvatar, name: row.handleUserName }" image="image" />
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="处理时间" prop="handleTime" min-width="160" show-overflow-tooltip
        :formatter="(row: any) => formatTime(row.handleTime, 'yyyy-MM-dd HH:mm') || '-'" />
      <el-table-column label="处理结果" prop="examResult" min-width="160" show-overflow-tooltip>
        <template #default="{ row }">
          <div v-if="row.handleResult" class="examResult"
            :style="{ border: '0px', color: statusMap(row.handleResult)?.color, backgroundColor: statusMap(row.handleResult)?.bg }">
            {{ row.handleResult }}</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="处理备注" prop="processRemark" min-width="200" show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'processRemark', '-')" />
      <el-table-column label="操作" :width="160" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)" v-if="row.createdId === phone">编辑</el-button>
          <el-button link type="primary" v-if="row.processFlag" @click="handleProcess(row)" >处理</el-button>
          <el-button type="danger" @click="handleDel(row.id)" link v-if="row.createdId === phone">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrapper">
      <Pagination :total="page.total" v-model:page="page.page" v-model:limit="page.size" @pagination="getList()" />
    </div>

    <SWDialog v-model="dialogVisible" :title="title" width="572px" @close="handleClose" v-if="dialogVisible"
      showBottomLine showTitleLine>
      <el-form :model="editForm" :rules="fromRules" ref="formRef" label-width="80" style="margin: 20px;">
        <!-- <el-form-item label="店铺" prop="store" v-if="actionType === 'edit'">
                <el-input v-model="editForm.store" placeholder="请输入店铺" clearable disabled  />
            </el-form-item> -->
        <el-form-item label="店铺" prop="store" v-if="actionType !== 'add'">
          <!-- <el-select class="!w100%" v-model="editForm.orderChannel" placeholder="请选择店铺" filterable
            :disabled="actionType === 'edit'" clearable>
            <el-option v-for="item in getIntDictOptions('wdt_urgent_order_channel', true)" :key="item.value"
              :label="item.label" :value="item.value" />
          </el-select> -->
          <el-input v-model="editForm.store" clearable disabled  />
        </el-form-item>
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="editForm.orderNo" placeholder="请输入订单号" clearable :disabled="actionType !== 'add'" />
        </el-form-item>
        <el-form-item label="审核结果" prop="examResult" v-if="actionType !== 'add'">
          <el-select class="!w100%" v-model="editForm.examResult" placeholder="请选择问题是否完成" filterable :disabled="actionType === 'edit'"
            suffix-icon=''>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark" v-if="actionType !== 'process'">
          <s-text-area v-model="editForm.remark" placeholder="请输入备注" clearable :autosize="{ minRows: 3, maxRows: 4 }"
            maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="处理备注" prop="processRemark" v-if="actionType === 'process'">
          <s-text-area v-model="editForm.processRemark" placeholder="请输入备注" clearable :autosize="{ minRows: 3, maxRows: 4 }"
            maxlength="100" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="margin: 20px 20px 10px;">
          <el-button @click="handleClose" class="new-btn-font">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </SWDialog>

  </ContentWrap>
</template>
<script setup lang="ts">
import STextArea from "@/components/common/input/s-textarea.vue";
import SearchForm from './components/searchForm.vue';
import * as rushOrderLoggingApi from '@/api/customerService/rushOrderLogging'
import { PageItem } from './components/Type';
import { useAppStore } from '@/store/modules/app';
import { getImageUrl, formatterValue, formatTime } from "@/utils";
import asyncWrapper from '@/utils/asyncWrapper'
import { getIntDictOptions, DICT_TYPE,getDictLabel } from '@/utils/dict';
import { useUserStore } from '@/store/modules/user';
const appStore = useAppStore();
const message = useMessage() // 消息弹窗
const loading = ref(false)
const list = ref([])
const page = ref<PageItem>({ ...new PageItem() });
const searchRef = ref<any>(null)
const dialogVisible = ref(false)
const phone = ref('')

const userStore = useUserStore();
const route = useRoute()
const initForm = () => {
  return {
    id: '',
    store: '',
    orderNo: '',
    examResult: '',
    remark: '',
    orderChannel: '',
    processRemark: ''
  }
}
const editForm = ref(initForm())
const options: any = ref([])
const formRef: any = ref(null)
const submitLoading = ref(false)
const title = ref('新增')
const actionType = ref('add')

const fromRules = ref({
  orderChannel: [{ required: true, message: '请选择店铺', trigger: 'blur' }],
  orderNo: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
  examResult: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
})

const statusMap = (status) => {
  if (['审核通过', '已处理', '已审核', '已发货'].includes(status)) {
    return { color: 'rgba(52,155,52,1)', bg: 'rgba(52,155,52,0.2)', border: '0px' }
  }
  if (['审核失败'].includes(status)) {
    return { color: 'rgba(235,55,55,1)', bg: 'rgba(235,55,55,0.2)', border: '0px' }
  }
  if (['待审核', '待分配预订单', '待客审'].includes(status)) {
    return { color: 'rgba(219,106,15,1)', bg: 'rgba(219,106,15,0.2)', border: '0px' }
  }
  if (['未审核', '未发货', '已取消', '未处理'].includes(status)) {
    return { color: 'rgba(102,102,102,1)', bg: 'rgba(102,102,102,0.2)', border: '0px' }
  }
  if (['审核中'].includes(status)) {
    return { color: 'rgba(0,100,255,1)', bg: 'rgba(0,100,255,0.2)', border: '0px' }
  }
}
const handleResearch = () => {
  page.value.page = 1
  getList()
}
const getList = async (id = '',ids?: string) => {
  loading.value = true
  try {
    const { examResult, ...formParam } = searchRef?.value?.queryParams
    const filter = getIntDictOptions(DICT_TYPE.EXAM_RESULT, true).filter(x => x.value === String(examResult))
    if (filter.length > 0) {
      formParam.examResult = filter[0].label
    }
    const reuqetParam = { ...formParam, ...page.value, id,ids }
    const data = await rushOrderLoggingApi.pageList(reuqetParam)
    // 给每一项添加一个showPassword属性
    list.value = (data.records || []).map((item) => {
      return {
        ...item
      }
    })
    page.value = { ... new PageItem(data) }
  } finally {
    loading.value = false
  }
}
const handleAdd = () => {
  editForm.value = initForm()
  actionType.value = 'add'
  title.value = '新增'
  dialogVisible.value = true
}
const handleEdit = (row) => {
  editForm.value = initForm()
  title.value = '编辑'
  actionType.value = 'edit'
  for (let key in editForm.value) {
    editForm.value[key] = row[key]
  }
  dialogVisible.value = true
}
const handleProcess = (row) => {
  editForm.value = initForm()
  title.value = '处理'
  actionType.value = 'process'
  for (let key in editForm.value) {
    editForm.value[key] = row[key]
  }
  dialogVisible.value = true
}

// 删除
const handleDel = async (id: string) => {
  try {
    // 删除的二次确认
    await message.confirm('请确认是否删除？')
    // 发起删除
    const [data, error] = await asyncWrapper(rushOrderLoggingApi.delteById(id))
    if (!error) {
      message.success('删除成功')
      getList()
    }
  } catch { }
}

const handleClose = () => {
  dialogVisible.value = false
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate()

  if (!valid) return

  let param = actionType.value === 'add' ? 
  { orderNo: editForm.value.orderNo } 
  : { id: editForm.value.id }
  param = actionType.value !== 'process' ?{ ...param, ...{ remark: editForm.value.remark } } :{ ...param, ...{ examResult: editForm.value.examResult, processRemark: editForm.value.processRemark } }
  submitLoading.value = true
  const promise = actionType.value === 'add' ? rushOrderLoggingApi.addOrder : actionType.value === 'edit' ? rushOrderLoggingApi.updateOrder : rushOrderLoggingApi.handleOrder
  const [data, error] = await asyncWrapper(promise(param), () => {
    submitLoading.value = false
  })
  if (!error) {
    dialogVisible.value = false
    getList()
  }

}
/** 初始化 **/
onMounted(() => {
  phone.value = userStore.user.phone || ''
  options.value = getIntDictOptions(DICT_TYPE.EXAM_RESULT, true)
  if (route.query?.id) {
    getList(route.query.id as string);
  }else if (route.query?.ids) {
    getList('',route.query.ids as string)
  } else {
    getList()
  }

  if (route.query?.id || route.query?.ids) {
    const newUrl = window.location.href.replace(/\?.*$/, '')
    history.replaceState({}, '', newUrl)
  };

})

</script>
<style lang="scss" scoped>
:deep(.el-popper.cust_width) {
  max-width: 270px;
}

:deep(.el-textarea__inner) {
  color: #333;
}

.examResult {
  width: 96px;
  height: 28px;
  border-radius: 28px;
  text-align: center;
  line-height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border: 1px #dcdfe6 solid;
  color: #666666;
}
</style>
