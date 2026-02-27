<template>
  <ContentWrap>
    <div>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            class="mb-5px"
            label-width="78px"
          >
            <el-form-item label="日期" prop="beginDate">
              <el-date-picker
                v-model="times"
                type="daterange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :disabled-date="disabledDateFun"
                :clearable="false"
              />
            </el-form-item>
            <el-form-item label="店铺" prop="store">
              <StoreRangePlus
                v-model="queryParams.store"
                @change="handleStoreChange"
                placeholder="请选择店铺"
                :showAllChannels="false"
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
            <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
              重置
            </el-button>
            <el-popover title="日报发送提示" content="请选择日期和店铺" placement="bottom">
              <template #reference>
                <el-button
                  type="primary"
                  :disabled="!queryParams.store"
                  id="daMoPan_dayReport_send"
                  @click="sendReport"
                  :loading="loading"
                >
                  发送
                </el-button>
              </template>
            </el-popover>
          </div>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <div ref="daMoPanDayReportTable">
      <div class="table-title">
        <img class="table-title-left" src="@/assets/imgs/channelData/header_left.png" />
        <div class="table-title-center">
          <div> {{ shopName }}超级短视频日报表 </div>
          <!-- <div class="table-title__time">{{ dayjs(times[0]).format('YYYY-MM-DD') }} ~ {{
            dayjs(times[1]).format('YYYY-MM-DD')
          }}</div> -->
        </div>
        <img class="table-title-right" src="@/assets/imgs/channelData/header_right.png" />
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
        <el-table-column label="日期" prop="dataDate" min-width="180" />
        <el-table-column label="花费" prop="charge" min-width="150" align="center">
          <template #default="scope">
            {{ !isNull(scope.row.charge) ? numberFormateShow(scope.row.charge) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="观看量" prop="feedViewNum" min-width="150" align="center">
          <template #default="scope">
            {{ !isNull(scope.row.feedViewNum) ? numberFormateShow(scope.row.feedViewNum) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="点击量" prop="click" min-width="100" align="center">
          <template #default="scope">
            {{ !isNull(scope.row.click) ? numberFormateShow(scope.row.click) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="平均点击花费" prop="ecpc" min-width="180" align="center">
          <template #default="scope">
            {{ numberFormateShow(scope.row.ecpc) || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="点击率" prop="ctr" min-width="100" align="center" />
        <el-table-column
          label="直接引导成交金额"
          prop="alipayDirAmt"
          min-width="200"
          align="center"
        >
          <template #default="scope">
            {{ !isNull(scope.row.alipayDirAmt) ? numberFormateShow(scope.row.alipayDirAmt) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="直接引导成交ROI" prop="alipayDirRoi" min-width="200" align="center">
          <template #default="scope">
            {{ !isNull(scope.row.alipayDirRoi) ? numberFormateShow(scope.row.alipayDirRoi) : '-' }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </ContentWrap>
</template>

<script lang="ts" setup>
defineOptions({ name: 'DaMoPanDayReport' })
import { useAppStore } from '@/store/modules/app'
import * as dharmaApi from '@/api/daMoPan/index'
import dayjs from 'dayjs'
import { isNull, isArray } from 'lodash-es'
import { getLast7Days } from '@/utils/formatTime'
import html2canvas from 'html2canvas-plus'
import * as TagMngApi from '@/api/tagMng'
import { getChannelNameById } from '@/utils/index'
import { numberFormateShow } from '@/utils/formatter'
const appStore = useAppStore()

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const queryParams = ref({
  startDate: '', //开始时间
  endDate: '', //结束时间
  store: 'swTaobao' //店铺
})
const queryFormRef = ref() // 搜索的表单

const times = ref<any[]>(getLast7Days())
const daMoPanDayReportTable = ref()
const storsList = ref<any[]>([])

/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  times.value = getLast7Days()
  queryFormRef.value.resetFields()
  getStoreName(queryParams.value.store)
  handleQuery()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    if (isArray(times.value) && times.value.length === 2) {
      queryParams.value.startDate = dayjs(times.value[0]).format('YYYY-MM-DD')
      queryParams.value.endDate = dayjs(times.value[1]).format('YYYY-MM-DD')
    }
    const data = await dharmaApi.getShortVideoList(queryParams.value).catch(() => {})
    if (data) {
      list.value = data
    }
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  getList()
  getAllData()
})

const disabledDateFun = (Date: any) => {
  return dayjs().isBefore(dayjs(Date))
}
const shopName = ref('')

//发送日报
const sendReport = async () => {
  try {
    // 发送的二次确认
    await message.confirm(
      `确定发送日期为【${dayjs(times.value[0]).format('YYYY-MM-DD')}至${dayjs(times.value[1]).format('YYYY-MM-DD')}】的日报吗？`
    )
    loading.value = true
    nextTick(async () => {
      try {
        const canvas = await html2canvas(daMoPanDayReportTable.value)
        canvas.toBlob(
          async (blob) => {
            try {
              if (!blob) {
                throw new Error('获取图片blob失败！')
              }

              const formData = new FormData()
              formData.append('file', blob, `超级短视频日报.png`) // 文件名为 target-image.png
              formData.append('store', queryParams.value.store) // 添加业务参数
              await dharmaApi.uploadAndSend(formData) // 调用上传接口
              message.success(t('cropper.uploadSuccess'))
            } catch (err) {}
          },
          'image/png',
          1
        )
      } catch (error) {
        console.log(error)
        message.warning('导出图片失败')
      } finally {
        loading.value = false
      }
    })
  } catch {}
}
//商铺选择变化
function handleStoreChange(value: string) {
  getStoreName(value)
  getList()
}
//获取渠道名称
function getStoreName(value: string) {
  const valueAttr = storsList.value.filter((item) => item.storeCode === value)
  shopName.value = getChannelNameById(valueAttr[0]?.platformId)
}
// 获取所有店铺信息
async function getAllData() {
  try {
    const res = await TagMngApi.getQueryChannels()
    storsList.value = res
    getStoreName(queryParams.value.store)
  } catch (error) {}
}
</script>

<style lang="scss" scoped>
.table-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: auto;
  font-size: 18px;
  margin-bottom: 10px;
  height: 85px;
  background-repeat: no-repeat;
  background-image: url('@/assets/imgs/channelData/header_bg.png');
  background-size: cover;

  &-left,
  &-right {
    width: 20px;
    height: 32px;
  }

  &__time {
    font-size: 16px;
    color: #333;
    font-weight: lighter;
    margin-top: 5px;
  }

  &-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 15px;
    align-items: center;
  }
}
</style>
