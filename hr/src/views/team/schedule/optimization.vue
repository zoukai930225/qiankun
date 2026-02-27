<!--
 * @Date: 2024-06-06 10:13:37
 优化页面
-->
<template>
  <div class="wapper">
    <img
      v-if="list?.length"
      src="@/assets/imgs/team/left.png"
      class="move-icon move-icon-left"
      @click="handleMode('left')"
    />
    <img
      v-if="list?.length"
      src="@/assets/imgs/team/left-activity.png"
      @click="handleMode('left')"
      class="move-icon move-icon-left"
    />

    <img
      v-if="list?.length"
      src="@/assets/imgs/team/right.png"
      class="move-icon move-icon-right"
      @click="handleMode('right')"
    />
    <img
      v-if="list?.length"
      src="@/assets/imgs/team/right-activity.png"
      class="move-icon move-icon-right"
      @click="handleMode('right')"
    />
    <ContentWrap>
      <SearchForm
        ref="searchForm"
        :currentTab="currentTab"
        @handle-query="handleSearch"
        @add-info="addInfoCb"
        @batch-operations="handleBatchOperations"
        @clean-all-select="handleCleanAllSelect"
        @batch-audit="handleBatchAudit"
    /></ContentWrap>

    <div class="tabs-wapper flex-row">
      <div
        class="tab-item"
        v-for="item in tabsList"
        :key="item.code"
        :class="{ activityItem: currentTab == item.code }"
        @click="tabsChange(item.code)"
        ><img :src="item.acitvityIcon" class="tab-icon" v-if="currentTab == item.code" />
        <img :src="item.icon" class="tab-icon" v-else />
        <span class="tab-title" :class="{ activity: currentTab == item.code }">{{
          item.name
        }}</span></div
      >
    </div>

    <div class="table-content">
      <div class="table-wapper" v-loading="loading">
        <div class="desc-wapper">
          <div class="next-line">
            <div class="flex-row">
              <span
                v-for="(item, index) in showInfo"
                :key="index"
                :class="'desc-item ' + item.class"
                >{{ item.text }}</span
              >
            </div>
            <div class="flex-row">
              <CusTimeSelect @send-date-select="handleTimeChange" ref="selectTime" />
              <!-- 清除时间 -->
              <div class="clean-time-wapper" @click="cleanTime">
                <img src="@/assets/imgs/team/clean.png" alt="" class="clean-time-icon" />
                <span class="clean-time-desc">清除</span>
              </div>
            </div>
          </div>
        </div>
        <div class="tableList">
          <div ref="otherRef" v-if="isOtherTab" style="overflow-x: scroll">
            <div v-if="list?.length">
              <div class="table">
                <div class="table-header toptable">
                  <div class="w60" v-hasPermi="['team:optimization:batchEditing']"
                    ><div
                      class="checkout-item"
                      :class="{ activityCheckoutItem: currentAll }"
                      style="margin-left: 10px; box-sizing: border-box"
                      @click="selectAll"
                    >
                      <img src="@/assets/imgs/team/cheched.png" class="check-img" /> </div
                  ></div>
                  <span class="w120">平台</span> <span class="w80 center">品类</span>
                  <span class="w120 center">需求类型</span>
                  <span class="w120 center">运营</span>
                  <span class="w100 center">产品编码</span
                  ><span class="w120 center" style="margin-right: 15px">产品图</span>
                  <span class="w300">方案</span>
                  <span class="w300">拍摄</span>
                  <span class="w300">后期</span>
                  <span class="w300">页面</span>
                  <div class="w80 flex-row center" style="align-items: flex-start"
                    ><span style="width: 30px">排序</span>
                    <div class="flex-column" style="margin-top: -5px"
                      ><el-icon
                        class="icon-Item"
                        :class="{ activity: currentIcon == 0 }"
                        @click="handleSorting(0)"
                        ><CaretTop
                      /></el-icon>
                      <el-icon
                        class="icon-Item"
                        :class="{ activity: currentIcon == 1 }"
                        @click="handleSorting(1)"
                        ><CaretBottom /></el-icon></div></div
                  ><div class="w120 center">上架周期</div> <div class="w200 center">备注</div>
                  <span class="w100 center">交付时间</span>
                  <span class="center w200">操作</span></div
                >
                <div
                  class="table-header table-item toptable"
                  :class="{ sotopStl: item?.state == 5 }"
                  v-for="item in list"
                  :key="item.id"
                >
                  <!-- 占位 -->
                  <div class="w60" v-hasPermi="['team:optimization:batchEditing']"></div>
                  <!-- 浮动 -->
                  <div
                    class="w60 checkout-item-wapper"
                    @click="selectSingle(item)"
                    v-hasPermi="['team:optimization:batchEditing']"
                    ><div
                      class="checkout-item"
                      :class="{
                        activityCheckoutItem: formatSelect(item),
                        disabled: formatDisable(item)
                      }"
                    >
                      <img
                        src="@/assets/imgs/team/cheched.png"
                        class="check-img"
                        v-if="formatSelect(item)" /></div
                  ></div>

                  <!-- 平台 -->
                  <span class="table-value w120"> {{ getStoreByValue(item?.store) }}</span>
                  <!-- 品类 -->
                  <span class="w80 table-value center">
                    {{ getCategoryByValue(item?.category) }}</span
                  >
                  <!-- 需求类型 -->
                  <span class="table-value w120 center"
                    >{{ `${formarTwoType(item?.demandType, item?.secondDemandType)}` }}
                  </span>
                  <!-- 运营 -->
                  <span class="table-value w120 center"
                    >{{ item?.proposerName || item?.createdRealname }}
                  </span>

                  <!-- 产品编号 -->
                  <span class="table-value w100 center">{{ item?.goodsCode || '' }}</span>
                  <!-- 产品图 -->
                  <span class="w120 center" style="margin-right: 15px">
                    <el-image
                      style="width: 60px; height: 40px; margin-top: -10px"
                      :src="formatOne(item.goodsImage)"
                      fit="cover"
                      class="img-item"
                      :preview-src-list="formatImg(item.goodsImage)"
                    >
                      <template #toolbar="{ actions, prev, next, reset }">
                        <el-icon @click="prev"><Back /></el-icon>
                        <el-icon @click="next"><Right /></el-icon>
                        <el-icon @click="actions('zoomOut')"><ZoomOut /></el-icon>
                        <el-icon
                          @click="actions('zoomIn', { enableTransition: false, zoomRate: 2 })"
                        >
                          <ZoomIn />
                        </el-icon>
                        <el-icon
                          @click="actions('clockwise', { rotateDeg: 180, enableTransition: false })"
                        >
                          <RefreshRight />
                        </el-icon>
                        <el-icon @click="actions('anticlockwise')"><RefreshLeft /></el-icon>
                        <el-icon @click="reset"><Refresh /></el-icon>
                        <el-icon @click="downloadByUrl(formatOne(item.goodsImage))"
                          ><Download
                        /></el-icon>
                      </template>
                    </el-image>
                  </span>

                  <!-- 方案 -->
                  <span class="w300">
                    <div class="three-wapper">
                      <!-- 视觉3  平面4-->
                      <div
                        class="avator-wapper three-item-bg"
                        v-for="tem in twoSubNodeList"
                        :key="tem.name"
                      >
                        <el-popover
                          placement="right"
                          :width="350"
                          popper-style=" padding:0;border-radius: 8px 8px 0 0;"
                        >
                          <template #reference>
                            <div class="flex-row">
                              <div class="flex-row">
                                <div class="three-item-desc">{{ tem.name }}</div>
                                <div
                                  class="flex-row img-wapper"
                                  v-if="formatSubClass(item, 1, tem.subNode) != 'three'"
                                >
                                  <img
                                    v-for="(it, idx) in formatAvtor(item, 1, tem.subNode)"
                                    :src="it?.avatarOrigin || ''"
                                    :key="idx"
                                    class="avator logo-avator"
                                  />
                                </div>
                              </div>
                              <img
                                src="@/assets/imgs/team/task-finish.png"
                                v-if="formatSubClass(item, 1, tem.subNode) == 'three'"
                                class="task-finish"
                              />
                            </div>
                          </template>
                          <template #default>
                            <PopoverItem
                              :detail="formatDetail(item, 1)"
                              :wapperDetail="item"
                              :node="1"
                              :subType="tem.subNode"
                              @go-detail="goDetail"
                            />
                          </template>
                        </el-popover>

                        <img
                          v-if="formatSubClass(item, 1, tem.subNode) != 'three'"
                          src="@/assets/imgs/team/add.png"
                          :style="{ marginLeft: calculateMargin(item, 1, tem.subNode) }"
                          class="avator add"
                          @click="openDialog(item, 1, tem.subNode)"
                        />
                        <span
                          class="avator-icon"
                          :class="formatSubClass(item, 1, tem.subNode)"
                        ></span>
                      </div>
                    </div>
                  </span>
                  <!-- 拍摄 -->
                  <span class="w300">
                    <div class="three-wapper">
                      <!-- 视频2 静物1 人像0-->
                      <div
                        class="avator-wapper three-item-bg"
                        v-for="tem in subNodeList"
                        :key="tem.name"
                      >
                        <el-popover
                          placement="right"
                          :width="350"
                          popper-style=" padding:0; border-radius: 8px 8px 0 0;"
                        >
                          <template #reference>
                            <div class="flex-row">
                              <div class="flex-row">
                                <div class="three-item-desc">{{ tem.name }}</div>
                                <div
                                  class="flex-row img-wapper"
                                  v-if="formatSubClass(item, 2, tem.subNode) != 'three'"
                                >
                                  <img
                                    v-for="(it, idx) in formatAvtor(item, 2, tem.subNode)"
                                    :src="it?.avatarOrigin || ''"
                                    :key="idx"
                                    class="avator logo-avator"
                                  />
                                </div>
                              </div>

                              <img
                                src="@/assets/imgs/team/task-finish.png"
                                v-if="formatSubClass(item, 2, tem.subNode) == 'three'"
                                class="task-finish"
                              />
                            </div>
                            <!-- 任务完成 -->
                          </template>
                          <template #default>
                            <PopoverItem
                              :detail="formatDetail(item, 2)"
                              :wapperDetail="item"
                              :node="2"
                              :subType="tem.subNode"
                              @go-detail="goDetail"
                            />
                          </template>
                        </el-popover>

                        <img
                          v-if="formatSubClass(item, 2, tem.subNode) != 'three'"
                          src="@/assets/imgs/team/add.png"
                          :style="{ marginLeft: calculateMargin(item, 2, tem.subNode) }"
                          class="avator add"
                          @click="openDialog(item, 2, tem.subNode)" />
                        <span
                          class="avator-icon"
                          :class="formatSubClass(item, 2, tem.subNode)"
                        ></span
                      ></div>
                    </div>
                  </span>

                  <!-- 后期 -->
                  <span class="w300">
                    <div class="three-wapper">
                      <!-- 视频2 静物1 人像0-->
                      <div
                        class="avator-wapper three-item-bg"
                        v-for="tem in subNodeList"
                        :key="tem.name"
                      >
                        <el-popover
                          placement="right"
                          :width="350"
                          popper-style=" padding:0;border-radius: 8px 8px 0 0;"
                        >
                          <template #reference>
                            <div class="flex-row">
                              <div class="flex-row">
                                <div class="three-item-desc">{{ tem.name }}</div>
                                <div
                                  class="flex-row"
                                  v-if="formatSubClass(item, 3, tem.subNode) != 'three'"
                                >
                                  <img
                                    v-for="(it, idx) in formatAvtor(item, 3, tem.subNode)"
                                    :src="it?.avatarOrigin || ''"
                                    :key="idx"
                                    class="avator logo-avator"
                                  />
                                </div>
                              </div>
                              <img
                                src="@/assets/imgs/team/task-finish.png"
                                v-if="formatSubClass(item, 3, tem.subNode) == 'three'"
                                class="task-finish"
                              />
                            </div>
                          </template>
                          <template #default>
                            <PopoverItem
                              :detail="formatDetail(item, 3)"
                              :wapperDetail="item"
                              :node="3"
                              :subType="tem.subNode"
                              @go-detail="goDetail"
                            />
                          </template>
                        </el-popover>
                        <img
                          v-if="formatSubClass(item, 3, tem.subNode) != 'three'"
                          src="@/assets/imgs/team/add.png"
                          :style="{ marginLeft: calculateMargin(item, 3, tem.subNode) }"
                          class="avator add"
                          @click="openDialog(item, 3, tem.subNode)" />
                        <span
                          class="avator-icon"
                          :class="formatSubClass(item, 3, tem.subNode)"
                        ></span
                      ></div>
                    </div>
                  </span>
                  <!-- 页面 -->
                  <span class="w300">
                    <div class="three-wapper">
                      <!-- 视觉3  平面4-->
                      <div
                        class="avator-wapper three-item-bg"
                        v-for="tem in twoSubNodeList"
                        :key="tem.name"
                      >
                        <el-popover
                          placement="right"
                          :width="350"
                          popper-style=" padding:0;border-radius: 8px 8px 0 0;"
                        >
                          <template #reference>
                            <div class="flex-row">
                              <div class="flex-row">
                                <div class="three-item-desc">{{ tem.name }}</div>
                                <div
                                  class="flex-row img-wapper"
                                  v-if="formatSubClass(item, 4, tem.subNode) != 'three'"
                                >
                                  <img
                                    v-for="(it, idx) in formatAvtor(item, 4, tem.subNode)"
                                    :src="it?.avatarOrigin || ''"
                                    :key="idx"
                                    class="avator logo-avator"
                                /></div>
                              </div>
                              <img
                                src="@/assets/imgs/team/task-finish.png"
                                v-if="formatSubClass(item, 4, tem.subNode) == 'three'"
                                class="task-finish"
                              />
                            </div>
                          </template>
                          <template #default>
                            <PopoverItem
                              :detail="formatDetail(item, 4)"
                              :wapperDetail="item"
                              :node="4"
                              :subType="tem.subNode"
                              @go-detail="goDetail"
                            />
                          </template>
                        </el-popover>
                        <img
                          v-if="formatSubClass(item, 4, tem.subNode) != 'three'"
                          src="@/assets/imgs/team/add.png"
                          :style="{ marginLeft: calculateMargin(item, 4, tem.subNode) }"
                          class="avator add"
                          @click="openDialog(item, 4, tem.subNode)" />
                        <span
                          class="avator-icon"
                          :class="formatSubClass(item, 4, tem.subNode)"
                        ></span
                      ></div> </div
                  ></span>
                  <!-- 排序 -->
                  <div class="w80 table-value center">{{ item?.priority }}</div>
                  <!-- 上架周期 -->
                  <div class="w120 table-value center">{{ formatCycle(item?.cycle) }}</div>
                  <!-- 备注 -->
                  <div class="w200 onelione center">
                    <el-tooltip class="box-item" effect="dark" placement="top" v-if="item.tag">
                      <template #content>
                        <span
                          v-html="item.tag"
                          style="
                            display: block;
                            max-width: 400px;
                            word-break: break-all !important;
                            line-break: anywhere !important;
                            height: auto !important;
                            white-space: normal;
                          "
                        ></span>
                      </template>
                      <span v-html="item.tag" class="tag-desc"></span>
                    </el-tooltip>
                  </div>
                  <!-- 交付时间 -->
                  <span class="w100 table-value center">{{ item?.deliveryTime || '' }}</span>
                  <div class="w200 center operateWapper">
                    <span class="operateLink" @click="handleAdd(8, item)">查看</span>
                    <div
                      class="operateLink"
                      @click="handleCopy(item)"
                      v-hasPermi="['team:optimization:copy']"
                      >复制</div
                    >
                    <div class="operateLink" @click="openBiaoZhu(item)">标注</div>
                    <!-- -->
                    <div v-hasPermi="['team:optimization:visualApproval']">
                      <div v-if="item.state == 0" class="operateLink" @click="shenhe(item)"
                        >运营审核</div
                      >
                    </div>
                    <div
                      class="operateLink"
                      v-hasPermi="['team:optimization:edit']"
                      @click="handleEdit(item)"
                      >编辑</div
                    >
                  </div>
                  <img :src="showBgImg(item)" class="top-bg" v-if="showBgImg(item)" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 临时需求 -->
        <div v-if="currentTab == 'temporary'" style="overflow-x: scroll">
          <div>
            <div class="table">
              <div class="table-header">
                <div class="w60" v-hasPermi="['team:optimization:batchEditing']"
                  ><div
                    class="checkout-item"
                    :class="{ activityCheckoutItem: currentAll }"
                    style="margin-left: 10px; box-sizing: border-box"
                    @click="selectAll"
                  >
                    <img src="@/assets/imgs/team/cheched.png" class="check-img" /> </div
                ></div>
                <div class="w100">平台</div>
                <div class="w80 center">品类</div>
                <div class="w120 center">需求类型</div>
                <div class="w120 center">运营</div>
                <div class="w150 center">产品编码</div>
                <div class="w120 center">产品图</div>
                <div class="w180 item15">临时需求</div>
                <div class="w200 center">备注</div>
                <div class="w100 center">交付时间</div>
                <div class="center w200">操作</div></div
              >

              <div class="table-header table-item" v-for="ite in list" :key="ite.id">
                <!-- 占位 -->
                <div class="w60" v-hasPermi="['team:optimization:batchEditing']"></div>
                <!-- 浮动 -->
                <div
                  class="w60 checkout-item-wapper"
                  @click="selectSingle(ite)"
                  v-hasPermi="['team:optimization:batchEditing']"
                  ><div
                    class="checkout-item"
                    :class="{
                      activityCheckoutItem: formatSelect(ite),
                      disabled: formatDisable(ite)
                    }"
                  >
                    <img
                      src="@/assets/imgs/team/cheched.png"
                      class="check-img"
                      v-if="formatSelect(ite)" /></div
                ></div>

                <!-- 平台 -->
                <div class="w100 table-value">{{ getStoreByValue(ite?.store) }}</div>
                <!-- 品类 -->
                <div class="w80 center table-value">{{ getCategoryByValue(ite?.category) }}</div>
                <!-- 需求类型 -->
                <div class="w120 center table-value">{{
                  `${formarTwoType(ite?.demandType, ite?.secondDemandType)}`
                }}</div>
                <!-- 运营 -->
                <div class="w120 center table-value">{{ ite?.createdRealname }}</div>
                <!-- 产品编码 -->
                <div class="w150 center table-value">{{ ite?.goodsCode || '' }}</div>
                <!-- 产品图 -->
                <div class="w120 center table-value">
                  <el-image
                    style="width: 60px; height: 40px; margin-top: -10px"
                    :src="formatOne(ite.goodsImage)"
                    fit="cover"
                    class="img-item"
                    :preview-src-list="formatImg(ite.goodsImage)"
                  >
                    <template #toolbar="{ actions, prev, next, reset }">
                      <el-icon @click="prev"><Back /></el-icon>
                      <el-icon @click="next"><Right /></el-icon>
                      <el-icon @click="actions('zoomOut')"><ZoomOut /></el-icon>
                      <el-icon @click="actions('zoomIn', { enableTransition: false, zoomRate: 2 })">
                        <ZoomIn />
                      </el-icon>
                      <el-icon
                        @click="actions('clockwise', { rotateDeg: 180, enableTransition: false })"
                      >
                        <RefreshRight />
                      </el-icon>
                      <el-icon @click="actions('anticlockwise')"><RefreshLeft /></el-icon>
                      <el-icon @click="reset"><Refresh /></el-icon>
                      <el-icon @click="downloadByUrl(formatOne(ite.goodsImage))"
                        ><Download
                      /></el-icon>
                    </template>
                  </el-image>
                </div>
                <!-- 临时需求 -->
                <div class="w180"
                  ><div class="avator-wapper">
                    <el-popover
                      placement="right"
                      :width="350"
                      popper-style=" padding:0;border-radius: 8px 8px 0 0;"
                    >
                      <template #reference>
                        <div>
                          <div
                            class="flex-row"
                            v-if="formatClass(ite, 'temporaryState') != 'three'"
                          >
                            <img
                              v-for="(it, index) in formatAvtor(ite, 5)"
                              :src="it?.avatarOrigin || ''"
                              :key="index"
                              class="avator logo-avator"
                            />
                          </div>
                          <img
                            src="@/assets/imgs/team/task-finish.png"
                            v-if="formatClass(ite, 'temporaryState') == 'three'"
                            class="task-finish"
                          />
                        </div>
                      </template>
                      <template #default>
                        <PopoverItem
                          :detail="formatDetail(ite, 5)"
                          :wapperDetail="ite"
                          :node="5"
                          @go-detail="goDetail"
                        />
                      </template>
                    </el-popover>
                    <img
                      v-if="formatClass(ite, 'temporaryState') != 'three'"
                      src="@/assets/imgs/team/add.png"
                      :style="{ marginLeft: calculateMargin(ite, 5) }"
                      class="avator add"
                      @click="openDialog(ite, 5)" />
                    <span
                      class="avator-icon"
                      :class="formatClass(ite, 'temporaryState')"
                    ></span></div
                ></div>
                <!-- 备注 -->
                <div class="w180 center onelione">
                  <el-tooltip class="box-item" effect="dark" placement="top">
                    <template #content>
                      <div
                        v-html="ite.tag"
                        class="tooltilp"
                        style="
                          display: block;
                          max-width: 400px;
                          word-break: break-all !important;
                          line-break: anywhere !important;
                          height: auto !important;
                          white-space: normal;
                        "
                      ></div>
                    </template>
                    <span v-html="ite.tag" class="tag-desc"></span>
                  </el-tooltip>
                </div>
                <!-- 交付时间 -->
                <div class="w100 center table-value">{{ ite?.deliveryTime || '' }}</div>
                <div class="center w200 operateWapper">
                  <div class="operateLink" @click="handleAdd(8, ite)">查看</div>
                  <div
                    class="operateLink"
                    @click="handleCopy(ite)"
                    v-hasPermi="['team:optimization:copy']"
                    >复制</div
                  >
                  <div class="operateLink" @click="openBiaoZhu(ite, 2)">标注</div>
                  <!--  -->
                  <div v-hasPermi="['team:optimization:visualApproval']">
                    <div v-if="ite.state == 0" class="operateLink" @click="shenhe(ite)"
                      >运营审核</div
                    >
                  </div>
                  <div
                    class="operateLink"
                    @click="handleEdit(ite)"
                    v-hasPermi="['team:optimization:edit']"
                    >编辑</div
                  >
                </div>
                <img :src="showBgImg(ite)" class="top-bg" v-if="showBgImg(ite)" />
              </div>
            </div>
          </div>
        </div>
        <EmptyTable :visibility="list?.length == 0" />
      </div>

      <!-- 分页 -->
      <div style="height: 50px">
        <Pagination
          v-if="list?.length"
          :total="total"
          v-model:page="queryParams.page"
          v-model:limit="queryParams.size"
          @pagination="getList"
        />
      </div>
    </div>

    <!-- 新增 -->
    <DialogAddInfo
      ref="addInfo"
      :reload="handleReload"
      :status="status"
      :isEdit="isEdit"
      @cancle="isEdit = false"
      @close="status = -1"
    />
    <!-- 指派 -->
    <Assignment
      ref="assignmentRef"
      :node="AssignmentNode"
      :subNode="AssignmentSubNode"
      :currentDetail="currentDetail"
      @success="handleSuccess"
    />
    <!-- 标注 -->
    <Biaozhu ref="biaozhuRef" @success="handleSuccess" />
    <!-- 批量操作 -->
    <BatchOperations ref="batchOperationsRef" @success="handleSuccess" />
    <!-- 批量审核 -->
    <BatchAudit ref="batchAudit" @success="handleSuccess" />

    <!-- 自定义图片预览弹窗 -->
    <el-image
      ref="imagePreview"
      style="width: 0; height: 0"
      :src="previewSrc"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      :preview-src-list="imgList"
      show-progress
      :initial-index="initialIndex"
      fit="cover"
      :hide-on-click-modal="true"
    />
  </div>
