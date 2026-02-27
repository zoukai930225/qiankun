<!--
 * @Date: 2025-07-08 15:42:46
-->
<template>
  <el-drawer v-model="isVisible" :with-header="false" size="958" @close="reset">
    <div class="drawer-wapper">
      <div class="content-wapper">
        <div class="flex-row title-wapper">
          <div class="title">权限详情</div>
          <img
            src="@/assets/imgs/system/fieldManageConfig/close.png"
            class="close"
            @click="reset"
          />
        </div>
        <div class="content">
          <el-form ref="formRef" :model="formData" :inline="true" class="form-wapper">
            <el-form-item label="权限名称" prop="permessionName">
              <el-input
                v-model="formData.permessionName"
                clearable
                placeholder="请输入权限名称"
                style="width: 142px"
              />
            </el-form-item>
            <div style="box-sizing: border-box">
              <el-button @click="search" class="commonSearchBtn">
                <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />搜 索</el-button
              >
              <el-button @click="resetForm">重 置</el-button>
            </div>
          </el-form>
        </div>
        <!--内容区域 -->
        <div v-if="list?.length > 0">
          <div class="cus-table" v-for="item in list" :key="item.id">
            <div class="item-wapper">
              <div class="item-title" style="padding-bottom: 16px">{{ item.name }}</div>
              <div class="item">
                <div class="row-title">
                  <div
                    class="row-title"
                    style="padding-left: 0px; width: 30%; box-sizing: border-box"
                    >权限名称</div
                  >
                  <div class="row-title" style="padding-left: 0px; width: 30%">备注</div>
                </div>
                <div class="row-content" v-for="ite in item.value" :key="ite.id">
                  <div class="content-title" style="width: 30%">{{ ite.name }}</div>
                  <div class="content-title" style="width: 30%">{{ ite.remark || '--' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-img">
          <img src="@/assets/imgs/common/empty_list.png" alt="" />
          <div>暂无数据</div>
        </div>
        <div>
          <!-- 分页 -->
          <Pagination
            v-model:limit="formData.size"
            v-model:page="formData.page"
            :total="total"
            @pagination="pageChange"
          />
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script lang="ts" setup>
import { queryPermissionMenuId } from '@/api/system/menu'
defineOptions({ name: 'PermissionsDetail' })

const isVisible = ref(false) // 弹窗的是否展示
const menuId = ref('') // 菜单ID

// page size
const formData = ref({
  permessionName: '',
  // 分页参数
  page: 1,
  size: 10
})

const search = () => {
  formData.value.page = 1 // 重置页码为1
  getPermissionList() // 获取权限列表
}

const open = (id: string, parentId: string) => {
  console.log('查看人员', id, parentId)
  isVisible.value = true // 打开弹窗
  menuId.value = id // 设置菜单ID

  getPermissionList()
}

const list = ref<any[]>([])
const total = ref(0) // 分页总数

const getPermissionList = async () => {
  const data = {
    ...formData.value,
    menuId: menuId.value
  }
  const res = await queryPermissionMenuId(data)
  console.log('权限数据', res)
  total.value = res.total || 0
  formatData(res.records || [])
}

// 格式化数据
const formatData = (arr) => {
  const midArr: any = []
  let obj = {}
  for (let i = 0; i < arr.length; i++) {
    if (obj.hasOwnProperty(arr[i].permissionType)) {
      obj[arr[i].permissionType].push(arr[i])
    } else {
      obj[arr[i].permissionType] = [arr[i]]
    }
  }

  for (const key in obj) {
    const item = { name: key, value: obj[key] }
    midArr.push(item)
  }

  list.value = midArr
}

const pageChange = (page) => {
  formData.value.page = page.page
  formData.value.size = page.limit
  getPermissionList()
}

const reset = () => {
  isVisible.value = false // 关闭弹窗
}

const resetForm = () => {
  formData.value.permessionName = '' // 重置权限名称
  formData.value.page = 1 // 重置页码为1
  formData.value.size = 10 // 重置每页条数为10
  getPermissionList() // 获取权限列表
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
:deep(.el-form--inline .el-form-item) {
  margin-right: 20px !important;
}

:deep(.el-drawer__body) {
  border-radius: 8px 0px 0px 8px;
  /* 应用/灰色底色 */
  background: white;
  padding: 0 !important;
}

.drawer-wapper {
  border-radius: 8px 0px 0px 8px;
  min-width: 700px;
  background: white;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  // background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
  .el-drawer__body {
    padding: 0 !important;
  }
}

.title-wapper {
  justify-content: space-between;
  width: 100%;
  height: 54px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  box-sizing: border-box;
  border-width: 0px 0px 1px 0px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 13px;

  .close {
    width: 23px;
    height: 23px;
    cursor: pointer;
  }

  .title {
    font-size: 14px;
    color: #333333;
    font-weight: 500;
  }
}

.content {
  display: flex;
  flex-direction: row;
  margin: 0 20px 0px 20px;
}

.content-wapper {
  height: calc(100vh - 54px);
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
}
.form-wapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.cus-table {
  margin-bottom: 16px;
  .item-title {
    font-weight: 500;
    font-size: 14px;
    color: #333333;
    margin-top: 4px;
  }
  .item {
    padding: 16px;
    box-sizing: border-box;
    background: linear-gradient(
      0deg,
      rgba(250, 252, 255, 0.19) 0%,
      rgba(242, 247, 255, 0.78) 37%,
      #ebf2ff 100%
    );

    border-radius: 6px;

    .row-title {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      padding: 0 20px;
      box-sizing: border-box;
    }

    .content-title {
      width: 30%;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      .btn-edit {
        font-weight: 400;
        font-size: 14px;
        color: #0078ff;
        cursor: pointer;
      }
      .btn-del {
        cursor: pointer;
        margin: 0 14px;
        font-weight: 400;
        font-size: 14px;
        color: #eb3737;
      }
      .more {
        width: 15px;
        height: 15px;
      }
      .img-content {
        width: 46px;
        height: 46px;
      }
    }
    // .content-title:last-child {
    //   display: flex;
    //   flex-direction: row;
    //   justify-content: end;
    // }
    // .content-title:nth-child(2) {
    //   display: flex;
    //   flex-direction: row;
    //   justify-content: center;
    // }
    .row-content {
      width: 100%;
      height: 52px;
      background: #ffffff;
      box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
      border-radius: 4px;
      margin: 16px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      box-sizing: border-box;
    }
    .row-content:last-child {
      margin-bottom: 0px;
    }
  }
}
.cus-table:last-child {
  margin-bottom: 0;
}

.empty-img {
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #666666;
}
</style>
