<!-- 新品进度看板  -->
<template>
  <div class="bg">
    <div class="row header-wapper mt16px">
      <!-- <GoodTab :select-tab="selectTab" @tab-click="tabClick" /> -->
      <el-tabs v-model="activityName" @tab-change="tabClick" style="width: calc(100% - 0px)">
        <el-tab-pane v-for="{ label, name } in tabsOps" :key="name" :name="name">
          <template #label>
            <img class="mr8px" alt="" />
            <span>{{ label }}</span>
          </template>
        </el-tab-pane>
      </el-tabs>
      <el-checkbox
        style="margin-left: auto; margin-right: 20px"
        v-model="myOperateData"
        label="显示我的操作"
        @change="myOperateDataChange"
      />
    </div>
    <!-- 产品搜索 -->
    <GoodFilter
      ref="goodFilterRef"
      :select-tab="selectTab"
      :deptList="deptList"
      @handle-searh="goodHandleSearch"
      v-show="selectTab === 1"
    />
    <!-- 包装搜索 -->
    <SearchForm
      ref="searchFormRef"
      :select-tab="selectTab"
      @handle-searh="packageHandleSearch"
      v-show="selectTab === 2"
    />
    <!-- 工厂二开搜索 -->
    <factorySearch
      :select-tab="selectTab"
      @handle-search="factoryHandleSearch"
      v-show="selectTab === 3"
    />

    <!-- <div class="mid-line"></div> -->
    <!-- 产品列表 -->
    <div v-if="list && list.length > 0 && selectTab === 1">
      <div class="goodNodeBg">
        <GoodNode
          v-for="(value, index) in list"
          :data="value"
          :categoryList="categoryList"
          :key="index"
          :style="{ borderRight: index === packageList.length - 1 ? 'none' : '1px solid #E5E5E5' }"
          @click-node="clickNode"
        />
      </div>
    </div>
    <!-- 包装列表 -->
    <div v-if="packageList && packageList.length > 0 && selectTab === 2">
      <div class="goodNodeBg">
        <PackageGoodNode
          v-for="(value, index) in packageList"
          :data="value"
          :key="index"
          :style="{ borderRight: index === packageList.length - 1 ? 'none' : '1px solid #E5E5E5' }"
          @click-node="clickPackageNode"
        />
      </div>
    </div>
     <!-- 工厂二开列表 -->
    <div v-if="factoryList && factoryList.length > 0 && selectTab === 3">
      <div class="goodNodeBg">
        <factoryNode
          v-for="(value, index) in factoryList"
          :data="value"
          :key="index"
          :style="{ borderRight: index === factoryList.length - 1 ? 'none' : '1px solid #E5E5E5' }"
          @click-node="clickFactoryNode"
        />
      </div>
    </div>
    <div
      v-if="
        (requestDta && list && list.length == 0 && selectTab === 1) ||
        (packageList && packageList.length == 0 && selectTab === 2) ||
        (factoryList && factoryList.length == 0 && selectTab === 3)
      "
      style="margin-top: auto; margin-bottom: auto"
    >
      <div class="flex-column empty" style="align-items: center">
        <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" />
        <span style="color: #666666; font-size: 14px; padding-top: 5px; padding-bottom: 20px"
          >暂无数据</span
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import GoodFilter from '@/views/dataV/components/newGoodProgressBoard/goodFilter.vue'
// import GoodTab from '@/views/dataV/components/newGoodProgressBoard/goodTab.vue'
import SearchForm from './package/searchForm.vue'

import GoodNode from '@/views/dataV/components/newGoodProgressBoard/node.vue'
import { useCategoryList } from '@/views/OA/new/product/hooks'
import PackageGoodNode from './package/node.vue'

import * as NewGoodApi from '@/api/dataV/newGood'
import { bigScreenNewPackageProgressBoard ,bigScreenFactorySecondaryProgressBoard} from '@/api/dataV/newGood'
import * as DeptApi from '@/api/system/dept'

// 工厂二开
import factorySearch from './factory/searchForm.vue'
import factoryNode from './factory/node.vue'

defineOptions({ name: 'OANewBoard' })
const activityName = ref<0 | 1 | 2 | 3>(1)

const handleTabChange = (value) => {
  console.log(value)
}

