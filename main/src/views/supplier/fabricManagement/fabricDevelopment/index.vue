<template>
  <ContentWrap>
    <search-form
      ref="searchRef"
      @get-list="getList"
      @handleAdd="handleAdd"
      @reset="reset"
      :showSearchButton="false"
      :supplyChainDepartment="supplyChainDepartment"
      :rDDepartment="rDDepartment"
      :planningDepartment="planningDepartment"
      :fabricProcessInitiator="fabricProcessInitiator"
      
    />
    <el-table
      class="SWCommonTable"
      :data="list"
      width="100%"
      v-horizontal-scroll="'always'"
      row-class-name="commonTableRow"
      :header-cell-style="appStore.headerCellStyle"
      border
      :max-height="800"
      :tooltip-options="{ popperClass: 'cust_width' }"
      v-loading="loading"
    >
      <el-table-column
        label="面料名称"
        prop="fabricName"
        min-width="200"
        show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'fabricName', '-')"
      />
      <el-table-column
        label="品类"
        prop="completeCategoryName"
        min-width="200"
        show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'completeCategoryName', '-')"
      >
      </el-table-column>
      <el-table-column
        label="适用类型"
        prop="applicableType"
        min-width="200"
        show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'applicableType', '-')"
      />
      <el-table-column
        label="当前节点"
        prop="currentNodeName"
        min-width="200"
        show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'currentNodeName', '-')"
      />
      <el-table-column
        label="企划时间"
        prop="planTime"
        min-width="200"
        show-overflow-tooltip
        :formatter="(row: any) => formatTime(row.planTime, 'yyyy-MM-dd') || '-'"
      />

      <el-table-column
        label="企划季度"
        prop="planQuarter"
        min-width="200"
        show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'planQuarter', '-')"
      />
      <el-table-column
        label="面料分类"
        prop="fabricClassification"
        width="160"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <span>{{ render(row.fabricClassification) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="选供专员"
        prop="chosenSupplierStaffList"
        min-width="260"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <div class="user-wapper">
            <LineAvatar
              :user="{
                image: row.chosenSupplierStaffList[0]?.avatarOrigin,
                name: row.chosenSupplierStaffList[0]?.name
              }"
              image="image"
            />
            <LineAvatar
              style="margin-left: 10px"
              :user="{
                image: row.chosenSupplierStaffList[1]?.avatarOrigin,
                name: row.chosenSupplierStaffList[1]?.name
              }"
              image="image"
              v-if="row.chosenSupplierStaffList.length > 1"
            />
            <el-tooltip v-if="row?.chosenSupplierStaffList.length > 2" effect="light">
              <div class="more-order-handler"> +{{ row?.chosenSupplierStaffList.length - 2 }} </div>
              <template #content>
                <div class="orderHandler">
                  <div
                    style="margin-top: 5px"
                    v-for="item in (row?.chosenSupplierStaffList as any[]).filter(
                      (_, index) => index > 1
                    )"
                    :key="item?.userId"
                  >
                    <LineAvatar
                      :user="{ image: item?.avatarOrigin, name: item?.name }"
                      image="image"
                    />
                  </div>
                </div>
              </template>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="产研人员"
        prop="productDevelopmentList"
        min-width="260"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <div class="user-wapper">
            <LineAvatar
              :user="{
                image: row.productDevelopmentList[0]?.avatarOrigin,
                name: row.productDevelopmentList[0]?.name
              }"
              image="image"
            />
            <LineAvatar
              style="margin-left: 10px"
              :user="{
                image: row.productDevelopmentList[1]?.avatarOrigin,
                name: row.productDevelopmentList[1]?.name
              }"
              image="image"
              v-if="row.productDevelopmentList.length > 1"
            />
            <el-tooltip v-if="row?.productDevelopmentList.length > 2" effect="light">
              <div class="more-order-handler"> +{{ row?.productDevelopmentList.length - 2 }} </div>
              <template #content>
                <div class="orderHandler">
                  <div
                    style="margin-top: 5px"
                    v-for="item in (row?.productDevelopmentList as any[]).filter(
                      (_, index) => index > 1
                    )"
                    :key="item?.userId"
                  >
                    <LineAvatar
                      :user="{ image: item?.avatarOrigin, name: item?.name }"
                      image="image"
                    />
                  </div>
                </div>
              </template>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="流程发起时间"
        prop="createdAt"
        min-width="200"
        show-overflow-tooltip
        :formatter="(row: any) => formatTime(row.createdAt, 'yyyy-MM-dd') || '-'"
      />

      <!-- <el-table-column label="操作" :width="200" fixed="right">
                <template #default="{ row }">
                <div class="action-btn-wapper">
                    <el-button link type="primary" @click="openDrawer(row,'detail','查看详情')" v-if="authToPersion(row,'detail')">查看详情</el-button>
                   <el-button link type="primary" @click="openDrawer(row,'progress','打样进度')" v-if="authToPersion(row,'progress')">打样进度</el-button>

                 <el-popover
                  placement="right"
                  trigger="hover"
                  :width="85"
                  :popper-style="{
                    'min-width': '85px !important',
                    width: '85px',
                    padding: '4px 0',
                    'text-align': 'center'
                  }"
                >
                  <template #reference>
                    <img src="@/assets/imgs/common/more.png" alt="" class="more" />
                  </template>
                  <div class="more-btn">
                    <span class="more-btn-item" @click="openSupplierDrawer(row.id,row)" v-if="authToPersion(row,'pickerSupplier')">匹配供应商</span>
                     <span class="more-btn-item" @click="openPersonAssign(row)" v-if="authToPersion(row,'assign')">人员分配</span>
                    <span class="more-btn-item" @click="openDrawer(row,'edit','编辑')" v-if="authToPersion(row,'edit')">编辑</span>
                    <span class="more-btn-item" @click="openFinalProgress(row)" v-if="authToPersion(row,'stop')">终止</span>
                     <span class="more-btn-item" @click="openFinalProgressReasion(row)" v-if="authToPersion(row,'stopReasion')">终止原因</span>
                    <span class="more-btn-item" @click="handleDel(row.id)" v-if="authToPersion(row,'delete')"> 删除</span>
                  </div>
                </el-popover>
                </div>
                </template>
          </el-table-column> -->
      <el-table-column label="操作" :width="handleWidth()" fixed="right">
        <template #default="{ row }">
          <div class="conlums-ation-wapper">
            <div v-for="item in row.buttonConfig.subList" :key="item.text">
              <el-button
                link
                :type="['删除', '终止'].includes(item.text) ? 'danger' : 'primary'"
                @click="item.handle"
                >{{ item.text }}</el-button
              >
            </div>
            <el-popover
              placement="bottom"
              trigger="hover"
              :width="85"
              :popper-style="{
                'min-width': '85px !important',
                width: '85px',
                padding: '4px 0',
                'text-align': 'center'
              }"
            >
              <template #reference>
                <img
                  src="@/assets/imgs/common/more.png"
                  alt=""
                  class="more"
                  v-if="row.buttonConfig.restList.length > 0"
                />
              </template>
              <div class="more-btn">
                <div v-for="item in row.buttonConfig.restList" :key="item.text">
                  <span
                    :class="
                      ['删除', '终止'].includes(item.text) ? 'more-btn-item-delte' : 'more-btn-item'
                    "
                    @click="item.handle"
                    v-if="item.show()"
                    >{{ item.text }}</span
                  >
                </div>
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrapper">
      <Pagination
        :total="page.total"
        v-model:page="page.page"
        v-model:limit="page.size"
        @pagination="getList()"
      />
    </div>
    <detail-drawer
      v-model:visible="visible"
      :title="title"
      :actionType="actionType"
      v-if="componentVisible"
      @success="getList"
      :detailData="detailData"
      @refresData="getList()"
    />
    <!-- 匹配供应商  -->
    <pickSupplierDrawer ref="supplierDrawerRef" @success="() => getList()" />
    <dev-progress ref="progressRef" />
  </ContentWrap>
