/*
 * @Date: 2025-01-03 18:26:34
 */

import progressDotBlue from '@/assets/imgs/oa/product/node/node_status_blue.png'
import progressDotGray from '@/assets/imgs/oa/product/node/node_status_gray.png'
import progressDotRed from '@/assets/imgs/oa/product/node/node_status_red.png'
import progressDotYellow from '@/assets/imgs/oa/product/node/node_status_yellow.png'

import { format } from 'date-fns'

import { useUserStore } from '@/store/modules/user'
import { forEach } from 'lodash-es'
import { nodeList } from '@/api/oa/new/templete'
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
  if (unit === '分钟') {
    return '#24BC29'
  } else if (unit === '小时') {
    return '#FFA300'
  } else if (unit === '天') {
    return '#FF4F4F'
  }
  return '#24BC29'
}

export const getNodeWaitTimeArr = (waitTime) => {
  return waitTime && waitTime.split(' ')
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
      0: '未开始',
      1: '已结束',
      2: '淘汰',
      3: '进行中'
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
  if (status === 0) {
    return progressDotGray
  } else if (status === 1) {
    return progressDotBlue
  } else if (status === 2) {
    return progressDotRed
  } else if (status === 3) {
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
          if (paralleNextNodeCode) {
            const tempChildNodes = []
            if (child.childNodes && child.childNodes.length > 0) {
              child.childNodes.forEach((subItem) => {
                if (subItem.nodeCode !== paralleNextNodeCode) {
                  tempChildNodes.push(subItem)
                }
              })
            }
            child.childNodes = tempChildNodes || []
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
    id: '567e2a88-4a56-485f-a661-8eaae1bdf20e',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '企划创建',
    personInCharge: '',
    planStartTime: null,
    planEndTime: null,
    actualEndTime: '2025-08-27 17:40:06',
    remarks: '个单方事故发个森岛帆高发',
    docUrl:
      'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/test/newProduct/c51c99c9-86f5-40e8-8514-9d6e58a70983.xlsx?name=定品资料 (1).xlsx,https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/test/newProduct/3eadb815-4d1f-4604-9751-3c2966789771.xlsx?name=定品资料 (3).xlsx',
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: null,
    personInChargeList: '[]',
    examineInfo: null,
    nodeCode: 'EnterPrisePlanCreate',
    submitPerson: 'ou_99db3ca8927d0097d3f04fdf4bff568e',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_99db3ca8927d0097d3f04fdf4bff568e.png","name":"刘蒋","unionId":"on_db2903ee10afd13e836ae73b33dfe307","userId":"ou_99db3ca8927d0097d3f04fdf4bff568e"}]',
    waitTime: null,
    flagName: '测试黄荣胜0827-勿动',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: '0',
    nextNodeCode: 'EnterPrisePlanExamineOne',
    childNodes: null
  },
  {
    id: 'da5c7bd4-40e3-4714-9498-e9c79b13d1dc',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '企划审核',
    personInCharge: 'on_db2903ee10afd13e836ae73b33dfe307,on_ca6d7398ce2bcd41e8e6fe7905a04da3',
    planStartTime: null,
    planEndTime: '2025-08-28 17:40:06',
    actualEndTime: '2025-08-27 17:41:25',
    remarks: '是大房',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '1',
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_99db3ca8927d0097d3f04fdf4bff568e.png","name":"刘蒋","unionId":"on_db2903ee10afd13e836ae73b33dfe307","userId":"ou_99db3ca8927d0097d3f04fdf4bff568e"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    examineInfo: null,
    nodeCode: 'EnterPrisePlanExamineOne',
    submitPerson: 'ou_99db3ca8927d0097d3f04fdf4bff568e',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_99db3ca8927d0097d3f04fdf4bff568e.png","name":"刘蒋","unionId":"on_db2903ee10afd13e836ae73b33dfe307","userId":"ou_99db3ca8927d0097d3f04fdf4bff568e"}]',
    waitTime: '1 分钟',
    flagName: '测试黄荣胜0827-勿动',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'EnterPrisePlanCreate',
    nextNodeCode: 'EnterPrisePlanExamineTwo',
    childNodes: null
  },
  {
    id: 'c3c3e187-57a0-4189-aaa0-6d2562995a1d',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '企划审核',
    personInCharge: 'on_6ae164fdb002bb5b65f90a8d2a4236c8,on_db2903ee10afd13e836ae73b33dfe307',
    planStartTime: null,
    planEndTime: '2025-08-28 17:41:25',
    actualEndTime: '2025-08-27 17:49:17',
    remarks: '不好吃',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '1',
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_99db3ca8927d0097d3f04fdf4bff568e.png","name":"刘蒋","unionId":"on_db2903ee10afd13e836ae73b33dfe307","userId":"ou_99db3ca8927d0097d3f04fdf4bff568e"}]',
    examineInfo: null,
    nodeCode: 'EnterPrisePlanExamineTwo',
    submitPerson: 'ou_99db3ca8927d0097d3f04fdf4bff568e',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_99db3ca8927d0097d3f04fdf4bff568e.png","name":"刘蒋","unionId":"on_db2903ee10afd13e836ae73b33dfe307","userId":"ou_99db3ca8927d0097d3f04fdf4bff568e"}]',
    waitTime: '7 分钟',
    flagName: '测试黄荣胜0827-勿动',
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
    id: 'c340a356-80ce-439b-b875-68606036b781',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '产研主管分配',
    personInCharge:
      'ou_28be25630897ab79742d7c4a1507eba8,ou_8dfeaa27803c1a7e6a055d87dbc0270d,ou_99db3ca8927d0097d3f04fdf4bff568e',
    planStartTime: null,
    planEndTime: '2025-08-27 19:49:17',
    actualEndTime: '2025-08-27 18:15:26',
    remarks: '',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_28be25630897ab79742d7c4a1507eba8.png","name":"胡玉豪","unionId":"on_312c8c8de5f1eb9fdf4e45485a121d42","userId":"ou_28be25630897ab79742d7c4a1507eba8"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_99db3ca8927d0097d3f04fdf4bff568e.png","name":"刘蒋","unionId":"on_db2903ee10afd13e836ae73b33dfe307","userId":"ou_99db3ca8927d0097d3f04fdf4bff568e"}]',
    examineInfo: null,
    nodeCode: 'DevelopManagerDistribution',
    submitPerson: 'ou_99db3ca8927d0097d3f04fdf4bff568e',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_99db3ca8927d0097d3f04fdf4bff568e.png","name":"刘蒋","unionId":"on_db2903ee10afd13e836ae73b33dfe307","userId":"ou_99db3ca8927d0097d3f04fdf4bff568e"}]',
    waitTime: '26 分钟',
    flagName: 'QT-NY-20250827-02',
    weeklyRest: 'seven',
    durationUnit: 'hour',
    basisDuration: 2,
    preNodeCode: 'EnterPrisePlanExamineTwo',
    nextNodeCode: 'DesignPictureUpload',
    childNodes: null
  },
  {
    id: '0229acfd-7b2d-4c16-96c8-37035737630b',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '设计图上传',
    personInCharge: null,
    planStartTime: null,
    planEndTime: '2025-08-28 18:15:26',
    actualEndTime: '2025-08-27 18:18:31',
    remarks: '发的鬼地方',
    docUrl:
      'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/test/visualApproval/681953300-787333000-943730046156.png',
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: null,
    personInChargeList: '[]',
    examineInfo: null,
    nodeCode: 'DesignPictureUpload',
    submitPerson: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    waitTime: '3 分钟',
    flagName: 'QT-NY-20250827-02-0001',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'DevelopManagerDistribution',
    nextNodeCode: 'DesignPictureExamine',
    childNodes: null
  },
  {
    id: '0f844081-7a8d-4630-8803-d474b311fd23',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '设计图审核',
    personInCharge: null,
    planStartTime: null,
    planEndTime: '2025-08-28 18:18:31',
    actualEndTime: '2025-08-27 18:19:11',
    remarks: '发德国',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '1',
    nodeStatus: null,
    personInChargeList: '[]',
    examineInfo: null,
    nodeCode: 'DesignPictureExamine',
    submitPerson: 'ou_99db3ca8927d0097d3f04fdf4bff568e',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_99db3ca8927d0097d3f04fdf4bff568e.png","name":"刘蒋","unionId":"on_db2903ee10afd13e836ae73b33dfe307","userId":"ou_99db3ca8927d0097d3f04fdf4bff568e"}]',
    waitTime: '<1 分钟',
    flagName: 'QT-NY-20250827-02-0001',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'DesignPictureUpload',
    nextNodeCode: 'SupplierChainSpecialistMatch',
    childNodes: null
  },
  {
    id: '4c5fe564-3352-442d-b53f-7178f45b1066',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '供应链开发分配',
    personInCharge:
      'ou_8dfeaa27803c1a7e6a055d87dbc0270d,ou_99db3ca8927d0097d3f04fdf4bff568e,ou_69748899f35ed7015541afaff10b1640',
    planStartTime: null,
    planEndTime: '2025-08-28 17:49:17',
    actualEndTime: '2025-08-27 17:49:40',
    remarks: '',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_99db3ca8927d0097d3f04fdf4bff568e.png","name":"刘蒋","unionId":"on_db2903ee10afd13e836ae73b33dfe307","userId":"ou_99db3ca8927d0097d3f04fdf4bff568e"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_69748899f35ed7015541afaff10b1640.png","name":"檀滢","unionId":"on_ebbda2700c61d5259514c6c41085cf9a","userId":"ou_69748899f35ed7015541afaff10b1640"}]',
    examineInfo: null,
    nodeCode: 'SupplierChainDistribution',
    submitPerson: 'ou_99db3ca8927d0097d3f04fdf4bff568e',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_99db3ca8927d0097d3f04fdf4bff568e.png","name":"刘蒋","unionId":"on_db2903ee10afd13e836ae73b33dfe307","userId":"ou_99db3ca8927d0097d3f04fdf4bff568e"}]',
    waitTime: '<1 分钟',
    flagName: 'QT-NY-20250827-02',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'EnterPrisePlanExamineTwo',
    nextNodeCode: 'SupplierChainSpecialistMatch',
    childNodes: null
  },
  {
    id: '8aa15167-f859-4932-9d66-1f4bb949282c',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '匹配供应商',
    personInCharge: null,
    planStartTime: null,
    planEndTime: '2025-08-28 18:19:11',
    actualEndTime: '2025-08-28 09:12:13',
    remarks: null,
    docUrl: null,
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: null,
    personInChargeList: '[]',
    examineInfo: null,
    nodeCode: 'SupplierChainSpecialistMatch',
    submitPerson: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    waitTime: '14.0 小时',
    flagName: null,
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'SupplierChainDistribution,DesignPictureExamine',
    nextNodeCode: 'SampleUpload',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '打样进度',
    personInCharge: '',
    planStartTime: null,
    planEndTime: '2025-08-29 09:12:13',
    actualEndTime: null,
    remarks: null,
    docUrl: null,
    status: '3',
    finishStatus: null,
    isExamine: '0',
    nodeStatus: null,
    personInChargeList: '[]',
    examineInfo: null,
    nodeCode: 'SampleUpload',
    submitPerson: null,
    submitPersonList: '[]',
    waitTime: null,
    flagName: null,
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'SupplierChainSpecialistMatch',
    nextNodeCode: 'ChooseMeeting',
    childNodes: null
  },
  {
    id: '7a48d759-8658-4bae-8355-81d29acfd16f',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '选品会',
    personInCharge: null,
    planStartTime: null,
    planEndTime: '2025-08-29 09:12:13',
    actualEndTime: '2025-08-28 09:14:54',
    remarks: '浸泡时间分割盘四氟垫片归纳怕代发噶披萨更怕搜嘎破损GDP啊四大金刚爬架省的跑',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: null,
    personInChargeList: '[]',
    examineInfo: null,
    nodeCode: 'ChooseMeeting',
    submitPerson: 'ou_99db3ca8927d0097d3f04fdf4bff568e',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_99db3ca8927d0097d3f04fdf4bff568e.png","name":"刘蒋","unionId":"on_db2903ee10afd13e836ae73b33dfe307","userId":"ou_99db3ca8927d0097d3f04fdf4bff568e"}]',
    waitTime: '- 分钟',
    flagName: 'QT-NY-20250827-02-0001',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'SampleUpload',
    nextNodeCode: 'ProductExamine',
    childNodes: null
  },
  {
    id: 'a1578d94-a8d4-4f7f-b1b1-2ebddf5303f6',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '产品审核',
    personInCharge: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    planStartTime: null,
    planEndTime: '2025-08-29 09:14:54',
    actualEndTime: '2025-08-28 09:15:38',
    remarks: '啊哈哈哈',
    docUrl: null,
    status: '1',
    finishStatus: '正常',
    isExamine: '1',
    nodeStatus: '1',
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    examineInfo:
      '[{"avatarOrigin": "https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png", "examineStatus": "1", "finishCreated": "2025-08-28 09:15:38", "examineNodeName": "何宏伟（审核）", "examineNodePerson": "ou_a83797eefce85cb6ee7aa2f4df4129ea", "examineNodeRemark": "啊哈哈哈", "examineNodePersonName": "黄荣胜"}]',
    nodeCode: 'ProductExamine',
    submitPerson: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    waitTime: '<1 分钟',
    flagName: 'QT-NY-20250827-02-0001',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'ChooseMeeting',
    nextNodeCode: 'RiskAssessReport',
    childNodes: null
  },
  {
    id: '981205e5-a564-4a27-b076-7f4ac752405e',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '风险评估报告',
    personInCharge: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    planStartTime: null,
    planEndTime: '2025-08-29 09:15:38',
    actualEndTime: '2025-08-28 09:15:51',
    remarks: '发噶东方红',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: '1',
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    examineInfo: null,
    nodeCode: 'RiskAssessReport',
    submitPerson: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    waitTime: '<1 分钟',
    flagName: 'QT-NY-20250827-02-0001',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'ProductExamine',
    nextNodeCode: 'ProductinformationFilling',
    childNodes: null
  },
  {
    id: 'c251e9dd-2e6f-4365-b6e3-41ac52b220d8',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '基本资料填写',
    personInCharge: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    planStartTime: null,
    planEndTime: '2025-08-28 13:15:51',
    actualEndTime: '2025-08-28 09:16:52',
    remarks: '奥古斯丁',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: '1',
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    examineInfo: null,
    nodeCode: 'ProductinformationFilling',
    submitPerson: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    waitTime: '1 分钟',
    flagName: 'QT-NY-20250827-02-0001',
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
    id: '26101370-cdb9-467c-8761-2d4fd72e065d',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: 'ERP资料填写',
    personInCharge: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    planStartTime: null,
    planEndTime: '2025-08-28 13:16:52',
    actualEndTime: '2025-08-28 09:27:45',
    remarks: '嘎嘎',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: '1',
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    examineInfo: null,
    nodeCode: 'ERPInformationFilling',
    submitPerson: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    waitTime: '10 分钟',
    flagName: 'QT-NY-20250827-02-0001',
    weeklyRest: 'seven',
    durationUnit: 'hour',
    basisDuration: 4,
    preNodeCode: 'ProductinformationFilling',
    nextNodeCode: 'OperationManagerDistribution',
    childNodes: null
  },
  {
    id: 'f9039fc2-8bd5-447f-913b-d18aa7794316',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '运营主管分配',
    personInCharge: 'ou_ba41b8a491445abf02691bfa9c22cdd4,ou_8dfeaa27803c1a7e6a055d87dbc0270d',
    planStartTime: null,
    planEndTime: '2025-08-28 11:27:45',
    actualEndTime: '2025-08-28 09:28:24',
    remarks: '阿三哥',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: '1',
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_ba41b8a491445abf02691bfa9c22cdd4.png","name":"许锋","unionId":"on_506e3b8391fcc69bd652f2454daaf1b4","userId":"ou_ba41b8a491445abf02691bfa9c22cdd4"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"}]',
    examineInfo: null,
    nodeCode: 'OperationManagerDistribution',
    submitPerson: 'ou_8dfeaa27803c1a7e6a055d87dbc0270d',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"}]',
    waitTime: '<1 分钟',
    flagName: 'QT-NY-20250827-02-0001',
    weeklyRest: 'seven',
    durationUnit: 'hour',
    basisDuration: 2,
    preNodeCode: 'ERPInformationFilling',
    nextNodeCode: 'OperationInformationFilling',
    childNodes: null
  },
  {
    id: '9e4102dd-ef05-4a69-aa58-4427ed863d4f',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '运营信息填写',
    personInCharge: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    planStartTime: null,
    planEndTime: '2025-08-29 09:28:24',
    actualEndTime: '2025-08-28 10:58:36',
    remarks: '葛大帅',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: '1',
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    examineInfo: null,
    nodeCode: 'OperationInformationFilling',
    submitPerson: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    waitTime: '1.0 小时',
    flagName: 'QT-NY-20250827-02-0001',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'OperationManagerDistribution',
    nextNodeCode: 'SupplyAndDemandPlan',
    childNodes: null
  },
  {
    id: 'eea8ebac-d274-4e9c-b893-348efa72139b',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '供需计划审核',
    personInCharge:
      'ou_a83797eefce85cb6ee7aa2f4df4129ea,ou_8dfeaa27803c1a7e6a055d87dbc0270d,ou_99db3ca8927d0097d3f04fdf4bff568e',
    planStartTime: null,
    planEndTime: '2025-08-29 10:58:36',
    actualEndTime: '2025-08-28 10:58:44',
    remarks: '啊广东省',
    docUrl: null,
    status: '1',
    finishStatus: '正常',
    isExamine: '1',
    nodeStatus: '1',
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_99db3ca8927d0097d3f04fdf4bff568e.png","name":"刘蒋","unionId":"on_db2903ee10afd13e836ae73b33dfe307","userId":"ou_99db3ca8927d0097d3f04fdf4bff568e"}]',
    examineInfo:
      '[{"avatarOrigin": "https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png", "examineStatus": "1", "finishCreated": "2025-08-28 10:58:44", "examineNodeName": "supply_examine", "examineNodePerson": "ou_a83797eefce85cb6ee7aa2f4df4129ea", "examineNodeRemark": "啊广东省", "examineNodePersonName": "黄荣胜"}]',
    nodeCode: 'SupplyAndDemandPlan',
    submitPerson: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    waitTime: '<1 分钟',
    flagName: 'QT-NY-20250827-02-0001',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'OperationInformationFilling',
    nextNodeCode: 'ConfirmProductDataExamine',
    childNodes: null
  },
  {
    id: '13603f71-abd8-4959-9e43-636ecfd5e31a',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '定品资料审批',
    personInCharge:
      'ou_a83797eefce85cb6ee7aa2f4df4129ea,ou_8dfeaa27803c1a7e6a055d87dbc0270d,ou_99db3ca8927d0097d3f04fdf4bff568e',
    planStartTime: null,
    planEndTime: '2025-08-29 10:58:44',
    actualEndTime: '2025-08-28 11:00:51',
    remarks: '',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '1',
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_99db3ca8927d0097d3f04fdf4bff568e.png","name":"刘蒋","unionId":"on_db2903ee10afd13e836ae73b33dfe307","userId":"ou_99db3ca8927d0097d3f04fdf4bff568e"}]',
    examineInfo:
      '[{"avatarOrigin": "https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png", "examineStatus": "1", "finishCreated": "2025-08-28 10:59:17", "examineNodeFile": "", "examineNodeName": "hhw_examine", "examineNodeOrder": 1, "examineNodePerson": "ou_a83797eefce85cb6ee7aa2f4df4129ea", "examineNodeRemark": "阿萨嘎嘎", "examineNodePersonName": "黄荣胜"}, {"avatarOrigin": "https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_99db3ca8927d0097d3f04fdf4bff568e.png", "examineStatus": "1", "finishCreated": "2025-08-28 11:00:06", "examineNodeFile": "", "examineNodeName": "wy_examine", "examineNodePerson": "ou_99db3ca8927d0097d3f04fdf4bff568e", "examineNodeRemark": "", "examineNodePersonName": "刘蒋"}, {"avatarOrigin": "https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png", "examineStatus": "1", "finishCreated": "2025-08-28 11:00:49", "examineNodeFile": "", "examineNodeName": "ysj_examine", "examineNodePerson": "ou_8dfeaa27803c1a7e6a055d87dbc0270d", "examineNodeRemark": "", "examineNodePersonName": "唐宗胜"}]',
    nodeCode: 'ConfirmProductDataExamine',
    submitPerson: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    waitTime: '2 分钟',
    flagName: 'QT-NY-20250827-02-0001',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'SupplyAndDemandPlan',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '采购主管分配',
    personInCharge:
      'ou_8dfeaa27803c1a7e6a055d87dbc0270d,ou_a9303cd61bee159a7291e3c473445f5a,ou_ba41b8a491445abf02691bfa9c22cdd4,3cf596d6-4d71-453b-b990-22c46fbff17b',
    planStartTime: null,
    planEndTime: '2025-08-29 11:00:51',
    actualEndTime: null,
    remarks: null,
    docUrl: null,
    status: '3',
    finishStatus: null,
    isExamine: '0',
    nodeStatus: null,
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png","name":"唐宗胜","unionId":"on_6ae164fdb002bb5b65f90a8d2a4236c8","userId":"ou_8dfeaa27803c1a7e6a055d87dbc0270d"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a9303cd61bee159a7291e3c473445f5a.png","name":"郑江宇","unionId":"on_5bee97a3a7686f70e08b36f56a1d5422","userId":"ou_a9303cd61bee159a7291e3c473445f5a"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_ba41b8a491445abf02691bfa9c22cdd4.png","name":"许锋","unionId":"on_506e3b8391fcc69bd652f2454daaf1b4","userId":"ou_ba41b8a491445abf02691bfa9c22cdd4"}]',
    examineInfo: null,
    nodeCode: 'PurchaseManagerDistribution',
    submitPerson: null,
    submitPersonList: '[]',
    waitTime: null,
    flagName: null,
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'ConfirmProductDataExamine',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
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
    id: '5c5c14c2-3fc4-467f-8a1e-3a63aa398cf2',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '产品资质提交',
    personInCharge: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    planStartTime: null,
    planEndTime: '2025-08-29 09:16:52',
    actualEndTime: '2025-08-28 09:27:18',
    remarks: '',
    docUrl: '',
    status: '1',
    finishStatus: '正常',
    isExamine: '0',
    nodeStatus: '1',
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    examineInfo: null,
    nodeCode: 'ProductQualificationSubmit',
    submitPerson: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    waitTime: '10 分钟',
    flagName: 'QT-NY-20250827-02-0001',
    weeklyRest: 'seven',
    durationUnit: 'day',
    basisDuration: 1,
    preNodeCode: 'ProductinformationFilling',
    nextNodeCode: 'QAQualificationExamine',
    childNodes: null
  },
  {
    id: 'bc0b0c91-cfdf-4175-8137-7e0a65334bdb',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: 'QA资质审核',
    personInCharge:
      'ou_a83797eefce85cb6ee7aa2f4df4129ea,ou_05c0a0e2ba395171e8f95bd3cc8e1449,ou_4e89adf51e4ce472fa3fe28c0413600f',
    planStartTime: null,
    planEndTime: '2025-08-29 09:27:18',
    actualEndTime: '2025-08-28 09:27:22',
    remarks: null,
    docUrl: null,
    status: '1',
    finishStatus: '正常',
    isExamine: '1',
    nodeStatus: '1',
    personInChargeList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_05c0a0e2ba395171e8f95bd3cc8e1449.png","name":"栗俐","unionId":"on_1694c0a3f1131a20748d759764814c4d","userId":"ou_05c0a0e2ba395171e8f95bd3cc8e1449"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_4e89adf51e4ce472fa3fe28c0413600f.png","name":"檀锐","unionId":"on_dad418d8669cd805536aa98179a6da0b","userId":"ou_4e89adf51e4ce472fa3fe28c0413600f"}]',
    examineInfo:
      '[{"avatarOrigin": "https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png", "examineStatus": "1", "finishCreated": "2025-08-28 09:27:22", "examineNodeName": "QA审核", "examineNodePerson": "ou_a83797eefce85cb6ee7aa2f4df4129ea", "examineNodePersonName": "黄荣胜"}]',
    nodeCode: 'QAQualificationExamine',
    submitPerson: 'ou_a83797eefce85cb6ee7aa2f4df4129ea',
    submitPersonList:
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"}]',
    waitTime: '<1 分钟',
    flagName: 'QT-NY-20250827-02-0001',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '产前样审核',
    personInCharge:
      'ou_a83797eefce85cb6ee7aa2f4df4129ea,ou_8ac04d8399a1e8dcdac7a09fd4fd2901,ou_97a1ffbf021f974d56ff14726a439418,ou_05c0a0e2ba395171e8f95bd3cc8e1449,ou_dd6bf6cb45b6cec63f0df076230ad76c',
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
      '[{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_a83797eefce85cb6ee7aa2f4df4129ea.png","name":"黄荣胜","unionId":"on_ca6d7398ce2bcd41e8e6fe7905a04da3","userId":"ou_a83797eefce85cb6ee7aa2f4df4129ea"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8ac04d8399a1e8dcdac7a09fd4fd2901.png","name":"许修霞","unionId":"on_c2fb3d67091123e1137130a475b645f0","userId":"ou_8ac04d8399a1e8dcdac7a09fd4fd2901"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_97a1ffbf021f974d56ff14726a439418.png","name":"李鹏","unionId":"on_4f46c970a9e29a1b156639266d313f14","userId":"ou_97a1ffbf021f974d56ff14726a439418"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_05c0a0e2ba395171e8f95bd3cc8e1449.png","name":"栗俐","unionId":"on_1694c0a3f1131a20748d759764814c4d","userId":"ou_05c0a0e2ba395171e8f95bd3cc8e1449"},{"avatarOrigin":"https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_dd6bf6cb45b6cec63f0df076230ad76c.png","name":"林君慧","unionId":"on_de1116ed2e8571fffa15516ad31be4ef","userId":"ou_dd6bf6cb45b6cec63f0df076230ad76c"}]',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '资料归档',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '视觉时间确认',
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
    npDesignPictureGodownId: '1b8fd7b9-350e-4d65-aa4c-e5820b6ee9ad',
    progressTemplateId: '67f6d6fa-bfa2-4ec0-bef0-e387a306f5c5',
    developmentPlanId: 'c0ef2f7f-351c-4e76-a1d5-975db56098e7',
    enterprisePlanId: '2a582ad1-429d-4a82-baea-9307af3c0f9d',
    nodeName: '运营时间确认',
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
