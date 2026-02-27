<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2026-01-28 13:10:21
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2026-01-28 14:44:20
-->
<template>
  <scheme-details class="download-drawer" ref="detailsRef" name="DownloadDrawer" :width="936">
    <template #card>
      <scheme-table
        :column="downloadColumn"
        :table-data="downloadList"
        :list-name="''"
        :btn-list="btns"
        :handle-column="handleColumn"
        name="downloadTable"
        :show-screen="true"
      />
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()">关闭</el-button>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'DownloadDrawer' }
</script>

<script lang="tsx" setup>
import { debounce } from 'lodash-es'
import request from '@/config/axios'
import { PageItem } from '@/components/template/config/type'
import { downloadByUrl2 } from '@/utils/download'
const message = useMessage()
const detailsRef = ref<any>()
const loading = ref(false)
const downloadColumn = computed(() => [
  { field: 'fileName', title: '文件名', minWidth: 100 },
  { field: 'createdAt', title: '生成时间', minWidth: 100 },
  {
    field: 'status',
    title: '状态',
    minWidth: 100,
    isCustom: true,
    customRender: (row: any) => {
      return (
        <div class={`status-tag status-tag-${row.status}`}>
          {Number(row.status) === 1 ? '生成中' : Number(row.status) === 2 ? '已生成' : '生成失败'}
        </div>
      )
    }
  }
])
const handleColumn = computed(() => [
  { fun: 'downloadAction', txt: '下载', reveal: (_item: any) => Number(_item.status) === 2 }
])
const btns = computed(() => [
  {
    fun: 'refresh',
    txt: '刷新',
    type: 'primary'
  }
])
const downloadList = ref<Array<any>>([])
const page = ref<PageItem>({
  ...new PageItem()
})
// 弹出通用
const openView = (item: any = {}, type: string = 'add', module: string = '') => {
  detailsRef?.value?.openDrawer(async () => {
    await onSearch()
  })
}
const onSearch = async () => {
  loading.value = true
  const res: any = await request.get({
    url: `/api/sysExportRecord/page`,
    params: {
      page: page.value.page,
      size: page.value.size,
      bizType: 'product_bundling_analysis'
    }
  })
  downloadList.value = res.records
  page.value = { ...page.value, total: res.total }
  loading.value = false
}
// 按钮回调
const onButtonClick = (btn: any) => {
  if (btn.fun === 'refresh') {
    onSearch()
  }
}
// 操作列回调
const viewDetails = (type: string, item?: any, btn?: any) => {
  if (btn.fun === 'downloadAction') {
    handleDownload(item)
  }
}
const handleDownload = debounce(async (row: any) => {
  try {
    row.loading = true
    await downloadByUrl2(row.url, row.fileName)
    message.success('下载成功')
  } catch (e) {
  } finally {
    row.loading = false
  }
}, 1000)
defineExpose({ openView })
const dataValue = ref('')
const bukValue = ref('')
const viewType = ref('download')
provide('DownloadDrawerDetails', { dataValue, bukValue, viewType, title: '结果下载' })
provide('downloadTableForm', {
  page,
  onButtonClick,
  viewDetails,
  onSearch,
  loading
})
</script>
<style lang="scss" scoped>
:deep() {
  .status-tag {
    display: flex;
    height: 28px;
    border-radius: 100px;
    /* 自动布局 */
    padding: 0 16px;
    font-size: 14px;
    justify-content: center;
    align-items: center;
    max-width: 90px;
    &-1 {
      background-color: rgba(0, 100, 255, 0.2);
      color: #0064ff;
    }

    &-2 {
      background-color: rgba(52, 155, 52, 0.2);
      color: #349b34;
    }

    &-3 {
      background-color: #e5e5e5;
      color: #666666;
    }
  }
}
</style>
