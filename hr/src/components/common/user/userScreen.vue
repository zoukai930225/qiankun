<template>
  <el-select popper-class="user_option" v-model="dataItem" placeholder="请输入人员姓名/手机号码筛选" @focus="focus"
    :loading="loading" :loading-text="'数据加载中'" :disabled="disabled" :clearable="clearable" filterable remote
    :remote-method="remoteMethod" @change="userChange" append-to="body">
    <template #label="{ label, value }">
      <div class="row-center">
        <el-avatar :src="getLableAvater(value)" :size="20" style="margin-right: 5px;" />
        <span class="name"> {{ label }}</span>
      </div>
    </template>
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      <div class="item">
        <div class="left-wapper">
          <img class="img" :src="item?.avatarOrigin || avatarLogo" alt="" />
          <div class="info">
            <span class="text name">{{ item?.label || '-' }}
               <span class="text desc">{{ item?.departmentName || '-' }}</span>
            </span>
           <span class="text desc">{{ item?.company ? getDictLabel(DICT_TYPE.PR_COMPANY, item.company) : '-' }}</span>
          </div>
        </div>
        <span class="jobName">
          {{ item?.jobNum || '-' }}
        </span>
      </div>
    </el-option>
  </el-select>
</template>

<script lang="tsx">
import avatarLogo from '@/assets/imgs/avatar_logo.png'
export default { name: 'UserScreen' };
</script>

<script lang="tsx" setup>
import request from '@/config/axios';
import { getDictLabel, DICT_TYPE, getIntDictOptions } from '@/utils/dict';

const emit = defineEmits(['update:item']);

const props = defineProps({
  url: { type: String, default: 'avatarOrigin' },
  clearable: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  item: { type: Object, default: () => { } },
  name: { type: String, default: 'name' },
  id: { type: String, default: 'id' },
});

const dataItem = ref(), options = ref<Array<any>>([]), loading = ref<boolean>(false);

const selectValue = ref<any>({});

const remoteMethod = (query: string) => {
  !!query && getDataList(query);
}

const getDataList = (txt: string = '') => {
  loading.value = true;
  request.get({ url: `/api/personRoster/list`, params: { page: 1, size: 30, param: txt } }).then((res: any) => {
    options.value = (res?.data || []).map((rs: any) => ({ ...rs, label: rs.name, value: rs.userId }));
    !!selectValue.value?.value && fillItem(selectValue.value);
  }).finally(() => {
    loading.value = false;
  });
};

const getLableAvater = (userId: string) => {
  return options.value.find((item) => item.value === userId)?.avatarOrigin || avatarLogo
}

const userChange = (value: any) => {
  const tar: any = options.value.find((ops: any) => ops.userId === value);
  selectValue.value = { ...tar };
  props.item[props.url] = tar?.avatarOrigin || null;
  props.item[props.id] = tar?.userId || null;
  props.item[props.name] = tar?.name || null;
  emit('update:item', props.item);
  !value && getDataList();
};

const fillItem = (tar: any) => {
  const ids: any = options.value.map((ops: any) => ops.value).join(',');
  if (!ids.includes(tar.value)) {
    options.value.unshift({ label: tar.label, value: tar.value, avatarOrigin: tar.avatarOrigin });
  }
};

watch(() => props.item, () => {
  if (props.item[props.id]) {
    selectValue.value = { ...props.item, label: props.item[props.name], value: props.item[props.id], avatarOrigin: props.item[props.url] };
    fillItem(selectValue.value);
  } else {
    selectValue.value = {};
    dataItem.value = '';
  }
}, { deep: true, immediate: true })

const focus = () => {
  getDataList();
};

</script>

<style scoped lang="scss">
.user_option .el-select-dropdown__wrap .el-select-dropdown__item {
  height: 45px !important;
  line-height: 45px !important;
}

.item {
  height: 45px;
  line-height: 45px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 7px;
  box-sizing: border-box;

  .left-wapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }

  .info {
    display: flex;
    flex-direction: column;
    margin-left: 14px;

    .text {
      height: 20px;
      line-height: 20px;
    }

    .name {
      font-size: 14px;
      color: #333333;
    }

    .desc {
      font-size: 12px;
      color: #999999;
    }
  }
}

.row-center {
  display: inline-flex;
  margin-top: 3px;
  padding: 1px 8px;
  height: 22px;
  line-height: 22px;
  border-radius: 15px;
  align-items: center;
  background-color: #cad6f8;

  .name {
    color: #333;
  }
}
</style>
