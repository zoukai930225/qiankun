<template>
  <div class="PdfPage1Bg">
    <div class="PdfPage1">
      <div class="role">人才盘点反馈报告</div>
      <!-- {{ data.actInventory.actName }} -->
      <div class="company">{{ data && data.person ? data.person.companyName : '' }}</div>
      <div class="name">{{ data && data.person ? data.person.name : '' }}</div>
      <div class="bottom-row">
        <div class="row-center">
          <img
            v-if="data && data.person && data.person.departmentName"
            class="icon1"
            src="@/assets/imgs/otr/pdf/page1_dept_icon.png"
          />
          <div v-if="data && data.person && data.person.departmentName" class="dept">{{
            data.person.departmentName
          }}</div>
        </div>
        <div class="row-center" style="margin-top: 15px">
          <img
            v-if="data && data.person && data.person.jobName"
            class="icon2"
            src="@/assets/imgs/otr/pdf/page1_people_icon.png"
          />
          <div v-if="data && data.person && data.person.jobName" class="people">{{
            data.person.jobName
          }}</div>
        </div>
      </div>
      <div v-if="data.actInventory" class="year">{{ data.actInventory.actYear }}年</div>
      <img v-if="data.actInventory" class="yearLine" src="@/assets/imgs/otr/pdf/page1_line.png" />
      <div v-if="data.actInventory" class="date"
        >{{ data.actInventory.beginTime }} 至 {{ data.actInventory.endTime }}</div
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

defineProps({
  data: propTypes.object.def({})
})

onMounted(() => {})
</script>

<style lang="scss" scoped>
.PdfPage1Bg {
  width: 595px;
  height: 842px;
  display: flex;
  flex-direction: column;
  background: #e9f2fb;
  .PdfPage1 {
    background-image: url('@/assets/imgs/otr/pdf/page1_bg.png');
    // width: 100%;
    // height: 100%;
    width: 595px;
    height: 842px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: relative;

    .role {
      padding-left: 12px;
      padding-top: 125px;
      font-weight: bold;
      font-size: 49px;
      color: #ffffff;
      letter-spacing: 2px;
    }
    .company {
      padding-left: 22px;
      padding-top: 10px;
      font-size: 26px;
      color: #ffffff;
      line-height: 32px;
      letter-spacing: 8px;
    }
    .name {
      margin-top: 440px;
      padding-left: 33px;
      font-weight: 500;
      font-size: 30px;
      color: #1039c3;
      line-height: 45px;
    }
    .bottom-row {
      margin-top: 32px;
      display: flex;
      flex-direction: column;
      // align-items: center;
      margin-left: 33px;
      font-weight: 400;
      font-size: 17px;
      color: #1039c3;
      line-height: 24px;
      .icon1 {
        width: 13px;
        height: 13px;
      }

      .dept {
        padding-left: 10px;
      }

      .icon2 {
        // margin-left: 115px;
        width: 13px;
        height: 15px;
      }
      .people {
        padding-left: 10px;
      }
    }
    .year {
      position: absolute;
      right: 29px;
      bottom: 180px;
      font-weight: 500;
      font-size: 18px;
      color: #ffffff;
      line-height: 27px;
    }
    .yearLine {
      position: absolute;
      right: 40px;
      bottom: 98px;
      width: 10px;
      height: 64px;
    }
    .date {
      font-weight: 500;
      font-size: 18px;
      color: #ffffff;
      line-height: 27px;
      position: absolute;
      right: 29px;
      bottom: 70px;
    }
  }
}
</style>
