<template>
  <div :class="['select-wapper', showDisabledBg ? 'bg' : '']" :style="{ backgroundColor: showDisabledBg ? '#fff' : '' }">
    <div :class="['select-booth']" v-if="disabled">
      <line-reveal :options-list="modelValue" :tags="tags" :option-params="optionParams" />
    </div>
    <el-select v-else popper-class="eloption" ref="selectRef" :popper-append-to-body="true" v-model="dataValue"
      :placeholder="placeholder" :loading="loading" :multiple="multiple" collapse-tags collapse-tags-tooltip
      :max-collapse-tags="tags" @change="valueChange" filterable @blur="saveSelect" @focus="handleFocus"
      :clearable="clearable" :multiple-limit="limit">
      <template #tag>
        <line-reveal :options-list="modelValue" :tags="tags" :option-params="optionParams" disabled @delItem="delItem"
          v-if="dataValue?.length" />
      </template>
      <el-option v-for="dict in options" :key="dict.value" :label="dict.label" :value="dict.value">
        <div class="item">
          <div class="left-wapper">
            <img class="img" :src="dict.avatar || DefaultAvatar" alt="" />
            <div class="info">
              <span class="text name">{{ dict.label }}</span>
              <span class="text desc">{{ dict.depart || '--' }}</span>
            </div>
          </div>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script lang="ts">
export default { name: 'LineStaffs' };
</script>

<script lang="ts" setup>
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg';
import { getUserList } from '@/api/system/user';
import LineReveal from './lineReveals.vue';
import { filterObject } from '@/utils';
import { cloneDeep } from 'lodash-es';
import request from '@/config/axios';

const modelValue: any = defineModel(), bukValue = ref<any>([]), selectRef = ref(), dataValue = ref<Array<any>>([]);

const options = ref<Array<any>>([]), userOptions = ref<Array<any>>([]), isLoad = ref<boolean>(false), loading = ref<boolean>(false);

const props = defineProps({
  disabled: { type: Boolean, default: false },
  multiple: { type: Boolean, default: true },
  clearable: { type: Boolean, default: false },
  placeholder: { type: String, default: '请选择' },
  tags: { type: Number, default: 2 },
  limit: { type: Number, default: 0 },
  code: { type: String, default: '' },
  roleId: { type: String, default: '' },
  showDisabledBg: { type: Boolean, default: false },
  valueParams: { type: Object, default: () => ({ label: 'name', value: 'userId', avatar: 'avatarOrigin', depart: 'departmentName' }) },
  optionParams: { type: Object, default: () => ({ label: 'name', value: 'userId', avatar: 'avatarOrigin', depart: 'departmentName' }) },
});

const emit = defineEmits(['update:modelValue', 'save','change']);

const getOptionsList = (fun: Function) => {
  loading.value = true;
  if (props.code) {
    request.get({ url: `/api/config/getCode/${props.code}` }).then((res: any) => {
      request.get({ url: `/api/personRoster/getPersonByOpenId?openIds=${res}` }).then((info: any) => {
        if (!!info?.length) {
          userOptions.value = info;
          options.value = info.map((ds: any) => {
            let obj: any = {};
            filterObject(props.optionParams, (key: string, value: any) => {
              obj[key] = ds[value];
            });
            return obj;
          });
        }
      }).finally(() => {
        loading.value = false;
        fun();
      });
    })
  } else if (props.roleId) {
    getUserList({ page: 1, pageSize: 9999, role: props.roleId }).then((res: any) => {
      if (!!res.records?.length) {
        userOptions.value = res.records;
        options.value = res.records.map((ds: any) => {
          ds.name = ds.realName
          ds.departmentName = ds.dept
          let obj: any = {};
          filterObject(props.optionParams, (key: string, value: any) => {
            obj[key] = ds[value];
          });
          return obj;
        });
      }
    }).finally(() => {
      loading.value = false;
      fun();
    });
  } else {
    request.get({ url: `/api/personRoster/getPersonByOpenId?openIds=1` }).then((info: any) => {
      if (!!info?.length) {
        userOptions.value = info;
        options.value = info.map((ds: any) => {
          let obj: any = {};
          filterObject(props.optionParams, (key: string, value: any) => {
            obj[key] = ds[value];
          });
          return obj;
        });
      }
    }).finally(() => {
      loading.value = false;
      fun();
    });
  }

};

const handleFocus = () => {
  !isLoad.value && getOptionsList(() => {
    isLoad.value = true;
  });
};

const valueChange = () => {
  if (props.multiple) {
    const targets: any = userOptions.value.filter((ops: any) => dataValue.value.includes(ops[props.optionParams.value]));
    modelValue.value = !!targets?.length ? targets : [];
  } else {
    // const target: any = userOptions.value.find((ops: any) => dataValue.value === ops[props.optionParams.value]);
    // console.log(target);
    
  }
  emit('change', modelValue.value);
};

const delItem = (item: any) => {
  dataValue.value = dataValue.value.filter((ds: any) => ds !== item.value);
  valueChange();
};

const saveSelect = () => {
  const oldIds: string = bukValue.value.map((ms: any) => ms[props.valueParams.value]).join(',');
  const valueIds: string = modelValue.value.map((ms: any) => ms[props.valueParams.value]).join(',');
  if (oldIds !== valueIds) {
    emit('save', modelValue.value);
    bukValue.value = cloneDeep([...modelValue.value]);
  }
};

const initOptions = () => {
  userOptions.value = modelValue.value;
  options.value = modelValue.value.map((ds: any) => {
    let obj: any = {};
    filterObject(props.valueParams, (key: string, value: any) => {
      obj[key] = ds[value];
    });
    return obj;
  });
};

watch(()=>modelValue.value,()=>{
  initValue()
},{
  deep:true
})

const initValue = () => {
  if(!modelValue.value) return
  dataValue.value = modelValue.value.map((ms: any) => ms[props.valueParams.value]);
  bukValue.value = cloneDeep([...modelValue.value]);
};

onMounted(() => {
  isLoad.value = false;
  initValue();
  !options.value.length && !!modelValue.value?.length && initOptions();
});

</script>

<style scoped lang="scss">
.select-wapper {
  width: 100%;
  height: 34px;
  box-sizing: border-box;

  &.bg {
    background-color: #f8f8f9;
  }

  .select-booth {
    cursor: pointer;
    width: 100%;
    height: 34px;
    padding: 3px 5px;
    border: 1.2px solid var(--el-border-color);
    box-shadow: 0 0 0 1px var(--el-select-disabled-border) inset;
    border-radius: 5px;
    display: inline-flex;
    box-sizing: border-box;

  }
}

.eloption .el-select-dropdown__wrap .el-select-dropdown__item {
  height: 50px !important;
}

.itemValue {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 26px;
  background: #cad6f8;
  border-radius: 13px;
  padding: 1px 6px;
  box-sizing: border-box;

  .itemDesc {
    font-size: 14px;
    color: #333333;
    margin-left: 6px;
    margin-right: 6px;
  }

  .avatorLogo {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  .itemClose {
    cursor: pointer;
    width: 6px;
    height: 6px;
  }
}

.item {
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 7px;
  box-sizing: border-box;
  width: 100px;

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

:deep(.el-select__wrapper),
:deep(.el-input__wrapper) {
  min-height: 32px;
  // background: #f2f6fc;
  border-radius: 4px;
}
</style>
