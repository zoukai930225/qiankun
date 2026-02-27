<template>
    <SWDrawer v-model="drawerVisible" :title="drawerTitle">
        <el-card shadow="never" class="dashboard">
            <el-tabs v-loading="drawerLoading" v-model="activeTab" @tab-change="handleTabChange">
                <el-tab-pane v-for="tab in tabList" :key="tab.name" :label="tab.label" :name="tab.name" />
            </el-tabs>
            <!-- <s-w-search-form ref="searchFormRef" :schema="searchSchema" @reset="onReset" @search="onSearch"
                :show-search-button="false" auto-search-on-change>
                <el-button @click="exportData" :loading="exportLoading" style="width: 60px" type="primary">
                    导出
                </el-button>
            </s-w-search-form> -->
            <el-form inline :model="form" >
                <el-form-item label="时间范围" prop="dateRange">
                    <el-date-picker
                        v-model="form.dateRange"
                        type="daterange"
                        value-format="YYYY-MM-DD"
                        format='YYYY-MM-DD'
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :clearable="false"
                        style="width: 220px;"
                        @change="onSearch(form)"
                    />
                </el-form-item>
                <el-form-item label="店铺" prop="store">
                    <el-select v-model="form.store" placeholder="请选择" style="width: 240px;"   @change="onSearch(form)" collapse-tags collapse-tags-tooltip>
                        <el-option v-for="item in storeOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="商品编码" prop="goodsCode">
                    <GoodCode v-model="form.goodsCode" 
                    @change="onSearch(form)"
                    style="width: 240px;"
                    placeholder="请选择商品编码" 
                    :multiple="true" 
                    :paramsValue="{ label: 'goodsNo', value: 'goodsNo' }"
                    :url="`/api/qcQualityInspectionReportInfo/selectWdtGoodsList50`" />
                </el-form-item> -->
                <el-form-item>
                    <el-button @click="onReset" >重置</el-button>
                    <el-button @click="exportData" :loading="exportLoading" type="primary">导出</el-button>
                </el-form-item>
            </el-form>
            <!-- 看板 -->
            <component :is="currentBoard" :form="form" :list="list" :loading="loading" />
        </el-card>

        <template #footer>
            <el-button @click="reset">取消</el-button>
        </template>
    </SWDrawer>
</template>
<script lang="ts" setup>
// import { getDictLabel, DICT_TYPE } from '@/utils/dict'
// import GoodCode from '@/components/template/query/components/goodCode.vue'
import DrawerFirstType from './drawer/drawerFirstType.vue'
import DrawerFirstCategory from './drawer/drawerFirstCategory.vue'
import DrawerSecondCategory from './drawer/drawerSecondCategory.vue'
import dayjs from 'dayjs'
import download from '@/utils/download'
import { ref, computed } from 'vue'
interface StoreItem {
    storeCode: string
    storeName: string
}
const message = useMessage()
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerLoading = ref(false)
// import downloadSvg from '@/assets/svgs/common/download.svg'
import * as negativeReviewDashboardApi from '@/api/negativeReviewDashboard'

const currentBoard = shallowRef(DrawerFirstType)

const open = async () => {
    drawerVisible.value = true
    drawerTitle.value = '中差评原因数据看板'
    getStoreList()
    onSearch(form.value)
}

// 获取当前标题
const getCurrentTitle = () => {
    const titleMap = {
        '1': '日度中差评数量大于2',
        '2': '中差评原因一级分类',
        '3': '日度中差评数量大于3'
    }
    return titleMap[activeTab.value] || ''
}
const activeTab = ref('1')
const tabList = ref([
    {
        name: '1',
        label: '日度中差评数量大于2'
    },
    {
        name: '3',
        label: '日度中差评数量大于3'
    },
    {
        name: '2',
        label: '中差评原因一级分类'
    },
])
//
const handleTabChange = (pane: any) => {
    if (pane === '1') {
        currentBoard.value = DrawerFirstType
    } 
    if (pane === '2') {
        currentBoard.value = DrawerFirstCategory
    }
    if (pane === '3') {
        currentBoard.value = DrawerSecondCategory
    }
    onReset()
    getList()
}
// 默认昨日日期
const yesterday = dayjs().subtract(1, 'day')

