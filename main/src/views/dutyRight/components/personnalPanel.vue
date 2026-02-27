<template>
  <div class="content tag-list" v-loading="loading">
    <div class="tag-list-left">
      <div class="left-title mr20px">
        <span class="title">负责人<span class="info">总计：共 {{ totalNums }} 位，已选 {{ checkIds.length }}
            位<el-divider direction="vertical" />当前：共 {{ allNums }} 位，已选 {{ checkNums }} 位（{{
              opType === 'add' ? '请选择要添加的负责人' : '请选择要删除的负责人' }}）</span></span>
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
          全选
        </el-checkbox>
      </div>
      <div class="row-center pt5px pb10px mr20px">
        <Menuitem @change="handleDepartChange" style="width: 220px" v-model="departId" :options="menuList" />
        <el-input v-model.trim="keyValue" style="width: 220px" placeholder="请输入名称" prefix-icon="Search" clearable
          class="ml20px" />
      </div>
      <div class="left-height" :style="`height: calc(100vh - ${topHeight}px)`">
        <el-checkbox-group v-model="checkIds" @change="handleChange">
          <div v-for="group in tagList" :key="group.sysDepartment.id" class="each-box">
            <div class="title-box" :class="{ 'title-box-collapse': !group.sysDepartment.show }">
              <div class="row-center">
                <img class="check-img"
                  :src="group.sysDepartment.status === 'all' ? checkedSvg : group.sysDepartment.status === 'part' ? partCheckSvg : noCheckSvg"
                  alt="" @click="checkGroups(group)" />
                <div class="tag-all-title-each">{{ getName(group) }}</div>
                <div class="check-info">已选择 {{ getGroupCheckNums(group) }}/{{ group.personRosters.length || 0 }}</div>
              </div>
              <el-icon :size="14" color="#999999" style="cursor: pointer;" @click="changeShow(group.sysDepartment.id)">
                <ArrowUp v-show="group.sysDepartment.show" />
                <ArrowDown v-show="!group.sysDepartment.show" />
              </el-icon>
            </div>
            <el-collapse-transition>
              <div class="tag-list-left-item" v-show="group.sysDepartment.show"
                :style="`grid-template-columns: repeat(${repeat}, 1fr);`">
                <div v-for="item in group.personRosters" :key="item.userId" class="row-center">
                  <el-checkbox :label="item.name" :value="item.userId" />
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </el-checkbox-group>
      </div>
    </div>
  </div>

</template>
<script lang="ts" setup>
import partCheckSvg from '@/assets/imgs/promotion/check-part.svg'
import checkedSvg from '@/assets/imgs/promotion/checked_on.svg'
import noCheckSvg from '@/assets/imgs/promotion/checked_out.svg'
import { cloneDeep } from 'lodash-es'
import Menuitem from './Menuitem.vue'
const props = defineProps({
  opType: {
    type: String as PropType<'add' | 'delete'>,
    default: 'add'
  },
  loading: {
    type: Boolean,
    default: false
  },
  repeat: {
    type: Number,
    default: 5
  },
  topHeight: {
    type: Number,
    default: 307
  },
  departmentAllList: {
    type: Array as PropType<any[]>,
    required: true
  }
})

const emits = defineEmits(['change'])
const checkIds = ref<any[]>([])
const { menuList } = inject<any>('DutyrightForm')
const selectDepartId = ref<any[]>([])
const departId = ref<any>('') // 部门id
const handleDepartChange = (value) => {
  if (value && Array.isArray(value) && value.length > 0) {
    let id = value[value.length - 1]
    const ids = [] as any[]
    searchDepartId(menuList.value, ids, id)
    selectDepartId.value = ids
    departId.value = value[value.length - 1]
  } else {
    selectDepartId.value = []
    departId.value = ''
  }
}

const searchDepartId = (attr: any[], ids: any[] = [], id: any) => {
  attr.map(item => {
    if (id === item.id) {
      ids.push(item.id)
      getAllChildrenDepartId(item, ids)
    } else if (item.children && Array.isArray(item.children) && item.children.length > 0) {
      searchDepartId(item.children, ids, id)
    }
  })
}

const getAllChildrenDepartId = (value: any, ids: any[] = []) => {
  if (value.children && Array.isArray(value.children) && value.children.length > 0) {
    value.children.map(item => {
      ids.push(item.id)
      getAllChildrenDepartId(item, ids)
    })
  }
}
const keyValue = ref('')

const tagList = computed(() => {
  let data: any = cloneDeep(props.departmentAllList)
  if (selectDepartId.value.length > 0) {
    data = props.departmentAllList.filter((item) => selectDepartId.value.includes(item.sysDepartment.id))
  }
  const res = data.map(item => item?.personRosters?.filter((each) => each.name.includes(keyValue.value)))
  const result: any = []
  data.map((item, index) => {
    if (res[index].length > 0) {
      result.push({ ...item, personRosters: res[index] })
    }
  })
  return result
})

