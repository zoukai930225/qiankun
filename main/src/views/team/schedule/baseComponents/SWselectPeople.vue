<!--
 * @Date: 2024-09-13 15:25:17
  下拉选择人员
-->
<template>
  <div class="select-wapper">
    <el-select
      popper-class="eloption"
      :popper-append-to-body="true"
      v-model="listArr"
      placeholder="请选择人员"
      :multiple="multiple"
      remote
      @change="handleSelectChange"
      filterable
      :remote-method="remoteMethod"
      :disabled="disabled"
    >
      <template #tag v-if="listArr?.length">
        <div class="itemValue" v-for="(item, index) in listArr" :key="index">
          <img class="avatorLogo" :src="formatName(item, 'avatarOrigin')" alt="" />
          <span class="itemDesc">{{ formatName(item, 'operatorRealname') }}</span
          ><img
            class="itemClose"
            src="@/assets/imgs/team/itemClose.png"
            @click.stop="delItem(item, 'operate')"
            alt=""
        /></div>
      </template>
      <el-option
        v-for="dict in OperatorRosterList"
        :key="dict.operatorId || dict.userId"
        :label="dict.operatorRealname || dict.name"
        :value="dict.operatorId || dict.userId"
      >
        <div class="item">
          <div class="left-wapper">
            <img class="img" :src="dict.avatarOrigin" alt="" />
            <div class="info">
              <span class="text name">{{ dict.operatorRealname || dict.name }}</span>
              <span class="text desc">{{ dict.dept }}</span></div
            >
          </div>

          <span style="color: var(--el-text-color-secondary); font-size: 13px">
            {{ dict.jobNum }}
          </span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'SWselectPeople' })

interface Operator {
  avatarOrigin: string //图片
  dept: string //组
  jobNum: number //工作数量
  operatorId: string //id
  operatorRealname: string //名字
  name: string //名字
  userId: string //id
}

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => {
      return []
    }
  },
  getSearchList: {
    // @ts-ignore
    type: Function as () => (value: any) => Promise<any>,
    required: true
  },
  multiple: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const listArr = computed({
  get: () => {
    // if (!props.multiple && props.modelValue.length) {
    //   return [props.modelValue]
    // }
    return props.modelValue
  },
  set: (val: []) => {
    emit('update:modelValue', val)
  }
})

const emit = defineEmits(['update:modelValue'])
const handleSelectChange = (value) => {
  emit('update:modelValue', value)
}

//下拉展示结果 操作人员
const OperatorRosterList: Ref<Operator[]> = ref([])
//格式化存储结果 //操作人员
const searchResult: Ref<Operator[]> = ref([])

const remoteMethod = async (value) => {
  const res = await props.getSearchList(value)
  OperatorRosterList.value = res || []
  searchResult.value = searchResult.value.concat(res || [])
}

// str 属性
const formatName = (value, str) => {
  const midArr = searchResult.value
  const operator = midArr.find((item) => item.operatorId == value)
  if (operator) {
    return operator[str]
  }
}

onMounted(() => {
  remoteMethod('')
})

onUnmounted(() => {
  OperatorRosterList.value = []
  searchResult.value = []
})

const delItem = (item, type) => {
  listArr.value = listArr.value.filter((value) => {
    return value !== item
  })
}
</script>

<style scoped lang="scss">
.select-wapper {
  width: 100%;
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
  background: #fafafa;
  border-radius: 4px;
}
</style>
