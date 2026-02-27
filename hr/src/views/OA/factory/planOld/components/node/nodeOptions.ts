import node_person_inprogress from '@/assets/imgs/oa/product/node/node_fenpei_yellow.svg'
import node_person_fail from '@/assets/imgs/oa/product/node/node_fenpei_red.svg'
import node_person_pass from '@/assets/imgs/oa/product/node/node_fenpei_blue.svg'
import node_person_init from '@/assets/imgs/oa/product/node/node_fenpei_balck.svg'

import node_upload_inprogress from '@/assets/imgs/oa/product/node/node_upload_yellow.svg'
import node_upload_fail from '@/assets/imgs/oa/product/node/node_upload_red.svg'
import node_upload_pass from '@/assets/imgs/oa/product/node/node_upload_blue.svg'
import node_upload_init from '@/assets/imgs/oa/product/node/node_upload_black.svg'

import node_audit_inprogress from '@/assets/imgs/oa/product/node/node_audit_yellow.svg'
import node_audit_fail from '@/assets/imgs/oa/product/node/node_audit_red.svg'
import node_audit_pass from '@/assets/imgs/oa/product/node/node_audit_blue.svg'
import node_audit_init from '@/assets/imgs/oa/product/node/node_audit_black.svg'

import node_supplier_inprogress from '@/assets/svgs/newProduct/node_supplier_orange.svg'
import node_supplier_fail from '@/assets/svgs/newProduct/node_supplier_red.svg'
import node_supplier_pass from '@/assets/svgs/newProduct/node_supplier_green.svg'
import node_supplier_init from '@/assets/svgs/newProduct/node_supplier_gray.svg'

import node_status_inprogress from '@/assets/imgs/oa/product/node/node_status_yellow.svg'
import node_status_fail from '@/assets/imgs/oa/product/node/node_status_red.svg'
import node_status_init from '@/assets/imgs/oa/product/node/node_status_black.svg'
import node_status_pass from '@/assets/imgs/oa/product/node/node_status_blue.svg'

/*
active 进行中
Completed 已完成
future 待处理
Deleted 审核拒绝,
pause: 暂定下单
*/
export const nodeStatusNameMap = {
  'future': {
    key: 'init',
    label: '未开始'
  },
  'Completed': {
    key: 'pass',
    label: '已结束'
  },
  'Deleted': {
    key: 'fail',
    label: '审核拒绝'
  },
  'active': {
    key: 'inprogress',
    label: '进行中'
  },
  'pause': {
    key: 'pause',
    label: '暂定下单'
  }
}

export const getNodeData = (node: any) => {
  if (node && node.status) {
    if (node.procurementConfirmStatus === 0) {
      return {
        type: nodeTypeNameMap[node.taskDefinitionKey],
        status: nodeStatusNameMap['pause'].key,
        label: nodeStatusNameMap['pause'].label
      }
    }
    return {
      type: nodeTypeNameMap[node.taskDefinitionKey],
      status: nodeStatusNameMap[node.status].key,
      label: nodeStatusNameMap[node.status].label
    }
  } else {
    return {
      type: undefined,
      status: undefined,
      label: undefined
    }
  }
}

export const nodeTypeNameMap = {
  'FactorySecondaryDevelopment': 'supplier',
  'FsDevPlanExamine': 'audit',
  'FsSupplierChainDistribution': 'person',
  'FsDevelopManagerDistribution': 'person',
  'FSSupplierChainSpecialistMatch': 'supplier',
  'FSQuotationVerification': 'audit',
  'FsSamplingProgress': 'audit',
  'FSSupplyAndDemandPlan': 'audit',
  'FSOrderInformationFill': 'audit',
  'FSPurchaseManagerDistribution': 'person',
  'FSProcurementNotice': 'person',
  'FSPPSampleUpload': 'audit',
  'FsProcurementConfirmation': 'audit',
  'FsOrderDistributionPersonnel': 'person'
}

export const iconMap = {
  'node_person_inprogress': node_person_inprogress,
  'node_person_fail': node_person_fail,
  'node_person_pass': node_person_pass,
  'node_person_init': node_person_init,
  'node_upload_inprogress': node_upload_inprogress,
  'node_upload_fail': node_upload_fail,
  'node_upload_pass': node_upload_pass,
  'node_upload_init': node_upload_init,
  "node_audit_inprogress": node_audit_inprogress,
  'node_audit_fail': node_audit_fail,
  'node_audit_pass': node_audit_pass,
  'node_audit_init': node_audit_init,
  'node_audit_pause': node_audit_init,
  'node_supplier_inprogress': node_supplier_inprogress,
  'node_supplier_fail': node_supplier_fail,
  'node_supplier_pass': node_supplier_pass,
  'node_supplier_init': node_supplier_init
}

