<template>
  <div>
    <!-- 企划阶段表格 -->
    <el-table
      :data="list"
      class="multi-stage-table"
      :header-cell-style="appStore.headerCellStyle"
      :span-method="tableSpanMethod"
      border
      v-loading="loading"
    >
      <!-- 企划阶段分组 -->
      <el-table-column label="企划阶段" align="center" width="180">
        <el-table-column
          label="企划名称"
          prop="planName"
          width="200"
          align="left"
          header-align="left"
        />
        <el-table-column
          label="企划类型"
          prop="planType"
          width="120"
          align="left"
          header-align="left"
        >
          <template #default="{ row }">
            <div> <PlanType :planType="row.planType" /></div>
          </template>
        </el-table-column>
        <el-table-column label="店铺" prop="store" width="200" align="left" header-align="left">
          <template #default="{ row }">
            <div class="row-center">
              <img
                v-if="row.channel && getImageUrl(row.channel)"
                style="width: 14px; height: 14px; margin-right: 8px"
                :src="getImageUrl(row.channel)"
                alt=""
              />
              <div
                :style="{
                  width: row.channel && getImageUrl(row.channel) ? 'calc(100% - 22px)' : '100%'
                }"
                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
              >
                {{ row.storeName || row.store || '--' }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="产品等级"
          prop="isCore"
          width="120"
          align="left"
          header-align="left"
        />
        <el-table-column
          label="计划下单日期"
          prop="planOrderDate"
          width="120"
          align="left"
          header-align="left"
        >
          <template #default="{ row }">
            {{ row.planOrderDate }}
          </template>
        </el-table-column>
        <el-table-column
          label="计划上架日期"
          prop="planListStartDate"
          width="120"
          align="left"
          header-align="left"
        >
          <template #default="{ row }">
            {{ row.planListDate }}
          </template>
        </el-table-column>
        <el-table-column label="品类" prop="category" width="120" align="left" header-align="left">
          <template #default="{ row }">
            <div class="disableValue">{{ row.completeCategoryName || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="系列"
          prop="classCode"
          width="100"
          align="left"
          header-align="left"
        />
        <el-table-column
          label="类型"
          prop="productType"
          width="80"
          align="left"
          header-align="left"
        >
          <template #default="{ row }">
            {{ row.productType == '0' ? '买手款' : row.productType == '1' ? '定制款' : '--' }}
          </template>
        </el-table-column>
        <el-table-column label="卖点" prop="salePoint" width="150" align="left" header-align="left">
          <template #default="{ row }">
            <el-popover class="box-item" placement="top" :dangerouslyUseHTMLString="true">
              <template #default>
                <div v-html="row.salePoint"></div>
              </template>
              <template #reference>
                <div class="ellipsis-content" v-html="row.salePoint"></div>
              </template>
            </el-popover>
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 打样阶段分组 -->
      <el-table-column label="打样阶段" align="center" width="240">
        <el-table-column
          label="设计师"
          prop="designer"
          width="140"
          align="left"
          header-align="left"
        >
          <template #default="{ row }">
            <el-avatar :src="row.designerAvatar" v-if="row.designerAvatar" class="avatar" />
            <span class="avatar-name">{{ row.designerName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="设计图"
          prop="designImage"
          width="120"
          align="left"
          header-align="left"
        >
          <template #default="{ row }">
            <el-image
              :src="row.productPicture"
              v-if="row.productPicture"
              style="width: 80px; height: 80px; cursor: pointer"
              @click="handlePreview(row.productPicture)"
            />
          </template>
        </el-table-column>
        <el-table-column label="供应链开发" width="200" align="left" header-align="left">
          <template #default="{ row }">
            <div style="display: flex; flex-direction: row; align-items: center">
              <div
                v-for="item in row.chosenSupplierStaffList"
                :key="item.userId"
                style="margin-right: 5px"
              >
                <el-avatar :src="item.avatarOrigin" v-if="item.avatarOrigin" class="avatar" />
                <span class="avatar-name">{{ item.name }}</span>
              </div>

              <el-popover placement="bottom" :width="300" trigger="hover">
                <template #reference>
                  <div class="more-item" v-if="row?.chosenSupplierStaffList?.length > 2"
                    >+{{ row?.chosenSupplierStaffList?.length }}</div
                  >
                </template>
                <template #default>
                  <div class="pop-wapper">
                    <div
                      v-for="item in row.chosenSupplierStaffList"
                      :key="item.userId"
                      style="margin-right: 12px; display: flex; align-items: center"
                    >
                      <el-avatar :src="item.avatarOrigin" v-if="item.avatarOrigin" class="avatar" />
                      <span class="avatar-name">{{ item.name }}</span>
                    </div>
                  </div>
                </template>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="打样进度"
          prop="sampleProgress"
          width="220"
          align="left"
          header-align="left"
        >
          <template #default="{ row }">
            <div class="" v-if="row.lastSupplierAuditRecord">
              <!-- <span class="tag-btn" v-if="row.designPictureId" @click="handleProofingProgress(row)"
                >查看进度</span
              > -->
              <div class="record" >
                <div>
                  <!-- <span>{{ index+1 }}:</span> -->
                  {{ row.lastSupplierAuditRecord.supplierName }}:
                  <span v-if="row.lastSupplierAuditRecord">{{ stepInfoTitle(row.lastSupplierAuditRecord?.supplierAuditRecord) }}</span>
                </div>
                <div v-if="row.lastSupplierAuditRecord">{{ row.lastSupplierAuditRecord?.supplierAuditRecord?.remark }}</div>
                <div v-if="row.lastSupplierAuditRecord">
                  <div v-for="(imgItem, imgIndex) in formatImg(row.lastSupplierAuditRecord?.supplierAuditRecord?.attachmentUrl)" :key="imgIndex">
                    <el-image :src="imgItem.url" class="notice-img" style="width: 64px; height: 64px" :zoom-rate="1.2"
                      :max-scale="7" :min-scale="0.2" :preview-src-list="formatImg(row.lastSupplierAuditRecord?.supplierAuditRecord?.attachmentUrl).map((img) => img.url)"
                      show-progress :initial-index="imgIndex" fit="cover" preview-teleported/>
                  </div>
                  <div v-for="(fileItem, fileIndex) in formatFile(row.lastSupplierAuditRecord?.supplierAuditRecord?.attachmentUrl)" :key="fileIndex" style="width: 100%">
                    <div class="row-center" style="margin-bottom: 8px" @click="downloadFile(fileItem)">
                      <img style="width: 14px; height: 17px" :src="getFileIcon(fileItem.url)" />
                      <div class="text1 fileName" style="
                        font-size: 12px;
                        padding-left: 4px;
                        padding-right: 0px;
                        width: 200px;
                        cursor: pointer;
                      ">{{ fileItem.name }}</div>
                    </div>
                  </div>
                </div>
                <div v-if="row.lastSupplierAuditRecord">{{ row.lastSupplierAuditRecord?.supplierAuditRecord?.updatedAt }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="选品理由"
          prop="selectionReason"
          width="120"
          align="left"
          header-align="left"
        >
          <template #default="{ row }">
            {{ row.chooseReason || '' }}
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 产品阶段分组 -->
      <el-table-column label="产品阶段" align="center" width="320">
        <el-table-column
          label="当前节点"
          prop="currentNodeName"
          width="130"
          align="left"
          header-align="left"
        />

        <el-table-column
          label="货品编码"
          prop="productCode"
          width="100"
          align="left"
          header-align="left"
        />
        <el-table-column
          label="供应商"
          prop="supplier"
          width="130"
          align="left"
          header-align="left"
        >
          <template #default="{ row }">
            {{ row.supplierName }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="实物报价" prop="quotePrice" width="100" align="center">
          <template #default="{ row }">
            <span v-if="row.physicalQuotePrice">{{ row.physicalQuotePrice }}/件</span>
          </template>
        </el-table-column> -->
        <el-table-column
          label="裸货价"
          prop="productCostExcludingTax"
          width="100"
          align="right"
          header-align="right"
        >
          <template #default="{ row }">
            <span v-if="row.productCostExcludingTax">{{ row.productCostExcludingTax }}/元</span>
          </template>
        </el-table-column>
        <el-table-column
          label="包装人工费"
          prop="packagingManpowerNew"
          width="100"
          align="right"
          header-align="right"
        >
          <template #default="{ row }">
            <span v-if="row.packagingManpowerNew">{{ row.packagingManpowerNew }}/元</span>
          </template>
        </el-table-column>
        <el-table-column
          label="成品价"
          prop="finishedProductPrice"
          width="100"
          align="right"
          header-align="right"
        >
          <template #default="{ row }">
            <span v-if="row.finishedProductPrice">{{ row.finishedProductPrice }}/件</span>
          </template>
        </el-table-column>
        <el-table-column
          label="齐色样"
          prop="goodsCode"
          width="120"
          align="left"
          header-align="left"
        >
          <template #default="{ row }">
            <el-image
              :src="row.samplePicture"
              v-if="row.samplePicture"
              style="width: 80px; height: 80px; cursor: pointer"
              @click="handlePreview(row.samplePicture)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="运营负责人"
          prop="goodsCode"
          width="140"
          align="left"
          header-align="left"
        >
          <template #default="{ row }">
            <div
              v-if="Array.isArray(row.operateManagerList) && row.operateManagerList.length"
              style="display: flex; flex-direction: column; align-items: flex-start"
            >
              <div
                v-for="(item, idx) in row.operateManagerList"
                :key="idx"
                style="display: flex; align-items: center"
                :style="{ marginTop: idx > 0 ? '4px' : '' }"
              >
                <el-avatar :src="item.avatarOrigin || DefaultAvatar" class="avatar" />
                <span class="avatar-name">{{ item.name || '-' }}</span>
              </div>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          label="面料成分/补充"
          prop="component"
          width="150"
          align="left"
          header-align="left"
        />
        <el-table-column label="售价" prop="price" width="100" align="right" header-align="right" />
        <el-table-column
          label="产前样进度"
          prop="goodsCode"
          width="100"
          align="left"
          header-align="left"
        >
          <template #default="{ row }">
            <div v-for="item in row?.npPrenatalSampleInfoList" :key="item.id">
              <span>颜色：{{ item.color }}</span>
              <span>尺码：{{ item.size }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="采购负责人"
          prop="goodsCode"
          width="140"
          align="left"
          header-align="left"
        >
          <template #default="{ row }">
            <div
              v-if="Array.isArray(row.procurementManagerList) && row.procurementManagerList.length"
              style="display: flex; flex-direction: column; align-items: flex-start"
            >
              <div
                v-for="(item, idx) in row.procurementManagerList"
                :key="idx"
                style="display: flex; align-items: center"
                :style="{ marginTop: idx > 0 ? '4px' : '' }"
              >
                <el-avatar :src="item.avatarOrigin || DefaultAvatar" class="avatar" />
                <span class="avatar-name">{{ item.name || '-' }}</span>
              </div>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column width="120" fixed="right" align="center">
        <template #header>
          <div class="header-empty">
            <div class="empty"></div>
            <div class="desc">产品详情</div>
          </div>
        </template>
        <template #default="{ row }">
          <el-button type="primary" @click="handleSelect(row)"> 跳转 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 图片预览弹窗 -->
    <el-dialog v-model="dialogVisible">
      <el-image :src="previewImage" fit="contain" :preview-src-list="[previewImage]" />
    </el-dialog>

    <!-- 打样进度弹出框 -->
    <DayangProgressDialogNew ref="dayangProgresDialogNewVisible" @confirm="handleConfirm" />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { getImageUrl } from '@/utils'
import PlanType from '@/views/OA/new/components/planType.vue'
import DayangProgressDialogNew from '@/views/OA/new/designGallery/components/dayangProgressDialogNew.vue'
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'
import { useCategoryList } from '@/views/OA/new/product/hooks'
import type { ElTableColumn } from 'element-plus'
import { stepInfoTitle ,formatImg,formatFile,downloadFile,getFileIcon } from '@/views/OA/new/designGallery/components/utils'
const appStore = useAppStore()
const router = useRouter()

const { categoryList, initSelectData } = useCategoryList()

const props = defineProps<{
  list: any[],
  loading: boolean
}>()

const emit = defineEmits(['refresh'])
// 刷新数据
const handleConfirm = () => {
  emit('refresh')
}
const dayangProgresDialogNewVisible = ref()
const handleProofingProgress = (row) => {
  // 打开打样进度详情弹窗
  console.log('打开打样进度详情弹窗', row.productNumber)
  dayangProgresDialogNewVisible.value.open({
    ...row,
    fromProgress: row.designPictureId
  })
}

const formatCategory = (category) => {
  if (!category) return ''
  const result = categoryList.value.find((item) => item.code == category)
  return result ? result.name : ''
}

const mergeFields = [
  'planName',
  'planType',
  'store',
  'isCore',
  'planOrderDate',
  'planListStartDate'
]

// 合并单元格方法
const tableSpanMethod = ({ row, column, rowIndex }) => {
  // 只处理需要合并的字段
  if (mergeFields.includes(column.property)) {
    const planName = row.planName
    let rowspan = 1
    // 统计后续连续相同企划名称的行数
    for (let i = rowIndex + 1; i < props.list.length; i++) {
      if (props.list[i].planName === planName) {
        rowspan++
      } else {
        break
      }
    }
    // 如果前面有相同企划名称，则本行不显示
    if (rowIndex > 0 && props.list[rowIndex - 1].planName === planName) {
      return { rowspan: 0, colspan: 1 }
    }
    return { rowspan, colspan: 1 }
  }
  // 其他字段不合并
  return { rowspan: 1, colspan: 1 }
}

// 控制图片预览弹窗
const dialogVisible = ref(false)
const previewImage = ref('')

// 图片预览处理函数
const handlePreview = (url: string) => {
  console.log(url)
  dialogVisible.value = true
  previewImage.value = url
}

// 选转处理函数
const handleSelect = (row) => {
  const data = row
  if (data.productNumber) {
    //  1.productNumber字段有值再根据chooseStatus字段判断,如果chooseStatus = 2 跳产品计划列表,否则跳设计图列表
    // 2.如果productNumber没有值,看planCode有没有值,有值就跳开发任务列表,没值就根据企划名称跳企划列表
    if (data.chooseStatus == 2) {
      router.push({
        name: 'Product',
        query: {
          productNumber: data.productNumber
        }
      })
    } else {
      router.push({
        name: 'DesignGallery',
        query: {
          productNumber: data.productNumber
        }
      })
    }
  } else if (data.planCode) {
    router.push({
      name: 'Develop',
      query: {
        planCode: data.planCode
      }
    })
  } else {
    router.push({
      name: 'Plan',
      query: {
        planName: data.planName
      }
    })
  }
}

onMounted(() => {
  initSelectData()
})
</script>

<style scoped lang="scss">
.header-class {
  background-color: #f5f7fa;
}

.multi-stage-table {
  .el-table__body-wrapper {
    .cell {
      padding: 4px 8px;
    }
  }
}

.ellipsis-content {
  //最多展示两行
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  line-height: 1.5;
  max-height: 3em; /* 两行高度 */
  word-break: break-word;
}

.avatar {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  vertical-align: middle;
}
.avatar-name {
  font-size: 14px;
  color: #3d3d3d;
}

.el-tag {
  margin-right: 4px;
}
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.tag {
  font-size: 14px;
  color: #333333;
}
.tag-btn {
  font-size: 14px;
  margin-left: 8px;
  cursor: pointer;
  color: #0064ff;
}
.box-item {
  background: white;
}
.header-empty {
  .empty {
    width: 100%;
    height: 30px;
    // border-bottom: 1px solid #dbe3f5;
  }
  .desc {
    width: 100%;
    text-align: center;
    line-height: 23px;
    margin-top: 10px;
  }
}

// :deep(.el-table td.el-table__cell) {
//   border-bottom: 1px solid #dbe3f5;
// }
// :deep(.el-table--border .el-table__cell) {
//   border-right: 1px solid #dbe3f5;
// }
:deep(.el-table) {
  // border: 1px solid #dbe3f5;
  // border-bottom: none;
  --el-table-border: 1px solid #e5e5e5;
}
:deep(.el-table--border th.el-table__cell) {
  // border-bottom: 1px solid #dbe3f5;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.more-item {
  width: 20px;
  height: 20px;
  background: #f0f0f0;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  color: #666666;
  cursor: pointer;
  border-radius: 2px;
}
.pop-wapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  box-sizing: border-box;
  // border-top: 1px solid #e5e5e5;
  // border-bottom: 1px solid #e5e5e5;
}
.fileName {
  color: #333333;
}

.fileName:hover {
  color: #0064ff;
}
</style>
