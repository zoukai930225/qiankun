<!--
 * @Date: 2024-12-05 13:54:45
-->
<template>
  <div>
    <el-drawer v-model="isVisible" :with-header="false" size="50%" @close="reset">
      <div class="drawer-wapper">
        <div class="content-wapper">
          <div class="flex-row title-wapper">
            <div class="title">{{ currentId ? `编辑` : '新增' }}属性</div>
            <img
              src="@/assets/imgs/system/fieldManageConfig/close.png"
              alt=""
              class="close"
              @click="reset"
            />
          </div>
          <!--  -->
          <ContentWrap>
            <div class="form-wapper">
              <el-form
                :model="form"
                ref="queryFormRef"
                :rules="rules"
                @submit.prevent
                label-width="90px"
                label-position="left"
              >
                <el-form-item label="属性名称" prop="name">
                  <el-input
                    class="searchFormItemWidth"
                    v-model="form.name"
                    placeholder="请输入属性名称"
                    clearable
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="映射字段 " prop="code">
                  <el-input
                    class="searchFormItemWidth"
                    v-model="form.code"
                    placeholder="请输入映射字段 "
                    clearable
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="所属模块 " prop="moduleId">
                  <Menuitem v-model="form.moduleId" />
                </el-form-item>
                <el-form-item label="数据类型 " prop="type">
                  <el-select
                    v-model="form.type"
                    placeholder="请选择数据类型"
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in fieldList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>

                <!-- 根据数据类型设置 -->
                <el-form-item label="选项设置 " prop="name" v-if="showOptions">
                  <div class="selectAre">
                    <div>
                      <el-radio-group v-model="currentActicity">
                        <el-radio :value="1">自定义</el-radio>
                        <el-radio :value="2">从基础配置中选取</el-radio>
                      </el-radio-group>
                    </div>
                    <!-- 配置 -->
                    <div class="config-item-wapper" v-if="currentActicity === 1">
                      <div
                        class="config-item flex-row"
                        v-for="(item, index) in selectList"
                        :key="item"
                      >
                        <el-form class="dialogForm" :model="item">
                          <el-form-item label="" prop="name">
                            <img
                              src="@/assets/imgs/system/fieldManageConfig/select-more.png"
                              class="select-more"
                            />
                            <el-input
                              :key="index"
                              placeholder=""
                              v-model="item.value"
                              class="select-item"
                              style="width: 200px"
                            />
                            <div class="select-del" @click="delSelectItem(index)">删除</div>
                          </el-form-item></el-form
                        >
                      </div>
                      <div class="add-select" @click="addSelect">
                        <img
                          src="@/assets/imgs/system/fieldManageConfig/add.png"
                          alt=""
                          class="add-btn"
                        />
                        <div class="add-text">添加选项</div>
                      </div>
                    </div>
                    <!-- 对应字段 -->
                    <div v-if="currentActicity === 2">
                      <el-form-item label="对应配置项 " prop="dictCode">
                        <el-cascader
                          v-model="form.dictCode"
                          :options="dicList"
                          :props="customProps"
                          placeholder="请选择"
                          clearable
                          filterable
                        />
                      </el-form-item>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="属性默认值" prop="defaultValue">
                  <el-input
                    class="searchFormItemWidth"
                    v-model="form.defaultValue"
                    placeholder="请输入属性默认值"
                    clearable
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="最大长度" prop="maxLength">
                  <el-input
                    class="searchFormItemWidth"
                    v-model="form.maxLength"
                    placeholder="请输入最大长度"
                    clearable
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="提示语" prop="placeholder">
                  <el-input
                    class="searchFormItemWidth"
                    v-model="form.placeholder"
                    placeholder="请输入提示语"
                    clearable
                    style="width: 100%"
                  />
                </el-form-item>
              </el-form>
            </div>
          </ContentWrap>
          <div class="btn-wapper">
            <el-button>取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { useDragTableRows } from './utils'
import { createBasicAttribute, getBasicAttributeById } from '@/api/system/fieldManageConfig/index'
import Menuitem from './Menuitem.vue'
import { fieldList } from './utils'
import { isArray } from 'lodash-es'
const { rowDrop, stopDrop } = useDragTableRows('.form-wapper .config-item-wapper', '.select-more')
const message = useMessage() // 消息弹窗
const isVisible = ref(false)

const rules = ref({
  name: [{ required: true, message: '属性名称是必填项', trigger: 'blur' }],
  code: [{ required: true, message: '映射字段是必填项', trigger: 'blur' }],
  moduleId: [{ required: true, message: '所属模块是必填项', trigger: 'change' }]
})

defineProps({
  dicList: {
    type: Array as PropType<any[]>,
    default: () => []
  }
})

