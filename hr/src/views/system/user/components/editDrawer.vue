<template>
  <div style="border-radius: 16px; overflow: hidden">
    <el-drawer
      v-model="drawerVisible"
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
          <div class="drawerTitle">{{ drawerTitle }}</div>
          <img
            src="@/assets/imgs/system/fieldManageConfig/close.png"
            class="close"
            @click="reset"
          />
        </div>
        <div class="content" v-loading="loading">
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
                      <div class="name">{{ userBasicInfo.userName }}</div>
                      <div class="employeeNo">{{ userBasicInfo.employeeNo || '-' }}</div>
                    </div>
                    <div class="center">
                      <div class="job">
                        <span>{{ userBasicInfo.departmentName || '-' }}</span
                        >-<span>{{ userBasicInfo.jobName || '-' }}</span>
                      </div>
                    </div>
                    <div class="bottom">
                      <div class="company">{{ getCompanyName(userBasicInfo.company) || '-' }}</div>
                    </div>
                  </div>
                  <div class="right">
                    <div class="avatar">
                      <img :src="userBasicInfo.avatarOrigin" v-if="userBasicInfo.avatarOrigin" />
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
                    <div class="content" v-if="fixedAssetList.length">
                      <div class="row" v-for="(data, index) in fixedAssetList" :key="index">
                        <div class="col">{{ data.name }}</div>
                        <div class="col">{{ data.number }}</div>
                        <div class="col">{{ translateArea(data) }}</div>
                      </div>
                    </div>
                    <div class="empty" v-else>
                      <div>暂无数据</div>
                    </div>
                  </el-scrollbar>
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
                    <el-button class="btn" @click.stop="openStoreRange">维护店铺</el-button>
                  </div>
                  <div class="list">
                    <div class="title">店铺</div>
                    <el-tree
                      style="width: 100%; border-radius: 8px"
                      :data="permitStoreList"
                      :props="defaultProps"
                      empty-text="暂无数据"
                      v-loading="storeLoading"
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
                    <el-button class="btn" @click.stop="openRoleRange">维护权限</el-button>
                  </div>
                  <div class="list">
                    <div class="title">权限</div>
                    <el-tree
                      style="width: 100%; border-radius: 8px"
                      :data="permitRoleList"
                      :props="defaultProps"
                      empty-text="暂无数据"
                      v-loading="roleLoading"
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
        </div>
      </el-scrollbar>
    </el-drawer>
  </div>

  <!-- 店铺选择 -->
  <StoreRange ref="storeRangeRef" @submit="onRangeUseSubmit" :showAllChannel="false" />

  <!-- 角色选择 -->
  <RoleRange ref="roleRangeRef" @submit="onRoleRangeUseSubmit" />
</template>
<script lang="ts" setup>
import * as UserApi from '@/api/system/user'
import assetSvg from '@/assets/imgs/system/user/asset.svg'
// import defaultAvatar from '@/assets/imgs/avatar_logo.png'
import arrowUp from '@/assets/imgs/system/user/arrowUp.svg'
import arrowDown from '@/assets/imgs/system/user/arrowDown.svg'
import { getChannelNameById, getImageUrl } from '@/utils/index'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
const message = useMessage() // 消息弹窗

const scrollRef = ref()
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题

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
const loading = ref(false)
const userBasicInfo = ref({
  userName: '',
  userId: '',
  avatarOrigin: '',
  employeeNo: '',
  departmentName: '',
  jobName: '',
  company: ''
})
// 是否是查看、是否是编辑
const isShow = ref(false)
const isEdit = ref(false)
// 固定资产列表
const fixedAssetList = ref<any>([])
// 权限店铺列表
const permitStoreList = ref<any>([])
const permitStores = ref<any>([]) // 用于回显
const storeLoading = ref(false)
// 权限角色列表
const permitRoleList = ref<any>([])
const permitRoles = ref<any>([]) // 用于回显
const roleLoading = ref(false)
//tree
const defaultProps = {
  children: 'children',
  label: 'name'
}

