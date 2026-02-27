<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'

import avatarLogo from '@/assets/imgs/avatar_logo.png'
import { useDesign } from '@/hooks/web/useDesign'
import { useLockStore } from '@/store/modules/lock'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useUserStore } from '@/store/modules/user'
import LockDialog from './components/LockDialog.vue'
import LockPage from './components/LockPage.vue'

import * as UserApi from '@/api/system/user'
import arrowDown from '@/assets/imgs/system/user/arrowDown.svg'
import arrowUp from '@/assets/imgs/system/user/arrowUp.svg'
import infoSvg from '@/assets/imgs/system/user/info.svg'
import logoutSvg from '@/assets/imgs/system/user/logout.svg'
import { useUserDrawerStore } from '@/store/modules/useUserDrawerStore'
import { getChannelNameById, getImageUrl } from '@/utils/index'
const userDrawerStore = useUserDrawerStore()

defineOptions({ name: 'UserInfo' })

const { t } = useI18n()

const { replace } = useRouter()

const userStore = useUserStore()

const tagsViewStore = useTagsViewStore()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')

const avatarUrl = computed(() => userStore.user.avatarUrl || '')
const userName = computed(() => userStore.user.username || '')
const realName = computed(() => userStore.user.realName || '')
const userId = computed(() => userStore.user.id || '')

const shopTagList = computed(() => {
  // 使用逗号作为分隔符来分割字符串
  return userStore.user.storeName ? userStore.user.storeName.split(',') : ''
})
// el-tree的配置
const defaultProps = {
  children: 'children',
  label: 'name'
}
// 用户数据
const userBasicInfo = ref({
  userName: '',
  userId: '',
  avatarOrigin: '',
  employeeNo: '',
  departmentName: '',
  jobName: '',
  company: ''
})
// 固定资产列表
const fixedAssetList = ref<any[]>([])
// 权限店铺列表
const permitStoreList = ref<any[]>([])
// 权限角色列表
const permitRoleList = ref<any[]>([])
// 获取drawer需要展示的数据
const getUserInfo = async () => {
  if (String(userId.value).includes('ou')) {
    // 飞书账户
    const res = await UserApi.getFeishuUserInfo(userId.value)
    userBasicInfo.value = {
      userName: res.name,
      userId: res.userId,
      avatarOrigin: res.avatarOrigin,
      employeeNo: res.employeeNo,
      departmentName: res.departmentName,
      jobName: res.jobName,
      company: res.company
    }
  } else {
    // 系统账户
    const res = await UserApi.getSystemUserInfo(userId.value)
    userBasicInfo.value = {
      userName: res.username,
      userId: res.id,
      avatarOrigin: res.avatarUrl,
      employeeNo: '',
      departmentName: res.departmentName,
      jobName: res.jobName,
      company: res.company
    }
  }
  // 固定资产列表
  const res = await UserApi.getFixedAsset(userId.value)
  fixedAssetList.value = res || []
  // 权限店铺列表
  const storeList = await UserApi.getStoreByUserId(userId.value)
  if (storeList) {
    permitStoreList.value =
      Object.keys(storeList).map((el) => {
        return {
          name: el,
          children: storeList[el]
        }
      }) || []
  }

  // 权限角色列表
  const roleList = (await UserApi.getRolePermissionByUserId(userId.value)) || []
  if (roleList) {
    permitRoleList.value =
      Object.keys(roleList).map((el) => {
        return {
          name: el,
          children: roleList[el]
        }
      }) || []
  }
}

// 查看个人信息
const gotoInfo = () => {
  userDrawerStore.open({
    title: '个人信息',
    userBasicInfo: userBasicInfo.value,
    fixedAssetList: fixedAssetList.value,
    permitStoreList: permitStoreList.value,
    permitRoleList: permitRoleList.value
  })
}

const departmentName = computed(() => userStore.user.departmentName)
const jobName = computed(() => userStore.user.jobName)

// 锁定屏幕
const lockStore = useLockStore()
const getIsLock = computed(() => lockStore.getLockInfo?.isLock ?? false)
const dialogVisible = ref<boolean>(false)
const loginOut = async () => {
  try {
    await ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
      confirmButtonText: t('common.ok'),
      cancelButtonText: t('common.cancel'),
      type: 'warning',
      showClose: false,
      center: true,
      cancelButtonClass: 'cancelbth',
      confirmButtonClass: 'yepbth',
      customClass: 'custom_class_confirm'
    })
    await userStore.loginOut()
    tagsViewStore.delAllViews()
    replace('/login?redirect=/admin/index')
  } catch { }
}
// const toProfile = async () => {
//   push('/user/profile')
// }
onMounted(() => {
  getUserInfo()
})
</script>

