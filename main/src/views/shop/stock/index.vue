<!--
 * @Date: 2024-06-06 10:13:37
-->
<template>
  <div>
    <!-- 列表 -->
    <ContentWrap>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            class="-mb-15px"
            :model="queryParams"
            ref="queryFormRef"
            :inline="true"
            label-width="78px"
            @submit.prevent
          >
            <el-form-item label="货品编码:" prop="productCode">
              <el-input
                :prefix-icon="Search"
                class="searchFormItemWidth"
                v-model="queryParams.productCode"
                @clear="handleQuery"
                @keyup.enter="handleQuery"
                placeholder="请输入货品编码"
                clearable
              />
            </el-form-item>
            <el-form-item label="商家编号:" prop="goodsCode">
              <el-input
                :prefix-icon="Search"
                class="searchFormItemWidth"
                v-model="queryParams.goodsCode"
                @clear="handleQuery"
                @keyup.enter="handleQuery"
                placeholder="请输入商家编号"
                clearable
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <el-button @click="handleQuery" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
              重置
            </el-button>
            <SWFilterAdd
              class="commonAddBtn"
              :list="addList"
              :current-code="currentAddCode"
              :loading="exportLoading"
              @add-btn-click="addBtnClick"
            />
          </div>
        </div>
      </div>

      <div class="topStatics">
        <div style="display: flex; align-items: center">
          <el-radio-group v-model="queryParams.type" text-color="#0064FF">
            <el-radio-button
              v-for="dict in OrderOptions"
              :key="dict.label"
              :label="dict.value"
              @change="handleTypeChange"
            >
              {{ dict.label }}
            </el-radio-button>
          </el-radio-group>
        </div>

        <div class="desc" v-if="queryParams.type == 2"
          ><img src="@/assets/imgs/question.png" alt="" />
          {{ `滞销 = 总平 < 5 且 单品创建日期大于30天 且 可发库存(除采购) > 0` }}
        </div>
        <div class="desc" v-if="queryParams.type == 3"
          ><img src="@/assets/imgs/question.png" alt="" />{{
            `补货 = 当前库存支撑天数 < 安全库存`
          }}</div
        >
      </div>

      <el-table
        style="width: 100%"
        :header-cell-style="{
          background: '#F2F6FC',
          color: '#666666',
          border: 'none',
          fontFamily: 'PingFangSC, PingFang SC'
        }"
        v-loading="loading"
        :data="list"
        :row-style="tableRowStyle"
        height="450"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
      >
        <el-table-column
          label="货品编码"
          prop="productCode"
          min-width="100"
          max-width="150"
          fixed
        />
        <el-table-column label="商家编码" prop="goodsCode" min-width="150" max-width="180" fixed />
        <el-table-column label="规格名称" prop="formName" min-width="100" />
        <el-table-column label="规格码" prop="formCode" max-width="120" />
        <el-table-column label="可发库存" prop="canSendInventory" min-width="120" max-width="150">
          <template #header>
            <div class="flex-row">
              <span>可发库存</span>
              <div class="flex-column">
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(15)"
                  v-if="queryParams.orderType == 15"
                  src="@/assets/imgs/common/caret-top_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(15)"
                  v-else
                  src="@/assets/imgs/common/caret-top.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(16)"
                  v-if="queryParams.orderType == 16"
                  src="@/assets/imgs/common/caret-bottom_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(16)"
                  v-else
                  src="@/assets/imgs/common/caret-bottom.png"
                  alt=""
                  style="width: 8px"
                />

                <!-- <Icon
                  :size="15"
                  class="ml-5px icon"
                  style="margin-bottom: 0px"
                  icon="ep:caret-top"
                  :class="{ active: queryParams.orderType == 15 }"
                  @click="handleSort(15)"
                /> -->
                <!-- <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-bottom"
                  :class="{ active: queryParams.orderType == 16 }"
                  @click="handleSort(16)"
                /> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="7天销量" prop="salesNum7day" min-width="120" max-width="150">
          <template #header>
            <div class="flex-row">
              <span>7天销量</span>
              <div class="flex-column">
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(5)"
                  v-if="queryParams.orderType == 5"
                  src="@/assets/imgs/common/caret-top_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(5)"
                  v-else
                  src="@/assets/imgs/common/caret-top.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(6)"
                  v-if="queryParams.orderType == 6"
                  src="@/assets/imgs/common/caret-bottom_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(6)"
                  v-else
                  src="@/assets/imgs/common/caret-bottom.png"
                  alt=""
                  style="width: 8px"
                />
                <!-- <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-top"
                  :class="{ active: queryParams.orderType == 5 }"
                  @click="handleSort(5)"
                />
                <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-bottom"
                  :class="{ active: queryParams.orderType == 6 }"
                  @click="handleSort(6)"
                /> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="可销天数/7日" prop="salesDay7day" min-width="130" max-width="150">
          <template #header>
            <div class="flex-row">
              <span>可销天数/7日</span>
              <div class="flex-column">
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(7)"
                  v-if="queryParams.orderType == 7"
                  src="@/assets/imgs/common/caret-top_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(7)"
                  v-else
                  src="@/assets/imgs/common/caret-top.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(8)"
                  v-if="queryParams.orderType == 8"
                  src="@/assets/imgs/common/caret-bottom_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(8)"
                  v-else
                  src="@/assets/imgs/common/caret-bottom.png"
                  alt=""
                  style="width: 8px"
                />
                <!-- <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-top"
                  :class="{ active: queryParams.orderType == 7 }"
                  @click="handleSort(7)"
                />
                <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-bottom"
                  :class="{ active: queryParams.orderType == 8 }"
                  @click="handleSort(8)"
                /> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="可用库存" prop="canUseInventory" min-width="150" max-width="200">
          <template #header>
            <div class="flex-row">
              <span>可用库存</span>
              <div class="flex-column">
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(17)"
                  v-if="queryParams.orderType == 17"
                  src="@/assets/imgs/common/caret-top_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(17)"
                  v-else
                  src="@/assets/imgs/common/caret-top.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(18)"
                  v-if="queryParams.orderType == 18"
                  src="@/assets/imgs/common/caret-bottom_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(18)"
                  v-else
                  src="@/assets/imgs/common/caret-bottom.png"
                  alt=""
                  style="width: 8px"
                />
                <!-- <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-top"
                  :class="{ active: queryParams.orderType == 17 }"
                  @click="handleSort(17)"
                />
                <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-bottom"
                  :class="{ active: queryParams.orderType == 18 }"
                  @click="handleSort(18)"
                /> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="可发库存（除采购）"
          prop="canSendInventoryNobuy"
          min-width="180"
          max-width="220"
        >
          <template #header>
            <div class="flex-row">
              <span>可发库存（除采购）</span>
              <div class="flex-column">
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(19)"
                  v-if="queryParams.orderType == 19"
                  src="@/assets/imgs/common/caret-top_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(19)"
                  v-else
                  src="@/assets/imgs/common/caret-top.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(20)"
                  v-if="queryParams.orderType == 20"
                  src="@/assets/imgs/common/caret-bottom_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(20)"
                  v-else
                  src="@/assets/imgs/common/caret-bottom.png"
                  alt=""
                  style="width: 8px"
                />
                <!-- <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-top"
                  :class="{ active: queryParams.orderType == 19 }"
                  @click="handleSort(19)"
                />
                <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-bottom"
                  :class="{ active: queryParams.orderType == 20 }"
                  @click="handleSort(20)"
                /> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="采购在途" prop="purchaseInTransit" min-width="120" max-width="150">
          <template #header>
            <div class="flex-row">
              <span>采购在途</span>
              <div class="flex-column">
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(21)"
                  v-if="queryParams.orderType == 21"
                  src="@/assets/imgs/common/caret-top_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(21)"
                  v-else
                  src="@/assets/imgs/common/caret-top.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(22)"
                  v-if="queryParams.orderType == 22"
                  src="@/assets/imgs/common/caret-bottom_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(22)"
                  v-else
                  src="@/assets/imgs/common/caret-bottom.png"
                  alt=""
                  style="width: 8px"
                />
                <!-- <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-top"
                  :class="{ active: queryParams.orderType == 21 }"
                  @click="handleSort(21)"
                />
                <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-bottom"
                  :class="{ active: queryParams.orderType == 22 }"
                  @click="handleSort(22)"
                /> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="今日销量" prop="salesNumToday" min-width="120" max-width="150">
          <template #header>
            <div class="flex-row">
              <span>今日销量</span>
              <div class="flex-column">
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(1)"
                  v-if="queryParams.orderType == 1"
                  src="@/assets/imgs/common/caret-top_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(1)"
                  v-else
                  src="@/assets/imgs/common/caret-top.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(2)"
                  v-if="queryParams.orderType == 2"
                  src="@/assets/imgs/common/caret-bottom_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(2)"
                  v-else
                  src="@/assets/imgs/common/caret-bottom.png"
                  alt=""
                  style="width: 8px"
                />
                <!-- <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-top"
                  :class="{ active: queryParams.orderType == 1 }"
                  @click="handleSort(1)"
                />
                <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-bottom"
                  :class="{ active: queryParams.orderType == 2 }"
                  @click="handleSort(2)"
                /> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="昨日销量" prop="salesNumYesterday" min-width="120" max-width="150">
          <template #header>
            <div class="flex-row">
              <span>昨日销量</span>
              <div class="flex-column">
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(3)"
                  v-if="queryParams.orderType == 3"
                  src="@/assets/imgs/common/caret-top_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(3)"
                  v-else
                  src="@/assets/imgs/common/caret-top.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(4)"
                  v-if="queryParams.orderType == 4"
                  src="@/assets/imgs/common/caret-bottom_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(4)"
                  v-else
                  src="@/assets/imgs/common/caret-bottom.png"
                  alt=""
                  style="width: 8px"
                />
                <!-- <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-top"
                  :class="{ active: queryParams.orderType == 3 }"
                  @click="handleSort(3)"
                />
                <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-bottom"
                  :class="{ active: queryParams.orderType == 4 }"
                  @click="handleSort(4)"
                /> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="14天销量" prop="salesNum14day" min-width="120" max-width="150">
          <template #header>
            <div class="flex-row">
              <span>14天销量</span>
              <div class="flex-column">
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(9)"
                  v-if="queryParams.orderType == 9"
                  src="@/assets/imgs/common/caret-top_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(9)"
                  v-else
                  src="@/assets/imgs/common/caret-top.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(10)"
                  v-if="queryParams.orderType == 10"
                  src="@/assets/imgs/common/caret-bottom_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(10)"
                  v-else
                  src="@/assets/imgs/common/caret-bottom.png"
                  alt=""
                  style="width: 8px"
                />
                <!-- <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-top"
                  :class="{ active: queryParams.orderType == 9 }"
                  @click="handleSort(9)"
                />
                <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-bottom"
                  :class="{ active: queryParams.orderType == 10 }"
                  @click="handleSort(10)"
                /> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="30天销量" prop="salesNum30day" min-width="120" max-width="150">
          <template #header>
            <div class="flex-row">
              <span>30天销量</span>
              <div class="flex-column">
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(11)"
                  v-if="queryParams.orderType == 11"
                  src="@/assets/imgs/common/caret-top_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(11)"
                  v-else
                  src="@/assets/imgs/common/caret-top.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(12)"
                  v-if="queryParams.orderType == 12"
                  src="@/assets/imgs/common/caret-bottom_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(12)"
                  v-else
                  src="@/assets/imgs/common/caret-bottom.png"
                  alt=""
                  style="width: 8px"
                />
                <!-- <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-top"
                  :class="{ active: queryParams.orderType == 11 }"
                  @click="handleSort(11)"
                />
                <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-bottom"
                  :class="{ active: queryParams.orderType == 12 }"
                  @click="handleSort(12)"
                /> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="60天销量" prop="salesNum60day" min-width="120" max-width="150">
          <template #header>
            <div class="flex-row">
              <span>60天销量</span>
              <div class="flex-column">
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(13)"
                  v-if="queryParams.orderType == 13"
                  src="@/assets/imgs/common/caret-top_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(13)"
                  v-else
                  src="@/assets/imgs/common/caret-top.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(14)"
                  v-if="queryParams.orderType == 14"
                  src="@/assets/imgs/common/caret-bottom_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(14)"
                  v-else
                  src="@/assets/imgs/common/caret-bottom.png"
                  alt=""
                  style="width: 8px"
                />
                <!-- <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-top"
                  :class="{ active: queryParams.orderType == 13 }"
                  @click="handleSort(13)"
                />
                <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-bottom"
                  :class="{ active: queryParams.orderType == 14 }"
                  @click="handleSort(14)"
                /> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="单品创建日期"
          :formatter="dateFormatter"
          prop="singleItemCreateTime"
          min-width="180"
        />
        <el-table-column label="总平" prop="totalAverage" min-width="120" fixed="right">
          <template #header>
            <div class="flex-row" style="margin-right: 20px">
              <div class="flex-row">
                <span>总平</span>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="总平 = ((七天销量 / 7) + (十四天销量 / 14)) / 2"
                  placement="top"
                >
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>

              <div class="flex-column">
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(23)"
                  v-if="queryParams.orderType == 23"
                  src="@/assets/imgs/common/caret-top_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(23)"
                  v-else
                  src="@/assets/imgs/common/caret-top.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(24)"
                  v-if="queryParams.orderType == 24"
                  src="@/assets/imgs/common/caret-bottom_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(24)"
                  v-else
                  src="@/assets/imgs/common/caret-bottom.png"
                  alt=""
                  style="width: 8px"
                />
                <!-- <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-top"
                  :class="{ active: queryParams.orderType == 23 }"
                  @click="handleSort(23)"
                />
                <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-bottom"
                  :class="{ active: queryParams.orderType == 24 }"
                  @click="handleSort(24)"
                /> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="支撑天数" prop="supportDay" min-width="120" fixed="right">
          <template #header>
            <div class="flex-row">
              <div class="flex-row">
                <span>支撑天数</span>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="支撑天数 =（可发库存(除采购外) + 采购在途）/ 总平"
                  placement="top"
                >
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
              <div class="flex-column">
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(25)"
                  v-if="queryParams.orderType == 25"
                  src="@/assets/imgs/common/caret-top_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(25)"
                  v-else
                  src="@/assets/imgs/common/caret-top.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(26)"
                  v-if="queryParams.orderType == 26"
                  src="@/assets/imgs/common/caret-bottom_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(26)"
                  v-else
                  src="@/assets/imgs/common/caret-bottom.png"
                  alt=""
                  style="width: 8px"
                />
                <!-- <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-top"
                  :class="{ active: queryParams.orderType == 25 }"
                  @click="handleSort(25)"
                />
                <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-bottom"
                  :class="{ active: queryParams.orderType == 26 }"
                  @click="handleSort(26)"
                /> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="补货量"
          prop="replenishmentQuantity"
          min-width="120"
          max-width="180"
          fixed="right"
        >
          <template #header>
            <div class="flex-row">
              <div class="flex-row">
                <span>补货量</span>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="补货量 = 支撑天数 * 分级 - 可发库存(除采购外)"
                  placement="top"
                >
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
              <div class="flex-column">
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(27)"
                  v-if="queryParams.orderType == 27"
                  src="@/assets/imgs/common/caret-top_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(27)"
                  v-else
                  src="@/assets/imgs/common/caret-top.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(28)"
                  v-if="queryParams.orderType == 28"
                  src="@/assets/imgs/common/caret-bottom_active.png"
                  alt=""
                  style="width: 8px"
                />
                <img
                  class="ml-5px mt-5px"
                  @click="handleSort(28)"
                  v-else
                  src="@/assets/imgs/common/caret-bottom.png"
                  alt=""
                  style="width: 8px"
                />
                <!-- <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-top"
                  :class="{ active: queryParams.orderType == 27 }"
                  @click="handleSort(27)"
                />
                <Icon
                  :size="15"
                  class="ml-5px icon"
                  icon="ep:caret-bottom"
                  :class="{ active: queryParams.orderType == 28 }"
                  @click="handleSort(28)"
                /> -->
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </ContentWrap>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { getSkuGoodsInventoryList, skuGoodsInventoryExport } from '@/api/shop/index'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { Search } from '@element-plus/icons-vue'

