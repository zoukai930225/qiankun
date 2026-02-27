<template>
  <el-select
    popper-class="eloption"
    :popper-append-to-body="true"
    v-model="dataValue"
    :placeholder="placeholder || '请选择'"
    :multiple="multiple"
    collapse-tags
    collapse-tags-tooltip
    @change="valueChange"
    :disabled="disabled"
    filterable
    clearable
    @focus="focusOn"
    :suffix-icon="suffixIcon"
  >
    <el-option
      v-for="item in options"
      :key="item.userId"
      :label="item.realName"
      :value="item.userId"
      :disabled="showDisable && item.disabled"
    >
      <div class="peopleOption">
        <div class="left-wapper">
          <img class="img" :src="item?.avatarOrigin || avatarLogo" alt="" />
          <div class="info">
            <span class="text name">{{ item.realName }}</span>
            <span class="text desc">{{ item.dept || '--' }}</span>
          </div>
        </div>
      </div>
    </el-option>
    <template #label="{ label, value }" v-if="showAvatarLable">
      <div class="row-center">
        <el-avatar :src="getLableAvater(value)" :size="20" class="ava" />
        {{ label }}
      </div>
    </template>
  </el-select>
</template>

<script lang="ts">
export default { name: 'SelectUser' }
</script>

<script lang="ts" setup>
import avatarLogo from '@/assets/imgs/avatar_logo.png'
import { getUserList } from '@/api/system/user'
import { cloneDeep } from 'lodash-es'
const props = defineProps({
  placeholder: { type: String, reuqired: false, default: '请选择' },
  defaultValue: { type: [String, Number], reuqired: false, default: '' },
  multiple: { type: Boolean, reuqired: false, default: true },
  role: { type: String, reuqired: false, default: '' },
  //单纯用来回显的options - 可能最新列表选择已没有
  feedBackOptions: { type: Array as PropType<Array<any>>, reuqired: false, default: () => [] },
  showDisable: { type: Boolean, reuqired: false, default: false },
  showAvatarLable: { type: Boolean, reuqired: false, default: false },
  disabled: { type: Boolean, reuqired: false, default: false },
  suffixIcon: { type: String, reuqired: false, default: 'ArrowDown' },
  // 返回用户名、头像、id
  needUserInfo: { type: Boolean, required: false, default: false },
  // 有初始值时自动加载数据（用于路由跳转回显）
  autoLoadOnInit: { type: Boolean, required: false, default: false },
  // 自动选择第一个（当当前值不在选项中时）
  autoSelectFirst: { type: Boolean, required: false, default: false }
})

const dataValue: any = defineModel('value'),
  options = ref<Array<any>>([])

const emit = defineEmits(['change'])

const valueChange = () => {
  setTimeout(() => {
    if (props.needUserInfo) {
      if (props.multiple) {
        const userList = dataValue.value.map((userId: string) =>
          options.value.find((user: any) => user.userId === userId)
        )
        emit('change', userList)
      } else {
        const userInfo = options.value.find((user: any) => user.userId === dataValue.value)
        emit('change', userInfo)
      }
    } else {
      emit('change', dataValue.value)
    }
  }, 0)
}

const resetDate = () => {
  dataValue.value = null
}

const focusOn = () => {
  JSON.stringify(props.feedBackOptions) === JSON.stringify(options.value) && getDataList(props.role)
}

const getDataList = (role: string) => {
  getUserList({ page: 1, pageSize: 9999, role }).then((res: any) => {
    if (res?.records?.length) {
      const userIds = res.records.map((item) => item.userId)
      console.log(props.feedBackOptions, 'props.feedBackOptions')
      const backOptions = props.feedBackOptions.filter((item) => !userIds.includes(item.userId))
      backOptions.map((item) => (item.disabled = true))
      options.value = [...res.records, ...backOptions]

      // 自动选择第一个逻辑
      if (props.autoSelectFirst) {
        nextTick(() => {
          // 如果当前值为空，或者当前值不在选项中，则选择第一个
          const currentValue = dataValue.value
          const hasCurrentValue = options.value.find((item: any) => item.userId === currentValue)
          console.log(currentValue, hasCurrentValue, 'currentValue, hasCurrentValue')
          if (!currentValue || !hasCurrentValue) {
            if (options.value.length > 0) {
              const firstUser = options.value[0]
              dataValue.value = firstUser.userId

              // 触发 change 事件
              if (props.needUserInfo) {
                emit('change', firstUser)
              } else {
                emit('change', firstUser.userId)
              }
            }
          }
          if (hasCurrentValue) {
            dataValue.value = currentValue
            if (props.needUserInfo) {
              emit('change', hasCurrentValue)
            } else {
              emit('change', hasCurrentValue.userId)
            }
          }
        })
      }
    }
  })
}

const getLableAvater = (userId: string) => {
  return options.value.find((item) => item.userId === userId)?.avatarOrigin || avatarLogo
}

watch(
  () => props.feedBackOptions,
  (val) => {
    if (val.length === 0) return
    options.value = cloneDeep(val)
  },
  { immediate: true }
)

// 如果设置了 autoLoadOnInit，在组件挂载时检查是否需要自动加载
onMounted(() => {
  if (props.autoLoadOnInit && props.role) {
    nextTick(() => {
      // 有初始值但 options 为空时，自动加载数据
      if (options.value.length === 0) {
        getDataList(props.role)
      }
    })
  }
})

defineExpose({ resetDate, dataValue, focusOn })
</script>
<style scoped lang="scss">
.peopleOption {
  padding: 5px 12px;
  width: calc(100% - 24px);
  height: calc(50px - 10px);
  line-height: calc(50px - 10px);

  .left-wapper {
    display: flex;
    align-items: center;
    height: 100%;
    line-height: 100%;
  }

  .img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }

  .info {
    display: inline-flex;
    flex-direction: column;
    margin-left: 14px;

    .text {
      height: 20px;
      line-height: 20px;
    }

    .name {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      color: #333333;
    }

    .desc {
      font-size: 12px;
      color: #999999;
    }
  }
}

.eloption .el-select-dropdown__wrap .el-select-dropdown__item {
  height: 50px !important;
  line-height: 50px;
  padding: 0px;
  width: 100%;
}

.ava {
  margin-right: 10px;
}
</style>
