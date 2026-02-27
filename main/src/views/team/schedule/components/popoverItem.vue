<!--
 * @Date: 2024-08-05 18:08:34
 hover 任务状态查看
-->
<template>
  <div class="popoverWapper">
    <div class="popoverHeader" :class="{ cusBg: cusTitle == '进行中' }"
      ><span :class="{ susColor: cusTitle == '进行中' }">{{ cusTitle }}</span>
      <span class="more" @click="jumpDetail">
        <span :class="{ susColor: cusTitle == '进行中' }">查看详情</span
        ><img src="@/assets/imgs/team/yiwanchengmore.png" class="moreIcon" alt="" /></span
    ></div>
    <div class="popoverContent">
      <div class="tab-change" v-if="isSubFlag">
        <SWtabsReview
          v-model:modelValue="currentSubType"
          @handle-change="handleChange"
          :isThreeSubNode="isThreeSubNode"
        />
      </div>
      <!-- 多节点类型 -->
      <div class="item" v-if="isSubFlag && currentType != -1">
        <div class="itemLeft"
          ><img src="@/assets/imgs/team/people-icon.png" class="peopleIcon" alt="" /><div
            class="key"
            >操作类型</div
          ></div
        >
        <div class="right-wapper">
          <div class="change-wapper">
            <div v-for="(item, index) in typeList" :key="item.value">
              <div class="item" @click="typaChange(index)" v-if="currentType == index"
                ><img class="btn-icon" v-if="currentType != index" :src="item.img" /><img
                  class="btn-icon"
                  v-if="currentType == index"
                  :src="item.img"
                />
                <span class="btn-text">{{ item.label }}</span></div
              >
            </div>
          </div>
        </div>
      </div>
      <!-- 暂无数据 -->
      <div class="empty-wapper" v-if="isSubFlag && currentType == -1">
        <img src="@/assets/imgs/team/empty-img.png" class="empty-img" />
        <span class="empty-desc">暂无数据</span>
      </div>

      <!-- 跳过 -->
      <div v-if="currentType == 0 && isSubFlag && isSkip" class="empty-wapper">
        <img src="@/assets/imgs/team/empty-img.png" class="empty-img" />
        <span class="empty-desc">跳过</span>
      </div>

      <!-- 指派 -->
      <div v-if="(assignmentItem && !isSkip && currentType != -1) || !isSubFlag">
        <div class="item" v-if="formatAvtor(1)?.length">
          <div class="itemLeft"
            ><img src="@/assets/imgs/team/people-icon.png" class="peopleIcon" alt="" /><div
              class="key"
              >人员</div
            ></div
          >
          <div class="right-wapper">
            <div class="itemRight" v-for="(item, index) in formatAvtor(1)" :key="index"
              ><div class="valueItem"
                ><img :src="item.avatarOrigin" class="valueLogo" alt="" />
                <span class="name">{{ item.operatorRealname }}</span>
              </div></div
            >
          </div>
        </div>

        <div class="item" v-if="operatorsDetail?.expectedCompletionTime">
          <div class="itemLeft"
            ><img src="@/assets/imgs/team/shijian.png" class="peopleIcon" alt="" /><div class="key"
              >计划交付时间</div
            ></div
          >
          <div class="itemRight">
            <span class="value">{{ operatorsDetail?.expectedCompletionTime }}</span></div
          >
        </div>
        <div class="item" v-if="formatAvtor(2)?.length">
          <div class="itemLeft"
            ><img src="@/assets/imgs/team/shenhe.png" class="peopleIcon" alt="" /><div class="key"
              >方案审核方</div
            ></div
          >
          <div class="right-wapper">
            <div class="itemRight" v-for="(item, index) in formatAvtor(2)" :key="index"
              ><div class="valueItem"
                ><img :src="item.avatarOrigin" class="valueLogo" alt="" />
                <span>{{ item.operatorRealname }}</span>
              </div></div
            >
          </div>
        </div>
      </div>
      <!-- 上传 -->

      <div
        v-if="
          (!isSubFlag && cusTitle == '已完成') ||
          (isSubFlag && (currentType == 2 || currentType == 1) && uploadItem)
        "
      >
        <div class="item" v-if="submitDetail?.createdAt">
          <div class="itemLeft"
            ><img src="@/assets/imgs/team/shijian.png" class="peopleIcon" alt="" /><div class="key"
              >任务完成时间</div
            ></div
          >
          <div class="itemRight">
            <span class="value">{{
              formatTime(
                submitDetail?.expectedCompletionTime || submitDetail?.createdAt,
                'yyyy-MM-dd'
              ) || ''
            }}</span></div
          >
        </div>

        <div class="item">
          <div class="itemLeft"
            ><img src="@/assets/imgs/team/img-icon.png" class="peopleIcon" alt="" /><div class="key"
              >附件</div
            ></div
          >
          <div class="itemRight fileItemRight">
            <!-- 附件中的图片 -->
            <div class="file-img-wapper" v-if="formatImgFromFileOne()">
              <el-image
                style="width: 100px; height: 100px"
                :src="formatImgFromFileOne()"
                fit="cover"
                class="img-item"
                :preview-src-list="formatImgFromFilePre()"
              />
            </div>

            <!-- 附件中的文件 -->
            <div class="file-text" v-if="formatFile()">
              <div
                v-for="(item, index) in formatFile()"
                :key="index"
                @click="download(item)"
                class="file-type-desc"
                :class="formatFileTypeDesc(item?.fileType)"
              >
                {{ formatFileTypeDesc(item?.fileType) }}
              </div>
            </div>
          </div>
        </div>

        <div class="item" v-if="formatArr()[0]">
          <div class="itemLeft"
            ><img src="@/assets/imgs/team/lujing.png" class="peopleIcon" alt="" /><div class="key"
              >链接</div
            ></div
          >
          <div class="itemRight link-wapper">
            <div class="flex-row" v-for="(ite, index) in formatArr()" :key="index">
              <span class="itemType file-link" @click="openUrl(ite.url)">{{
                ite?.urlRemarks || ite?.url
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="mid"
        v-if="isMyTask() && showbtn()"
        v-hasPermi="['team:optimization:submit']"
      ></div>
    </div>

    <div class="btnWapper" v-hasPermi="['team:optimization:submit']" v-if="isMyTask() && showbtn()">
      <div class="btn" @click="goDetail">
        <img src="@/assets/imgs/team/btnIcon.png" class="btnIcon" alt="" />
        <span class="text">任务提交</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { downloadByUrl } from '@/utils/download'
import { formatTime } from '@/utils/index'
import SWtabsReview from '../baseComponents/SWtabsReview.vue'
import { getSubNodeList, typeList } from '../common.js'
import { ImageType } from './common'
defineOptions({ name: 'PopoverItem' })

const message = useMessage() // 消息弹窗
const userStore = useUserStore()

const subTypeListResult = ref([])

const props = defineProps({
  detail: {
    type: Object,
    default: () => {}
  },
  wapperDetail: {
    type: Object,
    default: () => {}
  },
  node: {
    type: Number,
    default: 1
  },
  subType: {
    //视觉3  平面4  人像0 静物1 视频2
    type: String
  }
})

// 多节点流程
const handleChange = () => {
  subTypeListResult.value = []
  findNodeRecords()
  if (isSkip.value) {
    currentType.value = 0
  } else if (isAssignment.value) {
    currentType.value = 1
  } else if (isUpload.value) {
    currentType.value = 2
  } else {
    currentType.value = -1
  }
}

//先寻找对应的node节点
const findNodeRecords = () => {
  const resultArr = []
  const arr = props?.wapperDetail?.records || []
  arr.forEach((item) => {
    if (item.node == props.node) {
      // @ts-ignore
      resultArr.push(item)
    }
  })
  findSubTypeList(resultArr)
}

const currentSubType = ref() //子任务类型

// 寻找当前子任务二级节点
const findSubTypeList = (nodeList) => {
  nodeList.forEach((item) => {
    // @ts-ignore
    if (item.subNode == currentSubType.value) {
      // @ts-ignore
      subTypeListResult.value.push(item)
    }
  })
}

// 是否是跳过类型
const isSkip = computed(() => {
  // @ts-ignore
  return subTypeListResult.value.some((item) => item.type == 9)
})

// 跳过节点的list
// const skipItem = computed(() => {
//   const arr = []
//   subTypeListResult.value.forEach((item) => {
//     // @ts-ignore
//     if (item.type == 9) {
//       // @ts-ignore
//       arr.push(item)
//     }
//   })
//   return arr || []
// })

// 是否是指派类型
const isAssignment = computed(() => {
  // @ts-ignore
  return subTypeListResult.value.some((item) => item.type == 1)
})

// 指派节点
const assignmentItem = computed(() => {
  const arr = []
  subTypeListResult.value.forEach((item) => {
    // @ts-ignore
    if (item.type == 1) {
      // @ts-ignore
      arr.push(item)
    }
  })
  return arr[arr?.length - 1] || []
})

// 是否是上传类型
const isUpload = computed(() => {
  // @ts-ignore
  return subTypeListResult.value.some((item) => item.type == 2)
})

const uploadItem = computed(() => {
  const arr = []
  subTypeListResult.value.forEach((item) => {
    // @ts-ignore
    if (item.type == 2) {
      // @ts-ignore
      arr.push(item)
    }
  })
  return arr || []
})

// 是不是多节点
const isSubFlag = computed(() => {
  return [1, 2, 3, 4].includes(props.node)
})

const isThreeSubNode = computed(() => {
  return [2, 3].includes(props.node)
})
const isTwoSubNode = computed(() => {
  return [1, 4].includes(props.node)
})

const currentType = ref(1) //操作类型

const typaChange = (index) => {
  currentType.value = index
}

const download = (item) => {
  downloadByUrl(item?.ossPath, item?.fileName)
}

// 附件提取文件
const formatFile = () => {
  let items = []
  if (currentSubType.value) {
    items = props.wapperDetail.records?.filter((item) => {
      if (props.node == item.node && item.type == 2 && item.subNode == currentSubType.value) {
        return item
      }
    })
  } else {
    items = props.wapperDetail.records?.filter((item) => {
      if (props.node == item.node && item.type == 2) {
        return item
      }
    })
  }
  let arr = (items[items?.length - 1]?.annexes || [])?.filter((item) => {
    if (item.type == 0 && !ImageType.includes(item.fileType)) {
      return item
    }
  })
  if (currentSubType.value) {
    arr = arr.filter((item) => {
      if (item.subNode == currentSubType.value) {
        return item
      }
    })
  }

  return arr
}

// 展示最新的链接 默认取最后一个
const formatArr = () => {
  const items = props.wapperDetail.records?.filter((item) => {
    if (isSubFlag.value) {
      if (props.node == item.node && item.type == 2 && item.subNode == currentSubType.value) {
        return item
      }
    } else {
      if (props.node == item.node && item.type == 2) {
        return item
      }
    }
  })
  const arr = (items[items?.length - 1]?.annexes || [])?.filter((item) => {
    if (item.type == 1) {
      return item
    }
  })
  return [arr[arr.length - 1]]
}

const openUrl = (url) => {
  const midUrl = url.startsWith('http') ? url : `https://${url}`
  window.open(midUrl)
}

const formatFileTypeDesc = (item) => {
  // docx
  const fileMap = {
    xls: 'ELX',
    xlsx: 'ELX',
    doc: 'DOC',
    docx: 'DOC',
    pdf: 'PDF'
  }
  const str = item?.toLowerCase()
  return fileMap[str] || 'OTHER'
}

// 附件提取图片
const formatImgFromFile = () => {
  const items = props.wapperDetail.records.filter((item) => {
    if (isSubFlag.value) {
      if (props.node == item.node && item.type == 2 && item.subNode == currentSubType.value) {
        return item
      }
    } else {
      if (props.node == item.node && item.type == 2) {
        return item
      }
    }
  })
  const arr = (items[items?.length - 1]?.annexes || [])?.filter((item) => {
    if (item.type == 0 && ImageType.includes(item?.fileType)) {
      return item
    }
  })
  return arr
}

const formatImgFromFileOne = () => {
  const arr = formatImgFromFile()
  if (arr?.length) {
    return arr[0].ossPath
  }
}

const formatImgFromFilePre = () => {
  const arr = formatImgFromFile()
  return arr.map((item) => item.ossPath)
}

//  按照顺序展示提交按钮
const showbtn = () => {
  const { wapperDetail, node } = props
  console.log(wapperDetail, node, 'wapperDetail, node')

  if (node != 2 && node != 3) {
    const conditions = {
      1: wapperDetail.planState != 2,
      4: wapperDetail.pageState != 2,
      5: wapperDetail.temporaryState != 2
    }
    // 任务暂停或者完成不展示
    if (wapperDetail.state == 3 || wapperDetail.state === 2) {
      return false
    }
    return conditions[node] || false
  } else {
    //多任务子节点
    if (currentType.value == 1 && assignmentItem.value && !isUpload.value) {
      return true
    }
    return false
  }
}

// 指派节点信息
const operatorsDetail = computed(() => {
  if (!isSubFlag.value) {
    const ite = props.wapperDetail.records.filter((it) => {
      if (it.node == `${props.node}` && it.type == 1) {
        return it
      }
    })
    return ite[ite.length - 1]
  } else {
    const ite = props.wapperDetail.records.filter((it) => {
      if (it.node == `${props.node}` && it.type == 1 && it.subNode == currentSubType.value) {
        return it
      }
    })
    return ite[ite.length - 1]
  }
})

const submitDetail = computed(() => {
  if (!isSubFlag.value) {
    const ite = props.wapperDetail.records.filter((it) => {
      if (it.node == `${props.node}` && it.type == 2) {
        return it
      }
    })
    return ite[ite.length - 1]
  } else {
    const ite = props.wapperDetail.records.filter((it) => {
      if (it.node == `${props.node}` && it.type == 2 && it.subNode == currentSubType.value) {
        return it
      }
    })
    return ite[ite.length - 1]
  }
})

const formatAvtor = (flag) => {
  //1-出方案｜2-拍摄｜3-后期｜4-页面｜5-临时需求
  //出方案
  // 展示指派信息的节点
  const type = flag == 1 ? 'operators' : 'auditors'

  if (!isSubFlag.value) {
    const ite = props.wapperDetail.records.filter((it) => {
      if (it.node == `${props.node}` && it.type == 1) {
        return it
      }
    })
    if (ite.length > 0) {
      const operators = ite[ite.length - 1][type] || []
      return operators
    } else {
      return []
    }
  } else {
    //多节点任务
    const ite = props.wapperDetail.records.filter((it) => {
      if (it.node == `${props.node}` && it.type == 1 && it.subNode == currentSubType.value) {
        return it
      }
    })
    if (ite.length > 0) {
      const operators = ite[ite.length - 1][type] || []
      return operators
    } else {
      return []
    }
  }
}

const emit = defineEmits(['goDetail'])

const userId = computed(() => userStore.user.id || '')
const isMyTask = () => {
  const arr = formatAvtor(1)
  const flag = arr.some((item) => {
    return item.operatorId == userId.value
  })
  return flag
}

// 任务提交打开弹出框
const goDetail = () => {
  emit('goDetail', props.node, props.wapperDetail, currentSubType)
}
const jumpDetail = () => {
  const newNode = props.node + 9
  emit('goDetail', newNode, props.wapperDetail, currentSubType)
}
const statusMap = {
  1: 'planState',
  2: 'shootState',
  3: 'retouchState',
  4: 'pageState',
  5: 'temporaryState'
}

const cusTitle = computed(() => {
  if (isSubFlag.value) {
    const ite = props.wapperDetail.records.filter((it) => {
      if (it.node == `${props.node}` && it.subNode == props.subType) {
        return it
      }
    })
    const three = ite.some((item) => item.type == 2 || item.type == 9)
    const two = ite.some((item) => item.type == 1)
    if (three) return '已完成'
    if (two) return '进行中'
    return '未开始'
  } else {
    const statusProp = statusMap[props.node || 1]
    if (statusProp && props.wapperDetail && props.wapperDetail[statusProp]) {
      return props.wapperDetail[statusProp] == 1
        ? '进行中'
        : props.wapperDetail[statusProp] == 2
          ? '已完成'
          : ''
    }
    return ''
  }
})

// 多节点流程
const initSubType = async () => {
  const res = await getSubNodeList(isThreeSubNode.value ? 3 : 2)
  if (props.subType || props.subType == '0') {
    currentSubType.value = props.subType
  } else {
    currentSubType.value = `${res && res[0].code}`
  }
}

watch(
  () => props.wapperDetail,
  async () => {
    if (isSubFlag.value) {
      if (props.subType || props.subType == '0') {
        currentSubType.value = `${props.subType}`
        handleChange()
        // nextTick(() => {
        //   currentSubType.value = `${props.subType}`
        //   handleChange()
        // })
      } else {
        await initSubType()
        handleChange()
      }
    }
  },
  {
    immediate: true,
    deep: true
  }
)

onMounted(async () => {
  if (isSubFlag.value) {
    if (props.subType || props.subType == '0') {
      nextTick(() => {
        currentSubType.value = `${props.subType}`
        handleChange()
      })
    } else {
      await initSubType()
      handleChange()
    }
  }
})
</script>

<style scoped lang="scss">
.popoverWapper {
  display: flex;
  flex-direction: column;
  .popoverHeader {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 30px;
    padding: 5px 15px;
    box-sizing: border-box;
    background: url('@/assets/imgs/team/wanchengbg.png');
    background-size: 100% 100%;
    font-weight: 500;
    font-size: 14px;
    color: #255c8c;
    .more {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      font-weight: 400;
      font-size: 12px;
      color: #255c8c;
      .moreIcon {
        width: 5px;
        height: 10px;
        margin-left: 8px;
      }
    }
  }
  .cusBg {
    background: url('@/assets/imgs/team/zhipaibg.png');
    background-size: 100% 100%;
  }
  .susColor {
    color: #703600;
  }

  .popoverContent {
    padding: 16px;
    box-sizing: border-box;
    .tab-change {
      display: flex;
      flex-direction: row;
      align-content: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .item {
      margin-bottom: 15px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
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

      .file-wapper {
        display: flex;
        flex-direction: row;
        .file-item {
          margin-right: 20px;
          margin-bottom: 10px;
        }
      }

      .item-title {
        font-size: 12px;
        color: #666666;
        line-height: 20px;
        margin-bottom: 5px;
      }

      .itemLeft {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        width: 38%;
        .peopleIcon {
          width: 12px;
          height: 12px;
          margin-right: 8px;
          margin-top: 3px;
        }
        .key {
          font-weight: 400;
          font-size: 14px;
          color: #415a88;
        }
      }
      .itemRight {
        .value {
          font-weight: 400;
          font-size: 14px;
          color: #333333;
        }
        .imgValue {
          height: 80px;
          width: 80px;
          border-radius: 12px;
        }
        .valueItem {
          margin-bottom: 5px;
          height: 22px;
          background: #e6ecff;
          padding: 1px 6px;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          align-items: center;
          border-radius: 12px;
          margin-left: 10px;
          .valueLogo {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            margin-right: 3px;
          }
          .name {
            display: block;
            font-size: 12px;
            color: #333333;
          }
        }
        .itemType {
          padding: 1px 16px;
          box-sizing: border-box;
          height: 22px;
        }
        .ELX {
          cursor: pointer;
          color: #0064ff;
        }
        .PPT {
          background: rgba(242, 21, 43, 0.17);
          border: 1px solid #f2152b;
          font-size: 12px;
          color: #f2152b;
          margin: 0 10px;
        }
        .DOC {
          background: rgba(0, 100, 255, 0.16);
          border: 1px solid #0064ff;
          font-size: 12px;
          color: #0064ff;
        }
      }

      .fileItemRight {
        display: flex;
        flex-direction: column;
        align-items: end;
      }

      .link-wapper {
        display: flex;
        flex-direction: column;
      }

      .right-wapper {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-end;
        .change-wapper {
          display: flex;
          flex-direction: row;
          align-items: center;
          .item {
            cursor: pointer;
            width: 54px;
            height: 26px;
            background: #fafafa;
            border-radius: 2px;
            border: 1px solid #dfe0e3;
            line-height: 26px;
            margin-right: 9px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            position: relative;
            .btn-icon {
              width: 11px;
              height: 9px;
              margin-right: 4px;
            }
            .btn-text {
              font-size: 12px;
              color: #666666;
            }
          }
          .item:last-child {
            margin-right: 0;
          }
        }
      }
    }

    .mid {
      border-bottom: 1px solid #f2f4f8;
    }
  }
  .btnWapper {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: end;
    padding-bottom: 12px;

    .btn {
      height: 32px;
      background: #0064ff;
      border-radius: 4px;
      margin-right: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 6px 10px;
      box-sizing: border-box;
      cursor: pointer;
      .btnIcon {
        width: 12px;
        height: 12px;
        margin-right: 4px;
      }
      .text {
        display: block;
        height: 32px;
        font-weight: 400;
        font-size: 12px;
        color: #ffffff;
        line-height: 32px;
      }
    }
  }
}

:deep(.el-popper) {
  border-radius: 50% !important;
  background: red;
}
:deep(.el-popover.el-popper) {
  border-radius: 50% !important;
  background: red;
}

.item-desc {
  color: #0064ff;
  cursor: pointer;
}

.fileImg {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.file-img-wapper {
  display: flex;
  flex-direction: row;

  justify-content: end;
}

.file-text {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}
.file-type-desc {
  width: 53px;
  height: 22px;
  line-height: 22px;
  text-align: center;
  cursor: pointer;
  margin-left: 10px;
}
.DOC {
  background: rgba(0, 100, 255, 0.16);
  border: 1px solid #0064ff;
  color: #0064ff;
}
.ELX {
  background: rgba(183, 236, 204, 0.57);
  border: 1px solid #69c78f;
  color: #037230;
}
.PDF {
  color: #f2152b;
  background: rgba(242, 21, 43, 0.17);
  border: 1px solid #f2152b;
}
.file-link {
  display: block;
  width: 260px;
  text-align: end;
  color: #0064ff;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.OTHER {
  background: rgba(0, 100, 255, 0.16);
  border: 1px solid #0064ff;
  color: #0064ff;
}
.empty-wapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .empty-img {
    width: 239px;
    height: 140px;
  }
  .empty-desc {
    font-size: 12px;
    color: #999999;
    margin-top: 12px;
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