</template>
<script setup lang="ts">
import SearchForm from './components/searchForm.vue'
import * as fabricDevelopmentApi from '@/api/supplier/fabricManagement/fabricDevelopment'
import { PageItem } from './components/Type'
import { useAppStore } from '@/store/modules/app'
import { formatterValue, formatTime, getInfoLength } from '@/utils'
import asyncWrapper from '@/utils/asyncWrapper'
import detailDrawer from './components/detail.vue'
import useDelayedVisible from '@/hooks/common/useDelayedVisible'
import createDialog from '@/components/common/directDialog/index'
import PersonAssign from './components/personAssign.vue'
import FinalProgress from './components/finalProgress.vue'
import PickSupplierDrawer from './components/pickSupplierDrawer.vue'
import DevProgress from './components/progress.vue'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { useRole } from '@/hooks/common/useRole'
import { useFabricClassification } from './hooks/useFabricClassification'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const categoryOptions: any = ref([])
const appStore = useAppStore()
const message = useMessage() // 消息弹窗
const loading = ref(false)
const list = ref([])
const page = ref<PageItem>({ ...new PageItem() })
const searchRef = ref<InstanceType<typeof SearchForm> | null>(null)
const supplierDrawerRef = ref<InstanceType<typeof PickSupplierDrawer> | null>(null)
const progressRef = ref<InstanceType<typeof DevProgress> | null>(null)
const route = useRoute()
const initForm = () => {
  return {
    id: '',
    store: '',
    orderNo: '',
    examResult: '',
    remark: ''
  }
}
const editForm = ref(initForm())

