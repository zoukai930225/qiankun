<template>
  <!-- 列表 -->

  <ContentWrap>
    <div>
      <div class="commonTopFilterWrap" ref="commonTopFilterWrapRef">
        <div class="commonTopFilterWrap-filter">
          <el-form
            :model="queryParams"
            ref="queryFormRef"
            :inline="true"
            label-width="68px"
            @submit.prevent
          >
            <el-form-item label="时间" prop="date">
              <el-date-picker
                style="width: 200px"
                v-model="queryParams.date"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="选择时间"
                @change="getList()"
              />
            </el-form-item>
            <el-form-item label="店铺" prop="store">
              <el-select
                class="searchFormItemWidth"
                v-model="queryParams.store"
                placeholder="请选择店铺"
                @change="handleQuery"
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.PAID_PROMOTION, true)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="商品名称" prop="goodsName">
              <el-input
                class="searchFormItemWidth"
                v-model="queryParams.goodsName"
                placeholder="请输入商品名称"
                clearable
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item label="ID" prop="goodsId">
              <el-input
                class="searchFormItemWidth"
                v-model="queryParams.goodsId"
                placeholder="请输入商品ID"
                clearable
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item v-if="isExpand" label="编码" prop="goodsCode">
              <el-input
                class="searchFormItemWidth"
                v-model="queryParams.goodsCode"
                placeholder="请输入商品编码"
                clearable
                @keyup.enter="handleQuery"
                @clear="handleQuery"
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
            <!-- <el-button class="exportImg" :loading="imgExporting" type="primary" @click="exportImg"
              >导出图片</el-button
            > -->
            <SWFilterAdd
              class="commonAddBtn"
              :list="addList"
              :current-code="currentAddCode"
              :loading="imgExporting"
              @add-btn-click="addBtnClick"
            />
          </div>
        </div>
      </div>
      <SWFilterExpandAll
        v-if="showExapndAll"
        :isExpand="isExpand"
        @expand-click="isExpand = !isExpand"
        style="margin-bottom: 15px"
      />
    </div>
    <SWLayoutChange :layoutMode="layoutMode" @layout-mode-change="layoutModeChange" />
    <div style="height: 10px"></div>
  </ContentWrap>

  <CategorySelect
    :selectCategory="selectCategory"
    :list="categoryList"
    @category-select="categorySelect"
  />

  <div class="mainContainer">
    <div class="content">
      <ElScrollbar class="paidPromotionTable">
        <div class="paidPromotionTable-header">
          <div
            class="paidPromotionTable-header-item"
            :class="{ 'paidPromotionTable-header-itemTable': layoutMode === 1 }"
            v-for="(value, index) in headerConfig"
            :key="index"
          >
            <div
              v-if="value.title === '昨日去退费比'"
              class="row-center"
              :style="{
                paddingLeft: value.left ? `${value.left}px` : '',
                marginRight: value.right ? `${value.right}px` : '',
                textAlign: value.textAlign ? `${value.textAlign}` : 'left',
                width: value.width ? `${value.width}px` : '',
                color: value.color ? value.color : ''
              }"
            >
              <div>
                <span style="color: #ff1313">昨日</span>
                <span style="padding-left: 0px">去退费比</span></div
              >

              <div v-if="value.sort" class="headerSort" @click="sortClick(value.field)">
                <el-icon
                  class="headerSort-asc"
                  :color="
                    sortFieldName === value.field && sortFieldOrder === 'asc' ? '#0064FF' : '#999'
                  "
                  ><CaretTop
                /></el-icon>
                <el-icon
                  class="headerSort-desc"
                  :color="
                    sortFieldName === value.field && sortFieldOrder === 'desc' ? '#0064FF' : '#999'
                  "
                  ><CaretBottom
                /></el-icon>
              </div>
            </div>

            <div
              v-if="value.title === '近7天付费占比(花费/总销售额)'"
              class="row-center"
              :style="{
                paddingLeft: value.left ? `${value.left}px` : '',
                marginRight: value.right ? `${value.right}px` : '',
                textAlign: value.textAlign ? `${value.textAlign}` : 'left',
                width: value.width ? `${value.width}px` : '',
                color: value.color ? value.color : ''
              }"
            >
              <div>
                <span>近</span>
                <span style="color: #ff1313">7</span>
                <span style="padding-left: 0px">天付费占比(花费/总销售额)</span></div
              >

              <div v-if="value.sort" class="headerSort" @click="sortClick(value.field)">
                <el-icon
                  class="headerSort-asc"
                  :color="
                    sortFieldName === value.field && sortFieldOrder === 'asc' ? '#0064FF' : '#999'
                  "
                  ><CaretTop
                /></el-icon>
                <el-icon
                  class="headerSort-desc"
                  :color="
                    sortFieldName === value.field && sortFieldOrder === 'desc' ? '#0064FF' : '#999'
                  "
                  ><CaretBottom
                /></el-icon>
              </div>
            </div>

            <div
              v-if="value.title === '近30天付费占比(花费/总销售额)'"
              class="row-center"
              :style="{
                paddingLeft: value.left ? `${value.left}px` : '',
                marginRight: value.right ? `${value.right}px` : '',
                textAlign: value.textAlign ? `${value.textAlign}` : 'left',
                width: value.width ? `${value.width}px` : '',
                color: value.color ? value.color : ''
              }"
            >
              <div>
                <span>近</span>
                <span style="color: #ff1313">30</span>
                <span style="padding-left: 0px">天付费占比(花费/总销售额)</span></div
              >

              <div v-if="value.sort" class="headerSort" @click="sortClick(value.field)">
                <el-icon
                  class="headerSort-asc"
                  :color="
                    sortFieldName === value.field && sortFieldOrder === 'asc' ? '#0064FF' : '#999'
                  "
                  ><CaretTop
                /></el-icon>
                <el-icon
                  class="headerSort-desc"
                  :color="
                    sortFieldName === value.field && sortFieldOrder === 'desc' ? '#0064FF' : '#999'
                  "
                  ><CaretBottom
                /></el-icon>
              </div>
            </div>

            <div
              v-if="value.title === '本月付费占比(花费/总销售额)'"
              class="row-center"
              :style="{
                paddingLeft: value.left ? `${value.left}px` : '',
                marginRight: value.right ? `${value.right}px` : '',
                textAlign: value.textAlign ? `${value.textAlign}` : 'left',
                width: value.width ? `${value.width}px` : '',
                color: value.color ? value.color : ''
              }"
            >
              <div>
                <span style="color: #ff1313">本月</span>
                <span style="padding-left: 0px">付费占比(花费/总销售额)</span></div
              >

              <div v-if="value.sort" class="headerSort" @click="sortClick(value.field)">
                <el-icon
                  class="headerSort-asc"
                  :color="
                    sortFieldName === value.field && sortFieldOrder === 'asc' ? '#0064FF' : '#999'
                  "
                  ><CaretTop
                /></el-icon>
                <el-icon
                  class="headerSort-desc"
                  :color="
                    sortFieldName === value.field && sortFieldOrder === 'desc' ? '#0064FF' : '#999'
                  "
                  ><CaretBottom
                /></el-icon>
              </div>
            </div>

            <div
              v-if="
                ![
                  '昨日去退费比',
                  '近7天付费占比(花费/总销售额)',
                  '近30天付费占比(花费/总销售额)',
                  '本月付费占比(花费/总销售额)'
                ].includes(value.title)
              "
              class="row-center"
              :style="{
                paddingLeft: value.left ? `${value.left}px` : '',
                marginRight: value.right ? `${value.right}px` : '',
                textAlign: value.textAlign ? `${value.textAlign}` : 'left',
                color: value.color ? value.color : '',
                width: value.width ? `${value.width}px` : ''
              }"
            >
              <div>{{ value.title }}</div>
              <div v-if="value.sort" class="headerSort" @click="sortClick(value.field)">
                <el-icon
                  class="headerSort-asc"
                  :color="
                    sortFieldName === value.field && sortFieldOrder === 'asc' ? '#0064FF' : '#999'
                  "
                  ><CaretTop
                /></el-icon>
                <el-icon
                  class="headerSort-desc"
                  :color="
                    sortFieldName === value.field && sortFieldOrder === 'desc' ? '#0064FF' : '#999'
                  "
                  ><CaretBottom
                /></el-icon>
              </div>
            </div>
          </div>
        </div>
        <ElScrollbar class="paidPromotioContentScroll">
          <div
            class="paidPromotionTable-column"
            :class="{
              'paidPromotionTable-columnTable': layoutMode === 1
            }"
            v-for="(value, index) in list"
            :style="{ background: index % 2 === 0 ? '#fafafa' : '' }"
            :key="index"
          >
            <div
              class="paidPromotionTable-column-item"
              v-for="(value1, index1) in headerConfig"
              :key="index1"
              :class="{
                'paidPromotionTable-column-itemTotal': value.isTotal,
                'paidPromotionTable-column-itemTable': layoutMode === 1,
                'paidPromotionTable-column-itemTableBottom':
                  layoutMode === 1 && index === list.length - 1
              }"
            >
              <div
                v-if="value1.field === 'image' && value.isTotal"
                style="padding-left: 20px; color: #0064ff"
                :style="{
                  paddingLeft: value1.left ? `${value1.left}px` : '',
                  marginRight: value1.right ? `${value1.right}px` : '',
                  textAlign: value1.textAlign ? `${value1.textAlign}` : 'left',
                  width: value1.width ? `${value1.width}px` : ''
                }"
                >{{ totalData.result || '合计' }}</div
              >

              <el-popover
                v-if="value1.field === 'image' && !value.isTotal"
                placement="right"
                :width="348"
                trigger="hover"
                :show-arrow="false"
                :offset="0"
              >
                <template #reference>
                  <div
                    class="row-center"
                    :style="{
                      paddingLeft: value1.left ? `${value1.left}px` : '',
                      marginRight: value1.right ? `${value1.right}px` : '',
                      textAlign: value1.textAlign ? `${value1.textAlign}` : 'left',
                      width: value1.width ? `${value1.width}px` : ''
                    }"
                  >
                    <el-image
                      style="width: 40px; height: 40px; border-radius: 6px; vertical-align: middle"
                      :src="value[value1.field] || ''"
                      :preview-src-list="[value[value1.field] || '']"
                      :preview-teleported="true"
                  /></div>
                </template>
                <GoodCard
                  :good="{
                    materialName: value.goodsName || '',
                    goodsImage: value.goodsImage || '',
                    materialId: value.goodsId,
                    channel: value.channel || ''
                  }"
                />
              </el-popover>
              <!-- 产品等级 -->
              <div
                v-if="value1.field === 'productGrade' && !value.isTotal"
                @mouseover="productGradeHandleMouseOver(value)"
                @mouseout="saveProductGrade(value)"
                :style="{
                  paddingLeft: value1.left ? `${value1.left}px` : '',
                  marginRight: value1.right ? `${value1.right}px` : '',
                  textAlign: value1.textAlign ? `${value1.textAlign}` : 'left',
                  width: value1.width ? `${value1.width}px` : ''
                }"
              >
                <el-input
                  v-show="value.isEditProductGrade"
                  v-model="value.editProductGrade"
                  placeholder="请输入"
                  class="editValue"
                  clearable
                  @keyup.enter="saveProductGrade(value)"
                  @clear="clearProductGrade(value)"
                />
                <div v-show="!value.isEditProductGrade">
                  {{ value.productGrade || '--' }}
                </div>
              </div>
              <div
                v-else
                :style="{
                  paddingLeft: value1.left ? `${value1.left}px` : '',
                  marginRight: value1.right ? `${value1.right}px` : '',
                  textAlign: value1.textAlign ? `${value1.textAlign}` : 'left',
                  width: value1.width ? `${value1.width}px` : ''
                }"
              ></div>
              <!-- 预估达成结果 -->
              <div
                v-if="value1.field === 'expectedResultsAchieved' && !value.isTotal"
                @mouseover="expectedResultsAchievedHandleMouseOver(value)"
                @mouseout="saveExpectedResultsAchieved(value)"
                :style="{
                  paddingLeft: value1.left ? `${value1.left}px` : '',
                  marginRight: value1.right ? `${value1.right}px` : '',
                  textAlign: value1.textAlign ? `${value1.textAlign}` : 'left',
                  width: value1.width ? `${value1.width}px` : ''
                }"
              >
                <el-input
                  v-show="value.isEditExpectedResultsAchieved"
                  v-model="value.editExpectedResultsAchieved"
                  placeholder="请输入"
                  class="editValue"
                  clearable
                  @keyup.enter="saveExpectedResultsAchieved(value)"
                  @clear="clearExpectedResultsAchieved(value)"
                />
                <div v-show="!value.isEditExpectedResultsAchieved">
                  {{ value.expectedResultsAchieved || '--' }}
                </div>
              </div>
              <div
                v-else
                :style="{
                  paddingLeft: value1.left ? `${value1.left}px` : '',
                  marginRight: value1.right ? `${value1.right}px` : '',
                  textAlign: value1.textAlign ? `${value1.textAlign}` : 'left',
                  width: value1.width ? `${value1.width}px` : ''
                }"
              ></div>
              <!-- 推广目的 -->
              <div
                v-if="value1.field === 'promotionPurpose' && !value.isTotal"
                @mouseover="promotionPurposeHandleMouseOver(value)"
                @mouseout="savePromotionPurpose(value)"
                :style="{
                  paddingLeft: value1.left ? `${value1.left}px` : '',
                  marginRight: value1.right ? `${value1.right}px` : '',
                  textAlign: value1.textAlign ? `${value1.textAlign}` : 'left',
                  width: value1.width ? `${value1.width}px` : ''
                }"
              >
                <el-input
                  v-show="value.isEditPromotionPurpose"
                  v-model="value.editPromotionPurpose"
                  placeholder="请输入"
                  class="editValue1"
                  clearable
                  @keyup.enter="savePromotionPurpose(value)"
                  @clear="clearPromotionPurpose(value)"
                />
                <div v-show="!value.isEditPromotionPurpose">
                  {{ value.promotionPurpose || '--' }}
                </div>
              </div>
              <div
                v-else
                :style="{
                  paddingLeft: value1.left ? `${value1.left}px` : '',
                  marginRight: value1.right ? `${value1.right}px` : '',
                  textAlign: value1.textAlign ? `${value1.textAlign}` : 'left',
                  width: value1.width ? `${value1.width}px` : ''
                }"
              ></div>
              <div v-if="value1.showPercent" class="row" style="position: relative">
                <SWProgressLabel
                  :value="value[value1.field]"
                  :progress="getSWProgressLabelProgress(value[value1.field])"
                  :fontSize="value.isTotal ? 16 : 14"
                  textColor="#EB3737"
                  backgroundColor="#EF5F5F"
              /></div>

              <div
                v-if="
                  value1.field !== 'image' &&
                  value1.field !== 'productGrade' &&
                  value1.field !== 'expectedResultsAchieved' &&
                  value1.field !== 'promotionPurpose' &&
                  !value1.showPercent
                "
                :style="{
                  paddingLeft: value1.left ? `${value1.left}px` : '',
                  marginRight: value1.right ? `${value1.right}px` : '',
                  textAlign: value1.textAlign ? `${value1.textAlign}` : 'left',
                  width: value1.width ? `${value1.width}px` : ''
                }"
                >{{ value[value1.field] }}</div
              >
            </div>
          </div>
        </ElScrollbar>

        <div v-if="list && list.length === 0" class="paidPromotionTable-empty">
          <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" />
          <span>暂无数据</span>
        </div>
      </ElScrollbar>
    </div>

    <!-- 分页 -->
    <Pagination
      style="padding-bottom: 20px"
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />
  </div>

  <div
    class="exportableBg"
    ref="imgExportRef"
    id="imgExportRef"
    :style="{ width: `${3596 + 40 + 160 + 16 * 33}px`, height: `${imgExportHeight}px` }"
  >
    <div class="mainContainer" ref="exportImgMainRef">
      <div class="content">
        <ElScrollbar class="paidPromotionTable">
          <div class="paidPromotionTable-header">
            <div
              class="paidPromotionTable-header-item"
              :class="{ 'paidPromotionTable-header-itemTable': layoutMode === 1 }"
              v-for="(value, index) in headerConfig"
              :key="index"
            >
              <div
                v-if="value.title === '昨日去退费比'"
                class="row-center"
                :style="{
                  paddingLeft: value.left ? `${value.left}px` : '',
                  marginRight: value.right ? `${value.right}px` : '',
                  textAlign: value.textAlign ? `${value.textAlign}` : 'left',
                  width: value.width ? `${value.width}px` : '',
                  color: value.color ? value.color : ''
                }"
              >
                <div>
                  <span style="color: #ff1313">昨日</span>
                  <span style="padding-left: 0px">去退费比</span></div
                >

                <div v-if="value.sort" class="headerSort" @click="sortClick(value.field)">
                  <el-icon
                    class="headerSort-asc"
                    :color="
                      sortFieldName === value.field && sortFieldOrder === 'asc' ? '#0064FF' : '#999'
                    "
                    ><CaretTop
                  /></el-icon>
                  <el-icon
                    class="headerSort-desc"
                    :color="
                      sortFieldName === value.field && sortFieldOrder === 'desc'
                        ? '#0064FF'
                        : '#999'
                    "
                    ><CaretBottom
                  /></el-icon>
                </div>
              </div>

              <div
                v-if="value.title === '近7天付费占比(花费/总销售额)'"
                class="row-center"
                :style="{
                  paddingLeft: value.left ? `${value.left}px` : '',
                  marginRight: value.right ? `${value.right}px` : '',
                  textAlign: value.textAlign ? `${value.textAlign}` : 'left',
                  width: value.width ? `${value.width}px` : '',
                  color: value.color ? value.color : ''
                }"
              >
                <div>
                  <span>近</span>
                  <span style="color: #ff1313">7</span>
                  <span style="padding-left: 0px">天付费占比(花费/总销售额)</span></div
                >

                <div v-if="value.sort" class="headerSort" @click="sortClick(value.field)">
                  <el-icon
                    class="headerSort-asc"
                    :color="
                      sortFieldName === value.field && sortFieldOrder === 'asc' ? '#0064FF' : '#999'
                    "
                    ><CaretTop
                  /></el-icon>
                  <el-icon
                    class="headerSort-desc"
                    :color="
                      sortFieldName === value.field && sortFieldOrder === 'desc'
                        ? '#0064FF'
                        : '#999'
                    "
                    ><CaretBottom
                  /></el-icon>
                </div>
              </div>

              <div
                v-if="value.title === '近30天付费占比(花费/总销售额)'"
                class="row-center"
                :style="{
                  paddingLeft: value.left ? `${value.left}px` : '',
                  marginRight: value.right ? `${value.right}px` : '',
                  textAlign: value.textAlign ? `${value.textAlign}` : 'left',
                  width: value.width ? `${value.width}px` : '',
                  color: value.color ? value.color : ''
                }"
              >
                <div>
                  <span>近</span>
                  <span style="color: #ff1313">30</span>
                  <span style="padding-left: 0px">天付费占比(花费/总销售额)</span></div
                >

                <div v-if="value.sort" class="headerSort" @click="sortClick(value.field)">
                  <el-icon
                    class="headerSort-asc"
                    :color="
                      sortFieldName === value.field && sortFieldOrder === 'asc' ? '#0064FF' : '#999'
                    "
                    ><CaretTop
                  /></el-icon>
                  <el-icon
                    class="headerSort-desc"
                    :color="
                      sortFieldName === value.field && sortFieldOrder === 'desc'
                        ? '#0064FF'
                        : '#999'
                    "
                    ><CaretBottom
                  /></el-icon>
                </div>
              </div>

              <div
                v-if="value.title === '本月付费占比(花费/总销售额)'"
                class="row-center"
                :style="{
                  paddingLeft: value.left ? `${value.left}px` : '',
                  marginRight: value.right ? `${value.right}px` : '',
                  textAlign: value.textAlign ? `${value.textAlign}` : 'left',
                  width: value.width ? `${value.width}px` : '',
                  color: value.color ? value.color : ''
                }"
              >
                <div>
                  <span style="color: #ff1313">本月</span>
                  <span style="padding-left: 0px">付费占比(花费/总销售额)</span></div
                >

                <div v-if="value.sort" class="headerSort" @click="sortClick(value.field)">
                  <el-icon
                    class="headerSort-asc"
                    :color="
                      sortFieldName === value.field && sortFieldOrder === 'asc' ? '#0064FF' : '#999'
                    "
                    ><CaretTop
                  /></el-icon>
                  <el-icon
                    class="headerSort-desc"
                    :color="
                      sortFieldName === value.field && sortFieldOrder === 'desc'
                        ? '#0064FF'
                        : '#999'
                    "
                    ><CaretBottom
                  /></el-icon>
                </div>
              </div>

              <div
                v-if="
                  ![
                    '昨日去退费比',
                    '近7天付费占比(花费/总销售额)',
                    '近30天付费占比(花费/总销售额)',
                    '本月付费占比(花费/总销售额)'
                  ].includes(value.title)
                "
                class="row-center"
                :style="{
                  paddingLeft: value.left ? `${value.left}px` : '',
                  marginRight: value.right ? `${value.right}px` : '',
                  textAlign: value.textAlign ? `${value.textAlign}` : 'left',
                  color: value.color ? value.color : '',
                  width: value.width ? `${value.width}px` : ''
                }"
              >
                <div>{{ value.title }}</div>
                <div v-if="value.sort" class="headerSort" @click="sortClick(value.field)">
                  <el-icon
                    class="headerSort-asc"
                    :color="
                      sortFieldName === value.field && sortFieldOrder === 'asc' ? '#0064FF' : '#999'
                    "
                    ><CaretTop
                  /></el-icon>
                  <el-icon
                    class="headerSort-desc"
                    :color="
                      sortFieldName === value.field && sortFieldOrder === 'desc'
                        ? '#0064FF'
                        : '#999'
                    "
                    ><CaretBottom
                  /></el-icon>
                </div>
              </div>
            </div>
          </div>
          <ElScrollbar class="paidPromotioContentScrollExport">
            <div
              class="paidPromotionTable-column"
              :class="{ 'paidPromotionTable-columnTable': layoutMode === 1 }"
              v-for="(value, index) in list"
              :style="{ background: index % 2 === 0 ? '#fafafa' : '' }"
              :key="index"
            >
              <div
                class="paidPromotionTable-column-item"
                v-for="(value1, index1) in headerConfig"
                :key="index1"
                :class="{
                  'paidPromotionTable-column-itemTotal': value.isTotal,
                  'paidPromotionTable-column-itemTable': layoutMode === 1,
                  'paidPromotionTable-column-itemTableBottom':
                    layoutMode === 1 && index === list.length - 1
                }"
              >
                <div
                  v-if="value1.field === 'image' && value.isTotal"
                  style="padding-left: 20px; color: #0064ff"
                  :style="{
                    paddingLeft: value1.left ? `${value1.left}px` : '',
                    marginRight: value1.right ? `${value1.right}px` : '',
                    textAlign: value1.textAlign ? `${value1.textAlign}` : 'left',
                    width: value1.width ? `${value1.width}px` : ''
                  }"
                  >{{ totalData.result || '合计' }}</div
                >

                <div
                  v-if="value1.field === 'image' && !value.isTotal"
                  class="row-center"
                  :style="{
                    paddingLeft: value1.left ? `${value1.left}px` : '',
                    marginRight: value1.right ? `${value1.right}px` : '',
                    textAlign: value1.textAlign ? `${value1.textAlign}` : 'left',
                    width: value1.width ? `${value1.width}px` : ''
                  }"
                >
                  <img
                    style="width: 40px; height: 40px; border-radius: 6px; vertical-align: middle"
                    :src="imgBase64Dict[`${value[value1.field || '']}`] || ''"
                    crossorigin="anonymous"
                  />
                </div>
                <!-- 产品等级 -->
                <div
                  v-if="value1.field === 'productGrade' && !value.isTotal"
                  :style="{
                    paddingLeft: value1.left ? `${value1.left}px` : '',
                    marginRight: value1.right ? `${value1.right}px` : '',
                    textAlign: value1.textAlign ? `${value1.textAlign}` : 'left',
                    width: value1.width ? `${value1.width}px` : ''
                  }"
                >
                  <div>
                    {{ value.productGrade || '--' }}
                  </div>
                </div>
                <div
                  v-else
                  :style="{
                    paddingLeft: value1.left ? `${value1.left}px` : '',
                    marginRight: value1.right ? `${value1.right}px` : '',
                    textAlign: value1.textAlign ? `${value1.textAlign}` : 'left',
                    width: value1.width ? `${value1.width}px` : ''
                  }"
                ></div>
                <!-- 预估达成结果 -->
                <div
                  v-if="value1.field === 'expectedResultsAchieved' && !value.isTotal"
                  :style="{
                    paddingLeft: value1.left ? `${value1.left}px` : '',
                    marginRight: value1.right ? `${value1.right}px` : '',
                    textAlign: value1.textAlign ? `${value1.textAlign}` : 'left',
                    width: value1.width ? `${value1.width}px` : ''
                  }"
                >
                  <div>
                    {{ value.expectedResultsAchieved || '--' }}
                  </div>
                </div>
                <div
                  v-else
                  :style="{
                    paddingLeft: value1.left ? `${value1.left}px` : '',
                    marginRight: value1.right ? `${value1.right}px` : '',
                    textAlign: value1.textAlign ? `${value1.textAlign}` : 'left',
                    width: value1.width ? `${value1.width}px` : ''
                  }"
                ></div>
                <!-- 推广目的 -->
                <div
                  v-if="value1.field === 'promotionPurpose' && !value.isTotal"
                  @mouseover="promotionPurposeHandleMouseOver(value)"
                  @mouseout="savePromotionPurpose(value)"
                  :style="{
                    paddingLeft: value1.left ? `${value1.left}px` : '',
                    marginRight: value1.right ? `${value1.right}px` : '',
                    textAlign: value1.textAlign ? `${value1.textAlign}` : 'left',
                    width: value1.width ? `${value1.width}px` : ''
                  }"
                >
                  <div>
                    {{ value.promotionPurpose || '--' }}
                  </div>
                </div>
                <div
                  v-else
                  :style="{
                    paddingLeft: value1.left ? `${value1.left}px` : '',
                    marginRight: value1.right ? `${value1.right}px` : '',
                    textAlign: value1.textAlign ? `${value1.textAlign}` : 'left',
                    width: value1.width ? `${value1.width}px` : ''
                  }"
                ></div>
                <div v-if="value1.showPercent" class="row" style="position: relative">
                  <SWProgressLabel
                    :value="value[value1.field]"
                    :progress="getSWProgressLabelProgress(value[value1.field])"
                    :fontSize="value.isTotal ? 16 : 14"
                    textColor="#EB3737"
                    backgroundColor="#EF5F5F"
                /></div>

                <div
                  v-if="
                    value1.field !== 'image' &&
                    value1.field !== 'productGrade' &&
                    value1.field !== 'expectedResultsAchieved' &&
                    value1.field !== 'promotionPurpose' &&
                    !value1.showPercent
                  "
                  :style="{
                    paddingLeft: value1.left ? `${value1.left}px` : '',
                    marginRight: value1.right ? `${value1.right}px` : '',
                    textAlign: value1.textAlign ? `${value1.textAlign}` : 'left',
                    width: value1.width ? `${value1.width}px` : ''
                  }"
                  >{{ value[value1.field] }}</div
                >
              </div>
            </div>
          </ElScrollbar>

          <div v-if="list && list.length === 0" class="paidPromotionTable-empty">
            <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" />
            <span>暂无数据</span>
          </div>
        </ElScrollbar>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { Search } from '@element-plus/icons-vue'