// 店铺权限
const storeRangeRef = ref()
const openStoreRange = () => {
  storeRangeRef.value?.open(permitStores.value.join(','), 'storeCode')
}
const onRangeUseSubmit = async (val) => {
  const params = ref({
    id: userBasicInfo.value.userId,
    store: ''
  })
  if (val.checkList.length) {
    console.log(val.checkList.map((el) => el.storeCode))
    params.value.store = val.checkList.map((el) => el.storeCode).join(',')
  }
  await UserApi.updateUserStore(params.value)
  message.success('店铺维护成功')
  getStoreList(userBasicInfo.value.userId)
}
// 维护权限
const roleRangeRef = ref()
const openRoleRange = () => {
  roleRangeRef.value?.open(permitRoles.value)
}
const onRoleRangeUseSubmit = async (val) => {
  const params = ref({
    userId: userBasicInfo.value.userId,
    permissionIds: []
  })
  if (val.checkList.length) {
    console.log(val.checkList)
    params.value.permissionIds = val.checkList.map((el) => el.id)
  }
  await UserApi.updateUserRole(params.value)
  message.success('角色维护成功')
  getRoleList(userBasicInfo.value.userId)
}
// 权限店铺列表
const getStoreList = async (id) => {
  try {
    storeLoading.value = true
    const storeList = await UserApi.getStoreByUserId(id)

    permitStoreList.value =
      Object.keys(storeList).map((el) => {
        return {
          name: el,
          children: storeList[el]
        }
      }) || []
    permitStores.value = []
    Object.keys(storeList).forEach((el) => {
      storeList[el].forEach((store) => {
        permitStores.value.push(store.code)
      })
    })
  } finally {
    storeLoading.value = false
  }
}
// 角色列表
const getRoleList = async (id) => {
  try {
    roleLoading.value = true
    const roleList = (await UserApi.getRolePermissionByUserId(id)) || []

    permitRoleList.value =
      Object.keys(roleList).map((el) => {
        return {
          name: el,
          children: roleList[el]
        }
      }) || []
    permitRoles.value = []
    Object.keys(roleList).forEach((el) => {
      roleList[el].forEach((role) => {
        permitRoles.value.push(role)
      })
    })
  } finally {
    roleLoading.value = false
  }
}

/** 打开drawer */
const open = async (type: string, id?: string, accountType?: string) => {
  drawerVisible.value = true
  drawerTitle.value = '个人信息'
  loading.value = true
  try {
    if (accountType === '1') {
      const data = await UserApi.getFeishuUserInfo(id)
      userBasicInfo.value = {
        userName: data.name,
        userId: data.userId,
        avatarOrigin: data.avatarOrigin,
        employeeNo: data.employeeNo,
        departmentName: data.departmentName,
        jobName: data.jobName,
        company: data.company
      }
    } else {
      const data = await UserApi.getSystemUserInfo(id)
      userBasicInfo.value = {
        userName: data.username,
        userId: data.id,
        avatarOrigin: data.avatarUrl,
        employeeNo: '',
        departmentName: data.departmentName,
        jobName: data.jobName,
        company: data.company
      }
    }
    // 固定资产列表
    const res = await UserApi.getFixedAsset(id)
    fixedAssetList.value = res || []
    // 店铺
    getStoreList(id)
    // 权限角色列表
    getRoleList(id)
  } finally {
    loading.value = false
  }

  if (type === 'update') {
    // 编辑
    isShow.value = false
    isEdit.value = true
  } else {
    // 查看
    isShow.value = true
    isEdit.value = false
  }
}
defineExpose({ open })
const emits = defineEmits(['success'])
const reset = () => {
  drawerVisible.value = false
  fixedAssetList.value = []
  permitStoreList.value = []
  permitStores.value = []
  permitRoleList.value = []
  permitRoles.value = []

  emits('success')
}
</script>

<style lang="less" scoped>
@import '@/views/system/user/style/drawer.scss';
</style>
