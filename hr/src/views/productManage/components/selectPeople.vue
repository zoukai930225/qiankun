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
      placeholder="请选择"
      :multiple="true"
      remote
      @change="handleSelectChange"
      filterable
      :remote-method="remoteMethod"
    >
      <template #tag v-if="listArr?.length">
        <div class="itemValue" v-for="(item, index) in listArr" :key="index">
          <img class="avatorLogo" :src="formatName(item, 'avatarOrigin')" alt="" />
          <span class="itemDesc">{{ formatName(item, 'name') }}</span
          ><img
            class="itemClose"
            src="@/assets/imgs/team/itemClose.png"
            @click.stop="delItem(item, 'operate')"
            alt=""
        /></div>
      </template>
      <el-option
        v-for="dict in OperatorRosterList"
        :key="dict.userId"
        :label="dict.operatorRealname"
        :value="dict.userId"
      >
        <div class="item">
          <div class="left-wapper">
            <img class="img" :src="dict.avatarOrigin" alt="" />
            <div class="info">
              <span class="text name">{{ dict.name }}</span>
              <span class="text desc">{{ dict.departmentName }}</span></div
            >
          </div>

          <span class="jobName">
            {{ dict.jobNum }}
          </span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import * as GoodsShopApi from '@/api/shop'

defineOptions({ name: 'SelectPeople' })

interface Operator {
  avatarOrigin: string //图片
  dept: string //组
  jobNum: number //工作数量
  userId: string //id
  operatorRealname: string //名字
  name: string
  departmentName: string
  unionId: string
}

const props = defineProps({
  multiple: {
    type: Boolean,
    default: true
  },
  modelValue: {
    type: Array,
    default: () => {
      return []
    }
  },
  userId: {
    type: String
  },
  operatorName: {
    type: String
  }
})

const emit = defineEmits(['update:modelValue', 'update:operatorName', 'update:userId'])

function changeModule(value: any) {
  emit('update:modelValue', value)
  emit(
    'update:operatorName',
    OperatorRosterList.value.find((el) => el.userId === value[value.length - 1])?.name
  )
  emit(
    'update:userId',
    OperatorRosterList.value.find((el) => el.userId === value[value.length - 1])?.userId
  )
}

const listArr = computed({
  get: () => (props.userId ? [props.userId] : []),
  set: (value) => {
    emit(
      'update:userId',
      OperatorRosterList.value.find((el) => value && el?.userId === value[value.length - 1])?.userId
    )
  }
})

const handleSelectChange = (value) => {
  if (props.multiple) {
    listArr.value = value
    emit('update:modelValue', value)
  } else {
    if (value && value.length > 0) {
      changeModule(value)
      nextTick(() => {
        if (listArr.value.length > 0) {
          const selectObj = listArr.value[listArr.value.length - 1]
          listArr.value = [selectObj]
        }
      })
    }
  }
}

//下拉展示结果 操作人员
const OperatorRosterList: Ref<Operator[]> = ref([])
//格式化存储结果 //操作人员
const searchResult: Ref<Operator[]> = ref([])
// 获取人员列表
const remoteMethod = async (value) => {
  const res = await GoodsShopApi.personRosterGetPerson(value)
  OperatorRosterList.value = res || []
  searchResult.value = searchResult.value.concat(res || [])
}

// str 属性
const formatName = (value, str) => {
  const midArr = searchResult.value
  const operator = midArr.find((item) => item.userId == value)
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
  emit('update:userId', '')
}
</script>

<style scoped lang="less">
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

.jobName {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

:deep(.el-select__wrapper),
:deep(.el-input__wrapper) {
  min-height: 32px;
  //background: #fafafa;
  border-radius: 4px;
}
</style>
