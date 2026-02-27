<template>
  <div class="primary-card flex">
    <el-popover
      placement="right"
      :width="348"
      trigger="hover"
      :show-arrow="false"
      :offset="20"
      :teleported="false"
    >
      <template #reference>
        <el-image
          class="w-158px h-158px"
          :src="item.goodsImage || getImgUrlById(item.goodsId)"
          fit="fill"
        />
      </template>
      <GoodCard
        :good="{
          materialName: item.goodsName,
          materialId: item.goodsId,
          channel: item.channel || getChannelByStore(item.store || '')
        }"
      />
    </el-popover>
    <div class="desc flex-1 w-0 flex flex-col">
      <div class="desc-title flex items-center bg-[#F4F8FF] p-10px">
        <el-image
          class="w-22px h-22px"
          :src="getStoreIcon(item.store || 'swTaobao')"
          fit="contain"
        />
        <h3
          :title="item.goodsName"
          class="ml-10px flex-1 min-w-0 text-#333 text-16px font-500 whitespace-nowrap overflow-hidden text-ellipsis"
          >{{ item.goodsName }}</h3
        >
      </div>
      <ul
        class="desc-list grid grid-cols-[1.2fr_1fr_116px] gap-x-10px p-[10px_6px_0_6px] flex-1 content-between"
      >
        <li class="desc-list-item" v-for="field in displayList" :key="field.key">
          <div class="desc-list-item-name text-#666 font-14px whitespace-nowrap">{{
            field.name
          }}</div>
          <div
            v-if="
              field.key !== 'yesterdaySalesChange' &&
              field.key !== 'goodsId' &&
              field.key !== 'goodsCode' &&
              field.key !== 'salesRank'
            "
            class="desc-list-item-value text-#333 font-14px mt-6px font-500 whitespace-nowrap"
          >
            {{ field.value }}
          </div>
          <div
            v-else-if="field.key === 'yesterdaySalesChange'"
            class="desc-list-item-value font-14px mt-6px font-500 flex items-center"
            :class="getChangeColorClass(field.value)"
          >
            <span>{{ field.value }}</span>
            <img
              v-if="parseChangeValue(field.value) !== 0 && parseChangeValue(field.value) !== null"
              class="w-14px h-14px ml-4px"
              :src="(parseChangeValue(field.value) || 0) > 0 ? upSvg : downSvg"
              alt=""
            />
          </div>
          <div
            v-else-if="field.key === 'goodsId'"
            class="desc-list-item-value text-#333 font-14px mt-6px font-500 flex items-center"
          >
            <el-tooltip :content="String(field.value)" placement="top" :teleported="false">
              <span
                ref="goodsIdRef"
                class="whitespace-nowrap overflow-hidden text-ellipsis inline-block max-w-114px"
              >
                {{ field.value }}
              </span>
            </el-tooltip>
            <img
              :src="copySvg"
              class="w-12px h-12px ml-6px cursor-pointer"
              alt="copy"
              @click="copyText(String(field.value))"
            />
          </div>
          <div
            v-else-if="field.key === 'goodsCode'"
            class="desc-list-item-value text-#333 font-14px mt-6px font-500 flex items-center"
          >
            <el-tooltip :content="String(field.value)" placement="top" :teleported="false">
              <span
                class="whitespace-nowrap overflow-hidden text-ellipsis inline-block max-w-114px"
              >
                {{ field.value }}
              </span>
            </el-tooltip>
            <!-- <img
              :src="copySvg"
              class="w-12px h-12px ml-6px cursor-pointer"
              alt="copy"
              @click="copyText(String(field.value))"
            /> -->
          </div>
          <div v-else-if="field.key === 'salesRank'" class="desc-list-item-value mt-4px">
            <div
              v-if="field.value"
              class="w-57px h-24px rounded-[2px] flex items-center justify-center font-500"
              :style="getGradeStyle(String(field.value))"
            >
              {{ field.value }}
            </div>
            <div v-else class="h-24px"> - </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import GoodCard from '@/components/common/goods/goodCard.vue'
import { getImgUrlById, getStoreIcon, getChannelByStore } from '@/utils/index'
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import upSvg from '@/assets/svgs/monitor/up.svg'
import downSvg from '@/assets/svgs/monitor/down.svg'
import copySvg from '@/assets/svgs/visualCenter/copy.svg'
import { copyText } from '@/utils/copyText'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isNew: {
    type: Boolean,
    default: false
  }
})

const displayList = computed(() => [
  {
    name: '货品编码',
    value: props.item?.goodsCode ?? '-',
    key: 'goodsCode'
  },
  {
    name: '上架时间',
    value: formatDate(props.item?.groundingTime),
    key: 'groundingTime'
  },
  {
    name: '昨日销量较前日',
    value: props.item?.yesterdaySalesChange ?? '0',
    key: 'yesterdaySalesChange'
  },
  {
    name: '商品ID',
    value: props.item?.goodsId ?? '-',
    key: 'goodsId'
  },
  {
    name: props.isNew ? '月销量' : '总销量',
    value: props.item?.totalSales ?? '-',
    key: 'totalSales'
  },
  {
    name: '等级',
    value: props.item?.salesRank,
    key: 'salesRank'
  }
])

const goodsIdRef = ref<HTMLElement | null>(null)

function parseChangeValue(value: unknown): number | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return isNaN(value) ? null : value
  const num = parseFloat(String(value))
  return isNaN(num) ? null : num
}

function getChangeColorClass(value: unknown): string {
  const num = parseChangeValue(value)
  if (num === null || num === 0) return 'text-#333'
  return num > 0 ? 'text-#EA0000' : 'text-#349B34'
}

function formatDate(value: unknown): string {
  if (!value) return '-'
  const d = dayjs(value as any)
  return d.isValid() ? d.format('YYYY-MM-DD') : '-'
}

function getGradeStyle(value: string) {
  const val = (value || '').toString().toUpperCase().trim()
  switch (val) {
    case 'A':
      return { color: '#20C25F', backgroundColor: 'rgba(32, 194, 95, 0.1)' }
    case 'S':
      return { color: '#0064FF', backgroundColor: 'rgba(0, 100, 255, 0.1)' }
    case 'S+':
      return { color: '#9737EB', backgroundColor: 'rgba(151, 55, 235, 0.1)' }
    case 'SS+':
      return { color: '#FF9221', backgroundColor: 'rgba(255, 146, 33, 0.1)' }
    case 'SSS+':
      return { color: '#EA0000', backgroundColor: 'rgba(234, 0, 0, 0.1)' }
    default:
      return { color: '#20C25F', backgroundColor: 'rgba(32, 194, 95, 0.1)' }
  }
}
</script>
<style scoped lang="scss">
.primary-card {
  padding: 10px;
  height: 100%;
}
</style>
