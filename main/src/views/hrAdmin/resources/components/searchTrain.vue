<template>
  <div class="bigBox">
    <el-dialog v-model="dialogVisible" :before-close="handleClose" :show-close="false">
      <div class="body">
        <img
          class="closeImg"
          src="@/assets/imgs/train/slices/closeRight.png"
          alt=""
          @click="handleClose"
        />
        <div class="skyBlue">
          {{ name }}
        </div>
        <img src="@/assets/imgs/train/slices/ruzhi2x.png" alt="" class="ruzhi" />
        <div class="box">
          <div class="sonbox">
            <div v-for="(item, index) in list" :key="index" class="son">
              <div style="display: flex">
                <img src="@/assets/imgs/train/slices/jiantou2x.png" alt="" class="jiantou" />
                <div class="sonTop">{{ item.test }}</div>
              </div>
              <div class="sonText">{{ item.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
const dialogVisible = ref(false)
const name = ref('')
const list1 = ref([])
const list2 = ref([])
const list = ref([])
const listChange = (obj) => {
  list1.value = Object.keys(obj)
  list2.value = Object.values(obj)
  for (let i = 0; i < list1.value.length; i++) {
    list.value.push({ test: list1.value[i], value: list2.value[i] }) //
  }
  console.log(list.value, 'list')
}

const handleClose = () => {
  dialogVisible.value = false
  list.value = []
}

const openDialog = () => {
  dialogVisible.value = true
}
const nameChange = (text) => {
  name.value = text
}
// 可以将方法暴露给父组件
defineExpose({
  openDialog,
  listChange,
  nameChange
})
</script>
<style lang="scss" scoped>
.body {
  position: relative;
  // width: 507.5px;
  // height: 491px;
  width: 700px;
  height: 707px;
  border-radius: 15px;
  // background-color: red;
  background-image: url('@/assets/imgs/train/slices/diaoyan2x.png');
  background-size: 100% 100%;
  padding-top: 26.715px;
}
.custom-dialog {
  width: 695.275px;
  height: 699.385px;
}

.skyBlue {
  width: 91.105px;
  height: 36.305px;
  background-image: url('@/assets/imgs/train/slices/skyblue2x.png');
  background-size: 100% 100%;
  margin-left: 59.595px;
  font-family: MicrosoftYaHei, MicrosoftYaHei;
  font-weight: bold;
  font-size: 18px;
  color: #ffffff;
  line-height: 36.305px;
  font-style: normal;
  text-align: center;
}
.ruzhi {
  width: 328.115px;
  height: 54.115px;
  margin-left: 54.115px;
  margin-top: 18.495px;
}
.box {
  width: 672.67px;
  height: 526.08px;
  background: linear-gradient(308deg, #78befa 0%, #3d6cee 100%);
  border-radius: 20px;
  margin-top: 13.7px;
  margin-left: 12.33px;
  padding-top: 8.22px;
}
.sonbox {
  width: 652.12px;
  height: 515.12px;
  background: #ffffff;
  border-radius: 15px;
  margin-left: 9.59px;
  overflow-y: auto;
  img {
    margin-top: 2.74px;
  }
}

.jiantou {
  width: 8.22px;
  height: 13.7px;
  margin-right: 10.96px;
}

.son {
  padding-top: 13.7px;
  margin-left: 13.7px;
}

.sonTop {
  min-height: 15.07px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 600;
  font-size: 16px;
  color: #333333;
  line-height: 30.14px;
  text-align: left;
  font-style: normal;
  display: inline-block;
}

.sonText {
  height: 50px;
  background: #f3f3f3;
  border-radius: 10px;
  padding-top: 13.7px;
  padding-left: 13.7px;
  overflow-y: auto;
  margin-top: 13.7px;
}

.closeImg {
  position: absolute;
  width: 20.55px;
  height: 20.55px;
  top: 13.7px;
  right: 13.7px;
  cursor: pointer;
  opacity: 0.6;
}

.bigBox {
  :deep(.el-dialog) {
    width: 700px;
    height: 707px;
    background-color: transparent;
    padding: 0;
    border-radius: 15px;
  }
}
.bigBox {
  :deep(.el-dialog__body) {
    width: 700px;
    height: 707px;
    margin: 0;
    padding: 0;
  }
}
.bigBox {
  :deep(.el-dialog__header) {
    display: none;
  }
}
</style>