import * as DateUtil from '@/utils/formatTime'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { imgToBase64 } from '@/utils/img'
import download from '@/utils/download'

import html2canvas from 'html2canvas-plus'

import CategorySelect from './components/categorySelect.vue'
import GoodCard from '@/components/common/goods/goodCard.vue'
import SWFilterExpandAll from '@/components/SWBaseComponent/SWFilterExpandAll/index.vue' // 展开组件
import SWProgressLabel from '@/components/SWBaseComponent/SWProgressLabel/index.vue'

import * as CommonApi from '@/api/common/index'
import * as ChannelDataApi from '@/api/channelData'

const message = useMessage() // 消息弹窗

defineOptions({ name: 'PaidPromotion' })

const isExpand = ref(false) // 是否展开
const total = ref(0)
const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据

const imgExporting = ref(false)

// 获取默认日期
const getDefaultDate = () => {
  const lastDay = DateUtil.getLastDay()[0] || ''
  const arr = lastDay.split(' ')
  return arr.length > 0 ? arr[0] : ''
}

const queryParams = reactive({
  page: 1,
  size: 100,
  category: '',
  store: 'swTaobao',
  goodsName: '',
  goodsId: '',
  goodsCode: '',
  date: getDefaultDate(),
  fieldName: '',
  fieldOrder: '' //asc desc
})

