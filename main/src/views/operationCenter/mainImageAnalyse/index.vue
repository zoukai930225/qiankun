<template>
  <!-- 搜索 -->
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form
          ref="queryFormRef"
          :inline="true"
          :model="queryParams"
          class="mb-5px"
          label-width="78px"
        >
          <el-form-item label="店铺:" prop="store">
            <StoreRangePlus
              v-model="queryParams.store"
              @change="getList"
              placeholder="请选择店铺"
              :showAllChannels="false"
            />
          </el-form-item>
          <el-form-item label="货品编码:" prop="productCode">
            <el-input
              v-model="queryParams.productCode"
              clearable
              placeholder="请输入货品编码"
              @keyup.enter="handleQuery"
              @clear="handleQuery"
            />
          </el-form-item>
          <el-form-item label="运营人员:" prop="operator">
            <!-- <SWSelectPeople
              style="width: 200px"
              :multiple="true"
              :tags="1"
              :limit="1"
              v-model="operatorList"
            /> -->
            <SelectUser
              v-model="queryParams.operator"
              :multiple="false"
              @change="getList()"
              :showAvatarLable="true"
              :role="getRole('主图运营')"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px"
            >重置</el-button
          >
          <el-button type="primary" @click="handleAdd" v-if="isMainImgOperator">
            <Icon :size="14" icon="ep:plus" class="mr2px" />
            新增分析
          </el-button>
        </div>
      </div>
    </div>
    <el-table
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      row-class-name="commonTableRow"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <el-table-column
        label="店铺"
        prop="storeName"
        width="250"
        fixed
        :show-overflow-tooltip="true"
      />
      <el-table-column label="货品编码" prop="productCode" />
      <el-table-column
        label="运营人员"
        prop="operatorList"
        min-width="320"
        :show-overflow-tooltip="false"
      >
        <template #default="{ row }">
          <lineReveals v-model:optionsList="row.operatorList" :no-bg="true" />
          <!-- <div class="row-center" v-for="item in row.operatorList" :key="item.id">
            <CustomerServicePeople :data="{ name: item.name, avatarOrigin: item.avatarOrigin }" />
          </div> -->
        </template>
      </el-table-column>
      <el-table-column label="链接主打方向" prop="mainDirection" min-width="180">
        <template #default="{ row }">
          {{ row.mainDirection || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="快照信息" prop="imgUrl" align="center" min-width="100">
        <template #default="{ row }">
          <el-image
            v-if="row.imgUrl"
            style="width: 40px; height: 40px; z-index: 999"
            :src="row.imgUrl"
            :preview-teleported="true"
            :preview-src-list="[row.imgUrl]"
            fit="cover"
          />
          <span v-else>{{ '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品款式图" prop="mainImageInfo" align="center" min-width="100">
        <template #default="{ row }">
          <el-image
            style="width: 40px; height: 40px; z-index: 999"
            :src="row.mainImageUrl"
            :preview-teleported="true"
            :preview-src-list="[row.mainImageUrl]"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="产品特点"
        prop="productFeaturesQuantity"
        :show-overflow-tooltip="false"
        min-width="100"
        align="right"
      >
        <template #default="{ row }">
          <span class="tag" @click="openForm('update', row.id, 'features')">
            {{ row.productFeaturesQuantity || 0 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="竞品分析"
        prop="competitorAnalysisQuantity"
        :show-overflow-tooltip="false"
        min-width="100"
        align="right"
      >
        <template #default="{ row }">
          <span class="tag" @click="openForm('update', row.id, 'competitor')">
            {{ row.competitorAnalysisQuantity || 0 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="主图卖点"
        prop="mainImageSellingPointsQuantity"
        :show-overflow-tooltip="false"
        min-width="100"
        align="right"
      >
        <template #default="{ row }">
          <span class="tag" @click="openForm('update', row.id, 'sellingPoint')">
            {{ row.mainImageSellingPointsQuantity || 0 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        :width="maxWidth"
        label="操作"
        align="left"
        :show-overflow-tooltip="false"
      >
        <template #default="{ row }">
          <div class="flex items-center optionDiv">
            <el-button
              link
              v-for="(btn, idx) in row.btns.showBtn"
              :key="idx"
              @click="btn.method"
              :type="btn.type"
              >{{ btn.label }}</el-button
            >
            <el-popover placement="bottom-end" v-if="row.btns.hideBtns.length">
              <template #reference>
                <img
                  src="@/assets/svgs/moreBtn.svg"
                  class="ml10px"
                  alt=""
                  style="width: 18px; height: 18px"
                />
              </template>
              <div class="hideBtns">
                <slot
                  v-for="(btn, index) in row.btns.hideBtns"
                  :key="index"
                  :name="`${btn.label}`"
                  :btn="btn"
                >
                  <el-button link :type="btn.type" @click="btn.method">{{ btn.label }}</el-button>
                </slot>
              </div>
            </el-popover>
          </div>

          <!-- <el-button link type="primary" v-if="hasPermission(row)" @click="openForm('updateAll', row.id)">编辑</el-button>
          <el-button link type="danger" v-if="hasPermission(row)" @click="handleDel(row.id)">删除</el-button>
          <el-button link type="primary" @click="confirmSnapShot(row)" v-if="row.sfqr">快照确认</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.size"
      v-model:page="queryParams.page"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单：添加/修改 -->
  <editAnalyseDrawer
    ref="formRef"
    @success="
      (val: any) => {
        if (val) getList()
      }
    "
  />
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import editAnalyseDrawer from './components/editAnalyseDrawer.vue'
import * as mainImageApi from '@/api/oa/new/mainImageAnalyse'
// import CustomerServicePeople from '@/views/customerService/components/people.vue'

// 选择运营人员
import lineReveals from '@/components/template/table/components/lineReveals.vue'
// import SWSelectPeople from '@/components/template/table/components/lineStaff.vue'
const appStore = useAppStore()

// 获取当前用户
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

import { useRole } from '@/hooks/common/useRole'
const { getPermissionInfo, getRole, grabCheck } = useRole('运营')
const isMainImgOperator = computed(() => grabCheck('主图运营'))
const isMainImgVisual = computed(() => grabCheck('主图视觉'))
provide('roles', { isMainImgOperator, isMainImgVisual, getRole })

// 编辑 删除 权限
const hasPermission = (row: any) => {
  const currentUserId = userStore.user.userNo
  // if(isMainImgOperator.value){
  //   return row.operatorList.map((user:any)=>user.userId).includes(currentUserId)
  // } else{
  //   return false
  // }
  return row.operatorList.map((user: any) => user?.userId || '').includes(currentUserId)
}

const hideBtns = ref<any>([])
const showBtns = ref<any>([])
const btnsOptions = (row: any) => {
  // await nextTick()
  // showBtns.value = []
  hideBtns.value = []
  const editBtn = { label: '编辑', type: 'primary', method: () => openForm('updateAll', row.id) }
  const showBtn = { label: '查看', type: 'primary', method: () => openForm('view', row.id) }
  const confirmBtn = { label: '快照确认', type: 'primary', method: () => confirmSnapShot(row) }
  const delBtn = { label: '删除', type: 'danger', method: () => handleDel(row.id) }
  showBtns.value = [showBtn]

  if (hasPermission(row)) {
    showBtns.value = [showBtn, editBtn, delBtn]
  }
  if (row.sfqr === 1) {
    showBtns.value = [showBtn, editBtn, confirmBtn, delBtn]
  }
  return { showBtn: showBtns.value.slice(0, 3), hideBtns: showBtns.value.slice(3) }
}
const maxWidth = ref()
// 表头部重新渲染
function renderHeader() {
  // 获取操作按钮组的元素
  setTimeout(() => {
    const opts = document.getElementsByClassName('optionDiv')
    let widthArr = [] as any
    // 取操作组的最大宽度
    Array.prototype.forEach.call(opts, function (item: any) {
      console.log(item.offsetWidth)
      widthArr.push(item.offsetWidth)
    })
    // 重新设置列标题及宽度属性
    maxWidth.value = Math.max(...widthArr) + 24
  }, 10)
}

const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 表格数据

const queryParams = reactive<any>({
  page: 1,
  size: 10,
  store: '',
  productCode: '',
  operator: ''
})
const operatorList = ref([])
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams
      // operator:operatorList.value.length?operatorList.value.map((user:any)=>user.userId).join(','):''
    }
    const data = await mainImageApi.getNewProductMainImageList(params).catch(() => {})
    list.value = data.records.map((item) => ({
      ...item,
      operator:
        item?.operatorList?.length && item?.operatorList[0]?.userId
          ? item.operatorList.map((user: any) => user?.userId || '').join(',')
          : '',
      operatorList:
        item?.operatorList?.length && item?.operatorList[0]?.userId ? item.operatorList : [],
      mainImageUrl: item.mainImageInfo ? item.mainImageInfo.fileUrl : '',
      btns: btnsOptions(item)
    }))
    total.value = data.total
    await nextTick()
    renderHeader()
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  operatorList.value = []
  handleQuery()
}

// 新增按钮点击
const handleAdd = () => {
  openForm('create', '', '')
}
/** 操作 */
const formRef = ref()
const openForm = (type: string, id?: string, part?: string) => {
  if (formRef.value) {
    formRef.value.open(type, id, part)
  }
}

// 删除
const handleDel = async (id: string) => {
  try {
    // 删除的二次确认
    await message.confirm('确定是否删除该条数据？')
    // 发起删除
    await mainImageApi.deleteNewProductMainImageList({ id }).catch((err) => {
      console.log(err)
    })
    message.success('删除成功')
    // 刷新列表
    await getList()
  } catch {}
}

// 确认快照
const confirmSnapShot = async (row: any) => {
  await message.confirm('是否确认快照？')
  const { id, operator, imgUrl } = row
  const params = {
    mainId: id,
    imgUrl,
    userIds: operator
  }
  mainImageApi.confirmMainImageSnapshot(params).then((res: any) => {
    console.log(res)
    message.success('确认成功')
    getList()
  })
}

/** 初始化 **/
const route = useRoute()
onMounted(async () => {
  getPermissionInfo(() => {
    if (route.query?.id) {
      queryParams.id = route.query?.id
      getList()
      delete queryParams.id
    } else {
      console.log(isMainImgOperator.value)
      getList()
    }
  })
})
if (route.query?.id) {
  const newUrl = window.location.href.replace(/\?.*$/, '')
  history.replaceState({}, '', newUrl)
}
</script>

<style lang="scss" scoped>
.tag {
  color: #0064ff;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }
}

:deep(.el-select__wrapper) {
  background: #ffffff !important;
}

.hideBtns {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;

  :deep(.el-button) {
    display: flex;
    justify-content: flex-start;
    width: 50px;
    margin-left: 0;
    margin: 4px 0;
    margin-left: 0 !important;

    &:first-of-type {
      margin-top: 0;
    }

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}

.optionDiv {
  display: flex;
  width: fit-content;
}
</style>
