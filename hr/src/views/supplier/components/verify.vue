<template>
  <div>
    <el-drawer
      v-model="visible"
      v-if="visible"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      :size="968"
      @close="handleCloseDrawer"
    >
      <div>
        <div class="drawerTitle"
          ><div>资产审查</div
          ><div @click="handleCloseDrawer"
            ><el-icon><CloseBold /></el-icon
          ></div>
        </div>
      </div>
      <div class="contain">
        <el-card>
          <div class="card" v-for="item in picList" :key="item.type">
            <div class="label">{{ item.label }}</div>
            <div class="img-list">
              <template v-if="item.fileList.length > 0">
                <div class="img-item" v-for="file in item.fileList" :key="file">
                  <img :src="file" />
                  <!-- <div class="text">{{ file.imageName }}</div> -->
                  <div class="preview" @click="previewHandle(file)">
                    <Icon icon="ep:zoom-in" />
                    <span>查看</span>
                  </div>
                </div>
              </template>
              <el-image v-else>
                <template #error>
                  <div class="image-slot">
                    <el-icon><icon-picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>
          </div>
        </el-card>
      </div>
      <div class="drawerFooter">
        <el-button type="primary" @click="submitHandle">评分</el-button>
      </div>
    </el-drawer>
    <RateInfo ref="rateRef" />

    <el-image-viewer
      v-if="imgViewVisible"
      :url-list="[viewImageUrl]"
      @close="imgViewVisible = false"
    />
  </div>
</template>
<script lang="tsx" setup>
import { getSupplierInfobyId } from '@/api/supplier'
import { Picture as IconPicture } from '@element-plus/icons-vue'
import RateInfo from './rate.vue'
defineOptions({ name: 'VerifyInfo' })
const visible = ref(false)
const curId = ref('')
const open = (id: string) => {
  visible.value = true
  curId.value = id
  getData()
}
const picList = ref([
  {
    type: 1,
    label: '营业执照/对公资料',
    fileList: []
  },
  {
    type: 2,
    label: '公司样貌',
    fileList: []
  },
  {
    type: 3,
    label: '车间照片（生产车间，后道包装，检验区，原辅料仓库，成品仓库）',
    fileList: []
  },
  {
    type: 4,
    label: '展厅及产品',
    fileList: []
  }
])
// 获取信息
const getData = async () => {
  const res = await getSupplierInfobyId({ id: curId.value, type: '' })
  for (let i = 1; i < 5; i++) {
    let arr = []
    const array = res.filter((obj: any) => parseInt(obj.type) === i && obj.imageList.length > 0)
    array.forEach((item: any) => {
      arr = arr.concat(item.imageList)
    })
    picList.value[i - 1].fileList = arr
  }
}
const imgViewVisible = ref(false)
const viewImageUrl = ref('')
const previewHandle = (str: string) => {
  imgViewVisible.value = true
  viewImageUrl.value = str
}
// 提交
const rateRef = ref()
const submitHandle = async () => {
  rateRef.value.open(curId.value)
}
// 关闭
const handleCloseDrawer = () => {
  visible.value = false
}
defineExpose({
  open
})
onMounted(() => {})
</script>
<style lang="scss" scoped>
@use '@/styles/drawer.scss';
.m-bot {
  margin-bottom: 20px;
}
.drawerTitle {
  display: flex;
  justify-content: space-between;
}
.drawer {
  background-color: #f6f6f6;
  .el-drawer__header {
    margin-bottom: 0;
    .el-drawer__title {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      font-style: normal;
    }
  }
}
.card {
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 20px;
  // padding: 20px 0;
  .label {
    margin-bottom: 20px;
  }
  .img-list {
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    .img-item {
      width: 110px;
      margin-right: 20px;
      margin-bottom: 20px;
      position: relative;
      overflow: hidden;
      border-radius: 10px;
      img {
        display: block;
        width: 110px;
        height: 110px;
      }
      .preview {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 6%;
        color: aliceblue;
        cursor: pointer;

        .el-icon {
          margin-bottom: 8%;
          font-size: 140%;
        }

        span {
          font-size: 100%;
        }
      }
      &:hover {
        .preview {
          display: flex;
        }
      }
    }
    .text {
      margin-top: 20px;
    }
  }
}
.image-slot {
  width: 110px;
  height: 110px;
  border: 1px dashed #c7c7c7;
  border-radius: 10px;
  line-height: 110px;
  margin-bottom: 20px;
  .el-icon {
    font-size: 30px;
    color: #999;
  }
}
.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
</style>
