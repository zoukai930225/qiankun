/*
 * @Date: 2025-01-03 18:26:34
 */

import progressDotBlue from '@/assets/imgs/oa/product/node/node_status_blue.png'
import progressDotGray from '@/assets/imgs/oa/product/node/node_status_gray.png'
import progressDotRed from '@/assets/imgs/oa/product/node/node_status_red.png'
import progressDotYellow from '@/assets/imgs/oa/product/node/node_status_yellow.png'

import { format } from 'date-fns'

import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

// 0 文本 1 数字 2 单选 3 多选 4 日期 5 日期时间 6 开关
export const componentMap = {
  0: 'el-input',
  1: 'el-input-number',
  2: 'el-select',
  3: 'el-select',
  4: 'el-date-picker',
  5: 'el-date-picker',
  6: 'el-switch'
}

export const componentTypeMap = {
  0: 'text',
  1: 'undefined',
  2: 'single',
  3: 'undefined',
  4: 'date',
  5: 'datetime',
  6: 'undefined'
}

export const nodeStatusMap = {
  1: '进行中',
  2: '正常',
  3: '延期'
}
export const placeholderMap = (type) => {
  let map = {
    0: '请输入',
    1: '请输入'
  }
  return map[type] || '请选择'
}
/**
 * @description: 时间格式化函数
 * @param {*} dateString 时间字符串
 * @param {*} formatString 格式化字符串
 * @return {*}
 */
export const formatCustomDate = (dateString, formatString = 'yyyy-MM-dd') => {
  if (!dateString) return '--'
  const date = new Date(dateString)
  return format(date, formatString)
}

// 返回产品状态
export const productStatusMap = (status) =>
  ({
    1: '打样',
    2: '制样',
    3: '齐色',
    4: '定品'
  })[status] || '--'

// 获取节点提交人
export const getNodeSubmitter = (tab) => {
  let submitPersonList = []
  if (Number(tab.status || '') === 1) {
    // 已结束
    submitPersonList = handleJSONParse(tab.submitPersonList) || []
  } else {
    submitPersonList = handleJSONParse(tab.personInChargeList) || []
  }
  return submitPersonList.length > 0 ? submitPersonList[0] : undefined
}

export const handleJSONParse = (str) => {
  try {
    if (Array.isArray(str)) {
      return str
    }
    if (str !== '') {
      return JSON.parse(str)
    }
  } catch (error) {
    return []
  }
}

// status(0-未开始,1-待审核,2-审核失败,3-已结束)

export const parseExamineInfoFiles = (tab) => {
  if ((Number(tab.isExamine) || 0) === 0) {
    if (tab.docUrl) {
      return parsedDocUrls(tab.docUrl)
    }
    return []
  }
  return []
}

export const parsedDocUrls = (docUrl) => {
  // 如果 docUrl 为空，则返回空数组
  if (!docUrl) {
    return []
  }
  // 将字符串分割成数组
  const urls = docUrl.split(',')
  const urlNameArr = docUrl.split('/')
  // 返回一个新数组，其中包含带有文件名的对象
  return urls.map((url) => {
    const fileNameMatch = url.match(/name=([^&]+)/)
    const fileName = fileNameMatch
      ? decodeURIComponent(fileNameMatch.length > 1 ? fileNameMatch[1] || '' : '')
      : ''
    return {
      url: url,
      name: fileName || urlNameArr[urlNameArr.length - 1]
    }
  })
}

// 产前样审核是否有被拒的子节点
export const isRefundPreProductionSampleAudit = (nodeList) => {
  const node = nodeList.find((item) => item.nodeCode === 'PreProductionSampleAudit')
  let isExistRefund = false
  if (node) {
    node.examineInfo = handleJSONParse(node.examineInfo) || []
    node.examineInfo.forEach((item) => {
      if (Number(item.examineStatus || 0) === 2) {
        // 被拒绝
        isExistRefund = true
      }
    })
  }
  return isExistRefund
}

//获取节点背景状态颜色
export const getNodeBgStatusColor = (waitTime) => {
  const arr = getNodeWaitTimeArr(waitTime) || []
  const unit = arr.length > 0 ? arr[arr.length - 1] : ''
  if (unit == '分钟') {
    return '#24BC29'
  } else if (unit == '小时') {
    return '#FFA300'
  } else if (unit == '天') {
    return '#FF4F4F'
  }
  return '#24BC29'
}

export const getNodeWaitTimeArr = (waitTime) => {
  return waitTime && waitTime.match(/\d+|[^\d]+/g)
}

export const getNodeWaitTime = (waitTime) => {
  const arr = getNodeWaitTimeArr(waitTime) || []
  const value = arr.length > 0 ? arr[0] : ''
  return value
}

export const getNodeWaitTimeUnit = (waitTime) => {
  const arr = getNodeWaitTimeArr(waitTime) || []
  const unit = arr.length > 0 ? arr[arr.length - 1] : ''
  return unit
}