const tabsOps = [
  { label: '产品', name: 1 },
  { label: '包装', name: 2 },
  { label: '工厂二开', name: 3 },
]

const { categoryList } = useCategoryList()
const router = useRouter() // 路由对象

const goodFilterRef = ref()
const selectTab = ref(1) // 1-产品 2-包装

const list = ref([])

const tabClick = (val: any) => {
  if (selectTab.value != val) {
    goodFilterRef.value?.resetQueryParams()
    searchParam.value = {}
  }
  selectTab.value = val

  if (selectTab.value === 2) {
    getPackageList()
  }else if(selectTab.value === 3){
    getFactoryList()
  } else {
    getList()
  }
}
const searchParam = ref({})
const goodHandleSearch = (val: any) => {
  console.log('商品筛选参数:', val)
  searchParam.value = val
  getList()
}
const packageParams = ref({})

const packageHandleSearch = (val: any) => {
  console.log('包装筛选参数:', val)
  packageParams.value = val
  getPackageList()
}

const packageList = ref([])
const getPackageList = async () => {
  try {
    console.log('包装筛选参数:', packageParams.value)
    loadingInstance.value = ElLoading.service({ fullscreen: false, text: '数据加载中' })
    const res = await bigScreenNewPackageProgressBoard({
      ...packageParams.value,
      isMyData: myOperateData.value ? 1 : 0
    })
    console.log('包装看板数据:', res)
    packageList.value = res || []
    loadingInstance.value.close()
  } catch (error) {
    loadingInstance.value.close()
  }
}

/** 工厂二开 */
const factoryParams = ref({})

const factoryHandleSearch = (val: any) => {
  console.log('工厂二开筛选参数:', val)
  factoryParams.value = val
  getFactoryList()
}


const factoryList = ref([])
const getFactoryList = async () => {
  try {
    console.log('工厂二开筛选参数:', factoryParams.value)
    loadingInstance.value = ElLoading.service({ fullscreen: false, text: '数据加载中' })
    const res = await bigScreenFactorySecondaryProgressBoard({
      ...factoryParams.value,
      isMyData: myOperateData.value ? 1 : 0
    })
    console.log('工厂二开看板数据:', res)
    factoryList.value = res || []
    loadingInstance.value.close()
  } catch (error) {
    loadingInstance.value.close()
  }
}

/** 工厂二开 */

onMounted(() => {
  getList()
  getDeptList()
})

const deptList = ref([])

const getDeptList = async () => {
  const data = await DeptApi.getFirstDep({ company: 'SecretWorld', pId: 1 }).catch(() => {})
  if (data) {
    deptList.value = []
    data.forEach((item: any) => {
      if (
        [
          '企划部',
          '产品研发中心',
          '产品中心',
          '采购中心',
          '供应链中心',
          '运营中心',
          '视觉中心'
        ].includes(item.name)
      ) {
        deptList.value.push(item)
      }
    })
  }
}

const myOperateData = ref(true)
const myOperateDataChange = (v) => {
  if (selectTab.value === 2) {
    getPackageList()
    return
  }else if(selectTab.value === 3){
    getFactoryList()
    return
  } else {
    getList()
  }
}

const requestDta = ref(false)
const loadingInstance = ref()

const getList = async () => {
  loadingInstance.value = ElLoading.service({ fullscreen: false, text: '数据加载中' })
  const data = await NewGoodApi.bigScreenNewGoodProgressBoard({
    ...searchParam.value,
    planTemplate: selectTab.value,
    templateName: '新品模板',
    myOperateData: myOperateData.value ? 1 : 0
  }).catch((err) => {
    requestDta.value = true
    loadingInstance.value.close()
  })
  requestDta.value = true
  loadingInstance.value.close()
  list.value = data || []
}

/**
 * 点击卡片
 * @param data
 */
