<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :modal-append-to-body="true"
      :width="419"
      :show-close="false"
    >
      <template #header>
        <div class="header-content">
          <div class="header-title">导入成功！</div>
          <img
            src="@/assets/imgs/serviceConfiguration/close.png"
            alt=""
            @click="dialogVisible = false"
          />
        </div>
      </template>
      <div class="tip-content">
        <div class="tip-title">
          <img src="@/assets/imgs/serviceConfiguration/tip.png" alt="" />
          提示：</div
        >

        <div class="tip-text"> 部分数据异常，未导入，异常数据商家编码如下 </div>
      </div>

      <div class="dialog-content">
        <div class="dialog-list">
          <span class="dialog-item" v-for="item in list" :key="item">{{ item }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'UploadErrorListDialog' })

const dialogVisible = ref(false) // 弹窗的是否展示

const loading = ref(false) // 数据加载是否中
const list = ref<any[]>([]) // 列表的数据

/** 打开弹窗 */
const open = async (data) => {
  dialogVisible.value = true
  list.value = []
  getList(data)
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 查询列表 */
const getList = async (data) => {
  loading.value = true
  try {
    list.value = data || []
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.header-content {
  position: relative;
  .header-title {
    text-align: center;
    font-weight: bold;
    margin: 30px 0 0;
  }
  img {
    width: 14px;
    height: 14px;
    position: absolute;
    right: 21px;
    top: -9px;
    cursor: pointer;
  }
}

.tip-content {
  width: 371px;
  margin: 0 auto;
  font-size: 14px;
  color: #333333;
  .tip-title {
    margin-bottom: 14px;
    img {
      width: 14px;
      height: 14px;
      vertical-align: middle;
    }
  }
  .tip-text {
    margin-bottom: 20px;
  }
}
:deep(.el-dialog) {
  padding: 0px;
  border-radius: 20px;
  background-image: url('@/assets/imgs/serviceConfiguration/bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 377px;
}

.dialog-content {
  width: 371px;

  margin: 0 auto;
  background: #fcfdff;
  box-shadow: 0px 0px 13px 2px rgba(72, 81, 113, 0.08);
  border-radius: 4px;

  font-size: 14px;
  color: #333333;
  font-weight: bold;

  .dialog-list {
    height: 202px;
    padding: 20px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: center;
    flex-wrap: wrap;
    overflow-y: auto;
  }
  .dialog-item {
    margin-right: 20px;
  }
}
</style>