<template>
  <div>
    <!-- :visible = "true" -->
    <el-popover placement="bottom" :width="379" trigger="hover" :show-arrow="false" class="userLoginInfo"
      popper-class="popperOptions" :popper-style="{
        'border-radius': '10px',
        'box-shadow': '0px 0px 14px 2px rgba(0, 31, 72, 0.11)',
        padding: '0'
      }">
      <template #reference>
        <div class="userInfo">
          <img class="userInfo-logo" :src="avatarUrl ? avatarUrl : avatarLogo" alt="" />
          <!-- <span class="userInfo-name"> {{ realName }}</span>-->
        </div>
      </template>
      <!-- 用户管理页面重构 -->
      <div class="userLoginInfo-content">
        <div class="top">
          <div class="infoCard">
            <div class="personInfo">
              <div class="left">
                <img :src="avatarUrl ? avatarUrl : avatarLogo" />
              </div>
              <div class="right">
                <div class="name">
                  <div class="username">{{ userName }}</div>
                  <div class="realName">{{ realName }}</div>
                </div>
                <div class="btn">
                  <div class="info Btn" @click.stop="gotoInfo">
                    <img class="icon" :src="infoSvg" />
                    <span style="margin-left: 4px">个人信息</span>
                  </div>
                  <div class="logout Btn" @click.stop="loginOut">
                    <img class="icon" :src="logoutSvg" />
                    <span style="margin-left: 4px">{{ t('common.loginOut') }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="jobInfo">
              <div>
                <div class="key">部门名称</div>
                <div class="value">{{ departmentName || '-' }}</div>
              </div>
              <div>
                <div class="key">职位名称</div>
                <div class="value">{{ jobName || '-' }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="storeList">
            <div class="title">店铺</div>
            <el-tree style="width: 100%; border-radius: 8px" :data="permitStoreList" :props="defaultProps"
              empty-text="暂无数据">
              <template #default="{ node, data }">
                <div class="treeData">
                  <div class="left">
                    <div class="channel" v-if="data.children">
                      <img :src="getImageUrl(data.name)" />
                      <span>{{ getChannelNameById(data.name) }}</span>
                    </div>
                    <div class="store" v-else>{{ data.name }}</div>
                  </div>
                  <div class="icon" v-if="data.children"><img :src="node.expanded ? arrowUp : arrowDown" /></div>
                </div>
              </template>
            </el-tree>
          </div>
        </div>
      </div>
    </el-popover>

    <LockDialog v-if="dialogVisible" v-model="dialogVisible" />

    <teleport to="body">
      <transition name="fade-bottom" mode="out-in">
        <LockPage v-if="getIsLock" />
      </transition>
    </teleport>
  </div>
</template>

<style scoped lang="scss">
.fade-bottom-enter-active,
.fade-bottom-leave-active {
  transition:
    opacity 0.25s,
    transform 0.3s;
}

.fade-bottom-enter-from {
  opacity: 0;
  transform: translateY(-10%);
}

.fade-bottom-leave-to {
  opacity: 0;
  transform: translateY(10%);
}

.userLoginInfo {
  display: flex;
  height: 100%;
  cursor: pointer;
  align-items: center;
  border-radius: 10px;
}

.userInfo {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  &-logo {
    height: 38px;
    width: 38px;
    border-radius: 19px;
  }

  &-name {
    padding-left: 12px;
    font-size: 14px;
    color: #606266;
    line-height: 18px;
  }
}

.userLoginInfo-content {
  // margin: -16px;
  box-sizing: border-box;

  .top {
    width: 100%;
    height: 178px;
    box-sizing: border-box;
    background-image: url('@/assets/imgs/system/user/user_top_bg.png');
    border-bottom: 1px solid #e5e5e5;

    .infoCard {
      padding: 20px;

      .personInfo {
        display: flex;
        align-items: center;

        .left {
          width: 90px;
          height: 90px;
          background-image: url('@/assets/imgs/system/user/avatar_bg.svg');
          background-repeat: no-repeat;
          background-position: center;
          display: flex;
          align-items: center;

          img {
            margin: auto;
            width: 65.33px;
            height: 65.33px;
            border-radius: 50%;
          }
        }

        .right {
          height: 70px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;

          .name {
            display: flex;
            align-items: center;

            .username {
              color: #333;
              font-size: 20px;
              font-weight: 600;
              margin-right: 10px;
            }

            .realName {
              color: #666;
              font-size: 16px;
            }
          }

          .btn {
            display: flex;
            align-items: center;

            .Btn {
              width: 96px;
              height: 32px;
              border-radius: 100px;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;

              .icon {
                width: 16px;
                height: 16px;
              }

              .span {
                font-size: 14px;
              }

              &.info {
                border: 1px solid #0064ff;
                color: #0064ff;
                margin-right: 20px;
              }

              &.logout {
                background: #0064ff;
                color: #fff;
              }
            }
          }
        }
      }

      .jobInfo {
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-top: 10px;

        div {
          font-size: 14px;

          .key {
            color: #666;
            margin-bottom: 7px;
          }

          .value {
            color: #333;
          }
        }
      }
    }
  }

  .list {
    padding: 20px;

    .storeList {
      border-radius: 8px;
      border: 1px solid #e2edfc;

      .title {
        background: #f9fafc;
        box-sizing: border-box;
        height: 40px;
        line-height: 40px;
        padding-left: 8px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        font-size: 14px;
        color: #666;
      }

      .treeData {
        width: 100%;
        display: flex;

        .left {
          .channel {
            display: flex;
            align-items: center;

            img {
              width: 16px;
              height: 16px;
              margin-right: 10px;
              margin-left: 10px;
            }
          }

          .store {
            margin-left: 20px;
          }
        }

        .icon {
          margin-left: auto;
          margin-right: 12px;
        }
      }

      :deep(.el-tree-node__content) {
        height: 32px;
        border-top: 1px solid #e2edfc;

        .el-tree-node__expand-icon {
          display: none;
        }
      }
    }
  }
}

.el-tag {
  border: none;
}

:deep(.el-popper) {
  margin-top: 40px;
}
</style>
