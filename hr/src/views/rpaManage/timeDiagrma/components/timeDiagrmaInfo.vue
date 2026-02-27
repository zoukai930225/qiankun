<template>
  <div>
    <div class="moduleForm" v-for="(sectionItem, index) in infoObj()" :key="index">
      <Section v-if="sectionItem.title" :title="sectionItem.title" />
      <div v-else style="height: 1px"></div>
      <div class="wrap">
        <div
          class="wrap-item"
          v-for="(item, itemIndex) in sectionItem.list"
          :key="itemIndex"
          :class="{ 'wrap-item-oneRow': item.isOneRow === true }"
        >
          <div class="row">
            <div v-if="item.required" class="wrap-item-titleRequied">*</div>
            <div class="wrap-item-title">{{ item.name }}</div>
          </div>

          <div v-if="item.showFullText" class="wrap-item-fullContent">
            <div class="wrap-item-fullContent-text"> {{ item.value }}</div>
          </div>
          <div
            v-else
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
            <div v-else class="wrap-item-content-text single-line1"> {{ item.value }}</div>
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
  type: propTypes.string.def('static'), //static 静态 dynamic 动态
  tab: propTypes.string.def('') // basic 基础 rpa
})

const infoObj = () => {
  if (props.type === 'dynamic') {
    return [
      {
        title: '请求信息',
        list: requestList()
      },
      {
        title: '返回信息',
        list: responseList()
      }
    ]
  } else {
    const allData = {
      basic: [{ title: '', list: fieldList() }, ...subRpaList()],
      rpa: [
        {
          title: '',
          list: rpaInfoList()
        },
        {
          title: '关联账号信息',
          list: linkAccountList()
        },
        {
          title: '节点信息展示',
          list: linkNodeList()
        }
      ]
    }
    return allData[`${props.tab}`]
  }
}

const subRpaList = () => {
  let list = []
  if (props.data.skTabulates && props.data.skTabulates.length > 0) {
    props.data.skTabulates.forEach((item) => {
      list.push({ title: '子程序', list: getSubRapFieldList(item) })
    })
  }
  return list
}

const getSubRapFieldList = (value: any) => {
  return [
    {
      name: '应用类型',
      value: value.type || '--',
      isOneRow: false,
      required: true
    },
    {
      name: '应用名称',
      value: value.skName || '--',
      isOneRow: false,
      required: true
    },
    {
      name: '应用编码',
      value: value.serviceCode || '--',
      isOneRow: false,
      required: true
    }
  ]
}

//字段
const fieldList = () => {
  return [
    {
      name: '应用名称',
      value: props.data.name || '--',
      isOneRow: false,
      required: true
    },
    {
      name: '应用编码',
      value: props.data.code || '--',
      isOneRow: false,
      required: true
    },
    {
      name: '应用类型',
      value: props.data.type || '--',
      isOneRow: false,
      required: true
    },
    {
      name: '影刀任务UUID',
      value: props.data.yingdaoTaskUuid || '--',
      isOneRow: false,
      required: false
    }
  ]
}
//RPA类信息
const rpaInfoList = () => {
  return [
    {
      name: '应用UUID',
      value: props.data.yingdaoAppUuid || '--',
      isOneRow: false
    },
    {
      name: '应用名称',
      value: props.data.yingdaoAppName || '--',
      isOneRow: false
    },
    {
      name: '运行环境',
      value: getDictLabel(DICT_TYPE.SYSTEM_PARAM_PROGRAM, props.data.runEnvironment) || '--',
      isOneRow: false
    },
    {
      name: 'RPA程序类型',
      value: getDictLabel(DICT_TYPE.RPA_PROGRAM_TYPE, props.data.rpaType) || '--',
      isOneRow: false
    },
    {
      name: '浏览器',
      value: getDictLabel(DICT_TYPE.YINGDAO_BROWSER, props.data.browser) || '--',
      isOneRow: false
    },
    {
      name: 'cron表达式',
      value: props.data.cron || '--',
      isOneRow: false
    },
    {
      name: '备注',
      value: props.data.remark || '--',
      isOneRow: true
    }
  ]
}

// 关联账号信息
const linkAccountList = () => {
  return [
    {
      name: '关联账号',
      value: props.data.account || '--',
      isOneRow: false
    },
    {
      name: '店铺名称',
      value: props.data.storeName || '--'
    },
    {
      name: '关联名称',
      value: props.data.manageName || '--'
    },
    {
      name: '平台',
      value:
        getDictLabel(DICT_TYPE.LOGIN_ACCOUNT_PLATFORM, props.data.platform) ||
        props.data.platform ||
        '--'
    }
  ]
}

// 节点信息展示
const linkNodeList = () => {
  return [
    {
      name: '机器人名称',
      value: props.data.robotClientName || '--',
      isOneRow: false
    },
    {
      name: '机器人uuid',
      value: props.data.robotClientUuid || '--'
    },
    {
      name: '机器人状态',
      value: props.data.robotClientStatus || '--'
    },
    {
      name: '服务器名称',
      value: props.data.machineName || '--'
    },
    {
      name: '服务器IP',
      value: props.data.clientIp || '--'
    },
    {
      name: '服务器账号',
      value: props.data.windowsUserName || '--'
    },
    {
      name: '服务器密码',
      value: props.data.windowsPassWord || '--'
    },
    {
      name: '影刀登录账',
      value: props.data.loginUserName || '--'
    },
    {
      name: '影刀登录密码',
      value: props.data.loginPassWord || '--'
    },
    {
      name: '节点简称',
      value: props.data.nickName || '--'
    },
    {
      name: '节点类型',
      value: props.data.nodeType || '--'
    },
    {
      name: 'todesk账号',
      value: props.data.todeskUserName || '--'
    },
    {
      name: 'todesk密码',
      value: props.data.todeskPassWord || '--'
    },
    {
      name: '迁移码',
      value: props.data.migrationCode || '--'
    },
    {
      name: '影刀应用路径',
      value: props.data.appsPath || '--'
    },
    {
      name: '影刀用户名',
      value: props.data.yingdaoUserName || '--'
    },
    {
      name: '机器人备注',
      value: props.data.description || '--'
    },
    {
      name: '备注',
      value: props.data.nodeRemark || '--'
    }
  ]
}
// 请求信息
const requestList = () => {
  return [
    {
      name: '请求节点',
      value: props.data.executeNode || '--',
      isOneRow: false
    },
    {
      name: '请求IP',
      value: props.data.remoteAddr || '--',
      isOneRow: false
    },
    {
      name: '请求文件',
      value: props.data.ossUrl || '--',
      isOneRow: false
    },
    {
      name: '请求入参数',
      value: props.data.requestParams || '--',
      isOneRow: true,
      showFullText: true
    },
    {
      name: '备注',
      value: props.data.remark || '--',
      isOneRow: true
    }
  ]
}

// 返回信息
const responseList = () => {
  return [
    {
      name: '返回结果',
      value: props.data.resultParams || '--',
      isOneRow: true,
      showFullText: true
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
      &-titleRequied {
        width: 8px;
        height: 20px;
        font-size: 12px;
        color: #eb1730;
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

      &-fullContent {
        margin-top: 10px;
        width: 848px;

        background: rgba(241, 245, 248, 0.4);
        border-radius: 4px;
        &-text {
          padding-left: 12px;
          font-size: 14px;
          color: #666666;
          line-height: 32px;
        }
      }
    }
  }
}
</style>