const allNums = computed(() => tagList.value.reduce((acc, cur) => acc + cur.personRosters.length, 0))
const checkNums = computed(() => {
  let ids: any[] = []
  tagList.value.map(item => {
    ids = [...new Set([...ids, ...item.personRosters.map(item => item.userId)])]
  })
  return checkIds.value.filter(id => ids.includes(id)).length;
})
const checkGroups = (item: any) => {
  let ids = item.personRosters.map(item => item.userId);
  ids = [...new Set(ids)]
  if (item.sysDepartment.status === 'all') {
    //清除全选
    checkIds.value = checkIds.value.filter(id => !ids.includes(id))
    item.sysDepartment.status = 'none'
  } else {
    //全选
    checkIds.value = [...new Set([...checkIds.value, ...ids])]
    item.sysDepartment.status = 'all'
  }
  emits('change', checkIds.value)
}
const getGroupCheckNums = (item: any) => {
  let ids = item.personRosters.map(item => item.userId);
  ids = [...new Set(ids)]
  return checkIds.value.filter(id => ids.includes(id)).length
}
const handleCheckChange = () => {
  tagList.value.forEach(item => {
    let ids = item.personRosters.map(item => item.userId);
    ids = [...new Set(ids)]
    if (ids.every(id => checkIds.value.includes(id))) {
      item.sysDepartment.status = 'all'
    } else if (ids.some(id => checkIds.value.includes(id))) {
      item.sysDepartment.status = 'part'
    } else {
      item.sysDepartment.status = 'none'
    }
  })
}

const checkAll = ref(false)
const isIndeterminate = ref(false)

const handleCheckAllChange = (value: boolean) => {
  let ids: any[] = []
  tagList.value.map(item => {
    ids = [...new Set([...ids, ...item.personRosters.map(item => item.userId)])]
  })
  if (!value) {
    checkIds.value = checkIds.value.filter(id => !ids.includes(id))
  } else {
    checkIds.value = [...new Set([...checkIds.value, ...ids])]
  }
  emits('change', checkIds.value)
}

const changeShow = (id: string) => {
  props.departmentAllList.map(item => {
    if (item.sysDepartment.id === id) {
      item.sysDepartment.show = !item.sysDepartment.show
    }
  })
}
const handleChange = (val: any[]) => {
  emits('change', val)
}

const setCheckIds = (ids: any[]) => {
  checkIds.value = ids
}

const totalNums = computed(() => props.departmentAllList.reduce((acc, cur) => acc + cur.personRosters.length, 0))

const getName = (row: any) => {
  let names = '', companyName = ''
  if (row?.sysDepartment?.name) {
    names = row.sysDepartment.name
  }
  if (row?.companyName) {
    companyName = row.companyName
  }
  if (companyName) {
    return names ? `${names}-${companyName}` : companyName
  }
  return names || '-'
}

watch([tagList, checkIds], () => {
  checkAll.value = checkNums.value > 0 && checkNums.value === allNums.value;
  isIndeterminate.value = checkNums.value > 0 && checkNums.value < allNums.value;
  handleCheckChange()
})

defineExpose({
  setCheckIds
})
</script>
<style lang="scss" scoped>
@mixin flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

* {
  --el-color-primary: #0064ff;
}

.content {
  width: 100%;
}

.flex-space {
  @include flex-row;
  justify-content: space-between;
}

.flex-row {
  @include flex-row;
}


.tag-list {
  font-size: 14px;
  color: #333;

  &-left-item {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 5px 10px;
    padding: 5px 15px;

    :deep(.el-checkbox__label) {
      color: #333;
      font-weight: normal;
      max-width: 70px;
      word-break: break-all;
      white-space: pre-line;
      line-height: 17px;
    }
  }

  &-left {
    .left-title {
      @include flex-row;
      justify-content: space-between;
      border-top: 1px solid #E5E5E5;
      padding-top: 10px;

      .title {
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        color: #333333;
      }

    }
  }

  &-left {
    width: 100%;
    border-radius: 8px;
    background-color: #fff;

    .left-title {

      .info {
        font-size: 12px;
        /* 文字/二级 */
        color: #666666;
        margin-left: 10px;
        font-weight: normal;
      }
    }

    .each-box {
      border: 1px solid #E5E5E5;
      margin-bottom: 10px;
      width: calc(100% - 20px);

      .title-box {
        height: 34px;
        border-bottom: 1px solid #E5E5E5;
        background-color: #F6F7F9;
        @include flex-row;
        justify-content: space-between;
        padding: 0 15px;

        &-collapse {
          border-bottom: none;
        }
      }
    }

    // .each-box:last-child {
    //   margin-bottom: 10px;
    // }

    .check-info {
      font-size: 12px;
      line-height: 20px;
      color: #666666;
      margin-left: 20px;
    }
  }

  .left-height {
    overflow-y: auto;
    height: calc(100vh - 293px);
  }

  :deep(.el-checkbox){
    height: auto;
  }
}


.tag-all-title {
  font-size: 14px;
  color: #000;
  font-weight: bold;

  &-sub {
    font-size: 14px;
    color: #333;
    margin-bottom: 10px;
  }

  &-each {
    color: #333;
    font-weight: 500;
    line-height: 20px;
    font-size: 14px;
  }
}

.item-img {
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin-right: 10px;
}

.check-img {
  width: 16px;
  height: 16px;
  margin-right: 10px;
  cursor: pointer;
}
</style>