// 节点状态 status(0-未开始,1-已结束,2-淘汰 3-进行中)
export const getStatusLabel = (status, nodeCode, nodeList) => {
  if (
    nodeCode &&
    nodeCode === 'PreProductionSampleAudit' &&
    isRefundPreProductionSampleAudit(nodeList)
  ) {
    return '拒绝'
  }
  return (
    {
      future: '未开始',
      Completed: '已结束',
      2: '淘汰',
      active: '进行中'
    }[status] ?? '未知状态'
  )
}

export const getDotImg = (status, nodeCode, nodeList) => {
  if (
    nodeCode &&
    nodeCode === 'PreProductionSampleAudit' &&
    isRefundPreProductionSampleAudit(nodeList)
  ) {
    return progressDotRed
  }
  if (status == 'future') {
    return progressDotGray
  } else if (status == 'Completed') {
    return progressDotBlue
  } else if (status === 2) {
    return progressDotRed
  } else if (status == 'active') {
    return progressDotYellow
  }
  return progressDotBlue
}

/**
 *
 *是否拥有编辑权限
 * @returns
 */
export const isHasEditInfoPermission = (data, isEnter = false) => {
  if (!data) {
    return false
  }
  if (isEnter && userStore.user.isAdmin === 1) {
    return true
  }
  if (!isEnter && Number(data.status || '') === 1) {
    return false
  }
  let personList = []
  if (Number(data.status || '') === 1) {
    personList = data.submitPersonList && handleJSONParse(data.submitPersonList)
  } else {
    personList = data.personInChargeList && handleJSONParse(data.personInChargeList)
  }
  let isPermission = false
  if (Array.isArray(personList)) {
    personList.forEach((item) => {
      if (item.userId === userStore.user.userNo || item.userId === userStore.user.id) {
        isPermission = true
      }
    })
  }
  return isPermission
}

// 获取并行的节点
export const getParallelHeaderNodeList = (nodeList) => {
  let list = []
  let paralleNextNodeCode = ''
  nodeList &&
    nodeList.forEach((item, index1) => {
      if (item.childNodes && item.childNodes.length > 0) {
        item.childNodes.forEach((child, index) => {
          child.childNodes = getParallelChildNodeList(child, nodeList, paralleNextNodeCode)
          if (index === 0 && child.childNodes && child.childNodes.length > 0) {
            if (
              child.childNodes[child.childNodes.length - 1] &&
              child.childNodes[child.childNodes.length - 1].nextNodeCode
            ) {
              paralleNextNodeCode = child.childNodes[child.childNodes.length - 1].nextNodeCode
            }
          }
          list.push(child)
        })
      }
    })
  console.log('获取并行的头部节点:', list)
  return list
}

// 获取并行子节点
const getParallelChildNodeList = (node, nodeList, paralleNextNodeCode = '') => {
  let list = []
  let firstIndex = 99999
  let isEnd = false
  nodeList &&
    nodeList.forEach((item, index) => {
      if (node && node.nodeCode && item.nodeCode && item.nodeCode === node.nodeCode) {
        list.push(item)
        firstIndex = index
      } else {
        if (index > firstIndex && firstIndex > 0) {
          let nextNode = { nodeCode: '' }
          if (index + 1 < nodeList.length) {
            nextNode = nodeList[index + 1]
          }
          if (
            nextNode &&
            nextNode.nodeCode &&
            item.nextNodeCode &&
            item.nextNodeCode !== nextNode.nodeCode &&
            !item.childNodes &&
            !isEnd
          ) {
            isEnd = true
            list.push(item)
          } else if (
            nextNode &&
            nextNode.nodeCode &&
            item.nextNodeCode &&
            item.nextNodeCode === nextNode.nodeCode &&
            !isEnd
          ) {
            if (paralleNextNodeCode) {
              if (item.nodeCode !== paralleNextNodeCode && !item.childNodes) {
                list.push(item)
              } else {
                isEnd = true
              }
            } else {
              list.push(item)
            }
          }
        }
      }
    })
  list.forEach((item, index) => {
    item.isParalleNode = true
    if (index === 0) {
      item.isFirstNode = true
    } else if (index === list.length - 1) {
      item.isEndNode = true
    } else {
      item.isMiddleNode = true
    }
  })
  return list || []
}

//是否并行节点
export const isParallelNode = (node, nodeList) => {
  let isParallel = false
  nodeList &&
    nodeList.forEach((item) => {
      if (item.nodeCode === node.nodeCode) {
        isParallel = true
      }
      if (item.childNodes && item.childNodes.length > 0) {
        item.childNodes.forEach((child) => {
          if (child.nodeCode === node.nodeCode) {
            isParallel = true
          }
        })
      }
    })
  return isParallel
}

// 获取第一个并行节点的大节点
export const getFirstParallelNode = (nodeList, index = 0) => {
  let node = { nodeCode: '' }
  let findIndex = -1
  nodeList &&
    nodeList.forEach((item, index1) => {
      if (item.childNodes && item.childNodes.length > 0) {
        findIndex += 1
        if (findIndex === index) {
          node = item
        }
      }
    })
  return node
}