const addList = ref([
  {
    label: '导出图片',
    code: 'exportImg'
  },
  {
    label: '导出Excel',
    code: 'exportExcel'
  }
])
// 当前新增按钮code码
const currentAddCode = ref('exportImg')

// 新增按钮点击
const addBtnClick = (value) => {
  if (value) {
    currentAddCode.value = value.code
    if (currentAddCode.value === 'exportImg') {
      exportImg()
    } else if (currentAddCode.value === 'exportExcel') {
      exportExcel()
    }
  }
}

const sortFieldName = ref('')
const sortFieldOrder = ref('') // asc desc

const sortClick = (field: string) => {
  if (queryParams.fieldName === field) {
    if (!queryParams.fieldOrder) {
      queryParams.fieldOrder = 'asc'
    } else {
      if (queryParams.fieldOrder === 'asc') {
        queryParams.fieldOrder = 'desc'
      } else if (queryParams.fieldOrder === 'desc') {
        queryParams.fieldOrder = ''
      }
    }
  } else {
    queryParams.fieldName = field
    queryParams.fieldOrder = 'asc'
  }
  sortFieldName.value = queryParams.fieldName
  sortFieldOrder.value = queryParams.fieldOrder
  getList(true)
}

const layoutMode = ref(1) // 0 列表模式  1 表格
const layoutModeChange = (mode: any) => {
  layoutMode.value = mode
}

