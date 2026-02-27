<template>
  <el-cascader ref="cascaderRef" :options="menuList" :props="customProps" @change="valueChange" placeholder="请选择店铺"
    clearable filterable style="width: 100%" :show-all-levels="false" v-model="dataValue">
    <template #default="{ data }">
      <div>
        <img v-if="stroeList.includes(data.id)" class="storeImg" :src="getImageUrl(data.id)" alt="" />
        {{ data.name }}
      </div>
    </template>
  </el-cascader>
</template>

<script lang="ts">
export default { name: 'StoreSelect' }
</script>

<script lang="ts" setup>
import { useDeptTree } from '@/hooks/common/useDeptTree';
import { getImageUrl } from '@/utils/index';

const dataValue: any = defineModel();

const { menuList } = useDeptTree({ isPermission: 0 });

const stroeList = ref(['TaoBao', 'Tmall', 'Douyin', 'Pdd']);

const emit = defineEmits(['change']);

const customProps = computed(() => ({
  label: 'name',
  value: 'id',
  children: 'children',
}));

const valueChange = (val: any) => {
  let reBackData: any = [];
  if (val?.length) {
    const channel: any = menuList.value.find((ms: any) => ms.id === val[0]);
    const tar: any = channel.children.find((cs: any) => cs.id === val[1]);
    reBackData = [channel, tar];
  }
  emit('change', val, reBackData);
};

</script>
<style lang="scss" scoped>
.storeImg {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

/* 自定义样式控制输入框高度 */
.cascaderBox {
  :deep(.el-cascader__search-input) {
    display: none;
  }
}
</style>
