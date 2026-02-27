<template>
  <content-layout :layouts="layouts">
    <template #basicInfo>
      <div>
        <s-table
          ref="tableRef"
          :columns="columns"
          :fetch="getCompetitiveList"
          :fetch-params="fetchParams"
          :pagination-map="{ pageNum: 'page', pageSize: 'pageSize' }"
          :auto-load="false"
        />
      </div>
    </template>
  </content-layout>
</template>
<script lang="tsx" setup>
import ContentLayout from '@/layout/components/ContentLayout'
import { ref, watch, computed, nextTick } from 'vue'
import { ElLink, ElImage } from 'element-plus'
import type { TableColumn } from '@/components/SWTable/src/table'
import { getCompetitiveList } from '@/api/oa/new/progressDashboardList'

const props = defineProps<{ row: any }>()

const layouts = [
  {
    label: '基本信息',
    key: 'basicInfo'
  }
]

const npDesignPictureId = computed(() => {
  const r = props?.row || {}
  return r.designPictureId
})

const tableRef = ref()
const fetchParams = ref({ page: 1, pageSize: 10, npDesignPictureId: '' as any })

watch(
  () => npDesignPictureId.value,
  async (val) => {
    fetchParams.value = { ...fetchParams.value, npDesignPictureId: val || '' }
    // 自动刷新
    await nextTick()
    tableRef.value?.refresh?.(true)
  },
  { immediate: true }
)

const columns = ref<TableColumn[]>([
  { prop: 'store', label: '竞品店铺', minWidth: 140 },
  {
    prop: 'imgUrl',
    label: '竞品图片',
    minWidth: 120,
    customRender: ({ row }) => {
      const url = row?.imgUrl
      return url ? (
        <ElImage
          src={url}
          fit="cover"
          style="width:48px;height:48px;border-radius:4px;vertical-align:middle;cursor:pointer"
          previewSrcList={[url]}
          previewTeleported
        />
      ) : (
        <span>-</span>
      )
    }
  },
  {
    prop: 'competitiveLink',
    label: '竞品链接',
    minWidth: 160,
    customRender: ({ row }) => (
      <ElLink
        type="primary"
        href={row?.competitiveLink || 'javascript:void(0);'}
        target="_blank"
        style="cursor:pointer"
      >
        点击跳转
      </ElLink>
    )
  },
  { prop: 'salesVolume', label: '竞品销量', minWidth: 120 },
  { prop: 'customerUnitPrice', label: '竞品客单价', minWidth: 120 },
  { prop: 'remarks', label: '竞品备注', minWidth: 160 }
])
</script>
<style scoped lang="scss"></style>