const currentId = ref()
const open = async (id) => {
  isVisible.value = true
  currentId.value = id
  if (id) {
    const res = await getBasicAttributeById(id)
    console.log(res, 'getBasicAttributeById')
    form.value = {
      ...res
    }
    console.log(form.value, 'form.value')
    selectList.value = res.options || []
    if (res.dictCode) {
      currentActicity.value = 2
    }
  }
  // nextTick(() => {
  //   rowDrop(handleSort)
  // })

  setTimeout(() => {
    rowDrop(handleSort)
    stopDrop(false)
  }, 30)
}
const currentActicity = ref(1)
const customProps = {
  label: 'name',
  value: 'id',
  children: 'children'
  // checkStrictly: true
}

// 拖拽排序
const handleSort = async (params) => {
  const currRow = selectList.value.splice(params.oldIndex, 1)[0]
  selectList.value.splice(params.newIndex, 0, currRow)
  ElMessage.success('操作成功')
}

const form = ref({
  name: undefined, //属性名称
  code: undefined, //映射字段
  moduleId: undefined, //模块主键
  type: undefined, //属性类型 0-文本；1-数字；2-单选；3-多选；4-日期；5-日期时间；6-开关
  defaultValue: undefined, //属性默认值
  maxLength: undefined, //属性值最大长度
  placeholder: undefined, //提示语
  id: undefined,
  dictCode: undefined
})

const showOptions = computed(() => {
  return form.value.type === 2 || form.value.type === 3
})

const save = async () => {
  try {
    if (!queryFormRef) return
    const valid = await queryFormRef.value.validate()
    if (!valid) return

    const options =
      (showOptions.value &&
        selectList.value.map((item, index) => {
          return {
            value: item.value,
            code: index
          }
        })) ||
      undefined

    const data = {
      ...form.value,
      moduleId: isArray(form.value.moduleId)
        ? // @ts-ignore
          form.value.moduleId[form.value.moduleId.length - 1]
        : form.value.moduleId,
      options: selectList.value.length ? options : undefined,
      dictCode: form.value.dictCode ? form.value.dictCode[0] : undefined
    }

    if (currentActicity.value == 1) {
      data.dictCode = undefined
    }
    if (currentActicity.value == 2) {
      data.options = undefined
    }

    await createBasicAttribute(data)
    message.success('操作成功')
    emit('success')
    reset()
  } catch (error) {}
}
const queryFormRef = ref()

const selectList = ref([
  {
    value: '选项1'
  }
])

const reset = () => {
  isVisible.value = false
  currentActicity.value = 1
  selectList.value = [
    {
      value: '选项1'
    }
  ]
  form.value = {
    name: undefined, //属性名称
    code: undefined, //映射字段
    moduleId: undefined, //模块主键
    type: undefined, //属性类型 0-文本；1-数字；2-单选；3-多选；4-日期；5-日期时间；6-开关
    defaultValue: undefined, //属性默认值
    maxLength: undefined, //属性值最大长度
    placeholder: undefined, //提示语
    id: undefined,
    dictCode: undefined
  }
}

// 增加选项
const addSelect = () => {
  selectList.value.push({
    value: `选项${selectList.value?.length + 1}`
  })
}

// 删除
const delSelectItem = (index) => {
  selectList.value.splice(index, 1)
}

const emit = defineEmits(['cancle', 'success'])

defineExpose({ open, close })
</script>

<style lang="scss" scoped>
:deep(.el-drawer__body){
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

.drawer-wapper {
  min-width: 700px;
  background: #f6f6f6;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
}

.title-wapper {
  justify-content: space-between;
  width: 100%;
  .close {
    width: 23px;
    height: 23px;
    cursor: pointer;
  }
  .title {
    font-size: 14px;
    color: #333333;
    font-weight: 500;
  }
}
.form-wapper {
  margin-top: 18px;
}

.selectAre {
  width: 100%;
  min-height: 200px;
  background: #f7f8fa;
  border-radius: 4px;
  padding: 16px;
  box-sizing: border-box;
}
.config-item-wapper {
  .config-item {
    align-items: center;
    background: white;
    display: flex;
    flex-direction: row;
    width: 300px;
    padding: 8px;
    box-sizing: border-box;
    margin-bottom: 12px;
  }
  .select-more {
    width: 12px;
    height: 13px;
    margin-right: 16px;
  }

  .select-del {
    color: red;
    margin-left: 16px;
    display: inline;
    cursor: pointer;
  }
  .add-select {
    cursor: pointer;
    width: 300px;
    height: 36px;
    border-radius: 4px;
    border: 1px dashed #0064ff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    justify-items: center;
    .add-btn {
      width: 12px;
      height: 12px;
      margin-right: 14px;
    }
    .add-text {
      font-weight: 400;
      font-size: 14px;
      color: #0064ff;
    }
  }
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
}
</style>