const selectCategory = ref()
const categoryList = ref<any[]>([])
const getCategoryList = async () => {
  const data = await CommonApi.getCategoryNameList().catch(() => {})
  if (data) {
    categoryList.value = data || []
  }
  if (categoryList.value.length > 0) {
    selectCategory.value = categoryList.value[0].code || ''
    queryParams.category = categoryList.value[0].code || ''
    exportImgName.value = categoryList.value[0].name || ''

    getList()
  }
}

// 分类选择
const categorySelect = (value) => {
  selectCategory.value = value.code || ''
  queryParams.category = value.code || ''
  exportImgName.value = value.name || ''
  getList()
}

const queryFormRef = ref<any>()
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

const totalData = ref()

const loadingInstance = ref()
/** 查询列表 */
const getList = async (isLoading = true) => {
  loading.value = true
  if (isLoading) {
    loadingInstance.value = ElLoading.service({ fullscreen: true, text: '数据加载中' })
  }
  try {
    const data = await ChannelDataApi.paidPromotionQuery(queryParams).catch((err) => {
      if (isLoading) {
        loadingInstance.value.close()
      }
    })
    if (isLoading) {
      loadingInstance.value.close()
    }
    if (data) {
      if (
        data.paidPromotionDataList &&
        data.paidPromotionDataList.records &&
        data.paidPromotionDataList.records.length > 0
      ) {
        totalData.value = data || {}
        totalData.value.isTotal = true
      }
      if (data.paidPromotionDataList) {
        list.value = data.paidPromotionDataList.records || []
        total.value = data.paidPromotionDataList.total
      } else {
        list.value = []
        total.value = 0
      }
    } else {
      list.value = []
      total.value = 0
    }
    if (list.value.length > 0) {
      list.value = [totalData.value, ...list.value]
    }
    list.value.forEach((item) => {
      item.editProductGrade = item.productGrade || ''
      item.isEditProductGrade = false

      item.editExpectedResultsAchieved = item.expectedResultsAchieved || ''
      item.isEditExpectedResultsAchieved = false

      item.editPromotionPurpose = item.promotionPurpose || ''
      item.isEditPromotionPurpose = false
    })
    handleImgToBase64()
    loading.value = false
  } finally {
    loading.value = false
  }
}

