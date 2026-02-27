<!--
 * @Date: 2024-08-04 15:44:28
 基本信息查看
-->
<template>
  <div class="base-wapper">
    <div class="item">
      <div class="item-title">平台</div>
      <div class="item-content">{{ getStoreByValue(detail?.store) || detail?.store }}</div>
    </div>
    <div class="item">
      <div class="item-title">品类</div>
      <div class="item-content">{{ getCategoryByValue(detail?.category) || detail?.category }}</div>
    </div>
    <div class="item">
      <div class="item-title">需求类型</div>
      <div class="item-content">{{
        `${`${formatOneType(detail?.demandType)}/${formarTwoType(detail?.demandType, detail?.secondDemandType)}`}`
      }}</div>
    </div>
    <div class="item">
      <div class="item-title">编码</div>
      <div class="item-content">{{ detail?.goodsCode }}</div>
    </div>
    <div class="item" v-if="!isTemporary">
      <div class="item-title">产品定位</div>
      <div class="item-content">
        {{ goodsPositions[detail?.goodsPosition] || detail?.goodsPosition }}</div
      >
    </div>
    <div class="item">
      <div class="item-title">交付时间</div>
      <div class="item-content">{{ detail?.deliveryTime || '' }}</div>
    </div>
    <div class="item">
      <div class="item-title">渠道</div>
      <div class="item-content">{{ formatChannel(detail?.channel) || '' }}</div>
    </div>
    <div class="item" v-if="isTemporary">
      <div class="item-title">紧急程度</div>
      <div class="item-content">{{ formatUrgencyLevel(detail?.urgencyLevel) || '' }}</div>
    </div>
    <div class="item" v-if="!isTemporary">
      <div class="item-title">样品</div>
      <div class="item-content">{{ detail?.sample || '' }}</div>
    </div>
    <div class="item" v-if="!isTemporary">
      <div class="item-title">到货</div>
      <div class="item-content">{{
        detail?.arrivalState == 1 ? '已到货' : detail?.arrivalState == 0 ? '未到货' : ''
      }}</div>
    </div>
    <!-- 创建人 -->
    <div class="item">
      <div class="item-title">创建人</div>
      <div class="item-content"
        ><img v-if="detail?.createdAvatar" :src="detail?.createdAvatar" alt="" class="avatar" />
        <span>{{ detail?.createdRealname || '' }}</span></div
      >
    </div>
    <div class="item">
      <div class="item-title">创建时间</div>
      <div class="item-content">
        <span>{{ formatTime(detail?.createdAt, 'yyyy-MM-dd HH:mm:ss') || '' }}</span></div
      >
    </div>

    <div class="item item-row">
      <div class="item-title"> {{ isTemporary ? '调整说明' : '其他说明' }}</div>
      <div class="item-content content-value">{{
        isTemporary ? detail?.demandRemark : detail?.remark
      }}</div>
    </div>

    <div class="item">
      <div class="item-title">产品图</div>
      <div class="pre-img-wapper">
        <el-image
          style="width: 100px; height: 100px; margin-right: 10px; margin-bottom: 10px"
          :src="item"
          fit="cover"
          v-for="(item, index) in formatImg()"
          :key="index"
          class="img-item"
          :preview-src-list="formatImg()"
        />
      </div>
    </div>
    <div class="item item-row">
      <div class="item-title">{{ formatFileName() }}</div>
      <!-- 文件 -->
      <div class="item-wapper file-wapper">
        <div
          class="item file-item"
          v-for="(item, index) in formatFile()"
          :key="index"
          @click="download(item)"
          ><img src="@/assets/imgs/team/file-other-type.png" alt="" class="type-icon" />
          <span class="item-desc file-link">{{ item.fileName }}</span></div
        >
      </div>
      <!-- 图片 -->
      <div class="item-wapper file-img-wapper">
        <div class="file-img-item" v-for="(item, index) in formatImgFromFile()" :key="index"
          ><el-image
            style="width: 100px; height: 100px; margin-right: 10px; margin-bottom: 10px"
            :src="item.ossPath"
            class="type-icon fileImg"
            :preview-src-list="formatImgFromFilePre()"
            fit="cover"
          />
        </div>
      </div>
      <!-- 路径 -->
      <div class="item-title">路径</div>
      <div class="lujing-wapper">
        <div class="lujing" v-for="ite in formatPath()" :key="ite.url">
          <img src="@/assets/imgs/team/lianjie.png" alt="" class="icon-img" />
          <span class="file-link" @click="openWindowByUrl(ite.url)">{{ ite.url }}</span>
          <span class="sub-title">备注：</span>
          <span>{{ ite.urlRemarks }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'BaseInfo' })
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { downloadByUrl } from '@/utils/download'
import { formatTime } from '@/utils/index'
import { getCategoryByValue, goodsPositions, ImageType, openWindowByUrl } from './common'

