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
            />
          </div>
          <ContentWrap>
            <div class="form-wapper">
              <div class="flex-row header-wapper">
                <span class="icon"></span>
                <span>基本信息</span>
              </div>
              <el-form :model="formData" ref="formRef" label-width="120px">
                <div class="flex-row form-main">
                  <el-form-item label="企划名称" prop="planName">
                    <div class="valueBg">{{ formData.planName }}</div>
                  </el-form-item>
                  <el-form-item label="店铺" prop="storeName">
                    <div class="valueBg">{{ formData.storeName || formData.store }}</div>
                  </el-form-item>
                  <el-form-item label="计划上架月份" prop="planListDate">
                    <div class="valueBg">{{ formData.planListDate }}</div>
                  </el-form-item>
                  <el-form-item label="企划时间" prop="planningPlan">
                    <div class="valueBg">{{
                      `${formData.planStartTime}-${formData.planEndTime}`
                    }}</div>
                  </el-form-item>
                  <el-form-item label="计划下单日期" prop="planOrderDate">
                    <div class="valueBg">{{ formData.planOrderDate }}</div>
                  </el-form-item>
                  <el-form-item label="包装范围" prop="packagingScope">
                    <div class="valueBg">{{
                      formData.packagingScope == 0
                        ? '通用'
                        : formData.packagingScope == 1
                          ? '特定'
                          : ''
                    }}</div>
                  </el-form-item>
                  <el-form-item label="备注" prop="remark" class="w-100">
                    <div class="valueRemarkBg">{{ formData.remark || '--' }}</div>
                  </el-form-item>
                  <el-form-item label="参考图/其他" prop="">
                    <uploadImg v-model:modelValue="imageList" :disabled="true" />
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

              <el-form :model="formData" label-width="120px">
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
import uploadImg from '@/components/SWUoloadFile/index.vue'
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
  planEndTime: '',
  packagingScope: undefined
})
const categoryTableList = ref([]) // 品类明细
const planNumTableList = ref([]) // 品类明细
const planNumMap = ref({}) // 计划数量
const imageList = ref<any>([]) // 图片

const currentId = ref('') // 当前编辑的 id
const open = async (id: string) => {
  isVisible.value = true

  if (id) {
    console.log('1111111', id)
    currentId.value = id
    const res = await developmentPlanNewPlanInfo(id)
    console.log('企划信息 res', res)
    formData.value = res
    categoryTableList.value = res.detailList
    planNumMap.value = res.planNumMap
    if (res.planNumMap) {
      planNumTableList.value = [planNumMap.value]
    } else {
      planNumTableList.value = []
    }
    // 图片
    imageList.value = res.referencePicture
      ? res.referencePicture.split(',').map((item) => {
          return {
            name: item?.split('?')[1]?.split('=')[1] || '',
            url: item
          }
        })
      : []
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
    planEndTime: '',
    packagingScope: undefined
  }
  categoryTableList.value = []
  isVisible.value = false
  currentId.value = ''
}

const emit = defineEmits(['success'])
defineExpose({ open })
</script>

<style lang="scss" scoped>
:deep(.el-drawer__body) {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
}

.drawer-wapper {
  min-width: 700px;
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
