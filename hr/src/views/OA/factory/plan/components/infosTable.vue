<template>
  <div class="infoTable" v-if="infoData?.[params.key]">
    <div
      class="row-center"
      style="position: relative; display: flex; align-items: center; justify-content: space-between"
    >
      <CardTitle :title="params.tableTitle" />
      <el-button
        v-if="params.tableTitle === '供应商信息'"
        type="primary"
        class="details_icon"
        @click="details"
        >规格明细</el-button
      >
      <el-button
        v-if="
          params.tableTitle === '下单信息' &&
          params['mock'] &&
          (!infoData.orderInfo || infoData.orderInfo.length === 0)
        "
        type="primary"
        class="details_icon"
        @click="openOrderInfo"
        >下单信息补录</el-button
      >
    </div>
    <div v-if="params.tableTitle === '下单信息'" class="order-info-list">
      <div class="list-header" style="">
        <div class="cell">SKU编码</div>
        <div class="cell">规格名称</div>
        <div class="cell">规格码</div>
        <div class="cell">下单量</div>
        <div class="cell">实际下单数量</div>
        <div class="cell">期望到货时间</div>
      </div>
      <div class="list-row" v-for="item in infoData.orderInfo" :key="item.sku">
        <div class="cell">{{ item.sku }}</div>
        <div class="cell">{{ item.color }}</div>
        <div class="cell">{{ item.size }}</div>
        <div class="cell">{{ item.orderVolume }}</div>
        <div class="cell">{{ item.realOrderVolume }}</div>
        <div class="cell">{{ item.expectedArrivalTime }}</div>
      </div>
    </div>
    <el-descriptions
      v-else
      class="infosDescriptions"
      label-width="200"
      border
      :column="params.columns"
    >
      <el-descriptions-item
        v-for="(col, index) in params.tableColumns"
        :key="index"
        :span="col.span"
        :width="200"
      >
        <template #label>
          <div class="cusLabel" style="width: 100px !important">
            <span
              style="display: inline-block; width: 100%"
              v-if="params.tableTitle !== '打样进度'"
              >{{ col.label }}</span
            >
            <span class="item-txt" v-else
              >{{ infoData.fsSupplierAuditStatusRespVo?.supplierName || '-' }}
              <el-popover placement="bottom" effect="dark">
                <template #reference>
                  <img :src="tipSvg" alt="" class="img-tips" />
                </template>
                <div>
                  <div style="margin-bottom: 10px"
                    >匹配原因:{{ infoData.supplierInfo.matchReason }}</div
                  >
                  <div>预估报价:{{ infoData.supplierInfo.matchPrice }}</div>
                </div>
              </el-popover>
            </span>
          </div>
        </template>
        <div class="value" v-if="params.tableTitle !== '打样进度'">
          <fileItem
            v-if="col.isFileUrl"
            :fileUrls="infoData[params.key]?.[col.key]"
            alignType="row"
          />
          <div
            class="userList"
            v-else-if="
              [
                'patternMakers',
                'purchaseUser',
                'chosenSupplierStaff',
                'fsDevPlanExaminer',
                'fsAssignedOrderPersonnel',
                'fabricDesigners'
              ].includes(col.key)
            "
          >
            <!-- <commonUser
              :data="item"
              v-for="item in col.key === 'purchaseUser'
                ? [infoData[params.key]?.[col.key]]
                : infoData[params.key]?.[col.key]"
              :key="item.userId"
            /> -->
            <personListPopover
              :person-list="
                col.key === 'purchaseUser'
                  ? infoData[params.key].purchaseUser?.userId
                    ? [infoData[params.key]?.[col.key]]
                    : []
                  : infoData[params.key]?.[col.key]
              "
              :showCount="2"
            />
          </div>
          <!-- 回收人 -->
          <div v-else-if="['recycleUserId'].includes(col.key)">
            <personListPopover
              :person-list="getPersonList(infoData[params.key], col.key)"
            ></personListPopover>
          </div>
          <!-- 回收人 -->
          <div v-else-if="['recycleReason'].includes(col.key)">
            {{
              getDictLabels(
                getIntDictOptions('fs_recycled_reason'),
                infoData[params.key]?.[col.key]
              )
            }}
          </div>
          <!-- 回收原因 -->
          <div v-else-if="['recycleNodes'].includes(col.key)">
            {{ getRecycleNodes(infoData[params.key]?.[col.key]) }}
          </div>
          <span v-else>{{
            [
              'productCostIncludingTax',
              'packagingManpower',
              'finishedProductCost',
              'packagingCost'
            ].includes(col.key)
              ? Number(infoData[params.key]?.[col.key] || 0).toFixed(3)
              : infoData[params.key]?.[col.key] || '-'
          }}</span>
        </div>
        <el-scrollbar :max-height="300" style="margin: 10px 5px 0 5px" v-else>
          <el-steps
            direction="vertical"
            class="custom-steps"
            :active="infoData.fsSupplierAuditStatusRespVo.fsSupplierAuditRecordList.length"
          >
            <el-step
              v-for="rs in infoData.fsSupplierAuditStatusRespVo.fsSupplierAuditRecordList"
              :key="rs.id"
            >
              <template #icon>
                <img :src="titleShow(rs, rs.flowStatus, 'icon')" alt="" class="step_icon" />
              </template>
              <template #title>
                <div
                  class="step_title"
                  :style="{
                    color: `${titleShow(rs, rs.flowStatus, rs.operateStatus === 2 ? 'ecolor' : 'color')} !important`
                  }"
                >
                  {{ titleShow(rs, rs.flowStatus) }}
                  <span class="step_time">{{ rs?.createdAt || '' }}</span>
                </div>
              </template>
              <template #description>
                <div class="step_desc">
                  <div class="step_user">
                    <img
                      :src="rs?.personRoster?.avatarOrigin || DefaultAvatar"
                      alt=""
                      class="user_icon"
                    />
                    {{ rs?.personRoster?.name || '--' }}
                  </div>
                  <div class="step_remark">{{ rs.remark }}</div>
                  <div class="step_file_list">
                    <div v-for="file in fileGet(rs)" class="file_card">
                      <div class="file_icon">
                        <el-image
                          v-if="getFileType(file, imageTypes) && file.url !== defaultImg"
                          class="img"
                          :src="file.url"
                          :preview-src-list="[file.url]"
                          fit="cover"
                          preview-teleported
                        />
                        <el-image
                          v-else-if="getFileType(file, imageTypes) && file.url === defaultImg"
                          class="img"
                          :src="defaultImg"
                          fit="cover"
                          preview-teleported
                        />
                        <el-image
                          v-else-if="getFileType(file, videoTypes)"
                          class="img"
                          :src="videoIcon"
                          fit="cover"
                          @click="openFile(file.url)"
                        />
                        <el-image
                          v-else
                          class="img"
                          :src="getFileIcon(file)"
                          fit="cover"
                          @click="openFile(file.url)"
                        />
                      </div>
                      <span class="file_name" :title="file.name">{{ file.name }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </el-step>
          </el-steps>
        </el-scrollbar>
      </el-descriptions-item>
    </el-descriptions>
    <el-dialog
      v-model="visible"
      append-to-body
      :show-close="false"
      width="1010"
      style="
        border-radius: 14px;
        transform: none;
        position: static;
        margin-top: var(--el-dialog-margin-top) !important;
      "
      :close-on-click-modal="false"
    >
      <template #header>
        <div class="header">
          <div>规格明细</div>
          <img src="@/assets/imgs/common/close.png" alt="" @click="visible = false" />
        </div>
      </template>
      <div style="width: 100%">
        <el-form label-width="70">
          <el-form-item label="规格名称">
            <el-input v-model="txt" :placeholder="`请输入规格名称`" clearable style="width: 240px;margin-right: 20px;" />
            <el-button @click="txt=''">重置</el-button>
          </el-form-item>
        </el-form>
        <vxe-table
          :header-cell-style="{ color: '#666666', fontWeight: 400, backgroundColor: '#F2F6FC',fontFamily: 'pingFang SC' }"
          :cell-style="{ fontFamily: 'pingFang SC'}"
          style="width: 100%"
          show-overflow
          :max-height="600"
          :data="listData"
          :column-config="{ resizable: true }"
          :virtual-y-config="{ enabled: true, gt: 0 }"
          ref="tableRef"
          border="full"
        >
          <vxe-column type="seq" width="60" align="center" />
          <vxe-column field="productCode" title="货品编码" />
          <vxe-column
            field="color"
            title="规格名称"
            :formatter="(row: any) => `${row?.row?.color || '-'}`"
          />
          <!-- <vxe-column
            field="size"
            title="规格码"
            width="105"
            :formatter="(row: any) => `${row?.row?.size || '-'}`"
          /> -->
          <vxe-column
            field="productCostIncludingTax"
            title="含税裸货价"
            align="right"
            :formatter="
              (row: any) => `${Number(row?.row?.productCostIncludingTax || 0).toFixed(3)} 元`
            "
          />
          <vxe-column
            field="packagingManpower"
            title="包装人工费"
            align="right"
            :formatter="(row: any) => `${Number(row?.row?.packagingManpower || 0).toFixed(3)} 元`"
          />
          <vxe-column field="singleColorOrderQuantity" title="起订量" align="right" />
          <vxe-column
            field="finishedProductCost"
            title="成品价"
            align="right"
            min-width="65"
            :formatter="(row: any) => `${Number(row?.row?.finishedProductCost || 0).toFixed(3)} 元`"
          />
        </vxe-table>
      </div>
    </el-dialog>

    <OrderInfoFilling ref="orderInfoRef" :info="infoData" @success="success"></OrderInfoFilling>
  </div>
</template>

<script lang="ts" setup>
import commonUser from '@/views/OA/factory/components/commonUser.vue'
import CardTitle from '@/views/OA/factory/components/cardTitle.vue'
import fileItem from '@/views/OA/factory/components/fileItem.vue'
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'
import excelSvg from '@/assets/svgs/common/file_excel.svg'
import remarkSvg from '@/assets/svgs/develop/remark.svg'
import failedSvg from '@/assets/svgs/develop/failed.svg'
import docSvg from '@/assets/svgs/common/file_doc.svg'
import pdfSvg from '@/assets/svgs/common/file_pdf.svg'
import pptSvg from '@/assets/svgs/common/file_ppt.svg'
import txtSvg from '@/assets/svgs/common/file_txt.svg'
import defaultImg from '@/assets/svgs/defaultImg.svg'
import videoIcon from '@/assets/svgs/videoIcon.svg'
import overSvg from '@/assets/svgs/develop/over.svg'
import tipSvg from '@/assets/svgs/develop/tips.svg'
import { ElLoading } from 'element-plus'
import request from '@/config/axios'
import OrderInfoFilling from './orderInfoFilling.vue'
import personListPopover from '@/views/OA/factory/components/personListPopover.vue'
import { getIntDictOptions } from '@/utils/dict'

const emits = defineEmits(['success'])

const props = defineProps({
  params: {
    type: Object as any,
    default: () => {}
  },
  infoData: {
    type: Object as any,
    default: () => {}
  }
})

const visible = ref<boolean>(false),
  dataList = ref<any>([]),
  txt = ref<string>('')

const listData = computed(() =>
  dataList.value.filter((ts: any) =>
    (ts?.color || '').toLowerCase().includes((txt.value || '').toLowerCase())
  )
)

const details = () => {
  // const loading: any = ElLoading.service({ fullscreen: true, text: '数据加载中' });
  request
    .get({
      // url: `/workflow-api/api/workflow/business/factorySecondary/supplierInfo/queryWaitQuotePriceList/${props.infoData.fsTaskId}/${props.infoData.supplierId}`
      url: `/workflow-api/api/workflow/business/factorySecondary/supplierInfo/queryQuotePriceAggList/${props.infoData.fsTaskId}/${props.infoData.supplierId}`
    })
    .then((res: any) => {
      dataList.value = res?.length ? res : []
      txt.value = ''
      visible.value = true
    })
  // .finally(() => loading?.close());
}

const titleShow = (item: any, value: string, name: string = 'label') => {
  const status: Array<number> = [1, 8]
  const list: any = [
    {
      label: '试穿结果',
      value: 1,
      color: '#349B34',
      ecolor: '#EB3737',
      icon: item.operateStatus === 1 ? overSvg : failedSvg
    },
    { label: '报价核价', value: 2, color: '#349B34', ecolor: '#349B34', icon: overSvg },
    { label: '已淘汰', value: 3, color: '#EB3737', ecolor: '#EB3737', icon: failedSvg },
    { label: '已淘汰确认', value: 4, color: '#EB3737', ecolor: '#EB3737', icon: failedSvg },
    { label: '备注信息', value: 5, color: '#8C8E90', ecolor: '#8C8E90', icon: remarkSvg },
    { label: '色卡信息', value: 6, color: '#349B34', ecolor: '#349B34', icon: overSvg },
    { label: '供需计划:审批拒绝', value: 7, color: '#EB3737', ecolor: '#EB3737', icon: failedSvg },
    {
      label: '面料结果',
      value: 8,
      color: '#349B34',
      ecolor: '#EB3737',
      icon: item.operateStatus === 1 ? overSvg : failedSvg
    },
    { label: '报价核价:撤回', value: 9, color: '#EB3737', ecolor: '#EB3737', icon: failedSvg }
  ]
  const statusLabel: string =
    name === 'label'
      ? status.includes(value as any)
        ? item?.operateStatus === 1
          ? '审核通过'
          : '继续调整'
        : ''
      : ''
  const tar: any = list.find((li: any) => li.value === value)
  return tar ? `${tar[name]}${statusLabel ? `:${statusLabel}` : ''}` : ''
}

const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg']

const videoTypes = ['mp4', 'avi', 'webm', 'mkv', 'mov']

const excelTypes = ['xls', 'xlsx', 'xlsm', 'xltm', 'csv']

const ppt‌Types = ['ppt', 'pptx', 'potx']

const getFileType = (file: any, types: Array<string>) => {
  const fileName = file.fileName || file.name
  const type = fileName?.split('.')[1]
  return types.includes(type)
}

const fileGet = (item: any) => {
  return item?.attachmentUrl
    ? item.attachmentUrl.split(',').map((ds: any) => {
        const files: any = ds.split('?name=')
        return { name: files[1].split('&')[0], url: files[0] }
      })
    : []
}

const getFileIcon = (file: any) => {
  const fileName = file.fileName || file.name
  const type = fileName?.split('.')[1]
  if (type === 'pdf') {
    return pdfSvg
  } else if (type === 'txt') {
    return txtSvg
  } else if (excelTypes.includes(type)) {
    return excelSvg
  } else if (ppt‌Types.includes(type)) {
    return pptSvg
  } else {
    return docSvg
  }
}

const openFile = (url: any) => {
  window.open(url, '_blank')
}

const orderInfoRef = ref()
const openOrderInfo = () => {
  orderInfoRef?.value.open()
}

const getRecycleNodes = (nodes: any) => {
  if (!nodes || nodes.length === 0) return '-'
  return nodes
    .map((node: any) => `${node?.nodeName}${node?.subState ? '-' + node?.subState : ''}`)
    .join()
}

const getPersonList = (info: any, key: string) => {
  if (!info || !info?.[key]) return []
  return [
    {
      userId: info.key,
      name: info?.recycleUserName,
      avatarOrigin: info?.recycleUserAvatar
    }
  ]
}

const getDictLabels = (dicts: any, value: string, separator: string = ',') => {
  if (!value) return '-'
  const arr = value.split(separator)
  if (!arr || arr.length === 0) return '-'
  return arr
    .map((item: any) => {
      const tar = dicts.find((dict: any) => dict.value === item)
      return (tar && tar.label) || item
    })
    .join()
}

const success = () => {
  emits('success')
}
</script>

<style lang="scss" scoped>
:deep() {
  .vxe-cell--col-resizable {
    &::before {
      background-color: transparent !important;
    }
  }

  .el-descriptions__label {
    width: 120px !important;
  }
}

.userList {
  padding: 3px;
  display: inline-flex;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.img-tips {
  width: 14px;
  height: 14px;
  position: absolute;
  margin-left: 8px;
  bottom: 2px;
  cursor: pointer;
}

.item-txt {
  position: relative;
  cursor: pointer;
}

.item-comp {
  display: block;
  width: 100%;
}

.infoTable {
  width: 100%;

  .infosDescriptions {
    margin: 20px 0;

    :deep(.el-descriptions__label.is-bordered-label) {
      vertical-align: middle;
      background: #f4f6fa;
      color: #666;
      font-weight: 400;
    }

    --el-descriptions-table-border: 1px solid #e5e5e5;
    --el-descriptions-item-bordered-label-background: #f8f8f9;

    :deep(.el-descriptions__body .el-descriptions__table.is-bordered .el-descriptions__cell) {
      vertical-align: middle;
    }

    .value {
      color: #333;
      font-size: 14px;
    }
  }
}

.details_icon {
  // cursor: pointer;
  // position: absolute;
  // right: 0;
  // top: -10px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;

  img {
    width: 14px;
    cursor: pointer;
  }
}

.custom-steps {
  max-width: 770px;
  // width: 100%;
  padding-left: 140px;
  display: flex;

  :deep() {
    .el-step__line {
      background-color: transparent !important;
    }

    .el-step__line-inner {
      border: 1px dashed #e5e5e5 !important;
      // height: 4px;
      height: 100% !important;
    }
  }
}

.step_time {
  position: absolute;
  margin-left: 10px;
  color: #8c8e90;
  font-size: 12px;
  font-weight: normal;
  left: -175px;
}

.step_icon {
  width: 16px;
  height: 16px;
}

.step_title {
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  position: relative;

  .del_icon {
    width: 14px;
    position: absolute;
    right: 10px;
    top: 2px;
    cursor: pointer;
  }
}

.step_remark {
  display: block;
  margin-bottom: 10px;
  color: #333;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.step_desc {
  width: 100%;
  margin-bottom: 20px;

  .step_user {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 500;
    color: #333;

    .user_icon {
      margin-right: 5px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }
  }

  .step_file_list {
    width: 100%;

    .file_card {
      display: inline-flex;
      width: 100%;
      line-height: 16px;

      .file_icon {
        margin-right: 10px;

        .img {
          width: 64px;
          height: 64px;
          border-radius: 2px;
          box-shadow: 3px 1px 3px 0px rgba(185, 185, 185, 0.43);
          cursor: pointer;
        }
      }

      .file_name {
        cursor: pointer;
        display: inline-block;
        font-size: 14px;
        flex: 1;
        color: #333;
        word-break: break-all;
        align-self: center;
      }
    }
  }
}

.order-info-list {
  margin: 20px 0;
  width: 100%;
  border: 1px solid #e5e5e5;
  box-sizing: border-box;
  .list-header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    background-color: #f4f6fa;
    color: #666666;
    font-weight: 400;
    font-size: 14px;
    .cell {
      padding: 8px 11px;
      line-height: 23px;
      border-right: 1px solid #e5e5e5;
      &:last-child {
        border: 0;
      }
    }
  }
  .list-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    color: #333333;
    font-weight: 400;
    font-size: 14px;
    border-top: 1px solid #e5e5e5;
    .cell {
      padding: 8px 11px;
      line-height: 23px;
      border-right: 1px solid #e5e5e5;
      display: flex;
      align-items: center;
      &:last-child {
        border: 0;
      }
    }
  }
}
</style>