export const statusMap = {
  'init': {
    color: `#666`,
    backgroundColor: `rgba(112, 112, 112, 0.1)`,
    borderColor: `#CECECE`,
    statusIcon: node_status_init,
    bgColor: 'rgba(249, 249, 249, 1)'
  },
  'pause': {
    color: `#666`,
    backgroundColor: `rgba(112, 112, 112, 0.1)`,
    borderColor: `#CECECE`,
    statusIcon: node_status_init,
    bgColor: 'rgba(249, 249, 249, 1)'
  },
  'inprogress': {
    color: `#FF8C00`,
    backgroundColor: `rgba(255,140,0,0.1)`,
    borderColor: `#FFECD4`,
    statusIcon: node_status_inprogress,
    bgColor: 'rgba(255, 250, 245, 1)'
  },
  'pass': {
    color: `#24BC29`,
    backgroundColor: `rgba(36,188,41,0.1)`,
    borderColor: `#D0EED2`,
    statusIcon: node_status_pass,
    bgColor: 'rgba(246, 253, 247, 1)'
  },
  'fail': {
    color: `#FF2020`,
    backgroundColor: `rgba(255,32,32,0.1)`,
    borderColor: `#FCD4D4`,
    statusIcon: node_status_fail,
    bgColor: 'rgba(255, 246, 246, 1)'
  },
}
import node_dotBg_init from '@/assets/svgs/newProduct/node_dotBg_gray.svg'
import node_dotBg_pass from '@/assets/svgs/newProduct/node_dotBg_green.svg'
import node_dotBg_inprogress from '@/assets/svgs/newProduct/node_dotBg_orange.svg'
import node_dotBg_fail from '@/assets/svgs/newProduct/node_dotBg_red.svg'


import node_tooltip_init from '@/assets/svgs/newProduct/node_tooltip_gray.svg'
import node_tooltip_pass from '@/assets/svgs/newProduct/node_tooltip_green.svg'
import node_tooltip_inprogress from '@/assets/svgs/newProduct/node_tooltip_orange.svg'
import node_tooltip_fail from '@/assets/svgs/newProduct/node_tooltip_red.svg'

export const dotStatusMap = {
  'init': {
    color: `#666`,
    backgroundColor: `rgba(185, 185, 185, 0.1)`,
    statusBg: node_dotBg_init,
    tooltipBg: node_tooltip_init
  },
  'inprogress': {
    color: `#EA8100`,
    backgroundColor: ` rgba(255, 163, 0, 0.1)`,
    statusBg: node_dotBg_inprogress,
    tooltipBg: node_tooltip_inprogress
  },
  'pass': {
    color: `#05975B`,
    backgroundColor: `rgba(36, 188, 41, 0.1)`,
    statusBg: node_dotBg_pass,
    tooltipBg: node_tooltip_pass
  },
  'fail': {
    color: `#FF0000`,
    backgroundColor: `rgba(255, 79, 79, 0.1)`,
    statusBg: node_dotBg_fail,
    tooltipBg: node_tooltip_fail
  },
  'pause': {
    color: `#666`,
    backgroundColor: `rgba(185, 185, 185, 0.1)`,
    statusBg: node_dotBg_init,
    tooltipBg: node_tooltip_init
  },
}


// 将字符串中的数字和文字分开
export const splitNum = (str: string) => {
  if (str) {
    const number = String(str).match(/\d+/g)
    const string = str.replace(/\d+/g, '')
    return {
      string,
      number: number ? number?.[0] === '0' ? '<1' : number[0] : null
    }
  } else {
    return {
      number: null,
      string: null
    }
  }
}

import dayjs from 'dayjs'
export const formatDateTime = (time: string) => {
  if (time) {
    return dayjs(time).format('YYYY-MM-DD HH:mm')
  } else {
    return '-'
  }

}

import nodeEndStatus_red from '@/assets/imgs/oa/node/node_endStatus_red.svg'
import nodeEndStatus_green from '@/assets/svgs/newProduct/node_endStatus_green.svg'

export const getEndStatusIcon = (node) => {
  if (getNodeData(node).status === 'pass') {
    if (node.overdue) {
      return nodeEndStatus_red
    } else {
      return nodeEndStatus_green
    }
  } else {
    return ''
  }
}