const props = defineProps({
  detail: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

// 是否是临时需求
const isTemporary = computed(() => {
  return props.detail?.demandType == 'temporary'
})

const formatFileName = () => {
  const name = formatOneType(props.detail?.demandType)
  switch (name) {
    case '新品需求':
      return '核心卖点'
    case '优化需求':
      return '优化方向'
    default:
      return '参考图(附件)'
  }
}

// 平台
const getStoreByValue = (key) => {
  const arr = getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_STORE)
  for (const item of arr) {
    if (item.code === key) {
      return item.label
    }
  }
}

const formatUrgencyLevel = (value) => {
  switch (value) {
    case '0':
      return '紧急'
    case '1':
      return '一般'
    default:
      return ''
  }
}

// 通过一级需求类型寻找二级类型
const formarTwoType = (oneStr, twoStr) => {
  const arr = getIntDictOptions(oneStr, true)
  if (twoStr == 'ALL') return ''
  const item = arr.filter((ite) => ite.value == twoStr)
  return item[0]?.label
}

const formatOneType = (value) => {
  const typeMap = {
    newProduct: '新品需求',
    optimization: '优化需求',
    temporary: '临时需求',
    internal: '内部需求'
  }
  return typeMap[value] || value
}

const formatChannel = (value) => {
  const mapChannel = {
    0: '定制款',
    1: '渠道款',
    2: '无'
  }
  return mapChannel[value]
}

const download = (item) => {
  downloadByUrl(item.ossPath, item.fileName)
}

const formatImg = () => {
  const arr = (props.detail?.goodsImage || '').split(',')
  const imgs = arr.map((item) => {
    return item.split(';')[0]
  })
  return imgs
}

// 附件提取文件
const formatFile = () => {
  return props.detail?.annexes.filter((item) => {
    if (item.type == 0 && !ImageType.includes(item.fileType)) {
      return item
    }
  })
}

//  格式化路径
const formatPath = () => {
  return props.detail?.annexes.filter((item) => {
    if (item.type == 1) {
      return item
    }
  })
}

// 附件提取图片
const formatImgFromFile = () => {
  return props.detail?.annexes.filter((item) => {
    if (item.type == 0 && ImageType.includes(item.fileType)) {
      return item
    }
  })
}

const formatImgFromFilePre = () => {
  const arr = formatImgFromFile()
  return arr.map((item) => item.ossPath)
}
</script>

<style scoped lang="scss">
.base-wapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .item {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    margin-bottom: 17px;

    .item-title {
      font-size: 12px;
      color: #666666;
      line-height: 20px;
      margin-bottom: 5px;
    }
    .item-content {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      width: 203px;
      font-weight: bold;
      display: flex;
      flex-direction: row;
      .avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 5px;
      }
    }
  }
  .item:last-child {
    margin-bottom: 0;
  }
  .item-row {
    width: 100%;
    .content-value {
      width: 100%;
      min-height: 90px;
      background: #f6f6f6;
      border-radius: 4px;
      padding: 17px 5px;
      box-sizing: border-box;
    }
    .item-wapper {
      .item {
        display: flex;
        flex-direction: row;
        align-items: center;
        .type-icon {
          width: 17px;
          height: 19px;
          margin-right: 10px;
        }

        .fileImg {
          width: 100px;
          height: 100px;
          border-radius: 10px;
        }
        .item-desc {
          font-size: 12px;
          color: #666666;
        }
        .file-link {
          width: 120px;
          color: #0064ff;
          cursor: pointer;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: 1; /* 最多显示两行 */
        }
      }
    }
  }
}

.file-img-wapper {
  display: flex;
  flex-direction: row;
  .file-img-item {
    margin-right: 10px;
    width: 100px;
    height: 100px;
  }
}

.pre-img-wapper {
  width: 100%;
  display: flex;
  flex-direction: row;
}
.file-wapper {
  display: flex;
  flex-direction: row;
  .file-item {
    margin-right: 20px;
    margin-bottom: 10px;
  }
}

.lujing-wapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: #333;
  line-height: 20px;
  font-weight: bold;
  .icon-img {
    width: 12px;
    height: 12px;
    margin-right: 12px;
  }
  .lujing {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 16px;
  }
  .file-link {
    color: #0064ff;
    cursor: pointer;
    margin-right: 10px;
  }
}
</style>