const title = ref('新增')
const actionType = ref('add')
const visible = ref(false)
const drawerKey = ref(0)
const [componentVisible] = useDelayedVisible(visible, 500)
const { getPermissionInfo, grabCheck, getRole } = useRole('面辅料')
const detailData = ref(null)

const pickerSupplierDisabled = ref(false)
const searchData = ref({})
const [initOptions, render] = useFabricClassification()

const initBtn = computed(() => (row) => {
  const list = [
    {
      show: () => row.showDetailButton,
      text: '查看详情',
      handle: () => openDrawer(row, 'detail', '查看详情')
    },
    {
      show: () => row.showSampleProgressButton,
      text: '打样进度',
      handle: () => openDrawer(row, 'progress', '打样进度')
    },
    {
      show: () => row.showSupplierInfoButton,
      text: '供应商信息',
      handle: () => openSupplierDrawer(row.id, row)
    },
    {
      show: () =>
        row.showProductDevelopmentStaffAssignmentButton ||
        row.showSupplyChainStaffAssignmentButton ||
        row.hasAllStaffAssignmentAuthority,
      text: '人员分配',
      handle: () => openPersonAssign(row)
    },
    { show: () => row.showEditButton, text: '编辑', handle: () => openDrawer(row, 'edit', '编辑') },
    { show: () => row.showTerminationButton, text: '终止', handle: () => openFinalProgress(row) },
    {
      show: () => row.showTerminationReasonButton,
      text: '终止原因',
      handle: () => openFinalProgressReasion(row)
    },
    { show: () => row.showDeleteButton, text: '删除', handle: () => handleDel(row.id) }
  ]
  const filteredList = list.filter((x) => x.show())
  return reactive({
    subList: filteredList.slice(0, 3),
    restList: filteredList.slice(3)
  })
})

const handleWidth = () => {
  const dataList: any = list.value?.length
    ? list.value
        .map((tbs: any) => {
          const btns: any = tbs.buttonConfig.subList
          const nums: any = btns
            .slice(0, 3)
            .map((trs: any) => Math.ceil(getInfoLength(trs.text) + 15))
          btns.length > 3 && nums.push(30)
          return nums.reduce((item: number, cur: number) => (cur += item), 0)
        })
        .sort((a: number, b: number) => a - b)
    : [30]
  return dataList[dataList.length - 1] + 15
}

const openPersonAssign = (row) => {
  let chosenSupplierStaffId = row.chosenSupplierStaffList
  let productDevelopmentId = row.productDevelopmentList

  const {
    hasAllStaffAssignmentAuthority,
    showProductDevelopmentStaffAssignmentButton,
    showSupplyChainStaffAssignmentButton
  } = row

  createDialog({
    title: '人员分配',
    content: PersonAssign,
    width: 520,
    props: {
      fabricId: row.id,
      chosenSupplierStaffId,
      productDevelopmentId,
      hasAllStaffAssignmentAuthority,
      showProductDevelopmentStaffAssignmentButton,
      showSupplyChainStaffAssignmentButton,
      getRole
    },
    successCb: getList
  })
}

const openFinalProgress = (row) => {
  createDialog({
    title: '流程终止',
    content: FinalProgress,
    width: 520,
    props: {
      type: 1,
      id: row.id,
      detailData: row.terminationReason
    },
    successCb: getList
  })
}
const openFinalProgressReasion = (row) => {
  createDialog({
    title: '终止原因',
    content: FinalProgress,
    width: 520,
    props: {
      type: 2,
      id: row.id,
      detailData: row.terminationReason
    },
    noConfirmBtn: true
  })
}

const getList = async (id = '') => {
  loading.value = true
  try {
    const { ...formParam } = searchRef?.value?.queryParams
    if (formParam?.categorys?.length) {
      formParam.category = formParam?.categorys?.join() || ''
    }
    delete formParam.categorys
    const reuqetParam = { ...formParam, ...page.value, id, ...searchData.value }
    const data = await fabricDevelopmentApi.pageList(reuqetParam)
    // 给每一项添加一个showPassword属性
    list.value = (data.records || []).map((item) => {
      item.chosenSupplierStaffList = item.chosenSupplierStaffList || []
      item.productDevelopmentList = item.productDevelopmentList || []
      item.buttonConfig = initBtn.value(item)
      return {
        ...item
      }
    })
    page.value = { ...new PageItem(data) }
    if (route.query?.type === '1') {
      const row = list.value?.[0]
      if (row) {
        openDrawer(row, 'progress', '打样进度')
      }
      delete route.query.type
    }
  } finally {
    loading.value = false
  }
}
const handleAdd = () => {
  editForm.value = initForm()
  actionType.value = 'add'
  title.value = '新增'
  openDrawer('', 'add', '新增')
}

