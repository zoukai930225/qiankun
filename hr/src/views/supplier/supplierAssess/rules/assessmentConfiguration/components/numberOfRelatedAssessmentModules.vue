<template>
  <dialog-flux-wrap height="50vh">
    <s-table
      ref="tableRef"
      border
      :columns="columns"
      :data="data"
      row-key="key"
      :show-pagination="false"
    />
  </dialog-flux-wrap>
</template>
<script lang="tsx" setup>
import { ref, computed } from 'vue'
import { ElAvatar } from 'element-plus'
import DefaultAvatar from '@/assets/imgs/avatar_logo.png'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import { clickShowItems } from '@/api/supplier/assessmentConfiguration'

interface Props {
  row?: any
  supplierId?: string
}

const props = defineProps<Props>()

const supplierId = computed<string | undefined>(
  () => props.supplierId || props.row?.supplierId || props.row?.id
)

const tableRef = ref()
const data = ref<any[]>([])
const queryParams = ref<any>({ supplierId: supplierId.value })

const columns = ref<any[]>([
  {
    prop: 'assessmentType',
    label: '考核类型',
    minWidth: 100,
    align: 'left',
    headerAlign: 'left',
    customRender: ({ row }: any) =>
      getDictLabel(DICT_TYPE.SUPPLIER_ASSESSMENT_TYPE, row?.assessmentType) || '-'
  },
  {
    prop: 'assessmentTypeName',
    label: '考核模块',
    minWidth: 160,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'assessmentPerson',
    label: '考核人',
    minWidth: 160,
    align: 'left',
    headerAlign: 'left',
    customRender: ({ row }: any) => {
      const person = row?.assessmentPerson || {}
      const avatar = false ? DefaultAvatar : person?.avatarOrigin || ''
      const name = person?.name || person?.enName || '-'
      return (
        <div class="person flex items-center gap-6px">
          <ElAvatar size={18} src={avatar} class="avatar" />
          <span class="name">{name}</span>
        </div>
      )
    }
  }
])
onMounted(async () => {
  const res: any = await clickShowItems(queryParams.value)
  data.value = res
})
</script>
<style scoped lang="scss">
.modules-dialog {
  .person {
    display: inline-flex;
    align-items: center;
    .avatar {
      margin-right: 6px;
    }
  }
}
</style>
