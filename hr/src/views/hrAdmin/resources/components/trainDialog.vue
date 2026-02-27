<template>
  <div class="bigBox">
    <el-dialog v-model="dialogVisible" :before-close="handleClose" :show-close="false">
      <div class="dialog-content">
        <img
          src="@/assets/imgs/train/slices/close2x.png"
          alt=""
          class="close"
          @click="handleClose"
        />
        <img src="@/assets/imgs/train/slices/sevenDay2x.png" alt="" class="sevenDay" />
        <div class="boxZhanWei">
          <div class="boxZhanWeileftBox"
            ><img src="@/assets/imgs/train/slices/left2x.png" alt="" class="boxZhanWeileft"
          /></div>
          <div class="name"> {{ name }} </div>
          <div class="boxZhanWeileftBox">
            <img src="@/assets/imgs/train/slices/right2x.png" alt="" class="boxZhanWeiright" />
          </div>
        </div>
        <div class="pic">
          <div class="pic-bg">
            <div v-for="(item, index) in list" :key="index" class="picSon">
              <img :src="item.url" alt="" class="imgIndex" @click="imgFull(item.url)" />
            </div>
          </div>
        </div>
        <div class="beizhu">
          <img src="@/assets/imgs/train/slices/jiantou2x.png" alt="" class="jiantou" />
          <div class="jiantouText">备注</div>
          <div class="textArea">
            {{ textArea }}
          </div>
        </div>
      </div>
    </el-dialog>
    <div class="fullImgBox">
      <el-dialog v-model="dialogVisible2">
        <el-image-viewer
          :url-list="[dialogImageUrl]"
          hide-on-click
          modal
          close-on-press-escape
          @close="dialogVisible2 = false"
          :z-index="9999"
          class="imgviewer"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// 控制弹窗显示/隐藏
const dialogVisible = ref(false)
const dialogVisible2 = ref(false)
const dialogImageUrl = ref('')
const list = ref([])
const textArea = ref('')
// 关闭弹窗的逻辑
const handleClose = () => {
  list.value = []
  dialogVisible.value = false
}

const textAreaChange = (text) => {
  textArea.value = text
}
const openDialog = () => {
  dialogVisible.value = true
}
const handleImageError = () => {
  console.log('图片加载失败')
}
const imgFull = (url) => {
  dialogImageUrl.value = url
  dialogVisible2.value = true
  console.log('dialogImageUrl:', dialogImageUrl.value)
}
const name = ref('')
const nameChange = (text) => {
  name.value = text
}
const listChange = (arr) => {
  list.value = arr.split(',').map((item) => ({ url: item }))
  console.log(list.value, 'arr')
}
// 可以将方法暴露给父组件
defineExpose({
  openDialog,
  nameChange,
  listChange,
  textAreaChange
})
</script>

<style lang="scss" scoped>
.dialog-content {
  width: 600px;
  height: 688px;
  background-image: url('@/assets/imgs/train/slices/trainBackgroundImage.png');
  background-size: 100% 100%;
  border-radius: 15px;
}
.close {
  position: absolute;
  top: 13.965px;
  right: 13.3px;
  width: 19.95px;
  height: 19.95px;
  cursor: pointer;
  opacity: 0.6;
}
.sevenDay {
  position: absolute;
  top: 50.54px;
  left: 142.31px;
  width: 315.875px;
  height: 53.865px;
}
.boxZhanWei {
  height: 17.29px;
  padding-top: 113.05px;
  display: flex;
  margin-bottom: 13.3px;
}
.boxZhanWeileft {
  width: 122.36px;
  height: 1.33px;
  display: inline-block;
  margin-left: 138.985px;
}
.boxZhanWeiright {
  width: 122.36px;
  height: 1.33px;
  display: inline-block;
}
.name {
  display: inline-block;
  width: 30.59px;
  height: 17.29px;
  font-family: MicrosoftYaHei, MicrosoftYaHei;
  font-weight: bold;
  font-size: 13.3px;
  color: #1a65d8;
  line-height: 34.58px;
  text-align: left;
  font-style: normal;
  margin-right: 26.6px;
  margin-left: 19.95px;
  white-space: nowrap;
}

.pic {
  width: 573.23px;
  height: 397.67px;
  background: linear-gradient(308deg, #78befa 0%, #3d6cee 100%);
  border-radius: 19.95px;
  text-align: center;
  margin-left: 13.3px;
  overflow-x: auto;
}
.picSon {
  display: inline-block;
  width: 271.32px;
  height: 383.04px;
  margin-right: 13.3px;
  border-radius: 18.62px;
  overflow: hidden;
}
.picSon:nth-child(2n) {
  margin-right: 0px;
}
.imgIndex {
  width: 271.32px;
  height: 383.04px;
}

.beizhu {
  width: 569.24px;
  height: 106.4px;
  margin-left: 17.955px;
  margin-top: 10.64px;
  background: #ffffff;
  border-radius: 10px;
}

.jiantou {
  width: 7.98px;
  height: 13.3px;
  margin-top: 13.965px;
  margin-left: 13.3px;
  margin-right: 10.64px;
}

.jiantouText {
  height: 14.63px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 600;
  font-size: 12px;
  color: #333333;
  line-height: 14.63px;
  text-align: left;
  font-style: normal;
  display: inline-block;
  margin-top: 13.3px;
}
.textArea {
  width: 546.63px;
  height: 62.51px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #333333;
  line-height: 26.6px;
  text-align: left;
  font-style: normal;
  background: #f7faff;
  border-radius: 13.3px;
  margin-left: 11.305px;
  margin-top: 4.655px;
}

.boxZhanWeileftBox {
  display: inline-block;
  height: 26.6px;
}

.pic-bg {
  width: 573.23px;
  height: 391.02px;
  padding-top: 6.65px;
  background: linear-gradient(308deg, #78befa 0%, #3d6cee 100%);
  border-radius: 15px;
}
.bigBox {
  :deep(.el-dialog__header) {
    display: none;
  }
}
.bigBox {
  :deep(.el-dialog) {
    width: 600px;
    height: 688px;
    padding: 0;
    background-color: transparent;
  }
}
.bigBox {
  :deep(.el-dialog__body) {
    background-color: transparent;
    padding: 0 !important;
  }
}

.fullImgBox {
  :deep(.el-dialog) {
    // width: 10vw;
    width: 20vw;
    height: 30vw;
    padding: 0;
  }
}

.fullImgBox {
  :deep(.el-dialog__header) {
    display: none;
  }
}

.fullImgBox {
  .fullImg {
    width: 20vw;
    height: 30vw;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