const handleImgToBase64 = () => {
  list.value.forEach((item) => {
    if (item.image) {
      imageToBase64(item.image)
    }
  })
}

const getSWProgressLabelProgress = (value) => {
  if (value) {
    const progress = (Number(value.replace(/%/g, '') || '') / 100).toFixed(2)

    console.log('大姐夫索拉卡', value, Number(progress))
    return Number(progress)
  }
  console.log('111111')
  return 0
}

const productGradeHandleMouseOver = (value) => {
  if (!isClearingProductGrade.value) {
    value.editProductGrade = value.productGrade
  }
  value.isEditProductGrade = true
}

const isSavingProductGrade = ref(false)
const saveProductGrade = async (value) => {
  if (isSavingProductGrade.value) {
    return
  }
  if (value.editProductGrade !== value.productGrade) {
    isSavingProductGrade.value = true
    try {
      await ChannelDataApi.paidPromotionUpdate({
        goodsId: value.goodsId,
        date: queryParams.date,
        store: queryParams.store,
        productGrade: value.editProductGrade,
        expectedResultsAchieved: value.expectedResultsAchieved,
        promotionPurpose: value.promotionPurpose
      }).catch(() => {
        message.success('编辑失败')
        setTimeout(() => {
          isSavingProductGrade.value = false
          isSavingExpectedResultsAchieved.value = false
          isSavingPromotionPurpose.value = false
        }, 200)
      })
      value.productGrade = value.editProductGrade
      getList(true)
      setTimeout(() => {
        isSavingProductGrade.value = false
        isSavingExpectedResultsAchieved.value = false
        isSavingPromotionPurpose.value = false
      }, 200)
    } finally {
      value.isEditProductGrade = false
      isSavingProductGrade.value = false
      isSavingExpectedResultsAchieved.value = false
      isSavingPromotionPurpose.value = false
    }
  } else {
    value.editProductGrade = value.productGrade
    value.isEditProductGrade = false
    // if (!value.editProductGrade && value.id) {
    //   // 删除
    //   isSavingProductGrade.value = true
    //   await ChannelDataApi.paidPromotionDelete(value.id).catch(() => {
    //     message.success('删除失败')
    //     setTimeout(() => {
    //       isSavingProductGrade.value = false
    //     }, 200)
    //   })
    //   getList(true)
    //   setTimeout(() => {
    //     isSavingProductGrade.value = false
    //   }, 200)
    // }
  }
}

