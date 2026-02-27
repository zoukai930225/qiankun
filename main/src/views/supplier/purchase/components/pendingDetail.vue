<template>
  <div class="drawer-wrapper">
    <s-w-drawer
      ref="drawerRef"
      v-model="isShow"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      title="查看"
      width="1300px"
      @closed="handleClosed"
    >
      <div class="drawerContent">
        <MainContent
          ref="contentRef"
          :form-data="data"
          is-detail
          :table-data="tableData"
          @handle-query="handleQuery"
        />
      </div>

      <template #footer>
        <el-button class="mlauto" @click="handleClosed">取消</el-button>
      </template>
    </s-w-drawer>
  </div>
</template>
<script setup lang="tsx">
import { scPurchaseRequestPoolByIdApi } from '@/api/supplier/purchase'
import MainContent from '@/views/supplier/purchase/components/pendingDialogContent.vue'

const props = defineProps<{
  rowData: Supplier.Purchase.ListItem
}>()

const loading = ref(false)
const isShow = ref(false)
const data = ref<any>({})
const tableData = ref<any[]>([])
const contentRef = ref()

/** 获取详情 */
async function getDetail() {
  loading.value = true

  try {
    const res = await scPurchaseRequestPoolByIdApi(props.rowData.id!)

    data.value = res

    tableData.value = res?.detailList?.length
      ? [
          {
            applicationQty: res?.detailList.reduce(
              (arr, cur) => arr + (cur.applicationQty || 0),
              0
            ),
            estimatePrice: (() => {
              const total =
                res?.detailList?.reduce((acc, cur) => {
                  const qty = Number(cur.applicationQty) || 0
                  const price = Number(cur.estimatePrice) || 0
                  return acc + qty * price
                }, 0) || 0

              return Math.round(total * 10000) / 10000
            })(),
            key: 'sumRow'
          },
          ...res?.detailList
        ]
      : []
  } catch (error) {
    console.error('获取详情失败:', error)
  } finally {
    loading.value = false
  }
}

function handleQuery(params) {
  const table = data.value?.detailList.filter((ele) => {
    return Object.entries(params).every(([key, value]) => ele[key] === value || !value)
  })

  tableData.value = [
    {
      applicationQty: table.reduce((arr, cur) => arr + (cur.applicationQty || 0), 0),
      estimatePrice: table.reduce(
        (arr, cur) => arr + (cur.applicationQty || 0) * (cur.estimatePrice || 0),
        0
      )
    },
    ...table
  ]
}

async function open() {
  isShow.value = true
  await nextTick()
  getDetail()
}

function handleClosed() {
  data.value = {}
  isShow.value = false
  contentRef.value?.resetParams()
}

defineExpose({ open })
</script>

<style lang="less" scoped>
@import url(../../index.scss);
* {
  --el-input-width: 220px;
}
:deep(.el-drawer__body) {
  .el-form {
    .el-form-item__content {
      .el-input__wrapper,
      .el-select__wrapper {
        width: auto;
      }
    }
  }
}

.drawer-wrapper {
  flex: 1;
  overflow: hidden;
  border-radius: 8px;
}

:deep(.el-drawer) {
  min-width: 500px;
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 背景
:deep(.el-drawer__body) {
  display: flex;
  flex-direction: column;
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
  padding-bottom: 0 !important;
}

.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.drawerContent {
  flex: 1;
  overflow: scroll;
  border: 0;
  font-size: 14px;

  &::-webkit-scrollbar {
    display: none;
  }
}

:deep(.el-card) {
  margin-bottom: 24px;
  padding: 20px;
  border-radius: 8px;
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  .el-card__body {
    box-sizing: border-box;
    padding: 0;
  }

  .el-card__header {
    padding: 16px 20px;
  }

  .title {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 20px;

    &::before {
      content: '';
      display: block;
      width: 3px;
      height: 10px;
      margin-right: 6px;
      background-color: rgb(0, 100, 255);
    }
  }

  .content {
    margin-bottom: 20px;

    .item {
      display: flex;

      .el-form-item {
        flex: 1;
        margin: 0;
        padding: 16px 20px;

        .el-form-item__label {
          margin-bottom: 10px;
          line-height: 20px;
        }

        .isDisabled {
          cursor: text;

          .el-input__wrapper {
            border: none !important;
            box-shadow: none !important;
            background: #e8e9ed8c;

            .el-input__inner {
              color: #333333 !important;

              &::placeholder {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}

.baseInfo {
  min-height: 288px;
}

.postInfo {
  min-height: 211px;
}

.btns {
  :deep(.el-form-item__content) {
    flex-direction: row-reverse;

    .el-button {
      margin-left: 16px;
    }
  }
}

:deep(.el-drawer__footer) {
  padding-bottom: 10px;
  box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.04);
  z-index: 999;
}

:deep(.el-form-item) {
  margin: 2px 0 14px 0;

  .el-form-item__content {
    flex-wrap: nowrap;
  }

  .el-input__suffix {
    width: 20px;
  }
}

.endTimePicker {
  margin-left: 4px;

  :deep(label) {
    display: none;
  }
}

.store {
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.is-disabled),
.disabled {
  color: #cdcdcd !important;
}

.datePickers {
  :deep(.el-input__inner) {
    width: 70px;
  }
}

.footer {
  display: flex;
}

.userInfo {
  background: #f2f6fc;
}

:deep(.el-divider) {
  width: calc(100% + 40px);
  margin: 20px -20px;
}
</style>