// 获取并行节点的坐标 0 代表第一个 1代表第二个 - 1代码没有
export const parallelNodeIndex = (node, nodeList) => {
  let nodeIndex = -1
  nodeList &&
    nodeList.forEach((item) => {
      if (item.childNodes && item.childNodes.length > 0) {
        item.childNodes.forEach((child, index) => {
          if (child.nodeCode === node.nodeCode) {
            nodeIndex = index
          }
        })
      }
    })
  return nodeIndex
}
// 并行一级节点位置
export const parallelNodeFirstIndex = (node, nodeList) => {
  let nodeIndex = -1
  nodeList &&
    nodeList.forEach((item, index) => {
      if (item.childNodes && item.childNodes.length > 0) {
        item.childNodes.forEach((child) => {
          if (child.nodeCode === node.nodeCode) {
            nodeIndex = index
          }
        })
      }
    })
  return nodeIndex
}

// 并行上个节点的数量
export const parallelTopNodeCount = (nodeList) => {
  let nodeCount = 0
  nodeList &&
    nodeList.forEach((item, index) => {
      if (index === 0) {
        nodeCount = item.childNodes && item.childNodes.length
      }
    })
  return nodeCount
}
export const parallelTopNodeCountByIndex = (nodeList, nodeIndex) => {
  let nodeCount = 0
  nodeList &&
    nodeList.forEach((item, index) => {
      if (index === nodeIndex) {
        nodeCount = item.childNodes && item.childNodes.length
      }
    })
  return nodeCount
}
// 并行下个节点的数量
export const parallelBottomNodeCount = (nodeList) => {
  let nodeCount = 0
  nodeList &&
    nodeList.forEach((item, index) => {
      if (index > 0) {
        nodeCount = item.childNodes && item.childNodes.length
      }
    })
  return nodeCount
}

export const parallelBottomNodeCountByIndex = (nodeList, nodeIndex) => {
  let nodeCount = 0
  nodeList &&
    nodeList.forEach((item, index) => {
      if (index === nodeIndex) {
        nodeCount = item.childNodes && item.childNodes.length
      }
    })
  return nodeCount
}

// 获取并行节点的最后一个节点
export const getPrallelEndNode = (nodeList, index = 0) => {
  // let endNodes = []
  let endNodes = ''

  if (nodeList && nodeList.length > 0) {
    if (
      index >= 0 &&
      index < nodeList.length &&
      nodeList[index].childNodes &&
      nodeList[index].childNodes.length > 0
    ) {
      return nodeList[index].childNodes[nodeList[index].childNodes.length - 1].nextNodeCode || ''
    }
  } else {
    return ''
  }
}

// 根据code获取节点信息
export const getNodeByNodeCode = (nodeCode, nodeList) => {
  let node = { nodeCode: '', status: '0' }
  if (nodeList && nodeList.length > 0) {
    nodeList.forEach((item) => {
      if (item.nodeCode === nodeCode) {
        node = item
      }
    })
  }
  return node
}

//是否并行节点之后的一些节点
export const isPallelEndNodeNextNode = (headerList, currentNodeCode, nodeList, index = 0) => {
  let endCode = getPrallelEndNode(headerList, index)
  let isNext = false
  let isEndCode = false
  nodeList &&
    nodeList.forEach((element) => {
      if (element.nodeCode === endCode) {
        isEndCode = true
      }
      if (element.nodeCode === currentNodeCode && isEndCode) {
        isNext = true
      }
    })
  return isNext
}

// 获取当前节点前面有多少个组合的数量
export const getCurrentNodePreParlletCount = (node, nodeList) => {
  let count = 0
  let isMatchNode = false
  if (nodeList && nodeList.length > 0) {
    nodeList.forEach((item, index) => {
      if (node && node.nodeCode === item.nodeCode) {
        isMatchNode = true
      }
      if (item.childNodes && item.childNodes.length > 0 && !isMatchNode) {
        count += 1
      }
    })
  }
  return count
}

// 获取并行节点的头节点
export const getPrallelHeaderNode = (nodeList, nodeIndex = 0) => {
  let node = { nodeCode: '', status: '0' }
  let findIndex = -1
  if (nodeList && nodeList.length > 0) {
    nodeList.forEach((item, index) => {
      if (nodeIndex >= 0 && item.childNodes && item.childNodes.length > 0) {
        findIndex += 1
        if (nodeIndex === findIndex) {
          node = item
        }
      }
    })
  }
  return node || { nodeCode: '', status: '0' }
}
//当前节点的上一个节点

