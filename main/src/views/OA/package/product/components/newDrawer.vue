<template>
  <div>
    <el-drawer v-model="isVisible" :with-header="false" :size="918" @close="reset">
      <div class="drawer-wapper">
        <div class="content-wapper">
          <div class="flex-row title-wapper">
            <div class="title">企划信息</div>
            <img
              src="@/assets/imgs/system/fieldManageConfig/close.png"
              class="close"
              @click="reset"
              alt=""
            />
          </div>
          <ContentWrap>
            <div class="form-wapper">
              <div class="flex-row header-wapper">
                <span class="icon"></span>
                <span>基本信息</span>
              </div>
              <el-form :model="formData" ref="formRef" label-width="120px" :rules="rules">
                <div class="flex-row form-main">
                  <el-form-item label="企划名称" prop="planName">
                    <div class="valueBg">{{ formData.planName }}</div>
                  </el-form-item>
                  <el-form-item label="计划类型" prop="planStyle">
                    <div class="valueBg">{{
                      formData.planType == '0' ? '计划' : formData.planType == '1' ? '临时' : ''
                    }}</div>
                  </el-form-item>
                  <el-form-item label="店铺" prop="storeName">
                    <div class="valueBg">{{ formData.storeName || formData.store }}</div>
                  </el-form-item>
                  <el-form-item label="企划时间" prop="planningPlan">
                    <div class="valueBg" v-if="formData.planStartTime">{{
                      `${formData.planStartTime}-${formData.planEndTime}`
                    }}</div>
                  </el-form-item>
                  <el-form-item label="计划上市日期" prop="planListDate">
                    <div class="valueBg">{{ formData.planListDate }}</div>
                  </el-form-item>
                  <el-form-item label="计划下单日期" prop="planOrderDate">
                    <div class="valueBg">{{ formData.planOrderDate }}</div>
                  </el-form-item>
                  <el-form-item label="备注" prop="remark" class="w-100">
                    <div class="valueRemarkBg">{{ formData.remark || '--' }}</div>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </ContentWrap>
          <ContentWrap>
            <div class="form-wapper">
              <div class="flex-row header-wapper">
                <span class="icon"></span>
                <span>品类明细</span>
              </div>

              <el-form :model="formData" label-width="120px" :rules="rules">
                <el-form-item label="系列" prop="remark" class="">
                  <div class="valueRemarkBg valueRemarkInput">{{ formData.remark || '--' }}</div>
                </el-form-item>
                <el-form-item label="系列备注" prop="remark" class="">
                  <div class="valueRemarkBg">{{ formData.remark || '--' }}</div>
                </el-form-item>
              </el-form>
            </div>
          </ContentWrap>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { developmentPlanNewPlanInfo } from '@/api/oa/package/develop'
const isVisible = ref(false)

const formData = ref({
  planName: '',
  planType: '',
  storeName: '',
  store: '',
  planningPlan: '',
  planListDate: '',
  planOrderDate: '',
  remark: '',
  planStartTime: '',
  planEndTime: ''
})

const currentId = ref('') // 当前编辑的 id
const open = async (id: string) => {
  isVisible.value = true
  if (id) {
    currentId.value = id
    const res = await developmentPlanNewPlanInfo(id)
    formData.value = res
  }
}

const formRef = ref() // 表单 Ref

const reset = () => {
  formData.value = {
    planName: '',
    planType: '',
    storeName: '',
    store: '',
    planningPlan: '',
    planListDate: '',
    planOrderDate: '',
    remark: '',
    planStartTime: '',
    planEndTime: ''
  }
  isVisible.value = false
  currentId.value = ''
}

const emit = defineEmits(['success'])
defineExpose({ open })
</script>

<style lang="scss" scoped>
:deep(.el-drawer__body) {
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
  margin-bottom: 16px;

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

.form-wapper {
  .header-wapper {
    margin-bottom: 16px;
    align-items: center;

    .icon {
      width: 3px;
      height: 10px;
      background: #0064ff;
      margin-right: 5px;
    }
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.form-main {
  flex-wrap: wrap;

  .el-form-item {
    width: calc(50%);

    &.w-100 {
      width: 100%;
    }
  }

  .valueBg {
    width: 284px;
    height: 32px;
    background: #f8f8f9;
    border-radius: 4px;
    padding-left: 16px;
  }

  .valueRemarkBg {
    width: 684px;
    min-height: 92px;
    background: #f8f8f9;
    border-radius: 4px;
    padding-left: 16px;
    padding-right: 16px;
  }
}

.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
}
.valueRemarkBg {
  width: 100%;
  min-height: 92px;
  background: #f8f8f9;
  border-radius: 4px;
  padding-left: 16px;
  padding-right: 16px;
}
.valueRemarkInput {
  min-height: 20px;
}
</style>