const clickNode = (nodeCode: String, data: any) => {
  console.log('点击卡片信息:', data, nodeCode)
  //设计图库
  if (data.productNumber) {
    // - 存在 产品编号的卡片跳转至 产品计划，跳转后需要带上查询条件 产品编号 的过滤
    if (
      nodeCode &&
      [
        'DesignPictureExamine',
        'SampleUpload',
        'ChooseMeeting',
        'SupplierChainSpecialistMatch',
        'DesignWorkmanship'
      ].includes(nodeCode)
    ) {
      router.push({
        name: 'DesignGallery',
        query: {
          productNumber: data.productNumber
        }
      })
      return
    }
    router.push({
      name: 'Product',
      query: {
        productNumber: data.productNumber
      }
    })
  } else if (data.planCode) {
    // - 存在 任务编号（没有产品编号的）的卡片跳转至 开发任务   跳转后需要带上查询条件 任务编号 的过滤
    router.push({
      name: 'Develop',
      query: {
        planCode: data.planCode
      }
    })
  } else {
    // - 都不存在的跳转至 企划管理    跳转后需要带上查询条件 企划编号 的过滤
    router.push({
      name: 'Plan',
      query: {
        planName: data.planName
      }
    })
  }
}

// 包装点击
const clickPackageNode = (nodeCode: string, data: any) => {
  console.log('点击包装卡片信息:', data, nodeCode)
  // 包装企划创建：无需调整
  if (
    ['DevelopManagerDistribution', 'SupplierChainDistribution', 'DesignPictureUpload'].includes(
      nodeCode
    )
  ) {
    // 产研主管分配、供应链开发分配、设计图上传跳转到包装开发任务 菜单上根据taskCode字段定位到数据
    // 包装开发任务跳转链接：/admin/PRD/package/develop?taskCode = xxxx。
    // 包装开发任务跳转链接：/admin/PRD/package/develop?planName = xxxx
    router.push({
      name: 'PackageDevelop',
      query: {
        taskCode: data.taskCode,
        planName: data.planName
      }
    })
  } else if (
    [
      'ProductInformationFilling',
      'ERPInformationFilling',
      'ApplicationProcurementPlan',
      'ProcurementPlanAudit',
      'Archive'
    ].includes(nodeCode)
  ) {
    // 包装资料填写、erp资料填写、采购计划申请、采购计划审核、归档调整到包装产品计划根据productNumber定位到具体数据
    // 包装产品计划跳转链接：/admin/PRD/package/product?productNumber = xxx
    router.push({
      name: 'PackageProduct',
      query: {
        productNumber: data.productNumber
      }
    })
  } else if (
    ['DesignPictureExamine', 'SupplierChainSpecialistMatch', 'SamplingProgress'].includes(nodeCode)
  ) {
    // 设计图审核、匹配供应商、打样进度跳转到包装设计图库菜单根据productNumber定位到具体数据
    // 包装设计图库跳转链接：/admin/PRD/package/designGallery?productNumber = xxx
    router.push({
      name: 'PackageDesignGallery',
      query: {
        productNumber: data.productNumber
      }
    })
  } else {
    router.push({
      name: 'PackagePlan',
      query: {
        planName: data.planName
      }
    })
  }
}

// 工厂二开卡片点击
/** 二开开发任务
 * FsDevelopManagerDistribution
    FsSupplierChainDistribution
    FSSupplierChainSpecialistMatch
*/
const clickFactoryNode = (nodeCode: string, data: any)=>{
   if (
    ['FsDevelopManagerDistribution', 'FsSupplierChainDistribution', 'FSSupplierChainSpecialistMatch','FsSamplingProgress', 'FsDevPlanExamine'].includes(
      nodeCode
    )
  ){
    router.push({
      name: 'FactoryDevelop',
      query:{
        fsTaskId:data.fsTaskId
      }
    })
  }else{
    router.push({
      name: 'FactoryProductProgress',
      query:{
        supplierId:data.supplierId
      },
      params: {
        id:data.fsTaskId,
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.bg {
  width: 100%;
  height: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .header-wapper {
    width: calc(100% - 40px);
    margin: 0 20px;
    position: relative;
    :deep(.el-checkbox) {
      position: absolute;
      top: 50%;
      right: 12px;
      transform: translateY(-70%);
    }
  }
  .mid-line {
    height: 1px;
    background: #e5e5e5;
    width: calc(100% - 40px);

    margin: 0 20px 10px 20px;
  }

  .goodNodeBg {
    margin-left: 16px;
    margin-right: 16px;
    height: calc(100% - 153px - 52px);
    width: calc(100% - 32px);
    display: flex;
    flex-direction: row;
    overflow: auto;
    margin-bottom: 8px;
    border-radius: 8px;
    border: 1px solid #e5e5e5;
  }
}
</style>