export const getPreNode = (node, nodeList) => {
  let preNode = { nodeCode: '' }
  nodeList &&
    nodeList.forEach((item, index) => {
      if (item.nodeCode === node.nodeCode) {
        if (index - 1 >= 0) {
          preNode = nodeList[index - 1]
        }
      }
    })
  return preNode
}
//当前节点的下一个节点
export const getNextNode = (node, nodeList) => {
  let nextNode = { nodeCode: '' }
  nodeList &&
    nodeList.forEach((item, index) => {
      if (item.nodeCode === node.nodeCode) {
        if (index + 1 < nodeList.length) {
          nextNode = nodeList[index + 1]
        }
      }
    })
  return nextNode
}
// 节点测试数据
export const testNodeList = [
  {
    id: '979a18ba-6aa1-4c3a-828c-0b1cace4a2b3',
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '企划创建',
    personInCharge: '',
    planStartTime: null,
    planEndTime: null,
    actualEndTime: '2025-07-23 14:02:37',
    remarks: '123',
    docUrl:
      'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/test/newProduct/8347722d-0899-4e36-be8d-eba035c1b81e.jpeg?name=4.jpeg,https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/test/newProduct/fb1343f5-8134-4246-9f94-59c514963f72.jpeg?name=4.jpeg',
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: null,
    personInChargeList: '[]',
    examineInfo: null,
    nodeCode: 'EnterPrisePlanCreate',
    submitPerson: 'ou_8dfeaa27803c1a7e6a055d87dbc0270d',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"}]',
    waitTime: null,
    flagName: '唐宗胜测试0723001',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: '0',
    nextNodeCode: 'EnterPrisePlanExamineOne',
    childNodes: null
  },
  {
    id: '682397d7-2ffa-46a2-846b-dd6c50ed3296',
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '企划审核',
    personInCharge:
      'on_79abd601ffbea6d62c3f1e69af7d0c06,on_6ae164fdb002bb5b65f90a8d2a4236c8,on_aad79132df037f17e62c2c3f1e90d527,on_ca6d7398ce2bcd41e8e6fe7905a04da3',
    planStartTime: null,
    planEndTime: '2025-07-24 14:02:37',
    actualEndTime: '2025-07-23 14:02:49',
    remarks: '123',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '1',
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_f2fefc2e3e506164344447fc55619139.png","name":"王孝安","unionId":"on_79abd601ffbea6d62c3f1e69af7d0c06","userId":"ou_f2fefc2e3e506164344447fc55619139"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_f2b73bada9d32a1efac3dbf8d37e9cd5.png","name":"王永成","unionId":"on_aad79132df037f17e62c2c3f1e90d527","userId":"ou_f2b73bada9d32a1efac3dbf8d37e9cd5"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    examineInfo: null,
    nodeCode: 'EnterPrisePlanExamineOne',
    submitPerson: 'ou_8dfeaa27803c1a7e6a055d87dbc0270d',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"}]',
    waitTime: '<1 分钟',
    flagName: '唐宗胜测试0723001',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'EnterPrisePlanCreate',
    nextNodeCode: 'EnterPrisePlanExamineTwo',
    childNodes: null
  },
  {
    id: '426d3c1c-b31f-455c-a940-e5035f8d5039',
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '企划审核',
    personInCharge:
      'on_79abd601ffbea6d62c3f1e69af7d0c06,on_6ae164fdb002bb5b65f90a8d2a4236c8,on_aad79132df037f17e62c2c3f1e90d527,on_ca6d7398ce2bcd41e8e6fe7905a04da3',
    planStartTime: null,
    planEndTime: '2025-07-24 14:02:49',
    actualEndTime: '2025-07-23 14:02:56',
    remarks: '123',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_f2fefc2e3e506164344447fc55619139.png","name":"王孝安","unionId":"on_79abd601ffbea6d62c3f1e69af7d0c06","userId":"ou_f2fefc2e3e506164344447fc55619139"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_f2b73bada9d32a1efac3dbf8d37e9cd5.png","name":"王永成","unionId":"on_aad79132df037f17e62c2c3f1e90d527","userId":"ou_f2b73bada9d32a1efac3dbf8d37e9cd5"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    examineInfo: null,
    nodeCode: 'EnterPrisePlanExamineTwo',
    submitPerson: 'ou_8dfeaa27803c1a7e6a055d87dbc0270d',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"}]',
    waitTime: '<1 分钟',
    flagName: '唐宗胜测试0723001',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'EnterPrisePlanExamineOne',
    nextNodeCode: 'DevelopManagerDistribution,SupplierChainDistribution',
    childNodes: [
      {
        nodeId: null,
        nodeCode: 'DevelopManagerDistribution',
        nodeName: '产研主管分配',
        submitType: '9efb2141-05a4-4568-a4a7-f8073aabfd97',
        weeklyRest: 'seven',
        durationUnit: 'hour',
        basisDuration: 2,
        warningDuration: 1,
        personInCharge: '',
        isExamine: '0',
        preNodeCode: 'EnterPrisePlanExamineTwo',
        nextNodeCode: 'DesignPictureUpload',
        childNodes: null,
        examineNodePersons: null
      },
      {
        nodeId: null,
        nodeCode: 'SupplierChainDistribution',
        nodeName: '供应链开发分配',
        submitType: 'b49f2a62-51dd-4fb2-9d9e-2ce2f5b690e7',
        weeklyRest: 'seven',
        durationUnit: 'day',
        basisDuration: 1,
        warningDuration: 1,
        personInCharge: '',
        isExamine: '0',
        preNodeCode: 'EnterPrisePlanExamineTwo',
        nextNodeCode: 'SupplierChainSpecialistMatch',
        childNodes: null,
        examineNodePersons: null
      }
    ]
  },
  {
    id: '0803b05e-ef0b-4110-b32c-e2713ea9678e',
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '产研主管分配',
    personInCharge:
      'ou_8dfeaa27803c1a7e6a055d87dbc0270d,ou_f2b73bada9d32a1efac3dbf8d37e9cd5,ou_ba41b8a491445abf02691bfa9c22cdd4',
    planStartTime: null,
    planEndTime: '2025-07-23 16:02:56',
    actualEndTime: '2025-07-23 14:55:58',
    remarks: '',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_f2b73bada9d32a1efac3dbf8d37e9cd5.png","name":"王永成","unionId":"on_aad79132df037f17e62c2c3f1e90d527","userId":"ou_f2b73bada9d32a1efac3dbf8d37e9cd5"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_ba41b8a491445abf02691bfa9c22cdd4.png","name":"许锋","unionId":"on_506e3b8391fcc69bd652f2454daaf1b4","userId":"ou_ba41b8a491445abf02691bfa9c22cdd4"}]',
    examineInfo: null,
    nodeCode: 'DevelopManagerDistribution',
    submitPerson: 'ou_8dfeaa27803c1a7e6a055d87dbc0270d',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"}]',
    waitTime: '53 分钟',
    flagName: 'QT-NY-20250723-08',
    weeklyRest: 'seven',
    durationUnit: 'hour',
    basisDuration: 2,
    preNodeCode: 'EnterPrisePlanExamineTwo',
    nextNodeCode: 'DesignPictureUpload',
    childNodes: null
  },
  {
    id: '0fb5a656-d247-48aa-8638-249b44a2ed42',
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '设计图上传',
    personInCharge: null,
    planStartTime: null,
    planEndTime: '2025-07-24 14:55:58',
    actualEndTime: '2025-07-23 14:56:19',
    remarks: '123',
    docUrl: 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/test/visualApproval/205969000-4.jpeg',
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: null,
    personInChargeList: '[]',
    examineInfo: null,
    nodeCode: 'DesignPictureUpload',
    submitPerson: 'ou_8dfeaa27803c1a7e6a055d87dbc0270d',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"}]',
    waitTime: '<1 分钟',
    flagName: 'QT-NY-20250723-08-0001',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'DevelopManagerDistribution',
    nextNodeCode: 'DesignPictureExamine',
    childNodes: null
  },
  {
    id: '15b2997d-434b-4ce4-8928-62156834f62e',
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '设计图审核',
    personInCharge: null,
    planStartTime: null,
    planEndTime: '2025-07-24 14:56:19',
    actualEndTime: '2025-07-23 14:56:20',
    remarks: '买手款自动审批通过',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '1',
    nodeStatus: null,
    personInChargeList: '[]',
    examineInfo: null,
    nodeCode: 'DesignPictureExamine',
    submitPerson: 'ou_8dfeaa27803c1a7e6a055d87dbc0270d',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"}]',
    waitTime: '<1 分钟',
    flagName: 'QT-NY-20250723-08-0001',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'DesignPictureUpload',
    nextNodeCode: 'SampleUpload',
    childNodes: null
  },
  {
    id: '676b16d5-eb18-4e11-827b-5f647e8aa00e',
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '供应链开发分配',
    personInCharge: null,
    planStartTime: null,
    planEndTime: '2025-07-24 14:56:20',
    actualEndTime: '2025-07-23 14:56:19',
    remarks: '买手款自动审批通过',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: null,
    personInChargeList: '[]',
    examineInfo: null,
    nodeCode: 'SupplierChainDistribution',
    submitPerson: 'ou_8dfeaa27803c1a7e6a055d87dbc0270d',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"}]',
    waitTime: '53 分钟',
    flagName: '',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'EnterPrisePlanExamineTwo',
    nextNodeCode: 'SupplierChainSpecialistMatch',
    childNodes: null
  },
  {
    id: '2ef7b831-b97b-4fc3-9f05-43c95891b4b4',
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '匹配供应商',
    personInCharge: null,
    planStartTime: null,
    planEndTime: '2025-07-24 14:56:19',
    actualEndTime: '2025-07-23 14:56:20',
    remarks: '买手款自动审批通过',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: null,
    personInChargeList: '[]',
    examineInfo: null,
    nodeCode: 'SupplierChainSpecialistMatch',
    submitPerson: 'ou_8dfeaa27803c1a7e6a055d87dbc0270d',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"}]',
    waitTime: '<1 分钟',
    flagName: '',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'SupplierChainDistribution',
    nextNodeCode: 'SampleUpload',
    childNodes: null
  },
  {
    id: 'fa927176-31ac-45d0-aa93-d17a574d8bc3',
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '打样进度',
    personInCharge: null,
    planStartTime: null,
    planEndTime: '2025-07-24 14:56:20',
    actualEndTime: '2025-07-23 14:56:20',
    remarks: '买手款自动审批通过',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: null,
    personInChargeList: '[]',
    examineInfo: null,
    nodeCode: 'SampleUpload',
    submitPerson: 'ou_8dfeaa27803c1a7e6a055d87dbc0270d',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"}]',
    waitTime: '<1 分钟',
    flagName: 'QT-NY-20250723-08-0001',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'DesignPictureExamine,SupplierChainSpecialistMatch',
    nextNodeCode: 'ChooseMeeting',
    childNodes: null
  },
  {
    id: 'bd972409-c2bc-48d1-ae10-9624747bde30',
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '选品会',
    personInCharge: null,
    planStartTime: null,
    planEndTime: '2025-07-24 14:56:20',
    actualEndTime: '2025-07-23 14:58:25',
    remarks: '123',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: null,
    personInChargeList: '[]',
    examineInfo: null,
    nodeCode: 'ChooseMeeting',
    submitPerson: 'ou_8dfeaa27803c1a7e6a055d87dbc0270d',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"}]',
    waitTime: '2 分钟',
    flagName: 'QT-NY-20250723-08-0001',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'SampleUpload',
    nextNodeCode: 'ProductExamine',
    childNodes: null
  },
  {
    id: null,
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '产品审核',
    personInCharge: 'ou_a83797eefce85cb6ee7aa2f4df4129ea,ou_8dfeaa27803c1a7e6a055d87dbc0270d',
    planStartTime: null,
    planEndTime: '2025-07-24 14:58:25',
    actualEndTime: null,
    remarks: null,
    docUrl: null,
    status: '3',
    finishStatus: null,
    isExamine: '1',
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"}]',
    examineInfo: null,
    nodeCode: 'ProductExamine',
    submitPerson: null,
    submitPersonList: '[]',
    waitTime: null,
    flagName: null,
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'ChooseMeeting',
    nextNodeCode: 'RiskAssessReport',
    childNodes: null
  },
  {
    id: null,
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '风险评估报告',
    personInCharge: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    planStartTime: null,
    planEndTime: null,
    actualEndTime: null,
    remarks: null,
    docUrl: null,
    status: '0',
    finishStatus: null,
    isExamine: null,
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    examineInfo: null,
    nodeCode: 'RiskAssessReport',
    submitPerson: null,
    submitPersonList: '[]',
    waitTime: '- 分钟',
    flagName: null,
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'ProductExamine',
    nextNodeCode: 'ProductinformationFilling',
    childNodes: null
  },
  {
    id: null,
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '基本资料填写',
    personInCharge: 'ou_8dfeaa27803c1a7e6a055d87dbc0270d',
    planStartTime: null,
    planEndTime: null,
    actualEndTime: null,
    remarks: null,
    docUrl: null,
    status: '0',
    finishStatus: null,
    isExamine: '0',
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"}]',
    examineInfo: null,
    nodeCode: 'ProductinformationFilling',
    submitPerson: null,
    submitPersonList: '[]',
    waitTime: '- 分钟',
    flagName: null,
    weeklyRest: 'seven',
    durationUnit: 'hour',
    basisDuration: 4,
    preNodeCode: 'RiskAssessReport',
    nextNodeCode: 'ERPInformationFilling,ProductQualificationSubmit',
    childNodes: [
      {
        nodeId: null,
        nodeCode: 'ERPInformationFilling',
        nodeName: 'ERP资料填写',
        submitType: '4',
        weeklyRest: 'seven',
        durationUnit: 'hour',
        basisDuration: 4,
        warningDuration: 1,
        personInCharge: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
        isExamine: '0',
        preNodeCode: 'ProductinformationFilling',
        nextNodeCode: 'OperationManagerDistribution',
        childNodes: null,
        examineNodePersons: null
      },
      {
        nodeId: null,
        nodeCode: 'ProductQualificationSubmit',
        nodeName: '产品资质提交',
        submitType: '010bf74e-ce45-4d6f-b180-3b1cbb01ce31',
        weeklyRest: 'seven',
        durationUnit: 'day',
        basisDuration: 1,
        warningDuration: 1,
        personInCharge: '',
        isExamine: '0',
        preNodeCode: 'ProductinformationFilling',
        nextNodeCode: 'QAQualificationExamine',
        childNodes: null,
        examineNodePersons: null
      }
    ]
  },
  {
    id: null,
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: 'ERP资料填写',
    personInCharge: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    planStartTime: null,
    planEndTime: null,
    actualEndTime: null,
    remarks: null,
    docUrl: null,
    status: '0',
    finishStatus: null,
    isExamine: '0',
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    examineInfo: null,
    nodeCode: 'ERPInformationFilling',
    submitPerson: null,
    submitPersonList: '[]',
    waitTime: '- 分钟',
    flagName: null,
    weeklyRest: 'seven',
    durationUnit: 'hour',
    basisDuration: 4,
    preNodeCode: 'ProductinformationFilling',
    nextNodeCode: 'OperationManagerDistribution',
    childNodes: null
  },
  {
    id: null,
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '运营主管分配',
    personInCharge: 'ou_ba41b8a491445abf02691bfa9c22cdd4,ou_8dfeaa27803c1a7e6a055d87dbc0270d',
    planStartTime: null,
    planEndTime: null,
    actualEndTime: null,
    remarks: null,
    docUrl: null,
    status: '0',
    finishStatus: null,
    isExamine: '0',
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_ba41b8a491445abf02691bfa9c22cdd4.png","name":"许锋","unionId":"on_506e3b8391fcc69bd652f2454daaf1b4","userId":"ou_ba41b8a491445abf02691bfa9c22cdd4"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"}]',
    examineInfo: null,
    nodeCode: 'OperationManagerDistribution',
    submitPerson: null,
    submitPersonList: '[]',
    waitTime: '- 分钟',
    flagName: null,
    weeklyRest: 'seven',
    durationUnit: 'hour',
    basisDuration: 2,
    preNodeCode: 'ERPInformationFilling',
    nextNodeCode: 'OperationInformationFilling',
    childNodes: null
  },
  {
    id: null,
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '运营信息填写',
    personInCharge: '',
    planStartTime: null,
    planEndTime: null,
    actualEndTime: null,
    remarks: null,
    docUrl: null,
    status: '0',
    finishStatus: null,
    isExamine: '0',
    nodeStatus: null,
    personInChargeList: '[]',
    examineInfo: null,
    nodeCode: 'OperationInformationFilling',
    submitPerson: null,
    submitPersonList: '[]',
    waitTime: '- 分钟',
    flagName: null,
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'OperationManagerDistribution',
    nextNodeCode: 'SupplyAndDemandPlan',
    childNodes: null
  },
  {
    id: null,
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '供需计划',
    personInCharge: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    planStartTime: null,
    planEndTime: null,
    actualEndTime: null,
    remarks: null,
    docUrl: null,
    status: '0',
    finishStatus: null,
    isExamine: null,
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    examineInfo: null,
    nodeCode: 'SupplyAndDemandPlan',
    submitPerson: null,
    submitPersonList: '[]',
    waitTime: '- 分钟',
    flagName: null,
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'OperationInformationFilling',
    nextNodeCode: 'PurchaseManagerDistribution',
    childNodes: null
  },
  {
    id: null,
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '采购主管分配',
    personInCharge:
      'ou_a9303cd61bee159a7291e3c473445f5a,ou_ba41b8a491445abf02691bfa9c22cdd4,3cf596d6-4d71-453b-b990-22c46fbff17b,ou_8dfeaa27803c1a7e6a055d87dbc0270d',
    planStartTime: null,
    planEndTime: null,
    actualEndTime: null,
    remarks: null,
    docUrl: null,
    status: '0',
    finishStatus: null,
    isExamine: '0',
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a9303cd61bee159a7291e3c473445f5a.png","name":"郑江宇","unionId":"on_5bee97a3a7686f70e08b36f56a1d5422","userId":"ou_a9303cd61bee159a7291e3c473445f5a"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_ba41b8a491445abf02691bfa9c22cdd4.png","name":"许锋","unionId":"on_506e3b8391fcc69bd652f2454daaf1b4","userId":"ou_ba41b8a491445abf02691bfa9c22cdd4"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"}]',
    examineInfo: null,
    nodeCode: 'PurchaseManagerDistribution',
    submitPerson: null,
    submitPersonList: '[]',
    waitTime: '- 分钟',
    flagName: null,
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'SupplyAndDemandPlan',
    nextNodeCode: 'ProcurementNotice',
    childNodes: null
  },
  {
    id: null,
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '采购信息填写',
    personInCharge: '',
    planStartTime: null,
    planEndTime: null,
    actualEndTime: null,
    remarks: null,
    docUrl: null,
    status: '0',
    finishStatus: null,
    isExamine: '0',
    nodeStatus: null,
    personInChargeList: '[]',
    examineInfo: null,
    nodeCode: 'ProcurementNotice',
    submitPerson: null,
    submitPersonList: '[]',
    waitTime: '- 分钟',
    flagName: null,
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'PurchaseManagerDistribution',
    nextNodeCode: 'PreProductionSampleAudit',
    childNodes: null
  },
  {
    id: null,
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '产品资质提交',
    personInCharge: 'ou_8dfeaa27803c1a7e6a055d87dbc0270d',
    planStartTime: null,
    planEndTime: null,
    actualEndTime: null,
    remarks: null,
    docUrl: null,
    status: '0',
    finishStatus: null,
    isExamine: '0',
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"}]',
    examineInfo: null,
    nodeCode: 'ProductQualificationSubmit',
    submitPerson: null,
    submitPersonList: '[]',
    waitTime: '- 分钟',
    flagName: null,
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'ProductinformationFilling',
    nextNodeCode: 'QAQualificationExamine',
    childNodes: null
  },
  {
    id: null,
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: 'QA资质审核',
    personInCharge:
      'ou_8dfeaa27803c1a7e6a055d87dbc0270d,ou_99db3ca8927d0097d3f04fdf4bff568e,ou_a83797eefce85cb6ee7aa2f4df4129ea',
    planStartTime: null,
    planEndTime: null,
    actualEndTime: null,
    remarks: null,
    docUrl: null,
    status: '0',
    finishStatus: null,
    isExamine: '1',
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_99db3ca8927d0097d3f04fdf4bff568e.png","name":"刘蒋","unionId":"on_db2903ee10afd13e836ae73b33dfe307","userId":"ou_99db3ca8927d0097d3f04fdf4bff568e"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    examineInfo: null,
    nodeCode: 'QAQualificationExamine',
    submitPerson: null,
    submitPersonList: '[]',
    waitTime: '- 分钟',
    flagName: null,
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'ProductQualificationSubmit',
    nextNodeCode: 'PreProductionSampleAudit',
    childNodes: null
  },
  {
    id: null,
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '产前样审核',
    personInCharge:
      'ou_28be25630897ab79742d7c4a1507eba8,ou_8dfeaa27803c1a7e6a055d87dbc0270d,ou_499156f484ca5c4958f44e4f1afe8bc4',
    planStartTime: null,
    planEndTime: null,
    actualEndTime: null,
    remarks: null,
    docUrl: null,
    status: '0',
    finishStatus: null,
    isExamine: '1',
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_28be25630897ab79742d7c4a1507eba8.png","name":"胡玉豪","unionId":"on_312c8c8de5f1eb9fdf4e45485a121d42","userId":"ou_28be25630897ab79742d7c4a1507eba8"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_499156f484ca5c4958f44e4f1afe8bc4.png","name":"周世鹏","unionId":"on_fe65be38a4619a1504120e24c1e6efdf","userId":"ou_499156f484ca5c4958f44e4f1afe8bc4"}]',
    examineInfo: null,
    nodeCode: 'PreProductionSampleAudit',
    submitPerson: null,
    submitPersonList: '[]',
    waitTime: '- 分钟',
    flagName: null,
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'QAQualificationExamine,ProcurementNotice',
    nextNodeCode: 'PaperDocumentArchiving',
    childNodes: null
  },
  {
    id: null,
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '资料归档',
    personInCharge:
      'ou_8dfeaa27803c1a7e6a055d87dbc0270d,ou_99db3ca8927d0097d3f04fdf4bff568e,ou_a83797eefce85cb6ee7aa2f4df4129ea',
    planStartTime: null,
    planEndTime: null,
    actualEndTime: null,
    remarks: null,
    docUrl: null,
    status: '0',
    finishStatus: null,
    isExamine: '0',
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_99db3ca8927d0097d3f04fdf4bff568e.png","name":"刘蒋","unionId":"on_db2903ee10afd13e836ae73b33dfe307","userId":"ou_99db3ca8927d0097d3f04fdf4bff568e"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    examineInfo: null,
    nodeCode: 'PaperDocumentArchiving',
    submitPerson: null,
    submitPersonList: '[]',
    waitTime: '- 分钟',
    flagName: null,
    weeklyRest: 'seven',
    durationUnit: 'hour',
    basisDuration: 2,
    preNodeCode: 'PreProductionSampleAudit',
    nextNodeCode: 'VisualTimeFilling',
    childNodes: null
  },
  {
    id: null,
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '视觉时间确认',
    personInCharge:
      'ou_8dfeaa27803c1a7e6a055d87dbc0270d,ou_99db3ca8927d0097d3f04fdf4bff568e,ou_a83797eefce85cb6ee7aa2f4df4129ea',
    planStartTime: null,
    planEndTime: null,
    actualEndTime: null,
    remarks: null,
    docUrl: null,
    status: '0',
    finishStatus: null,
    isExamine: '0',
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_99db3ca8927d0097d3f04fdf4bff568e.png","name":"刘蒋","unionId":"on_db2903ee10afd13e836ae73b33dfe307","userId":"ou_99db3ca8927d0097d3f04fdf4bff568e"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    examineInfo: null,
    nodeCode: 'VisualTimeFilling',
    submitPerson: null,
    submitPersonList: '[]',
    waitTime: '- 分钟',
    flagName: null,
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'PaperDocumentArchiving',
    nextNodeCode: 'OperationTimeFilling',
    childNodes: null
  },
  {
    id: null,
    company: null,
    isDeleted: null,
    createdAt: null,
    createdId: null,
    updatedAt: null,
    updatedId: null,
    companyName: null,
    recordChangeDataFlag: false,
    jsonData: null,
    npProgressTemplateNodeId: null,
    npDesignPictureGodownId: '3004d370-0a64-48a8-afee-3d77c11affe6',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: '5de8570b-a12d-48a2-a918-9bf4b78d02b0',
    enterprisePlanId: '087f0b86-c8fd-43b1-aee9-5d031b60c0fb',
    nodeName: '运营时间确认',
    personInCharge: '',
    planStartTime: null,
    planEndTime: null,
    actualEndTime: null,
    remarks: null,
    docUrl: null,
    status: '0',
    finishStatus: null,
    isExamine: '0',
    nodeStatus: null,
    personInChargeList: '[]',
    examineInfo: null,
    nodeCode: 'OperationTimeFilling',
    submitPerson: null,
    submitPersonList: '[]',
    waitTime: '- 分钟',
    flagName: null,
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'VisualTimeFilling',
    nextNodeCode: '1',
    childNodes: null
  }
]