const isClearingProductGrade = ref(false)
const clearProductGrade = (row) => {
  isClearingProductGrade.value = true
  row.editProductGrade = ''
  setTimeout(() => {
    isClearingProductGrade.value = false
  }, 100)
}

const expectedResultsAchievedHandleMouseOver = (value) => {
  if (!isClearingExpectedResultsAchieved.value) {
    value.editExpectedResultsAchieved = value.expectedResultsAchieved
  }
  value.isEditExpectedResultsAchieved = true
}

const isSavingExpectedResultsAchieved = ref(false)
const saveExpectedResultsAchieved = async (value) => {
  if (isSavingExpectedResultsAchieved.value) {
    return
  }
  if (value.editExpectedResultsAchieved !== value.expectedResultsAchieved) {
    isSavingProductGrade.value = true
    try {
      await ChannelDataApi.paidPromotionUpdate({
        goodsId: value.goodsId,
        date: queryParams.date,
        store: queryParams.store,
        productGrade: value.productGrade,
        expectedResultsAchieved: value.editExpectedResultsAchieved,
        promotionPurpose: value.promotionPurpose
      }).catch(() => {
        message.success('编辑失败')
        setTimeout(() => {
          isSavingProductGrade.value = false
          isSavingExpectedResultsAchieved.value = false
          isSavingPromotionPurpose.value = false
        }, 200)
      })
      value.expectedResultsAchieved = value.editExpectedResultsAchieved
      getList(true)
      setTimeout(() => {
        isSavingProductGrade.value = false
        isSavingExpectedResultsAchieved.value = false
        isSavingPromotionPurpose.value = false
      }, 200)
    } finally {
      value.isEditExpectedResultsAchieved = false
      isSavingProductGrade.value = false
      isSavingExpectedResultsAchieved.value = false
      isSavingPromotionPurpose.value = false
    }
  } else {
    value.editExpectedResultsAchieved = value.expectedResultsAchieved
    value.isEditExpectedResultsAchieved = false

    // if (!value.editExpectedResultsAchieved && value.id) {
    //   // 删除
    //   isSavingExpectedResultsAchieved.value = true
    //   await ChannelDataApi.paidPromotionDelete(value.id).catch(() => {
    //     message.success('删除失败')
    //     setTimeout(() => {
    //       isSavingExpectedResultsAchieved.value = false
    //     }, 200)
    //   })
    //   getList(true)
    //   setTimeout(() => {
    //     isSavingExpectedResultsAchieved.value = false
    //   }, 200)
    // }
  }
}

