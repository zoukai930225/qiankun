<!--
 * @Date: 2024-12-05 13:54:45
-->
<template>
  <div>
    <el-drawer v-model="isVisible" :with-header="false" size="50%" @close="resetFlag">
      <div class="drawer-wapper">
        <div class="content-wapper">
          <div class="flex-row title-wapper">
            <div class="title">复制属性</div>
            <img
              src="@/assets/imgs/system/fieldManageConfig/close.png"
              alt=""
              class="close"
              @click="resetFlag"
            />
          </div>
          <!--  -->
          <ContentWrap>
            <div class="flex-row content-wapper-bottom">
              <div class="item">
                <div class="item-header">
                  <img src="@/assets/imgs/system/fieldManageConfig/ziduan.png" class="icon" />
                  <div class="item-title">选中属性</div>
                </div>
                <div class="item-content">
                  <el-table
                    :header-cell-style="appStore.headerCellStyle"
                    :data="selectItem"
                    :show-overflow-tooltip="true"
                    row-class-name="commonTableRow"
                    class="channelTotal-table SWCommonTable"
                    @selection-change="handleSelectionChange"
                  >
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="name" label="属性名称" />
                    <el-table-column prop="code" label="映射字段" />
                  </el-table>
                </div>
              </div>
              <img src="@/assets/imgs/system/fieldManageConfig/mid.png" class="mid" />
              <div class="item">
                <div class="item-header">
                  <img src="@/assets/imgs/system/fieldManageConfig/mokuai.png" class="icon" />
                  <div class="item-title">选中模块</div>
                </div>
                <div class="item-content">
                  <el-form :model="selectForm" ref="queryFormRef" :inline="true">
                    <el-form-item label="模块" prop="name">
                      <Menuitem v-model="selectForm.moduleId" />
                    </el-form-item>
                  </el-form>
                  <!-- <div class="result">
                    <div class="result-item">人员基本信息</div>
                  </div> -->
                </div>
              </div>
            </div>
          </ContentWrap>
          <div class="btn-wapper">
            <el-button @click="resetFlag">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { copyAttr } from '@/api/system/fieldManageConfig'
import Menuitem from './Menuitem.vue'
const message = useMessage() // 消息弹窗
const appStore = useAppStore()
const isVisible = ref(false)

defineProps({
  selectItem: {
    type: Array,
    default: () => []
  }
})

const open = () => {
  isVisible.value = true
}

const selectValue = ref([]) //选中要提交的数据
const handleSelectionChange = (val) => {
  console.log(val, 'val')
  selectValue.value = val
}

const selectForm = ref({
  moduleId: undefined
})

const save = async () => {
  if (selectValue.value.length == 0) {
    return message.error('请选择属性')
  }
  if (!selectForm.value.moduleId) {
    return message.error('请选择模块')
  }
  const params = {
    moduleIds: `${selectForm.value.moduleId[selectForm.value.moduleId.length - 1]}`,
    arr: selectValue.value.map((item) => {
      return {
        //@ts-ignore
        id: item.id
      }
    })
  }
  await copyAttr(params)
  message.success('复制成功')
  resetFlag()
}

const resetFlag = () => {
  isVisible.value = false
  selectForm.value.moduleId = undefined
  selectValue.value = []
}

const emit = defineEmits(['cancle'])

defineExpose({ open, close })
</script>

<style lang="scss" scoped>
:deep(.el-drawer__body){
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

.drawer-wapper {
  min-width: 700px;
  background: #f6f6f6;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
}

.title-wapper {
  justify-content: space-between;
  width: 100%;
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

.flex-row {
  display: flex;
  flex-direction: row;
}
.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
}

.content-wapper-bottom {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  .item {
    width: 50%;
    .item-header {
      padding: 0 20px;
      box-sizing: border-box;
      height: 46px;
      background: #f5f7fa;
      border-radius: 10px 10px 0px 0px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .icon {
        width: 14px;
        height: 14px;
        margin-right: 14px;
      }
      .item-title {
        font-size: 14px;
        color: #333333;
        font-weight: bold;
      }
    }
    .item-content {
      min-height: 384px;
      max-height: 800px;
      overflow-y: scroll;
      background: #ffffff;
      border-radius: 0px 0px 10px 10px;
      border: 1px solid #dcdfe6;
      padding: 20px;
      box-sizing: border-box;
      .result {
        width: 100%;
        min-height: 136px;
        background: #f5f8ff;
        border-radius: 4px;
        padding: 18px 14px;
        box-sizing: border-box;
        .result-item {
          display: inline-block;
          height: 40px;
          line-height: 40px;
          background: #ffffff;
          border-radius: 20px;
          padding: 0px 10px;
          box-sizing: border-box;
          font-size: 14px;
          color: #333333;
          font-family: AlibabaPuHuiTi_2_55_Regular;
        }
      }
    }
  }
  .mid {
    width: 53px;
    height: 32px;
    margin: 200px 14px 0 14px;
  }
}
</style>
