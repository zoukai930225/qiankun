<!--
 * @Date: 2024-09-13 15:25:17
  下拉选择人员
-->
<template>
  <div class="select-wapper">
    <el-select popper-class="eloption" :popper-append-to-body="true" v-model="listArr" placeholder="请选择人员"
      :disabled="!isEdit" multiple remote @change="handleSelectChange" filterable :remote-method="remoteMethod"
      @blur="saveSelectPeople" @focus="handleFocus">
      <template #tag v-if="listArr?.length">
        <div class="itemValue" v-for="(item, index) in listArr" :key="index">
          <img class="avatorLogo" :src="item.avatarOrigin" alt="" />
          <span class="itemDesc">{{ item.name }} </span>
          <img v-if="isEdit" class="itemClose" src="@/assets/imgs/team/itemClose.png"
            @click.stop="delItem(item, 'operate')" alt="" />
        </div>
      </template>
      <el-option v-for="dict in OperatorRosterList" :key="dict.userId" :label="dict.name" :value="dict.userId">
        <div class="item">
          <div class="left-wapper">
            <img class="img" :src="dict.avatarOrigin" alt="" />
            <div class="info">
              <span class="text name">{{ dict.name }}</span>
              <span class="text desc">{{ dict.departmentName || '--' }}</span>
            </div>
          </div>

          <!-- <span style="color: var(--el-text-color-secondary); font-size: 13px">
            {{ dict.jobNum }}
          </span> -->
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'SWSelectPeople' })

interface Operator {
  avatarOrigin: string //图片
  userId: string
  departmentName: string //组
  name: string //名字
}

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Array,
    default: () => {
      return []
    }
  },
  memberList: {
    type: Array,
    default: () => {
      return []
    }
  },
  multiple: {
    type: Boolean,
    default: true
  },
  getSearchList: {
    // @ts-ignore
    type: Function as () => (value: any) => Promise<any>,
    required: true
  }
})

const getUserInfoDetail = (userId: string) => {
  let userInfo = null
  searchResult.value.forEach((item) => {
    if (item.userId === userId) {
      userInfo = item
    }
  })
  return userInfo
}

const listArr = computed({
  get: () => {
    if (!props.isEdit && props.memberList?.length > 0) {
      return props.memberList || []
    }
    return props.modelValue || []
  },
  set: (val: []) => {
    emit('update:modelValue', val)
  }
})

const emit = defineEmits([
  'update:modelValue',
  'saveSelectPeople',
  'selectPeopleChange',
  'handleFocus'
])
const handleSelectChange = (value) => {
  console.log('选择人员:', value)
  if (typeof value === 'string') {
    value = [value]
  }
  let lists = []
  value.forEach((item) => {
    let userInfo = null
    if (typeof item === 'string') {
      userInfo = getUserInfoDetail(item)
    } else {
      userInfo = getUserInfoDetail(item.userId || '')
    }
    if (userInfo) {
      if (!props.multiple) {
        lists = [userInfo]
      } else {
        let isExist = false
        lists.forEach((item1) => {
          if (item1.userId === userInfo.userId) {
            isExist = true
          }
        })
        if (!isExist) {
          lists.push(userInfo)
        }
      }
    }
  })
  console.log('选择人员11:', value, lists)

  emit('update:modelValue', lists)
  emit('selectPeopleChange', lists)

  // emit('update:modelValue', value)
}

const handleFocus = () => {
  console.log('handleFocus第三方')
  emit('handleFocus')
}

//下拉展示结果 操作人员
const OperatorRosterList: Ref<Operator[]> = ref([])
//格式化存储结果 //操作人员
const searchResult: Ref<Operator[]> = ref([])

const searchName = ref('')
const remoteMethod = async (value) => {
  if (props.isEdit) {
    const res = await props.getSearchList(value)

    console.log('接受到的数据', res)

    OperatorRosterList.value = res || []

    if (value) {
      const filterArr = []
      value &&
        OperatorRosterList.value.forEach((item) => {
          if (item.name.indexOf(value) !== -1) {
            filterArr.push(item)
          }
        })
      OperatorRosterList.value = filterArr || []
    }
    searchResult.value = searchResult.value.concat(res || [])
  }
  searchName.value = value
}

const saveSelectPeople = () => {
  emit('saveSelectPeople')
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
  if (props.isEdit) {
    listArr.value = listArr.value.filter((value) => {
      return value !== item
    })
    emit('selectPeopleChange', listArr.value)
  }
}

const clearItems = () => {
  listArr.value = [];
  emit('selectPeopleChange', listArr.value)
};

defineExpose({ clearItems })
</script>

<style scoped lang="scss">
.select-wapper {
  width: 100%;
  // :deep(.el-select__wrapper) {
  //   padding: 10px 4px;
  // }
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