const isClearingExpectedResultsAchieved = ref(false)
const clearExpectedResultsAchieved = (row) => {
  isClearingExpectedResultsAchieved.value = true
  row.editExpectedResultsAchieved = ''
  setTimeout(() => {
    isClearingExpectedResultsAchieved.value = false
  }, 100)
}

const promotionPurposeHandleMouseOver = (value) => {
  if (!isClearingPromotionPurpose.value) {
    value.editPromotionPurpose = value.promotionPurpose
  }
  value.isEditPromotionPurpose = true
}

const isSavingPromotionPurpose = ref(false)
const savePromotionPurpose = async (value) => {
  if (isSavingPromotionPurpose.value) {
    return
  }
  if (value.editPromotionPurpose !== value.promotionPurpose) {
    isSavingPromotionPurpose.value = true
    try {
      await ChannelDataApi.paidPromotionUpdate({
        goodsId: value.goodsId,
        date: queryParams.date,
        store: queryParams.store,
        productGrade: value.productGrade,
        expectedResultsAchieved: value.expectedResultsAchieved,
        promotionPurpose: value.editPromotionPurpose
      }).catch(() => {
        message.success('编辑失败')
        setTimeout(() => {
          isSavingProductGrade.value = false
          isSavingExpectedResultsAchieved.value = false
          isSavingPromotionPurpose.value = false
        }, 200)
      })
      value.promotionPurpose = value.editPromotionPurpose
      getList(true)
      setTimeout(() => {
        isSavingProductGrade.value = false
        isSavingExpectedResultsAchieved.value = false
        isSavingPromotionPurpose.value = false
      }, 200)
    } finally {
      value.isEditPromotionPurpose = false
      isSavingProductGrade.value = false
      isSavingExpectedResultsAchieved.value = false
      isSavingPromotionPurpose.value = false
    }
  } else {
    value.editPromotionPurpose = value.promotionPurpose
    value.isEditPromotionPurpose = false
    // if (!value.editPromotionPurpose && value.id) {
    //   // 删除
    //   isSavingPromotionPurpose.value = true
    //   await ChannelDataApi.paidPromotionDelete(value.id).catch(() => {
    //     message.success('删除失败')
    //     setTimeout(() => {
    //       isSavingPromotionPurpose.value = false
    //     }, 200)
    //   })
    //   getList(true)
    //   setTimeout(() => {
    //     isSavingPromotionPurpose.value = false
    //   }, 200)
    // }
  }
}

const isClearingPromotionPurpose = ref(false)
const clearPromotionPurpose = (row) => {
  isClearingPromotionPurpose.value = true
  row.editPromotionPurpose = ''
  setTimeout(() => {
    isClearingPromotionPurpose.value = false
  }, 100)
}

const headerConfig = ref([
  {
    title: '图片',
    field: 'image',
    width: 71,
    left: 20
  },
  {
    title: '编码',
    field: 'goodsCode',
    width: 62
  },
  {
    title: 'ID',
    field: 'goodsId',
    width: 131
  },
  {
    title: '利润额(昨日)',
    field: 'netProfit',
    width: 114
  },
  {
    title: '净利润率(昨日)',
    field: 'netProfitRate',
    width: 124
  },
  {
    title: '花费(昨日)',
    field: 'spendByYesterday',
    width: 95 + 20,
    color: '#0064FF',
    sort: true
  },
  {
    title: '花费(7天)',
    field: 'spendBySeven',
    width: 88 + 20,
    color: '#0064FF',
    sort: true
  },
  {
    title: '花费(30天)',
    field: 'spendByThirty',
    width: 109 + 20,
    color: '#0064FF',
    sort: true
  },
  {
    title: '花费(本月)',
    field: 'spendByMonth',
    width: 96 + 20,
    color: '#0064FF',
    sort: true
  },
  {
    title: '手淘搜索访客 (近7天)',
    field: 'visitor',
    width: 84,
    right: 31
    // textAlign: 'center'
  },
  {
    title: '点击量(近7天)',
    field: 'hits',
    width: 116
    // right: 31,
    // textAlign: 'center'
  },
  {
    title: 'PPC(近7天)',
    field: 'ppcbySeven',
    width: 45,
    right: 31,
    textAlign: 'center'
  },
  {
    title: '付费销售金额(近7天)',
    field: 'paidDecimalAmountBySeven',
    width: 144
    // right: 31,
    // textAlign: 'center'
  },
  {
    title: '总销售额(昨日)',
    field: 'totalSalesByYesterday',
    width: 144
    // right: 31
    // textAlign: 'center'
  },
  {
    title: '总销售额(近7天)',
    field: 'totalSalesBySeven',
    width: 144
    // right: 31,
    // textAlign: 'center'
  },
  {
    title: '总销售额(近30天)',
    field: 'totalSalesByThirty',
    width: 144
    // right: 31,
    // textAlign: 'center'
  },
  {
    title: '总销售额(本月)',
    field: 'totalSalesByMonth',
    width: 144
    // right: 31,
    // textAlign: 'center'
  },
  {
    title: '退款(昨日)',
    field: 'refundByYesterday',
    width: 116
  },
  {
    title: '退款(近7天)',
    field: 'refundBySeven',
    width: 108
  },
  {
    title: '退款(近30天)',
    field: 'refundByThirty',
    width: 117
  },
  {
    title: '退款(本月)',
    field: 'refundByMonth',
    width: 100
  },
  {
    title: '退款率(近7天)',
    field: 'refundRateBySeven',
    width: 52,
    right: 24,
    color: '#0064FF',
    textAlign: 'center'
  },
  {
    title: '点击率(近7天)',
    field: 'hitsRate',
    width: 52,
    right: 24,
    color: '#0064FF',
    textAlign: 'center'
  },
  {
    title: '昨日去退费比',
    field: 'refundRateByYesterday',
    width: 114 + 20,
    color: '#0064FF',
    sort: true,
    showPercent: true
  },
  {
    title: '近7天付费占比(花费/总销售额)',
    field: 'proportionOfPaidBySeven',
    width: 104 + 20,
    right: 30,
    color: '#0064FF',
    sort: true,
    showPercent: true
  },
  {
    title: '近30天付费占比(花费/总销售额)',
    field: 'proportionOfPaidByThirty',
    width: 104 + 20,
    right: 30,
    color: '#0064FF',
    sort: true,
    showPercent: true
  },
  {
    title: '本月付费占比(花费/总销售额)',
    field: 'proportionOfPaidByMonth',
    width: 101 + 20,
    right: 30,
    color: '#0064FF',
    sort: true,
    showPercent: true
  },
  {
    title: '转化率(近7天)',
    field: 'conversionRateBySeven',
    width: 52,
    right: 24,
    color: '#0064FF',
    textAlign: 'center'
  },
  {
    title: '加购率(近7天)',
    field: 'purchaseRateBySeven',
    width: 45,
    right: 30,
    textAlign: 'center'
  },
  {
    title: 'ROI(近7天)',
    field: 'roibySeven',
    width: 45,
    right: 30,
    textAlign: 'center'
  },
  {
    title: '产品等级',
    field: 'productGrade',
    width: 96
  },
  {
    title: '预估达成结果',
    field: 'expectedResultsAchieved',
    width: 114
  },
  {
    title: '推广目的',
    field: 'promotionPurpose',
    width: 104
  }
])

