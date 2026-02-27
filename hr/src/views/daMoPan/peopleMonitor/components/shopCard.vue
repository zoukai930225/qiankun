<template>
  <div class="row-center box" :style="boxWidth">
    <el-popover placement="right" :width="348" trigger="hover" :show-arrow="false" :offset="20"
      :disabled="!row.goodsId">
      <template #reference>
        <el-image class="goods-image" :src="row.goodsImg || getImgUrlById(row.goodsId)" fit="fill"
          v-if="row.goodsImg || row.goodsId">
          <template #error>
            <div class="image-slot">
              <el-icon :size="80">
                <Picture />
              </el-icon>
            </div>
          </template>
        </el-image>
        <el-avatar shape="square" :size="120" icon="Picture" v-else
          style="cursor: pointer;background-color: #E5E5E5;" />
      </template>
      <GoodCard :good="{
        materialName: row.goodsName,
        materialId: row.goodsId,
        channel: row.channel
      }" />
    </el-popover>
    <div class="info-box" :style="infoBoxWidth">
      <div class="row-center info-box-title">
        <img v-if="getImageUrl(row.channel)" class="channel-img" :src="getImageUrl(row.channel)" object-fit="contain" />
        <el-tooltip effect="dark" :content="row.goodsName" placement="top-start" :disabled="goodsDiabled">
          <div class="text1 title" :style="goodsWidth">
            {{ row.goodsName }}
          </div>
        </el-tooltip>
      </div>
      <div class="info-box-sub-title row-center mt15px">
        <div class="store">店铺</div>
        <div class="code row-center" :style="secondWidth">{{ second.name }}<el-icon v-if="second.copy" :size="14"
            color="#666666" style="cursor: pointer;" class="ml5px" @click="copy(row[second.key])">
            <DocumentCopy />
          </el-icon></div>
        <div class="code ml10px row-center" :style="threeWidth" v-if="props.showThree">{{ three.name }}<el-icon
            v-if="three.copy" :size="14" color="#666666" style="cursor: pointer;" class="ml5px"
            @click="copy(row[three.key])">
            <DocumentCopy />
          </el-icon></div>
      </div>
      <div class="info-box-sub-info row-center mt5px">
        <el-tooltip effect="dark" :content="row.storeName" placement="top-start" :disabled="row.storeName?.length < 24">
          <div class="store text1">{{ row.storeName }}</div>
        </el-tooltip>
        <el-tooltip effect="dark" :content="row[second.key]" placement="top-start" :disabled="disabledSecondTooltip">
          <div class="code text1" :style="secondWidth">{{ row[second.key] }}</div>
        </el-tooltip>
        <el-tooltip effect="dark" :content="row[three.key]" placement="top-start" :disabled="disabledThreeTooltip"
          v-if="props.showThree">
          <div class="code text1 ml10px" :style="threeWidth">{{ row[three.key] || '-' }}</div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import GoodCard from '@/components/common/goods/goodCard.vue'
import { getImgUrlById, getImageUrl } from '@/utils/index'
import { copyText } from '@/utils/copyText'
const props = defineProps({
  row: {
    type: Object as PropType<any>,
    requried: true
  },
  second: {
    type: Object as PropType<any>,
    default: () => ({
      name: '编码',
      width: 68,
      key: 'goodsCode',
      copy: false
    })
  },
  //显示第三点
  showThree: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  three: {
    type: Object as PropType<any>,
    default: () => ({
      name: '编码',
      width: 68,
      key: 'goodsCode',
      copy: false
    })
  },
})
const message = useMessage()
const disabledThreeTooltip = computed(() => {
  return getLength(props.row[props.three.key] || '') <= props.three.width
})

const threeWidth = computed(() => {
  return 'width:' + props.three.width + 'px'
})

const disabledSecondTooltip = computed(() => {
  return getLength(props.row[props.second.key] || '') <= props.second.width
})

const goodsWidth = computed(() => {
  return `max-width:${(193 + props.second.width + (props.showThree ? (props.three.width + 10) : 0)) - 10}px`
})
const goodsDiabled = computed(() => {
  return getLength(props.row.goodsName || '') <= (193 + props.second.width + (props.showThree ? (props.three.width + 10) : 0))
})
const secondWidth = computed(() => {
  return 'width:' + props.second.width + 'px'
})

const infoBoxWidth = computed(() => {
  return !props.showThree ? 'width:' + (props.second.width + 223) + 'px' :
    'width:' + (props.second.width + 223 + props.three.width + 10) + 'px'
})

const boxWidth = computed(() => {
  return !props.showThree ? 'width:' + (props.second.width + 345) + 'px' :
    'width:' + (props.second.width + 345 + props.three.width + 10) + 'px'
})

const copy = async (text: string) => {
  await copyText(text)
  message.success('复制成功')
}

function getLength(str: string, size = 15) {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i].charCodeAt(0) > 255) {//字符编码大于255，说明是双字节字符
      length += 2;
    } else {
      length = length + 1.2;
    }
  }
  return length * (size / 2);
}
</script>
<style lang="scss" scoped>
.box {
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  width: 425px;
  height: 122px;
}

.goods-image {
  width: 120px;
  height: 120px;
  cursor: pointer;
  border-radius: 4px 0px 0px 4px;
}

.info-box {
  height: 120px;
  width: 305px;

  &-title {
    height: 42px;
    border-bottom: 1px solid #E8E8E8;
    padding-right: 5px;
  }

  &-sub-title {
    text-align: left;
    font-size: 14px;
    color: #666666;
  }

  &-sub-info {
    text-align: left;
    font-size: 14px;
    color: #333333;
  }

  .store {
    width: 185px;
    margin-right: 8px;
    margin-left: 10px;
  }

  .code {
    width: 68px;
  }

}

.channel-img {
  width: 22px;
  margin: 0 10px;
}

.title-line {
  max-width: 286px;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
}
</style>