</template>
<script lang="ts" setup>
import { getVisualApproval, storeManagerAudit } from '@/api/team/index'
import { hasPermiJs } from '@/utils/index'
import {
  downloadByUrl,
  formarTwoType,
  formatCycle,
  showBgImg,
  showInfo,
  subNodeList,
  tabsList,
  twoSubNodeList
} from './common.js'
import DialogAddInfo from './components/addOptimization.vue'
import Assignment from './components/assignment.vue'
import BatchAudit from './components/batchAudit.vue'
import BatchOperations from './components/batchOperations.vue'
import Biaozhu from './components/biaozhu.vue'
import { getCategoryByValue, getStoreByValue } from './components/common'
import CusTimeSelect from './components/cusTimeSelect.vue'
import EmptyTable from './components/EmptyTable.vue'
import PopoverItem from './components/popoverItem.vue'
import SearchForm from './components/searchForm.vue'

defineOptions({ name: 'ScheduleOptimization' })
const currentIcon = ref(-1)
const message = useMessage() // 消息弹窗
const searchForm = ref()
const list: Ref<any[]> = ref([]) // 非临时需求列表的数据
const total = ref(10) // 列表的总页数
const loading = ref(false)
const status = ref(0)
const AssignmentNode = ref()
const AssignmentSubNode = ref()
const batchAudit = ref()

