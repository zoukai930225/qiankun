<template>
  <div style="border-radius: 16px; overflow: hidden">
    <el-drawer
      v-model="userDrawerStore.isOpen"
      :with-header="false"
      :wrapper-closable="true"
      :before-close="
        (done) => {
          done()
        }
      "
      class="drawer"
      size="936"
      @close="reset"
    >
      <el-scrollbar ref="scrollRef">
        <div class="row-center topView">
          <div class="drawerTitle">{{ userDrawerStore.title }}</div>
          <img
            src="@/assets/imgs/system/fieldManageConfig/close.png"
            class="close"
            @click="reset"
          />
        </div>
        <div class="content">
          <div class="drawerContent">
            <div class="drawerContent-title">
              <span class="line"></span>
              <span>基本信息</span>
            </div>
            <div class="drawerContent-content">
              <div class="userCard card">
                <div class="inner">
                  <div class="left">
                    <div class="top">
                      <div class="name">{{ userDrawerStore.userBasicInfo.userName }}</div>
                      <div class="employeeNo">{{
                        userDrawerStore.userBasicInfo.employeeNo || '-'
                      }}</div>
                    </div>
                    <div class="center">
                      <div class="job">
                        <span>{{ userDrawerStore.userBasicInfo.departmentName || '-' }}</span
                        >-<span>{{ userDrawerStore.userBasicInfo.jobName || '-' }}</span>
                      </div>
                    </div>
                    <div class="bottom">
                      <div class="company">{{
                        getCompanyName(userDrawerStore.userBasicInfo.company) || '-'
                      }}</div>
                    </div>
                  </div>
                  <div class="right">
                    <div class="avatar">
                      <img :src="userDrawerStore.userBasicInfo.avatarOrigin || defaultAvatar" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="assetCard card">
                <div class="header">
                  <img :src="assetSvg" />
                  <span>固定资产</span>
                </div>
                <div class="fixedTable">
                  <div class="title row">
                    <div class="col">品名</div>
                    <div class="col">编号</div>
                    <div class="col">区域</div>
                  </div>
                  <el-scrollbar height="65px">
                    <div class="content" v-if="userDrawerStore.fixedAssetList.length">
                      <div
                        class="row"
                        v-for="(data, index) in userDrawerStore.fixedAssetList"
                        :key="index"
                      >
                        <div class="col">{{ data.name }}</div>
                        <div class="col">{{ data.number }}</div>
                        <div class="col">{{ translateArea(data) }}</div>
                      </div>
                    </div>
                    <div class="empty" v-else style="height: 65px">
                      <div>暂无数据</div>
                    </div>
                  </el-scrollbar>
                </div>
              </div>
            </div>
          </div>
          <div class="drawerContent">
            <div class="drawerContent-title">
              <span class="line"></span>
              <span>其他</span>
            </div>
            <div class="drawerContent-content">
              <div class="permission store">
                <div class="header">
                  <div class="title">店铺</div>
                </div>
                <div class="list">
                  <div class="title">店铺</div>
                  <el-tree
                    style="width: 100%; border-radius: 8px"
                    :data="userDrawerStore.permitStoreList"
                    :props="defaultProps"
                    empty-text="暂无数据"
                  >
                    <template #default="{ node, data }">
                      <div class="treeData">
                        <div class="left">
                          <div class="channel" v-if="data.children">
                            <img :src="getImageUrl(data.name)" />
                            <span>{{ getChannelNameById(data.name) }}</span>
                          </div>
                          <div class="store" v-else>{{ data.name }}</div>
                        </div>
                        <div class="icon" v-if="data.children"
                          ><img :src="node.expanded ? arrowUp : arrowDown"
                        /></div>
                      </div>
                    </template>
                  </el-tree>
                </div>
              </div>
              <div class="permission role">
                <div class="header">
                  <div class="title">权限</div>
                  <!-- v-if="isEdit" -->
                </div>
                <div class="list">
                  <div class="title">权限</div>
                  <el-tree
                    style="width: 100%; border-radius: 8px"
                    :data="userDrawerStore.permitRoleList"
                    :props="defaultProps"
                    empty-text="暂无数据"
                  >
                    <template #default="{ node, data }">
                      <div class="treeData">
                        <div class="left">
                          <div class="store">{{ showPermissionName(data) }}</div>
                        </div>
                        <div class="icon" v-if="data.children"
                          ><img :src="node.expanded ? arrowUp : arrowDown"
                        /></div>
                      </div>
                    </template>
                  </el-tree>
                </div>
              </div>
            </div>
          </div>
          <div class="drawerContent">
            <div class="drawerContent-title">
              <span class="line"></span>
              <span>我的通知</span>
            </div>
            <div class="drawerContent-content"> </div>
          </div>
        </div>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import assetSvg from '@/assets/imgs/system/user/asset.svg'
import defaultAvatar from '@/assets/imgs/avatar_logo.png'
import arrowUp from '@/assets/imgs/system/user/arrowUp.svg'
import arrowDown from '@/assets/imgs/system/user/arrowDown.svg'
import { getChannelNameById, getImageUrl } from '@/utils/index'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'

// 固定资产 处理区域code
// 区域
const translateArea = (row) => {
  const Area = getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_OFFICE_AREA).find(
    (option) => option.value === row.area
  )
  return Area ? Area.label : row.area
}
/** 显示权限名称 */
const showPermissionName = (item) => {
  if (item.channel === 'ALL') {
    return `${item.name}-全部渠道`
  } else {
    if (item.channelName) {
      return `${item.name}-${item.channelName}`
    } else {
      return `${item.name}`
    }
  }
}
// 处理公司名称展示问题
const getCompanyName = (company) => {
  if (company === 'ALL') {
    return '全部'
  } else {
    return getDictLabel(DICT_TYPE.PR_COMPANY, company)
  }
}
import { useUserDrawerStore } from '@/store/modules/useUserDrawerStore'
const userDrawerStore = useUserDrawerStore()

//tree
const defaultProps = {
  children: 'children',
  label: 'name'
}

const reset = () => {
  userDrawerStore.close()
}
</script>

<style lang="less" scoped>
@import '@/views/system/user/style/drawer.scss';
</style>