const openSupplierDrawer = (id, row) => {
  pickerSupplierDisabled.value = row
  supplierDrawerRef.value?.open('supplier', id, row)
}

const openDrawer = (row, type, ptitle) => {
  title.value = ptitle
  actionType.value = type
  drawerKey.value++
  detailData.value = row
  nextTick(() => {
    visible.value = true
  })
}

// 删除
const handleDel = async (id: string) => {
  try {
    // 删除的二次确认
    await message.confirm('请确认是否删除？')
    // 发起删除
    loading.value = true
    const [data, error] = await asyncWrapper(fabricDevelopmentApi.deleteFabric(id))
    if (!error) {
      message.success('删除成功')
      getList()
    }
    loading.value = false
  } catch {}
}

const fabricLingeriePersonnelAllocationManager = computed(() => grabCheck('面料内衣人员分配负责人'))
const productDevelopment = computed(() => grabCheck('面料产研负责人'))
const chosenSupplierStaff = computed(() => grabCheck('面料选供专员'))
const fabricRDSupervisor = computed(() => grabCheck('面料产研主管'))
const fabricSupplyChainSupervisor = computed(() => grabCheck('面料供应链主管'))
const fabricProcessInitiator = computed(() => grabCheck('面料流程发起人'))
const supplyChainDepartment = computed(() => grabCheck('供应链部'))
const rDDepartment = computed(() => grabCheck('产研部'))
const planningDepartment = computed(() => grabCheck('企划部'))
const finalProgressPersion = computed(() => grabCheck('面料流程终止负责人'))

provide('getRole', getRole)

onMounted(() => {
  setRouterInfo()
  // console.log('userStore', userStore.user.id)
  initOptions()
  categoryOptions.value = getIntDictOptions(DICT_TYPE.FABRIC_CATEGORY, true)
  getPermissionInfo(() => {
    if (route.query?.id) {
      getList(route.query.id as string)
    } else {
      getList()
    }
  })
})
// if (route.query?.id) {
//   const newUrl = window.location.href.replace(/\?.*$/, '')
//   history.replaceState({}, '', newUrl)
// }

const reset = () => {
  searchData.value = {}
}

const setRouterInfo = () => {
  let params: Object = {}
  const param: any = route.params
  const query: any = route.query
  Object.keys(param).forEach((key) => {
    params[key] = param[key]
  })
  Object.keys(query).forEach((key) => {
    params[key] = query[key]
  })
  if (Object.keys(params).length !== 0) {
    searchData.value = { ...searchData.value, ...params }
    const newUrl = window.location.href.replace(/\?.*$/, '')
    history.replaceState({}, '', newUrl)
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-popper.cust_width) {
  max-width: 270px;
}

.action-btn-wapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.more {
  width: 15px;
  height: 15px;
  margin-left: 5px;
  cursor: pointer;
  margin-top: 5px;
}

.more-btn {
  display: flex;
  flex-direction: column;

  .more-btn-item {
    display: block;
    width: 100%;
    height: 28px;
    line-height: 28px;
    width: 85px;
    font-weight: 400;
    font-size: 14px;
    color: #0078ff;
    cursor: pointer;

    &:hover {
      background-color: rgba($color: #0078ff, $alpha: 0.1);
    }

    .btn-item-delte {
      color: #eb3737;

      &:hover {
        background-color: rgba($color: #eb3737, $alpha: 0.1);
      }
    }
  }

  .more-btn-item-delte {
    display: block;
    width: 100%;
    height: 28px;
    line-height: 28px;
    width: 85px;
    font-weight: 400;
    font-size: 14px;
    color: #eb3737;
    cursor: pointer;

    &:hover {
      background-color: rgba($color: #eb3737, $alpha: 0.1);
    }
  }
}

.user-wapper {
  width: 100%;
  display: flex;
  height: 23px;
  align-items: center;

  .more-order-handler {
    margin-left: 10px;
    margin-top: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    padding: 0 6px;
    border-radius: 4px;
    font-size: 12px;
    background-color: #eee;
    border: 1px solid #ccc;
    color: #999;
    cursor: pointer;
  }
}

.conlums-ation-wapper {
  width: 100%;
  height: 100%;
  display: flex;
}

:deep() {
  .el-table__row {
    .el-table__cell {
      padding: 14px 0 !important;
    }
  }
}
</style>
