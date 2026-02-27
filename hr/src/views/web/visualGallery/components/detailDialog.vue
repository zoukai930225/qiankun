<!--
 * @Date: 2025年5月14日16:37:15
-->
<template>
  <div class="main-box body">
    <el-dialog v-model="isVisible" style="" :show-close="false" :modal="true" align-center>
      <div class="mainContainer">
        <div class="header row-center">
          <img class="header-icon" :src="getImageUrl(mainImgData.channel)" />
          <el-tooltip
            class="box-item"
            effect="dark"
            content="点击跳转商品链接"
            placement="top-start"
          >
            <div
              class="header-name"
              @click="clickGoodCard(mainImgData.channel, mainImgData.goodsId)"
              >{{ `${mainImgData.goodsCode}` + `(${mainImgData.goodsId})` }}</div
            >
          </el-tooltip>
          <div class="header-mainImg">主图</div>
        </div>
        <div style="display: flex">
          <!-- 主图 -->
          <div>
            <div class="mainContainer-coverBg">
              <img class="mainContainer-coverBg-cover" :src="mainImgData.imageUrl" />
            </div>
            <div class="mainContainer-coverBg-imgs">
              <img class="zhexianatux" src="@/assets/imgs/web/zhexianatu2x.png" alt="" />
              <div class="zhexianatuxValue">访客数曲线图</div>
              <div class="zhexianatuxButton" @click="openZheXian(mainImgData.goodsId)">进入</div>
            </div>
            <!-- 信息 -->
            <div class="right">
              <div class="rightMessage">
                <div class="rightMessageText">
                  <img class="rightMessagePng" src="@/assets/imgs/web/rightMessage.png" alt="" />
                  <div>信息</div>
                </div>
                <div class="rightMessageTop">
                  <div>
                    <div>类目</div>
                    <div class="textValue right-message-top-item">
                      <overflow-tooltip :content="mainImgData.category || '--'" :line-clamp="1" />
                    </div>
                  </div>
                  <div>
                    <div>编码</div>
                    <div class="textValue right-message-top-item">
                      <overflow-tooltip :content="mainImgData.goodsCode || '--'" :line-clamp="1" />
                    </div>
                  </div>
                  <div>
                    <div>产品定位</div>
                    <div class="right-message-top-item">
                      <overflow-tooltip
                        :content="mainImgData.productPositioning || '--'"
                        :line-clamp="1"
                      />
                    </div>
                  </div>
                  <div>
                    <div class="whitespace-nowrap">平均停留时长(秒)</div>
                    <div class="textValue right-message-top-item">
                      <overflow-tooltip
                        :content="mainImgData.averageStayDuration || '--'"
                        :line-clamp="1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div style="height: 0.625vw"></div>
              <div class="rightMessageBottom">
                <div style="height: 0.520833vw"></div>
                <div class="rightMessageBottomTop">
                  <img class="blueTimePng" src="@/assets/imgs/web/blueTime.png" alt="" />
                  <div class="rightMessageBottomTopText">数据时间</div>
                  <div style="margin-right: 0.520833vw" class="rightMessageBottomTopValue"
                    >截止</div
                  >
                  <div class="rightMessageBottomTopValue">{{ mainImgData.clickRateEndTime }}</div>
                </div>
                <div class="rightMessageBottomCenter">
                  <div class="rightMessageBottomCenterTopText">
                    <div style="margin-right: 2.916667vw">7天免费点击率</div>
                    <div style="margin-right: 2.083333vw">30天免费点击率</div>
                    <div>7天免费转换率</div>
                  </div>
                  <div class="rightMessageBottomCenterTopValue">
                    <!-- 7天付费点击率 -->
                    <div
                      v-if="mainImgData.clickRateSeven"
                      style="width: 7.812501vw; font-weight: 600"
                      class="textValue"
                    >
                      {{ mainImgData.clickRateSeven }}
                    </div>
                    <div
                      v-else
                      style="width: 7.604167vw; font-weight: 600"
                      class="textValue textValue2"
                    >
                      <img
                        style="width: 1.041667vw; height: 1.041667vw; margin-right: 0.3125vw"
                        src="@/assets/imgs/web/loading.gif"
                        alt=""
                      />抓取中
                    </div>
                    <!-- 30天免费点击率 -->
                    <div
                      v-if="mainImgData.clickRateThirty"
                      style="width: 7.291667vw; font-weight: 600"
                      class="textValue"
                    >
                      {{ mainImgData.clickRateThirty }}
                    </div>
                    <div
                      v-else
                      style="width: 7.291667vw; font-weight: 600"
                      class="textValue textValue2"
                    >
                      <img
                        style="width: 1.041667vw; height: 1.041667vw; margin-right: 0.3125vw"
                        src="@/assets/imgs/web/loading.gif"
                        alt=""
                      />抓取中
                    </div>
                    <!-- 7天付费转换率 -->
                    <div
                      v-if="mainImgData.checkNormal === '2'"
                      style="flex: 1; font-weight: 600"
                      class="textValue"
                    >
                      {{ mainImgData.clickConversionRateSeven || '--' }}
                    </div>
                    <div v-else style="flex: 1; font-weight: 600" class="textValue textValue2">
                      <img
                        style="width: 1.041667vw; height: 1.041667vw; margin-right: 0.3125vw"
                        src="@/assets/imgs/web/loading.gif"
                        alt=""
                      />抓取中
                    </div>
                  </div>
                  <div class="rightMessageBottomCenterLine"></div>
                  <div class="rightMessageBottomCenterTopText">
                    <div style="margin-right: 2.5vw">30天免费转换率</div>
                    <div style="margin-right: 3.958333vw">30天销量</div>
                    <div style="margin-left: 4px">累计销量</div>
                  </div>
                  <div class="rightMessageBottomCenterTopValue">
                    <div
                      v-if="mainImgData.checkNormal === '2'"
                      style="width: 7.916667vw; font-weight: 600"
                      class="textValue"
                    >
                      {{ mainImgData.clickConversionRateThirty || '--' }}
                    </div>
                    <div
                      v-else
                      style="width: 7.916667vw; font-weight: 600"
                      class="textValue textValue2"
                    >
                      <img
                        style="width: 1.041667vw; height: 1.041667vw; margin-right: 0.3125vw"
                        src="@/assets/imgs/web/loading.gif"
                        alt=""
                      />抓取中
                    </div>

                    <div style="width: 7.083333vw; font-weight: 600" class="textValue textValue2">{{
                      mainImgData.salesVolumeThirty || '--'
                    }}</div>

                    <div style="flex: 1; font-weight: 600" class="textValue">{{
                      mainImgData.salesVolumeCumulative || '--'
                    }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 推广图 修改 TODO: -->
          <div class="content-main">
            <div class="button-group text-right mb-16px">
              <el-button type="primary" @click="handleSync">车图同步</el-button>
              <el-button v-if="groupedList.length" @click="toggleAllGroups">
                {{ isAllCollapsed ? '一键展开' : '一键收起' }}
              </el-button>
            </div>
            <el-scrollbar v-if="groupedList.length != 0">
              <div class="tuijiantuBox" v-if="groupedList.length >= 1">
                <div
                  v-for="(group, groupIndex) in groupedList"
                  :key="group.id || group.mappingTime || groupIndex"
                  class="promotion-group"
                >
                  <div class="promotion-header">
                    <div class="promotion-group__title">
                      版本时间 {{ filterTime(group.mappingTime) || '--' }}
                    </div>
                    <span class="promotion-toggle cursor-pointer" @click="toggleGroup(groupIndex)"
                      >{{ group.collapsed ? '展开' : '收起' }}
                      <el-icon>
                        <ArrowDown v-if="group.collapsed" />
                        <ArrowUp v-else /> </el-icon
                    ></span>
                  </div>
                  <ElCollapseTransition>
                    <div v-show="!group.collapsed" class="promotion-group__content">
                      <div
                        v-for="(x, y) in group.list"
                        :key="x.id || `${groupIndex}-${y}`"
                        class="promotion-group__item"
                      >
                        <DetailTitleHeader
                          :item="x"
                          :desc="x.type == '1' ? '手动上传' : '自动上传'"
                          @delete-success="handleUpdateSuccess"
                        >
                          <!-- <div class="flex-column header-title-content" v-if="x.type == '2'">
                          <div class="title-desc"
                            ><span class="title-header">推广场景：</span>{{ x.sceneName }}</div
                          >
                        </div> -->
                          <template #desc-right>
                            <div class="flex items-center text-14px">
                              <div class="text-#666">车图上传时间</div>
                              <div class="text-#333 ml-16px">{{ getMaxCreatedTime(x) }}</div>
                            </div>
                          </template>
                        </DetailTitleHeader>
                        <!-- 手动 -->
                        <AutoItem
                          :item="x"
                          @pic-click="handlePicClick"
                          @update-success="handleUpdateSuccess"
                          :isAuto="false"
                          v-if="x.type == '1'"
                        />
                        <!-- 自动 -->
                        <div v-if="x.type == '2'">
                          <div v-for="it in x.dataList" :key="it.id">
                            <AutoItem
                              :item="it"
                              @pic-click="handlePicClick"
                              :isAuto="true"
                              @update-success="handleUpdateSuccess"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </ElCollapseTransition>
                </div>
              </div>
            </el-scrollbar>
            <div class="tuijiantuBox" v-if="groupedList.length === 0" style="width: 100%">
              <div style="display: flex; flex-direction: column; align-items: center">
                <img
                  style="margin-top: 200px; width: 356px; height: 226.11px"
                  src="@/assets/imgs/web/NoChePic.png"
                  alt=""
                />
                <div
                  style="
                    margin-top: 20px;
                    font-family: PingFang SC;
                    font-size: 14px;
                    font-weight: normal;
                    line-height: normal;
                    letter-spacing: normal;
                    color: #999999;
                  "
                >
                  暂无相关数据</div
                >
              </div>
            </div>
          </div>
        </div>
        <img class="mainContainer-close" src="@/assets/imgs/web/close.png" @click="onClose" />
      </div>
    </el-dialog>
  </div>
  <!-- 点击弹出狂图片出现的弹出框 -->
  <div class="dialog2">
    <el-dialog v-model="isVisible2" :show-close="false" modal-class="mark">
      <div class="dialog2_close" @click="isVisible2 = false">
        <img src="@/assets/imgs/web/close.png" alt="" />
      </div>
      <div class="topZhanWei"> </div>
      <div class="dialog2-top">
        <div class="dialog2-top-left">
          <el-image
            class="Urlimg"
            :fit="'contain'"
            :src="dialog2Data.url"
            :preview-src-list="
              currentIsVisible2Auto ? [dialog2Data.imageUrl] : dialog2Data.imageList
            "
            :initial-index="dialog2Data.currentIndex"
            alt=""
          />
          <!-- 上一张 -->
          <img
            :src="leftButtonImg.normal"
            style="width: 1.71875vw; height: 1.71875vw"
            class="leftButton"
            alt=""
            @click="prevImage"
            @mouseenter="handleLeftHover(true)"
            @mouseleave="handleLeftHover(false)"
          />
          <!-- 下一张 -->
          <img
            :src="rightButtonImg.normal"
            style="width: 1.71875vw; height: 1.71875vw"
            class="rightButton"
            alt=""
            @click="nextImage"
            @mouseenter="handleRightHover(true)"
            @mouseleave="handleRightHover(false)"
          />
        </div>
        <div class="dialog2-top-right">
          <div class="dialog2-top-right-title">
            <img
              style="width: 0.625vw; height: 0.625vw; margin-right: 0.416667vw"
              src="@/assets/imgs/web/people.png"
              alt=""
            />
            人员
          </div>
          <div class="dialog2-top-right-list">
            <!-- 运营人员 -->
            <div style="display: flex; align-items: center">
              <div class="nameUser" style="width: 4.166667vw">运营</div>
              <div
                class="UserNameValue"
                style="
                  max-width: calc(100% - 4.6875vw);
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <el-tooltip placement="top">
                  <span>{{
                    dialog2Data.operationPersonnels?.map((p) => p.name).join('、') || '--'
                  }}</span>
                  <template #content>
                    <span style="white-space: normal">
                      <span
                        v-for="(person, index) in dialog2Data.operationPersonnels || []"
                        :key="index"
                      >
                        {{ person.name }}
                        <span v-if="index < dialog2Data.operationPersonnels?.length - 1">、</span>
                      </span>
                    </span>
                  </template>
                </el-tooltip>
              </div>
            </div>

            <!-- 策划人员 -->
            <div style="display: flex; align-items: center">
              <div class="nameUser" style="width: 4.166667vw">策划</div>
              <div
                class="UserNameValue"
                style="
                  max-width: calc(100% - 4.6875vw);
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <el-tooltip placement="top">
                  <span>{{
                    dialog2Data.planningPersonnels?.map((p) => p.name).join('、') || '--'
                  }}</span>
                  <template #content>
                    <span style="white-space: normal">
                      <span
                        v-for="(person, index) in dialog2Data.planningPersonnels || []"
                        :key="index"
                      >
                        {{ person.name }}
                        <span v-if="index < dialog2Data.planningPersonnels?.length - 1">、</span>
                      </span>
                    </span>
                  </template>
                </el-tooltip>
              </div>
            </div>

            <!-- 拍摄人员 -->
            <div style="display: flex; align-items: center">
              <div class="nameUser" style="width: 4.166667vw">拍摄</div>
              <div
                class="UserNameValue"
                style="
                  max-width: calc(100% - 4.6875vw);
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <el-tooltip placement="top">
                  <span>{{ dialog2Data.cameraCrews?.map((p) => p.name).join('、') || '--' }}</span>
                  <template #content>
                    <span style="white-space: normal">
                      <span v-for="(person, index) in dialog2Data.cameraCrews || []" :key="index">
                        {{ person.name }}
                        <span v-if="index < dialog2Data.cameraCrews?.length - 1">、</span>
                      </span>
                    </span>
                  </template>
                </el-tooltip>
              </div>
            </div>

            <!-- 后期人员 -->
            <div style="display: flex; align-items: center">
              <div class="nameUser" style="width: 4.166667vw">后期</div>
              <div
                class="UserNameValue"
                style="
                  max-width: calc(100% - 4.6875vw);
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <el-tooltip placement="top">
                  <span>{{
                    dialog2Data.latePersonnels?.map((p) => p.name).join('、') || '--'
                  }}</span>
                  <template #content>
                    <span style="white-space: normal">
                      <span
                        v-for="(person, index) in dialog2Data.latePersonnels || []"
                        :key="index"
                      >
                        {{ person.name }}
                        <span v-if="index < dialog2Data.latePersonnels?.length - 1">、</span>
                      </span>
                    </span>
                  </template>
                </el-tooltip>
              </div>
            </div>

            <!-- 设计人员 -->
            <div style="display: flex; align-items: center">
              <div class="nameUser" style="width: 4.166667vw">设计</div>
              <div
                class="UserNameValue"
                style="
                  max-width: calc(100% - 4.6875vw);
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                <el-tooltip placement="top">
                  <span>{{ dialog2Data.designers?.map((p) => p.name).join('、') || '--' }}</span>
                  <template #content>
                    <span style="white-space: normal">
                      <span v-for="(person, index) in dialog2Data.designers || []" :key="index">
                        {{ person.name }}
                        <span v-if="index < dialog2Data.designers?.length - 1">、</span>
                      </span>
                    </span>
                  </template>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog2-content">
        <div class="dialog2-content-left">
          <div class="dialog2-content-left-title">
            <img src="@/assets/imgs/web/fly2x.png" alt="" />
            推广信息
          </div>
          <div style="background-color: #fff">
            <div class="dialog2-content-left-xuqiu">
              <div class="dialog2-content-left-xuqiu-text" style="margin-left: 0.520833vw"
                >需求方</div
              >
              <div class="dialog2-content-left-xuqiu-value" style="margin-left: 0.520833vw">
                <el-tooltip :content="dialog2Data.demandSide">
                  {{ dialog2Data.demandSide }}
                </el-tooltip>
              </div>
              <div
                class="dialog2-content-left-xuqiu-value"
                v-if="!dialog2Data.demandSide"
                style="margin-left: 0.520833vw"
                >--</div
              >
            </div>
            <div class="dialog2-content-left-xuqiu" style="height: 10.104167vw; margin-bottom: 0">
              <div class="dialog2-content-left-xuqiu-text" style="margin-left: 0.625vw"
                >测图目的</div
              >
              <div
                class="dialog2-content-left-xuqiu-value cetumudi"
                style="margin-left: 0.520833vw"
                v-if="dialog2Data.mappingPurpose"
              >
                <el-tooltip>
                  {{ dialog2Data.mappingPurpose }}
                  <template #content>
                    <div
                      style="
                        width: 293px;
                        padding: 12px;
                        font-size: 14px;
                        background: rgba(51, 51, 51, 0.66);
                      "
                    >
                      {{ dialog2Data.mappingPurpose }}
                    </div>
                  </template>
                </el-tooltip>
              </div>
              <div
                class="dialog2-content-left-xuqiu-value cetumudi"
                style="margin-left: 0.520833vw"
                v-if="!dialog2Data.mappingPurpose"
              >
                --
              </div>
            </div>
          </div>
        </div>
        <div class="dialog2-content-right">
          <div class="dialog2-content-right-top">
            <div class="flex-row">
              <img src="@/assets/imgs/web/date_icon.png" alt="" />
              <div>测图时间</div>
              <div class="nameValue mapping-time">{{ filterTime(dialog2Data.mappingTime) }}</div>
            </div>
            <div class="bianjiButoon" @click="openDialog3">编辑</div>
          </div>

          <div class="dialog2-content-right-content">
            <div class="dialog2-content-right-content-footer-top">
              <div style="color: #727e93">结论</div>
              <img
                v-if="dialog2Data.conclusionType === '1'"
                src="@/assets/imgs/web/success.png"
                alt=""
              />
              <img
                v-if="dialog2Data.conclusionType === '2'"
                src="@/assets/imgs/web/error.png"
                alt=""
              />
              <img
                v-if="dialog2Data.conclusionType === '3'"
                src="@/assets/imgs/web/again.png"
                alt=""
              />
              <img
                v-if="dialog2Data.conclusionType === '4'"
                src="@/assets/imgs/web/stopYh.png"
                alt=""
              />
              <div
                v-if="dialog2Data.conclusionType === '1'"
                style="
                  color: #0064ff;
                  font-family: PingFang SC;
                  font-size: 0.729167vw;
                  font-weight: 600;
                "
                >优化成功</div
              >
              <div
                v-if="dialog2Data.conclusionType === '2'"
                style="
                  color: #eb3737;
                  font-family: PingFang SC;
                  font-size: 0.729167vw;
                  font-weight: 600;
                "
                >优化失败</div
              >
              <div
                v-if="dialog2Data.conclusionType === '3'"
                style="
                  color: #7070f5;
                  font-family: PingFang SC;
                  font-size: 0.729167vw;
                  font-weight: 600;
                "
                >继续优化</div
              >
              <div
                v-if="dialog2Data.conclusionType === '4'"
                style="
                  color: #ea5b25;
                  font-family: PingFang SC;
                  font-size: 0.729167vw;
                  font-weight: 600;
                "
                >停止优化</div
              >
            </div>
            <Dialog2ListItem :dialog2Data="dialog2Data" :isAuto="currentIsVisible2Auto" />
            <div class="dialog2-content-right-content-footer">
              <!-- <div class="dialog2-content-right-line"></div> -->
              <div class="dialog2-content-right-update">
                <div class="name" style="margin-left: 1.041667vw">更新人</div>
                <div class="nameValue" style="margin-left: 0.833333vw">
                  <img
                    style="
                      vertical-align: middle;
                      width: 0.9375vw;
                      height: 0.9375vw;
                      border-radius: 50%;
                      margin-right: 0.416667vw;
                    "
                    :src="dialog2Data.updatedAvatar"
                    alt=""
                  />
                  {{ dialog2Data.updatedName }}
                </div>
                <div class="name" style="margin-left: 2.1875vw; margin-right: 0.729167vw"
                  >更新时间</div
                >
                <div class="nameValue">{{ filterTime(dialog2Data.updatedAt) }}</div>
              </div>
              <div class="dialog2-content-right-content-footer-text">
                {{ dialog2Data.conclusion }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog2-footerImgs">
        <div class="dialog2-footerImgs-Title">
          <img class="TitleImg" src="@/assets/imgs/web/uploadImg.png" alt="" />
          数据图上传
        </div>
        <div class="imgsUrl" v-if="dialog2Data.dataImages2">
          <div
            class="imgsUrlBox"
            v-for="(item, index) in dialog2Data.dataImages2"
            :key="index"
            style="display: flex; flex-direction: column; align-items: center"
          >
            <!-- 判断是否为图片 -->
            <template v-if="isImage(item.name || item.url)">
              <el-image
                class="img-item"
                :src="item.url"
                fit="cover"
                :preview-src-list="imageUrls"
                :initial-index="imageUrls.findIndex((url) => url === item.url)"
              />
              <el-link type="primary" :underline="false" class="img-link" :title="item.name">
                {{ item.name }}
              </el-link>
            </template>
            <template v-else>
              <img
                class="img-item"
                :src="getFileIcon(item.name)"
                @click="handleFile({ name: item.name, url: item.url })"
                style="cursor: pointer"
              />
              <el-link
                type="primary"
                :underline="false"
                class="img-link"
                :title="item.name"
                @click.prevent="handleFile({ name: item.name, url: item.url })"
              >
                {{ item.name }}
              </el-link>
            </template>
          </div>
        </div>
        <div v-else class="imgsUrl2">
          <div
            style="display: flex; flex-direction: column; text-align: center; align-items: center"
          >
            <img
              style="width: 8.177083vw; height: 3.75vw"
              src="@/assets/imgs/web/noDataImgUrl.png"
              alt=""
            />
            <div class="nodata">暂无数据</div>
          </div>
        </div>
      </div>
      <template #title></template>
    </el-dialog>
  </div>
  <div class="dialog3" v-if="isVisible3">
    <el-dialog v-model="isVisible3" :show-close="false" @close="closeDialog3">
      <div class="dialog3-zhan"></div>
      <div class="dialog3-top"> 编辑 </div>
      <img
        @click="closeDialog3"
        style="
          width: 1.041667vw;
          height: 1.041667vw;
          position: absolute;
          top: 0.833333vw;
          right: 0.520833vw;
          cursor: pointer;
        "
        src="@/assets/imgs/web/close.png"
        alt=""
      />
      <div class="dialog3-content">
        <div class="dialog3-content-zhan"></div>
        <el-form :model="form" :rules="rules" ref="formRef" label-width="130px">
          <div v-if="!currentIsVisible2Auto">
            <!-- 第一行：需求方和测图目的 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="需求方" prop="demandSide">
                  <div class="input-container2 form-input">
                    <el-input v-model="form.demandSide" placeholder="请输入需求方" />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="测图目的" prop="mappingPurpose">
                  <div class="input-container2 form-input">
                    <el-input v-model="form.mappingPurpose" placeholder="请输入测图目的" />
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第二行：运营人员和策划人员 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="运营人员" prop="operationPersonnel">
                  <div class="input-container2 form-input">
                    <SWSelectPeople
                      :isEdit="true"
                      v-model:modelValue="form.operationPersonnels"
                      :getSearchList="remoteMethod"
                      @select-people-change="selectPeopleChange('operationPersonnel')"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="策划人员">
                  <div class="input-container2 form-input">
                    <SWSelectPeople
                      :isEdit="true"
                      v-model:modelValue="form.planningPersonnels"
                      :getSearchList="remoteMethod"
                      @select-people-change="selectPeopleChange('planningPersonnel')"
                    />
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第三行：拍摄人员和后期人员 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="拍摄人员" prop="cameraCrew">
                  <div class="input-container2 form-input">
                    <SWSelectPeople
                      :isEdit="true"
                      v-model:modelValue="form.cameraCrews"
                      :getSearchList="remoteMethod"
                      @select-people-change="selectPeopleChange('cameraCrew')"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="后期人员" prop="latePersonnel">
                  <div class="input-container2 form-input">
                    <SWSelectPeople
                      :isEdit="true"
                      v-model:modelValue="form.latePersonnels"
                      :getSearchList="remoteMethod"
                      @select-people-change="selectPeopleChange('latePersonnel')"
                    />
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第四行：设计人员（单独一行，居中） -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="设计人员" prop="designer">
                  <div class="input-container2 form-input">
                    <SWSelectPeople
                      :isEdit="true"
                      v-model:modelValue="form.designers"
                      :getSearchList="remoteMethod"
                      @select-people-change="selectPeopleChange('designer')"
                    />
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第五行：7天付费点击率和转换率 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="7天付费点击率" prop="clickRateSeven">
                  <div class="input-container2 form-input">
                    <el-input type="number" v-model="form.clickRateSeven" placeholder="" />
                    <span class="percent-symbol">%</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="7天付费转换率">
                  <div class="input-container2 form-input">
                    <el-input
                      type="number"
                      v-model="form.clickConversionRateSeven"
                      placeholder=""
                    />
                    <span class="percent-symbol">%</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第六行：15天付费点击率和转换率 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="15天付费点击率" prop="clickRateFifteen">
                  <div class="input-container2 form-input">
                    <el-input type="number" v-model="form.clickRateFifteen" placeholder="" />
                    <span class="percent-symbol">%</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="15天付费转换率" prop="clickConversionRateFifteen">
                  <div class="input-container2 form-input">
                    <el-input
                      type="number"
                      v-model="form.clickConversionRateFifteen"
                      placeholder=""
                    />
                    <span class="percent-symbol">%</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 自动抓取的数据也同样用el-row和el-col结构 -->
          <div v-if="currentIsVisible2Auto">
            <!-- 自动抓取数据内容... -->
          </div>

          <!-- 结论部分 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="测图计划状态" prop="conclusionType">
                <div class="input-container2 form-input result-type">
                  <el-input
                    v-if="isLegacyConclusion(form.conclusionType)"
                    :model-value="legacyConclusionMap[form.conclusionType] || form.conclusionType"
                    disabled
                    placeholder="历史数据"
                  >
                    <template #append>
                      <el-button @click="form.conclusionType = ''">重选</el-button>
                    </template>
                  </el-input>
                  <el-select v-else v-model="form.conclusionType" placeholder="请选择" clearable>
                    <el-option label="继续测图" value="5" />
                    <el-option label="测图结束" value="6" />
                    <el-option label="运营暂无安排测图" value="7" />
                  </el-select>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="multiline-label-item" :label="'图片最终\n用途'" prop="imageName">
                <div class="form-input">
                  <el-select v-model="form.imageName" placeholder="请选择" clearable filterable>
                    <el-option
                      v-for="dict in promotionImageNameOptions"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 结论备注 -->
          <el-row>
            <el-col :span="24">
              <el-form-item label="结论备注" prop="conclusion">
                <s-text-area
                  style="color: #333; width: 100%"
                  v-model="form.conclusion"
                  :rows="5"
                  placeholder="请输入结论备注"
                  resize="none"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 数据图上传 -->
          <el-row>
            <el-col :span="24">
              <el-form-item label="数据图上传" prop="dataImages">
                <!-- <UploadFile
                  :bussiness-code="UPLOAD_FILE_BISSONESSCODE.PICTURE_GALLERY_PROMOTION"
                  v-model:modelValue="form.dataImages2"
                /> -->
                <Transfer
                  v-model="form.dataImages"
                  :accept-type="['image']"
                  :upload-data="{ code: UPLOAD_FILE_BISSONESSCODE.PICTURE_GALLERY_PROMOTION }"
                  multiple
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="dialog3-footer">
        <div class="dialog3-footer-close" @click="isVisible3 = false">关闭</div>
        <div class="dialog3-footer-submit" :loading="loading" @click="submit">提交</div>
      </div>
    </el-dialog>
  </div>
  <AccessLineChart ref="accessLineChartRef" />
</template>

<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import * as GalleryApi from '@/api/gallery'
// import UploadImgs from '@/components/UploadFile/src/UploadImgs.vue'
// import UploadFile from '@/components/UploadFile/src/UploadFile.vue'
import UploadFile from '@/components/SWUoloadFile/index.vue'
import { UPLOAD_FILE_BISSONESSCODE } from '@/components/UploadFile/src/useUpload'
import { getImageUrl } from '@/utils'
import { getUrlByTypeAndId } from '@/utils/index'
import AccessLineChart from './accessLineChart.vue'
import { ElCollapseTransition } from 'element-plus'
import { isImage, isPPT, isExcel, isWord, microsoftOnlinePreviewUrl } from '@/utils/file'

import AutoItem from './detailDialogComponents/autoItem.vue'
import DetailTitleHeader from './detailDialogComponents/detailTitleHeader.vue'
import Dialog2ListItem from './detailDialogComponents/dialog2ListItem.vue'
import { OverflowTooltip } from '@/components/Overflow'
import { getIntDictOptions } from '@/utils/dict'

import Transfer from '@/components/common/upload/transfer.vue'
// 在import部分添加
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
import { useDialog } from '@/hooks/web/useDialog'
import { defineAsyncComponent } from 'vue'

const { openDialog: openSyncDialog } = useDialog()
const SyncImgDialog = defineAsyncComponent(() => import('../index.vue'))

// 引入文件类型图标
import fileExcel from '@/assets/imgs/excel.svg'
import filePdf from '@/assets/imgs/pdf.svg'
import fileDoc from '@/assets/imgs/doc.svg'
import filePpt from '@/assets/imgs/ppt.svg'

const legacyConclusionMap: Record<number, string> = {
  1: '优化成功',
  2: '优化失败',
  3: '继续优化',
  4: '停止优化'
}

// 判断是否为历史数据
const isLegacyConclusion = (val: any) => {
  // 如果值存在，且在历史映射表中，则视为历史数据
  return val && legacyConclusionMap[Number(val)] !== undefined
}

// 文件类型判断函数
function getFileIcon(url: string) {
  const ext = url.split('.').pop()?.toLowerCase() || ''
  if (['xls', 'xlsx'].includes(ext)) return fileExcel
  if (['pdf'].includes(ext)) return filePdf
  if (['doc', 'docx'].includes(ext)) return fileDoc
  if (['ppt', 'pptx'].includes(ext)) return filePpt
  // 其他类型可自定义默认图标
  return fileDoc
}

const loading = ref(false)
const isVisible = ref(false)
const isVisible2 = ref(false)
const isVisible3 = ref(false)
const detailDatas = ref([])
const mainImgData = ref({}) as any
const showImgList = ref([])
const showImgIndex = ref(0)
// const demandSide = ref('')
// const mappingPurpose = ref('')
const currentId = ref('') // 当前编辑的 id
const groupedList = ref([]) as any
const isAllCollapsed = computed(
  () => groupedList.value.length > 0 && groupedList.value.every((group) => group.collapsed)
)
const toggleGroup = (index: number) => {
  const group = groupedList.value[index]
  if (!group) return
  group.collapsed = !group.collapsed
}
const toggleAllGroups = () => {
  const shouldCollapse = !isAllCollapsed.value
  groupedList.value.forEach((group) => {
    group.collapsed = shouldCollapse
  })
}
const dialog2Data = ref({
  imageUrl: '',
  operationPersonnels: [],
  planningPersonnels: [],
  cameraCrews: [],
  latePersonnels: [],
  designers: [],
  conclusionType: '',
  conclusion: '',
  url: ''
}) as any
const form = ref({
  clickRateSeven: '',
  clickConversionRateSeven: '',
  clickRateFifteen: '',
  clickConversionRateFifteen: '',
  conclusion: '',
  conclusionType: '',
  // 添加新字段
  demandSide: '',
  operationPersonnel: '',
  planningPersonnel: '',
  cameraCrew: '',
  latePersonnel: '',
  designer: '',
  operationPersonnels: [],
  planningPersonnels: [],
  cameraCrews: [],
  latePersonnels: [],
  designers: [],
  mappingPurpose: '',
  // 其他字段保持不变
  imageList: [],
  dataImages2: [],
  dataImages: [],
  imageName: ''
}) as any

const promotionImageNameOptions = computed(() => getIntDictOptions('promotion_image_name'))

// 导入左按钮图片
import leftButtonNormal from '@/assets/imgs/web/leftButton.png'
import leftButtonHover from '@/assets/imgs/web/leftButton2.png'

// 导入右按钮图片
import rightButtonNormal from '@/assets/imgs/web/rightButton.png'
import rightButtonHover from '@/assets/imgs/web/rightButton2.png'

// 添加人员查询方法
const personList = ref([])
const personalRequest = ref(false)
const remoteMethod = async () => {
  if (personalRequest.value) {
    return []
  }
  if (personList.value && personList.value.length > 0) {
    return personList.value
  }
  personalRequest.value = true
  const data = await PersonRosterApi.getPersonRosterAvatarOriginList({
    status: '2'
  }).catch(() => {
    personalRequest.value = false
  })
  personList.value = data || []
  personalRequest.value = false
  return personList.value
}

// 添加人员选择回调
const selectPeopleChange = (field: string) => {
  const codeList = form.value[`${field}s`]
  if (codeList && codeList.length > 0) {
    const userIds = codeList.map((item) => item.userId).filter((id) => id) || []
    form.value[`${field}`] = userIds.join(',')
  } else {
    form.value[`${field}`] = ''
  }
}

// 定义响应式数据
const leftButtonImg = ref({
  normal: leftButtonNormal, // 导入的图片模块
  hover: leftButtonHover,
  current: leftButtonNormal // 默认显示正常图片
})

const rightButtonImg = ref({
  normal: rightButtonNormal,
  hover: rightButtonHover,
  current: rightButtonNormal
})
// 左按钮鼠标状态处理（不影响原有 click 事件）
const handleLeftHover = (isHover: boolean) => {
  leftButtonImg.value.current = isHover ? leftButtonImg.value.hover : leftButtonImg.value.normal
}

// 右按钮鼠标状态处理（不影响原有 click 事件）
const handleRightHover = (isHover: boolean) => {
  rightButtonImg.value.current = isHover ? rightButtonImg.value.hover : rightButtonImg.value.normal
}

const closeDialog3 = () => {
  form.value = {
    clickRateSeven: '',
    clickConversionRateSeven: '',
    clickRateFifteen: '',
    clickConversionRateFifteen: '',
    conclusion: '',
    conclusionType: '',
    imageName: ''
  }
  isVisible3.value = false
}
const currentGoodsId = ref('') // 商品ID
const open = async (goodsId: string) => {
  detailDatas.value = []
  isVisible.value = true
  showImgList.value = []
  currentGoodsId.value = goodsId
  const data = await GalleryApi.getDetailPage({ goodsId: currentGoodsId.value })
  mainImgData.value = data.masterImageInfo
  groupedList.value = groupPromotionImageList(data.promotionImageList)
  reset()
}
const message = useMessage() // 消息弹窗

const loadingFalse = () => {
  loading.value = false
}
const loadingtrue = () => {
  loading.value = true
}

const handleSync = () => {
  console.log('handleSync')
  openSyncDialog({
    title: '车图同步',
    content: () => SyncImgDialog,
    bodyStyle: { padding: 0 },
    top: '1vh',
    width: 1400,
    props: {
      isSync: true,
      goodsId: mainImgData.value.goodsId
    },
    onSuccess: () => {
      // 车图同步完成后刷新数据
      handleUpdateSuccess()
    }
  })
}

const filterTime = (date) => {
  if (!date) {
    return ''
  }
  // 创建 Date 对象
  const dateObj = new Date(date)
  // 检查是否为有效的日期
  if (isNaN(dateObj.getTime())) {
    return ''
  }
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const groupPromotionImageList = (list: any[] = []) => {
  if (!Array.isArray(list)) return []
  const groupMap = new Map<string, { mappingTime: string; list: any[] }>()
  list.forEach((item) => {
    if (!item) return
    const key = item.mappingTime || ''
    if (!groupMap.has(key)) {
      groupMap.set(key, { mappingTime: item.mappingTime || '', list: [] })
    }
    const group = groupMap.get(key)
    if (group) {
      group.list.push(item)
    }
  })
  return Array.from(groupMap.entries()).map(([key, value], index) => ({
    ...value,
    id: key || `promotion-group-${index}`,
    collapsed: index !== 0 // 第一个组默认展开，其他默认收起
  }))
}

const reset = () => {
  currentId.value = ''
}

const emit = defineEmits(['cancle', 'success', 'close'])

const close = () => {
  reset()
  isVisible.value = false
  emit('success')
}

const onClose = () => {
  reset()
  isVisible.value = false
}

const handlePicClick = ({ url, item, isAuto }) => {
  console.log(url, item, 'handlePicClick')
  openDialog(url, item, isAuto)
}

// 更新数据
const handleUpdateSuccess = async () => {
  const data = await GalleryApi.getDetailPage({ goodsId: currentGoodsId.value })
  mainImgData.value = data.masterImageInfo
  groupedList.value = groupPromotionImageList(data.promotionImageList)
  reset()
}

const currentIsVisible2Auto = ref(false) // 当前是否为自动抓取的图片
const openDialog = (item, x, isAuto) => {
  // 查找点击图片在数组中的索引
  currentIsVisible2Auto.value = isAuto
  const index = isAuto
    ? [x.imageUrl].indexOf(item)
    : x.dataList.map((item) => item.imageUrl).indexOf(item)
  dialog2Data.value = {
    ...x,
    currentIndex: index, // 添加当前索引
    url: item,
    imageList: isAuto ? [x.imageUrl] : x.dataList.map((item) => item.imageUrl)
  }
  if (dialog2Data.value.dataImages) {
    dialog2Data.value.dataImages2 = dialog2Data.value.dataImages.split(',').map((v) => {
      const [url, queryString] = v.split('?')

      // 使用 URLSearchParams 精准获取参数值
      const params = new URLSearchParams(queryString)
      const name = params.get('name') || ''

      return {
        url,
        name
      }
    })
  }
  isVisible2.value = true
}
const prevImage = () => {
  if (dialog2Data.value.currentIndex > 0) {
    dialog2Data.value.currentIndex--
    dialog2Data.value.url = dialog2Data.value.imageList[dialog2Data.value.currentIndex]
  }
}

const nextImage = () => {
  const maxIndex = dialog2Data.value?.imageList?.length - 1
  if (dialog2Data.value.currentIndex < maxIndex) {
    dialog2Data.value.currentIndex++
    dialog2Data.value.url = dialog2Data.value.imageList[dialog2Data.value.currentIndex]
  }
}
// 编辑回显
const openDialog3 = () => {
  form.value = {
    // 保留原有字段
    clickRateSeven: dialog2Data.value.clickRateSeven || '',
    clickConversionRateSeven: dialog2Data.value.clickConversionRateSeven || '',
    clickRateFifteen: dialog2Data.value.clickRateFifteen || '',
    clickConversionRateFifteen: dialog2Data.value.clickConversionRateFifteen || '',
    sevenClick: dialog2Data.value?.sevenClick || '',
    sevenAdPv: dialog2Data.value?.sevenAdPv || '',
    sevenDayDirectDealCount: dialog2Data.value?.sevenDayDirectDealCount || '',
    sevenDayDirectConversionRate: dialog2Data.value?.sevenDayDirectConversionRate || '',
    fifteenClick: dialog2Data.value?.fifteenClick || '',
    fifteenAdPv: dialog2Data.value?.fifteenAdPv || '',
    fifteenDayDirectDealCount: dialog2Data.value?.fifteenDayDirectDealCount || '',
    fifteenDayDirectConversionRate: dialog2Data.value?.fifteenDayDirectConversionRate || '',

    // 添加新字段回显
    demandSide: dialog2Data.value.demandSide || '',
    operationPersonnel: dialog2Data.value.operationPersonnel || '',
    planningPersonnel: dialog2Data.value.planningPersonnel || '',
    cameraCrew: dialog2Data.value.cameraCrew || '',
    latePersonnel: dialog2Data.value.latePersonnel || '',
    designer: dialog2Data.value.designer || '',
    operationPersonnels: dialog2Data.value.operationPersonnels || [],
    planningPersonnels: dialog2Data.value.planningPersonnels || [],
    cameraCrews: dialog2Data.value.cameraCrews || [],
    latePersonnels: dialog2Data.value.latePersonnels || [],
    designers: dialog2Data.value.designers || [],
    mappingPurpose: dialog2Data.value.mappingPurpose || '',

    conclusion: dialog2Data.value.conclusion || '',
    conclusionType: dialog2Data.value.conclusionType || '',
    imageList: dialog2Data.value.imageList || [],
    dataImages2: dialog2Data.value.dataImages2 || [],
    dataImages: dialog2Data.value.dataImages || '',
    imageName: dialog2Data.value.imageName || ''
  }
  isVisible3.value = true

  console.log(currentIsVisible2Auto.value, '2222')
}

// 创建表单引用
const formRef = ref()

// 修改提交函数
const submit = async () => {
  // console.log(formRef.value, 'formRef.value', form.value)
  if (!formRef.value) return

  try {
    // 先验证表单
    await formRef.value.validate()

    loading.value = true
    // let dataImages = ''
    // if (form.value.dataImages2.length) {
    //   dataImages = form.value.dataImages2
    //     .map((v) => {
    //       return `${v.url}?name=${v.name}`
    //     })
    //     .join(',')
    // }
    let imageList = form.value.imageList.map((item) => {
      return { fileUrl: item }
    })
    const params = {
      ...dialog2Data.value,
      ...form.value,
      imageList: imageList,
      dataImages: form.value.dataImages
    }

    if (!params.conclusionType) {
      params.conclusionType = null
    }

    await GalleryApi.updateGoodsPromotionImage(params)
    message.success('成功')
    isVisible3.value = false
    isVisible2.value = false
    getList()
    open(params.goodsId)
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

const accessLineChartRef = ref()
// 折线图展示
const openZheXian = (id) => {
  // console.log(id,'id');
  accessLineChartRef.value.open(id)
}

// 商品链接跳转
const clickGoodCard = (channel, goodsId) => {
  getUrlByTypeAndId(channel || 'TaoBao', goodsId)
}

// 注入 getList 方法
const getList = inject('getList') as any

defineExpose({ open, close })

// 添加表单验证规则
const rules = ref({
  demandSide: [{ required: true, message: '请输入需求方', trigger: 'blur' }],
  mappingPurpose: [{ required: true, message: '请输入测图目的', trigger: 'blur' }],
  operationPersonnel: [{ required: true, message: '请选择运营人员', trigger: 'blur' }],
  planningPersonnel: [{ required: true, message: '请选择策划人员', trigger: 'blur' }],
  designer: [{ required: true, message: '请选择设计人员', trigger: 'blur' }]
})

// 获取dataList中最大的createdAt时间
const getMaxCreatedTime = (item) => {
  if (!item.dataList || !Array.isArray(item.dataList) || item.dataList.length === 0) {
    return item.createdAt || ''
  }

  // 找到最大的createdAt时间 (格式: yyyy-mm-dd hh:mm:ss)
  const maxTime = item.dataList.reduce((max, current) => {
    if (!current.createdAt) return max
    if (!max) return current.createdAt

    // 将时间字符串转换为Date对象进行比较
    const currentDate = new Date(current.createdAt)
    const maxDate = new Date(max)

    // 如果日期无效，保持原值
    if (isNaN(currentDate.getTime())) return max
    if (isNaN(maxDate.getTime())) return current.createdAt

    return currentDate > maxDate ? current.createdAt : max
  }, '')

  return maxTime || item.createdAt || ''
}

/**
 * 处理文件预览
 * 如果是文档类型，则打开微软在线文档预览
 * 否则打开文件下载链接
 * @param {Object} param0 文件名和url
 * @param {string} param0.name 文件名
 * @param {string} param0.url 文件url
 */
function handleFile({ name, url }: { name: string; url: string }) {
  if (isPPT(name) || isExcel(name) || isWord(name)) {
    window.open(microsoftOnlinePreviewUrl(url), '_blank')
  } else {
    window.open(url, '_blank')
  }
}

// const imageRefs = ref([])

// function setImageRef(el, index) {
//   if (el) imageRefs.value[index] = el
// }

// function previewImage(imgIndex) {
//   if (imgIndex !== -1) {
//     // 只在图片类型时调用
//     imageRefs.value.find((img, i) => i === imgIndex)?.showViewer?.()
//   }
// }

// 只保留图片类型的url
const imageUrls = computed(() =>
  dialog2Data.value.dataImages2
    ? dialog2Data.value.dataImages2.filter((i) => isImage(i.name || i.url)).map((i) => i.url)
    : []
)
</script>

<style lang="scss" scoped>
.mainContainer {
  .header {
    font-weight: 500;
    font-size: 0.833333vw;
    color: 333333;
    line-height: 1.145833vw;
    border-bottom: 0.052083vw solid #f0f0f0;
    padding-left: 1.25vw;
    padding-bottom: 0.729167vw;

    &-icon {
      width: 1.041667vw;
      height: 1.041667vw;
      margin-left: 0.3125vw;
      margin-right: 0.885417vw;
    }

    &-name {
      font-weight: 600;
      padding-right: 0.9375vw;
      max-width: calc(83vh - 11.458333vw);
    }

    &-mainImg {
      width: 2.083333vw;
      height: 1.145833vw;
      background: url('@/assets/imgs/web/MainPicBackground.png');
      background-size: 100% 100%;
      font-weight: 500;
      font-size: 0.625vw;
      color: #ffffff;
      line-height: 1.145833vw;
      text-align: center;
    }

    &-promotionImg {
      width: 3.020833vw;
      height: 1.302083vw;
      background: #3e5d3e;
      border-radius: 0.416667vw 0vw 0.416667vw 0vw;
      font-weight: 500;
      font-size: 0.625vw;
      color: #99ff9a;
      line-height: 1.302083vw;
      text-align: center;
    }
  }

  &-coverBg {
    display: inline-block;
    position: relative;
    margin-top: 0.729167vw;
    margin-left: 1.5625vw;
    margin-right: 1.302083vw;
    width: 23.776042vw;
    height: 21.666667vw;
    border-radius: 0.445313vw;
    background: #f7f8fc;
    margin-bottom: 0.520833vw;

    &-cover {
      width: 100%;
      height: 100%;
      border-radius: 0.3125vw;
      object-fit: contain;
    }

    &-arrowLeft {
      position: absolute;
      top: 30vh;
      width: 2.34375vw;
      height: 2.34375vw;
      left: 0.78125vw;
      cursor: pointer;
    }

    &-arrowRight {
      position: absolute;
      top: 30vh;
      right: 0.78125vw;
      width: 2.34375vw;
      height: 2.34375vw;
      cursor: pointer;
    }
  }

  &-close {
    position: absolute;
    top: 0.729167vw;
    right: 1.302083vw;
    width: 1.041667vw;
    height: 1.041667vw;
    cursor: pointer;
    z-index: 99;
  }

  &-line {
    position: absolute;
    left: 60.45vw;
    top: 0vw;
    bottom: 0vw;
    width: 0.052083vw;
    background: #4c5061;
  }
}

.main-box {
  font-family: PingFang SC;

  :deep(.el-dialog) {
    // margin-top: 0.3125vw;
    // margin-bottom: 1.041667vw;
    width: 80.73vw;
    // height: 45.3125vw;
    padding: 0.520833vw 0vw 0vw 0vw;
    border-radius: 0.520833vw;
    background: #fff;
    box-shadow:
      0vw 1 0.104167vw 0vw rgba(0, 0, 0, 0.5),
      0vw 1 0.104167vw 0vw rgba(0, 0, 0, 0.5);
  }

  .header-icon {
    margin-right: 1.145833vw;
  }

  .header-name {
    cursor: pointer;

    &:hover {
      color: #0064ff;
    }
  }
}

.main-box {
  :deep(.el-dialog__header) {
    display: none;
  }
}

.Idclass {
  margin-top: 0.520833vw;
  margin-left: 0.572917vw;
  width: 9.322917vw;
  min-height: 1.041667vw;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 500;
  font-size: 0.729167vw;
  color: #ffffff;
  line-height: 1.041667vw;
  text-align: left;
  font-style: normal;
  display: flex;
  /* 使用 flex 布局 */
  align-items: flex-start;
  /* 顶部对齐 */
}

.tuiID {
  width: 2.96875vw;
  height: 1.041667vw;
  display: inline-block;
  text-align: left;
  vertical-align: top;
  /* 顶部对齐 */
}

.tuiIdnumber {
  display: inline-block;
  width: 5.78125vw;
  word-break: keep-all;
  vertical-align: top;
  /* 顶部对齐 */
}

.timeBox {
  margin-top: 0.416667vw;
  display: flex;

  .timeBox-timeBox {
    margin-left: 0.520833vw;
    margin-right: 2.083333vw;
    width: 2.5vw;
    height: 0.885417vw;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 0.625vw;
    color: #ffffff;
  }

  > img {
    margin-top: 0.364583vw;
    width: 0.416667vw;
    height: 0.416667vw;
    margin-right: 0.416667vw;
  }

  .time-nubmer {
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 0.625vw;
    color: #dadada;
  }
}

.xuqiufang {
  display: flex;
  margin-top: 0.416667vw;

  .xuqiufang-box {
    margin-left: 0.520833vw;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 0.625vw;
    color: #ffffff;
    line-height: 0.885417vw;
    font-style: normal;
  }

  .xuqiufang-text {
    margin-right: 0.520833vw;
    flex: 1;
    text-align: right;
    font-style: normal;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 0.625vw;
    color: #ffffff;
  }
}

.box-pic:nth-child(2n-1) {
  margin-left: 2.604167vw;
  margin-right: 2.604167vw;
}

.tuiMessage {
  margin-top: 0.885417vw;
  margin-right: 0.78125vw;
  margin-bottom: 0.677083vw;

  .messageBox-first {
    display: inline-block;
    margin-top: 0.989583vw;
    margin-left: 1.302083vw;
    margin-right: 0.625vw;
    width: 4.166667vw;
    height: 1.458333vw;
  }
}

.messageBox-center {
  margin-top: 1.041667vw;
  display: flex;
  vertical-align: top;
  /* 顶部对齐 */
  min-height: 1.041667vw;
}

.messageBox-center2 {
  padding-left: 1.302083vw;
  margin-top: 1.041667vw;
  display: flex;
  vertical-align: top;
  /* 顶部对齐 */
  min-height: 1.041667vw;
}

.messageBox-center-left {
  margin-left: 1.302083vw;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 0.729167vw;
  color: #dadada;
  line-height: 1.041667vw;
  text-align: left;
  font-style: normal;
  display: inline-block;
  margin-right: 5.520833vw;
  vertical-align: top;
  /* 顶部对齐 */
}

.messageBox2-center-left {
  vertical-align: top;
  /* 顶部对齐 */
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 500;
  font-size: 0.729167vw;
  color: #ffffff;
  font-style: normal;
  flex: 1;
}

.messageBox-center-right {
  display: inline-block;
  flex: 1;
  vertical-align: top;
  /* 顶部对齐 */
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 0.729167vw;
  color: #dadada;
  line-height: 1.041667vw;
  font-style: normal;
}

.messageBox2-center-right {
  flex: 1;
  vertical-align: top;
  /* 顶部对齐 */
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 500;
  font-size: 0.729167vw;
  color: #ffffff;
  font-style: normal;
}

.fly {
  display: inline-block;
  width: 0.885417vw;
  height: 0.833333vw;
}

.right {
  margin-top: 0.625vw;
  margin-left: 1.5625vw;
  margin-bottom: 16px;

  .rightMessage {
    width: 23.802083vw;
    height: 5.833333vw;
    border-radius: 0.208333vw;
    background: #f7f8fc;

    .rightMessageText {
      height: 2.083333vw;
      line-height: 2.083333vw;
      display: flex;
      color: #333333;
      font-family: PingFang SC;
      font-size: 0.729167vw;
      font-weight: 500;
      align-content: center;
      place-items: center;

      .rightMessagePng {
        margin-left: 0.729167vw;
        margin-right: 0.520833vw;
        width: 0.729167vw;
        height: 0.736458vw;
      }
    }
  }
}

.basicInfo {
  &-icon {
    margin-left: 0.520833vw;
    width: 0.3125vw;
    height: 0.729167vw;
  }
}

.tuijiantuBox {
  // margin-right: 16px;

  .promotion-group {
    margin-bottom: 16px;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;

    &:last-child {
      margin-bottom: 0;
    }

    .promotion-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f0f6ff;
      padding: 14px 16px;
      user-select: none;
    }

    &__title {
      font-weight: 600;
      font-size: 0.833333vw;
      color: #333333;
    }

    .promotion-toggle {
      font-size: 14px;
      color: #3a7cff;
      display: inline-flex;
      align-items: center;
      column-gap: 4px;
    }

    &__content {
      padding: 16px;
      background: #f7f8fc;
    }

    &__item {
      margin-bottom: 18px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .tuijiantuBox_top {
    margin-right: 1.041667vw;
    padding-left: 0.833333vw;
    height: 2.604167vw;
    line-height: 2.604167vw;
    display: flex;
    border-radius: 0.208333vw 0.208333vw 0vw 0vw;
    background: #f0f6ff;
    box-sizing: border-box;
    border: 0.052083vw solid #ecf0fc;
  }

  .tuijiantuBox_top_banben {
    margin-right: 1.510417vw;
    width: 7.65625vw;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 600;
    font-size: 1.041667vw;
    color: #cadaff;
    text-align: left;
    font-style: normal;
    color: #333333;
  }

  .tuijiantuBox_top_time {
    margin-top: 0.520833vw;
    margin-right: 0.520833vw;
    width: 0.625vw;
    height: 1.458333vw;
    line-height: 1.458333vw;

    img {
      width: 0.625vw;
      height: 0.625vw;
      vertical-align: middle;
    }
  }

  .tuijiantuBox_top_banbenTime {
    margin-right: 0.833333vw;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 0.833333vw;
    color: #666;
    text-align: left;
    font-style: normal;
  }

  .tuijiantuBox_top_banbenTimeText {
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 0.833333vw;
    color: #666;
    text-align: left;
    font-style: normal;
  }

  .banKuai {
    margin-bottom: 1.041667vw;
    display: flex;
  }
}

.dialog2 {
  :deep(.el-dialog__header) {
    display: none;
  }
}

.dialog2 {
  :deep(.el-dialog) {
    padding: 0;
    width: 70.3125vw;
    // height: 42.177083vw;
    padding-bottom: 20px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0vw 0.104167vw 0.208333vw 0vw rgba(0, 0, 0, 0.5);
    border-radius: 0.9375vw;
    margin-top: 1.354167vw;
    padding-right: 1.1vw;
    box-sizing: border-box;
  }
}

.dialog2 {
  .dialog2_close {
    position: absolute;
    top: 0.833333vw;
    right: 0.833333vw;
    cursor: pointer;

    img {
      width: 0.9375vw;
      height: 0.9375vw;
    }
  }

  .topZhanWei {
    width: 35.104167vw;
    height: 2.8125vw;
    border-bottom: 0.052083vw solid #f0f0f0;
    margin-bottom: 0.520833vw;
  }

  .dialog2-top {
    display: flex;
    margin-bottom: 0.833333vw;

    .dialog2-top-left {
      margin-left: 1.5625vw;
      margin-right: 1.458333vw;
      width: 10.9375vw;
      height: 11.458333vw;
      background: #f7f8fc;
      border-radius: 0.520833vw;
      position: relative;

      .Urlimg {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .dialog2-top-right {
      flex: 1;
      // height: 10.9375vw;
      border-radius: 0.416667vw;

      .dialog2-top-right-title {
        display: flex;
        padding-left: 1.5625vw;
        height: 1.658854vw;
        line-height: 1.658854vw;
        background: #f8f9fc;
        border-radius: 0.416667vw 0.416667vw 0vw 0vw;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 500;
        font-size: 0.729167vw;
        color: #3d3d3d;
        font-style: normal;
        place-items: center;
      }

      .dialog2-top-right-list {
        display: flex;
        flex-direction: column;
      }

      .dialog2-top-right-item {
        display: flex;
        margin-bottom: 0.833333vw;
        height: 1.5625vw;
        line-height: 1.5625vw;

        .dialog2-right-line {
          margin-top: 0.78125vw;
          margin-right: 0.833333vw;
          width: 7.760417vw;
          height: 0.052083vw;
          border-top: 0.052083vw dashed #46507d;
          opacity: 0.69;
        }

        img {
          margin-left: 1.5625vw;
          margin-right: 0.729167vw;
          margin-top: 0.416667vw;
          width: 0.729167vw;
          height: 0.729167vw;
        }

        .dialog2-top-right-item-name {
          margin-right: 0.989583vw;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 400;
          font-size: 0.729167vw;
          color: #dadada;
          text-align: left;
          font-style: normal;
        }

        .dialog2-right-text {
          width: 4.166667vw;
          height: 100%;
          background: #c8c8cb;
          border-radius: 0.208333vw;
          border: 0.052083vw solid #dbe0e0;
          text-align: center;
        }

        .dialog2-right-text2 {
          width: 4.166667vw;
          height: 100%;
          background: #afd1b5;
          border-radius: 0.208333vw;
          border: 0.052083vw solid #dbe0e0;
          text-align: center;
        }

        .dialog2-right-text3 {
          width: 4.166667vw;
          height: 100%;
          background: #fbeada;
          border-radius: 0.208333vw;
          border: 0.052083vw solid #dbe0e0;
          text-align: center;
        }

        .dialog2-right-text4 {
          width: 4.166667vw;
          height: 100%;
          background: #bfe9f2;
          border-radius: 0.208333vw;
          border: 0.052083vw solid #dbe0e0;
          text-align: center;
        }

        .dialog2-right-text5 {
          width: 4.166667vw;
          height: 100%;
          background: #c5dbfe;
          border-radius: 0.208333vw;
          border: 0.052083vw solid #dbe0e0;
          text-align: center;
        }
      }

      .dialog2-top-right-item:nth-child(1) {
        margin-top: 0.520833vw;
      }
    }
  }

  .dialog2-content {
    display: flex;

    .dialog2-content-left {
      margin-left: 1.5625vw;
      margin-right: 1vw;
      width: 10vw;
      padding: 0.520833vw;
      background-color: #f7f8fc;
      height: 15.3125vw;

      .dialog2-content-left-title {
        margin-bottom: 0.833333vw;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 500;
        font-size: 0.729167vw;
        color: #333333;
        text-align: left;
        font-style: normal;

        img {
          // margin-left: 0.729167vw;
          margin-top: 0.104167vw;
          margin-right: 0.520833vw;
          width: 0.729167vw;
          height: 0.643229vw;
        }
      }

      .dialog2-content-left-xuqiu {
        display: flex;
        // margin-bottom: 1.25vw;
        flex-direction: column;

        .dialog2-content-left-xuqiu-text {
          margin-right: 1.041667vw;
          width: 5.416667vw;
          height: 1.666667vw;
          line-height: 1.666667vw;
          // text-align: center;
          border-radius: 0.208333vw;
          color: #666666;
        }

        .dialog2-content-left-xuqiu-value {
          flex: 1;
          text-align: left;
          line-height: 1.666667vw;
          color: #333;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 600;
          font-size: 0.729167vw;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          background-color: #ffffff;
        }

        .cetumudi {
          // height: 200px;
          white-space: normal;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          // -webkit-line-clamp: 5;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: normal;
        }
      }
    }

    .dialog2-content-right {
      margin-top: -30px;
      flex: 1 0 auto;
      width: 0;

      .dialog2-content-right-top {
        position: relative;
        height: 2.291667vw;
        display: flex;
        vertical-align: middle;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 400;
        font-size: 0.729167vw;
        text-align: left;
        font-style: normal;
        line-height: 2.291667vw;
        border-radius: 0.208333vw 0.208333vw 0vw 0vw;
        background: #f7f8fc;
        color: #333333;

        img {
          margin-left: 0.833333vw;
          margin-right: 0.208333vw;
          width: 0.625vw;
          height: 0.625vw;
          vertical-align: middle;
        }

        .dialog2-content-right-top-value {
          margin-left: 1.041667vw;
          color: #ffffff;
        }
      }

      .dialog2-content-right-content {
        // height: 15.520833vw;
        border-radius: 0vw 0vw 0.208333vw 0.208333vw;
        box-sizing: border-box;
        border: 0.052083vw solid #ecf0fc;
        padding-bottom: 10px;
        box-sizing: border-box;

        .dialog2-content-right-content-header {
          height: 0.729167vw;
        }

        .dialog2-content-right-content-top {
          margin-left: 0.833333vw;
          margin-bottom: 0.677083vw;
          width: 4.479167vw;
          height: 1.666667vw;
          border-radius: 0.885417vw;
          border: 0.052083vw solid #494975;
          line-height: 1.666667vw;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 400;
          font-size: 0.729167vw;
          color: #ffffff;
          text-align: left;
          font-style: normal;
          vertical-align: middle;
          cursor: pointer;

          img {
            vertical-align: middle;
            margin-right: 0.625vw;
            margin-left: 0.729167vw;
            width: 0.729167vw;
            height: 0.729167vw;
          }
        }

        .dialog2-content-right-content-footer-text {
          margin-left: 0.833333vw;
          margin-top: 0.625vw;
          padding-top: 8px;
          padding-left: 0.9375vw;
          padding-right: 0.833333vw;
          padding-bottom: 8px;
          height: 40px;
          margin-right: 30px;
          background: #f0f6ff;
          border-radius: 4px;
          overflow-y: hidden;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 400;
          font-size: 0.729167vw;
          color: #333333;
          overflow-y: auto;
        }
      }
    }
  }

  .dialog2-footerImgs {
    margin: 0.416667vw 0 0vw 1.5625vw;

    .dialog2-footerImgs-Title {
      display: flex;
      height: 2.135417vw;
      border-radius: 0.208333vw 0.208333vw 0vw 0vw;
      background: #f8f9fc;
      font-family: PingFang SC;
      font-size: 0.729167vw;
      font-weight: 600;
      line-height: normal;
      letter-spacing: normal;
      color: #333;
      align-items: center;

      .TitleImg {
        margin-left: 0.729167vw;
        margin-right: 0.572917vw;
        width: 0.729167vw;
        height: 0.729167vw;
      }
    }

    .imgsUrl {
      // width: 31.770833vw;
      // height: 6.458333vw;
      padding: 10px;
      border-radius: 0vw 0vw 0.208333vw 0.208333vw;
      box-sizing: border-box;
      border: 0.052083vw solid #ecf0fc;
      gap: 10px;
      display: flex;
      overflow: hidden;
      overflow-x: scroll;

      .imgsUrlBox {
        // width: 100px;
        // height: 110px;
        // margin: 0.729167vw 0.3125vw 0vw 0.3125vw;
      }

      .imgsUrlBox:nth-child(0) {
        // margin: 14x 0.3125vw 0vw 0.729167vw;
      }
    }

    .imgsUrl2 {
      height: 6.458333vw;
      border-radius: 0vw 0vw 0.208333vw 0.208333vw;
      border: 0.052083vw solid #ecf0fc;

      img {
        margin-top: 1.041667vw;
      }

      .nodata {
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: 3px;
        color: #9b9999;
      }
    }
  }
}

.dialog2-content-right-content-footer-top {
  height: 2.083333vw;
  line-height: 2.083333vw;
  display: flex;
  padding-left: 0.833333vw;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 0.729167vw;
  color: #dadada;
  font-style: normal;

  img {
    margin-top: 0.729167vw;
    margin-left: 0.833333vw;
    margin-right: 0.520833vw;
    width: 0.677083vw;
    height: 0.677083vw;
  }
}

.dialog3 {
  :deep(.el-dialog__header) {
    display: none;
  }
}

.dialog3 {
  :deep(.el-dialog) {
    // margin: 6.94vh auto;
    // margin-top: 70px;
    width: 64.854167vw;
    // height: 752.000006px;
    padding: 0;
    background: #fff;
    box-shadow: 0vw 0.104167vw 0.208333vw 0vw rgba(0, 0, 0, 0.5);
    border-radius: 0.416667vw;
  }
}

.dialog3 {
  // width: 100vw;
  // height: 100vh;

  .dialog3-zhan {
    height: 1.041667vw;
  }

  .dialog3-top {
    display: flex;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 500;
    font-size: 0.729167vw;
    color: #333;
    border-bottom: 0.052083vw solid #f0f0f0;
    padding-bottom: 0.833333vw;
    padding-left: 1.041667vw;

    img {
      margin-top: 0.15625vw;
      margin-left: 1.041667vw;
      margin-right: 0.833333vw;
      width: 0.729167vw;
      height: 0.729167vw;
    }
  }

  .dialog3-content {
    margin-left: 1.041667vw;
    margin-top: 1.041667vw;
    border-radius: 0.729167vw;
    padding-right: 20px;
    box-sizing: border-box;
  }

  .dialog3-imgsText {
    font-size: 0.729167vw;
    font-weight: normal;
    margin-left: 1.041667vw;
    text-align: right;
    margin-right: 10px;
    letter-spacing: normal;
    color: #666666;
  }

  .dialog3-imgs {
    // height: 17.708333vw;
    overflow: hidden;
    overflow-y: scroll;
  }
}

.dialog3 {
  :deep(.el-form) {
    // display: flex;
    // flex-wrap: wrap;
    // justify-content: space-around;
  }
}

.dialog3 {
  :deep(.el-form-item__label) {
    width: 5.208333vw;
    font-family: AlibabaPuHuiTi_2_55_Regular;
    font-size: 0.729167vw;
    color: #666;
  }
}

.dialog3 {
  .input-container2 {
    display: flex;
    align-items: center;
    gap: 0.208333vw;
    width: 250px;
    /* 控制输入框与%的间距 */
  }

  .percent-symbol {
    color: #666;
    /* 按需调整颜色 */
    font-size: inherit;
  }
}

.dialog3 {
  :deep(.el-input__inner) {
    width: 120px;
    // background: #14171c;
  }
}

// .dialog3 {
//   :deep(.el-input__wrapper) {
//     // background: #14171c;
//   }
// }
.dialog3 {
  :deep(.el-select__wrapper) {
    // width: 14.240833vw;
    // background: #14171c;
  }
}

.dialog3 {
  :deep(.el-textarea__inner) {
    // width: 34.533333vw;
    // height: 4.791667vw;
    // background: #14171c;
    border-radius: 0.208333vw;
    color: #333;
    // border: none;
    // box-shadow: none;
  }
}

.dialog3-footer {
  width: 100%;
  // height: 3.645833vw;
  display: flex;
  padding-bottom: 0.833333vw;
  display: flex;
  flex-direction: row;
  justify-content: center;

  .dialog3-footer-close {
    // margin-top: 1.041667vw;
    margin-top: 0.520833vw;
    // margin-left: 34.375vw;
    margin-right: 1.354167vw;
    width: 3.541667vw;
    height: 1.666667vw;
    line-height: 1.666667vw;
    text-align: center;
    font-family: AlibabaPuHuiTi_2_55_Regular;
    font-size: 0.625vw;
    color: #333;
    background: #fff;
    border-radius: 0.208333vw;
    cursor: pointer;
    border: 0.052083vw solid #e5e5e5;
  }

  .dialog3-footer-submit {
    // margin-top: 1.041667vw;
    margin-top: 0.520833vw;
    width: 3.541667vw;
    height: 1.666667vw;
    line-height: 1.666667vw;
    text-align: center;
    font-family: AlibabaPuHuiTi_2_55_Regular;
    font-size: 0.625vw;
    color: #ffffff;
    border-radius: 0.208333vw;
    cursor: pointer;
    background: #0064ff;
  }
}

/* Chrome、Safari、Edge 等 WebKit 内核浏览器 */
::-webkit-scrollbar {
  width: 0.3125vw;
  /* 滚动条整体宽度，可根据需求调整 */
}

::-webkit-scrollbar-track {
  background: transparent;
  /* 隐藏滚动条轨道 */
}

::-webkit-scrollbar-thumb {
  background: #d1d9e5;
  /* 滚动条滑块颜色 */
  border-radius: 0.15625vw;
  /* 滑块圆角，让滚动条更圆润 */
}

.message-list-line {
  margin-top: 0.520833vw;
  margin-bottom: 0.520833vw;
  width: 28.177083vw;
  height: 0.052083vw;
  border-top: 0.052083vw solid #4c5061;
  opacity: 0.4;
}

.zhexiantu {
  width: 6.145833vw;
  padding-left: 0.520833vw;
  height: 2.5vw;
  background: #090b15;
  border-radius: 0.3125vw;
  border: 0.052083vw solid #444b63;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 500;
  font-size: 0.729167vw;
  color: #ffffff;
  line-height: 1.041667vw;
  text-align: left;
  font-style: normal;
  line-height: 2.5vw;
  cursor: pointer;

  img {
    margin-left: 0.260417vw;
    width: 0.729167vw;
    height: 0.625vw;
    vertical-align: middle;
  }
}

.zhexiantu:hover {
  background: #090b15;
  border-radius: 0.3125vw;
  border: 0.052083vw solid #3965ff;
}

.dialog2-content-right-line {
  margin-left: 1.041667vw;
  margin-top: 0.729167vw;
  margin-bottom: 0.416667vw;
  width: 18.072917vw;
  height: 0.052083vw;
}

.dialog2-content-right-update {
  display: flex;
  margin-bottom: 0.833333vw;

  .name {
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 0.729167vw;
    color: #666;
    text-align: left;
    font-style: normal;
  }

  .nameValue {
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 0.729167vw;
    text-align: left;
    font-style: normal;
    color: #333333;
  }
}

.jiezhiText {
  margin-left: 15.364583vw;
  margin-right: 0.833333vw;
  font-size: 0.833333vw;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  color: #6365ff;
  text-align: left;
  font-style: normal;
}

.jiezhiTextValue {
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 0.833333vw;
  color: #6365ff;
  text-align: left;
  font-style: normal;
}

.mainContainer-coverBg-imgs {
  display: flex;
  width: 23.802083vw;
  height: 2.708333vw;
  border-radius: 0.208333vw;
  background: #f7f8fc;
  margin: 0vw 0vw 0vw 1.5625vw;
  align-items: center;

  /* 垂直居中（交叉轴方向） */
  .zhexianatux {
    margin-left: 0.833333vw;
    width: 1.770833vw;
    height: 1.742708vw;
  }

  .zhexianatuxValue {
    margin-left: 0.520833vw;
    font-family: PingFang SC;
    font-size: 0.729167vw;
    font-weight: 500;
    letter-spacing: normal;
    color: #333333;
  }

  .zhexianatuxButton {
    margin-left: 12.291667vw;
    width: 3.125vw;
    height: 1.666667vw;
    border-radius: 0.104167vw;
    line-height: 1.666667vw;
    /* 主题色/主色 */
    background: #0064ff;
    color: #fff;
    text-align: center;
    cursor: pointer;
  }
}

.rightMessageTop {
  margin: 0 0.520833vw;
  padding: 0.520833vw;
  display: flex;
  font-family: PingFang SC;
  font-size: 0.729167vw;
  font-weight: normal;
  letter-spacing: normal;
  color: #666666;
  background: #ffffff;
  // height: 1.302083vw;
  justify-content: space-between;

  // justify-content: space-be;
  & > div {
    flex: 1 0 auto;
    flex-shrink: 0;
    width: 0;
  }

  .right-message-top-item {
    margin-top: 6px;
    font-weight: 600;
    color: #333;
  }
}

.textValue {
  // display: flex;
  // align-items: center;
  white-space: nowrap;
  /* 禁止换行 */
  overflow: hidden;
  /* 溢出内容隐藏 */
  text-overflow: ellipsis;
  /* 溢出内容显示省略号 */
}

.textValue2 {
  display: flex;
  align-items: center;
}

.rightMessageValue {
  padding: 0vw 0vw 0.520833vw 0vw;
  margin: 0vw 0.520833vw;
  display: flex;
  font-family: PingFang SC;
  font-size: 0.729167vw;
  font-weight: 500;
  letter-spacing: normal;
  color: #333333;
  background: #ffffff;
}

.rightMessageBottom {
  width: 23.802083vw;
  height: 9.635417vw;
  border-radius: 0.208333vw;
  background: #f7f8fc;

  .rightMessageBottomTop {
    display: flex;
    height: 1.041667vw;
    place-items: center;
    margin-bottom: 0.520833vw;

    .blueTimePng {
      margin: 0vw 0.520833vw 0vw 0.729167vw;
      width: 0.729167vw;
      height: 0.729167vw;
    }

    .rightMessageBottomTopText {
      margin-right: 11.458334vw;
      font-family: PingFang SC;
      font-size: 0.729167vw;
      font-weight: 500;
      letter-spacing: normal;
      color: #333333;
    }

    .rightMessageBottomTopValue {
      font-size: 0.729167vw;
      color: #666666;
    }
  }

  .rightMessageBottomCenter {
    margin: 0 0.729167vw;
    padding: 0 0.625vw;
    height: 7.083333vw;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .rightMessageBottomCenterTopText {
      margin-top: 0.520833vw;
      display: flex;
      color: #727e93;
      font-family: PingFang SC;
      font-size: 0.729167vw;
    }

    .rightMessageBottomCenterTopValue {
      margin-top: 0.520833vw;
      margin-bottom: 0.520833vw;
      display: flex;
      color: #333333;
      font-family: PingFang SC;
      font-size: 0.729167vw;
      font-weight: 500;
      align-items: center;
    }

    .rightMessageBottomCenterLine {
      border-bottom: 0.052083vw solid #f0f0f0;
    }
  }
}

.picBox {
  width: 8.166667vw;
  height: 9.652083vw;
  display: flex;
  margin-right: 0.729167vw;
  border-radius: 0.326562vw;
  background: #e7e8eb;
  overflow: hidden;
  /* 确保图片被裁剪为圆角 */
  margin-bottom: 0.520833vw;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 可选：确保图片填满容器且不变形 */
  }
}

.pic-list {
  width: 100%;
  margin-left: 0.833333vw;
  padding-bottom: 0.520833vw;
  display: flex;
  overflow-x: scroll;

  /* 新增横向滚动条样式 */
  &::-webkit-scrollbar {
    height: 0.15625vw;
    /* 横向滚动条高度（即视觉上的宽度），建议比纵向更细 */
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    /* 隐藏滚动条轨道 */
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d9e5;
    /* 滚动条滑块颜色 */
    border-radius: 0.15625vw;
    /* 滑块圆角 */
  }
}

.nameUser {
  width: 5.104167vw;
  height: 1.658854vw;
  line-height: 1.658854vw;
  color: #666666;
  font-family: PingFang SC;
  font-size: 0.729167vw;
  font-weight: normal;
  border-right: 0.052083vw solid #ebeef5;
  border-bottom: 0.052083vw solid #ebeef5;
  text-align: center;
}

.UserNameValue {
  padding-left: 2.604167vw;
  width: 100%;
  height: 1.658854vw;
  line-height: 1.658854vw;
  color: #333333;
  border-bottom: 0.052083vw solid #ebeef5;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bianjiButoon {
  width: 3.125vw;
  height: 1.666667vw;
  border-radius: 0.104167vw;
  /* 主题色/主色 */
  background: #0064ff;
  color: #fff;
  text-align: center;
  line-height: 1.666667vw;
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 1vw;
  transform: translateY(-50%);
}

.leftButton {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateX(-50%);
  transform: translateY(-50%);
  cursor: pointer;
}

.rightButton {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateX(50%);
  transform: translateY(-50%);
  cursor: pointer;
}

.conclusionTypeClass {
  flex: 1;
  margin-left: 1.25vw;
  margin-right: 1.041667vw;
  font-family: PingFang SC;
  font-size: 0.729167vw;
  font-weight: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #333333;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.content-main {
  // height: 83.15vh;
  height: 41.777083vw;
  margin-top: 0.729167vw;
  margin-right: 12px;
  padding-right: 4px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.header-title-content {
  .title-desc {
    font-size: 0.83vw;
    font-weight: 400;
    color: #333333;
    font-weight: bold;

    .title-header {
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 400;
      font-size: 0.733333vw;
      color: #666666;
      text-align: left;
      font-style: normal;
    }
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: center;
}

.form-item {
  align-items: center;
}

.mapping-time {
  margin-left: 0.729167vw;
}

/* 添加到现有样式中 */
.form-input {
  width: 250px !important;
  /* 统一所有输入框宽度 */
}

.dialog3 {
  :deep(.el-form-item__label) {
    // width: 120px !important;
    /* 统一所有标签宽度 */
    text-align: right;
    padding-right: 12px;
  }

  :deep(.el-input) {
    width: 100% !important;
    /* 让输入框填充容器 */
  }

  :deep(.el-input__inner) {
    width: 100% !important;
    /* 覆盖之前设置的120px宽度 */
  }

  :deep(.el-select) {
    width: 100% !important;
    /* 让下拉框与输入框宽度一致 */
  }
}

/* 对于textarea保持原有样式 */
.dialog3 {
  :deep(.el-form-item.is-textarea .el-textarea__inner) {
    width: 100% !important;
  }
}

.imgsUrl2 {
  height: 6.458333vw;
  border-radius: 0vw 0vw 0.208333vw 0.208333vw;
  border: 0.052083vw solid #ecf0fc;

  img {
    margin-top: 1.041667vw;
  }

  .nodata {
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 3px;
    color: #9b9999;
  }
}

.img-item {
  width: 100px;
  height: 100px;
}

.img-link {
  margin-top: 4px;
  font-size: 12px;
  line-height: normal;

  :deep(.el-link__inner) {
    word-break: break-all;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }
}
</style>