const appStore = useAppStore()
const message = useMessage() // 消息弹窗

const OrderOptions = ref([
  {
    label: '全部',
    value: 1
  },
  {
    label: '滞销',
    value: 2
  },
  {
    label: '补货',
    value: 3
  }
])

defineOptions({ name: 'StockList' })

const exportLoading = ref(false)
// 导出功能
const handleExport = async () => {
  try {
    exportLoading.value = true
    const res = await skuGoodsInventoryExport(queryParams)
    if (res) {
      download.excel(res, `库存信息导出.xls`)
      message.success('导出成功')
    }
  } catch (error) {
    message.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

const queryParams = reactive({
  page: 1,
  size: 10,
  goodsCode: undefined,
  type: 1,
  orderType: undefined,
  productCode: undefined
})
const total = ref(0) // 列表的总页数
const loading = ref(false)
const list = ref([]) // 列表的数据

const addList = ref([
  {
    label: '导出',
    code: 'export'
  }
])
// 当前新增按钮code码
const currentAddCode = ref(addList.value[0].code)

// 新增按钮点击
const addBtnClick = (value) => {
  if (value) {
    currentAddCode.value = value.code
    if (currentAddCode.value === 'export') {
      handleExport()
    }
  }
}

onMounted(() => {
  getList()
})

const handleSort = (value) => {
  queryParams.orderType = value
  getList()
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

const handleTypeChange = () => {
  getList()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const res = await getSkuGoodsInventoryList(queryParams)
    list.value = res.records || []
    total.value = res.total
  } finally {
    loading.value = false
  }
}

// 重置按钮操作
const queryFormRef = ref()
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

// 修改表格斑马纹
const tableRowStyle = (row) => {
  return row.rowIndex % 2 === 0 ? { background: '#fff' } : { background: 'rgba(242, 246, 252,1)' }
}
</script>

<style scoped lang="scss">
@use '@/styles/eltable.scss';
// 修改鼠标移入的背景色
:deep(.el-table tbody tr:hover > td) {
  background: #f2f6fc !important;
}
/* 修改搜索框样式 */
:deep(.el-input__inner) {
  height: 32px;
  line-height: 32px;
}

/* 修改单选框样式 */
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  color: #0052d9;
  background-color: #ffffff;
  border-color: #e5e5e5;
  -webkit-box-shadow: -1px 0 0 0 #e5e5e5;
  box-shadow: -1px 0 0 0 #e5e5e5;
}

// 去掉表格底部的线
:deep(.el-table__inner-wrapper) {
  &::before {
    height: 0;
  }
}

img {
  vertical-align: middle;
  margin-right: 3px;
}
.topSearch {
  width: 100%;
  border-bottom: 1px solid #f2f6fc;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
.topStatics {
  margin-top: 20px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.flex-column {
  display: flex;
  flex-direction: column;
}
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.icon {
  cursor: pointer;
}
.active {
  color: #409eff;
}
.desc {
  padding: 8px 15px;
  background: #f8fafd;
  border-radius: 14px;
  font-size: 12px;
  color: #333333;
  text-align: center;
}
</style>
