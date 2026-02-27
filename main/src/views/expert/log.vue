<template>
  <ContentWrap>
    <div class="OperateLog">
      <div class="title">操作日志</div>
      <div class="line"></div>
      <div class="OperateLog-item" v-for="(item, index) in logList" :key="index">
        <div class="OperateLog-item-row">
          <div class="OperateLog-item-row-left">
            <div class="OperateLog-item-row-left-title">{{ item.name }}</div>
            <div class="OperateLog-item-row-left-time">{{ item.time }}</div>
            <div class="OperateLog-item-row-left-orderNo">订单号： {{ item.orderNo }}</div>
            <div class="OperateLog-item-row-left-content">{{ item.content }}</div>
          </div>
          <div v-if="item.pic && item.pic.length > 0" class="OperateLog-item-row-right">
            <div class="OperateLog-item-row-right-pic">
              <el-image
                v-for="(picItem, index1) in item.pic"
                :key="index1"
                class="logImg"
                :src="picItem"
                :preview-src-list="[
                  'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
                  'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
                ]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.size"
      v-model:page="queryParams.page"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script lang="ts" setup>
defineOptions({ name: 'OperateLog' })
const total = ref(3) // 列表的总页数
const queryParams = reactive({
  page: 1,
  size: 10
})
const img1 = 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'
const img2 = 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'

const logList = ref<Array<object>>([])
logList.value.push({
  id: 1,
  name: '沟通',
  time: '2024-05-07',
  content:
    '文本内容是否能你发的萨满， 你的，满分吗，啊单方面， 那档那上面，电脑动漫女生， 啊你美的，是否吗，三方吗，你 你打什么，发那么， 那',
  orderNo: 121312312312321,
  pic: [img1, img2, img1, img2, img1]
})
logList.value.push({
  id: 2,
  name: '沟通2',
  time: '2024-05-07',
  content: '文本内容2',
  orderNo: 121312312312321,
  pic: [img1, img2]
})
logList.value.push({
  id: 3,
  name: '沟通3',
  time: '2024-05-07',
  content: '文本内容3',
  orderNo: 121312312312321
})

/** 查询列表 */
const getList = async () => {}

/** 初始化 **/
onMounted(() => {})
</script>

<style lang="scss" scoped>
.OperateLog {
  background: #fff;
  min-height: calc(100vh - 100px);
  padding-bottom: 15px;
  .title {
    padding: 20px;
    padding-top: 0px;
  }
  .line {
    background: #e6e6e6;
    height: 1px;
    margin-left: 16px;
    margin-bottom: 30px;
    width: calc(100% - 68px);
  }
  &-item {
    border-radius: 6px;
    border: 1px solid #e6e6e6;
    margin-left: 16px;
    margin-bottom: 15px;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 16px;
    padding-bottom: 6px;
    width: calc(100% - 100px);
    &-row {
      display: flex;
      flex-direction: row;

      &-left {
        padding-right: 15px;
        &-title {
          font-weight: 600px;
          font-size: 18px;
          color: #000;
        }
        &-time {
          padding-top: 8px;
          font-weight: 500px;
          font-size: 16px;
          color: #333;
        }
        &-orderNo {
          padding-top: 6px;
          font-size: 14px;
          color: #333;
        }
        &-content {
          padding-top: 6px;
          font-size: 14px;
          color: #666;
          margin-bottom: 15px;
        }
      }
      &-right {
        margin-left: auto;
        max-width: calc(50%);
        &-pic {
          display: flex;
          flex-wrap: wrap;
          flex-direction: row;
          justify-content: flex-end;
          .logImg {
            margin-right: 10px;
            margin-bottom: 10px;
            width: 100px;
            height: 100px;
          }
        }
      }
    }
  }
  &-page {
    background: #fff;
  }
}
</style>
