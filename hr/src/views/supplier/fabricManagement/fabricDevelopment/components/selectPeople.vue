<template>
  <div class="select-wrapper">
    <el-select popper-class="elOption" :popper-append-to-body="true" v-model="listArr" :placeholder="placeholder"
      :disabled="disabled" multiple filterable value-key="userId" remote @change="handleSelectChange"
      no-match-text="暂无数据">
      <template #tag v-if="listArr?.length">
        <div class="itemValue" v-for="(item, index) in listArr" :key="index">
          <img class="avatarLogo" :src="item.avatarOrigin || DefaultAvatar" alt="" />
          <span class="itemDesc">{{ item.name }} </span>
          <img v-if="isEdit" class="itemClose" src="@/assets/imgs/team/itemClose.png"
            @click.stop="delItem(item, 'operate')" alt="" />
        </div>
      </template>
      <el-option v-for="dict in personList" :key="dict.userId" :label="dict.name" :value="dict">
        <div class="item">
          <div class="left-wrapper">
            <img class="img" :src="dict.avatarOrigin || DefaultAvatar" alt="" />
            <div class="info">
              <span class="text name">{{ dict.name }}</span>
            </div>
          </div>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'
// import {usePersonList } from '@/views/OA/factory/hooks'
defineOptions({ name: 'SWSelectPeople' })

import * as CommonApi from '@/api/common'
import * as SystemConstantApi from '@/api/system/systemConstant'

// const {personList,getPersonList} = usePersonList()
interface Operator {
  avatarOrigin: string //图片
  userId: string
  departmentName: string //组
  name: string //名字
}

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Array as any,
    default: () => {
      return []
    }
  },
  multiple: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String,
    default: () => ""
  },
  // 获取不同部门的人员
  /**
   * 'NEW_PRODUCT_DEPT_DEVELOP' 产研部门
   * 'NEW_PRODUCT_DEPT_SUPPLY' 供应链中心
   * 'NEW_DEPT_PURCHASE' 采购部门
   *  如果没有传部门code openId 默认为1 查所有人
   */
  deptCode: {
    type: String,
    default: () => ""
  }
})

const personList = ref<any>([])
const getPersonList = async () => {
  try {
    const openId = props.deptCode ? await SystemConstantApi.getSystemConstantConfigbyCode(props.deptCode) : '1'
    const list = await CommonApi.getPersonByOpenId(openId)
    personList.value = list
  } finally {

  }

}

const handleSelectChange = (vals: any) => {
  if (!props.multiple) {
    // 如果是单选
    const list = vals.slice(vals.length - 1)
    listArr.value = list
  }
}

const listArr = computed({
  get: () => {
    return props.modelValue || []
  },
  set: (val: []) => {
    emit('update:modelValue', val)
  }
})

const emit = defineEmits(['update:modelValue',])

onMounted(() => {
  getPersonList()
})

onUnmounted(() => {

})

const delItem = (item, type) => {
  if (props.isEdit) {
    listArr.value = listArr.value.filter((value) => {
      return value !== item
    })
  }
}
const init = () => {

}


defineExpose()
</script>

<style scoped lang="scss">
.select-wrapper {
  width: 100%;

}

.elOption .el-select-dropdown__wrap .el-select-dropdown__item {
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

  .avatarLogo {
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

  .left-wrapper {
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
  border-radius: 4px;
}
</style>
