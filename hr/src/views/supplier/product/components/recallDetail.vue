<template>
  <s-w-dialog v-model="isShow" ref="dialogRef" width="800" title="撤回记录" append-to-body>
    <div class="list">
      <el-table
        v-loading="loading"
        :data="list"
        :show-overflow-tooltip="true"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
        :header-cell-style="appStore.headerCellStyle"
      >
        <el-table-column label="撤回人" prop="revokeUserName" />
        <el-table-column label="撤回时间" prop="revokeTime" />
        <el-table-column label="撤回原因" prop="revokeReason" />
        <el-table-column label="附件" prop="attachment">
          <template #default="{ row }">
            <span class="link" @click.stop="handleAttachment(row.attachment)" v-if="row.attachment">
              {{ getFileUrlName(row.attachment) || '附件' }}
            </span>
          </template>
        </el-table-column>
        <template #empty>
          <div class="empty-img">
            <img src="@/assets/imgs/common/empty_list.png" alt="" />
            <div>暂无数据</div>
          </div>
        </template>
      </el-table>
    </div>

    <div class="btn">
      <el-button @click="handleCancel">关闭</el-button>
    </div>
  </s-w-dialog>
</template>
<script lang="ts" setup>
import { getPurchaseRevokeLog } from '@/api/supplier/purchase'
import { DialogInstance } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { downloadByUrl2 } from '@/utils/download'
const appStore = useAppStore()
const isShow = ref(false)

const dialogRef = ref<DialogInstance>()

const loading = ref(false)
const list = ref<any>([])
async function open(scPurchaseOrderId) {
  const data = await getPurchaseRevokeLog({ scPurchaseOrderId })
  list.value = data || []
  isShow.value = true
}

async function handleCancel() {
  isShow.value = false
}

const handleAttachment = (fileUrl) => {
  // console.log(fileUrl,)
  // fileName(fileUrl)
  downloadByUrl2(fileUrl, getFileUrlName(fileUrl) || '附件')
  // window.open(fileUrl)
}

function getFileUrlName(url: string) {
  const fileUrl = new URL(url)
  console.log(url)

  return fileUrl.searchParams.get('name')
}

defineExpose({ open })
</script>

<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  img {
    margin-left: auto;
  }
}
.btn {
  text-align: right;
  margin-top: 20px;
}
.el-dialog__body {
  padding: 0 !important;
}
.list {
  width: 100%;
}
.link {
  color: #0064ff;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
</style>