const commonTopFilterWrapRef = ref()
const showExapndAll = ref(true)
const resizeHandler = () => {
  if (commonTopFilterWrapRef.value) {
    const topFilterWrap = commonTopFilterWrapRef.value?.clientWidth
    if (topFilterWrap >= 1739) {
      isExpand.value = true
      showExapndAll.value = false
    } else {
      showExapndAll.value = true
    }
  }
}
/** 初始化 **/
onMounted(() => {
  getCategoryList()
  window.addEventListener('resize', resizeHandler)
  resizeHandler()
})

const exportImgName = ref('')
const imgExportRef = ref()
const imgExportHeight = ref(0)
const exportImgMainRef = ref()

// 导出图片
const exportImg = async () => {
  imgExporting.value = true
  imgExportHeight.value = exportImgMainRef.value.clientHeight
  nextTick(async () => {
    try {
      const canvas = await html2canvas(imgExportRef.value)
      const img = canvas.toDataURL('image/png')
      // 创建一个a标签模拟点击进行下载
      const downloadLink = document.createElement('a')
      downloadLink.id = 'imgDownload'
      downloadLink.style.display = 'none'
      downloadLink.href = img
      downloadLink.download = exportImgName.value || '付费推广数据追踪'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      imgExporting.value = false
    } catch (error) {
      imgExporting.value = false
      message.warning('导出图片失败')
    }
  })
}

const imgBase64Dict = ref({})
// 获取图片的base64
const imageToBase64 = async (url: string) => {
  if (imgBase64Dict[`${url}`]) {
    return
  }
  imgToBase64(url)
    .then((base64) => {
      imgBase64Dict.value[`${url}`] = base64
    })
    .catch((error) => {
      console.error(error) // 处理错误
    })
}

// 导出Excel
const exportExcel = async () => {
  imgExporting.value = true
  const data = await ChannelDataApi.paidPromotionExportExcel(queryParams).catch((err) => {
    imgExporting.value = false
  })
  imgExporting.value = false
  if (data) {
    download.excel(data, `${queryParams.date}日付费推广数据追踪.xls`)
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-card__body) {
  padding-bottom: 5px;
}

.mainContainer {
  background: #fff;
  .content {
    padding: 14px 12px;
    .paidPromotionTable {
      width: calc(100%);
      background: linear-gradient(
        0,
        rgba(250, 252, 255, 0.19) 0%,
        rgba(242, 247, 255, 0.78) 63%,
        #ebf2ff 100%
      );
      border-radius: 4px;
      height: auto;
      &-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 76px;
        margin-left: 20px;
        margin-right: 20px;
        width: calc(3596px + 160px + 16 * 33px);
        &-item {
          font-weight: 400;
          font-size: 14px;
          color: #666666;
          line-height: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 76px;
          padding-left: 8px;
          padding-right: 8px;
        }
        &-itemTable {
          margin-top: 1px;
          border-left: 1px solid #ebeef5;
          border-top: 1px solid #ebeef5;
        }
      }

      &-column {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 60px;
        margin-left: 20px;
        margin-right: 20px;
        margin-bottom: 16px;
        width: calc(3596px + 20px + 160px + 16 * 33px);
        background: #ffffff;
        box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
        border-radius: 4px;
        &-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-weight: 500;
          font-size: 14px;
          color: #333333;
          height: 60px;
          line-height: 14px;
          padding-left: 8px;
          padding-right: 8px;
        }
        &-itemTable {
          border-left: 1px solid #ebeef5;
          border-top: 1px solid #ebeef5;
        }
        &-itemTableBottom {
          border-bottom: 1px solid #ebeef5;
        }
        &-itemTotal {
          font-weight: 600;
          font-size: 16px;
        }
      }
      &-columnTable {
        background: #ffffff;
        box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
        border-radius: 0px;
        margin-bottom: 0px;
      }
      &-empty {
        margin-top: 40px;
        margin-bottom: 40px;
        width: calc(100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: calc(3596px + 40px + 160px + 16 * 33px);
        font-size: 14px;
      }
    }
  }
  .editValue {
    width: 90px;
    :deep(.el-input__wrapper) {
      padding-left: 8px;
      padding-right: 8px;
      font-size: 14px;
    }
    :deep(.el-input__inner) {
      font-size: 14px;
    }
  }
  .editValue1 {
    // margin-left: -20px;
    width: 90px;
    :deep(.el-input__wrapper) {
      padding-left: 8px;
      padding-right: 8px;
      font-size: 14px;
    }
    :deep(.el-input__inner) {
      font-size: 14px;
    }
  }
}

.paidPromotioContentScroll {
  width: calc(3596px + 40px + 160px + 16 * 33px);
  height: calc(100vh - 400px);
}

.paidPromotioContentScrollExport {
  width: calc(3596px + 40px + 160px + 16 * 33px);
}
.headerSort {
  cursor: pointer;
  margin-left: 3px;
  display: flex;
  flex-direction: column;
  &-asc {
    margin-bottom: -3px;
  }
  &-desc {
    margin-top: -3px;
  }
}

.exportableBg {
  position: absolute;
  bottom: 99999px;
}
.exportableBg1 {
  margin-top: 30px;
}
</style>
