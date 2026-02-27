<template>
  <div class="wrapper">
    <div class="stepBox">
      <div class="step">
        <div
          class="tab"
          @click="goDetail(inventoryId)"
          :class="{ active: activeRouteName === 'QuestionnaireSetList' }"
        >
          <img :src="step1" alt="" />
          <img :src="steptitle1" alt="" class="titleImg" />
        </div>
      </div>
      <div class="step">
        <img :src="stepArrow" alt="" />
      </div>
      <div class="step">
        <div
          class="tab"
          @click="goEvaluationRelationship(inventoryId)"
          :class="{ active: activeRouteName === 'EvaluationRelationship' }"
        >
          <img :src="step2" alt="" />
          <img :src="steptitle2" alt="" class="titleImg" />
        </div>
      </div>
      <div class="step">
        <img :src="stepArrow" alt="" />
      </div>
      <div class="step">
        <div
          class="tab"
          @click="goReviewInvitation(inventoryId)"
          :class="{ active: activeRouteName === 'ReviewInvitaion' }"
        >
          <img :src="step3" alt="" />
          <img :src="steptitle3" alt="" class="titleImg" />
        </div>
      </div>
      <div class="step">
        <img :src="stepArrow" alt="" />
      </div>
      <div class="step">
        <div
          class="tab"
          @click="goInventoryCalibration(inventoryId)"
          :class="{ active: activeRouteName === 'InventoryCalibration' }"
        >
          <img :src="step4" alt="" />
          <img :src="steptitle4" alt="" class="titleImg" />
        </div>
      </div>
      <div class="step">
        <img :src="stepArrow" alt="" />
      </div>
      <div class="step">
        <div
          class="tab"
          @click="goInventoryResult(inventoryId)"
          :class="{ active: activeRouteName === 'InventoryResult' }"
        >
          <img :src="step5" alt="" />
          <img :src="steptitle5" alt="" class="titleImg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { hasPermissionsJs } from '@/utils/index'
import step1 from '@/assets/imgs/otr/activitySet/step1.svg'
import steptitle1 from '@/assets/imgs/otr/activitySet/steptitle1.svg'
import step2 from '@/assets/imgs/otr/activitySet/step2.svg'
import steptitle2 from '@/assets/imgs/otr/activitySet/steptitle2.svg'
import step3 from '@/assets/imgs/otr/activitySet/step3.svg'
import steptitle3 from '@/assets/imgs/otr/activitySet/steptitle3.svg'
import step4 from '@/assets/imgs/otr/activitySet/step4.svg'
import steptitle4 from '@/assets/imgs/otr/activitySet/steptitle4.svg'
import step5 from '@/assets/imgs/otr/activitySet/step5.svg'
import steptitle5 from '@/assets/imgs/otr/activitySet/steptitle5.svg'
import stepArrow from '@/assets/imgs/otr/activitySet/stepArrow.svg'
const route = useRoute()
const router = useRouter() // 路由对象
const message = useMessage() // 消息弹窗
const inventoryId = (route.query.inventoryId ||
  route.query.questionnaireId ||
  route.query.id ||
  '') as string
const isSetPdjz = ref(false)
const activeRouteName = route.name as string

import * as activitySetApi from '@/api/otr/activitySet'

// 问卷管理
const goDetail = (id) => {
  if (!hasPermissionsJs(['otr_question_manage'])) {
    message.error('您没有权限查看问卷管理页面，请联系管理员赋予权限！')
    return
  }
  router.push({
    name: `QuestionnaireSetList`,
    query: { inventoryId: id }
  })
}
// 评价关系
const goEvaluationRelationship = (id) => {
  if (!hasPermissionsJs(['otr_evaluate_relationship'])) {
    message.error('您没有权限查看评价关系页面，请联系管理员赋予权限！')
    return
  }

  router.push({
    name: `EvaluationRelationship`,
    query: { inventoryId: id, source: 0 }
  })
}
// 评价邀请
const goReviewInvitation = (id) => {
  if (!hasPermissionsJs(['otr_evaluate_Invite'])) {
    message.error('您没有权限查看评价邀请页面，请联系管理员赋予权限！')
    return
  }
  router.push({
    name: `ReviewInvitaion`,
    query: { id }
  })
}
// 盘点校准
const goInventoryCalibration = async (id) => {
  if (!hasPermissionsJs(['otr_inventory_calibration'])) {
    message.error('您没有权限查看评价邀请页面，请联系管理员赋予权限！')
    return
  }

  await getActivity()
  // 没有开启盘点校准
  if (isSetPdjz.value) {
    router.push({
      name: 'InventoryCalibration',
      query: { inventoryId: id }
    })
  } else {
    message.error('请前往评价邀请点击【开启校准】后，开始盘点活动校准')
  }
}
// 盘点结果
const goInventoryResult = async (id) => {
  if (!hasPermissionsJs(['otr_inventory_result'])) {
    message.error('您没有权限查看盘点结果页面，请联系管理员赋予权限！')
    return
  }
  await getActivity()
  if (isSetPdjz.value) {
    router.push({
      name: 'InventoryResult',
      query: { inventoryId: id }
    })
  } else {
    message.error('请前往评价邀请点击【开启校准】后，开始盘点活动校准')
  }
}

// 获取当前活动状态等信息
const getActivity = async () => {
  const data = await activitySetApi.getDataById(inventoryId)
  // 活动状态为3(问卷关闭)，4(校准中)，5(活动关闭)
  isSetPdjz.value = Number(data.status) >= 3
}
const jumpHasPermissionStep = async () => {
  if (hasPermissionsJs(['otr_question_manage'])) {
  } else {
    if (hasPermissionsJs(['otr_evaluate_relationship'])) {
      goEvaluationRelationship(inventoryId)
    } else {
      if (hasPermissionsJs(['otr_evaluate_Invite'])) {
        goReviewInvitation(inventoryId)
      } else {
        if (hasPermissionsJs(['otr_inventory_calibration'])) {
          goInventoryCalibration(inventoryId)
        } else {
          if (hasPermissionsJs(['otr_inventory_result'])) {
            goInventoryResult(inventoryId)
          } else {
            message.error('暂无权限')
            router.back()
          }
        }
      }
    }
  }
}
defineExpose({ jumpHasPermissionStep })
onMounted(() => {})
</script>

<style lang="scss" scoped>
.wrapper {
  margin: 10px 20px;
  border-radius: 8px;
  box-sizing: border-box;
  .stepBox {
    width: 100%;
    height: 98px;
    border-radius: 8px;
    background: url('@/assets/imgs/otr/activitySet/tabBg.png') no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .step {
      &:nth-child(2n + 1) {
        width: 324px;
        .tab {
          width: 186px;
          display: flex;
          align-items: center;
          margin: 0 auto;
          padding: 8px 24px;
          cursor: pointer;
          &:hover,
          &.active {
            border-radius: 8px;
            background: #ebf3fe;
          }
          .titleImg {
            margin-left: 16px;
          }
        }
      }
      &:nth-child(2n) {
        width: 48px;
      }
    }
  }
}
</style>
