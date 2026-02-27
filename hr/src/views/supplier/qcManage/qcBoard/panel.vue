<template>
  <div class="panel_body">
    <div class="panel_submit" @click="emit('pageTo')">
      <span class="panel_submit_title">日报提交数</span>
      <span class="panel_submit_num">{{ info?.num?.submissions || 0 }}</span>
      <img :src="calendar" alt="" class="panel_submit_img">
    </div>
    <div class="panel_card" @click="open">
      <div class="panel_card_item">
        <div class="panel_card_item_label">日报未提交数</div>
        <div class="panel_card_item_value">{{ info?.num?.notSubmissions || 0 }}</div>
      </div>
      <div class="panel_card_item">
        <div class="panel_card_item_label">供应商数</div>
        <div class="panel_card_item_value">{{ info?.num?.supplierCount || 0 }}</div>
      </div>
      <div class="panel_card_item">
        <div class="panel_card_item_label">商品款号数</div>
        <div class="panel_card_item_value">{{ info?.num?.itemNumberCount || 0 }}</div>
      </div>
    </div>
    <div class="page-details">
      <el-drawer v-model="visible" :wrapper-closable="true" :size="885" @closed="closed" :show-close="false"
        destroy-on-close>
        <template #header="{ close }">
          <div class="header_txt"> 查看 </div>
          <el-icon @click="close" class="header_close">
            <CloseBold />
          </el-icon>
        </template>
        <template #default>
          <div class="contain_view">
            <el-card shadow="never" class="card_info">
              <logo-label :txt="`日报未提交数(${info?.num?.notSubmissions || 0})`" :isEdit="false" />
              <div class="descriptions">
                <div class="descriptions_title">日报未提交人员</div>
                <div class="descriptions_list">
                  <div v-for="(user, idx) in submissions" :key="user.name" class="descriptions_list_item"
                    :style="lastClass(idx, idx === submissions.length - 1)">
                    <line-avatar :user="{ name: user.name, avatarOrigin: user.avatarOrigin }" />
                  </div>
                </div>
              </div>
            </el-card>
            <el-card shadow="never" class="card_info" style="margin-top: 20px;">
              <logo-label :txt="`供应商数(${info?.num?.supplierCount || 0})`" :isEdit="false" />
              <div class="descriptions">
                <div class="descriptions_title">供应商</div>
                <div class="descriptions_list">
                  <div v-for="(supplier, idx) in suppliers" :key="`supplier_${supplier}`"
                    class="descriptions_list_item2"
                    :style="lastClass2(supplier, idx === suppliers.length - 1, suppliers.length)">
                    <span>{{ supplier }}</span>
                  </div>
                </div>
              </div>
            </el-card>
            <el-card shadow="never" class="card_info" style="margin-top: 20px;">
              <logo-label :txt="`商品款号数(${info?.num?.itemNumberCount || 0})`" :isEdit="false" />
              <div class="descriptions">
                <div class="descriptions_title">商品款号</div>
                <div class="descriptions_list">
                  <div v-for="(itemNumber, idx) in itemNumbers" :key="`item_${itemNumber}`"
                    class="descriptions_list_item2"
                    :style="lastClass2(itemNumber, idx === itemNumbers.length - 1, itemNumbers.length)">
                    <span>{{ itemNumber }}</span>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </template>
      </el-drawer>
    </div>
  </div>
</template>

<script lang="tsx">
export default { name: 'QcBoardPanel' }
</script>

<script lang="tsx" setup>
import lineAvatar from "@/components/template/table/components/lineAvatar.vue";
import LogoLabel from '@/components/common/label/logoLabel.vue';
import calendar from "@/assets/svgs/supplier/calendar.svg";

const emit = defineEmits(['pageTo']);

const visible = ref(false);

const props = defineProps({
  info: { type: Object, default: () => { } },
});

const submissions = computed(() => (props.info?.num?.notSubmissionsInfo?.length ? props.info.num.notSubmissionsInfo : [{ name: '全员提交' }]));

const suppliers = computed(() => {
  const list: any = (props.info?.num?.supplierInfo || []).filter((si: any) => !!si);
  return (list?.length ? list : ['暂无供应商']).sort((a: string, b: string) => b.length - a.length);
});

const itemNumbers = computed(() => {
  const list: any = (props.info?.num?.itemNumberInfo || []).filter((si: any) => !!si);
  return (list?.length ? list : ['暂无商品款号']).sort((a: string, b: string) => b.length - a.length);
});

const lastClass = (index: number, isLast: boolean) => {
  let obj: any = {};
  if (isLast) {
    const num: number = 4 - ((index + 1) % 4);
    if (num !== 4) {
      obj = { width: `calc(${25 * (num + 1)}% - 37px)` }
    }
  };
  return obj;
};

const lastClass2 = (txt: string, isLast: boolean, length: number) => {
  let obj: any = { width: `calc(50% - 37px)` };
  if (txt?.length > 15) {
    obj = { width: `calc(100% - 37px)` };
  } else {
    if (isLast && length % 2 === 1) {
      obj = { width: `calc(100% - 37px)` };
    }
  }
  return obj;
};

const open = () => {
  visible.value = true;
};

const closed = () => {
  visible.value = false;
};

</script>
<style lang="scss" scoped>
@use '@/styles/drawer.scss';
@use '@/styles/index.scss';
@use './styles.scss';

.descriptions {
  width: 100%;
  margin-top: 16px;
  display: flex;

  &_title {
    width: 100px;
    height: auto;
    padding: 10px 15px;
    background-color: #F4F6FA;
    color: #666666;
    font-size: 14px;
    border: 1px solid #E5E5E5;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &_list {
    width: calc(100% - 130px);
    display: inline-table;
    border-top: 1px solid #E5E5E5;
    color: #333;

    &_item {
      vertical-align: middle;
      height: auto;
      display: inline-block;
      padding: 13px 18px;
      width: calc(25% - 37px);
      border-bottom: 1px solid #E5E5E5;
      border-right: 1px solid #E5E5E5;
      font-size: 14px;
    }

    &_item2 {
      vertical-align: middle;
      height: auto;
      display: inline-block;
      padding: 13px 18px;
      width: calc(50% - 37px);
      border-bottom: 1px solid #E5E5E5;
      border-right: 1px solid #E5E5E5;
      font-size: 14px;
    }
  }
}

.header_txt {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.header_close {
  cursor: pointer;
  float: right;
}

.contain_btn {
  position: absolute;
  right: 20px;
}

:deep() {
  .el-drawer__header {
    margin: 0px;
    padding: 12px 20px;
    border-bottom: 1px solid #f0f0f0;
  }

  .el-drawer__body {
    padding: 15px !important;
    background-color: #f8f8f9 !important;
  }
}

.card_info {
  border-radius: 10px;
  border: none;

  :deep() {
    .el-card__body {
      padding: 18px 20px;
      height: calc(100% - 32px);
    }
  }
}

.contain_view {
  height: 100%;

  :deep(.el-card__header) {
    padding: 10px;
  }
}

.drawer {
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
</style>