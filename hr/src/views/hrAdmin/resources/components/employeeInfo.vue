<template>
  <div>
    <div class="moduleForm" v-for="(sectionItem, index) in infoObj()" :key="index">
      <Section :title="sectionItem.title" />
      <div class="wrap">
        <div
          class="wrap-item"
          v-for="(item, itemIndex) in sectionItem.list"
          :key="itemIndex"
          :class="{ 'wrap-item-oneRow': item.isOneRow === true }"
        >
          <div class="wrap-item-title">{{ item.name }}</div>
          <div
            class="wrap-item-content"
            :class="{ 'wrap-item-content-oneRow': item.isOneRow === true }"
          >
            <el-tooltip
              v-if="item.isOneRow === false && item.value.length > 17"
              effect="dark"
              :content="item.value"
              placement="top-start"
            >
              <div class="wrap-item-content-text single-line"> {{ item.value }}</div>
            </el-tooltip>
            <div v-else class="wrap-item-content-text single-line"> {{ item.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'

import Section from './section.vue'

const props = defineProps({
  data: propTypes.object.def({}),
  type: propTypes.string.def('')
})

const infoObj = () => {
  const allData = {
    employInfo: [
      {
        title: '系统字段',
        list: systemFieldList()
      },
      {
        title: '上级',
        list: superiorList()
      },
      {
        title: '职位',
        list: jobList()
      },
      {
        title: '账户',
        list: accountList()
      }
    ],
    employReleation: [
      {
        title: '转正',
        list: conversionList()
      },
      {
        title: '离职',
        list: departList()
      },
      {
        title: '合同',
        list: contractList()
      },
      {
        title: '取消入职',
        list: cancelOnboardingList()
      }
    ],
    employBackground: [
      {
        title: '联系人',
        list: contactList()
      },
      {
        title: '最高学历',
        list: highestLevelList()
      },
      {
        title: '工作经历',
        list: formerWorkList()
      }
    ]
  }
  return allData[`${props.type}`]
}

//系统字段
const systemFieldList = () => {
  return [
    {
      name: '工号',
      value: props.data.employeeId || '--',
      isOneRow: false
    },
    {
      name: '中文名',
      value: props.data.name || '--',
      isOneRow: false
    },
    {
      name: '部门',
      value: props.data.departmentName || '--',
      isOneRow: false
    },
    {
      name: '邮箱',
      value: props.data.email || '--',
      isOneRow: false
    },
    {
      name: '手机号码',
      value: props.data.mobile || '--',
      isOneRow: false
    },
    {
      name: '工作地点名称',
      value: props.data.workLocationName || '--',
      isOneRow: false
    },
    {
      name: '性别',
      value: getDictLabel(DICT_TYPE.FEISHU_GENDER, props.data.gender) || '--',
      isOneRow: false
    },
    {
      name: '出生日期',
      value: props.data.birthday || '--',
      isOneRow: false
    },
    {
      name: '籍贯名称',
      value: props.data.nativeRegionName || '--',
      isOneRow: false
    },
    {
      name: '民族',
      value: getDictLabel(DICT_TYPE.FEISHU_ETHNICITY, props.data.ethnicity) || '--',
      isOneRow: false
    },
    {
      name: '婚姻状况',
      value: getDictLabel(DICT_TYPE.FEISHU_MATERITAL_STATUS, props.data.maritalStatus) || '--',
      isOneRow: false
    },
    {
      name: '政治面貌',
      value: getDictLabel(DICT_TYPE.FEISHU_POLITICAL_STATUS, props.data.politicalStatus) || '--',
      isOneRow: false
    },
    {
      name: '参加工作日期',
      value: props.data.enteredWorkforceDate || '--',
      isOneRow: false
    },
    {
      name: '证件类型',
      value: getDictLabel(DICT_TYPE.FEISHU_ID_TYPE, props.data.idType) || '--',
      isOneRow: false
    },
    {
      name: '证件号',
      value: props.data.idNumber || '--',
      isOneRow: false
    },
    {
      name: '户口类型',
      value: getDictLabel(DICT_TYPE.FEISHU_HUKOU_TYPE, props.data.hukouType) || '--',
      isOneRow: false
    },

    {
      name: '人员类型',
      value: getDictLabel(DICT_TYPE.FEISHU_EMPLOYOEE_TYPE, props.data.employeeType) || '--',
      isOneRow: false
    },
    {
      name: '员工状态',
      value: getDictLabel(DICT_TYPE.FEISHU_STATUS, props.data.status) || '--',
      isOneRow: false
    },
    {
      name: '个人邮箱',
      value: props.data.personalEmail || '--',
      isOneRow: false
    },
    {
      name: '入职登记表状态',
      value:
        getDictLabel(DICT_TYPE.FEISHU_EMPLOY_FORM_STATUS, props.data.employeeFormStatus) || '--',
      isOneRow: false
    },
    {
      name: '入职日期',
      value: props.data.hireDate || '--',
      isOneRow: false
    },
    {
      name: '家庭地址',
      value: props.data.familyAddress || '--',
      isOneRow: true
    },
    {
      name: '户口所在地',
      value: props.data.hukouLocation || '--',
      isOneRow: true
    }
  ]
}

// 上级
const superiorList = () => {
  return [
    {
      name: '上级 中文名',
      value: props.data.managerName || '--',
      isOneRow: false
    },
    {
      name: '上级 英文名',
      value: props.data.managerEnName || '--',
      isOneRow: false
    }
  ]
}

// 职位
const jobList = () => {
  return [
    {
      name: '职位名称',
      value: props.data.jobName || '--',
      isOneRow: false
    },
    {
      name: '职级名称',
      value: props.data.jobLevelName || '--',
      isOneRow: false
    }
  ]
}

// 账户
const accountList = () => {
  return [
    {
      name: '银行卡号',
      value: props.data.bankAccountNumber || '--',
      isOneRow: false
    },
    {
      name: '开户行',
      value: props.data.bankName || '--',
      isOneRow: false
    },
    {
      name: '社保账号',
      value: props.data.socialSecurityAccount || '--',
      isOneRow: false
    },
    {
      name: '公积金账号',
      value: props.data.providentFundAccount || '--',
      isOneRow: false
    }
  ]
}

// 转正
const conversionList = () => {
  return [
    {
      name: '试用期（月）',
      value: props.data.probationMonths || '--',
      isOneRow: false
    },
    {
      name: '转正日期',
      value: props.data.conversionDate || '--',
      isOneRow: false
    },
    {
      name: '转正申请',
      value: getDictLabel(DICT_TYPE.FEISHU_APPLICATION, props.data.application) || '--',
      isOneRow: false
    },
    {
      name: '转正状态',
      value:
        getDictLabel(DICT_TYPE.FEISHU_APPLICATION_STATUS, props.data.applicationStatus) || '--',
      isOneRow: false
    }
  ]
}

// 离职
const departList = () => {
  return [
    {
      name: '离职日期',
      value: props.data.lastDay || '--',
      isOneRow: false
    },

    {
      name: '离职类型',
      value: getDictLabel(DICT_TYPE.FEISHU_DEPARTURE_TYPE, props.data.departureType) || '--',
      isOneRow: false
    },
    {
      name: '离职原因',
      value: getDictLabel(DICT_TYPE.FEISHU_DEPARTURE_REASON, props.data.departureReason) || '--',
      isOneRow: false
    },
    {
      name: '离职备注',
      value: props.data.departureNotes || '--',
      isOneRow: false
    }
  ]
}

// 合同
const contractList = () => {
  return [
    {
      name: '合同公司',
      value: props.data.contractCompanyName || '--',
      isOneRow: false
    },

    {
      name: '合同类型',
      value: getDictLabel(DICT_TYPE.FEISHU_CONTRACT_TYPE, props.data.feishu_contract_type) || '--',
      isOneRow: false
    },
    {
      name: '合同开始日期',
      value: props.data.contractStartDate || '--',
      isOneRow: false
    },
    {
      name: '合同到期日期',
      value: props.data.contractExpirationDate || '--',
      isOneRow: false
    },
    {
      name: '劳动合同签订次数',
      value: props.data.contractSignTimes || '--',
      isOneRow: false
    }
  ]
}

// 取消入职
const cancelOnboardingList = () => {
  return [
    {
      name: '取消入职原因',
      value:
        getDictLabel(
          DICT_TYPE.FEISHU_CANCEL_ONBOARDING_REASON,
          props.data.cancelOnboardingReason
        ) || '--',
      isOneRow: false
    },
    {
      name: '取消入职备注',
      value: props.data.cancelOnboardingNotes || '--',
      isOneRow: false
    }
  ]
}

//联系人
const contactList = () => {
  return [
    {
      name: '主要紧急联系人姓名',
      value: props.data.primaryEmergencyContactName || '--',
      isOneRow: false
    },
    {
      name: '与主要紧急联系人的关系',
      value:
        getDictLabel(DICT_TYPE.FEISHU_RELEATION, props.data.primaryEmergencyContactRelationship) ||
        '--',
      isOneRow: false
    },
    {
      name: '主要紧急联系人手机号码',
      value: props.data.primaryEmergencyContactMobile || '--',
      isOneRow: false
    }
  ]
}

//最高学历
const highestLevelList = () => {
  return [
    {
      name: '最高学历',
      value: getDictLabel(DICT_TYPE.FEISHU_LEVEL, props.data.highestLevelOfEduLevel) || '--',
      isOneRow: false
    },
    {
      name: '最高学历毕业学校',
      value: props.data.highestLevelOfEduSchool || '--',
      isOneRow: false
    },
    {
      name: '最高学历专业',
      value: props.data.highestLevelOfEduMajor || '--',
      isOneRow: false
    },
    {
      name: '最高学历学位',
      value: getDictLabel(DICT_TYPE.FEISHU_DEGREE, props.data.highestLevelOfEduDegree) || '--',
      isOneRow: false
    },
    {
      name: '最高学历开始日期',
      value: props.data.highestLevelOfEduStart || '--',
      isOneRow: false
    },
    {
      name: '最高学历结束日期',
      value: props.data.highestLevelOfEduEnd || '--',
      isOneRow: false
    }
  ]
}

//工作经历
const formerWorkList = () => {
  return [
    {
      name: '前工作经历-公司',
      value: props.data.formerWorkExpCompany || '--',
      isOneRow: false
    },
    {
      name: '前工作经历-部门',
      value: props.data.formerWorkExpDepartment || '--',
      isOneRow: false
    },
    {
      name: '前工作经历-职位',
      value: props.data.formerWorkExpJob || '--',
      isOneRow: false
    },
    {
      name: '前工作经历-开始日期',
      value: props.data.formerWorkExpStart || '--',
      isOneRow: false
    },
    {
      name: '前工作经历-截止日期',
      value: props.data.formerWorkExpEnd || '--',
      isOneRow: false
    },
    {
      name: '前工作经历-工作描述',
      value: props.data.formerWorkExpDescription || '--',
      isOneRow: false
    }
  ]
}
</script>

<style lang="scss" scoped>
.moduleForm {
  background: #ffffff;
  border-radius: 8px;
  margin-bottom: 10px;

  .wrap {
    margin-top: 13px;
    margin-left: 20px;
    margin-right: 0px;
    display: flex;
    flex-wrap: wrap;
    &-item {
      width: 295px;
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;

      &-oneRow {
        width: 848px;
      }
      &-title {
        font-size: 12px;
        color: #999999;
        line-height: 20px;
      }
      &-content {
        margin-top: 10px;
        width: 260px;
        height: 32px;
        background: rgba(241, 245, 248, 0.4);
        border-radius: 4px;
        &-text {
          padding-left: 12px;
          font-size: 14px;
          color: #666666;
          line-height: 32px;
        }
        &-oneRow {
          width: 848px;
        }
      }
    }
  }
}
</style>