const startOfYesterday = yesterday.startOf('day').format('YYYY-MM-DD')
const endOfYesterday = yesterday.endOf('day').format('YYYY-MM-DD')

interface FormType {
    startTime: string
    endTime: string
    store: string
    filterCount: number | undefined
    dateRange?: any
}
const form = ref<FormType>({
    startTime: '',
    endTime: '',
    dateRange: [startOfYesterday, endOfYesterday],
    store: 'ALL',
    filterCount: undefined //中差评数量情况：undefined；中差评原因产品（日度中差评数量大于2）：2；
})



// s-w-search-form
const searchFormRef = ref()
const storeList = ref<StoreItem[]>([])
const storeOptions = computed(() =>
    storeList.value.map((s) => ({ label: s.storeName, value: s.storeCode }))
)

const onSearch = (val: any) => {
    console.log('val', val)
    form.value.startTime =
        Array.isArray(val.dateRange) && val.dateRange.length
            ? dayjs(val.dateRange[0]).format('YYYY-MM-DD')
            : ''
    form.value.endTime =
        Array.isArray(val.dateRange) && val.dateRange.length
            ? dayjs(val.dateRange[1]).format('YYYY-MM-DD')
            : ''
    form.value.store = val.store ?? 'ALL'
    getList()
}

const list = ref<any[]>([])
const loading = ref(false)
const getList = async () => {
    loading.value = true
    form.value.filterCount = activeTab.value === '1' ? 2 : undefined
    const { dateRange, ...rest } = form.value 
    const params = { ...rest }
    const request = activeTab.value === '1' ? negativeReviewDashboardApi.getNegativeReviewCount :
        activeTab.value === '2' ? negativeReviewDashboardApi.getNegativeReviewReasonFirst : negativeReviewDashboardApi.getNegativeReviewReasonSecond
    const res = await request(params)
    loading.value = false
    list.value = res || []
}
// 导出数据
const exportLoading = ref(false) // 导出状态
const exportData = async () => {
    try {
        exportLoading.value = true
        form.value.filterCount = activeTab.value === '1' ? 2 : undefined
        const params = { ...form.value }
        const request = activeTab.value === '1' ? negativeReviewDashboardApi.exportNegativeReviewCount :
            activeTab.value === '2' ? negativeReviewDashboardApi.exportNegativeReviewReasonFirst : negativeReviewDashboardApi.exportNegativeReviewReasonSecond
        const res = await request(params)
        if (res) {
            const title = getCurrentTitle()
            download.excel(res, `${title}.xls`)
            message.success('导出成功')
        }
    } catch {
        message.error('导出失败')
    } finally {
        exportLoading.value = false
    }
}

const onReset = () => {
    form.value.startTime = startOfYesterday
    form.value.endTime = endOfYesterday
    form.value.store = 'ALL'
    form.value.dateRange = [startOfYesterday, endOfYesterday]
}

const getStoreList = async () => {
    if (storeList.value.length) return
    const res = await negativeReviewDashboardApi.getNegativeReviewShopList().catch(() => { })
    storeList.value = res || []
      storeList.value.unshift({ storeCode: 'ALL', storeName: '全部' })
}


const reset = () => {
    drawerVisible.value = false
}
defineExpose({ open })
</script>

<style lang="less" scoped>
:deep(.el-card__body) {
    padding: 0 !important;
}

.dashboard {
    background-color: #fff;
    width: 100%;
    min-height: calc(100% - 10px);
    border-radius: 10px;
    border: none;
    padding: 10px;
}


</style>