const queryParams = reactive({
  page: 1,
  size: 10,
  start: undefined, //开始时间
  end: undefined //结束时间
})
const selectItems = ref([]) //用户选中的选项
const currentTab = ref('temporary')

// 计算属性，用于判断是否临时需求之外的需求
const isOtherTab = computed(() => {
  return ['newProduct', 'optimization', 'internal'].includes(currentTab.value)
})

const preViewImg1 = (rawHtml) => {
  if (!rawHtml) return ''
  // 正则匹配<img>标签，提取src并添加onclick
  return rawHtml.replace(/<img\b([^>]*)>/g, (match, attrs) => {
    // 提取src属性（支持单/双引号）
    const srcMatch = attrs.match(/src=(['"])(.*?)\1/)
    if (srcMatch) {
      const src = srcMatch[2] // 获取src值（去除引号）
      // 添加onclick事件（注意：需绑定到Vue实例）
      // 这里通过window.__vue__访问当前实例（需确保Vue实例挂载到window）
      // 对rawHtml做编码，防止特殊字符影响
      const encodedHtml = encodeURIComponent(rawHtml)
      // 移除原有 style 属性，防止冲突
      let newAttrs = attrs.replace(/style=(['"])(.*?)\1/, '')
      // 追加你想要的样式
      newAttrs += ` style="width:100px;height:100px;display:inline-block;cursor:pointer;" `
      return `<img ${newAttrs} onclick="preViewImg('${src}', decodeURIComponent('${encodedHtml}'))">`

      // return `<img ${attrs} onclick="preViewImg('${src}', decodeURIComponent('${encodedHtml}'))">`
    }
    return match // 无src属性时不处理
  })
}

// 预览的图片地址
const previewSrc = ref('')
const imagePreview = ref(null)
const imgList = ref([]) // 用于存储预览的图片列表
const initialIndex = ref(0) // 初始预览图片的索引

const preViewImg = (src, rawHtml) => {
  console.log(src, rawHtml, '  preViewImg')
  // rawHtml 获取所有img 图片的地址
  imgList.value = []
  const imgReg = /<img\b[^>]*src=(['"])(.*?)\1/g
  let match
  while ((match = imgReg.exec(`${rawHtml}`))) {
    imgList.value.push(match[2])
  }
  initialIndex.value = imgList.value.findIndex((item) => item === src)

  previewSrc.value = src
  imagePreview.value?.showPreview() // 打开图片预览弹窗
}
onMounted(() => {
  window.preViewImg = preViewImg // 将函数挂载到window对象上
})

//是否要清楚时间在搜索
const handleSearch = (type) => {
  queryParams.page = 1
  type == 1 ? cleanTime() : getList()
}

const batchOperationsRef = ref()
// 批量操作
const handleBatchOperations = () => {
  if (!selectItems.value?.length) {
    message.error('请选择要批量操作的数据')
    return
  }

  // TODO： 只要有一个auditState==0  return 未通过视觉审核的需求不允许批量操作，请取消勾选后重试
  // @ts-ignore
  const flag = selectItems.value.some((item) => item?.auditState == 0)
  if (flag) {
    message.error('未通过视觉审核的需求不允许批量操作，请取消勾选后重试')
    return
  }

  batchOperationsRef.value.open(selectItems.value)
}

//批量审核
const handleBatchAudit = () => {
  if (!selectItems.value?.length) {
    message.error('请选择要批量操作的数据')
    return
  }

  let str = ''
  selectItems.value.forEach((item) => {
    // @ts-ignore
    if (item?.id) {
      // @ts-ignore
      str += `${item?.id},`
    }
  })

  // 去掉最后一个逗号
  str = str.slice(0, -1)
  batchAudit.value.open(str)
}

//清空选择
const handleCleanAllSelect = () => {
  selectItems.value = []
}

// 寻找
const findIndex = (item) => {
  // @ts-ignore
  return selectItems.value.findIndex((it) => it.id === item.id)
}

const selectAll = () => {
  const type = currentTab.value == 'temporary' ? 'temporary' : 'other'
  const flag = isSameType(type)
  if (flag) return
  if (currentAll.value) {
    // 清空
    list.value.forEach((item) => {
      if (item?.state == 3 || item?.state == 4 || item?.state == 5) return
      if (item?.auditState == 2) return
      const index = findIndex(item)
      if (index == -1) return
      selectItems.value.splice(index, 1)
    })
  } else {
    //添加
    list.value.forEach((item) => {
      if (item?.state == 3 || item?.state == 4 || item?.state == 5) return
      if (item?.auditState == 2) return
      const index = findIndex(item)
      if (index == -1) {
        // @ts-ignore
        selectItems.value.push(item)
      }
    })
  }
}

// 是不是全部是临时需求
const isAllSame = (type) => {
  if (type == 'temporary') {
    // 临时
    // @ts-ignore
    return selectItems.value.every((item) => item?.demandType == type)
  } else {
    const validTypes = ['newProduct', 'optimization', 'internal']
    // @ts-ignore
    return selectItems.value.every((item) => validTypes.includes(item?.demandType))
  }
}

// 是不是存在这一个id的项目
const insertOneItem = (item) => {
  const index = findIndex(item)
  if (index !== -1) {
    selectItems.value.splice(index, 1)
  } else {
    // @ts-ignore
    selectItems.value.push(item)
  }

  console.log(selectItems.value, '  selectItems.value')
}

// 是不是同一种类型
const isSameType = (type) => {
  if (selectItems.value?.length > 0) {
    const flag = isAllSame(type)
    if (!flag) {
      message.error('同一类型才能批量操作')
      return true
    }
    return false
  }
  return false
}

// 单个选择
const selectSingle = (item) => {
  console.log(item)
  // 已完成的不能新增
  if (item?.state == 3 || item?.state == 4 || item?.state == 5) return
  if (item?.auditState == 2) return
  const type = currentTab.value == 'temporary' ? 'temporary' : 'other'
  const flag = isSameType(type)
  if (flag) return
  insertOneItem(item)
}

//单个是不是被选中
const formatSelect = (item) => {
  const index = findIndex(item)
  return index != -1
}

const formatDisable = (item) => {
  if (item.state == 3 || item.state == 4 || item.state == 5) return true
  if (item?.auditState == 2) return true
  return false
}

// 当前所有是否被选中
const currentAll = computed(() => {
  if (!selectItems.value?.length) return false
  const arr = list.value.filter((item) => {
    if (item?.state != 3 && item?.state != 4 && item?.state != 5) {
      return item
    }
  })
  return arr.every((item) => {
    // @ts-ignore
    const index = selectItems.value.findIndex((it) => it.id == item.id)
    return index != -1
  })
})

const addInfoCb = (type) => {
  status.value = type
  addInfo.value.open(undefined, type)
}

//  编辑
const handleEdit = (item) => {
  isEdit.value = true
  status.value = 0
  addInfo.value.open(item.id)
}
// 复制
const handleCopy = (item) => {
  status.value = 0
  const id = `${item.id},copy`
  addInfo.value.open(id)
}

const selectTime = ref() //日期选择器实例
const cleanTime = () => {
  selectTime.value?.resetTime()
}

//hover信息弹出框 1-方案｜2-拍摄｜3-后期｜4-页面｜5-临时需求
const formatDetail = (item, node) => {
  const ite = item.records?.filter((it) => {
    if (it.node == `${node}`) {
      return it
    }
  })
  if (ite?.length > 0) {
    return ite[ite?.length - 1]
  } else {
    return {}
  }
}

// 动态计算加号偏移
const calculateMargin = (item, node, subTab?) => {
  return formatAvtor(item, node, subTab)?.length ? '-15px' : '0px'
}

const isSubNode = (value) => {
  return [1, 2, 3, 4].includes(value)
}

// 单节点展示指派信息的节点 //1-方案｜2-拍摄｜3-后期｜4-页面｜5-临时需求
const formatAvtor = (item, node, subTab?) => {
  const ite = item.records?.filter((it) => {
    if (it.node == `${node}` && it.type == 1) {
      return it
    }
  })
  if (ite.length > 0) {
    if (isSubNode(node)) {
      const arr = ite?.filter((item) => {
        if (item.node == `${node}` && item.type == 1 && item.subNode == subTab) {
          return item
        }
      })
      const operators = arr[arr.length - 1]?.operators || []
      return operators.length > 2 ? operators.slice(0, 3) : operators
    } else {
      const operators = ite[ite.length - 1]?.operators || []
      return operators.length > 2 ? operators.slice(0, 3) : operators
    }
  } else {
    return []
  }
}

// 打开详情 任务提交
const goDetail = (node, item, subNode?: any) => {
  handleAdd(node, item, subNode)
}

// 单节点判断  three完成 two进行中 one未开始
const formatClass = (item, type) => {
  switch (item[type]) {
    case 0:
      return 'one'
    case 1:
      return 'two'
    case 2:
      return 'three'
    default:
      return 'one'
  }
}

// 多节点判断 three完成 two进行中 one未开始
const formatSubClass = (item, node, subNode?) => {
  const ite = item.records?.filter((it) => {
    if (it.node == `${node}` && it.subNode == subNode) {
      return it
    }
  })
  const three = ite?.some((item) => item.type == 2 || item.type == 9)
  const two = ite?.some((item) => item.type == 1)
  if (three) return 'three'
  if (two) return 'two'
  return 'one'
}

// 指派 标注后刷新页面
const handleSuccess = () => {
  currentDetail.value = undefined
  getList()
  selectItems.value = []
  assignmentRef.value.close()
}

// 时间改变
const handleTimeChange = (time) => {
  queryParams.start = time[0]
  queryParams.end = time[1]
  getList()
}

// 搜索条件
const cusQueryParams = computed(() => {
  return searchForm.value?.cusQueryParams
})

// 获取列表
const getList = async () => {
  try {
    loading.value = true
    const params = {
      ...queryParams,
      ...cusQueryParams.value,
      demandType: currentTab.value
    }

    if (currentIcon.value != -1) {
      params.asc = currentIcon.value
    }

    const res = await getVisualApproval(params)
    list.value = res.records?.map((item) => ({ ...item, tag: preViewImg1(item.tag) })) || []

    console.log(list.value, 'list.value111')
    total.value = res.total || 10
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

// 添加 打开
const addInfo = ref()
const assignmentRef = ref()
const currentDetail = ref()
provide('currentDetail', currentDetail)
const openDialog = (item, node, newSub?) => {
  currentDetail.value = item
  AssignmentNode.value = node
  AssignmentSubNode.value = newSub

  // 没有权限不能指派任务
  const flag = hasPermiJs('team:optimization:assignment')
  if (!flag) {
    message.error('您没有权限指派任务')
    return
  }
  // 终止
  if (item.state == 5) {
    const msg = '任务已终止，无法指派人员'
    message.error(msg)
    return
  }
  // 没有审核不能指派
  if (item.auditState == 0 || item.auditState == 2) {
    const msg = item.auditState == 0 ? '任务未审核，无法指派人员' : '任务未审核通过，无法指派人员'
    message.error(msg)
    return
  }

  if ([1, 2, 3, 4].includes(node)) {
    //多节点
    status.value = node
    addInfo.value.open(item.id, 'add', undefined, newSub)
  } else {
    assignmentRef.value.open(item, node)
  }
}

// 查看
const handleAdd = (type: number, row?: any, subNode?: any) => {
  status.value = type > 8 ? type - 8 : type
  addInfo.value.open(row?.id, type, subNode?.value)
}

// 标注
const biaozhuRef = ref()
const openBiaoZhu = (item, type?) => {
  biaozhuRef.value.open(item, type)
}

// 运营审核
const shenhe = async (item) => {
  await message.confirm('审核通过')
  await storeManagerAudit({ id: item.id })
  message.success('操作成功')
  getList()
}
const isEdit = ref(false)
// 添加成功之后刷新
const handleReload = () => {
  // 重置编辑
  isEdit.value = false
  nextTick(() => {
    getList()
  })
}

// 排序
const handleSorting = (value) => {
  if (currentIcon.value == value) {
    currentIcon.value = -1
    getList()
    return
  }
  currentIcon.value = value
  getList()
}

// 产品图列表
const formatImg = (str) => {
  if (!str) return
  const arr = (str || '').split(',')
  const imgs = arr.map((item) => {
    return item.split(';')[0]
  })
  return imgs
}

// 产品图
const formatOne = (str) => {
  const arr = formatImg(str)
  return arr[0] || ''
}

// tab 切换
const tabsChange = (code) => {
  if (code != currentTab.value) {
    currentTab.value = code
    currentIcon.value = -1
    nextTick(() => {
      queryParams.page = 1
      getList()
    })
  }
}

// 左右滑动
const otherRef = ref()

const handleMode = (type) => {
  if (type == 'left') {
    otherRef.value.scrollLeft = otherRef.value.scrollLeft - 300
  } else {
    otherRef.value.scrollLeft = otherRef.value.scrollLeft + 300
  }
}
</script>

<style scoped src="./index.css"></style>
