<template>
  <div>
    <SWDrawer v-model="drawerVisible" :title="drawerTitle" @closed="handleClosed">
      <div class="content" v-loading="drawerLoading">
        <slot v-bind="props" :auditLogs="auditLogs">
          <auditTimeLine v-bind="props" :auditLogs="auditLogs" />
        </slot>
      </div>
      <template #footer>
        <el-button @click="reset" class="mr5">关闭</el-button>
      </template>
    </SWDrawer>
  </div>
</template>
<script lang="ts" setup>
import { getPurchaseAuditLogList } from '@/api/supplier/appointAudit'
import auditTimeLine from '../../components/auditTimeLine.vue'

const message = useMessage()

const props = withDefaults(
  defineProps<{
    timeKey?: string
    statusKey?: string
    personKey?: string
    commentKey?: string
    descKey?: string
    desc?: (status?: any, desc?: string) => string
    isSubmit?: (status: any) => boolean
    isPass?: (status: any) => boolean
    isNoPass?: (status: any) => boolean
    isRecall?: (status: any) => boolean
    isRemove?: (status: any) => boolean
    api?: (params: any) => Promise<any>
    drawerTitle?: string
  }>(),
  {
    api: getPurchaseAuditLogList,
    drawerTitle: '查看审核记录'
  }
)

const drawerVisible = ref(false)
const drawerLoading = ref(false)
const auditLogs = ref<any>([])
const open = async (params?: any) => {
  try {
    drawerLoading.value = true
    const data = await props.api(params)
    if (data && data.length) {
      drawerVisible.value = true
      await nextTick()

      auditLogs.value = data || []
    } else {
      message.warning('未查询到订单日志！')
    }
    drawerLoading.value = false
  } catch (error) {}
}
const reset = () => {
  drawerVisible.value = false
}

function handleClosed() {
  auditLogs.value = []
}

defineExpose({ open })
</script>

<style lang="less" scoped>
.content {
  background-color: #fff;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  padding: 20px 50px;
}
</style>
